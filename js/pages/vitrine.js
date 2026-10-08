"use strict";
/* Moyens de paiement affichés selon le pays du visiteur (fuseau horaire,
   puis langue du navigateur). Même tableau que l'outil et le serveur. */
const SITE_PAY = {
  BJ:[['MTN MoMo','mtn'],['Moov Money','moov'],['Celtiis Cash','celtiis']], TG:[['Mixx by Yas','mixx'],['Moov Money','moov']],
  CI:[['Wave','wave'],['Orange Money','orange'],['MTN MoMo','mtn'],['Moov Money','moov']], SN:[['Wave','wave'],['Orange Money','orange'],['Free Money','free']],
  BF:[['Orange Money','orange'],['Moov Money','moov']], ML:[['Orange Money','orange']], NE:[['Airtel Money','airtel']],
};
const SITE_TZ = {'Africa/Porto-Novo':'BJ','Africa/Lome':'TG','Africa/Abidjan':'CI','Africa/Dakar':'SN','Africa/Ouagadougou':'BF','Africa/Bamako':'ML','Africa/Niamey':'NE',
  'Africa/Accra':'GH','Africa/Lagos':'NG','Africa/Douala':'CM','Europe/Paris':'FR'};
const SITE_CC = (() => {
  try{ const z = SITE_TZ[Intl.DateTimeFormat().resolvedOptions().timeZone]; if(z) return z; }catch(e){}
  const r = ((navigator.language || '').split('-')[1] || '').toUpperCase();
  return r || 'BJ';
})();
/* Pays hors zone mobile money FedaPay : on montre les moyens du Bénin + carte. */
function sitePayOps(){ return SITE_PAY[SITE_CC] || (['GH','NG','CM','FR'].includes(SITE_CC) ? [] : SITE_PAY.BJ); }
function sitePayList(card){
  const l = sitePayOps().map(x => x[0]).concat(card);
  return l.length > 1 ? l.slice(0, -1).join(', ')+' ou '+l[l.length - 1] : l[0];
}
function sitePayBadges(){
  return '<div class="momo" style="margin-top:auto">via '+sitePayOps().map(x => '<b class="'+x[1]+'">'+x[0]+'</b>').join('')+'<b class="card">Carte</b></div>';
}
/* ============================================================
   TakaMatch — page vitrine
   Page autonome : aucune dépendance externe hors les polices
   Google. Le seul point d'accroche à brancher est signup(), en
   bas de fichier : tous les appels à l'action y aboutissent.
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

const handleOf = x => '@' + (x.handle || x.ownerHandle || 'anonyme');
function tick(){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 12.5 5 5 10-11"/></svg>'; }

/* ---------- Teinte de sujet : bleu pour un talent, or pour un projet ---------- */
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

const PROJECTS = [
  {id:'TM-VIS-4102', ownerHandle:'carnet_de_nuit', title:'Kèkè Santé', owner:'Dr. Sylvain Agbodjan', ownerCity:'Cotonou, Bénin', ownerVerified:true, sectors:['health','impact'], glyph:'🩺', hue:196, seeking:['dev-mobile','produit','data'], pace:'serieux', pay:'equity', likes:47, seen:1,
    hook:"Au Bénin, un patient sur trois quitte une consultation sans ordonnance lisible et sans dossier. Kèkè Santé donne à chaque centre de santé un carnet patient numérique qui fonctionne sans connexion et se synchronise la nuit.",
    vision:"Devenir le dossier médical partagé de l'Afrique de l'Ouest francophone, porté par les centres de santé eux-mêmes plutôt que par les ministères.",
    traction:"4 centres pilotes à Cotonou et Abomey-Calavi. 1 840 dossiers créés en 5 mois. Une infirmière-chef formée par centre. Taux de ré-usage à 30 jours : 71 %.",
    assets:"Agrément de recherche du ministère de la Santé. 6 M FCFA de subvention de la Fondation Orange. Un serveur mutualisé offert par une PME locale pour 18 mois.",
    challenges:"Je suis médecin, pas développeur. L'application actuelle est un prototype Glide qui atteint ses limites. Il me faut quelqu'un qui prenne la technique en main et devienne cofondateur, pas prestataire.",
    link:'kekesante.bj'},
  {id:'TM-VIS-7715', ownerHandle:'tracer_ananas', title:'Gbèdji Agro', owner:'Rachelle Sohou', ownerCity:'Allada, Bénin', ownerVerified:true, sectors:['agritech','ecommerce'], glyph:'🍍', hue:45, seeking:['dev-back','terrain','growth'], pace:'plein', pay:'mixte', likes:31, seen:2,
    hook:"L'ananas pain de sucre béninois se vend 4 fois moins cher que le costaricien alors qu'il est meilleur, parce qu'aucun acheteur européen ne peut prouver d'où il vient. Gbèdji trace chaque lot du champ au conteneur.",
    vision:"Faire de la traçabilité un actif exportable : chaque coopérative béninoise capable de vendre en direct à un importateur, sans intermédiaire qui capte 60 % de la marge.",
    traction:"3 coopératives équipées, 112 producteurs enregistrés, 9 tonnes tracées sur la campagne 2025. Un acheteur néerlandais a signé une lettre d'intention pour 40 tonnes.",
    assets:"Partenariat signé avec l'ATDA Pôle 7. Matériel de terrain (28 téléphones) financé. Un entrepôt à Allada mis à disposition.",
    challenges:"Le back-end actuel est une feuille Google Sheets avec des scripts. Il tombe dès qu'on dépasse 200 lots. Je cherche un cofondateur technique et quelqu'un qui sache tenir la relation avec les coopératives.",
    link:'gbedji.africa'},
  {id:'TM-VIS-2288', ownerHandle:'six_secondes', title:'Tchèko Pay', owner:'Ousmane Barry', ownerCity:'Cotonou, Bénin', ownerVerified:true, sectors:['fintech','impact'], glyph:'💳', hue:212, seeking:['dev-back','juridique','vente'], pace:'plein', pay:'salaire', likes:64, seen:1,
    hook:"70 % des commerces de Dantokpa refusent le mobile money parce que l'USSD prend 45 secondes et bloque la file. Tchèko Pay encaisse en 6 secondes avec un QR imprimé et un SMS de confirmation, sans smartphone côté client.",
    vision:"Devenir la caisse par défaut du commerce informel ouest-africain : un marchand, un QR, zéro matériel, zéro abonnement.",
    traction:"210 marchands actifs à Dantokpa et Godomey. 18 M FCFA de volume transigé en novembre. Rétention marchand à 60 jours : 78 %.",
    assets:"Convention d'agrégation signée avec MTN MoMo. Dossier d'agrément EME déposé à la BCEAO. 12 M FCFA levés en amorçage auprès de business angels béninois.",
    challenges:"Mon associé technique est parti en septembre. J'ai besoin d'un cofondateur back-end qui ne panique pas devant un audit BCEAO, et d'un juriste pour finir l'agrément.",
    link:'tchekopay.com'},
  {id:'TM-VIS-9034', ownerHandle:'huit_minutes', title:'Lafia Learn', owner:'Prudence Gbaguidi', ownerCity:'Parakou, Bénin', ownerVerified:false, sectors:['edtech','impact'], glyph:'📻', hue:28, seeking:['contenu','dev-mobile','produit'], pace:'serieux', pay:'mixte', likes:22, seen:3,
    hook:"Dans le Nord-Bénin, un élève de terminale a en moyenne 2 heures d'électricité par jour mais 4 heures de batterie de téléphone. Lafia Learn délivre tout le programme du BAC en audio de 8 minutes, téléchargeable en une fois.",
    vision:"Que réviser ne dépende plus ni du courant, ni de la data, ni d'avoir un professeur à moins de 30 km.",
    traction:"340 élèves testeurs à Parakou et Djougou. 61 % ont écouté plus de 10 épisodes. Taux de réussite du groupe test au BAC blanc : 54 % contre 38 % pour le groupe témoin.",
    assets:"Studio prêté par la radio Deeman FM. 9 professeurs volontaires du lycée Mathieu Bouké. Catalogue de 40 épisodes déjà enregistrés en français et en dendi.",
    challenges:"Je suis enseignante. Je sais produire du contenu, pas une application. Et je ne sais pas comment passer de 340 à 30 000 élèves sans budget marketing.",
    link:''},
  {id:'TM-VIS-6641', ownerHandle:'km_a_vide', title:'Zemidjan+', owner:'Kossi Adjovi', ownerCity:'Cotonou, Bénin', ownerVerified:true, sectors:['logistique','impact'], glyph:'🛵', hue:130, seeking:['data','dev-mobile','terrain'], pace:'serieux', pay:'equity', likes:38, seen:1,
    hook:"Un zémidjan de Cotonou roule 90 km par jour et fait 40 % de ces kilomètres à vide. Zemidjan+ regroupe les courses et les livraisons sur un même trajet, avec une répartition calculée hors-ligne sur le téléphone du conducteur.",
    vision:"Transformer 200 000 motos-taxis en réseau logistique urbain, sans les transformer en employés précaires d'une plateforme.",
    traction:"Coopérative de 64 conducteurs à Akpakpa. 1 100 courses groupées testées. Revenu moyen par conducteur : +23 % sur 6 semaines.",
    assets:"Accord avec l'Union des conducteurs de taxi-moto d'Akpakpa. Un algorithme de regroupement déjà prototypé en Python.",
    challenges:"Le prototype tourne sur mon ordinateur, pas sur les téléphones. Il me faut quelqu'un qui sache embarquer un modèle sur des Android à 25 000 FCFA, et quelqu'un pour tenir le terrain quand je ne peux pas.",
    link:'zemidjan.plus'},
  {id:'TM-VIS-3390', ownerHandle:'panier_direct', title:'Adjara Market', owner:'Estelle Quenum', ownerCity:'Porto-Novo, Bénin', ownerVerified:true, sectors:['artisanat','ecommerce'], glyph:'🧺', hue:340, seeking:['growth','dev-front','contenu'], pace:'side', pay:'mixte', likes:19, seen:4,
    hook:"Une vannière d'Adjara vend un panier 1 500 FCFA au marché. Le même panier part à 34 € dans une boutique parisienne. Adjara Market met les artisans en vente directe auprès de la diaspora, avec paiement en euros et expédition groupée.",
    vision:"Que l'artisanat béninois se vende à son prix, à l'artisan qui l'a fait, sans passer par trois revendeurs.",
    traction:"47 artisans référencés, 310 commandes livrées vers la France et la Belgique en 2025. Panier moyen 68 €. Marge reversée à l'artisan : 61 %.",
    assets:"Accord logistique avec un transitaire à Cotonou. Base de 2 400 clients diaspora. Photos professionnelles de 180 produits déjà réalisées.",
    challenges:"L'acquisition stagne : je vends surtout à des gens qui me connaissent. Je n'ai jamais fait de publicité et le site est un template Shopify qui charge en 9 secondes depuis l'Europe.",
    link:'adjara.market'},
  {id:'TM-VIS-8807', ownerHandle:'sans_lampant', title:'Solar Box', owner:'Wilfried Hounsou', ownerCity:'Djougou, Bénin', ownerVerified:false, sectors:['greentech','impact','fintech'], glyph:'☀️', hue:50, seeking:['finance','terrain','dev-back'], pace:'plein', pay:'equity', likes:29, seen:2,
    hook:"Un ménage rural béninois dépense 4 500 FCFA par mois en pétrole lampant et en recharge de téléphone. Un kit solaire coûte 85 000 FCFA — inaccessible d'un coup, évident à 3 500 FCFA par mois. Solar Box fait le pont par paiement échelonné verrouillé à distance.",
    vision:"Électrifier 100 000 foyers du Nord-Bénin par le crédit d'usage plutôt que par la subvention.",
    traction:"146 kits installés dans l'Atacora. Taux de remboursement à 6 mois : 91 %. Trois techniciens formés sur place.",
    assets:"Stock de 200 kits négocié auprès d'un fabricant kenyan. Agrément d'IMF partenaire pour porter le crédit. Atelier à Djougou.",
    challenges:"Le verrouillage à distance est fait à la main, par SMS, un par un. Et je n'ai aucune idée de comment structurer un véhicule de financement pour acheter 2 000 kits d'avance.",
    link:''},
  {id:'TM-VIS-1156', ownerHandle:'parcelle_onze', title:'Doko Data', owner:'Armand Gnonlonfoun', ownerCity:'Cotonou, Bénin', ownerVerified:true, sectors:['agritech','saas'], glyph:'🛰️', hue:175, seeking:['data','vente','produit'], pace:'serieux', pay:'equity', likes:26, seen:5,
    hook:"Les assureurs agricoles ouest-africains refusent d'assurer les petits producteurs parce qu'ils ne savent pas mesurer une perte de récolte à distance. Doko Data transforme l'imagerie Sentinel-2 en indice de rendement parcelle par parcelle.",
    vision:"Devenir la source de vérité qui rend l'assurance indicielle viable sur des parcelles de moins d'un hectare.",
    traction:"Modèle validé sur 3 200 parcelles de maïs au Bénin et au Togo, erreur moyenne 11 %. Un assureur régional en phase de test payant.",
    assets:"Accès académique aux archives Copernicus. Jeu de données terrain de 5 ans acheté à l'INRAB. Une lettre d'intention d'un réassureur.",
    challenges:"Je sais faire le modèle, pas le vendre. Je n'ai jamais négocié avec une compagnie d'assurance et je ne sais pas à quoi doit ressembler le produit qu'ils achètent vraiment.",
    link:'dokodata.io'},
  {id:'TM-VIS-5528', ownerHandle:'sept_minutes', title:'Vodun Studio', owner:'Marielle Ahouansou', ownerCity:'Ouidah, Bénin', ownerVerified:true, sectors:['medias','artisanat'], glyph:'🎬', hue:288, seeking:['contenu','brand','finance'], pace:'side', pay:'mixte', likes:41, seen:2,
    hook:"Les enfants béninois grandissent avec des dessins animés japonais et américains. Vodun Studio adapte les contes du panthéon vodun en séries animées de 7 minutes, en français et en fon.",
    vision:"Un studio d'animation béninois dont les personnages sont connus de Lagos à Abidjan, et dont les licences se vendent à l'étranger plutôt que l'inverse.",
    traction:"Pilote de 7 minutes sorti en mars : 340 000 vues cumulées YouTube et TikTok. Sélectionné au FESPACO section animation.",
    assets:"Équipe de 4 animateurs formés à l'ISMA. Bible graphique de 11 personnages. Préachat d'une chaîne panafricaine pour 6 épisodes.",
    challenges:"Nous sommes des artistes. Personne dans l'équipe ne sait monter un plan de financement de série, ni négocier une licence. Et notre marque n'existe que dans nos têtes.",
    link:'vodun.studio'},
  {id:'TM-VIS-7043', ownerHandle:'vendue_deux_fois', title:'Kaba Foncier', owner:'Isidore Dansou', ownerCity:'Abomey-Calavi, Bénin', ownerVerified:false, sectors:['immobilier','impact'], glyph:'📜', hue:15, seeking:['juridique','dev-front','terrain'], pace:'serieux', pay:'mixte', likes:17, seen:7,
    hook:"À Abomey-Calavi, une parcelle sur cinq est vendue deux fois. Kaba Foncier croise le registre ANDF, les actes de vente et un relevé GPS pour dire en 48 h si un terrain est litigieux avant que l'argent ne change de main.",
    vision:"Rendre la vérification foncière aussi banale qu'un contrôle technique de véhicule.",
    traction:"230 vérifications réalisées, 38 litiges détectés avant signature. 4 notaires prescripteurs. Revenu : 25 000 FCFA par dossier.",
    assets:"Accès conventionné à la base ANDF. Deux géomètres partenaires. Un dossier type validé par un notaire de Cotonou.",
    challenges:"Tout est manuel, je ne traite que 12 dossiers par semaine. Et le montage juridique de la responsabilité — si je me trompe, qui paie ? — n'est pas réglé.",
    link:''},
];

