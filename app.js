const tg = window.Telegram.WebApp;
tg.ready();

const ADMIN = tg.initDataUnsafe?.user?.first_name || "Unknown";

function openCreate() {
  document.getElementById('screen').innerHTML = `
    <h2>Создать заказ</h2>
    <input placeholder="Поиск клиента..." oninput="searchClient(this.value)">
    <div id="clientList"></div>

    <table class="table">
      <thead>
        <tr>
          <th>Товар</th>
          <th>Кол</th>
          <th>Цена</th>
          <th>Сумма</th>
        </tr>
      </thead>
      <tbody id="productTable"></tbody>
    </table>

    <button onclick="saveOrder()">💾 Сохранить</button>
    <button onclick="printOrder()">🖨 Печать</button>
  `;
}

function openHistory() {
  document.getElementById('screen').innerHTML = `
    <h2>История заказов</h2>
    <input placeholder="Фильтр по клиенту..." oninput="filterHistory(this.value)">
    <div id="historyList"></div>
  `;
}

function openProducts() {
  document.getElementById('screen').innerHTML = `
    <h2>Товары</h2>
    <input placeholder="Поиск..." oninput="searchProducts(this.value)">
    <table class="table">
      <thead>
        <tr><th>Название</th><th>Остаток</th></tr>
      </thead>
      <tbody id="products"></tbody>
    </table>
  `;
}
