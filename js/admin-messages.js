/* ============================================================
   TakaMatch · Espace équipe · Messages aux membres
   ------------------------------------------------------------
   Chargé après js/admin-live.js. Module « Messages aux membres » :
   · message personnel à un ou plusieurs membres (super admin,
     modérateur, support) ;
   · annonce groupée, ciblée (profil, vérification, pays, ancienneté,
     activité, situation) — super admin.
   Côté membre, tout arrive dans la discussion « Équipe TakaMatch »,
   épinglée dans sa messagerie, à sens unique (réponse = support),
   avec une notification dans la cloche. Base : admin_staff_send,
   admin_staff_sent (migration 30).
   ============================================================ */
(function(){
  'use strict';
  if(!window.TMAdminLive) return;
  const LIVE = window.TMAdminLive;
  const BC = window.TMStaffMsg = {sent:[], at:0, loading:false};
  const F0 = () => ({role:'all', verified:'any', countries:[], since:0, activity:'any', situation:'any'});
  const ST = A.bc = {kind:'perso', to:new Set(), title:'', body:'', q:'', f:F0(), count:null, counting:false};
  /* Ciblage des annonces (appliqué par la base : staff_audience). */
  const ROLE_L = {all:'Tous', vis:'Visionnaires', tal:'Talents', both:'Les deux profils'};
  const OPTS = {
    verified:[['any', 'Vérifiés ou non'], ['yes', 'Profils vérifiés'], ['no', 'Profils non vérifiés']],
    since:[['0', 'Inscrits depuis toujours'], ['7', 'Inscrits depuis moins de 7 jours'], ['30', 'Inscrits depuis moins de 30 jours']],
    activity:[['any', 'Actifs ou non'], ['recent', 'Connectés ces 30 derniers jours'], ['inactive', 'Inactifs depuis plus de 30 jours']],
    situation:[['any', 'En équipe ou non'], ['team', 'En équipe (au moins un match)'], ['none', 'Pas encore de match']],
  };
  const zone = () => (window.TMGeo ? TMGeo.COUNTRIES : []).map(c => [c.id, c.n]);
  function label(f){
    const p = [f.role === 'all' ? 'Tous les membres' : ROLE_L[f.role]];
    if(f.verified === 'yes') p.push('vérifiés'); if(f.verified === 'no') p.push('non vérifiés');
    if(f.countries.length) p.push(f.countries.map(c => (zone().find(z => z[0] === c) || [c, c])[1]).join(', '));
    if(+f.since) p.push('inscrits < ' + f.since + ' j');
    if(f.activity === 'recent') p.push('actifs 30 j'); if(f.activity === 'inactive') p.push('inactifs 30 j');
    if(f.situation === 'team') p.push('en équipe'); if(f.situation === 'none') p.push('sans match');
    return p.join(' · ');
  }
  const filt = () => Object.assign({}, ST.f, {since:+ST.f.since || 0});
  let cT = 0, cSeq = 0;
  function recount(){
    clearTimeout(cT); const seq = ++cSeq; ST.counting = true;
    cT = setTimeout(async () => {
      try{ const n = await TMDB.rpc('admin_staff_count', {p_filter:filt()}); if(seq === cSeq){ ST.count = n; } }
      catch(e){ if(seq === cSeq) ST.count = null; }
      finally{ if(seq === cSeq){ ST.counting = false; if(A.view === 'messages' && !A.modal) render(); } }
    }, 250);
  }

  if(!MODULES.some(m => m.id === 'messages')){
    const i = MODULES.findIndex(m => m.id === 'support');
    MODULES.splice(i + 1, 0, {id:'messages', l:'Messages aux membres', i:'send', grp:'Pilotage'});
  }
  ['super', 'moder', 'support'].forEach(r => { if(ROLES[r] && !ROLES[r].can.includes('messages')) ROLES[r].can.push('messages'); });
  if(!LIVE_VIEWS.includes('messages')) LIVE_VIEWS.push('messages');
  const isSuper = () => !!(A.me && A.me.role === 'super');
  const ms = s => s ? Date.parse(s) : 0;
  const members = () => D.users.filter(u => u.onboarded && u.status !== 'banned');

  BC.load = async function(){
    if(!A.me || !canSee('messages') || BC.loading) return;
    BC.loading = true;
    try{ BC.sent = (await TMDB.rpc('admin_staff_sent') || []).map(x => ({kind:x.kind, title:x.title || '', body:x.body || '', at:ms(x.at), n:x.n || 0, read:x.read || 0,
      author:(x.author || '').split('@')[0], to:x.to, audience:x.audience || ''})); BC.at = Date.now(); }
    catch(e){ console.warn('[messages]', e && e.message); }
    finally{ BC.loading = false; }
    if(A.me && A.view === 'messages' && !A.modal){ const keep = A.drawer; render(); if(keep){ A.drawer = keep; paintOverlay(); } }
  };
  const _load = LIVE.load;
  LIVE.load = async function(){ await _load.apply(this, arguments); if(LIVE.on && A.view === 'messages') BC.load(); };

  /* ---------- Vue ---------- */
  function picker(){
    const q = ST.q.trim().toLowerCase();
    const list = members().filter(u => !q || (u.legal + ' ' + u.handle + ' ' + u.email).toLowerCase().includes(q)).slice(0, 40);
    const chosen = [...ST.to].map(id => userBy(id)).filter(Boolean);
    return '<div class="field" style="margin-bottom:12px"><label for="bcQ">Destinataires</label>'
      + (chosen.length ? '<div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:8px">' + chosen.map(u => '<span class="chip c-tal">@' + esc(u.handle)
          + ' <button class="lnk" data-act="bc-rm" data-id="' + u.id + '" aria-label="Retirer @' + esc(u.handle) + '">' + ic('x') + '</button></span>').join('') + '</div>' : '')
      + '<input class="inp" id="bcQ" placeholder="Chercher un membre : nom, @pseudo, e-mail" autocomplete="off" value="' + esc(ST.q) + '">'
      + '<div class="card" style="max-height:220px;overflow:auto;margin-top:6px;padding:4px">'
      + (list.length ? list.map(u => '<label class="check"><input type="checkbox" data-act="bc-pick" data-id="' + u.id + '"' + (ST.to.has(u.id) ? ' checked' : '') + '> '
          + '<span>' + whoCell(u) + '</span></label>').join('') : '<p class="hint" style="padding:10px;margin:0">Aucun membre ne correspond.</p>')
      + '</div></div>';
  }
  function targeting(){
    const f = ST.f, sel = k => '<select class="inp" data-act="bc-f" data-k="' + k + '" aria-label="' + OPTS[k][0][1] + '">'
      + OPTS[k].map(o => '<option value="' + o[0] + '"' + (String(f[k]) === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select>';
    const n = ST.count;
    return '<div class="field" style="margin-bottom:12px"><label>Destinataires</label>'
      + '<div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:10px">' + Object.keys(ROLE_L).map(r => '<button class="btn btn-sm ' + (f.role === r ? 'btn-a' : 'btn-ghost') + '" data-act="bc-role" data-v="' + r + '">' + ROLE_L[r] + '</button>').join('') + '</div>'
      + '<div class="grid g4" style="gap:8px;margin-bottom:10px">' + sel('verified') + sel('since') + sel('activity') + sel('situation') + '</div>'
      + '<div class="row" style="gap:6px;flex-wrap:wrap;align-items:center"><span class="hint" style="margin-right:4px">Pays :</span>'
      +   '<button class="chip' + (f.countries.length ? '' : ' c-tal') + '" data-act="bc-cc" data-v="">Tous</button>'
      +   zone().map(z => '<button class="chip' + (f.countries.includes(z[0]) ? ' c-tal' : '') + '" data-act="bc-cc" data-v="' + z[0] + '">' + esc(z[1]) + '</button>').join('') + '</div></div>'
      + '<div class="note-box ' + (n === 0 ? 'bad' : 'warn') + '" style="margin-bottom:12px">' + ic('users') + ' '
      +   (ST.counting && n == null ? 'Calcul des destinataires…' : n == null ? 'Nombre de destinataires indisponible.'
          : 'Cette annonce partira à <b>' + n + ' membre' + (n > 1 ? 's' : '') + '</b>' + (ST.counting ? ' <span class="hint">(mise à jour…)</span>' : '') + ' · ' + esc(label(f)) + '. Les comptes bannis sont toujours exclus.')
      + '</div>';
  }
  VIEWS.messages = () => {
    if(!BC.at && !BC.loading) setTimeout(BC.load, 0);
    const ann = ST.kind === 'annonce', n = ann ? (ST.count == null ? 0 : ST.count) : ST.to.size;
    if(ann && ST.count == null && !ST.counting) recount();
    const kinds = [['perso', 'Message personnel', 'À un ou plusieurs membres']].concat(isSuper() ? [['annonce', 'Annonce groupée', 'Actualité envoyée à un groupe de membres']] : []);
    return pageH('Messages aux membres', 'Ce que tu envoies ici arrive dans la discussion « Équipe TakaMatch » du membre, épinglée dans sa messagerie, avec une notification. La discussion est à sens unique : pour vous répondre, le membre passe par « Aide et support ».')
      + '<div class="card" style="padding:18px;margin-bottom:18px">'
      +   '<div class="row" style="gap:8px;flex-wrap:wrap;margin-bottom:14px">' + kinds.map(k => '<button class="btn ' + (ST.kind === k[0] ? 'btn-a' : 'btn-ghost') + '" data-act="bc-kind" data-v="' + k[0] + '" title="' + esc(k[2]) + '">'
          + ic(k[0] === 'annonce' ? 'users' : 'mail') + k[1] + '</button>').join('') + '</div>'
      +   (ann ? targeting() : picker())
      +   '<div class="field" style="margin-bottom:12px"><label for="bcT">Titre ' + (ann ? '' : '<span class="hint">(facultatif)</span>') + '</label>'
      +     '<input class="inp" id="bcT" maxlength="120" placeholder="' + (ann ? 'Ex. : Nouveau : le pacte d\'associés est disponible' : 'Ex. : À propos de ta vérification') + '" value="' + esc(ST.title) + '"></div>'
      +   '<div class="field" style="margin-bottom:12px"><label for="bcB">Message</label>'
      +     '<textarea class="inp" id="bcB" maxlength="4000" style="min-height:140px" placeholder="Écris ton message. Les retours à la ligne sont conservés.">' + esc(ST.body) + '</textarea>'
      +     '<div class="hint" id="bcCnt" style="text-align:right">' + (4000 - ST.body.length) + ' caractères restants</div></div>'
      +   '<div class="row" style="gap:10px;justify-content:flex-end"><span class="hint">Le membre ne pourra pas répondre dans cette discussion.</span>'
      +     '<button class="btn btn-a" data-act="bc-send"' + (n ? '' : ' disabled') + '>' + ic('send') + (ann ? 'Envoyer l\'annonce' : 'Envoyer' + (n > 1 ? ' à ' + n + ' membres' : '')) + '</button></div>'
      + '</div>'
      + '<h2 style="font-size:16px;margin:0 0 10px">Derniers envois</h2>'
      + table(['Date', 'Type', 'Destinataires', 'Message', 'Lu', 'Par'], BC.sent.map(x => { const u = x.to && userBy(x.to);
          return '<tr><td style="white-space:nowrap">' + fmt(x.at) + '</td><td><span class="chip ' + (x.kind === 'annonce' ? 'c-tal' : '') + '">' + (x.kind === 'annonce' ? 'Annonce' : 'Personnel') + '</span></td>'
            + '<td>' + (u ? whoCell(u) : (x.audience ? esc(x.audience) + '<br><small class="hint">' : '') + x.n + ' membre' + (x.n > 1 ? 's' : '') + (x.audience ? '</small>' : '')) + '</td>'
            + '<td style="max-width:420px">' + (x.title ? '<b>' + esc(x.title) + '</b><br>' : '') + '<span class="hint">' + esc(x.body.length > 160 ? x.body.slice(0, 160) + '…' : x.body) + '</span></td>'
            + '<td class="mono">' + x.read + '/' + x.n + '</td><td>' + esc(x.author || '—') + '</td></tr>'; }),
        BC.loading ? 'Chargement…' : 'Aucun message envoyé pour l\'instant');
  };

  /* Bouton « Écrire un message » sur la fiche utilisateur. */
  const _userDrawer = userDrawer;
  userDrawer = function(u){
    const d = _userDrawer.apply(this, arguments);
    if(d && u && canSee('messages') && u.status !== 'banned' && u.onboarded !== false)
      d.foot = '<button class="btn btn-ghost" data-act="bc-to" data-id="' + u.id + '">' + ic('mail') + 'Écrire un message</button>' + (d.foot || '');
    return d;
  };

  document.addEventListener('change', e => {
    const t = e.target; if(!t || t.dataset.act !== 'bc-f') return;
    e.stopPropagation();
    ST.f[t.dataset.k] = t.dataset.k === 'since' ? +t.value : t.value; recount(); render();
  }, true);

  /* ---------- Saisie (sans redessiner la page à chaque touche) ---------- */
  document.addEventListener('input', e => {
    const t = e.target;
    if(t.id === 'bcT') ST.title = t.value;
    else if(t.id === 'bcB'){ ST.body = t.value; const c = $('#bcCnt'); if(c) c.textContent = (4000 - t.value.length) + ' caractères restants'; }
    else if(t.id === 'bcQ'){ ST.q = t.value; clearTimeout(BC.qT); BC.qT = setTimeout(() => { render(); const f = $('#bcQ'); if(f){ f.focus(); f.setSelectionRange(f.value.length, f.value.length); } }, 200); }
  }, true);

  async function send(){
    const ann = ST.kind === 'annonce', body = ST.body.trim();
    if(body.length < 2) return toast('Écris le message à envoyer.', 'bad');
    if(ann && !ST.title.trim()) return toast('Donne un titre à l\'annonce.', 'bad');
    if(ann && !ST.count) return toast('Aucun membre ne correspond à ce ciblage.', 'bad');
    if(!ann && !ST.to.size) return toast('Choisis au moins un destinataire.', 'bad');
    closeModal();
    try{
      const n = await TMDB.rpc('admin_staff_send', {p_users:ann ? [] : [...ST.to], p_all:ann, p_kind:ST.kind, p_title:ST.title.trim(), p_body:body,
        p_filter:ann ? filt() : {}, p_label:ann ? label(ST.f) : ''});
      ST.title = ''; ST.body = ''; ST.to = new Set(); ST.q = ''; ST.f = F0(); ST.count = null;
      toast(n ? 'Message envoyé à ' + n + ' membre' + (n > 1 ? 's' : '') + '.' : 'Aucun destinataire valable (compte banni ou inscription inachevée).', n ? '' : 'bad');
      await BC.load(); render();
    }catch(err){ toast(err.message || 'L\'envoi n\'a pas abouti.', 'bad'); }
  }

  /* ---------- Clics ---------- */
  document.addEventListener('click', e => {
    if(!LIVE.on) return;
    const t = e.target.closest('[data-act]'); if(!t) return;
    const a = t.dataset.act; if(!/^bc-/.test(a) || a === 'bc-f') return;
    if(a !== 'bc-pick'){ e.preventDefault(); }
    e.stopPropagation();
    const id = t.dataset.id;
    switch(a){
      case 'bc-kind': ST.kind = t.dataset.v === 'annonce' && isSuper() ? 'annonce' : 'perso'; if(ST.kind === 'annonce') recount(); render(); break;
      case 'bc-role': ST.f.role = t.dataset.v; recount(); render(); break;
      case 'bc-cc': { const v = t.dataset.v; if(!v) ST.f.countries = [];
        else ST.f.countries = ST.f.countries.includes(v) ? ST.f.countries.filter(c => c !== v) : ST.f.countries.concat(v);
        recount(); render(); break; }
      case 'bc-pick': if(t.checked) ST.to.add(id); else ST.to.delete(id); render(); break;
      case 'bc-rm': ST.to.delete(id); render(); break;
      case 'bc-to': ST.kind = 'perso'; ST.to = new Set([id]); ST.q = ''; A.drawer = null; paintOverlay();
        A.view = 'messages'; try{ history.pushState(null, '', '#messages'); }catch(err){} render(); window.scrollTo(0, 0);
        setTimeout(() => { const b = $('#bcB'); if(b) b.focus(); }, 50); break;
      case 'bc-send': {
        const ann = ST.kind === 'annonce', n = ann ? (ST.count || 0) : ST.to.size;
        if(!ann && n === 1) return send();
        if(ann && !n) return toast('Aucun membre ne correspond à ce ciblage.', 'bad');
        modal('<h2>' + (ann ? 'Envoyer l\'annonce ?' : 'Envoyer à ' + n + ' membres ?') + '</h2>'
          + '<p>' + (ann ? 'Ciblage : <b>' + esc(label(ST.f)) + '</b>.<br><b>' + n + ' membre' + (n > 1 ? 's' : '') + '</b> recevront « ' + esc(ST.title.trim() || 'Actualité TakaMatch') + ' » dans leur messagerie, avec une notification.'
                         : 'Chacun le recevra dans sa discussion « Équipe TakaMatch », avec une notification.') + ' Un message envoyé ne peut pas être retiré.</p>'
          + '<div class="acts"><button class="btn btn-ghost" data-act="close-modal">Annuler</button><button class="btn btn-a" data-act="bc-send-go">' + ic('send') + 'Envoyer</button></div>');
        break; }
      case 'bc-send-go': send(); break;
    }
  }, true);
})();
