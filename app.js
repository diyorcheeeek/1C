// ===============================
// HIDE KEYBOARD
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
const APP_PIN = "1234";

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
// CLIENTS (mock 1C)
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
// VIEW
// ===============================
function view(html) {
  document.getElementById("view").innerHTML = html;
}

// ===============================
// PIN LOGIN
// ===============================
function openPin() {
  view(`
    <h2 style="text-align:center">Введите PIN</h2>
    <input id="pinInput" type="password" inputmode="numeric"
      maxlength="4" style="text-align:center;font-size:24px"
      oninput="checkPin(this.value)">
    <p id="pinError" style="color:#ef4444;text-align:center"></p>
  `);
}

function checkPin(v) {
  if (v.length < 4) return;
  if (v === APP_PIN) {
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
  view(`<h2>Главный экран</h2>`);
}

// ===============================
// CREATE / EDIT
// ===============================
function openCreate(isEdit = false) {
  if (!state.isAuth) return openPin();

  view(`
    <h2>${isEdit ? "Редактирование заказа" : "Создать заказ"}</h2>

    <input id="clientInput" placeholder="Поиск клиента"
      value="${state.client || ""}"
      oninput="searchClient(this.value)">
    <div id="clientList"></div>

    <table class="table">
      <thead>
        <tr>
          <th class="col-name">Товар</th>
          <th class="col-qty">Кол</th>
          <th class="col-price">Цена</th>
        </tr>
      </thead>
      <tbody id="orderTable"></tbody>
    </table>

    <input placeholder="Добавить товар"
      onkeydown="if(event.key==='Enter'){addProduct(this.value);this.value=''}">

    <button onclick="saveOrder()">💾 Сохранить</button>
    <button onclick="printOrder()">🖨 Печать</button>
    ${isEdit ? `<button onclick="openHistory()">↩️ Назад</button>` : ""}
  `);

  renderOrder();
}

// ===============================
// CLIENT SEARCH
// ===============================
function searchClient(q) {
  const list = document.getElementById("clientList");
  if (!q) return list.innerHTML = "";
  list.innerHTML = CLIENTS.filter(c =>
    c.toLowerCase().includes(q.toLowerCase())
  ).map(c => `
    <div class="list-item" onclick="selectClient('${c}')">${c}</div>
  `).join("");
}

function selectClient(c) {
  state.client = c;
  document.getElementById("clientInput").value = c;
  document.getElementById("clientList").innerHTML = "";
}

// ===============================
// ORDER
// ===============================
function addProduct(n) {
  if (!n) return;
  state.order.push({ name: n, qty: 1, price: 0 });
  renderOrder();
}

function removeProduct(i) {
  state.order.splice(i, 1);
  renderOrder();
}

function renderOrder() {
  let total = 0;
  let rows = state.order.map((i, idx) => {
    total += i.qty * i.price;
    return `
      <tr>
        <td class="col-name">${i.name}</td>
        <td class="col-qty">
          <input type="number" value="${i.qty}"
            onchange="state.order[${idx}].qty=+this.value||0;renderOrder()">
        </td>
        <td class="col-price">
          <input type="number" value="${i.price}"
            onchange="state.order[${idx}].price=+this.value||0;renderOrder()">
          <button class="del-btn" onclick="removeProduct(${idx})">✕</button>
        </td>
      </tr>
    `;
  }).join("");

  rows += `
    <tr>
      <td class="col-name"><b>ИТОГО</b></td>
      <td></td>
      <td class="col-price"><b>${total}</b></td>
    </tr>
  `;

  document.getElementById("orderTable").innerHTML = rows;
}

// ===============================
// SAVE
// ===============================
function saveOrder() {
  const o = {
    date: new Date().toLocaleString(),
    admin: state.admin,
    client: state.client,
    items: state.order,
    total: state.order.reduce((s,i)=>s+i.qty*i.price,0)
  };

  if (state.editIndex !== null) {
    state.history[state.editIndex] = o;
    state.editIndex = null;
  } else {
    state.history.push(o);
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
    ${state.history.map((o,i)=>`
      <div class="list-item">
        <b>${o.client||"—"}</b><br>
        ${o.date}<br>
        ${o.admin} — ${o.total}
        <div style="margin-top:6px">
          <button onclick="editOrder(${i})">✏️</button>
        </div>
      </div>
    `).join("")}
  `);
}

function editOrder(i) {
  state.editIndex = i;
  const o = state.history[i];
  state.order = JSON.parse(JSON.stringify(o.items));
  state.client = o.client;
  openCreate(true);
}

// ===============================
// PRINT
// ===============================
function printOrder() {
  if (!state.order.length) return alert("Нет товаров");

  const block = document.createElement("div");
  block.innerHTML = `
    <div class="print-title">BRAND NAME</div>
    <div class="print-meta">
      ${new Date().toLocaleString()}<br>
      Админ: ${state.admin}<br>
      Клиент: ${state.client||"—"}
    </div>
    <table class="table">
      ${state.order.map(i=>`
        <tr>
          <td class="col-name">${i.name}</td>
          <td class="col-qty">${i.qty}</td>
          <td class="col-price">${i.qty*i.price}</td>
        </tr>
      `).join("")}
    </table>
    <div class="print-total">
      ИТОГО: ${state.order.reduce((s,i)=>s+i.qty*i.price,0)}
    </div>
  `;
  document.body.appendChild(block);
  window.print();
  setTimeout(()=>block.remove(),500);
}

// ===============================
// PRODUCTS
// ===============================
function openProducts() {
  if (!state.isAuth) return openPin();
  view(`<h2>Товары</h2>`);
}

// ===============================
// START
// ===============================
openPin();
