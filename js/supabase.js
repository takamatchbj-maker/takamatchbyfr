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
  var SKEY = 'tm-sb-session';

  /* ---------- Session (gardée dans ce navigateur) ---------- */
  var session = null;
  try{ session = JSON.parse(localStorage.getItem(SKEY)); }catch(e){}
  function setSession(s){
    session = s || null;
    try{ if(s) localStorage.setItem(SKEY, JSON.stringify(s)); else localStorage.removeItem(SKEY); }catch(e){}
  }
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
    PGRST301:'Ta session a expiré. Reconnecte-toi.'
  };
  function readable(data, status){
    var code = data && (data.error_code || data.code);
    if(code && MSG[code]) return MSG[code];
    var raw = data && (data.msg || data.message || data.error_description || data.error);
    /* Messages écrits en français dans la base (fonctions métier) : on les garde. */
    if(raw && /[éèàçêù]|^(Tu |Ta |Ce |Cette |Il |Une |Vous |Action |Connecte)/.test(raw)) return raw;
    if(/Signups not allowed/i.test(raw || '')) return MSG.otp_disabled;
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
    session: function(){ return session; },
    user: function(){ return session && session.user; },
    uid: function(){ return session && session.user && session.user.id; },
    email: function(){ return (session && session.user && session.user.email) || ''; },

    /* Comptes */
    sendCode: function(email, create){
      return raw('/auth/v1/otp', {method:'POST', auth:false, body:{email:email, create_user:!!create}});
    },
    verifyCode: async function(email, token){
      var t = await raw('/auth/v1/verify', {method:'POST', auth:false, body:{type:'email', email:email, token:token}});
      setSession(fromTokens(t, t.user)); return session;
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
    rpc: function(fn, args){ return api('/rest/v1/rpc/' + fn, {method:'POST', body:args || {}}); },

    /* Fichiers : renvoie l'adresse publique (espaces avatars / covers). */
    upload: async function(bucket, path, blob){
      await api('/storage/v1/object/' + bucket + '/' + path, {method:'POST', body:blob,
        headers:{'Content-Type':blob.type || 'application/octet-stream', 'x-upsert':'true', 'cache-control':'3600'}});
      return SB_URL + '/storage/v1/object/public/' + bucket + '/' + path;
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
