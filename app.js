/* ═══════════════════════════════════════════════════════════
   CONSTRULINKER — APP.JS
   Sistema de créditos, perfiles, feed, historial
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

/* ── DATOS: PROFESIONALES ───────────────────────────────── */
const PROFESSIONALS = [
  {
    id: 1,
    code: "CL-001",
    name: "Rafael Montoya",
    specialty: "Ing. Civil Estructural",
    category: "Técnicos",
    exp: 14, expLabel: "14 años exp.",
    location: "Miraflores, Lima",
    availability: "available",
    tags: ["BIM", "ETABS", "SAP2000", "Concreto"],
    phone: "+51 987 654 321",
    email: "r.montoya@constru.pe",
    whatsapp: "+51987654321",
    initials: "RM",
    color: ["#1A3A6E","#2A5A9E"],
    about: "Ingeniero civil con 14 años de experiencia en diseño estructural de edificios multifamiliares y obras civiles. Especialista en modelado BIM y análisis sísmico."
  },
  {
    id: 2,
    code: "CL-002",
    name: "Valeria Torres",
    specialty: "Arquitecta Senior",
    category: "Técnicos",
    exp: 9, expLabel: "9 años exp.",
    location: "San Isidro, Lima",
    availability: "available",
    tags: ["AutoCAD", "Revit", "LEED", "3D Max"],
    phone: "+51 976 543 210",
    email: "v.torres@arq.pe",
    whatsapp: "+51976543210",
    initials: "VT",
    color: ["#3A1A6E","#5A2A9E"],
    about: "Arquitecta especializada en diseño residencial y comercial. Certificada en LEED y con experiencia en coordinación de proyectos BIM."
  },
  {
    id: 3,
    code: "CL-003",
    name: "Carlos Espinoza",
    specialty: "Maestro de Obra",
    category: "Obra gruesa",
    exp: 18, expLabel: "18 años exp.",
    location: "Callao, Lima",
    availability: "busy",
    tags: ["Encofrado", "Concreto", "Acero", "Albañilería"],
    phone: "+51 965 432 109",
    email: "c.espinoza@obra.pe",
    whatsapp: "+51965432109",
    initials: "CE",
    color: ["#1A5E2A","#2A8E3E"],
    about: "Maestro de obra con 18 años en construcción de edificios y estructuras de concreto armado. Experiencia en jefatura de frentes de trabajo."
  },
  {
    id: 4,
    code: "CL-004",
    name: "Sofía Quispe",
    specialty: "Técnico de PRL / SSOMA",
    category: "Técnicos",
    exp: 7, expLabel: "7 años exp.",
    location: "Surco, Lima",
    availability: "available",
    tags: ["SSOMA", "ISO 45001", "SCTR", "IPERC"],
    phone: "+51 954 321 098",
    email: "s.quispe@safety.pe",
    whatsapp: "+51954321098",
    initials: "SQ",
    color: ["#6E3A1A","#9E5A2A"],
    about: "Especialista en seguridad y salud ocupacional para obras de construcción. Experiencia en implementación de sistemas de gestión ISO 45001."
  },
  {
    id: 5,
    code: "CL-005",
    name: "Diego Paredes",
    specialty: "Residente de Obra",
    category: "Técnicos",
    exp: 12, expLabel: "12 años exp.",
    location: "La Molina, Lima",
    availability: "available",
    tags: ["MS Project", "Primavera P6", "Lean", "BIM"],
    phone: "+51 943 210 987",
    email: "d.paredes@obra.pe",
    whatsapp: "+51943210987",
    initials: "DP",
    color: ["#6E1A3A","#9E2A5A"],
    about: "Residente de obra con vasta experiencia en gestión de proyectos de construcción. Especializado en planificación Lean y control de costos."
  },
  {
    id: 6,
    code: "CL-006",
    name: "Lucía Benítez",
    specialty: "Electricista Industrial",
    category: "Instalaciones",
    exp: 6, expLabel: "6 años exp.",
    location: "Jesús María, Lima",
    availability: "limited",
    tags: ["Baja Tensión", "IIEE", "AutoCAD Elec.", "Tableros"],
    phone: "+51 932 109 876",
    email: "l.benitez@elect.pe",
    whatsapp: "+51932109876",
    initials: "LB",
    color: ["#1A6E6E","#2A9E9E"],
    about: "Electricista certificada con experiencia en instalaciones eléctricas de baja y media tensión para edificios multifamiliares y centros comerciales."
  },
  {
    id: 7,
    code: "CL-007",
    name: "Marco Ríos",
    specialty: "Oficial Albañil",
    category: "Obra gruesa",
    exp: 16, expLabel: "16 años exp.",
    location: "Villa El Salvador, Lima",
    availability: "available",
    tags: ["Muros", "Pisos", "Cerámicos", "Tarrajeo"],
    phone: "+51 921 098 765",
    email: "m.rios@albañil.pe",
    whatsapp: "+51921098765",
    initials: "MR",
    color: ["#5A3A1A","#8A5A2A"],
    about: "Oficial albañil de primera con 16 años de experiencia en obras de edificación. Especialista en trabajo fino y acabados de calidad."
  },
  {
    id: 8,
    code: "CL-008",
    name: "Ana Fuentes",
    specialty: "Pintora de Acabados",
    category: "Acabados",
    exp: 8, expLabel: "8 años exp.",
    location: "Barranco, Lima",
    availability: "available",
    tags: ["Pintura", "Empaste", "Estucado", "Texturas"],
    phone: "+51 910 987 654",
    email: "a.fuentes@acabados.pe",
    whatsapp: "+51910987654",
    initials: "AF",
    color: ["#1A3A5E","#2A5A8E"],
    about: "Especialista en pintura y acabados de interiores y exteriores. Experiencia en proyectos residenciales y comerciales de alta gama."
  },
  {
    id: 9,
    code: "CL-009",
    name: "Pedro Cárdenas",
    specialty: "Operador de Grúa",
    category: "Maquinaria",
    exp: 11, expLabel: "11 años exp.",
    location: "Ate, Lima",
    availability: "limited",
    tags: ["Grúa Torre", "Grúa Móvil", "LICONA", "Rigger"],
    phone: "+51 989 876 543",
    email: "p.cardenas@maq.pe",
    whatsapp: "+51989876543",
    initials: "PC",
    color: ["#4E1A1A","#7E2A2A"],
    about: "Operador de grúa torre y móvil con licencia vigente. 11 años operando en obras de gran altura en Lima y provincias."
  },
  {
    id: 10,
    code: "CL-010",
    name: "Rosa Mamani",
    specialty: "Gasfitero / Sanitaria",
    category: "Instalaciones",
    exp: 9, expLabel: "9 años exp.",
    location: "San Juan de Miraflores",
    availability: "available",
    tags: ["Agua fría/caliente", "Desagüe", "Presión", "IISS"],
    phone: "+51 978 765 432",
    email: "r.mamani@sanit.pe",
    whatsapp: "+51978765432",
    initials: "RM",
    color: ["#1A2A6E","#2A3A9E"],
    about: "Gasfitero especializado en instalaciones sanitarias de edificaciones residenciales y comerciales. Experiencia en sistemas de agua a presión."
  },
  {
    id: 11,
    code: "CL-011",
    name: "Jorge Huanca",
    specialty: "Peón de Construcción",
    category: "Auxiliares",
    exp: 3, expLabel: "3 años exp.",
    location: "San Martín de Porres",
    availability: "available",
    tags: ["Demolición", "Limpieza obra", "Cargador", "Apoyo general"],
    phone: "+51 967 654 321",
    email: "j.huanca@const.pe",
    whatsapp: "+51967654321",
    initials: "JH",
    color: ["#2A4A2A","#3A6A3A"],
    about: "Peón de construcción polivalente y con disposición inmediata. Experiencia en demoliciones, movimiento de materiales y apoyo en obra."
  },
  {
    id: 12,
    code: "CL-012",
    name: "Sandra Vargas",
    specialty: "Ing. de Presupuestos",
    category: "Técnicos",
    exp: 5, expLabel: "5 años exp.",
    location: "Magdalena, Lima",
    availability: "limited",
    tags: ["S10", "Excel Avanzado", "APU", "Metrados"],
    phone: "+51 956 543 210",
    email: "s.vargas@presup.pe",
    whatsapp: "+51956543210",
    initials: "SV",
    color: ["#4A2A5A","#6A3A8A"],
    about: "Ingeniera civil especializada en presupuestos y control de costos de obras. Dominio avanzado de S10 y análisis de precios unitarios."
  },
];