/* ---------- État ---------- */

/* ---------- Thème clair / sombre ---------- */
function themeIsDark(){
  const t = document.documentElement.getAttribute('data-theme');
  if(t) return t === 'dark';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function toggleTheme(){
  const next = themeIsDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try{ localStorage.setItem('tm-theme', next); }catch(e){}
  const st = $('#siteTheme');
  if(st) st.innerHTML = ic(next === 'dark' ? 'sun' : 'moon');
}
(function initTheme(){
  try{ const t = localStorage.getItem('tm-theme'); if(t) document.documentElement.setAttribute('data-theme', t); }catch(e){}
})();

function toast(msg, kind){
  const el = document.createElement('div');
  el.className = 'toast ' + (kind || '');
  el.innerHTML = (kind === 'ok' ? ic('check') : ic('info')) + '<span>' + esc(msg) + '</span>';
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 3200);
}

/* ============================================================
   PAGE VITRINE
   C'est la racine du produit. L'onboarding est un calque posé
   dessus, refermable à tout moment — on ne piège jamais le
   visiteur dans un tunnel dont il ne peut pas sortir.
   ============================================================ */
function renderSite(){
  const el = $('#site');
  el.hidden = false;
  el.innerHTML = siteHeader() + siteHero() + siteMarquee() + siteConviction() + siteHow() + siteRoles() + siteScore()
    + siteAtelier() + siteTrust() + siteCompare() + siteProjects() + sitePricing() + siteFaq() + siteCta() + siteFooter();
  el.scrollTop = 0;
  el.onscroll = () => {
    const hd = $('.site-hd');
    if(hd) hd.classList.toggle('stuck', el.scrollTop > 8);
  };
  wireSite();
}

/* Logos officiels, embarqués en data URI (<img>) pour isoler leurs styles internes. */
const LOGO_P = 'assets/images/logo-principal.svg';
const LOGO_S = 'assets/images/logo-secondaire.svg';

function siteHeader(){
  return '<header class="site-hd"><div class="site-in"><div class="bar">'
    + '<a class="brand" href="#" data-act="top" aria-label="TakaMatch, haut de page"><img class="brand-logo" src="'+LOGO_P+'" alt="TakaMatch"></a>'
    + '<nav class="site-nav hide-m" aria-label="Navigation principale">'
    +   '<a href="#conviction" data-act="anchor" data-to="conviction">Notre conviction</a>'
    +   '<a href="#comment" data-act="anchor" data-to="comment">Comment ça marche</a>'
    +   '<a href="#profils" data-act="anchor" data-to="profils">Les deux profils</a>'
    +   '<a href="#atelier" data-act="anchor" data-to="atelier">L\'Atelier</a>'
    + '</nav>'
    + '<div class="end">'
    +   '<button class="btn btn-ghost hd-cta" data-act="open-onb" data-mode="login">Se connecter</button>'
    +   '<button class="btn btn-go hd-cta" data-act="open-onb">Commencer</button>'
    +   '<button class="iconbtn" data-act="theme" id="siteTheme" aria-label="Changer de thème">'+ic(themeIsDark()?'sun':'moon')+'</button>'
    +   '<button class="burger" data-act="menu" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="ov"><span></span><span></span></button>'
    + '</div>'
    + '</div></div></header>';
}

function siteScore(){
  const rows = [['Compétences recherchées','2 sur 3 : Dev mobile, Product management',36,54],
                ["Secteur d'intérêt",'HealthTech, en partie',10,19],
                ['Rythme de travail','18 h/sem des deux côtés',18,18],
                ['Proximité','même ville',9,9]];
  return '<section class="sec"><div class="site-in">'
    + '<div class="cols cols-main" style="gap:34px;align-items:center">'
    + '<div>'
    +   '<h2 style="font-size:clamp(25px,3.4vw,36px);line-height:1.12;letter-spacing:-.035em;margin:14px 0 12px">Un score qui s\'explique, ligne par ligne</h2>'
    +   '<p style="font-size:16px;line-height:1.65;color:var(--ink-2);margin-bottom:16px">Un classement opaque ne crée pas de confiance. Le nôtre se décompose toujours en quatre critères visibles, dont un que personne d\'autre ne mesure&nbsp;: <b>le rythme de travail</b>.</p>'
    +   '<p style="font-size:15px;line-height:1.65;color:var(--ink-2)">C\'est le décalage d\'engagement, pas le manque de compétence, qui fait échouer la plupart des cofondations. Autant le mesurer avant.</p>'
    +   '<p style="font-size:15px;line-height:1.65;color:var(--ink-2);margin-top:12px">Ce que le projet propose aux talents (parts, rémunération) ne pèse pas dans le score&nbsp;: c\'est écrit noir sur blanc sur la fiche, et un filtre <b>«&nbsp;Avec rémunération&nbsp;»</b> te montre les projets qui en prévoient une.</p></div>'
    + '<div class="panel" style="padding:26px">'
    +   '<div class="row" style="align-items:baseline;gap:7px;margin-bottom:16px">'
    +     '<span style="font-family:var(--disp);font-size:42px;font-weight:700;letter-spacing:-.045em;color:var(--ok-ink)" class="tnum">73</span>'
    +     '<span style="font-size:15px;color:var(--ink-3);font-weight:600">/ 100 de compatibilité</span></div>'
    +   '<div class="score-why">'+rows.map(r=>
        '<div class="w'+(r[2]>0?' hit':'')+'"><b>'+esc(r[0])+'<br><span style="font-weight:500;color:var(--ink-3);font-size:11.5px">'+esc(r[1])+'</span></b>'
        + '<span class="pts">'+r[2]+'/'+r[3]+'</span></div>').join('')+'</div>'
    + '</div></div></div></section>';
}

