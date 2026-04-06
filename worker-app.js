/* ═══════════════════════════════════════════════════════════
   CONSTRULINKER — WORKER-APP.JS
   Panel del profesional: disponibilidad, documentos,
   actividad, ofertas y automatización de estados
═══════════════════════════════════════════════════════════ */

'use strict';

const WORKER_KEY = 'construlinker_worker';

/* ── OFICIOS POR CATEGORÍA ───────────────────────────── */
const OFICIOS = {
  'Obra gruesa':   ['Albañil / Oficial de primera','Albañil / Oficial de segunda','Encofrador','Ferrallista','Yesero / Escayolista','Peón de albañilería','Techador / Colocador de cubiertas','Operario de impermeabilización','Montador de andamios'],
  'Acabados':      ['Pintor de obra','Solador / Alicatador','Montador de pladur / Tabiquería seca','Colocador de pavimentos','Colocador de piedra natural / Mármol','Escayolista / Falsos techos','Colocador de carpintería interior','Especialista en aislamientos','Cristalero / Montador de ventanas','Rehabilitador de fachadas'],
  'Instalaciones': ['Fontanero / Instalador de tuberías','Electricista de obra','Instalador de climatización (HVAC)','Instalador de gas','Instalador de sistemas solares / Fotovoltaicos','Técnico de domótica y automatización','Soldador especializado en obra'],
  'Maquinaria':    ['Gruista (torre y móvil)','Operador de retroexcavadora','Operador de pala cargadora','Conductor de camión hormigonera','Transportista de materiales de construcción','Técnico de logística de obra'],
  'Técnicos':      ['Arquitecto','Arquitecto técnico / Aparejador','Ingeniero Civil','Ingeniero de Instalaciones','Delineante / Proyectista','Jefe de Obra','Encargado de Obra','Residente de Obra','Técnico de PRL / SSOMA','Coordinador de Seguridad y Salud','Topógrafo','Ingeniero de Presupuestos'],
  'Auxiliares':    ['Mozo de almacén (materiales de obra)','Operario de planta de prefabricados','Personal de limpieza post-obra','Técnico de logística de obra']
};

/* ── PERFIL DEMO (si no hay registro previo) ─────────── */
const DEMO_WORKER = {
  id: 9001,
  name: "Juan Gómez",
  specialty: "Oficial 1ª Pladur / Tabiquería Seca",
  category: "Acabados",
  exp: 3, expLabel: "3–5 años",
  location: "Callao, Lima",
  availability: "available",
  tags: ["Pladur", "Tabiquería seca", "Falsos techos", "Nivel láser"],
  about: "Oficial de primera especializado en montaje de pladur y tabiquería seca con más de 5 años de experiencia en obras residenciales y comerciales en Lima.",
  phone: "+51 987 123 456",
  email: "juan.gomez@construccion.pe",
  whatsapp: "51987123456",
  docs: { cv: false, prl: false, cert: false, dni: false },
  viewedBy: [
    { company: "Constructora Arenas", action: "Ver contacto", time: "Hace 2 horas", color: ["#7F2A4A","#4A2A7F"] },
    { company: "Buildex Contratistas", action: "Descargó CV", time: "Ayer, 15:30", color: ["#2A4A1A","#3A6A2A"] },
    { company: "Técnica Constructora", action: "Envió oferta directa", time: "Hace 3 días", color: ["#6E1A1A","#9E2A2A"] },
  ],
  offers: [
    {
      id: "o1", isNew: true,
      title: "Oficial de Pladur – Torre Miraflores",
      company: "Constructora Arenas",
      type: "Obra completa",
      location: "Miraflores, Lima",
      time: "Hace 2 horas",
      urgent: true,
      desc: "Buscamos oficial de pladur para torre de 18 pisos. Inicio inmediato. Pago semanal."
    },
    {
      id: "o2", isNew: false,
      title: "Montador tabiquería – Centro Comercial",
      company: "Proyek Builders",
      type: "Contrato por obra",
      location: "San Isidro, Lima",
      time: "Ayer",
      urgent: false,
      desc: "Proyecto de 4 meses en centro comercial. Experiencia en sistemas steel framing."
    },
  ],
  registeredAt: new Date(Date.now() - 7 * 864e5).toISOString(),
  stats: { views: 14, offers: 2, contacts: 3, docsDownloaded: 5 },
  isWorker: true
};

