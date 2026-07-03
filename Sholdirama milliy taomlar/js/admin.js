/* ═══════════════════════════════════════
   LAZZAT ADMIN — admin.js
   ═══════════════════════════════════════ */

// ── CONSTANTS ──
const OK = 'lazzat_orders';
const MK = 'lazzat_menu';
const MDK = 'lazzat_modes';
const AE = 'admin@lazzat.uz';
const AP = 'admin123';

const SL = {new:'Yangi',confirmed:'Tasdiqlangan',cooking:'Tayyorlanmoqda',delivering:'Yetkazilmoqda',done:'Bajarildi',cancelled:'Bekor'};
const PL = {cash:'Naqd', pos:'Karta (POS)'};

const THEME_KEY = 'lazzat_theme';
function getAutoTheme(){const h=new Date().getHours();return (h>=19||h<6)?'dark':'light';}
function applyTheme(t){document.documentElement.setAttribute('data-theme',t);}
function initTheme(){const s=localStorage.getItem(THEME_KEY);applyTheme(s==='light'||s==='dark'?s:getAutoTheme());}
function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';
  const next=cur==='dark'?'light':'dark';
  localStorage.setItem(THEME_KEY,next); applyTheme(next);
}
initTheme();
setInterval(()=>{ if(!localStorage.getItem(THEME_KEY)) applyTheme(getAutoTheme()); }, 60000);

const DEFAULT_MENU = [
  {id:1,name:"Qo'y go'shti shashlik",desc:"Tabiatda pishirilgan, ziravorli shashlik",price:45000,cat:"shashlik",img:"",badge:"popular"},
  {id:2,name:"Mol go'shti shashlik",desc:"Yumshoq va mazali",price:40000,cat:"shashlik",img:"",badge:""},
  {id:3,name:"Tovuq shashlik",desc:"Marinadlangan tovuq go'shti",price:32000,cat:"shashlik",img:"",badge:""},
  {id:4,name:"Baliq shashlik",desc:"Lososdan tayyorlangan",price:55000,cat:"shashlik",img:"",badge:"hot"},
  {id:5,name:"Jigar shashlik",desc:"Yangi jigardan",price:28000,cat:"shashlik",img:"",badge:""},
  {id:6,name:"Qozonkabob",desc:"Qozonda pishirilgan",price:48000,cat:"shashlik",img:"",badge:"popular"},
  {id:7,name:"Go'shtli somsa",desc:"Tandir somsasi",price:8000,cat:"somsa",img:"",badge:"popular"},
  {id:8,name:"Karam somsa",desc:"Vegetarian somsa",price:6000,cat:"somsa",img:"",badge:""},
  {id:9,name:"Kartoshkali somsa",desc:"Kartoshkali mazali",price:6500,cat:"somsa",img:"",badge:""},
  {id:10,name:"Norin somsa",desc:"Katta hajmli",price:10000,cat:"somsa",img:"",badge:"hot"},
  {id:11,name:"Qovoqli somsa",desc:"Shirin qovoqli",price:7000,cat:"somsa",img:"",badge:""},
  {id:12,name:"Piyozli somsa",desc:"Yangi piyozli",price:5500,cat:"somsa",img:"",badge:""},
  {id:13,name:"O'zbek oshi",desc:"Klassik palov",price:35000,cat:"ovqat",img:"",badge:"popular"},
  {id:14,name:"Lagmon",desc:"Qo'lda tortilgan",price:28000,cat:"ovqat",img:"",badge:"hot"},
  {id:15,name:"Manti",desc:"Bugda pishirilgan",price:30000,cat:"ovqat",img:"",badge:""},
  {id:16,name:"Chuchvara",desc:"Kichik dumpling",price:25000,cat:"ovqat",img:"",badge:""},
  {id:17,name:"Dimlama",desc:"Sabzavotli dim",price:32000,cat:"ovqat",img:"",badge:""},
  {id:18,name:"Mastava",desc:"Guruchli sho'rva",price:22000,cat:"ovqat",img:"",badge:""},
  {id:19,name:"Shurpa",desc:"Qo'zi sho'rvasi",price:26000,cat:"ovqat",img:"",badge:""},
  {id:20,name:"Norin",desc:"Milliy taom",price:30000,cat:"ovqat",img:"",badge:"popular"},
  {id:21,name:"Kompot",desc:"Mevali kompot",price:8000,cat:"ichimlik",img:"",badge:""},
  {id:22,name:"Ayron",desc:"Tabiiy ayron",price:7000,cat:"ichimlik",img:"",badge:"popular"},
  {id:23,name:"Ko'k choy",desc:"O'zbek choy",price:5000,cat:"ichimlik",img:"",badge:""},
  {id:24,name:"Qora choy",desc:"Qora choy",price:5000,cat:"ichimlik",img:"",badge:""},
  {id:25,name:"Limonad",desc:"Tabiiy limonad",price:10000,cat:"ichimlik",img:"",badge:"hot"},
  {id:26,name:"Mineral suv",desc:"Toza suv",price:5000,cat:"ichimlik",img:"",badge:""},
  {id:27,name:"Chak-chak",desc:"Asalli desert",price:15000,cat:"desert",img:"",badge:"popular"},
  {id:28,name:"Halva",desc:"Tabiiy halva",price:12000,cat:"desert",img:"",badge:""},
  {id:29,name:"Pishiriq",desc:"Uyda pishirilgan",price:8000,cat:"desert",img:"",badge:""},
  {id:30,name:"Navvot",desc:"Kristall qand",price:9000,cat:"desert",img:"",badge:""},
  {id:31,name:"Tandir non",desc:"Issiq tandir non",price:5000,cat:"non",img:"",badge:"popular"},
  {id:32,name:"Patir non",desc:"Kunjutli non",price:6000,cat:"non",img:"",badge:""},
  {id:33,name:"Lavash",desc:"Yumshoq lavash",price:4000,cat:"non",img:"",badge:""},
  {id:34,name:"Gijda",desc:"Kichik tandir noni",price:3000,cat:"non",img:"",badge:""},
];

