(function () {
  const activeIdx = localStorage.getItem("af_active_idx");
  const accounts = JSON.parse(localStorage.getItem("af_accounts") || "[]");
  const acc = accounts[activeIdx];

  if (!acc) return console.log("⚠️ Tidak ada akun aktif.");

  const monitor = setInterval(() => {
    const idBox = document.getElementById("inputPrometricID");
    const passBox = document.getElementById("inputPassword");
    const loginBtn = document.querySelector('button[name="B1"]');

    if (idBox) idBox.value = acc.id;
    if (passBox) passBox.value = acc.pass;

    if (loginBtn && !loginBtn.disabled && !loginBtn.classList.contains("disabled")) {
      clearInterval(monitor);
      if (typeof check === "function") check();
      else loginBtn.click();
    }
  }, 500);
})();
