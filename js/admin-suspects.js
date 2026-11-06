/* ============================================================
   TakaMatch · Espace équipe · File « Comptes suspects »
   ------------------------------------------------------------
   Chargé après js/admin-live.js. Ajoute le module « Comptes
   suspects » (à côté des Vérifications) pour le super admin, les
   modérateurs et les vérificateurs.

   · L'analyse est faite par la base (admin_suspects) : téléphone
     partagé, même photo / pièce / selfie qu'un autre compte, rafale
     d'invitations, message copié-collé, lien ou numéro dès le
     premier message.
   · Les empreintes d'images sont calculées ici, dans le navigateur
     du membre de l'équipe (empreinte 64 bits « dHash », qui résiste
     au recadrage léger et à la recompression), puis enregistrées
     dans la base (admin_save_fingerprints). Rien n'est stocké en local.
   · « Rien à signaler » sort le compte de la file tant que ses
     signaux ne changent pas.
   ============================================================ */
(function(){
  'use strict';
  if(!window.TMAdminLive) return;
  const LIVE = window.TMAdminLive;
  const SUS = window.TMSuspects = {rows:[], at:0, loading:false, hashing:false, failed:new Set()};

  /* ---------- Module, droits d'accès ---------- */
  if(!MODULES.some(m => m.id === 'suspects')){
    const i = MODULES.findIndex(m => m.id === 'verifs');
    MODULES.splice(i + 1, 0, {id:'suspects', l:'Comptes suspects', i:'alert', grp:'Pilotage'});
  }
  ['super', 'verif', 'moder'].forEach(r => { if(ROLES[r] && !ROLES[r].can.includes('suspects')) ROLES[r].can.push('suspects'); });
  if(!LIVE_VIEWS.includes('suspects')) LIVE_VIEWS.push('suspects');

  const ms = s => s ? Date.parse(s) : 0;
  const open = () => SUS.rows.filter(r => !r.reviewed);
  const SIG_IC = {phone:'phone', img_photo:'eye', img_id_doc:'badgecheck', img_selfie:'eye', burst:'clock', copy:'copy', contact:'link'};

  /* ---------- Empreinte d'image (dHash 64 bits) ---------- */
  async function dhash(blob){
    const bmp = await createImageBitmap(blob);
    const c = document.createElement('canvas'); c.width = 9; c.height = 8;
    const g = c.getContext('2d', {willReadFrequently:true});
    g.drawImage(bmp, 0, 0, 9, 8); if(bmp.close) bmp.close();
    const px = g.getImageData(0, 0, 9, 8).data, lum = [];
    for(let i = 0; i < px.length; i += 4) lum.push(px[i] * .299 + px[i + 1] * .587 + px[i + 2] * .114);
    let h = 0n;
    for(let y = 0; y < 8; y++) for(let x = 0; x < 8; x++){ h = (h << 1n) | (lum[y * 9 + x] > lum[y * 9 + x + 1] ? 1n : 0n); }
    return BigInt.asIntN(64, h).toString();
  }
  async function fetchBlob(kind, src){
    const s = TMDB.session(), headers = {apikey:TMDB.key};
    let url = src;
    if(kind !== 'photo'){
      url = TMDB.url + '/storage/v1/object/authenticated/identity/' + src.split('/').map(encodeURIComponent).join('/');
      headers.Authorization = 'Bearer ' + (s && s.access_token);
    }
    const r = await fetch(url, kind === 'photo' ? {} : {headers});
    if(!r.ok) throw new Error('HTTP ' + r.status);
    const b = await r.blob();
    if(!/^image\//.test(b.type)) throw new Error('pas une image');
    return b;
  }
  /* Calcule les empreintes manquantes (30 images au plus par passage). */
  async function hashMissing(){
    if(SUS.hashing) return 0;
    SUS.hashing = true;
    try{
      const known = await TMDB.select('image_fingerprints', 'select=user_id,kind,source&limit=20000');
      const have = new Set((known || []).map(f => f.user_id + '|' + f.kind + '|' + f.source));
      const todo = [];
      D.users.forEach(u => { if(u.photo && /^https?:/.test(u.photo)) todo.push({user_id:u.id, kind:'photo', source:u.photo}); });
      D.verifs.forEach(v => {
        if(v.docPath) todo.push({user_id:v.uid, kind:'id_doc', source:v.docPath});
        if(v.selfiePath) todo.push({user_id:v.uid, kind:'selfie', source:v.selfiePath});
      });
      const left = todo.filter(t => !have.has(t.user_id + '|' + t.kind + '|' + t.source) && !SUS.failed.has(t.kind + '|' + t.source)).slice(0, 30);
      const rows = [];
      for(const t of left){
        try{ rows.push(Object.assign({}, t, {dhash:await dhash(await fetchBlob(t.kind, t.source))})); }
        catch(e){ SUS.failed.add(t.kind + '|' + t.source); }
      }
      if(rows.length) await TMDB.rpc('admin_save_fingerprints', {p_rows:rows});
      return rows.length;
    }catch(e){ console.warn('[suspects] empreintes', e && e.message); return 0; }
    finally{ SUS.hashing = false; }
  }

  /* ---------- Chargement ---------- */
  SUS.load = async function(withHash){
    if(!A.me || !canSee('suspects') || SUS.loading) return;
    SUS.loading = true;
    try{
      if(withHash) await hashMissing();
      const rows = await TMDB.rpc('admin_suspects');
      SUS.rows = (rows || []).map(r => ({uid:r.user_id, score:r.score || 0, signals:r.signals || [], signature:r.signature,
        reviewed:!!r.reviewed, reviewedAt:ms(r.reviewed_at), reviewedBy:(r.reviewed_by || '').split('@')[0], reviewNote:r.review_note || ''}));
      SUS.at = Date.now();
    }catch(e){ console.warn('[suspects]', e && e.message); }
    finally{ SUS.loading = false; }
    if(A.me && !A.modal){ const keep = A.drawer; render(); if(keep){ A.drawer = keep; paintOverlay(); } }
  };
  const _load = LIVE.load;
  LIVE.load = async function(quiet){
    await _load.apply(this, arguments);
    if(LIVE.on) SUS.load(!SUS.at || Date.now() - SUS.at > 10 * 6e4);
  };

  /* Compteur dans le menu (comme les autres files). */
  const _renderView = renderView;
  renderView = function(){
    const r = _renderView.apply(this, arguments);
    const n = open().length, b = document.querySelector('.nav[data-v="suspects"]');
    if(b && n && !b.querySelector('.cnt')) b.insertAdjacentHTML('beforeend', '<span class="cnt">' + n + '</span>');
    return r;
  };

  /* ---------- Vue ---------- */
  const lvl = s => s >= 5 ? ['Élevé', 'c-bad'] : s >= 3 ? ['Moyen', 'c-warn'] : ['Faible', ''];
  function sigChips(r){
    return r.signals.map(s => '<span class="chip ' + (s.w >= 4 ? 'c-bad' : s.w >= 3 ? 'c-warn' : '') + '" title="' + esc(s.label) + '">' + esc(s.label) + '</span>').join(' ');
  }
  function linked(r){
    const ids = [...new Set(r.signals.flatMap(s => s.others || []))];
    return ids.map(id => { const u = userBy(id); return u ? '<button class="lnk" data-act="sus-open" data-id="' + id + '">@' + esc(u.handle) + '</button>' : ''; }).filter(Boolean).join(', ');
  }
  VIEWS.suspects = () => {
    const t = curTab('suspects', 'todo');
    const list = (t === 'todo' ? open() : SUS.rows.filter(r => r.reviewed));
    return pageH('Comptes suspects',
      'Comptes qui partagent un numéro, une photo ou une pièce d\'identité avec un autre compte, ou dont la conduite ressemble à celle d\'un faux compte. Les signaux les plus forts d\'abord.',
      '<button class="btn btn-ghost btn-sm" data-act="sus-refresh">' + ic('refresh') + (SUS.loading || SUS.hashing ? 'Analyse en cours…' : 'Relancer l\'analyse') + '</button>')
      + '<div class="note-box" style="margin-bottom:14px">' + ic('info') + ' Un signal n\'est pas une preuve : un couple peut partager un téléphone, un membre peut donner son numéro de bonne foi. Ouvre le compte, regarde ses messages et ses dossiers, puis décide.'
      + (SUS.at ? ' <span class="hint">Analyse du ' + fmt(SUS.at) + '.</span>' : '') + '</div>'
      + tabs('suspects', [['todo', 'À examiner', open().length], ['done', 'Examinés', SUS.rows.length - open().length]])
      + table(['Utilisateur', 'Niveau', 'Signaux', 'Comptes liés', 'Statut', ''], list.map(r => { const u = userBy(r.uid), L = lvl(r.score);
          return '<tr class="click" data-act="sus-drawer" data-id="' + r.uid + '"><td>' + whoCell(u) + '</td><td><span class="chip ' + L[1] + '">' + L[0] + ' · ' + r.score + '</span></td>'
            + '<td style="max-width:420px">' + sigChips(r) + '</td><td>' + (linked(r) || '<span class="hint">—</span>') + '</td>'
            + '<td>' + (u ? statusChip(u) : '—') + (r.reviewed ? '<br><small class="hint">Examiné par ' + esc(r.reviewedBy || 'l\'équipe') + ', ' + ago(r.reviewedAt) + '</small>' : '') + '</td>'
            + '<td><button class="btn btn-ghost btn-sm" data-act="sus-drawer" data-id="' + r.uid + '">' + (r.reviewed ? 'Voir' : 'Examiner') + '</button></td></tr>'; }),
        t === 'todo' ? 'Aucun compte suspect pour le moment' : 'Aucun compte examiné');
  };
  function susDrawer(uid){
    const r = SUS.rows.find(x => x.uid === uid), u = userBy(uid);
    if(!r || !u) return drawer('Compte suspect', '', '<p class="hint">Ce compte n\'est plus dans la file.</p>', '');
    const L = lvl(r.score), vf = D.verifs.filter(v => v.uid === uid).sort((a, b) => b.at - a.at)[0];
    return drawer('@' + esc(u.handle), '<span class="chip ' + L[1] + '">Niveau ' + L[0].toLowerCase() + ' · ' + r.score + '</span>' + statusChip(u),
      '<div class="row" style="gap:14px;margin-bottom:16px">' + whoCell(u) + '</div>'
      + '<div class="dsec"><span class="lbl">Signaux détectés</span>' + r.signals.map(s => {
          const others = (s.others || []).map(id => userBy(id)).filter(Boolean);
          return '<div class="note-box ' + (s.w >= 4 ? 'bad' : s.w >= 3 ? 'warn' : '') + '" style="margin-bottom:8px">' + ic(SIG_IC[s.k] || 'alert') + ' <span><b>' + esc(s.label) + '</b>'
            + (others.length ? '<br>' + others.map(o => '<button class="lnk" data-act="sus-open" data-id="' + o.id + '">' + esc(o.legal) + ' · @' + esc(o.handle) + '</button>' + ' ' + statusChip(o)).join('<br>') : '') + '</span></div>'; }).join('') + '</div>'
      + '<div class="dsec"><span class="lbl">Le compte</span><dl class="kv">'
      +   '<dt>Inscrit le</dt><dd>' + fmt(u.created, false) + ' (' + ago(u.created) + ')</dd>'
      +   '<dt>Téléphone</dt><dd class="mono">' + esc(u.phone) + '</dd><dt>E-mail</dt><dd>' + esc(u.email) + '</dd>'
      +   '<dt>Identité</dt><dd>' + vBadge(u.primary, u.verifiedId) + (vf ? ' <button class="lnk" data-act="open-verif" data-id="' + vf.id + '">Voir le dossier de vérification</button>' : ' <span class="hint">aucun dossier</span>') + '</dd>'
      +   '<dt>Invitations</dt><dd>' + u.invitesSent + ' envoyée' + (u.invitesSent > 1 ? 's' : '') + ' · ' + u.invitesRecv + ' reçue' + (u.invitesRecv > 1 ? 's' : '') + '</dd>'
      +   '<dt>Signalements reçus</dt><dd>' + D.reports.filter(x => x.target === u.handle).length + '</dd></dl></div>'
      + (r.reviewed ? '<div class="dsec"><span class="lbl">Examen</span><p>Examiné par <b>' + esc(r.reviewedBy || 'l\'équipe') + '</b> le ' + fmt(r.reviewedAt) + (r.reviewNote ? ' · ' + esc(r.reviewNote) : '') + '</p></div>' : ''),
      (r.reviewed ? '' : '<button class="btn btn-ok" data-act="sus-ok" data-id="' + uid + '">' + ic('check') + 'Rien à signaler</button>')
      + (canDo('users') && u.status === 'active' ? '<button class="btn btn-bad-ghost" data-act="u-suspend" data-id="' + uid + '">' + ic('pause') + 'Suspendre</button><button class="btn btn-bad" data-act="u-ban" data-id="' + uid + '">' + ic('ban') + 'Bannir</button>' : '')
      + '<span class="grow"></span>' + (canSee('users') ? '<button class="btn btn-quiet" data-act="open-user" data-id="' + uid + '">Fiche utilisateur</button>' : ''), true);
  }

  /* ---------- Clics ---------- */
  document.addEventListener('click', e => {
    if(!LIVE.on) return;
    const t = e.target.closest('[data-act]'); if(!t) return;
    const a = t.dataset.act, id = t.dataset.id;
    if(!/^sus-/.test(a)) return;
    e.stopPropagation(); e.preventDefault();
    switch(a){
      case 'sus-drawer': A.modal = null; openDrawer(() => susDrawer(id)); break;
      case 'sus-open':
        if(SUS.rows.some(r => r.uid === id)) openDrawer(() => susDrawer(id));
        else if(canSee('users')) openDrawer(() => userDrawer(userBy(id)));
        break;
      case 'sus-refresh': SUS.failed.clear(); SUS.load(true).then(() => toast('Analyse à jour.')); render(); break;
      case 'sus-ok': motifModal('Rien à signaler', 'Le compte sort de la file. Il y reviendra si de nouveaux signaux apparaissent.', 'sus-ok-go', id,
        {label:'Note (facultative, inscrite au journal)', ph:'Ex. : couple qui partage le même téléphone, vérifié par appel.', ok:'Confirmer'}); break;
      case 'sus-ok-go': {
        const r = SUS.rows.find(x => x.uid === id); if(!r) break;
        const note = (($('#mT') || {}).value || '').trim();
        closeModal(); A.drawer = null;
        TMDB.rpc('admin_suspect_review', {p_user:id, p_signature:r.signature, p_note:note})
          .then(() => SUS.load(false)).then(() => toast('Compte retiré de la file.'))
          .catch(err => toast(err.message || 'L\'action n\'a pas abouti.', 'bad'));
        break; }
    }
  }, true);

  /* Session déjà ouverte : admin-live a pu charger avant ce fichier. */
  (function wait(n){ if(LIVE.on){ if(!SUS.at) SUS.load(true); } else if(n > 0) setTimeout(() => wait(n - 1), 500); })(60);
})();
