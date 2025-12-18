(function() {
    if (document.getElementById('af-container')) return;

    // 1. DATA INITIALIZATION
    let accounts = JSON.parse(localStorage.getItem('af_accounts') || '[]');
    let activeIdx = localStorage.getItem('af_active_idx');
    let isMinimized = true;

    // 2. STYLE CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #af-container { position: fixed; bottom: 20px; right: 20px; z-index: 99999; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        
        #af-bubble { 
            width: 55px; height: 55px; background: linear-gradient(135deg, #007bff, #0056b3); 
            border-radius: 50%; display: flex; align-items: center; justify-content: center; 
            cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: 0.3s; color: white; font-size: 24px;
        }
        #af-bubble:hover { transform: scale(1.1) rotate(10deg); }

        #af-manager {
            position: absolute; bottom: 70px; right: 0; width: 300px;
            background: #ffffff; border-radius: 15px; border: 1px solid #e0e0e0;
            box-shadow: 0 10px 40px rgba(0,0,0,0.25); padding: 18px;
            display: none; flex-direction: column; gap: 10px;
            max-height: 80vh; overflow-y: auto;
        }
        .show { display: flex !important; animation: slideUp 0.3s ease; }
        
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .af-input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 13px; }
        .af-select { width: 100%; padding: 12px; border: 2px solid #28a745; border-radius: 8px; font-weight: bold; cursor: pointer; background: #f0fff0; color: #28a745; }
        .af-btn { border: none; padding: 11px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s; font-size: 13px; width: 100%; }
        .btn-add { background: #007bff; color: white; }
        .btn-edit { background: #ffc107; color: #212529; display: none; }
        .btn-del { background: #f8f9fa; color: #dc3545; border: 1px solid #dc3545; margin-top: 5px; }
        
        #af-status { font-size: 12px; text-align: center; color: #666; padding: 5px; border-radius: 5px; background: #f8f9fa; }
    `;
    document.head.appendChild(style);

    // 3. HTML STRUCTURE
    const container = document.createElement('div');
    container.id = 'af-container';
    container.innerHTML = `
        <div id="af-manager">
            <div style="font-weight:bold; color:#007bff; text-align:center; font-size: 16px;">🚀 AESEL BOT V8</div>
            <input type="text" id="in-nama" class="af-input" placeholder="Nama Akun">
            <input type="text" id="in-id" class="af-input" placeholder="Prometric ID (JP...)">
            <input type="password" id="in-pass" class="af-input" placeholder="Password">
            <button class="af-btn btn-add" id="btn-save">Simpan Akun Baru</button>
            <button class="af-btn btn-edit" id="btn-update">Update Akun</button>
            <select id="acc-dropdown" class="af-select"></select>
            <button class="af-btn btn-del" id="btn-del">Hapus Akun Ini</button>
            <div id="af-status">Status: Standby</div>
        </div>
        <div id="af-bubble">🚀</div>
    `;
    document.body.appendChild(container);

    const bubble = document.getElementById('af-bubble');
    const manager = document.getElementById('af-manager');
    const dropdown = document.getElementById('acc-dropdown');
    const statusBox = document.getElementById('af-status');

    // 4. FUNCTIONS
    const toggleManager = (forceHide = false) => {
        if (forceHide) isMinimized = true;
        else isMinimized = !isMinimized;
        
        manager.classList.toggle('show', !isMinimized);
        bubble.innerHTML = isMinimized ? '🚀' : '✖';
        bubble.style.background = isMinimized ? 'linear-gradient(135deg, #007bff, #0056b3)' : '#6c757d';
    };

    const saveToLocal = () => {
        localStorage.setItem('af_accounts', JSON.stringify(accounts));
        localStorage.setItem('af_active_idx', activeIdx);
    };

    const renderDropdown = () => {
        dropdown.innerHTML = '<option value="">-- Pilih Akun Aktif --</option>' + 
            accounts.map((acc, i) => `<option value="${i}" ${activeIdx == i ? 'selected' : ''}>${acc.nama}</option>`).join('');
    };

    const updateFormState = () => {
        const inNama = document.getElementById('in-nama'), inId = document.getElementById('in-id'), inPass = document.getElementById('in-pass'),
              btnSave = document.getElementById('btn-save'), btnUpdate = document.getElementById('btn-update');
        
        if (activeIdx !== null && accounts[activeIdx]) {
            const acc = accounts[activeIdx];
            inNama.value = acc.nama; inId.value = acc.id; inPass.value = acc.pass;
            btnSave.style.display = 'none'; btnUpdate.style.display = 'block';
            statusBox.innerText = `✅ Aktif: ${acc.nama}`;
        } else {
            inNama.value = ''; inId.value = ''; inPass.value = '';
            btnSave.style.display = 'block'; btnUpdate.style.display = 'none';
            statusBox.innerText = 'Status: Standby';
        }
    };

    // 5. EVENT LISTENERS
    bubble.onclick = () => toggleManager();

    dropdown.onchange = (e) => {
        activeIdx = e.target.value !== "" ? e.target.value : null;
        saveToLocal();
        updateFormState();
        
        // --- FITUR AUTO-HIDE ---
        if (activeIdx !== null) {
            setTimeout(() => {
                toggleManager(true); // Tutup otomatis setelah memilih
            }, 600); // Jeda sebentar supaya user melihat status berubah
        }
    };

    document.getElementById('btn-save').onclick = () => {
        const n = document.getElementById('in-nama').value, i = document.getElementById('in-id').value, p = document.getElementById('in-pass').value;
        if (n && i && p) {
            accounts.push({ nama: n, id: i, pass: p });
            activeIdx = accounts.length - 1; // Otomatis aktifkan akun baru
            saveToLocal();
            renderDropdown();
            updateFormState();
            setTimeout(() => toggleManager(true), 800); // Auto-hide
        }
    };

    document.getElementById('btn-update').onclick = () => {
        if (activeIdx !== null) {
            accounts[activeIdx] = { 
                nama: document.getElementById('in-nama').value, 
                id: document.getElementById('in-id').value, 
                pass: document.getElementById('in-pass').value 
            };
            saveToLocal();
            renderDropdown();
            alert("Data Berhasil Diperbarui!");
            toggleManager(true); // Auto-hide
        }
    };

    document.getElementById('btn-del').onclick = () => {
        if (activeIdx !== null && confirm("Hapus akun ini?")) {
            accounts.splice(activeIdx, 1);
            activeIdx = null;
            saveToLocal();
            renderDropdown();
            updateFormState();
        }
    };

    // INIT
    renderDropdown();
    updateFormState();
})();
