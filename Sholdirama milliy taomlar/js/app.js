/* ═══════════════════════════════════════
   LAZZAT OSHXONASI — app.js
   ═══════════════════════════════════════ */

const ORDERS_KEY = 'lazzat_orders';
const MENU_KEY = 'lazzat_menu';
const USER_KEY = 'lazzat_user';
const CART_KEY = 'lazzat_cart';
const MODES_KEY = 'lazzat_modes'; // { mode1:{items:[ids]}, mode2:{items:[ids]}, active:'both'|'modes' }
const THEME_KEY = 'lazzat_theme'; // 'light' | 'dark' — only set once user manually toggles

/* ── THEME (Kun/Tun) ──
   Default: automatic by time of day (19:00-06:00 = dark).
   If the user manually toggles, their choice is remembered and wins from then on. */
function getAutoTheme() {
  const h = new Date().getHours();
  return (h >= 19 || h < 6) ? 'dark' : 'light';
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved === 'light' || saved === 'dark' ? saved : getAutoTheme());
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}
initTheme();

/* ── DEMO MENU (loaded once if localStorage empty) ── */
const DEFAULT_MENU = [
  {id:1, name:"Qo'y go'shti shashlik", desc:"Tabiatda pishirilgan, ziravorli o'zbek shashlik", price:45000, cat:"shashlik", img:"", badge:"popular"},
  {id:2, name:"Mol go'shti shashlik", desc:"Tanlov mol go'shtidan tayyorlangan, yumshoq", price:40000, cat:"shashlik", img:"", badge:""},
  {id:3, name:"Tovuq shashlik", desc:"Marinadlangan tovuq go'shti, dieta uchun", price:32000, cat:"shashlik", img:"", badge:""},
  {id:4, name:"Baliq shashlik", desc:"Lososdan tayyorlangan, limon va ziravorlar bilan", price:55000, cat:"shashlik", img:"", badge:"hot"},
  {id:5, name:"Jigar shashlik", desc:"Yangi jigardan, piyoz va pomidor bilan", price:28000, cat:"shashlik", img:"", badge:""},
  {id:6, name:"Qozonkabob", desc:"Qozonda pishirilgan qo'y go'shti", price:48000, cat:"shashlik", img:"", badge:"popular"},
  {id:7, name:"Go'shtli somsa", desc:"Tandir somsasi, qo'y go'shti va piyoz bilan", price:8000, cat:"somsa", img:"", badge:"popular"},
  {id:8, name:"Karam somsa", desc:"Yangi karam va sabzavotli vegetarian somsa", price:6000, cat:"somsa", img:"", badge:""},
  {id:9, name:"Kartoshkali somsa", desc:"Mazali kartoshka va ziravorlar bilan", price:6500, cat:"somsa", img:"", badge:""},
  {id:10, name:"Norin somsa", desc:"Yangi go'shtli katta hajmli somsa", price:10000, cat:"somsa", img:"", badge:"hot"},
  {id:11, name:"Qovoqli somsa", desc:"Shirin qovoq va yong'oq bilan", price:7000, cat:"somsa", img:"", badge:""},
  {id:12, name:"Piyozli somsa", desc:"Yangi piyoz va kunjut urug'i bilan", price:5500, cat:"somsa", img:"", badge:""},
  {id:13, name:"O'zbek oshi", desc:"Klassik o'zbek palovi, ziravorlar bilan", price:35000, cat:"ovqat", img:"", badge:"popular"},
  {id:14, name:"Lagmon", desc:"Qo'lda tortilgan lagmon, go'shtli sho'rva", price:28000, cat:"ovqat", img:"", badge:"hot"},
  {id:15, name:"Manti", desc:"Bugda pishirilgan go'shtli manti, qatiq bilan", price:30000, cat:"ovqat", img:"", badge:""},
  {id:16, name:"Chuchvara", desc:"Kichik dumpling, go'shtli sho'rva yoki qovurilgan",price:25000, cat:"ovqat", img:"", badge:""},
  {id:17, name:"Dimlama", desc:"Sabzavotli go'shtli dim ovqat", price:32000, cat:"ovqat", img:"", badge:""},
  {id:18, name:"Mastava", desc:"Guruchli sho'rva, go'sht va sabzavotlar bilan", price:22000, cat:"ovqat", img:"", badge:""},
  {id:19, name:"Shurpa", desc:"Go'shtli klassik qo'zi sho'rvasi", price:26000, cat:"ovqat", img:"", badge:""},
  {id:20, name:"Norin", desc:"Qo'y go'shti bilan tayyorlangan milliy taom", price:30000, cat:"ovqat", img:"", badge:"popular"},
  {id:21, name:"Kompot", desc:"Mevali uy kompoti, sovuq", price:8000, cat:"ichimlik", img:"", badge:""},
  {id:22, name:"Ayron", desc:"Tabiiy sut ayron", price:7000, cat:"ichimlik", img:"", badge:"popular"},
  {id:23, name:"Ko'k choy", desc:"O'zbek ko'k choy, tabiiy o'tlar bilan", price:5000, cat:"ichimlik",img:"", badge:""},
  {id:24, name:"Qora choy", desc:"Shakar bilan qora choy", price:5000, cat:"ichimlik", img:"", badge:""},
  {id:25, name:"Limonad", desc:"Tabiiy limon va na'matak limonad", price:10000, cat:"ichimlik", img:"", badge:"hot"},
  {id:26, name:"Mineral suv", desc:"Toza tog' suvi", price:5000, cat:"ichimlik", img:"", badge:""},
  {id:27, name:"Chak-chak", desc:"Asal va yong'oqli milliy desert", price:15000, cat:"desert", img:"", badge:"popular"},
  {id:28, name:"Halva", desc:"Zaytun moyida tayyorlangan halva", price:12000, cat:"desert", img:"", badge:""},
  {id:29, name:"Pishiriq", desc:"Uyda pishirilgan yog'li pishiriqlar", price:8000, cat:"desert", img:"", badge:""},
  {id:30, name:"Navvot", desc:"Kristall qand, choy uchun", price:9000, cat:"desert", img:"", badge:""},
  {id:31, name:"Tandir non", desc:"Tandirda pishirilgan issiq non", price:5000, cat:"non", img:"", badge:"popular"},
  {id:32, name:"Patir non", desc:"Kunjut urug'i bilan bezatilgan non", price:6000, cat:"non", img:"", badge:""},
  {id:33, name:"Lavash", desc:"Ingichka yumshoq lavash", price:4000, cat:"non", img:"", badge:""},
  {id:34, name:"Gijda", desc:"Kichik dumaloq tandir noni", price:3000, cat:"non", img:"", badge:""},
];