// ── STATE ──
let fil = 'all', mcat = 'all';
let editId = null, imgB64 = '', curBadge = 'popular';
let autoT = null, lastNew = 0;

// ── DATA ──
function getOrders(){ return JSON.parse(localStorage.getItem(OK)||'[]'); }
function saveOrders(o){ localStorage.setItem(OK,JSON.stringify(o)); }
function getMenu(){
  if(!localStorage.getItem(MK)) localStorage.setItem(MK,JSON.stringify(DEFAULT_MENU));
  return JSON.parse(localStorage.getItem(MK)||'[]');
}
function saveMenu(m){ localStorage.setItem(MK,JSON.stringify(m)); }
function getModes(){
  return JSON.parse(localStorage.getItem(MDK)||JSON.stringify({active:'both',mode1:{items:[]},mode2:{items:[]}}));
}
function saveModes(m){ localStorage.setItem(MDK,JSON.stringify(m)); }

// ── LOGIN ──
function doLogin(){
  const e=document.getElementById('ae').value.trim();
  const p=document.getElementById('ap').value;
  const err=document.getElementById('lerr');
  if(e===AE && p===AP){
    sessionStorage.setItem('adm','1');
    document.getElementById('ls').style.display='none';
    document.getElementById('as').style.display='block';
    refreshAll(); startAR();
  } else {
    err.style.display='block';
    setTimeout(()=>err.style.display='none',3000);
  }
}
function doLogout(){
  sessionStorage.removeItem('adm');
  stopAR();
  document.getElementById('as').style.display='none';
  document.getElementById('ls').style.display='flex';
}

// ── AUTO REFRESH (poll for new orders) ──
function startAR(){ autoT = setInterval(checkNew, 5000); setInterval(()=>{ if(document.getElementById('pg-rejim').classList.contains('active')) rendLiveModeBadge(); }, 30000); }
function stopAR(){ clearInterval(autoT); }
function checkNew(){
  const nc=getOrders().filter(o=>o.status==='new').length;
  if(nc>lastNew){ playBeep(); toast('Yangi buyurtma keldi!'); }
  lastNew=nc;
}

// ── STATS ──
function updStats(orders){
  document.getElementById('st-n').textContent=orders.filter(o=>o.status==='new').length;
  document.getElementById('st-t').textContent=orders.length;
  document.getElementById('st-d').textContent=orders.filter(o=>o.status==='done').length;
  document.getElementById('st-r').textContent=orders.filter(o=>o.status==='done').reduce((s,o)=>s+o.total,0).toLocaleString();
}