/* ── DATOS: FEED POSTS ──────────────────────────────────── */
const FEED_POSTS = [
  {
    id: "p1",
    type: "job",
    avatar: { initials:"CA", grad:["#7F2A4A","#4A2A7F"] },
    authorName: "Constructora Arenas",
    authorRole: "Empresa Constructora · Lima, PE",
    time: "Hace 2 horas",
    tag: "🔔 OFERTA DE TRABAJO",
    content: `Se buscan <strong>3 Oficiales Albañiles</strong> para incorporación inmediata en obra en Miraflores. Jornada completa, contrato obra. Requisito: experiencia mínima 3 años en edificación. Pago semanal.`,
    emoji: null,
    likes: 14, comments: 5
  },
  {
    id: "p2",
    type: "profile",
    avatar: { initials:"RM", grad:["#1A3A6E","#2A5A9E"] },
    authorName: "Rafael Montoya",
    authorRole: "Ing. Civil Estructural · Disponible",
    time: "Hace 5 horas",
    tag: "✅ DISPONIBLE",
    content: `Finalizo proyecto en <strong>Surco</strong> a fin de mes y estoy disponible para nuevas incorporaciones desde el 1 de agosto. Especializado en estructuras de concreto armado y coordinación BIM. ¿Tu empresa necesita refuerzo técnico?`,
    emoji: null,
    likes: 28, comments: 8
  },
  {
    id: "p3",
    type: "image",
    avatar: { initials:"BV", grad:["#2A4A1A","#3A6A2A"] },
    authorName: "Buildex Contratistas",
    authorRole: "Empresa Constructora · San Borja",
    time: "Hace 8 horas",
    tag: "📸 AVANCE DE OBRA",
    content: `Cerramos el encofrado del piso 12 de nuestra torre en San Isidro. <strong>¡Equipo de 28 trabajadores comprometidos!</strong> Gracias a todos los profesionales que hacen posible estos proyectos.`,
    emoji: "🏗️",
    likes: 67, comments: 22
  },
  {
    id: "p4",
    type: "urgent",
    avatar: { initials:"TC", grad:["#6E1A1A","#9E2A2A"] },
    authorName: "Técnica Constructora SAC",
    authorRole: "Empresa Constructora · Callao",
    time: "Hace 11 horas",
    tag: "🚨 URGENTE",
    content: `Necesitamos <strong>2 Electricistas IIEE</strong> para hoy. Obra en Callao, conocimiento en tableros e instalaciones de baja tensión. Disponibilidad inmediata. Contactar directo.`,
    emoji: null,
    likes: 9, comments: 3
  },
];

/* ── PACKS DE CRÉDITOS ──────────────────────────────────── */
const PACKS = [
  {
    id:"p1", credits:1, price:"5 €", priceNum:5,
    label:"1 Crédito", ideal:"Necesidades puntuales",
    desc:"1 acción de contacto, descarga u oferta. Validez 12 meses.",
    featured:false
  },
  {
    id:"p20", credits:20, price:"59 €", priceNum:59,
    label:"Pack 20", ideal:"Reformistas y autónomos",
    desc:"2,95 €/crédito. Contacta 20 trabajadores o realiza 20 acciones.",
    featured:false
  },
  {
    id:"p50", credits:50, price:"149 €", priceNum:149,
    label:"Pack 50", ideal:"Rotación mensual de personal",
    desc:"2,98 €/crédito. Perfiles, ofertas y documentación todo el mes.",
    featured:true
  },
  {
    id:"p200", credits:200, price:"499 €", priceNum:499,
    label:"Pack 200", ideal:"Constructoras medianas y grandes",
    desc:"2,49 €/crédito. Operativa mensual completa. +10 créditos GRATIS.",
    featured:false
  },
];

/* ── ESTADO GLOBAL ──────────────────────────────────────── */
let STATE = {
  credits: 10,
  unlocked: [],     // IDs de perfiles desbloqueados
  history: [],      // Movimientos de créditos
  currentPage: 'feed',
  activeFilter: { disp:['available','limited'], cat:'all', exp:'all' }
};

const LS_KEY = 'construlinker_state';

/* ── PERSISTENCIA ───────────────────────────────────────── */
function saveState() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(STATE)); } catch(e) {}
}

function loadState() {
  try {
    const s = localStorage.getItem(LS_KEY);
    if (s) STATE = { ...STATE, ...JSON.parse(s) };

    // 👇 MODO DEPURACIÓN: Forzar reset cada vez que recargas 👇
    STATE.unlocked = [1]; // Solo Rafael Montoya (ID: 1) estará desbloqueado
    STATE.credits = 10;   // Siempre empiezas con 10 créditos
    saveState();          // Sobrescribimos la memoria sucia del navegador
    // 👆 ELIMINAR ESTAS 3 LÍNEAS CUANDO PASES A PRODUCCIÓN 👆

  } catch(e) {}
}

/* ── NAVEGACIÓN ─────────────────────────────────────────── */
function navigate(page) {
  STATE.currentPage = page;
  // Ocultar todas las páginas visibles
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });
  window.scrollTo({ top:0, behavior:'smooth' });
  // Re-render page-specific content
  if (page === 'buscar')    renderProfGrid();
  if (page === 'creditos')  renderCreditsPage();
  if (page === 'perfil')    renderPerfilPage();
}

function filterAndNavigate(cat) {
  STATE.activeFilter.cat = cat;
  navigate('buscar');
}

/* ── RENDER URGENTES (sidebar derecho) ──────────────────── */
function renderUrgentes() {
  const el = document.getElementById('urgentList');
  if (!el) return;
  const urgentes = PROFESSIONALS.filter(p => p.availability === 'available').slice(0, 3);
  if (!urgentes.length) { el.innerHTML = '<div style="font-size:12px;color:var(--text-dim);padding:6px 0">Sin perfiles urgentes ahora mismo.</div>'; return; }
  el.innerHTML = urgentes.map(p => {
    const grad = `background:linear-gradient(135deg,${p.color[0]},${p.color[1]})`;
    return `
      <div class="urgent-mini-card" onclick="accessUrgentProfile(${p.id})">
        <div class="avatar-circle sm" style="${grad}">${p.initials}</div>
        <div class="umc-info">
          <div class="umc-name">${formatNameWithInitial(p.name)}</div>
          <div class="umc-code">${p.code}</div>
          <div class="umc-role">${p.specialty}</div>
        </div>
        <span class="umc-credit">1 crédito</span>
      </div>`;
  }).join('');
}

/* ── FILTRO CATEGORÍA 7 (Listado general) ───────────────── */
function filterUrgent() {
  document.querySelectorAll('.f-disp').forEach(cb => { cb.checked = cb.value === 'available'; });
  applyFilters();
}