function initMenu() {
  if (!localStorage.getItem(MENU_KEY))
    localStorage.setItem(MENU_KEY, JSON.stringify(DEFAULT_MENU));
}
function getMenu() { return JSON.parse(localStorage.getItem(MENU_KEY) || '[]'); }
function getOrders() { return JSON.parse(localStorage.getItem(ORDERS_KEY)|| '[]'); }
function getModes() {
  return JSON.parse(localStorage.getItem(MODES_KEY) || JSON.stringify({
    active: 'both',
    mode1: { label: '1-Rejim (06:00–14:00)', items: [] },
    mode2: { label: '2-Rejim (14:00–23:00)', items: [] }
  }));
}

/* ── ACTIVE MODE helper ──
   Returns: 'mode1' | 'mode2' | 'both'
   Checks current hour against 06-14 / 14-23 */
function getCurrentModeKey() {
  const modes = getModes();
  if (modes.active === 'both') return 'both';
  const h = new Date().getHours();
  if (h >= 6 && h < 14) return 'mode1';
  if (h >= 14 && h < 23) return 'mode2';
  return 'both'; // outside hours → all available
}

/* Is this item available in the current time slot? */
function isItemAvailable(item) {
  const modes = getModes();
  if (modes.active !== 'modes') return true;
  const modeKey = getCurrentModeKey();
  if (modeKey === 'both') return true; // outside 06:00-23:00 → show everything
  const m1 = modes.mode1?.items || [];
  const m2 = modes.mode2?.items || [];
  const assignedToAny = m1.includes(item.id) || m2.includes(item.id);
  if (!assignedToAny) return true; // item not assigned to any mode → always available
  const currentList = modeKey === 'mode1' ? m1 : m2;
  return currentList.includes(item.id);
}

