/* ============================================================
   TakaMatch — garde « maintenance »
   ------------------------------------------------------------
   Chargé tout en haut des pages publiques (index, inscription,
   app, profil), juste après supabase.js. Lit le réglage
   app_settings › maintenance (lisible sans être connecté) :
   · maintenance active → envoie vers maintenance.html?retour=…
   · maintenance programmée (starts_at) → bandeau de préavis avec
     compte à rebours, puis bascule à l'heure dite ;
   · revérifie toutes les 60 s et au retour sur l'onglet, pour que
     les membres déjà connectés soient prévenus eux aussi.
   Portée « app » : seules l'inscription et l'outil sont fermés,
   la vitrine et les fiches publiques restent ouvertes.

   Équipe : l'espace équipe pose un laissez-passer sur ce navigateur
   (localStorage « tm-maint-pass ») ; on peut alors parcourir le site
   pendant la maintenance, avec un petit rappel en bas de l'écran.
   Ce n'est pas une protection : les données restent protégées par
   les règles de la base. La maintenance sert à tenir les visiteurs
   à l'écart pendant les travaux.
   ============================================================ */
(function(){
  'use strict';
  var PAGE = document.documentElement.getAttribute('data-page') || 'site';
  var URL_ = (window.TMDB && TMDB.url) || 'https://ucxeopgigfzmuqzuzynr.supabase.co';
  var KEY = (window.TMDB && TMDB.key) || 'sb_publishable_j-dzjIrf_94H7f0Ogg_QkQ_sGlLjW-R';
  var CACHE = 'tm-maint', TTL = 90 * 1000, EVERY = 60 * 1000;
  if(/maintenance\.html$/.test(location.pathname)) return;

  var ms = function(s){ var t = s ? Date.parse(s) : NaN; return isNaN(t) ? 0 : t; };
  function store(){ try{ return window.sessionStorage; }catch(e){ return null; } }
  function cached(){ try{ var c = JSON.parse(store().getItem(CACHE) || 'null'); return c && Date.now() - c.at < TTL ? c.v : undefined; }catch(e){ return undefined; } }
  function keep(v){ try{ store().setItem(CACHE, JSON.stringify({v:v, at:Date.now()})); }catch(e){} }
  function pass(){ try{ return Number(localStorage.getItem('tm-maint-pass') || 0) > Date.now(); }catch(e){ return false; } }
  /* Cette page est-elle fermée par ce réglage ? */
  function closes(v){ return !!(v && v.active) && (v.scope !== 'app' || PAGE === 'onb' || PAGE === 'app'); }

  function go(){
    var here = location.pathname.split('/').pop() + location.search + location.hash;
    location.replace('maintenance.html' + (here ? '?retour=' + encodeURIComponent('/' + here.replace(/^\//, '')) : ''));
  }

  /* ---------- Bandeaux ---------- */
  var css = false, bar = null, tick = 0;
  function addCss(){
    if(css) return; css = true;
    var s = document.createElement('style');
    s.textContent = '.tmm-bar{position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:2147482990;width:min(600px,calc(100vw - 24px));display:flex;align-items:center;gap:12px;'
      + 'padding:11px 12px 11px 14px;border-radius:12px;background:#F5EDDC;color:#7D5715;font:500 13.5px/1.45 Inter,-apple-system,"Segoe UI",Roboto,sans-serif;'
      + 'box-shadow:0 12px 32px -12px rgba(31,30,27,.35);animation:tmmIn .3s cubic-bezier(.22,1,.36,1) both}'
      + '.tmm-bar b{font-weight:600}.tmm-bar .tmm-t{flex:1;min-width:0}.tmm-bar .tmm-c{font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace;font-weight:600;background:rgba(176,125,46,.16);padding:3px 8px;border-radius:6px;white-space:nowrap}'
      + '.tmm-bar button{appearance:none;border:0;background:transparent;color:inherit;font-size:18px;line-height:1;cursor:pointer;padding:4px 6px;border-radius:6px}'
      + '.tmm-bar button:hover{background:rgba(176,125,46,.14)}'
      + '.tmm-bar svg{width:20px;height:20px;flex:0 0 auto}'
      + '.tmm-staff{top:auto;bottom:14px;background:#1F1E1B;color:#F4F1EA;width:auto;max-width:calc(100vw - 24px);padding:8px 10px 8px 14px;font-size:12.5px}'
      + '.tmm-staff .tmm-dot{width:8px;height:8px;border-radius:50%;background:#D2A44E;flex:0 0 auto}'
      + '.tmm-staff button:hover{background:rgba(255,255,255,.12)}'
      + ':root[data-theme="dark"] .tmm-bar:not(.tmm-staff){background:#2C2312;color:#E0BC77}'
      + '@keyframes tmmIn{from{opacity:0;transform:translate(-50%,-8px)}to{opacity:1;transform:translate(-50%,0)}}'
      + '@media (prefers-reduced-motion:reduce){.tmm-bar{animation:none}}';
    (document.head || document.documentElement).appendChild(s);
  }
  function hide(){ clearInterval(tick); if(bar){ bar.remove(); bar = null; } }
  function show(html, cls, closable){
    if(!document.body){ document.addEventListener('DOMContentLoaded', function(){ show(html, cls, closable); }); return; }
    addCss();
    if(!bar){ bar = document.createElement('div'); bar.setAttribute('role', 'status'); document.body.appendChild(bar); }
    bar.className = 'tmm-bar ' + (cls || '');
    bar.innerHTML = html + (closable ? '<button type="button" aria-label="Masquer">×</button>' : '');
    var x = bar.querySelector('button'); if(x) x.onclick = function(){ try{ store().setItem('tmm-hide', bar.dataset.k || '1'); }catch(e){} hide(); };
  }
  function countdown(t){
    var s = Math.max(0, Math.round((t - Date.now()) / 1000)), m = Math.floor(s / 60);
    return m >= 60 ? Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') : m + ':' + String(s % 60).padStart(2, '0');
  }
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 1.9"/></svg>';

  /* Préavis : la maintenance commence bientôt. */
  function warn(v, start){
    var k = 'w' + start, hidden = false; try{ hidden = store().getItem('tmm-hide') === k; }catch(e){}
    var d = new Date(start), at = d.getHours() + ' h ' + String(d.getMinutes()).padStart(2, '0');
    var txt = PAGE === 'app' ? 'Pense à enregistrer ce que tu es en train d\'écrire.' : 'Le site sera indisponible quelques instants.';
    function paint(){
      if(Date.now() >= start){ hide(); return check(true); }
      if(hidden && start - Date.now() > 60000) return;          /* masqué : il revient pour la dernière minute */
      show(ICON + '<span class="tmm-t"><b>Maintenance à ' + at + '.</b> ' + txt + '</span><span class="tmm-c">' + countdown(start) + '</span>', '', start - Date.now() > 60000);
      if(bar) bar.dataset.k = k;
    }
    clearInterval(tick); paint(); tick = setInterval(paint, 1000);
  }

  /* ---------- Décision ---------- */
  function apply(v){
    if(!closes(v)){ hide(); return; }
    var start = ms(v.starts_at);
    if(pass()){
      clearInterval(tick);
      show('<span class="tmm-dot" aria-hidden="true"></span><span class="tmm-t">' + (start > Date.now() ? 'Maintenance programmée' : 'Maintenance en cours')
        + ' · tu vois le site car tu es de l\'équipe.</span>', 'tmm-staff', true);
      return;
    }
    if(start > Date.now()) return warn(v, start);
    go();
  }

  var busy = false;
  function check(force){
    var c = force ? undefined : cached();
    if(c !== undefined) return apply(c);
    if(busy) return; busy = true;
    var ctl = window.AbortController ? new AbortController() : null, tm = ctl ? setTimeout(function(){ ctl.abort(); }, 6000) : 0;
    fetch(URL_ + '/rest/v1/app_settings?key=eq.maintenance&select=value', {headers:{apikey:KEY}, cache:'no-store', signal:ctl ? ctl.signal : undefined})
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(rows){ if(!rows) return; var v = (rows[0] && rows[0].value) || null; keep(v); apply(v); })
      .catch(function(){ /* réseau coupé ou réglage absent : on laisse passer */ })
      .then(function(){ clearTimeout(tm); busy = false; });
  }

  /* Dernier réglage connu (moins de 90 s) : décision immédiate, sans attendre le réseau. */
  var fromWait = /maintenance\.html/.test(document.referrer || '');
  var first = fromWait ? undefined : cached();
  if(first !== undefined && closes(first) && !pass() && !(ms(first.starts_at) > Date.now())){ go(); return; }
  check(true);
  setInterval(function(){ if(!document.hidden) check(true); }, EVERY);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) check(); });

  window.TMMaintenance = {check:function(){ check(true); }};
})();
