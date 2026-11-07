/* ============================================================
   TakaMatch · Mesure de la vitesse réelle (Core Web Vitals)
   ------------------------------------------------------------
   Mesure ce que vivent vraiment les visiteurs, sur leur téléphone
   et leur connexion : LCP (affichage du contenu principal), FCP
   (premier affichage), TTFB (réponse du serveur), INP (réactivité
   aux clics), CLS (stabilité de la page), type de connexion.
   Une ligne est envoyée quand la page passe en arrière-plan.
   Aucune donnée personnelle : ni compte, ni adresse IP stockée.
   Lecture dans l'espace équipe : Vue d'ensemble → Vitesse réelle.
   Base : perf_log / admin_perf (supabase/34_vitesse_reelle.sql).
   ============================================================ */
(function(){
  'use strict';
  if(!/(^|\.)takamatch\.com$/.test(location.hostname) || !window.PerformanceObserver || !window.fetch) return;
  var page = (document.documentElement.getAttribute('data-page') || '').toLowerCase();
  if(!page){ var p = location.pathname; page = /inscription/.test(p) ? 'inscription' : /profil/.test(p) ? 'profil' : /app/.test(p) ? 'app' : 'vitrine'; }
  page = {site:'vitrine', index:'vitrine', onb:'inscription'}[page] || page;
  var M = {lcp:null, fcp:null, ttfb:null, inp:0, cls:0}, sent = false;
  function obs(type, fn){ try{ new PerformanceObserver(function(l){ l.getEntries().forEach(fn); }).observe({type:type, buffered:true}); }catch(e){} }
  obs('largest-contentful-paint', function(e){ M.lcp = Math.round(e.startTime); });
  obs('paint', function(e){ if(e.name === 'first-contentful-paint') M.fcp = Math.round(e.startTime); });
  obs('layout-shift', function(e){ if(!e.hadRecentInput) M.cls += e.value; });
  obs('event', function(e){ if(e.interactionId && e.duration > M.inp) M.inp = Math.round(e.duration); });
  try{ var n = performance.getEntriesByType('navigation')[0]; if(n) M.ttfb = Math.round(n.responseStart); }catch(e){}
  function send(){
    if(sent || M.fcp == null) return; sent = true;
    var c = navigator.connection || {}, body = {p:{page:page, lcp:M.lcp, fcp:M.fcp, ttfb:M.ttfb, inp:M.inp, cls:Math.round(M.cls * 1000) / 1000,
      conn:c.effectiveType || '', mem:navigator.deviceMemory || null, mobile:/Mobi|Android/i.test(navigator.userAgent)}};
    var DB = window.TMDB; if(!DB || !DB.url || !DB.key) return;
    try{ fetch(DB.url + '/rest/v1/rpc/perf_log', {method:'POST', keepalive:true,
      headers:{'Content-Type':'application/json', apikey:DB.key}, body:JSON.stringify(body)}); }catch(e){}
  }
  addEventListener('visibilitychange', function(){ if(document.visibilityState === 'hidden') send(); });
  addEventListener('pagehide', send);
})();