// ── DASHBOARD ──
function rendDash(orders){
  const ss=['new','confirmed','cooking','delivering','done','cancelled'];
  document.getElementById('dw-s').innerHTML=ss.map(s=>{
    const c=orders.filter(o=>o.status===s).length; if(!c)return '';
    return `<div class="dwr"><span>${SL[s]}</span><span class="sbg bg${s==='new'?'nw':s==='confirmed'?'cf':s==='cooking'?'ck':s==='delivering'?'dl':s==='done'?'dn':'ca'}">${c}</span></div>`;
  }).join('')||'<p style="color:var(--gray);font-size:.82rem;padding:.4rem 0">Hali yo\'q</p>';
  const ic={};
  orders.forEach(o=>o.items.forEach(i=>ic[i.name]=(ic[i.name]||0)+i.qty));
  const sorted=Object.entries(ic).sort((a,b)=>b[1]-a[1]).slice(0,5);
  document.getElementById('dw-t').innerHTML=sorted.length
    ?sorted.map(([n,q],i)=>`<div class="dwr"><span>${i+1}. ${n}</span><span>${q} ta</span></div>`).join('')
    :'<p style="color:var(--gray);font-size:.82rem;padding:.4rem 0">Ma\'lumot yo\'q</p>';
  document.getElementById('dw-r').innerHTML=orders.slice(0,5).map(o=>
    `<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border)">
      <span class="sbg bg${o.status==='new'?'nw':o.status==='confirmed'?'cf':o.status==='cooking'?'ck':o.status==='delivering'?'dl':o.status==='done'?'dn':'ca'}">${SL[o.status]}</span>
      <span style="font-size:.82rem;flex:1">${o.customer} · ${o.phone}</span>
      <span style="font-size:.83rem;font-weight:800;color:var(--red)">${o.total.toLocaleString()} so'm</span>
      <span style="font-size:.73rem;color:var(--gray)">${fmtD(o.date)}</span>
    </div>`
  ).join('')||'<p style="color:var(--gray);font-size:.83rem;padding:.8rem 0">Hali yo\'q</p>';
}

// ── ORDERS ──
function rendOrders(orders){
  const f=fil==='all'?orders:orders.filter(o=>o.status===fil);
  const el=document.getElementById('ol');
  if(!f.length){el.innerHTML=`<div class="est"><h3>Topilmadi</h3></div>`;return;}
  el.innerHTML=f.map(o=>{
    const sc=o.status==='new'?'sn':o.status==='confirmed'?'sc2':o.status==='cooking'?'sk':o.status==='delivering'?'sd':o.status==='done'?'sdo':'sca';
    const bg=o.status==='new'?'nw':o.status==='confirmed'?'cf':o.status==='cooking'?'ck':o.status==='delivering'?'dl':o.status==='done'?'dn':'ca';
    return `<div class="oc ${sc}">
      <div class="ot">
        <div>
          <div class="oid">${o.id} · ${fmtD(o.date)}</div>
          <div class="onm">${o.customer}</div>
          <div class="omt">${o.phone}<span class="pch">${PL[o.payment]||o.payment}</span></div>
        </div>
        <div class="or2">
          <div class="opr">${o.total.toLocaleString()} so'm</div>
          <span class="sbg bg${bg}">${SL[o.status]}</span>
        </div>
      </div>
      <div class="oir">${o.items.map(i=>`<span class="oit">${i.name} × ${i.qty}</span>`).join('')}</div>
      <div class="ob">
        <div class="oad">${o.address}${o.note?`<br><span class="oad-note">${o.note}</span>`:''}</div>
        <div class="oas">
          ${o.status==='new'?`<button class="ab2 acf" onclick="setSt('${o.id}','confirmed')">Tasdiqlash</button>`:''}
          ${o.status==='confirmed'?`<button class="ab2 ack" onclick="setSt('${o.id}','cooking')">Tayyorlanmoqda</button>`:''}
          ${o.status==='cooking'?`<button class="ab2 adl" onclick="setSt('${o.id}','delivering')">Yetkazishga</button>`:''}
          ${o.status==='delivering'?`<button class="ab2 adn" onclick="setSt('${o.id}','done')">Bajarildi</button>`:''}
          ${['new','confirmed','cooking','delivering'].includes(o.status)?`<button class="ab2 aca" onclick="setSt('${o.id}','cancelled')">Bekor</button>`:''}
          <button class="ab2 adl2" onclick="delOrder('${o.id}')">O'chirish</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function setSt(id,s){
  const o=getOrders(),i=o.find(x=>x.id===id);
  if(i){i.status=s;saveOrders(o);refreshAll();toast(`${SL[s]}`);}
}
function delOrder(id){if(!confirm('O\'chirasizmi?'))return;saveOrders(getOrders().filter(o=>o.id!==id));refreshAll();toast('O\'chirildi');}
function clearOrders(){if(!confirm('BARCHA buyurtmalarni o\'chirasizmi?'))return;saveOrders([]);refreshAll();toast('Tozalandi');}
function setFil(f,btn){fil=f;document.querySelectorAll('.fb .fbn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');rendOrders(getOrders());}
function setMCat(c,btn){mcat=c;document.querySelectorAll('#mcat .fbn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');rendMenu();}

// ── MENU ──
function rendMenu(){
  const menu=getMenu();
  const items=mcat==='all'?menu:menu.filter(i=>i.cat===mcat);
  const g=document.getElementById('mmg');
  if(!items.length){g.innerHTML=`<div class="est" style="grid-column:1/-1"><h3>Taom topilmadi</h3></div>`;return;}
  g.innerHTML=items.map(item=>{
    const ic=item.img?`<img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover">`:`<span class="mm-fallback">${item.name.charAt(0).toUpperCase()}</span>`;
    return `<div class="mmc">
      <div class="mmw">${ic}<div class="mmo"><button class="mmob" onclick="openIM(${item.id})">Tahrirlash</button></div></div>
      <div class="mmbd">
        <div class="mmn">${item.name}</div>
        <div class="mmd">${item.desc||'—'}</div>
        <div class="mmf"><div class="mmp">${item.price.toLocaleString()} so'm</div><span class="mmcat">${item.cat}</span></div>
        <div class="mma">
          <button class="mmed" onclick="openIM(${item.id})">Tahrirlash</button>
          <button class="mmde" onclick="delItem(${item.id})">O'chirish</button>
        </div>
      </div></div>`;
  }).join('');
}

