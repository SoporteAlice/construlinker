/* ═══════════════════════════════════════════════════════════
   CONSTRULINKER — MAIN.JS
   Motor de roles. Lee la sesión y construye la interfaz
   correcta para EMPRESA o TRABAJADOR.
═══════════════════════════════════════════════════════════ */
'use strict';

/* ── FUNCIÓN HELPER: FORMATEAR NOMBRE ──────────────────── */
function formatNameWithInitial(fullName) {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  const firstName = parts[0];
  const lastNameInitial = parts[1][0].toUpperCase();
  return `${firstName} ${lastNameInitial}.`;
}

/* ─── SESIÓN ─────────────────────────────────────────────── */
function getSession() {
  try { return JSON.parse(localStorage.getItem('cl_session') || '{}'); } catch(e) { return {}; }
}
function isWorkerRole() {
  const s = getSession();
  
  if (s.type === 'empresa') return false;
  if (s.type === 'trabajador') return true;
  
  try { return !!JSON.parse(localStorage.getItem('cl_worker') || '{}').profile?.isWorker; } catch(e) { return false; }
}

window.IS_WORKER = false;

/* ─── DATOS EMPRESA ──────────────────────────────────────── */
function getEmpresa() {
  try { return JSON.parse(localStorage.getItem('cl_empresa') || '{}'); } catch(e) { return {}; }
}
function saveEmpresa(d) {
  try { localStorage.setItem('cl_empresa', JSON.stringify(d)); } catch(e) {}
}

/* ─── DATOS TRABAJADOR ───────────────────────────────────── */
const WK = 'cl_worker';
const AVAIL = {
  available: { label:'Disponible',          cls:'available', dot:'var(--green)'  },
  limited:   { label:'Disp. Limitada',      cls:'limited',   dot:'var(--yellow)' },
  busy:      { label:'No Disponible',       cls:'busy',      dot:'var(--red)'    },
};

let W = null; // trabajador activo

function loadWorker() {
  try {
    const d = JSON.parse(localStorage.getItem(WK) || '{}');
    W = d.profile || defaultWorker();
  } catch(e) { W = defaultWorker(); }
  if (!W.stats) W.stats = { views:0, offers:0, contacts:0, docsDownloaded:0 };
}

function saveWorker() {
  try { localStorage.setItem(WK, JSON.stringify({ profile: W })); } catch(e) {}
}

function defaultWorker() {
  return {
    id:9001, name:'Juan Gómez', specialty:'Oficial 1ª Pladur / Tabiquería Seca',
    category:'Acabados',
    location:'Callao, Lima', availability:'available',
    tags:['Pladur','Tabiquería seca','Falsos techos','Nivel láser'],
    about:'Oficial de primera especializado en montaje de pladur y tabiquería seca.',
    phone:'+51 987 123 456', email:'juan@gmail.com', whatsapp:'51987123456',
    docs:{ cv:false, cvName:'', prl:false, prlName:'', cert:false, certName:'', dni:false, dniName:'' },
    viewedBy:[
      { company:'Constructora Arenas', action:'Ver contacto',  time:'Hace 2 horas', color:['#7F2A4A','#4A2A7F'] },
      { company:'Buildex Contratistas',action:'Descargó CV',   time:'Ayer, 15:30',  color:['#2A4A1A','#3A6A2A'] },
    ],
    offers:[
      { id:'o1',isNew:true,  title:'Oficial de Pladur – Torre Miraflores', company:'Constructora Arenas',  type:'Obra completa', location:'Miraflores', time:'Hace 2h', urgent:true },
      { id:'o2',isNew:false, title:'Montador – Centro Comercial',          company:'Proyek Builders',      type:'Por obra',      location:'San Isidro', time:'Ayer',    urgent:false },
    ],
    stats:{ views:14, offers:2, contacts:3, docsDownloaded:5 },
    isWorker:true, registeredAt: new Date(Date.now()-7*864e5).toISOString()
  };
}

/* ─── EMPRESAS DEMO (para vista trabajador) ──────────────── */
const EMPRESAS = [
  { id:1, name:'Constructora Arenas S.A.C.', tipo:'Constructora general',   ubi:'San Isidro, Lima',  emp:45, ofertas:3, rating:4.8, color:['#7F2A4A','#4A2A7F'], ini:'CA', ver:true,  desc:'Especialistas en edificaciones residenciales y obras civiles en Lima. 15 años de experiencia.' },
  { id:2, name:'Buildex Contratistas',        tipo:'Subcontrata',            ubi:'Callao, Lima',      emp:28, ofertas:2, rating:4.5, color:['#2A4A1A','#3A6A2A'], ini:'BC', ver:true,  desc:'Subcontrata especializada en estructuras de concreto y encofrado metálico.' },
  { id:3, name:'Proyek Builders',             tipo:'Constructora general',   ubi:'Surco, Lima',       emp:62, ofertas:5, rating:4.9, color:['#1A2A5A','#2A3A8A'], ini:'PB', ver:true,  desc:'Edificios multifamiliares y proyectos de uso mixto en Lima Sur.' },
  { id:4, name:'Alianza Constructores',       tipo:'Subcontrata',            ubi:'SJL, Lima',         emp:18, ofertas:1, rating:4.2, color:['#5A2A1A','#8A3A2A'], ini:'AC', ver:false, desc:'Subcontrata de acabados y pintura. Proyectos residenciales y comerciales.' },
  { id:5, name:'Torres del Sur SAC',          tipo:'Promotora inmobiliaria', ubi:'La Molina, Lima',   emp:35, ofertas:4, rating:4.7, color:['#1A4A4A','#2A7A7A'], ini:'TS', ver:true,  desc:'Proyectos residenciales premium en Lima Este.' },
  { id:6, name:'Seguridad & Obra',            tipo:'Empresa de servicios',   ubi:'Miraflores, Lima',  emp:12, ofertas:2, rating:4.6, color:['#4A1A4A','#7A2A7A'], ini:'SO', ver:true,  desc:'Consultoría de seguridad y salud en el trabajo para el sector construcción.' },
];

