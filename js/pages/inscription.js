"use strict";
/* ============================================================
   TakaMatch — onboarding isolé
   Extrait de « takamatch-prototype_H.html » et remis au design
   system (TakaMatch-DESIGN.md v1.1, §5 et §8). Un état (O pour le
   parcours, ME pour la fiche), un rendu par étape, délégation
   d'événements sur [data-act]. Pas de framework.
   ============================================================ */

/* ---------- Icônes ---------- */
const P = {
  home:'<path d="M3 10.2 12 3l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  rocket:'<path d="M4.5 14.5c-1.5 1.5-2 5.5-2 5.5s4-.5 5.5-2c.85-.85.84-2.24 0-3.1a2.2 2.2 0 0 0-3.5-.4z"/><path d="M12 15 9 12c1-3.5 3-7 9-9 0 6-2.5 9.5-6 9z"/><path d="M9 12H6s.5-2.8 2-3.5c1.7-.8 3 0 3 0"/><path d="M12 15v3s2.8-.5 3.5-2c.8-1.7 0-3 0-3"/>',
  link:'<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 0 1 0 10h-2"/><path d="M8 12h8"/>',
  chat:'<path d="M21 11.5a8 8 0 0 1-11.6 7.1L3 20.5l1.9-6.4A8 8 0 1 1 21 11.5z"/>',
  tools:'<path d="M14.7 6.3a4 4 0 0 0 5.3 5.3l-8.3 8.3a2.4 2.4 0 0 1-3.4-3.4z"/><path d="m6.5 3.5 3 3-2 2-3-3z"/><path d="m4.5 5.5-2 2 3.5 3.5 2-2"/>',
  file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
  cog:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.9-.9 1.5v.4"/><path d="M12 17.2h.01"/>',
  bell:'<path d="M18 8a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 14 18 8z"/><path d="M13.7 20a2 2 0 0 1-3.4 0"/>',
  sun:'<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M2.5 12h2M19.5 12h2M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5"/>',
  moon:'<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
  check:'<path d="m4.5 12.5 5 5 10-11"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  heart:'<path d="M20.4 5.6a5 5 0 0 0-7.1 0L12 6.9l-1.3-1.3a5 5 0 0 0-7.1 7.1L12 21l8.4-8.3a5 5 0 0 0 0-7.1z"/>',
  star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  send:'<path d="M21.5 2.5 2.5 10l7.5 3 3 7.5z"/><path d="M21.5 2.5 10 13.5"/>',
  lock:'<rect x="4" y="10.5" width="16" height="10.5" rx="2.4"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  eye:'<path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.7"/>',
  'eye-off':'<path d="M10.6 6.2A9.9 9.9 0 0 1 12 6c6.2 0 10 6 10 6a17 17 0 0 1-3 3.6M6.6 6.8A17 17 0 0 0 2 12s3.8 6.5 10 6.5c1.7 0 3.2-.3 4.5-.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="m3 3 18 18"/>',
  mail:'<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 6.5 9 6 9-6"/>',
  phone:'<path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.6 19.6 0 0 1-8.5-3 19.3 19.3 0 0 1-6-6 19.6 19.6 0 0 1-3-8.6A2 2 0 0 1 3.3 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.4 9.8a16 16 0 0 0 6 6l1.2-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  shield:'<path d="M12 22s8-3.5 8-10V5.5L12 2.5 4 5.5V12c0 6.5 8 10 8 10z"/><path d="m9 12 2 2 4-4.5"/>',
  zap:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  filter:'<path d="M3 5h18M6.5 12h11M10 19h4"/>',
  grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>',
  layers:'<rect x="6" y="3.5" width="12" height="17" rx="2.4"/><path d="M10 7.5h4"/>',
  copy:'<rect x="8.5" y="8.5" width="12" height="12" rx="2.2"/><path d="M15.5 5.5v-.6a2.4 2.4 0 0 0-2.4-2.4H5.9a2.4 2.4 0 0 0-2.4 2.4v7.2a2.4 2.4 0 0 0 2.4 2.4h.6"/>',
  qr:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><path d="M13.5 13.5h3v3h-3zM20.5 13.5v3M17 20.5h3.5V18"/>',
  ext:'<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/>',
  trash:'<path d="M4 7h16M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2"/><path d="M6.5 7 7.4 20a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5L17.5 7"/>',
  dl:'<path d="M12 3v12"/><path d="m7.5 11 4.5 4.5L16.5 11"/><path d="M4 20.5h16"/>',
  out:'<path d="M9.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4.5"/><path d="m16 16 5-4-5-4"/><path d="M21 12H9"/>',
  arrow:'<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
  spark:'<path d="m12 2.5 2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2z"/><path d="M19 15.5 20 18l2.5 1-2.5 1-1 2.5-1-2.5L15.5 19l2.5-1z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 1.9"/>',
  pin:'<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  award:'<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-2.6 5 2.6-1.5-7"/>',
  trend:'<path d="M3 17.5 9.5 11l4 4L21 7.5"/><path d="M15.5 7.5H21V13"/>',
  edit:'<path d="M12 20h8"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>',
  image:'<rect x="3" y="4.5" width="18" height="15" rx="2.4"/><circle cx="8.5" cy="10" r="1.6"/><path d="m4 17 5-5 4.5 4.5L17 13l3 3"/>',
  cal:'<rect x="3.5" y="5" width="17" height="16" rx="2.4"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  usercheck:'<path d="M15 20v-1.6a4.4 4.4 0 0 0-4.4-4.4H6.4A4.4 4.4 0 0 0 2 18.4V20"/><circle cx="8.5" cy="7" r="4"/><path d="m16.5 11.5 2 2 4-4.5"/>',
  users:'<path d="M15 20v-1.6a4.4 4.4 0 0 0-4.4-4.4H6.4A4.4 4.4 0 0 0 2 18.4V20"/><circle cx="8.5" cy="7" r="4"/><path d="M22 20v-1.6a4.4 4.4 0 0 0-3.3-4.2"/><path d="M15.5 3.2a4.4 4.4 0 0 1 0 8.5"/>',
  gift:'<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M3 13.5h18M12 9v12"/><path d="M12 9S10.5 4 8 4a2.5 2.5 0 0 0 0 5zM12 9s1.5-5 4-5a2.5 2.5 0 0 1 0 5z"/>',
  card:'<rect x="2.5" y="5" width="19" height="14" rx="2.6"/><path d="M2.5 10h19"/>',
  briefcase:'<rect x="2.5" y="7" width="19" height="13" rx="2.4"/><path d="M8.5 7V5.4A1.9 1.9 0 0 1 10.4 3.5h3.2A1.9 1.9 0 0 1 15.5 5.4V7"/><path d="M2.5 12.5h19"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2.4"/><path d="M3 9.5h18M8 3v4M16 3v4"/>',
  quote:'<path d="M9.5 6.5C7 7.6 5.5 10 5.5 12.8V17h5v-5H8c0-1.8.6-3.2 1.5-4zM19 6.5c-2.5 1.1-4 3.5-4 6.3V17h5v-5h-2.5c0-1.8.6-3.2 1.5-4z"/>',
  ladder:'<path d="M7.5 3v18M16.5 3v18M7.5 7.5h9M7.5 12h9M7.5 16.5h9"/>',
  refresh:'<path d="M20.5 11A8.5 8.5 0 0 0 6 6.5L3.5 9"/><path d="M3.5 4v5h5"/><path d="M3.5 13a8.5 8.5 0 0 0 14.5 4.5L20.5 15"/><path d="M20.5 20v-5h-5"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8h.01"/>',
  alert:'<path d="M12 3.5 22 20H2z"/><path d="M12 9.5v4.5M12 17.3h.01"/>',
  flag:'<path d="M5 21V4.5"/><path d="M5 5h10.5l-1.5 3.5L15.5 12H5z"/>',
  chev:'<path d="m9 6 6 6-6 6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  back:'<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
  book:'<path d="M4 4.5A2 2 0 0 1 6 2.5h13v15H6a2 2 0 0 0-2 2z"/><path d="M4 19.5a2 2 0 0 0 2 2h13v-4"/>',
};
function ic(n, cls){
  return '<svg class="ic '+(cls||'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(P[n]||'')+'</svg>';
}

/* ---------- Utilitaires ---------- */
const $ = (s, r) => (r||document).querySelector(s);
const $$ = (s, r) => Array.from((r||document).querySelectorAll(s));
const esc = s => String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (v,a,b) => Math.min(b, Math.max(a, v));
const initials = n => String(n || '?').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase() || '?';
const uid = () => 'x'+Math.random().toString(36).slice(2,9);
function ago(min){
  if(min < 1) return "à l'instant";
  if(min < 60) return 'il y a '+Math.round(min)+' min';
  const h = Math.round(min/60);
  if(h < 24) return 'il y a '+h+' h';
  const d = Math.round(h/24);
  return d === 1 ? 'hier' : 'il y a '+d+' j';
}
function hhmm(d){ return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
function fcfa(n){ return n.toLocaleString('fr-FR').replace(/ |\s/g,' ')+' FCFA'; }

P.camera = '<path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.6"/>';

/* ---------- Référentiels ---------- */
const SECTORS = [
  {id:'agritech', l:'AgriTech', g:'🌱'}, {id:'fintech', l:'FinTech', g:'💳'},
  {id:'edtech', l:'EdTech', g:'📚'}, {id:'health', l:'HealthTech', g:'🩺'},
  {id:'logistique', l:'Logistique', g:'🚚'}, {id:'ecommerce', l:'E-commerce', g:'🛍️'},
  {id:'immobilier', l:'Immobilier', g:'🏘️'}, {id:'greentech', l:'GreenTech', g:'🌍'},
  {id:'medias', l:'Médias & Contenu', g:'🎬'}, {id:'saas', l:'SaaS & Outils B2B', g:'🧰'},
  {id:'artisanat', l:'Artisanat & Culture', g:'🎨'}, {id:'impact', l:'Impact Social', g:'🤝'},
];
const SKILLS = [
  {id:'dev-mobile', l:'Dev mobile'}, {id:'dev-front', l:'Dev front-end'}, {id:'dev-back', l:'Dev back-end'},
  {id:'data', l:'Data & IA'}, {id:'design', l:'UX / UI Design'}, {id:'brand', l:'Identité de marque'},
  {id:'growth', l:'Growth & Acquisition'}, {id:'contenu', l:'Contenu & Communauté'},
  {id:'vente', l:'Vente & Partenariats'}, {id:'produit', l:'Product management'},
  {id:'finance', l:'Finance & Levée'}, {id:'juridique', l:'Juridique & OHADA'},
  {id:'terrain', l:'Opérations terrain'}, {id:'rh', l:'Recrutement & RH'},
];
const skillL = id => (SKILLS.find(s=>s.id===id)||{l:id}).l;
const sector = id => SECTORS.find(s=>s.id===id) || {l:id, g:'✨'};

/* Décision produit : l'engagement est la variable n°1 d'un échec de cofondation.
   On la rend explicite et on la score. */
const PACE = [
  {id:'side', l:'Projet à côté', h:'moins de 10 h / semaine', hrs:8},
  {id:'serieux', l:'Engagement sérieux', h:'10 à 25 h / semaine', hrs:18},
  {id:'plein', l:'Temps plein', h:'plus de 25 h / semaine', hrs:35},
];
/* Ce que le projet propose : déclaré par le visionnaire, affiché sur sa
   fiche. Le talent ne le déclare plus : il le lit projet par projet. */
const OFFER = [
  {id:'equity', l:'Parts uniquement', h:'des parts au capital, sans rémunération au départ'},
  {id:'mixte', l:'Parts + petite rémunération', h:'un défraiement dès le début'},
  {id:'paye', l:'Rémunération prévue', h:'un revenu est prévu pour le cofondateur'},
];
const SEX = [{id:'m', l:'Masculin'}, {id:'f', l:'Féminin'}, {id:'np', l:'Ne pas préciser'}];
const MAX_SECTORS = 3;
const LEVEL = [{id:'deb',l:'Débutant'},{id:'inter',l:'Intermédiaire'},{id:'expert',l:'Expert'}];
/* L'autodidacte est en tête : sur ce marché il est nombreux, et le
   faire choisir « BEPC » par défaut le desservirait à tort. */
const DIPLOMA = [
  {id:'autodidacte', l:'Autodidacte'}, {id:'bepc', l:'BEPC'}, {id:'bac', l:'Baccalauréat'},
  {id:'bts', l:'BTS / DUT'}, {id:'licence', l:'Licence'},
  {id:'master', l:'Master / Ingénieur'}, {id:'doctorat', l:'Doctorat'},
];
const STATUS = [
  {id:'freelance', l:'Freelance'}, {id:'entreprise', l:'En entreprise'},
  {id:'autoentr', l:'Auto-entrepreneur'}, {id:'etudiant', l:'Étudiant'},
  {id:'sansact', l:'Sans activité'},
];
/* Logo officiel (logos/logo-principal.svg) en data URI : une <img>, jamais
   le SVG brut, dont les classes génériques (.cls-1…) fuiraient dans la page. */
const LOGO_SRC = 'assets/images/logo-principal.svg';
const brandHTML = () => '<span class="brand"><img class="brand-logo" src="'+LOGO_SRC+'" alt="TakaMatch"></span>';
const refL = (list, id) => (list.find(x => x.id === id) || {l:'—'}).l;

/* ---------- État ---------- */
const DEFAULT_ME = {
  first:'', last:'', sex:'', city:'', cityCc:'', handle:'', role:'tal',
  skills:[], sectors:[], level:'', diploma:'', status:'',
  pace:'', bio:'', portfolio:'', portfolioTitle:'', noPortfolio:false,
  photo:'', phone:'', cc:'BJ',
  project:{title:'', sectors:[], seeking:[], hook:'', vision:'', traction:'', challenges:'', link:'', noLink:false, offer:'', icon:'', cover:''},
  /* Fiche perso du visionnaire : l'humain derrière le projet. Facultative,
     sans statistiques ; les talents l'ouvrent depuis la fiche projet. */
  perso:{skills:[], level:'', bio:'', portfolio:'', noPortfolio:false},
};
let ME = structuredClone(DEFAULT_ME);
const O = {
  step:0, sub:'choose', login:false, ident:'', identTouched:false, code:'', phoneTouched:false,
  pwd:'', pwdTouched:false, showPwd:false, optin:false, pactOk:false, roleSel:null,
  sending:false, sugg:null, _art:null, _painted:null, _opener:null, tried:false,
};
const ONB_STEPS = ['Compte','Le pacte','Ton rôle','Ton identité','Ton pseudo','Ta fiche','Ta photo'];
/* Le visionnaire a une étape de plus, facultative : sa fiche perso. */
const ONB_STEPS_VIS = ['Compte','Le pacte','Ton rôle','Ton identité','Ton pseudo','Ta fiche','Ta fiche perso','Ta photo'];
const FICHE = 6, PERSO = 7, PHOTOS = 8, READY = 9;   /* « Prêt » n'est pas compté dans la jauge (§8.2). */
const isVisPath = () => (O.roleSel || ME.role) === 'vis';
const onbSteps = () => isVisPath() ? ONB_STEPS_VIS : ONB_STEPS;
/* Numéro affiché : le talent saute la fiche perso, sa photo reste l'étape 7. */
const dispStep = s => (s > PERSO && !isVisPath()) ? s - 1 : s;
const PERSO_MAX_SKILLS = 4, PERSO_BIO_MIN = TMRules.MIN.persoBio;
/* Publication : alignée sur l'outil. Une fiche n'est en ligne que si
   TOUTES ses sections obligatoires (*) sont remplies ; le facultatif
   (portfolio, Vision, Traction, Défis, lien, couverture, fiche perso)
   ne bloque jamais. La jauge de complétion reste indicative. */
const TXT_REQ_MIN = 10;   /* conservé pour compatibilité ; les vrais minimums sont dans js/fiche-rules.js */

/* ---------- Identifiant, code, mot de passe ---------- */
const isMail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v||'').trim());
const isPhone = v => /^\+?\d{8,14}$/.test((v||'').replace(/[\s.()-]/g,''));
const identOk = v => isMail(v);
/* Téléphone : demandé juste après la validation de l'e-mail. Pas de code
   SMS (payant) : on exige un vrai numéro, au bon format pour le pays. */
/* Pays, indicatifs et villes : js/geo.js (partagé avec l'outil). */
const COUNTRIES = TMGeo.sorted();
const country = id => TMGeo.country(id);
/* Le numéro doit avoir exactement le nombre de chiffres du pays : ni
   moins, ni plus. La saisie est bloquée au-delà et mise en forme par
   groupes, sur le modèle de l'exemple affiché. */