// ── ITEM MODAL ──
function openIM(id){
  editId=id; imgB64='';
  document.getElementById('imt-title').textContent=id?'Tahrirlash':'Yangi Taom';
  if(id){
    const item=getMenu().find(i=>i.id===id);if(!item)return;
    document.getElementById('iname').value=item.name;
    document.getElementById('iprice').value=item.price;
    document.getElementById('idesc').value=item.desc||'';
    document.getElementById('icat').value=item.cat;
    curBadge=item.badge||'';imgB64=item.img||'';
    if(item.img){document.getElementById('ipv').src=item.img;document.getElementById('ipw').style.display='block';}
    else document.getElementById('ipw').style.display='none';
  } else {
    ['iname','iprice','idesc'].forEach(x=>document.getElementById(x).value='');
    document.getElementById('icat').value='shashlik';
    curBadge='popular';document.getElementById('ipw').style.display='none';
    document.getElementById('ipv').src='';
  }
  document.querySelectorAll('.bpo').forEach(b=>b.classList.toggle('sel',b.dataset.badge===curBadge));
  document.getElementById('imo').classList.add('open');
}
function closeIM(){document.getElementById('imo').classList.remove('open');}
function handleImg(e){
  const f=e.target.files[0];if(!f)return;
  if(f.size>5*1024*1024){toast('5MB dan kichik!');return;}
  const r=new FileReader();
  r.onload=ev=>{imgB64=ev.target.result;document.getElementById('ipv').src=imgB64;document.getElementById('ipw').style.display='block';toast('Rasm yuklandi!');};
  r.readAsDataURL(f);
}
function removeImg(){imgB64='';document.getElementById('ipv').src='';document.getElementById('ipw').style.display='none';document.getElementById('ifl').value='';}
function selBadge(btn,b){document.querySelectorAll('.bpo').forEach(x=>x.classList.remove('sel'));btn.classList.add('sel');curBadge=b;}