function siteAtelier(){
  return '<section class="sec" id="atelier"><div class="site-in"><div class="panel">'
    + '<div class="sec-h" style="margin-bottom:26px">'
    +   '<h2>L\'Atelier : là où une rencontre devient une équipe</h2>'
    +   '<p>La plupart des plateformes s\'arrêtent à la messagerie. Les gens s\'échangent un numéro et disparaissent. Nous, on vous donne de quoi construire — et de quoi vous protéger.</p></div>'
    + '<div class="feat">'
    +   featI('🤝','Le porteur propose, l\'équipe valide',"Le visionnaire administre l'Atelier et propose le capital, le vesting, les rôles et les jalons. Chaque talent suit l'avancement et valide. Décidé tôt et à froid, ça se négocie bien mieux qu'après six mois.")
    +   featI('🎯','Objectifs et plan d\'action',"Des objectifs découpés en tâches, chacune avec un responsable et une échéance. Dont « travailler deux semaines ensemble sur un livrable réel », la période d'essai qui prédit le mieux la suite.")
    +   featI('📓','Le journal de décisions',"Chaque décision horodatée. C'est la preuve de contribution qui évite les litiges au moment où ça compte vraiment.")
    +   featI('📄','Le pacte d\'associés',"Un modèle de droit OHADA prérempli depuis vos décisions, relu par un juriste inscrit au barreau de Cotonou.")
    +   featI('💬','Une discussion d\'équipe',"Dès trois membres, un groupe de discussion s'ouvre dans Messages. Les échanges privés à deux restent à côté.")
    +   featI('🔔','Takam veille sur l\'équipe',"Ton assistant (sa mascotte arrive bientôt) repère les retards, les validations en attente et les silences. Il alerte toute l'équipe, ou toi seul quand ça te concerne.")
    + '</div>'
    + '<div class="row" style="gap:12px;align-items:flex-start;margin-top:26px;padding-top:20px;border-top:1px dashed var(--line-strong)">'
    +   ic('info')+'<p style="font-size:13.5px;line-height:1.6;color:var(--ink-2)">Si ça ne marche pas, le porteur peut retirer un talent, avec un motif obligatoire. Un talent peut, lui, «&nbsp;Quitter le projet&nbsp;» à tout moment. Dans les deux cas, les messages privés ne sont jamais supprimés&nbsp;: ils sont archivés en lecture seule et servent de preuve.</p></div>'
    + '</div></div></section>';
}
function featI(g,t,d){
  return '<div class="feat-i"><span class="glyph">'+g+'</span><h4>'+esc(t)+'</h4><p>'+esc(d)+'</p></div>';
}


/* ---------- Illustrations fictives des fiches projet ----------
   Scènes plates dessinées en SVG, dans la palette de marque. Ce sont
   des images : leurs couleurs ne suivent pas le thème. Le voile or
   posé par-dessus (.cover.art::after) garde le repère « visionnaire ». */
const ART = {
  'TM-VIS-4102': // Kèkè Santé — un centre de santé et son carnet numérique
    '<rect width="320" height="118" fill="#E3EEF7"/>'
    + '<circle cx="268" cy="28" r="15" fill="#FFD741"/>'
    + '<rect y="92" width="320" height="26" fill="#CFE0C9"/>'
    + '<rect x="38" y="44" width="124" height="52" rx="3" fill="#FAF9F5"/>'
    + '<rect x="32" y="36" width="136" height="12" rx="3" fill="#0A65AE"/>'
    + '<rect x="88" y="66" width="24" height="30" rx="2" fill="#8DB7DC"/>'
    + '<rect x="50" y="58" width="24" height="16" rx="2" fill="#BCD3E8"/><rect x="126" y="58" width="24" height="16" rx="2" fill="#BCD3E8"/>'
    + '<rect x="96" y="50" width="8" height="14" rx="1" fill="#B54A3F"/><rect x="93" y="53" width="14" height="8" rx="1" fill="#B54A3F"/>'
    + '<g transform="rotate(-8 232 70)"><rect x="200" y="36" width="62" height="70" rx="8" fill="#1F1E1B"/>'
    + '<rect x="205" y="42" width="52" height="58" rx="4" fill="#FAF9F5"/>'
    + '<circle cx="216" cy="54" r="6" fill="#8DB7DC"/><rect x="226" y="50" width="24" height="4" rx="2" fill="#5D5A52"/><rect x="226" y="57" width="16" height="3" rx="1.5" fill="#BCD3E8"/>'
    + '<rect x="211" y="68" width="40" height="3" rx="1.5" fill="#D2CCBC"/><rect x="211" y="75" width="34" height="3" rx="1.5" fill="#D2CCBC"/><rect x="211" y="82" width="38" height="3" rx="1.5" fill="#D2CCBC"/>'
    + '<rect x="211" y="89" width="18" height="6" rx="3" fill="#4B7F52"/></g>',
  'TM-VIS-7715': // Gbèdji Agro — rangées d'ananas et un lot tracé
    '<rect width="320" height="118" fill="#F7EDCB"/>'
    + '<circle cx="54" cy="30" r="17" fill="#FFD741"/>'
    + '<path d="M0 64 Q80 50 160 60 T320 56 V118 H0z" fill="#B98A4E"/>'
    + '<path d="M0 80 Q90 70 170 78 T320 74" stroke="#9C713A" stroke-width="3" fill="none"/>'
    + '<path d="M0 98 Q90 88 170 96 T320 92" stroke="#9C713A" stroke-width="3" fill="none"/>'
    + [[30,70],[80,66],[130,70],[180,68],[34,90],[86,86],[140,90],[192,88]].map(([x,y]) =>
        '<path d="M'+x+' '+(y-12)+' l-7 -9 l6 3 l1 -10 l3 10 l6 -4 l-4 10z" fill="#4B7F52"/>'
        + '<ellipse cx="'+(x+1)+'" cy="'+y+'" rx="7" ry="9" fill="#E3A21A"/>'
        + '<path d="M'+(x-5)+' '+(y-4)+' l12 8 M'+(x-5)+' '+(y+3)+' l12 -8" stroke="#B87C0C" stroke-width="1.2"/>').join('')
    + '<rect x="236" y="54" width="62" height="44" rx="3" fill="#0A65AE"/>'
    + '<path d="M236 64h62M236 76h62M236 88h62" stroke="#035587" stroke-width="2"/>'
    + '<rect x="248" y="60" width="26" height="26" rx="2" fill="#FAF9F5"/>'
    + '<path d="M252 64h6v6h-6zM264 64h6v6h-6zM252 76h6v6h-6zM264 76h2v2h-2zM268 80h2v2h-2z" fill="#1F1E1B"/>',
  'TM-VIS-2288': // Tchèko Pay — un étal de marché et son QR imprimé
    '<rect width="320" height="118" fill="#F4E9D2"/>'
    + '<path d="M22 22h206l-12 26H34z" fill="#FFD741"/>'
    + [0,1,2,3,4,5,6].map(i => i % 2 ? '' : '<path d="M'+(22+i*29.4)+' 22h29.4l-1.7 26h-26z" fill="#0A65AE"/>').join('')
    + '<path d="M34 48 q14 10 26 0 q14 10 26 0 q14 10 26 0 q14 10 26 0 q14 10 26 0 q14 10 26 0 q14 10 26 0" fill="#FFD741"/>'
    + '<rect x="30" y="50" width="4" height="50" fill="#8A6008"/><rect x="216" y="50" width="4" height="50" fill="#8A6008"/>'
    + '<rect x="24" y="80" width="202" height="22" rx="3" fill="#8A6008"/>'
    + '<ellipse cx="62" cy="78" rx="20" ry="7" fill="#C9941A"/><circle cx="54" cy="72" r="6" fill="#E4002B"/><circle cx="64" cy="70" r="6" fill="#F28C28"/><circle cx="72" cy="74" r="5" fill="#4B7F52"/>'
    + '<ellipse cx="116" cy="78" rx="20" ry="7" fill="#C9941A"/><circle cx="108" cy="72" r="6" fill="#FFD741"/><circle cx="118" cy="70" r="6" fill="#E3A21A"/><circle cx="126" cy="74" r="5" fill="#FFD741"/>'
    + '<rect x="160" y="56" width="40" height="46" rx="3" fill="#FAF9F5" stroke="#1F1E1B" stroke-width="2"/>'
    + '<path d="M166 62h9v9h-9zM185 62h9v9h-9zM166 81h9v9h-9zM180 78h3v3h-3zM186 84h3v3h-3zM190 78h4v4h-4zM180 88h4v4h-4z" fill="#1F1E1B"/>'
    + '<rect x="166" y="94" width="28" height="4" rx="2" fill="#0A65AE"/>'
    + '<g transform="rotate(10 272 64)"><rect x="252" y="30" width="40" height="70" rx="7" fill="#1F1E1B"/><rect x="256" y="36" width="32" height="56" rx="3" fill="#FAF9F5"/>'
    + '<circle cx="272" cy="58" r="10" fill="#4B7F52"/><path d="m267 58 3.5 3.5 6.5-7" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<rect x="262" y="74" width="20" height="3" rx="1.5" fill="#5D5A52"/><rect x="265" y="80" width="14" height="3" rx="1.5" fill="#D2CCBC"/></g>',
  'TM-VIS-9034': // Lafia Learn — un cours audio écouté le soir
    '<rect width="320" height="118" fill="#0B3A5E"/>'
    + '<circle cx="270" cy="30" r="13" fill="#FFE890"/><circle cx="276" cy="26" r="11" fill="#0B3A5E"/>'
    + [[40,20],[88,34],[150,18],[206,40],[236,14],[300,52],[20,52]].map(([x,y]) => '<circle cx="'+x+'" cy="'+y+'" r="1.6" fill="#F2E6BE"/>').join('')
    + '<rect y="96" width="320" height="22" fill="#083F69"/>'
    + '<rect x="40" y="74" width="70" height="10" rx="2" fill="#E3A21A"/><rect x="46" y="64" width="62" height="10" rx="2" fill="#3FA3EE"/><rect x="36" y="84" width="78" height="12" rx="2" fill="#FAF9F5"/>'
    + '<rect x="130" y="40" width="44" height="58" rx="7" fill="#1F1E1B"/><rect x="134" y="46" width="36" height="46" rx="3" fill="#FAF9F5"/>'
    + [4,10,16,8,20,12,6,14,9].map((h,i) => '<rect x="'+(138+i*3.6)+'" y="'+(69-h/2)+'" width="2" height="'+h+'" rx="1" fill="#007CD8"/>').join('')
    + '<circle cx="152" cy="86" r="3.5" fill="#FFD741"/>'
    + '<path d="M196 80a26 26 0 0 1 52 0" stroke="#FFD741" stroke-width="5" fill="none" stroke-linecap="round"/>'
    + '<rect x="190" y="74" width="12" height="20" rx="5" fill="#FFD741"/><rect x="242" y="74" width="12" height="20" rx="5" fill="#FFD741"/>'
    + '<path d="M262 60q8 10 0 20M270 54q13 16 0 32" stroke="#8DB7DC" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
};
function projArt(p){
  const body = ART[p.id];
  if(!body) return '';
  return '<svg class="art-svg" viewBox="0 0 320 118" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration du projet '+esc(p.title)+'">'+body+'</svg>';
}

