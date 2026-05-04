const API_URL = "https://script.google.com/macros/s/AKfycbwEOfunJbNCn2ZUoEc9rDxuWYOuhSseDCUcgw_kr0qFOHUdPAtiPzx1xEB9BL4Xpu_y/exec";

let globalInventory = [];
let globalLogs = [];

// ==========================
// LOAD DATA
// ==========================
async function loadData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    globalInventory = data.inventory || [];
    globalLogs = data.logs || [];

    populateCategories();
    updateStats();
    renderInventory(globalInventory);
    renderLogs(globalLogs);

  } catch (err) {
    console.error("Load error:", err);
  }
}

// ==========================
// CATEGORY DROPDOWN
// ==========================
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;

  select.innerHTML = `<option value="">All Categories</option>`;

  const categories = [...new Set(globalInventory.map(i => i.category))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// ==========================
// STATS
// ==========================
function updateStats() {
  document.getElementById("totalItems")?.textContent = globalInventory.length;
  document.getElementById("totalQty")?.textContent =
    globalInventory.reduce((s, i) => s + i.qty, 0);
  document.getElementById("lowCount")?.textContent =
    globalInventory.filter(i => i.qty <= 3).length;
}

// ==========================
// FILTER
// ==========================
function filterItems() {
  const search = document.getElementById("search")?.value.toLowerCase() || "";
  const cat = document.getElementById("categoryFilter")?.value;

  let list = globalInventory.filter(i =>
    i.name.toLowerCase().includes(search)
  );

  if (cat) list = list.filter(i => i.category === cat);

  renderInventory(list);
}

// ==========================
// INVENTORY DISPLAY
// ==========================
function renderInventory(list) {
  const el = document.getElementById("inventoryList");
  if (!el) return;

  el.innerHTML = "";

  list.sort((a, b) => a.qty - b.qty);

  list.forEach(i => {
    const div = document.createElement("div");
    div.className = "stock-item";

    if (i.qty <= 3) div.classList.add("low");

    div.innerHTML = `
      <span>${i.name} (${i.category})</span>
      <span>${i.qty}</span>
    `;

    el.appendChild(div);
  });
}

// ==========================
// LOGS
// ==========================
function renderLogs(logs) {
  const el = document.getElementById("logList");
  if (!el) return;

  el.innerHTML = "";

  logs.slice(-10).reverse().forEach(l => {
    const li = document.createElement("li");
    li.textContent = `${l.name} ${l.action} ${l.qty} ${l.item}`;
    el.appendChild(li);
  });
}

// ==========================
// SEARCH SUGGESTIONS
// ==========================
function showSuggestions() {
  const input = document.getElementById("itemSearch");
  const box = document.getElementById("suggestions");

  if (!input || !box) return;

  const search = input.value.toLowerCase();
  box.innerHTML = "";

  globalInventory
    .filter(i => i.name.toLowerCase().includes(search))
    .forEach(i => {
      const div = document.createElement("div");
      div.textContent = `${i.name} (${i.qty})`;

      div.onclick = () => {
        input.value = i.name;
        box.innerHTML = "";
      };

      box.appendChild(div);
    });
}

// ==========================
// RETURN (FIXED)
// ==========================
async function returnItem() {
  const name = document.getElementById("name").value.trim();
  const itemInput = document.getElementById("itemSearch").value.trim();
  const qty = parseInt(document.getElementById("qty").value);

  if (!name || !itemInput || !qty) {
    alert("Fill all fields properly");
    return;
  }

  const match = globalInventory.find(i =>
    i.name.toLowerCase() === itemInput.toLowerCase()
  );

  if (!match) {
    alert("Please select a valid item from suggestions");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      name,
      item: match.name,
      qty,
      change: qty,
      action: "returned"
    })
  });

  alert("Return successful");

  // 🔥 reset form
  document.getElementById("itemSearch").value = "";
  document.getElementById("qty").value = "";
}

// ==========================
window.onload = loadData;
