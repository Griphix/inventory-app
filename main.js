const API_URL = "https://script.google.com/macros/s/AKfycbwEOfunJbNCn2ZUoEc9rDxuWYOuhSseDCUcgw_kr0qFOHUdPAtiPzx1xEB9BL4Xpu_y/exec";

async function loadData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    console.log("DATA:", data);

    const list = document.getElementById("inventoryList");
    list.innerHTML = "";

    if (!data.inventory || data.inventory.length === 0) {
      list.innerHTML = "No items found.";
      return;
    }

    data.inventory.forEach(item => {
      const div = document.createElement("div");
      div.innerHTML = `${item.name} (${item.category}) — ${item.qty}`;
      list.appendChild(div);
    });

  } catch (err) {
    console.error("ERROR:", err);
    alert("❌ Cannot load data. Check console.");
  }
}

window.onload = loadData;