function saveItem(){
  const name=document.getElementById('iname').value.trim();
  const price=parseInt(document.getElementById('iprice').value);
  const desc=document.getElementById('idesc').value.trim();
  const cat=document.getElementById('icat').value;
  if(!name){toast('Nomni kiriting!');return;}
  if(!price||price<=0){toast('Narxni kiriting!');return;}
  const menu=getMenu();
  if(editId){
    const idx=menu.findIndex(i=>i.id===editId);
    if(idx!==-1)menu[idx]={...menu[idx],name,price,desc,cat,badge:curBadge,img:imgB64};
    toast('Yangilandi!');
  } else {
    const nid=menu.length?Math.max(...menu.map(i=>i.id))+1:1;
    menu.push({id:nid,name,price,desc,cat,badge:curBadge,img:imgB64});
    toast('Qo\'shildi!');
  }
  saveMenu(menu);closeIM();rendMenu();
  rendModeLists();
}
function delItem(id){if(!confirm('O\'chirasizmi?'))return;saveMenu(getMenu().filter(i=>i.id!==id));rendMenu();rendModeLists();toast('O\'chirildi');}
function resetMenu(){if(!confirm('Menyuni tiklaysizmi?'))return;localStorage.removeItem(MK);rendMenu();rendModeLists();toast('Menyu tiklandi');}

// ── REJIM (MODE) ──
let modeOpt = 'both'; // 'both' or 'modes'

function selectModeOpt(btn){
  document.querySelectorAll('.mode-opt-btn').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  modeOpt=btn.dataset.mode;
  updModeLabel();
}
function updModeLabel(){
  const el=document.getElementById('mode-active-label');
  if(modeOpt==='both') el.textContent='Barcha taomlar har vaqt mavjud bo\'ladi';
  else el.textContent='Taomlar vaqt bo\'yicha filtrlash ishlaydi';
}
function rendModeLists(){
  const menu=getMenu();
  const modes=getModes();
  const m1ids=modes.mode1?.items||[];
  const m2ids=modes.mode2?.items||[];
  ['m1list','m2list'].forEach((listId,idx)=>{
    const checkedIds=idx===0?m1ids:m2ids;
    document.getElementById(listId).innerHTML=menu.map(item=>`
      <label class="mode-item-row">
        <input type="checkbox" data-id="${item.id}" data-mode="${idx+1}"
          ${checkedIds.includes(item.id)?'checked':''}
          onchange="updModeCount(${idx+1})">
        <span class="mode-item-name">${item.name}</span>
        <span class="mode-item-cat">${item.cat}</span>
      </label>`).join('');
    updModeCount(idx+1);
  });
}
function updModeCount(n){
  const checked=document.querySelectorAll(`input[data-mode="${n}"]:checked`).length;
  document.getElementById(`m${n}cnt`).textContent=checked;
}
function selectAllMode(n){
  const boxes=document.querySelectorAll(`input[data-mode="${n}"]`);
  const allChecked=[...boxes].every(b=>b.checked);
  boxes.forEach(b=>b.checked=!allChecked);
  updModeCount(n);
}
function saveModeSettings(){
  const m1ids=[...document.querySelectorAll('input[data-mode="1"]:checked')].map(b=>parseInt(b.dataset.id));
  const m2ids=[...document.querySelectorAll('input[data-mode="2"]:checked')].map(b=>parseInt(b.dataset.id));
  saveModes({active:modeOpt,mode1:{items:m1ids},mode2:{items:m2ids}});
  toast('Rejim sozlamalari saqlandi!');
  rendLiveModeBadge();
}
function getCurrentModeKey(){
  const modes=getModes();
  if(modes.active!=='modes') return 'both';
  const h=new Date().getHours();
  if(h>=6&&h<14) return 'mode1';
  if(h>=14&&h<23) return 'mode2';
  return 'both';
}
function rendLiveModeBadge(){
  const el=document.getElementById('live-mode-badge');
  if(!el)return;
  const modes=getModes();
  if(modes.active!=='modes'){
    el.textContent='● Faol: Har doim hammasi ko\'rinadi';
    el.className='live-mode-badge lmb-both';
    return;
  }
  const key=getCurrentModeKey();
  if(key==='mode1'){el.textContent='● Hozir faol: 1-Rejim (06:00–14:00)';el.className='live-mode-badge lmb-on';}
  else if(key==='mode2'){el.textContent='● Hozir faol: 2-Rejim (14:00–23:00)';el.className='live-mode-badge lmb-on';}
  else{el.textContent='● Hozir: Ish vaqtidan tashqari — hammasi ko\'rinadi';el.className='live-mode-badge lmb-off';}
}
function loadModeUI(){
  const modes=getModes();
  modeOpt=modes.active||'both';
  document.querySelectorAll('.mode-opt-btn').forEach(b=>{
    b.classList.toggle('selected',b.dataset.mode===modeOpt);
  });
  updModeLabel();
  rendModeLists();
  rendLiveModeBadge();
}