const phoneDigits = v => (v||'').replace(/\D/g,'');
/* Numéro national : on retire le 0 (ou le 1 au Canada) que les gens tapent souvent en tête. */
const phoneNsn = (v, cc) => { const c = country(cc), d = phoneDigits(v); return c.trunk && d.charAt(0) === c.trunk ? d.slice(1) : d; };
const phoneMax = cc => Math.max.apply(null, country(cc).len);
function phoneOk(v, cc){ return country(cc).len.includes(phoneNsn(v, cc).length); }
function phoneFormat(v, cc){
  const c = country(cc), d = phoneNsn(v, cc).slice(0, phoneMax(cc));
  const groups = c.ph.split(' ').map(g => g.length);
  let out = [], i = 0;
  for(const g of groups){ if(i >= d.length) break; out.push(d.slice(i, i+g)); i += g; }
  if(i < d.length) out.push(d.slice(i));
  return out.join(' ');
}
/* Drapeaux dessinés en SVG : les emojis de drapeau ne s'affichent pas sous Windows. */
function flag(id){
  const V = (a,b,c) => '<rect width="7" height="14" fill="'+a+'"/><rect x="7" width="6" height="14" fill="'+b+'"/><rect x="13" width="7" height="14" fill="'+c+'"/>';
  const H = (a,b,c) => '<rect width="20" height="5" fill="'+a+'"/><rect y="5" width="20" height="4" fill="'+b+'"/><rect y="9" width="20" height="5" fill="'+c+'"/>';
  const star = (x,y,r,f) => { let d=''; for(let k=0;k<10;k++){ const a=-Math.PI/2+k*Math.PI/5, rr=k%2?r*.42:r; d+=(k?'L':'M')+(x+rr*Math.cos(a)).toFixed(2)+','+(y+rr*Math.sin(a)).toFixed(2); } return '<path d="'+d+'Z" fill="'+f+'"/>'; };
  const F = {
    BJ:'<rect width="20" height="14" fill="#E8112D"/><rect width="20" height="7" fill="#FCD116"/><rect width="8" height="14" fill="#008751"/>',
    TG:'<rect width="20" height="14" fill="#006A4E"/><rect y="2.8" width="20" height="2.8" fill="#FFCE00"/><rect y="8.4" width="20" height="2.8" fill="#FFCE00"/><rect width="8.4" height="8.4" fill="#D21034"/>'+star(4.2,4.2,2.6,'#fff'),
    CI:V('#F77F00','#fff','#009E60'),
    SN:V('#00853F','#FDEF42','#E31B23')+star(10,7,2.4,'#00853F'),
    BF:'<rect width="20" height="7" fill="#EF2B2D"/><rect y="7" width="20" height="7" fill="#009E49"/>'+star(10,7,2.6,'#FCD116'),
    ML:V('#14B53A','#FCD116','#CE1126'),
    NE:H('#E05206','#fff','#0DB02B')+'<circle cx="10" cy="7" r="1.8" fill="#E05206"/>',
    GH:H('#CE1126','#FCD116','#006B3F')+star(10,7,2.2,'#000'),
    NG:V('#008751','#fff','#008751'),
    CM:V('#007A5E','#CE1126','#FCD116')+star(10,7,2.2,'#FCD116'),
    FR:V('#002395','#fff','#ED2939'),
  };
  if(!F[id]) return TMGeo.flagImg(id);
  return '<svg class="flag" viewBox="0 0 20 14" aria-hidden="true">'+F[id]+'</svg>';
}
const PW_RULES = [
  ['8 caractères minimum', v => v.length >= 8],
  ['Au moins une lettre',  v => /[a-zA-Z]/.test(v)],
  ['Au moins un chiffre',  v => /[0-9]/.test(v)],
];
const pwOk = v => PW_RULES.every(r => r[1](v || ''));
const authOk = () => O.login ? (O.pwd || '').length > 0 : pwOk(O.pwd);

/* ---------- Pseudo ---------- */
/* Pseudos déjà pris dans l'annuaire de démonstration du prototype. */
const TAKEN = ['offline_first','pixel_atlantique','sat_agro','zero_budget','api_lagune','savoir_dire_non','huit_mois',
  'clause_ohada','borgou_terrain','trois_langues','apres_300','batterie_faible','carnet_de_nuit','tracer_ananas',
  'six_secondes','huit_minutes','km_a_vide','panier_direct','sans_lampant','parcelle_onze','sept_minutes','vendue_deux_fois'];
const RESERVED = ['admin','takamatch','taka','support','equipe','contact','moderation','aide'];
const HANDLE_RE = /^[a-z0-9_]{3,20}$/;
function handleState(h){
  if(!h) return {k:'empty', msg:'Trois caractères minimum.'};
  if(!HANDLE_RE.test(h)) return {k:'bad', msg:'Lettres minuscules, chiffres et tirets bas. De 3 à 20 caractères.'};
  if(TAKEN.includes(h) || RESERVED.includes(h)) return {k:'taken', msg:'Ce pseudo est déjà pris.'};
  return {k:'ok', msg:'Disponible.'};
}
function slugify(v){
  return (v||'').normalize('NFD').replace(/[̀-ͯ]/g,'')
    .toLowerCase().replace(/[^a-z0-9_]/g,'_').replace(/_+/g,'_').slice(0,20);
}
/* Les suggestions ne partent jamais du vrai nom : ce serait révéler
   exactement ce que le pseudo est censé protéger. Affichées en
   minuscules, comme le pseudo réellement enregistré. */
function suggestHandles(){
  return ['sofi21','johndoe23','meshreseau'].filter(h => handleState(h).k === 'ok');
}
const myName = () => (ME.first+' '+ME.last).trim() || 'Ton nom';
const myHandle = () => '@' + (ME.handle || 'ton_pseudo');
const roleLabel = r => r === 'tal' ? 'Talent' : 'Visionnaire';

/* ---------- Complétion de fiche ----------
   Règles communes à l'inscription et à l'outil : js/fiche-rules.js.
   Toutes les sections sont obligatoires ; 100 % = tout est rempli. */
const TXT_MIN = 5;
function rulesData(kind){
  const m = ME, p = m.project;
  if(kind === 'perso') return {skills:m.perso.skills, level:m.perso.level, bio:m.perso.bio, portfolio:m.perso.portfolio, noPortfolio:m.perso.noPortfolio};
  return {first:m.first, last:m.last, handle:m.handle, city:m.city, skills:m.skills, level:m.level, diploma:m.diploma, status:m.status,
    sectors:m.sectors, pace:m.pace, bio:m.bio, portfolio:m.portfolio, noPortfolio:m.noPortfolio,
    project:{title:p.title, sectors:p.sectors, seeking:p.seeking, pace:m.pace, offer:p.offer, hook:p.hook, vision:p.vision,
      traction:p.traction, challenges:p.challenges, link:p.link, noLink:p.noLink}};
}
const ficheKind = () => ME.role === 'tal' ? 'tal' : 'vis';
function ruleRows(kind){ kind = kind || ficheKind(); return TMRules.rows(kind, rulesData(kind)); }
/* Format historique : [rempli, poids, ce qui manque, obligatoire, clé du champ] */
function completionRows(){ return ruleRows().map(r => [r.ok, r.w, r.phrase, !r.opt, r.key, r]); }
function completion(){ return TMRules.pct(ruleRows()); }
function persoRows(){ return ruleRows('perso').map(r => [r.ok, r.w, r.phrase, true, r.key, r]); }
function persoPct(){ return TMRules.pct(ruleRows('perso')); }
/* Sections encore incomplètes : tant qu'il en reste, pas de publication. */
function requiredMissing(){ return completionRows().filter(x => x[3] && !x[0]).map(x => x[2]); }
const ficheReady = () => requiredMissing().length === 0;
/* La première section incomplète du formulaire (sa clé data-k). */
function firstMissingKey(){ const r = completionRows().find(x => x[3] && !x[0] && x[4]); return r ? r[4] : ''; }
function missing(){ return completionRows().filter(x => !x[0]).sort((a,b) => b[1]-a[1]).map(x => x[2]); }
/* La couverture se choisit sur la fiche (photo ou icône) : il ne reste
   ici que la photo de profil, pour les deux rôles. */
const photosMissing = () => !ME.photo;
const sexL = id => (SEX.find(x => x.id === id) || {l:''}).l;
/* Icône de couverture : celle choisie si son secteur est coché, sinon
   celle du premier secteur coché. */
function projIcon(){
  const p = ME.project;
  if(p.icon && p.sectors.includes(p.icon)) return sector(p.icon).g;
  return p.sectors[0] ? sector(p.sectors[0]).g : '💡';
}

/* ============================================================
   Navigation dans le parcours
   ============================================================ */
function openOnb(opts){
  opts = opts || {};
  Object.assign(O, {step:1, sub:'choose', login:opts.mode === 'login', ident:O.ident || '', identTouched:false,
    phoneTouched:false, social:null, code:'', pwd:'', pwdTouched:false, showPwd:false, optin:false, pactOk:false, roleSel:opts.role || null,
    sending:false, sugg:null, _art:null, _painted:null});
  O._opener = document.activeElement;
  $('#closed').hidden = true; closeDash();
  renderOnb();
}
function closeOnb(){
  O.step = 0;
  const r = $('#onb'); r.innerHTML = ''; delete r.dataset.built; r.hidden = true;
  document.documentElement.removeAttribute('data-role');
  $('#closed').hidden = false;
  syncWb();
  const back = O._opener && document.contains(O._opener) ? O._opener : $('#closed .btn-go');
  try{ back.focus({preventScroll:true}); }catch(e){}
}
function onbBack(){
  if(O.sending) return;
  if(O.step === 1){
    if(O.sub === 'pwd'){ O.sub = O.login ? 'choose' : 'phone'; renderOnb(); return; }
    if(O.sub === 'phone'){ O.sub = O.social ? 'choose' : 'code'; O.social = O.social && null; renderOnb(); return; }
    if(O.sub === 'code'){ O.sub = 'choose'; renderOnb(); return; }
    return;
  }
  O.step -= 1;
  if(O.step === PERSO && !isVisPath()) O.step = FICHE;
  if(O.step === 1 && O.social) O.sub = 'phone';
  renderOnb();
}
function onbGo(to){
  if(O.sending) return;
  if(O.step === 1){ authStep(); return; }
  const a = onbAction();
  if(a && !a.ok && O.step === FICHE){ O.tried = true; syncFiche(); showWhy(true); return; }
  if(!a || !a.ok) return;
  if(to === 4){ ME.role = O.roleSel; }
  if(to === 5){
    ME.first = ($('#first').value || '').trim();
    ME.last  = ($('#last').value  || '').trim();
    O.sugg = null;
  }
  if(to === 6){ ME.handle = slugify(($('#handle').value || '').trim()); }
  O.step = to;
  renderOnb();
}
/* Étape 1 : identifiant → code → mot de passe. Chaque envoi passe par
   « en cours » puis « c'est fait » (§5.1) avant de laisser passer. */
function authStep(){
  if(O.sub === 'choose'){
    const f = $('#ident'); if(f) O.ident = f.value.trim();
    if(!identOk(O.ident)){ O.identTouched = true; syncIdent(); if(f) f.focus(); return; }
    O.social = null; O.sub = O.login ? 'pwd' : 'code'; O.code = '';
    renderOnb(); return;
  }
  if(O.sub === 'code'){
    if(O.code.length !== 6) return;
    busy('Adresse vérifiée', () => { O.sub = 'phone'; renderOnb(); });
    return;
  }
  if(O.sub === 'phone'){
    const f = $('#phone'); if(f) ME.phone = f.value.trim();
    if(!phoneOk(ME.phone, ME.cc)){ O.phoneTouched = true; syncPhone(); if(f) f.focus(); return; }
    if(O.social){ O.step = 2; renderOnb(); return; }
    O.sub = 'pwd'; renderOnb(); return;
  }
  if(!authOk()){ O.pwdTouched = true; syncPwd(); const p = $('#pwd'); if(p) p.focus(); return; }
  busy(O.login ? 'Connecté' : 'Compte créé', () => { O.step = 2; renderOnb(); });
}
function busy(doneLabel, next){
  const main = $('#onbMain'); if(!main){ next(); return; }
  O.sending = true; onbEnable(false);
  const label = main.textContent;
  main.classList.add('loading');
  main.innerHTML = '<span class="spin" aria-hidden="true"></span><span>'+esc(label)+'</span>';
  setTimeout(() => {
    main.classList.remove('loading'); main.classList.add('done');
    main.innerHTML = ic('check') + '<span>' + esc(doneLabel) + '</span>';
    setTimeout(() => { O.sending = false; next(); }, 600);
  }, 650);
}

/* L'action de l'étape courante. Le bouton du bas et la flèche du haut
   la partagent : un seul endroit décide du libellé et de l'activation. */
function onbAction(){
  const s = O.step;
  if(s === 1){
    if(O.sub === 'choose') return {to:1, label:'Continuer', ok:identOk(O.ident), inBody:true};
    if(O.sub === 'code')   return {to:1, label:'Vérifier le code', ok:O.code.length === 6};
    if(O.sub === 'phone')  return {to:1, label:'Continuer', ok:phoneOk(ME.phone, ME.cc)};
    return {to:2, label:O.login ? 'Se connecter' : 'Créer mon compte', ok:authOk()};
  }
  if(s === 2) return {to:3, label:"J'accepte", ok:O.pactOk};
  if(s === 3) return {to:4, label:'Suivant', ok:!!O.roleSel};
  if(s === 4) return {to:5, label:'Suivant', ok:!!(ME.first && ME.last && ME.city && ME.sex)};
  if(s === 5) return {to:6, label:'Suivant', ok:handleState(ME.handle).k === 'ok'};
  if(s === FICHE) return {to:isVisPath() ? PERSO : PHOTOS, label:'Publier ma fiche', ok:ficheReady(), soft:true};
  if(s === PERSO) return {to:PHOTOS, label:'Continuer', ok:true};
  if(s === PHOTOS) return {to:READY, label:'Continuer', ok:!photosMissing()};
  if(s === READY) return {finish:true, label:ME.role === 'tal' ? 'Découvrir les projets' : 'Découvrir les talents', ok:true, arrow:true};
  return null;
}
function onbEnable(ok){
  const a = $('#onbMain'), b = $('#onbNext');
  /* « Publier ma fiche » reste cliquable quand il est grisé : le clic
     explique ce qui manque au lieu de ne rien faire. */
  if(a){ if(O.step === FICHE){ a.disabled = false; a.classList.toggle('is-off', !ok); a.setAttribute('aria-disabled', !ok); }
         else a.disabled = !ok; }
  if(b) b.disabled = !ok;
  if(ok) hideWhy();
}
const preRole = () => O.step < 3 || (O.step === 3 && !O.roleSel);

/* ---------- Barre du haut ---------- */
function actAttrs(a){ return a.finish ? 'data-act="onb-finish"' : 'data-act="onb-go" data-to="'+a.to+'"'; }
function onbNav(a){
  const steps = onbSteps(), n = dispStep(O.step), i = n - 1;
  const first = O.step === 1 && O.sub === 'choose';
  const mid = O.step < READY
    ? '<div class="ob-steps"><span>Étape <span class="mono">'+n+'</span> sur <span class="mono">'+steps.length+'</span> · '+esc(steps[i])+'</span>'
      + '<div class="ob-g" role="progressbar" aria-label="Progression" aria-valuemin="1" aria-valuemax="'+steps.length+'" aria-valuenow="'+n+'">'
      + steps.map((_,k)=>'<i class="'+(k<i?'done':k===i?'cur':'')+'"></i>').join('') + '</div></div>'
    : brandHTML();
  return '<div class="onb-nav">'
    + '<button class="iconbtn'+(first?' ghost':'')+'" data-act="onb-back" aria-label="Étape précédente" title="Retour (Alt + ←)"'+(first?' tabindex="-1" aria-hidden="true"':'')+'>'+ic('back')+'</button>'
    + mid
    + (a && !a.inBody
      ? '<button class="iconbtn" id="onbNext" '+actAttrs(a)+' aria-label="'+esc(a.label)+'" title="'+esc(a.label)+'"'+(a.ok?'':' disabled')+'>'+ic('arrow')+'</button>'
      : '<span class="iconbtn ghost" aria-hidden="true"></span>')
    + '</div>';
}
/* Pied : l'action principale, libellée. Avant le choix du rôle, elle
   prend le dégradé « Commencer » ; ensuite, la couleur du rôle. */
function onbFoot(a, extra){
  if(!a || a.inBody) return '';
  const cls = preRole() ? 'btn-go' : 'btn-a';
  return '<div class="onb-foot">' + (extra || '') + '<div class="grow"></div>'
    + '<button class="btn '+cls+' btn-lg'+(a.soft && !a.ok ? ' is-off' : '')+'" id="onbMain" '+actAttrs(a)
    + (a.ok ? '' : a.soft ? ' aria-disabled="true" aria-describedby="why"' : ' disabled')+'>'
    + '<span>'+esc(a.label)+'</span>' + (a.arrow ? ic('arrow','arr') : '') + '</button></div>';
}

/* ---------- Le panneau de droite ----------
   Une illustration fixe par étape. Elle ne bouge pas, elle ne
   clignote pas : elle dit de quoi parle l'étape, puis se tait. */
