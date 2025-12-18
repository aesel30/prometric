(function () {
  console.log("📡 [Reserve] Memulai pemantauan tombol reservasi...");

  const startReservation = () => {
    // Mencari tombol berdasarkan ID dan Class agar lebih akurat
    const reserveBtn = document.getElementById("button");

    // Pastikan itu benar-benar tombol "Reservasi ujian"
    if (reserveBtn && reserveBtn.innerText.includes("Reservasi ujian")) {
      // Cek apakah tombol sedang loading/disabled (biasanya ditandai class disabled)
      if (!reserveBtn.disabled && !reserveBtn.classList.contains("disabled")) {
        console.log("✅ [Reserve] Tombol ditemukan! Melakukan Klik...");

        // Menghighlight tombol sebelum klik (visual feedback)
        reserveBtn.style.border = "5px solid red";

        // Eksekusi fungsi asli dari website atau simulasi klik
        reserveBtn.click();

        return true; // Berhenti jika berhasil
      } else {
        console.log("⏳ [Reserve] Tombol ditemukan tapi masih terkunci (disabled).");
      }
    }
    return false;
  };

  // Jalankan pengecekan setiap 500ms (0.5 detik) agar sangat cepat
  const scanTimer = setInterval(() => {
    if (startReservation()) {
      clearInterval(scanTimer);
      console.log("🚀 [Reserve] Proses pindah halaman dimulai.");
    }
  }, 500);

  // Timeout: Berhenti mencari setelah 30 detik jika tidak ditemukan (mencegah lag)
  setTimeout(() => {
    clearInterval(scanTimer);
  }, 30000);
})();
