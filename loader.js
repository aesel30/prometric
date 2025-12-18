// ==UserScript==
// @name         Aesel Bot
// @namespace    https://aesel.web.id/
// @version      1.0.0
// @description  membantu proses reservasi
// @author       Aesel Reservasi
// @match        https://*/*
// @match        *://*.prometric-jp.com/*
// @match        about:blank
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const GITHUB_BASE = "https://raw.githubusercontent.com/aesel30/prometric/main/";
    const currentUrl = window.location.href;

    // Rute script fungsional
    const routes = [
        { pattern: "/Reserve/Login", scripts: ["login.js"] },
        { pattern: "/Reserve/TestList", scripts: ["reserve.js", "check.js"] },
        { pattern: "/Reserve/SelectPlace", scripts: ["autoTarget.js", "chkDate.js"] },
        { pattern: "/Reserve/Confirm", scripts: ["confirm.js"] },
        { pattern: "/Error", scripts: ["error.js"] }
    ];

    // Fungsi Injector Utama (Menggunakan GM_xmlhttpRequest agar tidak diblokir CSP)
    const inject = (fileName) => {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `${GITHUB_BASE}${fileName}?v=${Math.random()}`,
                onload: function(res) {
                    if (res.status === 200) {
                        try {
                            // Menjalankan kode langsung di memori browser
                            const run = new Function(res.responseText);
                            run();
                            console.log(`✅ [Loaded] ${fileName}`);
                        } catch (e) {
                            console.error(`❌ [Eval Error] ${fileName}:`, e);
                        }
                    } else {
                        console.error(`❌ [HTTP Error] ${fileName}: ${res.status}`);
                    }
                    resolve();
                },
                onerror: (err) => {
                    console.error(`❌ [Network Error] ${fileName}`, err);
                    resolve();
                }
            });
        });
    };

    async function startLoader() {
        console.log("📡 [Loader] Menyiapkan Sistem...");

        // A. SELALU MUAT UI (Floating Bubble) di semua halaman
        await inject("ui.js");

        // B. MUAT SCRIPT SPESIFIK HALAMAN (Jika di Prometric)
        if (currentUrl.includes("prometric-jp.com/Reserve/")) {
            for (const route of routes) {
                if (currentUrl.includes(route.pattern)) {
                    console.log(`🎯 Rute Cocok: ${route.pattern}`);
                    for (const script of route.scripts) {
                        await inject(script);
                    }
                    break;
                }
            }
        }
    }

    startLoader();
})();
