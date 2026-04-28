const API_URL = "https://script.google.com/macros/s/AKfycbwEOfunJbNCn2ZUoEc9rDxuWYOuhSseDCUcgw_kr0qFOHUdPAtiPzx1xEB9BL4Xpu_y/exec";

let globalInventory = [];
let globalLogs = [];

// ==========================
// LOAD DATA (SAFE VERSION)
// ==========================
async function loadData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    globalInventory = data.inventory || [];
    globalLogs = data.logs || [];

    populateDropdown();

    // Only run if elements exist (PREVENT CRASH)
    if (document.getElementById("inventoryList")) {
      renderInventory(globalInventory);
    }

    if (document.getElementById("logList")) {
      renderLogs(globalLogs);
    }

  } catch (err) {
    console.error("LOAD ERROR:", err);
  }
}

// ==========================
// POPULATE DROPDOWN
// ==========================
function populateDropdown() {
  const select = document.getElementById("item");
  if (!select) return;

  select.innerHTML = "";

  globalInventory.forEach(i => {
    const option = document.createElement("option");
    option.value = i.name;
    option.textContent = `${i.name} (${i.qty})`;
    select.appendChild(option);
  });
}

// ==========================
// FILTER DROPDOWN
// ==========================
function filterDropdown() {
  const search = document.getElementById("itemSearch").value.toLowerCase();
  const select = document.getElementById("item");

  Array.from(select.options).forEach(option => {
    const text = option.text.toLowerCase();
    option.style.display = text.includes(search) ? "block" : "none";
  });
}

// ==========================
// DASHBOARD
// ==========================
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

// ==========================
// LOGS
// ==========================
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

// ==========================
// WITHDRAW
// ==========================
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
}

// ==========================
// RETURN
// ==========================
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
}

// ==========================
window.onload = loadData;
