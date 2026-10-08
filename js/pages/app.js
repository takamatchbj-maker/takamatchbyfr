"use strict";
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
  /* Badge de vérification : l'icône officielle (pleine), partout où il est question de vérifier un profil. */
  if(n === 'verif') return '<svg class="ic ic-verif '+(cls||'')+'" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="'+VB_PATH+'"/></svg>';
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
const PAY = [
  {id:'equity', l:'Parts uniquement', h:"Je m'engage contre des parts au capital"},
  {id:'mixte', l:'Parts + petite rémunération', h:'Un défraiement suffit pour commencer'},
  {id:'paye', l:'Rémunération nécessaire', h:"Je ne peux pas travailler sans revenu"},
];
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
const refL = (list, id) => (list.find(x => x.id === id) || {l:'—'}).l;
const AVAIL = [{id:'dispo',l:'Disponible'},{id:'limite',l:'Disponibilité limitée'},{id:'non',l:'Indisponible'}];

/* ---------- Annuaire ----------
   Rempli depuis la base au démarrage (js/pages/app-db.js). */
const TALENTS = [];

const PROJECTS = [];

/* ---------- État ---------- */
const DEFAULT_ME = {
  first:'', last:'', email:'', handle:'', city:'Cotonou, Bénin', role:'tal', avatarHue:205,
  skills:[], sectors:[], level:'', diploma:'', status:'',
  pace:'serieux',
  bio:'', portfolio:'', portfolioTitle:'',
  /* Un visionnaire garde aussi un profil de talent : hors de son projet,
     il a des compétences que l'on peut chercher. */
  talentOn:false, talentPromptSeen:false,
  project:{title:'', sectors:[], seeking:[], hook:'', vision:'', traction:'', assets:'', challenges:'', link:'', glyph:'💡'},
  online:true, verifiedEmail:true, verifiedPhone:false, verifiedId:false, refs:0,
  credits:3, creditsMax:5,
};
const S = {
  booted:false, view:'accueil', tab:'decouvrir', mode:'mosaic', ficheTab:'projet',
  me:structuredClone(DEFAULT_ME),
  q:'', filterSkill:'', filterSector:'', sortBy:'score',
  favs:new Set(), invitesSent:[], invitesRecv:[], matches:[], threads:[], notifs:[],
  activeThread:null, focusIdx:0, sideOpen:false, layer:null, typing:false,
  atelier:{
    equity:[{n:'Toi', v:55, me:true},{n:'—', v:45, me:false}],
    vesting:'4 ans, 1 an de cliff',
    milestones:[
      {t:"Se parler 45 minutes en visio", s:"Avant tout engagement", done:true},
      {t:"Écrire le problème en une phrase, chacun de son côté", s:"Puis comparer — c'est là que les malentendus sortent", done:true},
      {t:"Définir qui décide quoi", s:"Produit, technique, argent : un seul responsable par domaine", done:false},
      {t:"Fixer la répartition du capital et le vesting", s:"Par écrit, avant la première ligne de code commune", done:false},
      {t:"Travailler 2 semaines ensemble sur un livrable réel", s:"La période d'essai que personne ne fait", done:false},
      {t:"Signer le pacte d'associés", s:"Devant un juriste OHADA", done:false},
    ],
    log:[],
  },
  demoMin:0,
};

/* ---------- Score de compatibilité (explicable) ----------
   Un score opaque ne crée pas de confiance. Celui-ci se décompose
   toujours en 5 lignes lisibles par l'utilisateur.               */
function paceHrs(id){ return (PACE.find(p=>p.id===id)||PACE[1]).hrs; }
function payFit(a, b){
  if(a === b) return 1;
  if(a === 'mixte' || b === 'mixte') return .6;
  return 0; /* equity pur contre rémunération obligatoire : incompatible */
}
function cityOf(s){ return (s||'').split(',').map(x=>x.trim()); }




const scoreOf = (item) => S.me.role === 'tal' ? scoreProject(item, S.me) : scoreTalent(item, S.me);
const pool = () => S.me.role === 'tal' ? PROJECTS : TALENTS;

/* ---------- Complétion de fiche ---------- */

const myName = () => (S.me.first+' '+S.me.last).trim() || 'Toi';
/* Le pseudo est l'identifiant public : il remplace l'ancien matricule
   TM-TAL-… / TM-VIS-… partout où une fiche est affichée. */
/* ---------- Couleur de sujet ----------
   Une fiche porte la couleur du rôle de celui qu'elle décrit, pas une
   teinte tirée de son secteur : un talent est bleu, un visionnaire est
   or. La variation d'une fiche à l'autre reste dans la famille — trois
   profondeurs et cinq angles, dérivés de l'ancienne teinte. */
const TINT_STEP = ['soft', '', 'deep'];
function tintCls(role, seed){
  const k = Math.abs(Math.round(seed || 0));
  const fam = role === 'vis' ? 'tint-vis' : 'tint-tal';
  return 'tint ' + fam + (TINT_STEP[k % 3] ? ' ' + TINT_STEP[k % 3] : '');
}
function tintAng(seed){
  return '--ta:' + (116 + (Math.abs(Math.round(seed || 0)) % 5) * 13) + 'deg;';
}
/* Un projet appartient à un visionnaire ; une fiche sans projet est un talent. */
const roleOf = x => (x && (x.title || x.ownerHandle || x.hook)) ? 'vis' : 'tal';

const handleOf = x => '@' + (x.handle || x.ownerHandle || 'anonyme');
const myHandle = () => '@' + (S.me.handle || 'ton_pseudo');
const HANDLE_RE = /^[a-z0-9_]{3,20}$/;
const RESERVED = ['admin','takamatch','taka','support','equipe','contact','moderation','aide'];
function handleTaken(h){
  const all = TALENTS.map(t=>t.handle).concat(PROJECTS.map(p=>p.ownerHandle));
  return all.includes(h) || RESERVED.includes(h);
}
function handleState(h){
  if(!h) return {k:'empty', msg:'Trois caractères minimum.'};
  if(!HANDLE_RE.test(h)) return {k:'bad', msg:'Lettres minuscules, chiffres et tirets bas. De 3 à 20 caractères.'};
  if(handleTaken(h)) return {k:'taken', msg:'Ce pseudo est déjà pris.'};
  return {k:'ok', msg:'Disponible.'};
}
function slugify(v){
  return (v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9_]/g,'_').replace(/_+/g,'_').slice(0,20);
}
/* Les suggestions ne partent jamais du vrai nom : ce serait révéler
   exactement ce que le pseudo est censé protéger. */
function suggestHandles(){
  const city = slugify((S.me.city||'').split(',')[0]) || 'cotonou';
  const words = S.me.role === 'tal'
    ? ['atelier','artisan','builder','nocturne']
    : ['porteur','fondation','chantier','premiere'];
  const n = () => 10 + Math.floor(Math.random()*89);
  const out = [city+'_'+words[0], words[1]+'_'+n(), words[2]+'_'+city, words[3]+'_'+n()];
  return out.map(slugify).filter(h => handleState(h).k === 'ok').slice(0,3);
}
const roleLabel = r => r === 'tal' ? 'Talent' : 'Visionnaire';
function toast(msg, kind){
  const el = document.createElement('div');
  el.className = 'toast '+(kind||'');
  el.innerHTML = (kind==='ok'?ic('check'):kind==='bad'?ic('alert'):ic('info'))+'<span>'+esc(msg)+'</span>';
  $('#toasts').appendChild(el);
  setTimeout(()=>{ el.classList.add('out'); setTimeout(()=>el.remove(), 320); }, 3000);
}
/* ---------- Confettis ---------- */
function confetti(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.createElement('canvas');
  cv.className = 'confetti';
  const dpr = Math.min(window.devicePixelRatio||1, 2);
  cv.width = innerWidth*dpr; cv.height = innerHeight*dpr;
  cv.style.width = innerWidth+'px'; cv.style.height = innerHeight+'px';
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
  const cols = ['#FFD741','#007CD8','#FFE890','#95C8EF','#0E9F6E','#E5A800'];
  const parts = Array.from({length:110}, () => ({
    x: innerWidth/2 + (Math.random()-.5)*220, y: innerHeight*0.42,
    vx:(Math.random()-.5)*10, vy:-Math.random()*13-4,
    s:4+Math.random()*6, r:Math.random()*Math.PI, vr:(Math.random()-.5)*.28,
    c:cols[(Math.random()*cols.length)|0], life:0,
  }));
  let raf;
  (function loop(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    let alive = 0;
    parts.forEach(p => {
      p.life++; p.vy += .34; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vx *= .995;
      if(p.y < innerHeight + 40) alive++;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.globalAlpha = Math.max(0, 1 - p.life/135);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s/2, -p.s/2, p.s, p.s*.62); ctx.restore();
    });
    if(alive > 0) raf = requestAnimationFrame(loop);
    else { cancelAnimationFrame(raf); cv.remove(); }
  })();
}

/* ---------- Compteurs animés ---------- */
function countUp(){
  $$('[data-count]').forEach(el => {
    const to = parseInt(el.dataset.count, 10); if(isNaN(to) || to === 0) return;
    const dur = 700, t0 = performance.now();
    (function step(t){
      const k = Math.min(1, (t - t0)/dur);
      el.textContent = Math.round(to * (1 - Math.pow(1-k, 3)));
      if(k < 1) requestAnimationFrame(step);
    })(t0);
  });
}

/* ============================================================
   Dashboard v2 — l'outil seul, sans vitrine ni onboarding.
   On arrive connecté, avec un compte de démonstration rempli :
   chaque module a de la matière à éditer.
   ============================================================ */
Object.assign(P, {
  more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  archive:'<rect x="3" y="4" width="18" height="4.5" rx="1.4"/><path d="M5 8.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V8.5"/><path d="M10 12.5h4"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  ticks:'<path d="m2 12.5 4.5 4.5L15 7.5"/><path d="m10.5 16.5.5.5L21.5 7"/>',
});

/* ---------- Le compte de démonstration ---------- */
const DEMO_ME = structuredClone(DEFAULT_ME);
S.me = structuredClone(DEMO_ME);
Object.assign(S, {
  invFilter:'all', showArch:false, loading:false, atelierId:null, ateliers:{},
  prefs:{inv:true, msg:true, match:true, weekly:false, sms:false},
  payments:[],
  reported:new Set(), likes:new Set(), fv:null,
});

/* ---------- Petits outils ---------- */
const GLYPHS = ['💡','🪙','🩺','💳','🌱','📚','🚚','🛍️','🏘️','🌍','🎬','🧰','🎨','🤝','☀️','🛰️'];
const maskName = n => String(n||'').split(/\s+/).filter(Boolean).map(w => '*'.repeat(clamp(w.length,4,7))).join(' ');
const MOIS = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
function fmtDate(d){ return d.getDate()+' '+MOIS[d.getMonth()]+' · '+hhmm(d); }
function daysAgo(n, h, m){ const d = new Date(); d.setDate(d.getDate()-n); if(h!=null) d.setHours(h, m||0, 0, 0); return d; }
function firstName(n){ return String(n||'').replace(/^Dr\.\s*/,'').split(/\s+/)[0] || n; }
const isTalMode = () => S.me.role === 'tal';
/* Index par identifiant (l'équivalent d'un index de base de données) :
   reconstruit seulement si la liste change de taille. */
const ITEM_IDX = new WeakMap();
const itemById = id => { const arr = pool(); let ix = ITEM_IDX.get(arr);
  if(!ix || ix.n !== arr.length){ ix = {n:arr.length, m:new Map(arr.map(x => [x.id, x]))}; ITEM_IDX.set(arr, ix); }
  return ix.m.get(id) || {}; };
function partnerOf(x){ return isTalMode() ? x.owner : x.name; }
function titleOf(x){ return isTalMode() ? x.title : (isUnlocked(x.id) ? x.name : maskName(x.name)); }
function nameHTML(x){
  if(isTalMode()) return esc(x.title);
  return isUnlocked(x.id) ? esc(x.name) : '<span class="masked-name" aria-label="Nom masqué jusqu\'au match">'+esc(maskName(x.name))+'</span>';
}
function tick(){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 12.5 5 5 10-11"/></svg>'; }
function field(id, label, control, req){
  return '<div class="field"><label for="'+id+'">'+esc(label)+(req?'<span class="req">*</span>':'')+'</label>'+control+'</div>';
}
function note(kind, icon, html){ return '<div class="note '+(kind||'')+'">'+ic(icon)+'<span>'+html+'</span></div>'; }
function emptyBox(g, h, p, cta){
  return '<div class="empty"><div class="glyph" aria-hidden="true">'+g+'</div><h4>'+esc(h)+'</h4><p>'+esc(p)+'</p>'+(cta||'')+'</div>';
}
function scoreBar(n){
  const cls = n >= 70 ? 's-hi' : n >= 40 ? 's-mid' : 's-lo';
  return '<span class="score '+cls+'" title="Compatibilité '+n+' / 100"><span class="n tnum">'+n+'</span><span class="bar"><i style="width:'+n+'%"></i></span></span>';
}

/* Anneau de complétion : 118 px par défaut, trait de 10, dégradé bleu → or. */
function animateRings(){
  requestAnimationFrame(()=>{
    $$('.ring2 .fg').forEach(c=>{
      const off = c.getAttribute('stroke-dashoffset'), dash = c.getAttribute('stroke-dasharray');
      c.style.transition = 'none'; c.setAttribute('stroke-dashoffset', dash);
      requestAnimationFrame(()=>{ c.style.transition = ''; setTimeout(()=>c.setAttribute('stroke-dashoffset', off), 30); });
    });
  });
}

/* ---------- Le modèle de l'Atelier : un espace par équipe ---------- */
const MILESTONES = [
  {t:"Se parler 45 minutes en visio", s:"Avant tout engagement"},
  {t:"Écrire le problème en une phrase, chacun de son côté", s:"Puis comparer : c'est là que les malentendus sortent"},
  {t:"Définir qui décide quoi", s:"Produit, technique, argent : un seul responsable par domaine"},
  {t:"Fixer la répartition du capital et le vesting", s:"Par écrit, avant la première ligne de code commune"},
  {t:"Travailler 2 semaines ensemble sur un livrable réel", s:"La période d'essai que presque personne ne fait"},
  {t:"Signer le pacte d'associés", s:"Devant un juriste OHADA"},
];
const DOMAINS = [
  {id:'produit', l:'Produit'}, {id:'tech', l:'Technique'}, {id:'finance', l:'Finances et levée'}, {id:'terrain', l:'Terrain et ventes'},
];
const VESTING = ['4 ans, 1 an de cliff','3 ans, 6 mois de cliff','2 ans, sans cliff','Pas encore décidé'];

/* ---------- Données de démonstration : relations en cours ---------- */

/* ---------- Fiche : champs, aperçu, enregistrement ---------- */

const FICHE_KEYS = ['skills','sectors','level','diploma','status','avail','pace','pay','bio','portfolio','portfolioTitle','project'];



/* « p. » : la fiche projet active · « x. » : la fiche perso (distincte de la fiche Talent). */
function persoOf(m){ m = m || S.me; if(!m.perso) m.perso = {skills:[], level:'', bio:'', portfolio:'', portfolioTitle:'', noPortfolio:false}; return m.perso; }
function getPath(k){ return k.startsWith('p.') ? S.me.project[k.slice(2)] : k.startsWith('x.') ? persoOf()[k.slice(2)] : S.me[k]; }
function setPath(k, v){ if(k.startsWith('p.')) S.me.project[k.slice(2)] = v; else if(k.startsWith('x.')) persoOf()[k.slice(2)] = v; else S.me[k] = v; }
/* Deux fiches, deux contenus : on copie l'une dans l'autre au moment où la seconde naît, puis elles vivent séparément. */
const PERSO_KEYS = ['skills','level','bio','portfolio','portfolioTitle','noPortfolio'];
function copyPersoToTalent(m){ const x = persoOf(m); PERSO_KEYS.forEach(k => { m[k] = structuredClone(x[k]); }); }
function copyTalentToPerso(m){ const x = persoOf(m); PERSO_KEYS.forEach(k => { x[k] = structuredClone(m[k] == null ? (Array.isArray(x[k]) ? [] : '') : m[k]); }); }

function optBtn(act, key, val, label, pressed, radio, plain){
  return '<button type="button" class="opt'+(radio?' radio':'')+(plain?' opt-plain':'')+'" data-act="'+act+'" data-k="'+key+'" data-v="'+esc(val)+'" aria-pressed="'+(pressed?'true':'false')+'">'
    + '<span class="box">'+tick()+'</span><span>'+label+'</span></button>';
}
function optList(list, act, key, cur, cls, radio){
  const arr = Array.isArray(cur) ? cur : null;
  return '<div class="'+(cls||'opt-wrap')+'">'+list.map(o => optBtn(act, key, o.id, esc(o.l), arr ? arr.includes(o.id) : cur === o.id, radio, true)).join('')+'</div>';
}
function fsec(icon, label, req, body, help){
  return '<section class="fsec"><div class="fsec-l">'+esc(label)+(req?'<span class="req" aria-label="obligatoire">*</span>':'')+'</div>'
    + '<div class="fsec-b"><span class="fsec-i" aria-hidden="true">'+ic(icon)+'</span>'
    + '<div class="fsec-c">'+(help?'<p class="hint">'+esc(help)+'</p>':'')+body+'</div></div></section>';
}
/* Villes proposées : toutes celles du pays de la personne, au format « Ville, Pays » (js/geo.js). */
function cityDatalist(cur){
  const cc = TMGeo.split(cur).cc || S.me.country || 'BJ', c = TMGeo.country(cc);
  return '<datalist id="e3List">'+c.v.map(v => '<option value="'+esc(v+', '+c.n)+'">').join('')+'</datalist>';
}
function noneBox(key, on, label){
  return '<label class="none-chk"><input type="checkbox" data-k="'+key+'"'+(on ? ' checked' : '')+'><span>'+esc(label)+'</span></label>';
}
function area(id, k, max, ph, val){
  return '<textarea class="inp" id="'+id+'" data-k="'+k+'" maxlength="'+max+'" placeholder="'+esc(ph)+'">'+esc(val)+'</textarea>'
    + '<div class="cnt-r" data-cnt="'+id+'" data-max="'+max+'"></div>';
}







function syncCounters(){
  $$('[data-cnt]').forEach(el => {
    const f = document.getElementById(el.dataset.cnt); if(!f) return;
    const left = (+el.dataset.max) - f.value.length;
    el.textContent = left + ' caractère' + (left>1?'s':'') + ' restant' + (left>1?'s':'');
    el.classList.toggle('low', left < 30);
  });
}

/* ============================================================
   Chrome applicatif : barre latérale, barre d'onglets, en-tête
   ============================================================ */
const NAV = [
  {id:'accueil',  l:'Accueil', i:'home'},
  {id:'explorer', l:{tal:'Explorer les projets', vis:'Explorer les talents'}, i:'compass', short:'Explorer'},
  {id:'connexions', l:'Connexions', i:'link'},
  {id:'messages', l:'Messages', i:'chat'},
  {id:'atelier',  l:"L'Atelier", i:'tools', short:'Atelier'},
  {id:'fiche',    l:{tal:'Ma fiche Talent', vis:'Ma fiche Projet'}, i:'file', short:'Ma fiche'},
];
const NAV_FOOT = [{id:'parametres', l:'Paramètres', i:'cog'}, {id:'support', l:'Aide et support', i:'help'}];
const TABBAR = ['accueil','explorer','connexions','messages','atelier'];
function setText(el, v){ if(el && el.textContent !== v) el.textContent = v; }
function setCount(el, c){ if(!el) return; el.hidden = !c; if(c) setText(el, String(c)); }

function renderView(){
  renderTop(); renderSide();
  const m = $('#main');
  const views = {accueil:vAccueil, explorer:vExplorer, connexions:vConnexions, messages:vMessages,
                 atelier:vAtelier, fiche:vFiche, parametres:vParams, support:vSupport};
  const moved = S._painted !== S.view;
  const keep = moved ? 0 : m.scrollTop;
  m.innerHTML = '<div class="wrap' + (moved ? ' rise' : '') + '">' + (views[S.view] || vAccueil)() + '</div>';
  m.scrollTop = keep;
  S._painted = S.view;
  if(S.view === 'messages') scrollChat();
  if(S.view === 'fiche'){ syncCounters(); markRequired(); }
  if(moved) animateRings();
}
function render(){
  try{ renderView(); }
  catch(err){
    if(window.TMGuard) TMGuard.log(err, 'écran ' + S.view);
    const m = $('#main');
    if(m) m.innerHTML = '<div class="wrap"><div class="card" style="padding:36px 20px;display:grid;place-items:center">'
      + (window.TMGuard ? TMGuard.panel(err, 'Cet écran n\'a pas pu s\'afficher', 'Tes données ne sont pas perdues. Reviens à l\'accueil ou recharge la page.',
          S.view !== 'accueil' ? '<button class="tmg-btn ghost" type="button" data-act="go" data-v="accueil">Revenir à l\'accueil</button>' : '') : 'Cet écran n\'a pas pu s\'afficher.')
      + '</div></div>';
    S._painted = null;
  }
}

/* ============================================================
   Accueil
   ============================================================ */
const QUOTES = [
  ["L'idée est importante, mais l'équipe qui l'exécute l'est encore plus.", 'Proverbe de fondateur'],
  ["Si tu veux aller vite, marche seul. Si tu veux aller loin, marche ensemble.", 'Proverbe africain'],
  ["Un associé mal choisi coûte plus cher qu'une année perdue.", "Retour d'expérience TakaMatch"],
  ["Les meilleures équipes se forment avant l'argent, pas après.", 'Serge M., investisseur à Lomé'],
];
function stat(icon, k, v, d, up){
  return '<div class="stat"><div class="k">'+ic(icon)+esc(k)+'</div>'
    + '<div class="v tnum" data-count="'+v+'">'+v+'</div>'
    + '<div class="d'+(up?' up':'')+'">'+(up?ic('trend'):'')+esc(d)+'</div></div>';
}
function vAccueil(){
  const c = completion(isTalMode() ? 'tal' : 'vis'), me = S.me, tal = isTalMode();
  const q = QUOTES[new Date().getDate() % QUOTES.length];
  const ranked = pool().filter(x => !x.hidden && !isUnlocked(x.id)).map(x => ({x, s:scoreOf(x)})).sort((a,b)=>b.s.total-a.s.total).slice(0,4);
  const newInv = S.invitesRecv.filter(i=>i.status==='new').length;
  const unread = S.threads.filter(t=>t.unread && !t.archived).length;
  const msgs = S.threads.reduce((a,t)=>a+t.msgs.length,0);

  return '<div class="page-h"><div><h1>Bonjour <span class="acc">'+esc(me.first||'à toi')+'</span></h1>'
  +   '<p class="sub">'+(tal ? "Prêt à co-créer la prochaine success story africaine ?" : "Prêt à trouver les personnes qui feront exister ton idée ?")+'</p></div>'
  +   '<div class="spacer"></div>'
  +   '<div class="acts"><button class="btn btn-a" data-act="go" data-v="explorer">'+ic('compass')+(tal?'Explorer les projets':'Explorer les talents')+'</button></div></div>'

  + '<div class="grid g3" style="margin-bottom:16px">'
  +   (S.me.fresh ? stat('eye','Vues de ta fiche', 0, 'ta fiche vient d\'être publiée') : stat('eye','Vues de ta fiche', 48, '+12 cette semaine', true))
  +   stat('link','Invitations reçues', S.invitesRecv.length, newInv ? newInv+' à traiter' : 'aucune en attente')
  +   stat('chat','Messages', msgs, unread ? unread+' conversation'+(unread>1?'s':'')+' non lue'+(unread>1?'s':'') : 'tout est lu')
  + '</div>'

  + '<div class="cols cols-main">'
  +   '<div class="col" style="gap:16px">'
  +     '<section class="card card-pad"><div class="sec-t"><h3>'+(tal?'Projets faits pour toi':'Talents faits pour ton projet')+'</h3>'
  +       '<button class="btn btn-quiet btn-sm" data-act="go" data-v="explorer">Tout voir'+ic('arrow')+'</button></div>'
  +       (ranked.length ? '<div class="deck">'+ranked.map(r=>card(r.x, r.s)).join('')+'</div>'
            : emptyBox('🔍','Rien à suggérer',"Complète ta fiche pour qu'on puisse calculer des compatibilités."))
  +     '</section>'
  +     '<section class="card card-pad"><div class="sec-t"><h3>Activité récente</h3>'
  +       '<button class="btn btn-quiet btn-sm" data-act="notifs">Tout voir</button></div>'
  +       (S.notifs.length ? '<div class="list">'+S.notifs.slice(0,4).map(notifRow).join('')+'</div>'
            : emptyBox('🌱','Tout commence ici',"Envoie ta première invitation : l'activité apparaîtra ici."))
  +     '</section>'
  +   '</div>'
  +   '<div class="col" style="gap:16px">'
  +     '<section class="card card-pad"><div class="lbl" style="margin-bottom:12px">'+(tal?'Ta fiche Talent':'Fiche projet · '+esc(projName(S.me.project)))+'</div>'
  +       '<div class="row" style="gap:16px;align-items:center">'+ringHTML(c.pct, 96)
  +       '<div style="flex:1;min-width:0"><p style="font-size:14px;color:var(--ink-2);line-height:1.55">'
  +       (c.pct >= 100 ? 'Ta fiche est complète. Tu es dans le haut des résultats.' : c.pct >= 70 ? 'Bonne fiche. Il te reste <b style="color:var(--ink)">'+(100-c.pct)+' points</b> à gagner.' : 'Sous 70 %, ta fiche apparaît en bas des résultats.')
  +       '</p></div></div>'
  +       (c.pct < 100 ? '<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:12px">'+c.rows.filter(r=>!r[1]).slice(0,3).map(r=>'<span class="chip">'+esc(r[0])+'</span>').join('')+'</div>' : '')
  +       '<button class="btn btn-ghost btn-sm btn-block" style="margin-top:14px" data-act="go" data-v="fiche">'+ic('edit')+'Compléter ma fiche</button></section>'
  +     (tal ? engageCard() + freeCard() : creditsCard())
  +     trustCard()
  +     '<section class="card card-pad"><div style="font-family:var(--disp);font-size:34px;line-height:.6;color:var(--ink-4)" aria-hidden="true">&ldquo;</div>'
  +       '<p style="font-family:var(--disp);font-size:17px;line-height:1.45;margin-top:6px">'+esc(q[0])+'</p>'
  +       '<p style="font-size:13px;color:var(--ink-3);margin-top:10px;font-family:var(--disp);font-style:italic">'+esc(q[1])+'</p></section>'
  +   '</div>'
  + '</div>';
}
function notifRow(n){
  return '<div class="li" style="cursor:default">'
    + '<span class="av av-36" style="background:var(--surface-3);color:var(--ink-2)" aria-hidden="true">'+ic(n.i)+'</span>'
    + '<span class="grow"><span class="t" style="font-size:13.5px">'+esc(n.t)+'</span><span class="s">'+esc(n.s)+'</span></span>'
    + '<span class="when">'+ago(n.min)+'</span></div>';
}
function freeCard(){
  return '<section class="card card-pad"><div class="lbl" style="margin-bottom:6px">Gratuit, pour toujours</div>'
    + '<p style="font-size:14px;line-height:1.6;color:var(--ink-2)">Explorer, publier ta fiche et postuler est <b style="color:var(--ink)">gratuit et illimité</b> pour les talents. Ce sont les porteurs de projet qui dépensent un crédit pour t\'inviter : chaque invitation reçue a donc été choisie.</p></section>';
}
function creditsCard(){
  const m = S.me, extra = m.credits > m.creditsMax;
  return '<section class="card card-pad credits">'
    + '<div class="row" style="margin-bottom:2px"><div class="lbl" style="flex:1">Crédits d\'invitation</div>'
    +   '<button class="iconbtn" data-act="why-credits" aria-label="Pourquoi des crédits ?">'+ic('info')+'</button></div>'
    + '<div class="row" style="align-items:baseline;gap:6px"><span style="font-family:var(--disp);font-size:36px;font-weight:600" class="tnum">'+m.credits+'</span>'
    +   '<span style="font-size:14px;color:var(--ink-3)">'+(extra ? 'restants' : 'restants sur '+m.creditsMax+' ce mois')+'</span></div>'
    + '<div class="gauge" aria-hidden="true">'+Array.from({length:Math.max(m.creditsMax, Math.min(m.credits, 10))},(_,i)=>'<i class="'+(i<m.credits?'on':'')+'"></i>').join('')+'</div>'
    + '<p class="hint" style="margin-bottom:12px">'+(extra ? 'Tes crédits achetés n\'expirent pas.' : 'Se renouvelle le 1<sup>er</sup> '+tmNextMonth()+'. Packs à partir de <span class="mono">'+priceH('credits_essai')+'</span>.')+'</p>'
    + '<button class="btn btn-ghost btn-sm btn-block" data-act="buy-credits">'+ic('plus')+'Recharger mes crédits</button>'
    + payBadges()+'</section>';
}
/* Vérification du téléphone par SMS : pas encore proposée. Passer à true le jour où elle l'est. */
const PHONE_VERIFY = false;
function trustRungs(){
  const m = S.me;
  return [
    ['Email confirmé', m.verifiedEmail, "À l'inscription.", null],
    ['Téléphone vérifié', m.verifiedPhone, 'Un SMS, trente secondes.', 'verify-phone'],
    ['Identité vérifiée', m.verifiedId, m.verifyPending ? 'Dossier en cours d\'examen par l\'équipe TakaMatch.' : 'Pièce et selfie, vérifiés par l\'équipe. Débloque le badge.', m.verifyPending ? null : 'verify-id'],
    ['Une référence reçue', m.refs > 0, 'Un ancien collaborateur confirme.', 'ask-ref'],
  ].filter(r => PHONE_VERIFY || r[3] !== 'verify-phone');
}
function ladderHTML(withBtns){
  return '<div class="ladder">'+trustRungs().map(r=>
    '<div class="rung'+(r[1]?' done':'')+'"><span class="dot">'+(r[1]?tick().replace('<svg','<svg width="13" height="13"'):ic('lock'))+'</span>'
    + '<span class="grow"><span class="t">'+esc(r[0])+'</span><span class="s">'+esc(r[2])+'</span></span>'
    + (r[1] ? (withBtns?'<span class="chip chip-ok" style="flex:0 0 auto">Validé</span>':'')
            : (withBtns?'<button class="btn btn-ghost btn-sm" data-act="'+r[3]+'">Faire</button>':''))+'</div>').join('')+'</div>';
}
function trustCard(){
  const n = trustRungs().filter(r=>r[1]).length;
  return '<section class="card card-pad"><div class="row" style="margin-bottom:6px"><div class="lbl" style="flex:1">Échelle de confiance</div>'
    + '<span class="chip '+(n>=trustRungs().length-1?'chip-ok':'chip-warn')+'"><span class="mono">'+n+' / '+trustRungs().length+'</span></span></div>'
    + ladderHTML(false)
    + '<button class="btn btn-quiet btn-sm btn-block" style="margin-top:8px" data-act="go" data-v="parametres">Franchir le palier suivant'+ic('arrow')+'</button></section>';
}

/* ============================================================
   Explorer
   ============================================================ */

function tabBtn(id, l, icon, n, plain){
  return '<button class="tab'+(S.tab===id?' on':'')+'" role="tab" aria-selected="'+(S.tab===id)+'" data-act="tab" data-t="'+id+'">'
    + ic(icon)+esc(l) + (n ? (plain?'<span class="chip mono" style="height:20px;font-size:11.5px">'+n+'</span>':'<span class="cnt">'+n+'</span>') : '') + '</button>';
}
function vExplorer(){
  const tal = isTalMode();
  if(!['decouvrir','favoris'].includes(S.tab)) S.tab = 'decouvrir';
  const list = filtered();
  return '<div class="page-h"><div><h1>'+(tal?'Explorer les <span class="acc2">projets</span>':'Explorer les <span class="acc2">talents</span>')+'</h1>'
    + '<p class="sub" id="resCount">'+resultsLine(list.length)+'</p></div>'
    + '<div class="spacer"></div>'
    + (tal ? '' : '<div class="row card" style="padding:8px 8px 8px 14px;gap:12px"><div><div class="lbl" style="font-size:12px">Crédits restants</div>'
        + '<div class="row" style="gap:4px;align-items:baseline"><b class="tnum" style="font-family:var(--disp);font-size:20px;font-weight:600">'+S.me.credits+'</b><span style="font-size:12px;color:var(--ink-3)">'+(S.me.credits > S.me.creditsMax ? 'achetés, sans expiration' : 'sur '+S.me.creditsMax+' ce mois')+'</span></div></div>'
        + '<button class="btn btn-ghost btn-sm" data-act="buy-credits">Recharger</button></div>')
    + '</div>'
    + '<div class="tabs" role="tablist">'+tabBtn('decouvrir','Découvrir','compass')+tabBtn('favoris','Mes favoris','star', S.favs.size, true)+'</div>'
    + toolbar()
    + '<div id="expBody">'+(S.loading ? skelDeck() : S.mode === 'mosaic' ? mosaic(list) : focusView(list))+'</div>';
}
function skelDeck(){
  return '<div class="deck" aria-busy="true" aria-label="Chargement">'+Array.from({length:6},()=>
    '<div class="skel-card"><div class="skel" style="height:96px"></div><div class="b"><div class="skel" style="height:15px;width:60%"></div><div class="skel" style="height:11px;width:40%"></div>'
    + '<div class="skel" style="height:10px"></div><div class="skel" style="height:10px;width:85%"></div><div class="skel" style="height:22px;width:55%;margin-top:6px"></div></div></div>').join('')+'</div>';
}
const EXP_PAGE = 12;   /* fiches affichées d'un coup ; les suivantes à la demande */
function mosaic(list){
  if(!list.length) return emptyState();
  const sig = [S.me.role, S.tab, S.q, S.filterSkill, S.filterSector, S.fPay].join('|');
  if(S._expSig !== sig){ S._expSig = sig; S.expShown = EXP_PAGE; }
  const n = Math.min(list.length, S.expShown || EXP_PAGE);
  return '<div class="deck">' + list.slice(0, n).map(r => card(r.x, r.s)).join('') + '</div>'
    + (n < list.length ? '<div style="display:flex;justify-content:center;margin-top:16px"><button class="btn btn-ghost" data-act="exp-more">Voir plus de fiches <span class="mono" style="margin-left:6px">'+n+' / '+list.length+'</span></button></div>' : '');
}

function mine(){ return isTalMode() ? S.me.skills : S.me.project.seeking; }

/* ============================================================
   Connexions — l'état de tes relations
   ============================================================ */
function vConnexions(){
  const recvNew = S.invitesRecv.filter(i=>i.status==='new').length;
  const t = S.tab === 'matchs' ? 'matchs' : 'invitations';
  return '<div class="page-h"><div><h1>Tes <span class="acc">connexions</span></h1>'
    + '<p class="sub">Les invitations que tu envoies et que tu reçois, et les équipes qui en sortent.</p></div></div>'
    + '<div class="tabs" role="tablist">'+tabBtn('invitations','Invitations','link', recvNew)+tabBtn('matchs','Matchs','spark', S.matches.length, true)+'</div>'
    + (t === 'matchs' ? matchesPanel() : invitationsPanel());
}
function invAll(){
  return S.invitesRecv.map(i => Object.assign({dir:'recv'}, i)).concat(S.invitesSent.map(i => Object.assign({dir:'sent'}, i)))
    .sort((a,b) => (a.status==='new'?-1:0) - (b.status==='new'?-1:0) || a.min - b.min);
}
function invitationsPanel(){
  const all = invAll();
  const list = all.filter(i => S.invFilter === 'all' || i.dir === S.invFilter);
  const n = k => all.filter(i => k === 'all' || i.dir === k).length;
  const seg = '<div class="seg-sm" role="group" aria-label="Filtrer les invitations">'
    + [['all','Toutes'],['recv','Reçues'],['sent','Envoyées']].map(([k,l]) => '<button class="'+(S.invFilter===k?'on':'')+'" data-act="inv-filter" data-v="'+k+'" aria-pressed="'+(S.invFilter===k)+'">'+l+'<span class="n">'+n(k)+'</span></button>').join('')+'</div>';
  const head = '<div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px">'+seg
    + '<span class="hint row" style="gap:6px">'+ic('clock')+'Une invitation sans réponse expire au bout de 10 jours. '+(isTalMode()?'':'Le crédit t\'est alors rendu.')+'</span></div>';
  if(!list.length){
    return head + '<div class="card">'+emptyBox('✉️','Aucune invitation ici',
      isTalMode() ? "Explore les projets et envoie ta première invitation, ou attends qu'un porteur te repère." : "Explore les talents et envoie ta première invitation. Il te reste "+S.me.credits+" crédits.",
      '<button class="btn btn-ghost btn-sm" style="margin-top:8px" data-act="go" data-v="explorer">'+ic('compass')+'Explorer</button>')+'</div>';
  }
  return head + '<div class="card"><div class="list" style="padding:6px">'+list.map(inviteRow).join('')+'</div></div>';
}


/* ============================================================
   Messages — deux voix
   ============================================================ */
function dayLabel(d){
  const t = new Date(); const y = new Date(); y.setDate(t.getDate()-1);
  if(d.toDateString() === t.toDateString()) return "Aujourd'hui";
  if(d.toDateString() === y.toDateString()) return 'Hier';
  return d.getDate()+' '+MOIS[d.getMonth()];
}
function scrollChat(){ const b = $('#chatBody'); if(b) b.scrollTop = b.scrollHeight; }

/* ============================================================
   L'Atelier — ce que vous construisez ensemble
   ============================================================ */

/* ============================================================
   Ma fiche
   ============================================================ */


/* ============================================================
   Paramètres
   ============================================================ */
function settingRow(k, t, s){
  return '<div class="row" style="padding:11px 0;border-top:1px solid var(--line)"><div style="flex:1"><div style="font-weight:600;font-size:14px">'+esc(t)+'</div>'
    + '<div class="hint">'+esc(s)+'</div></div><button class="toggle" data-act="pref" data-k="'+k+'" aria-pressed="'+(!!S.prefs[k])+'" aria-label="'+esc(t)+'"></button></div>';
}
function linkRow(icon, l, act, danger){
  return '<button class="li" data-act="'+act+'" style="padding-left:0;padding-right:0'+(danger?';color:var(--bad-ink)':'')+'">'+ic(icon)
    + '<span class="grow"><span class="t" style="font-size:14px;font-weight:500">'+esc(l)+'</span></span>'+ic('chev')+'</button>';
}


/* ============================================================
   Aide et support
   ============================================================ */


/* ============================================================
   Thème
   ============================================================ */
function themeIsDark(){
  const t = document.documentElement.getAttribute('data-theme');
  if(t) return t === 'dark';
  return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
}
function toggleTheme(){
  const next = themeIsDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try{ localStorage.setItem('tm-theme', next); }catch(e){}
  renderTop();
  $$('.toggle[data-act="theme"]').forEach(b => b.setAttribute('aria-pressed', next==='dark'));
}
try{ const t = localStorage.getItem('tm-theme'); if(t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t); }catch(e){}

/* ============================================================
   Calques : fenêtre pop-up, tiroir, palette, menus
   Un seul calque à la fois. Échap ferme, le focus revient au
   déclencheur, et Tab tourne dans la fenêtre.
   ============================================================ */
let layerSeq = 0;
function openLayer(html, name){
  layerSeq++;
  if(!S.layer) S.lastFocus = document.activeElement;
  S.layer = name || 'x';
  const l = $('#layer'); l.innerHTML = html;
  const ov = l.querySelector('.ov');
  if(ov) requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('on')));
  const f = l.querySelector('[autofocus]') || l.querySelector('.ov-win input, .ov-win textarea, #cmdIn') || l.querySelector('.ov-win .btn, .pop button, .drawer button');
  if(f) try{ f.focus({preventScroll:true}); }catch(e){}
}
function closeLayer(){
  if(!S.layer) return;
  const l = $('#layer'), seq = ++layerSeq, ov = l.querySelector('.ov');
  S.layer = null;
  if(ov){ ov.classList.remove('on'); setTimeout(() => { if(seq === layerSeq) l.innerHTML = ''; }, 240); }
  else l.innerHTML = '';
  const back = S.lastFocus; S.lastFocus = null;
  if(back && document.contains(back)) try{ back.focus({preventScroll:true}); }catch(e){}
}
function modal(title, body, foot, opts){
  opts = opts || {};
  openLayer('<div class="ov" role="dialog" aria-modal="true" aria-labelledby="ovT"><div class="ov-bg" data-act="close"></div>'
    + '<div class="ov-win'+(opts.lg?' lg':'')+'">'
    + '<button class="iconbtn ov-x" data-act="close" aria-label="Fermer">'+ic('x')+'</button>'
    + (title ? '<h2 class="ov-t" id="ovT">'+esc(title)+'</h2>' : '')
    + '<div class="ov-b">'+body+'</div>'
    + (foot ? '<div class="ov-foot">'+foot+'</div>' : '') + '</div></div>', 'modal');
}
function success(title, text, foot){
  modal('', '<div class="ov-ok"><div class="okc">'+ic('check')+'</div><h2 class="ov-t" id="ovT" style="margin:4px 0 8px">'+esc(title)+'</h2><p style="max-width:40ch">'+text+'</p></div>',
    foot || '<button class="btn btn-a" data-act="close">Continuer</button>');
  $('#layer .ov-foot').style.justifyContent = 'center';
}
function drawer(){
  const list = S.notifs;
  openLayer('<div class="scrim" data-act="close"></div>'
    + '<aside class="drawer" role="dialog" aria-modal="true" aria-label="Notifications">'
    + '<header><h3>Notifications</h3>'
    + (list.length?'<button class="btn btn-quiet btn-sm" data-act="clear-notifs">Tout effacer</button>':'')
    + '<button class="iconbtn iconbtn-lg" data-act="close" aria-label="Fermer">'+ic('x')+'</button></header>'
    + '<div class="bodyz scroll">' + (list.length ? '<div class="list">'+list.map(notifRow).join('')+'</div>'
        : emptyBox('🔔','Rien de neuf',"Les invitations, les matchs et les messages apparaîtront ici."))
    + '</div></aside>', 'drawer');
  S.notifs.forEach(n => n.read = true);
  renderTop();
}
function pushNotif(i, t, s){ S.notifs.unshift({i, t, s, min:0, read:false}); renderTop(); }
function popMenu(anchor, html){
  const r = anchor.getBoundingClientRect();
  const right = Math.max(12, innerWidth - r.right);
  openLayer('<div class="scrim" style="background:transparent;backdrop-filter:none;-webkit-backdrop-filter:none" data-act="close"></div>'
    + '<div class="pop" role="menu" style="top:'+(r.bottom+8)+'px;right:'+right+'px">'+html+'</div>', 'pop');
}



/* ---------- Palette de commandes ---------- */
let cmdSel = 0, cmdMatches = [];
function drawCmd(){
  const el = $('#cmdList'); if(!el) return;
  el.innerHTML = cmdMatches.length
    ? cmdMatches.map((c,i)=>'<button class="cmditem" role="option" aria-selected="'+(i===cmdSel)+'" data-act="cmd-run" data-i="'+i+'">'+ic(c.i)+'<span>'+esc(c.l)+'</span>'+(i===cmdSel?'<span class="kbd">↵</span>':'')+'</button>').join('')
    : '<div class="empty" style="padding:22px"><p>Aucun résultat.</p></div>';
  const s = el.querySelector('[aria-selected="true"]'); if(s) s.scrollIntoView({block:'nearest'});
}

/* ============================================================
   Graphique : vues de fiche, 6 semaines, deux séries
   ============================================================ */
const VIEWS = {w:['S34','S35','S36','S37','S38','S39'], tal:[6,9,8,13,15,19], vis:[4,5,7,6,9,12]};
function barPath(x, y, w, h, r){ r = Math.min(r, h, w/2); return 'M'+x+','+(y+h)+'V'+(y+r)+'Q'+x+','+y+' '+(x+r)+','+y+'H'+(x+w-r)+'Q'+(x+w)+','+y+' '+(x+w)+','+(y+r)+'V'+(y+h)+'Z'; }




/* ============================================================
   Actions
   ============================================================ */



function declineInvite(id){
  const inv = S.invitesRecv.find(i=>i.id===id); if(!inv) return;
  inv.status = 'declined'; render();
  toast('Invitation déclinée. Répondre, même par un non, protège ta réputation.');
}
const REPLIES = ["Bonne question. De mon côté, je suis disponible jeudi en fin de journée.",
  "D'accord sur le principe. Mettons ça par écrit dans l'Atelier avant d'aller plus loin.",
  "Je préfère qu'on cadre les rôles avant de parler de capital : ça évite les malentendus.",
  "Je t'envoie le lien de la démo ce soir. Dis-moi franchement ce que tu en penses."];
const PACKS = [{k:'credits_essai', n:'Essai', c:3, p:2000, h:'pour tester'}, {k:'credits_elan', n:'Élan', c:10, p:5000, h:'le plus choisi', best:true}, {k:'credits_campagne', n:'Campagne', c:30, p:12000, h:'−33 % à l\'unité'}];
/* ---------- Prix dans la devise du pays de paiement (js/prix.js) ----------
   Les montants de référence (FCFA) se règlent dans l'admin. */
function priceCc(){ return (S.pay && S.pay.cc) || payDetectCountry(); }
function priceOf(key){ return TMPrix.get(key, priceCc()); }
function priceT(key){ return TMPrix.text(key, priceCc()); }
function priceH(key){ return '<span data-price="'+key+'">'+esc(priceT(key))+'</span>'; }
function payKey(){ return (S.pay && S.pay.key) || ((PACKS[(S.pay || {}).pack] || {}).k) || ''; }
function refreshPrices(){
  $$('[data-price]').forEach(el => { el.textContent = priceT(el.dataset.price); });
  const n = $('#payNote'); if(n) n.textContent = TMPrix.chargeNote(payKey(), priceCc());
}
window.addEventListener('tm-prix', () => { try{ refreshPrices(); }catch(e){} });

/* ============================================================
   Paiements — couche commune (TMPay)
   ------------------------------------------------------------
   L'écran ne parle jamais directement à FedaPay, Flutterwave ou
   CinetPay. Il appelle TMPay.createPayment() puis
   TMPay.verifyPayment() ; c'est le serveur TakaMatch (dossier
   « paiements ») qui choisit le prestataire selon le pays et qui
   reçoit les webhooks. Tant que TM_PAY.apiBase est vide, tout est
   simulé ici, comme avant.
   ⚠ PAY_COUNTRIES doit rester identique à paiements/src/countries.js.
   ============================================================ */
const TM_PAY = {
  apiBase: '',          /* ex. 'https://api.takamatch.bj/api' — vide = simulation */
  pollEvery: 3000,      /* vérification du statut pendant l'attente (ms) */
  pollFor: 180000,      /* abandon de l'attente au bout de 3 minutes */
};
const PAY_METHODS = {
  mtn:     {l:'MTN MoMo',       cls:'mtn'},
  moov:    {l:'Moov Money',     cls:'moov'},
  celtiis: {l:'Celtiis Cash',   cls:'celtiis'},
  wave:    {l:'Wave',           cls:'wave'},
  orange:  {l:'Orange Money',   cls:'orange'},
  free:    {l:'Free Money',     cls:'free'},
  mixx:    {l:'Mixx by Yas',    cls:'mixx', aka:'ex T-Money'},
  airtel:  {l:'Airtel Money',   cls:'airtel'},
  card:    {l:'Carte bancaire', cls:'card', card:true},
};
/* Pays → prestataire et moyens proposés. La carte est ajoutée partout. */
const PAY_COUNTRIES = {
  BJ:{n:'Bénin',          dial:'+229', len:10, provider:'fedapay', methods:['mtn','moov','celtiis']},
  TG:{n:'Togo',           dial:'+228', len:8,  provider:'fedapay', methods:['mixx','moov']},
  CI:{n:"Côte d'Ivoire",  dial:'+225', len:10, provider:'fedapay', methods:['wave','orange','mtn','moov']},
  SN:{n:'Sénégal',        dial:'+221', len:9,  provider:'fedapay', methods:['wave','orange','free']},
  BF:{n:'Burkina Faso',   dial:'+226', len:8,  provider:'fedapay', methods:['orange','moov']},
  ML:{n:'Mali',           dial:'+223', len:8,  provider:'fedapay', methods:['orange']},
  NE:{n:'Niger',          dial:'+227', len:8,  provider:'fedapay', methods:['airtel']},
  /* Hors zone FedaPay mobile money : carte seulement, en attendant Flutterwave. */
  GH:{n:'Ghana',          dial:'+233', len:9,  provider:'fedapay', methods:[], later:'flutterwave'},
  NG:{n:'Nigeria',        dial:'+234', len:10, provider:'fedapay', methods:[], later:'flutterwave'},
  CM:{n:'Cameroun',       dial:'+237', len:9,  provider:'fedapay', methods:[], later:'cinetpay'},
  FR:{n:'France',         dial:'+33',  len:9,  provider:'fedapay', methods:[]},
};
/* Les autres pays couverts (js/geo.js) : carte bancaire en attendant leurs moyens locaux. */
TMGeo.COUNTRIES.forEach(c => { if(!PAY_COUNTRIES[c.id]) PAY_COUNTRIES[c.id] = {n:c.n, dial:c.c, len:c.len[0], provider:'fedapay', methods:[]}; });
const PAY_DEFAULT_CC = 'BJ';
const PAY_TZ = {'Africa/Porto-Novo':'BJ','Africa/Lome':'TG','Africa/Abidjan':'CI','Africa/Dakar':'SN','Africa/Ouagadougou':'BF',
  'Africa/Bamako':'ML','Africa/Niamey':'NE','Africa/Accra':'GH','Africa/Lagos':'NG','Africa/Douala':'CM','Europe/Paris':'FR'};

function payCountry(cc){ return PAY_COUNTRIES[cc] || PAY_COUNTRIES[PAY_DEFAULT_CC]; }
function payMethodsOf(cc){ return payCountry(cc).methods.concat('card'); }
function payDial(cc){ return payCountry(cc).dial; }
/* Pays de paiement : choix manuel > pays du compte > indicatif du numéro > fuseau > langue > Bénin. */
function payDetectCountry(){
  const m = (typeof S !== 'undefined' && S.me) || {};
  if(PAY_COUNTRIES[m.payCountry]) return m.payCountry;
  if(PAY_COUNTRIES[m.country]) return m.country;
  const dial = String(m.phone || '').replace(/\s/g, '');
  const byDial = Object.keys(PAY_COUNTRIES).find(k => dial.startsWith(PAY_COUNTRIES[k].dial));
  if(byDial) return byDial;
  if(window.TMPrix){ const t = TMPrix.cc(); if(PAY_COUNTRIES[t]) return t; }
  try{ const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; if(PAY_TZ[tz]) return PAY_TZ[tz]; }catch(e){}
  const reg = ((navigator.language || '').split('-')[1] || '').toUpperCase();
  if(PAY_COUNTRIES[reg]) return reg;
  return PAY_DEFAULT_CC;
}
function payInit(pack){
  const cc = payDetectCountry();
  const method = payMethodsOf(cc)[0];
  /* idem : identifiant de CET achat. Renvoyé à chaque nouvel essai, il empêche le serveur d'en créer un second. */
  return {pack:pack == null ? 1 : pack, cc, method, op:PAY_METHODS[method].l, idem:null};
}
function payBadges(cc){
  return '<div class="momo" style="margin-top:10px;justify-content:center;flex-wrap:wrap">via '
    + payMethodsOf(cc || payDetectCountry()).map(k => '<b class="'+PAY_METHODS[k].cls+'">'+esc(PAY_METHODS[k].l)+'</b>').join('')+'</div>';
}
function payOpsHtml(){
  const P = S.pay, c = payCountry(P.cc), card = P.method === 'card';
  const local = String(S.me.phone || '').replace(/\s/g, '').startsWith(c.dial) ? phoneLocal() : '';
  return '<div class="field"><label for="payCc">Pays de paiement</label>'
    +   '<select class="inp" id="payCc" data-pay="cc">'+Object.keys(PAY_COUNTRIES).sort((a, b) => PAY_COUNTRIES[a].n.localeCompare(PAY_COUNTRIES[b].n, 'fr')).map(k => '<option value="'+k+'"'+(k === P.cc ? ' selected' : '')+'>'+esc(PAY_COUNTRIES[k].n)+'</option>').join('')+'</select></div>'
    + '<div class="field"><label>Moyen de paiement</label><div class="ops" role="radiogroup">'+payMethodsOf(P.cc).map(k => { const x = PAY_METHODS[k];
        return '<button type="button" class="opt radio" data-act="op" data-v="'+k+'" aria-pressed="'+(P.method === k)+'"><span class="box">'+tick()+'</span>'
          + '<i class="op-dot '+x.cls+'" aria-hidden="true"></i><span>'+esc(x.l)+(x.aka ? ' <small class="hint">'+esc(x.aka)+'</small>' : '')+'</span></button>'; }).join('')+'</div></div>'
    + (card ? '' : field('payTel', 'Numéro '+PAY_METHODS[P.method].l, '<div class="row" style="gap:8px"><span class="inp mono" style="width:86px;display:grid;place-items:center;flex:0 0 auto">'+c.dial+'</span><input class="inp mono" id="payTel" inputmode="tel" autocomplete="tel-national" value="'+esc(local)+'"></div>'))
    + '<p class="hint">'+(card
        ? 'Tu saisis ta carte Visa ou Mastercard sur la page sécurisée de FedaPay. TakaMatch ne voit jamais ton numéro de carte.'
        : 'Tu valides le paiement sur ton téléphone, avec ton code secret. TakaMatch ne te le demandera jamais.')
    + (!c.methods.length ? ' Le mobile money arrive bientôt pour ce pays.' : '')
    + (TM_PAY.apiBase ? '' : ' <b>Paiement simulé dans ce prototype.</b>')+'</p>'
    + '<p class="hint pay-note" id="payNote" aria-live="polite">'+esc(TMPrix.chargeNote(payKey(), P.cc))+'</p>';
}
function opsField(){ return '<div id="payOps">'+payOpsHtml()+'</div>'; }
function payRefresh(){ const el = $('#payOps'); if(el) el.innerHTML = payOpsHtml(); }
function paySetCountry(cc){
  if(!PAY_COUNTRIES[cc]) return;
  S.pay.cc = cc; S.me.payCountry = cc;
  if(!payMethodsOf(cc).includes(S.pay.method)) S.pay.method = payMethodsOf(cc)[0];
  S.pay.op = PAY_METHODS[S.pay.method].l;
  TMPrix.setCc(cc, true);
  payRefresh(); refreshPrices();
}
function paySetMethod(k){
  if(!PAY_METHODS[k]) return;
  const tel = $('#payTel'), typed = tel ? tel.value : null;
  S.pay.method = k; S.pay.op = PAY_METHODS[k].l;
  payRefresh();
  if(typed != null && $('#payTel')) $('#payTel').value = typed;
}

/* ---------- Client : même interface quel que soit le prestataire ---------- */
const TMPay = {
  simulated(){ return !TM_PAY.apiBase; },
  /* idem est renvoyé tel quel à chaque essai : si une première requête est
     arrivée mais que sa réponse s'est perdue (réseau coupé), le serveur
     renvoie le même paiement au lieu d'en créer un second. C'est ce qui
     rend les nouvelles tentatives automatiques sans danger. */
  async createPayment(req, idem){
    if(this.simulated()){
      await new Promise(r => setTimeout(r, 1100));
      return {id:'SIM-'+Date.now().toString(36).toUpperCase(), status:'approved', provider:payCountry(req.country).provider, simulated:true};
    }
    return TMGuard.fetch(TM_PAY.apiBase+'/payments', {method:'POST', credentials:'include',
      headers:{'Content-Type':'application/json', 'Idempotency-Key':idem}, body:JSON.stringify(Object.assign({idem}, req))},
      {timeout:20000, retries:2});
    /* {id, status:'pending'|'redirect'|'approved', url?, provider, reused?} */
  },
  async verifyPayment(id){
    if(this.simulated() || String(id).startsWith('SIM-')) return {id, status:'approved'};
    return TMGuard.fetch(TM_PAY.apiBase+'/payments/'+encodeURIComponent(id), {credentials:'include', cache:'no-store'}, {timeout:10000, retries:1});
    /* {id, status:'pending'|'approved'|'declined'|'canceled'|'refunded', stale?} */
  },
};

/* Lance un paiement depuis une fenêtre « Payer », attend la confirmation
   du serveur, puis appelle done(). L'accès n'est accordé qu'après un
   statut « approved » renvoyé par verifyPayment (jamais sur simple retour d'écran).
   Anti double paiement côté écran :
     - un seul paiement à la fois (PAY_BUSY), bouton désactivé ;
     - la même clé idem est gardée tant que le résultat est incertain
       (coupure réseau, attente trop longue) : recliquer reprend le même
       paiement au lieu d'en ouvrir un second. */
let PAY_BUSY = false;
async function payThen(item, btn, done){
  if(PAY_BUSY){ toast('Un paiement est déjà en cours. Attends sa confirmation avant d\'en lancer un autre.', 'bad'); return; }
  const P = S.pay, c = payCountry(P.cc), card = P.method === 'card';
  let phone = '';
  if(!card){
    const tel = $('#payTel'), digits = (tel ? tel.value : '').replace(/\D/g, '');
    if(digits.length !== c.len){
      toast('Numéro '+PAY_METHODS[P.method].l+' attendu : '+c.len+' chiffres après '+c.dial+'.', 'bad');
      if(tel) tel.focus();
      return;
    }
    phone = c.dial + digits;
  }
  if(!P.idem) P.idem = TMGuard.uid();
  PAY_BUSY = true;
  /* Fenêtre ouverte tout de suite (sinon bloquée) pour la page carte FedaPay. */
  const win = card && !TMPay.simulated() ? window.open('', '_blank') : null;
  btn.classList.add('loading'); btn.disabled = true; btn.setAttribute('aria-busy', 'true');
  const label0 = btn.innerHTML;
  /* keep = résultat incertain : on garde la clé pour reprendre le même paiement. */
  const stop = (msg, keep) => {
    PAY_BUSY = false; if(!keep) P.idem = null;
    btn.classList.remove('loading'); btn.disabled = false; btn.removeAttribute('aria-busy'); btn.innerHTML = label0;
    if(msg) toast(msg, 'bad');
  };
  try{
    const res = await TMPay.createPayment({
      kind:item.kind, product:item.key || item.kind, label:item.label, amount:item.amount, currency:'XOF',
      country:P.cc, method:P.method, phone,
      customer:{email:S.me.email || '', first:S.me.first || '', last:S.me.last || ''},
    }, P.idem);
    let st = res.status;
    if(res.reused) toast('Ce paiement était déjà lancé : on reprend le même, tu ne seras débité qu\'une fois.');
    if(st === 'redirect' && res.url){
      if(win && !win.closed) win.location = res.url; else window.open(res.url, '_blank');
      btn.innerHTML = 'Termine le paiement dans l\'onglet FedaPay…';
      st = 'pending';
    } else if(win){ win.close(); }
    if(st === 'pending' || st === 'created') btn.innerHTML = card ? btn.innerHTML : 'Valide sur ton téléphone…';
    const t0 = Date.now();
    let fails = 0;
    while(st !== 'approved'){
      if(['declined','canceled','failed','refunded'].includes(st)) return stop('Paiement non abouti. Aucun montant n\'a été débité.');
      if(Date.now() - t0 > TM_PAY.pollFor) return stop('Pas de confirmation reçue. Si tu as été débité, ton achat apparaîtra dans quelques minutes : ne repaie pas.', true);
      await new Promise(r => setTimeout(r, TM_PAY.pollEvery));
      try{ st = (await TMPay.verifyPayment(res.id)).status; fails = 0; }
      catch(e){
        /* Une vérification ratée n'annule rien : on réessaie au tour suivant. */
        if(e.status && e.status < 500 && e.status !== 408 && e.status !== 429) return stop(e.message, true);
        if(++fails >= 5) return stop('Impossible de joindre le serveur pour confirmer ton paiement. Si tu as été débité, ton achat apparaîtra dès le retour de la connexion : ne repaie pas.', true);
      }
    }
    S.pay.op = PAY_METHODS[P.method].l; S.pay.ref = res.id;
    stop(null, false);
    done(res);
  }catch(err){
    if(win) try{ win.close(); }catch(e){}
    /* Réseau coupé pendant la création : on ne sait pas si le paiement est parti → on garde la clé. */
    const unsure = ['network','timeout','offline'].includes(err.kind) || (err.status >= 500);
    stop(err.message || 'Le paiement n\'a pas pu aboutir.', unsure);
  }
}
document.addEventListener('change', e => { if(e.target && e.target.id === 'payCc') paySetCountry(e.target.value); });

function buyCredits(blocked){
  S.pay = payInit(1);
  modal(blocked ? 'Plus de crédits ce mois-ci' : 'Recharger tes crédits', payBody(blocked),
    '<button class="btn btn-ghost" data-act="close">Annuler</button><button class="btn btn-a" id="payBtn" data-act="pay">'+payLabel()+'</button>', {lg:true});
}
function payLabel(){ return ic('card')+'Payer '+priceH(PACKS[S.pay.pack].k); }
function payBody(blocked){
  return (blocked ? '<p>Tes 3 crédits mensuels sont utilisés. Ils se renouvellent le 1<sup>er</sup> '+tmNextMonth()+', ou tu peux recharger maintenant.</p>' : '')
    + '<p>Pas d\'abonnement : tu achètes des crédits et tu les gardes sans limite de temps.</p>'
    + '<div class="packs" role="radiogroup" aria-label="Choisir un pack">'+PACKS.map((p,i)=>'<button class="pack" role="radio" data-act="pack" data-i="'+i+'" aria-pressed="'+(S.pay.pack===i)+'" aria-checked="'+(S.pay.pack===i)+'">'
      + (p.best?'<span class="chip chip-a" style="height:20px;font-size:11px;align-self:flex-start;margin-bottom:6px">Le plus choisi</span>':'<span style="height:26px"></span>')
      + '<span class="n">'+p.n+'</span><span class="c tnum">'+p.c+'</span><span class="h">invitations</span><span class="p">'+priceH(p.k)+'</span><span class="h">'+esc(p.h)+'</span></button>').join('')+'</div>'
    + opsField();
}

function report(id){
  const x = itemById(id);
  modal('Signaler '+(isTalMode()?'ce projet':'ce profil'),
    '<p>Ton signalement est anonyme pour '+esc(handleOf(x))+'. Une personne de l\'équipe le lit sous 48 h.</p>'
    + '<div class="field"><label>Motif</label><div class="col" style="gap:6px">'+['Faux profil ou usurpation','Demande d\'argent ou arnaque','Propos déplacés','Autre raison'].map((l,i)=>
      '<button class="opt radio" data-act="rep-reason" aria-pressed="'+(i===0)+'"><span class="box">'+tick()+'</span><span>'+l+'</span></button>').join('')+'</div></div>'
    + field('repTxt','Précisions','<textarea class="inp" id="repTxt" placeholder="Ce qui s\'est passé, en quelques lignes."></textarea>'),
    '<button class="btn btn-ghost" data-act="close">Annuler</button><button class="btn btn-danger" data-act="report-go" data-id="'+id+'">'+ic('flag')+'Envoyer le signalement</button>');
}

/* ============================================================
   Délégation d'événements
   ============================================================ */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]');
  if(!t) return;
  const a = t.dataset.act, id = t.dataset.id;
  if(t.tagName === 'A') e.preventDefault();
  switch(a){
    case 'go': if(S.layer) closeLayer(); go(t.dataset.v); break;
    case 'tab': { const nt = t.dataset.t;
      if(['invitations','matchs'].includes(nt)) S.view = 'connexions'; else if(['decouvrir','favoris'].includes(nt)) S.view = 'explorer';
      S.tab = nt; S.focusIdx = 0; render(); break; }
    case 'exp-more': S.expShown = (S.expShown || EXP_PAGE) + EXP_PAGE; repaintExplorer(); break;
    case 'mode': S.mode = t.dataset.m; S.focusIdx = 0; render(); break;
    case 'fskill': S.filterSkill = t.dataset.v; S.focusIdx = 0; render(); break;
    case 'side-toggle': S.sideOpen = !S.sideOpen; $('#side').classList.toggle('open', S.sideOpen);
      if(S.sideOpen) openLayer('<div class="scrim" data-act="side-close" style="z-index:91"></div>', 'side'); break;
    case 'side-close': S.sideOpen = false; $('#side').classList.remove('open'); closeLayer(); break;
    case 'focus-nav': S.focusIdx += parseInt(t.dataset.d, 10); render(); break;
    case 'clear-filters': S.q=''; S.filterSkill=''; S.filterSector=''; S.focusIdx=0; render(); break;
    case 'theme': toggleTheme(); break;
    case 'notifs': drawer(); break;
    case 'cmdk': cmdk(); break;
    case 'cmd-run': { const c = cmdMatches[parseInt(t.dataset.i,10)]; closeLayer(); if(c) c.run(); break; }
    case 'close': closeLayer(); break;
    case 'clear-notifs': S.notifs = []; closeLayer(); renderTop(); render(); break;
    case 'memenu': meMenu(t); break;

    case 'fav': {
      if(S.favs.has(id)) S.favs.delete(id); else S.favs.add(id);
      toast(S.favs.has(id) ? 'Ajouté à tes favoris.' : 'Retiré de tes favoris.');
      render(); refreshFiche(); break;
    }
    case 'open': if(S.layer && S.layer !== 'fiche') closeLayer(); openFiche(id); break;
    case 'owner': openOwner(id); break;
    case 'tproj': openTalentProject(id); break;
    case 'fiche-back': S.fv.sub = null; refreshFiche(); break;
    case 'back-fiche': openFiche(S.fv.id, S.fv.sub); break;
    case 'like': { if(S.likes.has(id)) S.likes.delete(id); else S.likes.add(id);
      render(); refreshFiche(); break; }
    case 'public-edit': closeLayer(); if(S.view !== 'fiche') go('fiche'); break;
    case 'photo-rm': S.me.project.photo = ''; render(); toast('Photo retirée : ta couverture reprend l\'icône de ton secteur.'); break;
    case 'invite': invite(id); break;
    case 'invite-send': inviteSend(id); break;
    case 'accept': acceptInvite(id); break;
    case 'decline': declineInvite(id); refreshFiche(); break;
    case 'go-inv': S.tab = 'invitations'; S.invFilter = 'recv'; go('connexions'); break;
    case 'inv-filter': S.invFilter = t.dataset.v; render(); break;
    case 'open-thread': closeLayer(); openThread(id); break;
    case 'goto-thread': closeLayer(); openThread(id); break;
    case 'thread': { S.activeThread = id; S.mobileThread = true; const th = S.threads.find(x=>x.id===id); if(th) th.unread=false; render(); scrollChat(); break; }
        case 'thread-menu': threadMenu(t, id); break;
    case 'toggle-arch': S.showArch = !S.showArch; render(); break;
    case 'archive': { closeLayer(); const th = S.threads.find(x=>x.id===id); if(!th) break;
      th.archived = !th.archived; if(th.archived){ S.showArch = false; const n = S.threads.find(x=>!x.archived); if(n) S.activeThread = n.id; }
      render(); toast(th.archived ? 'Discussion archivée.' : 'Discussion remise dans la liste.', 'ok'); break; }
    case 'report': closeLayer(); report(id); break;
    case 'rep-reason': t.parentElement.querySelectorAll('.opt').forEach(o=>o.setAttribute('aria-pressed', String(o===t))); break;
    case 'report-go': S.reported.add(id); closeLayer(); toast('Signalement envoyé. Réponse sous 48 h.', 'ok'); break;
    case 'quick': sendMsg(t.dataset.q); break;
    case 'team': closeLayer(); S.atelierId = id; render(); break;

    case 'f-multi': { const k = t.dataset.k, v = t.dataset.v, cur = getPath(k) || [];
      if(k === 'p.sectors' && !cur.includes(v) && cur.length >= 3){ toast('3 secteurs maximum : retire-en un pour en choisir un autre.', 'bad'); break; }
      setPath(k, cur.includes(v) ? cur.filter(x=>x!==v) : cur.concat([v]));
      if(k === 'p.sectors') fixGlyph();
      syncFiche(); break; }
    case 'f-one': setPath(t.dataset.k, t.dataset.v); syncFiche(); break;
    case 'glyph': S.me.project.glyph = t.dataset.g; syncFiche(); break;
        case 'save-fiche': commitFiche(); syncFiche(); toast(missingReq().length ? 'Fiche enregistrée. Elle reste hors ligne tant qu\'il manque une section obligatoire.' : ficheOnline() || ficheKind() === 'perso' ? 'Fiche enregistrée. Elle est à jour dans l\'annuaire.' : 'Fiche enregistrée.', 'ok'); break;
    case 'undo-fiche': restoreBaseline(); render(); toast('Modifications annulées.'); break;
    case 'save-go': commitFiche(); closeLayer(); go(S.pendingGo); toast('Fiche enregistrée.', 'ok'); break;
    case 'discard-go': restoreBaseline(); closeLayer(); go(S.pendingGo); break;
    case 'copy': {
      const txt = t.dataset.t, lbl = t.dataset.l || 'Texte';
      const p = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(txt) : Promise.reject();
      p.then(() => toast(lbl+' copié.', 'ok'), () => toast(lbl+' : '+txt));
      break; }
    case 'qr': modal('Ton code QR',
        '<p>Montre-le dans un incubateur, un meetup ou un salon : la personne tombe directement sur ta fiche publique.</p>'
        + '<div style="display:grid;place-items:center;padding:6px">'+qrSvg()+'</div><p class="hint mono" style="text-align:center">takamatch.bj/'+esc(myHandle())+'</p>',
        '<button class="btn btn-ghost" data-act="copy" data-t="https://takamatch.bj/'+esc(myHandle())+'" data-l="Lien">'+ic('copy')+'Copier le lien</button><button class="btn btn-a" data-act="close">Fermer</button>'); break;
    case 'preview-public': if(S.layer) closeLayer(); openPublic(); break;
    case 'stats': statsModal(); break;

    case 'switch-role': closeLayer(); switchRole(); break;
    case 'buy-credits': closeLayer(); setTimeout(()=>buyCredits(false), 0); break;
    case 'pack': S.pay.pack = +t.dataset.i; $$('.pack').forEach(b=>{ const on = +b.dataset.i === S.pay.pack; b.setAttribute('aria-pressed', on); b.setAttribute('aria-checked', on); }); $('#payBtn').innerHTML = payLabel(); refreshPrices(); break;
    case 'op': paySetMethod(t.dataset.v); break;
    case 'pay': {
      const p = PACKS[S.pay.pack];
      payThen({kind:'credits', key:p.k, label:'Pack '+p.n+' · '+p.c+' crédits', amount:priceOf(p.k).charged}, t, () => {
        S.me.credits += p.c;
        const d = new Date();
        S.payments.unshift({d:String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear(), l:'Pack '+p.n+' · '+p.c+' crédits', a:priceOf(p.k).charged, op:S.pay.op, ref:S.pay.ref, cc:S.pay.cc});
        confetti(); render();
        success(p.c+' crédits ajoutés', 'Paiement de <span class="mono">'+esc(priceT(p.k))+'</span> confirmé via '+esc(S.pay.op)+'. Il te reste <b>'+S.me.credits+' crédits</b>, qui n\'expirent pas.');
      });
      break; }
    case 'why-credits': modal('Pourquoi des crédits ?',
        '<p>Si inviter ne coûtait rien, chaque talent recevrait quarante messages génériques par semaine et n\'en lirait aucun. Les crédits forcent à choisir, et c\'est ce qui fait que les invitations reçues sur TakaMatch obtiennent <b>65 % de réponses</b>.</p>'
        + '<p>Côté talent, explorer et postuler reste gratuit et illimité : la rareté doit être du côté de celui qui sollicite.</p>',
        '<button class="btn btn-a" data-act="close">Compris</button>'); break;
    case 'verify-phone': modal('Vérifier ton téléphone',
        field('tel','Numéro de téléphone','<div class="row" style="gap:8px"><select class="inp" style="width:120px;flex:0 0 auto" id="cc"><option>BJ +229</option><option>TG +228</option><option>CI +225</option><option>SN +221</option></select><input class="inp mono" id="tel" placeholder="01 25 45 25 63" inputmode="tel"></div>')
        + '<p class="hint">On t\'envoie un code à 6 chiffres. Ton numéro n\'est jamais affiché publiquement.</p>',
        '<button class="btn btn-ghost" data-act="close">Annuler</button><button class="btn btn-a" data-act="verify-phone-go">Recevoir le code</button>'); break;
    case 'verify-phone-go': S.me.verifiedPhone = true; closeLayer(); render(); toast('Téléphone vérifié.', 'ok'); break;
    case 'verify-id': modal('Vérifier ton identité',
        '<p>Deux photos : ta pièce d\'identité et un selfie. Elles sont analysées puis supprimées sous 30 jours. Tu obtiens le badge <b>Profil vérifié</b>.</p>'
        + '<div class="grid g2" style="gap:10px">'+[['Pièce d\'identité','idF'],['Selfie','idS']].map(l=>'<label class="card" for="'+l[1]+'" style="padding:22px 14px;text-align:center;border-style:dashed;cursor:pointer">'
          + '<div style="color:var(--ink-3);display:flex;justify-content:center;margin-bottom:6px">'+ic('image')+'</div>'
          + '<div style="font-size:13px;font-weight:600;color:var(--ink-2)">'+l[0]+'</div><div class="hint" id="'+l[1]+'N">Choisir une photo</div>'
          + '<input type="file" accept="image/*" id="'+l[1]+'" class="sr"></label>').join('')+'</div>',
        '<button class="btn btn-ghost" data-act="close">Plus tard</button><button class="btn btn-a" data-act="verify-id-go">Envoyer</button>'); break;
    case 'verify-id-go': S.me.verifiedId = true; closeLayer(); confetti(); render(); toast('Identité vérifiée. Badge obtenu.', 'ok'); pushNotif('verif','Profil vérifié','Le badge de confiance est actif.'); break;
    case 'ask-ref': modal('Demander une référence',
        '<p>Une personne avec qui tu as réellement travaillé confirme en trois clics ce que vous avez fait ensemble. C\'est le signal le plus difficile à falsifier.</p>'
        + field('refMail','Son adresse email','<input class="inp" id="refMail" type="email" placeholder="collegue@exemple.com">')
        + field('refCtx','Ce que vous avez fait ensemble','<input class="inp" id="refCtx" placeholder="Ex. : refonte de l\'app Tchèko, 2024">'),
        '<button class="btn btn-ghost" data-act="close">Annuler</button><button class="btn btn-a" data-act="ask-ref-go">Envoyer la demande</button>'); break;
    case 'ask-ref-go': {
      const v = ($('#refMail')||{}).value || '';
      if(!/^\S+@\S+\.\S+$/.test(v)){ const f = $('#refMail'); f.style.borderColor = 'var(--bad)'; if(!$('#refErr')) f.insertAdjacentHTML('afterend','<p class="hint" id="refErr" style="color:var(--bad-ink)">Saisis une adresse email valide, par exemple nom@exemple.com.</p>'); break; }
      S.me.refs = 1; closeLayer(); render(); toast('Demande envoyée à '+v+'.', 'ok'); break; }
    case 'edit-account': modal('Modifier mon compte',
        '<div class="grid g2" style="gap:12px">'+field('e1','Prénom(s)','<input class="inp" id="e1" value="'+esc(S.me.first)+'">')
        + field('e2','Nom','<input class="inp" id="e2" value="'+esc(S.me.last)+'" disabled>')+'</div>'
        + field('e3','Ville','<input class="inp" id="e3" list="e3List" autocomplete="off" value="'+esc(S.me.city)+'">'+cityDatalist(S.me.city))
        + '<div class="field"><label>Sexe</label><div class="opt-row" role="radiogroup" aria-label="Sexe">'+['m','f','n'].map(k =>
            '<button class="opt radio" data-act="sex-pick" data-v="'+k+'" aria-pressed="'+(S.me.sex===k)+'"><span class="box">'+tick()+'</span><span>'+SEX_L[k]+'</span></button>').join('')+'</div>'
        + '<p class="hint">Visible seulement après un match. Il ne compte ni dans le score ni dans les filtres.</p></div>'
        + note('', 'lock', 'Le nom de famille est verrouillé depuis l\'inscription : c\'est ce qui rend les documents de l\'Atelier valables.'),
        '<button class="btn btn-ghost" data-act="close">Annuler</button><button class="btn btn-a" data-act="edit-account-go">Enregistrer</button>'); break;
    case 'edit-account-go': {
      const sx = $('#layer .opt[data-act="sex-pick"][aria-pressed="true"]');
      S.me.first = $('#e1').value.trim() || S.me.first; S.me.city = $('#e3').value.trim() || S.me.city; if(sx) S.me.sex = sx.dataset.v;
      closeLayer(); render(); toast('Compte mis à jour.', 'ok'); break; }
    case 'pref': { const k = t.dataset.k; S.prefs[k] = !S.prefs[k]; t.setAttribute('aria-pressed', S.prefs[k]); toast('Préférence enregistrée.'); break; }
    case 'legal': toast('Document juridique en cours de rédaction avec le cabinet.'); break;
    case 'export': toast('Export préparé. Tu recevras un lien par email.', 'ok'); break;
    case 'logout': closeLayer(); modal('Se déconnecter', '<p>Tu seras déconnecté de cet appareil. Tes conversations et ton Atelier restent intacts.</p>',
        '<button class="btn btn-ghost" data-act="close">Annuler</button><button class="btn btn-a" data-act="logout-go">Se déconnecter</button>'); break;
    case 'logout-go': closeLayer(); toast('Prototype : la déconnexion ramène au compte de démonstration.'); break;
    case 'delete-account': modal('Supprimer définitivement mon compte',
        '<p>Ta fiche, tes messages et tes matchs seront effacés. Les personnes avec qui tu as matché gardent l\'historique de vos échanges et le journal de l\'Atelier.</p>'
        + note('bad','alert','<b>Cette action est irréversible.</b>')
        + field('delC','Écris SUPPRIMER pour confirmer','<input class="inp mono" id="delC" autocomplete="off">'),
        '<button class="btn btn-ghost" data-act="close">Annuler</button><button class="btn btn-danger" data-act="delete-go" id="delGo" disabled>Supprimer mon compte</button>'); break;
    case 'delete-go': closeLayer(); toast('Prototype : aucune donnée n\'a été supprimée.'); break;
  }
});

/* Formulaires : envoi du message, du journal, du support. */
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]'); if(!f) return;
  e.preventDefault();
  if(f.dataset.form === 'send') sendMsg();
  else if(f.dataset.form === 'log'){
    const v = $('#logIn').value.trim(); if(!v) return;
    const t = curTeam(); if(!t) return; teamLog(t, v, 'Ajouté par '+S.me.first); render(); toast('Décision inscrite au journal. L\'équipe est prévenue.', 'ok');
    const i = $('#logIn'); if(i) i.focus();
  }
  else if(f.dataset.form === 'support'){
    const v = $('#supportMsg').value.trim();
    if(!v){ const m = $('#supportMsg'); m.style.borderColor = 'var(--bad)'; m.focus(); toast('Écris ton message avant d\'envoyer.', 'bad'); return; }
    $('#supportMsg').value = '';
    success('Message envoyé', 'On te répond à <b>'+esc(S.me.email)+'</b> sous 24 h ouvrées.');
  }
});

/* Fiche : une case quittée avec du texte peut afficher son erreur en rouge. */
document.addEventListener('focusout', e => {
  const el = e.target;
  if(el && el.closest && el.closest('#ficheForm') && (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type !== 'checkbox')) && String(el.value || '').trim()){
    el.dataset.touched = '1'; markRequired();
  }
}, true);
/* Saisie */
document.addEventListener('input', e => {
  const el = e.target;
  if(el.dataset && el.dataset.k && el.closest('#ficheForm') && el.type === 'checkbox'){
    setPath(el.dataset.k, el.checked); el.dataset.touched = '1';
    const sec = el.closest('.fsec'); if(sec) $$('input.inp', sec).forEach(i => { i.disabled = el.checked; });
    syncFiche(); markRequired(); return;
  }
  if(el.dataset && el.dataset.k && el.closest('#ficheForm')){ setPath(el.dataset.k, el.value); syncFiche(); return; }
  if(el.id === 'q'){ S.q = el.value; S.focusIdx = 0; repaintExplorer(); return; }
  if(el.id === 'invMsg'){ syncCounters(); return; }
  if(el.id === 'delC'){ $('#delGo').disabled = el.value.trim() !== 'SUPPRIMER'; return; }

});
document.addEventListener('change', e => {
  const el = e.target;
  if(el.id === 'fSector'){ S.filterSector = el.value; S.focusIdx = 0; render(); }
  else if(el.id === 'sortBy'){ S.sortBy = el.value; S.focusIdx = 0; render(); }
  else if(el.id === 'fSkill'){ S.filterSkill = el.value; S.focusIdx = 0; render(); }
  else if(el.id === 'coverIn'){ loadCover(el.files[0]); el.value = ''; }
  else if(el.id === 'idF' || el.id === 'idS'){ const n = $('#'+el.id+'N'); if(n && el.files[0]) n.textContent = el.files[0].name; }
});

document.addEventListener('keydown', e => {
  if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); if(S.layer === 'cmdk') closeLayer(); else { closeLayer(); cmdk(); } return; }
  if(e.key === 'Escape' && S.layer){ e.preventDefault(); if(S.layer === 'side'){ S.sideOpen = false; $('#side').classList.remove('open'); } closeLayer(); return; }
  if(e.key === 'Tab' && S.layer && S.layer !== 'side'){
    const box = $('#layer .ov-win') || $('#layer .drawer') || $('#layer .cmdbox') || $('#layer .pop');
    if(box){
      const f = Array.from(box.querySelectorAll('button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter(x => !x.disabled && x.offsetParent !== null);
      if(f.length){ const first = f[0], last = f[f.length-1], cur = document.activeElement;
        if(!box.contains(cur)){ e.preventDefault(); first.focus(); }
        else if(e.shiftKey && cur === first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && cur === last){ e.preventDefault(); first.focus(); } }
    }
  }
  if(!S.layer && S.view === 'explorer' && S.mode === 'focus' && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)){
    if(e.key === 'ArrowRight'){ S.focusIdx++; render(); }
    if(e.key === 'ArrowLeft'){ S.focusIdx = Math.max(0, S.focusIdx-1); render(); }
  }
});
function syncOnline(){ $('#offline').hidden = navigator.onLine !== false; }
addEventListener('online', () => { syncOnline(); toast('Connexion rétablie.', 'ok'); });
addEventListener('offline', syncOnline);
if(window.matchMedia) try{ matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => renderTop()); }catch(e){}

/* Un code QR décoratif, stable pour un pseudo donné. */
function qrSvg(){
  const n = 25, cell = 7; let seed = 0; for(const ch of myHandle()) seed = (seed*31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => (seed = (seed*1664525 + 1013904223) >>> 0) / 4294967296;
  let r = '';
  const finder = (x,y) => '<rect x="'+x*cell+'" y="'+y*cell+'" width="'+7*cell+'" height="'+7*cell+'" fill="var(--ink)"/><rect x="'+(x+1)*cell+'" y="'+(y+1)*cell+'" width="'+5*cell+'" height="'+5*cell+'" fill="var(--surface)"/><rect x="'+(x+2)*cell+'" y="'+(y+2)*cell+'" width="'+3*cell+'" height="'+3*cell+'" fill="var(--ink)"/>';
  for(let y=0;y<n;y++) for(let x=0;x<n;x++){
    const inF = (x<8&&y<8)||(x>n-9&&y<8)||(x<8&&y>n-9); if(inF) continue;
    if(rnd() < .48) r += '<rect x="'+x*cell+'" y="'+y*cell+'" width="'+cell+'" height="'+cell+'" fill="var(--ink)"/>';
  }
  return '<svg viewBox="-14 -14 '+(n*cell+28)+' '+(n*cell+28)+'" width="210" height="210" role="img" aria-label="Code QR de ta fiche publique" style="background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg)">'+r+finder(0,0)+finder(n-7,0)+finder(0,n-7)+'</svg>';
}

const COVER = 'assets/images/couverture-projet.jpg';

/* ============================================================
   v3 — fiches en fenêtre, profils des porteurs, J'aime,
   couvertures photo, jauges aux couleurs de la fiche.
   ============================================================ */

/* ---------- Couvertures : photo ajoutée par le porteur, sinon icône de secteur ---------- */
const PHOTOS = {};
PROJECTS.forEach(x => { x.glyph = sector(x.sectors[0]).g; });
function photoOf(x){
  if(!x) return null;
  if(x.photo) return {src:x.photo, p:'50% 50%'};
  const d = PHOTOS[x.id]; return d ? {src:COVER, p:d.p, z:d.z} : null;
}
function photoStyle(ph, zoom){
  return 'background-image:url('+ph.src+');background-position:'+ph.p+';'+(zoom && ph.z ? 'background-size:'+ph.z+'!important;' : '');
}
/* Classe et style d'une couverture de projet. */
function projCover(x){
  const ph = photoOf(x);
  return ph ? {cls:'photo', style:photoStyle(ph, true), ph} : {cls:tintCls('vis', x.hue), style:tintAng(x.hue), ph:null};
}

/* ---------- Profils Talent des porteurs de projet ---------- */
const OWNERS = {};

/* ---------- Projets portés par certains talents (côté Visionnaire) ---------- */
const TALENT_PROJECTS = {};
function talentProjectOf(t){
  const p = TALENT_PROJECTS[t.id]; if(!p) return null;
  return Object.assign({id:'TP-'+t.id, owner:t.name, ownerHandle:t.handle, ownerCity:t.city, ownerVerified:t.verified, glyph:sector(p.sectors[0]).g}, p);
}

/* ---------- J'aime (projets uniquement) ---------- */
function likesOf(x){ return (x.likes||0) + (S.likes.has(x.id) ? 1 : 0); }
function likeHTML(x, big){
  const on = S.likes.has(x.id), n = likesOf(x);
  if(isTalMode() && PROJECTS.includes(x))
    return '<button class="likebtn'+(on?' on':'')+(big?' big':'')+'" data-act="like" data-id="'+x.id+'" aria-pressed="'+on+'" aria-label="'+(on?'Retirer ton J\'aime':'Aimer ce projet')+' ('+n+' J\'aime)">'+ic('heart')+'<span class="tnum">'+n+'</span></button>';
  return '<span class="likebtn ro'+(big?' big':'')+'" aria-label="'+n+' J\'aime">'+ic('heart')+'<span class="tnum">'+n+'</span></span>';
}

/* ---------- Anneaux et jauges : la couleur de la fiche décrite ---------- */
function ringHTML(pct, size, kind){
  size = size || 118;
  kind = kind || (S.view === 'fiche' ? ficheKind() : S.me.role);
  const sw = Math.max(6, Math.round(size*0.085));
  const r = (size - sw)/2, c = 2*Math.PI*r;
  const fs = Math.round(size*(pct >= 100 ? .17 : .2));
  return '<div class="ring2" style="width:'+size+'px;height:'+size+'px" role="img" aria-label="Fiche complète à '+pct+' %">'
    + '<svg viewBox="0 0 '+size+' '+size+'"><circle class="bg" cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" stroke-width="'+sw+'"/>'
    + '<circle class="fg" style="stroke:url(#'+(kind === 'vis' || kind === 'perso' ? 'tmRgVis' : 'tmRgTal')+')" cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" stroke-width="'+sw+'" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+(c*(1-pct/100)).toFixed(1)+'"/></svg>'
    + '<b style="font-size:'+fs+'px">'+pct+'<small>%</small></b></div>';
}

/* ---------- Avatars ---------- */



/* ============================================================
   La fiche détaillée — un seul gabarit pour le mode Cartes,
   les fenêtres pop-up et l'aperçu public.
   kind : 'proj' ou 'tal'. o : {unlocked, self, fav, report}
   ============================================================ */

function scoreCard(s){
  const why = s.w.map(w => '<div class="w'+(w.hit?' hit':'')+'"><b>'+esc(w.l)+'<br><span style="font-weight:500;color:var(--ink-3);font-size:11.5px">'+esc(w.d)+'</span></b><span class="pts">'+w.pts+'/'+w.max+'</span></div>').join('');
  return '<div class="card card-pad"><div class="lbl" style="margin-bottom:6px">Compatibilité</div>'
    + '<div class="row" style="align-items:baseline;gap:6px;margin-bottom:12px"><span style="font-family:var(--disp);font-size:40px;font-weight:600;color:'+(s.total>=70?'var(--ok-ink)':s.total>=40?'var(--warn-ink)':'var(--ink-3)')+'" class="tnum">'+s.total+'</span><span class="dim" style="font-weight:600">/ 100</span></div>'
    + '<div class="score-why">'+why+'</div>'
    + '<p class="hint" style="margin-top:12px">Ce score vient de ta fiche. <a href="#" data-act="go" data-v="fiche">Complète-la</a> et il se précise.</p></div>';
}
function detailOpts(x){ return {unlocked:isUnlocked(x.id), fav:true, report:true}; }

/* ---------- Explorer : mode Cartes ---------- */
function focusView(list){
  if(!list.length) return emptyState();
  const i = clamp(S.focusIdx, 0, list.length-1); S.focusIdx = i;
  const {x, s} = list[i];
  const pager = '<div class="pager">'
    + '<button class="btn btn-ghost btn-sm" data-act="focus-nav" data-d="-1" '+(i===0?'disabled':'')+'>'+ic('back')+'Précédente</button>'
    + '<span class="mono"><b>'+String(i+1).padStart(2,'0')+'</b> / '+String(list.length).padStart(2,'0')+'</span>'
    + '<button class="btn btn-ghost btn-sm" data-act="focus-nav" data-d="1" '+(i===list.length-1?'disabled':'')+'>Suivante'+ic('chev')+'</button></div>';
  return '<div class="focus"><div class="col" style="gap:0;min-width:0">'+pager
    + '<article class="detail">'+detailHTML(x, isTalMode() ? 'proj' : 'tal', detailOpts(x))+'</article></div>'
    + '<div class="col" style="gap:14px">'+scoreCard(s)+ctaCard(x)+'</div></div>';
}

/* ---------- La fenêtre de fiche ---------- */

function openFiche(id, sub){
  const x = itemById(id); if(!x.id) return;
  S.fv = {id, sub:sub||null};
  if(S.layer === 'fiche'){ refreshFiche(); const w = $('#ficheWin'); if(w) w.scrollTop = 0; return; }
  openLayer('<div class="ov" role="dialog" aria-modal="true" aria-label="Fiche détaillée"><div class="ov-bg" data-act="close"></div>'
    + '<div class="ov-win xl" id="ficheWin">'+ficheWinInner()+'</div></div>', 'fiche');
  const cl = $('#ficheWin .fw-h [data-act="close"]'); if(cl) try{ cl.focus({preventScroll:true}); }catch(e){}
}
function refreshFiche(){
  if(S.layer !== 'fiche' || !S.fv) return;
  const w = $('#ficheWin'); if(!w) return;
  const top = w.scrollTop; w.innerHTML = ficheWinInner(); w.scrollTop = top;
}
/* Depuis le mode Cartes (hors fenêtre), le profil du porteur s'ouvre directement. */
function openOwner(id){ if(S.layer === 'fiche') { S.fv.sub = 'owner'; refreshFiche(); $('#ficheWin').scrollTop = 0; } else openFiche(id, 'owner'); }
function openTalentProject(id){ if(S.layer === 'fiche') { S.fv.sub = 'tproj'; refreshFiche(); $('#ficheWin').scrollTop = 0; } else openFiche(id, 'tproj'); }

/* ---------- Ta fiche, vue par les autres ---------- */




/* ---------- Cartes de l'annuaire ---------- */

/* ---------- Barre d'outils d'Explorer : secteur et compétence en listes ---------- */



/* ---------- Palette de commandes, avec son bouton de fermeture ---------- */
function cmdk(){
  cmdSel = 0; cmdMatches = CMDS().slice(0, 12);
  openLayer('<div class="scrim" data-act="close"></div>'
    + '<div class="cmdk"><div class="cmdbox" role="dialog" aria-modal="true" aria-label="Rechercher ou aller à">'
    + '<div class="cmd-row">'+ic('search')+'<input id="cmdIn" placeholder="Un écran, un projet, un @pseudo…" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="cmdList">'
    + '<button class="iconbtn iconbtn-lg" data-act="close" aria-label="Fermer">'+ic('x')+'</button></div>'
    + '<div class="cmdlist scroll" id="cmdList" role="listbox"></div></div></div>', 'cmdk');
  drawCmd();
  const inp = $('#cmdIn');
  try{ inp.focus(); }catch(e){}
  inp.addEventListener('input', () => {
    const q = inp.value.trim().toLowerCase();
    cmdMatches = CMDS().filter(c => c.l.toLowerCase().includes(q)).slice(0, 12);
    cmdSel = 0; drawCmd();
  });
  inp.addEventListener('keydown', e => {
    if(e.key === 'ArrowDown'){ e.preventDefault(); cmdSel = Math.min(cmdSel+1, cmdMatches.length-1); drawCmd(); }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); cmdSel = Math.max(cmdSel-1, 0); drawCmd(); }
    else if(e.key === 'Enter'){ e.preventDefault(); const c = cmdMatches[cmdSel]; if(c){ closeLayer(); c.run(); } }
  });
}

/* ---------- Barre latérale : la jauge seule, aux couleurs du rôle ---------- */

/* ---------- Ma fiche Projet : secteurs, puis couverture sur deux colonnes ---------- */
function fixGlyph(){
  const p = S.me.project, ok = p.sectors.map(id => sector(id).g);
  if(!ok.includes(p.glyph)) p.glyph = ok[0] || '💡';
}
function coverField(){
  const p = S.me.project;
  const photo = p.photo
    ? '<div class="ph-prev" style="background-image:url('+p.photo+')" role="img" aria-label="Ta photo de couverture"></div>'
      + '<div class="row" style="gap:8px;margin-top:8px"><label class="btn btn-ghost btn-sm" for="coverIn">'+ic('image')+'Remplacer</label>'
      + '<button type="button" class="btn btn-quiet btn-sm" data-act="photo-rm">'+ic('trash')+'Retirer</button></div>'
    : '<label class="ph-drop" for="coverIn">'+ic('image')+'<b>Ajouter une photo</b><span>JPG ou PNG, de préférence en paysage</span></label>';
  return '<div class="cover-grid">'
    + '<div><div class="lbl" style="margin-bottom:8px">Ta photo de couverture</div>'+photo
    +   '<input type="file" id="coverIn" accept="image/png,image/jpeg,image/webp" class="sr">'
    +   '<p class="hint" style="margin-top:8px">Une vraie photo (ton équipe, ton terrain, ton produit) rend ta fiche plus visible dans la mosaïque et plus crédible aux yeux des talents.</p></div>'
    + '<div><div class="lbl" style="margin-bottom:8px">Ou une icône</div>'
    +   '<div class="glyphs" role="group" aria-label="Icône de couverture">'+SECTORS.map(s => {
          const ok = p.sectors.includes(s.id);
          return '<button type="button" data-act="glyph" data-g="'+s.g+'" data-s="'+s.id+'" aria-pressed="'+(ok && p.glyph===s.g)+'"'+(ok?'':' disabled')
            + ' title="'+(ok ? esc(s.l) : 'Coche '+esc(s.l)+' dans les secteurs pour utiliser cette icône')+'" aria-label="'+esc(s.l)+'">'+s.g+'</button>'; }).join('')+'</div>'
    +   '<p class="hint" style="margin-top:8px" id="glyphHint">'+(p.photo ? 'Utilisée seulement si tu retires ta photo.' : 'Seules les icônes de tes secteurs sont disponibles.')+'</p></div>'
    + '</div>';
}



/* Photo de couverture : lue sur l'appareil, réduite, gardée en mémoire. */
function loadCover(file){
  if(!file || !/^image\//.test(file.type)) return toast('Choisis une image JPG ou PNG.', 'bad');
  const rd = new FileReader();
  rd.onload = () => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 1200 / img.width), cv = document.createElement('canvas');
      cv.width = Math.round(img.width*k); cv.height = Math.round(img.height*k);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      try{ S.me.project.photo = cv.toDataURL('image/jpeg', .8); }catch(e){ S.me.project.photo = rd.result; }
      render(); toast('Photo ajoutée. Enregistre pour la publier.', 'ok');
    };
    img.onerror = () => toast('Cette image ne peut pas être lue.', 'bad');
    img.src = rd.result;
  };
  rd.readAsDataURL(file);
}

/* ---------- Connexions : matchs avec Voir, couvertures photo ---------- */


/* ============================================================
   v4 — L'Atelier en équipe (porteur administrateur, talents
   qui valident), le groupe, Takam, la limite de 3 projets,
   le sexe, et l'expiration à 10 jours.
   ============================================================ */
Object.assign(P, {
  takam:'<rect x="4.5" y="8" width="15" height="11.5" rx="3.2"/><path d="M12 4.5V8"/><circle cx="12" cy="3.6" r="1.1"/><path d="M9.2 13.2h.01M14.8 13.2h.01"/><path d="M9.5 16.3h5"/>',
  logout:'<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M9 16l-4-4 4-4"/><path d="M5 12h10"/>',
});
const INV_DAYS = 10, MAX_ENGAGE = 3;
const SEX_L = {m:'Masculin', f:'Féminin', n:'Ne pas préciser'};
/* Accord selon le sexe de la personne dont on parle ; forme neutre si non précisé. */
const g = (sex, m, f, n) => sex === 'f' ? f : sex === 'm' ? m : (n == null ? m : n);

/* ---------- Sexe des personnes de la démo ---------- */
const SEX_TAL = {};
TALENTS.forEach(t => { t.sex = SEX_TAL[t.id] || 'n'; });
const SEX_OWN = {};
PROJECTS.forEach(p => { p.ownerSex = SEX_OWN[p.id] || 'n'; });
Object.keys(OWNERS).forEach(k => { OWNERS[k].sex = SEX_OWN[k] || 'n'; });
S.me.sex = S.me.sex || 'm'; DEMO_ME.sex = 'm';
/* Deux talents déjà engagés sur 3 projets (côté Visionnaire). */
const FULL = new Set();

/* ============================================================
   Le modèle d'équipe
   Côté Talent : une équipe par projet rejoint (id = projet).
   Côté Visionnaire : une seule équipe, celle de son projet.
   ============================================================ */
DOMAINS.push({id:'juridique', l:'Juridique et conformité'});
const memberMe = role => ({id:'me', name:myName(), first:S.me.first, role, sex:S.me.sex, hue:S.me.avatarHue, me:true});
const memberTal = t => ({id:t.id, name:t.name, first:firstName(t.name), role:'tal', sex:t.sex, hue:t.hue});
const memberOwner = p => ({id:'P-'+p.id, name:p.owner, first:firstName(p.owner), role:'vis', sex:p.ownerSex, hue:p.hue});
function newTeam(id, title, glyph, members){
  const t = {id, title, glyph, members, equity:{}, vesting:'Pas encore décidé',
    milestones:MILESTONES.map(m => Object.assign({done:false, d:null}, m)),
    roles:{}, log:[], props:[], objectives:[], group:[], takChat:[], since:new Date(), unreadGroup:0};
  DOMAINS.forEach(d => t.roles[d.id] = '');
  members.filter(m => m.role === 'tal').forEach(m => t.equity[m.id] = 15);
  return t;
}
const porteurOf = t => t.members.find(m => m.role === 'vis');
const talentsOf = t => t.members.filter(m => m.role === 'tal');
const isAdmin = t => !!(t && porteurOf(t).me);
const memberById = (t, id) => t.members.find(m => m.id === id) || (t.former || []).find(m => m.id === id) || {first:'—', name:'—', role:'tal'};
const porteurShare = t => 100 - talentsOf(t).reduce((a, m) => a + (t.equity[m.id]||0), 0);
const shareOf = (t, id) => porteurOf(t).id === id ? porteurShare(t) : (t.equity[id]||0);


function teamLog(t, txt, m, d){ t.log.unshift({t:txt, m:m||'', d:d||new Date()}); }

function isUnlocked(id){ return S.matches.some(m => m.id === id) || S.left.has(id); }

/* ---------- Propositions à valider ---------- */
function propose(t, kind, label){
  t.props = t.props.filter(p => p.kind !== kind);
  t.props.unshift({id:uid(), kind, t:label, d:new Date(), val:{}});
  if(isAdmin(t)) simulateValidation(t, t.props[0]);
}
/* Côté porteur, les talents de la démo valident d'eux-mêmes au bout d'un moment. */
function simulateValidation(t, p){
  const tals = talentsOf(t).filter(m => !(window.TMData && TMData.on) || TMData.isDemo(m.id)); if(!tals.length) return;
  const who = tals[(Math.random()*tals.length)|0];
  setTimeout(() => {
    if(!t.props.includes(p) || p.val[who.id]) return;
    p.val[who.id] = true;
    pushNotif('check', who.first+' a validé', '« '+p.t+' »');
    if(S.view === 'atelier' && !S.layer) render(); else syncSide();
  }, 5000 + Math.random()*3000);
}
const pendingFor = (t, id) => t.props.filter(p => !p.val[id]);
const missingOn = (t, p) => talentsOf(t).filter(m => !p.val[m.id]);

/* ---------- Tâches ---------- */
const allTasks = t => t.objectives.flatMap(o => o.tasks);
const isLate = k => k.status !== 'done' && k.due && +k.due < Date.now() - 864e5/2;
const dAgo = d => Math.max(0, Math.floor((Date.now() - +d)/864e5));
const dIn = d => Math.ceil((+d - Date.now())/864e5);
function dueTxt(k){
  if(k.status === 'done') return 'faite';
  const n = dIn(k.due);
  return n < 0 ? 'en retard de '+(-n)+' j' : n === 0 ? "aujourd'hui" : n === 1 ? 'demain' : 'dans '+n+' j';
}
const inDays = n => { const d = new Date(); d.setDate(d.getDate()+n); d.setHours(18,0,0,0); return d; };

/* ============================================================
   Takam — des alertes calculées à partir de l'état de l'équipe
   ============================================================ */
function takam(t){
  const T = [], M = [], adm = isAdmin(t), P0 = porteurOf(t);
  const done = t.milestones.filter(m => m.done).length;
  const next = t.milestones.findIndex(m => !m.done);
  if(next >= 0){
    const last = t.milestones.filter(m => m.done && m.d).map(m => +m.d).sort((a,b)=>a-b).pop() || +t.since;
    const n = dAgo(last);
    if(n >= 7) T.push({lvl:'warn', t:'Le jalon '+String(next+1).padStart(2,'0')+' « '+t.milestones[next].t+' » attend depuis '+n+' jours. '+(adm ? 'Tu as la main : fixe une date à l\'équipe.' : 'Demandez une date à '+P0.first+'.')});
  }
  if(done >= 4) T.push({lvl:'ok', t:'Bravo : '+done+' jalons sur 6. Vous faites partie des équipes qui tiennent la distance.'});
  else if(done >= 2) T.push({lvl:'ok', t:done+' jalons franchis. La prochaine vraie épreuve, c\'est la période d\'essai : ne la sautez pas.'});
  const late = allTasks(t).filter(isLate);
  if(late.length) T.push({lvl:'warn', t:late.length+' tâche'+(late.length>1?'s':'')+' en retard : '+late.map(k => '« '+k.t+' » ('+memberById(t, k.owner).first+')').join(', ')+'.'});
  const unset = DOMAINS.filter(d => !t.roles[d.id]);
  if(unset.length) T.push({lvl:'info', t:unset.length+' domaine'+(unset.length>1?'s':'')+' sans responsable : '+unset.map(d => d.l.toLowerCase()).join(', ')+'. Sans nom, personne ne décide.'});
  if(!adm){
    pendingFor(t, 'me').forEach(p => M.push({lvl:'warn', t:'Tu n\'as pas validé « '+p.t+' », proposée '+(dAgo(p.d) ? 'il y a '+dAgo(p.d)+' j' : "aujourd'hui")+'.', act:'at-val', id:p.id}));
    allTasks(t).filter(k => k.owner === 'me' && k.status !== 'done' && !k.signaled).forEach(k => {
      const n = dIn(k.due);
      if(n < 0) M.push({lvl:'warn', t:'Ta tâche « '+k.t+' » est en retard de '+(-n)+' j. Signale-la terminée ou préviens le groupe.'});
      else if(n <= 2) M.push({lvl:'info', t:'Ta tâche « '+k.t+' » est due '+dueTxt(k)+'.'});
    });
    if(t.members.length >= 3){
      const mine = t.group.filter(x => x.from === 'me').map(x => +x.d).pop();
      const n = mine ? dAgo(mine) : dAgo(t.since);
      if(n >= 5) M.push({lvl:'info', t:'Tu n\'as rien écrit dans le groupe depuis '+n+' jours. Un mot suffit pour rester dans le rythme.', act:'at-tab', tab:'groupe'});
    }
  } else {
    t.props.forEach(p => { const miss = missingOn(t, p); if(miss.length) M.push({lvl:'info', t:miss.map(m => m.first).join(' et ')+(miss.length>1?' n\'ont':' n\'a')+' pas encore validé « '+p.t+' ».', act:'at-nudge', id:p.id}); });
    allTasks(t).filter(k => k.signaled && k.status !== 'done').forEach(k => { const m = memberById(t, k.owner);
      M.push({lvl:'warn', t:m.first+' a signalé « '+k.t+' » terminée. Confirme-la pour que la progression suive.', act:'at-confirm', id:k.id}); });
    talentsOf(t).forEach(m => { const last = t.group.filter(x => x.from === m.id).map(x => +x.d).pop();
      const n = last ? dAgo(last) : dAgo(t.since);
      if(t.members.length >= 3 && n >= 6) M.push({lvl:'info', t:m.first+' est '+g(m.sex,'silencieux','silencieuse','sans nouvelles')+' dans le groupe depuis '+n+' jours. Un message de ta part ?'}); });
  }
  return {team:T, me:M};
}
function takamMeCount(){ return Object.values(S.teams).reduce((a, t) => a + takam(t).me.filter(x => x.lvl === 'warn').length, 0); }
const TAKAM_REPLIES = [
  [/retard|lent|bloqu/i, "Un retard n'est pas un drame, un retard silencieux l'est. Dites dans le groupe ce qui bloque et fixez une nouvelle date ensemble, aujourd'hui."],
  [/capital|part|equity|vesting/i, "Décidez le capital à froid, maintenant. Le porteur propose, chacun valide ou dit pourquoi pas. Une répartition fixée après six mois se négocie toujours mal."],
  [/motiv|fatigu|décourag|decourag/i, "Regarde ce que vous avez déjà franchi. Choisis une seule tâche pour cette semaine et termine-la : la motivation revient avec les résultats, pas avant."],
  [/r[oô]le|qui d[ée]cide/i, "Un domaine, un responsable. Ça n'empêche pas d'en discuter, ça évite de rester bloqués. Le porteur attribue, l'équipe valide."],
];
function takamReply(q){
  const r = TAKAM_REPLIES.find(x => x[0].test(q));
  return r ? r[1] : "Bien noté. Mon conseil : transforme ça en tâche dans le plan d'action, avec un responsable et une date. Ce qui n'a pas de date n'avance pas.";
}

/* ============================================================
   Données de démonstration
   ============================================================ */


/* ============================================================
   Limite d'engagement : 3 projets par talent
   ============================================================ */
const engagedN = () => isTalMode() ? S.matches.length : 0;
const isFull = () => isTalMode() && engagedN() >= MAX_ENGAGE;





/* ============================================================
   Coquille : statut en ligne + rôle au-dessus de la jauge
   ============================================================ */




/* La carte En ligne / Hors ligne de Ma fiche : même taille, seuls les textes changent. */



/* ============================================================
   Cartes et fiches : 10 jours, projets complets, sexe
   ============================================================ */



/* ============================================================
   Invitations, matchs, désengagement
   ============================================================ */

function inviteSend(id){
  const x = itemById(id); if(!x.id) return;
  if(navigator.onLine === false){
    $('#invErr').innerHTML = '<div class="card card-pad" style="background:var(--bad-bg);border-color:transparent;padding:14px"><div class="lbl" style="color:var(--bad-ink)">Envoi impossible</div>'
      + '<p style="font-size:13.5px;color:var(--bad-ink);margin-top:4px">Connexion perdue. Ton message est conservé, réessaie dès le retour du réseau.</p></div>';
    return;
  }
  const msg = ($('#invMsg') && $('#invMsg').value.trim()) || '';
  if(!isTalMode()) S.me.credits = Math.max(0, S.me.credits - 1);
  S.invitesSent.unshift({id, status:'sent', min:0, msg});
  closeLayer();
  toast('Invitation envoyée à '+handleOf(x)+'.', 'ok');
  pushNotif('send', 'Invitation envoyée', titleOf(x));
  render();
  $('#topbar').classList.add('busy');
  setTimeout(() => {
    $('#topbar').classList.remove('busy');
    const inv = S.invitesSent.find(i=>i.id===id && i.status==='sent'); if(!inv) return;
    if(Math.random() < 0.65){
      inv.status = 'accepted';
      if(isFull()){ pushNotif('spark', x.title+' a accepté', 'Libère une place pour rejoindre le projet.'); render();
        return fullModal({type:'join', id}, '<b>'+esc(x.title)+'</b> a accepté ton invitation. Il te faut une place libre pour rejoindre l\'équipe.'); }
      createMatch(id, true);
    } else { inv.status = 'declined'; pushNotif('x', 'Invitation déclinée', titleOf(x)+'. Ça arrive, continue.');
      toast('Invitation déclinée. Ce n\'est pas personnel.', 'bad'); if(!S.layer) render(); }
  }, 2600);
}

function acceptInvite(id){
  const inv = S.invitesRecv.find(i=>i.id===id); if(!inv) return;
  if(isFull()) return fullModal({type:'accept', id});
  inv.status = 'accepted'; createMatch(id, true); render();
}
function matchesPanel(){
  if(!S.matches.length) return '<div class="card">'+emptyBox('🤝','Pas encore de match',"Un match se produit quand une invitation est acceptée. C'est à ce moment que les identités se dévoilent et que l'Atelier s'ouvre.")+'</div>';
  return (isTalMode() ? '<div class="privacy">'+ic('users')+'<span>Tu es engagé'+g(S.me.sex,'','e','·e')+' sur <b class="mono">'+engagedN()+'/3</b> projets. Un talent rejoint 3 projets au plus en même temps.</span></div>' : '')
    + '<div class="deck">'+S.matches.map(m => {
    const x = itemById(m.id); if(!x.id) return '';
    const tal = isTalMode(), t = teamOfItem(m.id);
    const done = t ? t.milestones.filter(k=>k.done).length : 0;
    const cv = tal ? projCover(x) : {cls:tintCls('tal', x.hue), style:tintAng(x.hue)};
    return '<article class="pcard'+(tal?'':' person')+'"><div class="cover '+cv.cls+'" style="'+(tal?'height:96px;':'')+cv.style+'">'
      + (tal ? (cv.ph ? '' : '<span class="glyph" aria-hidden="true">'+x.glyph+'</span>') : '<span class="portrait">'+avatarOf(x,72)+'</span>')
      + '<span class="chip chip-onart" style="position:absolute;top:9px;left:9px">'+ic('spark')+'Match · '+ago(m.min)+'</span></div>'
      + '<div class="body"><h3>'+esc(tal?x.title:x.name)+'</h3>'
      + '<div class="who">'+esc(tal?('Équipe de '+(t ? t.members.length : 2)):x.city)+'</div>'
      + '<div class="score-why" style="width:100%"><div class="w'+(done?' hit':'')+'"><b>Jalons de l\'Atelier</b><span class="pts">'+done+'/6</span></div></div>'
      + '<div class="foot" style="width:100%"><button class="btn btn-soft btn-sm" style="flex:1" data-act="open-thread" data-id="'+x.id+'">'+ic('chat')+'Discuter</button>'
      + '<button class="btn btn-ghost btn-sm" data-act="open-atelier" data-id="'+x.id+'" aria-label="Ouvrir l\'Atelier">'+ic('tools')+'</button>'
      + '<button class="btn btn-ghost btn-sm" data-act="open" data-id="'+x.id+'">Voir</button></div></div></article>';
  }).join('')+'</div>';
}

/* ============================================================
   Messages : conversations privées et groupes d'équipe
   ============================================================ */


function groupChat(t, inputId, formName){
  return '<div class="chat-b scroll" id="chatBody" aria-live="polite"><div class="bub sys">'+ic('users')+'Groupe de l\'équipe '+esc(t.title)+' · '+t.members.length+' membres</div>'+groupBubbles(t, S._gGrew)
    + (S.typing ? '<div class="typing" aria-label="En train d\'écrire"><i></i><i></i><i></i></div>' : '')+'</div>'
    + '<form class="chat-f" data-form="'+formName+'"><input class="inp" id="'+inputId+'" placeholder="Écris au groupe…" autocomplete="off" aria-label="Message au groupe">'
    + '<button class="btn btn-a" type="submit" aria-label="Envoyer">'+ic('send')+'</button></form>';
}




/* ============================================================
   L'Atelier
   ============================================================ */
function lockAttr(t){ return isAdmin(t) ? '' : ' data-lock="1"'; }
function valAvatars(t, p){
  return '<span class="val-av">'+talentsOf(t).map(m => '<span class="va'+(p.val[m.id]?' ok':'')+'" title="'+esc(m.first)+(p.val[m.id]?' a validé':' n\'a pas encore validé')+'">'
    + memAv(m, 24)+'<i>'+(p.val[m.id] ? tick() : '')+'</i></span>').join('')+'</span>';
}

function validationsPanel(t){
  if(isAdmin(t)){
    return '<section class="panel"><div class="sec-t">'+ic('usercheck')+'<h3>Validations de l\'équipe</h3></div>'
      + (t.props.length ? '<ul class="val-l">'+t.props.map(p => { const miss = missingOn(t, p);
          return '<li><div class="grow"><b>'+esc(p.t)+'</b><span class="hint">'+(miss.length ? 'Attend '+miss.map(m=>m.first).join(', ') : 'Validée par toute l\'équipe')+' · '+ago(dAgo(p.d)*1440)+'</span></div>'
            + valAvatars(t, p) + (miss.length ? '<button class="btn btn-quiet btn-sm" data-act="at-nudge" data-id="'+p.id+'">Relancer</button>' : '')+'</li>'; }).join('')+'</ul>'
        : '<p class="hint">Chaque décision que tu prends ici part en validation auprès des talents.</p>')+'</section>';
  }
  const pend = pendingFor(t, 'me'), ok = t.props.filter(p => p.val.me);
  return '<section class="panel val-me"><div class="sec-t">'+ic('usercheck')+'<h3>Tes validations</h3>'+(pend.length ? '<span class="cnt-pill mono">'+pend.length+'</span>' : '')+'</div>'
    + (pend.length ? '<ul class="val-l">'+pend.map(p => '<li><div class="grow"><b>'+esc(p.t)+'</b><span class="hint">Proposée par '+esc(porteurOf(t).first)+' · '+ago(dAgo(p.d)*1440)+'</span></div>'
        + '<div class="row" style="gap:6px"><button class="btn btn-soft btn-sm" data-act="at-val" data-id="'+p.id+'">'+ic('check')+'Je valide</button>'
        + '<button class="btn btn-quiet btn-sm" data-act="at-discuss" data-id="'+p.id+'">En discuter</button></div></li>').join('')+'</ul>'
      : '<p class="hint">Rien n\'attend ton accord. Tu seras prévenu'+g(S.me.sex,'','e','·e')+' à la prochaine proposition.</p>')
    + (ok.length ? '<p class="hint" style="margin-top:10px">'+ic('check')+' Tu as validé '+ok.length+' proposition'+(ok.length>1?'s':'')+'.</p>' : '')+'</section>';
}
function taskRow(t, k){
  const owner = memberById(t, k.owner), mine2 = k.owner === 'me', adm = isAdmin(t);
  const st = k.status === 'done' ? ['chip-ok','Faite'] : isLate(k) ? ['chip-bad','En retard'] : k.status === 'doing' ? ['chip-a','En cours'] : ['','À faire'];
  let act = '';
  if(adm && k.signaled && k.status !== 'done') act = '<button class="btn btn-soft btn-sm" data-act="at-confirm" data-id="'+k.id+'">'+ic('check')+'Confirmer</button>';
  else if(!adm && mine2 && k.status !== 'done' && !k.signaled) act = '<button class="btn btn-ghost btn-sm" data-act="at-signal" data-id="'+k.id+'">Signaler terminée</button>';
  return '<li class="task'+(k.status==='done'?' done':'')+'">'
    + '<button class="chip '+st[0]+' st" data-act="at-task" data-id="'+k.id+'"'+lockAttr(t)+' title="'+(adm?'Changer le statut':'Statut')+'">'+st[1]+'</button>'
    + '<div class="grow"><span class="t">'+esc(k.t)+'</span><span class="hint">'+memAv(owner, 20)+' '+esc(owner.me ? 'Toi' : owner.first)+' · <span class="mono">'+(k.due ? k.due.getDate()+' '+MOIS[k.due.getMonth()] : '—')+'</span> · '+dueTxt(k)
    + (k.signaled && k.status !== 'done' ? ' · <b style="color:var(--warn-ink)">signalée terminée, à confirmer</b>' : '')+'</span></div>'+act+'</li>';
}


/* ---------- Le talent n'a pas la main : un rappel discret ---------- */
let denyT = null;
function denyTip(el){
  const t = curTeam(); if(!t) return;
  let tip = $('#denyTip');
  if(!tip){ tip = document.createElement('div'); tip.id = 'denyTip'; tip.className = 'deny-tip'; tip.setAttribute('role','status'); document.body.appendChild(tip); }
  tip.innerHTML = ic('lock')+'<span>Seul'+g(porteurOf(t).sex,'','e','')+' '+esc(porteurOf(t).first)+', '+g(porteurOf(t).sex,'porteur','porteuse','porteur·se')+' du projet, peut modifier ceci. Tu peux valider ou en parler dans le groupe.</span>';
  const r = el.getBoundingClientRect();
  tip.style.left = clamp(r.left, 12, innerWidth - 332) + 'px';
  tip.style.top = (r.bottom + 8 + 90 > innerHeight ? r.top - 70 : r.bottom + 8) + 'px';
  tip.classList.add('on');
  clearTimeout(denyT); denyT = setTimeout(() => tip.classList.remove('on'), 3000);
}
function guardLock(e){
  const el = e.target.closest && e.target.closest('[data-lock]');
  if(!el || S.view !== 'atelier' || isAdmin(curTeam())) return;
  e.preventDefault(); e.stopPropagation();
  if(e.type !== 'click') denyTip(el);
}
document.addEventListener('pointerdown', guardLock, true);
document.addEventListener('click', guardLock, true);
document.addEventListener('keydown', e => { if([' ','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) guardLock(e); }, true);

/* ---------- Actions de l'Atelier ---------- */
function findTask(t, id){ return allTasks(t).find(k => k.id === id); }
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if(!el) return;
  const a = el.dataset.act, t = curTeam();
  switch(a){
    case 'at-tab': S.atTab = el.dataset.t; if(S.view !== 'atelier') go('atelier'); else { render(); if(S.atTab === 'groupe') scrollChat(); } break;
    case 'tk-tab': S.takTab = el.dataset.v; render(); break;
    case 'at-ms': { if(!t) break; const i = +el.dataset.i, k = t.milestones[i];
      k.done = !k.done; k.d = k.done ? new Date() : null;
      teamLog(t, (k.done ? 'Jalon franchi : ' : 'Jalon rouvert : ') + k.t.charAt(0).toLowerCase() + k.t.slice(1));
      if(k.done) propose(t, 'jalon-'+i, 'Jalon '+String(i+1).padStart(2,'0')+' franchi : '+k.t.charAt(0).toLowerCase()+k.t.slice(1));
      render();
      if(t.milestones.every(x=>x.done)){ confetti(); toast('Tous les jalons sont franchis. Vous êtes prêts.', 'ok'); }
      break; }
    case 'at-val': { if(!t) break; const p = t.props.find(x => x.id === el.dataset.id); if(!p) break;
      p.val.me = true; teamLog(t, S.me.first+' a validé : '+p.t);
      toast('Validé. '+porteurOf(t).first+' est '+g(porteurOf(t).sex,'prévenu','prévenue','prévenu·e')+'.', 'ok'); render(); break; }
    case 'at-discuss': { if(!t) break; const p = t.props.find(x => x.id === el.dataset.id); if(!p) break;
      openTeamChat(t, 'À propos de « '+p.t+' » : '); break; }
    case 'at-nudge': { if(!t) break; const p = t.props.find(x => x.id === el.dataset.id); if(!p) break;
      const miss = missingOn(t, p); toast('Takam a relancé '+miss.map(m=>m.first).join(' et ')+'.', 'ok'); break; }
    case 'at-signal': { if(!t) break; const k = findTask(t, el.dataset.id); if(!k) break;
      k.signaled = true; teamLog(t, S.me.first+' a signalé « '+k.t+' » terminée', 'En attente de la confirmation de '+porteurOf(t).first+'.');
      toast('Signalée. '+porteurOf(t).first+' va la confirmer.', 'ok'); render(); break; }
    case 'at-confirm': { if(!t) break; const k = findTask(t, el.dataset.id); if(!k) break;
      k.status = 'done'; k.signaled = false; teamLog(t, 'Tâche terminée : '+k.t, 'Confirmée par '+S.me.first+'.');
      toast('Tâche confirmée.', 'ok'); render(); break; }
    case 'at-task': { if(!t || !isAdmin(t)) break; const k = findTask(t, el.dataset.id); if(!k) break;
      k.status = k.status === 'todo' ? 'doing' : k.status === 'doing' ? 'done' : 'todo'; k.signaled = false;
      if(k.status === 'done') teamLog(t, 'Tâche terminée : '+k.t);
      render(); break; }
    case 'at-obj-new': S.objForm = true; render(); setTimeout(() => { const i = $('#objIn'); if(i) i.focus(); }, 0); break;
    case 'at-obj-cancel': S.objForm = false; render(); break;
    case 'at-task-new': S.taskForm = el.dataset.o; render(); setTimeout(() => { const i = $('#taskIn'); if(i) i.focus(); }, 0); break;
    case 'at-task-cancel': S.taskForm = null; render(); break;
    case 'at-pacte': { if(!t) break;
      if(t.log.some(l => /Pacte d'associés commandé/.test(l.t))){ toast('Le pacte de cette équipe est déjà commandé : aucun nouveau paiement.', 'ok'); break; }
      const rolesOk = DOMAINS.every(d => t.roles[d.id]);
      const pend = t.props.filter(p => missingOn(t, p).length);
      modal('Générer le pacte d\'associés',
        '<p>Le document est prérempli avec ce que l\'équipe a décidé dans l\'Atelier. Il est relu par un juriste inscrit au barreau de Cotonou avant de vous être remis.</p>'
        + '<div class="col" style="gap:0">'+[['Répartition', t.members.map(m => (m.me?'toi':m.first)+' '+shareOf(t, m.id)+' %').join(' · ')], ['Vesting', t.vesting],
            ['Rôles', rolesOk ? DOMAINS.map(d => d.l+' : '+(memberById(t, t.roles[d.id]).me ? 'toi' : memberById(t, t.roles[d.id]).first)).join(' · ') : 'à compléter'],
            ['Signataires', t.members.length+' associés'], ['Cadre juridique', 'SAS de droit OHADA'], ['Relecture', '72 heures ouvrées']].map(r=>
          '<div class="row" style="justify-content:space-between;gap:12px;font-size:13.5px;padding:10px 0;border-top:1px solid var(--line)"><span style="color:var(--ink-3);font-weight:600">'+esc(r[0])+'</span><span style="font-weight:600;text-align:right;color:var(--ink)">'+esc(r[1])+'</span></div>').join('')+'</div>'
        + (pend.length || !rolesOk || t.vesting === 'Pas encore décidé' ? note('warn','alert', pend.length ? pend.length+' proposition'+(pend.length>1?'s attendent':' attend')+' encore la validation d\'un talent. Le pacte ne sera signé qu\'une fois tout validé.' : 'Il reste des choix ouverts : le juriste vous posera la question.') : '')
        + note('', 'info', 'Dans le produit, le pacte arrive en PDF à signer par chaque associé.'),
        '<button class="btn btn-ghost" data-act="close">Annuler</button><button class="btn btn-a" data-act="at-pacte-go">'+ic('file')+'Commander · '+priceH('pacte')+'</button>');
      break; }
    case 'at-pacte-go': if(!t) break; closeLayer();
      if(t.log.some(l => /Pacte d'associés commandé/.test(l.t))){ toast('Le pacte de cette équipe est déjà commandé.', 'ok'); break; }
      teamLog(t, 'Pacte d\'associés commandé', 'Relecture juridique en cours, retour sous 72 h.');
      pushNotif('file', 'Pacte en préparation', 'Un juriste relit votre document.'); render(); toast('Commande enregistrée. L\'équipe est prévenue.', 'ok'); break;
    case 'leave': closeLayer(); leaveModal(el.dataset.id); break;
    case 'leave-reason': el.parentElement.querySelectorAll('.opt').forEach(o => o.setAttribute('aria-pressed', String(o === el))); break;
    case 'leave-go': doLeave(S.leaveId); break;
    case 'leave-back': { const pj = S.pendingJoin; closeLayer(); fullModal(pj); break; }
    case 'open-atelier': closeLayer(); S.atelierId = isTalMode() ? el.dataset.id : S.me.project.id; S.atTab = 'bord'; go('atelier'); break;
    case 'online': setFicheOnline(!ficheOnline()); paintOnline(); toast(ficheOnline() ? (isTalMode() ? 'Ta fiche Talent est visible dans l\'annuaire.' : projName(S.me.project)+' est visible dans l\'annuaire.') : 'Fiche masquée de l\'annuaire. Tes conversations restent ouvertes.'); break;
    case 'sex-pick': el.parentElement.querySelectorAll('.opt').forEach(o => o.setAttribute('aria-pressed', String(o === el))); break;
  }
});
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]'); if(!f) return;
  const t = curTeam(), k = f.dataset.form;
  if(!['gsend','takam','obj','task'].includes(k)) return;
  e.preventDefault(); if(!t) return;
  if(k === 'gsend') sendGroup(t, $('#gIn').value, 'gIn');
  else if(k === 'takam'){ const q = $('#tkIn').value.trim(); if(!q) return;
    t.takChat.push({me:true, txt:q}); t.takChat.push({me:false, txt:takamReply(q)}); render(); const i = $('#tkIn'); if(i) i.focus(); }
  else if(k === 'obj'){ const v = $('#objIn').value.trim(); if(!v) return;
    t.objectives.push({id:uid(), t:v, tasks:[]}); S.objForm = false; teamLog(t, 'Nouvel objectif : '+v); render(); toast('Objectif ajouté. Takam le suivra.', 'ok'); }
  else if(k === 'task'){ const v = $('#taskIn').value.trim(); if(!v) return;
    const o = t.objectives.find(x => x.id === f.dataset.o); if(!o) return;
    const dv = $('#taskDue').value, due = dv ? new Date(dv+'T18:00') : inDays(7);
    o.tasks.push({id:uid(), t:v, owner:$('#taskOwner').value, due, status:'todo'}); S.taskForm = null;
    teamLog(t, 'Tâche confiée à '+(memberById(t, $('#taskOwner').value).me ? 'toi' : memberById(t, $('#taskOwner').value).first)+' : '+v); render(); }
}, true);
document.addEventListener('input', e => {
  const el = e.target; if(!el.dataset || !el.dataset.eq) return;
  const t = curTeam(); if(!t || !isAdmin(t)) return;
  const id = el.dataset.eq, others = talentsOf(t).filter(m => m.id !== id).reduce((a, m) => a + (t.equity[m.id]||0), 0);
  let v = parseInt(el.value, 10); if(100 - others - v < 20){ v = 100 - others - 20; el.value = v; }
  t.equity[id] = v;
  t.members.forEach(m => { const out = $('#eqv-'+m.id); if(out) out.textContent = shareOf(t, m.id)+' %'; });
  $$('.eq-row').forEach((row, i) => { const m = t.members[i]; const b = row.querySelector('.eq-bar i'); if(b && m) b.style.width = shareOf(t, m.id)+'%'; });
});
document.addEventListener('change', e => {
  const el = e.target, t = curTeam(); if(!t || !isAdmin(t)) return;
  if(el.dataset && el.dataset.eq){ const lbl = t.members.map(m => (m.me ? S.me.first : m.first)+' '+shareOf(t, m.id)+' %').join(', ');
    teamLog(t, 'Capital proposé', lbl); propose(t, 'capital', 'Capital : '+lbl); render(); }
  else if(el.id === 'vesting2'){ t.vesting = el.value; teamLog(t, 'Vesting proposé : '+el.value); propose(t, 'vesting', 'Vesting : '+el.value); render(); }
  else if(el.dataset && el.dataset.role){ t.roles[el.dataset.role] = el.value; const d = DOMAINS.find(x => x.id === el.dataset.role), m = memberById(t, el.value);
    teamLog(t, d.l+' : '+(el.value ? (m.me ? S.me.first : m.first) : 'à décider'));
    propose(t, 'roles', 'Rôles : '+DOMAINS.filter(x => t.roles[x.id]).map(x => x.l.toLowerCase()+' à '+(memberById(t, t.roles[x.id]).me ? S.me.first : memberById(t, t.roles[x.id]).first)).join(', ')); render(); }
});


/* ============================================================
   v5 — deux profils indépendants, jusqu'à 3 fiches projet,
   score à 4 critères, photos de profil, départs et retraits.
   ============================================================ */
Object.assign(P, {
  rocket: P.rocket,
  dots:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  userx:'<path d="M15 20v-1.6a4.4 4.4 0 0 0-4.4-4.4H6.4A4.4 4.4 0 0 0 2 18.4V20"/><circle cx="8.5" cy="7" r="4"/><path d="m17 8 5 5M22 8l-5 5"/>',
  coins:'<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7"/><path d="M9 14v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-4c0-1.7-2.7-3-6-3"/>',
});

/* ---------- Ce que le porteur propose aux talents ---------- */
Object.assign(PAY[0], {l:'Parts uniquement', h:'des parts au capital, sans rémunération au départ'});
Object.assign(PAY[1], {l:'Parts + petite rémunération', h:'un défraiement dès le début'});
Object.assign(PAY[2], {l:'Rémunération prévue', h:'un revenu est prévu pour le cofondateur'});
/* Le talent ne fixe plus de conditions ni de disponibilité : c'est le porteur qui propose. */
TALENTS.forEach(t => { delete t.pay; delete t.avail; });
NAV.find(n => n.id === 'fiche').l.vis = 'Mes fiches';
NAV.find(n => n.id === 'fiche').short = {tal:'Ma fiche', vis:'Mes fiches'};

/* ---------- Photos de profil ---------- */
const PHOTO_M = 'assets/images/photo-demo-homme.jpg';
const PHOTO_F = 'assets/images/photo-demo-femme.jpg';
/* Jamais deux fois le même visage dans une même équipe. */
const FACE = {};
const faceOf = id => (window.TM_FACE && window.TM_FACE(id)) || ((id === 'me' && S.me.photo) ? S.me.photo : FACE[id] === 'f' ? PHOTO_F : FACE[id] === 'm' ? PHOTO_M : null);
const LOCKPIN = '<span class="lockpin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">'+P.lock+'</svg></span>';

/* ---------- Les fiches projet du compte de démonstration ---------- */
const DEMO_PROJECTS = [];
function blankProject(){
  return {id:'PRJ-'+uid().slice(1,7).toUpperCase(), title:'', glyph:'💡', photo:'', likes:0, sectors:[], seeking:[],
    hook:'', vision:'', traction:'', assets:'', challenges:'', link:'', noLink:false, pace:'serieux', pay:'equity', online:false};
}
const MIN_TXT = TMRules.MIN.hook;   /* minimums réels : js/fiche-rules.js */
const MAX_PROJ = 3, PRICE_VIS = 3000, PRICE_SLOT = 5000, REINVITE_DAYS = 30;
function attachProjectGetter(me){
  Object.defineProperty(me, 'project', {configurable:true, enumerable:false,
    get(){ return this.projects[this.projIdx] || this.projects[0]; },
    set(v){ this.projects[this.projIdx] = v; }});
}
function initAccount(){
  const m = S.me;
  delete m.avail; delete m.pay; delete m.project;
  m.projects = [blankProject()]; m.projIdx = 0;
  attachProjectGetter(m);
  m.visUnlocked = false; m.visSince = null; m.slots = 1;
  S.ctxs = {}; S.prof = {}; S.fPay = ''; S.pubView = 'membre';
}
initAccount();

/* ---------- Fiche active et statut en ligne ---------- */
function ficheKind(){ return isTalMode() ? 'tal' : 'vis'; }
function ficheOnline(){ return isTalMode() ? !!S.me.online : !!S.me.project.online; }
function setFicheOnline(v){ if(isTalMode()) S.me.online = v; else S.me.project.online = v; }
const projName = p => (p && p.title) || 'Projet sans titre';
const TAL_KEYS = ['skills','sectors','level','diploma','status','pace','bio','portfolio','portfolioTitle'];
function ficheSnap(){ return JSON.stringify(isTalMode() ? TAL_KEYS.map(k => S.me[k]) : S.me.project); }
function saveBaseline(){ S.saved = {snap:ficheSnap(), tal:isTalMode(), idx:S.me.projIdx,
  data:structuredClone(isTalMode() ? TAL_KEYS.map(k => S.me[k]) : S.me.project)}; }
function isDirty(){ return !!S.saved && S.saved.tal === isTalMode() && S.saved.idx === S.me.projIdx && S.saved.snap !== ficheSnap(); }
function restoreBaseline(){
  if(!S.saved) return;
  if(S.saved.tal) TAL_KEYS.forEach((k, i) => S.me[k] = structuredClone(S.saved.data[i]));
  else S.me.projects[S.saved.idx] = structuredClone(S.saved.data);
}

/* ============================================================
   Profils et projets indépendants : chaque contexte garde ses
   matchs, ses invitations, ses conversations et ses Ateliers.
   ============================================================ */
const PROJ_KEYS = ['matches','invitesSent','invitesRecv','threads','teams','left','atelierId','activeThread','removed'];
const PROF_KEYS = ['notifs','favs','likes','reported'];
const ctxKey = () => isTalMode() ? 'tal' : 'vis:'+S.me.project.id;
function saveCtx(){
  const o = {}; PROJ_KEYS.forEach(k => o[k] = S[k]); S.ctxs[ctxKey()] = o;
  const q = {}; PROF_KEYS.forEach(k => q[k] = S[k]); S.prof[S.me.role] = q;
}
function loadCtx(){
  const o = S.ctxs[ctxKey()];
  if(o) PROJ_KEYS.forEach(k => S[k] = o[k]); else seedDemo();
  const q = S.prof[S.me.role];
  if(q) PROF_KEYS.forEach(k => S[k] = q[k]);
  S.focusIdx = 0; S.mobileThread = false; S.fv = null;
}
/* L'état d'un autre projet, pour le sélecteur (jalons, alertes). */
function ctxOfProject(pid){ return pid === S.me.project.id && !isTalMode() ? S : S.ctxs['vis:'+pid]; }
function teamOfProject(pid){ const c = ctxOfProject(pid); return c && c.teams ? c.teams[pid] : null; }
function projAlerts(pid){ const t = teamOfProject(pid); return t ? takam(t).me.filter(x => x.lvl === 'warn').length : 0; }
function projJalons(pid){ const t = teamOfProject(pid); return t ? t.milestones.filter(k => k.done).length : 0; }

/* ---------- Score : 4 critères, lisibles ---------- */
function scoreProject(p, me){
  const w = [], need = p.seeking || [];
  const hit = need.filter(s => me.skills.includes(s)), sk = need.length ? hit.length / need.length : 0;
  w.push({l:'Compétences recherchées', pts:Math.round(sk*54), max:54, hit:sk>0,
    d: need.length ? hit.length+' sur '+need.length+' ('+(hit.length ? hit.map(skillL).join(', ') : 'aucune')+')' : '—'});
  const secHit = (p.sectors||[]).filter(s => me.sectors.includes(s)), sec = (p.sectors||[]).length ? secHit.length / p.sectors.length : 0;
  w.push({l:"Secteur d'intérêt", pts:Math.round(sec*19), max:19, hit:sec>0, d: secHit.length ? secHit.map(id => sector(id).l).join(', ') : 'hors de tes secteurs'});
  const ratio = clamp(paceHrs(me.pace)/paceHrs(p.pace), 0, 1);
  w.push({l:'Rythme de travail', pts:Math.round(ratio*18), max:18, hit:ratio>=.9, d:'toi '+paceHrs(me.pace)+' h/sem, attendu '+paceHrs(p.pace)+' h/sem'});
  const [, c1] = cityOf(me.city), [, c2] = cityOf(p.ownerCity), same = me.city === p.ownerCity;
  const loc = same ? 1 : (c1 && c1 === c2 ? .6 : .25);
  w.push({l:'Proximité', pts:Math.round(loc*9), max:9, hit:loc>=.6, d: same ? 'même ville' : (loc === .6 ? 'même pays' : 'à distance')});
  return {total:clamp(w.reduce((a,b) => a+b.pts, 0), 0, 100), w};
}
function scoreTalent(t, me){
  const p = me.project, need = p.seeking || [], w = [];
  const hit = need.filter(s => t.skills.includes(s)), sk = need.length ? hit.length / need.length : 0;
  w.push({l:'Compétences recherchées', pts:Math.round(sk*54), max:54, hit:sk>0,
    d: need.length ? hit.length+' sur '+need.length+' ('+(hit.length ? hit.map(skillL).join(', ') : 'aucune')+')' : 'précise ce que tu cherches'});
  const mySec = p.sectors || [], secHit = (t.sectors||[]).filter(s => mySec.includes(s)), sec = mySec.length ? secHit.length / mySec.length : 0;
  w.push({l:"Secteur d'intérêt", pts:Math.round(sec*19), max:19, hit:sec>0, d: secHit.length ? secHit.map(id => sector(id).l).join(', ') : 'pas ton secteur'});
  const ratio = clamp(paceHrs(t.pace)/paceHrs(p.pace), 0, 1);
  w.push({l:'Rythme de travail', pts:Math.round(ratio*18), max:18, hit:ratio>=.9, d:'de sa part '+paceHrs(t.pace)+' h/sem, attendu '+paceHrs(p.pace)+' h/sem'});
  const [, c1] = cityOf(me.city), [, c2] = cityOf(t.city), same = me.city === t.city;
  const loc = same ? 1 : (c1 && c1 === c2 ? .6 : .25);
  w.push({l:'Proximité', pts:Math.round(loc*9), max:9, hit:loc>=.6, d: same ? 'même ville' : (loc === .6 ? 'même pays' : 'à distance')});
  return {total:clamp(w.reduce((a,b) => a+b.pts, 0), 0, 100), w};
}

/* ---------- Complétion ---------- */
/* Règles communes à l'inscription et à l'outil : js/fiche-rules.js.
   rows : [libellé, rempli, poids, ligne complète] */
function rulesData(kind){
  const m = S.me, p = m.project || {};
  if(kind === 'perso'){ const x = persoOf(m); return {skills:x.skills, level:x.level, bio:x.bio, portfolio:x.portfolio, noPortfolio:x.noPortfolio}; }
  return {first:m.first, last:m.last, handle:m.handle, city:m.city, skills:m.skills, level:m.level, diploma:m.diploma, status:m.status,
    sectors:m.sectors, pace:m.pace, bio:m.bio, portfolio:m.portfolio, noPortfolio:m.noPortfolio,
    project:{title:p.title, sectors:p.sectors, seeking:p.seeking, pace:p.pace, offer:p.pay, hook:p.hook, vision:p.vision,
      traction:p.traction, challenges:p.challenges, link:p.link, noLink:p.noLink}};
}
function completion(kind){
  kind = kind || ficheKind();
  const R = TMRules.rows(kind, rulesData(kind));
  return {pct:TMRules.pct(R), rows:R.map(r => [r.label, r.ok, r.w, r])};
}

/* ---------- Avatars : photo floue avant le match, nette après ---------- */
function avatarOf(t, size, un, role){
  t = t || {}; role = role || t.role || 'tal';
  if(un === undefined) un = isUnlocked(t.id);
  const ph = faceOf(t.id);
  if(ph) return '<span class="av av-'+size+' ph'+(un ? '' : ' locked')+'" aria-hidden="true"><span class="inner" style="background-image:url('+ph+')"></span>'+(un ? '' : LOCKPIN)+'</span>';
  const tc = tintCls(role === 'vis' ? 'vis' : 'tal', (t.hue || 0) + 2), bg = tintAng(t.hue);
  if(un) return '<span class="av av-'+size+' '+tc+'" style="'+bg+'" aria-hidden="true">'+esc(initials(t.name))+'</span>';
  return '<span class="av av-'+size+' '+tc+' locked" style="'+bg+'" aria-hidden="true"><span class="inner '+tc+'" style="width:100%;height:100%;display:grid;place-items:center">'+esc(initials(t.name))+'</span>'+LOCKPIN+'</span>';
}
function memAv(m, size){
  const ph = faceOf(m.id);
  if(ph) return '<span class="av av-'+size+' ph" title="'+esc(m.name)+'" aria-hidden="true"><span class="inner" style="background-image:url('+ph+')"></span></span>';
  return '<span class="av av-'+size+' '+tintCls(m.role === 'vis' ? 'vis' : 'tal', (m.hue||0)+2)+'" style="'+tintAng(m.hue)+'" title="'+esc(m.name)+'" aria-hidden="true">'+esc(initials(m.name))+'</span>';
}
function revealAv(x){
  if(isTalMode()) return thumb(x, 72);
  const ph = faceOf(x.id);
  if(ph) return '<span class="av av-72 ph locked reveal"><span class="inner" style="background-image:url('+ph+')"></span></span>';
  const tc = tintCls('tal', (x.hue||0)+2);
  return '<span class="av av-72 locked reveal '+tc+'" style="'+tintAng(x.hue)+'"><span class="inner '+tc+'" style="width:100%;height:100%;display:grid;place-items:center">'+esc(initials(x.name))+'</span></span>';
}
/* Vignette d'un projet : sa photo de couverture, sinon l'icône de son secteur. */
function projThumb(x, size){
  const ph = photoOf(x);
  if(ph) return '<span class="av av-'+size+' photo" style="'+photoStyle(ph)+'" aria-hidden="true"></span>';
  return '<span class="av av-'+size+' '+tintCls('vis', x.hue||1)+'" style="'+tintAng(x.hue||1)+'font-size:'+Math.round(size*.43)+'px" aria-hidden="true">'+(x.glyph||'💡')+'</span>';
}
function thumb(x, size){ return isTalMode() ? projThumb(x, size) : avatarOf(x, size); }

/* ---------- Ta fiche, vue par les autres ---------- */
function meAsTalent(){
  const m = S.me;
  return {id:'me', name:myName(), handle:m.handle, city:m.city, verified:m.verifiedId, skills:m.skills, level:m.level,
    pace:m.pace, bio:m.bio, sectors:m.sectors, portfolio:m.portfolio, hue:m.avatarHue};
}
function meAsProject(){
  const m = S.me, p = m.project;
  return Object.assign({}, p, {id:'me-proj', owner:myName(), ownerHandle:m.handle, ownerCity:m.city, ownerVerified:m.verifiedId,
    hue:1, likes:p.likes||0, title:p.title || 'Ton projet'});
}

/* ---------- Équipe du projet actif ---------- */
function teamOfItem(id){ return isTalMode() ? S.teams[id] : S.teams[S.me.project.id]; }
function curTeam(){
  if(!isTalMode()){ const t = S.teams[S.me.project.id] || null; S.atelierId = t ? t.id : null; return t; }
  const ids = Object.keys(S.teams);
  if(!S.teams[S.atelierId]) S.atelierId = ids[0] || null;
  return S.atelierId ? S.teams[S.atelierId] : null;
}
const groupTeams = () => Object.values(S.teams).filter(t => t.members.length >= 3 || t.groupClosed);
const removedDays = id => S.removed && S.removed[id] ? dAgo(S.removed[id]) : null;

/* ============================================================
   Données de démonstration, par contexte
   ============================================================ */
function seedDemo(){
  Object.assign(S, {teams:{}, left:new Set(), removed:{}, pendingJoin:null, takTab:null,
    matches:[], threads:[], invitesRecv:[], invitesSent:[], activeThread:null, atelierId:null});
  if(!S.prof[S.me.role]){ S.notifs = []; S.favs = new Set(); S.likes = new Set(); S.reported = new Set(); }
}

/* ============================================================
   Formulaires de fiche
   ============================================================ */
function paceOpts(key){ key = key || 'pace'; const cur = getPath(key);
  return '<div class="col" style="gap:2px">'+PACE.map(p => optBtn('f-one', key, p.id, '<b>'+p.l+'</b> <span class="dim">· '+p.h+'</span>', cur === p.id, true, true)).join('')+'</div>'; }
function payOpts(key){ key = key || 'p.pay'; const cur = getPath(key);
  return '<div class="col" style="gap:2px">'+PAY.map(p => optBtn('f-one', key, p.id, '<b>'+p.l+'</b> <span class="dim">· '+p.h+'</span>', cur === p.id, true, true)).join('')+'</div>'; }
function talentFields(){
  const m = S.me;
  return '<p class="fiche-note"><b style="color:var(--bad)">*</b> Section obligatoire pour que ta fiche soit mise en ligne.</p>'
  + fsec('tools', 'Tes compétences clés', true, optList(SKILLS, 'f-multi', 'skills', m.skills), 'Choisis-en 2 à 4. Au-delà, plus personne ne te croit.')
  + fsec('trend', "Ton niveau d'expérience", true, optList(LEVEL, 'f-one', 'level', m.level, 'opt-row', true))
  + fsec('award', 'Ton diplôme le plus élevé', true, optList(DIPLOMA, 'f-one', 'diploma', m.diploma, 'opt-wrap', true), "Il compte peu dans le score : beaucoup d'excellents cofondateurs sont autodidactes.")
  + fsec('briefcase', 'Ton statut professionnel', true, optList(STATUS, 'f-one', 'status', m.status, 'opt-wrap', true))
  + fsec('compass', "Les secteurs qui t'attirent", true, '<div class="opt-row">'+SECTORS.map(s => optBtn('f-multi','sectors',s.id,s.g+' '+esc(s.l),m.sectors.includes(s.id))).join('')+'</div>')
  + fsec('clock', 'Combien de temps peux-tu vraiment donner ?', true, paceOpts('pace'), isTalMode() ? "C'est la première cause d'échec d'une cofondation. Sois honnête, pas ambitieux. Ce que chaque projet propose (parts, rémunération) est indiqué sur sa fiche." : "Le temps que tu consacres toi-même à tes projets. Les talents le voient sur ta fiche perso.")
  + fsec('link', 'Ton lien portfolio', true,
      '<div class="grid g2" style="gap:10px">'
      + '<input class="inp" id="portfolioTitle" data-k="portfolioTitle" placeholder="GitHub, Behance, LinkedIn…" value="'+esc(m.portfolioTitle)+'" aria-label="Titre du lien"'+(m.noPortfolio ? ' disabled' : '')+'>'
      + '<input class="inp" id="portfolio" data-k="portfolio" placeholder="github.com/tonpseudo" value="'+esc(m.portfolio)+'" aria-label="Adresse du lien"'+(m.noPortfolio ? ' disabled' : '')+'></div>'
      + noneBox('noPortfolio', m.noPortfolio, 'Je n\'ai pas encore de portfolio'),
      'Visible seulement après un match.')
  + fsec('quote', 'Ta signature personnelle', true,
      area('bio', 'bio', 420, "Ce que tu sais faire, ce que tu as déjà livré, et le type de projet que tu cherches.", m.bio),
      "Deux ou trois phrases concrètes valent mieux qu'un paragraphe de généralités. "+TMRules.MIN.bio+" caractères au moins.");
}
function projectFields(){
  const p = S.me.project;
  return '<p class="fiche-note"><b style="color:var(--bad)">*</b> Section obligatoire pour que ta fiche soit mise en ligne.</p>'
  + fsec('file', 'Titre du projet', true,
      '<input class="inp" id="ptitle" data-k="p.title" maxlength="30" placeholder="Le nom de ton projet" value="'+esc(p.title)+'"><div class="cnt-r" data-cnt="ptitle" data-max="30"></div>')
  + fsec('compass', 'Les secteurs du projet', true, '<div class="opt-row" id="secOpts">'+SECTORS.map(s => optBtn('f-multi','p.sectors',s.id,s.g+' '+esc(s.l),p.sectors.includes(s.id))).join('')+'</div>'
      + '<p class="hint" id="secHint" style="margin-top:8px"></p>', '1 à 3 secteurs. Ils décident aussi des icônes disponibles pour ta couverture.')
  + fsec('image', 'Image de couverture', false, coverField())
  + fsec('tools', 'Les compétences que tu recherches', true, optList(SKILLS, 'f-multi', 'p.seeking', p.seeking), 'Elles pèsent 54 points sur 100 dans le score : ce sont elles qui décident qui te voit en haut de liste.')
  + fsec('clock', 'Quel rythme attends-tu de ton cofondateur ?', true, paceOpts('p.pace'))
  + fsec('coins', 'Ce que tu proposes aux talents', true, payOpts('p.pay'), "C'est affiché sur ta fiche, et les talents peuvent filtrer les projets qui prévoient une rémunération.")
  + fsec('zap', 'Le Hook', true, area('hook','p.hook',400,"Le problème que tu résous, en une ou deux phrases. Un chiffre vaut mieux qu'une intention.",p.hook), "Présente le problème que ton projet résout. Impact : capte l'attention en trois secondes. "+TMRules.MIN.hook+" caractères au moins.")
  + fsec('rocket', 'La Vision', true, area('vision','p.vision',320,"Ce que le projet devient dans cinq ans si tout va bien.",p.vision), "Impact : permet au talent d'adhérer à ton ambition. "+TMRules.MIN.vision+" caractères au moins.")
  + fsec('trend', 'La Traction actuelle', false, area('traction','p.traction',320,"Prototype, utilisateurs, premiers revenus, partenariats signés…",p.traction), "Facultatif, mais compte pour atteindre 100 % de remplissage ("+TMRules.MIN.traction+" caractères au moins pour compter). Impact : c'est la section qui fait la différence entre une idée et un projet.")
  + fsec('shield', 'Les Ressources sécurisées', false, area('assets','p.assets',320,"Financements, agréments, matériel, locaux, partenaires déjà acquis.",p.assets), "Impact : rassure sur ce que le talent n'aura pas à construire.")
  + fsec('target', 'Les Défis', true, area('challenges','p.challenges',320,"Ce qui te bloque aujourd'hui et pour quoi tu cherches de l'aide.",p.challenges), "Impact : aide le talent à voir où il apporterait de la valeur. "+TMRules.MIN.challenges+" caractères au moins.")
  + fsec('link', 'Lien externe', true, '<input class="inp" id="plink" data-k="p.link" placeholder="monprojet.bj" value="'+esc(p.link)+'"'+(p.noLink ? ' disabled' : '')+'>'
      + noneBox('p.noLink', p.noLink, 'Mon projet n\'a pas encore de site ni de page'), 'Site, page Facebook, LinkedIn, vidéo de démonstration…');
}
function ficheFields(){ return isTalMode() ? talentFields() : projectFields(); }

/* ============================================================
   La fiche détaillée : chaque profil ne voit que l'autre côté
   ============================================================ */
function detailHTML(x, kind, o){
  o = o || {};
  const proj = kind === 'proj', un = !!o.unlocked;
  const cv = proj ? projCover(x) : null;
  const heroCls = proj ? cv.cls : tintCls(o.perso ? 'vis' : 'tal', x.hue)+' portrait-hero';
  const heroStyle = proj ? cv.style : tintAng(x.hue);
  const heroIn = proj ? (cv.ph ? '' : '<span class="glyph" aria-hidden="true">'+(x.glyph||'💡')+'</span>')
                      : '<span class="portrait">'+avatarOf(x, 80, un, o.perso ? 'vis' : 'tal')+'</span>';
  const btns = (o.fav ? '<button class="iconbtn'+(S.favs.has(x.id)?' on':'')+'" data-act="fav" data-id="'+x.id+'" aria-pressed="'+S.favs.has(x.id)+'" aria-label="'+(S.favs.has(x.id)?'Retirer des favoris':'Ajouter aux favoris')+'">'+ic('star')+'</button>' : '')
    + (o.report ? '<button class="iconbtn" data-act="report" data-id="'+x.id+'" aria-label="Signaler cette fiche">'+ic('flag')+'</button>' : '');
  const handle = proj ? x.ownerHandle : x.handle;
  const name = proj ? esc(x.title) : (un ? esc(x.name) : '<span class="masked-name" aria-label="Nom masqué jusqu\'au match">'+esc(maskName(x.name))+'</span>');
  const verified = proj ? x.ownerVerified : x.verified;
  let sub = '';
  if(proj){
    const who = un || o.self ? esc(x.owner) : '<span class="masked-name" style="font-size:12.5px" aria-label="Nom masqué">'+esc(maskName(x.owner))+'</span> <span class="dim" style="font-size:12.5px">(visible après le match)</span>';
    const ob = o.self || !PROJECTS.includes(x) ? '' : (OWNERS[x.id] ? '<button class="btn btn-ghost btn-sm" data-act="owner" data-id="'+x.id+'">'+ic('idcard')+'Voir sa fiche perso</button>' : '<span class="chip">'+ic('idcard')+'Fiche perso non renseignée</span>');
    sub = '<div class="owner-l"><span>Porté par '+who+'</span>'+ob+'</div>';
  } else if(o.perso){
    sub = '<div class="owner-l"><span class="chip chip-vis">💡 '+(o.projTitle ? 'Porte '+esc(o.projTitle) : 'Visionnaire')+'</span></div>'
      + (!un && !o.self ? '<p class="hint row" style="gap:6px">'+ic('lock')+'Nom réel et photo visibles après le match.</p>' : '');
  } else {
    sub = (!un && !o.self ? '<p class="hint row" style="gap:6px">'+ic('lock')+'Nom réel et photo visibles après le match.</p>' : '')
      + (!o.self && TALENT_PROJECTS[x.id] ? '<div class="owner-l"><span class="chip">'+ic('rocket')+'Porte aussi un projet</span></div>' : '');
  }
  const like = proj && (PROJECTS.includes(x) || o.self) ? likeHTML(x, true) : '';
  const pay = proj ? PAY.find(p => p.id === x.pay) : null;
  const infos = '<div class="row" style="gap:14px;flex-wrap:wrap;font-size:13px;color:var(--ink-2)">'
    + '<span class="row" style="gap:5px">'+ic('pin')+esc(proj ? x.ownerCity : x.city)+'</span>'
    + '<span class="row" style="gap:5px">'+ic('clock')+esc((PACE.find(p => p.id === x.pace)||{}).h||'')+'</span>'
    + (pay ? '<span class="row" style="gap:5px" title="'+esc(pay.h)+'">'+ic('coins')+esc(pay.l)+'</span>' : '')
    + (!proj && x.rate ? '<span class="row" style="gap:5px">'+ic('chat')+esc(x.rate)+'</span>' : '')
    + (un && x.sex && x.sex !== 'n' ? '<span class="row" style="gap:5px">'+ic('usercheck')+(x.sex === 'f' ? 'Femme' : 'Homme')+'</span>' : '')
    + like + '</div>';
  const mineSk = o.self ? [] : mine();
  const skl = proj ? (x.seeking||[]) : (x.skills||[]), anyHit = skl.some(sk => mineSk.includes(sk));
  const chips = '<div class="sk-block"><div class="sk-l">'+(proj ? 'Compétences recherchées' : 'Compétences clés')+(anyHit ? '<span class="sk-hint"> · en couleur : '+(isTalMode() ? 'celles que tu as' : 'celles que tu cherches')+'</span>' : '')+'</div>'
    + '<div class="row" style="gap:6px;flex-wrap:wrap">'+skl.map(sk =>
      '<span class="chip '+(mineSk.includes(sk) ? 'chip-a' : (proj ? '' : (o.perso ? 'chip-vis' : 'chip-tal')))+'">'+esc(skillL(sk))+'</span>').join('')+'</div></div>';
  const defs = proj
    ? [['Le Hook', x.hook, 'Le problème, en deux phrases.'], ['La Vision', x.vision, 'Où va le projet.'],
       ['La Traction actuelle', x.traction, 'Ce qui prouve que ça avance.'], ['Les Ressources sécurisées', x.assets, 'Ce qui est déjà acquis.'],
       ['Les Défis', x.challenges, 'Là où un cofondateur apporterait de la valeur.'],
       ['Ce que le projet propose', pay ? pay.l+' : '+pay.h+'.' : '', '']]
    : [['Sa signature', x.bio, ''], ['Les secteurs qui l\'attirent', (x.sectors||[]).map(id => sector(id).g+' '+sector(id).l).join(' · '), ''],
       ['Profil', refL(LEVEL, x.level) !== '—' ? refL(LEVEL, x.level) : '', '']];
  let secs = defs.filter(d => d[1]).map(d => '<div><span class="sec-l">'+esc(d[0])+'</span>'+(d[2]?'<div class="sec-help">'+esc(d[2])+'</div>':'')+'<div class="sec-b">'+esc(d[1])+'</div></div>').join('');
  if(proj && x.link) secs += '<div><span class="sec-l">Lien externe</span><div class="sec-b"><a href="https://'+esc(x.link)+'" target="_blank" rel="noopener">'+esc(x.link)+'</a></div></div>';
  if(!proj && x.portfolio) secs += '<div><span class="sec-l">Portfolio</span><div class="sec-b">'+(un ? '<a href="https://'+esc(x.portfolio)+'" target="_blank" rel="noopener">'+esc(x.portfolio)+'</a>' : '<span class="row" style="gap:6px;color:var(--ink-3)">'+ic('lock')+'Visible après le match</span>')+'</div></div>';
  if(!secs) secs = '<p class="hint">Aucune section rédigée pour l\'instant.</p>';
  return '<div class="hero '+heroCls+'" style="'+heroStyle+'">'+heroIn
    + (handle ? '<span class="chip chip-handle" style="position:absolute;top:12px;left:14px">@'+esc(handle)+'</span>' : '')
    + (btns ? '<span class="hero-btns">'+btns+'</span>' : '') + '</div>'
    + '<div class="meta"><div class="row" style="gap:10px;flex-wrap:wrap"><h2 style="font-size:24px;flex:1;min-width:180px">'+name+'</h2>'
    +   vBadge(proj ? 'vis' : 'tal', verified)+'</div>'
    +   sub + infos + chips + '</div>'
    + '<div class="secs">'+secs+'</div>';
}
function ficheWinInner(){
  const v = S.fv, x = itemById(v.id); if(!x.id) return '';
  const tal = isTalMode();
  return '<div class="fw-h"><span class="lbl">'+(tal ? 'Fiche Projet' : 'Fiche Talent')+'</span>'
    + '<span style="flex:1"></span><button class="iconbtn iconbtn-lg" data-act="close" aria-label="Fermer">'+ic('x')+'</button></div>'
    + '<div class="fw-b"><div class="focus"><article class="detail">'+detailHTML(x, tal ? 'proj' : 'tal', detailOpts(x))+'</article>'
    + '<div class="col" style="gap:14px">'+scoreCard(scoreOf(x))+ctaCard(x)+'</div></div></div>';
}

/* ============================================================
   Explorer : filtre de rémunération côté talent
   ============================================================ */
function filtered(){
  const q = S.q.trim().toLowerCase(), tal = isTalMode();
  let list = pool().filter(x => !x.hidden);
  if(S.tab === 'favoris') list = list.filter(x => S.favs.has(x.id));
  if(q) list = list.filter(x => {
    const hay = tal
      ? [x.title, x.hook, handleOf(x), x.ownerCity, (x.sectors||[]).map(s => sector(s).l).join(' '), (x.seeking||[]).map(skillL).join(' '), x.id]
      : [isUnlocked(x.id) ? x.name : '', x.bio, handleOf(x), x.city, (x.skills||[]).map(skillL).join(' '), x.id];
    return hay.join(' ').toLowerCase().includes(q);
  });
  if(S.filterSkill) list = list.filter(x => (tal ? (x.seeking||[]) : (x.skills||[])).includes(S.filterSkill));
  if(S.filterSector) list = list.filter(x => (x.sectors||[]).includes(S.filterSector));
  if(tal && S.fPay === 'remu') list = list.filter(x => x.pay === 'mixte' || x.pay === 'paye');
  if(tal && S.fPay === 'prevue') list = list.filter(x => x.pay === 'paye');
  return list.map(x => ({x, s:scoreOf(x)})).sort((a,b) => b.s.total - a.s.total);
}
const anyFilter = () => !!(S.q || S.filterSkill || S.filterSector || (isTalMode() && S.fPay));
function toolbar(){
  const tal = isTalMode();
  return '<div class="toolbar">'
  + '<div class="seg" role="group" aria-label="Affichage">'
  +   '<button class="'+(S.mode==='mosaic'?'on':'')+'" data-act="mode" data-m="mosaic" aria-pressed="'+(S.mode==='mosaic')+'">'+ic('grid')+'Mosaïque</button>'
  +   '<button class="'+(S.mode==='focus'?'on':'')+'" data-act="mode" data-m="focus" aria-pressed="'+(S.mode==='focus')+'">'+ic('layers')+'Cartes</button></div>'
  + '<div class="search"><span style="position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--ink-4);display:flex">'+ic('search')+'</span>'
  +   '<input class="inp" id="q" style="padding-left:39px" placeholder="'+(tal?'Projet, secteur, @pseudo…':'Compétence, ville, @pseudo, ID…')+'" value="'+esc(S.q)+'" aria-label="Rechercher" autocomplete="off"></div>'
  + '<select class="inp" id="fSector" aria-label="Filtrer par secteur"><option value="">Tous secteurs</option>'
  +   SECTORS.map(s => '<option value="'+s.id+'"'+(S.filterSector===s.id?' selected':'')+'>'+s.g+' '+esc(s.l)+'</option>').join('')+'</select>'
  + '<select class="inp" id="fSkill" aria-label="'+(tal?'Filtrer par compétence recherchée':'Filtrer par compétence')+'"><option value="">'+(tal?'Toutes compétences recherchées':'Toutes compétences')+'</option>'
  +   SKILLS.map(s => '<option value="'+s.id+'"'+(S.filterSkill===s.id?' selected':'')+'>'+esc(s.l)+'</option>').join('')+'</select>'
  + (tal ? '<select class="inp" id="fPay" aria-label="Filtrer par rémunération">'
      + [['','Toutes rémunérations'],['remu','Avec rémunération'],['prevue','Rémunération prévue']].map(o => '<option value="'+o[0]+'"'+(S.fPay===o[0]?' selected':'')+'>'+o[1]+'</option>').join('')+'</select>' : '')
  + '<button class="btn btn-quiet btn-sm" id="clearF" data-act="clear-filters"'+(anyFilter()?'':' hidden')+'>'+ic('x')+'Réinitialiser</button>'
  + '</div>'
  + (tal ? '' : '<div class="privacy">'+ic('lock')+'<span><b>3 informations débloquées après un match</b> : le nom, la photo et les coordonnées d\'un talent s\'affichent quand il accepte ton invitation.</span></div>');
}
function emptyState(){
  if(S.tab === 'favoris' && !S.favs.size) return '<div class="card">'+emptyBox('⭐','Aucun favori',"Mets de côté les fiches qui t'intéressent avec l'étoile : tu les retrouveras ici.")+'</div>';
  const payTxt = isTalMode() && S.fPay;
  return '<div class="card">'+emptyBox('🔍','Rien ne correspond', payTxt ? "Aucun projet ne propose de rémunération avec ces filtres. Élargis-les ou vide la recherche." : "Aucune fiche ne passe tous tes filtres. Élargis-les ou vide la recherche.",
    '<button class="btn btn-ghost btn-sm" style="margin-top:6px" data-act="clear-filters">Réinitialiser les filtres</button>')+'</div>';
}
function repaintExplorer(){
  const box = $('#expBody'); if(!box) return;
  const list = filtered();
  box.innerHTML = S.loading ? skelDeck() : (S.mode === 'mosaic' ? mosaic(list) : focusView(list));
  const h = $('#resCount'); if(h) h.textContent = resultsLine(list.length);
  const cf = $('#clearF'); if(cf) cf.hidden = !anyFilter();
}

/* ============================================================
   Mes fiches : emplacements, formulaire, aperçu
   ============================================================ */
function slotsHTML(){
  const m = S.me;
  return '<div class="slots" role="group" aria-label="Tes fiches projet">'+[0,1,2].map(i => {
    const p = m.projects[i];
    if(p){ const on = i === m.projIdx, c = (() => { const k = m.projIdx; m.projIdx = i; const r = completion('vis').pct; m.projIdx = k; return r; })();
      return '<button class="slot'+(on?' on':'')+'" data-act="proj-switch" data-id="'+p.id+'" aria-pressed="'+on+'">'+projThumb(p, 40)
        + '<span class="grow"><b>'+esc(projName(p))+'</b><span class="hint"><span class="mono">'+c+' %</span> · <span class="st'+(p.online?' on':'')+'">'+(p.online?'En ligne':'Hors ligne')+'</span></span></span>'
        + (on ? '<span class="chip chip-a" style="height:22px">Active</span>' : '')+'</button>'; }
    if(i < m.slots) return '<button class="slot free" data-act="proj-new">'+ic('plus')+'<span class="grow"><b>Emplacement libre</b><span class="hint">Déjà débloqué · crée ta fiche</span></span></button>';
    return '<button class="slot lockd" data-act="proj-new">'+ic('lock')+'<span class="grow"><b>Emplacement '+(i+1)+'</b><span class="hint">'+priceH('slot')+', une seule fois</span></span></button>';
  }).join('')+'</div>';
}
function prevLegend(){
  return ficheOnline() ? '<i></i>Aperçu public, en direct' : '<i></i>Aperçu · fiche hors ligne';
}
function prevInner(){
  return previewCard() + (ficheOnline() ? '' : '<span class="pv-badge">'+ic('eye-off')+'Hors ligne · invisible dans l\'annuaire</span>');
}
function vFiche(){
  const m = S.me, tal = isTalMode(), kind = ficheKind(), c = completion(kind), p = m.project;
  if(!S.saved) saveBaseline();
  const sk = tal ? m.skills : p.seeking;
  const link = 'takamatch.bj/'+myHandle();
  return '<div class="page-h"><div><h1>'+(tal ? 'Ta fiche <span class="acc">Talent</span>' : 'Tes fiches · <span class="acc">'+esc(projName(p))+'</span>')+'</h1>'
    + '<p class="sub">'+(tal ? 'Publiée sous '+esc(myHandle())+". Seuls les visionnaires la voient, et les visiteurs arrivés par ton lien." : 'Jusqu\'à 3 fiches projet. Seuls les talents les voient, et les visiteurs arrivés par ton lien.')+'</p></div>'
    + '<div class="spacer"></div>' + onlineCard() + '</div>'
    + (tal ? '' : slotsHTML())
    + '<div class="card" style="margin-bottom:16px;overflow:hidden">'
    +   '<div class="fiche-id">'
    +     '<span class="av av-56 '+tintCls(kind, m.avatarHue)+'" style="'+tintAng(m.avatarHue)+'" aria-hidden="true">'+esc(initials(myName()))+'</span>'
    +     '<div class="fiche-id-c"><div class="row" style="gap:8px;flex-wrap:wrap"><span class="chip-user">'+esc(myHandle())+'</span>'
    +       vBadge(isTalMode() ? 'tal' : 'vis', m.verifiedId)+'</div>'
    +       '<div class="fiche-kv"><b>Nom et prénoms</b> · '+esc(myName())+' <span class="dim" style="font-size:12.5px">(visible après un match)</span></div>'
    +       '<div class="fiche-kv"><b>Localisation</b> · '+esc(m.city || '—')+'</div>'
    +       '<div class="fiche-kv"><b>Sexe</b> · '+SEX_L[m.sex||'n']+' <span class="dim" style="font-size:12.5px">(visible après un match)</span> · <a href="#" data-act="edit-account">Modifier</a></div>'
    +       '<div class="fiche-kv"><b>'+(tal?'Compétences clés':'Compétences recherchées')+'</b> · <span class="dim">'+esc(sk.slice(0,3).map(skillL).join(', ') || 'à renseigner')+'</span></div></div>'
    +     '<div class="fiche-id-a"><span id="ficheRing">'+ringHTML(c.pct, 72, kind)+'</span>'
    +       (m.verifiedId ? '' : m.verifyPending ? '<span class="vpend">'+ic('clock')+'Vérification en cours</span>' : '<button class="btn btn-ghost btn-sm" data-act="verify-id">'+ic('verif', isTalMode() ? 'tal' : 'vis')+'Faire vérifier mon profil</button>')+'</div></div>'
    +   '<div class="fiche-id-f"><div class="fiche-tools">'
    +     '<button class="btn btn-ghost btn-sm" data-act="stats">'+ic('chart')+'Statistiques de '+(tal?'ta fiche':'cette fiche')+'</button>'
    +     '<button class="btn btn-ghost btn-sm" data-act="copy" data-t="'+esc(myHandle())+'" data-l="Pseudo">'+ic('copy')+'<span class="mono">'+esc(myHandle())+'</span></button>'
    +     '<button class="btn btn-ghost btn-sm" data-act="copy" data-t="https://'+esc(link)+'" data-l="Lien">'+ic('link')+'Copier le lien</button>'
    +     '<button class="btn btn-ghost btn-sm" data-act="qr">'+ic('qr')+'Code QR</button></div></div></div>'
    + '<div class="cols cols-fiche">'
    +   '<div class="card card-pad"><div id="ficheForm" class="col" style="gap:28px">'+ficheFields()+'</div>'
    +     (tal ? '' : '<div class="del-row"><button class="btn btn-quiet btn-sm" data-act="proj-del" style="color:var(--bad-ink)">'+ic('trash')+'Supprimer cette fiche projet</button></div>')
    +     '<div class="savebar" id="saveBar"><span class="hint"><span class="dot"></span><span id="saveTxt">Tout est enregistré</span></span>'
    +       '<button class="btn btn-quiet btn-sm" id="undoBtn" data-act="undo-fiche" hidden>'+ic('undo')+'Annuler</button>'
    +       '<button class="btn btn-a" id="saveBtn" data-act="save-fiche" disabled>'+ic('check')+'Enregistrer les modifications</button></div></div>'
    +   '<div class="col" style="gap:14px">'
    +     '<div><div class="preview-l'+(ficheOnline()?'':' off')+'" id="prevL">'+prevLegend()+'</div><div id="prevBox" class="'+(ficheOnline()?'':'pv-off')+'">'+prevInner()+'</div>'
    +       '<button class="btn btn-quiet btn-sm btn-block" style="margin-top:8px" data-act="preview-public">'+ic('eye')+'Voir mon profil public</button></div>'
    +     '<div class="card card-pad"><div class="lbl" style="margin-bottom:10px">Ce qu\'il te manque</div><div id="missBox">'+missingHTML(c)+'</div></div>'
    +     '<div class="card card-pad"><div class="row" style="gap:8px;margin-bottom:6px">'+ic('spark')+'<div class="lbl">Conseil</div></div>'
    +       '<p style="font-size:13.5px;line-height:1.6;color:var(--ink-2)">'
    +       (tal ? "Écris ta signature comme tu parlerais à quelqu'un dans un taxi : ce que tu sais faire, ce que tu as déjà livré, ce que tu cherches. Les listes de technologies n'ont jamais convaincu personne."
                 : "La Traction pèse plus que la Vision. Un chiffre modeste et vrai bat une ambition grandiose.")+'</p></div>'
    +   '</div></div>';
}
function onlineCard(){
  const on = ficheOnline();
  return '<div class="row card online-card'+(on?' on':'')+'" id="onlineCard">'
    + '<button class="toggle ok" data-act="online" aria-pressed="'+on+'" aria-label="Fiche visible dans l\'annuaire"></button>'
    + '<div class="oc-t"><div class="oc-l" id="ocL">'+(on?'En ligne':'Hors ligne')+'</div>'
    + '<div class="oc-s" id="ocS">'+(on?'Visible dans l\'annuaire et les recherches':'Masquée de l\'annuaire et des recherches')+'</div></div></div>';
}
function paintOnline(){
  const on = ficheOnline(), c = $('#onlineCard');
  if(c){ c.classList.toggle('on', on); c.querySelector('.toggle').setAttribute('aria-pressed', on);
    setText($('#ocL'), on ? 'En ligne' : 'Hors ligne'); setText($('#ocS'), on ? 'Visible dans l\'annuaire et les recherches' : 'Masquée de l\'annuaire et des recherches'); }
  const pb = $('#prevBox'); if(pb){ pb.className = on ? '' : 'pv-off'; pb.innerHTML = prevInner(); }
  const pl = $('#prevL'); if(pl){ pl.className = 'preview-l'+(on ? '' : ' off'); pl.innerHTML = prevLegend(); }
  $$('.slot.on .st').forEach(s => { s.classList.toggle('on', on); s.textContent = on ? 'En ligne' : 'Hors ligne'; });
  syncSide();
}
function syncFiche(){
  $$('#ficheForm .opt').forEach(btn => {
    const cur = getPath(btn.dataset.k), v = btn.dataset.v;
    const on = Array.isArray(cur) ? cur.includes(v) : cur === v;
    btn.setAttribute('aria-pressed', on);
    if(btn.dataset.k === 'p.sectors'){ const full = S.me.project.sectors.length >= 3 && !on; btn.disabled = full; btn.title = full ? '3 secteurs maximum : retire-en un pour en choisir un autre' : ''; }
  });
  const sh = $('#secHint');
  if(sh){ const n = S.me.project.sectors.length; sh.textContent = n >= 3 ? '3 secteurs maximum : retire-en un pour en choisir un autre.' : (n ? n+' sur 3 choisi'+(n>1?'s':'')+'.' : 'Choisis au moins un secteur.'); sh.style.color = n ? '' : 'var(--bad-ink)'; }
  $$('#ficheForm .glyphs button').forEach(b => {
    const ok = S.me.project.sectors.includes(b.dataset.s);
    b.disabled = !ok; b.setAttribute('aria-pressed', ok && S.me.project.glyph === b.dataset.g);
    b.title = ok ? sector(b.dataset.s).l : 'Coche '+sector(b.dataset.s).l+' dans les secteurs pour utiliser cette icône';
  });
  const kind = ficheKind(), c = completion(kind);
  const box = $('#prevBox'); if(box) box.innerHTML = prevInner();
  const rg = $('#ficheRing'); if(rg) rg.innerHTML = ringHTML(c.pct, 72, kind);
  const ms = $('#missBox'); if(ms) ms.innerHTML = missingHTML(c);
  const sl = $('.slot.on'); if(sl){ const b = sl.querySelector('b'), mo = sl.querySelector('.mono'); if(b) setText(b, projName(S.me.project)); if(mo) setText(mo, c.pct+' %'); }
  syncCounters(); markRequired();
  const sb = $('#saveBar');
  if(sb){
    const d = isDirty();
    sb.classList.toggle('dirty', d);
    $('#saveTxt').textContent = d ? 'Modifications non enregistrées' : 'Tout est enregistré';
    $('#saveBtn').disabled = !d;
    $('#undoBtn').hidden = !d;
  }
  syncSide();
}

/* ============================================================
   Statistiques : les membres de l'autre côté, et les visiteurs
   sans compte arrivés par ton lien ou ton QR
   ============================================================ */
const VIEWS5 = {w:['S34','S35','S36','S37','S38','S39'], tal:[6,9,8,13,15,19], vis:[5,7,6,9,11,14], anon:[2,3,5,4,6,8]};
function statsSeries(){
  const tal = isTalMode(), f = S.me.fresh ? 0 : tal ? 1 : [1, .55, 0][S.me.projIdx] ?? 0;
  const k = n => Math.round(n * f);
  return tal ? {a:VIEWS5.vis.map(k), aL:'Visionnaires', aC:'var(--ch-vis)', b:VIEWS5.anon.map(k)}
             : {a:VIEWS5.tal.map(k), aL:'Talents', aC:'var(--ch-tal)', b:VIEWS5.anon.map(k)};
}
function statsChart(){
  const W = 640, H = 220, L = 36, R = 10, T = 14, B = 30, sr = statsSeries();
  const max = Math.max(5, Math.ceil(Math.max(...sr.a, ...sr.b) / 5) * 5);
  const ch = H - T - B, gw = (W - L - R) / VIEWS5.w.length, bw = Math.min(26, gw*.3);
  const y = v => T + ch - v/max*ch;
  let gr = '';
  [0, max/4, max/2, 3*max/4, max].forEach(v => { v = Math.round(v); gr += '<line x1="'+L+'" y1="'+y(v)+'" x2="'+(W-R)+'" y2="'+y(v)+'" stroke="var(--line)"/>'
    + '<text x="'+(L-8)+'" y="'+(y(v)+4)+'" text-anchor="end" class="v">'+v+'</text>'; });
  VIEWS5.w.forEach((w, i) => {
    const cx = L + gw*i + gw/2, a = sr.a[i], b = sr.b[i];
    gr += (a ? '<path d="'+barPath(cx-bw-1, y(a), bw, y(0)-y(a), 3)+'" fill="'+sr.aC+'"/>' : '')
      + (b ? '<path d="'+barPath(cx+1, y(b), bw, y(0)-y(b), 3)+'" fill="var(--ch-anon)"/>' : '')
      + '<text x="'+cx+'" y="'+(H-10)+'" text-anchor="middle" class="v">'+w+'</text>'
      + '<rect class="hit" x="'+(cx-gw/2)+'" y="'+T+'" width="'+gw+'" height="'+ch+'" data-i="'+i+'"/>';
  });
  const ta = sr.a.reduce((a,b) => a+b, 0), tb = sr.b.reduce((a,b) => a+b, 0), tal = isTalMode();
  if(!ta && !tb) return '<div class="card">'+emptyBox('📊','Pas encore de vues', ficheOnline() ? "Ta fiche vient d'être créée : les premières vues arrivent dans les jours qui suivent sa mise en ligne." : "Cette fiche est hors ligne. Mets-la en ligne pour qu'elle apparaisse dans l'annuaire.")+'</div>';
  return '<div class="grid g3" style="gap:10px">'
    + '<div class="stat"><div class="k">'+ic('eye')+'Vues sur 6 semaines</div><div class="v tnum">'+(ta+tb)+'</div><div class="d up">'+ic('trend')+'en hausse sur la dernière semaine</div></div>'
    + (tal ? '<div class="stat"><div class="k">'+ic('star')+'Mise en favori</div><div class="v tnum">9</div><div class="d">par des visionnaires différents</div></div>'
           : '<div class="stat"><div class="k">'+ic('heart')+'J\'aime sur ce projet</div><div class="v tnum">'+(S.me.project.likes||0)+'</div><div class="d">par des talents différents</div></div>')
    + '<div class="stat"><div class="k">'+ic('qr')+'Visites par lien et QR</div><div class="v tnum">'+tb+'</div><div class="d">de visiteurs sans compte</div></div></div>'
    + '<div><div class="lbl" style="margin:6px 0 4px">Vues de '+(tal?'ta fiche':'cette fiche')+' par semaine</div>'
    + '<div class="chart-wrap"><svg class="chart" id="statsSvg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Vues par semaine, de S34 à S39 : par des '+sr.aL.toLowerCase()+' et par des visiteurs non identifiés">'+gr+'</svg><div class="chart-tip" id="chartTip" hidden></div></div>'
    + '<div class="legend"><span><i style="background:'+sr.aC+'"></i>Vues par des '+sr.aL.toLowerCase()+' · <span class="mono">'+ta+'</span></span><span><i style="background:var(--ch-anon)"></i>Visiteurs non identifiés · <span class="mono">'+tb+'</span></span></div>'
    + '<p class="hint" style="margin-top:6px">'+(tal ? 'Seuls les visionnaires voient ta fiche Talent dans l\'annuaire.' : 'Seuls les talents voient tes fiches projet dans l\'annuaire.')+' Les visiteurs non identifiés sont arrivés par ton lien ou ton code QR, sans compte TakaMatch.</p>'
    + '<details class="more"><summary>'+ic('chev')+'Voir les données</summary><table class="dtable"><thead><tr><th>Semaine</th><th>'+sr.aL+'</th><th>Visiteurs</th><th>Total</th></tr></thead><tbody>'
    + VIEWS5.w.map((w,i) => '<tr><td>'+w+'</td><td>'+sr.a[i]+'</td><td>'+sr.b[i]+'</td><td>'+(sr.a[i]+sr.b[i])+'</td></tr>').join('')+'</tbody></table></details></div>';
}
function statsModal(){ modal(isTalMode() ? 'Les statistiques de ta fiche' : 'Statistiques · '+projName(S.me.project), statsChart(), '<button class="btn btn-ghost" data-act="close">Fermer</button>', {lg:true}); }
document.addEventListener('pointermove', e => {
  const tip = $('#chartTip'); if(!tip) return;
  const h = e.target.closest && e.target.closest('#statsSvg .hit');
  if(!h){ tip.hidden = true; return; }
  const i = +h.dataset.i, sr = statsSeries(), svg = $('#statsSvg'), wrap = svg.parentElement.getBoundingClientRect(), r = h.getBoundingClientRect();
  tip.innerHTML = '<div style="font-weight:600;margin-bottom:2px">Semaine '+VIEWS5.w[i].slice(1)+'</div>'
    + '<div><i style="background:'+sr.aC+'"></i>'+sr.aL+' <b>'+sr.a[i]+'</b></div><div><i style="background:var(--ch-anon)"></i>Visiteurs <b>'+sr.b[i]+'</b></div>';
  tip.hidden = false;
  tip.style.left = clamp(r.left - wrap.left + r.width/2, 70, wrap.width - 70) + 'px';
  tip.style.top = (r.top - wrap.top + 8) + 'px';
});

/* ============================================================
   Ta fiche vue par les autres : membre ou visiteur sans compte
   ============================================================ */
function openPublic(){
  const kind = ficheKind(), x = kind === 'tal' ? meAsTalent() : meAsProject();
  const off = !ficheOnline(), vis = S.pubView === 'visiteur', other = kind === 'tal' ? 'un visionnaire' : 'un talent';
  const seg = '<div class="seg-sm" role="group" aria-label="Point de vue">'
    + [['membre','Vue membre'],['visiteur','Vue visiteur']].map(o => '<button class="'+(S.pubView===o[0]?'on':'')+'" data-act="pub-view" data-v="'+o[0]+'" aria-pressed="'+(S.pubView===o[0])+'">'+o[1]+'</button>').join('')+'</div>';
  const html = '<div class="fw-h"><span class="lbl">'+(kind === 'tal' ? 'Ta fiche Talent' : 'Ta fiche projet · '+esc(projName(S.me.project)))+', vue par les autres</span><span style="flex:1"></span>'
    + '<button class="iconbtn iconbtn-lg" data-act="close" aria-label="Fermer">'+ic('x')+'</button></div>'
    + '<div class="fw-b"><div class="row pub-bar" style="gap:12px;flex-wrap:wrap;margin-bottom:12px">'+seg+'</div>'
    + (off ? note('warn','eye-off','<b>Cette fiche est hors ligne</b> : elle n\'apparaît plus dans l\'annuaire et ton lien affiche « fiche indisponible ».')
       : vis ? note('', 'qr', 'C\'est ce que voit <b>quelqu\'un sans compte</b>, arrivé par ton lien ou ton code QR. Il lit ta fiche mais ne peut pas t\'inviter : il doit d\'abord rejoindre TakaMatch.')
             : note('a','eye','C\'est ce que voit '+other+' <b>avant le match</b>. Ton nom légal et tes coordonnées restent masqués.'))
    + '<div class="pub-wrap'+(off?' pv-off':'')+'"><article class="detail" style="margin-top:14px">'+detailHTML(x, kind === 'tal' ? 'tal' : 'proj', {unlocked:false, self:true})+'</article>'
    + (off ? '<span class="pv-badge">'+ic('eye-off')+'Hors ligne · invisible dans l\'annuaire</span>' : '')
    + (vis ? '<div class="card card-pad visitor-cta"><div><b>Tu veux '+(kind === 'tal' ? 'proposer ton projet à ce talent' : 'rejoindre ce projet')+' ?</b><p class="hint">Crée ton compte en 2 minutes : c\'est gratuit pour les talents.</p></div>'
          + '<button class="btn btn-a" disabled title="Aperçu : bouton inactif">'+ic('arrow')+'Rejoindre TakaMatch pour inviter</button></div>' : '')+'</div>'
    + '<div class="ov-foot"><button class="btn btn-ghost" data-act="close">Fermer</button><button class="btn btn-a" data-act="public-edit">'+ic('edit')+'Modifier ma fiche</button></div></div>';
  if(S.layer === 'public' && $('#publicWin')){ $('#publicWin').innerHTML = html; return; }
  openLayer('<div class="ov" role="dialog" aria-modal="true" aria-label="Ta fiche vue par les autres"><div class="ov-bg" data-act="close"></div>'
    + '<div class="ov-win xl" id="publicWin">'+html+'</div></div>', 'public');
}

/* ============================================================
   Coquille : rôle puis statut, sélecteur de projet
   ============================================================ */
function renderTop(){
  document.documentElement.setAttribute('data-role', S.me.role);
  const bell = $('#bellBtn'), unread = S.notifs.some(n => !n.read) ? '1' : '0';
  if(bell.dataset.unread !== unread){ bell.innerHTML = ic('bell') + (unread === '1' ? '<span class="bell-dot"></span>' : ''); bell.dataset.unread = unread;
    bell.setAttribute('aria-label', unread === '1' ? 'Notifications, non lues' : 'Notifications'); }
  const tb = $('#themeBtn'), dark = themeIsDark() ? '1' : '0';
  if(tb.dataset.dark !== dark){ tb.innerHTML = ic(dark === '1' ? 'sun' : 'moon'); tb.dataset.dark = dark;
    tb.setAttribute('aria-label', dark === '1' ? 'Passer en thème clair' : 'Passer en thème sombre'); }
  const av = $('#meAv');
  setText(av, initials(myName()));
  av.className = 'av av-28 ' + tintCls(S.me.role, S.me.avatarHue);
  av.style.setProperty('--ta', (116 + (Math.abs(S.me.avatarHue|0) % 5) * 13) + 'deg');
  setText($('#meName'), myName());
  setText($('#meRole'), myHandle());
  const pb = $('#projBtn');
  if(pb){
    const vis = !isTalMode();
    pb.hidden = !vis;
    if(vis){
      const p = S.me.project, other = S.me.projects.some(q => q.id !== p.id && projAlerts(q.id));
      const html = projThumb(p, 26)+'<span class="nm">'+esc(projName(p))+'</span>'+ic('down')+(other ? '<span class="pdot" aria-label="Alerte sur un autre projet"></span>' : '');
      if(pb.dataset.h !== html){ pb.innerHTML = html; pb.dataset.h = html; }
      pb.setAttribute('aria-label', 'Projet actif : '+projName(p)+'. Changer de projet');
    }
  }
}
function renderSide(){
  const side = $('#side'), bar = $('#tabbar');
  if(side.dataset.built !== '6'+S.me.role){
    side.innerHTML = '<button class="sb-hd" data-act="go" data-v="fiche" aria-label="Ouvrir ma fiche">'
      + '<span class="sb-top"><span class="role-pill" id="sbRole"></span><span class="sb-status" id="sbStatus"></span></span>'
      + '<span class="sb-bar" aria-hidden="true"><i id="sbBar"></i></span>'
      + '<span class="sb-pct" id="sbPct"></span></button>'
      + '<div class="sb-list">' + NAV.map(n => '<button class="nav" data-act="go" data-v="'+n.id+'" data-nav="'+n.id+'">'
          + ic(navIcon(n))+'<span class="l"></span><span class="cnt" hidden></span></button>').join('') + '</div>'
      + '<div class="sb-ft">' + NAV_FOOT.map(n => '<button class="sb-l" data-act="go" data-v="'+n.id+'" data-nav="'+n.id+'">'+ic(n.i)+'<span class="l"></span></button>').join('')
      + '<span class="baseline">Connecter, co-créer, impacter</span></div>';
    side.dataset.built = '6'+S.me.role;
  }
  if(bar.dataset.built !== '1'){
    bar.innerHTML = TABBAR.map(id => { const n = NAV.find(x => x.id === id);
      return '<button data-act="go" data-v="'+n.id+'" data-tab="'+n.id+'">'+ic(navIcon(n))+'<span class="cnt" hidden></span><span class="l"></span></button>'; }).join('');
    bar.dataset.built = '1';
  }
  syncSide();
}
const navLabel = (n, short) => { const v = short && n.short ? n.short : n.l; return typeof v === 'string' ? v : v[S.me.role]; };
function syncSide(){
  if(!$('#sbBar')) return;
  const kind = isTalMode() ? 'tal' : 'vis', c = completion(kind);
  const st = $('#sbStatus'), on = ficheOnline();
  st.className = 'sb-status' + (on ? ' on' : '');
  setText(st, on ? 'En ligne' : 'Hors ligne');
  setText($('#sbRole'), kind === 'tal' ? '🛠️ Talent' : '💡 Visionnaire');
  const b = $('#sbBar'); b.style.width = c.pct + '%'; b.className = 'g-'+kind;
  const label = kind === 'tal' ? 'Ta fiche Talent' : 'Fiche projet : '+projName(S.me.project);
  const html = '<span class="sb-lg'+(c.pct >= 100 ? ' ok' : '')+'">'+(c.pct >= 100 ? ic('check') : '')+'<span class="mq"><span class="mq-t">'+esc(label)+'</span></span></span><span class="mono">'+c.pct+' %</span>';
  const box = $('#sbPct');
  if(box.dataset.h !== html){ box.innerHTML = html; box.dataset.h = html; fitMarquee(box); }
  NAV.concat(NAV_FOOT).forEach(n => {
    const on2 = S.view === n.id, c2 = navCount(n.id);
    const bt = document.querySelector('#side [data-nav="'+n.id+'"]');
    if(bt){ bt.classList.toggle('on', on2); if(on2) bt.setAttribute('aria-current','page'); else bt.removeAttribute('aria-current');
      setText(bt.querySelector('.l'), navLabel(n)); setCount(bt.querySelector('.cnt'), c2); }
    const t = document.querySelector('[data-tab="'+n.id+'"]');
    if(t){ t.classList.toggle('on', on2); if(on2) t.setAttribute('aria-current','page'); else t.removeAttribute('aria-current');
      setText(t.querySelector('.l'), navLabel(n, true)); setCount(t.querySelector('.cnt'), c2); }
  });
}
/* Un nom de projet trop long défile ; le pourcentage, lui, ne bouge pas. */
function fitMarquee(box){
  requestAnimationFrame(() => {
    const mq = box.querySelector('.mq'), t = box.querySelector('.mq-t'); if(!mq || !t) return;
    const over = t.scrollWidth - mq.clientWidth;
    mq.classList.toggle('run', over > 2);
    if(over > 2){ mq.style.setProperty('--mq-d', (-over - 12)+'px'); mq.style.setProperty('--mq-s', Math.max(6, over/14)+'s'); }
  });
}
addEventListener('resize', () => { const b = $('#sbPct'); if(b) fitMarquee(b); });
function navCount(id){
  if(id === 'messages') return S.threads.filter(t => t.unread && !t.archived).length + groupTeams().filter(t => !t.groupClosed && t.unreadGroup).length;
  if(id === 'connexions') return S.invitesRecv.filter(i => i.status === 'new').length + S.matches.filter(m => m.fresh).length;
  if(id === 'atelier') return takamMeCount();
  return 0;
}

/* ---------- Menus ---------- */
function meMenu(anchor){
  const other = isTalMode() ? 'vis' : 'tal', tal = isTalMode();
  popMenu(anchor, '<div class="ttl"><div class="lbl">Connecté en tant que</div>'
    + '<div style="font-weight:600;font-size:14px;margin-top:2px">'+esc(myName())+'</div>'
    + '<div style="font-size:12.5px;color:var(--ink-3)">'+roleLabel(S.me.role)+' · '+esc(S.me.email)+'</div></div><div class="sep"></div>'
    + '<button role="menuitem" data-act="go" data-v="fiche">'+ic(tal ? 'idcard' : 'cards')+(tal ? 'Ma fiche Talent' : 'Mes fiches')+'</button>'
    + '<button role="menuitem" data-act="preview-public">'+ic('eye')+'Voir mon profil public</button>'
    + '<button role="menuitem" data-act="switch-role">'+ic(tmRoleOpen(other) ? 'refresh' : 'plus')+(tmRoleOpen(other) ? 'Passer en ' : 'Deviens aussi ')+roleLabel(other)
    +   (!tmRoleOpen(other) ? '<span class="chip" style="margin-left:auto;height:20px;font-size:11px">'+priceH('second')+'</span>' : '')+'</button><div class="sep"></div>'
    + '<button role="menuitem" data-act="go" data-v="parametres">'+ic('cog')+'Paramètres</button>'
    + '<button role="menuitem" data-act="go" data-v="support">'+ic('help')+'Aide et support</button><div class="sep"></div>'
    + '<button role="menuitem" data-act="logout" style="color:var(--bad-ink)">'+ic('out')+'Se déconnecter</button>');
}
function threadMenu(anchor, id){
  const th = S.threads.find(t => t.id === id);
  popMenu(anchor, (th && !th.ro ? '<button role="menuitem" data-act="open-atelier" data-id="'+id+'">'+ic('tools')+'Ouvrir l\'Atelier</button>' : '')
    + '<button role="menuitem" data-act="archive" data-id="'+id+'">'+ic('archive')+(th && th.archived ? 'Désarchiver' : 'Archiver la discussion')+'</button>'
    + '<div class="pop-note">'+ic('info')+'<span>Les messages ne peuvent pas être supprimés : ils servent de preuve en cas de litige.</span></div><div class="sep"></div>'
    + '<button role="menuitem" data-act="report" data-id="'+id+'" style="color:var(--bad-ink)">'+ic('flag')+'Signaler</button>');
}
function projMenu(anchor){
  const m = S.me, n = m.projects.length;
  const rows = m.projects.map(p => { const cur = p.id === m.project.id, al = projAlerts(p.id), team = teamOfProject(p.id);
    return '<button role="menuitemradio" aria-checked="'+cur+'" class="pm-row" data-act="proj-switch" data-id="'+p.id+'">'+projThumb(p, 30)
      + '<span class="grow"><b>'+esc(projName(p))+'</b><span class="hint">'+(team ? '<span class="mono">'+projJalons(p.id)+'/6</span> jalons · équipe de '+team.members.length : 'Pas encore d\'équipe')+(p.online ? '' : ' · hors ligne')+'</span></span>'
      + (al ? '<span class="cnt-pill mono" title="Alertes Takam">'+al+'</span>' : '')
      + (cur ? '<span class="pm-ok">'+ic('check')+'</span>' : '')+'</button>'; }).join('');
  const foot = n >= MAX_PROJ ? '<button disabled class="pm-new">'+ic('lock')+'3 projets sur 3</button>'
    : '<button class="pm-new" data-act="proj-new">'+ic('plus')+'Créer une fiche projet<span class="chip" style="margin-left:auto;height:20px;font-size:11px">'+(n < m.slots ? 'emplacement libre' : priceH('slot'))+'</span></button>';
  popMenu(anchor, '<div class="ttl"><div class="lbl">Tes projets · '+n+' sur 3</div></div>'+rows+'<div class="sep"></div>'+foot
    + '<p class="pop-note" style="margin-top:4px">'+ic('info')+'<span>Chaque projet a ses propres invitations, matchs, conversations et Atelier. Les crédits sont communs.</span></p>');
  const pop = $('#layer .pop'), r = anchor.getBoundingClientRect(); pop.classList.add('pop-proj');
  pop.style.right = 'auto'; pop.style.left = Math.max(12, Math.min(r.left, innerWidth - pop.offsetWidth - 12))+'px';
}
function atSwitchMenu(anchor){
  const t0 = curTeam(), ids = Object.keys(S.teams);
  popMenu(anchor, '<div class="ttl"><div class="lbl">Tes ateliers</div></div>' + ids.map(id => { const z = S.teams[id], y = itemById(id), al = takam(z).me.filter(x => x.lvl === 'warn').length, cur = t0 && t0.id === id;
    return '<button role="menuitemradio" aria-checked="'+cur+'" class="pm-row" data-act="team" data-id="'+id+'">'+(y.id ? projThumb(y, 30) : '')
      + '<span class="grow"><b>'+esc(z.title)+'</b><span class="hint"><span class="mono">'+z.milestones.filter(k => k.done).length+'/6</span> jalons · équipe de '+z.members.length+'</span></span>'
      + (al ? '<span class="cnt-pill mono" title="Alertes Takam">'+al+'</span>' : '') + (cur ? '<span class="pm-ok">'+ic('check')+'</span>' : '')+'</button>'; }).join('')
    + '<div class="sep"></div><p class="pop-note">'+ic('users')+'<span><span class="mono">'+engagedN()+'</span> projets sur 3</span></p>');
  const pop = $('#layer .pop'), r = anchor.getBoundingClientRect();
  pop.classList.add('pop-proj'); pop.style.right = 'auto'; pop.style.left = Math.max(12, Math.min(r.left, innerWidth - pop.offsetWidth - 12))+'px';
}
function memMenu(anchor, id){
  const t = curTeam(), m = memberById(t, id);
  popMenu(anchor, '<div class="ttl"><div class="lbl">'+esc(m.name)+'</div></div>'
    + '<button role="menuitem" data-act="open" data-id="'+id+'">'+ic('eye')+'Voir sa fiche</button>'
    + '<button role="menuitem" data-act="open-thread" data-id="'+id+'">'+ic('chat')+'Conversation privée</button><div class="sep"></div>'
    + '<button role="menuitem" data-act="rm-member" data-id="'+id+'" style="color:var(--bad-ink)">'+ic('userx')+'Retirer de l\'équipe</button>');
  const pop = $('#layer .pop'), r = anchor.getBoundingClientRect();
  pop.style.right = 'auto'; pop.style.left = clamp(r.left, 12, innerWidth - 260)+'px';
}

/* ---------- Palette de commandes ---------- */
const CMDS = () => [
  {l:'Aller à l\'accueil', i:'home', run:() => go('accueil')},
  {l:(isTalMode() ? 'Explorer les projets' : 'Explorer les talents'), i:'compass', run:() => go('explorer')},
  {l:'Voir mes invitations', i:'link', run:() => { S.tab = 'invitations'; go('connexions'); }},
  {l:'Voir mes matchs', i:'spark', run:() => { S.tab = 'matchs'; go('connexions'); }},
  {l:'Ouvrir la messagerie', i:'chat', run:() => go('messages')},
  {l:"Ouvrir l'Atelier", i:'tools', run:() => go('atelier')},
  {l:(isTalMode() ? 'Modifier ma fiche Talent' : 'Modifier mes fiches'), i:isTalMode() ? 'idcard' : 'cards', run:() => go('fiche')},
  ...(isTalMode() ? [] : [{l:'Modifier ma fiche perso', i:'idcard', run:() => { S.ficheTab = 'perso'; go('fiche'); }}]),
  {l:'Statistiques de ma fiche', i:'chart', run:statsModal},
  {l:'Paramètres', i:'cog', run:() => go('parametres')},
  {l:'Aide et support', i:'help', run:() => go('support')},
].concat(isTalMode() ? [] : [{l:'Recharger mes crédits', i:'plus', run:() => buyCredits(false)}]
  .concat(S.me.projects.filter(p => p.id !== S.me.project.id).map(p => ({l:'Passer sur le projet '+projName(p), i:'refresh', run:() => switchProject(p.id)})))).concat([
  {l:'Basculer le thème clair / sombre', i:'moon', run:toggleTheme},
  {l:(tmRoleOpen(isTalMode() ? 'vis' : 'tal') ? 'Passer en ' : 'Deviens aussi ')+roleLabel(isTalMode() ? 'vis' : 'tal'), i:'refresh', run:switchRole},
]).concat(pool().map(x => ({l:(isTalMode() ? x.title : handleOf(x))+' · '+(isTalMode() ? sector(x.sectors[0]).l : x.skills.map(skillL).slice(0,2).join(', ')), i:isTalMode() ? 'rocket' : 'usercheck', run:() => openFiche(x.id)})));

/* ============================================================
   Deux profils, trois projets : bascule et paiements
   ============================================================ */
function resultsLine(n){ return n+' résultat'+(n>1?'s':'')+', classé'+(n>1?'s':'')+' par compatibilité avec '+(isTalMode() ? 'ta fiche.' : esc(projName(S.me.project))+'.'); }
function today(){ const d = new Date(); return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear(); }
function go(v){
  const leaving = S.view === 'fiche' && v !== 'fiche' && isDirty();
  if(leaving){ S.pendingGo = v; return modal('Modifications non enregistrées',
    '<p>Tu as modifié ta fiche sans l\'enregistrer. Que veux-tu faire de ces changements ?</p>',
    '<button class="btn btn-quiet" data-act="discard-go">Les abandonner</button><button class="btn btn-a" data-act="save-go">Enregistrer et continuer</button>'); }
  const wasFiche = S.view === 'fiche';
  S.view = v; S.sideOpen = false; $('#side').classList.remove('open');
  if(v === 'explorer' && !['decouvrir','favoris'].includes(S.tab)) S.tab = 'decouvrir';
  if(v === 'connexions' && !['invitations','matchs'].includes(S.tab)) S.tab = 'invitations';
  if(v === 'messages') S.mobileThread = false;
  if(v === 'fiche' && !wasFiche) saveBaseline();
  if(v === 'explorer' && S._painted !== 'explorer'){
    S.loading = true; $('#topbar').classList.add('busy');
    setTimeout(() => { S.loading = false; $('#topbar').classList.remove('busy'); if(S.view === 'explorer' && $('#expBody')) repaintExplorer(); }, 450);
  }
  render(); countUp();
  try{ $('#main').focus({preventScroll:true}); }catch(e){}
}
function resetUi(){ Object.assign(S, {tab:'decouvrir', focusIdx:0, q:'', filterSkill:'', filterSector:'', fPay:'', invFilter:'all', showArch:false, mobileThread:false, objForm:false, taskForm:null, ficheTab:'projet'}); scheduleReminder(); }
function switchRole(){
  const to = isTalMode() ? 'vis' : 'tal';
  if(!tmRoleOpen(to)) return unlockModal();
  if(S.view === 'fiche' && isDirty()) commitFiche();
  saveCtx(); S.me.role = to; loadCtx(); resetUi(); saveBaseline();
  S._painted = null; go('accueil');
  toast(to === 'vis' ? 'Profil Visionnaire · '+projName(S.me.project)+'.' : 'Profil Talent. Tes projets t\'attendent de l\'autre côté.', 'ok');
}
function switchProject(id){
  closeLayer();
  const i = S.me.projects.findIndex(p => p.id === id);
  if(i < 0 || i === S.me.projIdx) return;
  if(S.view === 'fiche' && isDirty()) commitFiche();
  saveCtx(); S.me.projIdx = i; loadCtx(); resetUi(); saveBaseline();
  S._painted = null; go(S.view);
  toast('Projet actif : '+projName(S.me.project)+'.', 'ok');
}
function unlockModal(){
  S.pay = payInit(1); S.pay.key = 'second';
  modal('Deviens aussi Visionnaire',
    '<div class="price-hd"><span class="mono">'+priceH('second')+'</span><span>une seule fois, puis tu passes d\'un profil à l\'autre sans limite</span></div>'
    + '<ul class="leave-l">'
    + '<li>'+ic('rocket')+'Tu publies une fiche projet et tu invites des talents avec tes crédits.</li>'
    + '<li>'+ic('layers')+'Jusqu\'à 3 projets : la première fiche est incluse, chaque emplacement de plus coûte '+priceH('slot')+'.</li>'
    + '<li>'+ic('users')+'Tes deux profils sont indépendants : matchs, invitations, conversations et Ateliers séparés.</li>'
    + '<li>'+ic('shield')+'Ton compte reste unique : nom, email, ville, sexe et échelle de confiance sont communs.</li></ul>'
    + opsField(),
    '<button class="btn btn-ghost" data-act="close">Plus tard</button><button class="btn btn-vis" data-act="unlock-pay">'+ic('card')+'Payer '+priceH('second')+'</button>', {lg:true});
}
function doUnlock(btn){
  payThen({kind:'second', key:'second', label:'Second profil · Visionnaire', amount:priceOf('second').charged}, btn, () => {
    const m = S.me;
    m.visUnlocked = true; m.visSince = new Date(); if(!m.fresh) m.slots = Math.max(m.slots, 2);
    if(!(persoOf(m).skills || []).length && !persoOf(m).bio) copyTalentToPerso(m);
    S.payments.unshift(...(m.fresh ? [] : [{d:today(), l:'Emplacement projet n° 2 · démo', a:priceOf('slot').charged, op:S.pay.op, ref:S.pay.ref, cc:S.pay.cc}]), {d:today(), l:'Second profil · Visionnaire', a:priceOf('second').charged, op:S.pay.op, ref:S.pay.ref, cc:S.pay.cc});
    closeLayer(); confetti();
    if(S.view === 'fiche' && isDirty()) commitFiche();
    saveCtx(); m.role = 'vis';
    /* Chaque projet de la démo reçoit son état dès maintenant (équipes, jalons). */
    m.projects.forEach((p, i) => { m.projIdx = i; if(!S.ctxs['vis:'+p.id]){ loadCtx(); saveCtx(); } });
    m.projIdx = 0; loadCtx(); resetUi(); saveBaseline();
    S._painted = null; go('fiche');
    success('Profil Visionnaire débloqué', 'Paiement de <span class="mono">'+priceH('second')+'</span> confirmé via '+esc(S.pay.op)+'. Voici tes fiches projet : complète-les et mets-les en ligne. Tu reviens au profil Talent quand tu veux, sans payer.');
  });
}
function createProject(){
  closeLayer();
  const m = S.me;
  if(m.projects.length >= MAX_PROJ) return toast('Tu portes déjà 3 projets : c\'est le maximum.', 'bad');
  if(m.projects.length < m.slots) return newProject();
  S.pay = payInit(1); S.pay.key = 'slot';
  modal('Ajoute un projet',
    '<div class="price-hd"><span class="mono">'+priceH('slot')+'</span><span>une seule fois pour cet emplacement</span></div>'
    + '<p>Ton '+(m.projects.length + 1 === 3 ? 'troisième' : 'deuxième')+' projet a sa propre fiche, ses invitations, ses matchs, ses conversations et son Atelier. Tes crédits d\'invitation restent communs.</p>'
    + '<p class="hint">Si tu supprimes un jour cette fiche, l\'emplacement reste acquis : tu pourras y créer un autre projet sans repayer.</p>'
    + opsField(),
    '<button class="btn btn-ghost" data-act="close">Annuler</button><button class="btn btn-a" data-act="slot-pay">'+ic('card')+'Payer '+priceH('slot')+'</button>', {lg:true});
}
function doSlotPay(btn){
  payThen({kind:'slot', key:'slot', label:'Emplacement projet n° '+Math.min(MAX_PROJ, S.me.slots + 1), amount:priceOf('slot').charged}, btn, () => {
    S.me.slots = Math.min(MAX_PROJ, S.me.slots + 1);
    S.payments.unshift({d:today(), l:'Emplacement projet n° '+S.me.slots, a:priceOf('slot').charged, op:S.pay.op, ref:S.pay.ref, cc:S.pay.cc});
    closeLayer(); confetti(); newProject();
    toast('Emplacement débloqué. Remplis ta nouvelle fiche.', 'ok');
  });
}
function newProject(){
  if(S.view === 'fiche' && isDirty()) commitFiche();
  saveCtx();
  S.me.projects.push(blankProject()); S.me.projIdx = S.me.projects.length - 1;
  loadCtx(); resetUi(); saveBaseline();
  S._painted = null; go('fiche');
  setTimeout(() => { const i = $('#ptitle'); if(i) try{ i.focus(); }catch(e){} }, 60);
}
function deleteProject(){
  const m = S.me, p = m.project, t = S.teams[p.id];
  if(m.projects.length < 2) return modal('Supprimer cette fiche', '<p>C\'est ta seule fiche projet. Pour ne plus être visible, mets-la simplement <b>hors ligne</b>.</p>', '<button class="btn btn-a" data-act="close">Compris</button>');
  if(t && talentsOf(t).length) return modal('Suppression impossible', '<p><b>'+esc(projName(p))+'</b> a une équipe active ('+talentsOf(t).map(x => x.first).join(', ')+'). Retire d\'abord les talents de l\'équipe depuis l\'Atelier, ou mets la fiche hors ligne.</p>', '<button class="btn btn-a" data-act="close">Compris</button>');
  modal('Supprimer « '+projName(p)+' » ?', '<p>La fiche, ses invitations en attente et ses statistiques sont effacées. Les conversations passées restent archivées chez les talents concernés.</p>'
    + note('', 'info', 'L\'emplacement reste acquis : tu pourras y créer un autre projet sans repayer.'),
    '<button class="btn btn-ghost" data-act="close">Annuler</button><button class="btn btn-danger" data-act="proj-del-go">'+ic('trash')+'Supprimer la fiche</button>');
}
function doDeleteProject(){
  const m = S.me, p = m.project;
  closeLayer();
  delete S.ctxs['vis:'+p.id];
  m.projects.splice(m.projIdx, 1); m.projIdx = 0;
  loadCtx(); resetUi(); saveBaseline(); S._painted = null; go('fiche');
  toast('Fiche « '+projName(p)+' » supprimée. L\'emplacement reste disponible.', 'ok');
}
function demoReset(){
  if(!isTalMode()){ saveCtx(); S.me.role = 'tal'; loadCtx(); }
  const m = S.me;
  m.visUnlocked = false; m.visSince = null; m.slots = 1;
  m.projects = [blankProject()]; m.projIdx = 0;
  Object.keys(S.ctxs).filter(k => k !== 'tal').forEach(k => delete S.ctxs[k]); delete S.prof.vis;
  S.payments = S.payments.filter(x => !/Second profil|Emplacement projet/.test(x.l));
  resetUi(); saveBaseline(); S._painted = null; go('parametres');
  toast('Démo : second profil et emplacements remis à zéro.', 'ok');
}

/* ============================================================
   Paramètres et aide
   ============================================================ */
function vParams(){
  const m = S.me, n = trustRungs().filter(r => r[1]).length, tal = isTalMode();
  const second = (tmPrimary() === 'vis' && !m.visUnlocked) ? tmSecondTalHTML() : !m.visUnlocked
    ? '<p style="font-size:13.5px;color:var(--ink-2);line-height:1.6;margin-bottom:12px">Porte aussi tes idées : publie jusqu\'à 3 projets et invite des talents. <b style="color:var(--ink)">'+priceH('second')+' une seule fois</b>, puis tu passes d\'un profil à l\'autre sans limite.</p>'
      + '<button class="btn btn-vis btn-block btn-sm" data-act="switch-role">💡 Deviens aussi Visionnaire</button>'
    : '<p style="font-size:13.5px;color:var(--ink-2);line-height:1.6;margin-bottom:6px">'+(m.visSince ? 'Débloqué le <span class="mono">'+new Date(m.visSince).toLocaleDateString('fr-FR')+'</span>' : 'Débloqué')+'. Tu es '+roleLabel(m.role)+'.</p>'
      + '<p class="hint" style="margin-bottom:12px">Tes deux profils sont indépendants : chacun a ses matchs, ses invitations, ses conversations et ses Ateliers. Ce compte (nom, email, ville, sexe, confiance) leur est commun.</p>'
      + '<button class="btn '+(tal ? 'btn-vis' : 'btn-tal')+' btn-block btn-sm" data-act="switch-role">'+(tal ? '💡 Passer en Visionnaire' : '🛠️ Passer en Talent')+'</button>'
      + (m.fresh ? '' : '<button class="lnk demo-reset" data-act="demo-reset">Démo : réinitialiser le second profil</button>');
  return '<div class="page-h"><div><h1><span class="acc">Paramètres</span></h1><p class="sub">Ton compte, ta confiance, tes préférences. Communs à tes deux profils.</p></div></div>'
    + '<div class="cols cols-side"><div class="col" style="gap:16px">'
    +   '<section class="card card-pad"><div class="lbl" style="margin-bottom:12px">Compte</div>'
    +     '<div class="row" style="gap:14px;flex-wrap:wrap"><span class="av av-56 '+tintCls(m.role, m.avatarHue)+'" style="'+tintAng(m.avatarHue)+'" aria-hidden="true">'+esc(initials(myName()))+'</span>'
    +       '<div style="flex:1;min-width:180px"><div style="font-weight:600;font-size:15px">'+esc(myName())+' <span class="handle">'+esc(myHandle())+'</span></div>'
    +         '<div class="row" style="gap:6px;font-size:13.5px;color:var(--ink-2);margin-top:3px">'+ic('mail')+esc(m.email)+'</div>'
    +         '<div class="row acct-tel" style="gap:6px;font-size:13.5px;color:var(--ink-2)">'+ic('phone')+'<span class="mono">'+esc(m.phone || '—')+'</span>'
    +           (!PHONE_VERIFY ? '' : m.verifiedPhone ? '<span class="chip chip-ok" style="height:20px;font-size:11px">'+ic('check')+'Vérifié</span>' : '<span class="chip chip-warn" style="height:20px;font-size:11px">Non vérifié</span> <button class="lnk" data-act="verify-phone">Vérifier</button>')+'</div>'
    +         '<div class="hint" style="margin:0 0 2px 21px">Privé : jamais affiché sur tes fiches, même après un match.</div>'
    +         '<div class="row" style="gap:6px;font-size:13.5px;color:var(--ink-2)">'+ic('pin')+esc(m.city)+'</div>'
    +         '<div class="row" style="gap:6px;font-size:13.5px;color:var(--ink-2)">'+ic('usercheck')+'Sexe : '+SEX_L[m.sex||'n']+'</div></div>'
    +       '<button class="btn btn-ghost btn-sm" data-act="edit-account">'+ic('edit')+'Modifier</button></div></section>'
    +   '<section class="card card-pad"><div class="row" style="margin-bottom:4px"><div class="lbl" style="flex:1">Vérification · échelle de confiance</div>'
    +     '<span class="chip '+(n>=trustRungs().length-1?'chip-ok':'chip-warn')+'"><span class="mono">'+n+' / '+trustRungs().length+'</span></span></div>'
    +     '<p class="hint" style="margin-bottom:8px">Chaque palier franchi augmente ta visibilité. La référence est le signal le plus fort : il dit quelque chose de ta fiabilité, pas seulement de ton identité.</p>'
    +     ladderHTML(true)+'</section>'
    +   '<section class="card card-pad"><div class="lbl" style="margin-bottom:4px">Notifications</div>'
    +     settingRow('inv','Invitations reçues','Push et email, dès réception')
    +     settingRow('match','Nouveaux matchs','Push et email')
    +     settingRow('msg','Nouveaux messages','Push, uniquement après un match')
    +     settingRow('sms','Rappels par SMS','Invitation sur le point d\'expirer (2 jours avant)')
    +     settingRow('weekly','Suggestions hebdomadaires','Un résumé le lundi matin')+'</section>'
    +   '<section class="card card-pad"><div class="lbl" style="margin-bottom:8px">Apparence</div>'
    +     '<div class="row"><div style="flex:1"><div style="font-weight:600;font-size:14px">Thème sombre</div><div class="hint">Suit ton système tant que tu n\'as rien choisi.</div></div>'
    +     '<button class="toggle" data-act="theme" aria-pressed="'+themeIsDark()+'" aria-label="Thème sombre"></button></div></section>'
    +   '<section class="card card-pad"><div class="lbl" style="margin-bottom:4px">Centre juridique</div>'
    +     ["Conditions générales d'utilisation",'Politique de confidentialité','Mentions légales',"Modèle de pacte d'associés (OHADA)"].map(l => linkRow('file', l, 'legal')).join('')+'</section>'
    +   '<section class="card card-pad" style="border-color:var(--bad-bg)"><div class="lbl" style="margin-bottom:4px;color:var(--bad-ink)">Données et compte</div>'
    +     linkRow('dl','Télécharger mes données','export')+linkRow('out','Se déconnecter','logout')+linkRow('trash','Supprimer définitivement mon compte','delete-account',true)+'</section>'
    + '</div><div class="col" style="gap:14px">'
    +   '<section class="card card-pad"><div class="lbl" style="margin-bottom:8px">Ton second profil</div>'+second+'</section>'
    +   (tal ? freeCard() : creditsCard())
    +   '<section class="card card-pad"><div class="lbl" style="margin-bottom:8px">Facturation</div>'
    +     '<p style="font-size:13.5px;color:var(--ink-2);line-height:1.6">Aucun abonnement. Tu paies seulement ce que tu utilises, par mobile money ou carte bancaire.</p>'
    +     ((m.visUnlocked || tmPrimary() === 'vis') ? '<div class="row bill-slots"><span>Emplacements projet</span><b class="mono">'+m.slots+' sur 3 débloqués</b></div>'
            + (m.slots < MAX_PROJ ? '<p class="hint">Un emplacement de plus : <span class="mono">'+priceH('slot')+'</span>, une seule fois.</p>' : '') : '')
    +     (S.payments.length ? '<div class="list" style="margin-top:8px">'+S.payments.map(p => '<div class="li" style="padding:10px 0;cursor:default"><span class="grow"><span class="t" style="font-size:13.5px">'+esc(p.l)+'</span><span class="s mono">'+esc(p.d)+' · '+esc(p.op)+'</span></span><span class="mono" style="font-size:13px;font-weight:600">'+fcfa(p.a)+'</span></div>').join('')+'</div>' : '')
    +   '</section>'
    + '</div></div>';
}
function vSupport(){
  const faq = [
    ["Pourquoi mon nom est-il caché ?","Ton nom légal, ta photo et tes coordonnées ne sont dévoilés qu'après un match accepté. Avant, ta photo est floutée. Personne ne peut te contacter hors de la plateforme sans que tu l'aies voulu."],
    ["Combien coûte TakaMatch ?","Le profil Talent est gratuit : explorer, publier sa fiche et postuler n'a pas de limite. Le profil Visionnaire se débloque une fois pour "+priceT('second')+" ; il inclut une fiche projet, et chaque emplacement de plus coûte "+priceT('slot')+", une seule fois (3 projets au maximum). Inviter un talent coûte un crédit : 3 offerts par mois, puis des packs à partir de "+fcfa(2000)+"."],
    ["Qui voit ma fiche ?","Les talents voient les fiches projet, les visionnaires voient les fiches talent : jamais une fiche de ton propre côté. Les visiteurs sans compte arrivés par ton lien ou ton code QR peuvent la lire, pas t'inviter. Hors ligne, ta fiche n'apparaît nulle part."],
    ["Que se passe-t-il après un match ?","La messagerie s'ouvre et l'Atelier devient accessible : jalons partagés, plan d'action, qui décide quoi, répartition du capital, journal de décisions et génération du pacte d'associés. À partir de 3 membres, un groupe d'équipe s'ouvre dans les Messages."],
    ["Puis-je être visionnaire et talent ?","Oui. Un seul compte, deux profils indépendants : chacun a ses matchs, ses invitations, ses conversations et ses Ateliers. Tu bascules depuis le menu de ton profil, et l'interface change de couleur."],
    ["Puis-je quitter un projet ?","Oui, depuis l'Atelier : « Quitter le projet ». Ta part proposée est annulée, ta conversation avec le porteur est archivée des deux côtés, en lecture seule. Le porteur, lui, peut retirer un talent de l'équipe en donnant un motif. Les messages ne sont jamais supprimés."],
    ["Que devient mon crédit si l'invitation expire ?","Une invitation sans réponse expire au bout de 10 jours et ton crédit t'est rendu."],
    ["Comment signaler un comportement ?","Chaque fiche et chaque conversation portent un bouton de signalement. Une personne de l'équipe le traite sous 48 h."],
  ];
  return '<div class="page-h"><div><h1>Aide et <span class="acc">support</span></h1><p class="sub">Une vraie personne répond, à Cotonou, du lundi au samedi.</p></div></div>'
    + '<div class="cols cols-side"><div class="col" style="gap:16px">'
    +   '<section class="card card-pad"><h3 style="font-size:18px;margin-bottom:12px">Écris-nous</h3>'
    +     '<div class="row" style="padding:11px 13px;gap:11px;background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-md);margin-bottom:14px">'
    +       '<span class="av av-36 '+tintCls(S.me.role, S.me.avatarHue)+'" style="'+tintAng(S.me.avatarHue)+'" aria-hidden="true">'+esc(initials(myName()))+'</span>'
    +       '<div><div style="font-weight:600;font-size:13.5px">'+esc(myName())+'</div><div style="font-size:12.5px;color:var(--ink-3)">Réponse envoyée à '+esc(S.me.email)+'</div></div></div>'
    +     '<form class="col" style="gap:12px" data-form="support">'
    +       field('supTopic','Sujet','<select class="inp" id="supTopic"><option>Une question sur mon compte</option><option>Un problème technique</option><option>Un paiement mobile money</option><option>Signaler un comportement</option><option>Une idée d\'amélioration</option></select>')
    +       field('supportMsg','Ton message','<textarea class="inp" id="supportMsg" placeholder="Décris ce qui se passe. Si c\'est un bug, dis-nous sur quel écran."></textarea>', true)
    +       '<div><button class="btn btn-a" type="submit">'+ic('send')+'Envoyer le message</button></div></form></section>'
    +   '<section class="card card-pad"><h3 style="font-size:18px;margin-bottom:6px">Questions fréquentes</h3>'
    +     faq.map((f,i) => '<details class="fq"'+(i===0?' open':'')+'><summary>'+esc(f[0])+'<span class="pm" aria-hidden="true"></span></summary><p>'+esc(f[1])+'</p></details>').join('')
    +   '</section>'
    + '</div><div class="col" style="gap:14px">'
    +   supportRail()
    + '</div></div>';
}

/* ============================================================
   Connexions : invitations rattachées au projet actif
   ============================================================ */
function inviteRow(inv){
  const x = itemById(inv.id);
  const st = {new:['chip-warn','À traiter'], sent:['chip-warn','En attente'], accepted:['chip-ok','Acceptée'], declined:['','Déclinée'], expired:['','Expirée']}[inv.status] || ['','—'];
  const left = Math.max(0, INV_DAYS - Math.floor(inv.min/1440));
  const pending = inv.status === 'new' || inv.status === 'sent';
  const dir = inv.dir === 'recv' ? 'Reçue' : 'Envoyée';
  const pour = isTalMode() ? '' : ' pour <b class="for-p">'+esc(projName(S.me.project))+'</b>';
  const active = S.matches.some(m => m.id === inv.id);
  const acts = inv.status === 'new'
    ? '<span class="inv-acts"><button class="btn btn-soft btn-sm" data-act="accept" data-id="'+inv.id+'">'+ic('check')+'Accepter</button>'
      + '<button class="btn btn-quiet btn-sm" data-act="decline" data-id="'+inv.id+'">Décliner</button></span>'
    : inv.status === 'accepted' && active ? '<span class="inv-acts"><button class="btn btn-ghost btn-sm" data-act="open-thread" data-id="'+inv.id+'">'+ic('chat')+'Discuter</button></span>'
    : '<span class="inv-acts"><button class="btn btn-quiet btn-sm" data-act="open" data-id="'+inv.id+'">Voir</button></span>';
  return '<div class="li wrap-m">'+thumb(x, 44)
    + '<span class="grow"><span class="t">'+nameHTML(x)+'</span>'
    + '<span class="s">'+dir+pour+' '+ago(inv.min)+(inv.msg ? ' · « '+esc(inv.msg)+' »' : '')+'</span></span>'
    + '<span class="chip '+st[0]+'" style="flex:0 0 auto">'+st[1]+'</span>'
    + (pending ? '<span class="chip'+(left<=3?' chip-bad':'')+' hide-m" style="flex:0 0 auto">'+ic('clock')+'expire dans <span class="mono">'+left+' j</span></span>' : '')
    + acts + '</div>';
}

/* ============================================================
   Cartes, appels à l'action : quitter, retirer, 30 jours
   ============================================================ */
function ctaCard(x){
  const tal = isTalMode(), matched = isUnlocked(x.id), active = S.matches.some(m => m.id === x.id);
  const sent = S.invitesSent.some(i => i.id === x.id && i.status === 'sent');
  const recv = S.invitesRecv.find(i => i.id === x.id && i.status === 'new');
  const rd = !tal ? removedDays(x.id) : null;
  let h;
  if(matched && !active && tal) h = note('', 'logout', 'Tu as quitté ce projet. La conversation reste dans tes archives, en lecture seule.');
  else if(!tal && rd !== null && rd < REINVITE_DAYS) h = note('', 'userx', 'Tu as retiré ce talent de l\'équipe il y a '+(rd ? rd+' j' : 'moins d\'un jour')+'. Tu pourras l\'inviter de nouveau dans <span class="mono">'+(REINVITE_DAYS - rd)+' j</span>.');
  else if(matched && active) h = '<button class="btn btn-soft btn-block" data-act="open-thread" data-id="'+x.id+'">'+ic('chat')+'Discuter</button>'
    + '<button class="btn btn-quiet btn-sm btn-block" style="margin-top:6px" data-act="open-atelier" data-id="'+x.id+'">'+ic('tools')+'Ouvrir l\'Atelier</button>';
  else if(!tal && FULL.has(x.id)) h = '<button class="btn btn-ghost btn-block" disabled>'+ic('lock')+'Complet · 3 projets sur 3</button>'
    + '<p class="hint" style="margin-top:9px;text-align:center">Ce talent ne peut pas rejoindre un nouveau projet pour l\'instant. Garde-le en favori.</p>';
  else if(recv) h = '<div class="lbl" style="margin-bottom:6px">'+(tal ? 'Ce projet t\'invite' : 'Ce talent veut rejoindre '+esc(projName(S.me.project)))+'</div>'
    + (recv.msg ? '<p style="font-size:13.5px;color:var(--ink-2);line-height:1.55;margin-bottom:12px">« '+esc(recv.msg)+' »</p>' : '')
    + '<div class="row" style="gap:8px"><button class="btn btn-soft" style="flex:1" data-act="accept" data-id="'+x.id+'">'+ic('check')+'Accepter</button>'
    + '<button class="btn btn-quiet" data-act="decline" data-id="'+x.id+'">Décliner</button></div>'
    + '<p class="hint" style="margin-top:9px">Expire dans <span class="mono">'+Math.max(0, INV_DAYS - Math.floor(recv.min/1440))+' j</span>. Accepter dévoile vos identités.'+(tal ? ' Tu es sur <span class="mono">'+engagedN()+'/3</span> projets.' : '')+'</p>';
  else if(sent) h = note('warn','clock','Invitation envoyée, en attente de réponse. Elle expire au bout de '+INV_DAYS+' jours.');
  else if(isFull()) h = '<button class="btn btn-ghost btn-lg btn-block" data-act="invite" data-id="'+x.id+'">'+ic('lock')+'Complet · 3 projets sur 3</button>'
    + '<p class="hint" style="margin-top:9px;text-align:center">Quitte un projet pour rejoindre celui-ci.</p>';
  else h = '<button class="btn btn-soft btn-lg btn-block" data-act="invite" data-id="'+x.id+'">'+ic('send')+'Envoyer une invitation</button>'
    + '<p class="hint" style="margin-top:9px;text-align:center">'+(tal ? 'Gratuit et illimité · tu es sur <span class="mono">'+engagedN()+'/3</span> projets.' : 'Pour '+esc(projName(S.me.project))+' · 1 crédit sur les '+S.me.credits+' restants.')+'</p>';
  return '<div class="card card-pad">'+h+'</div>';
}
function card(x, s){
  const tal = isTalMode();
  const fav = S.favs.has(x.id), matched = isUnlocked(x.id), active = S.matches.some(m => m.id === x.id);
  const inv = S.invitesSent.find(i => i.id === x.id && i.status === 'sent');
  const recv = S.invitesRecv.find(i => i.id === x.id && i.status === 'new');
  const rd = !tal ? removedDays(x.id) : null;
  const favBtn = '<span class="fav"><button class="iconbtn'+(fav?' on':'')+'" data-act="fav" data-id="'+x.id+'" aria-label="'+(fav?'Retirer des favoris':'Ajouter aux favoris')+'" aria-pressed="'+fav+'">'+ic('star')+'</button></span>';
  const cta = active ? '<button class="btn btn-ghost btn-sm" style="flex:1" data-act="open-thread" data-id="'+x.id+'">'+ic('chat')+'Discuter</button>'
    : (!tal && rd !== null && rd < REINVITE_DAYS) ? '<button class="btn btn-ghost btn-sm" style="flex:1" disabled>'+ic('userx')+'Retiré · '+(REINVITE_DAYS - rd)+' j</button>'
    : matched && tal ? '<button class="btn btn-ghost btn-sm" style="flex:1" disabled>'+ic('logout')+'Projet quitté</button>'
    : (!tal && FULL.has(x.id)) ? '<button class="btn btn-ghost btn-sm" style="flex:1" disabled>'+ic('lock')+'Complet · 3/3</button>'
    : recv ? '<button class="btn btn-soft btn-sm" style="flex:1" data-act="open" data-id="'+x.id+'">'+ic('link')+'Répondre</button>'
    : inv ? '<button class="btn btn-ghost btn-sm" style="flex:1" disabled>'+ic('clock')+'Invitation envoyée</button>'
    : (tal && isFull()) ? '<button class="btn btn-ghost btn-sm" style="flex:1" data-act="invite" data-id="'+x.id+'">'+ic('lock')+'Complet · 3/3</button>'
    : '<button class="btn btn-soft btn-sm" style="flex:1" data-act="invite" data-id="'+x.id+'">'+ic('send')+'Inviter'+(tal?'':' · 1 crédit')+'</button>';
  const foot = '<div class="sc-line">'+scoreBar(s.total)+'</div><div class="foot">'+cta
    + '<button class="btn btn-ghost btn-sm" data-act="open" data-id="'+x.id+'" aria-label="'+(tal?'Voir le projet':'Voir le profil')+'">Voir</button></div>';
  const chips = (list, base) => '<div class="chips"><span class="chips-l">'+(tal ? 'Recherche :' : 'Compétences :')+'</span>'+list.slice(0,3).map(sk => '<span class="chip '+(mine().includes(sk)?'chip-a':base)+'">'+esc(skillL(sk))+'</span>').join('')+'</div>';
  if(!tal){
    return '<article class="pcard person"><div class="cover '+tintCls('tal', x.hue)+'" style="'+tintAng(x.hue)+'">'+favBtn+'<span class="portrait">'+avatarOf(x, 72)+'</span></div>'
      + '<div class="body"><h3>'+nameHTML(x)+'</h3>'
      +   '<div class="who"><span class="handle">'+esc(handleOf(x))+'</span><span class="sep">·</span>'+esc(cityOf(x.city)[0])
      +   (FULL.has(x.id) ? '<span class="chip chip-warn">Complet</span>' : vBadge('tal', x.verified))+'</div>'
      +   '<p class="ex">'+esc(x.bio)+'</p>'+chips(x.skills||[], 'chip-tal')+foot+'</div></article>';
  }
  const cv = projCover(x), pay = PAY.find(p => p.id === x.pay);
  return '<article class="pcard"><div class="cover '+cv.cls+'" style="'+cv.style+'">'+(cv.ph ? '' : '<span class="glyph" aria-hidden="true">'+x.glyph+'</span>')
    +   '<span class="tags">'+(x.sectors||[]).slice(0,2).map(id => '<span class="chip chip-onart">'+sector(id).g+' '+esc(sector(id).l)+'</span>').join('')+'</span>'
    +   favBtn+'<span class="chip chip-handle" style="position:absolute;bottom:8px;left:9px">'+esc(handleOf(x))+'</span></div>'
    + '<div class="body"><h3>'+esc(x.title)+'</h3>'
    +   '<div class="who">'+esc(cityOf(x.ownerCity)[0])+'<span class="sep">·</span>'+likeHTML(x)
    +   vBadge('vis', x.ownerVerified)+'</div>'
    +   '<p class="ex">'+esc(x.hook)+'</p>'
    +   (pay && pay.id !== 'equity' ? '<span class="pay-l">'+ic('coins')+esc(pay.l)+'</span>' : '')
    +   chips(x.seeking||[], '')+foot+'</div></article>';
}
function invite(id){
  const x = itemById(id); if(!x.id) return;
  const tal = isTalMode();
  if(!tal && FULL.has(id)) return toast('Ce talent est déjà engagé sur 3 projets.', 'bad');
  if(!tal){ const rd = removedDays(id); if(rd !== null && rd < REINVITE_DAYS) return toast('Tu as retiré ce talent il y a '+rd+' j. Nouvelle invitation possible dans '+(REINVITE_DAYS - rd)+' j.', 'bad'); }
  if(isFull()) return fullModal({type:'invite', id});
  if(!tal && S.me.credits <= 0) return buyCredits(true);
  modal('Envoyer une invitation',
    '<div class="row" style="gap:12px;padding:12px;border:1px solid var(--line);border-radius:var(--r-lg);background:var(--surface-2)">'+thumb(x,44)
    + '<div style="min-width:0"><div style="font-weight:600;color:var(--ink)">'+nameHTML(x)+'</div><div class="hint">'+esc(handleOf(x))+' · compatibilité <span class="mono">'+scoreOf(x).total+'/100</span>'+(tal ? '' : ' avec '+esc(projName(S.me.project)))+'</div></div></div>'
    + '<p>Une invitation courte et précise obtient trois fois plus de réponses qu\'un message type. Dis pourquoi <b>'+(tal ? 'ce projet' : 'ce talent')+'</b>, et ce que tu apportes.</p>'
    + '<div class="field"><label for="invMsg">Ton message</label>'
    + '<textarea class="inp" id="invMsg" maxlength="300" placeholder="'+esc(tal ? "Bonjour, votre section Défis me parle directement : j'ai déjà porté ce type de problème sur…" : "Bonjour, votre expérience sur… correspond exactement au blocage décrit dans ma fiche.")+'"></textarea>'
    + '<div class="cnt-r" data-cnt="invMsg" data-max="300">300 caractères restants</div>'
    + '<p class="hint">Ton nom légal ne sera révélé que si l\'invitation est acceptée. Sans réponse, elle expire au bout de '+INV_DAYS+' jours.</p></div>'
    + (tal ? note('ok','gift','Gratuit et illimité pour les talents. Tu es sur <span class="mono">'+engagedN()+'/3</span> projets.')
           : note('a','zap','Pour <b>'+esc(projName(S.me.project))+'</b>. Coût : <b>1 crédit</b>, il t\'en restera <span class="mono">'+(S.me.credits-1)+'</span>. Rendu si l\'invitation expire sans réponse.'))
    + '<div id="invErr"></div>',
    '<button class="btn btn-ghost" data-act="'+(S.layer === 'fiche' ? 'back-fiche' : 'close')+'">Annuler</button><button class="btn btn-a" data-act="invite-send" data-id="'+id+'">'+ic('send')+'Envoyer l\'invitation</button>');
}
function createMatch(id, celebrate){
  if(S.matches.some(m => m.id === id)) return;
  const x = itemById(id); if(!x.id) return;
  S.matches.unshift({id, fresh:true, min:0}); S.left.delete(id); if(S.removed) delete S.removed[id];
  const partner = isTalMode() ? x.owner : x.name;
  let th = S.threads.find(z => z.id === id);
  if(th){ th.archived = false; th.ro = false; }
  else S.threads.unshift({id, unread:true, archived:false, msgs:[{me:false, d:new Date(), txt: isTalMode()
    ? "Bonjour "+S.me.first+", merci pour ton message. Ta lecture de nos défis est juste. On se cale 45 minutes cette semaine ?"
    : "Merci pour l'invitation. J'ai lu la fiche de "+projName(S.me.project)+" : la partie traction m'a convaincu. Quand peut-on échanger ?"}]});
  if(isTalMode()){
    const t = newTeam(x.id, x.title, x.glyph, [memberOwner(x), memberMe('tal')]);
    teamLog(t, 'Match confirmé : '+S.me.first+' rejoint '+x.title, "L'Atelier est ouvert.");
    S.teams[x.id] = t;
    if(engagedN() >= MAX_ENGAGE) pushNotif('takam', 'Takam · 3 projets sur 3', 'Tu es au maximum. Pour rejoindre un autre projet, il faudra en quitter un.');
  } else {
    const p = S.me.project;
    let t = S.teams[p.id];
    if(!t){ t = newTeam(p.id, projName(p), p.glyph, [memberMe('vis')]); t.equity = {}; S.teams[p.id] = t; teamLog(t, 'L\'Atelier de '+projName(p)+' est ouvert'); }
    const m = memberTal(x), was = t.members.length;
    t.members.push(m); t.equity[m.id] = 10;
    teamLog(t, m.first+' rejoint l\'équipe', 'Sa part de capital est à proposer.');
    if(t.members.length >= 3){
      if(was < 3) t.group.push({sys:true, txt:'Le groupe de l\'équipe est ouvert : '+t.members.map(z => z.me ? S.me.first : z.first).join(', ')+'.', d:new Date()});
      else t.group.push({sys:true, txt:m.first+' a rejoint le groupe.', d:new Date()});
      t.groupClosed = false;
    }
    if(talentsOf(t).length) propose(t, 'capital', 'Capital : '+t.members.map(z => (z.me ? S.me.first : z.first)+' '+shareOf(t, z.id)+' %').join(', '));
  }
  pushNotif('spark', 'Nouveau match', partner+' : la messagerie et l\'Atelier sont ouverts.');
  render();
  if(celebrate){
    confetti();
    modal('', '<div class="ov-ok"><div style="position:relative;margin-bottom:12px">'+revealAv(x)+'</div>'
      + '<h2 class="ov-t" id="ovT" style="margin:0 0 8px">Vous avez matché</h2>'
      + '<p style="max-width:40ch"><b>'+esc(partner)+'</b> a accepté. Vos noms, photos et coordonnées sont maintenant visibles, la messagerie est ouverte et l\'Atelier vous attend.</p></div>'
      + note('a','target','Première étape recommandée : <b>une visio de 45 minutes</b>, avant tout engagement.')
      + (isTalMode() ? note('', 'users', 'Tu es maintenant sur <span class="mono">'+engagedN()+'/3</span> projets.') : ''),
      '<button class="btn btn-ghost" data-act="close">Plus tard</button><button class="btn btn-a" data-act="goto-thread" data-id="'+id+'">'+ic('chat')+'Ouvrir la discussion</button>');
  }
}

/* ---------- Limite de 3 projets et départ d'un talent ---------- */
function fullModal(pending, lead){
  S.pendingJoin = pending || null;
  const rows = S.matches.map(m => { const x = itemById(m.id), t = S.teams[m.id];
    const done = t ? t.milestones.filter(k => k.done).length : 0;
    return '<div class="li" style="cursor:default">'+thumb(x, 44)+'<span class="grow"><span class="t">'+esc(x.title)+'</span>'
      + '<span class="s">'+done+'/6 jalons · ta part proposée '+(t ? shareOf(t, 'me') : 0)+' % · depuis '+ago(m.min)+'</span></span>'
      + '<button class="btn btn-ghost btn-sm" data-act="leave" data-id="'+m.id+'">'+ic('logout')+'Quitter le projet</button></div>'; }).join('');
  modal('Tu es déjà engagé'+g(S.me.sex,'','e','·e')+' sur 3 projets',
    (lead ? '<p>'+lead+'</p>' : '')
    + '<p>Un talent peut rejoindre <b>3 projets au maximum</b> en même temps : c\'est ce qui garantit à chaque équipe un vrai engagement. Pour en rejoindre un nouveau, quitte d\'abord l\'un de ceux-ci.</p>'
    + '<div class="card"><div class="list" style="padding:6px">'+rows+'</div></div>',
    '<button class="btn btn-ghost" data-act="close">Annuler</button>', {lg:true});
}
function leaveModal(id){
  const x = itemById(id), t = S.teams[id];
  S.leaveId = id;
  modal('Quitter '+x.title+' ?',
    '<ul class="leave-l">'
    + '<li>'+ic('users')+'Tu quittes l\'équipe et l\'Atelier. Le groupe disparaît de tes messages.</li>'
    + '<li>'+ic('award')+'Ta part de capital proposée ('+(t ? shareOf(t,'me') : 0)+' %) est annulée.</li>'
    + '<li>'+ic('book')+'Ton historique reste dans le journal de décisions.</li>'
    + '<li>'+ic('bell')+'Le porteur et l\'équipe sont prévenus. Takam relaie l\'information.</li>'
    + '<li>'+ic('archive')+'Ta conversation privée avec le porteur est archivée des deux côtés, en lecture seule. Les messages ne sont jamais supprimés.</li></ul>'
    + '<div class="field"><label>Pourquoi ?</label><div class="col" style="gap:6px">'+['Je manque de temps','Désaccord sur la direction du projet','Une autre opportunité','Autre raison'].map((l,i) =>
      '<button class="opt radio" data-act="leave-reason" data-v="'+esc(l)+'" aria-pressed="'+(i===0)+'"><span class="box">'+tick()+'</span><span>'+l+'</span></button>').join('')+'</div></div>'
    + field('leaveTxt','Un mot pour l\'équipe (facultatif)','<textarea class="inp" id="leaveTxt" style="min-height:80px" placeholder="Ce que tu veux qu\'ils sachent."></textarea>'),
    '<button class="btn btn-ghost" data-act="'+(S.pendingJoin ? 'leave-back' : 'close')+'">Annuler</button><button class="btn btn-danger" data-act="leave-go">'+ic('logout')+'Quitter le projet</button>');
}
function doLeave(id){
  const x = itemById(id), t = S.teams[id];
  const why = ($('#layer .opt[data-act="leave-reason"][aria-pressed="true"]') || {dataset:{v:'Autre raison'}}).dataset.v;
  S.matches = S.matches.filter(m => m.id !== id); S.left.add(id);
  const th = S.threads.find(z => z.id === id); if(th){ th.archived = true; th.ro = true; th.unread = false; }
  if(t) teamLog(t, S.me.first+' a quitté le projet', why);
  delete S.teams[id];
  if(S.atelierId === id) S.atelierId = Object.keys(S.teams)[0] || null;
  if(S.activeThread === 'G:'+id) S.activeThread = null;
  pushNotif('logout', 'Tu as quitté '+x.title, 'Le porteur et l\'équipe sont prévenus. Il te reste '+(MAX_ENGAGE - engagedN())+' place'+((MAX_ENGAGE - engagedN())>1?'s':'')+'.');
  closeLayer();
  toast('Tu as quitté '+x.title+'.', 'ok');
  const pj = S.pendingJoin; S.pendingJoin = null;
  render();
  if(pj){ setTimeout(() => { if(pj.type === 'accept') acceptInvite(pj.id); else if(pj.type === 'invite') invite(pj.id); else if(pj.type === 'join') createMatch(pj.id, true); }, 250); }
}
function engageCard(){
  const n = engagedN();
  return '<section class="card card-pad"><div class="row" style="margin-bottom:4px"><div class="lbl" style="flex:1">Tes engagements</div><span class="chip'+(n>=MAX_ENGAGE?' chip-warn':'')+'"><span class="mono">'+n+' / '+MAX_ENGAGE+'</span></span></div>'
    + '<div class="gauge" aria-hidden="true">'+Array.from({length:MAX_ENGAGE},(_,i) => '<i class="'+(i<n?'on':'')+'"></i>').join('')+'</div>'
    + '<p class="hint" style="margin-bottom:8px">'+(n >= MAX_ENGAGE ? 'Tu es au maximum : pour rejoindre un nouveau projet, quitte d\'abord l\'un des tiens.' : 'Il te reste '+(MAX_ENGAGE-n)+' place'+(MAX_ENGAGE-n>1?'s':'')+'. Un talent rejoint 3 projets au plus en même temps.')+'</p>'
    + (n ? '<div class="list">'+S.matches.map(m => { const x = itemById(m.id);
        return '<button class="li" data-act="open-atelier" data-id="'+m.id+'" style="padding:9px 0">'+thumb(x, 28)+'<span class="grow"><span class="t" style="font-size:13.5px">'+esc(x.title)+'</span></span><span class="hint row" style="gap:4px">Atelier'+ic('chev')+'</span></button>'; }).join('')+'</div>' : '')
    + '</section>';
}

/* ---------- Le porteur retire un talent ---------- */
const RM_REASONS = ['Engagement non tenu','Désaccord sur la direction du projet','Comportement inapproprié','Départ d\'un commun accord','Autre raison'];
function rmModal(id){
  const t = curTeam(); if(!t || !isAdmin(t)) return;
  const m = memberById(t, id), share = shareOf(t, id);
  const roles = DOMAINS.filter(d => t.roles[d.id] === id).map(d => d.l.toLowerCase());
  const tasks = allTasks(t).filter(k => k.owner === id && k.status !== 'done');
  const pacte = t.log.some(l => /Pacte d'associés commandé/.test(l.t));
  S.rmId = id;
  modal('Retirer '+m.first+' de l\'équipe ?',
    '<ul class="leave-l">'
    + '<li>'+ic('lock')+m.first+' perd l\'accès à l\'Atelier de '+esc(t.title)+' et au groupe de l\'équipe.</li>'
    + '<li>'+ic('award')+'Sa part de capital proposée ('+share+' %) est annulée.</li>'
    + '<li>'+ic('users')+(roles.length ? 'Ses rôles repassent à « À décider » : '+esc(roles.join(', '))+'.' : 'Aucun rôle ne lui était attribué.')+'</li>'
    + '<li>'+ic('target')+(tasks.length ? tasks.length+' tâche'+(tasks.length>1?'s':'')+' en cours te revien'+(tasks.length>1?'nent':'t')+'.' : 'Aucune tâche en cours à réattribuer.')+'</li>'
    + '<li>'+ic('ticks')+'Ses validations en attente sont retirées des propositions.</li>'
    + '<li>'+ic('book')+'Le journal de décisions garde une trace datée, avec le motif.</li>'
    + '<li>'+ic('bell')+m.first+' est '+g(m.sex,'prévenu','prévenue','prévenu·e')+' et une place se libère dans ses 3 projets.</li>'
    + '<li>'+ic('archive')+'Votre conversation privée est archivée des deux côtés, en lecture seule. Rien n\'est supprimé.</li>'
    + '<li>'+ic('clock')+'Tu ne pourras pas l\'inviter de nouveau avant '+REINVITE_DAYS+' jours.</li></ul>'
    + (pacte ? note('warn','alert','Un pacte d\'associés a été commandé : sa sortie devra aussi y être actée avec le juriste.') : '')
    + '<div class="field"><label>Motif <span class="req">*</span></label><div class="col" style="gap:6px" id="rmReasons">'+RM_REASONS.map(l =>
      '<button class="opt radio" data-act="rm-reason" data-v="'+esc(l)+'" aria-pressed="false"><span class="box">'+tick()+'</span><span>'+l+'</span></button>').join('')+'</div><p class="hint" id="rmErr" hidden style="color:var(--bad-ink)">Choisis un motif : il sera inscrit au journal.</p></div>'
    + field('rmTxt','Un mot pour '+m.first+' (facultatif)','<textarea class="inp" id="rmTxt" style="min-height:80px" placeholder="Ce que tu veux lui dire, avec respect."></textarea>'),
    '<button class="btn btn-ghost" data-act="close">Annuler</button><button class="btn btn-danger" data-act="rm-go">'+ic('userx')+'Retirer de l\'équipe</button>', {lg:true});
}
function doRemove(){
  const t = curTeam(), id = S.rmId; if(!t || !id) return;
  const sel = $('#layer .opt[data-act="rm-reason"][aria-pressed="true"]');
  if(!sel){ const e = $('#rmErr'); if(e) e.hidden = false; return; }
  const m = memberById(t, id), why = sel.dataset.v, txt = ($('#rmTxt') || {}).value || '';
  t.members = t.members.filter(z => z.id !== id); t.former = (t.former || []).concat([m]);
  delete t.equity[id];
  DOMAINS.forEach(d => { if(t.roles[d.id] === id) t.roles[d.id] = ''; });
  allTasks(t).forEach(k => { if(k.owner === id && k.status !== 'done'){ k.owner = 'me'; k.signaled = false; } });
  t.props.forEach(p => { delete p.val[id]; });
  teamLog(t, m.first+' a été '+g(m.sex,'retiré','retirée','retiré·e')+' de l\'équipe', 'Motif : '+why+(txt.trim() ? ' · « '+txt.trim()+' »' : ''));
  S.matches = S.matches.filter(z => z.id !== id); S.left.add(id); S.removed[id] = new Date();
  const th = S.threads.find(z => z.id === id); if(th){ th.archived = true; th.ro = true; th.unread = false; }
  if(t.members.length >= 3) t.group.push({sys:true, txt:m.first+' ne fait plus partie de l\'équipe.', d:new Date()});
  else if(t.group.length){ t.groupClosed = true; t.group.push({sys:true, txt:'Groupe fermé : l\'équipe compte moins de 3 membres. Continuez en conversation privée.', d:new Date()}); }
  if(talentsOf(t).length) propose(t, 'capital', 'Capital : '+t.members.map(z => (z.me ? S.me.first : z.first)+' '+shareOf(t, z.id)+' %').join(', '));
  closeLayer();
  pushNotif('userx', m.first+' ne fait plus partie de '+t.title, 'Motif inscrit au journal. Takam a prévenu l\'équipe.');
  toast(m.first+' a été '+g(m.sex,'retiré','retirée','retiré·e')+' de l\'équipe.', 'ok');
  render();
}

/* ============================================================
   Messages : groupes et conversations ; sur tablette et mobile,
   la liste puis la conversation, jamais les deux.
   ============================================================ */
function openThread(id){
  const isG = String(id).startsWith('G:');
  if(isG ? !S.teams[id.slice(2)] : !S.threads.some(t => t.id === id)) return toast("Cette discussion s'ouvrira après un match.");
  S.activeThread = id; S.mobileThread = true;
  const t = S.threads.find(x => x.id === id); if(t) t.unread = false;
  if(S.view === 'fiche' && isDirty()) commitFiche();
  S.view = 'messages'; render(); scrollChat();
}
function groupBubbles(t, grew){
  let lastDay = '';
  return t.group.map((m, i) => {
    const dl = dayLabel(m.d); const sep = dl !== lastDay ? '<div class="day">'+dl+'</div>' : ''; lastDay = dl;
    if(m.sys) return sep + '<div class="bub sys neutral">'+ic('info')+esc(m.txt)+'</div>';
    const me = m.from === 'me', who = memberById(t, m.from);
    return sep + '<div class="bub '+(me?'me':'them g-'+who.role)+(grew && i === t.group.length-1 ? ' fresh' : '')+'">'
      + (me ? '' : '<span class="bub-a">'+esc(who.first)+(who.role==='vis'?' · porteur':'')+'</span>')+esc(m.txt)
      + '<span class="tm">'+hhmm(m.d)+'</span></div>';
  }).join('');
}
function backBtn(){ return '<button class="iconbtn show-t" data-act="thread-back" aria-label="Retour à la liste">'+ic('back')+'</button>'; }
function vMessages(){
  const vis = S.threads.filter(t => !t.archived), arch = S.threads.filter(t => t.archived), groups = groupTeams();
  if(!S.threads.length && !groups.length){
    return '<div class="page-h"><div><h1>Tes <span class="acc">conversations</span></h1></div></div>'
      + '<div class="card">'+emptyBox('💬','Aucune conversation',"La messagerie s'ouvre au moment d'un match : personne ne te contacte sans que tu aies dit oui.",
        '<button class="btn btn-ghost btn-sm" style="margin-top:8px" data-act="go" data-v="explorer">'+ic('compass')+'Explorer</button>')+'</div>';
  }
  const isG = String(S.activeThread).startsWith('G:');
  let gt = isG ? S.teams[S.activeThread.slice(2)] : null;
  if(gt && !groups.includes(gt)) gt = null;
  let th = !gt ? (S.threads.find(t => t.id === S.activeThread) || vis[0] || S.threads[0]) : null;
  if(!gt && !th && groups.length) gt = groups[0];
  if(gt){ S.activeThread = 'G:'+gt.id; if(S.mobileThread || innerWidth > 1024) gt.unreadGroup = 0; } else S.activeThread = th.id;
  const tal = isTalMode();
  const row = t => { const y = itemById(t.id), last = t.msgs[t.msgs.length-1];
    return '<button class="tl'+(!gt && t.id===th.id?' on':'')+(t.archived?' arch':'')+'" data-act="thread" data-id="'+t.id+'">'+thumb(y,44)
      + '<span class="grow"><span class="n">'+esc(tal ? y.title : y.name)+(t.ro ? ' <span class="chip" style="height:18px;font-size:11px">Lecture seule</span>' : '')+'</span>'
      + '<span class="p">'+esc(last ? (last.me?'Toi : ':'')+last.txt : 'Nouvelle discussion')+'</span></span>'
      + '<span class="col" style="gap:5px;align-items:flex-end;flex:0 0 auto"><span class="mono" style="font-size:11px;color:var(--ink-3)">'+(last?hhmm(last.d):'')+'</span>'
      + (t.unread ? '<span class="unread" aria-label="non lu"></span>' : '')+'</span></button>'; };
  const grow = t => { const last = t.group.filter(x => !x.sys).pop(), who = last ? memberById(t, last.from) : null;
    return '<button class="tl'+(gt && gt.id===t.id?' on':'')+'" data-act="thread" data-id="G:'+t.id+'">'
      + '<span class="stack-av">'+t.members.slice(0,3).map(m => memAv(m, 28)).join('')+'</span>'
      + '<span class="grow"><span class="n">'+esc(t.title)+' <span class="chip" style="height:18px;font-size:11px">'+(t.groupClosed ? 'Groupe fermé' : 'Groupe')+'</span></span>'
      + '<span class="p">'+esc(last ? (last.from==='me'?'Toi : ':who.first+' : ')+last.txt : 'Le groupe est ouvert')+'</span></span>'
      + (t.unreadGroup && !t.groupClosed && !(gt && gt.id===t.id && (S.mobileThread || innerWidth > 1024)) ? '<span class="unread" aria-label="non lu"></span>' : '')+'</button>'; };
  let chat;
  if(gt){
    S._gGrew = S._gT === gt.id && S._gN < gt.group.length; S._gT = gt.id; S._gN = gt.group.length;
    chat = '<div class="chat"><div class="chat-h">'+backBtn()
      + '<span class="stack-av">'+gt.members.map(m => memAv(m, 28)).join('')+'</span>'
      + '<div class="who"><b>Groupe · '+esc(gt.title)+'</b><span>'+gt.members.map(m => m.me ? 'toi' : m.first).join(', ')+'</span></div>'
      + '<button class="btn btn-ghost btn-sm" data-act="open-atelier" data-id="'+(tal ? gt.id : '')+'">'+ic('tools')+'<span class="hide-m">Ouvrir l\'Atelier</span></button></div>'
      + '<div class="chat-b scroll" id="chatBody" aria-live="polite"><div class="bub sys">'+ic('users')+'Groupe de l\'équipe '+esc(gt.title)+' · '+gt.members.length+' membres</div>'+groupBubbles(gt, S._gGrew)
      + (S.typing ? '<div class="typing" aria-label="En train d\'écrire"><i></i><i></i><i></i></div>' : '')+'</div>'
      + (gt.groupClosed ? '<div class="ro-note">'+ic('lock')+'Groupe fermé : il reste consultable, en lecture seule.</div>'
        : '<form class="chat-f" data-form="send"><input class="inp" id="msgIn" placeholder="Écris au groupe…" autocomplete="off" aria-label="Message au groupe">'
          + '<button class="btn btn-a" type="submit" aria-label="Envoyer">'+ic('send')+'</button></form>')+'</div>';
  } else {
    const x = itemById(th.id);
    const grew = (S._bubT === th.id && S._bubN < th.msgs.length); S._bubT = th.id; S._bubN = th.msgs.length;
    let lastDay = '';
    const bubbles = th.msgs.map((m,i) => { const dl = dayLabel(m.d); const sep = dl !== lastDay ? '<div class="day">'+dl+'</div>' : ''; lastDay = dl;
      return sep + '<div class="bub '+(m.me?'me':'them')+(grew && i === th.msgs.length-1 ? ' fresh' : '')+'">'+esc(m.txt)
        + '<span class="tm">'+hhmm(m.d)+(m.me ? ' '+(m.read?'✓✓':'✓') : '')+'</span></div>'; }).join('');
    chat = '<div class="chat"><div class="chat-h">'+backBtn()+thumb(x,36)
      + '<div class="who"><b>'+esc(tal?x.title:x.name)+'</b><span>'+esc(tal?('Porté par '+x.owner+' · '+handleOf(x)):(x.city+' · '+handleOf(x)))+'</span></div>'
      + (tal && OWNERS[x.id] ? '<button class="btn btn-quiet btn-sm hide-m" data-act="owner" data-id="'+x.id+'">'+ic('idcard')+'Fiche perso</button>' : '')
      + '<button class="btn btn-ghost btn-sm" data-act="open" data-id="'+x.id+'"><span class="hide-m">'+(tal?'Voir le projet':'Voir le profil')+'</span><span class="show-m">Voir</span></button>'
      + '<button class="iconbtn iconbtn-lg" data-act="thread-menu" data-id="'+x.id+'" aria-label="Plus d\'actions" aria-haspopup="menu">'+ic('more')+'</button></div>'
      + (th.archived && !th.ro ? '<div style="padding:10px 14px 0">'+note('', 'archive', 'Discussion archivée. <a href="#" data-act="archive" data-id="'+th.id+'">La remettre dans la liste</a>.')+'</div>' : '')
      + '<div class="chat-b scroll" id="chatBody" aria-live="polite"><div class="bub sys">'+ic('spark')+'Vous avez matché. L\'Atelier est ouvert.</div>'+bubbles
      + (th.ro ? '<div class="bub sys neutral">'+ic('info')+(tal ? 'Tu as quitté ce projet.' : 'Ce talent ne fait plus partie de l\'équipe.')+'</div>' : '')
      + (S.typing ? '<div class="typing" aria-label="En train d\'écrire"><i></i><i></i><i></i></div>' : '')+'</div>'
      + (th.ro ? '<div class="ro-note">'+ic('lock')+'Vous n\'êtes plus dans la même équipe : cette conversation est en lecture seule.</div>'
        : '<div class="quickreps">'+['Es-tu libre 30 min cette semaine ?','On en parle dans le groupe ?','Quelles sont tes attentes sur le capital ?'].map(q =>
            '<button class="qr" data-act="quick" data-q="'+esc(q)+'">'+esc(q)+'</button>').join('')+'</div>'
          + '<form class="chat-f" data-form="send"><input class="inp" id="msgIn" placeholder="Écris un message…" autocomplete="off" aria-label="Message">'
          + '<button class="btn btn-a" type="submit" aria-label="Envoyer">'+ic('send')+'</button></form>')+'</div>';
  }
  return '<div class="msg-page'+(S.mobileThread?' viewing':'')+'"><div class="page-h"><div><h1>Tes <span class="acc">conversations</span></h1>'
    + '<p class="sub">'+(tal ? 'Les conversations privées après un match, et les groupes de tes équipes.' : 'Les conversations de '+esc(projName(S.me.project))+' : privées après un match, et le groupe de l\'équipe.')+'</p></div></div>'
    + '<div class="msg-l'+(S.mobileThread?' viewing':'')+'" id="msgLayout">'
    + '<div class="thread-list scroll">'
    +   (arch.length ? '<button class="tl-sep tl-arch" data-act="toggle-arch" aria-expanded="'+S.showArch+'">'+ic('chev')+'Discussions archivées <span class="mono">('+arch.length+')</span></button>'
          + (S.showArch ? '<div class="arch-l">'+arch.map(row).join('')+'</div>' : '') : '')
    +   (groups.length ? '<div class="tl-sep" style="cursor:default">Groupes d\'équipe</div>'+groups.map(grow).join('')+'<div class="tl-sep" style="cursor:default">Conversations privées</div>' : '')
    +   (vis.length ? vis.map(row).join('') : '<p class="hint" style="padding:14px">'+(arch.length ? 'Toutes tes conversations privées sont archivées.' : 'Aucune conversation privée pour l\'instant.')+'</p>')
    + '</div>' + chat + '</div></div>';
}
function sendGroup(t, txt, inputId){
  txt = (txt || '').trim(); if(!txt || t.groupClosed) return;
  t.group.push({from:'me', txt, d:new Date()});
  const inp = $('#'+inputId); if(inp) inp.value = '';
  render(); scrollChat();
  const others = t.members.filter(m => !m.me);
  const who = others[(Math.random()*others.length)|0]; if(!who) return;
  setTimeout(() => { S.typing = true; if(S.view === 'messages' && S.activeThread === 'G:'+t.id){ render(); scrollChat(); } }, 600);
  setTimeout(() => {
    S.typing = false;
    if(!t.members.includes(who)) return;
    t.group.push({from:who.id, txt:REPLIES[(Math.random()*REPLIES.length)|0], d:new Date()});
    if(S.view === 'messages' && S.activeThread === 'G:'+t.id){ render(); scrollChat(); } else { t.unreadGroup++; syncSide(); }
  }, 2200);
  const i2 = $('#'+inputId); if(i2) try{ i2.focus(); }catch(e){}
}
function sendMsg(txt){
  if(String(S.activeThread).startsWith('G:')){
    const t = S.teams[S.activeThread.slice(2)]; if(t) sendGroup(t, txt || ($('#msgIn') ? $('#msgIn').value : ''), 'msgIn'); return;
  }
  const th = S.threads.find(t => t.id === S.activeThread); if(!th || th.ro) return;
  txt = (txt || ($('#msgIn') ? $('#msgIn').value : '')).trim();
  if(!txt) return;
  th.msgs.push({me:true, txt, d:new Date(), read:false});
  th.archived = false;
  render(); scrollChat();
  setTimeout(() => { th.msgs.forEach(m => { if(m.me) m.read = true; }); S.typing = true; if(S.view === 'messages'){ render(); scrollChat(); } }, 700);
  setTimeout(() => {
    S.typing = false;
    th.msgs.push({me:false, txt:REPLIES[(Math.random()*REPLIES.length)|0], d:new Date()});
    if(S.view === 'messages' && S.activeThread === th.id){ render(); scrollChat(); } else { th.unread = true; syncSide(); }
  }, 2100);
  const inp = $('#msgIn'); if(inp) try{ inp.focus(); }catch(e){}
}
/* La conversation d'équipe : le groupe à partir de 3, sinon le privé. */
function teamChatId(t){
  if(t.members.length >= 3 && !t.groupClosed) return 'G:'+t.id;
  if(isTalMode()) return t.id;
  const tl = talentsOf(t)[0]; return tl ? tl.id : null;
}
function openTeamChat(t, prefill){
  const id = teamChatId(t); if(!id) return toast('Invite un premier talent : la conversation s\'ouvrira au match.');
  openThread(id);
  if(prefill){ const i = $('#msgIn'); if(i){ i.value = prefill; try{ i.focus(); }catch(e){} } }
}

/* ============================================================
   L'Atelier : sans onglet Groupe, nom du projet en or
   ============================================================ */
function takamPanel(t){
  const a = takam(t), tab = S.takTab || (a.me.length ? 'me' : 'team');
  const list = (tab === 'me' ? a.me : a.team);
  const item = x => '<li class="tk-i '+x.lvl+'">'+ic(x.lvl === 'ok' ? 'check' : x.lvl === 'warn' ? 'alert' : 'info')+'<span>'+esc(x.t)
    + (x.act === 'at-val' ? ' <button class="lnk" data-act="at-val" data-id="'+x.id+'">Valider</button>' : '')
    + (x.act === 'at-confirm' ? ' <button class="lnk" data-act="at-confirm" data-id="'+x.id+'">Confirmer</button>' : '')
    + (x.act === 'at-nudge' ? ' <button class="lnk" data-act="at-nudge" data-id="'+x.id+'">Relancer</button>' : '')
    + (x.act === 'at-tab' ? ' <button class="lnk" data-act="at-group">Ouvrir le groupe</button>' : '')+'</span></li>';
  return '<section class="panel takam"><div class="tk-h">'
    + '<div class="tk-mascot"><div class="tk-av" aria-hidden="true">T</div><span>Mascotte à venir</span></div>'
    + '<div><h3>Takam</h3><p class="hint">Veille sur l\'équipe, relance et encourage.</p></div></div>'
    + '<div class="seg-sm" role="group" aria-label="Alertes de Takam" style="margin:12px 0 10px">'
    +   '<button class="'+(tab==='team'?'on':'')+'" data-act="tk-tab" data-v="team" aria-pressed="'+(tab==='team')+'">Équipe<span class="n">'+a.team.length+'</span></button>'
    +   '<button class="'+(tab==='me'?'on':'')+'" data-act="tk-tab" data-v="me" aria-pressed="'+(tab==='me')+'">Pour toi<span class="n">'+a.me.length+'</span></button></div>'
    + (list.length ? '<ul class="tk-list">'+list.map(item).join('')+'</ul>' : '<p class="hint">Rien à signaler. Continuez comme ça.</p>')
    + (t.takChat.length ? '<div class="tk-chat">'+t.takChat.slice(-4).map(m => '<div class="tk-b '+(m.me?'me':'')+'">'+esc(m.txt)+'</div>').join('')+'</div>' : '')
    + '<form class="tk-ask" data-form="takam"><label class="sr" for="tkIn">Demander à Takam</label><input class="inp" id="tkIn" placeholder="Demander à Takam…" autocomplete="off" maxlength="200">'
    + '<button class="iconbtn iconbtn-lg" type="submit" aria-label="Envoyer à Takam">'+ic('send')+'</button></form></section>';
}
function vAtelier(){
  const t = curTeam(), tal = isTalMode();
  if(!t){
    return '<div class="page-h"><div><h1 class="at-h1">L\'Atelier'+(tal ? '' : ' · <span class="at-name">'+esc(projName(S.me.project))+'</span>')+'</h1><p class="sub">L\'espace où une rencontre devient une équipe.</p></div></div>'
      + '<div class="card">'+emptyBox('🔒',"L'Atelier s'ouvre à ton premier match","Accepte ou fais accepter une invitation, et cet espace devient le vôtre : jalons, plan d'action, capital, rôles et Takam. Le groupe de l'équipe s'ouvre dans les Messages à partir de 3 membres.",
          '<button class="btn btn-a btn-sm" style="margin-top:8px" data-act="go" data-v="explorer">Trouver un cofondateur</button>')+'</div>';
  }
  const adm = isAdmin(t), P0 = porteurOf(t);
  const done = t.milestones.filter(k => k.done).length, nextI = t.milestones.findIndex(k => !k.done);
  const teams = Object.values(S.teams), multi = tal && teams.length > 1;
  const otherAlert = multi && teams.some(z => z.id !== t.id && takam(z).me.some(x => x.lvl === 'warn'));
  const nameEl = multi
    ? '<button class="at-namebtn" data-act="at-switch" aria-haspopup="menu" aria-label="Changer d\'atelier : '+esc(t.title)+'"><span class="at-name">'+esc(t.title)+'</span>'+ic('down')+(otherAlert ? '<span class="pdot"></span>' : '')+'</button>'
    : '<span class="at-name">'+esc(t.title)+'</span>';
  const hasGroup = t.members.length >= 3 && !t.groupClosed;
  const chatBtn = talentsOf(t).length || tal
    ? '<button class="btn btn-ghost" data-act="at-group">'+ic(hasGroup ? 'users' : 'chat')+(hasGroup ? 'Groupe de l\'équipe' : 'Discussion privée')
      + (hasGroup && t.unreadGroup ? '<span class="cnt-pill mono">'+t.unreadGroup+'</span>' : '')+'</button>' : '';
  const head = '<div class="page-h"><div><h1 class="at-h1">L\'Atelier · '+nameEl+'</h1>'
    + '<p class="sub">Équipe de '+t.members.length+'. <span class="mono">'+done+'/6</span> jalons franchis.</p></div>'
    + '<div class="spacer"></div><div class="acts">' + chatBtn
    + (tal ? '<button class="btn btn-ghost" data-act="open" data-id="'+t.id+'">'+ic('eye')+'Voir la fiche</button>'
           + '<button class="btn btn-quiet" data-act="leave" data-id="'+t.id+'">'+ic('logout')+'Quitter le projet</button>'
           : '<button class="btn btn-ghost" data-act="preview-public">'+ic('eye')+'Voir la fiche</button>')
    + '</div></div>';
  const strip = '<div class="team-strip">'+t.members.map(m => '<span class="tm-m">'+memAv(m, 36)+'<span><b>'+esc(m.me ? 'Toi' : m.name)+'</b><span class="hint">'
      + (m.role === 'vis' ? '💡 '+g(m.me ? S.me.sex : m.sex,'Porteur','Porteuse','Porteur·se')+' · administre' : '🛠️ Talent')+'</span></span>'
      + (tal && m.role === 'vis' && OWNERS[t.id] ? '<button class="btn btn-quiet btn-sm tm-perso" data-act="owner" data-id="'+t.id+'">'+ic('idcard')+'Fiche perso</button>' : '')
      + (adm && m.role === 'tal' ? '<button class="iconbtn tm-more" data-act="mem-menu" data-id="'+m.id+'" aria-haspopup="menu" aria-label="Actions pour '+esc(m.first)+'">'+ic('more')+'</button>' : '')+'</span>').join('')
    + '<span class="tm-note">'+(adm ? ic('shield')+'Tu administres cet Atelier. Chaque décision part en validation auprès des talents.'
        : ic('info')+esc(P0.first)+' administre cet Atelier. Tu suis l\'avancée et tu valides ses propositions.')+'</span></div>';
  const mil = '<section class="panel"><div class="sec-t">'+ic('target')+'<h3>Vos jalons</h3><span class="chip chip-a"><span class="mono">'+done+'/6</span></span></div>'
    + '<p class="hint" style="margin-bottom:10px">Dans l\'ordre. La cinquième étape est celle que 9 équipes sur 10 sautent, et c\'est celle qui prédit le mieux la suite.</p>'
    + '<div class="ladder">'+t.milestones.map((k,i) =>
      '<button class="rung'+(k.done?' done':'')+(i===nextI?' next':'')+'" data-act="at-ms" data-i="'+i+'" aria-pressed="'+k.done+'"'+lockAttr(t)+'>'
      + '<span class="dot">'+(k.done?tick().replace('<svg','<svg width="13" height="13"'):'')+'</span>'
      + '<span class="grow"><span class="t">'+esc(k.t)+'</span><span class="s">'+esc(k.done && k.d ? 'Franchi le '+k.d.getDate()+' '+MOIS[k.d.getMonth()] : k.s)+'</span></span>'
      + '<span class="n">'+String(i+1).padStart(2,'0')+'</span></button>').join('')+'</div></section>';
  const objs = '<section class="panel"><div class="sec-t">'+ic('trend')+'<h3>Objectifs et plan d\'action</h3>'
    + '<button class="btn btn-ghost btn-sm" data-act="at-obj-new"'+lockAttr(t)+'>'+ic('plus')+'Objectif</button></div>'
    + (S.objForm && adm ? '<form class="obj-form" data-form="obj"><input class="inp" id="objIn" placeholder="Ex. : 1 000 membres actifs avant décembre" maxlength="80" autocomplete="off"><button class="btn btn-a btn-sm" type="submit">Ajouter</button><button class="btn btn-quiet btn-sm" type="button" data-act="at-obj-cancel">Annuler</button></form>' : '')
    + (t.objectives.length ? t.objectives.map(o => { const n = o.tasks.length, d = o.tasks.filter(k => k.status==='done').length, pct = n ? Math.round(d/n*100) : 0;
        return '<div class="obj"><div class="row" style="gap:10px"><b style="flex:1">'+esc(o.t)+'</b><span class="mono hint">'+d+'/'+n+'</span></div>'
          + '<span class="sb-bar obj-bar"><i class="g-vis" style="width:'+pct+'%"></i></span>'
          + (o.tasks.length ? '<ul class="tasks">'+o.tasks.map(k => taskRow(t, k)).join('')+'</ul>' : '<p class="hint" style="margin:8px 0 0">Aucune tâche pour cet objectif'+(adm ? ' : ajoute la première.' : '.')+'</p>')
          + (adm ? (S.taskForm === o.id
              ? '<form class="task-form" data-form="task" data-o="'+o.id+'"><input class="inp" id="taskIn" placeholder="Nouvelle tâche" maxlength="80" autocomplete="off">'
                + '<select class="inp" id="taskOwner" aria-label="Responsable">'+t.members.map(m => '<option value="'+m.id+'">'+esc(m.me?'Toi':m.first)+'</option>').join('')+'</select>'
                + '<input class="inp" type="date" id="taskDue" aria-label="Date limite" value="'+inDays(7).toISOString().slice(0,10)+'">'
                + '<button class="btn btn-a btn-sm" type="submit">Ajouter</button><button class="btn btn-quiet btn-sm" type="button" data-act="at-task-cancel">Annuler</button></form>'
              : '<button class="btn btn-quiet btn-sm" data-act="at-task-new" data-o="'+o.id+'">'+ic('plus')+'Tâche</button>') : '')+'</div>'; }).join('')
      : '<p class="hint">Aucun objectif pour l\'instant.'+(adm?' Fixe le premier : Takam le suivra.':'')+'</p>')
    + '</section>';
  const roles = '<section class="panel"><div class="sec-t">'+ic('users')+'<h3>Qui décide quoi</h3>'+(DOMAINS.some(d => !t.roles[d.id]) ? '<span class="chip chip-warn">'+DOMAINS.filter(d => !t.roles[d.id]).length+' à décider</span>' : '<span class="chip chip-ok">Complet</span>')+'</div>'
    + '<p class="hint" style="margin-bottom:6px">Un seul responsable par domaine.</p>'
    + '<table class="roles-t"><tbody>'+DOMAINS.map(d => '<tr><td>'+esc(d.l)+'</td><td><select class="inp inp-sm" id="role-'+d.id+'" data-role="'+d.id+'" aria-label="Responsable '+esc(d.l)+'"'+lockAttr(t)+'>'
      + '<option value="">À décider</option>'+t.members.map(m => '<option value="'+m.id+'"'+(t.roles[d.id]===m.id?' selected':'')+'>'+esc(m.me?'Toi':m.first)+'</option>').join('')+'</select></td></tr>').join('')+'</tbody></table></section>';
  const cap = '<section class="panel"><div class="sec-t">'+ic('award')+'<h3>Répartition du capital</h3></div>'
    + '<p class="hint" style="margin-bottom:12px">Décidez-la tôt, à froid. '+(adm ? 'Règle la part de chaque talent ; la tienne se calcule.' : 'Proposée par '+esc(P0.first)+'.')+'</p>'
    + '<div class="equity">'+t.members.map(m => { const v = shareOf(t, m.id);
        return '<div class="eq-row"><div class="eq-bar"><i style="width:'+v+'%;background:'+(m.role==='vis'?'var(--vis-200)':'var(--tal-200)')+'"></i><span>'+esc(m.me?'Toi':m.first)+'</span></div><div class="eq-val tnum" id="eqv-'+m.id+'">'+v+' %</div></div>'
          + (m.role === 'tal' ? '<label class="sr" for="eq-'+m.id+'">Part de '+esc(m.first)+'</label><input type="range" id="eq-'+m.id+'" data-eq="'+m.id+'" min="0" max="40" step="5" value="'+v+'" class="eq-range"'+lockAttr(t)+'>' : ''); }).join('')+'</div>'
    + '<div class="field" style="margin-top:12px"><label for="vesting2">Vesting</label>'
    +   '<select class="inp" id="vesting2"'+lockAttr(t)+'>'+VESTING.map(v => '<option'+(t.vesting===v?' selected':'')+'>'+v+'</option>').join('')+'</select></div>'
    + '<button class="btn '+(adm?'btn-a':'btn-ghost')+' btn-block" style="margin-top:14px" data-act="at-pacte"'+lockAttr(t)+'>'+ic('file')+'Générer le pacte d\'associés</button>'
    + '<p class="hint" style="margin-top:8px;text-align:center">Modèle OHADA, relu par un juriste · <span class="mono">'+priceH('pacte')+'</span></p></section>';
  const log = '<section class="panel"><div class="sec-t">'+ic('book')+'<h3>Journal de décisions</h3><span class="chip"><span class="mono">'+t.log.length+'</span></span></div>'
    + (adm ? '<form class="log-add" data-form="log"><label class="sr" for="logIn">Nouvelle décision</label><input class="inp" id="logIn" placeholder="Ex. : on lance la version test à Bohicon le 15 octobre" maxlength="140" autocomplete="off">'
           + '<button class="btn btn-ghost btn-sm" type="submit" style="height:40px">'+ic('plus')+'Ajouter</button></form>'
           : '<p class="hint" style="margin-bottom:10px">'+ic('lock')+' Seul'+g(P0.sex,'','e','')+' '+esc(P0.first)+' écrit dans le journal. Tout y est horodaté.</p>')
    + (t.log.length ? '' : '<p class="hint" style="margin:0">Aucune décision inscrite pour l\'instant. Chaque décision ajoutée ici est horodatée et visible par toute l\'équipe.</p>')
    + '<div class="log">'+t.log.map(l => '<div class="log-i"><div class="t">'+esc(l.t)+'</div>'+(l.m?'<div class="m">'+esc(l.m)+'</div>':'')+'<div class="w">'+fmtDate(l.d)+'</div></div>').join('')+'</div></section>';
  const main = '<div class="col" style="gap:16px">'+mil+objs+'<div class="at-grid">'+roles+cap+'</div>'+log+'</div>';
  return head + strip
    + '<div class="at-layout'+(adm?'':' follower')+'"><div class="at-main">'+main+'</div>'
    + '<aside class="at-rail">'+takamPanel(t)+validationsPanel(t)+'</aside></div>';
}

/* ---------- Actions propres à la v5 ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if(!el) return;
  const a = el.dataset.act, t = curTeam();
  switch(a){
    case 'projmenu': projMenu(el); break;
    case 'proj-switch': switchProject(el.dataset.id); break;
    case 'proj-new': createProject(); break;
    case 'slot-pay': if(S.me.slots >= MAX_PROJ){ closeLayer(); toast('Tu as déjà tous tes emplacements : aucun nouveau paiement.', 'ok'); break; } doSlotPay(el); break;
    case 'unlock-pay': if(S.me.visUnlocked){ closeLayer(); toast('Ce profil est déjà débloqué : aucun nouveau paiement.', 'ok'); break; } doUnlock(el); break;
    case 'proj-del': deleteProject(); break;
    case 'proj-del-go': doDeleteProject(); break;
    case 'demo-reset': demoReset(); break;
    case 'pub-view': S.pubView = el.dataset.v; openPublic(); break;
    case 'at-switch': atSwitchMenu(el); break;
    case 'at-group': if(t){ closeLayer(); openTeamChat(t); } break;
    case 'mem-menu': memMenu(el, el.dataset.id); break;
    case 'rm-member': closeLayer(); setTimeout(() => rmModal(el.dataset.id), 0); break;
    case 'rm-reason': el.parentElement.querySelectorAll('.opt').forEach(o => o.setAttribute('aria-pressed', String(o === el))); { const er = $('#rmErr'); if(er) er.hidden = true; } break;
    case 'rm-go': doRemove(); break;
    case 'thread-back': S.mobileThread = false; render(); break;
  }
});
document.addEventListener('change', e => {
  if(e.target.id === 'fPay'){ S.fPay = e.target.value; S.focusIdx = 0; render(); }
});

/* ============================================================
   v6 — pseudos en noir, compétences nommées, nouvelles icônes,
   fiche perso du porteur, rappel de complétion à la connexion
   ============================================================ */
Object.assign(P, {
  hands:'<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
  toolbox:'<rect x="3" y="8" width="18" height="12" rx="2.2"/><path d="M9 8V6.2A1.7 1.7 0 0 1 10.7 4.5h2.6A1.7 1.7 0 0 1 15 6.2V8"/><path d="M3 13.5h7M14 13.5h7"/><rect x="10" y="12" width="4" height="3.2" rx=".8"/>',
  chats:'<path d="M14.5 10h4a2.5 2.5 0 0 1 2.5 2.5v4.2a2.5 2.5 0 0 1-2.5 2.5h-.5v2.3l-3-2.3h-3a2.5 2.5 0 0 1-2.5-2.5v-.7"/><path d="M5.5 3.5h7A2.5 2.5 0 0 1 15 6v5a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 3 11V6a2.5 2.5 0 0 1 2.5-2.5z"/>',
  cards:'<rect x="7.5" y="7" width="13" height="14" rx="2.2"/><path d="M4 16.5V5.2A2.2 2.2 0 0 1 6.2 3H15"/><path d="M11 12h6M11 15.5h4"/>',
  idcard:'<rect x="2.5" y="5" width="19" height="14" rx="2.4"/><circle cx="8.5" cy="11" r="2.2"/><path d="M5.2 16.2c.7-1.5 1.8-2.2 3.3-2.2s2.6.7 3.3 2.2"/><path d="M14.5 10h4M14.5 13.5h3"/>',
});
/* L'Atelier et les Messages prennent leurs nouvelles icônes partout où elles servent. */
P.tools = P.toolbox; P.chat = P.chats;
NAV.find(n => n.id === 'connexions').i = 'hands';
function navIcon(n){ return n.id === 'fiche' ? (isTalMode() ? 'idcard' : 'cards') : n.i; }

/* ---------- Mes fiches : fiche projet active ou fiche perso ---------- */
function ficheKind(){ return isTalMode() ? 'tal' : (S.ficheTab === 'perso' ? 'perso' : 'vis'); }
const personal = () => ficheKind() !== 'vis';
function ficheData(){ const k = ficheKind(); return k === 'perso' ? persoOf() : k === 'tal' ? TAL_KEYS.map(x => S.me[x]) : S.me.project; }
function ficheSnap(){ return JSON.stringify(ficheData()); }
function saveBaseline(){ S.saved = {snap:ficheSnap(), kind:ficheKind(), idx:S.me.projIdx, data:structuredClone(ficheData())}; }
function isDirty(){ return !!S.saved && S.saved.kind === ficheKind() && S.saved.idx === S.me.projIdx && S.saved.snap !== ficheSnap(); }
function restoreBaseline(){
  if(!S.saved) return;
  if(S.saved.kind === 'perso') S.me.perso = structuredClone(S.saved.data);
  else if(S.saved.kind !== 'vis') TAL_KEYS.forEach((k, i) => S.me[k] = structuredClone(S.saved.data[i]));
  else S.me.projects[S.saved.idx] = structuredClone(S.saved.data);
}
function persoFields(){
  const x = persoOf();
  return '<p class="fiche-note">Ta fiche perso est facultative et <b>distincte de ta fiche Talent</b> : elle présente la personne qui porte tes projets.</p>'
  + fsec('tools', 'Tes compétences clés', false, optList(SKILLS, 'f-multi', 'x.skills', x.skills), 'Choisis-en 2 à 4 : ce que toi, tu apportes à ton projet.')
  + fsec('trend', "Ton niveau d'expérience", false, optList(LEVEL, 'f-one', 'x.level', x.level, 'opt-row', true))
  + fsec('quote', 'Ta signature', false, area('xbio', 'x.bio', 420, "Ton parcours, pourquoi ce problème te tient à cœur, ce que tu as déjà fait.", x.bio),
      "Un talent rejoint une personne autant qu'une idée. "+TMRules.MIN.persoBio+" caractères au moins pour compter.")
  + fsec('link', 'Ton lien portfolio', false,
      '<div class="grid g2" style="gap:10px">'
      + '<input class="inp" id="xportfolioTitle" data-k="x.portfolioTitle" placeholder="LinkedIn, site, article…" value="'+esc(x.portfolioTitle || '')+'" aria-label="Titre du lien"'+(x.noPortfolio ? ' disabled' : '')+'>'
      + '<input class="inp" id="xportfolio" data-k="x.portfolio" placeholder="linkedin.com/in/tonnom" value="'+esc(x.portfolio || '')+'" aria-label="Adresse du lien"'+(x.noPortfolio ? ' disabled' : '')+'></div>'
      + noneBox('x.noPortfolio', x.noPortfolio, 'Je n\'ai pas de lien à montrer'), 'Visible seulement après un match.');
}
function ficheFields(){ const k = ficheKind(); return k === 'vis' ? projectFields() : k === 'perso' ? persoFields() : talentFields(); }
function meAsPerso(){ const x = persoOf(); return Object.assign(meAsTalent(), {skills:x.skills, level:x.level, bio:x.bio, portfolio:x.noPortfolio ? '' : x.portfolio, role:'vis'}); }
function ownerOf(p){
  const o = OWNERS[p.id]; if(!o) return null;
  return Object.assign({id:p.id, name:p.owner, handle:p.ownerHandle, city:p.ownerCity, verified:p.ownerVerified, pace:p.pace, hue:p.hue + 1, role:'vis'}, o);
}

function previewCard(){
  const m = S.me, kind = ficheKind();
  if(kind !== 'vis'){
    const src = kind === 'perso' ? persoOf() : m, sk = (src.skills || []).slice(0,3), role = kind === 'perso' ? 'vis' : 'tal';
    return '<article class="pcard person" aria-label="Aperçu de ta fiche '+(kind === 'perso' ? 'perso' : 'Talent')+'">'
      + '<div class="cover '+tintCls(role, m.avatarHue)+'" style="'+tintAng(m.avatarHue)+'">'
      +   '<span class="portrait">'+avatarOf({id:'me', name:myName(), hue:m.avatarHue}, 72, false, role)+'</span></div>'
      + '<div class="body">'
      +   '<h3 class="masked-name">'+esc(maskName(myName()))+'</h3>'
      +   '<div class="who"><span class="handle">'+esc(myHandle())+'</span><span class="sep">·</span>'+esc(cityOf(m.city)[0]||'—')+'</div>'
      +   (src.bio ? '<p class="ex">'+esc(src.bio)+'</p>' : '<div class="col" style="gap:5px;width:100%"><div class="skel" style="height:9px"></div><div class="skel" style="height:9px;width:70%"></div></div>')
      +   (sk.length ? '<div class="chips"><span class="chips-l">Compétences :</span>'+sk.map(s => '<span class="chip '+(role === 'vis' ? 'chip-vis' : 'chip-tal')+'">'+esc(skillL(s))+'</span>').join('')+'</div>' : '<div class="skel" style="height:22px;width:74%"></div>')
      + '</div></article>';
  }
  const p = m.project, x = meAsProject(), cv = projCover(x);
  return '<article class="pcard" aria-label="Aperçu de ta fiche Projet">'
    + '<div class="cover '+cv.cls+'" style="'+cv.style+'">'+(cv.ph ? '' : '<span class="glyph" aria-hidden="true">'+(p.glyph||'💡')+'</span>')
    +   '<span class="tags">'+p.sectors.slice(0,2).map(id => '<span class="chip chip-onart">'+sector(id).g+' '+esc(sector(id).l)+'</span>').join('')+'</span>'
    +   '<span class="chip chip-handle" style="position:absolute;bottom:8px;left:9px">'+esc(myHandle())+'</span></div>'
    + '<div class="body">'
    +   (p.title ? '<h3>'+esc(p.title)+'</h3>' : '<div class="skel" style="height:15px;width:62%"></div>')
    +   '<div class="who">'+esc(cityOf(m.city)[0]||'—')+'<span class="sep">·</span>'+likeHTML(x)+'</div>'
    +   (p.hook ? '<p class="ex">'+esc(p.hook)+'</p>' : '<div class="col" style="gap:5px"><div class="skel" style="height:9px"></div><div class="skel" style="height:9px;width:80%"></div></div>')
    +   (p.seeking.length ? '<div class="chips"><span class="chips-l">Recherche :</span>'+p.seeking.slice(0,3).map(s => '<span class="chip chip-a">'+esc(skillL(s))+'</span>').join('')+'</div>' : '')
    + '</div></article>';
}
function persoCard(){
  return '<div class="row card online-card perso-card"><span class="pc-i" aria-hidden="true">'+ic('idcard')+'</span>'
    + '<div class="oc-t"><div class="oc-l">Visible avec tes projets</div><div class="oc-s">Les talents l\'ouvrent depuis ta fiche projet</div></div></div>';
}
function vFiche(){
  const m = S.me, tal = isTalMode(), kind = ficheKind(), c = completion(kind), p = m.project, perso = kind === 'perso';
  if(!S.saved || S.saved.kind !== kind) saveBaseline();
  const sk = kind === 'vis' ? p.seeking : kind === 'perso' ? persoOf().skills : m.skills;
  const link = 'takamatch.bj/'+myHandle();
  const title = tal ? 'Ta fiche <span class="acc">Talent</span>'
    : 'Tes fiches · <span class="acc">'+(perso ? 'Ta fiche perso' : esc(projName(p)))+'</span>';
  const sub = tal ? 'Publiée sous '+esc(myHandle())+". Seuls les visionnaires la voient, et les visiteurs arrivés par ton lien."
    : perso ? 'L\'humain derrière tes projets : tes compétences, ton parcours, ta signature. Les talents l\'ouvrent depuis ta fiche projet. Elle n\'a pas de statistiques.'
            : 'La fiche de ton projet actif. Seuls les talents la voient, et les visiteurs arrivés par ton lien. Change de projet avec le sélecteur du haut.';
  const tabs = tal ? '' : '<div class="tabs" role="tablist">'
    + '<button class="tab'+(!perso?' on':'')+'" role="tab" aria-selected="'+(!perso)+'" data-act="ftab" data-t="projet">'+ic('file')+'Fiche Projet · '+esc(projName(p))+'</button>'
    + '<button class="tab'+(perso?' on':'')+'" role="tab" aria-selected="'+perso+'" data-act="ftab" data-t="perso">'+ic('idcard')+'Ma fiche perso</button></div>';
  return '<div class="page-h"><div><h1>'+title+'</h1><p class="sub">'+sub+'</p></div>'
    + '<div class="spacer"></div>' + (perso ? persoCard() : onlineCard()) + '</div>'
    + tabs
    + '<div class="card" style="margin-bottom:16px;overflow:hidden">'
    +   '<div class="fiche-id">'
    +     '<span class="av av-56 '+tintCls(tal ? 'tal' : 'vis', m.avatarHue)+'" style="'+tintAng(m.avatarHue)+'" aria-hidden="true">'+esc(initials(myName()))+'</span>'
    +     '<div class="fiche-id-c"><div class="row" style="gap:8px;flex-wrap:wrap"><span class="chip-user">'+esc(myHandle())+'</span>'
    +       vBadge(isTalMode() ? 'tal' : 'vis', m.verifiedId)+'</div>'
    +       '<div class="fiche-kv"><b>Nom et prénoms</b> · '+esc(myName())+' <span class="dim" style="font-size:12.5px">(visible après un match)</span></div>'
    +       '<div class="fiche-kv"><b>Localisation</b> · '+esc(m.city || '—')+'</div>'
    +       '<div class="fiche-kv"><b>Sexe</b> · '+SEX_L[m.sex||'n']+' <span class="dim" style="font-size:12.5px">(visible après un match)</span> · <a href="#" data-act="edit-account">Modifier</a></div>'
    +       '<div class="fiche-kv"><b>'+(kind === 'vis' ? 'Compétences recherchées' : 'Compétences clés')+'</b> · <span class="dim">'+esc(sk.slice(0,3).map(skillL).join(', ') || 'à renseigner')+'</span></div></div>'
    +     '<div class="fiche-id-a"><span id="ficheRing">'+ringHTML(c.pct, 72, kind)+'</span>'
    +       (m.verifiedId ? '' : m.verifyPending ? '<span class="vpend">'+ic('clock')+'Vérification en cours</span>' : '<button class="btn btn-ghost btn-sm" data-act="verify-id">'+ic('verif', isTalMode() ? 'tal' : 'vis')+'Faire vérifier mon profil</button>')+'</div></div>'
    +   (perso ? '' : '<div class="fiche-id-f"><div class="fiche-tools">'
    +     '<button class="btn btn-ghost btn-sm" data-act="stats">'+ic('chart')+'Statistiques de '+(tal?'ta fiche':'cette fiche')+'</button>'
    +     '<button class="btn btn-ghost btn-sm" data-act="copy" data-t="'+esc(myHandle())+'" data-l="Pseudo">'+ic('copy')+'<span class="mono">'+esc(myHandle())+'</span></button>'
    +     '<button class="btn btn-ghost btn-sm" data-act="copy" data-t="https://'+esc(link)+'" data-l="Lien">'+ic('link')+'Copier le lien</button>'
    +     '<button class="btn btn-ghost btn-sm" data-act="qr">'+ic('qr')+'Code QR</button></div></div>')+'</div>'
    + '<div class="cols cols-fiche">'
    +   '<div class="card card-pad"><div id="ficheForm" class="col'+(perso ? ' perso-form' : '')+'" style="gap:28px">'+ficheFields()+'</div>'
    +     (kind === 'vis' ? '<div class="del-row"><button class="btn btn-quiet btn-sm" data-act="proj-del" style="color:var(--bad-ink)">'+ic('trash')+'Supprimer cette fiche projet</button></div>' : '')
    +     '<div class="savebar" id="saveBar"><span class="hint"><span class="dot"></span><span id="saveTxt">Tout est enregistré</span></span>'
    +       '<button class="btn btn-quiet btn-sm" id="undoBtn" data-act="undo-fiche" hidden>'+ic('undo')+'Annuler</button>'
    +       '<button class="btn btn-a" id="saveBtn" data-act="save-fiche" disabled>'+ic('check')+'Enregistrer les modifications</button></div></div>'
    +   '<div class="col" style="gap:14px">'
    +     '<div><div class="preview-l'+(ficheOnline()?'':' off')+'" id="prevL">'+prevLegend()+'</div><div id="prevBox" class="'+(ficheOnline()?'':'pv-off')+'">'+prevInner()+'</div>'
    +       '<button class="btn btn-quiet btn-sm btn-block" style="margin-top:8px" data-act="preview-public">'+ic('eye')+(perso ? 'Voir ma fiche perso comme un talent' : 'Voir mon profil public')+'</button></div>'
    +     '<div class="card card-pad"><div class="lbl" style="margin-bottom:10px">Ce qu\'il te manque</div><div id="missBox">'+missingHTML(c)+'</div></div>'
    +     '<div class="card card-pad"><div class="row" style="gap:8px;margin-bottom:6px">'+ic('spark')+'<div class="lbl">Conseil</div></div>'
    +       '<p style="font-size:13.5px;line-height:1.6;color:var(--ink-2)">'
    +       (tal ? "Écris ta signature comme tu parlerais à quelqu'un dans un taxi : ce que tu sais faire, ce que tu as déjà livré, ce que tu cherches. Les listes de technologies n'ont jamais convaincu personne."
         : perso ? "Un talent rejoint une personne autant qu'une idée. Dis ce que tu as déjà fait, pourquoi ce problème te tient à cœur, et ce que tu apportes toi-même au projet."
                 : "La Traction pèse plus que la Vision. Un chiffre modeste et vrai bat une ambition grandiose.")+'</p></div>'
    +   '</div></div>';
}

/* ---------- La fiche perso vue par un talent ---------- */
function ficheWinInner(){
  const v = S.fv, x = itemById(v.id); if(!x.id) return '';
  const tal = isTalMode();
  if(v.sub === 'owner' && tal){
    const ow = ownerOf(x);
    return '<div class="fw-h"><button class="btn btn-quiet btn-sm" data-act="fiche-back">'+ic('back')+'Retour au projet</button><span class="lbl hide-m">Fiche perso du porteur</span>'
      + '<span style="flex:1"></span><button class="iconbtn iconbtn-lg" data-act="close" aria-label="Fermer">'+ic('x')+'</button></div>'
      + '<div class="fw-b">'+(ow ? '<article class="detail">'+detailHTML(ow, 'tal', {unlocked:isUnlocked(x.id), perso:true, projTitle:x.title})+'</article>'
          + '<p class="hint" style="margin-top:12px">'+ic('info')+' La personne qui porte '+esc(x.title)+'. Pour lui écrire, reviens au projet.</p>'
          : emptyBox('🪪','Fiche perso non renseignée','Ce porteur n\'a pas encore décrit son parcours.'))+'</div>';
  }
  return '<div class="fw-h"><span class="lbl">'+(tal ? 'Fiche Projet' : 'Fiche Talent')+'</span>'
    + '<span style="flex:1"></span><button class="iconbtn iconbtn-lg" data-act="close" aria-label="Fermer">'+ic('x')+'</button></div>'
    + '<div class="fw-b"><div class="focus"><article class="detail">'+detailHTML(x, tal ? 'proj' : 'tal', detailOpts(x))+'</article>'
    + '<div class="col" style="gap:14px">'+scoreCard(scoreOf(x))+ctaCard(x)+'</div></div></div>';
}

/* ---------- Vue publique : la fiche perso n'a pas de vue visiteur ---------- */
function openPublicPerso(){
  const html = '<div class="fw-h"><span class="lbl">Ta fiche perso, vue par un talent</span><span style="flex:1"></span>'
    + '<button class="iconbtn iconbtn-lg" data-act="close" aria-label="Fermer">'+ic('x')+'</button></div>'
    + '<div class="fw-b">'+note('a','idcard','C\'est ce que voit un talent qui clique sur <b>« Voir sa fiche perso »</b> depuis ton projet, avant le match. Ton nom et ta photo restent masqués.')
    + '<div class="pub-wrap"><article class="detail" style="margin-top:14px">'+detailHTML(meAsPerso(), 'tal', {unlocked:false, self:true, perso:true, projTitle:projName(S.me.project)})+'</article></div>'
    + '<div class="ov-foot"><button class="btn btn-ghost" data-act="close">Fermer</button><button class="btn btn-a" data-act="public-edit">'+ic('edit')+'Modifier ma fiche perso</button></div></div>';
  openLayer('<div class="ov" role="dialog" aria-modal="true" aria-label="Ta fiche perso vue par un talent"><div class="ov-bg" data-act="close"></div>'
    + '<div class="ov-win xl" id="publicWin">'+html+'</div></div>', 'public');
}

/* ============================================================
   Rappel de complétion, quelques secondes après la connexion
   ============================================================ */
const RMD_KEY = {
  'Nom et prénoms':'@acct', 'Pseudo public':'@acct', 'Ville':'@acct', 'Compétences clés':'compétences', "Niveau d'expérience":'niveau',
  'Diplôme le plus élevé':'diplôme', 'Statut professionnel':'statut', "Secteurs qui t'attirent":'secteurs', 'Rythme':'temps',
  'Signature personnelle':'signature', 'Lien portfolio':'portfolio', 'Titre du projet':'titre', 'Secteurs du projet':'secteurs',
  'Compétences recherchées':'compétences', 'Le Hook':'hook', 'La Vision':'vision', 'La Traction':'traction', 'Les Défis':'défis', 'Lien externe':'lien externe',
  'Rythme attendu':'rythme', 'Ce que tu proposes':'proposes'};
let rmdT = null;
function scheduleReminder(delay){
  clearTimeout(rmdT);
  rmdT = setTimeout(tryReminder, delay == null ? 4000 : delay);
}
function mainFicheState(){
  const kind = isTalMode() ? 'tal' : 'vis', c = completion(kind);
  return {kind, c, online: isTalMode() ? !!S.me.online : !!S.me.project.online};
}
function tryReminder(){
  S.reminded = S.reminded || new Set();
  const key = ctxKey();
  if(S.reminded.has(key) || (S.snoozeUntil && Date.now() < S.snoozeUntil)) return;
  const st = mainFicheState();
  if(st.c.pct >= 100 && st.online) return;
  if(S.view === 'fiche') return;
  if(S.layer){ rmdT = setTimeout(tryReminder, 1200); return; }
  S.reminded.add(key);
  reminderModal(st);
}
function reminderModal(st){
  const tal = st.kind === 'tal', miss = st.c.rows.filter(r => !r[1]).sort((a,b) => (isReqRow(b[0]) - isReqRow(a[0])) || (b[2] - a[2]));
  const left = 100 - st.c.pct;
  const head = st.c.pct >= 100 ? 'ta fiche est complète' : 'ta fiche '+(tal ? 'Talent' : '« '+esc(projName(S.me.project))+' »')+' est à <span class="mono">'+st.c.pct+' %</span>';
  const pitch = st.c.pct >= 100 ? 'Il ne lui manque plus qu\'une chose : être visible.'
    : tal ? 'Encore <b>'+left+' points</b> et tu remontes en tête des résultats. Les porteurs voient d\'abord les fiches complètes.'
          : 'Encore <b>'+left+' points</b>. Une fiche projet complète inspire confiance aux talents et remonte dans leurs résultats.';
  let perso = '';
  if(!tal){ const pc = completion('perso').pct;
    if(pc < 100) perso = '<button class="rmd-perso" data-act="rmd-perso">'+ic('idcard')+'<span>Ta fiche perso est à <span class="mono">'+pc+' %</span>, pour que les talents sachent qui tu es.</span>'+ic('chev')+'</button>'; }
  const body = '<div class="rmd-hd">'+ringHTML(st.c.pct, 84, st.kind)+'<div><h2 class="ov-t" id="ovT">'+esc(S.me.first || 'Bonjour')+', '+head+'</h2><p>'+pitch+'</p></div></div>'
    + (!st.online ? note('warn','eye-off','<b>Ta fiche est hors ligne</b> : personne ne la voit en ce moment. <button class="lnk" data-act="rmd-online">La remettre en ligne</button>') : '')
    + (miss.length ? '<div class="lbl" style="margin:14px 0 6px">Ce qu\'il te manque</div><div class="rmd-list">'+miss.slice(0,5).map(r =>
        '<button class="rmd-row'+(isReqRow(r[0]) ? ' req' : '')+'" data-act="rmd-go" data-k="'+esc(RMD_KEY[r[0]] || '')+'"><span class="rmd-dot"></span><span class="grow">'+esc(r[0])+(isReqRow(r[0]) ? ' <span class="req-tag">Obligatoire</span>' : '')+'</span><span class="mono">+'+r[2]+' %</span>'+ic('chev')+'</button>').join('')+'</div>' : '')
    + perso
    + '<label class="rmd-snooze"><input type="checkbox" id="rmdSnooze"> Ne plus me le rappeler cette semaine</label>';
  modal('', body, '<button class="btn btn-ghost" data-act="rmd-later">Plus tard</button>'
    + (miss.length ? '<button class="btn btn-a" data-act="rmd-go" data-k="'+esc(RMD_KEY[miss[0][0]] || '')+'">'+ic('edit')+'Compléter maintenant</button>'
                   : '<button class="btn btn-a" data-act="rmd-online">'+ic('eye')+'Remettre en ligne</button>'));
  const w = $('#layer .ov-win'); if(w) w.classList.add('sheet', 'rmd');
  animateRings();
}
function snoozeCheck(){ const c = $('#rmdSnooze'); if(c && c.checked) S.snoozeUntil = Date.now() + 7*864e5; }
/* Ouvre la fiche sur la bonne section, mise en évidence. */
function goFicheSection(k, perso){
  closeLayer();
  if(k === '@acct'){ S.ficheTab = perso ? 'perso' : 'projet'; go('fiche'); setTimeout(() => { const b = $('[data-act="edit-account"]'); if(b) b.click(); }, 80); return; }
  S.ficheTab = perso ? 'perso' : 'projet';
  go('fiche');
  setTimeout(() => {
    const secs = $$('#ficheForm .fsec'), sec = secs.find(s => (s.querySelector('.fsec-l')||{}).textContent.toLowerCase().includes(k)) || secs[0];
    if(!sec) return;
    sec.scrollIntoView({block:'center', behavior:'smooth'});
    sec.classList.add('fsec-hl'); setTimeout(() => sec.classList.remove('fsec-hl'), 2400);
    const f = sec.querySelector('input,textarea,button'); if(f) try{ f.focus({preventScroll:true}); }catch(e){}
  }, 120);
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if(!el) return;
  switch(el.dataset.act){
    case 'ftab': { if(S.view === 'fiche' && isDirty()) commitFiche(); S.ficheTab = el.dataset.t; saveBaseline(); render(); syncSide(); break; }
    case 'rmd-later': snoozeCheck(); closeLayer(); break;
    case 'rmd-go': snoozeCheck(); goFicheSection(el.dataset.k, false); break;
    case 'rmd-perso': { snoozeCheck(); const miss = completion('perso').rows.filter(r => !r[1]).sort((a,b) => b[2]-a[2]); goFicheSection(miss[0] ? RMD_KEY[miss[0][0]] : '', true); break; }
    case 'rmd-online': { snoozeCheck(); { const miss = missingReq(); if(miss.length){ closeLayer(); setTimeout(() => reqModal(miss), 0); break; } } if(isTalMode()) S.me.online = true; else S.me.project.online = true; closeLayer(); syncSide(); if(S.view === 'fiche') paintOnline(); toast('Ta fiche est de nouveau visible dans l\'annuaire.', 'ok'); break; }
    case 'preview-public': if(!isTalMode() && S.view === 'fiche' && S.ficheTab === 'perso'){ e.stopImmediatePropagation(); if(S.layer) closeLayer(); openPublicPerso(); } break;
  }
}, true);
if(!window.TM_SHELL) document.addEventListener('DOMContentLoaded', () => scheduleReminder());

/* ============================================================
   v7 — sections obligatoires, téléphone, support, logos,
   messagerie fixe sur ordinateur
   ============================================================ */

/* ---------- Téléphone du compte (privé) ---------- */
S.me.phone = S.me.phone || '+229 01 97 45 25 63';
function phoneLocal(){ return String(S.me.phone || '').replace(/^\+\d{1,3}\s*/, ''); }

/* ---------- Sections obligatoires : une fiche incomplète ne peut pas être en ligne ---------- */
/* Toutes les sections d'une fiche Talent ou projet sont obligatoires (fiche perso : facultative). */
const REQ_LABEL = {'Compétences clés':'Compétences clés (2 au moins)', 'Compétences recherchées':'Compétences recherchées (1 au moins)',
  'Signature personnelle':'Signature personnelle ('+TMRules.MIN.bio+' caractères min.)', 'Le Hook':'Le Hook ('+TMRules.MIN.hook+' caractères min.)',
  'La Vision':'La Vision ('+TMRules.MIN.vision+' caractères min.)', 'La Traction':'La Traction ('+TMRules.MIN.traction+' caractères min.)',
  'Les Défis':'Les Défis ('+TMRules.MIN.challenges+' caractères min.)', 'Lien portfolio':'Lien portfolio (ou « pas encore »)', 'Lien externe':'Lien externe (ou « pas encore »)'};
function isReqRow(label, kind){ kind = kind || (isTalMode() ? 'tal' : 'vis'); return kind === 'perso' || label === 'La Traction' ? 0 : 1; }
/* Le rythme et la proposition d'un projet ont toujours une valeur : ils ne peuvent pas manquer. */
function missingReq(kind){
  kind = kind || (isTalMode() ? 'tal' : 'vis');
  if(kind === 'perso') return [];
  return completion(kind).rows.filter(r => !r[1] && isReqRow(r[0], kind)).map(r => r[0]);
}
/* Mène à la première section qui bloque, avec un message qui dit exactement pourquoi. */
const TXT_FIELDS = {'Signature personnelle':['bio', TMRules.MIN.bio], 'Le Hook':['hook', TMRules.MIN.hook], 'La Vision':['vision', TMRules.MIN.vision],
  'La Traction':['traction', TMRules.MIN.traction], 'Les Défis':['challenges', TMRules.MIN.challenges]};
function explainMissing(miss){
  const first = miss[0], tf = TXT_FIELDS[first];
  let msg;
  if(tf){ const f = document.getElementById(tf[0]), n = f ? f.value.trim().length : 0; if(f) f.dataset.tried = '1';
    msg = first+' doit faire au moins '+tf[1]+' caractères : '+n+' pour l\'instant.'; }
  else msg = 'Pour être en ligne, complète : '+miss.map(l => (REQ_LABEL[l] || l).toLowerCase()).join(', ')+'.';
  if(tf && miss.length > 1) msg += ' Il te manque aussi : '+miss.slice(1).map(l => (REQ_LABEL[l] || l).toLowerCase()).join(', ')+'.';
  $$('#ficheForm textarea').forEach(t => { t.dataset.tried = '1'; });
  S.ficheTried = true;
  markRequired();
  const secs = $$('#ficheForm .fsec'), k = RMD_KEY[first], sec = secs.find(s => ((s.querySelector('.fsec-l')||{}).textContent || '').toLowerCase().includes(k));
  if(sec){ sec.scrollIntoView({block:'center', behavior:'smooth'}); sec.classList.remove('fsec-hl-bad'); void sec.offsetWidth; sec.classList.add('fsec-hl-bad');
    setTimeout(() => sec.classList.remove('fsec-hl-bad'), 2200);
    const f = sec.querySelector('textarea,input,button'); if(f) setTimeout(() => { try{ f.focus({preventScroll:true}); }catch(e){} }, 350); }
  toast(msg, 'bad');
}
function reqModal(miss){
  modal('Encore '+miss.length+' section'+(miss.length>1?'s':'')+' obligatoire'+(miss.length>1?'s':''),
    '<p>Une fiche ne peut être en ligne que si toutes les sections marquées <b style="color:var(--bad)">*</b> sont remplies. Il te manque :</p>'
    + '<div class="rmd-list" style="margin-top:10px">'+miss.map(l => '<button class="rmd-row req" data-act="rmd-go" data-k="'+esc(RMD_KEY[l] || '')+'"><span class="rmd-dot"></span><span class="grow">'+esc(REQ_LABEL[l] || l)+'</span>'+ic('chev')+'</button>').join('')+'</div>',
    '<button class="btn btn-a" data-act="close">Compris</button>');
}
/* Enregistrer reste possible (brouillon) ; une fiche en ligne qui perd une section obligatoire passe hors ligne. */
function commitFiche(){
  saveBaseline();
  if(ficheKind() === 'perso') return;
  const miss = missingReq();
  if(ficheOnline() && miss.length){
    setFicheOnline(false); paintOnline();
    setTimeout(() => toast('Fiche passée hors ligne : il manque '+miss.map(l => l.toLowerCase()).join(', ')+'.', 'bad'), 60);
  }
}
/* Signale en rouge discret les sections obligatoires vides. */
function markRequired(){
  const form = $('#ficheForm'); if(!form || form.classList.contains('perso-form')) return;
  Object.keys(TXT_FIELDS).forEach(label => { const id = TXT_FIELDS[label][0], min = TXT_FIELDS[label][1], f = document.getElementById(id); if(!f) return;
    const n = f.value.trim().length, short = n < min && (f.dataset.touched === '1' || f.dataset.tried === '1') && !(label === 'La Traction' && !n);
    f.classList.toggle('inp-short', short);
    const cnt = form.querySelector('[data-cnt="'+id+'"]');
    if(cnt && n < min){ cnt.textContent = 'encore '+(min - n)+' caractère'+(min - n > 1 ? 's' : '')+' (minimum '+min+')'; cnt.classList.toggle('short', short); }
    else if(cnt) cnt.classList.remove('short'); });
  const rows = completion().rows;
  $$('#ficheForm .fsec').forEach(sec => {
    const lab = ((sec.querySelector('.fsec-l')||{}).textContent || '').toLowerCase();
    const row = rows.find(r => !r[1] && RMD_KEY[r[0]] && RMD_KEY[r[0]][0] !== '@' && lab.includes(RMD_KEY[r[0]]) && !(r[3].opt && !r[3].started));
    const touched = !!sec.querySelector('[data-touched="1"]');
    const on = !!row && (S.ficheTried || touched);
    sec.classList.toggle('fsec-miss', on);
    let tag = sec.querySelector('.miss-tag');
    if(on && !tag){ tag = document.createElement('span'); tag.className = 'miss-tag'; tag.textContent = 'À compléter'; sec.querySelector('.fsec-l').appendChild(tag); }
    if(!on && tag) tag.remove();
    let er = sec.querySelector('.fsec-err');
    const isText = !!sec.querySelector('textarea');
    if(on && !isText){ if(!er){ er = document.createElement('p'); er.className = 'fsec-err'; er.setAttribute('role', 'alert'); sec.querySelector('.fsec-c').appendChild(er); } er.textContent = row[3].msg; }
    else if(er) er.remove();
    const inp = sec.querySelector('input.inp[data-k="portfolio"], input.inp[data-k="p.link"]');
    if(inp) inp.classList.toggle('inp-short', on);
  });
}
function missingHTML(c){
  const kind = ficheKind(), miss = c.rows.filter(r => !r[1]);
  if(!miss.length) return '<div class="row" style="gap:8px;color:var(--ok-ink);font-weight:600;font-size:13.5px">'+ic('check')+'Tout est rempli.</div>';
  const req = kind === 'perso' ? [] : miss.filter(r => isReqRow(r[0], kind)), opt = miss.filter(r => !req.includes(r));
  const line = (r, red) => '<div class="row" style="gap:9px;font-size:13.5px;color:var(--ink-2)"><span class="mh-dot'+(red?' red':'')+'"></span>'
    + esc(REQ_LABEL[r[0]] && red ? REQ_LABEL[r[0]] : r[0])+'<span class="mono" style="margin-left:auto;font-size:11.5px;color:var(--ink-3)">+'+r[2]+' %</span></div>';
  return (req.length ? '<div class="mh-h red">Obligatoire pour être en ligne</div><div class="col" style="gap:8px;margin-bottom:12px">'+req.map(r => line(r, true)).join('')+'</div>' : '')
    + (opt.length ? (req.length ? '<div class="mh-h">Facultatif</div>' : '')+'<div class="col" style="gap:8px">'+opt.map(r => line(r, false)).join('')+'</div>' : '');
}

/* ---------- Aide et support : logo secondaire, WhatsApp, réseaux ---------- */
/* Liens à renseigner côté back-end. */
const TM_LINKS = {
  whatsapp:'https://chat.whatsapp.com/LIEN-DU-GROUPE',
  facebook:'https://www.facebook.com/takamatch',
  tiktok:'https://www.tiktok.com/@takamatch',
  instagram:'https://www.instagram.com/takaamatch',
  linkedin:'https://www.linkedin.com/company/takamatch',
  youtube:'https://www.youtube.com/channel/UCNpx3ccM4wzZuVc7AMehRKQ',
};
/* Comptes affichés sous chaque réseau. */
const TM_HANDLES = {linkedin:'takamatch', instagram:'@takaamatch', facebook:'takamatch', tiktok:'@takamatch', youtube:'TakaMatch'};
const SOCIAL = {"facebook": {"vb": "0 0 32 32", "p": "<path fill=\"currentColor\" d=\"M32 16c0-8.839-7.167-16-16-16C7.161 0 0 7.161 0 16c0 7.984 5.849 14.604 13.5 15.803V20.626H9.437v-4.625H13.5v-3.527c0-4.009 2.385-6.223 6.041-6.223c1.751 0 3.584.312 3.584.312V10.5h-2.021c-1.984 0-2.604 1.235-2.604 2.5v3h4.437l-.713 4.625H18.5v11.177C26.145 30.603 32 23.983 32 15.999z\" />"}, "linkedin": {"vb": "0 0 20 20", "p": "<path fill=\"currentColor\" d=\"M10 .4C4.698.4.4 4.698.4 10s4.298 9.6 9.6 9.6s9.6-4.298 9.6-9.6S15.302.4 10 .4M7.65 13.979H5.706V7.723H7.65zm-.984-7.024c-.614 0-1.011-.435-1.011-.973c0-.549.409-.971 1.036-.971s1.011.422 1.023.971c0 .538-.396.973-1.048.973m8.084 7.024h-1.944v-3.467c0-.807-.282-1.355-.985-1.355c-.537 0-.856.371-.997.728c-.052.127-.065.307-.065.486v3.607H8.814v-4.26c0-.781-.025-1.434-.051-1.996h1.689l.089.869h.039c.256-.408.883-1.01 1.932-1.01c1.279 0 2.238.857 2.238 2.699z\" />"}, "instagram": {"vb": "0 0 56 56", "p": "<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M39.006 3C46.735 3 53 9.27 53 16.994v22.012C53 46.735 46.73 53 39.006 53H16.994C9.265 53 3 46.73 3 39.006V16.994C3 9.265 9.27 3 16.994 3zM28 15c-7.18 0-13 5.82-13 13s5.82 13 13 13s13-5.82 13-13s-5.82-13-13-13m0 4a9 9 0 1 1 0 18a9 9 0 0 1 0-18m14.5-9a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7\" />"}, "tiktok": {"vb": "0 0 24 24", "p": "<path fill=\"currentColor\" d=\"M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2m5.939 7.713v.646a.37.37 0 0 1-.38.37a5.36 5.36 0 0 1-2.903-1.108v4.728a3.94 3.94 0 0 1-1.18 2.81a4 4 0 0 1-2.87 1.17a4.1 4.1 0 0 1-2.862-1.17a3.98 3.98 0 0 1-1.026-3.805c.159-.642.48-1.232.933-1.713a3.58 3.58 0 0 1 2.79-1.313h.82v1.703a.348.348 0 0 1-.39.348a1.918 1.918 0 0 0-1.23 3.631c.27.155.572.246.882.267c.24.01.48-.02.708-.092a1.93 1.93 0 0 0 1.313-1.816V5.754a.36.36 0 0 1 .359-.36h1.415a.36.36 0 0 1 .359.34a3.3 3.3 0 0 0 1.282 2.245a3.25 3.25 0 0 0 1.641.636a.37.37 0 0 1 .338.35z\" />"}, "whatsapp": {"vb": "0 0 360 362", "p": "<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M307.546 52.566C273.709 18.684 228.706.017 180.756 0C81.951 0 1.538 80.404 1.504 179.235c-.017 31.594 8.242 62.432 23.928 89.609L0 361.736l95.024-24.925c26.179 14.285 55.659 21.805 85.655 21.814h.077c98.788 0 179.21-80.413 179.244-179.244c.017-47.898-18.608-92.926-52.454-126.807zm-126.79 275.788h-.06c-26.73-.008-52.952-7.194-75.831-20.765l-5.44-3.231l-56.391 14.791l15.05-54.981l-3.542-5.638c-14.912-23.721-22.793-51.139-22.776-79.286c.035-82.14 66.867-148.973 149.051-148.973c39.793.017 77.198 15.53 105.328 43.695c28.131 28.157 43.61 65.596 43.593 105.398c-.035 82.149-66.867 148.982-148.982 148.982zm81.719-111.577c-4.478-2.243-26.497-13.073-30.606-14.568c-4.108-1.496-7.09-2.243-10.073 2.243c-2.982 4.487-11.568 14.577-14.181 17.559c-2.613 2.991-5.226 3.361-9.704 1.117c-4.477-2.243-18.908-6.97-36.02-22.226c-13.313-11.878-22.304-26.54-24.916-31.027c-2.613-4.486-.275-6.91 1.959-9.136c2.011-2.011 4.478-5.234 6.721-7.847s2.983-4.486 4.478-7.469c1.496-2.991.748-5.603-.369-7.847c-1.118-2.243-10.073-24.289-13.812-33.253c-3.636-8.732-7.331-7.546-10.073-7.692c-2.613-.13-5.595-.155-8.586-.155s-7.839 1.118-11.947 5.604s-15.677 15.324-15.677 37.361s16.047 43.344 18.29 46.335s31.585 48.225 76.51 67.632c10.684 4.615 19.029 7.374 25.535 9.437c10.727 3.412 20.49 2.931 28.208 1.779c8.604-1.289 26.498-10.838 30.228-21.298s3.73-19.433 2.613-21.298s-4.108-2.991-8.586-5.234z\" clip-rule=\"evenodd\" />"}, "youtube": {"vb": "0 0 24 24", "p": "<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z\"/>"}};
const LOGO2 = 'assets/images/logo-secondaire.svg';
function socIc(k){ const s = SOCIAL[k]; return '<svg class="soc-ic" viewBox="'+s.vb+'" aria-hidden="true">'+s.p+'</svg>'; }
function supportRail(){
  const nets = [['linkedin','LinkedIn'],['instagram','Instagram'],['facebook','Facebook'],['tiktok','TikTok'],['youtube','YouTube']];
  return '<div class="support-logo"><img src="'+LOGO2+'" alt="TakaMatch"></div>'
    + '<section class="card card-pad gb"><div class="lbl" style="margin-bottom:6px">Communauté WhatsApp</div>'
    +   '<p style="font-size:13.5px;color:var(--ink-2);line-height:1.55;margin-bottom:12px"><span class="mono">840</span> membres. Entraide, retours d\'expérience et annonces de projets.</p>'
    +   '<a class="btn btn-block btn-wa" href="'+TM_LINKS.whatsapp+'" target="_blank" rel="noopener">'+socIc('whatsapp')+'Rejoindre le groupe</a></section>'
    + '<section class="card card-pad gb"><div class="lbl" style="margin-bottom:8px">Sécurité</div>'
    +   '<p style="font-size:13.5px;color:var(--ink-2);line-height:1.55">Personne de TakaMatch ne te demandera jamais ton code mobile money ni ton mot de passe.</p></section>'
    + '<section class="card card-pad gb"><div class="lbl" style="margin-bottom:10px">Suis-nous</div>'
    +   '<div class="soc-grid">'+nets.map(n => '<a class="soc soc-'+n[0]+'" href="'+TM_LINKS[n[0]]+'" target="_blank" rel="noopener">'+socIc(n[0])
          + '<span><b>'+n[1]+'</b><span class="mono">'+TM_HANDLES[n[0]]+'</span></span></a>').join('')+'</div></section>';
}

/* ---------- Interceptions : interrupteur En ligne, compte, téléphone ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if(!el) return;
  const a = el.dataset.act;
  if(a === 'online' && !ficheOnline()){
    const miss = missingReq();
    if(miss.length){ e.stopImmediatePropagation(); e.preventDefault();
      if(S.view === 'fiche') explainMissing(miss); else reqModal(miss); }
  } else if(a === 'edit-account'){
    e.stopImmediatePropagation(); e.preventDefault();
    const m = S.me;
    modal('Modifier mon compte',
      '<div class="grid g2" style="gap:12px">'+field('e1','Prénom(s)','<input class="inp" id="e1" value="'+esc(m.first)+'">')
      + field('e2','Nom','<input class="inp" id="e2" value="'+esc(m.last)+'" disabled>')+'</div>'
      + field('e3','Ville','<input class="inp" id="e3" list="e3List" autocomplete="off" value="'+esc(m.city)+'">'+cityDatalist(m.city))
      + field('e4','Téléphone','<div class="row" style="gap:8px"><select class="inp" style="width:120px;flex:0 0 auto" id="e4c">'
          + ['BJ +229','TG +228','CI +225','SN +221'].map(o => '<option'+(String(m.phone).startsWith(o.slice(3)) ? ' selected' : '')+'>'+o+'</option>').join('')+'</select>'
          + '<input class="inp mono" id="e4" inputmode="tel" value="'+esc(phoneLocal())+'"></div>')
      + '<p class="hint" style="margin-top:-6px">Privé. Si tu le changes, on te renverra un code par SMS pour le vérifier.</p>'
      + '<div class="field"><label>Sexe</label><div class="opt-row" role="radiogroup" aria-label="Sexe">'+['m','f','n'].map(k =>
          '<button class="opt radio" data-act="sex-pick" data-v="'+k+'" aria-pressed="'+(m.sex===k)+'"><span class="box">'+tick()+'</span><span>'+SEX_L[k]+'</span></button>').join('')+'</div>'
      + '<p class="hint">Visible seulement après un match. Il ne compte ni dans le score ni dans les filtres.</p></div>'
      + note('', 'lock', 'Le nom de famille est verrouillé depuis l\'inscription : c\'est ce qui rend les documents de l\'Atelier valables.'),
      '<button class="btn btn-ghost" data-act="close">Annuler</button><button class="btn btn-a" data-act="edit-account-go">Enregistrer</button>');
  } else if(a === 'edit-account-go'){
    const tel = $('#e4'), cc = $('#e4c');
    if(tel){ const nv = cc.value.slice(3)+' '+tel.value.trim(); if(tel.value.trim()) S.me.country = cc.value.slice(0, 2);
      if(tel.value.trim() && nv !== S.me.phone){ S.me.phone = nv; S.me.verifiedPhone = false; setTimeout(() => PHONE_VERIFY ? toast('Nouveau numéro enregistré : vérifie-le par SMS.', 'bad') : toast('Nouveau numéro enregistré.', 'ok'), 80); } }
  } else if(a === 'verify-phone-go'){
    const tel = $('#tel'), cc = $('#cc');
    if(tel && tel.value.trim()){ S.me.phone = cc.value.slice(3)+' '+tel.value.trim(); S.me.country = cc.value.slice(0, 2); }
  } else if(a === 'verify-phone'){
    setTimeout(() => { const t = $('#tel'); if(t && !t.value) t.value = phoneLocal(); }, 0);
  }
}, true);

/* ============================================================
   Démarrage : directement dans l'outil
   ============================================================ */
if(!window.TM_SHELL) document.addEventListener('DOMContentLoaded', () => {
S.booted = true;
seedDemo();
saveBaseline();
syncOnline();
go('accueil');
});

"use strict";
/* ============================================================
   TakaMatch — passerelle outil ↔ coquille
   Dans TakaMatch.html, l'outil ne démarre qu'à la réception d'un
   compte : soit le compte que l'onboarding vient de créer (fiche,
   pseudo, photo, rôle…), soit, à la connexion, le compte de
   démonstration. Se déconnecter ramène à la vitrine.
   ============================================================ */

/* ---------- Profil de départ et second profil ----------
   Le premier profil (celui choisi à l'onboarding) est gratuit ;
   l'autre se débloque une fois pour 3 000 FCFA (vitrine, DESIGN §9.1). */
const tmPrimary = () => S.me.primary || 'tal';
const tmSecond = () => tmPrimary() === 'vis' ? 'tal' : 'vis';
const tmRoleOpen = r => r === tmPrimary() || !!S.me.visUnlocked;
function tmNextMonth(){
  const d = new Date(); d.setMonth(d.getMonth() + 1, 1);
  return ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'][d.getMonth()];
}
function tmSecondTalHTML(){
  return '<p style="font-size:13.5px;color:var(--ink-2);line-height:1.6;margin-bottom:12px">Mets aussi tes compétences au service d\'autres projets : publie une fiche Talent et reçois des invitations. <b style="color:var(--ink)">'+priceH('second')+' une seule fois</b>, puis tu passes d\'un profil à l\'autre sans limite.</p>'
    + '<button class="btn btn-tal btn-block btn-sm" data-act="switch-role">🛠️ Deviens aussi Talent</button>';
}

(function(){
  if(!window.TM_SHELL) return;
  const post = m => { try{ parent.postMessage(Object.assign({tm:1}, m), '*'); }catch(e){} };

  /* Liens « #… » : jamais de navigation dans le cadre. */
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]'); if(a) e.preventDefault();
  }, true);

  /* ---------- Ta photo de profil (ajoutée à l'onboarding) ---------- */
  const _top = renderTop;
  renderTop = function(){
    _top();
    const av = $('#meAv'); if(!av) return;
    if(S.me.photo){
      av.textContent = '';
      av.style.backgroundImage = 'url('+S.me.photo+')';
      av.style.backgroundSize = 'cover'; av.style.backgroundPosition = 'center';
    } else av.style.backgroundImage = '';
  };

  /* ---------- Compte neuf : pas de chiffres inventés (DESIGN §1) ---------- */
  const _seed = seedDemo;
  seedDemo = function(){
    if(!S.me.fresh) return _seed();
    Object.assign(S, {teams:{}, left:new Set(), removed:{}, pendingJoin:null, takTab:null,
      matches:[], threads:[], invitesRecv:[], invitesSent:[], activeThread:null, atelierId:null});
    if(!S.prof[S.me.role]){
      const tal = isTalMode(), on = ficheOnline();
      S.notifs = [{i:'spark', t:'Bienvenue sur TakaMatch',
        s: tal ? (on ? 'Ta fiche Talent est en ligne : les visionnaires peuvent t\'inviter.' : 'Complète ta fiche Talent pour la mettre en ligne.')
               : (on ? 'Ta fiche projet est en ligne : invite tes premiers talents.' : 'Complète ta fiche projet pour la mettre en ligne.'),
        min:0, read:false}];
      S.favs = new Set(); S.likes = new Set(); S.reported = new Set();
    }
  };

  /* ---------- Second profil : Talent pour un compte né Visionnaire ---------- */
  const _unlockModal = unlockModal;
  unlockModal = function(){
    if(tmSecond() === 'vis') return _unlockModal();
    S.pay = payInit(1); S.pay.key = 'second';
    modal('Deviens aussi Talent',
      '<div class="price-hd"><span class="mono">'+priceH('second')+'</span><span>une seule fois, puis tu passes d\'un profil à l\'autre sans limite</span></div>'
      + '<ul class="leave-l">'
      + '<li>'+ic('tools')+'Tu publies une fiche Talent : les porteurs d\'autres projets peuvent t\'inviter, et c\'est gratuit pour toi.</li>'
      + '<li>'+ic('idcard')+'Ta fiche perso sert de base : compétences, niveau et signature sont déjà remplis.</li>'
      + '<li>'+ic('users')+'Tes deux profils sont indépendants : matchs, invitations, conversations et Ateliers séparés.</li>'
      + '<li>'+ic('shield')+'Ton compte reste unique : nom, email, ville, sexe et échelle de confiance sont communs.</li></ul>'
      + opsField(),
      '<button class="btn btn-ghost" data-act="close">Plus tard</button><button class="btn btn-tal" data-act="unlock-pay">'+ic('card')+'Payer '+priceH('second')+'</button>', {lg:true});
  };
  const _doUnlock = doUnlock;
  doUnlock = function(btn){
    if(tmSecond() === 'vis') return _doUnlock(btn);
    payThen({kind:'second', key:'second', label:'Second profil · Talent', amount:priceOf('second').charged}, btn, () => {
      const m = S.me;
      m.visUnlocked = true; m.visSince = new Date();
      copyPersoToTalent(m);   /* la fiche Talent part de la fiche perso, puis vit sa vie */
      S.payments.unshift({d:today(), l:'Second profil · Talent', a:priceOf('second').charged, op:S.pay.op, ref:S.pay.ref, cc:S.pay.cc});
      closeLayer(); confetti();
      if(S.view === 'fiche' && isDirty()) commitFiche();
      saveCtx(); m.role = 'tal';
      m.online = missingReq('tal').length === 0;
      loadCtx(); resetUi(); saveBaseline();
      S._painted = null; go('fiche');
      success('Profil Talent débloqué', 'Paiement de <span class="mono">'+priceH('second')+'</span> confirmé via '+esc(S.pay.op)+'. Ta fiche perso a servi de base : complète ta fiche Talent pour la mettre en ligne. Tu reviens à tes projets quand tu veux, sans payer.');
    });
  };

  /* ---------- Thème partagé avec la vitrine et l'onboarding ---------- */
  const _toggle = toggleTheme;
  toggleTheme = function(){ _toggle(); post({type:'theme', v:document.documentElement.getAttribute('data-theme')}); };

  /* ---------- Déconnexion et suppression du compte ---------- */
  function snapshot(){
    try{ if(S.view === 'fiche' && isDirty()) commitFiche(); }catch(e){}
    try{ return structuredClone(S.me); }catch(e){ return null; }
  }
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-act="logout-go"],[data-act="delete-go"]'); if(!t) return;
    e.preventDefault(); e.stopImmediatePropagation();
    closeLayer(); clearTimeout(rmdT);
    if(t.dataset.act === 'logout-go') post({type:'logout', me:snapshot()});
    else post({type:'deleted'});
  }, true);

  /* ---------- Construction du compte issu de l'onboarding ---------- */
  function hue(s){ let h = 0; for(const ch of String(s || '')) h = (h * 31 + ch.charCodeAt(0)) % 360; return h; }
  function fromOnb(o, email){
    const m = structuredClone(DEFAULT_ME);
    delete m.project; delete m.avail; delete m.pay;
    Object.assign(m, {
      first:o.first || '', last:o.last || '', email:email || '', handle:o.handle || '', city:o.city || '',
      sex:o.sex === 'np' ? 'n' : (o.sex || 'n'), phone:o.phone ? (o.dial || payDial(o.cc))+' '+o.phone : '', country:PAY_COUNTRIES[o.cc] ? o.cc : '', photo:o.photo || '',
      role:o.role, primary:o.role, fresh:true, avatarHue:hue(o.handle),
      talentOn:true, talentPromptSeen:true,
      online:true, verifiedEmail:true, verifiedPhone:false, verifiedId:false, refs:0,
      credits:3, creditsMax:3,
    });
    if(o.role === 'tal'){
      Object.assign(m, {skills:o.skills || [], sectors:o.sectors || [], level:o.level || '', diploma:o.diploma || '', status:o.status || '',
        pace:o.pace || 'serieux', bio:o.bio || '', portfolio:o.portfolio || '', portfolioTitle:o.portfolioTitle || '', noPortfolio:!!o.noPortfolio});
      m.projects = [blankProject()];
    } else {
      const x = o.perso || {}, p = o.project || {};
      Object.assign(m, {skills:x.skills || [], level:x.level || '', bio:x.bio || '', portfolio:x.portfolio || '', noPortfolio:!!x.noPortfolio, pace:o.pace || 'serieux'});
      m.perso = {skills:(x.skills || []).slice(), level:x.level || '', bio:x.bio || '', portfolio:x.portfolio || '', portfolioTitle:x.portfolioTitle || '', noPortfolio:!!x.noPortfolio};
      m.projects = [Object.assign(blankProject(), {
        title:p.title || '', sectors:p.sectors || [], seeking:p.seeking || [], hook:p.hook || '', vision:p.vision || '',
        traction:p.traction || '', challenges:p.challenges || '', link:p.link || '', noLink:!!p.noLink, pace:o.pace || 'serieux',
        pay:p.offer || 'equity', photo:p.cover || '', glyph:o.projIconGlyph || '💡', online:true})];
    }
    m.projIdx = 0; m.visUnlocked = false; m.visSince = null; m.slots = 1;
    return m;
  }

  function start(acc){
    if(acc.kind === 'fresh'){
      if(acc.tool){ S.me = acc.tool; S.me.projects = S.me.projects || [blankProject()]; }
      else S.me = fromOnb(acc.onb || {}, acc.email);
      attachProjectGetter(S.me);
      S.ctxs = {}; S.prof = {}; S.payments = []; S.fPay = ''; S.pubView = 'membre';
    } else if(acc.email){
      S.me.email = acc.email;
    }
    if(tmPrimary() === 'vis' && !S.me.visUnlocked) S.me.role = 'vis';
    S.booted = true;
    seedDemo(); saveBaseline(); syncOnline();
    go(acc.view || 'accueil');
    scheduleReminder();
    if(acc.kind === 'fresh' && !acc.tool) tmBus('signup', {user:tmUserCard()});
    tourWelcomeMaybe();
    if(acc.welcome) setTimeout(() => toast(acc.welcome, 'ok'), 350);
  }

  addEventListener('message', e => {
    const d = e.data; if(!d || !d.tm || e.source !== parent) return;
    if(d.type === 'account') start(d.acc);
    if(d.type === 'resume'){
      go('accueil'); S.reminded = new Set(); scheduleReminder();
      if(d.welcome) setTimeout(() => toast(d.welcome, 'ok'), 350);
    }
    if(d.type === 'back'){ if(TOUR.on) tourClose(false, false); else if(S.layer) closeLayer(); else if(S.view !== 'accueil') go('accueil'); return; }
    if(d.type === 'theme'){
      document.documentElement.setAttribute('data-theme', d.v);
      if(S.booted){ renderTop(); render(); }
    }
  });
  post({type:'ready'});
})();

"use strict";
/* ============================================================
   TakaMatch — outil v8
   · badge de vérification (icône officielle, couleur du rôle décrit)
   · visites guidées : premier passage, puis premier match
   · lien avec l'espace d'administration (vérifications, signalements,
     messages au support) par BroadcastChannel + localStorage
   ============================================================ */

/* ---------- Badge de vérification ---------- */
const VB_PATH = 'M16 8.375C16 8.93437 15.8656 9.45312 15.5969 9.92813C15.3281 10.4031 14.9688 10.775 14.5156 11.0344C14.5281 11.1188 14.5344 11.25 14.5344 11.4281C14.5344 12.275 14.25 12.9937 13.6875 13.5875C13.1219 14.1844 12.4406 14.4812 11.6438 14.4812C11.2875 14.4812 10.9469 14.4156 10.625 14.2844C10.375 14.7969 10.0156 15.2094 9.54375 15.525C9.075 15.8438 8.55937 16 8 16C7.42812 16 6.90938 15.8469 6.44688 15.5344C5.98125 15.225 5.625 14.8094 5.375 14.2844C5.05312 14.4156 4.71562 14.4812 4.35625 14.4812C3.55937 14.4812 2.875 14.1844 2.30312 13.5875C1.73125 12.9937 1.44687 12.2719 1.44687 11.4281C1.44687 11.3344 1.45938 11.2031 1.48125 11.0344C1.02813 10.7719 0.66875 10.4031 0.4 9.92813C0.134375 9.45312 0 8.93437 0 8.375C0 7.78125 0.15 7.23438 0.446875 6.74062C0.74375 6.24687 1.14375 5.88125 1.64375 5.64375C1.5125 5.2875 1.44687 4.92812 1.44687 4.57188C1.44687 3.72813 1.73125 3.00625 2.30312 2.4125C2.875 1.81875 3.55937 1.51875 4.35625 1.51875C4.7125 1.51875 5.05312 1.58438 5.375 1.71563C5.625 1.20312 5.98438 0.790625 6.45625 0.475C6.925 0.159375 7.44063 0 8 0C8.55937 0 9.075 0.159375 9.54375 0.471875C10.0125 0.7875 10.375 1.2 10.625 1.7125C10.9469 1.58125 11.2844 1.51562 11.6438 1.51562C12.4406 1.51562 13.1219 1.8125 13.6875 2.40937C14.2531 3.00625 14.5344 3.725 14.5344 4.56875C14.5344 4.9625 14.475 5.31875 14.3562 5.64062C14.8562 5.87813 15.2563 6.24375 15.5531 6.7375C15.85 7.23438 16 7.78125 16 8.375ZM7.65938 10.7844L10.9625 5.8375C11.0469 5.70625 11.0719 5.5625 11.0437 5.40938C11.0125 5.25625 10.9344 5.13438 10.8031 5.05312C10.6719 4.96875 10.5281 4.94063 10.375 4.9625C10.2188 4.9875 10.0938 5.0625 10 5.19375L7.09062 9.56875L5.75 8.23125C5.63125 8.1125 5.49375 8.05625 5.34062 8.0625C5.18437 8.06875 5.05 8.125 4.93125 8.23125C4.825 8.3375 4.77187 8.47187 4.77187 8.63437C4.77187 8.79375 4.825 8.92813 4.93125 9.0375L6.77187 10.8781L6.8625 10.95C6.96875 11.0219 7.07812 11.0562 7.18437 11.0562C7.39375 11.0531 7.55313 10.9656 7.65938 10.7844Z';
/* role : celui de la personne décrite ('tal' bleu, 'vis' jaune), jamais celui du visiteur. */
function vBadge(role, ok){
  const cls = ok ? (role === 'vis' ? 'vb-vis' : 'vb-tal') : 'vb-off';
  return '<span class="vbadge '+cls+'" title="'+(ok ? 'Profil vérifié par l\'équipe TakaMatch' : 'Profil pas encore vérifié')+'">'
    + '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="'+VB_PATH+'"/></svg><span>('+(ok ? 'Vérifié' : 'Non vérifié')+')</span></span>';
}

/* ---------- Styles v8 ---------- */
(function(){
  const css = `
.vbadge{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;white-space:nowrap;line-height:1;vertical-align:middle}
.vbadge svg{width:15px;height:15px;flex:0 0 auto}
.ic-verif.tal{color:#007CD8}.ic-verif.vis{color:#E2A70F}
:root[data-theme="dark"] .ic-verif.tal{color:#3FA3EE}:root[data-theme="dark"] .ic-verif.vis{color:#FFD741}
.vb-tal svg{fill:#007CD8}.vb-tal span{color:var(--tal-700)}
.vb-vis svg{fill:#E2A70F}.vb-vis span{color:var(--vis-700)}
.vb-off svg{fill:#D3CEC3}.vb-off span{color:var(--ink-3);font-weight:500}
:root[data-theme="dark"] .vb-tal svg{fill:#3FA3EE}:root[data-theme="dark"] .vb-vis svg{fill:#FFD741}:root[data-theme="dark"] .vb-off svg{fill:#4F4A42}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .vb-tal svg{fill:#3FA3EE}:root:not([data-theme="light"]) .vb-vis svg{fill:#FFD741}:root:not([data-theme="light"]) .vb-off svg{fill:#4F4A42}}
.vpend{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--warn-ink);background:var(--warn-bg);border-radius:99px;padding:4px 10px;font-weight:600}
/* Visite guidée */
.tour{position:fixed;inset:0;z-index:300;pointer-events:auto}
.tour-veil{position:fixed;inset:0;background:rgba(20,18,15,.55);transition:opacity .2s}
.tour.has-spot .tour-veil{opacity:0}
.tour-spot{position:fixed;border-radius:14px;box-shadow:0 0 0 9999px rgba(20,18,15,.55),0 0 0 3px var(--a-600);transition:all .32s cubic-bezier(.2,.8,.2,1);pointer-events:none}
.tour:not(.has-spot) .tour-spot{opacity:0}
.tour-card{position:fixed;width:min(380px,calc(100vw - 24px));background:var(--surface);border:1px solid var(--line);border-radius:18px;box-shadow:0 24px 60px -12px rgba(0,0,0,.35);padding:20px 20px 16px;transition:top .32s cubic-bezier(.2,.8,.2,1),left .32s cubic-bezier(.2,.8,.2,1);animation:tourIn .28s cubic-bezier(.2,.8,.2,1) both}
.tour-card.center{width:min(460px,calc(100vw - 24px));padding:26px 26px 20px}
@keyframes tourIn{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
.tour-k{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;font-size:12px;color:var(--ink-3);font-weight:600}
.tour-k .mono{font-family:var(--mono)}
.tour-x{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;color:var(--ink-3)}
.tour-x:hover{background:var(--surface-3);color:var(--ink)}
.tour-x .ic{width:16px;height:16px}
.tour-card h3{font-family:var(--disp);font-size:20px;line-height:1.25;margin:0 0 8px;font-weight:600}
.tour-card.center h3{font-size:24px}
.tour-card p{font-size:14px;line-height:1.6;color:var(--ink-2);margin:0}
.tour-card p + p{margin-top:8px}
.tour-dots{display:flex;gap:5px;margin:16px 0 14px}
.tour-dots i{height:4px;flex:1;border-radius:4px;background:var(--surface-3)}
.tour-dots i.on{background:var(--a-600)}
.tour-f{display:flex;align-items:center;gap:8px}
.tour-f .grow{flex:1}
.tour-ill{font-size:34px;line-height:1;margin-bottom:10px}
@media (max-width:640px){.tour-card,.tour-card.center{left:12px!important;right:12px;width:auto;top:auto!important;bottom:calc(12px + 64px + env(safe-area-inset-bottom,0px))}}
@media (prefers-reduced-motion:reduce){.tour-spot,.tour-card{transition:none;animation:none}}
.tour-again{display:flex;align-items:center;gap:12px}
.tour-again .ic{width:20px;height:20px;color:var(--a-700)}
`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();

/* ============================================================
   Visites guidées
   ============================================================ */
const TOUR = {on:false, steps:[], i:0, kind:'', done:null};
function tourVisible(el){
  if(!el) return false;
  const r = el.getBoundingClientRect();
  if(r.width < 2 || r.height < 2) return false;
  if(r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false;
  const cs = getComputedStyle(el);
  return cs.visibility !== 'hidden' && cs.display !== 'none';
}
function tourTarget(sel){
  for(const s of [].concat(sel || [])){ const el = document.querySelector(s); if(tourVisible(el)) return el; }
  return null;
}
function tourOpen(kind, steps, done){
  tourClose(true);
  /* Les étapes dont la cible n'existe pas (ex. sur mobile) sont écartées. */
  TOUR.ctaUsed = false; TOUR.kind = kind; TOUR.steps = steps; TOUR.i = 0; TOUR.on = true; TOUR.done = done || null;
  const el = document.createElement('div');
  el.className = 'tour'; el.id = 'tour';
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'tourT');
  el.innerHTML = '<div class="tour-veil"></div><div class="tour-spot"></div><div class="tour-card" id="tourCard"></div>';
  document.body.appendChild(el);
  tourShow(0);
}
function tourShow(i){
  const n = TOUR.steps.length; if(i < 0 || i >= n) return;
  TOUR.i = i;
  const s = TOUR.steps[i];
  if(s.before) try{ s.before(); }catch(e){}
  setTimeout(() => {
    if(!TOUR.on) return;
    const el = s.sel ? tourTarget(s.sel) : null;
    if(s.sel && !el && s.opt){ return tourShow(i + (TOUR.dir < 0 ? -1 : 1)); }
    tourPaint(el);
  }, s.before ? 260 : 30);
}
function tourPaint(el){
  const root = $('#tour'); if(!root) return;
  const s = TOUR.steps[TOUR.i], n = TOUR.steps.length, last = TOUR.i === n - 1, first = TOUR.i === 0;
  const spot = root.querySelector('.tour-spot'), card = $('#tourCard');
  root.classList.toggle('has-spot', !!el);
  if(el){
    el.scrollIntoView({block:'nearest', inline:'nearest'});
    const r = el.getBoundingClientRect(), pad = 6;
    Object.assign(spot.style, {top:(r.top - pad)+'px', left:(r.left - pad)+'px', width:(r.width + pad*2)+'px', height:(r.height + pad*2)+'px'});
  }
  const counted = TOUR.steps.filter(x => !x.center);
  const idx = counted.indexOf(s);
  card.className = 'tour-card' + (el ? '' : ' center');
  card.innerHTML = '<div class="tour-k"><span>'+esc(s.kicker || (TOUR.kind === 'match' ? 'Après ton match' : 'Visite guidée'))
      + (idx >= 0 ? ' · <span class="mono">'+(idx+1)+' / '+counted.length+'</span>' : '')+'</span>'
      + '<button class="tour-x" data-act="tour-skip" aria-label="Passer la visite" title="Passer la visite">'+ic('x')+'</button></div>'
    + (s.ill ? '<div class="tour-ill" aria-hidden="true">'+s.ill+'</div>' : '')
    + '<h3 id="tourT">'+s.t+'</h3>' + [].concat(s.p).map(x => '<p>'+x+'</p>').join('')
    + '<div class="tour-dots" aria-hidden="true">'+TOUR.steps.map((x, k) => '<i class="'+(k <= TOUR.i ? 'on' : '')+'"></i>').join('')+'</div>'
    + '<div class="tour-f">'
    +   (last ? '' : '<button class="btn btn-quiet btn-sm" data-act="tour-skip">'+(first ? 'Passer la visite' : 'Passer')+'</button>')
    +   '<span class="grow"></span>'
    +   (first ? '' : '<button class="btn btn-ghost btn-sm" data-act="tour-prev">'+ic('back')+'Précédent</button>')
    +   (s.cta && last ? '<button class="btn btn-ghost btn-sm" data-act="tour-cta">'+esc(s.cta.l)+'</button>' : '')
    +   '<button class="btn btn-a btn-sm" data-act="tour-next">'+(last ? (s.end || 'Terminer') : first && s.center ? (s.start || 'Commencer la visite') : 'Suivant')+(last ? '' : ic('arrow'))+'</button>'
    + '</div>';
  /* Position de la carte : sous la cible, sinon au-dessus, sinon à droite. */
  const W = innerWidth, H = innerHeight;
  if(W <= 640){ card.style.left = ''; card.style.top = ''; }
  else if(!el){
    card.style.left = Math.round((W - card.offsetWidth) / 2)+'px';
    card.style.top = Math.round((H - card.offsetHeight) / 2)+'px';
  } else {
    const r = el.getBoundingClientRect(), cw = card.offsetWidth, ch = card.offsetHeight, gap = 16;
    let top, left;
    if(r.right + gap + cw < W - 12 && r.width < W * .45){ left = r.right + gap; top = r.top + r.height/2 - ch/2; }
    else if(r.bottom + gap + ch < H - 12){ top = r.bottom + gap; left = r.left + r.width/2 - cw/2; }
    else if(r.top - gap - ch > 12){ top = r.top - gap - ch; left = r.left + r.width/2 - cw/2; }
    else { left = r.left - gap - cw; top = r.top + r.height/2 - ch/2; }
    card.style.left = Math.round(clamp(left, 12, W - cw - 12))+'px';
    card.style.top = Math.round(clamp(top, 12, H - ch - 12))+'px';
  }
  const f = card.querySelector('[data-act="tour-next"]'); if(f) try{ f.focus({preventScroll:true}); }catch(e){}
}
function tourClose(silent, finished){
  const el = $('#tour'); if(el) el.remove();
  if(!TOUR.on) return;
  TOUR.on = false;
  const kind = TOUR.kind, done = TOUR.done;
  S.me.tours = S.me.tours || {};
  S.me.tours[kind === 'match' ? 'match-'+S.me.role : 'welcome'] = true;
  if(done) done(finished);
  if(!silent && !finished) toast('Tu peux revoir la visite à tout moment depuis Aide et support.');
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act^="tour-"]'); if(!t) return;
  e.preventDefault(); e.stopImmediatePropagation();
  const a = t.dataset.act;
  if(a === 'tour-skip') return tourClose(false, false);
  if(a === 'tour-prev'){ TOUR.dir = -1; return tourShow(TOUR.i - 1); }
  if(a === 'tour-next'){
    TOUR.dir = 1;
    if(TOUR.i >= TOUR.steps.length - 1) return tourClose(false, true);
    return tourShow(TOUR.i + 1);
  }
  if(a === 'tour-cta'){ const s = TOUR.steps[TOUR.i]; TOUR.ctaUsed = true; tourClose(true, true); if(s.cta && s.cta.run) s.cta.run(); return; }
  if(a === 'tour-again'){ startWelcomeTour(true); return; }
}, true);
document.addEventListener('keydown', e => {
  if(!TOUR.on) return;
  if(e.key === 'Escape'){ e.preventDefault(); e.stopImmediatePropagation(); tourClose(false, false); }
  else if(e.key === 'ArrowRight'){ e.preventDefault(); const b = document.querySelector('[data-act="tour-next"]'); if(b) b.click(); }
  else if(e.key === 'ArrowLeft' && TOUR.i > 0){ e.preventDefault(); TOUR.dir = -1; tourShow(TOUR.i - 1); }
  else if(e.key === 'Tab'){
    const f = [...document.querySelectorAll('#tourCard button')]; if(!f.length) return;
    const i = f.indexOf(document.activeElement);
    e.preventDefault(); (f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length]).focus();
  }
}, true);
addEventListener('resize', () => { if(TOUR.on){ const s = TOUR.steps[TOUR.i]; tourPaint(s.sel ? tourTarget(s.sel) : null); } });

/* Le rappel de complétion attend la fin d'une visite. */
const _tryReminder = tryReminder;
tryReminder = function(){ if(TOUR.on || tourQueued){ rmdT = setTimeout(tryReminder, 1500); return; } _tryReminder(); };

const navSel = id => ['#side [data-nav="'+id+'"]', '[data-tab="'+id+'"]'];
function startWelcomeTour(again){
  if(S.layer) closeLayer();
  const tal = isTalMode(), first = S.me.first || '', open = tmRoleOpen(tal ? 'vis' : 'tal');
  const other = roleLabel(tal ? 'vis' : 'tal');
  const steps = [
    {center:true, ill:'👋', kicker:'Bienvenue', t:'Bienvenue sur TakaMatch'+(first ? ', '+esc(first) : '')+' !',
      p:[tal ? 'Ta fiche Talent est prête. En une minute, on te montre où trouver des projets, comment répondre aux invitations, discuter et construire ton équipe.'
             : 'Ta fiche projet est prête. En une minute, on te montre où trouver des talents, comment les inviter, discuter avec eux et construire ton équipe.',
         'Tu peux suivre la visite étape par étape, ou la passer et la revoir plus tard depuis <b>Aide et support</b>.']},
    {sel:['#side .sb-hd', '#meBtn'], t:tal ? 'Ta fiche Talent, toujours en vue' : 'Ta fiche projet, toujours en vue',
      p:['Ton rôle actif ('+(tal ? '🛠️ Talent' : '💡 Visionnaire')+'), le statut <b>En ligne</b> ou <b>Hors ligne</b> et le niveau de complétion de ta fiche.',
         'Sous 70 %, ta fiche apparaît en bas des résultats. Clique ici pour la compléter.']},
    {sel:navSel('accueil'), t:'Accueil', p:['Ton tableau de bord : tes vrais chiffres, les '+(tal ? 'projets' : 'talents')+' les plus compatibles avec toi et l\'activité récente.']},
    {sel:navSel('explorer'), t:tal ? 'Explorer les projets' : 'Explorer les talents',
      p:tal ? ['Tous les projets, classés par compatibilité avec ta fiche. Filtre par secteur, compétence ou rémunération.',
               '<b>Voir</b> ouvre la fiche complète, ♡ pour aimer, ☆ pour garder en favori. <b>Inviter</b> un projet est gratuit pour toi.']
            : ['Les talents classés par compatibilité avec <b>'+esc(projName(S.me.project))+'</b>. Leur nom et leur photo restent masqués jusqu\'au match.',
               '<b>Inviter</b> coûte 1 crédit : il t\'en reste <b>'+S.me.credits+'</b> sur '+S.me.creditsMax+' ce mois.']},
    {sel:navSel('connexions'), t:'Connexions',
      p:['Tes invitations envoyées et reçues. Sans réponse, une invitation expire au bout de <b>10 jours</b>'+(tal ? '.' : ' et ton crédit t\'est rendu.'),
         'Quand une invitation est acceptée, c\'est un <b>match</b> : il se range dans l\'onglet Matchs.']},
    {sel:navSel('messages'), t:'Messages',
      p:['La messagerie s\'ouvre avec ton premier match : d\'abord en privé, puis en groupe dès que l\'équipe compte 3 membres.',
         'Les messages ne sont jamais supprimés : ils servent de preuve en cas de litige. Tu peux seulement les archiver.']},
    {sel:navSel('atelier'), t:'L\'Atelier',
      p:['L\'espace de travail de l\'équipe, ouvert au premier match : jalons, plan d\'action, capital, rôles et pacte d\'associés.',
         '<b>Takam</b>, l\'assistant de l\'Atelier, veille sur l\'équipe, relance et encourage.']},
    {sel:['#side [data-nav="fiche"]', '#meBtn'], t:tal ? 'Ma fiche Talent' : 'Mes fiches',
      p:[tal ? 'Modifie ta fiche, mets-la en ligne ou hors ligne, consulte ses statistiques et partage ton lien ou ton code QR.'
             : 'Ta fiche projet et ta fiche perso. Mets-les à jour, passe-les en ligne ou hors ligne, consulte leurs statistiques et partage ton lien ou ton code QR.',
         'Pour obtenir le badge '+vBadge(tal ? 'tal' : 'vis', true)+', envoie ta pièce d\'identité depuis cet écran : l\'équipe TakaMatch vérifie ton dossier.']},
    {sel:['#projBtn'], opt:true, t:'Ton projet actif',
      p:['Tout est calculé pour le projet choisi ici : scores, invitations, Atelier. Tu peux porter jusqu\'à 3 projets.']},
    {sel:['.top-search'], opt:true, t:'Recherche rapide', p:['Cherche un projet, un talent ou une page, et va directement où tu veux. Raccourci : <span class="mono">Ctrl + K</span>.']},
    {sel:['#bellBtn'], t:'Notifications', p:['Invitations, matchs, messages, alertes de Takam et réponses de l\'équipe TakaMatch arrivent ici.']},
    {sel:['#meBtn'], t:'Ton menu', p:['Paramètres, profil public, aide et déconnexion.',
       open ? 'Tu as les deux profils : <b>Passer en '+other+'</b> bascule de l\'un à l\'autre.'
            : '<b>Deviens aussi '+other+'</b> pour '+(tal ? 'porter tes propres projets' : 'proposer aussi tes compétences à d\'autres projets')+' : '+priceH('second')+' une seule fois. Ton profil '+roleLabel(tal ? 'tal' : 'vis')+' reste intact.']},
    {sel:['#side [data-nav="support"]', '#meBtn'], t:'Aide et support',
      p:['Une vraie personne te répond, à Cotonou. C\'est aussi ici que tu peux revoir cette visite.']},
    {center:true, ill:'🚀', kicker:'C\'est parti', t:'À toi de jouer !',
      p:[tal ? 'Prochaine étape : repère un projet qui te parle et invite-le. C\'est gratuit pour toi.'
             : 'Prochaine étape : repère un talent qui complète ton équipe et invite-le avec un message précis.'],
      cta:{l:tal ? 'Explorer les projets' : 'Explorer les talents', run:() => go('explorer')}, end:'Terminer'},
  ];
  tourOpen('welcome', steps);
}
function startMatchTour(id){
  if(S.layer) closeLayer();
  const tal = isTalMode(), x = itemById(id), partner = partnerOf(x) || 'Ton partenaire';
  const t = tal ? S.teams[id] : S.teams[S.me.project.id], title = t ? t.title : (tal ? x.title : projName(S.me.project));
  const steps = [
    {center:true, ill:'🎉', kicker:'Nouveau match', t:'C\'est un match ! De nouveaux espaces s\'ouvrent',
      p:['<b>'+esc(partner)+'</b> et toi pouvez maintenant vous voir et travailler ensemble. Voici ce qui vient de s\'activer pour vous.'],
      start:'Me montrer'},
    {sel:navSel('connexions'), t:'Ton match, dans Connexions',
      p:['Il est rangé dans l\'onglet <b>Matchs</b>. Les noms, photos et coordonnées sont maintenant visibles des deux côtés.',
         tal ? 'Tu es engagé'+g(S.me.sex,'','e','·e')+' sur <b class="mono">'+engagedN()+'/3</b> projets : un talent rejoint 3 projets au plus en même temps.'
             : 'Chaque match de <b>'+esc(projName(S.me.project))+'</b> rejoint automatiquement l\'équipe du projet.']},
    {sel:navSel('messages'), t:'Messages : la discussion est ouverte',
      p:['Ta conversation privée avec <b>'+esc(partner)+'</b> t\'attend, avec un premier message.',
         'Dès que l\'équipe compte 3 membres, un <b>groupe d\'équipe</b> apparaît aussi ici. On peut archiver une discussion, jamais la supprimer.']},
    {sel:navSel('atelier'), t:'L\'Atelier de '+esc(title),
      p:[tal ? 'Le porteur administre l\'Atelier : jalons, capital, rôles, plan d\'action. Toi, tu <b>valides</b> chacune de ses propositions ou tu ouvres la discussion.'
             : 'Tu administres l\'Atelier : tu coches les jalons, proposes le capital, attribues les rôles et fixes le plan d\'action. Chaque décision part en <b>validation</b> auprès des talents.']},
    {before:() => go('atelier'), sel:['.ms-list', '.rung', '#main .page-h'], opt:true, t:'Six jalons pour une vraie équipe',
      p:['Commencez par le premier : <b>une visio de 45 minutes</b>, avant tout engagement. Chaque jalon franchi est daté dans le journal.']},
    {sel:['.panel.takam'], opt:true, t:'Takam veille sur vous',
      p:['L\'assistant de l\'Atelier signale ce qui stagne (jalon, tâche en retard, validation en attente) et encourage l\'équipe. Pose-lui une question en bas du panneau.']},
    {center:true, ill:'🤝', kicker:'À vous', t:'Bonne route à '+esc(title)+' !',
      p:['Le plus important maintenant : un premier échange, franc et rapide.'],
      cta:{l:'Voir l\'Atelier', run:() => go('atelier')}, end:'Ouvrir la discussion',
    },
  ];
  tourOpen('match', steps, finished => { if(finished && TOUR.ctaUsed !== true){ try{ openThread(id); }catch(e){ go('messages'); } } });
}
let tourQueued = false;
/* Lance une visite dès que plus aucune fenêtre n'est ouverte. */
function tourWhenFree(fn){
  tourQueued = true;
  const tick = () => {
    if(TOUR.on || S.layer || $('#layer .ov')){ setTimeout(tick, 500); return; }
    tourQueued = false; fn();
  };
  setTimeout(tick, 700);
}
function tourWelcomeMaybe(){
  if((S.me.tours || {}).welcome) return;
  tourWhenFree(() => startWelcomeTour());
}
/* Après un match : une fois par profil. */
const _createMatch = createMatch;
createMatch = function(id, celebrate){
  const had = S.matches.some(m => m.id === id);
  _createMatch(id, celebrate);
  if(!had && !(S.me.tours || {})['match-'+S.me.role]) tourWhenFree(() => startMatchTour(id));
};

/* « Revoir la visite guidée » dans Aide et support. */
const _supportRail = supportRail;
supportRail = function(){
  return _supportRail() + '<section class="card card-pad gb"><div class="tour-again">'+ic('compass')
    + '<div style="flex:1"><div class="lbl" style="margin-bottom:2px">Visite guidée</div><p class="hint" style="margin:0">Revoir les espaces de l\'outil en une minute.</p></div></div>'
    + '<button class="btn btn-ghost btn-sm btn-block" style="margin-top:12px" data-act="tour-again">Revoir la visite</button></section>';
};

/* ============================================================
   Lien avec l'espace d'administration
   ============================================================ */
const TM_BC = (() => { try{ return new BroadcastChannel('takamatch-staff'); }catch(e){ return null; } })();
const TM_SEEN = new Set();
function tmBus(type, data){
  const m = {id:uid()+Date.now().toString(36), type, data, at:Date.now(), from:'app'};
  TM_SEEN.add(m.id);
  try{ if(TM_BC) TM_BC.postMessage(m); }catch(e){}
  try{ const q = JSON.parse(localStorage.getItem('tm-bus') || '[]'); q.push(m); localStorage.setItem('tm-bus', JSON.stringify(q.slice(-150))); }catch(e){}
}
function tmUserCard(){
  const m = S.me;
  return {email:m.email, handle:m.handle, first:m.first, last:m.last, city:m.city, sex:m.sex, phone:m.phone,
    role:m.primary || 'tal', roles:[m.primary || 'tal'].concat(m.visUnlocked ? [m.primary === 'vis' ? 'tal' : 'vis'] : []),
    project:(m.projects || []).map(p => p.title).filter(Boolean).join(', '), verifiedId:!!m.verifiedId, fresh:!!m.fresh};
}
function shrinkImage(file){
  return new Promise(res => {
    if(!file) return res('');
    const rd = new FileReader();
    rd.onload = () => { const img = new Image(); img.onload = () => {
      const k = Math.min(1, 520 / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      try{ res(c.toDataURL('image/jpeg', .72)); }catch(e){ res(''); } }; img.onerror = () => res(''); img.src = rd.result; };
    rd.onerror = () => res(''); rd.readAsDataURL(file);
  });
}
/* Demande de vérification : le dossier part à l'équipe, le badge attend sa décision. */
document.addEventListener('click', async e => {
  const t = e.target.closest('[data-act="verify-id-go"]'); if(!t) return;
  e.preventDefault(); e.stopImmediatePropagation();
  const fi = $('#idF'), fs = $('#idS');
  const doc = await shrinkImage(fi && fi.files[0]), selfie = await shrinkImage(fs && fs.files[0]);
  S.me.verifyPending = true;
  if(window.TMData && TMData.on) TMData.verify(fi && fi.files[0], fs && fs.files[0]);
  tmBus('verify-request', {user:tmUserCard(), doc, selfie});
  closeLayer(); render();
  success('Dossier envoyé', 'L\'équipe TakaMatch vérifie que ta pièce d\'identité et ton selfie correspondent à ton nom légal. Réponse sous <b>48 h</b> ; le badge '+vBadge(isTalMode() ? 'tal' : 'vis', true)+' s\'affiche dès la validation.');
  pushNotif('verif', 'Vérification en cours', 'Ton dossier est entre les mains de l\'équipe TakaMatch.');
}, true);
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act="report-go"]'); if(!t) return;
  const id = t.dataset.id, x = itemById(id) || {};
  const reason = ($('#layer .opt[data-act="rep-reason"][aria-pressed="true"]') || {}).textContent || 'Autre raison';
  tmBus('report', {by:tmUserCard(), target:{id, handle:handleOf(x), name:x.title || x.name || '', kind:isTalMode() ? 'projet' : 'profil'},
    reason:reason.trim(), text:(($('#repTxt') || {}).value || '').trim(), thread:!!S.threads.find(z => z.id === id)});
}, true);
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form="support"]'); if(!f) return;
  const v = (($('#supportMsg') || {}).value || '').trim(); if(!v) return;
  tmBus('support', {by:tmUserCard(), topic:(($('#supTopic') || {}).value || ''), text:v});
}, true);
function tmHandleStaff(m){
  if(!m || TM_SEEN.has(m.id) || m.from !== 'staff') return;
  TM_SEEN.add(m.id);
  const d = m.data || {}, me = S.me;
  const mine = (d.email && me.email && d.email.toLowerCase() === me.email.toLowerCase()) || (d.handle && d.handle === me.handle);
  if(!mine || !S.booted) return;
  if(m.type === 'verify-decision'){
    me.verifyPending = false;
    if(d.ok){ me.verifiedId = true; confetti(); toast('Ton profil est vérifié. Badge obtenu.', 'ok');
      pushNotif('verif', 'Profil vérifié', 'L\'équipe TakaMatch a validé ton identité. Le badge est actif.'); }
    else if(d.more){ toast('L\'équipe TakaMatch a besoin d\'un complément pour ta vérification.', 'bad');
      pushNotif('verif', 'Complément demandé', d.motif || 'Renvoie une photo plus nette de ta pièce d\'identité.'); }
    else { toast('Ta vérification n\'a pas abouti. Motif : '+(d.motif || 'non précisé')+'.', 'bad');
      pushNotif('verif', 'Vérification refusée', d.motif || 'Tu peux renvoyer un dossier.'); }
    render();
  }
  if(m.type === 'support-reply'){ toast('Nouvelle réponse de l\'équipe TakaMatch.', 'ok'); pushNotif('help', 'Réponse du support', d.text || ''); }
  if(m.type === 'account-status' && d.status === 'suspended'){ pushNotif('alert', 'Compte suspendu', d.motif || 'Contacte le support.'); toast('Ton compte a été suspendu par l\'équipe TakaMatch.', 'bad'); }
  if(m.type === 'warning'){ pushNotif('alert', 'Avertissement de l\'équipe TakaMatch', d.text || ''); toast('Tu as reçu un avertissement de l\'équipe TakaMatch.', 'bad'); }
}
if(TM_BC) TM_BC.onmessage = e => tmHandleStaff(e.data);
addEventListener('storage', e => {
  if(e.key !== 'tm-bus' || !e.newValue) return;
  try{ JSON.parse(e.newValue).forEach(tmHandleStaff); }catch(err){}
});

/* Démarrage hors coquille : la visite s'ouvre au premier chargement. */
if(!window.TM_SHELL) document.addEventListener('DOMContentLoaded', () => setTimeout(tourWelcomeMaybe, 600));