/* ── OFERTAS DE EMPLEO (simuladas) ───────────────────── */
const JOB_LISTINGS = [
  { id:"j1", title:"3 Oficiales Albañiles – Obra Miraflores",   company:"Constructora Arenas",    cat:"Obra gruesa",  location:"Miraflores, Lima", tags:["Inmediato","Jornada completa"], time:"Hace 2h", urgent:true  },
  { id:"j2", title:"Electricista IIEE – Nave Industrial Callao", company:"Buildex Contratistas",  cat:"Instalaciones",location:"Callao, Lima",       tags:["Urgente","Por obra"],           time:"Hace 5h", urgent:true  },
  { id:"j3", title:"Residente de Obra – Edificio San Borja",     company:"Proyek Builders",       cat:"Técnicos",     location:"San Borja, Lima",   tags:["Jornada completa","Experiencia 5+ años"], time:"Ayer",    urgent:false },
  { id:"j4", title:"Pintores de obra – Proyecto Surco",          company:"Alianza Constructores", cat:"Acabados",     location:"Surco, Lima",       tags:["2 semanas","Media jornada"],       time:"Ayer",    urgent:false },
  { id:"j5", title:"Operador Grúa Torre – Torre La Molina",      company:"Torres del Sur SAC",    cat:"Maquinaria",   location:"La Molina, Lima",   tags:["Licencia vigente","1 mes"],    time:"Hace 2d", urgent:false },
  { id:"j6", title:"Técnico PRL – Múltiples obras",              company:"Seguridad & Obra",      cat:"Técnicos",     location:"Lima Metropolitana",tags:["ISO 45001","Freelance"],            time:"Hace 3d", urgent:false },
  { id:"j7", title:"Fontanero IISS – Edificio Barranco",         company:"InstaProyect",          cat:"Instalaciones",location:"Barranco, Lima",     tags:["Por obra","3 meses"],           time:"Hace 4d", urgent:false },
  { id:"j8", title:"Peones construcción – Habilitación Surco",   company:"Arenas & Asociados",    cat:"Auxiliares",   location:"Surco, Lima",       tags:["Inmediato","Jornada completa"],    time:"Hace 5d", urgent:false },
];

/* ── ESTADO GLOBAL ───────────────────────────────────── */
let WORKER = null;
let editSkills = [];
let currentPage = 'dashboard';

/* ── LOAD/SAVE ───────────────────────────────────────── */
function loadWorker() {
  try {
    const stored = JSON.parse(localStorage.getItem(WORKER_KEY) || '{}');
    WORKER = stored.profile || DEMO_WORKER;
    if (!WORKER.stats) WORKER.stats = { views: 0, offers: 0, contacts: 0, docsDownloaded: 0 };
  } catch(e) { WORKER = DEMO_WORKER; }
}
function saveWorker() {
  try { localStorage.setItem(WORKER_KEY, JSON.stringify({ profile: WORKER })); } catch(e) {}
}

/* ── NAVEGACIÓN ──────────────────────────────────────── */
function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === page));
  window.scrollTo({ top:0, behavior:'smooth' });
  if (page === 'perfil')      renderEditPage();
  if (page === 'documentos')  renderDocsPage();
  if (page === 'actividad')   renderActivityFull();
  if (page === 'empleo')      renderEmpleos();
}

