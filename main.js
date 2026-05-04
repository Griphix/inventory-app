const API_URL = "https://script.google.com/macros/s/AKfycbwEOfunJbNCn2ZUoEc9rDxuWYOuhSseDCUcgw_kr0qFOHUdPAtiPzx1xEB9BL4Xpu_y/exec";

// ==========================
// LOAD DATA (CORS SAFE)
// ==========================
async function loadData() {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      mode: "cors"
    });

    const text = await res.text();

    // Sometimes Google returns weird formatting — force clean parse
    const data = JSON.parse(text);

    console.log("DATA:", data);

    renderInventory(data.inventory || []);

  } catch (err) {
    console.error("FULL ERROR:", err);
    alert("Cannot load data");
  }
}

// ==========================
// RENDER INVENTORY
// ==========================
function renderInventory(list) {
  const el = document.getElementById("inventoryList");
  if (!el) return;

  el.innerHTML = "";

  if (list.length === 0) {
    el.innerHTML = "No items found";
    return;
  }

  list.forEach(i => {
    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.borderBottom = "1px solid #eee";

    div.innerHTML = `
      <b>${i.name}</b> (${i.category}) — ${i.qty}
    `;

    el.appendChild(div);
  });
}

window.onload = loadData;
