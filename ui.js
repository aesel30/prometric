(function() {
    if (document.getElementById('af-container')) return;

    // 1. DATA & STATE
    let accounts = JSON.parse(localStorage.getItem('af_accounts') || '[]');
    let activeIdx = localStorage.getItem('af_active_idx');
    let isMinimized = true;

    // 2. CSS STYLE
    const style = document.createElement('style');
    style.innerHTML = `
        #af-container { position: fixed; bottom: 20px; right: 20px; z-index: 999999; font-family: sans-serif; }
        #af-bubble { 
            width: 55px; height: 55px; background: linear-gradient(135deg, #007bff, #0056b3); 
            border-radius: 50%; display: flex; align-items: center; justify-content: center; 
            cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: 0.3s; color: white; font-size: 24px;
        }
        #af-manager {
            position: absolute; bottom: 70px; right: 0; width: 300px;
            background: #fff; border-radius: 12px; border: 2px solid #007bff;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2); padding: 15px;
            display: none; flex-direction: column; gap: 8px; max-height: 85vh; overflow-y: auto;
        }
        .show { display: flex !important; }
        .af-title { font-weight: bold; color: #007bff; text-align: center; margin-bottom: 5px; }
        .btn-link-kaigo { width: 100%; background: #6f42c1; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; text-align: center; text-decoration: none; font-size: 13px; margin-bottom: 5px; box-sizing: border-box; display: block; }
        .af-input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        .af-select { width: 100%; padding: 10px; border: 2px solid #28a745; border-radius: 6px; font-weight: bold; background: #f0fff0; cursor: pointer; }
        .af-btn { border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%; }
        .btn-add { background: #007bff; color: white; }
        .btn-edit { background: #ffc107; color: #000; display: none; }
        .btn-del { background: #dc3545; color: white; font-size: 11px; margin-top: 5px; }
        .sync-row { display: flex; gap: 5px; margin-top: 5px; border-top: 1px solid #eee; padding-top: 10px; }
        .btn-sync { flex: 1; background: #6c757d; color: white; font-size: 11px; padding: 5px; }
        #af-status { font-size: 12px; text-align: center; padding: 5px; border-radius: 6px; background: #f8f9fa; font-weight: bold; }
        #file-input { display: none; }
    `;
    document.head.appendChild(style);

    // 3. HTML STRUCTURE
    const container = document.createElement('div');
    container.id = 'af-container';
    container.innerHTML = `
        <div id="af-manager">
            <div class="af-title">🚀 AESEL MANAGER V9</div>
            <a href="https://j6.prometric-jp.com/Reserve/Login?CN=JH&LC=ID" target="_blank" class="btn-link-kaigo">🌐 Buka Login Kaigo (ID)</a>
            
            <input type="text" id="in-nama" class="af-input" placeholder="Nama Akun">
            <input type="text" id="in-id" class="af-input" placeholder="ID (JP...)">
            <input type="password" id="in-pass" class="af-input" placeholder="Password">
            
            <button class="af-btn btn-add" id="btn-save">Simpan Akun Baru</button>
            <button class="af-btn btn-edit" id="btn-update">Update Akun</button>
            
            <select id="acc-dropdown" class="af-select"></select>
            
            <div id="af-status">Status: Standby</div>
            <button class="af-btn btn-del" id="btn-del">Hapus Akun Terpilih</button>
            
            <div class="sync-row">
                <button class="af-btn btn-sync" id="btn-exp">Export JSON</button>
                <button class="af-btn btn-sync" id="btn-imp">Import JSON</button>
            </div>
            <input type="file" id="file-input" accept=".json" multiple>
        </div>
        <div id="af-bubble">🚀</div>
    `;
    document.body.appendChild(container);

    const bubble = document.getElementById('af-bubble');
    const manager = document.getElementById('af-manager');
    const dropdown = document.getElementById('acc-dropdown');
    const statusBox = document.getElementById('af-status');

    // 4. LOGIC FUNCTIONS
    const toggleUI = (forceHide = false) => {
        isMinimized = forceHide ? true : !isMinimized;
        manager.classList.toggle('show', !isMinimized);
        bubble.innerHTML = isMinimized ? '🚀' : '✖';
    };

    const saveLocal = () => {
        localStorage.setItem('af_accounts', JSON.stringify(accounts));
        localStorage.setItem('af_active_idx', activeIdx);
    };

    const renderDropdown = () => {
        dropdown.innerHTML = '<option value="">-- Pilih Akun Aktif --</option>' + 
            accounts.map((acc, i) => `<option value="${i}" ${activeIdx == i ? 'selected' : ''}>${acc.nama}</option>`).join('');
    };

    const updateForm = () => {
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
    bubble.onclick = () => toggleUI();

    dropdown.onchange = (e) => {
        activeIdx = e.target.value !== "" ? e.target.value : null;
        saveLocal();
        updateForm();
        if (activeIdx !== null) setTimeout(() => toggleUI(true), 600); // Auto-Hide
    };

    document.getElementById('btn-save').onclick = () => {
        const n = document.getElementById('in-nama').value, i = document.getElementById('in-id').value, p = document.getElementById('in-pass').value;
        if (n && i && p) {
            accounts.push({ nama: n, id: i, pass: p });
            activeIdx = accounts.length - 1;
            saveLocal(); renderDropdown(); updateForm();
            setTimeout(() => toggleUI(true), 800);
        }
    };

    document.getElementById('btn-update').onclick = () => {
        if (activeIdx !== null) {
            accounts[activeIdx] = { 
                nama: document.getElementById('in-nama').value, 
                id: document.getElementById('in-id').value, 
                pass: document.getElementById('in-pass').value 
            };
            saveLocal(); renderDropdown(); alert("Diperbarui!");
            toggleUI(true);
        }
    };

    document.getElementById('btn-del').onclick = () => {
        if (activeIdx !== null && confirm("Hapus akun ini?")) {
            accounts.splice(activeIdx, 1);
            activeIdx = null;
            saveLocal(); renderDropdown(); updateForm();
        }
    };

    // IMPORT & EXPORT LOGIC
    document.getElementById('btn-exp').onclick = () => {
        if (accounts.length === 0) return alert("Tidak ada data!");
        const blob = new Blob([JSON.stringify(accounts, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Backup_Accounts_${new Date().toLocaleDateString()}.json`;
        a.click();
    };

    document.getElementById('btn-imp').onclick = () => document.getElementById('file-input').click();
    document.getElementById('file-input').onchange = async (e) => {
        for (let file of e.target.files) {
            try {
                const data = JSON.parse(await file.text());
                accounts = [...accounts, ...(Array.isArray(data) ? data : [data])];
            } catch (err) { alert("File JSON tidak valid!"); }
        }
        saveLocal(); renderDropdown(); updateForm();
        alert("Import Selesai!");
    };

    // INIT
    renderDropdown();
    updateForm();
})();