function gear(cx, cy, r, col){
  let teeth = '';
  for(let k = 0; k < 8; k++){
    teeth += '<rect x="-5.5" y="'+(-r-11)+'" width="11" height="14" rx="3.5" transform="rotate('+(k*45)+')"/>';
  }
  return '<g transform="translate('+cx+','+cy+')" fill="'+col+'">'+teeth
    + '<circle r="'+r+'"/></g><circle cx="'+cx+'" cy="'+cy+'" r="'+(r*0.38)+'" fill="#FAF9F5"/>';
}
const ART = {
  /* 1 — Le compte : ce qu'on met sous clé */
  1:'<svg viewBox="0 0 340 280" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Un compte protégé par un mot de passe">'
    + '<defs><linearGradient id="oa1" x1="0" y1="0" x2="1" y2="1">'
    + '<stop offset="0" stop-color="#FFD741"/><stop offset=".5" stop-color="#FFE9A8"/><stop offset="1" stop-color="#0A65AE"/></linearGradient></defs>'
    + '<rect x="14" y="18" width="312" height="244" rx="20" fill="url(#oa1)"/>'
    + '<rect x="76" y="56" width="188" height="168" rx="14" fill="#FAF9F5"/>'
    + '<rect x="100" y="80" width="78" height="9" rx="4.5" fill="#E4E0D6"/>'
    + '<rect x="100" y="98" width="48" height="9" rx="4.5" fill="#EDE9E0"/>'
    + '<path d="M136 146v-12a34 34 0 0 1 68 0v12" stroke="#0A5C99" stroke-width="9" fill="none" stroke-linecap="round"/>'
    + '<rect x="112" y="146" width="116" height="56" rx="11" fill="#007CD8"/>'
    + '<circle cx="170" cy="168" r="8" fill="#FFD741"/>'
    + '<rect x="166" y="173" width="8" height="15" rx="4" fill="#FFD741"/></svg>',
  /* 2 — Le pacte : un texte, quatre règles, un sceau */
  2:'<svg viewBox="0 0 340 280" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Un pacte scellé">'
    + '<defs><linearGradient id="oa2" x1="0" y1="0" x2="1" y2="1">'
    + '<stop offset="0" stop-color="#0A65AE"/><stop offset=".55" stop-color="#8FC7F3"/><stop offset="1" stop-color="#FFD741"/></linearGradient></defs>'
    + '<rect x="14" y="18" width="312" height="244" rx="20" fill="url(#oa2)"/>'
    + '<rect x="88" y="44" width="164" height="192" rx="13" fill="#FAF9F5"/>'
    + '<rect x="110" y="74" width="96" height="10" rx="5" fill="#1F1E1B"/>'
    + '<rect x="110" y="104" width="120" height="7" rx="3.5" fill="#E4E0D6"/>'
    + '<rect x="110" y="122" width="120" height="7" rx="3.5" fill="#E4E0D6"/>'
    + '<rect x="110" y="140" width="86" height="7" rx="3.5" fill="#E4E0D6"/>'
    + '<rect x="110" y="158" width="104" height="7" rx="3.5" fill="#EDE9E0"/>'
    + '<circle cx="222" cy="200" r="34" fill="#FFD741"/>'
    + '<path d="m208 200 10 10 20-22" stroke="#4A3500" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  /* 3 — Le carrefour : une idée, une compétence */
  3:'<svg viewBox="0 0 340 280" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Une idée et une compétence réunies">'
    + '<defs><linearGradient id="oa3" x1="0" y1="0" x2="1" y2="1">'
    + '<stop offset="0" stop-color="#FFE9A8"/><stop offset=".5" stop-color="#F6F4EC"/><stop offset="1" stop-color="#8FC7F3"/></linearGradient></defs>'
    + '<rect x="14" y="18" width="312" height="244" rx="20" fill="url(#oa3)"/>'
    + '<path d="M118 140h104" stroke="#1F1E1B" stroke-width="3" stroke-dasharray="7 8" stroke-linecap="round" opacity=".38"/>'
    + '<circle cx="108" cy="140" r="46" fill="#FFD741"/>'
    + '<path d="M108 108a22 22 0 0 0-13 39.6v8.4h26v-8.4A22 22 0 0 0 108 108z" fill="#FAF9F5"/>'
    + '<rect x="98" y="158" width="20" height="7" rx="3.5" fill="#8A6008"/>'
    + '<rect x="101" y="168" width="14" height="6" rx="3" fill="#8A6008"/>'
    + '<circle cx="232" cy="140" r="46" fill="#007CD8"/>'
    + '<g transform="translate(203.2,111.2) scale(2.4)" fill="none" stroke="#FAF9F5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'
    +   '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'
    + '</g>'
    + '</svg>',
  /* 4 — L'identité : une pièce, et un verrou dessus */
  4:'<svg viewBox="0 0 340 280" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Une pièce d\'identité gardée sous clé">'
    + '<defs><linearGradient id="oa4" x1="0" y1="0" x2="1" y2="1">'
    + '<stop offset="0" stop-color="#8FC7F3"/><stop offset=".55" stop-color="#F6F4EC"/><stop offset="1" stop-color="#FFD741"/></linearGradient></defs>'
    + '<rect x="14" y="18" width="312" height="244" rx="20" fill="url(#oa4)"/>'
    + '<rect x="58" y="76" width="224" height="140" rx="16" fill="#FAF9F5"/>'
    + '<circle cx="114" cy="132" r="28" fill="#FFD741"/>'
    + '<circle cx="114" cy="124" r="10" fill="#8A6008"/>'
    + '<path d="M98 150a16 16 0 0 1 32 0z" fill="#8A6008"/>'
    + '<rect x="156" y="112" width="96" height="10" rx="5" fill="#1F1E1B"/>'
    + '<rect x="156" y="132" width="72" height="8" rx="4" fill="#E4E0D6"/>'
    + '<rect x="58" y="176" width="224" height="40" rx="0" fill="#F2EFE7"/>'
    + '<rect x="58" y="196" width="224" height="20" rx="0" fill="#FAF9F5"/>'
    + '<rect x="80" y="184" width="118" height="8" rx="4" fill="#D2CCBC"/>'
    + '<g transform="translate(246,178)">'
    + '<circle r="30" fill="#007CD8"/>'
    + '<path d="M-11 -2v-6a11 11 0 0 1 22 0v6" stroke="#FAF9F5" stroke-width="5" fill="none" stroke-linecap="round"/>'
    + '<rect x="-14" y="-2" width="28" height="20" rx="5" fill="#FAF9F5"/></g></svg>',
  /* 5 — Le pseudo : ce qu'on montre, ce qu'on garde */
  5:'<svg viewBox="0 0 340 280" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Un pseudo public devant un nom masqué">'
    + '<defs><linearGradient id="oa5" x1="0" y1="0" x2="1" y2="1">'
    + '<stop offset="0" stop-color="#FFD741"/><stop offset=".55" stop-color="#F6F4EC"/><stop offset="1" stop-color="#007CD8"/></linearGradient></defs>'
    + '<rect x="14" y="18" width="312" height="244" rx="20" fill="url(#oa5)"/>'
    + '<g opacity=".95"><rect x="84" y="58" width="172" height="46" rx="12" fill="#FAF9F5"/>'
    + '<rect x="104" y="74" width="60" height="14" rx="7" fill="#D2CCBC"/>'
    + '<rect x="172" y="74" width="40" height="14" rx="7" fill="#D2CCBC"/>'
    + '<path d="m96 100 148-38" stroke="#B54A3F" stroke-width="5" stroke-linecap="round"/></g>'
    + '<rect x="68" y="130" width="204" height="94" rx="18" fill="#0A65AE"/>'
    + '<text x="170" y="196" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="72" font-weight="600" fill="#FFD741">@</text>'
    + '<circle cx="262" cy="136" r="17" fill="#FFD741"/>'
    + '<circle cx="262" cy="136" r="6" fill="#0A65AE"/></svg>',
  /* 7 — On y est */
  7:'<svg viewBox="0 0 340 280" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Une fiche publiée et des résultats qui montent">'
    + '<defs><linearGradient id="oa7" x1="0" y1="0" x2="1" y2="1">'
    + '<stop offset="0" stop-color="#F6F4EC"/><stop offset=".5" stop-color="#FFE9A8"/><stop offset="1" stop-color="#8FC7F3"/></linearGradient></defs>'
    + '<rect x="14" y="18" width="312" height="244" rx="20" fill="url(#oa7)"/>'
    + '<rect x="64" y="166" width="48" height="62" rx="10" fill="#FFD741"/>'
    + '<rect x="128" y="124" width="48" height="104" rx="10" fill="#C9941A"/>'
    + '<rect x="192" y="82" width="48" height="146" rx="10" fill="#007CD8"/>'
    + '<path d="M270 62l7 17 17 7-17 7-7 17-7-17-17-7 17-7z" fill="#FFD741"/>'
    + '<circle cx="216" cy="56" r="17" fill="#FAF9F5"/>'
    + '<path d="m209 56 5 5 10-11" stroke="#4B7F52" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const SIDE = {
  1:{k:'En ce moment sur TakaMatch', figs:[['216','projets en quête'],['1 480','talents disponibles']],
     p:"Ton compte sécurise ce que tu publies. Personne ne te contacte hors plateforme sans ton accord."},
  2:{k:'Pourquoi un pacte', p:"Une communauté de cofondation ne tient pas par sa technologie. Elle tient parce que chacun répond, même pour dire non."},
  3:{k:'La règle du jeu', p:"Jobs avait l'idée. Wozniak l'a construite. Aucun des deux n'aurait suffi — c'est tout le produit."},
  4:{k:'Ce qui reste privé', p:"Ton nom légal, ton sexe, ta photo et tes coordonnées ne sont dévoilés qu'après un match accepté des deux côtés."},
  5:{k:'Ton nom public', p:"Avant le match, les autres ne voient que ton pseudo : sur ta fiche, dans la recherche, sur ton code QR."},
  ready:{k:'Et maintenant', figs:[['100 %','des sections * remplies pour être en ligne'],['3×','plus de vues avec le facultatif']],
     p:"Ton tableau de bord t'attend, avec des profils déjà classés par compatibilité réelle.",
     sc:[['Compétences recherchées','54'],['Secteur','19'],['Rythme','18'],['Proximité','9']]},
};
function onbSide(step){
  if(step === PERSO){
    return '<div class="prev-wrap">'
      + '<div class="prev-l lbl"><i aria-hidden="true"></i>Aperçu de ta fiche perso</div>'
      + '<div id="prevBox">'+persoCard()+'</div>'
      + '<div class="card prev-pct"><div class="grow"><div class="lbl">Fiche perso</div>'
      +   '<p class="hint" style="margin-top:2px">Facultative : elle ne bloque pas la publication.</p></div>'
      +   '<div id="prevRing"></div></div>'
      + '</div>';
  }
  if(step === FICHE || step === PHOTOS){
    return '<div class="prev-wrap">'
      + '<div class="prev-l lbl"><i aria-hidden="true"></i>Aperçu en direct</div>'
      + '<div id="prevBox">'+previewCard()+'</div>'
      + '<div class="card prev-pct"><div class="grow"><div class="lbl">Complétion</div>'
      +   '<p class="hint" style="margin-top:2px">Ta fiche se publie dès que toutes les sections <b class="req">*</b> sont remplies.</p></div>'
      +   '<div id="prevRing"></div></div>'
      + '</div>';
  }
  const d = SIDE[step === READY ? 'ready' : step] || SIDE[1];
  return '<div class="onb-art">'+(ART[step === READY ? 7 : step] || ART[1])+'</div>'
    + '<div class="onb-cap"><div class="lbl">'+esc(d.k)+'</div>'
    + (d.figs ? '<div class="figs">'+d.figs.map(f => '<div class="fig"><b class="tnum">'+esc(f[0])+'</b><span>'+esc(f[1])+'</span></div>').join('')+'</div>' : '')
    + '<p>'+esc(d.p)+'</p>'
    + (d.sc ? '<ul class="sc" aria-label="Le score de compatibilité, sur 100">'+d.sc.map(x => '<li><span>'+esc(x[0])+'</span><b>'+x[1]+'</b></li>').join('')+'</ul>' : '')
    + '</div>';
}