/* ── STATE ── */
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
let user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
let catFilter = 'all';
let searchVal = '';
let payMethod = 'cash';

/* ── PENDING OTP (client-side demo auth — no real backend) ── */
let pendingOTP = '';
let pendingUser = null;
let pendingCheckout = false; // true if user tried to checkout while logged out

/* ════════════════════════════════
   RENDER MENU
════════════════════════════════ */
function renderMenu() {
  const menu = getMenu();
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  let items = catFilter === 'all' ? menu : menu.filter(i => i.cat === catFilter);
  if (searchVal.trim()) {
    const q = searchVal.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
  }

  if (!items.length) {
    grid.innerHTML = `<div class="menu-empty"><p>Hech narsa topilmadi</p></div>`;
    return;
  }

  grid.innerHTML = items.map(item => {
    const available = isItemAvailable(item);
    const imgHtml = item.img
      ? `<img src="${item.img}" alt="${item.name}" loading="lazy">`
      : `<span class="card-fallback">${item.name.charAt(0).toUpperCase()}</span>`;
    const badgeHtml = item.badge === 'popular'
      ? `<span class="card-badge badge-popular">Mashhur</span>`
      : item.badge === 'hot'
      ? `<span class="card-badge badge-hot">Tavsiya</span>`
      : item.badge === 'new'
      ? `<span class="card-badge badge-new">Yangi</span>`
      : '';
    const soldOutOverlay = !available
      ? `<div class="sold-out-overlay"><span>Hozir mavjud emas</span></div>` : '';

    return `
      <div class="menu-card${!available ? ' unavailable' : ''}">
        <div class="card-img-wrap">
          ${imgHtml}${badgeHtml}${soldOutOverlay}
        </div>
        <div class="card-body">
          <div class="card-name">${item.name}</div>
          <div class="card-desc">${item.desc}</div>
          <div class="card-footer">
            <div class="card-price">${item.price.toLocaleString()} <small>so'm</small></div>
            ${available
              ? `<button class="add-btn" onclick="addToCart(${item.id})">+</button>`
              : `<button class="add-btn" style="background:var(--gray-2);cursor:not-allowed" disabled>&times;</button>`
            }
          </div>
        </div>
      </div>`;
  }).join('');
}

function switchTab(btn, cat) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  catFilter = cat;
  renderMenu();
}
function filterSearch(val) {
  searchVal = val;
  renderMenu();
}

/* ════════════════════════════════
   CART
════════════════════════════════ */
function addToCart(id) {
  const item = getMenu().find(i => i.id === id);
  if (!item || !isItemAvailable(item)) return;
  const ex = cart.find(i => i.id === id);
  if (ex) ex.qty++;
  else cart.push({ id: item.id, name: item.name, price: item.price, img: item.img, cat: item.cat, qty: 1 });
  saveCart(); updateCartUI();
  showToast(`${item.name} savatga qo'shildi`);
}
function changeQty(id, d) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;
  cart[idx].qty += d;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart(); updateCartUI();
}
function removeFromCart(id) { cart = cart.filter(i => i.id !== id); saveCart(); updateCartUI(); }
function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = count;
  const tv = document.getElementById('cart-total-val');
  if (tv) tv.textContent = total.toLocaleString() + " so'm";

  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');
  if (!body) return;

  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty"><p>Savatcha bo'sh</p></div>`;
    if (foot) foot.style.display = 'none';
    return;
  }
  body.innerHTML = cart.map(item => {
    const thumb = item.img
      ? `<div class="ci-thumb"><img src="${item.img}" alt="${item.name}"></div>`
      : `<div class="ci-thumb">${item.name.charAt(0).toUpperCase()}</div>`;
    return `<div class="cart-item">
      ${thumb}
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">${(item.price*item.qty).toLocaleString()} so'm</div>
        <div class="ci-controls">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
          <button class="btn-remove" onclick="removeFromCart(${item.id})">Olib tashlash</button>
        </div>
      </div></div>`;
  }).join('');
  if (foot) foot.style.display = 'block';
}

