const listaPresentes = [
  { id: 1, nome: "Jogo de panelas", preco: 250 },
  { id: 2, nome: "Toalha de mesa", preco: 80 },
  { id: 3, nome: "Liquidificador", preco: 220 },
  { id: 4, nome: "Conjunto de pratos", preco: 180 },
  { id: 5, nome: "Aparelho de jantar", preco: 300 }
];

let itemSelecionado = null;

if (!localStorage.getItem("usuarioLogado")) {
  alert("Você precisa fazer login primeiro.");
  window.location.href = "login.html";
}

function renderizarLista() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  listaPresentes.forEach(item => {
    const reserva = JSON.parse(localStorage.getItem("reserva_" + item.id));
    const div = document.createElement("div");
    div.className = "item" + (reserva ? " reserved" : "");
    div.innerHTML = `
      <strong>${item.nome}</strong><br/>
      Preço: R$${item.preco}<br/>
      ${reserva ? `<em>Reservado por: ${reserva.nome} (${reserva.email})</em>` :
        `<button onclick="abrirModal(${item.id})">Vou comprar</button>`}
    `;
    lista.appendChild(div);
  });
}

function abrirModal(id) {
  itemSelecionado = listaPresentes.find(i => i.id === id);
  document.getElementById("nomeReserva").value = "";
  document.getElementById("emailReserva").value = "";
  document.getElementById("pagamento-opcao").classList.toggle("hidden", itemSelecionado.preco <= 200);
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

function confirmarReserva() {
  const nome = document.getElementById("nomeReserva").value;
  const email = document.getElementById("emailReserva").value;
  const pagamento = document.getElementById("pagamento").value;
  if (!nome || !email) {
    alert("Preencha nome e email.");
    return;
  }

  const reserva = { nome, email };
  if (itemSelecionado.preco > 200) reserva.pagamento = pagamento;

  localStorage.setItem("reserva_" + itemSelecionado.id, JSON.stringify(reserva));
  fecharModal();
  renderizarLista();
  gerarNotificacao(reserva);
}

function gerarNotificacao(reserva) {
  const mensagem = `Olá! ${reserva.nome} reservou o presente: ${itemSelecionado.nome} (R$${itemSelecionado.preco})`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  const emailLink = `mailto:organizador@example.com?subject=Reserva de presente&body=${encodeURIComponent(mensagem)}`;
  alert("Reserva feita com sucesso!\n\nVocê pode avisar o organizador:\n\nWhatsApp: " + whatsapp + "\nEmail: " + emailLink);
}

renderizarLista();
