function fetchClients(q=""){
  return ["ООО Ромашка","ИП Ахмад","Склад Центр"]
    .filter(c=>c.toLowerCase().includes(q.toLowerCase()));
}
function fetchProducts(q=""){
  return [
    {name:"Товар A",stock:120},
    {name:"Товар B",stock:54}
  ].filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));
}
function sendOrderTo1C(order){
  console.log("SEND TO 1C",order);
}
 