/* ── SEMÁFORO ───────────────────────────────────────────── */
function updateSemaforo() {
  const banner = document.getElementById('semaforoBanner');
  const inlineEl = document.getElementById('semaforoInline');
  const inlineText = document.getElementById('semaforoInlineText');
  const inlineDot = document.getElementById('semaforoDot');

  let msg = '', level = '', dotClass = '', show = false;

  if (STATE.credits <= 0) {
    msg = '❌ Sin créditos. No puedes contactar trabajadores hasta que compres un pack.';
    level = 'danger'; dotClass = 'danger'; show = true;
  } else if (STATE.credits === 1) {
    msg = '⚡ Último crédito disponible. Compra un pack antes de quedarte sin acceso a candidatos.';
    level = 'critical'; dotClass = 'critical'; show = true;
  } else if (STATE.credits <= 3) {
    msg = `⚠️ Solo te quedan ${STATE.credits} créditos. Puedes quedarte sin acceso en cualquier momento.`;
    level = 'warning'; dotClass = 'warning'; show = true;
  } else if (STATE.credits <= 10) {
    msg = `Te quedan ${STATE.credits} créditos. Compra un pack para evitar interrupciones.`;
    show = true; dotClass = 'warning';
  }

  banner.style.display = show ? 'flex' : 'none';
  if (show) document.getElementById('semaforoText').textContent = msg.replace(/^[⚡⚠️❌]+\s*/,'');

  if (inlineEl && STATE.currentPage === 'creditos') {
    inlineEl.style.display = show ? 'flex' : 'none';
    if (inlineText) inlineText.textContent = msg;
    if (inlineDot) { inlineDot.className = 'semaforo-dot'; inlineDot.classList.add(dotClass); }
  }

  // main padding
  document.querySelector('.app-main').classList.toggle('banner-visible', show);
}

/* ── ACTUALIZAR TODOS LOS INDICADORES DE CRÉDITOS ────────── */
function updateAllCreditsUI() {
  const c = STATE.credits;
  const isLow = c < 3;
  ['creditsTopNav','miniCredits','creditsHeroValue','statCredits','actCredits'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = c;
    if (id === 'creditsTopNav') el.classList.toggle('low', isLow);
    if (id === 'creditsHeroValue') {
      el.classList.toggle('low', isLow);
      // pulse animation
      el.style.transform = 'scale(1.06)';
      setTimeout(() => { el.style.transform = 'scale(1)'; el.style.transition = 'transform .2s'; }, 200);
    }
  });
  const miniU = document.getElementById('miniUnlocked');
  const actU = document.getElementById('actUnlocked');
  if (miniU) miniU.textContent = STATE.unlocked.length;
  if (actU) actU.textContent = STATE.unlocked.length;

  // No credits alert
  const alertNoCredits = document.getElementById('alertNoCredits');
  if (alertNoCredits) alertNoCredits.style.display = c <= 0 ? 'flex' : 'none';

  updateSemaforo();
  saveState();
}

/* ── HISTORIAL ──────────────────────────────────────────── */
function renderHistorial() {
  const el = document.getElementById('historialList');
  if (!el) return;
  if (STATE.history.length === 0) {
    el.innerHTML = `<div class="historial-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="36" height="36" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      <span>Sin movimientos todavía.</span>
    </div>`;
    return;
  }
  el.innerHTML = STATE.history.map(h => `
    <div class="historial-item">
      <div class="hist-icon ${h.isPlus ? 'plus credit-plus' : 'credit-minus'}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          ${h.isPlus
            ? '<polyline points="20,6 9,17 4,12"/>'
            : '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/>'}
        </svg>
      </div>
      <div class="hist-body">
        <div class="hist-desc">${h.desc}</div>
        <div class="hist-time">${h.time}</div>
      </div>
      <div class="hist-amount ${h.isPlus ? 'plus' : 'minus'}">${h.isPlus ? '+' : ''}${h.amount}</div>
    </div>`).join('');
}

function clearHistory() {
  STATE.history = [];
  saveState();
  renderHistorial();
  showToast('Historial borrado', 'Los movimientos han sido eliminados.', false);
}

/* ── RENDER FEED ────────────────────────────────────────── */
function renderFeed() {
  const el = document.getElementById('feedPosts');
  if (!el) return;

  el.innerHTML = FEED_POSTS.map(post => {
    const grad = `background:linear-gradient(135deg,${post.avatar.grad[0]},${post.avatar.grad[1]})`;
    const imageBlock = post.emoji ? `<div class="feed-post__image">${post.emoji}</div>` : '';
    return `
    <article class="feed-post" id="post-${post.id}">
      <div class="feed-post__header">
        <div class="avatar-circle md" style="${grad}">${post.avatar.initials}</div>
        <div class="feed-post__author">
          <div class="feed-post__name">${post.authorName}</div>
          <div class="feed-post__role">${post.authorRole}</div>
          <div class="feed-post__time">${post.time}</div>
        </div>
        <button class="feed-post__more">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>
      <span class="feed-post__tag">${post.tag}</span>
      <div class="feed-post__content">${post.content}</div>
      ${imageBlock}
      <div class="feed-post__actions">
        <button class="post-action-btn" onclick="likePost('${post.id}',this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="16" height="16"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
          <span class="like-count-${post.id}">${post.likes}</span> Me interesa
        </button>
        <button class="post-action-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="16" height="16"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          ${post.comments} Comentarios
        </button>
        <button class="post-action-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="16" height="16"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          Compartir
        </button>
      </div>
    </article>`;
  }).join('');
}

function likePost(id, btn) {
  const post = FEED_POSTS.find(p => p.id === id);
  if (!post) return;
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  btn.classList.toggle('liked', post.liked);
  const countEl = document.querySelector(`.like-count-${id}`);
  if (countEl) countEl.textContent = post.likes;
}

/* ═══════════════════════════════════════════════════════════
   CIERRE DE BRECHAS — PERFIL EMPRESA + RECORDATORIOS
═══════════════════════════════════════════════════════════ */

const EMPRESA_KEY = 'construlinker_empresa';

/* ── PERFIL EMPRESA: TOGGLE EDICIÓN ─────────────────────── */
function toggleEditarPerfil() {
  const form = document.getElementById('perfilEditForm');
  const body = document.getElementById('perfilBody');
  if (!form) return;
  const isOpen = form.style.display !== 'none';
  if (isOpen) { cancelarEditarPerfil(); return; }

  // Poblar campos con datos actuales
  const empresa = getEmpresaData();
  safeSet('ef-nombre',    empresa.nombre    || 'Constructora Arenas S.A.C.');
  safeSet('ef-tipo',      empresa.tipo      || 'Constructora general');
  safeSet('ef-empleados', empresa.empleados || '45');
  safeSet('ef-ubicacion', empresa.ubicacion || 'San Isidro, Lima');
  safeSet('ef-telefono',  empresa.telefono  || '');
  safeSet('ef-web',       empresa.web       || '');
  safeSet('ef-desc',      empresa.desc      || '');

  // Verificación dentro del formulario
  const vl = document.getElementById('pefVerifList');
  if (vl) vl.innerHTML = `
    <div class="verif-item done"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13" stroke-linecap="round"><polyline points="20,6 9,17 4,12"/></svg> RUC verificado</div>
    <div class="verif-item done"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13" stroke-linecap="round"><polyline points="20,6 9,17 4,12"/></svg> Email confirmado</div>
    <div class="verif-item pending" style="cursor:pointer" onclick="showToast('IBAN pendiente','Agrega tu cuenta bancaria para recibir facturación.',false)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      IBAN pendiente — <span style="color:var(--orange)">Completar</span>
    </div>`;

  form.style.display = 'block';
  document.getElementById('btnEditarPerfil').innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    Cerrar editor`;
  form.scrollIntoView({ behavior:'smooth', block:'start' });
}

function cancelarEditarPerfil() {
  document.getElementById('perfilEditForm').style.display = 'none';
  document.getElementById('btnEditarPerfil').innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    Editar perfil`;
}