// ── REFRESH ALL ──
function refreshAll(){
  const orders=getOrders();
  updStats(orders);rendOrders(orders);rendDash(orders);rendMenu();
  const nc=orders.filter(o=>o.status==='new').length;
  const ch=document.getElementById('nchip'),sb=document.getElementById('sbnc'),cn=document.getElementById('ncnt');
  if(sb){
    if(nc>0){sb.style.display='inline-flex';sb.textContent=nc;}
    else{sb.style.display='none';}
  }
  lastNew=nc;
}

// ── MOBILE SIDEBAR DRAWER ──
function toggleAdminSidebar(force){
  const sb=document.getElementById('sb'), ov=document.getElementById('sb-overlay');
  const open = typeof force==='boolean' ? force : !sb.classList.contains('open');
  sb.classList.toggle('open',open);
  ov.classList.toggle('open',open);
}

// ── PAGE NAV ──
function goPage(page,btn){
  document.querySelectorAll('.pg').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.sblnk').forEach(b=>b.classList.remove('active'));
  document.getElementById('pg-'+page).classList.add('active');
  btn.classList.add('active');
  if(page==='orders') rendOrders(getOrders());
  if(page==='menu') rendMenu();
  if(page==='rejim') loadModeUI();
  toggleAdminSidebar(false); // mobil drawer avtomatik yopiladi
}

// ── TEST ORDER ──
function addTest(){
  const menu=getMenu();if(!menu.length){toast('Menyu bo\'sh!');return;}
  const ns=['Sardor','Aziz','Malika','Nodira'];
  const ad=['Andijon, MAYBACH avto bezak 12','Andijon, Navoiy 5','Andijon, Bobur xiyoboni 3'];
  const pp=['cash','pos'];
  const picked=menu.slice(0,2).map(i=>({id:i.id,name:i.name,qty:Math.ceil(Math.random()*3),price:i.price,img:i.img,cat:i.cat}));
  const o={id:'ZAK-'+Date.now(),date:new Date().toISOString(),customer:ns[Math.floor(Math.random()*ns.length)],
    phone:'+998 9'+Math.floor(Math.random()*9)+' '+Math.floor(1000000+Math.random()*9000000),
    address:ad[Math.floor(Math.random()*ad.length)],note:'',payment:pp[Math.floor(Math.random()*pp.length)],
    items:picked,total:picked.reduce((s,i)=>s+i.price*i.qty,0),status:'new'};
  const orders=getOrders();orders.unshift(o);saveOrders(orders);refreshAll();playBeep();toast('Test buyurtma qo\'shildi!');
}

// ── SOUND ──
function playBeep(){
  try{
    const c=new(window.AudioContext||window.webkitAudioContext)();
    [880,1100].forEach((f,i)=>{
      const o=c.createOscillator(),g=c.createGain();
      o.connect(g);g.connect(c.destination);o.frequency.value=f;o.type='sine';
      g.gain.setValueAtTime(.25,c.currentTime+i*.15);
      g.gain.exponentialRampToValueAtTime(.001,c.currentTime+i*.15+.4);
      o.start(c.currentTime+i*.15);o.stop(c.currentTime+i*.15+.4);
    });
  }catch(e){}
}

// ── UTILS ──
function fmtD(iso){
  const d=new Date(iso);
  const t=d.toLocaleTimeString('uz',{hour:'2-digit',minute:'2-digit'});
  const dt=d.toLocaleDateString('uz',{day:'2-digit',month:'2-digit'});
  return d.toDateString()===new Date().toDateString()?''+t:dt+' '+t;
}
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),3000);
}

// ── BOOT ──
window.addEventListener('DOMContentLoaded',()=>{
  if(sessionStorage.getItem('adm')){
    document.getElementById('ls').style.display='none';
    document.getElementById('as').style.display='block';
    refreshAll();startAR();
  }
});