// =======================
// TELEGRAM
// =======================
const tg = Telegram.WebApp;
tg.ready();

// =======================
// CONFIG
// =======================
const ADMINS = ["Авазбек", "Оятилло"];

// =======================
// STATE
// =======================
const state = {
  admin: tg.initDataUnsafe?.user?.first_name || "Unknown",
  client: null,
  order: [],
  history: JSON.parse(localStorage.getItem("history") || "[]")
};

// =======================
// API (MOCK, ПОД 1С)
// =======================
function apiClients(q=""){
  return ["ООО Ромашка","ИП Ахмад","Склад Центр"]
    .filter(c=>c.toLowerCase().includes(q.toLowerCase()));
}
function apiProducts(q=""){
  return [
    {name:"Товар A",stock:120},
    {name:"Товар B",stock:54}
  ].filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));
}
function sendTo1C(order){
  console.log("SEND 1C",order);
}

// =======================
// NAVIGATION
// =======================
function openHome(){
  view(`<h2>Главный экран</h2>`);
}
function view(html){
  document.getElementById("view").innerHTML = html;
}

// =======================
// SCREENS
// =======================
function openCreate(){
  state.order=[];
  view(`
<button onclick="openHome()">← Назад</button>

<input placeholder="Поиск клиента" oninput="searchClient(this.value)">
<div id="clients"></div>

<table class="table">
<thead><tr>
<th>Товар</th><th>Кол</th><th>Цена</th><th>Сумма</th>
</tr></thead>
<tbody id="order"></tbody>
</table>

<input placeholder="Добавить товар" oninput="addProduct(this.value)">

<div id="total">Итого: 0</div>

<button onclick="saveOrder()">💾 Сохранить</button>
<button onclick="window.print()">🖨 Печать</button>
`);
}

function openHistory(){
  view(`
<button onclick="openHome()">← Назад</button>
<input placeholder="Фильтр" oninput="filterHistory(this.value)">
<div id="history"></div>
`);
  renderHistory(state.history);
}

function openProducts(){
  view(`
<button onclick="openHome()">← Назад</button>
<input placeholder="Поиск товара" oninput="renderProducts(this.value)">
<table class="table">
<thead><tr><th>Товар</th><th>Остаток</th></tr></thead>
<tbody id="products"></tbody>
</table>
`);
  renderProducts("");
}

// =======================
// LOGIC
// =======================
function searchClient(q){
  document.getElementById("clients").innerHTML =
    apiClients(q).map(c=>`<div onclick="state.client='${c}'">${c}</div>`).join("");
}

function addProduct(q){
  const p = apiProducts(q)[0];
  if(!p) return;
  state.order.push({name:p.name,qty:1,price:0});
  renderOrder();
}

function renderOrder(){
  let total=0;
  document.getElementById("order").innerHTML =
    state.order.map((i,idx)=>{
      const sum=i.qty*i.price; total+=sum;
      return `<tr>
<td>${i.name}</td>
<td><input value="${i.qty}" onchange="state.order[${idx}].qty=+this.value;renderOrder()"></td>
<td><input value="${i.price}" onchange="state.order[${idx}].price=+this.value;renderOrder()"></td>
<td>${sum}</td>
</tr>`;
    }).join("");
  document.getElementById("total").innerText="Итого: "+total;
}

function saveOrder(){
  const order={
    date:new Date().toLocaleString(),
    admin:state.admin,
    client:state.client,
    items:state.order,
    total:state.order.reduce((s,i)=>s+i.qty*i.price,0)
  };
  state.history.push(order);
  localStorage.setItem("history",JSON.stringify(state.history));
  sendTo1C(order);
  alert("Сохранено");
}

function renderHistory(list){
  document.getElementById("history").innerHTML =
    list.map(o=>`
<div>
<b>${o.client}</b><br>
${o.date}<br>
${o.admin} — ${o.total}
</div><hr>`).join("");
}

function filterHistory(q){
  renderHistory(state.history.filter(o=>o.client?.toLowerCase().includes(q.toLowerCase())));
}

function renderProducts(q){
  document.getElementById("products").innerHTML =
    apiProducts(q).map(p=>`<tr><td>${p.name}</td><td>${p.stock}</td></tr>`).join("");
}

// =======================
openHome();
