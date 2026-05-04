const API_URL = "https://script.google.com/macros/s/AKfycbwEOfunJbNCn2ZUoEc9rDxuWYOuhSseDCUcgw_kr0qFOHUdPAtiPzx1xEB9BL4Xpu_y/exec";

let globalInventory = [];
let globalLogs = [];

async function loadData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    console.log("DATA:", data);

    globalInventory = data.inventory || [];
    globalLogs = data.logs || [];

    populateCategories();
    updateStats();
    renderInventory(globalInventory);
    renderLogs(globalLogs);

  } catch (err) {
    console.error(err);
    alert("Cannot load data");
  }
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");

  const categories = [...new Set(globalInventory.map(i => i.category))];

  categories.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
}

function updateStats() {
  document.getElementById("totalItems").textContent = globalInventory.length;

  document.getElementById("totalQty").textContent =
    globalInventory.reduce((s,i)=>s+i.qty,0);

  document.getElementById("lowCount").textContent =
    globalInventory.filter(i=>i.qty<=3).length;
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
    const div = document.createElement("div");

    if (i.qty <= 3) {
      div.style.color = "red";
      div.style.fontWeight = "bold";
    }

    div.innerHTML = `${i.name} (${i.category}) — ${i.qty}`;

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