/* Ce que le visionnaire propose aux talents, tel qu'il l'écrit sur sa fiche. */
const PAY_L = {equity:'Parts uniquement', mixte:'Parts + petite rémunération', salaire:'Rémunération prévue'};
/* ---------- Couvertures de projet : identiques à l'outil ----------
   La photo ajoutée par le porteur (voile or par-dessus), sinon le dégradé
   or et l'icône du premier secteur (DESIGN §9.4). */
const COVER = 'assets/images/couverture-projet.jpg';
const PHOTOS = {
  'TM-VIS-4102':{p:'50% 22%', z:'150% auto'},
  'TM-VIS-2288':{p:'50% 88%', z:'180% auto'},
  'TM-VIS-7715':{p:'15% 55%', z:'130% auto'},
  'TM-VIS-5528':{p:'85% 18%', z:'200% auto'},
  'TM-VIS-6641':{p:'50% 80%'},
};
function photoOf(x){ if(!x) return null; if(x.photo) return {src:x.photo, p:'50% 50%'}; const d = PHOTOS[x.id]; return d ? {src:COVER, p:d.p, z:d.z} : null; }
function photoStyle(ph, zoom){ return 'background-image:url('+ph.src+');background-position:'+ph.p+';'+(zoom && ph.z ? 'background-size:'+ph.z+'!important;' : ''); }
function projCover(x){ const ph = photoOf(x); return ph ? {cls:'photo', style:photoStyle(ph, true), ph} : {cls:tintCls('vis', x.hue), style:tintAng(x.hue), ph:null}; }

/* Badge de vérification (icône officielle) : couleur du rôle de la personne décrite. */
const VB_PATH = 'M16 8.375C16 8.93437 15.8656 9.45312 15.5969 9.92813C15.3281 10.4031 14.9688 10.775 14.5156 11.0344C14.5281 11.1188 14.5344 11.25 14.5344 11.4281C14.5344 12.275 14.25 12.9937 13.6875 13.5875C13.1219 14.1844 12.4406 14.4812 11.6438 14.4812C11.2875 14.4812 10.9469 14.4156 10.625 14.2844C10.375 14.7969 10.0156 15.2094 9.54375 15.525C9.075 15.8438 8.55937 16 8 16C7.42812 16 6.90938 15.8469 6.44688 15.5344C5.98125 15.225 5.625 14.8094 5.375 14.2844C5.05312 14.4156 4.71562 14.4812 4.35625 14.4812C3.55937 14.4812 2.875 14.1844 2.30312 13.5875C1.73125 12.9937 1.44687 12.2719 1.44687 11.4281C1.44687 11.3344 1.45938 11.2031 1.48125 11.0344C1.02813 10.7719 0.66875 10.4031 0.4 9.92813C0.134375 9.45312 0 8.93437 0 8.375C0 7.78125 0.15 7.23438 0.446875 6.74062C0.74375 6.24687 1.14375 5.88125 1.64375 5.64375C1.5125 5.2875 1.44687 4.92812 1.44687 4.57188C1.44687 3.72813 1.73125 3.00625 2.30312 2.4125C2.875 1.81875 3.55937 1.51875 4.35625 1.51875C4.7125 1.51875 5.05312 1.58438 5.375 1.71563C5.625 1.20312 5.98438 0.790625 6.45625 0.475C6.925 0.159375 7.44063 0 8 0C8.55937 0 9.075 0.159375 9.54375 0.471875C10.0125 0.7875 10.375 1.2 10.625 1.7125C10.9469 1.58125 11.2844 1.51562 11.6438 1.51562C12.4406 1.51562 13.1219 1.8125 13.6875 2.40937C14.2531 3.00625 14.5344 3.725 14.5344 4.56875C14.5344 4.9625 14.475 5.31875 14.3562 5.64062C14.8562 5.87813 15.2563 6.24375 15.5531 6.7375C15.85 7.23438 16 7.78125 16 8.375ZM7.65938 10.7844L10.9625 5.8375C11.0469 5.70625 11.0719 5.5625 11.0437 5.40938C11.0125 5.25625 10.9344 5.13438 10.8031 5.05312C10.6719 4.96875 10.5281 4.94063 10.375 4.9625C10.2188 4.9875 10.0938 5.0625 10 5.19375L7.09062 9.56875L5.75 8.23125C5.63125 8.1125 5.49375 8.05625 5.34062 8.0625C5.18437 8.06875 5.05 8.125 4.93125 8.23125C4.825 8.3375 4.77187 8.47187 4.77187 8.63437C4.77187 8.79375 4.825 8.92813 4.93125 9.0375L6.77187 10.8781L6.8625 10.95C6.96875 11.0219 7.07812 11.0562 7.18437 11.0562C7.39375 11.0531 7.55313 10.9656 7.65938 10.7844Z';
function vBadge(role, ok){ return '<span class="vbadge '+(ok ? (role === 'vis' ? 'vb-vis' : 'vb-tal') : 'vb-off')+'" title="'+(ok ? 'Profil vérifié par l\'équipe TakaMatch' : 'Profil pas encore vérifié')+'"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="'+VB_PATH+'"/></svg><span>('+(ok ? 'Vérifié' : 'Non vérifié')+')</span></span>'; }

function siteProjects(){
  const picks = PROJECTS.slice(0,6);
  return '<section class="sec"><div class="site-in">'
    + '<div class="sec-h">'
    +   '<h2>Des projets qui cherchent leur équipe</h2>'
    +   '<p>Un échantillon de ce que tu verras en t\'inscrivant. Chaque fiche dit ce qui bloque, quelles compétences manquent et ce que le porteur propose aux talents. Derrière chaque projet, sa fiche perso te montre qui le porte. Une photo de couverture ou l\'icône du secteur, et un ♡ pour garder les projets qui te plaisent.</p></div>'
    + '<div class="deck">' + picks.map(p => { const cv = projCover(p);
      return '<article class="pcard" data-act="open-onb" data-role="tal" style="cursor:pointer">'
        + '<div class="cover '+cv.cls+'" style="'+cv.style+'">'+(cv.ph ? '' : '<span class="glyph" aria-hidden="true">'+sector(p.sectors[0]).g+'</span>')
        +   '<span class="tags">'+(p.sectors||[]).slice(0,2).map(id=>'<span class="chip chip-onart">'+sector(id).g+' '+esc(sector(id).l)+'</span>').join('')+'</span>'
        +   (p.likes ? '<span class="fav likes" aria-label="'+p.likes+' j\'aime">♡ '+p.likes+'</span>' : '')
        +   '<span class="chip chip-pseudo" style="position:absolute;bottom:8px;left:9px">'+esc(handleOf(p))+'</span></div>'
        + '<div class="body"><div class="row" style="gap:8px;align-items:center;flex-wrap:wrap"><h3>'+esc(p.title)+'</h3>'+vBadge('vis', p.ownerVerified)+'</div>'
        + '<p class="ex">'+esc(p.hook)+'</p>'
        + '<div class="row" style="gap:5px;flex-wrap:wrap;align-items:center"><span class="sk-lbl">Recherche&nbsp;:</span>'+(p.seeking||[]).slice(0,2).map(sk=>'<span class="chip chip-a">'+esc(skillL(sk))+'</span>').join('')+'</div>'
        + (PAY_L[p.pay] ? '<span class="offer">🤝 '+esc(PAY_L[p.pay])+'</span>' : '')
        + '</div></article>'; }).join('')
    + '</div></div></section>';
}

function sitePricing(){
  return '<section class="sec" id="tarifs"><div class="site-in">'
    + '<div class="sec-h mid">'
    +   '<h2>Pas d\'abonnement. Tu paies ce que tu consommes.</h2>'
    +   '<p>Explorer et publier ne coûte rien. Seule l\'invitation se paie — en crédits prépayés, réglés par mobile money ou carte, qui n\'expirent jamais.</p></div>'
    + '<div class="price">'
    +   '<div class="price-c pc-tal"><div class="lbl">Talent</div>'
    +     '<div class="amt">Gratuit<small>pour toujours</small></div>'
    +     '<p style="font-size:13.5px;line-height:1.6;color:var(--ink-2)">Explorer, publier ta fiche, postuler et discuter après un match. Sans limite, sans carte bancaire.</p>'
    +     '<button class="btn btn-tal btn-block" data-act="open-onb" data-role="tal" style="margin-top:auto">Créer ma fiche Talent</button></div>'
    +   '<div class="price-c pc-vis"><div class="lbl">Visionnaire</div>'
    +     '<div class="amt">3<small>invitations offertes / mois</small></div>'
    +     '<p style="font-size:13.5px;line-height:1.6;color:var(--ink-2)">Publier ta fiche projet et explorer restent gratuits. Seul l\'envoi d\'une invitation consomme un crédit.</p>'
    +     '<button class="btn btn-vis btn-block" data-act="open-onb" data-role="vis" style="margin-top:auto">Publier mon projet</button></div>'
    +   '<div class="price-c"><div class="lbl">Packs de crédits (pour les <span class="gold">Visionnaires</span>)</div>'
    +     '<div class="amt">2 000<small>FCFA les 3</small></div>'
    +     '<p style="font-size:13.5px;line-height:1.6;color:var(--ink-2)">10 pour 5 000 FCFA, 30 pour 12 000 FCFA. Réglés par '+sitePayList('carte bancaire')+'.</p>'
    +     sitePayBadges()+'</div>'
    + '</div>'
    + '<div class="panel" style="margin-top:16px;padding:22px;display:flex;gap:14px;align-items:flex-start">'
    +   ic('info')+'<p style="font-size:13.5px;line-height:1.6;color:var(--ink-2)">Pourquoi faire payer l\'invitation&nbsp;? Si elle ne coûtait rien, chaque talent recevrait quarante messages génériques par semaine et n\'en lirait aucun. La rareté doit être du côté de celui qui sollicite — c\'est ce qui fait que les invitations reçues ici obtiennent une réponse.</p></div>'
    + '</div></section>';
}

