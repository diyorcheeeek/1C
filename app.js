const tg = window.Telegram?.WebApp;
tg?.ready();

/* ===== ДАННЫЕ ===== */
const clients = [
  { id: 1, name: "ООО Строй Плюс" },
  { id: 2, name: "ИП Ахмедов" }
];

const productsData = [
  { id: 1, name: "Цемент М500", price: 75000 },
  { id: 2, name: "Песок", price: 30000 },
  { id: 3, name: "Кирпич", price: 1200 },
  { id: 4, name: "Щебень", price: 45000 }
];

let order = [];
let selectedClient = null;

/* ===== ELEMENTS ===== */
const clientSelect = document.getElementById("clientSelect");
const products = document.getElementById("products");
const orderDiv = document.getElementById("order");
const totalSpan = document.getElementById("total");
const searchInput = document.getElementById("search");

/* ===== CLIENTS ===== */
clients.forEach((c, i) => {
  const o = document.createElement("option");
  o.value = c.id;
  o.textContent = c.name;
  if (i === 0) {
    o.selected = true;
    selectedClient = c;
  }
  clientSelect.appendChild(o);
});

clientSelect.addEventListener("change", () => {
  selectedClient = clients.find(c => c.id == clientSelect.value);
});

/* ===== PRODUCTS ===== */
function renderProducts(list) {
  products.innerHTML = "";
  list.forEach(p => {
    const d = document.createElement("div");
    d.className = "product";
    d.innerHTML = `
      <span>${p.name}</span>
      <button onclick="addToOrder(${p.id})">+</button>
    `;
    products.appendChild(d);
  });
}
renderProducts(productsData);

/* ===== SEARCH ===== */
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  renderProducts(
    productsData.filter(p => p.name.toLowerCase().includes(q))
  );
});

/* ===== ORDER ===== */
function addToOrder(id) {
  const p = productsData.find(x => x.id === id);
  const row = order.find(x => x.id === id);
  if (row) row.qty++;
  else order.push({ ...p, qty: 1 });
  renderOrder();
}

function renderOrder() {
  orderDiv.innerHTML = "";
  let total = 0;

  order.forEach((i, index) => {
    total += i.price * i.qty;
    const d = document.createElement("div");
    d.className = "order-item";
    d.innerHTML = `
      <span>${i.name}</span>
      <input type="number" min="1" value="${i.qty}"
        onchange="updateQty(${index}, this.value)">
      <input type="number" min="0" value="${i.price}"
        onchange="updatePrice(${index}, this.value)">
      <button onclick="removeItem(${index})">✕</button>
    `;
    orderDiv.appendChild(d);
  });

  totalSpan.textContent = total;
}

function updateQty(i, v) {
  order[i].qty = Number(v) || 1;
  renderOrder();
}

function updatePrice(i, v) {
  order[i].price = Number(v) || 0;
  renderOrder();
}

function removeItem(i) {
  order.splice(i, 1);
  renderOrder();
}

/* ===== ACTIONS ===== */
function clearOrder() {
  order = [];
  renderOrder();
}

function saveOrder() {
  if (!order.length) {
    alert("Список пуст");
    return;
  }
  alert(`Заказ сохранён\nКлиент: ${selectedClient?.name}`);
}

function printOrder() {
  if (!window.print) {
    alert("Печать будет через PDF (следующий этап)");
    return;
  }
  window.print();
}