/* ── DISPONIBILIDAD ──────────────────────────────────── */
const AVAIL_CONFIG = {
  available: { label:'Disponible',            color:'available', note:'Tu perfil es visible en búsquedas. Las empresas pueden contactarte directamente.' },
  limited:   { label:'Disponibilidad Limitada', color:'limited', note:'Apareces en búsquedas pero con aviso de disponibilidad parcial.' },
  busy:      { label:'No Disponible',           color:'busy',    note:'Tu perfil aparece en búsquedas pero marcado como no disponible.' },
  leave:     { label:'Baja voluntaria',         color:'leave',   note:'Tu perfil está desactivado y no aparece en búsquedas.' },
};

function updateAvailUI() {
  const cfg = AVAIL_CONFIG[WORKER.availability] || AVAIL_CONFIG.available;

  // Navbar dot
  const navDot = document.getElementById('navAvailDot');
  const navLbl = document.getElementById('navAvailLabel');
  if (navDot) { navDot.className = 'avail-pulse ' + cfg.color; }
  if (navLbl)  navLbl.textContent = cfg.label;

  // Banner en dashboard
  const bDot   = document.getElementById('bannerDot');
  const bTitle = document.getElementById('bannerTitle');
  const bSub   = document.getElementById('bannerSub');
  if (bDot)   { bDot.className = 'avail-pulse ' + cfg.color; }
  if (bTitle)  bTitle.textContent = cfg.label;
  if (bSub)    bSub.textContent  = cfg.note;

  // WPC avail badge
  const wpcAvail = document.getElementById('wpcAvailBadge');
  if (wpcAvail) {
    wpcAvail.className = 'wpc-avail ' + cfg.color;
    wpcAvail.innerHTML = `<div class="avail-pulse ${cfg.color}" style="width:7px;height:7px"></div> ${cfg.label}`;
  }

  // Selector en página perfil
  document.querySelectorAll('.avail-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.val === WORKER.availability);
  });
}

function setAvailability(val) {
  if (val === 'leave') { confirmLeave(); return; }
  WORKER.availability = val;
  saveWorker();
  updateAvailUI();
  const cfg = AVAIL_CONFIG[val];
  const noteEl = document.getElementById('availNote');
  if (noteEl) { noteEl.textContent = cfg.note; noteEl.classList.add('visible'); }
  showToast('Estado actualizado', cfg.label + ' — Los cambios ya son visibles.');
}

/* ── AUTOMATIZACIÓN: CONFIRMAR CONTRATACIÓN ──────────── */
function confirmHire(type) {
  const newState = type === 'full' ? 'busy' : 'limited';
  WORKER.availability = newState;
  saveWorker();
  closeModal('hireModal');
  updateAvailUI();
  renderProfileCard();
  const msg = type === 'full'
    ? '¡Enhorabuena! Estado cambiado a No Disponible.'
    : 'Estado cambiado a Disponibilidad Limitada.';
  showToast('Contratación confirmada', msg);
  // Añadir a actividad
  addActivity(`Tu estado fue actualizado a "${AVAIL_CONFIG[newState].label}"`, 'status', '#FF6B00');
}

/* ── BAJA VOLUNTARIA ─────────────────────────────────── */
function confirmLeave() {
  document.getElementById('leaveModal').classList.add('active');
}
function executeBaja() {
  WORKER.availability = 'busy';
  saveWorker();
  closeModal('leaveModal');
  updateAvailUI();
  addActivity('Solicitaste baja voluntaria de la bolsa de trabajo', 'leave', '#EF4444');
  showToast('Baja registrada', 'Tu perfil no aparecerá en búsquedas. Puedes reactivarlo cuando quieras.');
  if (currentPage === 'perfil') renderEditPage();
}

/* ── REACTIVAR PERFIL ────────────────────────────────── */
function reactivateProfile() {
  WORKER.availability = 'available';
  saveWorker();
  updateAvailUI();
  addActivity('Reactivaste tu perfil — ahora eres visible en búsquedas', 'status', '#22C55E');
  showToast('¡Perfil reactivado!', 'Vuelves a aparecer en búsquedas de personal.');
}

