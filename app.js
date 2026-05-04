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
// STATS + ALERT
// ==========================
function updateStats() {
  const totalItems = globalInventory.length;
  const totalQty = globalInventory.reduce((sum, i) => sum + i.qty, 0);
  const lowStock = globalInventory.filter(i => i.qty <= 3);

  if (document.getElementById("totalItems")) {
    document.getElementById("totalItems").textContent = totalItems;
  }

  if (document.getElementById("totalQty")) {
    document.getElementById("totalQty").textContent = totalQty;
  }

  if (document.getElementById("lowCount")) {
    document.getElementById("lowCount").textContent = lowStock.length;
  }

  const alertBox = document.getElementById("alertBox");

  if (alertBox) {
    if (lowStock.length > 0) {
      alertBox.style.display = "block";
      alertBox.textContent = `⚠️ ${lowStock.length} items are low on stock`;
    } else {
      alertBox.style.display = "none";
    }
  }
}

// ==========================
// SEARCH + FILTER
// ==========================
function filterItems() {
  const searchInput = document.getElementById("search");
  const categoryInput = document.getElementById("categoryFilter");

  if (!searchInput || !categoryInput) return;

  const search = searchInput.value.toLowerCase();
  const category = categoryInput.value;

  let filtered = globalInventory.filter(i =>
    i.name.toLowerCase().includes(search)
  );

  if (category) {
    filtered = filtered.filter(i => i.category === category);
  }

  renderInventory(filtered);
}

// ==========================
// INVENTORY DISPLAY
// ==========================
function renderInventory(inventory) {
  const list = document.getElementById("inventoryList");
  if (!list) return;

  list.innerHTML = "";

  // Sort by lowest qty first
  inventory.sort((a, b) => a.qty - b.qty);

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
// SEARCH SUGGESTIONS (WITHDRAW/RETURN)
// ==========================
function showSuggestions() {
  const searchInput = document.getElementById("itemSearch");
  const box = document.getElementById("suggestions");

  if (!searchInput || !box) return;

  const search = searchInput.value.toLowerCase();
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