/* ---------- Petits gabarits ---------- */
function tick(){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4.5 12.5 5 5 10-11"/></svg>'; }
function field(id, label, control, req, extra){
  return '<div class="field"><label for="'+id+'">'+esc(label)+(req?'<span class="req" aria-hidden="true">*</span>':'')+'</label>'+control+(extra||'')+'</div>';
}
function optBtn(act, key, val, label, pressed, radio){
  return '<button class="opt opt-plain'+(radio?' radio':'')+'" data-act="'+act+'" data-k="'+key+'" data-v="'+esc(val)+'" aria-pressed="'+(pressed?'true':'false')+'">'
    + '<span class="box">'+tick()+'</span><span>'+label+'</span></button>';
}
function optList(list, act, key, cur, cls, radio){
  const arr = Array.isArray(cur) ? cur : null;
  return '<div class="'+(cls||'opt-wrap')+'">'
    + list.map(o => optBtn(act, key, o.id, esc(o.l), arr ? arr.includes(o.id) : cur === o.id, radio)).join('') + '</div>';
}
/* Une section de fiche : libellé, pictogramme neutre, filet vertical. */
function fsec(icon, label, req, body, help){
  return '<section class="fsec">'
    + '<div class="fsec-l">'+esc(label)+(req?'<span class="req" aria-hidden="true">*</span>':'')+'</div>'
    + '<div class="fsec-b"><span class="tile" aria-hidden="true">'+ic(icon)+'</span>'
    + '<div class="fsec-c">'+(help?'<p class="hint">'+esc(help)+'</p>':'')+body+'</div></div></section>';
}
function area(id, key, max, ph, val, min){
  return '<textarea class="inp" id="'+id+'" data-k="'+key+'" maxlength="'+max+'"'+(min ? ' data-min="'+min+'"' : '')+' rows="4" placeholder="'+esc(ph)+'">'+esc(val)+'</textarea>'
    + '<div class="cnt-c" data-for="'+id+'" aria-live="polite"></div>';
}

/* « Pas encore de lien » : une réponse valable à une section lien obligatoire. */
function noneBox(key, on, label){
  return '<label class="none-chk"><input type="checkbox" data-k="'+key+'"'+(on ? ' checked' : '')+'><span>'+esc(label)+'</span></label>';
}
const MINS = TMRules.MIN;

/* ---------- Le mot de passe ---------- */
function pwField(){
  return field('pwd', 'Mot de passe',
    '<span class="inp-x"><input class="inp" id="pwd" type="'+(O.showPwd?'text':'password')+'" value="'+esc(O.pwd)+'" '
    + 'placeholder="'+(O.login ? 'Ton mot de passe' : 'Au moins 8 caractères')+'" '
    + 'autocomplete="'+(O.login ? 'current-password' : 'new-password')+'" aria-describedby="'+(O.login ? 'pwErr' : 'pwList pwErr')+'">'
    + '<button class="peek" data-act="onb-peek" aria-pressed="'+O.showPwd+'" aria-label="'+(O.showPwd?'Masquer':'Afficher')+' le mot de passe" title="'+(O.showPwd?'Masquer':'Afficher')+'">'
    + ic(O.showPwd ? 'eye-off' : 'eye')+'</button></span>', true);
}
function pwList(){
  return '<ul class="pwreq" id="pwList">' + PW_RULES.map((r,i) =>
    '<li id="pwr'+i+'"'+(r[1](O.pwd)?' class="ok"':'')+'><span class="mk">'+tick()+'</span>'+esc(r[0])+'</li>').join('') + '</ul>';
}
/* L'erreur n'apparaît qu'après être sorti du champ (§5.2). */
function syncPwd(){
  const el = $('#pwd'); if(!el) return;
  O.pwd = el.value;
  PW_RULES.forEach((r,i) => { const li = $('#pwr'+i); if(li) li.classList.toggle('ok', r[1](O.pwd)); });
  const ok = authOk(), bad = O.pwdTouched && !ok;
  el.classList.toggle('err', bad); el.setAttribute('aria-invalid', bad);
  const err = $('#pwErr'); if(err) err.classList.toggle('on', bad);
  if(!O.sending) onbEnable(ok);
}
function syncIdent(){
  const el = $('#ident'); if(!el) return;
  O.ident = el.value.trim();
  const ok = identOk(O.ident), bad = O.identTouched && !!O.ident && !ok;
  el.classList.toggle('err', bad); el.setAttribute('aria-invalid', bad);
  const err = $('#identErr'); if(err) err.classList.toggle('on', bad);
  const b = $('#onbMain'); if(b) b.disabled = !ok;
}
function syncCode(){
  const boxes = $$('.otp .inp');
  O.code = boxes.map(b => b.value).join('');
  onbEnable(O.code.length === 6 && !O.sending);
}

/* ============================================================
   Rendu
   ============================================================ */
function renderOnb(){
  const root = $('#onb');
  if(!O.step){ root.hidden = true; return; }
  root.hidden = false;
  /* La couleur du rôle ne s'installe qu'à partir de l'étape 3 (§8.3). */
  if(O.step >= 3 && (O.roleSel || O.step > 3)) document.documentElement.setAttribute('data-role', O.roleSel || ME.role);
  else document.documentElement.removeAttribute('data-role');
  const a = onbAction();
  let body = '', foot = '', legal = '';

  /* --- 1. Compte --- */
  if(O.step === 1){
    legal = '<div class="onb-legal">En continuant, tu acceptes les <a href="#" data-act="noop">conditions générales</a> et la <a href="#" data-act="noop">politique de confidentialité</a>.</div>';
    if(O.sub === 'choose'){
      body = '<div class="onb-h"><h2>'+(O.login ? 'Content de te revoir' : 'Crée ton compte gratuitement')+'</h2>'
        + '<p>'+(O.login ? 'Retrouve tes invitations, tes matchs et ton Atelier.' : 'Publier ta fiche et explorer restera toujours gratuit.')+'</p></div>'
        + '<div class="col" style="gap:10px">'
        +   '<button class="btn btn-ghost btn-lg btn-block" data-act="onb-social" data-m="google">'
        +     '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M45 24.3c0-1.6-.1-2.7-.4-3.9H24v7.1h12c-.2 1.8-1.5 4.6-4.4 6.4l6.7 5.2c4-3.7 6.7-9.1 6.7-14.8z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.1 5.5C8 41.3 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.8-2.9-.8-4.4s.3-3 .7-4.4l-7.1-5.5C2.8 17 2 20.4 2 24s.8 7 2.3 9.9z"/><path fill="#EA4335" d="M24 10.4c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 4.2 29.9 2 24 2 15.4 2 8 6.7 4.3 14.1l7.1 5.5C13.3 14.2 18.2 10.4 24 10.4z"/></svg>Continuer avec Google</button>'
        +   '<button class="btn btn-ghost btn-lg btn-block" data-act="onb-social" data-m="apple">'
        +     '<svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M16.4 12.8c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.2 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.2.9-1.2 1.3-2.5 1.3-2.5s-2.5-1-2.5-3.6zM14.2 5.9c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3z"/></svg>Continuer avec Apple</button>'
        + '</div>'
        + '<div class="orline"><span>ou</span></div>'
        + '<div class="col" style="gap:12px">'
        +   field('ident', 'Adresse e-mail',
              '<input class="inp" id="ident" type="email" autocomplete="email" placeholder="toi@exemple.com" value="'+esc(O.ident)+'" aria-describedby="identHint identErr">',
              true,
              '<span class="hint" id="identHint">'+(O.login ? 'Celle que tu as utilisée à l\'inscription.' : 'On t\'envoie un code à usage unique pour la vérifier.')+'</span>'
              + '<span class="ferr" id="identErr" role="alert">Cette adresse e-mail ne semble pas valide.</span>')
        +   '<button class="btn btn-go btn-lg btn-block" id="onbMain" data-act="onb-go" data-to="1"'+(a.ok?'':' disabled')+'>Continuer</button>'
        + '</div>'
        + '<p style="text-align:center;font-size:13.5px;color:var(--ink-2);margin-top:18px">'
        +   (O.login ? 'Pas encore de compte ? ' : 'Tu as déjà un compte ? ')
        +   '<button class="linkbtn" data-act="onb-toggle-login">'+(O.login ? 'Créer un compte' : 'Se connecter')+'</button></p>';
    }
    else if(O.sub === 'code'){
      body = '<div class="onb-h"><h2>Vérifie ta boîte mail</h2>'
        + '<p>On vient d\'envoyer un code à 6 chiffres à</p><div class="who">'+esc(O.ident)+'</div></div>'
        + '<div class="col" style="gap:12px">'
        +   '<div class="field"><label for="otp0">Code reçu<span class="req" aria-hidden="true">*</span></label>'
        +   '<div class="otp" role="group" aria-label="Code à 6 chiffres">'
        +     [0,1,2,3,4,5].map(k => '<input class="inp" id="otp'+k+'" inputmode="numeric" autocomplete="'+(k?'off':'one-time-code')+'" maxlength="6" aria-label="Chiffre '+(k+1)+'" value="'+esc(O.code[k]||'')+'">').join('')
        +   '</div></div>'
        +   '<p class="hint">Il expire dans <span class="mono">10 min</span>. Pense à regarder dans les indésirables.</p>'
        +   '<div class="otp-act"><button class="linkbtn" data-act="onb-resend">Renvoyer le code</button>'
        +   '<button class="linkbtn" data-act="onb-edit-ident">Modifier l\'adresse</button></div>'
        + '</div>';
      foot = onbFoot(a);
    }
    else if(O.sub === 'phone'){
      const c = country(ME.cc);
      body = '<div class="onb-h"><h2>Ton numéro de téléphone</h2>'
        + (O.social ? '<div class="who">'+(O.social === 'google' ? 'Compte Google' : 'Compte Apple')+' · '+esc(O.ident)+'</div>' : '')
        + '<p>C\'est lui qui sécurise ton compte et nous permet de te joindre en cas de problème. Entre ton vrai numéro.</p></div>'
        + '<div class="col" style="gap:14px">'
        +   '<div class="field"><label for="phone">Numéro de téléphone<span class="req" aria-hidden="true">*</span></label>'
        +   '<div class="tel">'
        +     '<div class="cc">'
        +       '<button type="button" class="cc-btn" id="ccBtn" data-act="cc-open" aria-haspopup="listbox" aria-expanded="false" aria-label="Pays : '+esc(c.n)+' '+c.c+'">'
        +         flag(c.id)+'<span class="mono">'+c.c+'</span>'+ic('down')+'</button>'
        +       '<ul class="cc-list" id="ccList" role="listbox" aria-label="Choisir le pays" hidden>'
        +         COUNTRIES.map(x => '<li role="option" tabindex="-1" data-act="cc-pick" data-cc="'+x.id+'" aria-selected="'+(x.id===c.id)+'">'
                    + flag(x.id)+'<span class="n">'+esc(x.n)+'</span><span class="mono">'+x.c+'</span></li>').join('')
        +       '</ul></div>'
        +     '<input class="inp" id="phone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="'+c.ph.length+'" placeholder="'+esc(c.ph)+'" value="'+esc(phoneFormat(ME.phone, c.id))+'" aria-describedby="phoneCnt phoneErr phoneNote">'
        +   '</div>'
        +   '<span class="hint mono phone-cnt" id="phoneCnt" aria-live="polite"></span>'
        +   '<span class="ferr" id="phoneErr" role="alert">Un numéro '+esc(c.id === 'FR' ? 'français' : 'de ce pays')+' compte <span class="mono">'+c.len.join('</span> ou <span class="mono">')+'</span> chiffres (sans le '+(c.trunk||'0')+' de tête).</span></div>'
        +   '<div class="note-card" id="phoneNote">'+ic('lock')+'<div><b>Ton numéro reste privé</b>'
        +     '<p class="hint">Il n\'est jamais publié — ni sur ta fiche, ni dans les résultats, ni même après un match.</p></div></div>'
        + '</div>';
      foot = onbFoot(a);
    }
    else {
      body = '<div class="onb-h"><h2>'+(O.login ? 'Ton mot de passe' : 'Choisis un mot de passe')+'</h2>'
        + '<div class="who">'+esc(O.ident)+'</div></div>'
        + '<div class="col" style="gap:18px"><div class="col" style="gap:12px">' + pwField()
        + (O.login
            ? '<div class="ferr" id="pwErr" role="alert">Entre ton mot de passe pour continuer.</div>'
              + '<div><button class="linkbtn" data-act="noop">Mot de passe oublié ?</button></div>'
            : pwList() + '<div class="ferr" id="pwErr" role="alert">Il manque encore un critère ci-dessus.</div>')
        + '</div>'
        + (O.login ? '' : '<button class="opt opt-line" data-act="onb-optin" aria-pressed="'+O.optin+'"><span class="box">'+tick()+'</span>'
            + '<span>Recevoir les nouveautés de TakaMatch <span class="dim">— facultatif</span></span></button>')
        + '</div>';
      foot = onbFoot(a);
    }
  }

  /* --- 2. Le pacte --- */
  else if(O.step === 2){
    const rules = [
      ['users','Sois authentique',"Ton profil doit refléter qui tu es vraiment. Une fiche gonflée se voit au premier appel."],
      ['lock','Protège-toi',"Ton nom légal et tes coordonnées ne sont dévoilés qu'après un match accepté."],
      ['spark','Sois pro, sois humain',"Tu n'es pas là pour recruter, mais pour bâtir. Réponds, même pour dire non."],
      ['flag','Signale sans hésiter',"Un comportement déplacé ? Un signalement est traité sous 48 h."],
    ];
    body = '<div class="onb-h"><h2>Le pacte TakaMatch</h2><p>Quatre règles d\'or. Elles tiennent la communauté debout.</p></div>'
      + '<div class="pact">' + rules.map(r => '<div class="pact-i"><span class="tile" aria-hidden="true">'+ic(r[0])+'</span>'
          + '<div><div class="t">'+esc(r[1])+'</div><div class="d">'+esc(r[2])+'</div></div></div>').join('') + '</div>'
      + '<button class="opt opt-line" style="margin-top:14px" data-act="onb-pact" aria-pressed="'+O.pactOk+'"><span class="box">'+tick()+'</span><span>Je m\'engage à respecter ce pacte.</span></button>';
    foot = onbFoot(a);
  }

  /* --- 3. Ton rôle : le carrefour --- */
  else if(O.step === 3){
    const rp = (r, emo, name, sub, d) => '<button class="rp rp-'+r+'" data-act="onb-role" data-r="'+r+'" aria-pressed="'+(O.roleSel===r)+'">'
      + '<span class="tick" aria-hidden="true">'+tick()+'</span><span class="emo" aria-hidden="true">'+emo+'</span>'
      + '<b>'+name+'</b><span class="sub">'+esc(sub)+'</span><span class="d">'+esc(d)+'</span></button>';
    body = '<div class="onb-h"><h2>Tu viens avec une idée… ou avec ton talent ?</h2>'
      + '<p>Choisis ce qui te décrit le mieux aujourd\'hui.</p></div>'
      + '<div class="rpk" role="group" aria-label="Ton rôle">'
      +   rp('vis','💡','Visionnaire',"J'ai une idée ou un projet","Tu ne veux pas — ou ne peux pas — la porter seul. Bâtis ton équipe et deviens cofondateur·ice.")
      +   rp('tal','🛠️','Talent',"J'ai des compétences à faire valoir","Tu sais coder, designer, vendre, cadrer… mais tu attends le bon projet.")
      + '</div>'
      + '<p class="hint" style="margin-top:14px">Tu pourras ajouter l\'autre profil plus tard : <span class="mono">'+esc(window.TMPrix ? TMPrix.text('second') : '3 000 FCFA')+'</span>, une seule fois. Tes deux profils restent indépendants.</p>';
    foot = onbFoot(a);
  }

  /* --- 4. Ton identité --- */
  else if(O.step === 4){
    if(!ME.cityCc) ME.cityCc = ME.cc || 'BJ';
    body = '<div class="onb-h"><h2>Ton nom légal</h2>'
      + '<p>Il sécurise les collaborations. Il reste privé et ne s\'affiche qu\'après un match accepté.</p></div>'
      + '<div class="col" style="gap:16px">'
      +   field('first','Prénom(s)','<input class="inp" id="first" placeholder="Comme sur ta pièce d\'identité" autocomplete="given-name" value="'+esc(ME.first)+'">', true)
      +   field('last','Nom de famille','<input class="inp" id="last" placeholder="Comme sur ta pièce d\'identité" autocomplete="family-name" value="'+esc(ME.last)+'">', true)
      +   '<div class="field"><label id="sexL">Sexe<span class="req" aria-hidden="true">*</span></label>'
      +     '<div class="opt-row" role="group" aria-labelledby="sexL" aria-describedby="sexHint">'
      +     SEX.map(x => optBtn('f-sex', 'sex', x.id, esc(x.l), ME.sex === x.id, true)).join('')
      +     '</div><span class="hint" id="sexHint">Visible seulement après un match. Il ne compte ni dans le score ni dans les filtres.</span></div>'
      +   cityFields()
      +   '<p class="hint">'+ic('lock')+' Tu ne pourras pas le changer après — c\'est ce qui rend les documents de l\'Atelier valables.</p>'
      + '</div>';
    foot = onbFoot(a);
  }

  /* --- 5. Ton pseudo --- */
  else if(O.step === 5){
    const st = handleState(ME.handle);
    body = '<div class="onb-h"><h2>Choisis ton pseudo</h2>'
      + '<p>Il remplace ton nom partout tant qu\'il n\'y a pas de match : sur ta fiche, dans les résultats et sur ton code QR.</p></div>'
      + '<div class="col" style="gap:18px">'
      +   '<div class="field"><label for="handle">Ton pseudo<span class="req" aria-hidden="true">*</span></label>'
      +     '<div class="at"><span aria-hidden="true">@</span><input class="inp" id="handle" placeholder="ton_pseudo" autocomplete="off" spellcheck="false" maxlength="20" value="'+esc(ME.handle)+'" aria-describedby="handleMsg"></div>'
      +     '<div id="handleMsg" class="hint" aria-live="polite">'+esc(st.msg)+'</div></div>'
      +   '<div class="note-card">'+ic('lock')+'<div><b>Ton vrai nom reste caché</b>'
      +     '<p class="hint">'+esc([myName(), sexL(ME.sex)].filter(Boolean).join(' · '))+' : visible seulement après un match accepté des deux côtés. Ta ville, elle, reste affichée sur ta fiche. Évite de reprendre ton nom dans ton pseudo.</p></div></div>'
      + '</div>';
    foot = onbFoot(a);
  }

  /* --- 6. Ta fiche --- */
  else if(O.step === FICHE){
    body = '<div class="onb-h"><h2>'+(ME.role === 'tal' ? 'Ta fiche Talent' : 'Ta fiche Projet')+'</h2>'
      + '<p>'+(ME.role === 'tal'
          ? "C'est elle que les visionnaires verront. Elle se construit à droite, en direct."
          : "C'est elle que les talents liront. Sois concret : ce sont les chiffres qui convainquent.")+'</p></div>'
      + '<div class="col" style="gap:24px" id="ficheForm">' + (ME.role === 'tal' ? talentFields() : projectFields()) + '</div>';
    foot = '<div class="why" id="why" role="status" hidden></div>' + onbFoot(a, '<span class="note" id="pubNote"></span>');
  }

  /* --- 7. Ta fiche perso (visionnaire, facultative) --- */
  else if(O.step === PERSO){
    body = '<div class="onb-h"><h2>Ta fiche perso<span class="opt-tag">Facultatif</span></h2>'
      + "<p>L'humain derrière le projet : les talents peuvent l'ouvrir depuis ta fiche projet. Pas de statistiques ici, et elle ne bloque pas la publication.</p></div>"
      + '<div class="col" style="gap:24px" id="persoForm">' + persoFields() + '</div>';
    foot = onbFoot(a, '<button class="btn btn-ghost btn-lg" data-act="perso-skip">Passer cette étape</button>');
  }

  /* --- 8. Tes photos --- */
  else if(O.step === PHOTOS){
    const vis = ME.role === 'vis';
    body = '<div class="onb-h"><h2>Ta photo de profil</h2>'
      + '<p>'+(vis
          ? "Une vraie photo de toi : de face, visage net, fond sobre. C'est ce qui rassure un talent avant d'accepter ton invitation."
          : "Une vraie photo professionnelle : de face, visage net, fond sobre. C'est ce qui inspire confiance à un visionnaire.")+'</p></div>'
      + '<div class="col" style="gap:22px">' + photoFields() + '</div>';
    foot = onbFoot(a, '<button class="btn btn-quiet" data-act="photos-later">Plus tard</button>');
  }

  /* --- 9. Prêt --- */
  else if(O.step === READY){
    const pct = completion();
    body = '<div class="ready">'
      + '<div class="okc" aria-hidden="true">'+ic('check')+'</div>'
      + '<h2>Bravo, '+esc(ME.first || 'à toi')+'. Ta fiche est en ligne.</h2>'
      + '<p>'+(pct >= 90
          ? "Elle est complète. On t'a préparé "+(ME.role === 'tal' ? 'des projets' : 'des talents')+" classés par compatibilité réelle."
          : "Elle est déjà solide. Complète-la depuis ton tableau de bord pour remonter encore dans les résultats.")+'</p>'
      + '<div class="card">'+ringHTML(pct, 118, true)
      +   '<div><div class="lbl">'+(ME.role === 'tal' ? 'Ma fiche Talent' : 'Mes fiches')+'</div><div class="v">'+(pct >= 90 ? 'Prête à convaincre' : 'Bien partie')+'</div>'
      +   '<div style="margin-top:6px"><span class="handle-chip">'+esc(myHandle())+'</span></div></div></div>'
      + readyLines()
      + readyNote()
      + '</div>';
    foot = onbFoot(a);
  }

  /* La carcasse est posée une seule fois : d'une étape à l'autre on ne
     remplace que le contenu, sinon le voile et la fenêtre rejoueraient
     leur entrée à chaque clic. */
  if(root.dataset.built !== '1'){
    root.innerHTML = '<div class="onb"><div class="onb-veil" data-act="onb-close" aria-hidden="true"></div><div class="onb-wrap">'
      + '<button class="onb-x" data-act="onb-close" aria-label="Fermer et revenir au site" title="Fermer (Échap)">'+ic('x')+'</button>'
      + '<div class="onb-card" role="dialog" aria-modal="true" aria-labelledby="onbTitle">'
      + '<div class="onb-left"><div class="onb-head"></div><div class="onb-body scroll"></div><div class="onb-tail"></div></div>'
      + '<aside class="onb-side"></aside></div></div></div>';
    root.dataset.built = '1';
  }
  root.querySelector('.onb-card').classList.toggle('pre', preRole());
  root.querySelector('.onb-head').innerHTML = onbNav(a);
  root.querySelector('.onb-body').innerHTML = '<div class="onb-inner">'+body+'</div>';
  root.querySelector('.onb-tail').innerHTML = foot + legal;
  const h2 = root.querySelector('.onb-body h2'); if(h2) h2.id = 'onbTitle';

  /* L'illustration ne change qu'au changement d'étape — c'est le seul
     moment où elle s'anime. La colonne ne remonte qu'à ce moment-là. */
  if(O._art !== O.step){
    const aside = root.querySelector('.onb-side');
    aside.className = 'onb-side' + (O.step === FICHE || O.step === PERSO || O.step === PHOTOS ? ' preview' : '');
    aside.setAttribute('aria-hidden', 'true');
    aside.innerHTML = onbSide(O.step);
    O._art = O.step;
  }
  const mark = O.step + ':' + O.sub;
  if(O._painted !== mark){ root.querySelector('.onb-body').scrollTop = 0; O._painted = mark; }

  if(O.step === 1 && O.sub === 'choose') syncIdent();
  if(O.step === 1 && O.sub === 'code') syncCode();
  if(O.step === 1 && O.sub === 'phone') syncPhone();
  if(O.step === 1 && O.sub === 'pwd') syncPwd();
  if(O.step === 4) checkIdentity();
  if(O.step === 5) syncHandle();
  if(O.step === FICHE) syncFiche();
  if(O.step === PERSO) syncPerso();
  if(O.step === PHOTOS) syncPreview();
  if(O.step === READY) requestAnimationFrame(() => requestAnimationFrame(animateRings));
  syncWb();
  const f = root.querySelector('.onb-body .otp .inp, .onb-body input:not([type="hidden"]):not([type="file"])');
  if(f && window.innerWidth > 900){ try{ f.focus({preventScroll:true}); }catch(e){} }
}

/* ---------- La fiche express ---------- */
function talentFields(){
  const m = ME;
  return '<p class="fiche-note"><b>*</b> section obligatoire pour que ta fiche soit mise en ligne.</p>'
  + fsec('tools', 'Tes compétences clés', true, optList(SKILLS, 'f-multi', 'skills', m.skills), 'Choisis-en 2 à 4. Au-delà, plus personne ne te croit.')
  + fsec('trend', "Ton niveau d'expérience", true, optList(LEVEL, 'f-one', 'level', m.level, 'opt-row', true))
  + fsec('award', 'Ton plus haut niveau de diplôme obtenu', true, optList(DIPLOMA, 'f-one', 'diploma', m.diploma, 'opt-wrap', true))
  + fsec('briefcase', 'Ton statut professionnel actuel', true, optList(STATUS, 'f-one', 'status', m.status, 'opt-wrap', true))
  + fsec('compass', "Les secteurs qui t'attirent", true,
      '<div class="opt-wrap">'+SECTORS.map(s=>optBtn('f-multi','sectors',s.id,s.g+' '+esc(s.l),m.sectors.includes(s.id))).join('')+'</div>', 'Au moins un.')
  + fsec('clock', 'Combien de temps peux-tu vraiment donner ?', true,
      '<div class="col" style="gap:2px">'+PACE.map(p=>optBtn('f-one','pace',p.id,'<b>'+p.l+'</b> <span class="dim">— '+p.h+'</span>',m.pace===p.id,true)).join('')+'</div>'
      + '<p class="hint" style="margin-top:6px">'+ic('info')+' Ce que chaque projet propose (parts, rémunération) est indiqué sur sa fiche.</p>',
      "C'est la première cause d'échec d'une cofondation. Sois honnête, pas ambitieux.")
  + fsec('quote', 'Ta signature personnelle', true,
      area('bio', 'bio', 420, "Ce que tu sais faire, ce que tu as déjà livré, et le type de projet que tu cherches. Deux ou trois phrases concrètes valent mieux qu'un paragraphe de généralités.", m.bio, MINS.bio),
      'Impact : c\'est la première chose qu\'un visionnaire lit de toi. '+MINS.bio+' caractères au moins.')
  + fsec('link', 'Ton lien portfolio', true,
      '<div class="grid g2" style="gap:10px">'
      + '<input class="inp" id="portfolioTitle" data-k="portfolioTitle" placeholder="GitHub, Behance, LinkedIn…" value="'+esc(m.portfolioTitle)+'" aria-label="Titre du lien"'+(m.noPortfolio ? ' disabled' : '')+'>'
      + '<input class="inp" id="portfolio" data-k="portfolio" placeholder="github.com/tonpseudo" value="'+esc(m.portfolio)+'" aria-label="Adresse du lien"'+(m.noPortfolio ? ' disabled' : '')+'>'
      + '</div>' + noneBox('noPortfolio', m.noPortfolio, 'Je n\'ai pas encore de portfolio'));
}
function projectFields(){
  const m = ME, p = m.project;
  return '<p class="fiche-note"><b>*</b> section obligatoire pour que ta fiche soit mise en ligne.</p>'
  + '<p class="hint">'+ic('info')+' Ta première fiche projet est incluse. Tu peux porter jusqu\'à 3 projets : <span class="mono">'+esc(window.TMPrix ? TMPrix.text('slot') : '5 000 FCFA')+'</span> par emplacement supplémentaire, une seule fois.</p>'
  + fsec('file', 'Titre du projet', true, '<input class="inp" id="ptitle" data-k="p.title" maxlength="34" placeholder="Le nom de ton projet" value="'+esc(p.title)+'">')
  + fsec('compass', 'Les secteurs du projet', true,
      '<div class="opt-wrap">'+SECTORS.map(s=>optBtn('f-multi','p.sectors',s.id,s.g+' '+esc(s.l),p.sectors.includes(s.id))).join('')+'</div>',
      '1 à 3 secteurs.')
  + fsec('image', 'La couverture du projet', false, '<div id="coverBox">'+coverBlock()+'</div>',
      "C'est la première chose qu'un talent voit de ton projet.")
  + fsec('tools', 'Les compétences que tu recherches', true, optList(SKILLS, 'f-multi', 'p.seeking', p.seeking), 'Au moins 1. Ce sont elles qui déterminent qui te verra en haut de liste.')
  + fsec('clock', 'Quel rythme attends-tu de ton cofondateur ?', true,
      '<div class="col" style="gap:2px">'+PACE.map(x=>optBtn('f-one','pace',x.id,'<b>'+x.l+'</b> <span class="dim">— '+x.h+'</span>',m.pace===x.id,true)).join('')+'</div>',
      "C'est la première cause d'échec d'une cofondation. Sois honnête, pas ambitieux.")
  + fsec('gift', 'Ce que tu proposes aux talents', true,
      '<div class="col" style="gap:2px">'+OFFER.map(x=>optBtn('f-one','p.offer',x.id,'<b>'+x.l+'</b> <span class="dim">— '+x.h+'</span>',p.offer===x.id,true)).join('')+'</div>',
      'Affiché sur ta fiche : le talent sait à quoi s\'attendre avant d\'accepter.')
  + fsec('zap', 'Le Hook', true, area('hook','p.hook',400,"Le problème que tu résous, en une ou deux phrases. Un chiffre vaut mieux qu'une intention.",p.hook,MINS.hook), "Impact : capte l'attention en trois secondes. "+MINS.hook+" caractères au moins.")
  + fsec('rocket', 'La Vision', true, area('vision','p.vision',320,'Ce que le projet devient dans cinq ans si tout va bien.',p.vision,MINS.vision), "Impact : permet au talent d'adhérer à ton ambition. "+MINS.vision+" caractères au moins.")
  + fsec('trend', 'La Traction', false, area('traction','p.traction',320,'Prototype, utilisateurs, premiers revenus, partenariats signés… ce qui prouve que ça avance déjà.',p.traction,MINS.traction), "Facultatif, mais compte pour atteindre 100 % de remplissage ("+MINS.traction+" caractères au moins pour compter). Impact : c'est la section qui fait la différence entre une idée et un projet.")
  + fsec('target', 'Les Défis', true, area('challenges','p.challenges',320,"Ce qui te bloque aujourd'hui et pour quoi tu cherches de l'aide.",p.challenges,MINS.challenges), "Impact : aide le talent à voir où il apporterait de la valeur. "+MINS.challenges+" caractères au moins.")
  + fsec('link', 'Lien externe', true, '<input class="inp" id="plink" data-k="p.link" placeholder="monprojet.bj" value="'+esc(p.link)+'"'+(p.noLink ? ' disabled' : '')+'>'
      + noneBox('p.noLink', p.noLink, 'Mon projet n\'a pas encore de site ni de page'), 'Site, page Facebook, LinkedIn, vidéo de démonstration…');
}
/* Fiche perso : mêmes briques que la fiche Talent (compétences, niveau,
   signature, portfolio), en plus court. Tout y est facultatif. */
function persoFields(){
  const x = ME.perso;
  return fsec('tools', 'Tes compétences clés', false, optList(SKILLS, 'f-multi', 'x.skills', x.skills),
      'Choisis-en 2 à 4 : ce que toi, tu apportes au projet.')
  + fsec('trend', "Ton niveau d'expérience", false, optList(LEVEL, 'f-one', 'x.level', x.level, 'opt-row', true))
  + fsec('quote', 'Ta signature', false,
      area('pbio', 'x.bio', 420, "Qui tu es, ce que tu as déjà fait, et pourquoi c'est toi qui portes ce projet. Deux ou trois phrases concrètes.", x.bio),
      PERSO_BIO_MIN + ' caractères au moins.')
  + fsec('link', 'Ton lien portfolio', false,
      '<input class="inp" id="pport" data-k="x.portfolio" placeholder="linkedin.com/in/tonpseudo" value="'+esc(x.portfolio)+'" aria-label="Adresse du lien"'+(x.noPortfolio ? ' disabled' : '')+'>'
      + noneBox('x.noPortfolio', x.noPortfolio, 'Je n\'ai pas encore de portfolio'));
}
/* Couverture : à gauche une photo (lue sur l'appareil), à droite une
   icône. Seules les icônes des secteurs cochés sont proposées. */
function coverBlock(){
  const src = ME.project.cover;
  return '<div class="cov2">'
    + '<div class="cov-ph"><div class="lbl">Ta photo de couverture</div>'
    +   '<label class="cov-zone'+(src ? ' has' : '')+'" for="f_cover"'+(src ? ' style="background-image:url('+src+')"' : '')+'>'
    +     (src ? '<span class="sr">Couverture ajoutée</span>' : '<span class="up-in">'+ic('camera')+'<span>Format paysage</span></span>')
    +   '</label>'
    +   '<input type="file" class="sr" id="f_cover" accept="image/png,image/jpeg,image/webp" data-up="cover" aria-label="Ta photo de couverture">'
    +   '<div class="row"><label class="btn btn-ghost btn-sm" for="f_cover">'+ic('image')+(src ? 'Remplacer' : 'Choisir une image')+'</label>'
    +   (src ? '<button class="btn btn-quiet btn-sm" data-act="up-clear" data-k="cover">Retirer</button>' : '')+'</div></div>'
    + '<div><div class="lbl" id="covIcL">Ou une icône</div>'
    +   '<div class="cov-ic" role="group" aria-labelledby="covIcL">'
    +   SECTORS.map(s => '<button type="button" data-act="f-icon" data-v="'+s.id+'" aria-label="'+esc(s.l)+'"></button>').join('')
    +   '</div><p class="hint" id="covIcH">'+(src ? 'Ta photo passe avant l\'icône. Retire-la pour utiliser l\'icône.' : 'Par défaut, l\'icône de ton premier secteur.')+'</p></div>'
    + '</div>';
}
function syncIcons(){
  const p = ME.project, cur = projIcon();
  $$('.cov-ic button').forEach(b => {
    const s = sector(b.dataset.v), on = p.sectors.includes(b.dataset.v);
    b.textContent = s.g;
    b.disabled = !on;
    b.title = on ? s.l : 'Coche le secteur « '+s.l+' » pour utiliser cette icône';
    b.setAttribute('aria-pressed', on && s.g === cur);
  });
}
/* Sous la jauge : la fiche perso (visionnaire) et le rappel à venir. */
function readyLines(){
  let out = '';
  if(ME.role === 'vis'){
    const pp = persoPct();
    out += '<p>'+ic('users')+'<span>'+(pp > 0
      ? '<b>Ta fiche perso : <span class="mono">'+pp+' %</span></b>'+(pp < 100 ? ' — tu la complètes quand tu veux dans Mes fiches › Ma fiche perso.' : '')
      : '<b>Ta fiche perso</b> : à compléter plus tard dans Mes fiches › Ma fiche perso.')+'</span></p>';
  }
  out += '<p>'+ic('bell')+'<span>Après ta connexion, un rappel te montrera ce qu\'il manque pour atteindre <span class="mono">100 %</span>.</span></p>';
  return '<div class="ready-lines">'+out+'</div>';
}
/* Ce qui se passe maintenant que la fiche est en ligne. */
function readyNote(){
  const tal = ME.role === 'tal';
  const li = tal ? [
    "Tu ne vois que des fiches projet ; seuls les visionnaires voient ta fiche Talent.",
    "Une personne arrivée par ton lien ou ton code QR peut lire ta fiche, pas t'inviter.",
    "Une invitation reçue expire au bout de 10 jours.",
    "Tu peux rejoindre jusqu'à 3 projets en même temps.",
  ] : [
    "Tu ne vois que des fiches talent ; seuls les talents voient tes fiches projet.",
    "Une personne arrivée par ton lien ou ton code QR peut lire ta fiche, pas t'inviter.",
    "Tes invitations expirent au bout de 10 jours sans réponse.",
    "Ta première fiche projet est incluse. Tu peux porter jusqu'à 3 projets : "+(window.TMPrix ? TMPrix.text('slot') : '5 000 FCFA')+" par emplacement supplémentaire, une seule fois.",
  ];
  return '<div class="note-card">'+ic('eye')+'<div><b>Qui voit quoi</b><ul>'+li.map(x => '<li>'+esc(x)+'</li>').join('')+'</ul></div></div>';
}
/* L'aperçu reprend les fiches d'annuaire du design system (§5.5) :
   projet en or, talent en bleu avec son portrait flouté (§5.7). */
function previewCard(){
  const m = ME;
  const skel = w => '<div class="skel" style="height:9px;width:'+w+'%"></div>';
  if(m.role === 'tal'){
    const sk = m.skills.slice(0,3), city = (m.city||'').split(',')[0] || '—';
    return '<article class="pcard person"><div class="cover tint tint-tal soft"><div class="portrait">'
      + (m.photo ? '<span class="av av-72" style="background:url('+m.photo+') center/cover;filter:blur(5px)"></span>'
                 : '<span class="av av-72 tint tint-tal" style="filter:blur(5px)">'+esc(initials(myName()))+'</span>') + '</div></div>'
      + '<div class="body"><h3 class="mask">****** ****</h3>'
      + '<div class="who"><span class="handle-chip">'+esc(myHandle())+'</span><span class="sep">·</span>'+esc(city)+'</div>'
      + (m.bio ? '<p class="ex">'+esc(m.bio)+'</p>' : '<div class="col" style="gap:5px;width:100%;align-items:center">'+skel(92)+skel(80)+skel(56)+'</div>')
      + (sk.length ? '<div class="chips"><span class="chips-k">Compétences :</span>'+sk.map(s=>'<span class="chip chip-tal">'+esc(skillL(s))+'</span>').join('')+'</div>' : '<div class="skel" style="height:22px;width:70%"></div>')
      + '</div></article>';
  }
  const p = m.project, sec = p.sectors[0] ? sector(p.sectors[0]) : null, off = OFFER.find(x => x.id === p.offer);
  return '<article class="pcard"><div class="cover tint tint-vis'+(p.cover ? ' has-img' : '')+'" style="--ta:130deg'+(p.cover ? ';background-image:url('+p.cover+')' : '')+'">'
    + (p.cover ? '' : '<span class="glyph" aria-hidden="true">'+projIcon()+'</span>')
    + (sec ? '<span class="tags"><span class="chip chip-onart" style="height:22px;font-size:11px">'+sec.g+' '+esc(sec.l)+'</span></span>' : '')
    + '<span class="chip chip-onart likes" aria-label="0 j\'aime">♡ <span class="mono">0</span></span></div>'
    + '<div class="body">'
    + (p.title ? '<h3>'+esc(p.title)+'</h3>' : '<div class="skel" style="height:15px;width:62%"></div>')
    + '<div class="who">'+(m.photo ? '<span class="av av-24" style="background:url('+m.photo+') center/cover;filter:blur(2px)" aria-hidden="true"></span>' : '')
    + '<span class="handle-chip">'+esc(myHandle())+'</span></div>'
    + (p.hook ? '<p class="ex">'+esc(p.hook)+'</p>' : '<div class="col" style="gap:5px">'+skel(100)+skel(88)+skel(55)+'</div>')
    + (p.seeking.length ? '<div class="chips"><span class="chips-k">Recherche :</span>'+p.seeking.slice(0,3).map(s=>'<span class="chip chip-a">'+esc(skillL(s))+'</span>').join('')+'</div>' : '')
    + (off ? '<div class="offer">'+ic('gift')+esc(off.l)+'</div>' : '')
    + '</div></article>';
}
/* Aperçu de la fiche perso : une personne, donc la variante portrait,
   mais en or — elle décrit un visionnaire. Aucune statistique. */
function persoCard(){
  const m = ME, x = m.perso, sk = x.skills.slice(0,4), city = (m.city||'').split(',')[0] || '—';
  const skel = w => '<div class="skel" style="height:9px;width:'+w+'%"></div>';
  const lv = x.level ? refL(LEVEL, x.level) : '';
  return '<article class="pcard person"><div class="cover tint tint-vis soft"><div class="portrait">'
    + (m.photo ? '<span class="av av-72" style="background:url('+m.photo+') center/cover;filter:blur(5px)"></span>'
               : '<span class="av av-72 tint tint-vis" style="filter:blur(5px)">'+esc(initials(myName()))+'</span>') + '</div></div>'
    + '<div class="body"><h3 class="mask">****** ****</h3>'
    + '<div class="who"><span class="handle-chip">'+esc(myHandle())+'</span><span class="sep">·</span>'+esc(city)+'</div>'
    + '<div class="who"><span>Visionnaire'+(lv ? ' · '+esc(lv) : '')+'</span></div>'
    + (x.bio ? '<p class="ex">'+esc(x.bio)+'</p>' : '<div class="col" style="gap:5px;width:100%;align-items:center">'+skel(92)+skel(80)+skel(56)+'</div>')
    + (sk.length ? '<div class="chips"><span class="chips-k">Compétences :</span>'+sk.map(s=>'<span class="chip chip-a">'+esc(skillL(s))+'</span>').join('')+'</div>' : '<div class="skel" style="height:22px;width:70%"></div>')
    + ((x.portfolio||'').trim() ? '<div class="plink">'+ic('link')+esc(x.portfolio.trim())+'</div>' : '')
    + '</div></article>';
}
/* Anneau de complétion (§5.6) : la couleur du rôle, du foncé au clair ;
   pourcentage en mono. Jamais de dégradé bleu → or. */
let ringSeq = 0;
function ringHTML(pct, size, rise){
  const sw = size >= 100 ? 10 : 6, r = (size - sw)/2 - 1, c = 2*Math.PI*r, id = 'rg'+(++ringSeq);
  const fs = Math.round(size * (pct >= 100 ? .19 : .23)), fsm = Math.round(size * .11);
  const target = (c*(1-pct/100)).toFixed(1);
  return '<div class="ring" style="width:'+size+'px;height:'+size+'px" role="img" aria-label="Fiche complétée à '+pct+' %">'
    + '<svg viewBox="0 0 '+size+' '+size+'"><defs><linearGradient id="'+id+'" x1="1" y1="1" x2="0" y2="0">'
    + '<stop offset="0" stop-color="var(--g-'+ME.role+'1)"/><stop offset="1" stop-color="var(--g-'+ME.role+'2)"/></linearGradient></defs>'
    + '<circle class="bg" cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" stroke-width="'+sw+'"/>'
    + '<circle class="fg" cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" stroke="url(#'+id+')" stroke-width="'+sw+'" stroke-dasharray="'+c.toFixed(1)+'" '
    + (rise ? 'stroke-dashoffset="'+c.toFixed(1)+'" data-to="'+target+'"' : 'stroke-dashoffset="'+target+'"') + '/></svg>'
    + '<div class="num" style="font-size:'+fs+'px">'+pct+'<small style="font-size:'+fsm+'px">%</small></div></div>';
}
function animateRings(){ $$('.ring .fg[data-to]').forEach(el => { el.setAttribute('stroke-dashoffset', el.dataset.to); el.removeAttribute('data-to'); }); }

/* ---------- Pays et ville : la ville se choisit dans la liste du pays ---------- */
function cityFields(){
  const cc = ME.cityCc, cur = TMGeo.split(ME.city).city;
  return '<div class="grid g2 city-grid">'
    + field('cityCc', 'Pays', '<select class="inp" id="cityCc" autocomplete="country">'
        + TMGeo.sorted().map(x => '<option value="'+x.id+'"'+(x.id === cc ? ' selected' : '')+'>'+esc(x.n)+'</option>').join('')+'</select>', true)
    + '<div class="field city-f"><label for="city">Ville<span class="req" aria-hidden="true">*</span></label>'
    +   '<input class="inp" id="city" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="cityList" autocomplete="off" '
    +     'placeholder="Commence à taper ta ville" value="'+esc(cur)+'">'
    +   '<ul class="city-list" id="cityList" role="listbox" aria-label="Villes proposées" hidden></ul>'
    +   '<span class="ferr" id="cityErr" role="alert">Choisis ta ville dans la liste proposée.</span></div>'
    + '</div>';
}
let cityOther = '';
function cityList(open){
  const inp = $('#city'), ul = $('#cityList'); if(!inp || !ul) return;
  const q = inp.value.trim(), hits = TMGeo.search(ME.cityCc, q, 8);
  /* « Pas dans la liste » : proposé seulement quand aucune ville ne correspond. */
  cityOther = q.length >= 2 && !hits.length ? q : '';
  ul.innerHTML = hits.map((v, i) => '<li role="option" tabindex="-1" data-act="city-pick" data-v="'+esc(v)+'" id="cityOpt'+i+'">'+esc(v)+'</li>').join('')
    + (cityOther ? '<li role="option" tabindex="-1" class="other" data-act="city-pick" data-v="'+esc(cityOther)+'" data-other="1">Ma ville n\'est pas dans la liste : utiliser « '+esc(cityOther)+' »</li>' : '');
  const show = open !== false && !!ul.children.length;
  ul.hidden = !show; inp.setAttribute('aria-expanded', show);
  /* La liste peut tomber sous le bas de la fenêtre : on la ramène à l'écran. */
  if(show) requestAnimationFrame(() => { try{ ul.scrollIntoView({block:'nearest', behavior:'smooth'}); }catch(e){} });
}
function cityPick(v){
  const inp = $('#city'); if(!inp) return;
  inp.value = v; ME.city = TMGeo.label(v, ME.cityCc);
  cityList(false); O.cityTouched = true; checkIdentity();
}
function checkIdentity(){
  const f = $('#first'), l = $('#last'), c = $('#city'); if(!f) return;
  ME.first = f.value.trim(); ME.last = l.value.trim();
  /* La ville n'est retenue que choisie dans la liste (ou confirmée « pas dans la liste »). */
  const typed = c.value.trim(), known = TMGeo.match(ME.cityCc, typed), picked = TMGeo.split(ME.city).city;
  if(known) ME.city = TMGeo.label(known, ME.cityCc);
  else if(!typed || typed !== picked) ME.city = '';
  const bad = !!O.cityTouched && !ME.city;
  c.classList.toggle('err', bad); c.setAttribute('aria-invalid', bad);
  const ce = $('#cityErr'); if(ce){ ce.textContent = typed ? 'Choisis ta ville dans la liste proposée.' : 'Indique ta ville.'; ce.classList.toggle('on', bad); }
  $$('[data-act="f-sex"]').forEach(b => { const on = b.dataset.v === ME.sex; b.setAttribute('aria-pressed', on); });
  onbEnable(!!(ME.first && ME.last && ME.city && ME.sex));
}
function syncHandle(){
  const el = $('#handle'); if(!el) return;
  const v = slugify(el.value.trim());
  if(el.value !== v) el.value = v;
  ME.handle = v;
  const st = handleState(v), msg = $('#handleMsg');
  if(msg){
    msg.textContent = st.msg;
    msg.style.color = st.k === 'ok' ? 'var(--ok-ink)' : (st.k === 'empty' ? '' : 'var(--bad-ink)');
  }
  el.classList.toggle('err', st.k === 'bad' || st.k === 'taken');
  onbEnable(st.k === 'ok');
}
function syncFiche(){
  if(O.step === PERSO){ syncPerso(); return; }
  $$('#ficheForm .opt').forEach(btn => {
    const cur = getPath(btn.dataset.k), v = btn.dataset.v;
    btn.setAttribute('aria-pressed', Array.isArray(cur) ? cur.includes(v) : cur === v);
    /* Projet : 1 à 3 secteurs. Au-delà, les autres cases se grisent. */
    if(btn.dataset.k === 'p.sectors'){
      const full = cur.length >= MAX_SECTORS && !cur.includes(v);
      btn.disabled = full; btn.title = full ? '3 secteurs maximum : décoche-en un pour choisir celui-ci' : '';
    }
  });
  syncIcons();
  $$('#ficheForm .cnt-c').forEach(el => {
    const t = $('#'+el.dataset.for); if(!t) return;
    const left = parseInt(t.getAttribute('maxlength'),10) - t.value.length;
    const need = (parseInt(t.dataset.min,10) || 0) - t.value.trim().length;
    el.textContent = need > 0
      ? 'encore ' + need + ' caractère' + (need > 1 ? 's' : '') + ' (minimum ' + t.dataset.min + ')'
      : left + ' caractère' + (left > 1 ? 's' : '') + ' restant' + (left > 1 ? 's' : '');
    /* En rouge sous le minimum, mais seulement après être sorti de la case
       ou après un clic sur « Publier » : jamais pendant qu'on écrit. */
    /* Section facultative (Traction) : rouge seulement si on a commencé à l'écrire. */
    const optional = (ruleRows().find(r => r.key === t.dataset.k) || {}).opt;
    const bad = need > 0 && (t.dataset.touched === '1' || O.tried) && !(optional && !t.value.trim());
    t.classList.toggle('err', bad); t.setAttribute('aria-invalid', bad);
    el.classList.toggle('bad', bad);
  });
  markSections('#ficheForm', ruleRows(), O.tried);
  const box = $('#prevBox'); if(box) box.innerHTML = previewCard();
  const pct = completion();
  const pr = $('#prevRing'); if(pr) pr.innerHTML = ringHTML(pct, 62);
  const note = $('#pubNote');
  const req = requiredMissing(), nr = req.length;
  if(note) note.innerHTML = !nr
    ? '<span class="mono">'+pct+' %</span> — prête à publier'
    : '<span class="mono">'+pct+' %</span> — encore <span class="mono">'+nr+'</span> section'+(nr > 1 ? 's' : '')+' à compléter';
  if(!O.sending) onbEnable(!nr);
  const w = $('#why'); if(w && !w.hidden && nr) showWhy();
}
function syncPerso(){
  $$('#persoForm .opt').forEach(btn => {
    const cur = getPath(btn.dataset.k), v = btn.dataset.v;
    btn.setAttribute('aria-pressed', Array.isArray(cur) ? cur.includes(v) : cur === v);
    if(btn.dataset.k === 'x.skills'){
      const full = cur.length >= PERSO_MAX_SKILLS && !cur.includes(v);
      btn.disabled = full; btn.title = full ? '4 compétences maximum : décoche-en une pour choisir celle-ci' : '';
    }
  });
  const t = $('#pbio'), c = $('#persoForm .cnt-c');
  if(t && c){
    const n = t.value.trim().length, left = 420 - t.value.length, need = PERSO_BIO_MIN - n;
    c.textContent = need > 0 ? 'encore ' + need + ' caractère' + (need > 1 ? 's' : '') + ' (minimum ' + PERSO_BIO_MIN + ')'
      : left + ' caractère' + (left > 1 ? 's' : '') + ' restant' + (left > 1 ? 's' : '');
    const bad = need > 0 && t.dataset.touched === '1' && n > 0;
    t.classList.toggle('err', bad); t.setAttribute('aria-invalid', bad); c.classList.toggle('bad', bad);
  }
  markSections('#persoForm', ruleRows('perso'), false);
  const box = $('#prevBox'); if(box) box.innerHTML = persoCard();
  const pr = $('#prevRing'); if(pr) pr.innerHTML = ringHTML(persoPct(), 62);
  if(!O.sending) onbEnable(true);
}
/* Contour et petit texte rouges sur chaque section incomplète.
   Visible après un clic sur « Publier », ou dès qu'on quitte une case mal remplie. */
function markSections(sel, rows, tried){
  const form = $(sel); if(!form) return;
  rows.forEach(r => {
    if(!r.key) return;
    const ctl = form.querySelector('[data-k="'+r.key+'"]'); if(!ctl) return;
    const sec = ctl.closest('.fsec'); if(!sec) return;
    const text = ctl.tagName === 'TEXTAREA', input = ctl.tagName === 'INPUT' && ctl.type !== 'checkbox';
    const show = !r.ok && (tried || sec.dataset.touched === '1') && !(r.opt && !r.started);
    sec.classList.toggle('fsec-bad', show);
    sec.classList.toggle('fsec-bad-opt', show && !text && !input);
    if(input){ ctl.classList.toggle('err', show); ctl.setAttribute('aria-invalid', show); }
    let e = sec.querySelector('.fsec-err');
    if(show && !text){
      if(!e){ e = document.createElement('p'); e.className = 'fsec-err'; e.setAttribute('role', 'alert'); sec.querySelector('.fsec-c').appendChild(e); }
      e.textContent = r.msg;
    } else if(e) e.remove();
  });
}
function getPath(k){ return k.startsWith('p.') ? ME.project[k.slice(2)] : k.startsWith('x.') ? ME.perso[k.slice(2)] : ME[k]; }
function setPath(k, v){ if(k.startsWith('p.')) ME.project[k.slice(2)] = v; else if(k.startsWith('x.')) ME.perso[k.slice(2)] = v; else ME[k] = v; }

/* ============================================================
   Téléphone — sélecteur de pays à drapeau
   ============================================================ */
function syncPhone(){
  const el = $('#phone'); if(!el) return;
  const f = phoneFormat(el.value, ME.cc);
  if(el.value !== f){ el.value = f; try{ el.setSelectionRange(f.length, f.length); }catch(e){} }
  ME.phone = f;
  const n = phoneNsn(f, ME.cc).length, N = phoneMax(ME.cc);
  const cnt = $('#phoneCnt'); if(cnt){ cnt.textContent = n + ' / ' + N + ' chiffres'; cnt.classList.toggle('ok', phoneOk(f, ME.cc)); }
  const ok = phoneOk(ME.phone, ME.cc), bad = O.phoneTouched && !!ME.phone.trim() && !ok;
  el.classList.toggle('err', bad); el.setAttribute('aria-invalid', bad);
  const err = $('#phoneErr'); if(err) err.classList.toggle('on', bad);
  if(!O.sending) onbEnable(ok);
}
function ccOpen(open){
  const l = $('#ccList'), b = $('#ccBtn'); if(!l || !b) return;
  l.hidden = !open; b.setAttribute('aria-expanded', open);
  if(open){ const cur = l.querySelector('[aria-selected="true"]') || l.firstElementChild; cur.focus(); cur.scrollIntoView({block:'nearest'}); }
}
function ccPick(id){
  ME.cc = id; ME.phone = phoneFormat(($('#phone')||{}).value || ME.phone, id);
  O.phoneTouched = false; renderOnb();
  const p = $('#phone'); if(p) p.focus();
}

/* ============================================================
   Photos — profil (tous) et couverture (projet d'un visionnaire)
   ============================================================ */
function uploader(kind){
  const cover = kind === 'cover', src = cover ? ME.project.cover : ME.photo;
  const title = cover ? 'Couverture du projet' : 'Photo de profil';
  const help = cover
    ? "Format paysage, idéalement 1600 × 900 px. Elle s'affiche en tête de ta fiche projet."
    : "JPG, PNG ou WebP, 5 Mo maximum. Elle reste floutée pour les autres jusqu'au match.";
  return '<div class="up up-'+kind+(src ? ' has' : '')+'" data-drop="'+kind+'">'
    + '<label class="up-zone" for="f_'+kind+'"'+(src ? ' style="background-image:url('+src+')"' : '')+'>'
    +   (src ? '<span class="sr">'+title+' ajoutée</span>' : '<span class="up-in">'+ic('camera')+'<span>'+(cover ? 'Glisse une image ici' : 'Ta photo')+'</span></span>')
    + '</label>'
    + '<input type="file" class="sr" id="f_'+kind+'" accept="image/png,image/jpeg,image/webp" data-up="'+kind+'" aria-label="'+title+'">'
    + '<div class="up-meta"><b>'+title+'<span class="req" aria-hidden="true">*</span></b><p class="hint">'+esc(help)+'</p>'
    +   '<div class="row"><label class="btn btn-ghost btn-sm" for="f_'+kind+'">'+ic('image')+(src ? 'Changer' : 'Choisir une image')+'</label>'
    +   (src ? '<button class="btn btn-quiet btn-sm" data-act="up-clear" data-k="'+kind+'">Retirer</button>' : '')
    + '</div></div></div>';
}
function photoFields(){ return uploader('photo'); }
/* L'image est réduite avant d'être gardée : une photo de téléphone
   pèse 4 Mo, la fiche n'en a besoin que d'une fraction. */
function takeFile(kind, file){
  if(!file) return;
  if(!/^image\/(png|jpe?g|webp)$/.test(file.type)){ toast('Choisis une image JPG, PNG ou WebP.', 'bad'); return; }
  if(file.size > 5*1024*1024){ toast('Cette image dépasse 5 Mo.', 'bad'); return; }
  const r = new FileReader();
  r.onload = () => {
    const img = new Image();
    img.onload = () => {
      /* Couverture : 1200 px de large au plus. Profil : 600 px de côté au plus. */
      const k = kind === 'cover' ? Math.min(1, 1200 / img.width) : Math.min(1, 600 / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width*k); c.height = Math.round(img.height*k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      setPhoto(kind, c.toDataURL('image/jpeg', .86));
    };
    img.onerror = () => toast("Impossible de lire cette image.", 'bad');
    img.src = r.result;
  };
  r.readAsDataURL(file);
}
function setPhoto(kind, url){
  if(kind === 'cover') ME.project.cover = url; else ME.photo = url;
  if(D.on){ renderDash(); if($('#remind')) renderRemind(); return; }
  if(O.step === FICHE && kind === 'cover'){ const b = $('#coverBox'); if(b) b.innerHTML = coverBlock(); syncFiche(); return; }
  if(O.step === PHOTOS){ renderOnb(); }
}
/* Images d'exemple pour l'atelier : dessinées, jamais de vraie personne. */
function sampleImage(kind){
  const cover = kind === 'cover', c = document.createElement('canvas');
  c.width = cover ? 1600 : 600; c.height = cover ? 900 : 600;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, c.width, c.height);
  if(cover){ grad.addColorStop(0, '#FFD741'); grad.addColorStop(.55, '#8FC7A0'); grad.addColorStop(1, '#0A65AE'); }
  else { grad.addColorStop(0, '#3D9FE4'); grad.addColorStop(1, '#083F69'); }
  g.fillStyle = grad; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = 'rgba(250,249,245,.9)';
  if(cover){ for(let i=0;i<7;i++){ g.beginPath(); g.ellipse(160+i*210, 700-(i%3)*60, 70, 150, 0, 0, 7); g.fill(); } }
  else { g.beginPath(); g.arc(300, 250, 110, 0, 7); g.fill(); g.beginPath(); g.ellipse(300, 560, 200, 150, 0, 0, 7); g.fill(); }
  return c.toDataURL('image/jpeg', .86);
}
function syncPreview(){
  const box = $('#prevBox'); if(box) box.innerHTML = previewCard();
  const pr = $('#prevRing'); if(pr) pr.innerHTML = ringHTML(completion(), 62);
  if(O.step === PHOTOS && !O.sending) onbEnable(!photosMissing());
}

/* ============================================================
   « Publier ma fiche » grisé : on dit pourquoi, discrètement
   ============================================================ */
function listFr(a){
  if(a.length <= 1) return a.join('');
  return a.slice(0,-1).join(', ') + ' et ' + a[a.length-1];
}
function showWhy(go){
  const w = $('#why'); if(!w) return;
  const rows = ruleRows().filter(r => !r.ok && !r.opt);
  if(!rows.length){ w.hidden = true; return; }
  const first = rows[0], rest = rows.slice(1).map(r => r.phrase);
  const txt = first.label + ' : ' + first.msg + (rest.length ? ' Il reste aussi ' + listFr(rest) + '.' : '');
  w.innerHTML = ic('info') + '<div><b>Pour publier, complète les sections en rouge.</b>'
    + '<span>'+esc(txt)+'</span></div>'
    + '<button class="why-x" data-act="why-close" aria-label="Masquer la note">'+ic('x')+'</button>';
  if(w.hidden){ w.hidden = false; w.classList.remove('in'); void w.offsetWidth; w.classList.add('in'); }
  if(go) goToMissing();
}
function hideWhy(){ const w = $('#why'); if(w) w.hidden = true; }
/* Clic sur « Publier ma fiche » grisé : on amène la première section
   obligatoire manquante au centre, on la fait briller et on y place le focus. */
function goToMissing(){
  const k = firstMissingKey(); if(!k) return;
  const ctl = $('#ficheForm [data-k="'+k+'"]'); if(!ctl) return;
  const sec = ctl.closest('.fsec') || ctl;
  sec.scrollIntoView({behavior:'smooth', block:'center'});
  sec.classList.remove('flash'); void sec.offsetWidth; sec.classList.add('flash');
  clearTimeout(sec._fl); sec._fl = setTimeout(() => sec.classList.remove('flash'), 2000);
  const f = $$('#ficheForm [data-k="'+k+'"]').find(el => !el.disabled) || ctl;
  f.focus({preventScroll:true});
}

/* ============================================================
   Tableau de bord — aperçu simplifié, pour le rappel des photos
   Le vrai tableau de bord vit dans le prototype ; ici, il ne sert
   qu'à montrer l'arrivée et la fenêtre de rappel.
   ============================================================ */
const D = {on:false, timer:null};
const REMIND_AGAIN = 60 * 1000;   /* le rappel revient une minute après « Plus tard » */
function openDash(){
  O.step = 0;
  const r = $('#onb'); r.innerHTML = ''; delete r.dataset.built; r.hidden = true;
  $('#closed').hidden = true;
  document.documentElement.setAttribute('data-role', ME.role);
  D.on = true; renderDash(); $('#dash').hidden = false; syncWb();
  clearTimeout(D.timer);
  if(photosMissing()) D.timer = setTimeout(openRemind, 900);
}
function closeDash(){
  D.on = false; clearTimeout(D.timer);
  const d = $('#dash'); if(d){ d.hidden = true; d.innerHTML = ''; }
  const m = $('#remind'); if(m) m.remove();
}
function renderDash(){
  const vis = ME.role === 'vis', pct = completion();
  const miss = !ME.photo ? ['ta photo de profil'] : [];
  const av = ME.photo ? '<span class="dash-av" style="background-image:url('+ME.photo+')" role="img" aria-label="Ta photo"></span>'
                      : '<span class="dash-av" aria-hidden="true">'+esc(initials(myName()))+'</span>';
  $('#dash').innerHTML = '<header class="dash-top">'
    + brandHTML()
    + '<span class="grow"></span><span class="chip">Aperçu simplifié</span>' + av + '</header>'
    + '<main class="dash-in">'
    +   '<div class="dash-h"><h1>Bonjour <span class="acc">'+esc(ME.first || 'à toi')+'</span></h1><p>Prêt à co-créer la prochaine success story africaine ?</p></div>'
    +   (miss.length ? '<div class="card nudge"><span class="tile" aria-hidden="true">'+ic('camera')+'</span>'
          + '<div class="grow"><b>Il manque '+esc(listFr(miss))+'</b><p class="hint">Une fiche avec de vraies photos inspire plus confiance — c\'est ce qui maximise tes chances de match.</p></div>'
          + '<button class="btn btn-a" data-act="remind-open">'+ic('camera')+'Ajouter</button></div>' : '')
    +   '<div class="stats">'
    +     '<div class="card card-pad stat"><div class="lbl">Vues de fiche</div><div class="v tnum">0</div><p class="hint">Ta fiche vient d\'être publiée.</p></div>'
    +     '<div class="card card-pad stat"><div class="lbl">Invitations</div><div class="v tnum">0</div><p class="hint">Aucune pour l\'instant. Chacune expire au bout de <span class="mono">10</span> jours.</p></div>'
    +     '<div class="card card-pad stat"><div class="lbl">Messages</div><div class="v tnum">0</div><p class="hint">Ils s\'ouvrent après un match.</p></div>'
    +   '</div>'
    +   '<div class="card card-pad fiche-c">'+ringHTML(pct, 72)+'<div><div class="lbl">'+(vis ? 'Mes fiches' : 'Ma fiche Talent')+'</div>'
    +     '<div style="font-family:var(--disp);font-size:20px;font-weight:600;margin-top:2px">'+(vis && ME.project.title ? esc(ME.project.title) : 'En ligne')+'</div>'
    +     '<div style="margin-top:4px"><span class="handle-chip">'+esc(myHandle())+'</span></div></div></div>'
    + '</main>';
}
function openRemind(){
  if(!D.on || !photosMissing() || $('#remind')) return;
  const el = document.createElement('div');
  el.className = 'ov'; el.id = 'remind';
  document.body.appendChild(el);
  renderRemind();
  requestAnimationFrame(() => el.classList.add('on'));
  const f = el.querySelector('.ov-win input, .ov-win button'); if(f) try{ f.focus({preventScroll:true}); }catch(e){}
}
function renderRemind(){
  const el = $('#remind'); if(!el) return;
  const vis = ME.role === 'vis';
  if(!photosMissing()){
    el.innerHTML = '<div class="ov-bg"></div><div class="ov-win" role="dialog" aria-modal="true" aria-labelledby="remT"><div class="ov-ok">'
      + '<div class="okc" aria-hidden="true">'+ic('check')+'</div><h2 class="ov-t" id="remT">C\'est fait</h2>'
      + '<p class="ov-s">Ta photo est en ligne. Ta fiche est prête à convaincre.</p>'
      + '<button class="btn btn-a" data-act="remind-close">Revenir au tableau de bord</button></div></div>';
    const b = el.querySelector('.btn'); if(b) b.focus();
    return;
  }
  const title = 'Ajoute ta photo de profil';
  el.innerHTML = '<div class="ov-bg" data-act="remind-later"></div>'
    + '<div class="ov-win" role="dialog" aria-modal="true" aria-labelledby="remT">'
    + '<button class="iconbtn ov-x" data-act="remind-later" aria-label="Plus tard">'+ic('x')+'</button>'
    + '<h2 class="ov-t" id="remT">'+title+'</h2>'
    + '<p class="ov-s">Une fiche sans photo inspire moins confiance et retient moins l\'attention. '
    +   (vis ? 'Une vraie photo rassure un talent avant qu\'il accepte ton invitation' : 'Une vraie photo professionnelle rassure un visionnaire avant qu\'il t\'invite')
    +   ' : c\'est important pour maximiser tes chances de match.</p>'
    + '<div class="col" style="gap:18px">' + uploader('photo') + '</div>'
    + '<div class="rem-f"><button class="btn btn-quiet" data-act="remind-later">Plus tard</button></div>'
    + '</div>';
}
function remindLater(){
  const el = $('#remind'); if(el) el.remove();
  clearTimeout(D.timer);
  if(D.on && photosMissing()) D.timer = setTimeout(openRemind, REMIND_AGAIN);
}
function remindClose(){ const el = $('#remind'); if(el) el.remove(); renderDash(); }

/* ---------- Notifications (§5.10) ---------- */
function toast(msg, kind){
  const box = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast ' + (kind || '');
  el.innerHTML = ic(kind === 'bad' ? 'alert' : kind === 'ok' ? 'check' : 'info') + '<span>'+esc(msg)+'</span>';
  box.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 3200);
}

