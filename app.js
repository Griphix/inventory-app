const API_URL = "https://script.google.com/macros/s/AKfycbwEOfunJbNCn2ZUoEc9rDxuWYOuhSseDCUcgw_kr0qFOHUdPAtiPzx1xEB9BL4Xpu_y/exec";

// ==========================
// LOAD DATA FROM GOOGLE SHEETS
// ==========================
async function loadData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    loadItems(data.inventory);
    loadDashboard(data.inventory, data.logs);

  } catch (err) {
    console.error("Error loading data:", err);
  }
}

// ==========================
// POPULATE DROPDOWN
// ==========================
function loadItems(inventory) {
  const select = document.getElementById("item");
  if (!select) return;

  select.innerHTML = "";

  inventory.forEach(i => {
    const option = document.createElement("option");
    option.value = i.name;
    option.textContent = `${i.name} (${i.qty})`;
    select.appendChild(option);
  });
}

// ==========================
// DASHBOARD DISPLAY
// ==========================
function loadDashboard(inventory, logs) {
  const list = document.getElementById("inventoryList");
  const logList = document.getElementById("logList");

  // STOCK DISPLAY
  if (list) {
    list.innerHTML = "";

    inventory.forEach(i => {
      const div = document.createElement("div");

      let cls = i.qty <= 3 ? "stock-item low" : "stock-item";
      div.className = cls;

      div.innerHTML = `
        <span>${i.name}</span>
        <span>${i.qty}</span>
      `;

      list.appendChild(div);
    });
  }

  // ACTIVITY LOG
  if (logList) {
    logList.innerHTML = "";

    logs.slice(-10).reverse().forEach(l => {
      const li = document.createElement("li");

      li.textContent = `${l.name} ${l.action} ${l.qty} ${l.item}`;

      logList.appendChild(li);
    });
  }
}

// ==========================
// WITHDRAW FUNCTION
// ==========================
async function withdraw() {
  const name = document.getElementById("name").value;
  const item = document.getElementById("item").value;
  const qty = parseInt(document.getElementById("qty").value);

  if (!name || !qty) {
    alert("Please fill all fields");
    return;
  }

  try {
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

    // Reload updated data
    loadData();

  } catch (err) {
    console.error("Withdraw error:", err);
  }
}

// ==========================
// RETURN FUNCTION
// ==========================
async function returnItem() {
  const name = document.getElementById("name").value;
  const item = document.getElementById("item").value;
  const qty = parseInt(document.getElementById("qty").value);

  if (!name || !qty) {
    alert("Please fill all fields");
    return;
  }

  try {
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

    // Reload updated data
    loadData();

  } catch (err) {
    console.error("Return error:", err);
  }
}

// ==========================
// INIT
// ==========================
window.onload = loadData;