/* ── ACTIVIDAD ───────────────────────────────────────── */
function addActivity(desc, type, color) {
  if (!WORKER.viewedBy) WORKER.viewedBy = [];
  WORKER.viewedBy.unshift({ company: desc, action:'', time:'Ahora mismo', color:[color,color], type });
  saveWorker();
  renderActivity();
}

/* ── RENDER: PROFILE CARD (sidebar) ─────────────────── */
function renderProfileCard() {
  const el = document.getElementById('wProfileCard');
  if (!el) return;
  const initials = WORKER.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const grad = `background:linear-gradient(135deg,#3A1A6E,#6A2A9E)`;
  el.innerHTML = `
    <div class="wpc-banner"></div>
    <div class="wpc-body">
      <div class="wpc-avatar-row">
        <div class="avatar-circle lg" style="${grad}">${initials}</div>
      </div>
      <div class="wpc-name">${WORKER.name}</div>
      <div class="wpc-spec">${WORKER.specialty}</div>
      <div class="wpc-location">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="11" height="11"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${WORKER.location}
      </div>
      <div class="wpc-divider"></div>
      <div class="wpc-avail ${WORKER.availability}" id="wpcAvailBadge">
        <div class="avail-pulse ${WORKER.availability}" style="width:7px;height:7px"></div>
        ${AVAIL_CONFIG[WORKER.availability]?.label || 'Disponible'}
      </div>
      <button class="btn-ghost w-full" style="font-size:12px;height:32px" onclick="document.getElementById('hireModal').classList.add('active')">
        Confirmar contratación
      </button>
    </div>`;
}

/* ── RENDER: COMPLETITUD ─────────────────────────────── */
function renderCompletion() {
  const checks = [
    { label:'Nombre y contacto',   done: !!(WORKER.name && WORKER.phone) },
    { label:'Foto de perfil',       done: false },
    { label:'Especialidad definida',done: !!WORKER.specialty },
    { label:'Descripción completa', done: (WORKER.about || '').length >= 80 },
    { label:'CV subido',            done: WORKER.docs?.cv },
    { label:'Certificado PRL',      done: WORKER.docs?.prl },
    { label:'Habilidades añadidas', done: (WORKER.tags || []).length > 0 },
  ];
  const done  = checks.filter(c=>c.done).length;
  const total = checks.length;
  const pct   = Math.round(done/total*100);

  const fillEl = document.getElementById('completionFill');
  const pctEl  = document.getElementById('completionPct');
  if (fillEl) fillEl.style.width = pct + '%';
  if (pctEl)  pctEl.textContent  = pct + '%';

  const itemsEl = document.getElementById('completionItems');
  if (itemsEl) {
    itemsEl.innerHTML = checks.map(c => `
      <div class="compl-item ${c.done ? 'done':''}">
        <div class="compl-check ${c.done ? 'ok':'pend'}">${c.done ? '✓':'·'}</div>
        ${c.label}
      </div>`).join('');
  }
}

/* ── RENDER: STATS ───────────────────────────────────── */
function renderStats() {
  const s = WORKER.stats || {};
  ['Views','Offers','Contacts','Docs'].forEach(k => {
    const el = document.getElementById('stat'+k);
    if (el) el.textContent = s[k.toLowerCase()] ?? s['docsDownloaded'] ?? 0;
  });
  document.getElementById('statViews').textContent    = s.views || 0;
  document.getElementById('statOffers').textContent   = s.offers || 0;
  document.getElementById('statContacts').textContent = s.contacts || 0;
  document.getElementById('statDocs').textContent     = s.docsDownloaded || 0;
}