/* ============================================================
   Exemples de démonstration — ancrés au Bénin (§7)
   ============================================================ */
function fillIdentity(){
  if(!ME.first){ ME.first = 'Koffi'; ME.last = 'Adjovi'; ME.cityCc = 'BJ'; ME.city = 'Cotonou, Bénin'; }
  if(!ME.sex) ME.sex = 'm';
}
function fillHandle(){
  if(handleState(ME.handle).k !== 'ok') ME.handle = (ME.role === 'tal' ? 'code_sous_manguier' : 'vallee_oueme');
}
function fillFiche(){
  if(ME.role === 'tal'){
    Object.assign(ME, {skills:['dev-mobile','dev-back'], level:'inter', diploma:'licence', status:'freelance',
      sectors:['agritech','fintech'], pace:'serieux',
      bio:"Développeur Flutter et Node depuis 5 ans. J'ai livré une app de collecte pour 3 coopératives de l'Ouémé, pensée pour la 3G et le hors-ligne. Je cherche un projet agri ou paiement où le mobile est le cœur du produit.",
      portfolioTitle:'GitHub', portfolio:'github.com/code-sous-manguier'});
  } else {
    Object.assign(ME.project, {title:'Wémè Irrigation', sectors:['agritech','greentech'], seeking:['dev-mobile','terrain','finance'],
      hook:"Dans la vallée de l'Ouémé, un maraîcher perd un tiers de sa récolte de saison sèche faute d'eau au bon moment. Wémè loue des pompes solaires à l'heure, payées par MTN MoMo.",
      vision:"Que chaque maraîcher de la vallée irrigue à la demande, sans acheter de pompe ni brûler de gasoil.",
      traction:"12 pompes en service à Adjohoun, 86 maraîchers abonnés, 2,4 M FCFA encaissés depuis mars.",
      challenges:"Le suivi des pompes se fait sur un cahier. Il me faut un cofondateur mobile et quelqu'un pour tenir le terrain.",
      link:'weme-irrigation.bj', offer:'mixte', icon:'agritech'});
    ME.pace = 'serieux';
  }
}

