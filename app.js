// CONFIGURAÇÕES
const GENERIC_PASSWORD = 'cha2025';
const ORGANIZER_WHATSAPP = '55NUMERODOBRASIL'; // ex: '5511999998888' (inclua código do país sem +)
const ORGANIZER_EMAIL = 'seuemail@dominio.com'; // email do organizador usado no mailto

// Se quiser usar Firebase em vez de localStorage, coloque USE_FIREBASE = true e configure firebaseConfig
const USE_FIREBASE = false;
const firebaseConfig = {
  // apiKey: "...",
  // authDomain: "...",
  // projectId: "...",
  // ...
};

let currentUser = null;
let items = [];

// Exemplo de itens iniciais
const SAMPLE_ITEMS = [
  {id:'i1', name:'Conjunto de Panelas', price:230, reserved:false},
  {id:'i2', name:'Jogo de Taças (6)', price:120, reserved:false},
  {id:'i3', name:'Conjunto de Talheres', price:180, reserved:false},
  {id:'i4', name:'Máquina de Café', price:420, reserved:false},
  {id:'i5', name:'Avental Personalizado', price:80, reserved:false}
];

// DOM
const loginScreen = document.getElementById('loginScreen');
const mainApp = document.getElementById('mainApp');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const itemsEl = document.getElementById('items');

// Modal
const overlay = document.getElementById('overlay');
const modal = document.querySelector('.modal');
const modalTitle = document.getElementById('modalTitle');
const resName = document.getElementById('resName');
const resEmail = document.getElementById('resEmail');
const payChoice = document.getElementById('payChoice');
const btnCancel = document.getElementById('btnCancel');
const btnConfirm = document.getElementById('btnConfirm');

let editingItem = null;

// LOGIN
btnLogin.addEventListener('click', ()=>{
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  if(!email){ alert('Insira um email'); return; }
  if(pass !== GENERIC_PASSWORD){ alert('Senha incorreta'); return; }
  currentUser = { email };
  localStorage.setItem('cha_user_email', email);
  loginScreen.classList.add('hidden');
  mainApp.classList.remove('hidden');
  loadItems();
});

btnLogout.addEventListener('click', ()=>{
  currentUser = null;
  loginScreen.classList.remove('hidden');
  mainApp.classList.add('hidden');
});

// PERSISTÊNCIA (localStorage por defeito)
function saveState(){
  if(USE_FIREBASE){
    // Aqui poderia gravar para Firestore — código não incluso neste exemplo.
    console.warn('USE_FIREBASE=true mas Firebase não está inicializado neste exemplo.');
    return;
  }
  localStorage.setItem('cha_items', JSON.stringify(items));
}

function loadItems(){
  if(USE_FIREBASE){
    // Integração opcional com Firebase: buscar items via Firestore
    console.warn('USE_FIREBASE=true mas Firebase não está inicializado neste exemplo.');
    items = SAMPLE_ITEMS;
    renderItems();
    return;
  }
  const raw = localStorage.getItem('cha_items');
  if(raw){
    try{ items = JSON.parse(raw); }
    catch(e){ items = SAMPLE_ITEMS; }
  } else {
    items = SAMPLE_ITEMS;
  }
  renderItems();
}

function renderItems(){
  itemsEl.innerHTML = '';
  items.forEach(it=>{
    const div = document.createElement('div');
    div.className = 'item card';
    const title = document.createElement('h3'); title.textContent = it.name;
    const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = 'Preço: R$ ' + Number(it.price).toFixed(2);
    div.appendChild(title);
    div.appendChild(meta);

    if(it.reserved){
      const r = document.createElement('div'); r.className = 'reserved-by';
      r.innerHTML = `<strong>Reservado por:</strong><br>${escapeHtml(it.reservedBy.name)}<br><a href="mailto:${escapeHtml(it.reservedBy.email)}">${escapeHtml(it.reservedBy.email)}</a>`;
      if(it.reservedBy.paidAs) r.innerHTML += `<div class="muted small">Pagamento: ${escapeHtml(it.reservedBy.paidAs)}</div>`;
      div.appendChild(r);
    }

    const btn = document.createElement('button');
    btn.textContent = it.reserved ? 'Reservado' : 'Vou comprar';
    btn.disabled = !!it.reserved;
    btn.addEventListener('click', ()=> openModalFor(it));
    div.appendChild(btn);

    itemsEl.appendChild(div);
  });
}

function openModalFor(item){
  if(item.reserved){ alert('Item já reservado'); return; }
  editingItem = item;
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
  modalTitle.textContent = 'Reservar: ' + item.name;
  resEmail.value = currentUser ? currentUser.email : '';
  resName.value = '';
  if(Number(item.price) > 200) payChoice.classList.remove('hidden'); else payChoice.classList.add('hidden');
}

// modal actions
btnCancel.addEventListener('click', ()=> {
  overlay.classList.add('hidden');
  modal.classList.add('hidden');
  editingItem = null;
});

btnConfirm.addEventListener('click', ()=> {
  const name = resName.value.trim();
  const email = resEmail.value.trim();
  if(!name || !email){ alert('Preencha nome e email'); return; }
  const paidAsEl = document.querySelector('input[name="paidAs"]:checked');
  const paidAs = paidAsEl ? paidAsEl.value : null;

  // Marca reservado
  editingItem.reserved = true;
  editingItem.reservedBy = { name, email, paidAs };
  saveState();
  overlay.classList.add('hidden');
  modal.classList.add('hidden');
  renderItems();

  // Pergunta se quer notificar via WhatsApp (abre link)
  const waText = encodeURIComponent(`Olá! ${name} (${email}) reservou o item: ${editingItem.name}${paidAs ? ' — Pagamento: '+paidAs : ''}`);
  const waLink = `https://wa.me/${ORGANIZER_WHATSAPP}?text=${waText}`;

  if(confirm('Reserva confirmada! Deseja abrir o WhatsApp para notificar o organizador?')) {
    window.open(waLink, '_blank');
    return;
  }
  // ou oferecer mailto
  if(confirm('Deseja enviar um email rápido para o organizador?')) {
    const subject = encodeURIComponent('Reserva: '+editingItem.name);
    const body = encodeURIComponent('Nome: '+name+'\nEmail: '+email+'\nItem: '+editingItem.name+'\nPagamento: '+(paidAs||'—'));
    window.location.href = `mailto:${ORGANIZER_EMAIL}?subject=${subject}&body=${body}`;
  }
  editingItem = null;
});

// helper
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
