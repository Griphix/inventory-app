const API_URL = "https://script.google.com/macros/s/AKfycbwEOfunJbNCn2ZUoEc9rDxuWYOuhSseDCUcgw_kr0qFOHUdPAtiPzx1xEB9BL4Xpu_y/exec";

let globalInventory = [];
let globalLogs = [];

// LOAD DATA
async function loadData() {
  const res = await fetch(API_URL);
  const data = await res.json();

  globalInventory = data.inventory;
  globalLogs = data.logs;

  populateCategories();
  renderInventory(globalInventory);
  renderLogs(globalLogs);
}

// CATEGORY DROPDOWN
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

// FILTER FUNCTION
function filterItems() {
  const search = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;

  let filtered = globalInventory.filter(i =>
    i.name.toLowerCase().includes(search)
  );

  if (category) {
    filtered = filtered.filter(i => i.category === category);
  }

  renderInventory(filtered);
}

// INVENTORY DISPLAY
function renderInventory(inventory) {
  const list = document.getElementById("inventoryList");
  if (!list) return;

  list.innerHTML = "";

  inventory.forEach(i => {
    const div = document.createElement("div");
    div.className = "stock-item";

    if (i.qty <= 3) div.classList.add("low");

    div.innerHTML = `
      <span>${i.name} (${i.category})</span>
      <span>${i.qty}</span>
    `;

    list.appendChild(div);
  });
}

// LOG DISPLAY
function renderLogs(logs) {
  const logList = document.getElementById("logList");
  if (!logList) return;

  logList.innerHTML = "";

  logs.slice(-10).reverse().forEach(l => {
    const li = document.createElement("li");
    li.textContent = `${l.name} ${l.action} ${l.qty} ${l.item}`;
    logList.appendChild(li);
  });
}

// WITHDRAW
async function withdraw() {
  const name = document.getElementById("name").value;
  const item = document.getElementById("item").value;
  const qty = parseInt(document.getElementById("qty").value);

  if (!name || !qty) return alert("Fill all fields");

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      name,
      item,
      qty,
      change: -qty,
      action: "withdrew"
    })
  });

  alert("Done");
  loadData();
}

// RETURN
async function returnItem() {
  const name = document.getElementById("name").value;
  const item = document.getElementById("item").value;
  const qty = parseInt(document.getElementById("qty").value);

  if (!name || !qty) return alert("Fill all fields");

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      name,
      item,
      qty,
      change: qty,
      action: "returned"
    })
  });

  alert("Done");
  loadData();
}

window.onload = loadData;