function fillPerso(){
  Object.assign(ME.perso, {skills:['terrain','vente','finance'], level:'expert',
    bio:"Ingénieur agronome, douze ans dans les coopératives de l'Ouémé. J'ai recruté un par un les 86 maraîchers de Wémè. Je sais vendre et tenir le terrain ; il me manque celui qui construit l'outil.",
    portfolio:'linkedin.com/in/vallee-oueme'});
}

/* ============================================================
   Atelier de travail (hors produit)
   ============================================================ */
const WB_STEPS = [
  ['1a','1 · Compte — e-mail'], ['1b','1 · Compte — code'], ['1c','1 · Compte — téléphone'], ['1d','1 · Compte — mot de passe'],
  ['2','2 · Le pacte'], ['3','3 · Ton rôle'], ['4','4 · Ton identité'], ['5','5 · Ton pseudo'], ['6','6 · Ta fiche'],
  ['7','7 · Ta fiche perso (visionnaire)'], ['8','Ta photo (7 ou 8)'], ['9','Prêt'], ['dash','Tableau de bord + rappel'],
];
let wbRole = 'tal';
function jumpTo(key){
  if(key === 'dash'){
    if(!O.roleSel) O.roleSel = wbRole;
    ME.role = O.roleSel; fillIdentity(); fillHandle();
    if(!ficheReady()) fillFiche();
    openDash(); return;
  }
  if(D.on) closeDash();
  if(!O.step){ openOnb({role:O.roleSel || undefined}); }
  O.sending = false;
  let n = parseInt(key, 10);
  if(n === 1){
    O.step = 1; O.login = false;
    if(key === '1a') O.sub = 'choose';
    else { if(!identOk(O.ident)) O.ident = 'koffi.adjovi@exemple.com'; O.sub = {'1b':'code','1c':'phone','1d':'pwd'}[key]; }
  } else {
    if(n >= 4 && !O.roleSel) O.roleSel = wbRole;
    if(O.roleSel) ME.role = O.roleSel;
    if(n >= 2) O.pactOk = O.pactOk || n > 2;
    if(n >= 5) fillIdentity();
    if(n >= 6) fillHandle();
    if(n >= PERSO && !ficheReady()) fillFiche();
    if(n === PERSO && !isVisPath()) n = PHOTOS;
    O.step = n;
  }
  O.sugg = null; O._art = null;
  renderOnb();
}
function setRole(r){
  wbRole = r;
  if(O.step >= 3 || O.roleSel){ O.roleSel = r; ME.role = r; O.sugg = null; O._art = null; }
  if(O.step === PERSO && r !== 'vis') O.step = PHOTOS;
  if(O.step) renderOnb(); else syncWb();
}
function setTheme(t){ document.documentElement.setAttribute('data-theme', t); syncWb(); }
function curKey(){
  if(D.on) return 'dash';
  if(!O.step) return '';
  if(O.step === 1) return {choose:'1a', code:'1b', phone:'1c', pwd:'1d'}[O.sub];
  return String(O.step);
}
function syncWb(){
  const sel = $('#wbStep'); if(sel) sel.value = curKey();
  const role = O.roleSel || wbRole;
  $$('[data-wb-role]').forEach(b => b.setAttribute('aria-pressed', b.dataset.wbRole === role));
  const th = document.documentElement.getAttribute('data-theme');
  $$('[data-wb-theme]').forEach(b => b.setAttribute('aria-pressed', b.dataset.wbTheme === th));
}
function buildWb(){
  const w = $('#wb');
  w.innerHTML = '<button class="wb-t" data-act="wb-toggle" aria-expanded="true" aria-controls="wbP" aria-label="Atelier de travail" title="Atelier de travail">'+ic('tools')+'</button>'
    + '<div class="wb-p" id="wbP" role="region" aria-label="Atelier de travail">'
    + '<div class="hd"><b>Atelier</b><span class="hint">hors produit</span></div>'
    + '<div class="field"><label for="wbStep">Aller à l\'étape</label><select class="inp" id="wbStep"><option value="" disabled>Fenêtre fermée</option>'
    +   WB_STEPS.map(s => '<option value="'+s[0]+'">'+esc(s[1])+'</option>').join('') + '</select></div>'
    + '<div class="field"><label>Rôle</label><div class="wb-seg"><button data-wb-role="vis" data-act="wb-role">💡 Visionnaire</button><button data-wb-role="tal" data-act="wb-role">🛠️ Talent</button></div></div>'
    + '<div class="field"><label>Thème</label><div class="wb-seg"><button data-wb-theme="light" data-act="wb-theme">Clair</button><button data-wb-theme="dark" data-act="wb-theme">Sombre</button></div></div>'
    + '<div class="acts"><button class="btn btn-ghost btn-sm" data-act="wb-fill">'+ic('spark')+'Exemple</button><button class="btn btn-quiet btn-sm" data-act="wb-reset">'+ic('refresh')+'Recommencer</button></div>'
    + '</div>';
  /* Replié par défaut, sauf s'il tient à côté de la fenêtre sans la couvrir. */
  if(window.innerWidth < 1640){ $('#wbP').hidden = true; $('.wb-t').setAttribute('aria-expanded','false'); }
}