/* Réseaux sociaux (logos fournis par la marque, dossier « Icon media social »). */
const SOCIAL_LINKS = {"facebook": "https://www.facebook.com/takamatch", "tiktok": "https://www.tiktok.com/@takamatch", "instagram": "https://www.instagram.com/takaamatch", "linkedin": "https://www.linkedin.com/company/takamatch", "youtube": "https://www.youtube.com/channel/UCNpx3ccM4wzZuVc7AMehRKQ"};
const SOCIAL_IC = {"facebook": {"vb": "0 0 32 32", "p": "<path fill=\"currentColor\" d=\"M32 16c0-8.839-7.167-16-16-16C7.161 0 0 7.161 0 16c0 7.984 5.849 14.604 13.5 15.803V20.626H9.437v-4.625H13.5v-3.527c0-4.009 2.385-6.223 6.041-6.223c1.751 0 3.584.312 3.584.312V10.5h-2.021c-1.984 0-2.604 1.235-2.604 2.5v3h4.437l-.713 4.625H18.5v11.177C26.145 30.603 32 23.983 32 15.999z\" />"}, "instagram": {"vb": "0 0 56 56", "p": "<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M39.006 3C46.735 3 53 9.27 53 16.994v22.012C53 46.735 46.73 53 39.006 53H16.994C9.265 53 3 46.73 3 39.006V16.994C3 9.265 9.27 3 16.994 3zM28 15c-7.18 0-13 5.82-13 13s5.82 13 13 13s13-5.82 13-13s-5.82-13-13-13m0 4a9 9 0 1 1 0 18a9 9 0 0 1 0-18m14.5-9a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7\" />"}, "linkedin": {"vb": "0 0 20 20", "p": "<path fill=\"currentColor\" d=\"M10 .4C4.698.4.4 4.698.4 10s4.298 9.6 9.6 9.6s9.6-4.298 9.6-9.6S15.302.4 10 .4M7.65 13.979H5.706V7.723H7.65zm-.984-7.024c-.614 0-1.011-.435-1.011-.973c0-.549.409-.971 1.036-.971s1.011.422 1.023.971c0 .538-.396.973-1.048.973m8.084 7.024h-1.944v-3.467c0-.807-.282-1.355-.985-1.355c-.537 0-.856.371-.997.728c-.052.127-.065.307-.065.486v3.607H8.814v-4.26c0-.781-.025-1.434-.051-1.996h1.689l.089.869h.039c.256-.408.883-1.01 1.932-1.01c1.279 0 2.238.857 2.238 2.699z\" />"}, "tiktok": {"vb": "0 0 24 24", "p": "<path fill=\"currentColor\" d=\"M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2m5.939 7.713v.646a.37.37 0 0 1-.38.37a5.36 5.36 0 0 1-2.903-1.108v4.728a3.94 3.94 0 0 1-1.18 2.81a4 4 0 0 1-2.87 1.17a4.1 4.1 0 0 1-2.862-1.17a3.98 3.98 0 0 1-1.026-3.805c.159-.642.48-1.232.933-1.713a3.58 3.58 0 0 1 2.79-1.313h.82v1.703a.348.348 0 0 1-.39.348a1.918 1.918 0 0 0-1.23 3.631c.27.155.572.246.882.267c.24.01.48-.02.708-.092a1.93 1.93 0 0 0 1.313-1.816V5.754a.36.36 0 0 1 .359-.36h1.415a.36.36 0 0 1 .359.34a3.3 3.3 0 0 0 1.282 2.245a3.25 3.25 0 0 0 1.641.636a.37.37 0 0 1 .338.35z\" />"}, "youtube": {"vb": "0 0 24 24", "p": "<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z\"/>"}};
const FT_SOC = [["facebook", "Facebook"], ["instagram", "Instagram"], ["linkedin", "LinkedIn"], ["tiktok", "TikTok"], ["youtube", "YouTube"]];

function siteFooter(){
  return '<footer class="site-ft"><div class="site-in"><div class="cols3">'
    + '<div style="flex:1;min-width:230px">'
    +   '<img class="ft-logo" src="'+LOGO_S+'" alt="TakaMatch">'
    +   '<p style="font-size:13.5px;line-height:1.6;color:var(--ink-2);max-width:34ch">Connecter, co-créer, impacter. La plateforme de cofondation pour l\'Afrique de l\'Ouest.</p></div>'
    + '<div class="lnks"><div class="lbl" style="margin-bottom:4px">Produit</div>'
    +   '<a href="#comment" data-act="anchor" data-to="comment">Comment ça marche</a>'
    +   '<a href="#profils" data-act="anchor" data-to="profils">Les deux profils</a>'
    +   '<a href="#tarifs" data-act="anchor" data-to="tarifs">Tarifs</a></div>'
    + '<div class="lnks"><div class="lbl" style="margin-bottom:4px">Légal</div>'
    +   '<a href="#" data-act="noop">Conditions générales</a>'
    +   '<a href="#" data-act="noop">Confidentialité</a>'
    +   '<a href="#" data-act="noop">Mentions légales</a></div>'
    + '<div class="lnks"><div class="lbl" style="margin-bottom:4px">Suis-nous</div>'
    +   '<div class="ft-soc">' + FT_SOC.map(n => '<a class="fs fs-'+n[0]+'" href="'+SOCIAL_LINKS[n[0]]+'" target="_blank" rel="noopener" aria-label="TakaMatch sur '+n[1]+'" title="'+n[1]+'">'
    +     '<svg viewBox="'+SOCIAL_IC[n[0]].vb+'" aria-hidden="true">'+SOCIAL_IC[n[0]].p+'</svg></a>').join('') + '</div></div>'
    + '</div>'
    + '<p style="font-size:12.5px;color:var(--ink-3);margin-top:30px">Prototype de démonstration — les projets et les talents affichés sont fictifs.</p>'
    + '</div></footer>';
}



const ARR = '<svg class="ic arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></svg>';

function siteHero(){
  return '<section class="hero"><div class="hero-bg"><i class="b1"></i><i class="b2"></i><i class="b3"></i></div>'
    + '<div class="site-in"><div class="hero-in">'
    + '<span class="eyebrow hero-ey">'+ic('rocket')+'La Plateforme Africaine De Co-création De Valeur</span>'
    + '<h1><span class="ln"><span>Une idée seule ne suffit pas.</span></span>'
    +   '<span class="ln"><span class="g">Une compétence seule non plus.</span></span></h1>'
    + '<p class="lead">TakaMatch réunit ceux qui portent un projet et ceux qui ont les compétences pour le bâtir — '
    + 'comme cofondateurs, pas comme client et prestataire.</p>'
    + '<div class="hero-ctas">'
    +   '<button class="btn btn-lg btn-vis btn-fx magnet" data-act="open-onb" data-role="vis"><span class="emo" aria-hidden="true">💡</span>J\'ai une idée'+ARR+'</button>'
    +   '<button class="btn btn-lg btn-tal btn-fx magnet" data-act="open-onb" data-role="tal"><span class="emo" aria-hidden="true">🛠️</span>J\'ai un talent'+ARR+'</button>'
    + '</div>'
    + '<div class="trust-l"><span class="stack" aria-hidden="true"><i class="sv">V</i><i class="st">T</i><i class="sp">+</i></span>'
    +   '<span>Inscription en 4 minutes · Paiement '+sitePayList('carte')+'</span></div>'
    + '<div class="figs">'
    +   fig('216','projets en ligne') + fig('1 480','talents inscrits')
    +   fig('94','équipes formées') + fig('65 %','de réponse aux invitations')
    + '</div>'
    + '</div></div></section>';
}
function fig(v,l){ return '<div class="fig"><b class="tnum">'+v+'</b><span>'+esc(l)+'</span></div>'; }

function siteMarquee(){
  const one = SECTORS.map(s => '<span>'+esc(s.l)+'</span>').join('');
  const two = SECTORS.map(s => '<span aria-hidden="true">'+esc(s.l)+'</span>').join('');
  return '<div class="mq" role="region" aria-label="Secteurs couverts"><div class="mq-track">'+one+two+'</div></div>';
}

function siteHow(){
  return '<section class="sec" id="comment"><div class="site-in">'
    + '<div class="sec-h">'
    +   '<span class="eyebrow">Comment ça marche</span>'
    +   '<h2>Du premier clic au <span class="gt">premier match</span>.</h2>'
    +   '<p>Trois étapes, pensées pour que chaque rencontre soit sérieuse. Survole les cartes.</p></div>'
    + '<div class="stp-g">'
    +   '<article class="stp" tabindex="0"><span class="n">Étape 01</span><h3>Choisis ta casquette</h3>'
    +     '<p>Une idée ou un talent ? L\'interface prend ta couleur, or ou bleue, dès que tu choisis.</p>'
    +     '<div class="mini" aria-hidden="true"><div class="pk">'
    +       '<div class="py"><span class="ck"></span>Avec une idée</div>'
    +       '<div class="pb"><span class="ck">'+tick()+'</span>Avec mes compétences</div>'
    +     '</div></div></article>'
    +   '<article class="stp" tabindex="0"><span class="n">Étape 02</span><h3>Complète ta fiche</h3>'
    +     '<p>Ta fiche démarre à 5 %. Plus elle est complète, plus elle remonte dans les recherches et plus ton score de compatibilité est juste. À chaque connexion, un rappel te montre ce qu\'il manque pour atteindre 100&nbsp;%.</p>'
    +     '<div class="mini" aria-hidden="true"><div class="ringw">'
    +       '<svg class="ring" id="ring" viewBox="0 0 118 118"><defs><linearGradient id="tmRg" x1="0" x2="1" y1="0" y2="1"><stop class="s0" offset="0" stop-color="#0A5C99"/><stop class="s1" offset="1" stop-color="#8DC4EE"/></linearGradient></defs>'
    +       '<circle class="bg" cx="59" cy="59" r="50"/><circle class="fg" cx="59" cy="59" r="50"/></svg>'
    +       '<b id="ringpct" class="tnum">5 %</b></div></div></article>'
    +   '<article class="stp" tabindex="0"><span class="n">Étape 03</span><h3>Matche et dévoile</h3>'
    +     '<p>Le nom reste masqué et la photo floutée jusqu\'au match accepté. Ensuite, l\'Atelier s\'ouvre pour la co-création.</p>'
    +     '<div class="mini" aria-hidden="true"><div class="unl"><div class="ph"></div>'
    +       '<div class="nm"><span class="is-mask">****** ****</span><span class="is-real">Aïcha Dossou</span></div>'
    +       '<div class="lk">'+ic('lock')+'Dévoilé après un match</div></div></div></article>'
    + '</div></div></section>';
}

