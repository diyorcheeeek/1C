const tg = Telegram.WebApp;
tg.ready();

const store = {
  admin: tg.initDataUnsafe?.user?.first_name || "Unknown",
  client: null,
  order: [],
  history: JSON.parse(localStorage.getItem("history") || "[]")
};

function saveHistory(){
  localStorage.setItem("history", JSON.stringify(store.history));
}
