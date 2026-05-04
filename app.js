const API_URL = "https://script.google.com/macros/s/AKfycbwEOfunJbNCn2ZUoEc9rDxuWYOuhSseDCUcgw_kr0qFOHUdPAtiPzx1xEB9BL4Xpu_y/exec";

let globalInventory = [];
let globalLogs = [];

async function loadData() {
  const res = await fetch(API_URL);
  const data = await res.json();

  globalInventory = data.inventory || [];
  globalLogs = data.logs || [];

  populateCategories();
  updateStats();
  renderInventory(globalInventory);
  renderLogs(globalLogs);
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;

  select.innerHTML = `<option value="">All Categories</option>`;

  const categories = [...new Set(globalInventory.map(i => i.category))];

  categories.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
}

function updateStats() {
  document.getElementById("totalItems")?.textContent = globalInventory.length;
  document.getElementById("totalQty")?.textContent =
    globalInventory.reduce((s,i)=>s+i.qty,0);
  document.getElementById("lowCount")?.textContent =
    globalInventory.filter(i=>i.qty<=3).length;
}

function filterItems() {
  const search = document.getElementById("search")?.value.toLowerCase() || "";
  const cat = document.getElementById("categoryFilter")?.value;

  let list = globalInventory.filter(i => i.name.toLowerCase().includes(search));
  if (cat) list = list.filter(i => i.category === cat);

  renderInventory(list);
}

function renderInventory(list) {
  const el = document.getElementById("inventoryList");
  if (!el) return;

  el.innerHTML = "";

  list.forEach(i => {
    const div = document.createElement("div");
    div.className = "stock-item";
    if (i.qty <= 3) div.classList.add("low");

    div.innerHTML = `<span>${i.name} (${i.category})</span><span>${i.qty}</span>`;
    el.appendChild(div);
  });
}

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

async function withdraw() {
  const name = document.getElementById("name").value;
  const item = document.getElementById("itemSearch").value;
  const qty = parseInt(document.getElementById("qty").value);

  if (!name || !item || !qty) return alert("Fill properly");

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ name, item, qty, change: -qty, action: "withdrew" })
  });

  alert("Done");
}

async function returnItem() {
  const name = document.getElementById("name").value;
  const item = document.getElementById("itemSearch").value;
  const qty = parseInt(document.getElementById("qty").value);

  if (!name || !item || !qty) return alert("Fill properly");

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ name, item, qty, change: qty, action: "returned" })
  });

  alert("Done");
}

window.onload = loadData;
