{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // ==========================\
// INITIAL DATA\
// ==========================\
\
if (!localStorage.getItem("inventory")) \{\
  const data = [\
    \{ name: "Helmet", qty: 10 \},\
    \{ name: "Harness", qty: 8 \},\
    \{ name: "Carabiner", qty: 20 \}\
  ];\
  localStorage.setItem("inventory", JSON.stringify(data));\
\}\
\
// ==========================\
// LOAD ITEMS\
// ==========================\
\
function loadItems() \{\
  const select = document.getElementById("item");\
  if (!select) return;\
\
  const inventory = JSON.parse(localStorage.getItem("inventory"));\
\
  select.innerHTML = "";\
\
  inventory.forEach(i => \{\
    const option = document.createElement("option");\
    option.value = i.name;\
    option.textContent = `$\{i.name\} ($\{i.qty\})`;\
    select.appendChild(option);\
  \});\
\}\
\
// ==========================\
// WITHDRAW\
// ==========================\
\
function withdraw() \{\
  const name = document.getElementById("name").value;\
  const itemName = document.getElementById("item").value;\
  const qty = parseInt(document.getElementById("qty").value);\
\
  if (!name || !qty) \{\
    alert("Fill all fields!");\
    return;\
  \}\
\
  let inventory = JSON.parse(localStorage.getItem("inventory"));\
  let item = inventory.find(i => i.name === itemName);\
\
  if (!item || item.qty < qty) \{\
    alert("Not enough stock!");\
    return;\
  \}\
\
  item.qty -= qty;\
\
  localStorage.setItem("inventory", JSON.stringify(inventory));\
\
  alert("\uc0\u9989  Withdraw successful!");\
  location.reload();\
\}\
\
// ==========================\
// RETURN\
// ==========================\
\
function returnItem() \{\
  const name = document.getElementById("name").value;\
  const itemName = document.getElementById("item").value;\
  const qty = parseInt(document.getElementById("qty").value);\
\
  if (!name || !qty) \{\
    alert("Fill all fields!");\
    return;\
  \}\
\
  let inventory = JSON.parse(localStorage.getItem("inventory"));\
  let item = inventory.find(i => i.name === itemName);\
\
  if (!item) \{\
    alert("Item not found!");\
    return;\
  \}\
\
  item.qty += qty;\
\
  localStorage.setItem("inventory", JSON.stringify(inventory));\
\
  alert("\uc0\u9989  Return successful!");\
  location.reload();\
\}\
\
// ==========================\
// INIT\
// ==========================\
\
window.onload = loadItems;}