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

    <p id="total">Итого: 0</p>

    <button onclick="saveOrder()">💾 Сохранить</button>
  `);
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
// RENDER ORDER
// ===============================
function renderOrder() {
  let total = 0;

  document.getElementById("orderTable").innerHTML =
    state.order.map((item, index) => {
      total += item.qty * item.price;

      return `
        <tr>
          <td class="col-name">${item.name}</td>

          <td class="col-qty">
            <input type="number" value="${item.qty}"
              onchange="state.order[${index}].qty = +this.value || 0; renderOrder()">
          </td>

          <td class="col-price">
            <div style="display:flex;align-items:center;gap:6px;">
              <input type="number" value="${item.price}"
                onchange="state.order[${index}].price = +this.value || 0; renderOrder()">
              <button class="del-btn" onclick="removeProduct(${index})">✕</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

  document.getElementById("total").innerText = "Итого: " + total;
}

// ===============================
// SAVE ORDER
// ===============================
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

// ===============================
// HISTORY
// ===============================
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