function toggleCart() {
  document.getElementById('cart-panel').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}

/* ════════════════════════════════
   CHECKOUT (naqd yoki yetkazib berganda POS-terminal —
   saytda hech qanday karta raqami/CVV so'ralmaydi)
════════════════════════════════ */
function openCheckout() {
  if (!cart.length) { showToast("Savat bo'sh!"); return; }

  // Buyurtma berishdan oldin ro'yxatdan o'tish/kirish shart
  if (!user) {
    toggleCart();
    pendingCheckout = true;
    showToast("Buyurtma berish uchun avval ro'yxatdan o'ting yoki kiring!");
    openAuthModal('login');
    const note = document.getElementById('auth-checkout-note');
    if (note) note.style.display = 'block';
    return;
  }

  toggleCart();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const list = document.getElementById('order-summary-list');
  if (list) list.innerHTML = cart.map(i =>
    `<div class="os-row"><span>${i.name} × ${i.qty}</span><span>${(i.price*i.qty).toLocaleString()} so'm</span></div>`
  ).join('');
  const tf = document.getElementById('order-total-final');
  if (tf) tf.textContent = total.toLocaleString() + " so'm";
  if (user) {
    const ph = document.getElementById('delivery-phone');
    if (ph && user.phone) ph.value = user.phone;
  }
  selectPayment(document.querySelector('.pay-btn[data-pay="cash"]'), 'cash');
  openModal('checkout-modal');
}

function selectPayment(btn, method) {
  if (!btn) return;
  document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  payMethod = method;
  document.getElementById('pay-note-cash')?.classList.toggle('show', method === 'cash');
  document.getElementById('pay-note-pos')?.classList.toggle('show', method === 'pos');
}