/* ============================================================
   Événements
   ============================================================ */
document.addEventListener('click', e => {
  const l = $('#ccList'); if(l && !l.hidden && !e.target.closest('.cc')) ccOpen(false);
  const cl = $('#cityList'); if(cl && !cl.hidden && !e.target.closest('.city-f')) cityList(false);
  const t = e.target.closest('[data-act]'); if(!t) return;
  const a = t.dataset.act;
  switch(a){
    case 'open-onb': openOnb({mode:t.dataset.mode, role:t.dataset.role}); break;
    case 'onb-go': onbGo(parseInt(t.dataset.to, 10)); break;
    case 'onb-back': onbBack(); break;
    case 'onb-close': if(!O.sending) closeOnb(); break;
    case 'onb-social': {
      const m = t.dataset.m;
      if(!O.ident) O.ident = 'compte.' + m + '@exemple.com';
      /* À l'inscription, Google ou Apple remplacent l'e-mail, le code et le
         mot de passe — pas le téléphone, qui reste demandé. */
      if(O.login){ O.step = 2; }
      else { O.social = m; O.sub = 'phone'; O.phoneTouched = false; }
      toast('Connecté avec ' + (m === 'google' ? 'Google' : 'Apple') + '.', 'ok');
      renderOnb(); break;
    }
    case 'onb-toggle-login': O.login = !O.login; O.sub = 'choose'; O.identTouched = false; renderOnb(); break;
    case 'onb-resend': O.code = ''; $$('.otp .inp').forEach(i => i.value = ''); syncCode(); $('#otp0').focus(); toast('Nouveau code envoyé.', 'ok'); break;
    case 'onb-edit-ident': O.sub = 'choose'; renderOnb(); break;
    case 'onb-optin': O.optin = !O.optin; t.setAttribute('aria-pressed', O.optin); break;
    /* Afficher / masquer le mot de passe sans perdre le curseur. */
    case 'onb-peek': {
      O.showPwd = !O.showPwd;
      const inp = $('#pwd');
      if(inp){ const pos = inp.selectionStart; inp.type = O.showPwd ? 'text' : 'password';
        try{ inp.focus({preventScroll:true}); inp.setSelectionRange(pos, pos); }catch(err){} }
      t.setAttribute('aria-pressed', O.showPwd);
      t.setAttribute('aria-label', (O.showPwd ? 'Masquer' : 'Afficher') + ' le mot de passe');
      t.title = O.showPwd ? 'Masquer' : 'Afficher';
      t.innerHTML = ic(O.showPwd ? 'eye-off' : 'eye');
      break;
    }
    /* Cocher ou choisir ne reconstruit pas l'étape : on bascule l'état
       sur place et on met à jour l'activation du bouton. */
    case 'onb-pact': O.pactOk = !O.pactOk; t.setAttribute('aria-pressed', O.pactOk); onbEnable(O.pactOk); break;
    case 'onb-role': {
      O.roleSel = t.dataset.r; ME.role = O.roleSel; wbRole = O.roleSel;
      document.documentElement.setAttribute('data-role', O.roleSel);
      $$('#onb .rp').forEach(f => f.setAttribute('aria-pressed', f.dataset.r === O.roleSel));
      $('.onb-card').classList.remove('pre');
      const main = $('#onbMain'); if(main){ main.classList.remove('btn-go'); main.classList.add('btn-a'); }
      onbEnable(true); syncWb();
      const hd = $('.onb-head'); if(hd) hd.innerHTML = onbNav(onbAction());
      break;
    }
    case 'onb-finish': openDash(); break;
    case 'perso-skip': if(!O.sending){ O.step = PHOTOS; renderOnb(); } break;
    case 'use-handle': { const hf = $('#handle'); if(hf) hf.value = t.dataset.h; syncHandle(); break; }
    case 'f-multi': {
      const k = t.dataset.k, v = t.dataset.v, cur = getPath(k) || [];
      if(k === 'p.sectors' && !cur.includes(v) && cur.length >= MAX_SECTORS){ toast('3 secteurs maximum.'); break; }
      if(k === 'x.skills' && !cur.includes(v) && cur.length >= PERSO_MAX_SKILLS){ toast('4 compétences maximum.'); break; }
      setPath(k, cur.includes(v) ? cur.filter(x=>x!==v) : cur.concat([v]));
      if(k === 'p.sectors' && ME.project.icon && !ME.project.sectors.includes(ME.project.icon)) ME.project.icon = '';
      syncFiche(); break;
    }
    case 'f-sex': ME.sex = t.dataset.v; checkIdentity(); break;
    case 'f-icon': if(!t.disabled){ ME.project.icon = t.dataset.v; syncFiche(); } break;
    case 'f-one': setPath(t.dataset.k, t.dataset.v); syncFiche(); break;
    case 'noop': e.preventDefault(); toast('Écran non inclus dans ce fichier.'); break;
    /* Atelier */
    case 'wb-toggle': { const p = $('#wbP'); p.hidden = !p.hidden; t.setAttribute('aria-expanded', !p.hidden); break; }
    case 'wb-role': setRole(t.dataset.wbRole); break;
    case 'wb-theme': setTheme(t.dataset.wbTheme); break;
    case 'wb-fill': {
      if(O.step === 1 && O.sub === 'choose'){ O.ident = 'koffi.adjovi@exemple.com'; renderOnb(); break; }
      if(O.step === 1 && O.sub === 'code'){ O.code = '482915'; renderOnb(); break; }
      if(O.step === 1 && O.sub === 'phone'){ ME.cc = 'BJ'; ME.phone = '01 97 45 22 10'; renderOnb(); break; }
      if(O.step === 1 && O.sub === 'pwd'){ O.pwd = 'Cotonou2026'; renderOnb(); break; }
      if(O.step === 2){ O.pactOk = true; renderOnb(); break; }
      if(O.step === 3){ O.roleSel = wbRole; ME.role = wbRole; renderOnb(); break; }
      if(O.step === 4){ ME.first = ''; fillIdentity(); renderOnb(); break; }
      if(O.step === 5){ ME.handle = ''; fillHandle(); renderOnb(); break; }
      if(O.step === FICHE){ fillFiche(); renderOnb(); break; }
      if(O.step === PERSO){ fillPerso(); renderOnb(); break; }
      if(O.step === PHOTOS || D.on){
        if(!ME.photo) ME.photo = sampleImage('photo');
        if(D.on){ renderDash(); if($('#remind')) renderRemind(); } else renderOnb();
        break;
      }
      toast('Rien à remplir sur cet écran.'); break;
    }
    case 'wb-reset': closeDash(); ME = structuredClone(DEFAULT_ME); O.ident = ''; O.roleSel = null; openOnb({}); break;
    /* Téléphone */
    case 'cc-open': ccOpen($('#ccList').hidden); break;
    case 'cc-pick': ccPick(t.dataset.cc); break;
    case 'city-pick': cityPick(t.dataset.v); { const c = $('#city'); if(c) c.focus(); } break;
    /* Photos */
    case 'up-clear': setPhoto(t.dataset.k, ''); break;
    case 'photos-later': openDash(); break;
    case 'why-close': hideWhy(); break;
    /* Tableau de bord */
    case 'remind-open': openRemind(); break;
    case 'remind-later': remindLater(); break;
    case 'remind-close': remindClose(); break;
  }
});
document.addEventListener('change', e => {
  if(e.target.id === 'cityCc'){
    ME.cityCc = e.target.value; ME.city = ''; O.cityTouched = false;
    const c = $('#city'); if(c){ c.value = ''; c.focus(); }
    cityList(false); checkIdentity(); return;
  }
  if(e.target.id === 'wbStep' && e.target.value) jumpTo(e.target.value);
  if(e.target.dataset && e.target.dataset.up){ takeFile(e.target.dataset.up, e.target.files[0]); e.target.value = ''; }
});
/* Glisser-déposer une image sur la zone. */
['dragenter','dragover'].forEach(ev => document.addEventListener(ev, e => {
  const z = e.target.closest && e.target.closest('[data-drop]'); if(!z) return;
  e.preventDefault(); z.classList.add('drag');
}));
['dragleave','drop'].forEach(ev => document.addEventListener(ev, e => {
  const z = e.target.closest && e.target.closest('[data-drop]'); if(!z) return;
  e.preventDefault(); z.classList.remove('drag');
  if(ev === 'drop' && e.dataTransfer.files[0]) takeFile(z.dataset.drop, e.dataTransfer.files[0]);
}));