function guardarPerfilEmpresa() {
  const datos = {
    nombre:    document.getElementById('ef-nombre')?.value.trim()    || '',
    tipo:      document.getElementById('ef-tipo')?.value             || '',
    empleados: document.getElementById('ef-empleados')?.value        || '',
    ubicacion: document.getElementById('ef-ubicacion')?.value.trim() || '',
    telefono:  document.getElementById('ef-telefono')?.value.trim()  || '',
    web:       document.getElementById('ef-web')?.value.trim()       || '',
    desc:      document.getElementById('ef-desc')?.value.trim()      || '',
  };

  if (!datos.nombre) { showToast('Nombre obligatorio','Escribe el nombre de tu empresa.', false); return; }

  try { localStorage.setItem(EMPRESA_KEY, JSON.stringify({ ...getEmpresaData(), ...datos })); } catch(e){}

  // Actualizar displays en tiempo real
  safeText('perfilNombreDisplay', datos.nombre);
  safeText('perfilTipoDisplay',   `${datos.tipo} · ${datos.ubicacion}`);
  safeText('perfilEmpDisplay',    datos.empleados);
  safeText('perfilUbicDisplay',   datos.ubicacion);
  safeText('perfilDescDisplay',   datos.desc || document.getElementById('perfilDescDisplay')?.textContent);
  const slug = datos.nombre.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').slice(0,20);
  safeText('perfilSlugDisplay',   slug);

  cancelarEditarPerfil();
  showToast('Perfil actualizado','Los cambios son visibles en tu página pública.');
  pushNotif('system', 'Perfil de empresa actualizado', 'Tu información ya es visible para los trabajadores.', 'company-profile.html');
}

function getEmpresaData() {
  try { return JSON.parse(localStorage.getItem(EMPRESA_KEY) || '{}'); } catch(e) { return {}; }
}

function toggleSwitch(id) {
  document.getElementById(id)?.classList.toggle('active');
}

function copyPerfilLink() {
  const slug = document.getElementById('perfilSlugDisplay')?.textContent || 'mi-empresa';
  try { navigator.clipboard.writeText(`https://construlinker.pe/${slug}`); } catch(e){}
  showToast('Enlace copiado', `construlinker.pe/${slug}`);
}

function safeSet(id, val) { const el = document.getElementById(id); if(el) el.value = val; }
function safeText(id, val) { const el = document.getElementById(id); if(el) el.textContent = val; }

/* ── MATCH AUTOMÁTICO MEJORADO ──────────────────────────── */
function renderSuggested() {
  const el = document.getElementById('suggestedList');
  const countEl = document.getElementById('availableCount');
  if (!el) return;

  const empresa = getEmpresaData();
  const avail = PROFESSIONALS.filter(p => p.availability === 'available');
  if (countEl) countEl.textContent = avail.length;

  // Score básico: prioriza técnicos si la empresa es constructora
  const scored = avail.map(p => {
    let score = 0;
    if (p.category === 'Técnicos') score += 2;
    if (STATE.unlocked.includes(p.id)) score += 1;
    return { ...p, score };
  }).sort((a,b) => b.score - a.score).slice(0, 5);

  el.innerHTML = scored.map(p => `
    <div class="suggested-worker" onclick="window.location.href='worker-profile.html?id=${p.id}'">
      <div class="avatar-circle sm" style="background:linear-gradient(135deg,${p.color[0]},${p.color[1]})">${p.initials}</div>
      <div class="sw-info">
        <div class="sw-name">${formatNameWithInitial(p.name)}</div>
        <div class="sw-code">${p.code}</div>
        <div class="sw-role">${p.specialty}</div>
      </div>
      <span class="sw-status ${p.availability}">${p.availability === 'available' ? 'Disponible' : 'Limitado'}</span>
    </div>`).join('');
}

/* ── RECORDATORIOS DE REACTIVACIÓN (Reglas PDF punto 5) ── */
function initReactivationReminders() {
  // Simula el sistema de recordatorios automáticos cuando un trabajador lleva
  // más de 30 días sin actualizar su estado (Reglas PDF - Punto 5B)
  // En producción esto sería un cron job del backend
  const workerState = JSON.parse(localStorage.getItem('construlinker_worker') || '{}');
  const profile = workerState.profile;
  if (!profile) return;

  if (profile.availability === 'busy') {
    const lastUpdate = profile.lastStatusUpdate
      ? new Date(profile.lastStatusUpdate)
      : new Date(profile.registeredAt || Date.now() - 32 * 864e5);
    const daysSince = Math.floor((Date.now() - lastUpdate.getTime()) / 864e5);

    if (daysSince >= 30) {
      // Notificación al trabajador (simulada)
      setTimeout(() => {
        pushNotif(
          'system',
          'Recordatorio: ¿Sigues no disponible?',
          `Han pasado ${daysSince} días desde tu último cambio de estado. ¿Puedes actualizar tu disponibilidad?`,
          'worker-dashboard.html'
        );
      }, 5000);
    }
  }
}

/* ── HISTORIAL CON FECHA DE EXPIRACIÓN (12 meses) ──────── */
function addHistory(desc, amount, isPlus=false) {
  const expiryDate = isPlus
    ? new Date(Date.now() + 365 * 864e5).toLocaleDateString('es-PE', { day:'2-digit', month:'short', year:'numeric' })
    : null;

  const entry = {
    id: Date.now(),
    desc: expiryDate ? `${desc} · Válido hasta ${expiryDate}` : desc,
    amount,
    isPlus,
    time: new Date().toLocaleString('es-PE', { dateStyle:'short', timeStyle:'short' })
  };
  STATE.history.unshift(entry);
  if (STATE.history.length > 50) STATE.history.pop();
  saveState();
}

/* ── RENDER GRID DE PROFESIONALES ───────────────────────── */
function renderProfGrid() {
  const el = document.getElementById('profGrid');
  const countEl = document.getElementById('resultsCount');
  if (!el) return;

  // Leer filtros del DOM
  const dispVals = [...document.querySelectorAll('.f-disp:checked')].map(cb => cb.value);
  const catCbs   = [...document.querySelectorAll('.f-cat:checked')].map(cb => cb.value);
  const allCats  = catCbs.includes('all');
  const expVal   = document.querySelector('input[name="exp"]:checked')?.value || 'all';
  const locationVal = document.getElementById('locationSearch')?.value?.trim().toLowerCase() || '';
  const sort     = document.getElementById('sortSelect')?.value || 'recent';

  // Categoria 7 — Listado general: ignora filtro de categoria
  const isTodos = STATE.activeFilter.cat === 'todos';

  let filtered = PROFESSIONALS.filter(p => {
    // Lógica especial para filtro "unlocked"
    const isUnlockedSelected = dispVals.includes('unlocked');
    const otherDispVals = dispVals.filter(v => v !== 'unlocked');

    // Si "unlocked" está seleccionado, incluir perfiles desbloqueados
    if (isUnlockedSelected && STATE.unlocked.includes(p.id)) return true;

    // Para otros filtros de disponibilidad
    if (otherDispVals.length > 0 && !otherDispVals.includes(p.availability)) return false;

    // Si solo "unlocked" está seleccionado y no hay otros filtros, solo mostrar desbloqueados
    if (isUnlockedSelected && otherDispVals.length === 0 && !STATE.unlocked.includes(p.id)) return false;

    if (!isTodos && !allCats) {
      const profCats = Array.isArray(p.category) ? p.category : [p.category];
      const hasMatch = catCbs.some(cat => profCats.includes(cat));
      if (!hasMatch) return false;
    }
    if (expVal === 'junior' && p.exp > 3)   return false;
    if (expVal === 'mid' && (p.exp < 4 || p.exp > 9)) return false;
    if (expVal === 'senior' && p.exp < 10)  return false;

    // Filtro de ubicación
    if (locationVal) {
      const location = p.location.toLowerCase();
      if (!location.includes(locationVal)) return false;
    }

    return true;
  });

  if (sort === 'exp')   filtered.sort((a,b) => b.exp - a.exp);
  if (sort === 'avail') filtered.sort((a,b) => {
    const order = {available:0, limited:1, busy:2};
    return order[a.availability] - order[b.availability];
  });

  if (countEl) countEl.textContent = `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`;

  const titleEl = document.querySelector('.results-title');
  if (titleEl) titleEl.textContent = isTodos ? 'Listado General — Todos los oficios' : 'Profesionales Verificados';

  el.innerHTML = filtered.map(p => renderProfCard(p)).join('');
  if (isTodos) STATE.activeFilter.cat = 'all';
}

