// ===============================
// HIDE KEYBOARD (TELEGRAM SAFE)
// ===============================
document.addEventListener("click", (e) => {
  const el = e.target;
  if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") {
    document.activeElement?.blur();
  }
});

// ===============================
// TELEGRAM
// ===============================
const tg = Telegram.WebApp;
tg.ready();

// ===============================
// STATE
// ===============================
const state = {
  admin: tg.initDataUnsafe?.user?.first_name || "Unknown",
  client: null,
  order: [],
  history: JSON.parse(localStorage.getItem("history") || "[]")
};

// ===============================
// VIEW HELPER
// ===============================
function view(html) {
  document.getElementById("view").innerHTML = html;
}

// ===============================
// HOME
// ===============================
function openHome() {
  view(`
    <h2>Главный экран</h2>
    <p>Выберите действие снизу</p>
  `);
}

// ===============================
// CREATE ORDER
// ===============================
function openCreate() {
  state.order = [];
  state.client = null;

  view(`
    <h2>Создать заказ</h2>

    <input placeholder="Клиент">

    <table class="table">
      <thead>
        <tr>
          <th class="col-name">Товар</th>
          <th class="col-qty">Кол-во</th>
          <th class="col-price">Цена</th>
        </tr>
      </thead>
      <tbody id="orderTable"></tbody>
    </table>

    <input
      placeholder="Добавить товар"
      onkeydown="if(event.key==='Enter'){ addProduct(this.value); this.value=''; }"
    >

    <button onclick="saveOrder()">💾 Сохранить</button>
  `);

  renderOrder();
}

// ===============================
// ADD PRODUCT
// ===============================
function addProduct(name) {
  if (!name) return;

  state.order.push({
    name,
    qty: 1,
    price: 0
  });

  renderOrder();
}

// ===============================
// REMOVE PRODUCT
// ===============================
function removeProduct(index) {
  state.order.splice(index, 1);
  renderOrder();
}

// ===============================
// RENDER ORDER (TOTAL INSIDE TABLE)
// ===============================
function renderOrder() {
  let total = 0;

  let rows = state.order.map((item, index) => {
    total += item.qty * item.price;

    return `
      <tr>
        <td class="col-name">${item.name}</td>

        <td class="col-qty">
          <input type="number" value="${item.qty}"
            onchange="state.order[${index}].qty = +this.value || 0; renderOrder()">
        </td>

        <td class="col-price">
          <input type="number" value="${item.price}"
            onchange="state.order[${index}].price = +this.value || 0; renderOrder()">
          <button class="del-btn" onclick="removeProduct(${index})">✕</button>
        </td>
      </tr>
    `;
  }).join("");

  // итоговая строка
  rows += `
    <tr>
      <td class="col-name" style="font-weight:700;">ИТОГО</td>
      <td class="col-qty"></td>
      <td class="col-price" style="font-weight:700;">
        ${total}
      </td>
    </tr>
  `;

  document.getElementById("orderTable").innerHTML = rows;
}

// ===============================
// SAVE ORDER
// ===============================
function saveOrder() {
  const order = {
    date: new Date().toLocaleString(),
    admin: state.admin,
    items: state.order,
    total: state.order.reduce((s, i) => s + i.qty * i.price, 0)
  };

  state.history.push(order);
  localStorage.setItem("history", JSON.stringify(state.history));

  alert("Сохранено");
}

// ===============================
// HISTORY
// ===============================
function openHistory() {
  view(`
    <h2>История заказов</h2>
    ${state.history.map(o => `
      <div>
        ${o.date}<br>
        ${o.admin}<br>
        Итого: ${o.total}
      </div>
      <hr>
    `).join("")}
  `);
}

// ===============================
// PRODUCTS
// ===============================
function openProducts() {
  view(`
    <h2>Товары</h2>
    <p>Список товаров</p>
  `);
}

// ===============================
// START
// ===============================
openHome();
