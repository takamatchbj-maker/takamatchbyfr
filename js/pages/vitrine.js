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
  if(window.TMPrix) return TMPrix.cc();
  try{ const z = SITE_TZ[Intl.DateTimeFormat().resolvedOptions().timeZone]; if(z) return z; }catch(e){}
  const r = ((navigator.language || '').split('-')[1] || '').toUpperCase();
  return r || 'BJ';
})();
/* Pays hors zone mobile money FedaPay : on montre les moyens du Bénin + carte. */
function sitePayOps(){ return SITE_PAY[SITE_CC] || []; }
/* Prix dans la devise du visiteur (js/prix.js). */
/* Lancement : options offertes → « 0 FCFA » ; packs de crédits « Bientôt disponible ». */
const isFree = k => !!(window.TMPrix && TMPrix.isFree(k));
const creditsSoon = () => !!(window.TMPrix && TMPrix.creditsSoon());
const monthlyCredits = () => window.TMPrix ? TMPrix.monthly() : 5;
const priceTxt = k => window.TMPrix ? TMPrix.text(k, SITE_CC) : '';
const onceTxt = k => isFree(k) ? '' : ' une seule fois';
const priceAmt = (k, small) => { const r = window.TMPrix && TMPrix.get(k, SITE_CC); return r ? TMPrix.num(r.local)+'<small>'+esc(TMPrix.symbol(SITE_CC))+(small ? ' '+small : '')+'</small>' : ''; };
function sitePayList(card){
  const l = sitePayOps().map(x => x[0]).concat(card);
  return l.length > 1 ? l.slice(0, -1).join(', ')+' ou '+l[l.length - 1] : l[0];
}
function sitePayBadges(){
  return '<div class="momo" style="margin-top:auto">'+(creditsSoon() ? 'Bientôt via ' : 'via ')+TMPayIcons.row(sitePayOps().map(x => x[1]).concat('card'), 30)+'</div>';
}
/* ============================================================
   TakaMatch — page vitrine
   Page autonome : aucune dépendance externe hors les polices
   Google. Le seul point d'accroche à brancher est signup(), en
   bas de fichier : tous les appels à l'action y aboutissent.
   ============================================================ */