function applyFilters() { renderProfGrid(); }

function applyFiltersListadoGeneral(cb) {
  if (cb.checked) {
    // Desmarcar todas las demás categorías y marcar solo listado general
    document.querySelectorAll('.f-cat').forEach(c => { c.checked = false; });
    cb.checked = true;
    STATE.activeFilter.cat = 'todos';
    document.querySelectorAll('.f-disp').forEach(c => { c.checked = true; });
  } else {
    STATE.activeFilter.cat = 'all';
    document.querySelector('.f-cat[value="all"]').checked = true;
  }
  renderProfGrid();
}

/* ── RENDER CARD INDIVIDUAL ─────────────────────────────── */
function renderProfCard(p) {
  const isUnlocked = STATE.unlocked.includes(p.id);
  const grad = `background:linear-gradient(135deg,${p.color[0]},${p.color[1]})`;

  const statusLabels = { available:'Disponible', limited:'Disp. Limitada', busy:'No disponible' };
  const statusLabel  = statusLabels[p.availability] || p.availability;

  const tagsHTML = p.tags.map(t => `<span class="prof-tag">${t}</span>`).join('');

  const contactBox = isUnlocked ? `
    <div class="prof-contact visible">
      <div class="contact-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="12" height="12"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.1 1.22 2 2 0 012.1.01h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L6.27 7.9a16 16 0 006.18 6.18l.98-.98a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        ${p.phone}
      </div>
      <div class="contact-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="12" height="12"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
        <a href="https://wa.me/${p.whatsapp}" target="_blank">WhatsApp</a>
      </div>
      <div class="contact-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="12" height="12"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <a href="mailto:${p.email}">${p.email}</a>
      </div>
    </div>` : '';

  // Cover gradient color based on category
  const catColors = {
    'Obra gruesa':'linear-gradient(135deg,#1A1A0A,#2A2A0F)',
    'Acabados':   'linear-gradient(135deg,#0A1A1A,#0F2A2A)',
    'Instalaciones':'linear-gradient(135deg,#0A0A1A,#0F0F2A)',
    'Maquinaria': 'linear-gradient(135deg,#1A0A0A,#2A0F0F)',
    'Técnicos':   'linear-gradient(135deg,#1A0A1A,#2A0F2A)',
    'Auxiliares': 'linear-gradient(135deg,#0A1A0A,#0F2A0F)',
  };
  const coverStyle = catColors[p.category] || 'linear-gradient(135deg,#1A1A1A,#2A2A2A)';

  const actionBtn = isUnlocked
    ? `<button class="btn-orange full-h w-full" onclick="window.location.href='worker-profile.html?id=${p.id}'">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
         Ver perfil completo
       </button>`
    : `<button class="btn-orange full-h w-full" onclick="unlockProfile(${p.id})" ${STATE.credits <= 0 ? 'disabled title="Sin créditos"' : ''}>
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
         Desbloquear Perfil · 1 crédito
       </button>`;

  return `
    <div class="prof-card ${isUnlocked ? 'unlocked' : ''}" id="card-${p.id}">
      <div class="prof-card__cover" style="${coverStyle}"></div>
      <div class="prof-card__avatar-zone">
        <div class="prof-card__avatar">
          <div class="avatar-circle lg" style="${grad}">${p.initials}</div>
        </div>
        <span class="status-badge ${isUnlocked ? 'unlocked-mark' : p.availability}">
          ${isUnlocked ? '🔓 DESBLOQUEADO' : statusLabel}
        </span>
      </div>
      <div class="prof-card__body">
        <div class="prof-card__name">${formatNameWithInitial(p.name)}</div>
        <div class="prof-card__specialty">${p.specialty}</div>
        <div class="prof-card__code">${p.code}</div>
        <div class="prof-card__meta">
          <div class="prof-meta-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
            ${p.expLabel}
          </div>
          <div class="prof-meta-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${p.location}
          </div>
          <div class="prof-meta-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            ${p.category}
          </div>
        </div>
        <div class="prof-card__tags">${tagsHTML}</div>
        ${contactBox}
        <div class="prof-card__actions">
          ${actionBtn}
          <div class="prof-card__actions-row">
            <button class="btn-ghost" style="flex:1;font-size:11.5px" onclick="sendOffer(${p.id})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="13" height="13"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
              Oferta directa
            </button>
            <button class="btn-ghost" style="flex:1;font-size:11.5px" onclick="openWorkerModal(${p.id})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="13" height="13"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Ver
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

/* ── DESBLOQUEAR PERFIL ─────────────────────────────────── */
function unlockProfile(id) {
  if (STATE.credits <= 0) {
    showNoCreditsModal();
    return;
  }
  if (STATE.unlocked.includes(id)) return;

  STATE.credits--;
  STATE.unlocked.push(id);
  const p = PROFESSIONALS.find(x => x.id === id);
  addHistory(`Ver contacto de ${p.name} (${p.specialty})`, '-1 crédito');

  updateAllCreditsUI();
  renderProfGrid();
  showToast(`${p.name} desbloqueado`, `Contacto y datos visibles · ${STATE.credits} crédito${STATE.credits !== 1 ? 's' : ''} restante${STATE.credits !== 1 ? 's' : ''}`);

  // Push notification
  pushNotif('unlock', `Perfil desbloqueado`, `Tienes acceso al contacto de ${p.name} (${p.specialty}).`, `worker-profile.html?id=${id}`);

  if (STATE.currentPage === 'creditos') renderHistorial();
}

/* ── ENVIAR OFERTA DIRECTA ──────────────────────────────── */
function sendOffer(id) {
  if (STATE.credits <= 0) { showNoCreditsModal(); return; }
  const p = PROFESSIONALS.find(x => x.id === id);
  if (!p) return;

  STATE.credits--;
  addHistory(`Oferta directa a ${p.name} (${p.specialty})`, '-1 crédito');
  updateAllCreditsUI();
  showToast('Oferta enviada', `Se notificó a ${p.name} tu oferta de trabajo.`);
  pushNotif('offer', 'Oferta enviada', `Tu oferta directa llegó a ${p.name}. Espera su respuesta en mensajes.`, 'messages.html');
  if (STATE.currentPage === 'creditos') renderHistorial();
}

/* ── ACCIÓN 4: SOLICITAR DISPONIBILIDAD ─────────────────── */
function requestAvailability(id) {
  if (STATE.credits <= 0) { showNoCreditsModal(); return; }
  const p = PROFESSIONALS.find(x => x.id === id);
  if (!p) return;

  STATE.credits--;
  addHistory(`Solicitar disponibilidad de ${p.name} (${p.specialty})`, '-1 crédito');
  updateAllCreditsUI();
  showToast('Disponibilidad consultada', `${p.name} — ${
    p.availability === 'available' ? 'Disponible de inmediato' :
    p.availability === 'limited'   ? 'Disponibilidad parcial' : 'No disponible'
  }`);
  if (STATE.currentPage === 'creditos') renderHistorial();
  window.location.href = `worker-profile.html?id=${id}`;
}

/* ── ACCIÓN 5: ACCESO A PERFILES URGENTES ───────────────── */
function accessUrgentProfile(id) {
  if (STATE.credits <= 0) { showNoCreditsModal(); return; }
  const p = PROFESSIONALS.find(x => x.id === id);
  if (!p) return;

  if (!STATE.unlocked.includes(id)) {
    STATE.credits--;
    STATE.unlocked.push(id);
    addHistory(`Acceso a perfil urgente de ${p.name} (${p.specialty})`, '-1 crédito');
    updateAllCreditsUI();
    pushNotif('unlock', 'Perfil urgente desbloqueado', `Acceso prioritario a ${p.name} activado.`, `worker-profile.html?id=${id}`);
    if (STATE.currentPage === 'creditos') renderHistorial();
    showToast(`¡Perfil urgente desbloqueado!`, `${p.name} está listo para incorporarse. Contáctalo ahora.`);
  }
  window.location.href = `worker-profile.html?id=${id}`;
}

/* ── ACCIÓN 6: VERIFICACIÓN RÁPIDA DE DOCUMENTACIÓN ────── */
function verifyDocsAction(id) {
  if (STATE.credits <= 0) { showNoCreditsModal(); return; }
  const p = PROFESSIONALS.find(x => x.id === id);
  if (!p) return;

  STATE.credits--;
  addHistory(`Verificación rápida de docs de ${p.name}`, '-1 crédito');
  updateAllCreditsUI();
  showToast('Documentación verificada', `Los certificados de ${p.name} son válidos y están actualizados.`);
  if (STATE.currentPage === 'creditos') renderHistorial();
}

/* ── MODAL: VER PERFIL TRABAJADOR ───────────────────────── */
function openWorkerModal(id) {
  const p = PROFESSIONALS.find(x => x.id === id);
  if (!p) return;
  const isUnlocked = STATE.unlocked.includes(id);
  const grad = `background:linear-gradient(135deg,${p.color[0]},${p.color[1]})`;
  const statusLabels = {available:'Disponible',limited:'Disp. Limitada',busy:'No disponible'};
  const tagsHTML = p.tags.map(t=>`<span class="prof-tag">${t}</span>`).join('');

  const coverGrad = `background:linear-gradient(135deg,${p.color[0]},${p.color[1]},#0F0F10)`;

  const contactSection = isUnlocked ? `
    <div class="wm-section">
      <div class="wm-section-title">Contacto</div>
      <div class="wm-contact-box">
        <div class="wm-contact-title">✅ PERFIL DESBLOQUEADO</div>
        <div class="contact-row" style="margin-bottom:6px">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.1 1.22 2 2 0 012.1.01h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L6.27 7.9a16 16 0 006.18 6.18l.98-.98a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          ${p.phone}
        </div>
        <div class="contact-row" style="margin-bottom:6px">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
          <a href="https://wa.me/${p.whatsapp}" target="_blank">+${p.whatsapp} (WhatsApp)</a>
        </div>
        <div class="contact-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <a href="mailto:${p.email}">${p.email}</a>
        </div>
      </div>
    </div>` : `
    <div class="wm-section">
      <div class="wm-section-title">Contacto</div>
      <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius-md);padding:16px;text-align:center;">
        <div style="font-size:12.5px;color:var(--text-muted);margin-bottom:12px;">
          ${STATE.credits <= 0
            ? '❌ Sin créditos. Compra un pack para ver los datos de este candidato.'
            : '🔒 Necesitas 1 crédito para ver el teléfono, WhatsApp y email del trabajador.'}
        </div>
        ${STATE.credits > 0
          ? `<button class="btn-orange" onclick="unlockProfile(${p.id});closeModal('workerModal')">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="13" height="13"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
               Desbloquear · 1 crédito
             </button>`
          : `<button class="btn-orange" onclick="navigate('creditos');closeModal('workerModal')">Comprar créditos</button>`}
      </div>
    </div>`;

  const box = document.getElementById('workerModalBox');
  box.innerHTML = `
    <div class="modal-cover" style="${coverGrad}"></div>
    <div class="wm-avatar-zone">
      <div class="avatar-circle xl" style="${grad}">${p.initials}</div>
      <div class="wm-identity">
        <div class="wm-name">${formatNameWithInitial(p.name)}</div>
        <div class="wm-spec">${p.specialty}</div>
      </div>
      <button class="modal-close" onclick="closeModal('workerModal')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="wm-section">
      <div class="wm-section-title">Información general</div>
      <div class="wm-info-grid">
        <div class="wm-info-item"><div class="wm-info-item__l">Categoría</div><div class="wm-info-item__v">${p.category}</div></div>
        <div class="wm-info-item"><div class="wm-info-item__l">Experiencia</div><div class="wm-info-item__v">${p.expLabel}</div></div>
        <div class="wm-info-item"><div class="wm-info-item__l">Ubicación</div><div class="wm-info-item__v">${p.location}</div></div>
        <div class="wm-info-item"><div class="wm-info-item__l">Estado</div><div class="wm-info-item__v">${statusLabels[p.availability]}</div></div>
      </div>
    </div>
    <div class="wm-section">
      <div class="wm-section-title">Sobre el profesional</div>
      <p style="font-size:13.5px;color:var(--text-muted);line-height:1.6;">${p.about}</p>
    </div>
    <div class="wm-section">
      <div class="wm-section-title">Habilidades y herramientas</div>
      <div class="wm-tags">${tagsHTML}</div>
    </div>
    ${contactSection}
    <div class="wm-actions">
      <div class="wm-actions-row">
        <button class="btn-ghost" style="flex:1" onclick="sendOffer(${p.id});closeModal('workerModal')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="14" height="14"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
          Oferta directa · 1 crédito
        </button>
        <button class="btn-ghost" style="flex:1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="14" height="14"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
          Descargar CV/PRL · 1 crédito
        </button>
      </div>
    </div>`;

  document.getElementById('workerModal').classList.add('active');
}

/* ── MODAL: SIN CRÉDITOS ────────────────────────────────── */
function showNoCreditsModal() {
  const box = document.getElementById('buyModalBox');
  box.innerHTML = `
    <div class="modal-header" style="padding-bottom:14px">
      <div class="modal-title" style="color:var(--red)">Sin créditos disponibles</div>
      <button class="modal-close" onclick="closeModal('buyModal')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div style="padding:0 20px 20px">
      <p style="font-size:13.5px;color:var(--text-muted);margin-bottom:16px;line-height:1.6">
        No puedes contactar al trabajador hasta que compres un pack. <strong style="color:var(--text)">Este candidato podría recibir otras ofertas.</strong>
      </p>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
        ${PACKS.slice(1).map(pk=>`
          <button class="pack-card" style="text-align:left;cursor:pointer" onclick="buyPack('${pk.id}')">
            <div class="pack-top">
              <span class="pack-credits">${pk.credits}</span>
              <span class="pack-credits-label">créditos</span>
              <span class="pack-price">${pk.price}</span>
            </div>
            <div class="pack-desc" style="margin-bottom:0">${pk.ideal}</div>
          </button>`).join('')}
      </div>
      <button class="btn-ghost w-full" onclick="closeModal('buyModal')">Cancelar</button>
    </div>`;
  document.getElementById('buyModal').classList.add('active');
}

/* ── COMPRAR PACK ───────────────────────────────────────── */
function buyPack(packId) {
  const pack = PACKS.find(p => p.id === packId);
  if (!pack) return;
  closeModal('buyModal');

  // Simulación de compra
  const bonus = pack.id === 'p200' ? 10 : 0;
  STATE.credits += pack.credits + bonus;
  const desc = bonus > 0
    ? `Compra Pack ${pack.credits} créditos (${pack.price}) + ${bonus} bonus`
    : `Compra Pack ${pack.credits} crédito${pack.credits > 1 ? 's' : ''} (${pack.price})`;
  addHistory(desc, `+${pack.credits + bonus} créditos`, true);

  updateAllCreditsUI();
  if (STATE.currentPage === 'creditos') renderCreditsPage();
  showToast(`Pack activado 🎉`, `${pack.credits + bonus} créditos añadidos. ¡Listo para empezar!`, true);
}

/* ── RENDER PÁGINA CRÉDITOS ─────────────────────────────── */
function renderCreditsPage() {
  // Valor hero
  const heroEl = document.getElementById('creditsHeroValue');
  if (heroEl) heroEl.textContent = STATE.credits;

  // Packs
  const packsEl = document.getElementById('packsGrid');
  if (packsEl) {
    packsEl.innerHTML = PACKS.map(pk => `
      <div class="pack-card ${pk.featured ? 'featured' : ''}">
        <div class="pack-top">
          <span class="pack-credits">${pk.credits}</span>
          <span class="pack-credits-label">crédito${pk.credits > 1 ? 's' : ''}</span>
          <span class="pack-price">${pk.price}</span>
        </div>
        <div class="pack-desc">${pk.ideal} — ${pk.desc}</div>
        <button class="btn-orange pack-cta" onclick="buyPack('${pk.id}')">
          <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          Comprar ${pk.label}
        </button>
      </div>`).join('');
  }

  renderHistorial();
  updateSemaforo();
}

function scrollToPacks() {
  const el = document.getElementById('packsSection');
  if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
}

/* ── RENDER PERFIL ──────────────────────────────────────── */
/* ── RENDER PERFIL — delega al motor de roles (main.js) ─── */
function renderPerfilPage() {
  // main.js detecta el rol y renderiza el perfil correcto
  // Si main.js no está cargado aún, fallback básico
  if (typeof renderEmpresaPerfilPage === 'function' && !window.IS_WORKER) {
    renderEmpresaPerfilPage();
  } else if (typeof renderWorkerPerfilPage === 'function' && window.IS_WORKER) {
    renderWorkerPerfilPage();
    if (typeof initEditSkills === 'function') initEditSkills();
  } else {
    // Fallback: actualiza contadores básicos
    const actU = document.getElementById('actUnlocked');
    const actC = document.getElementById('actCredits');
    if (actU) actU.textContent = STATE.unlocked.length;
    if (actC) actC.textContent = STATE.credits;
  }
}

/* ── MODALES HELPERS ────────────────────────────────────── */
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}
function closeModalOverlay(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}

