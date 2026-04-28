const API_URL = "https://script.google.com/macros/s/AKfycbwEOfunJbNCn2ZUoEc9rDxuWYOuhSseDCUcgw_kr0qFOHUdPAtiPzx1xEB9BL4Xpu_y/exec";

let globalInventory = [];
let globalLogs = [];

// ==========================
// LOAD DATA SAFELY
// ==========================
async function loadData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    globalInventory = data.inventory || [];
    globalLogs = data.logs || [];

    // Only run if elements exist
    if (document.getElementById("inventoryList")) {
      renderInventory(globalInventory);
    }

    if (document.getElementById("logList")) {
      renderLogs(globalLogs);
    }

  } catch (err) {
    console.error("Load error:", err);
  }
}

// ==========================
// SEARCH SUGGESTIONS
// ==========================
function showSuggestions() {
  const search = document.getElementById("itemSearch").value.toLowerCase();
  const box = document.getElementById("suggestions");

  if (!box) return;

  box.innerHTML = "";

  globalInventory
    .filter(i => i.name.toLowerCase().includes(search))
    .forEach(i => {
      const div = document.createElement("div");
      div.textContent = `${i.name} (${i.qty})`;

      div.onclick = () => {
        document.getElementById("selectedItem").value = i.name;
        box.innerHTML = "";
      };

      box.appendChild(div);
    });
}

// ==========================
// DASHBOARD INVENTORY
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
  const item = document.getElementById("selectedItem").value;
  const qty = parseInt(document.getElementById("qty").value);

  if (!name || !item || !qty) {
    alert("Fill all fields properly");
    return;
  }

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

  alert("Withdraw successful");
}

// ==========================
// RETURN
// ==========================
async function returnItem() {
  const name = document.getElementById("name").value;
  const item = document.getElementById("selectedItem").value;
  const qty = parseInt(document.getElementById("qty").value);

  if (!name || !item || !qty) {
    alert("Fill all fields properly");
    return;
  }

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

  alert("Return successful");
}

// ==========================
window.onload = loadData;