/* ── RENDER: ACTIVITY (dashboard mini) ──────────────── */
function renderActivity() {
  const el = document.getElementById('activityList');
  if (!el) return;
  const items = (WORKER.viewedBy || []).slice(0,5);
  if (!items.length) {
    el.innerHTML = `<div class="w-activity-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="36" height="36" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      <span>Tu perfil está activo. Aquí aparecerán las visitas de empresas.</span>
    </div>`;
    return;
  }
  el.innerHTML = items.map(item => {
    const initials = (item.company || '').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || '??';
    const grad = item.color ? `background:linear-gradient(135deg,${item.color[0]},${item.color[1]})` : 'background:var(--card)';
    const isStatus = item.type === 'status' || item.type === 'leave';
    return `
    <div class="w-act-item">
      <div class="w-act-icon" style="${isStatus ? 'background:var(--orange-dim)' : grad}">
        ${isStatus
          ? `<svg viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="2" stroke-linecap="round" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`
          : `<span style="font-size:11px;font-weight:700;color:#fff">${initials}</span>`}
      </div>
      <div class="w-act-body">
        <div class="w-act-desc">${isStatus ? item.company : `<strong>${item.company}</strong> · ${item.action}`}</div>
        <div class="w-act-time">${item.time}</div>
      </div>
    </div>`;
  }).join('');
}

/* ── RENDER: ACTIVITY FULL PAGE ──────────────────────── */
function renderActivityFull() {
  const el = document.getElementById('activityFullList');
  if (!el) return;
  const items = WORKER.viewedBy || [];
  if (!items.length) {
    el.innerHTML = `<div class="w-empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40" stroke-linecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
      <span>Aquí aparecerán las empresas que visiten o desbloqueen tu perfil.</span>
    </div>`;
    return;
  }
  el.innerHTML = `
    <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius-md);overflow:hidden">
      ${items.map(item => {
        const initials = (item.company||'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'??';
        const grad = item.color ? `background:linear-gradient(135deg,${item.color[0]},${item.color[1]})` : 'background:var(--border)';
        const isStatus = item.type === 'status' || item.type === 'leave';
        return `
        <div class="w-act-item">
          <div class="w-act-icon" style="${isStatus ? 'background:var(--orange-dim)' : grad}">
            ${isStatus
              ? `<svg viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="2" stroke-linecap="round" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`
              : `<span style="font-size:11px;font-weight:700;color:#fff">${initials}</span>`}
          </div>
          <div class="w-act-body">
            <div class="w-act-desc">${isStatus ? item.company : `<strong>${item.company}</strong> · ${item.action}`}</div>
            <div class="w-act-time">${item.time}</div>
          </div>
          ${!isStatus ? `<span class="w-act-badge" style="background:var(--orange-dim);color:var(--orange);border:1px solid rgba(255,107,0,.2)">${item.action}</span>` : ''}
        </div>`;
      }).join('')}
    </div>`;
}

/* ── RENDER: OFFERS (dashboard) ──────────────────────── */
function renderOffers() {
  const el = document.getElementById('offersList');
  const cnt = document.getElementById('offersCount');
  const offers = WORKER.offers || [];
  if (cnt) cnt.textContent = offers.length;
  if (!offers.length) {
    el.innerHTML = `<div class="w-empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="36" height="36" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
      <span>Aún no has recibido ofertas. Actualiza tu disponibilidad para aparecer en más búsquedas.</span>
    </div>`;
    return;
  }
  el.innerHTML = offers.map(o => `
    <div class="offer-card ${o.isNew ? 'new' : ''}">
      <div class="offer-body">
        <div class="offer-title">
          ${o.isNew ? '<span style="font-size:9px;font-weight:700;background:var(--orange);color:#000;padding:1px 5px;border-radius:2px;margin-right:6px">NUEVA</span>' : ''}
          ${o.title}
        </div>
        <div class="offer-company">${o.company} · ${o.time}</div>
        <div style="font-size:12.5px;color:var(--text-muted);margin:6px 0">${o.desc}</div>
        <div class="offer-meta">
          <span class="offer-tag">${o.type}</span>
          <span class="offer-tag">${o.location}</span>
          ${o.urgent ? '<span class="urgent-tag">🚨 URGENTE</span>' : ''}
        </div>
      </div>
      <div class="offer-actions">
        <button class="btn-orange sm" onclick="respondOffer('${o.id}','accept')">Aceptar</button>
        <button class="btn-ghost"    style="height:28px;font-size:11.5px;padding:0 10px" onclick="respondOffer('${o.id}','reject')">Rechazar</button>
      </div>
    </div>`).join('');
}

