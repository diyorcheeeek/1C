const tg = window.Telegram.WebApp;
tg.ready();

// mock как из 1С
const clients = [
  { id: 1, name: "ООО Строй Плюс" },
  { id: 2, name: "ИП Ахмедов" }
];

const productsData = [
  { id: 1, name: "Цемент М500", price: 75000 },
  { id: 2, name: "Песок", price: 30000 },
  { id: 3, name: "Кирпич", price: 1200 }
];

let order = [];

const clientSelect = document.getElementById("clientSelect");
const products = document.getElementById("products");
const orderDiv = document.getElementById("order");
const totalSpan = document.getElementById("total");

// клиенты
clients.forEach(c => {
  const o = document.createElement("option");
  o.value = c.id;
  o.textContent = c.name;
  clientSelect.appendChild(o);
});

// товары
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
  order.forEach(i => {
    total += i.price * i.qty;
    const d = document.createElement("div");
    d.className = "order-item";
    d.innerHTML = `
      <span>${i.name} x ${i.qty}</span>
      <span>${i.price * i.qty}</span>
    `;
    orderDiv.appendChild(d);
  });
  totalSpan.textContent = total;
}

function saveOrder() {
  if (!order.length) return alert("Список пуст");
  alert("Заказ сохранён (позже уйдёт в 1С)");
}

function clearOrder() {
  order = [];
  renderOrder();
}

function printOrder() {
  window.print();
}
