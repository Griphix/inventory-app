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

    console.log("DATA:", data);

    globalInventory = data.inventory || [];
    globalLogs = data.logs || [];

    // 🔥 THIS WAS MISSING BEFORE
    updateStats();
    populateCategories();
    renderInventory(globalInventory);
    renderLogs(globalLogs);

  } catch (err) {
    console.error("ERROR:", err);
    alert("Cannot load data");
  }
}

// ==========================
// STATS
// ==========================
function updateStats() {
  document.getElementById("totalItems").textContent = globalInventory.length;

  document.getElementById("totalQty").textContent =
    globalInventory.reduce((sum, i) => sum + Number(i.qty), 0);

  document.getElementById("lowCount").textContent =
    globalInventory.filter(i => i.qty <= 3).length;
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
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

// ==========================
// FILTER
// ==========================
function filterItems() {
  const cat = document.getElementById("categoryFilter").value;

  let list = globalInventory;

  if (cat) {
    list = list.filter(i => i.category === cat);
  }

  renderInventory(list);
}

// ==========================
// RENDER INVENTORY
// ==========================
function renderInventory(list) {
  const el = document.getElementById("inventoryList");
  if (!el) return;

  el.innerHTML = "";

  list.forEach(i => {
    const div = document.createElement("div");

    if (i.qty <= 3) {
      div.style.color = "red";
      div.style.fontWeight = "bold";
    }

    div.innerHTML = `${i.name} (${i.category}) — ${i.qty}`;
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
window.onload = loadData;
