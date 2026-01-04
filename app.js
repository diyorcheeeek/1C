// TELEGRAM
const tg = Telegram.WebApp;
tg.ready();

// STATE
const state = {
  admin: tg.initDataUnsafe?.user?.first_name || "Unknown",
  client: null,
  order: [],
  history: JSON.parse(localStorage.getItem("history") || "[]")
};

// VIEW HELPER
function view(html) {
  document.getElementById("view").innerHTML = html;
}

// HOME
function openHome() {
  view(`
    <h2>Главный экран</h2>
    <p>Выберите действие снизу</p>
  `);
}

// CREATE ORDER
function openCreate() {
  state.order = [];
  state.client = null;

  view(`
    <h2>Создать заказ</h2>

    <input placeholder="Клиент">

    <table class="table">
      <thead>
        <tr>
          <th>Товар</th>
          <th>Кол-во</th>
          <th>Цена</th>
        </tr>
      </thead>
      <tbody id="orderTable"></tbody>
    </table>

    <input placeholder="Добавить товар" onkeydown="if(event.key==='Enter') addProduct(this.value)">

    <p id="total">Итого: 0</p>

    <button onclick="saveOrder()">💾 Сохранить</button>
  `);
}

// ADD PRODUCT
function addProduct(name) {
  if (!name) return;
  state.order.push({ name, qty: 1, price: 0 });
  renderOrder();
}

// RENDER ORDER
function renderOrder() {
  let total = 0;
  document.getElementById("orderTable").innerHTML =
    state.order.map((i, idx) => {
      total += i.qty * i.price;
      return `
        <tr>
          <td>${i.name}</td>
          <td>
            <input type="number" value="${i.qty}"
              onchange="state.order[${idx}].qty=+this.value;renderOrder()">
          </td>
          <td>
            <input type="number" value="${i.price}"
              onchange="state.order[${idx}].price=+this.value;renderOrder()">
          </td>
        </tr>
      `;
    }).join("");

  document.getElementById("total").innerText = "Итого: " + total;
}

// SAVE
function saveOrder() {
  const order = {
    date: new Date().toLocaleString(),
    admin: state.admin,
    items: state.order
  };
  state.history.push(order);
  localStorage.setItem("history", JSON.stringify(state.history));
  alert("Сохранено");
}

// HISTORY
function openHistory() {
  view(`
    <h2>История заказов</h2>
    ${state.history.map(o => `
      <div>
        ${o.date}<br>
        ${o.admin}
      </div>
      <hr>
    `).join("")}
  `);
}

// PRODUCTS
function openProducts() {
  view(`
    <h2>Товары</h2>
    <p>Список товаров</p>
  `);
}

// START
openHome();