/* ═══════════════════════════════════════════════════════════
   INIT — punto de entrada
═══════════════════════════════════════════════════════════ */
function initMain() {
  window.IS_WORKER = isWorkerRole();

  if (window.IS_WORKER) {
    loadWorker();
    buildWorkerNav();
    buildWorkerSidebar();
    buildWorkerSidebarRight();
    buildWorkerComposer();
    // Ocultar semáforo créditos
    const sb = document.getElementById('semaforoBanner');
    if (sb) sb.style.display = 'none';
  } else {
    buildEmpresaNav();
    buildEmpresaSidebar();
    buildEmpresaSidebarRight();
    buildEmpresaComposer();
  }

  buildUserMenu();
  patchNavigate();
  patchInit();
}

/* ═══════════════════════════════════════════════════════════
   NAV — EMPRESA
   Inicio | Personal | Personal Urgente | Publicar Oferta | Mensajes | Notif | Créditos | Avatar
═══════════════════════════════════════════════════════════ */
function buildEmpresaNav() {
  document.getElementById('navRoleLinks').innerHTML = `
    <button class="nav-link" data-page="buscar" onclick="navigate('buscar')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
      <span>Personal</span>
    </button>
    <button class="nav-link" data-page="urgentes" onclick="navigate('urgentes')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
      <span style="color:var(--orange)">Personal Urgente</span>
    </button>
    <button class="nav-link" onclick="window.location.href='job-offer.html'">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
      <span>Publicar Oferta</span>
    </button>`;

  document.getElementById('navWidget').innerHTML = `
    <div class="topnav__credits" onclick="navigate('creditos')" style="cursor:pointer">
      <svg viewBox="0 0 24 24" fill="currentColor" class="credits-diamond"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
      <span id="creditsTopNav">10</span>
      <span class="credits-label-nav">créditos</span>
    </div>`;

  document.getElementById('udCredits').style.display = '';
}

/* ═══════════════════════════════════════════════════════════
   NAV — TRABAJADOR
   Inicio | Empresas | Actividad | Ofertas de Empleo | Mensajes | Notif | Disponibilidad | Avatar
═══════════════════════════════════════════════════════════ */
function buildWorkerNav() {
  document.getElementById('navRoleLinks').innerHTML = `
    <button class="nav-link" data-page="actividad" onclick="navigate('actividad')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
      <span>Actividad</span>
    </button>
    <button class="nav-link" data-page="empleo" onclick="navigate('empleo')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
      <span>Ofertas de Empleo</span>
    </button>`;

  // Widget disponibilidad en nav
  document.getElementById('navWidget').innerHTML = `
    <div id="availNavWidget" onclick="navigate('perfil')" style="display:flex;align-items:center;gap:7px;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:0 12px;height:34px;cursor:pointer;transition:border-color var(--trans)">
      <div id="availNavDot" style="width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0"></div>
      <span id="availNavLabel" style="font-size:12px;font-weight:600;color:var(--text)">Disponible</span>
    </div>`;

  updateAvailNav();
}