function siteRoles(){
  const f = (n,t,d) => '<li><i>'+n+'</i><div><b>'+esc(t)+'</b><span>'+esc(d)+'</span></div></li>';
  return '<section class="sec roles" id="profils" data-r="vis"><div class="site-in">'
    + '<div class="sec-h">'
    +   '<span class="eyebrow">Deux rôles, une seule plateforme</span>'
    +   '<h2>Choisis ta couleur.<br><span class="gt">Tu pourras porter l\'autre plus tard.</span></h2></div>'
    + '<div class="rsw" role="group" aria-label="Choisir un rôle"><span class="knob" aria-hidden="true"></span>'
    +   '<button type="button" data-act="role" data-r="vis" aria-pressed="true"><span aria-hidden="true">💡</span>Visionnaire</button>'
    +   '<button type="button" data-act="role" data-r="tal" aria-pressed="false"><span aria-hidden="true">🛠️</span>Talent</button></div>'
    + '<div class="rgrid">'
    +   '<div class="rpanel">'
    +     '<div data-show="vis"><h3>Tu as l\'idée. <em>Trouve tes mains.</em></h3>'
    +       '<p>Présente ton projet comme un pitch : on te guide section par section pour qu\'un talent comprenne en 30 secondes pourquoi il doit te rejoindre.</p>'
    +       '<ul class="feats">'
    +         f(1,'Une fiche projet qui pitche pour toi',"Le Hook, la Vision, la Traction, les Défis, et ce que tu proposes aux talents : parts uniquement, parts + petite rémunération ou rémunération prévue. À côté, ta fiche perso montre la personne derrière le projet : tes compétences, ton parcours, ta signature. Les deux se gèrent dans « Mes fiches ».")
    +         f(2,'Des talents classés par compatibilité',"Un score sur 100, décomposé en quatre critères visibles, dont le rythme de travail.")
    +         f(3,'Invite, matche, co-crée',"Une invitation acceptée dévoile les identités et ouvre l'Atelier.")
    +       '</ul></div>'
    +     '<div data-show="tal"><h3>Tu as le talent. <em>Choisis ton projet.</em></h3>'
    +       '<p>Ne sois plus « la ressource » de quelqu\'un. Deviens cofondateur d\'un projet qui te ressemble, avec ta part de l\'aventure.</p>'
    +       '<ul class="feats">'
    +         f(1,'Une fiche talent claire',"Tes compétences, ton rythme réel (8, 18 ou 35 h par semaine) et ta signature personnelle.")
    +         f(2,'Explore les projets librement',"Filtre par secteur ou « Avec rémunération », garde tes favoris, postule sans limite.")
    +         f(3,"Anonyme jusqu'au match","Tu apparais sous ton pseudo. Les visionnaires viennent à toi ; ton nom ne sort qu'au oui.")
    +       '</ul></div>'
    +   '</div>'
    +   '<div class="rside">'
    +     '<div class="rquote"><span class="qi">'+ic('quote')+'</span>'
    +       '<p data-show="vis">Transforme ton idée en entreprise à impact. Les bons cofondateurs sont déjà là.</p>'
    +       '<p data-show="tal">Rejoins un projet à impact et deviens cofondateur, pas simple prestataire.</p>'
    +       '<div class="rq-cta">'
    +         '<button class="btn btn-vis btn-lift" data-show="vis" data-act="open-onb" data-role="vis"><span class="emo" aria-hidden="true">💡</span>Publier mon projet'+ARR+'</button>'
    +         '<button class="btn btn-tal btn-lift" data-show="tal" data-act="open-onb" data-role="tal"><span class="emo" aria-hidden="true">🛠️</span>Créer ma fiche Talent'+ARR+'</button>'
    +       '</div>'
    +       '<small>Connecter, co-créer, impacter</small></div>'
    +     '<div class="rcred">'
    +       '<div data-show="vis"><div class="lbl">Crédits d\'invitation</div>'
    +         '<div class="num tnum">3<small>offertes / mois</small></div>'
    +         '<div class="gauge"><i class="on"></i><i class="on"></i><i class="on"></i></div>'
    +         '<p>Des invitations rares, donc sérieuses. Ensuite, des packs prépayés via '+sitePayList('carte bancaire')+'.</p></div>'
    +       '<div data-show="tal"><div class="lbl">Pour les talents</div>'
    +         '<div class="num tnum">0<small>FCFA, pour toujours</small></div>'
    +         '<div class="gauge"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></div>'
    +         '<p>Explore, publie ta fiche, postule et réponds aux invitations sans limite.</p></div>'
    +     '</div>'
    +   '</div>'
    + '</div></div></section>';
}

function siteTrust(){
  const L = [['Règles d\'or avant l\'inscription','Authenticité, sécurité, respect : on s\'engage avant d\'entrer.'],
             ['Nom légal privé','Il rend les engagements opposables, sans jamais être exposé.'],
             ['Profil vérifié','Pièce et selfie, supprimés après 30 jours.'],
             ['Dévoilement au match','Photo floutée jusqu\'au oui, nette ensuite. Sans photo, tes initiales sur ta couleur.']];
  return '<section class="sec" id="confiance"><div class="site-in"><div class="pgrid">'
    + '<div>'
    +   '<div class="sec-h" style="margin-bottom:26px">'
    +     '<span class="eyebrow">Confidentialité progressive</span>'
    +     '<h2>On voit assez pour avoir envie. <span class="gold">Pas plus.</span></h2>'
    +     '<p>Tant que tu n\'as pas dit oui, on voit tes compétences, ta ville, ton rythme et ta photo floutée, jamais ton nom ni tes coordonnées. Le match est la clé qui déverrouille l\'identité.</p></div>'
    +   '<div class="lyrs">' + L.map((l,i)=>'<div class="lyr'+(i<3?' lit':'')+'"'+(i===3?' id="lyr4"':'')+'><i>'+(i+1)+'</i><div><b>'+esc(l[0])+'</b><span>'+esc(l[1])+'</span></div></div>').join('') + '</div>'
    + '</div>'
    + '<div class="demo" id="demo">'
    +   '<div class="tcard">'
    +     '<div class="top"><div class="ph"></div>'
    +       '<div class="nm"><span class="is-mask">****** *******</span><span class="is-real">Koffi Agbessi</span>'
    +         '<small class="locked">Sera affiché après un match</small><small class="is-real">Nom vérifié · joignable dans l\'Atelier</small>'
    +         '<small>Développeur mobile · Porto-Novo</small></div></div>'
    +     '<dl><div><dt>Pseudo</dt><dd><span class="chip-pseudo">@nuit_blanche</span></dd></div>'
    +       '<div><dt>Rythme</dt><dd class="tnum">18 h/sem</dd></div>'
    +       '<div><dt>Secteur</dt><dd>Fintech</dd></div></dl>'
    +     '<div class="sk-lbl" style="margin-bottom:7px">Compétences clés</div>'
    +     '<div class="row" style="gap:6px;flex-wrap:wrap"><span class="chip chip-tal">Dev mobile</span><span class="chip chip-tal">Flutter</span><span class="chip chip-tal">Paiement mobile</span></div>'
    +     '<div class="lockrow"><span class="locked">'+ic('lock')+'3 informations débloquées après un match</span>'
    +       '<span class="contact">'+ic('check')+'Match accepté, la discussion est ouverte</span>'
    +       '<span>Vu il y a 2 jours</span></div>'
    +   '</div>'
    +   '<div class="actions"><button class="btn btn-vis" type="button" data-act="match" id="matchBtn"><span class="lbl-t">Simuler le match</span>'+ARR+'</button>'
    +     '<span class="hint" id="matchHint">Exemple fictif, pour voir ce qui se débloque.</span></div>'
    + '</div>'
    + '</div></div></section>';
}

function siteCompare(){
  const X = '<span class="b"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></span>';
  const V = '<span class="b">'+tick()+'</span>';
  const bef = ["Tu cherches dans ton cercle proche, qui n'a pas forcément les bonnes compétences.",
               "Les groupes WhatsApp et LinkedIn mélangent offres d'emploi et vrais projets.",
               "Tu exposes ton idée ou ton identité à des inconnus sans garde-fou.",
               "Les talents deviennent des prestataires, pas des associés."];
  const aft = ["Des fiches structurées comme un pitch : tu compares les projets, ou les talents, en quelques secondes.",
               "Un score qui s'explique, et un espace dédié à la cofondation, pas au recrutement.",
               "Identité protégée jusqu'au match, confiance vérifiée par paliers.",
               "Un seul compte pour porter les deux casquettes."];
  return '<section class="sec sec-tight"><div class="site-in">'
    + '<div class="sec-h">'
    +   '<span class="eyebrow">Pourquoi TakaMatch</span>'
    +   '<h2>Chercher un associé, <span class="gt">avant et après</span>.</h2></div>'
    + '<div class="cmp">'
    +   '<div class="before rv"><h3>Sans TakaMatch</h3><ul>'+bef.map(x=>'<li>'+X+'<span>'+esc(x)+'</span></li>').join('')+'</ul></div>'
    +   '<div class="after rv d2"><h3>Avec TakaMatch</h3><ul>'+aft.map(x=>'<li>'+V+'<span>'+esc(x)+'</span></li>').join('')+'</ul></div>'
    + '</div></div></section>';
}

function siteFaq(){
  const faq = [
    ["Puis-je être visionnaire et talent à la fois ?","Oui. Un seul compte, deux profils indépendants : matchs, invitations, conversations et Ateliers restent séparés ; ton nom, ton e-mail, ta ville, ton sexe et ton niveau de confiance sont communs. Le premier profil est gratuit, le second se débloque une fois pour 3 000 FCFA. Ensuite tu bascules sans limite depuis le menu de ton profil, et l'interface change de couleur pour que tu saches toujours où tu es."],
    ["Que voit-on de moi avant un match ?","Ton pseudo, tes compétences, ta ville, ton rythme, ta signature personnelle et ta photo, floutée. Ni ton nom, ni tes coordonnées. Sans photo, ce sont tes initiales sur ta couleur. Ton sexe (Masculin, Féminin ou Ne pas préciser) ne s'affiche qu'après le match et ne compte ni dans le score ni dans les filtres."],
    ["Qui peut voir ma fiche ?","Les talents ne voient que des fiches projet, les visionnaires que des fiches talent : jamais une fiche de ton propre camp. Depuis une fiche projet, un talent peut aussi ouvrir la fiche perso du visionnaire (« Voir sa fiche perso ») : tes compétences, ton parcours, ta signature. Un autre visionnaire ne la voit jamais. Côté visionnaire, tout se gère dans « Mes fiches », en deux onglets : « Fiche Projet » et « Ma fiche perso ». Quelqu'un sans compte qui arrive par le lien ou le code QR de ta fiche peut la lire, mais pas t'inviter ; il apparaît dans tes statistiques comme « visiteur non identifié ». La fiche perso n'a pas de statistiques : c'est ta fiche projet qui est suivie."],
    ["Un projet peut-il me rémunérer ?","Chaque visionnaire indique sur sa fiche ce qu'il propose aux talents : parts uniquement (des parts au capital, sans rémunération au départ), parts + petite rémunération (un défraiement dès le début) ou rémunération prévue (un revenu est prévu pour le cofondateur). Le filtre « Avec rémunération » t'aide à les trouver."],
    ["Mon idée risque-t-elle d'être copiée ?","Tu choisis ce que tu publies. Ta fiche présente le problème, la vision et ce qui bloque ; les détails sensibles se partagent après le match, dans l'Atelier, où chaque échange est horodaté dans le journal de décisions."],
    ["À quoi sert le pseudo ?","C'est ton identité publique avant le match : il figure sur ta fiche, dans la recherche et sur ton code QR. Choisis-en un qui te ressemble sans te nommer — c'est exactement ce qu'il protège."],
    ["Comment faire vérifier mon profil ?","Depuis tes paramètres : une pièce d'identité et un selfie suffisent. Ils sont supprimés après 30 jours ; seul le palier « Identité vérifiée » reste affiché sur ta fiche."],
    ["Pourquoi mon nom est-il verrouillé après l'inscription ?","Parce qu'un engagement de cofondation doit être opposable. Ton nom légal reste privé, mais il ne change pas — c'est ce qui rend les documents signés dans l'Atelier valables."],
    ["Qu'est-ce qui se passe si personne ne répond ?","Une invitation sans réponse expire au bout de 10 jours, et le crédit est rendu au visionnaire. Chaque profil affiche son délai de réponse habituel, pour que tu saches à quoi t'attendre avant d'en dépenser une."],
    ["Combien de projets puis-je porter ou rejoindre ?","Un visionnaire porte jusqu'à 3 projets : la première fiche projet est incluse, chaque emplacement de plus coûte 5 000 FCFA une seule fois et reste acquis même si tu supprimes la fiche. Un talent rejoint au plus 3 projets à la fois ; pour en rejoindre un autre, il doit d'abord « Quitter le projet » dans l'un des trois."],
    ["Le pacte d'associés est-il un vrai document ?","Oui. C'est un modèle de droit OHADA prérempli depuis vos décisions, relu par un juriste avant de vous être remis. Il ne remplace pas un conseil personnalisé, mais il vaut infiniment mieux qu'un contrat copié sur Internet."],
  ];
  return '<section class="sec" id="faq"><div class="site-in"><div class="faqg">'
    + '<div class="sec-h">'
    +   '<span class="eyebrow">Questions fréquentes</span>'
    +   '<h2>Tout ce qu\'il faut savoir.</h2>'
    +   '<p>Une autre question ? L\'équipe répond aussi sur le groupe WhatsApp communautaire.</p></div>'
    + '<div>' + faq.map((f,i)=>'<details class="fq"'+(i===0?' open':'')+'><summary>'+esc(f[0])+'<span class="pm" aria-hidden="true"></span></summary><p>'+esc(f[1])+'</p></details>').join('') + '</div>'
    + '</div></div></section>';
}

