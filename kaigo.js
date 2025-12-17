(function() {
    // 1. STYLE CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #af-manager {
            position: fixed; top: 10px; right: 10px; z-index: 10000;
            background: #fff; border: 2px solid #007bff; padding: 15px;
            border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            font-family: sans-serif; width: 300px; max-height: 90vh; overflow-y: auto;
        }
        .af-title { font-weight: bold; font-size: 16px; color: #007bff; display: block; text-align: center; margin-bottom: 15px; }
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

    // 2. LOGIKA DATA
    let accounts = JSON.parse(localStorage.getItem('af_accounts') || '[]');
    let currentEditIdx = null;
    let monitorInterval = null;

    const save = () => localStorage.setItem('af_accounts', JSON.stringify(accounts));

    // 3. RENDER UI
    const container = document.createElement('div');
    container.id = 'af-manager';
    document.body.appendChild(container);

    const render = () => {
        container.innerHTML = `
            <span class="af-title">🚀 Auto Login Pro v4</span>
            
            <input type="text" id="in-nama" class="af-input" placeholder="Nama Lengkap">
            <input type="text" id="in-id" class="af-input" placeholder="ID (JP...)">
            <input type="password" id="in-pass" class="af-input" placeholder="Password">
            
            <button class="af-btn btn-add" id="btn-save">Simpan Akun Baru</button>
            <button class="af-btn btn-edit" id="btn-update">Update Akun Terpilih</button>

            <select id="acc-dropdown" class="af-select">
                <option value="">-- Pilih Akun & Otomasi --</option>
                ${accounts.map((acc, i) => `<option value="${i}">${acc.nama} (${acc.id})</option>`).join('')}
            </select>
            
            <button class="af-btn btn-del" id="btn-del">Hapus Akun Terpilih</button>

            <div id="af-status">Status: Menunggu Akun...</div>

            <div class="af-sync-group">
                <div class="sync-row">
                    <button class="af-btn btn-export" id="btn-exp">Export Terpilih</button>
                    <button class="af-btn btn-import" id="btn-imp">Import Banyak</button>
                </div>
                <input type="file" id="file-input" accept=".json" multiple>
            </div>
        `;

        const inNama = document.getElementById('in-nama');
        const inId = document.getElementById('in-id');
        const inPass = document.getElementById('in-pass');
        const btnSave = document.getElementById('btn-save');
        const btnUpdate = document.getElementById('btn-update');
        const dropdown = document.getElementById('acc-dropdown');
        const statusBox = document.getElementById('af-status');

        // FUNGSI UTAMA: OTOMASI OTOMATIS
        dropdown.onchange = () => {
            const idx = dropdown.value;
            if (monitorInterval) clearInterval(monitorInterval); // Stop otomasi sebelumnya

            if (idx !== "") {
                const acc = accounts[idx];
                
                // Isi form input (untuk edit)
                inNama.value = acc.nama;
                inId.value = acc.id;
                inPass.value = acc.pass;
                btnSave.style.display = "none";
                btnUpdate.style.display = "block";
                currentEditIdx = idx;

                // Mulai Otomasi Langsung
                statusBox.innerText = "⏳ Siaga: Kerjakan CAPTCHA...";
                statusBox.style.color = "#fd7e14";
                statusBox.style.background = "#fff3cd";

                monitorInterval = setInterval(() => {
                    const idBox = document.getElementById('inputPrometricID');
                    const passBox = document.getElementById('inputPassword');
                    const loginBtn = document.querySelector('button[name="B1"]');

                    if (idBox) idBox.value = acc.id;
                    if (passBox) passBox.value = acc.pass;

                    // Jika tombol aktif (berarti CAPTCHA selesai)
                    if (loginBtn && !loginBtn.disabled && !loginBtn.classList.contains('disabled')) {
                        clearInterval(monitorInterval);
                        statusBox.innerText = "🚀 LOGIN DIEKSEKUSI!";
                        statusBox.style.color = "#155724";
                        statusBox.style.background = "#d4edda";

                        if (typeof check === "function") {
                            check();
                        } else {
                            loginBtn.click();
                        }
                    }
                }, 500);
            } else {
                inNama.value = ""; inId.value = ""; inPass.value = "";
                btnSave.style.display = "block";
                btnUpdate.style.display = "none";
                statusBox.innerText = "Status: Menunggu Akun...";
                statusBox.style.background = "#f8f9fa";
                statusBox.style.color = "#555";
                currentEditIdx = null;
            }
        };

        // Event: Update Akun
        btnUpdate.onclick = () => {
            if (currentEditIdx !== null) {
                accounts[currentEditIdx] = { nama: inNama.value, id: inId.value, pass: inPass.value };
                save(); render();
                alert("Akun diperbarui!");
            }
        };

        // Event: Simpan Baru
        btnSave.onclick = () => {
            if (inNama.value && inId.value && inPass.value) {
                accounts.push({ nama: inNama.value, id: inId.value, pass: inPass.value });
                save(); render();
            }
        };

        // Event: Hapus
        document.getElementById('btn-del').onclick = () => {
            const idx = dropdown.value;
            if (idx !== "") {
                accounts.splice(idx, 1);
                save(); render();
            }
        };

        // Export/Import Tetap Sama
        document.getElementById('btn-exp').onclick = () => {
            const idx = dropdown.value;
            if (idx === "") return alert("Pilih akun!");
            const blob = new Blob([JSON.stringify(accounts[idx], null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `Account_${accounts[idx].nama.replace(/\s+/g, '_')}.json`;
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
    };

    render();
})();