function updateAvailNav() {
  if (!W) return;
  const cfg = AVAIL[W.availability] || AVAIL.available;
  const dot = document.getElementById('availNavDot');
  const lbl = document.getElementById('availNavLabel');
  if (dot) dot.style.background = cfg.dot;
  if (lbl) lbl.textContent = cfg.label;
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR IZQUIERDO
═══════════════════════════════════════════════════════════ */
function buildEmpresaSidebar() {
  const e = getEmpresa();
  const ini = (e.nombre||'CA').split(' ').filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('sidebarLeft').innerHTML = `
    <div class="profile-card" style="margin-bottom:12px">
      <div class="profile-card__banner"></div>
      <div class="profile-card__body">
        <div class="profile-card__avatar-wrap">
          <div class="avatar-circle lg" style="background:linear-gradient(135deg,#7F2A4A,#4A2A7F)">${ini}</div>
        </div>
        <div class="profile-card__name">${e.nombre||'Constructora Arenas'}</div>
        <div class="profile-card__role">${e.tipo||'Empresa Constructora'} · ${e.ubicacion||'Lima, PE'}</div>
        <div class="profile-card__divider"></div>
        <div class="profile-card__stats">
          <div class="ps-stat"><span class="ps-stat__label">Desbloqueados</span><span class="ps-stat__value" id="miniUnlocked">0</span></div>
          <div class="ps-stat"><span class="ps-stat__label">Créditos</span><span class="ps-stat__value orange" id="miniCredits">10</span></div>
        </div>
        <button class="btn-orange w-full" onclick="navigate('creditos')">
          <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          Comprar créditos
        </button>
      </div>
    </div>
    <div class="widget">
      <div class="widget__title">Explorar categorías</div>
      <nav class="category-nav">
        <a class="cat-item" onclick="filterAndNavigate('Obra gruesa')"><span class="cat-emoji">🧱</span><span>Obra Gruesa</span></a>
        <a class="cat-item" onclick="filterAndNavigate('Acabados')"><span class="cat-emoji">🪟</span><span>Acabados</span></a>
        <a class="cat-item" onclick="filterAndNavigate('Instalaciones')"><span class="cat-emoji">⚡</span><span>Instalaciones</span></a>
        <a class="cat-item" onclick="filterAndNavigate('Maquinaria')"><span class="cat-emoji">🏗️</span><span>Maquinaria</span></a>
        <a class="cat-item" onclick="filterAndNavigate('Técnicos')"><span class="cat-emoji">📐</span><span>Técnicos</span></a>
        <a class="cat-item" onclick="filterAndNavigate('Auxiliares')"><span class="cat-emoji">👷</span><span>Auxiliares</span></a>
        <a class="cat-item" onclick="filterAndNavigate('todos')" style="border-top:1px solid var(--border);margin-top:2px;padding-top:8px"><span class="cat-emoji">📋</span><span style="color:var(--text-muted)">Listado general</span></a>
      </nav>
    </div>`;
}

function buildWorkerSidebar() {
  if (!W) return;
  const ini = W.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const cfg = AVAIL[W.availability] || AVAIL.available;
  const checks = [!!W.name, !!W.specialty, (W.about||'').length>=50, (W.tags||[]).length>0];
  const pct = Math.round(checks.filter(Boolean).length / checks.length * 100);

  document.getElementById('sidebarLeft').innerHTML = `
    <div class="profile-card" style="margin-bottom:12px">
      <div class="profile-card__banner" style="background:linear-gradient(135deg,#0A0A18,#18080A)"></div>
      <div class="profile-card__body">
        <div class="profile-card__avatar-wrap">
          <div class="avatar-circle lg" style="background:linear-gradient(135deg,#3A1A6E,#6A2A9E)">${ini}</div>
        </div>
        <div class="profile-card__name">${formatNameWithInitial(W.name)}</div>
        <div class="profile-card__role">${W.specialty}</div>
        <div class="profile-card__divider"></div>
        <div class="wpc-avail ${cfg.cls}" style="display:flex;align-items:center;gap:7px;padding:7px 10px;border-radius:3px;font-size:11.5px;font-weight:700;margin-bottom:10px;text-transform:uppercase;letter-spacing:.4px">
          <div style="width:7px;height:7px;border-radius:50%;background:${cfg.dot};flex-shrink:0"></div>
          ${cfg.label}
        </div>
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-dim);margin-bottom:4px">
            <span>Completitud del perfil</span><span style="color:var(--orange);font-weight:700">${pct}%</span>
          </div>
          <div style="background:var(--border);border-radius:3px;height:4px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:var(--orange);border-radius:3px"></div>
          </div>
        </div>
        <div class="profile-card__stats">
          <div class="ps-stat"><span class="ps-stat__label">Vistas</span><span class="ps-stat__value">${W.stats.views}</span></div>
          <div class="ps-stat"><span class="ps-stat__label">Ofertas</span><span class="ps-stat__value orange">${W.stats.offers}</span></div>
        </div>
        <button class="btn-orange w-full" style="margin-top:10px" onclick="navigate('perfil')">Editar mi perfil</button>
      </div>
    </div>
    <div class="widget">
      <div class="widget__title">Accesos rápidos</div>
      <nav class="category-nav">
        <a class="cat-item" onclick="navigate('empleo')"><span class="cat-emoji">💼</span><span>Ofertas de Empleo</span></a>
        <a class="cat-item" onclick="navigate('actividad')"><span class="cat-emoji">📊</span><span>Mi Actividad</span></a>
        <a class="cat-item" onclick="document.getElementById('hireModal').classList.add('active')"><span class="cat-emoji">🤝</span><span>Confirmar Contratación</span></a>
      </nav>
    </div>`;
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR DERECHO
═══════════════════════════════════════════════════════════ */
function buildEmpresaSidebarRight() {
  document.getElementById('sidebarRight').innerHTML = `
    <div class="widget">
      <div class="widget__title">Disponibles ahora <span class="badge-count" id="availableCount">0</span></div>
      <div id="suggestedList"></div>
      <button class="link-btn" onclick="navigate('buscar')">Ver todos →</button>
    </div>
    <div class="widget urgent-widget">
      <div class="widget__title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="2" width="14" height="14" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
        Perfiles Urgentes
      </div>
      <p class="widget__desc">Listos para incorporarse hoy. 1 crédito.</p>
      <div id="urgentList"></div>
      <button class="btn-orange-outline" style="width:100%;margin-top:8px" onclick="navigate('urgentes')">Ver todos los urgentes</button>
    </div>`;
}

function buildWorkerSidebarRight() {
  // Renderizar primero vacío, luego llenar con ofertas publicadas
  document.getElementById('sidebarRight').innerHTML = `
    <div class="widget">
      <div class="widget__title">Ofertas recientes</div>
      <div id="sidebarOfertasList"></div>
      <button class="link-btn" onclick="navigate('empleo')">Ver todas las ofertas →</button>
    </div>`;
  renderSidebarOfertas();
}

function renderSidebarOfertas() {
  const el = document.getElementById('sidebarOfertasList');
  if (!el) return;
  const ofertas = JOB_LIST.slice(0,4);
  el.innerHTML = ofertas.map(j => `
    <div class="suggested-worker" onclick="navigate('empleo')" style="cursor:pointer">
      <div style="flex:1">
        <div style="font-size:12.5px;font-weight:600;color:var(--text);margin-bottom:2px">${j.urgent?'<span style="font-size:8px;font-weight:800;background:var(--orange);color:#000;padding:1px 4px;border-radius:2px;margin-right:3px">URG</span>':''}${j.title}</div>
        <div style="font-size:11px;color:var(--text-muted)">${j.company} · ${j.time}</div>
      </div>
    </div>`).join('');
}

/* ═══════════════════════════════════════════════════════════
   COMPOSER
═══════════════════════════════════════════════════════════ */
function buildEmpresaComposer() {
  const e = getEmpresa();
  const ini = (e.nombre||'CA').split(' ').filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const av = document.getElementById('composerAvatar');
  if (av) { av.textContent=ini; av.style.background='linear-gradient(135deg,#7F2A4A,#4A2A7F)'; }
  document.getElementById('composerHint').textContent = 'Publica una oferta o novedad de tu obra…';
  document.getElementById('composerActions').innerHTML = `
    <button class="composer-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="15" height="15"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg> Foto / Obra</button>
    <button class="composer-btn" onclick="window.location.href='job-offer.html'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="15" height="15"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> Publicar oferta</button>
    <button class="composer-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="15" height="15"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg> Compartir proyecto</button>`;
}

function buildWorkerComposer() {
  if (!W) return;
  const ini = W.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const av = document.getElementById('composerAvatar');
  if (av) { av.textContent=ini; av.style.background='linear-gradient(135deg,#3A1A6E,#6A2A9E)'; }
  document.getElementById('composerHint').textContent = 'Comparte tu experiencia o busca nuevas oportunidades…';
  document.getElementById('composerActions').innerHTML = `
    <button class="composer-btn" onclick="navigate('empleo')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="15" height="15"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg> Ver ofertas de empleo</button>`;
}

/* ═══════════════════════════════════════════════════════════
   MENÚ USUARIO + LOGOUT
═══════════════════════════════════════════════════════════ */
function buildUserMenu() {
  let name='Usuario', ini='?', role='Empresa';
  if (window.IS_WORKER && W) {
    name=W.name; ini=name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); role=W.specialty;
  } else {
    const e=getEmpresa(); name=e.nombre||'Constructora Arenas';
    ini=name.split(' ').filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase();
    role=e.tipo||'Empresa Constructora';
  }
  const av=document.getElementById('navAvatar'); if(av) av.textContent=ini;
  const un=document.getElementById('udName');    if(un) un.textContent=name;
  const ur=document.getElementById('udRole');    if(ur) ur.textContent=role;
}

function toggleUserMenu() {
  const dd=document.getElementById('userDropdown'); if(!dd) return;
  dd.classList.toggle('open');
  document.getElementById('notifPanel')?.classList.remove('open');
}

function logout() {
  localStorage.removeItem('cl_session');
  window.location.replace('company-dashboard.html');
}

document.addEventListener('click', e => {
  const m=document.getElementById('navUserMenu'), d=document.getElementById('userDropdown');
  if (d?.classList.contains('open') && !m?.contains(e.target) && !d?.contains(e.target)) d.classList.remove('open');
});

/* ═══════════════════════════════════════════════════════════
   PÁGINAS ESPECÍFICAS
═══════════════════════════════════════════════════════════ */

/* ── EMPRESAS (página "buscar" para trabajador) ──────────── */
function renderEmpresasPage() {
  const sidebar = document.getElementById('buscarSidebar');
  const results = document.getElementById('buscarResults');
  const title   = document.getElementById('buscarTitle');
  if (sidebar) sidebar.style.display = 'none';
  if (title)   title.textContent = 'Empresas en Construlinker';

  if (results) results.innerHTML = `
    <div class="buscador-empresas">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px">
        <span style="font-size:13px;color:var(--text-muted)">${EMPRESAS.length} empresas registradas</span>
        <input type="text" placeholder="Buscar empresa…" oninput="filterEmpresasUI(this.value)"
          style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-family:inherit;font-size:13px;padding:8px 13px;outline:none;width:220px;transition:border-color var(--trans)"
          onfocus="this.style.borderColor='var(--orange)'" onblur="this.style.borderColor=''"/>
      </div>
    </div>
    <div class="empresas-cards-container">
      <div class="prof-grid empresas-grid" id="empresasGrid">${buildEmpresaCards(EMPRESAS)}</div>
    </div>`;
}

function buildEmpresaCards(list) {
  return list.map(e => `
    <div class="prof-card" onclick="window.location.href='company-profile.html'" style="cursor:pointer">
      <div class="prof-card__cover" style="background:linear-gradient(135deg,${e.color[0]},${e.color[1]})"></div>
      <div class="prof-card__avatar-zone">
        <div class="prof-card__avatar">
          <div class="avatar-circle lg" style="background:linear-gradient(135deg,${e.color[0]},${e.color[1]})">${e.ini}</div>
        </div>
        ${e.ver?'<span class="status-badge available" style="font-size:9px">✓ Verificada</span>':''}
      </div>
      <div class="prof-card__body">
        <div class="prof-card__name">${e.name}</div>
        <div class="prof-card__specialty">${e.tipo}</div>
        <div class="prof-card__meta">
          <div class="prof-meta-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>${e.ubi}</div>
          <div class="prof-meta-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>${e.emp} empleados</div>
          <div class="prof-meta-row" style="color:var(--orange)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>${e.ofertas} ofertas activas</div>
        </div>
        <p style="font-size:12.5px;color:var(--text-muted);line-height:1.5;margin:10px 0">${e.desc}</p>
        <div class="prof-card__actions">
          <button class="btn-orange full-h w-full" onclick="event.stopPropagation();window.location.href='company-profile.html'">Ver empresa y ofertas</button>
        </div>
      </div>
    </div>`).join('');
}

function filterEmpresasUI(q) {
  const filtered = q ? EMPRESAS.filter(e=>e.name.toLowerCase().includes(q.toLowerCase())||e.tipo.toLowerCase().includes(q.toLowerCase())) : EMPRESAS;
  const g = document.getElementById('empresasGrid');
  if (g) g.innerHTML = buildEmpresaCards(filtered);
}

/* ── PERFILES URGENTES (empresa) ─────────────────────────── */
function renderUrgentesPage() {
  const grid = document.getElementById('urgentesGrid');
  if (!grid || !window.PROFESSIONALS) return;
  const urgentes = window.PROFESSIONALS.filter(p => p.availability === 'available');
  grid.innerHTML = urgentes.map(p => window.renderProfCard ? window.renderProfCard(p) : '').join('');
}

/* ── OFERTAS DE EMPLEO (trabajador) ──────────────────────── */
const JOB_LIST = [
  {id:'j1',title:'3 Oficiales Albañiles – Obra Miraflores',    company:'Constructora Arenas',   cat:'Obra gruesa',  location:'Miraflores, Lima', tags:['Inmediato','Jornada completa'],  time:'Hace 2h',  urgent:true },
  {id:'j2',title:'Electricista IIEE – Nave Industrial Callao', company:'Buildex Contratistas',  cat:'Instalaciones',location:'Callao, Lima',       tags:['Urgente','Por obra'],           time:'Hace 5h',  urgent:true },
  {id:'j3',title:'Residente de Obra – Edificio San Borja',     company:'Proyek Builders',       cat:'Técnicos',     location:'San Borja, Lima',   tags:['Jornada completa','5+ años'],            time:'Ayer',     urgent:false},
  {id:'j4',title:'Pintores de obra – Proyecto Surco',          company:'Alianza Constructores', cat:'Acabados',     location:'Surco, Lima',       tags:['2 semanas','Media jornada'],              time:'Ayer',     urgent:false},
  {id:'j5',title:'Operador Grúa Torre – Torre La Molina',      company:'Torres del Sur SAC',    cat:'Maquinaria',   location:'La Molina, Lima',   tags:['Licencia vigente','1 mes'],               time:'Hace 2d',  urgent:false},
  {id:'j6',title:'Técnico PRL – Múltiples obras Lima',         company:'Seguridad & Obra',      cat:'Técnicos',     location:'Lima Metropolitana',tags:['ISO 45001','Freelance'],            time:'Hace 3d',  urgent:false},
];

function renderEmpleos() {
  const grid = document.getElementById('empleoGrid');
  if (!grid) return;
  const f = document.getElementById('empleoFilter')?.value || 'all';
  const citySearch = document.getElementById('citySearch')?.value?.trim().toLowerCase() || '';

  const list = JOB_LIST.filter(j => {
    const catMatch = f === 'all' || j.cat === f;
    const cityMatch = !citySearch || j.location.toLowerCase().includes(citySearch);
    return catMatch && cityMatch;
  });

  grid.innerHTML = list.map(j=>`
    <div class="empleo-card ${j.urgent?'urgent-card':''}">
      <div class="empleo-title">${j.urgent?'<span style="font-size:9px;font-weight:800;background:var(--orange);color:#000;padding:1px 5px;border-radius:2px;margin-right:5px">URGENTE</span>':''}${j.title}</div>
      <div class="empleo-location">${j.location}</div>
      <div class="empleo-tags">${j.tags.map(t=>`<span class="empleo-tag">${t}</span>`).join('')}</div>
      <div class="empleo-footer">
        <span class="empleo-time">${j.time}</span>
        <button class="btn-orange sm" onclick="applyJob('${j.id}')">Aplicar</button>
      </div>
    </div>`).join('');
}

function applyJob(id) {
  showToast('Solicitud enviada', 'Tu perfil fue enviado a la empresa.');
}

/* ── ACTIVIDAD ───────────────────────────────────────────── */
function renderActividadPage() {
  const el = document.getElementById('actividadContent');
  if (!el) return;

  if (window.IS_WORKER && W) {
    el.innerHTML = `
      <div class="w-edit-header" style="margin-bottom:20px">
        <div><div class="w-edit-title">Mi Actividad</div><div class="w-edit-sub">Empresas que han interactuado con tu perfil.</div></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px">
        ${[['👁️',W.stats.views,'Visitas'],['✉️',W.stats.offers,'Ofertas'],['📞',W.stats.contacts,'Contactos'],['📄',W.stats.docsDownloaded,'Docs descargados']].map(([ic,n,l])=>`
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;text-align:center">
            <div style="font-size:20px;margin-bottom:4px">${ic}</div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:700;color:var(--text)">${n}</div>
            <div style="font-size:11px;color:var(--text-dim)">${l}</div>
          </div>`).join('')}
      </div>
      <div style="font-size:12px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--text-muted);margin-bottom:10px">Empresas que interactuaron contigo</div>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);overflow:hidden">
        ${W.viewedBy.length ? W.viewedBy.map(item => {
          const ini=(item.company||'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
          const bg=item.color?`linear-gradient(135deg,${item.color[0]},${item.color[1]})`:'var(--border)';
          return `<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border)">
            <div style="width:36px;height:36px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <span style="font-size:11px;font-weight:700;color:#fff">${ini}</span>
            </div>
            <div style="flex:1"><div style="font-size:13px;font-weight:600;color:var(--text)">${item.company}</div><div style="font-size:11.5px;color:var(--text-muted)">${item.action}</div></div>
            <div style="font-size:11px;color:var(--text-dim)">${item.time}</div>
          </div>`;
        }).join('') : '<div style="padding:32px;text-align:center;color:var(--text-dim);font-size:13px">Las empresas que visiten tu perfil aparecerán aquí.</div>'}
      </div>`;
  } else {
    // Actividad empresa
    const STATE = window.STATE || { unlocked:[], history:[], credits:10 };
    el.innerHTML = `
      <div class="w-edit-header" style="margin-bottom:20px">
        <div><div class="w-edit-title">Mi Actividad</div><div class="w-edit-sub">Perfiles desbloqueados y movimientos de créditos.</div></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:18px;text-align:center">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:700;color:var(--text)">${STATE.unlocked.length}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px">Perfiles desbloqueados</div>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:18px;text-align:center">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:700;color:var(--orange)">${STATE.credits}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px">Créditos disponibles</div>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:18px;text-align:center">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:700;color:var(--text)">${STATE.history.length}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px">Movimientos</div>
        </div>
      </div>
      <div style="font-size:12px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--text-muted);margin-bottom:10px">Historial de créditos</div>
      ${STATE.history.length ? STATE.history.slice(0,10).map(h=>`
        <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:6px">
          <div style="font-size:11px;font-weight:700;padding:3px 8px;border-radius:2px;flex-shrink:0;${h.isPlus?'background:rgba(34,197,94,.1);color:var(--green)':'background:var(--orange-dim);color:var(--orange)'}">${h.isPlus?'+':''}${h.amount}</div>
          <div style="flex:1;font-size:12.5px;color:var(--text-muted)">${h.desc}</div>
          <div style="font-size:11px;color:var(--text-dim);flex-shrink:0">${h.time}</div>
        </div>`).join('')
      : '<div style="text-align:center;padding:32px;color:var(--text-dim);font-size:13px">Sin movimientos todavía. Usa créditos para que aparezcan aquí.</div>'}`;
  }
}