function confirmOrder() {
  const addr = document.getElementById('delivery-address').value.trim();
  const phone = document.getElementById('delivery-phone').value.trim();
  const note = document.getElementById('delivery-note').value.trim();
  if (!addr) { showToast("Manzilni kiriting!"); return; }
  if (!phone) { showToast("Telefon raqamni kiriting!"); return; }
  if (!cart.length) { showToast("Savat bo'sh!"); return; }

  const total = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const order = {
    id: 'ZAK-' + Date.now(),
    date: new Date().toISOString(),
    customer: user ? user.name : 'Mehmon',
    phone, address: addr, note,
    payment: payMethod, // 'cash' | 'pos' — no card data ever stored
    items: cart.map(i => ({id:i.id,name:i.name,qty:i.qty,price:i.price,img:i.img,cat:i.cat})),
    total,
    status: 'new'
  };
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  cart = []; saveCart(); updateCartUI();
  ['delivery-address','delivery-phone','delivery-note'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  closeModal('checkout-modal');

  document.getElementById('success-order-id').textContent = order.id;
  document.getElementById('success-order-total').textContent = total.toLocaleString() + " so'm";
  openModal('success-modal');
}

/* ════════════════════════════════
   AUTH — demo OTP (client-side only, no real backend)
════════════════════════════════ */
function openAuthModal(tab) {
  openModal('auth-modal');
  if (tab) switchAuthTab(tab);
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  if (!email || !pass) { showToast("Barcha maydonlarni to'ldiring!"); return; }
  if (pass.length < 6) { showToast("Parol kamida 6 ta belgi!"); return; }
  loginUser({ email, name: email.split('@')[0], avatar: email[0].toUpperCase() });
}

function doRegister() {
  const method = document.getElementById('reg-method-value').value || 'email';
  const name = document.getElementById('reg-name').value.trim();
  const pass = document.getElementById('reg-password').value;

  if (!name) { showToast("Ismingizni kiriting!"); return; }
  if (pass.length < 6) { showToast("Parol kamida 6 ta belgi!"); return; }

  if (method === 'email') {
    const email = document.getElementById('reg-email').value.trim();
    if (!email || !email.includes('@')) { showToast("Email to'g'ri emas!"); return; }
    pendingUser = { email, name, avatar: name[0].toUpperCase() };
  } else {
    const phone = document.getElementById('reg-phone-field').value.trim();
    if (!phone || phone.length < 9) { showToast("Telefon raqamni to'g'ri kiriting!"); return; }
    pendingUser = { phone, name, email: phone + '@lazzat.uz', avatar: name[0].toUpperCase() };
  }

  pendingOTP = String(Math.floor(1000 + Math.random() * 9000));

  if (method === 'email') {
    simulateSendEmail(pendingUser.email, pendingOTP);
    document.getElementById('otp-destination').textContent = pendingUser.email;
    document.getElementById('otp-dest-label').textContent = 'Emailingizga kod yuborildi:';
  } else {
    simulateSendSMS(pendingUser.phone, pendingOTP);
    document.getElementById('otp-destination').textContent = pendingUser.phone;
    document.getElementById('otp-dest-label').textContent = 'Telefon raqamingizga SMS kod yuborildi:';
  }

  document.getElementById('otp-input').value = '';
  showOTPScreen();
}

function simulateSendEmail(email, code) {
  console.log(`[EMAIL → ${email}] Tasdiqlash kodi: ${code}`);
  showToast(`Demo: Kod → ${code} (${email})`);
}
function simulateSendSMS(phone, code) {
  console.log(`[SMS → ${phone}] Tasdiqlash kodi: ${code}`);
  showToast(`Demo: SMS kod → ${code} (${phone})`);
}

function showOTPScreen() {
  document.getElementById('auth-main-body').style.display = 'none';
  document.getElementById('auth-otp-body').style.display = 'block';
}
function hideOTPScreen() {
  document.getElementById('auth-main-body').style.display = 'block';
  document.getElementById('auth-otp-body').style.display = 'none';
}

function verifyOTP() {
  const entered = document.getElementById('otp-input').value.trim();
  if (entered.length !== 4) { showToast("4 ta raqam kiriting!"); return; }
  if (entered !== pendingOTP) { showToast("Kod noto'g'ri! Qaytadan urinib ko'ring."); return; }
  loginUser(pendingUser);
  hideOTPScreen();
  showToast(`Muvaffaqiyatli ro'yxatdan o'tdingiz!`);
}

function resendOTP() {
  if (!pendingUser) return;
  pendingOTP = String(Math.floor(1000 + Math.random() * 9000));
  if (pendingUser.email && !pendingUser.email.endsWith('@lazzat.uz')) {
    simulateSendEmail(pendingUser.email, pendingOTP);
  } else {
    simulateSendSMS(pendingUser.phone || pendingUser.email, pendingOTP);
  }
  showToast('Yangi kod yuborildi!');
}

function toggleRegMethod(method) {
  document.getElementById('reg-method-value').value = method;
  document.getElementById('reg-email-fields').style.display = method === 'email' ? 'block' : 'none';
  document.getElementById('reg-phone-fields').style.display = method === 'phone' ? 'block' : 'none';
  document.getElementById('rmb-email').classList.toggle('active', method === 'email');
  document.getElementById('rmb-phone').classList.toggle('active', method === 'phone');
}

function loginUser(u) {
  user = u;
  localStorage.setItem(USER_KEY, JSON.stringify(u));
  updateAuthUI();
  closeModal('auth-modal');
  const note = document.getElementById('auth-checkout-note');
  if (note) note.style.display = 'none';
  showToast(`Xush kelibsiz, ${u.name}!`);

  // Agar avval buyurtma berishga urinib, kirish so'ralgan bo'lsa — endi checkout'ni ochamiz
  if (pendingCheckout) {
    pendingCheckout = false;
    if (cart.length) openCheckout();
  }
}
function logout() {
  user = null;
  localStorage.removeItem(USER_KEY);
  updateAuthUI();
  showToast("Chiqdingiz");
}

function updateAuthUI() {
  const area = document.getElementById('auth-area');
  if (!area) return;
  if (user) {
    area.innerHTML = `<div class="user-chip">
      <div class="user-avatar">${user.avatar}</div>
      <span style="max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${user.name}</span>
      <button class="btn-auth" onclick="logout()" style="font-size:.76rem;padding:.3rem .7rem">Chiqish</button>
    </div>`;
  } else {
    area.innerHTML = `<button class="btn-auth" onclick="openAuthModal()">Kirish</button>`;
  }
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-tab="${tab}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
  hideOTPScreen();
}

/* ════════════════════════════════
   MODAL UTILS
════════════════════════════════ */
function openModal(id) { const el=document.getElementById(id); if(el) el.classList.add('open'); }
function closeModal(id) {
  const el=document.getElementById(id); if(el) el.classList.remove('open');
  if (id === 'auth-modal') {
    pendingCheckout = false;
    const note = document.getElementById('auth-checkout-note');
    if (note) note.style.display = 'none';
  }
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});