/* ── TOAST ──────────────────────────────────────────────── */
let toastTimer = null;
function showToast(title, sub, isSuccess=true) {
  const el = document.getElementById('toastEl');
  const iconEl = document.getElementById('toastIcon');
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastSub').textContent = sub;
  iconEl.innerHTML = isSuccess
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="13" height="13"><polyline points="20,6 9,17 4,12"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

/* ── KEYBOARD ESC ───────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal('workerModal');
    closeModal('buyModal');
  }
});

/* ── BÚSQUEDA GLOBAL ────────────────────────────────────── */
document.getElementById('globalSearch').addEventListener('input', function() {
  const q = this.value.trim().toLowerCase();
  if (q.length < 2) return;
  navigate('buscar');
  setTimeout(() => {
    const cards = document.querySelectorAll('.prof-card');
    cards.forEach(card => {
      const txt = card.textContent.toLowerCase();
      card.style.display = txt.includes(q) ? '' : 'none';
    });
  }, 50);
});
document.getElementById('globalSearch').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    navigate('buscar');
  }
});

/* ═══════════════════════════════════════════════════════════
   FASE 3 — NOTIFICATIONS SYSTEM
═══════════════════════════════════════════════════════════ */

const NOTIF_KEY = 'construlinker_notifications';
let notifications = [];