function siteCta(){
  return '<section class="fin"><div class="fin-glow" aria-hidden="true"><i class="b1"></i><i class="b2"></i></div>'
    + '<div class="site-in">'
    +   '<span class="eyebrow">Connecter, co-créer, impacter</span>'
    +   '<h2>La prochaine success story africaine <span class="gt">commence par un match.</span></h2>'
    +   '<p>Crée ton profil en quatre minutes. Choisis ta couleur. Trouve la ou les personnes qui te manquent.</p>'
    +   '<div class="hero-ctas">'
    +     '<button class="btn btn-lg btn-vis btn-fx magnet" data-act="open-onb" data-role="vis"><span class="emo" aria-hidden="true">💡</span>Je suis Visionnaire'+ARR+'</button>'
    +     '<button class="btn btn-lg btn-tal btn-fx magnet" data-act="open-onb" data-role="tal"><span class="emo" aria-hidden="true">🛠️</span>Je suis Talent'+ARR+'</button>'
    +   '</div>'
    + '</div></section>';
}


const WORDS = [['🌐🔗','Connecter','Trouver les bonnes personnes.'],
               ['🤝👥','Co-créer','Construire ensemble.'],
               ['🚀✨📈','Impacter',"Donner vie aux idées qui bâtiront l'Afrique de demain."]];
function siteConviction(){
  return '<section class="sec conv" id="conviction"><div class="site-in"><div class="conv-g">'
    + '<div class="conv-t">'
    +   '<span class="eyebrow">Notre conviction</span>'
    +   '<p class="conv-lead">Derrière chaque grande entreprise, il y a une rencontre : celle d\'une vision, de talents et de compétences qui se complètent.</p>'
    +   '<p>L\'histoire d\'Apple en est une belle illustration. Steve Jobs portait la vision et l\'ambition de transformer l\'informatique, tandis que Steve Wozniak apportait son génie technique et ses compétences d\'ingénieur. Ensemble, ils ont donné naissance à Apple, devenue l\'une des entreprises les plus emblématiques de l\'histoire de la technologie.</p>'
    +   '<p class="conv-b">Parce qu\'une vision ne suffit pas toujours à construire. Un talent ne suffit pas toujours à transformer. C\'est lorsque des compétences différentes se rencontrent autour d\'une même ambition que les grandes idées prennent vie.</p>'
    +   '<p class="conv-end">L\'Afrique de demain se construira grâce à ces rencontres-là.</p>'
    + '</div>'
    + '<div class="conv-w">'
    +   '<span class="sr">Connecter : trouver les bonnes personnes. Co-créer : construire ensemble. Impacter : donner vie aux idées qui bâtiront l\'Afrique de demain.</span>'
    +   '<div class="wr" id="wr" aria-hidden="true">'
    +     WORDS.map((w,k) => '<div class="wi'+(k===0?' on':'')+'"><span class="we">'+w[0]+'</span><span class="ww">'+w[1]+'</span><em class="wt">'+w[2]+'</em></div>').join('')
    +   '</div>'
    +   '<div class="wr-bars" aria-hidden="true"><i class="on"></i><i></i><i></i></div>'
    + '</div>'
    + '</div></div></section>';
}

/* Le mot sortant monte et se dissout ; le suivant arrive par le bas
   et se précise. Immobile si l'appareil le demande. */
function wireWords(){
  const box = $('#wr'); if(!box || REDUCE) return;
  /* Chaque mot reste net 1 s, la bascule dure 0,5 s. Au survol de la
     carte, le mot affiché se fige ; la rotation reprend à la sortie. */
  const words = $$('.wi', box), bars = $$('.wr-bars i');
  const card = box.closest('.conv-w') || box;
  let i = 0, held = false;
  card.addEventListener('pointerenter', () => { held = true; });
  card.addEventListener('pointerleave', () => { held = false; });
  setInterval(() => {
    if(document.hidden || held) return;
    const cur = words[i]; i = (i + 1) % words.length;
    cur.classList.remove('on'); cur.classList.add('out');
    setTimeout(() => cur.classList.remove('out'), 520);
    words[i].classList.add('on');
    bars.forEach((b, k) => b.classList.toggle('on', k === i));
  }, 1500);
}

/* Effet aimant de la seconde maquette : le bouton suit un peu le
   pointeur, puis revient. Écrans à survol uniquement. */
function wireMagnets(){
  if(REDUCE || !(window.matchMedia && matchMedia('(hover:hover)').matches)) return;
  $$('.magnet').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = 'translate(' + ((e.clientX - r.left - r.width/2) * .16) + 'px,' + ((e.clientY - r.top - r.height/2) * .28 - 2) + 'px)';
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
}

/* ---------- Comportements des sections ---------- */
const REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setRole(r){
  const s = $('.roles'); if(!s) return;
  s.dataset.r = r;
  $$('.rsw button', s).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.r === r)));
  $$('[data-show="'+r+'"]', s).forEach(el => { el.classList.remove('fadein'); void el.offsetWidth; el.classList.add('fadein'); });
}