/* ════════════════════════════════
   MOBILE NAV
════════════════════════════════ */
function toggleMobileNav() {
  document.getElementById('mobile-nav')?.classList.toggle('open');
}

/* ════════════════════════════════
   TOAST
════════════════════════════════ */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ════════════════════════════════
   MODE BANNER
════════════════════════════════ */
function updateModeBanner() {
  const modes = getModes();
  const banner = document.getElementById('mode-banner');
  if (!banner) return;
  if (modes.active === 'both') { banner.style.display = 'none'; return; }

  const modeKey = getCurrentModeKey();

  if (modeKey === 'both') {
    banner.style.display = 'flex';
    banner.textContent = 'Oshxona yopiq vaqt. Ish vaqti: 06:00–23:00';
    banner.style.background = '#4B5563';
    return;
  }

  const m1items = modes.mode1?.items || [];
  const m2items = modes.mode2?.items || [];

  if (modeKey === 'mode1' && m1items.length > 0) {
    banner.style.display = 'flex';
    banner.textContent = '1-Rejim faol (06:00–14:00)';
    banner.style.background = 'var(--red-dark)';
    return;
  }
  if (modeKey === 'mode2' && m2items.length > 0) {
    banner.style.display = 'flex';
    banner.textContent = '2-Rejim faol (14:00–23:00)';
    banner.style.background = 'var(--red-dark)';
    return;
  }
  banner.style.display = 'none';
}

/* ════════════════════════════════
   BOOT
════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  renderMenu();
  updateCartUI();
  updateAuthUI();
  updateModeBanner();

  setInterval(() => { updateModeBanner(); renderMenu(); }, 60000);
  setInterval(() => { if (!localStorage.getItem(THEME_KEY)) applyTheme(getAutoTheme()); }, 60000);

  // Admin panelda rejim/menyu o'zgarsa, ochiq bo'lgan mijoz sahifasi darhol yangilanadi
  window.addEventListener('storage', (e) => {
    if (e.key === MODES_KEY || e.key === MENU_KEY) { updateModeBanner(); renderMenu(); }
  });
});