const NOTIF_TYPES = {
  unlock:  { icon:'🔓', cls:'unlock'  },
  message: { icon:'💬', cls:'message' },
  offer:   { icon:'✉️',  cls:'offer'   },
  credit:  { icon:'⭐', cls:'credit'  },
  hire:    { icon:'🤝', cls:'system'  },
  system:  { icon:'🔔', cls:'system'  },
};

function loadNotifications() {
  try { notifications = JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]'); }
  catch(e) { notifications = []; }

  // Seed demo notifs if empty
  if (!notifications.length) {
    notifications = [
      { id:1, type:'message', title:'Rafael Montoya te escribió', desc:'¿Tienen alguna oportunidad para un ingeniero estructural?', time:'Hace 2 horas', unread:true,  link:'messages.html?conv=1001' },
      { id:2, type:'offer',   title:'Oferta aceptada', desc:'Diego Paredes aceptó tu oferta para la obra de Surco.', time:'Ayer 10:30', unread:true,  link:'messages.html' },
      { id:3, type:'credit',  title:'Saldo bajo de créditos', desc:'Te quedan 10 créditos. Compra un pack para evitar interrupciones.', time:'Ayer 09:15', unread:false, link:null },
      { id:4, type:'unlock',  title:'Perfil desbloqueado', desc:'Desbloqueaste el perfil de Valeria Torres.', time:'Hace 3 días', unread:false, link:'worker-profile.html?id=2' },
      { id:5, type:'system',  title:'Bienvenido a Construlinker', desc:'Tu cuenta de empresa está activa. Empieza buscando personal.', time:'Hace 5 días', unread:false, link:null },
    ];
    saveNotifications();
  }
}

function saveNotifications() {
  try { localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications)); } catch(e) {}
}

/* ── Add a new notification ───────────────────────────── */
function pushNotif(type, title, desc, link = null) {
  const notif = {
    id:     Date.now(),
    type, title, desc, link,
    time:   'Ahora mismo',
    unread: true
  };
  notifications.unshift(notif);
  if (notifications.length > 30) notifications.pop();
  saveNotifications();
  renderNotifPanel();
  updateNotifBadge();

  // Auto-flash the bell
  const btn = document.getElementById('notifBtn');
  if (btn) { btn.classList.add('active'); setTimeout(() => btn.classList.remove('active'), 2000); }
}

/* ── Render panel ─────────────────────────────────────── */
function renderNotifPanel() {
  const el = document.getElementById('notifList');
  if (!el) return;

  if (!notifications.length) {
    el.innerHTML = `<div class="notif-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32" stroke-linecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
      <span>Sin notificaciones nuevas</span>
    </div>
    <div class="notif-footer"><button class="link-btn" style="font-size:11.5px" onclick="toggleNotifPanel()">Cerrar</button></div>`;
    return;
  }

  el.innerHTML = notifications.slice(0, 12).map(n => {
    const cfg = NOTIF_TYPES[n.type] || NOTIF_TYPES.system;
    return `
      <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="handleNotifClick(${n.id})">
        <div class="ni-icon ${cfg.cls}">${cfg.icon}</div>
        <div class="ni-body">
          <div class="ni-title">${n.title}</div>
          <div class="ni-desc">${n.desc}</div>
          <div class="ni-time">${n.time}</div>
        </div>
        ${n.unread ? '<div class="ni-unread-dot"></div>' : ''}
      </div>`;
  }).join('') +
  `<div class="notif-footer">
    <button class="link-btn" style="font-size:11.5px" onclick="clearNotifications()">Borrar todo</button>
    <a href="messages.html" style="font-size:11.5px;color:var(--orange)">Ver mensajes →</a>
  </div>`;
}

