(function() {
    console.log("🚀 Memulai Script Login Otomatis...");

    const tryLogin = () => {
        const accounts = JSON.parse(localStorage.getItem('af_accounts') || '[]');
        const activeIdx = localStorage.getItem('af_active_idx');

        // Jika data belum ada, tunggu sebentar dan coba lagi
        if (activeIdx === null || activeIdx === "" || !accounts[activeIdx]) {
            console.warn("⚠️ Akun aktif belum terpilih. Mencoba membaca ulang dalam 1 detik...");
            return false;
        }

        const acc = accounts[activeIdx];
        console.log(`👤 Menggunakan Akun: ${acc.nama}`);

        const idBox = document.getElementById('inputPrometricID');
        const passBox = document.getElementById('inputPassword');
        const loginBtn = document.querySelector('button[name="B1"]');

        if (idBox) idBox.value = acc.id;
        if (passBox) passBox.value = acc.pass;

        if (loginBtn && !loginBtn.disabled && !loginBtn.classList.contains('disabled')) {
            if(idBox.value === acc.id && passBox.value === acc.pass) {
                console.log("✅ Login Berhasil dieksekusi.");
                if (typeof check === "function") check(); else loginBtn.click();
                return true; // Berhenti jika sukses
            }
        }
        return false;
    };

    // Jalankan loop pencarian akun dan login
    const loginTimer = setInterval(() => {
        if (tryLogin()) clearInterval(loginTimer);
    }, 1000);
})();