function respondOffer(id, action) {
  const label = action === 'accept' ? 'aceptada' : 'rechazada';
  WORKER.offers = WORKER.offers.filter(o => o.id !== id);
  saveWorker();
  renderOffers();
  if (action === 'accept') {
    document.getElementById('hireModal').classList.add('active');
  } else {
    showToast('Oferta rechazada', 'La empresa ha sido notificada.');
  }
}

/* ── RENDER: EDIT PAGE ───────────────────────────────── */
function renderEditPage() {
  const nameParts = WORKER.name.split(' ');
  document.getElementById('edit-nombre').value    = nameParts[0] || '';
  document.getElementById('edit-apellido').value  = nameParts.slice(1).join(' ') || '';
  document.getElementById('edit-phone').value     = WORKER.phone || '';
  document.getElementById('edit-email').value     = WORKER.email || '';
  document.getElementById('edit-location').value  = WORKER.location || '';
  document.getElementById('edit-specialty').value = WORKER.specialty || '';
  document.getElementById('edit-oficio').value = WORKER.oficio || '';
  document.getElementById('edit-about').value     = WORKER.about || '';

  // Category multiple select
  const catSel = document.getElementById('edit-categoria');
  if (catSel) {
    // Clear existing selections
    Array.from(catSel.options).forEach(option => option.selected = false);
    // Set selected options based on WORKER.category
    const workerCats = Array.isArray(WORKER.category) ? WORKER.category : [WORKER.category].filter(Boolean);
    workerCats.forEach(cat => {
      const option = Array.from(catSel.options).find(opt => opt.value === cat);
      if (option) option.selected = true;
    });
  }

  // Trigger update of oficios if categories are selected
  updateEditOficios();

  const expSel = document.getElementById('edit-exp');
  if (expSel) expSel.value = String(WORKER.exp) || '3';

  // Skills
  editSkills = [...(WORKER.tags || [])];
  renderEditSkills();

  // Availability selector
  updateAvailUI();
}

