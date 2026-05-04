const API_URL = "https://script.google.com/macros/s/AKfycbwEOfunJbNCn2ZUoEc9rDxuWYOuhSseDCUcgw_kr0qFOHUdPAtiPzx1xEB9BL4Xpu_y/exec";

let globalInventory = [];
let globalLogs = [];

async function loadData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    globalInventory = data.inventory || [];
    globalLogs = data.logs || [];

    populateCategories();
    renderInventory(globalInventory);
    renderLogs(globalLogs);

  } catch (err) {
    console.error(err);
    alert("Cannot load data");
  }
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  select.innerHTML = `<option value="">All Categories</option>`;

  const categories = [...new Set(globalInventory.map(i => i.category))];

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function filterItems() {
  const cat = document.getElementById("categoryFilter").value;
  let list = globalInventory;

  if (cat) list = list.filter(i => i.category === cat);

  renderInventory(list);
}

function renderInventory(list) {
  const el = document.getElementById("inventoryList");
  el.innerHTML = "";

  list.forEach(i => {
    const qty = isNaN(parseInt(i.qty)) ? 0 : parseInt(i.qty);

    const div = document.createElement("div");
    div.className = "item";

    if (qty <= 3) div.classList.add("low");

    div.innerHTML = `${i.name} (${i.category}) — ${qty}`;
    el.appendChild(div);
  });
}

function renderLogs(logs) {
  const el = document.getElementById("logList");
  el.innerHTML = "";

  logs.slice(-10).reverse().forEach(l => {
    const li = document.createElement("li");
    li.textContent = `${l.name} ${l.action} ${l.qty} ${l.item}`;
    el.appendChild(li);
  });
}

window.onload = loadData;
