(function() {
    console.log("🚀 Memulai Script Login Otomatis...");

    // 1. Ambil data akun yang "Aktif" dari LocalStorage (diset oleh ui.js)
    const accounts = JSON.parse(localStorage.getItem('af_accounts') || '[]');
    const activeIdx = localStorage.getItem('af_active_idx');

    if (activeIdx === null || !accounts[activeIdx]) {
        console.warn("⚠️ Tidak ada akun aktif yang dipilih di UI Manager.");
        return;
    }

    const acc = accounts[activeIdx];
    console.log(`👤 Menggunakan Akun: ${acc.nama}`);

    // 2. Loop monitoring untuk mengisi form dan klik login
    const monitorInterval = setInterval(() => {
        const idBox = document.getElementById('inputPrometricID');
        const passBox = document.getElementById('inputPassword');
        const loginBtn = document.querySelector('button[name="B1"]'); // Tombol Login

        // Isi Form
        if (idBox && idBox.value !== acc.id) idBox.value = acc.id;
        if (passBox && passBox.value !== acc.pass) passBox.value = acc.pass;

        // Cek Status Tombol (Apakah CAPTCHA sudah selesai?)
        // Tombol biasanya punya class 'disabled' atau properti disabled saat captcha belum ok
        if (loginBtn && !loginBtn.disabled && !loginBtn.classList.contains('disabled')) {
            
            // Cek apakah ID dan Pass sudah terisi sebelum klik
            if(idBox.value === acc.id && passBox.value === acc.pass) {
                clearInterval(monitorInterval);
                console.log("✅ Captcha Selesai. Melakukan Login...");
                
                // Gunakan fungsi bawaan web jika ada, atau klik manual
                if (typeof check === "function") {
                    check(); 
                } else {
                    loginBtn.click();
                }
            }
        }
    }, 500); // Cek setiap 0.5 detik
})();