function saveProfile() {
  const n = document.getElementById('edit-nombre').value.trim();
  const a = document.getElementById('edit-apellido').value.trim();
  WORKER.name     = [n,a].filter(Boolean).join(' ');
  WORKER.phone    = document.getElementById('edit-phone').value.trim();
  WORKER.email    = document.getElementById('edit-email').value.trim();
  WORKER.location = document.getElementById('edit-location').value.trim();
  WORKER.specialty= document.getElementById('edit-specialty').value.trim();
  WORKER.oficio   = document.getElementById('edit-oficio').value.trim();
  WORKER.about    = document.getElementById('edit-about').value.trim();
  WORKER.category = Array.from(document.getElementById('edit-categoria').selectedOptions).map(option => option.value);
  WORKER.exp      = parseInt(document.getElementById('edit-exp').value) || 3;
  WORKER.tags     = [...editSkills];
  saveWorker();
  renderProfileCard();
  renderCompletion();
  renderStats();
  showToast('Cambios guardados', 'Tu perfil ha sido actualizado correctamente.');

  // Animate save button
  const btn = document.getElementById('saveProfileBtn');
  if (btn) {
    btn.textContent = '✓ Guardado';
    btn.style.background = 'var(--green)';
    setTimeout(() => {
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="13" height="13"><polyline points="20,6 9,17 4,12"/></svg> Guardar cambios`;
      btn.style.background = '';
    }, 2000);
  }
}

/* ── EDIT SKILLS ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const editInp = document.getElementById('editSkillsInp');
  if (editInp) {
    editInp.addEventListener('keydown', function(e) {
      if ((e.key === 'Enter' || e.key === ',') && this.value.trim()) {
        e.preventDefault();
        const v = this.value.trim().replace(',','');
        if (!editSkills.includes(v) && editSkills.length < 12) { editSkills.push(v); renderEditSkills(); }
        this.value = '';
      }
      if (e.key === 'Backspace' && !this.value && editSkills.length) {
        editSkills.pop(); renderEditSkills();
      }
    });
  }
});

function renderEditSkills() {
  const wrap = document.getElementById('editSkillsWrap');
  if (!wrap) return;
  const inp = document.getElementById('editSkillsInp');
  wrap.querySelectorAll('.skill-chip').forEach(c => c.remove());
  editSkills.forEach(s => {
    const chip = document.createElement('div');
    chip.className = 'skill-chip';
    chip.innerHTML = `${s}<button class="skill-chip__remove" onclick="editSkills=editSkills.filter(x=>x!=='${s}');renderEditSkills()">×</button>`;
    wrap.insertBefore(chip, inp);
  });
}

/* ── UPDATE EDIT OFICIOS ─────────────────────────────── */
function updateEditOficios() {
  const selectedCategories = Array.from(document.getElementById('edit-categoria').selectedOptions).map(option => option.value);
  const sel = document.getElementById('edit-oficio');
  if (!sel) return;

  sel.innerHTML = '<option value="">Seleccionar oficio...</option>';

  if (selectedCategories.length > 0) {
    const allOficios = new Set();
    selectedCategories.forEach(cat => {
      if (OFICIOS[cat]) {
        OFICIOS[cat].forEach(o => allOficios.add(o));
      }
    });

    Array.from(allOficios).sort().forEach(o => {
      const opt = document.createElement('option');
      opt.value = o; opt.textContent = o;
      sel.appendChild(opt);
    });
  }
}

/* ── RENDER: DOCUMENTOS ──────────────────────────────── */
const DOC_DEFS = [
  { id:'cv',   icon:'📄', name:'Currículum Vitae',      desc:'Tu historial profesional completo. Formato PDF o Word recomendado.' },
  { id:'prl',  icon:'🦺', name:'Certificado PRL',        desc:'Prevención de Riesgos Laborales. Obligatorio en la mayoría de obras.' },
  { id:'cert', icon:'🏅', name:'Certificados / Cursos',  desc:'Titulaciones, cursos o formación específica relevante.' },
  { id:'dni',  icon:'🪪', name:'DNI / NIE',               desc:'Documento de identidad para verificación.' },
];

function renderDocsPage() {
  const grid = document.getElementById('docsMainGrid');
  if (!grid) return;
  grid.innerHTML = DOC_DEFS.map(d => {
    const uploaded = WORKER.docs?.[d.id];
    return `
    <div class="doc-main-card ${uploaded ? 'uploaded' : ''}">
      <div class="doc-main-icon">${d.icon}</div>
      <div class="doc-main-name">${d.name}</div>
      <div class="doc-main-desc">${d.desc}</div>
      <div class="doc-main-status ${uploaded ? 'doc-status-ok' : 'doc-status-miss'}">
        ${uploaded ? '✓ SUBIDO' : 'NO SUBIDO'}
      </div>
      ${uploaded
        ? `<div class="doc-dl-count">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="12" height="12"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
             ${Math.floor(Math.random()*5)} descargas por empresas
           </div>`
        : ''}
      <input type="file" id="docfile-${d.id}" accept=".pdf,.doc,.docx,.jpg,.png" onchange="uploadDoc('${d.id}')"/>
      <button class="doc-upload-btn" onclick="document.getElementById('docfile-${d.id}').click()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        ${uploaded ? 'Reemplazar' : 'Subir documento'}
      </button>
    </div>`;
  }).join('');
}

function uploadDoc(id) {
  const f = document.getElementById('docfile-' + id);
  if (!f?.files?.length) return;
  if (!WORKER.docs) WORKER.docs = {};
  WORKER.docs[id] = true;
  saveWorker();
  renderDocsPage();
  renderCompletion();
  const def = DOC_DEFS.find(d=>d.id===id);
  showToast(`${def?.name} subido`, 'Las empresas ya pueden descargarlo usando 1 crédito.');
}

/* ── RENDER: EMPLEO ──────────────────────────────────── */
function renderEmpleos() {
  const grid = document.getElementById('empleoGrid');
  if (!grid) return;
  const filter = document.getElementById('empleoFilter')?.value || 'all';
  const citySearch = document.getElementById('citySearch')?.value?.trim().toLowerCase() || '';

  let filtered = JOB_LISTINGS.filter(j => {
    const catMatch = filter === 'all' || j.cat === filter;
    const cityMatch = !citySearch || j.location.toLowerCase().includes(citySearch);
    return catMatch && cityMatch;
  });

  if (!filtered.length) {
    grid.innerHTML = `<div class="w-empty-state" style="grid-column:1/-1">Sin ofertas para esta categoría y ciudad en este momento.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(j => `
    <div class="empleo-card">
      <div class="empleo-card__header">
        <div class="empleo-body">
          <div class="empleo-title">${j.title}</div>
          <div class="empleo-location">${j.location}</div>
        </div>
      </div>
      <div class="empleo-tags">
        <span class="empleo-tag">${j.cat}</span>
        ${j.tags.map(t=>`<span class="empleo-tag">${t}</span>`).join('')}
      </div>
      <div class="empleo-footer">
        <span class="empleo-time">${j.time}</span>
        <div style="display:flex;gap:6px;align-items:center">
          ${j.urgent ? '<span class="urgent-tag">🚨 URGENTE</span>' : ''}
          <button class="btn-orange sm" onclick="applyJob('${j.id}')">Aplicar</button>
        </div>
      </div>
    </div>`).join('');
}

function applyJob(id) {
  const job = JOB_LISTINGS.find(j=>j.id===id);
  if (!job) return;
  showToast('Solicitud enviada', 'Tu perfil fue enviado a la empresa.');
}

/* ── TIPS SIDEBAR ────────────────────────────────────── */
function updateTips() {
  const checks = {
    'tip-foto':  false,
    'tip-prl':   WORKER.docs?.prl,
    'tip-cv':    WORKER.docs?.cv,
    'tip-about': (WORKER.about||'').length >= 150,
  };
  Object.entries(checks).forEach(([id, done]) => {
    document.getElementById(id)?.classList.toggle('done', !!done);
  });
}

/* ── PROFILE LINK ────────────────────────────────────── */
function updateProfileLink() {
  const slug = (WORKER.name||'tu-perfil').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  const el = document.getElementById('profileSlug');
  if (el) el.textContent = slug;
}
function copyProfileLink() {
  const slug = (WORKER.name||'tu-perfil').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  try { navigator.clipboard.writeText(`construlinker.pe/${slug}`); } catch(e) {}
  showToast('Enlace copiado', `construlinker.pe/${slug}`);
}

/* ── MODALES ─────────────────────────────────────────── */
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }
function closeModalOverlay(e, id) { if (e.target === document.getElementById(id)) closeModal(id); }
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal('hireModal'); closeModal('leaveModal'); }
});

/* ── TOAST ───────────────────────────────────────────── */
let toastTimer = null;
function showToast(title, sub, isOk=true) {
  const el = document.getElementById('toastEl');
  const iconEl = document.getElementById('toastIcon');
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastSub').textContent   = sub;
  iconEl.innerHTML = isOk
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="13" height="13"><polyline points="20,6 9,17 4,12"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>`;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

/* ── INIT ────────────────────────────────────────────── */
function init() {
  loadWorker();
  renderProfileCard();
  renderCompletion();
  renderStats();
  renderActivity();
  renderOffers();
  updateAvailUI();
  updateTips();
  updateProfileLink();
  renderEmpleos();
}

document.addEventListener('DOMContentLoaded', init);
