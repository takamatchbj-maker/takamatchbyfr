/* ============================================================
   TakaMatch — main.js (chargé en premier sur les 3 pages)
   1. Mode « plusieurs pages » : les espaces se parlent par messages.
   2. TMGuard : écran de chargement, erreurs, requêtes robustes.
   3. Navigation entre index.html, inscription.html et app.html.
   ============================================================ */
window.TM_SHELL = true;

(function(){
  'use strict';
  var booted = false, failed = false, bar = null, errors = [];
  var G = window.TMGuard = {errors: errors, onError: null};

  function dark(){
    var t = document.documentElement.getAttribute('data-theme');
    if(!t){ try{ t = localStorage.getItem('tm-theme'); }catch(e){} }
    if(t === 'dark' || t === 'light') return t === 'dark';
    return !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function boot(){ return document.getElementById('tmgBoot'); }

  /* Erreurs sans intérêt pour l'utilisateur. */
  function noise(msg){ return /ResizeObserver loop|^Script error\.?$/i.test(String(msg || '')); }

  function record(err, where){
    var e = {at: Date.now(), where: where || 'page', message: String((err && err.message) || err), stack: err && err.stack ? String(err.stack).slice(0, 2000) : ''};
    errors.push(e); if(errors.length > 20) errors.shift();
    try{ console.error('[TakaMatch]', where || '', err); }catch(_){}
    try{ if(typeof G.onError === 'function') G.onError(e); }catch(_){}
    return e;
  }

  /* Panneau « ça n'a pas marché » : remplace un écran blanc. */
  G.panel = function(err, title, text, actions){
    var e = err ? (err.message || String(err)) : '';
    return '<div class="tmg-in" role="alert"><h2>'+esc(title || 'Cette page n\'a pas pu s\'afficher')+'</h2>'
      + '<p>'+esc(text || 'Un problème technique nous empêche d\'afficher la page. Tes données ne sont pas perdues.')+'</p>'
      + '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">'+(actions || '')
      + '<button class="tmg-btn" type="button" onclick="location.reload()">Recharger la page</button></div>'
      + (e ? '<details><summary>Détail technique</summary><pre>'+esc(e)+'</pre></details>' : '')+'</div>';
  };

  function showBar(msg, offline){
    if(!document.body) return;
    if(!bar){
      bar = document.createElement('div'); bar.className = 'tmg-bar'; bar.setAttribute('role', 'alert');
      bar.innerHTML = '<span></span><button class="tmg-btn" type="button">Recharger</button><button class="x" type="button" aria-label="Fermer">×</button>';
      bar.querySelector('.tmg-btn').onclick = function(){ location.reload(); };
      bar.querySelector('.x').onclick = function(){ bar.hidden = true; };
      document.body.appendChild(bar);
    }
    bar.classList.toggle('off', !!offline);
    bar.querySelector('span').textContent = msg;
    bar.hidden = false;
  }
  G.notify = function(msg){ showBar(msg, false); };
  /* Note une erreur déjà gérée par la page (sans afficher de bandeau). */
  G.log = function(err, where){ return record(err, where); };

  /* Une erreur avant la fin du chargement → panneau plein écran.
     Une erreur après → bandeau discret, la page reste utilisable. */
  G.crash = function(err, where){
    if(noise(err && err.message || err)) return;
    record(err, where);
    var b = boot();
    if(!booted && b){
      failed = true;
      b.hidden = false; b.className = 'tmg-boot err' + (dark() ? ' dark' : '');
      b.innerHTML = G.panel(err);
    } else {
      showBar('Oups, quelque chose n\'a pas marché. Ta dernière action n\'a peut-être pas été prise en compte.');
    }
  };
  window.addEventListener('error', function(ev){
    if(ev && ev.target && ev.target !== window) return;   /* image ou fichier manquant : géré localement */
    G.crash(ev.error || ev.message, 'erreur');
  });
  window.addEventListener('unhandledrejection', function(ev){ G.crash(ev.reason || 'Promesse rejetée', 'promesse'); });

  /* Fin du chargement : on retire l'écran d'attente, sauf si la page a planté. */
  G.ready = function(){
    if(booted) return; booted = true;
    var b = boot(); if(b && !failed) b.remove();
  };
  document.addEventListener('DOMContentLoaded', function(){
    var b = boot(); if(b && dark()) b.classList.add('dark');
    if(!window.TMG_MANUAL) setTimeout(G.ready, 0);   /* la coquille, elle, attend que la vitrine soit prête */
  });
  /* Filet : si rien ne s'affiche au bout de 15 s, on le dit. */
  setTimeout(function(){
    var b = boot();
    if(!booted && b && !failed){ b.classList.add('err'); b.innerHTML = G.panel(null, 'C\'est plus long que prévu', 'La page met du temps à se charger. Vérifie ta connexion, puis recharge.'); }
  }, 15000);

  /* Hors connexion : bandeau, sauf si la page a déjà le sien (#offline). */
  function syncNet(){
    if(document.getElementById('offline')) return;
    if(navigator.onLine === false) showBar('Tu es hors connexion. Ce que tu fais maintenant ne sera envoyé qu\'au retour du réseau.', true);
    else if(bar && bar.classList.contains('off')) bar.hidden = true;
  }
  window.addEventListener('online', syncNet); window.addEventListener('offline', syncNet);
  document.addEventListener('DOMContentLoaded', syncNet);

  /* ---------- Requêtes réseau robustes ----------
     TMGuard.fetch(url, options, {timeout, retries})
     → renvoie le JSON, ou lève une Error avec un message lisible
       (err.kind : 'offline' | 'timeout' | 'network' | 'http', err.status).
     Les nouvelles tentatives ne concernent que les pannes (réseau, 408,
     429, 5xx) — jamais un refus du serveur (400, 401, 409…). */
  function mk(kind, message, status, data){ var e = new Error(message); e.kind = kind; e.status = status || 0; e.data = data; return e; }
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  var HTTP_MSG = {401:'Ta session a expiré. Reconnecte-toi.', 403:'Tu n\'as pas accès à cette action.', 404:'Élément introuvable.',
    408:'Le serveur met trop de temps à répondre.', 429:'Trop de demandes d\'un coup. Patiente quelques secondes.'};
  G.fetch = async function(url, opts, cfg){
    cfg = cfg || {}; var timeout = cfg.timeout || 15000, retries = cfg.retries || 0, last;
    for(var attempt = 0; ; attempt++){
      if(navigator.onLine === false){
        last = mk('offline', 'Pas de connexion internet. Vérifie ton réseau puis réessaie.');
      } else {
        var ctl = window.AbortController ? new AbortController() : null, tm = ctl ? setTimeout(function(){ ctl.abort(); }, timeout) : 0, r, data;
        try{
          r = await fetch(url, Object.assign({}, opts || {}, ctl ? {signal: ctl.signal} : {}));
          data = await r.json().catch(function(){ return {}; });
        }catch(e){
          last = e && e.name === 'AbortError'
            ? mk('timeout', 'Le serveur met trop de temps à répondre. Réessaie dans un instant.')
            : mk('network', 'Impossible de joindre le serveur. Vérifie ta connexion puis réessaie.');
        }finally{ clearTimeout(tm); }
        if(r){
          if(r.ok) return data;
          last = mk('http', (data && data.error) || HTTP_MSG[r.status] || (r.status >= 500 ? 'Le service est momentanément indisponible. Réessaie dans un instant.' : 'La demande a été refusée.'), r.status, data);
          if(!(r.status >= 500 || r.status === 408 || r.status === 429)) throw last;
        }
      }
      if(attempt >= retries) throw last;
      await sleep(Math.min(8000, 700 * Math.pow(2, attempt)) + Math.random() * 300);
    }
  };

  /* Petit identifiant unique (clés d'idempotence…). */
  G.uid = function(){
    try{ if(crypto.randomUUID) return crypto.randomUUID(); }catch(e){}
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  };
})();

/* ============================================================
   Navigation entre les pages
   Chaque page envoie ses demandes (« ouvrir l'inscription »,
   « inscription terminée », « déconnexion »…) par un message.
   Ce routeur les reçoit et ouvre la bonne page en transmettant
   ce qu'il faut (rôle choisi, compte créé, petit message).

   ⚠ Prototype : les comptes sont gardés dans CE navigateur
   (localStorage). Ils ne sont pas partagés entre appareils ni
   visibles par l'équipe tant qu'il n'y a pas de vraie base de
   données côté serveur.
   ============================================================ */
(function(){
  'use strict';
  var PAGE = document.documentElement.getAttribute('data-page') || 'site';
  var URL_OF = {site:'index.html', onb:'inscription.html', app:'app.html'};

  function readJSON(store, key, fallback){
    try{ var v = JSON.parse(store.getItem(key)); return v == null ? fallback : v; }catch(e){ return fallback; }
  }
  function writeJSON(store, key, value){
    try{ store.setItem(key, JSON.stringify(value)); return true; }catch(e){ return false; }
  }
  function drop(store, key){ try{ store.removeItem(key); }catch(e){} }
  var LS = (function(){ try{ return window.localStorage; }catch(e){ return null; } })();
  var SS = (function(){ try{ return window.sessionStorage; }catch(e){ return null; } })();
  var mem = {};  /* si le stockage est bloqué (navigation privée stricte) */
  var memStore = {getItem:function(k){ return k in mem ? mem[k] : null; }, setItem:function(k, v){ mem[k] = String(v); }, removeItem:function(k){ delete mem[k]; }};
  LS = LS || memStore; SS = SS || memStore;

  /* Comptes créés dans ce navigateur, par e-mail. */
  function accounts(){ return readJSON(LS, 'tm-accounts', {}); }
  function saveAccounts(a){
    if(!writeJSON(LS, 'tm-accounts', a)){
      /* Trop lourd (photo) : on retente sans les photos. */
      Object.keys(a).forEach(function(k){ var x = a[k]; if(x.onb) x.onb.photo = ''; if(x.tool) x.tool.photo = ''; });
      writeJSON(LS, 'tm-accounts', a);
    }
  }

  function send(msg){ window.postMessage(Object.assign({tm:1}, msg), /^https?:$/.test(location.protocol) ? location.origin : '*'); }
  function goTo(page, replace){
    var url = URL_OF[page];
    if(replace) location.replace(url); else location.href = url;
  }
  function flash(msg){ writeJSON(SS, 'tm-flash', msg); }

  /* ---------- La page vient de démarrer ---------- */
  function onReady(){
    if(PAGE === 'site'){
      var f = readJSON(SS, 'tm-flash', null);
      if(f){ drop(SS, 'tm-flash'); send({type:'toast', msg:f, kind:'ok'}); }
    }
    if(PAGE === 'onb'){
      var o = readJSON(SS, 'tm-onb-open', null); drop(SS, 'tm-onb-open');
      if(!o){
        var q = new URLSearchParams(location.search);
        o = {mode:q.get('mode') === 'login' ? 'login' : 'signup', role:q.get('role') || undefined};
      }
      send({type:'open', mode:o.mode, role:o.role, contact:o.contact});
    }
    if(PAGE === 'app'){
      var s = readJSON(SS, 'tm-session', null), acc;
      if(s && s.acc){
        acc = s.acc;
        var a = accounts()[s.key];
        if(a && a.tool && acc.kind === 'fresh'){ acc = Object.assign({}, acc, {tool:a.tool, onb:a.onb}); }
        /* Au rechargement : pas de second message de bienvenue. */
        writeJSON(SS, 'tm-session', {key:s.key, acc:Object.assign({}, s.acc, {welcome:undefined, view:'accueil'})});
      } else {
        acc = {kind:'demo', email:'', view:'accueil', welcome:'Bienvenue dans le compte de démonstration.'};
      }
      send({type:'account', acc:acc});
      /* Bouton « retour » du navigateur : on reste dans l'outil et on remonte à l'accueil. */
      try{ history.pushState({tm:'app'}, ''); }catch(e){}
      window.addEventListener('popstate', function(){
        try{ history.pushState({tm:'app'}, ''); }catch(e){}
        send({type:'back'});
      });
    }
  }

  /* ---------- Fin de l'inscription ou connexion ---------- */
  function onboardingDone(d){
    var email = (d.ident || '').trim(), k = email.toLowerCase(), acc, all = accounts();
    if(d.login){
      var a = all[k];
      if(a){
        var first = (a.tool && a.tool.first) || (a.onb && a.onb.first) || '';
        acc = {kind:'fresh', email:a.email, onb:a.onb, tool:a.tool, view:'accueil',
          welcome:'Content de te revoir' + (first ? ', ' + first : '') + '.'};
      } else {
        k = 'demo:' + k;
        acc = {kind:'demo', email:email, view:'accueil', welcome:'Bienvenue dans le compte de démonstration.'};
      }
    } else {
      all[k] = {email:email, onb:d.me, tool:null}; saveAccounts(all);
      /* « Découvrir les projets / les talents » : on arrive dans Explorer. */
      acc = {kind:'fresh', email:email, onb:d.me, view:'explorer'};
    }
    if(!writeJSON(SS, 'tm-session', {key:k, acc:acc})){
      if(acc.onb) acc.onb = Object.assign({}, acc.onb, {photo:''});
      writeJSON(SS, 'tm-session', {key:k, acc:acc});
    }
    goTo('app', true);
  }

  /* ---------- Messages envoyés par la page ---------- */
  window.addEventListener('message', function(e){
    var d = e.data; if(!d || !d.tm || e.source !== window) return;
    switch(d.type){
      case 'ready': onReady(); break;
      case 'theme': try{ LS.setItem('tm-theme', d.v); }catch(err){} break;
      case 'open-onb':
        writeJSON(SS, 'tm-onb-open', {mode:d.mode, role:d.role, contact:d.contact});
        goTo('onb'); break;
      case 'onb-close':
        if(document.referrer && document.referrer.indexOf(location.host) > -1 && history.length > 1) history.back();
        else goTo('site');
        break;
      case 'onb-done': onboardingDone(d); break;
      case 'logout':
        var s = readJSON(SS, 'tm-session', null);
        if(s && d.me){ var all = accounts(); if(all[s.key]){ all[s.key].tool = d.me; saveAccounts(all); } }
        drop(SS, 'tm-session'); flash('Tu es déconnecté. À bientôt sur TakaMatch.'); goTo('site', true); break;
      case 'deleted':
        var s2 = readJSON(SS, 'tm-session', null);
        if(s2){ var all2 = accounts(); delete all2[s2.key]; saveAccounts(all2); }
        drop(SS, 'tm-session'); flash('Ton compte a été supprimé.'); goTo('site', true); break;
    }
  });
})();