function countTo(el, from, to, dur, suffix){
  const t0 = performance.now();
  const step = t => {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(from + (to - from) * e) + suffix;
    if(k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function wireSite(){
  wireWords(); wireMagnets();
  const ring = $('#ring'), pct = $('#ringpct');
  const targets = $$('.rv').concat(ring ? [ring] : []);
  const fire = el => {
    if(el === ring){ ring.classList.add('done'); if(REDUCE) pct.textContent = '93 %'; else countTo(pct, 5, 93, 1800, ' %'); }
    else el.classList.add('in');
  };
  if(!('IntersectionObserver' in window)){ targets.forEach(fire); return; }
  const io = new IntersectionObserver(es => es.forEach(en => {
    if(!en.isIntersecting) return;
    io.unobserve(en.target); fire(en.target);
  }), {threshold:.35});
  targets.forEach(t => io.observe(t));
}

function toggleMatch(){
  const d = $('#demo'); if(!d) return;
  const on = !d.classList.contains('matched');
  d.classList.toggle('matched', on);
  $('#lyr4').classList.toggle('lit', on);
  $('#matchBtn .lbl-t').textContent = on ? 'Réinitialiser' : 'Simuler le match';
  $('#matchHint').textContent = on ? 'Nom, photo nette et discussion débloqués.' : 'Exemple fictif, pour voir ce qui se débloque.';
  if(on) confetti($('#matchBtn'));
}

/* Une pluie courte, or et bleu, partie du bouton. */
function confetti(from){
  if(REDUCE || !from) return;
  const cv = document.createElement('canvas'); cv.className = 'confetti';
  document.body.appendChild(cv);
  const dpr = Math.min(window.devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  const cx = cv.getContext('2d'); cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const r = from.getBoundingClientRect(), ox = r.left + r.width / 2, oy = r.top;
  const ps = Array.from({length:90}, () => ({x:ox, y:oy, vx:(Math.random()-.5)*12, vy:-Math.random()*10-4,
    s:Math.random()*6+3, c:Math.random() < .5 ? '#FFD741' : '#007CD8', a:Math.random()*6, life:1}));
  const step = () => {
    cx.clearRect(0, 0, W, H); let alive = false;
    for(const p of ps){
      p.vy += .3; p.x += p.vx; p.y += p.vy; p.a += .2; p.life -= .012;
      if(p.life > 0){ alive = true; cx.save(); cx.globalAlpha = p.life; cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c; cx.fillRect(-p.s/2, -p.s/4, p.s, p.s/2); cx.restore(); }
    }
    if(alive) requestAnimationFrame(step); else cv.remove();
  };
  step();
}


/* ============================================================
   Fenêtres pop-up : menu mobile et inscription / connexion.
   Un seul calque pour tout le site — fond flouté, fenêtre qui
   monte en fondu. On ferme par la croix, le fond, Échap ou un lien.
   ============================================================ */
let OV_LAST = null;           // élément à qui rendre le focus
function ovEl(){ return $('#ov'); }

function ovOpen(html, kind){
  const ov = ovEl(), win = $('.ov-win', ov);
  if(!ov.hidden && ov.dataset.kind === kind){ win.innerHTML = html; return ovFocus(); }
  OV_LAST = OV_LAST || document.activeElement;
  win.innerHTML = html;
  win.className = 'ov-win ov-' + kind;
  ov.dataset.kind = kind;
  ov.hidden = false;
  document.body.classList.toggle('menu-open', kind === 'menu');
  const burger = $('.burger');
  if(burger){ burger.classList.toggle('x', kind === 'menu'); burger.setAttribute('aria-expanded', String(kind === 'menu')); }
  $('#site').style.overflow = 'hidden';
  requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('on')));
  ovFocus();
}
function ovFocus(){
  setTimeout(() => {
    const f = $('.ov-win input, .ov-win a, .ov-win button:not(.ov-x)', ovEl());
    if(f) f.focus({preventScroll:true});
  }, 60);
}
function ovClose(then){
  const ov = ovEl();
  if(ov.hidden){ if(then) then(); return; }
  ov.classList.remove('on');
  document.body.classList.remove('menu-open');
  const burger = $('.burger');
  if(burger){ burger.classList.remove('x'); burger.setAttribute('aria-expanded', 'false'); }
  setTimeout(() => {
    ov.hidden = true; $('#site').style.overflow = '';
    if(OV_LAST && OV_LAST.focus) OV_LAST.focus({preventScroll:true});
    OV_LAST = null;
    if(then) then();
  }, REDUCE ? 0 : 260);
}

/* ---------- Le menu ---------- */
const NAV = [['conviction','Notre conviction'],['comment','Comment ça marche'],['profils','Les deux profils'],['atelier',"L'Atelier"]];
function openMenu(){
  if(!ovEl().hidden && ovEl().dataset.kind === 'menu'){ ovClose(); return; }
  ovOpen(
    '<nav class="mm" aria-label="Menu">'
    + NAV.map((n,i) => '<a href="#'+n[0]+'" data-act="mm-go" data-to="'+n[0]+'" style="--i:'+i+'"><span class="k">0'+(i+1)+'</span><span class="l">'+esc(n[1])+'</span>'+ic('arrow')+'</a>').join('')
    + '</nav>'
    + '<div class="mm-cta" style="--i:4">'
    +   '<button class="btn btn-ghost btn-lg" data-act="open-onb" data-mode="login">Se connecter</button>'
    +   '<button class="btn btn-go btn-lg" data-act="open-onb">Commencer</button>'
    + '</div>', 'menu');
}

/* ---------- Inscription / connexion ---------- */
function signupHTML(role, mode){
  const login = mode === 'login';
  const x = '<button class="iconbtn ov-x" data-act="ov-close" aria-label="Fermer">'+ic('x')+'</button>';
  if(login){
    return x
      + '<h2 class="ov-t">Se connecter</h2>'
      + '<p class="ov-s">Heureux de te revoir. On t\'envoie un code à usage unique.</p>'
      + '<form class="ov-f" data-mode="login">'
      +   '<div class="field"><label for="ovc">E-mail ou téléphone</label><input class="inp" id="ovc" name="contact" autocomplete="username" placeholder="toi@exemple.com ou +229 …" required></div>'
      +   '<button class="btn btn-go btn-lg btn-block" type="submit">Continuer'+ARR+'</button>'
      + '</form>'
      + '<p class="ov-sw">Pas encore de compte ? <a href="#" data-act="open-onb">Commencer</a></p>';
  }
  const r = role === 'tal' ? 'tal' : 'vis';
  const opt = (k, emo, t, d) => '<button type="button" class="rp rp-'+k+'" data-act="ov-role" data-r="'+k+'" aria-pressed="'+(r===k)+'">'
      + '<span class="emo" aria-hidden="true">'+emo+'</span><b>'+t+'</b><span>'+d+'</span></button>';
  return x
    + '<h2 class="ov-t">Rejoindre TakaMatch</h2>'
    + '<p class="ov-s">Choisis ta casquette. Tu pourras porter l\'autre plus tard.</p>'
    + '<div class="rpk" role="group" aria-label="Rôle">'
    +   opt('vis','💡','Visionnaire',"J'ai une idée")
    +   opt('tal','🛠️','Talent',"J'ai un talent")
    + '</div>'
    + '<form class="ov-f" data-mode="signup" data-role="'+r+'">'
    +   '<div class="field"><label for="ovc">E-mail ou téléphone</label><input class="inp" id="ovc" name="contact" autocomplete="email" placeholder="toi@exemple.com ou +229 …" required></div>'
    +   '<button class="btn btn-lg btn-block ov-go '+(r==='tal'?'btn-tal':'btn-vis')+'" type="submit">Continuer'+ARR+'</button>'
    + '</form>'
    + '<p class="ov-n">Inscription en 4 minutes · Paiement '+sitePayList('carte')+'</p>'
    + '<p class="ov-sw">Déjà inscrit ? <a href="#" data-act="open-onb" data-mode="login">Se connecter</a></p>';
}
function openSignup(opts){
  opts = opts || {};
  ovOpen(signupHTML(opts.role, opts.mode), 'signup');
}
function ovPickRole(r){
  $$('.rpk .rp').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.r === r)));
  const f = $('.ov-f'); if(f) f.dataset.role = r;
  const go = $('.ov-go');
  if(go){ go.classList.toggle('btn-vis', r === 'vis'); go.classList.toggle('btn-tal', r === 'tal'); }
}
function ovSubmit(form){
  const contact = form.contact.value.trim();
  if(!contact){ form.contact.focus(); return; }
  const opts = {mode: form.dataset.mode === 'login' ? 'login' : undefined, role: form.dataset.role, contact};
  signup(opts);
  $('.ov-win').innerHTML = '<button class="iconbtn ov-x" data-act="ov-close" aria-label="Fermer">'+ic('x')+'</button>'
    + '<div class="ov-ok"><span class="okc">'+tick()+'</span>'
    + '<h2 class="ov-t">C\'est noté.</h2>'
    + '<p class="ov-s">'+(opts.mode === 'login'
        ? 'Un code de connexion part vers <b>'+esc(contact)+'</b>.'
        : 'On t\'envoie la suite de ton inscription '+(opts.role === 'tal' ? 'Talent' : 'Visionnaire')+' sur <b>'+esc(contact)+'</b>.')+'</p>'
    + '<button class="btn btn-ghost" data-act="ov-close">Fermer</button></div>';
}

/* ============================================================
   Le point d'accroche
   Tous les appels à l'action de la page passent par ici.
   Remplace le corps par ta redirection réelle, par exemple :
     location.href = '/inscription' + (opts.role ? '?role=' + opts.role : '');
   opts.role vaut 'vis' (visionnaire) ou 'tal' (talent) quand le
   visiteur a choisi son camp depuis une carte ou un tarif ;
   opts.mode vaut 'login' depuis le bouton « Se connecter ».
   ============================================================ */
function signup(opts){
  opts = opts || {};
  const who = opts.mode === 'login' ? 'Connexion'
            : opts.role === 'vis' ? 'Inscription — Visionnaire'
            : opts.role === 'tal' ? 'Inscription — Talent'
            : 'Inscription';
  // La fenêtre affiche déjà la confirmation ; ici se branche le vrai parcours.
  if(window.console) console.info('[TakaMatch] ' + who, opts);
}

/* ---------- Délégation d'événements ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]');
  if(!t) return;
  const a = t.dataset.act;
  if(a === 'open-onb'){ e.preventDefault(); openSignup({role:t.dataset.role, mode:t.dataset.mode}); return; }
  if(a === 'menu'){ openMenu(); return; }
  if(a === 'ov-close'){ ovClose(); return; }
  if(a === 'ov-role'){ ovPickRole(t.dataset.r); return; }
  if(a === 'mm-go'){
    e.preventDefault();
    const id = t.dataset.to;
    ovClose(() => { const el = document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); });
    return;
  }
  if(a === 'theme'){ toggleTheme(); return; }
  if(a === 'anchor'){
    e.preventDefault();
    const el = document.getElementById(t.dataset.to);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    return;
  }
  if(a === 'role'){ setRole(t.dataset.r); return; }
  if(a === 'match'){ toggleMatch(); return; }
  if(a === 'top'){ e.preventDefault(); $('#site').scrollTo({top:0, behavior:'smooth'}); return; }
  if(a === 'noop'){ e.preventDefault(); return; }
});

document.addEventListener('submit', e => {
  const f = e.target.closest('.ov-f'); if(!f) return;
  e.preventDefault(); ovSubmit(f);
});
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && !ovEl().hidden) ovClose();
});
/* Repasser en grand écran ferme le menu mobile. */
window.addEventListener('resize', () => { if(innerWidth > 1060 && ovEl().dataset.kind === 'menu' && !ovEl().hidden) ovClose(); });
renderSite();

"use strict";
/* ============================================================
   TakaMatch — passerelle vitrine ↔ application
   Active seulement quand la page tourne dans la coquille
   TakaMatch.html (window.TM_SHELL). Les appels à l'action
   ouvrent l'onboarding par-dessus la vitrine ; « Se connecter »
   mène directement à la connexion.
   ============================================================ */
(function(){
  if(!window.TM_SHELL) return;
  const post = m => { try{ parent.postMessage(Object.assign({tm:1}, m), '*'); }catch(e){} };

  /* Liens internes « #… » : dans la coquille, ils ne doivent jamais
     recharger la page. On défile vers la section si elle existe. */
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]'); if(!a) return;
    e.preventDefault();
    if(a.dataset.act) return;
    const el = document.getElementById(a.getAttribute('href').slice(1));
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  }, true);

  /* Tous les appels à l'action ouvrent directement l'onboarding, sur son
     premier écran (Google, Apple ou e-mail), par-dessus la vitrine floutée.
     Le rôle d'une carte ou d'un bouton (« J'ai un talent »…) est conservé. */
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-act="open-onb"]'); if(!t) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const login = t.dataset.mode === 'login';
    const go = () => post({type:'open-onb', mode:login ? 'login' : 'signup', role:login ? undefined : t.dataset.role});
    if(!ovEl().hidden) ovClose(go); else go();
  }, true);

  /* « Rejoindre TakaMatch » : le rôle et l'adresse saisis passent à
     l'onboarding, qui en est la suite directe (DESIGN §8). */
  ovSubmit = function(form){
    const contact = form.contact.value.trim();
    if(!contact){ form.contact.focus(); return; }
    const opts = {type:'open-onb', mode:form.dataset.mode === 'login' ? 'login' : 'signup', role:form.dataset.role, contact};
    ovClose(() => post(opts));
  };
  signup = function(opts){ post(Object.assign({type:'open-onb'}, opts || {})); };

  /* Thème : un seul réglage pour tout le produit. */
  const _toggle = toggleTheme;
  toggleTheme = function(){ _toggle(); post({type:'theme', v:document.documentElement.getAttribute('data-theme')}); };

  addEventListener('message', e => {
    const d = e.data; if(!d || !d.tm || e.source !== parent) return;
    if(d.type === 'theme'){
      document.documentElement.setAttribute('data-theme', d.v);
      const st = document.getElementById('siteTheme'); if(st) st.innerHTML = ic(d.v === 'dark' ? 'sun' : 'moon');
    }
    if(d.type === 'toast') toast(d.msg, d.kind);
    if(d.type === 'focus'){ try{ (document.querySelector('.hd-cta') || document.body).focus({preventScroll:true}); }catch(err){} }
  });
  post({type:'ready', theme:document.documentElement.getAttribute('data-theme')});
})();
