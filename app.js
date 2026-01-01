const tg = window.Telegram?.WebApp;
tg?.ready();

/* ===== ДАННЫЕ (как из 1С) ===== */
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

/* ===== ELEMENTS ===== */
const clientSelect = document.getElementById("clientSelect");
const products = document.getElementById("products");
const orderDiv = document.getElementById("order");
const totalSpan = document.getElementById("total");
const searchInput = document.getElementById("search");

/* ===== СКРЫТИЕ КЛАВИАТУРЫ ===== */
document.addEventListener("click", e => {
  if (e.target.tagName !== "INPUT") {
    document.activeElement.blur();
  }
});

/* ===== CLIENTS ===== */
clients.forEach(c => {
  const o = document.createElement("option");
  o.value = c.id;
  o.textContent = c.name;
  clientSelect.appendChild(o);
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

/* ===== ПОИСК (как в 1С) ===== */
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  renderProducts(
    productsData.filter(p => p.name.toLowerCase().includes(q))
  );
});

/* ===== ЗАКАЗ ===== */
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
  document.activeElement.blur();
  if (!order.length) {
    alert("Список пуст");
    return;
  }
  alert("Заказ сохранён (дальше будет 1С)");
}

function printOrder() {
  document.activeElement.blur();
  window.print();
}
