(function () {
  const GITHUB_BASE = "https://raw.githubusercontent.com/aesel30/prometric/refs/heads/main/";
  const currentUrl = window.location.href;

  // Definisikan rute dan file yang harus dipanggil
  const routes = [
    { pattern: "/Reserve/Login", scripts: ["login.js"] },
    { pattern: "/Reserve/TestList", scripts: ["reserve.js", "check.js"] },
    { pattern: "/Reserve/SelectPlace", scripts: ["autoTarget.js", "chkDate.js"] },
    { pattern: "/Reserve/Confirm", scripts: ["confirm.js"] },
    { pattern: "/Error", scripts: ["error.js"] },
  ];

  // Fungsi untuk menyuntikkan script ke halaman
  const injectScript = (fileName) => {
    fetch(`${GITHUB_BASE}${fileName}?v=${Math.random()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Gagal mengambil ${fileName}`);
        return res.text();
      })
      .then((code) => {
        const s = document.createElement("script");
        s.textContent = code;
        document.body.appendChild(s);
        console.log(`✅ [Loaded] ${fileName}`);
      })
      .catch((err) => console.error(`❌ [Error] ${fileName}:`, err));
  };

  // Cek kecocokan URL
  let matched = false;
  for (const route of routes) {
    if (currentUrl.includes(route.pattern)) {
      console.log(`📡 [Loader] Mendeteksi rute ${route.pattern}, memuat script...`);
      route.scripts.forEach((script) => injectScript(script));
      matched = true;
      break;
    }
  }

  // Jika tidak di web Prometric, tampilkan UI Manager (Opsional)
  if (!matched && !currentUrl.includes("prometric-jp.com")) {
    console.log("📡 [Loader] Mode Manager UI (Non-Prometric)");
    injectScript("manager.js");
  }
})();