function handleNotifClick(id) {
  const n = notifications.find(x => x.id === id);
  if (!n) return;
  n.unread = false;
  saveNotifications();
  renderNotifPanel();
  updateNotifBadge();
  if (n.link) window.location.href = n.link;
  else toggleNotifPanel();
}

function markAllRead() {
  notifications.forEach(n => n.unread = false);
  saveNotifications();
  renderNotifPanel();
  updateNotifBadge();
}

function clearNotifications() {
  notifications = [];
  saveNotifications();
  renderNotifPanel();
  updateNotifBadge();
}

function updateNotifBadge() {
  const unread = notifications.filter(n => n.unread).length;
  const badge  = document.getElementById('notifBadge');
  if (!badge) return;
  badge.style.display = unread > 0 ? 'flex' : 'none';
  badge.textContent   = unread > 9 ? '9+' : unread;
}

function toggleNotifPanel() {
  const panel = document.getElementById('notifPanel');
  if (!panel) return;
  const isOpen = panel.classList.toggle('open');
  // Close search dropdown if open
  document.getElementById('searchDropdown')?.classList.remove('open');
  if (isOpen) { renderNotifPanel(); updateNotifBadge(); }
}

/* ── Close panel on outside click ────────────────────── */
document.addEventListener('click', e => {
  const panel = document.getElementById('notifPanel');
  const btn   = document.getElementById('notifBtn');
  if (panel?.classList.contains('open') && !panel.contains(e.target) && !btn?.contains(e.target)) {
    panel.classList.remove('open');
  }
});

/* ── Hook notifications into existing actions ────────── */
const _origUnlock = window.unlockProfile;

/* ═══════════════════════════════════════════════════════════
   FASE 3 — LIVE SEARCH
═══════════════════════════════════════════════════════════ */
let searchIdx   = -1;
let searchItems = [];
let searchTimer = null;

function initLiveSearch() {
  const input = document.getElementById('globalSearch');
  const dd    = document.getElementById('searchDropdown');
  if (!input || !dd) return;

  input.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => renderSearchDropdown(input.value.trim()), 120);
  });

  input.addEventListener('keydown', e => {
    if (!dd.classList.contains('open')) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSearchSel(1); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); moveSearchSel(-1); }
    if (e.key === 'Enter')     { e.preventDefault(); selectSearchItem(); }
    if (e.key === 'Escape')    { dd.classList.remove('open'); input.blur(); }
  });

  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 1) renderSearchDropdown(input.value.trim());
  });

  document.addEventListener('click', e => {
    if (!dd.contains(e.target) && !input.contains(e.target)) {
      dd.classList.remove('open');
    }
  });
}

function renderSearchDropdown(q) {
  const dd = document.getElementById('searchDropdown');
  if (!q || q.length < 1) { dd.classList.remove('open'); return; }

  const qLow = q.toLowerCase();
  const results = PROFESSIONALS.filter(p =>
    p.name.toLowerCase().includes(qLow) ||
    p.specialty.toLowerCase().includes(qLow) ||
    p.category.toLowerCase().includes(qLow) ||
    p.location.toLowerCase().includes(qLow) ||
    p.tags.some(t => t.toLowerCase().includes(qLow))
  ).slice(0, 6);

  searchItems = results;
  searchIdx   = -1;

  const availLabels = { available:'Disponible', limited:'Limitada', busy:'No disponible' };

  if (!results.length) {
    dd.innerHTML = `
      <div class="sd-section-title">Profesionales</div>
      <div class="sd-no-results">No se encontraron resultados para "<strong>${escapeHtml(q)}</strong>"</div>
      <div class="sd-footer"><span>¿No encuentras lo que buscas?</span><button class="link-btn" onclick="navigate('buscar');document.getElementById('searchDropdown').classList.remove('open')">Ver directorio completo →</button></div>`;
    dd.classList.add('open');
    return;
  }

  dd.innerHTML = `
    <div class="sd-section-title">Profesionales · ${results.length} resultado${results.length !== 1 ? 's' : ''}</div>
    ${results.map((p,i) => {
      const grad = `background:linear-gradient(135deg,${p.color[0]},${p.color[1]})`;
      const highlighted = highlightMatch(p.name, q);
      return `
        <div class="sd-item" id="sd-item-${i}" onclick="goToProfile(${p.id})">
          <div class="sd-avatar" style="${grad}">${p.initials}</div>
          <div class="sd-info">
            <div class="sd-name">${highlighted}</div>
            <div class="sd-role">${p.specialty} · ${p.location}</div>
          </div>
          <span class="sd-badge ${p.availability}">${availLabels[p.availability]}</span>
        </div>`;
    }).join('')}
    <div class="sd-footer">
      <span class="sd-hint"><kbd>↑↓</kbd> navegar · <kbd>Enter</kbd> abrir · <kbd>Esc</kbd> cerrar</span>
      <button class="link-btn" onclick="applySearchFilter('${escapeHtml(q)}')">Ver todos →</button>
    </div>`;

  dd.classList.add('open');
  // Close notif panel if open
  document.getElementById('notifPanel')?.classList.remove('open');
}

function highlightMatch(text, q) {
  if (!q) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function moveSearchSel(dir) {
  const items = document.querySelectorAll('.sd-item');
  items[searchIdx]?.classList.remove('active');
  searchIdx = Math.max(-1, Math.min(searchItems.length - 1, searchIdx + dir));
  items[searchIdx]?.classList.add('active');
  items[searchIdx]?.scrollIntoView({ block:'nearest' });
}

function selectSearchItem() {
  if (searchIdx >= 0 && searchItems[searchIdx]) {
    goToProfile(searchItems[searchIdx].id);
  }
}

function goToProfile(id) {
  document.getElementById('searchDropdown').classList.remove('open');
  document.getElementById('globalSearch').value = '';
  window.location.href = `worker-profile.html?id=${id}`;
}

function applySearchFilter(q) {
  document.getElementById('searchDropdown').classList.remove('open');
  navigate('buscar');
  setTimeout(() => {
    document.querySelectorAll('.prof-card').forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
    });
  }, 80);
}

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
function init() {
  loadState();

  // Handle URL params (e.g. company-dashboard.html?page=buscar)
  const params = new URLSearchParams(window.location.search);
  const pageParam = params.get('page');
  if (pageParam && ['feed','buscar','creditos','perfil'].includes(pageParam)) {
    STATE.currentPage = pageParam;
  }

  renderFeed();
  renderSuggested();
  renderUrgentes();
  renderCreditsPage();
  updateAllCreditsUI();
  updateSemaforo();
  loadNotifications();
  renderNotifPanel();
  updateNotifBadge();
  initLiveSearch();
  initReactivationReminders();

  // Set active nav
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === STATE.currentPage);
  });
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${STATE.currentPage}`).classList.add('active');
  if (STATE.currentPage === 'buscar') renderProfGrid();

  // Simulate incoming notification after 8s (demo)
  setTimeout(() => {
    pushNotif(
      'message',
      'Rafael Montoya te respondió',
      'Perfecto, podemos coordinar por teléfono para afinar los detalles.',
      'messages.html?conv=1001'
    );
  }, 8000);
}

document.addEventListener('DOMContentLoaded', init);