/* ---------- Icônes ---------- */
const P = {
  home:'<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  compass:'<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/>',
  rocket:'<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  chat:'<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>',
  tools:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/>',
  file:'<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  cog:'<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  bell:'<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon:'<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
  search:'<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  heart:'<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>',
  star:'<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  send:'<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  eye:'<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  'eye-off':'<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
  mail:'<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
  phone:'<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
  shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  zap:'<path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"/>',
  plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
  filter:'<path d="M2 5h20"/><path d="M6 12h12"/><path d="M9 19h6"/>',
  grid:'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  layers:'<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  copy:'<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  qr:'<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
  ext:'<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  trash:'<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  dl:'<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
  out:'<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
  arrow:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  spark:'<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  pin:'<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  award:'<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
  trend:'<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  edit:'<path d="M13 21h8"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
  image:'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  cal:'<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>',
  usercheck:'<path d="m16 11 2 2 4-4"/><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
  gift:'<path d="M12 7v14"/><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"/><rect x="3" y="7" width="18" height="4" rx="1"/>',
  card:'<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><path d="M6 14h2"/>',
  briefcase:'<path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  calendar:'<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
  quote:'<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
  ladder:'<path d="M5 21v-6"/><path d="M12 21V9"/><path d="M19 21V3"/>',
  refresh:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  flag:'<path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528"/>',
  chev:'<path d="m9 18 6-6-6-6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  back:'<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  book:'<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
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
function tick(){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'; }


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
  /* Première fois : la page se pose en haut. Ensuite (prix chargés…), mise à jour
     sur place : rien ne clignote et la lecture n'est pas ramenée en haut. */
  const first = !el.firstChild;
  TMMorph(el, siteHeader() + siteHero() + siteMarquee() + siteConviction() + siteHow() + siteRoles() + siteScore()
    + siteAtelier() + siteTrust() + siteCompare() + sitePricing() + siteFaq() + siteCta() + siteFooter());
  if(first) el.scrollTop = 0;
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



function sitePricing(){
  return '<section class="sec" id="tarifs"><div class="site-in">'
    + '<div class="sec-h mid">'
    +   '<h2>Pas d\'abonnement. Tu paies ce que tu consommes.</h2>'
    +   (creditsSoon()
          ? '<p>Explorer et publier ne coûte rien. Pendant le lancement, aucun paiement n\'est demandé : les options payantes sont offertes et les packs de crédits arrivent bientôt.</p></div>'
          : '<p>Explorer et publier ne coûte rien. Seule l\'invitation se paie — en crédits prépayés, réglés par mobile money ou carte.</p></div>')
    + '<div class="price">'
    +   '<div class="price-c pc-tal"><div class="lbl">Pour les Talents</div>'
    +     '<div class="amt">Gratuit<small>pour toujours</small></div>'
    +     '<p style="font-size:13.5px;line-height:1.6;color:var(--ink-2)">Explorer, publier ta fiche, postuler et discuter après un match. Sans limite, sans carte bancaire.</p>'
    +     '<button class="btn btn-tal btn-block" data-act="open-onb" data-role="tal" style="margin-top:auto">Créer ma fiche Talent</button></div>'
    +   '<div class="price-c pc-vis"><div class="lbl">Pour les Visionnaires</div>'
    +     '<div class="amt">'+monthlyCredits()+'<small>invitations offertes / mois</small></div>'
    +     '<p style="font-size:13.5px;line-height:1.6;color:var(--ink-2)">Publier ta fiche projet et explorer restent gratuits. Seul l\'envoi d\'une invitation consomme un crédit.</p>'
    +     '<button class="btn btn-vis btn-block" data-act="open-onb" data-role="vis" style="margin-top:auto">Publier mon projet</button></div>'
    +   '<div class="price-c'+(creditsSoon() ? ' pc-soon' : '')+'"><div class="lbl">Packs de crédits (pour les <span class="gold">Visionnaires</span>)'+(creditsSoon() ? ' <span class="soon-tag">'+esc(TMPrix.LAUNCH.soon)+'</span>' : '')+'</div>'
    +     '<div class="amt">'+priceAmt('credits_essai', 'pour 3 crédits d\'invitation')+'</div>'
    +     '<p style="font-size:13.5px;line-height:1.6;color:var(--ink-2)">10 crédits pour '+priceTxt('credits_elan')+', 30 crédits pour '+priceTxt('credits_campagne')+'. '+(creditsSoon() ? 'L\'achat de crédits ouvre bientôt.' : 'Réglés par '+sitePayList('carte bancaire')+'.')+'</p>'
    +     sitePayBadges()+'</div>'
    + '</div>'
    + '<div class="panel" style="margin-top:16px;padding:22px;display:flex;gap:14px;align-items:flex-start">'
    +   ic('info')+'<p style="font-size:13.5px;line-height:1.6;color:var(--ink-2)">Pourquoi faire payer l\'invitation&nbsp;? Si elle ne coûtait rien, chaque talent recevrait quarante messages génériques par semaine et n\'en lirait aucun. La rareté doit être du côté de celui qui sollicite — c\'est ce qui fait que les invitations reçues ici obtiennent une réponse.</p></div>'
    + '</div></section>';
}

/* Communauté WhatsApp TakaMatch. */
const WA_COMMUNAUTE = 'https://chat.whatsapp.com/IsCXiO0V7AF27BI5eqgvR4';

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
    +   '<a href="/cgu.html">Conditions générales</a>'
    +   '<a href="/confidentialite.html">Confidentialité</a>'
    +   '<a href="/mentions-legales.html">Mentions légales</a></div>'
    + '<div class="lnks"><div class="lbl" style="margin-bottom:4px">Suis-nous</div>'
    +   '<div class="ft-soc">' + FT_SOC.map(n => '<a class="fs fs-'+n[0]+'" href="'+SOCIAL_LINKS[n[0]]+'" target="_blank" rel="noopener" aria-label="TakaMatch sur '+n[1]+'" title="'+n[1]+'">'
    +     '<svg viewBox="'+SOCIAL_IC[n[0]].vb+'" aria-hidden="true">'+SOCIAL_IC[n[0]].p+'</svg></a>').join('') + '</div></div>'
    + '</div>'
    + '<p style="font-size:12.5px;color:var(--ink-3);margin-top:30px">© 2026 TakaMatch.</p>'
    + '</div></footer>';
}



const ARR = '<svg class="ic arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

function siteHero(){
  return '<section class="hero"><div class="hero-bg"><i class="b1"></i><i class="b2"></i><i class="b3"></i></div>'
    + '<div class="site-in"><div class="hero-in">'
    + '<span class="eyebrow hero-ey">'+'<svg class="hero-rk" viewBox="0 0 512 512" aria-hidden="true"><defs><linearGradient id="heroRkG" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#E2A70F"/><stop offset="1" stop-color="#007CD8"/></linearGradient></defs><path fill="url(#heroRkG)" d="M477.64 38.26a4.75 4.75 0 0 0-3.55-3.66c-58.57-14.32-193.9 36.71-267.22 110a317 317 0 0 0-35.63 42.1c-22.61-2-45.22-.33-64.49 8.07C52.38 218.7 36.55 281.14 32.14 308a9.64 9.64 0 0 0 10.55 11.2l87.31-9.63a194 194 0 0 0 1.19 19.7a19.53 19.53 0 0 0 5.7 12L170.7 375a19.6 19.6 0 0 0 12 5.7a194 194 0 0 0 19.59 1.19l-9.58 87.2a9.65 9.65 0 0 0 11.2 10.55c26.81-4.3 89.36-20.13 113.15-74.5c8.4-19.27 10.12-41.77 8.18-64.27a317.7 317.7 0 0 0 42.21-35.64C441 232.05 491.74 99.74 477.64 38.26M294.07 217.93a48 48 0 1 1 67.86 0a47.95 47.95 0 0 1-67.86 0"/><path fill="url(#heroRkG)" d="M168.4 399.43c-5.48 5.49-14.27 7.63-24.85 9.46c-23.77 4.05-44.76-16.49-40.49-40.52c1.63-9.11 6.45-21.88 9.45-24.88a4.37 4.37 0 0 0-3.65-7.45a60 60 0 0 0-35.13 17.12C50.22 376.69 48 464 48 464s87.36-2.22 110.87-25.75A59.7 59.7 0 0 0 176 403.09c.37-4.18-4.72-6.67-7.6-3.66"/></svg>'+'La Plateforme Africaine De Co-création De Valeur</span>'
    + '<h1><span class="ln"><span>Une idée seule ne suffit pas.</span></span>'
    +   '<span class="ln"><span class="g">Une compétence seule non plus.</span></span></h1>'
    + '<p class="lead">TakaMatch réunit ceux qui portent un projet et ceux qui ont les compétences pour le bâtir — '
    + 'comme cofondateurs, pas comme client et prestataire.</p>'
    + '<div class="hero-ctas">'
    +   '<button class="btn btn-lg btn-vis btn-fx magnet" data-act="open-onb" data-role="vis"><span class="emo" aria-hidden="true">💡</span>J\'ai une idée'+ARR+'</button>'
    +   '<button class="btn btn-lg btn-tal btn-fx magnet" data-act="open-onb" data-role="tal"><span class="emo" aria-hidden="true">🛠️</span>J\'ai un talent'+ARR+'</button>'
    + '</div>'
    + '<div class="trust-l"><span class="stack" aria-hidden="true"><i class="sv">V</i><i class="st">T</i><i class="sp">+</i></span>'
    +   '<span>Inscription en 4 minutes · '+(creditsSoon() ? 'Aucun paiement demandé' : 'Paiement '+sitePayList('carte'))+'</span></div>'
    + '<div class="figs">'
    +   fig('0 FCFA','pour s\'inscrire et explorer') + fig(String(monthlyCredits()),'invitations offertes chaque mois')
    +   fig('100 %','des identités vérifiables') + fig('OHADA','pacte d\'associés prêt à signer')
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
    +         '<div class="num tnum">'+monthlyCredits()+'<small>offertes / mois</small></div>'
    +         '<div class="gauge">'+'<i class="on"></i>'.repeat(monthlyCredits())+'</div>'
    +         '<p>Des invitations rares, donc sérieuses. '+(creditsSoon() ? 'Packs prépayés : bientôt disponibles.' : 'Ensuite, des packs prépayés via '+sitePayList('carte bancaire')+'.')+'</p></div>'
    +       '<div data-show="tal"><div class="lbl">Pour les talents</div>'
    +         '<div class="num tnum">0<small>'+esc(window.TMPrix ? TMPrix.symbol(SITE_CC) : 'FCFA')+', pour toujours</small></div>'
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
  const X = '<span class="b"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span>';
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
    ["Puis-je être visionnaire et talent à la fois ?","Oui. Un seul compte, deux profils indépendants : matchs, invitations, conversations et Ateliers restent séparés ; ton nom, ton e-mail, ta ville, ton sexe et ton niveau de confiance sont communs. Le premier profil est gratuit, "+(isFree('second') ? "le second se débloque pour "+priceTxt('second')+". " : "le second se débloque une fois pour "+priceTxt('second')+". ")+"Ensuite tu bascules sans limite depuis le menu de ton profil, et l'interface change de couleur pour que tu saches toujours où tu es."],
    ["Que voit-on de moi avant un match ?","Ton pseudo, tes compétences, ta ville, ton rythme, ta signature personnelle et ta photo, floutée. Ni ton nom, ni tes coordonnées. Sans photo, ce sont tes initiales sur ta couleur. Ton sexe (Masculin, Féminin ou Ne pas préciser) ne s'affiche qu'après le match et ne compte ni dans le score ni dans les filtres."],
    ["Qui peut voir ma fiche ?","Les talents ne voient que des fiches projet, les visionnaires que des fiches talent : jamais une fiche de ton propre camp. Depuis une fiche projet, un talent peut aussi ouvrir la fiche perso du visionnaire (« Voir sa fiche perso ») : tes compétences, ton parcours, ta signature. Un autre visionnaire ne la voit jamais. Côté visionnaire, tout se gère dans « Mes fiches », en deux onglets : « Fiche Projet » et « Ma fiche perso ». Quelqu'un sans compte qui arrive par le lien ou le code QR de ta fiche peut la lire, mais pas t'inviter ; il apparaît dans tes statistiques comme « visiteur non identifié ». La fiche perso n'a pas de statistiques : c'est ta fiche projet qui est suivie."],
    ["Un projet peut-il me rémunérer ?","Chaque visionnaire indique sur sa fiche ce qu'il propose aux talents : parts uniquement (des parts au capital, sans rémunération au départ), parts + petite rémunération (un défraiement dès le début) ou rémunération prévue (un revenu est prévu pour le cofondateur). Le filtre « Avec rémunération » t'aide à les trouver."],
    ["Mon idée risque-t-elle d'être copiée ?","Tu choisis ce que tu publies. Ta fiche présente le problème, la vision et ce qui bloque ; les détails sensibles se partagent après le match, dans l'Atelier, où chaque échange est horodaté dans le journal de décisions."],
    ["À quoi sert le pseudo ?","C'est ton identité publique avant le match : il figure sur ta fiche, dans la recherche et sur ton code QR. Choisis-en un qui te ressemble sans te nommer — c'est exactement ce qu'il protège."],
    ["Comment faire vérifier mon profil ?","Depuis tes paramètres : une pièce d'identité et un selfie suffisent. Ils sont supprimés après 30 jours ; seul le palier « Identité vérifiée » reste affiché sur ta fiche."],
    ["Pourquoi mon nom est-il verrouillé après l'inscription ?","Parce qu'un engagement de cofondation doit être opposable. Ton nom légal reste privé, mais il ne change pas — c'est ce qui rend les documents signés dans l'Atelier valables."],
    ["Qu'est-ce qui se passe si personne ne répond ?","Une invitation sans réponse expire au bout de 10 jours. Le crédit dépensé n'est pas rendu : chaque profil affiche donc son délai de réponse habituel, pour que tu saches à quoi t'attendre avant de dépenser un crédit."],
    ["Combien de projets puis-je porter ou rejoindre ?","Un visionnaire porte jusqu'à 3 projets : la première fiche projet est incluse, chaque emplacement de plus coûte "+priceTxt('slot')+onceTxt('slot')+" et reste acquis même si tu supprimes la fiche. Un talent rejoint au plus 3 projets à la fois ; pour en rejoindre un autre, il doit d'abord « Quitter le projet » dans l'un des trois."],
    ["Le pacte d'associés est-il un vrai document ?","Oui. C'est un modèle de droit OHADA prérempli depuis vos décisions, relu par un juriste avant de vous être remis. Il ne remplace pas un conseil personnalisé, mais il vaut infiniment mieux qu'un contrat copié sur Internet."],
  ];
  return '<section class="sec" id="faq"><div class="site-in"><div class="faqg">'
    + '<div class="sec-h">'
    +   '<span class="eyebrow">Questions fréquentes</span>'
    +   '<h2>Tout ce qu\'il faut savoir.</h2>'
    +   '<p>Une autre question ? L\'équipe répond aussi sur la <a href="'+WA_COMMUNAUTE+'" target="_blank" rel="noopener">communauté WhatsApp</a>.</p></div>'
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
  if(!ov.hidden && ov.dataset.kind === kind){ TMMorph(win, html); return; }
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
    + '<p class="ov-n">Inscription en 4 minutes · '+(creditsSoon() ? 'Aucun paiement demandé' : 'Paiement '+sitePayList('carte'))+'</p>'
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
/* Prix modifiés dans l'admin : la page se remet à jour toute seule. */
window.addEventListener('tm-prix', () => { try{ renderSite(); }catch(e){} });

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
