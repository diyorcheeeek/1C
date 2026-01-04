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
// CONFIG
// ===============================
const APP_PIN = "7000"; // 🔐 4-значный PIN

// ===============================
// TELEGRAM
// ===============================
const tg = Telegram.WebApp;
tg.ready();

// ===============================
// STATE
// ===============================
const state = {
  isAuth: false,
  admin: tg.initDataUnsafe?.user?.first_name || "Unknown",
  client: null,
  order: [],
  history: JSON.parse(localStorage.getItem("history") || "[]"),
  editIndex: null
};

// ===============================
// MOCK CLIENTS
// ===============================
const CLIENTS = [
  "ООО Ромашка",
  "ИП Ахмад",
  "Магазин Центр",
  "ООО Восток",
  "ИП Каримов",
  "ТОО Almaz Trade"
];

// ===============================
// VIEW HELPER
// ===============================
function view(html) {
  document.getElementById("view").innerHTML = html;
}

// ===============================
// AUTH (PIN)
// ===============================
function openPin() {
  view(`
    <h2 style="text-align:center">Введите PIN</h2>

    <input
      id="pinInput"
      type="password"
      inputmode="numeric"
      maxlength="4"
      placeholder="••••"
      style="text-align:center;font-size:24px;letter-spacing:10px"
      oninput="checkPin(this.value)"
    >

    <p id="pinError" style="color:#ef4444;text-align:center"></p>
  `);

  setTimeout(() => {
    document.getElementById("pinInput")?.focus();
  }, 200);
}

function checkPin(value) {
  if (value.length < 4) return;

  if (value === APP_PIN) {
    state.isAuth = true;
    openHome();
  } else {
    document.getElementById("pinError").innerText = "Неверный PIN";
    document.getElementById("pinInput").value = "";
  }
}

// ===============================
// HOME
// ===============================
function openHome() {
  if (!state.isAuth) return openPin();

  view(`
    <h2>Главный экран</h2>
    <p>Выберите действие снизу</p>
  `);
}

// ===============================
// CREATE / EDIT ORDER
// ===============================
function openCreate(isEdit = false) {
  if (!state.isAuth) return openPin();

  view(`
    <h2>${isEdit ? "Редактирование заказа" : "Создать заказ"}</h2>

    <input
      id="clientInput"
      placeholder="Поиск клиента"
      value="${state.client || ""}"
      oninput="searchClient(this.value)"
      autocomplete="off"
    >
    <div id="clientList"></div>

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

    <button onclick="saveOrder()">
      💾 ${isEdit ? "Сохранить изменения" : "Сохранить"}
    </button>

    ${isEdit ? `<button onclick="openHistory()">↩️ Назад</button>` : ""}
  `);

  renderOrder();
}

// ===============================
// CLIENT SEARCH
// ===============================
function searchClient(query) {
  const list = document.getElementById("clientList");
  if (!query) return list.innerHTML = "";

  list.innerHTML = CLIENTS
    .filter(c => c.toLowerCase().includes(query.toLowerCase()))
    .map(c => `<div class="list-item" onclick="selectClient('${c}')">${c}</div>`)
    .join("");
}

function selectClient(name) {
  state.client = name;
  document.getElementById("clientInput").value = name;
  document.getElementById("clientList").innerHTML = "";
}

// ===============================
// PRODUCTS
// ===============================
function addProduct(name) {
  if (!name) return;
  state.order.push({ name, qty: 1, price: 0 });
  renderOrder();
}

function removeProduct(index) {
  state.order.splice(index, 1);
  renderOrder();
}

// ===============================
// RENDER ORDER
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
            onchange="state.order[${index}].qty=+this.value||0;renderOrder()">
        </td>
        <td class="col-price">
          <input type="number" value="${item.price}"
            onchange="state.order[${index}].price=+this.value||0;renderOrder()">
          <button class="del-btn" onclick="removeProduct(${index})">✕</button>
        </td>
      </tr>
    `;
  }).join("");

  rows += `
    <tr>
      <td class="col-name" style="font-weight:700;">ИТОГО</td>
      <td class="col-qty"></td>
      <td class="col-price" style="font-weight:700;">${total}</td>
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
    client: state.client,
    items: state.order,
    total: state.order.reduce((s, i) => s + i.qty * i.price, 0)
  };

  if (state.editIndex !== null) {
    state.history[state.editIndex] = order;
    state.editIndex = null;
  } else {
    state.history.push(order);
  }

  localStorage.setItem("history", JSON.stringify(state.history));
  openHistory();
}

// ===============================
// HISTORY
// ===============================
function openHistory() {
  if (!state.isAuth) return openPin();

  view(`
    <h2>История заказов</h2>

    ${state.history.map((o, i) => `
      <div class="list-item">
        <b>${o.client || "Без клиента"}</b><br>
        ${o.date}<br>
        ${o.admin} — ${o.total}

        <div style="margin-top:8px">
          <button onclick="editOrder(${i})">✏️ Редактировать</button>
        </div>
      </div>
    `).join("")}
  `);
}

function editOrder(index) {
  state.editIndex = index;
  const order = state.history[index];
  state.order = JSON.parse(JSON.stringify(order.items));
  state.client = order.client || null;
  openCreate(true);
}

// ===============================
// PRODUCTS
// ===============================
function openProducts() {
  if (!state.isAuth) return openPin();
  view(`<h2>Товары</h2><p>Список товаров</p>`);
}

// ===============================
// START
// ===============================
openPin();
