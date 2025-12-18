(function() {
    const currentUrl = window.location.href;
    const isPrometricReserve = currentUrl.includes("j6.prometric-jp.com/Reserve/");

    // 1. LOGIKA DATA & POSISI
    let accounts = JSON.parse(localStorage.getItem('af_accounts') || '[]');
    let activeIdx = localStorage.getItem('af_active_idx');
    let pos = JSON.parse(localStorage.getItem('af_ui_pos') || '{"top":"10px","right":"10px"}');

    const save = () => {
        localStorage.setItem('af_accounts', JSON.stringify(accounts));
        localStorage.setItem('af_active_idx', activeIdx);
    };

    // 2. STYLE CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #af-manager {
            position: fixed; top: ${pos.top}; right: ${pos.right}; left: ${pos.left || 'auto'};
            z-index: 10000; background: #fff; border: 2px solid #007bff; padding: 15px;
            border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            font-family: sans-serif; width: 300px; max-height: 90vh; overflow-y: auto;
            user-select: none;
        }
        .af-header { cursor: move; background: #f8f9fa; margin: -15px -15px 15px -15px; padding: 10px; border-radius: 10px 10px 0 0; border-bottom: 1px solid #eee; }
        .af-title { font-weight: bold; font-size: 16px; color: #007bff; display: block; text-align: center; }
        .btn-link-kaigo { width: 100%; background: #6f42c1; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-bottom: 15px; display: block; text-align: center; text-decoration: none; font-size: 13px; }
        .af-input { width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        .af-select { width: 100%; padding: 10px; margin-bottom: 10px; border: 2px solid #28a745; border-radius: 6px; font-weight: bold; cursor: pointer; background: #f0fff0; }
        .af-btn { border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .btn-add { width: 100%; background: #007bff; color: white; margin-bottom: 10px; }
        .btn-edit { width: 100%; background: #ffc107; color: #212529; margin-bottom: 10px; display: none; }
        .btn-del { width: 100%; background: #dc3545; color: white; font-size: 11px; margin-top: 5px; padding: 5px; }
        .af-sync-group { display: flex; flex-direction: column; gap: 5px; margin-top: 10px; border-top: 1px solid #eee; padding-top: 10px; }
        .sync-row { display: flex; gap: 5px; }
        .btn-export { flex: 1; background: #6c757d; color: white; font-size: 11px; }
        .btn-import { flex: 1; background: #17a2b8; color: white; font-size: 11px; }
        #af-status { font-size: 12px; text-align: center; margin-top: 10px; padding: 8px; border-radius: 6px; background: #f8f9fa; font-weight: bold; }
        input[type="file"] { display: none; }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'af-manager';
    document.body.appendChild(container);

    const render = () => {
        container.innerHTML = `
            <div class="af-header" id="af-drag">
                <span class="af-title">🚀 Auto Login Pro v7</span>
            </div>
            <a href="https://j6.prometric-jp.com/Reserve/Login?CN=JH&LC=ID" target="_blank" class="btn-link-kaigo">🌐 Buka Login Kaigo (ID)</a>
            <input type="text" id="in-nama" class="af-input" placeholder="Nama Lengkap">
            <input type="text" id="in-id" class="af-input" placeholder="ID (JP...)">
            <input type="password" id="in-pass" class="af-input" placeholder="Password">
            <button class="af-btn btn-add" id="btn-save">Simpan Akun Baru</button>
            <button class="af-btn btn-edit" id="btn-update">Update Akun Terpilih</button>
            <select id="acc-dropdown" class="af-select">
                <option value="">-- Pilih Akun Aktif --</option>
                ${accounts.map((acc, i) => `<option value="${i}" ${activeIdx == i ? 'selected' : ''}>${acc.nama}</option>`).join('')}
            </select>
            <button class="af-btn btn-del" id="btn-del">Hapus Akun Terpilih</button>
            <div id="af-status">Status: Standby</div>
            <div class="af-sync-group">
                <div class="sync-row"><button class="af-btn btn-export" id="btn-exp">Export</button><button class="af-btn btn-import" id="btn-imp">Import Banyak</button></div>
                <input type="file" id="file-input" accept=".json" multiple>
            </div>
        `;

        // --- LOGIKA DRAG & DROP ---
        const dragItem = document.getElementById("af-drag");
        let active = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

        const savedPos = JSON.parse(localStorage.getItem('af_ui_pos_offset') || '{"x":0,"y":0}');
        xOffset = savedPos.x; yOffset = savedPos.y;
        container.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;

        dragItem.addEventListener("mousedown", dragStart);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("mousemove", drag);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === dragItem || dragItem.contains(e.target)) active = true;
        }
        function dragEnd() {
            active = false;
            localStorage.setItem('af_ui_pos_offset', JSON.stringify({ x: xOffset, y: yOffset }));
        }
        function drag(e) {
            if (active) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                container.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        }

        // --- LOGIKA FORM & EVENT ---
        const inNama = document.getElementById('in-nama'), inId = document.getElementById('in-id'), inPass = document.getElementById('in-pass'),
              btnSave = document.getElementById('btn-save'), btnUpdate = document.getElementById('btn-update'), 
              dropdown = document.getElementById('acc-dropdown'), statusBox = document.getElementById('af-status');

        // Fungsi Helper untuk Update Tampilan Form
        const updateFormState = (idx) => {
            if (idx !== null && accounts[idx]) {
                const acc = accounts[idx];
                inNama.value = acc.nama; inId.value = acc.id; inPass.value = acc.pass;
                btnSave.style.display = "none"; btnUpdate.style.display = "block";
                statusBox.innerText = "✅ Akun [" + acc.nama + "] Aktif";
            } else {
                inNama.value = ""; inId.value = ""; inPass.value = "";
                btnSave.style.display = "block"; btnUpdate.style.display = "none";
                statusBox.innerText = "Status: Standby";
            }
        };

        dropdown.onchange = () => {
            activeIdx = dropdown.value !== "" ? dropdown.value : null; 
            save();
            updateFormState(activeIdx);
        };

        document.getElementById('btn-update').onclick = () => {
            if (activeIdx !== null) {
                accounts[activeIdx] = { nama: inNama.value, id: inId.value, pass: inPass.value };
                save(); render(); alert("Diperbarui!");
            }
        };

        document.getElementById('btn-save').onclick = () => {
            if (inNama.value && inId.value && inPass.value) {
                accounts.push({ nama: inNama.value, id: inId.value, pass: inPass.value });
                save(); render();
            }
        };

        document.getElementById('btn-del').onclick = () => {
            if (dropdown.value !== "") { accounts.splice(dropdown.value, 1); activeIdx = null; save(); render(); }
        };

        document.getElementById('btn-exp').onclick = () => {
            if (dropdown.value === "") return alert("Pilih akun!");
            const blob = new Blob([JSON.stringify(accounts[dropdown.value], null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${accounts[dropdown.value].nama.replace(/\s+/g, '_')}.json`;
            a.click();
        };

        document.getElementById('btn-imp').onclick = () => document.getElementById('file-input').click();
        document.getElementById('file-input').onchange = async (e) => {
            for (let file of e.target.files) {
                try {
                    const data = JSON.parse(await file.text());
                    accounts = [...accounts, ...(Array.isArray(data) ? data : [data])];
                } catch (err) {}
            }
            save(); render();
        };

        // --- INIT: JALANKAN SAAT RENDER PERTAMA KALI ---
        // Ini bagian penting yang sebelumnya hilang. 
        // Memastikan form terisi sesuai activeIdx saat halaman dibuka.
        if (activeIdx !== null && accounts[activeIdx]) {
            updateFormState(activeIdx);
        }
    };

    render();
})();
