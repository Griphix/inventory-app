const API_URL = "https://script.google.com/macros/s/AKfycbwEOfunJbNCn2ZUoEc9rDxuWYOuhSseDCUcgw_kr0qFOHUdPAtiPzx1xEB9BL4Xpu_y/exec";

// LOAD DATA
async function loadData() {
  const res = await fetch(API_URL);
  const data = await res.json();

  loadItems(data.inventory);
  loadDashboard(data.inventory, data.logs);
}

// DROPDOWN
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

// DASHBOARD
function loadDashboard(inventory, logs) {
  const list = document.getElementById("inventoryList");
  const logList = document.getElementById("logList");

  if (list) {
    list.innerHTML = "";
    inventory.forEach(i => {
      const li = document.createElement("li");

      let cls = i.qty <= 3 ? "low" : "";
      li.innerHTML = `<span class="${cls}">${i.name}: ${i.qty}</span>`;

      list.appendChild(li);
    });
  }

  if (logList) {
    logList.innerHTML = "";
    logs.slice(-10).reverse().forEach(l => {
      const li = document.createElement("li");
      li.textContent = `${l.name} ${l.action} ${l.qty} ${l.item}`;
      logList.appendChild(li);
    });
  }
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
