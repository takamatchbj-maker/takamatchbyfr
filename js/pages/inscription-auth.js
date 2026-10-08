"use strict";
/* ============================================================
   TakaMatch — inscription branchée sur la vraie base (Supabase)
   ------------------------------------------------------------
   · Compte : e-mail → code à 6 chiffres reçu par mail → téléphone
     (plus de mot de passe), ou « Continuer avec Google ».
   · Connexion : e-mail → code → l'outil.
   · Pseudo : disponibilité vérifiée en direct, puis réservé.
   · Fin du parcours : fiche, identité, téléphone, photo et projet
     enregistrés dans la base avant d'ouvrir l'outil.
   · Retour sur la page avec une session ouverte : on reprend là
     où la personne s'était arrêtée.
   Ce fichier se charge APRÈS js/pages/inscription.js et remplace
   certaines de ses fonctions.
   ============================================================ */
(function(){
  if(!window.TMDB) return;
  const DB = window.TMDB;
  const post = m => { try{ parent.postMessage(Object.assign({tm:1}, m), '*'); }catch(e){} };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const mail = () => (O.ident || '').trim().toLowerCase();

  /* Bouton principal : « en cours » → « c'est fait », ou message clair si ça échoue. */
  async function work(doneLabel, task, next, onError){
    if(O.sending) return;
    const main = $('#onbMain');
    const before = main ? main.innerHTML : '';
    O.sending = true; onbEnable(false);
    if(main){ main.classList.add('loading'); main.innerHTML = '<span class="spin" aria-hidden="true"></span><span>'+esc(main.textContent.trim())+'</span>'; }
    try{
      const r = await task();
      if(main){ main.classList.remove('loading'); main.classList.add('done'); main.innerHTML = ic('check') + '<span>' + esc(doneLabel) + '</span>'; }
      await wait(450);
      O.sending = false;
      await next(r);
    }catch(e){
      O.sending = false;
      if(main){ main.classList.remove('loading', 'done'); main.innerHTML = before; }
      onbEnable(true);
      if(!(onError && onError(e))) toast((e && e.message) || 'La demande n\'a pas abouti.', 'bad');
      if(window.TMGuard) TMGuard.log(e, 'inscription');
    }
  }

  function goApp(login){
    O.sending = true;
    post({type:'onb-done', login:!!login, ident:DB.email()});
  }

  /* Après la vérification du code (ou le retour de Google). */
  async function afterAuth(me){
    me = me || await DB.loadMe();
    if(me && me.profile && me.profile.onboarded_at){ goApp(true); return; }
    /* Compte créé mais inscription pas terminée : on reprend le parcours. */
    O.login = false;
    if(me && me.priv && me.priv.phone){ O.step = 2; }
    else { O.step = 1; O.sub = 'phone'; O.phoneTouched = false; }
    renderOnb();
  }

  /* ---------- Étape 1 : e-mail → code → téléphone ---------- */
  authStep = function(){
    if(O.sub === 'choose'){
      const f = $('#ident'); if(f) O.ident = f.value.trim();
      if(!identOk(O.ident)){ O.identTouched = true; syncIdent(); if(f) f.focus(); return; }
      O.social = null;
      work('Code envoyé', () => DB.sendCode(mail(), !O.login), () => { O.sub = 'code'; O.code = ''; renderOnb(); });
      return;
    }
    if(O.sub === 'code'){
      if(O.code.length !== 6) return;
      work('Adresse vérifiée', () => DB.verifyCode(mail(), O.code), () => afterAuth(), () => {
        O.code = ''; $$('.otp .inp').forEach(i => i.value = ''); syncCode(); const z = $('#otp0'); if(z) z.focus(); return false;
      });
      return;
    }
    if(O.sub === 'phone'){
      const f = $('#phone'); if(f) ME.phone = f.value.trim();
      if(!phoneOk(ME.phone, ME.cc)){ O.phoneTouched = true; syncPhone(); if(f) f.focus(); return; }
      work('Compte créé', () => DB.update('profile_private', 'id=eq.' + DB.uid(), {phone:fullPhone()}), () => { O.step = 2; renderOnb(); });
      return;
    }
    /* L'ancien écran « mot de passe » n'existe plus : on passe à la suite. */
    O.step = 2; renderOnb();
  };
  function fullPhone(){
    const c = country(ME.cc);
    return c.c + ' ' + (typeof phoneFormat === 'function' ? phoneFormat(ME.phone, ME.cc) : ME.phone);
  }

  /* Google, renvoi du code : on passe AVANT les gestionnaires de démonstration. */
  window.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-act="onb-social"],[data-act="onb-resend"]'); if(!t) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if(O.sending) return;
    if(t.dataset.act === 'onb-resend'){
      DB.sendCode(mail(), !O.login)
        .then(() => { O.code = ''; $$('.otp .inp').forEach(i => i.value = ''); syncCode(); const z = $('#otp0'); if(z) z.focus(); toast('Nouveau code envoyé.', 'ok'); })
        .catch(err => toast(err.message, 'bad'));
      return;
    }
    if(t.dataset.m !== 'google') return;
    if(!/^https?:$/.test(location.protocol)){ toast('La connexion Google fonctionne seulement sur le site en ligne.', 'bad'); return; }
    const q = new URLSearchParams({oauth:'google'});
    if(O.login) q.set('mode', 'login');
    if(O.roleSel) q.set('role', O.roleSel);
    location.href = DB.googleUrl(location.origin + location.pathname + '?' + q.toString());
  }, true);

  /* ---------- Pseudo : disponibilité en direct, puis réservation ---------- */
  const _syncHandle = syncHandle;
  let hTimer = 0, hSeq = 0;
  syncHandle = function(){
    _syncHandle();
    const v = ME.handle;
    if(handleState(v).k !== 'ok' || !DB.uid()) return;
    clearTimeout(hTimer); const seq = ++hSeq;
    hTimer = setTimeout(async () => {
      try{
        const free = await DB.rpc('handle_available', {h:v});
        if(seq === hSeq && free === false && !TAKEN.includes(v)){ TAKEN.push(v); _syncHandle(); }
      }catch(e){}
    }, 350);
  };
  const _go = onbGo;
  onbGo = function(to){
    if(O.step === 5 && to === 6 && DB.uid() && !O.sending){
      const el = $('#handle'), v = slugify(((el && el.value) || '').trim());
      if(handleState(v).k !== 'ok') return _go(to);
      work('Pseudo réservé', () => DB.update('profiles', 'id=eq.' + DB.uid(), {handle:v}), () => _go(to), e => {
        if(e.code === '23505'){ TAKEN.push(v); syncHandle(); toast('Ce pseudo vient d\'être pris. Choisis-en un autre.', 'bad'); return true; }
        return false;
      });
      return;
    }
    return _go(to);
  };

  /* ---------- Fin du parcours : tout est enregistré dans la base ---------- */
  async function uploadImage(bucket, dataUrl, name){
    if(!dataUrl) return '';
    if(!/^data:/.test(dataUrl)) return /^https?:/.test(dataUrl) ? dataUrl : '';
    const blob = DB.dataUrlToBlob(dataUrl); if(!blob) return '';
    return DB.upload(bucket, DB.uid() + '/' + name + '-' + Date.now() + '.jpg', blob);
  }
  async function saveAll(){
    const id = DB.uid(); if(!id) throw new Error('Ta session a expiré. Reconnecte-toi.');
    const tal = ME.role === 'tal', x = ME.perso || {}, p = ME.project || {};
    const photo = await uploadImage('avatars', ME.photo, 'photo');
    await DB.update('profiles', 'id=eq.' + id, Object.assign({
      handle:ME.handle, city:ME.city, country:ME.cc || null, primary_role:ME.role, pace:ME.pace || 'serieux',
      photo_url:photo, onboarded_at:new Date().toISOString()
    }, tal ? {
      skills:ME.skills || [], sectors:ME.sectors || [], level:ME.level || '', diploma:ME.diploma || '', status:ME.status || '',
      bio:ME.bio || '', portfolio_url:ME.portfolio || '', portfolio_title:ME.portfolioTitle || '', talent_online:true
    } : {
      skills:x.skills || [], level:x.level || '', bio:x.bio || '', portfolio_url:x.portfolio || ''
    }));
    await DB.update('profile_identity', 'id=eq.' + id, {first_name:ME.first, last_name:ME.last, sex:{m:'m', f:'f'}[ME.sex] || 'n'});
    if(ME.phone) await DB.update('profile_private', 'id=eq.' + id, {phone:fullPhone()});
    if(!tal){
      const cover = await uploadImage('covers', p.cover, 'couverture');
      const row = {title:p.title || '', glyph:(typeof projIcon === 'function' && projIcon()) || '💡', cover_url:cover,
        sectors:p.sectors || [], seeking:p.seeking || [], hook:p.hook || '', vision:p.vision || '', traction:p.traction || '',
        challenges:p.challenges || '', link:p.link || '', pace:ME.pace || 'serieux', offer:p.offer || 'equity', online:true};
      const mine = await DB.select('projects', 'owner_id=eq.' + id + '&select=id&order=created_at.asc&limit=1');
      if(mine && mine[0]) await DB.update('projects', 'id=eq.' + mine[0].id, row);
      else await DB.insert('projects', Object.assign({owner_id:id}, row));
    }
  }
  const _dash = openDash;
  openDash = function(){
    if(!DB.uid()){ toast('Ta session a expiré. Reconnecte-toi.', 'bad'); O.step = 1; O.sub = 'choose'; renderOnb(); return; }
    work('Fiche publiée', saveAll, () => _dash());
  };

  /* ---------- Session déjà ouverte (retour de Google, rechargement…) ---------- */
  const _open = openOnb;
  let resumed = false;
  openOnb = function(opts){
    _open(opts);
    if(!resumed){ resumed = true; resume(); }
  };
  async function resume(){
    let s = null;
    try{ s = await DB.takeOAuthReturn(); }catch(e){ toast(e.message, 'bad'); }
    try{
      s = s || await DB.ensure();
      if(!s) return;
      O.ident = DB.email();
      /* Le champ e-mail encore affiché relit sa valeur en perdant le focus : on l'aligne. */
      const fi = $('#ident'); if(fi) fi.value = O.ident;
      const me = await DB.loadMe();
      if(me && me.profile && me.profile.onboarded_at){ toast('Content de te revoir.', 'ok'); setTimeout(() => goApp(true), 500); return; }
      const u = DB.user() || {}, md = u.user_metadata || {};
      if(u.app_metadata && u.app_metadata.provider === 'google') O.social = 'google';
      if(!ME.first && (md.given_name || md.full_name || md.name)){
        const parts = String(md.full_name || md.name || '').trim().split(/\s+/);
        ME.first = md.given_name || parts[0] || '';
        ME.last = md.family_name || parts.slice(1).join(' ');
      }
      if(me && me.profile && me.profile.handle && !ME.handle) ME.handle = me.profile.handle;
      await afterAuth(me);
    }catch(e){ toast(e.message, 'bad'); }
  }
})();