/* ---------- Saisie ---------- */
document.addEventListener('input', e => {
  const el = e.target;
  if(el.dataset && el.dataset.k && el.type === 'checkbox'){
    setPath(el.dataset.k, el.checked);
    const sec = el.closest('.fsec');
    if(sec){ sec.dataset.touched = '1'; $$('input.inp', sec).forEach(i => { i.disabled = el.checked; }); }
    syncFiche(); return;
  }
  if(el.dataset && el.dataset.k){ setPath(el.dataset.k, el.value); syncFiche(); return; }
  if(el.id === 'ident'){ syncIdent(); return; }
  if(el.id === 'pwd'){ syncPwd(); return; }
  if(el.id === 'phone'){ syncPhone(); return; }
  if(el.id === 'handle'){ syncHandle(); return; }
  if(el.id === 'city'){ cityList(); checkIdentity(); return; }
  if(['first','last'].includes(el.id)){ checkIdentity(); return; }
  /* Code : un chiffre par case, on avance tout seul ; un collage remplit tout. */
  if(el.closest && el.closest('.otp')){
    const boxes = $$('.otp .inp'), i = boxes.indexOf(el);
    const digits = el.value.replace(/\D/g,'');
    if(digits.length > 1){
      digits.slice(0, 6 - i).split('').forEach((d,k) => { boxes[i+k].value = d; });
      boxes[Math.min(5, i + digits.length)].focus();
      syncCode(); otpAutoSubmit(); return;
    } else {
      el.value = digits;
      if(digits && i < 5) boxes[i+1].focus();
    }
    syncCode();
  }
});
/* Code collé (Ctrl+V, clic droit, presse-papiers du téléphone) : les 6 chiffres
   se répartissent dans les cases, quelle que soit la case choisie, puis le code part tout seul. */
function otpAutoSubmit(){
  if(O.code.length !== 6 || O.sending) return;
  const b = $('#onbMain'); if(b && !b.disabled) setTimeout(() => { if(O.code.length === 6 && !O.sending) b.click(); }, 150);
}
document.addEventListener('paste', e => {
  const el = e.target; if(!(el && el.closest && el.closest('.otp'))) return;
  const txt = ((e.clipboardData || window.clipboardData) && (e.clipboardData || window.clipboardData).getData('text')) || '';
  const digits = txt.replace(/\D/g,'');
  if(!digits) { e.preventDefault(); return; }
  e.preventDefault();
  const boxes = $$('.otp .inp');
  const start = digits.length >= 6 ? 0 : boxes.indexOf(el);
  digits.slice(0, 6 - start).split('').forEach((d,k) => { boxes[start+k].value = d; });
  boxes[Math.min(5, start + digits.length - 1)].focus();
  syncCode(); otpAutoSubmit();
});
/* On ne corrige pas quelqu'un qui est encore en train d'écrire. */
document.addEventListener('focusout', e => {
  if(!e.target) return;
  if(e.target.id === 'pwd'){ O.pwdTouched = true; syncPwd(); }
  if(e.target.id === 'ident'){ O.identTouched = true; syncIdent(); }
  if(e.target.id === 'phone'){ O.phoneTouched = true; syncPhone(); }
  if(e.target.id === 'city'){
    setTimeout(() => {
      const a = document.activeElement; if(a && a.closest && a.closest('.city-f')) return;
      if(($('#city') || {}).value){ O.cityTouched = true; checkIdentity(); }
      cityList(false);
    }, 120);
  }
  /* Fiche : une case quittée avec du texte est « touchée » ; son erreur peut s'afficher. */
  const sec = e.target.closest && e.target.closest('#ficheForm .fsec, #persoForm .fsec');
  if(sec && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') && e.target.type !== 'checkbox' && String(e.target.value || '').trim()){
    sec.dataset.touched = '1'; e.target.dataset.touched = '1'; syncFiche();
  }
}, true);
document.addEventListener('keydown', e => {
  const t = e.target;
  /* Fenêtre de rappel du tableau de bord. */
  if($('#remind')){
    if(e.key === 'Escape'){ e.preventDefault(); if(photosMissing()) remindLater(); else remindClose(); }
    else if(e.key === 'Tab') trapTab(e, $('#remind .ov-win'));
    return;
  }
  if(!O.step) return;
  /* Liste des pays : flèches, Entrée, Échap. */
  /* Ville : flèches pour parcourir la liste, Entrée pour choisir, Échap pour fermer. */
  if(t.id === 'city' || (t.closest && t.closest('#cityList'))){
    const items = $$('#cityList li'), i = items.indexOf(t), open = !$('#cityList').hidden;
    if(e.key === 'ArrowDown'){ e.preventDefault(); if(!open) cityList(); const it = $$('#cityList li'); (it[i+1] || it[0] || {focus(){}}).focus(); return; }
    if(e.key === 'ArrowUp' && i > -1){ e.preventDefault(); (items[i-1] || $('#city')).focus(); return; }
    if(e.key === 'Escape' && open){ e.preventDefault(); cityList(false); $('#city').focus(); return; }
    if(e.key === 'Enter' && i > -1){ e.preventDefault(); cityPick(t.dataset.v); $('#city').focus(); return; }
    if(e.key === 'Enter' && open && items[0] && !ME.city){ e.preventDefault(); cityPick(items[0].dataset.v); return; }
  }
  if(t.closest && t.closest('#ccList')){
    const items = $$('#ccList li'), i = items.indexOf(t);
    if(e.key === 'ArrowDown'){ e.preventDefault(); (items[i+1] || items[0]).focus(); }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); (items[i-1] || items[items.length-1]).focus(); }
    else if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); ccPick(t.dataset.cc); }
    else if(e.key === 'Escape' || e.key === 'Tab'){ e.preventDefault(); ccOpen(false); $('#ccBtn').focus(); }
    return;
  }
  if(t.closest && t.closest('.otp') && e.key === 'Backspace' && !t.value){
    const boxes = $$('.otp .inp'), i = boxes.indexOf(t);
    if(i > 0){ e.preventDefault(); boxes[i-1].value = ''; boxes[i-1].focus(); syncCode(); }
    return;
  }
  /* Entrée déclenche l'action principale de l'étape, où qu'on soit. */
  if(e.key === 'Enter' && (['ident','phone','pwd','first','last','city','handle'].includes(t.id) || (t.closest && t.closest('.otp')))){
    const b = $('#onbMain');
    if(b && !b.disabled){ e.preventDefault(); b.click(); }
    return;
  }
  if(t.closest && t.closest('#wb')) return;
  if(e.key === 'Escape'){ e.preventDefault(); if(!O.sending) closeOnb(); }
  else if(e.altKey && e.key === 'ArrowLeft'){ e.preventDefault(); onbBack(); }
  /* Tab tourne en boucle dans la fenêtre (§8.6). */
  else if(e.key === 'Tab') trapTab(e, $('.onb-wrap'));
});
function trapTab(e, box){
  if(!box) return;
  const f = $$('button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])', box)
    .filter(el => !el.disabled && el.getAttribute('tabindex') !== '-1' && (el.offsetParent !== null || el.classList.contains('sr')));
  if(!f.length) return;
  const first = f[0], last = f[f.length-1], cur = document.activeElement;
  if(!box.contains(cur)){ e.preventDefault(); (e.shiftKey ? last : first).focus(); }
  else if(e.shiftKey && cur === first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && cur === last){ e.preventDefault(); first.focus(); }
}

/* La carte de l'onboarding ne doit jamais défiler : seul son contenu défile. */
document.addEventListener('scroll', e => { const c = e.target; if(c && c.classList && c.classList.contains('onb-card') && c.scrollTop) c.scrollTop = 0; }, true);

/* ---------- Démarrage ---------- */
(function boot(){
  if(!document.documentElement.getAttribute('data-theme')){
    const dark = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }
  if(!window.TM_SHELL){
  buildWb();
  const q = new URLSearchParams(location.search).get('etape');
  if(q && WB_STEPS.some(s => s[0] === q)) jumpTo(q);
  else openOnb({});
  }
})();

"use strict";
/* ============================================================
   TakaMatch — passerelle onboarding ↔ coquille
   Dans TakaMatch.html, l'onboarding est un calque posé sur la
   vitrine (DESIGN §8) : il s'ouvre sur demande, se referme vers
   la vitrine et, une fois la fiche publiée, ouvre l'outil avec
   le compte qui vient d'être créé.
   ============================================================ */
(function(){
  if(!window.TM_SHELL) return;
  const post = m => { try{ parent.postMessage(Object.assign({tm:1}, m), '*'); }catch(e){} };
  let DONE = false;

  /* Liens « #… » : jamais de navigation dans le cadre. */
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]'); if(a) e.preventDefault();
  }, true);

  function clearOnb(){
    O.step = 0;
    const r = $('#onb'); r.innerHTML = ''; delete r.dataset.built; r.hidden = true;
  }

  /* Fermer : retour à la vitrine, le parcours garde ce qui a été saisi. */
  closeOnb = function(){
    clearOnb();
    document.documentElement.removeAttribute('data-role');
    post({type:'onb-close'});
  };

  /* Fin du parcours d'inscription : le vrai tableau de bord prend le relais. */
  openDash = function(){
    const me = structuredClone(ME);
    me.dial = country(ME.cc).c;
    me.projIconGlyph = projIcon();
    clearOnb(); DONE = true;
    post({type:'onb-done', login:false, ident:O.ident, me});
  };

  /* Connexion : après le mot de passe, on entre directement dans l'outil. */
  function finishLogin(){
    const ident = O.ident;
    clearOnb(); DONE = true;
    post({type:'onb-done', login:true, ident});
  }
  const _auth = authStep;
  authStep = function(){
    if(O.step === 1 && O.sub === 'pwd' && O.login && authOk()){
      busy('Connecté', finishLogin); return;
    }
    _auth();
  };
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-act="onb-social"]'); if(!t || !O.login) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if(!O.ident) O.ident = 'compte.' + t.dataset.m + '@exemple.com';
    toast('Connecté avec ' + (t.dataset.m === 'google' ? 'Google' : 'Apple') + '.', 'ok');
    setTimeout(finishLogin, 500);
  }, true);

  /* Jauges : voir js/fiche-rules.js (mêmes règles que l'outil). */

  addEventListener('message', e => {
    const d = e.data; if(!d || !d.tm || e.source !== parent) return;
    if(d.type === 'theme'){ document.documentElement.setAttribute('data-theme', d.v); return; }
    if(d.type === 'close'){ if(O.step){ O.step = 0; const r = $('#onb'); r.innerHTML = ''; delete r.dataset.built; r.hidden = true; document.documentElement.removeAttribute('data-role'); } return; }
    if(d.type === 'open'){
      if(DONE){
        ME = structuredClone(DEFAULT_ME);
        Object.assign(O, {ident:'', roleSel:null, code:'', pwd:'', pactOk:false, social:null, tried:false});
        DONE = false;
      }
      const c = (d.contact || '').trim();
      if(c && isMail(c)) O.ident = c;
      else if(c && isPhone(c)){ ME.cc = 'BJ'; ME.phone = c.replace(/^\+?229[\s.]*/, '').trim(); }
      openOnb({mode:d.mode === 'login' ? 'login' : undefined, role:d.role === 'vis' || d.role === 'tal' ? d.role : undefined});
      /* L'adresse vient d'être saisie sur la vitrine : on passe à la suite. */
      if(c && isMail(c)){ O.sub = O.login ? 'pwd' : 'code'; renderOnb(); }
      setTimeout(() => {
        const f = document.querySelector('#onb input:not([type=file]), #onb .btn-a, #onb .btn-go');
        if(f) try{ f.focus({preventScroll:true}); }catch(err){}
      }, 80);
    }
  });
  post({type:'ready'});
})();