/* ── PERFIL (delegar según rol) ──────────────────────────── */
function renderPerfilPage() {
  if (window.IS_WORKER) renderWorkerPerfil();
  else renderEmpresaPerfil();
}

/* ── PERFIL TRABAJADOR ───────────────────────────────────── */
let editSkills = [];
let editCategories = [];
function renderWorkerPerfil() {
  if (!W) return;
  editSkillsInited = false;
  editSkills = [...(W.tags||[])];
  editCategories = Array.isArray(W.category) ? [...W.category] : W.category ? [W.category] : [];
  document.getElementById('perfilContent').innerHTML = `
    <div class="w-edit-layout">
      <div class="w-edit-header">
        <div><div class="w-edit-title">Mi Perfil Profesional</div><div class="w-edit-sub">Esta información la ven las empresas cuando acceden a tu perfil.</div></div>
        <button class="btn-orange" onclick="saveWorkerPerfil()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="13" height="13"><polyline points="20,6 9,17 4,12"/></svg>
          Guardar cambios
        </button>
      </div>
      <div class="w-edit-card full-width" style="margin-bottom:14px">
        <div class="w-edit-card__title">Estado de disponibilidad</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
          ${['available','limited','busy'].map(av => {
            const cfg=AVAIL[av]; const active=W.availability===av;
            return `<div style="display:flex;align-items:center;gap:10px;padding:11px 13px;background:var(--card);border:2px solid ${active?'var(--orange)':'var(--border)'};border-radius:var(--radius-md);cursor:pointer;transition:all var(--trans)" onclick="setAvail('${av}')">
              <div style="width:10px;height:10px;border-radius:50%;background:${cfg.dot};flex-shrink:0"></div>
              <div style="flex:1"><div style="font-size:12.5px;font-weight:700;color:var(--text)">${cfg.label}</div></div>
              ${active?'<span style="color:var(--orange)">✓</span>':''}
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="w-edit-grid">
        <div class="w-edit-card">
          <div class="w-edit-card__title">Datos personales</div>
          <div class="edit-form">
            <div class="form-row cols-2">
              <div class="field"><label>Nombre</label><input type="text" id="epN" value="${W.name.split(' ')[0]||''}"/></div>
              <div class="field"><label>Apellido</label><input type="text" id="epA" value="${W.name.split(' ').slice(1).join(' ')||''}"/></div>
            </div>
            <div class="form-row cols-2">
              <div class="field"><label>Teléfono / WhatsApp</label><input type="tel" id="epPh" value="${W.phone||''}"/></div>
              <div class="field"><label>Email</label><input type="email" id="epE" value="${W.email||''}"/></div>
            </div>
            <div class="form-row cols-2">
              <div class="field"><label>Ubicación</label><input type="text" id="epL" value="${W.location||''}"/></div>
            </div>
          </div>
        </div>
        <div class="w-edit-card">
          <div class="w-edit-card__title">Perfil profesional</div>
          <div class="edit-form">
            <div class="form-row cols-2">
              <div class="field">
                <label>Categorías</label>
                <div class="skills-input-wrap" id="categoriesWrap"></div>
                <div class="categories-options" id="categoriesOptions"></div>
                <span class="field-error" id="catError" style="display:none">Selecciona al menos una categoría</span>
              </div>
              <div class="field"><label>Especialidad</label><input type="text" id="epSp" value="${W.specialty||''}"/></div>
            </div>
            <div class="form-row"><div class="field"><label>Sobre mí</label><textarea id="epAb" rows="4">${W.about||''}</textarea></div></div>
          </div>
        </div>
        <div class="w-edit-card full-width">
          <div class="w-edit-card__title">Habilidades y herramientas</div>
          <div class="skills-input-wrap" id="skillsWrap" onclick="document.getElementById('skillsInp').focus()">
            <input class="skills-input" id="skillsInp" placeholder="Escribe y pulsa Enter para añadir…"/>
          </div>
        </div>
      </div>
    </div>`;
  initSkills();
  initCategories();
}

function setAvail(av) {
  if (!W) return;
  W.availability = av; saveWorker();
  updateAvailNav(); buildWorkerSidebar();
  showToast('Disponibilidad actualizada', AVAIL[av].label);
  renderWorkerPerfil(); initSkills();
}

function saveWorkerPerfil() {
  if (!W) return;
  const n=gv('epN'), a=gv('epA');
  if (n) W.name = [n,a].filter(Boolean).join(' ');
  W.phone       = gv('epPh')  || W.phone;
  W.email       = gv('epE')   || W.email;
  W.location    = gv('epL')   || W.location;
  W.specialty   = gv('epSp')  || W.specialty;
  W.about       = gv('epAb')  || W.about;
  W.category    = [...editCategories];
  W.tags        = [...editSkills];
  saveWorker(); buildWorkerSidebar(); updateAvailNav();
  showToast('Perfil actualizado', 'Los cambios ya son visibles para las empresas.');
}

let editSkillsInited = false;
function initSkills() {
  editSkills = [...(W?.tags||[])];
  renderSkills();
  const inp = document.getElementById('skillsInp');
  if (!inp || editSkillsInited) return;
  editSkillsInited = true;
  inp.addEventListener('keydown', function(e){
    if ((e.key==='Enter'||e.key===',') && this.value.trim()) {
      e.preventDefault();
      const v = this.value.trim().replace(',','');
      if (!editSkills.includes(v) && editSkills.length<12) { editSkills.push(v); renderSkills(); }
      this.value='';
    }
    if (e.key==='Backspace' && !this.value && editSkills.length) { editSkills.pop(); renderSkills(); }
  });
}
function renderSkills() {
  const wrap=document.getElementById('skillsWrap'), inp=document.getElementById('skillsInp');
  if (!wrap||!inp) return;
  wrap.querySelectorAll('.skill-chip').forEach(c=>c.remove());
  editSkills.forEach(s => {
    const ch=document.createElement('div'); ch.className='skill-chip';
    ch.innerHTML=`${s}<button class="skill-chip__remove" onclick="editSkills=editSkills.filter(x=>x!=='${s}');renderSkills()">×</button>`;
    wrap.insertBefore(ch,inp);
  });
}

const CATEGORY_OPTIONS = ['Obra gruesa','Acabados','Instalaciones','Maquinaria','Técnicos','Auxiliares'];
function initCategories() {
  renderCategories();
}

function renderCategories() {
  const wrap = document.getElementById('categoriesWrap');
  if (!wrap) return;
  wrap.querySelectorAll('.skill-chip').forEach(c => c.remove());
  editCategories.forEach(cat => {
    const ch = document.createElement('div');
    ch.className = 'skill-chip';
    ch.innerHTML = `${cat}<button class="skill-chip__remove" onclick="toggleCategory('${cat}')">×</button>`;
    wrap.appendChild(ch);
  });
  renderCategoryOptions();
}

function renderCategoryOptions() {
  const container = document.getElementById('categoriesOptions');
  if (!container) return;
  container.innerHTML = CATEGORY_OPTIONS.map(cat => {
    const selected = editCategories.includes(cat) ? ' selected' : '';
    return `<button type="button" class="category-option${selected}" onclick="toggleCategory('${cat}')">${cat}</button>`;
  }).join('');
}

function toggleCategory(cat) {
  if (editCategories.includes(cat)) {
    editCategories = editCategories.filter(x => x !== cat);
  } else {
    editCategories.push(cat);
  }
  renderCategories();
}

/* ── PERFIL EMPRESA ──────────────────────────────────────── */
function renderEmpresaPerfil() {
  const e = getEmpresa();
  const ini = (e.nombre||'CA').split(' ').filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('perfilContent').innerHTML = `
    <div class="perfil-layout">
      <div class="perfil-cover">
        <div class="perfil-cover__bg"></div>
        <div class="perfil-cover__body">
          <div class="avatar-circle xl" style="background:linear-gradient(135deg,#7F2A4A,#4A2A7F)">${ini}</div>
          <div class="perfil-cover__info">
            <h1 class="perfil-name" id="pND">${e.nombre||'Constructora Arenas S.A.C.'}</h1>
            <div class="perfil-role">${e.tipo||'Empresa Constructora'} · ${e.ubicacion||'Lima, España'}</div>
            <div class="perfil-meta-row">
              <span>🏗️ ${e.empleados||45} empleados</span>
              <span>📍 ${e.ubicacion||'San Isidro, Lima'}</span>
            </div>
          </div>
          <div class="perfil-cover__actions">
            <button class="btn-orange" onclick="toggleEmpresaForm()">Editar perfil</button>
            <button class="btn-ghost" onclick="window.location.href='company-profile.html'">Ver perfil público</button>
          </div>
        </div>
      </div>
      <div class="perfil-edit-form" id="empEditForm" style="display:none">
        <div class="pef-header">
          <div class="pef-title">Editando perfil</div>
          <div style="display:flex;gap:8px">
            <button class="btn-orange" onclick="saveEmpresaPerfil()">Guardar</button>
            <button class="btn-ghost" onclick="toggleEmpresaForm()">Cancelar</button>
          </div>
        </div>
        <div class="pef-grid">
          <div class="pef-card">
            <div class="pef-card-title">Datos de la empresa</div>
            <div class="pef-fields">
              <div class="pef-field"><label>Nombre</label><input type="text" id="ef-n" value="${e.nombre||''}"/></div>
              <div class="pef-field-row">
                <div class="pef-field"><label>Tipo</label><select id="ef-t"><option>Constructora general</option><option>Subcontrata</option><option>Reformista / autónomo</option><option>Promotora inmobiliaria</option><option>Instaladora</option></select></div>
                <div class="pef-field"><label>Empleados</label><input type="number" id="ef-e" value="${e.empleados||45}" min="1"/></div>
              </div>
              <div class="pef-field-row">
                <div class="pef-field"><label>Ubicación</label><input type="text" id="ef-u" value="${e.ubicacion||''}"/></div>
                <div class="pef-field"><label>Teléfono</label><input type="tel" id="ef-ph" value="${e.telefono||''}"/></div>
              </div>
              <div class="pef-field"><label>Web</label><input type="text" id="ef-w" value="${e.web||''}"/></div>
              <div class="pef-field"><label>Descripción</label><textarea id="ef-d" rows="3">${e.desc||''}</textarea></div>
            </div>
          </div>
          <div class="pef-card">
            <div class="pef-card-title">Verificación</div>
            <div class="verif-item done"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13" stroke-linecap="round"><polyline points="20,6 9,17 4,12"/></svg> RUC verificado</div>
            <div class="verif-item done"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13" stroke-linecap="round"><polyline points="20,6 9,17 4,12"/></svg> Email confirmado</div>
            <div class="verif-item pending"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg> IBAN pendiente</div>
          </div>
        </div>
      </div>
      <div class="perfil-body">
        <div class="perfil-col-main">
          <div class="perfil-card"><div class="perfil-card__title">Sobre la empresa</div><p class="perfil-card__text">${e.desc||'Constructora especializada en obras civiles y edificaciones residenciales en Lima Metropolitana.'}</p></div>
          <div class="perfil-card">
            <div class="perfil-card__title">Obras activas</div>
            <div class="obras-list">
              <div class="obra-item"><div class="obra-emoji">🏢</div><div><div class="obra-name">Torre Residencial Miraflores</div><div class="obra-meta">Multifamiliar · 18 pisos</div></div><span class="obra-badge active">En obra</span></div>
              <div class="obra-item"><div class="obra-emoji">🏭</div><div><div class="obra-name">Almacén Industrial Callao</div><div class="obra-meta">Nave industrial · 2.400 m²</div></div><span class="obra-badge active">En obra</span></div>
            </div>
          </div>
        </div>
        <div class="perfil-col-aside">
          <div class="perfil-card">
            <div class="perfil-card__title">Mi actividad</div>
            <div class="activity-stats">
              <div class="act-stat"><div class="act-stat__n" id="actUnlocked">0</div><div class="act-stat__l">Desbloqueados</div></div>
              <div class="act-stat"><div class="act-stat__n orange" id="actCredits">10</div><div class="act-stat__l">Créditos</div></div>
            </div>
            <button class="btn-orange-outline" style="margin-top:12px;width:100%" onclick="navigate('creditos')">Gestionar créditos</button>
          </div>
        </div>
      </div>
    </div>`;
}

function toggleEmpresaForm() {
  const f = document.getElementById('empEditForm');
  if (f) f.style.display = f.style.display==='none' ? 'block' : 'none';
}

function saveEmpresaPerfil() {
  const e = getEmpresa();
  const updated = { ...e,
    nombre:  gv('ef-n')  || e.nombre,
    tipo:    document.getElementById('ef-t')?.value || e.tipo,
    empleados: gv('ef-e') || e.empleados,
    ubicacion: gv('ef-u') || e.ubicacion,
    telefono:  gv('ef-ph')|| e.telefono,
    web:       gv('ef-w') || e.web,
    desc:      gv('ef-d') || e.desc,
  };
  saveEmpresa(updated);
  toggleEmpresaForm(); buildEmpresaSidebar();
  showToast('Perfil actualizado', 'Los cambios son visibles en tu página pública.');
  renderEmpresaPerfil();
}

/* ═══════════════════════════════════════════════════════════
   PATCH NAVIGATE + INIT
═══════════════════════════════════════════════════════════ */
function patchNavigate() {
  const orig = window.navigate;
  window.navigate = function(page) {
    // Para trabajador: página "buscar" muestra empresas, no trabajadores
    if (window.IS_WORKER && page === 'buscar') {
      const sidebar = document.getElementById('buscarSidebar');
      if (sidebar) sidebar.style.display = 'none';
    } else if (!window.IS_WORKER && page === 'buscar') {
      const sidebar = document.getElementById('buscarSidebar');
      if (sidebar) sidebar.style.display = '';
    }
    orig(page);
    // Render contenido de páginas específicas
    if (page === 'buscar'    && window.IS_WORKER) renderEmpresasPage();
    if (page === 'urgentes')    renderUrgentesPage();
    if (page === 'empleo')      renderEmpleos();
    if (page === 'actividad')   renderActividadPage();
    if (page === 'perfil')      renderPerfilPage();
    // Recalcular actUnlocked/actCredits en perfil empresa
    if (page === 'perfil' && !window.IS_WORKER) {
      const STATE = window.STATE;
      if (STATE) {
        const au=document.getElementById('actUnlocked'); if(au) au.textContent=STATE.unlocked.length;
        const ac=document.getElementById('actCredits');  if(ac) ac.textContent=STATE.credits;
      }
    }
    editSkillsInited = false;
  };
}

function patchInit() {
  // Extender el init de app.js para que también renderice el sidebar correcto
  // app.js ya llamó renderSuggested y renderUrgentes, están bien
}

/* ═══════════════════════════════════════════════════════════
   TRABAJADOR — ACCIONES MODALES
═══════════════════════════════════════════════════════════ */
function confirmHire(type) {
  if (!W) return;
  W.availability = type==='full' ? 'busy' : 'limited';
  saveWorker(); closeModal('hireModal');
  updateAvailNav(); buildWorkerSidebar();
  showToast('Contratación confirmada', AVAIL[W.availability].label);
}

function executeBaja() {
  if (!W) return;
  W.availability = 'busy'; saveWorker();
  closeModal('leaveModal'); updateAvailNav(); buildWorkerSidebar();
  showToast('Baja registrada', 'Puedes reactivarte desde Mi Perfil cuando quieras.');
}

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
function gv(id) { return (document.getElementById(id)?.value||'').trim(); }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }
function closeModalOverlay(e,id) { if(e.target===document.getElementById(id)) closeModal(id); }

document.addEventListener('keydown', e => {
  if(e.key==='Escape'){['workerModal','buyModal','hireModal','leaveModal'].forEach(closeModal);}
});

/* ═══════════════════════════════════════════════════════════
   PATCH app.js: usar cl_session en vez de construlinker_session
   y manejar creditsTopNav solo si existe
═══════════════════════════════════════════════════════════ */
function patchAppJs() {
  // app.js usa 'construlinker_state' — lo mantenemos
  // Solo aseguramos que el init de app.js no falle al buscar elementos empresa
  // que podrían no existir para un trabajador
}

/* ═══════════════════════════════════════════════════════════
   INIT FINAL
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  // app.js init ya corrió (está antes en el HTML)
  // main.js corre después: superpone la capa de rol
  setTimeout(initMain, 10);
});
