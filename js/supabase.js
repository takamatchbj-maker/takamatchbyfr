/* ============================================================
   TakaMatch — connexion à la base de données (Supabase)
   ------------------------------------------------------------
   Petit client maison : il parle directement à l'API Supabase
   (comptes, tables, fichiers), sans bibliothèque externe.

   La clé ci-dessous est la clé PUBLIQUE (« publishable ») : elle
   est faite pour être visible dans le site. Ce qui protège les
   données, ce sont les règles d'accès définies dans la base.
   Ne JAMAIS mettre ici la clé secrète (service_role / secret).
   ============================================================ */
(function(){
  'use strict';
  var SB_URL = 'https://ucxeopgigfzmuqzuzynr.supabase.co';
  var SB_KEY = 'sb_publishable_j-dzjIrf_94H7f0Ogg_QkQ_sGlLjW-R';
  /* L'admin garde sa propre session (window.TM_SB_SKEY), séparée de celle des membres. */
  var SKEY = window.TM_SB_SKEY || 'tm-sb-session';

  /* ---------- Contrôle anti-robot (Cloudflare Turnstile) ----------
     Clé de SITE Turnstile (publique, faite pour être visible ici).
     Vide = contrôle désactivé. Mise en route :
       1. Cloudflare → Turnstile → ajouter le site takamatch.com → copier la clé de site ici ;
       2. publier le site ;
       3. Supabase → Authentication → Attack Protection → activer le captcha
          « Turnstile » et coller la clé SECRÈTE (jamais ici).
     Le contrôle est le plus souvent invisible ; une case n'apparaît en bas
     de l'écran que si Cloudflare a un doute. */
  var TURNSTILE_SITE_KEY = '0x4AAAAAAF2ArQhIiPS2kqIe';
  var ts = {load:null, id:null, box:null};
  function tsLoad(){
    if(window.turnstile) return Promise.resolve();
    if(!ts.load) ts.load = new Promise(function(res, rej){
      var s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; s.async = true;
      s.onload = function(){ res(); };
      s.onerror = function(){ ts.load = null; rej(new Error('Le contrôle anti-robot n\'a pas pu se charger. Vérifie ta connexion puis réessaie.')); };
      document.head.appendChild(s);
    });
    return ts.load;
  }
  /* Renvoie un jeton à usage unique (ou null si le contrôle est désactivé). */
  async function captcha(){
    /* Le widget n'est autorisé que sur takamatch.com : ailleurs (copie locale…), pas de contrôle. */
    if(!TURNSTILE_SITE_KEY || !/(^|\.)takamatch\.com$/.test(location.hostname)) return null;
    await tsLoad();
    return new Promise(function(res, rej){
      if(!ts.box){
        ts.box = document.createElement('div');
        ts.box.className = 'tm-captcha';
        ts.box.style.cssText = 'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483000';
        document.body.appendChild(ts.box);
      }
      var done = false, tm = setTimeout(function(){ end(null, 'Le contrôle anti-robot prend trop de temps. Réessaie.'); }, 120000);
      function end(tok, msg){
        if(done) return; done = true; clearTimeout(tm);
        try{ if(ts.id !== null) window.turnstile.remove(ts.id); }catch(e){} ts.id = null;
        if(msg) rej(new Error(msg)); else res(tok);
      }
      try{
        ts.id = window.turnstile.render(ts.box, {
          sitekey:TURNSTILE_SITE_KEY, action:'auth', language:'fr', appearance:'interaction-only',
          callback:function(t){ end(t); },
          'error-callback':function(){ end(null, 'Le contrôle anti-robot a échoué. Recharge la page puis réessaie.'); return true; },
          'timeout-callback':function(){ end(null, 'Le contrôle anti-robot a expiré. Réessaie.'); }
        });
      }catch(e){ end(null, 'Le contrôle anti-robot n\'a pas pu démarrer. Recharge la page puis réessaie.'); }
    });
  }
  function withCaptcha(body, tok){
    if(tok) body.gotrue_meta_security = {captcha_token:tok};
    return body;
  }
  var DISPOSABLE = 'Les adresses e-mail temporaires ne sont pas acceptées. Utilise ton adresse personnelle ou professionnelle.';

  /* ---------- Session (gardée dans ce navigateur) ---------- */
  var session = null;
  try{ session = JSON.parse(localStorage.getItem(SKEY)); }catch(e){}
  function setSession(s){
    session = s || null;
    try{ if(s) localStorage.setItem(SKEY, JSON.stringify(s)); else localStorage.removeItem(SKEY); }catch(e){}
  }
  /* Autre onglet : jetons renouvelés → on les reprend ; déconnexion → l'outil se ferme ici aussi. */
  try{
    addEventListener('storage', function(e){
      if(e.key !== SKEY) return;
      var had = !!session;
      try{ session = e.newValue ? JSON.parse(e.newValue) : null; }catch(err){ session = null; }
      if(had && !session){
        if(/\/app(\.html)?$/.test(location.pathname)) location.replace('/');
        else if(/\/admin(\.html)?$/.test(location.pathname)) location.reload();
      }
    });
  }catch(e){}
  function fromTokens(t, user){
    var now = Math.floor(Date.now() / 1000);
    return {access_token:t.access_token, refresh_token:t.refresh_token,
      expires_at:Number(t.expires_at) || (now + Number(t.expires_in || 3600)), user:user || t.user || null};
  }

  /* ---------- Messages d'erreur lisibles ---------- */
  var MSG = {
    otp_expired:'Ce code a expiré ou n\'est pas le bon. Demande un nouveau code.',
    otp_disabled:'Aucun compte n\'existe avec cette adresse. Crée ton compte d\'abord.',
    signup_disabled:'Aucun compte n\'existe avec cette adresse. Crée ton compte d\'abord.',
    over_email_send_rate_limit:'Trop de codes demandés. Patiente une minute avant de réessayer.',
    over_request_rate_limit:'Trop de demandes d\'un coup. Patiente quelques secondes.',
    email_address_invalid:'Cette adresse e-mail n\'est pas acceptée.',
    validation_failed:'Les informations envoyées ne sont pas valides.',
    '23505':'Cette valeur est déjà utilisée.',
    '23514':'Une des informations ne respecte pas le format attendu.',
    '42501':'Tu n\'as pas le droit de faire cette action.',
    PGRST301:'Ta session a expiré. Reconnecte-toi.',
    invalid_credentials:'Identifiant ou mot de passe incorrect.',
    weak_password:'Ce mot de passe est trop faible. Choisis-en un plus long et plus varié.',
    same_password:'Le nouveau mot de passe doit être différent de l\'actuel.',
    reauthentication_needed:'Pour des raisons de sécurité, déconnecte-toi puis reconnecte-toi avant de changer ton mot de passe.',
    user_banned:'Ce compte est suspendu ou fermé par l\'équipe TakaMatch. Si tu penses que c\'est une erreur, écris à contact@takamatch.com.'
  };
  function readable(data, status){
    var code = data && (data.error_code || data.code);
    if(code && MSG[code]) return MSG[code];
    var raw = data && (data.msg || data.message || data.error_description || data.error);
    /* Messages écrits en français dans la base (fonctions métier) : on les garde. */
    if(raw && /[éèàçêù]|^(Tu |Ta |Ce |Cette |Il |Une |Vous |Action |Connecte)/.test(raw)) return raw;
    if(/Signups not allowed/i.test(raw || '')) return MSG.otp_disabled;
    if(/banned/i.test(raw || '')) return MSG.user_banned;
    if(/captcha/i.test(raw || '')) return 'Le contrôle anti-robot n\'a pas abouti. Recharge la page puis réessaie.';
    if(/Database error saving new user/i.test(raw || '')) return DISPOSABLE;
    /* Fichiers (photos, couvertures) */
    if(status === 413 || /too large|exceeded the maximum/i.test(raw || '')) return 'Cette image est trop lourde. Choisis-en une plus légère (2 Mo maximum pour la photo, 3 Mo pour la couverture).';
    if(/mime type|invalid_mime/i.test(raw || '')) return 'Ce format d\'image n\'est pas accepté. Utilise une image JPG, PNG ou WebP.';
    if(/row-level security|AccessDenied/i.test(raw || '') || (data && data.code === 'AccessDenied')) return 'Ton image n\'a pas pu être enregistrée : ta session a peut-être expiré. Reconnecte-toi puis réessaie.';
    if(/expired|invalid.*(otp|token)/i.test(raw || '')) return MSG.otp_expired;
    if(status === 401) return 'Ta session a expiré. Reconnecte-toi.';
    if(status === 429) return MSG.over_request_rate_limit;
    if(status >= 500) return 'Le service est momentanément indisponible. Réessaie dans un instant.';
    return 'La demande n\'a pas abouti. Réessaie dans un instant.';
  }

  /* ---------- Requête de base ---------- */
  async function raw(path, opts){
    opts = opts || {};
    if(navigator.onLine === false){ var off = new Error('Pas de connexion internet. Vérifie ton réseau puis réessaie.'); off.kind = 'offline'; throw off; }
    var headers = Object.assign({apikey:SB_KEY}, opts.headers || {});
    if(opts.auth !== false && session && session.access_token) headers.Authorization = 'Bearer ' + session.access_token;
    var body = opts.body;
    if(body !== undefined && !(body instanceof Blob) && typeof body !== 'string'){ body = JSON.stringify(body); headers['Content-Type'] = 'application/json'; }
    var ctl = window.AbortController ? new AbortController() : null, tm = ctl ? setTimeout(function(){ ctl.abort(); }, opts.timeout || 20000) : 0, r;
    try{
      r = await fetch(SB_URL + path, {method:opts.method || 'GET', headers:headers, body:body, signal:ctl ? ctl.signal : undefined});
    }catch(e){
      var n = new Error(e && e.name === 'AbortError' ? 'Le serveur met trop de temps à répondre. Réessaie dans un instant.'
                                                     : 'Impossible de joindre le serveur. Vérifie ta connexion puis réessaie.');
      n.kind = 'network'; throw n;
    }finally{ clearTimeout(tm); }
    var txt = await r.text(), data = null;
    try{ data = txt ? JSON.parse(txt) : null; }catch(e){ data = txt; }
    if(!r.ok){
      /* Message technique d'origine, visible dans la console (F12) pour diagnostiquer. */
      try{ console.warn('[TakaMatch] ' + (opts.method || 'GET') + ' ' + path.split('?')[0] + ' → ' + r.status, data); }catch(e){}
      var err = new Error(readable(data, r.status)); err.status = r.status; err.data = data;
      err.code = data && (data.error_code || data.code); throw err;
    }
    return data;
  }
  var refreshing = null;
  async function refresh(){
    if(!session || !session.refresh_token) return false;
    if(!refreshing) refreshing = raw('/auth/v1/token?grant_type=refresh_token', {method:'POST', auth:false, body:{refresh_token:session.refresh_token}})
      .then(function(t){ setSession(fromTokens(t, t.user || (session && session.user))); return true; })
      .catch(function(e){ if(e.status === 400 || e.status === 401) setSession(null); return false; })
      .finally(function(){ refreshing = null; });
    return refreshing;
  }
  /* Requête authentifiée : renouvelle la session si besoin, une seule nouvelle tentative. */
  async function api(path, opts){
    opts = opts || {};
    if(session && session.expires_at && session.expires_at - Date.now() / 1000 < 60) await refresh();
    try{ return await raw(path, opts); }
    catch(e){
      if(e.status === 401 && session && session.refresh_token && !opts._retried){
        if(await refresh()) return api(path, Object.assign({}, opts, {_retried:true}));
      }
      throw e;
    }
  }

  /* ---------- API publique : window.TMDB ---------- */
  var DB = window.TMDB = {
    url: SB_URL,
    key: SB_KEY,   /* clé publique (lecture des prix…) */
    session: function(){ return session; },
    user: function(){ return session && session.user; },
    uid: function(){ return session && session.user && session.user.id; },
    email: function(){ return (session && session.user && session.user.email) || ''; },

    /* Comptes */
    sendCode: async function(email, create){
      /* Nouvelle inscription : les adresses jetables sont refusées avant même d'envoyer le code. */
      if(create){
        var ok = true;
        try{ ok = await raw('/rest/v1/rpc/email_domain_allowed', {method:'POST', auth:false, body:{p_email:email}}); }catch(e){}
        if(ok === false){ var d = new Error(DISPOSABLE); d.code = 'disposable_email'; throw d; }
      }
      var tok = await captcha();
      return raw('/auth/v1/otp', {method:'POST', auth:false, body:withCaptcha({email:email, create_user:!!create}, tok)});
    },
    verifyCode: async function(email, token){
      var t = await raw('/auth/v1/verify', {method:'POST', auth:false, body:{type:'email', email:email, token:token}});
      setSession(fromTokens(t, t.user)); return session;
    },
    /* Connexion par identifiant + mot de passe (espace équipe). */
    signInPassword: async function(email, password){
      var tok = await captcha();
      var t = await raw('/auth/v1/token?grant_type=password', {method:'POST', auth:false, body:withCaptcha({email:email, password:password}, tok)});
      setSession(fromTokens(t, t.user)); return session;
    },
    /* Nouveau mot de passe pour le compte connecté ; « pwd_ok » note qu'il a été choisi. */
    setPassword: async function(password){
      var u = await api('/auth/v1/user', {method:'PUT', body:{password:password, data:{pwd_ok:true}}});
      if(session && u && u.id){ session.user = u; setSession(session); }
      return u;
    },
    googleUrl: function(redirectTo){
      return SB_URL + '/auth/v1/authorize?provider=google&redirect_to=' + encodeURIComponent(redirectTo);
    },
    /* Retour de Google : les jetons arrivent dans l'adresse (#access_token=…). */
    takeOAuthReturn: async function(){
      var h = location.hash.replace(/^#/, ''); if(!h) return null;
      var p = new URLSearchParams(h);
      var clean = function(){ try{ history.replaceState(history.state, '', location.pathname + location.search); }catch(e){} };
      if(p.get('error_description') || p.get('error')){ clean(); var e = new Error(p.get('error_description') || 'La connexion avec Google a échoué.'); e.kind = 'oauth'; throw e; }
      if(!p.get('access_token')) return null;
      setSession(fromTokens({access_token:p.get('access_token'), refresh_token:p.get('refresh_token'),
        expires_in:p.get('expires_in'), expires_at:p.get('expires_at')}));
      clean();
      var u = await api('/auth/v1/user');
      session.user = u; setSession(session);
      return session;
    },
    /* Petites données attachées au compte (ex. brouillon d'inscription). */
    saveMeta: async function(data){
      var u = await api('/auth/v1/user', {method:'PUT', body:{data:data}});
      if(session && u && u.id){ session.user = u; setSession(session); }
      return u;
    },
    signOut: async function(){
      try{ if(session) await raw('/auth/v1/logout', {method:'POST'}); }catch(e){}
      setSession(null);
    },
    /* Vérifie que la session est encore valable (et la renouvelle au besoin). */
    ensure: async function(){
      if(!session) return null;
      if(session.expires_at - Date.now() / 1000 < 60 && !(await refresh())) return null;
      return session;
    },

    /* Tables */
    select: function(table, query){ return api('/rest/v1/' + table + '?' + (query || 'select=*')); },
    one: async function(table, query){ var r = await api('/rest/v1/' + table + '?' + query); return (r && r[0]) || null; },
    update: function(table, match, values){
      return api('/rest/v1/' + table + '?' + match, {method:'PATCH', body:values, headers:{Prefer:'return=representation'}});
    },
    insert: function(table, values){
      return api('/rest/v1/' + table, {method:'POST', body:values, headers:{Prefer:'return=representation'}});
    },
    remove: function(table, match){
      return api('/rest/v1/' + table + '?' + match, {method:'DELETE'});
    },
    rpc: function(fn, args){ return api('/rest/v1/rpc/' + fn, {method:'POST', body:args || {}}); },

    /* Fichiers : renvoie l'adresse publique (espaces avatars / covers). */
    upload: async function(bucket, path, blob){
      await api('/storage/v1/object/' + bucket + '/' + path, {method:'POST', body:blob,
        headers:{'Content-Type':blob.type || 'application/octet-stream', 'x-upsert':'true', 'cache-control':'3600'}});
      return SB_URL + '/storage/v1/object/public/' + bucket + '/' + path;
    },
    /* Retire des fichiers d'un espace de stockage (selon les droits de la personne connectée). */
    removeFiles: function(bucket, names){
      return api('/storage/v1/object/' + bucket, {method:'DELETE', body:{prefixes:names || []}});
    },
    dataUrlToBlob: function(u){
      var m = /^data:([^;,]+)?(;base64)?,(.*)$/.exec(u || ''); if(!m) return null;
      var bin = m[2] ? atob(m[3]) : decodeURIComponent(m[3]), arr = new Uint8Array(bin.length);
      for(var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return new Blob([arr], {type:m[1] || 'application/octet-stream'});
    },

    /* Tout ce qui concerne la personne connectée, en une fois. */
    loadMe: async function(){
      var id = DB.uid(); if(!id) return null;
      var q = 'id=eq.' + id + '&select=*';
      var res = await Promise.all([
        DB.one('profiles', q), DB.one('profile_identity', q), DB.one('profile_private', q), DB.one('accounts', q),
        DB.select('projects', 'owner_id=eq.' + id + '&select=*&order=created_at.asc')
      ]);
      return {profile:res[0], identity:res[1], priv:res[2], account:res[3], projects:res[4] || []};
    }
  };
})();
