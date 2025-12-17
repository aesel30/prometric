// manager.js
(function () {
  if (document.getElementById("af-manager")) return;

  let accounts = JSON.parse(localStorage.getItem("af_accounts") || "[]");
  let activeIdx = localStorage.getItem("af_active_idx");
  let offset = JSON.parse(localStorage.getItem("af_ui_offset") || '{"x":0,"y":0}');

  const style = document.createElement("style");
  style.innerHTML = `
        #af-manager {
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: #fff; border: 2px solid #007bff; padding: 15px;
            border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            font-family: sans-serif; width: 280px; transform: translate3d(${offset.x}px, ${offset.y}px, 0);
        }
        .af-header { cursor: move; font-weight: bold; text-align: center; color: #007bff; padding-bottom: 10px; border-bottom: 1px solid #eee; margin-bottom: 10px; }
        .af-input { width: 100%; padding: 8px; margin-bottom: 5px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        .af-select { width: 100%; padding: 8px; margin: 10px 0; border: 2px solid #28a745; border-radius: 4px; font-weight: bold; }
        .btn-main { width: 100%; padding: 10px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-bottom: 5px; }
    `;
  document.head.appendChild(style);

  const container = document.createElement("div");
  container.id = "af-manager";
  document.body.appendChild(container);

  const render = () => {
    container.innerHTML = `
            <div class="af-header" id="af-drag">🚀 UI MANAGER</div>
            <input type="text" id="in-nama" class="af-input" placeholder="Nama">
            <input type="text" id="in-id" class="af-input" placeholder="ID">
            <input type="password" id="in-pass" class="af-input" placeholder="Password">
            <button class="btn-main" id="btn-save" style="background:#007bff;color:#fff">Simpan/Update</button>
            <select id="acc-dropdown" class="af-select">
                <option value="">-- Pilih Akun Aktif --</option>
                ${accounts.map((acc, i) => `<option value="${i}" ${activeIdx == i ? "selected" : ""}>${acc.nama}</option>`).join("")}
            </select>
            <div id="status" style="font-size:11px; text-align:center; color:green"></div>
        `;

    // Logika Drag & Drop
    const dragItem = document.getElementById("af-drag");
    let active = false,
      startX,
      startY;

    dragItem.onmousedown = (e) => {
      active = true;
      startX = e.clientX - offset.x;
      startY = e.clientY - offset.y;
    };
    document.onmousemove = (e) => {
      if (!active) return;
      offset.x = e.clientX - startX;
      offset.y = e.clientY - startY;
      container.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0)`;
    };
    document.onmouseup = () => {
      active = false;
      localStorage.setItem("af_ui_offset", JSON.stringify(offset));
    };

    // Logika Dropdown & Save
    const dropdown = document.getElementById("acc-dropdown");
    dropdown.onchange = () => {
      activeIdx = dropdown.value;
      localStorage.setItem("af_active_idx", activeIdx);
      document.getElementById("status").innerText = "Akun Aktif Diperbarui!";
    };

    document.getElementById("btn-save").onclick = () => {
      const newAcc = {
        nama: document.getElementById("in-nama").value,
        id: document.getElementById("in-id").value,
        pass: document.getElementById("in-pass").value,
      };
      accounts.push(newAcc);
      localStorage.setItem("af_accounts", JSON.stringify(accounts));
      render();
    };
  };
  render();
})();
