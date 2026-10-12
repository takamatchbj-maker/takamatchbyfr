/* ============================================================
   TakaMatch · Espace équipe branché sur la vraie base
   ------------------------------------------------------------
   Chargé après le script principal d'admin.html. Une fois le membre
   de l'équipe connecté, remplace les données de démonstration (D.*)
   par les vraies lignes Supabase et fait passer chaque action par
   une fonction sécurisée côté base (admin_*), qui vérifie le rôle,
   applique la décision, prévient l'utilisateur et écrit au journal.
   Rien n'est gardé dans le navigateur : les données vivent en mémoire.
   ============================================================ */
(function(){
  'use strict';
  const LIVE = window.TMAdminLive = {on:false, loading:false, at:0};
  ['overview', 'verifs', 'reports', 'support', 'users', 'content', 'teams', 'payments'].forEach(v => { if(!LIVE_VIEWS.includes(v)) LIVE_VIEWS.push(v); });
  /* Remboursements : à faire depuis FedaPay tant que les paiements ne sont pas branchés. */
  Object.values(ROLES).forEach(r => { r.act = r.act.filter(a => a !== 'refund'); });

  const ms = s => s ? Date.parse(s) : 0;
  const short = (p, id) => p + '-' + String(id).replace(/-/g, '').slice(0, 6).toUpperCase();
  const PRIO_RX = /argent|arnaque|usurpation|menace|harc[eè]lement|faux/i;
  const blobs = new Map();

  async function priv(bucket, path){
    if(!path) return '';
    const k = bucket + '/' + path; if(blobs.has(k)) return blobs.get(k);
    const s = TMDB.session();
    const res = await fetch(TMDB.url + '/storage/v1/object/authenticated/' + bucket + '/' + path.split('/').map(encodeURIComponent).join('/'),
      {headers:{apikey:TMDB.key, Authorization:'Bearer ' + (s && s.access_token)}});
    if(!res.ok) throw new Error('Fichier introuvable');
    const u = URL.createObjectURL(await res.blob()); blobs.set(k, u); return u;
  }
  function missingImg(label){
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="520" height="330" viewBox="0 0 520 330"><rect width="520" height="330" rx="18" fill="#E4E0D6"/>'
      + '<text x="260" y="160" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#5D5A52">' + label + '</text>'
      + '<text x="260" y="190" text-anchor="middle" font-family="Arial" font-size="13" fill="#706C5E">Fichier absent du stockage</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ---------- Conversion des lignes de la base ---------- */
  function toUser(x){
    const legal = ((x.first || '') + ' ' + (x.last || '')).trim();
    const roles = [x.hasTal && 'tal', x.hasVis && 'vis'].filter(Boolean);
    const fill = [x.photo, x.bio, (x.skills || []).length, x.city, x.phone].filter(Boolean).length;
    return {id:x.id, legal:legal || '@' + (x.handle || 'membre'), handle:x.handle || 'sans_pseudo', email:x.email || '—', phone:x.phone || '—',
      city:x.city || '—', sex:x.sex === 'f' ? 'f' : x.sex === 'm' ? 'm' : 'n', roles:roles.length ? roles : [x.primary || 'tal'], primary:x.primary || 'tal',
      created:ms(x.created), lastSeen:ms(x.lastSign) || ms(x.updated), status:x.status || 'active', suspendedUntil:ms(x.until) || null,
      credits:x.credits || 0, verifiedEmail:!!x.vEmail, verifiedPhone:!!x.vPhone, verifiedId:!!x.vId,
      notes:(x.notes || []).map(n => ({at:ms(n.at), by:n.by, t:n.t})), online:!!x.online, completion:Math.round(fill / 5 * 100),
      invitesSent:x.invSent || 0, invitesRecv:x.invRecv || 0, matches:x.matches || 0, skills:x.skills || [], bio:x.bio || '',
      projects:(x.projects || []).map(p => p.title || 'Projet sans titre'), projRows:x.projects || [], photo:x.photo || '',
      demo:!!x.demo, staff:!!x.staff, onboarded:!!x.onboarded};
  }
  const VSTATUS = {pending:'pending', more_info:'more', approved:'approved', rejected:'rejected'};
  function toVerif(v, staffBy){
    const flags = v.flags || [];
    return {id:short('V', v.id), uuid:v.id, uid:v.user_id, at:ms(v.created_at), status:VSTATUS[v.status] || 'pending',
      mismatch:null, blurry:flags.includes('blurry') || flags.includes('floue'), live:false, doc:'', selfie:'',
      docPath:v.doc_path, selfiePath:v.selfie_path, history:[], decidedAt:v.status === 'more_info' ? null : ms(v.reviewed_at) || null,
      decidedBy:staffBy(v.reviewer_id), motif:v.note || ''};
  }
  const RSTATUS = {open:'new', in_review:'progress', closed:'done'};
  const RKIND = {profile:'Profil', project:'Fiche projet', message:'Message'};
  function toReport(r){
    const by = userBy(r.by), tg = r.target && userBy(r.target), res = String(r.resolution || '');
    const cut = res.indexOf(' · ');
    const o = {id:short('R', r.id), uuid:r.id, at:ms(r.at), prio:PRIO_RX.test(r.reason || '') ? 'high' : r.kind === 'message' ? 'medium' : 'low',
      kind:RKIND[r.kind] + (r.project ? ' · ' + r.project : ''), reason:r.reason || '—', by:by ? by.handle : '?', target:tg ? tg.handle : '',
      text:r.details || '', status:RSTATUS[r.status] || 'new', assigned:r.assigned || '', decision:cut > 0 ? res.slice(0, cut) : res,
      note:cut > 0 ? res.slice(cut + 3) : '', decidedAt:ms(r.closedAt) || null, decidedBy:r.assigned || '', live:false, notes:[], rawKind:r.kind};
    if(r.kind === 'message' && r.conv){ o.thread = 'rep-' + r.id; if(!D.threads[o.thread]) D.threads[o.thread] = {a:o.by, b:o.target, msgs:[], report:r.id}; }
    return o;
  }
  const TSTATUS = {open:'open', answered:'waiting', closed:'closed'};
  function toTicket(t, msgs, staffBy){
    return {id:short('S', t.id), uuid:t.id, at:ms(t.created_at), uid:t.user_id, topic:t.topic || 'Message', status:TSTATUS[t.status] || 'open',
      assigned:t.assigned_to ? staffBy(t.assigned_to) : '', live:false,
      msgs:[{from:'user', t:t.body, at:ms(t.created_at)}].concat(msgs.filter(m => m.ticket_id === t.id).map(m =>
        ({from:m.from_staff ? 'staff' : 'user', by:m.from_staff ? staffBy(m.author_id) : '', t:m.body, at:ms(m.created_at)})))};
  }
  const PAYST = {approved:'ok', refunded:'refunded'};
  const PAYK = {credits:'credits', second:'second', slot:'slot', pacte:'pacte'};
  function toPay(p){
    return {id:p.id, at:ms(p.created_at), uid:p.user_id, label:p.label || p.kind, amount:p.amount || 0, kind:PAYK[p.kind] || p.kind,
      op:p.method || '—', cc:p.country || '', provider:p.provider || '', status:PAYST[p.status] || 'failed', ref:p.provider_id || p.id, raw:p.status};
  }

  /* ---------- Chargement ---------- */
  async function safe(p, def){ try{ return (await p) || def; }catch(e){ console.warn('[admin-live]', e && e.message); return def; } }
  LIVE.load = async function(quiet){
    if(LIVE.loading) return; LIVE.loading = true;
    try{
      const [users, verifs, reports, tickets, smsgs, projects, team, ateliers, pactes, pays, logs, invs] = await Promise.all([
        TMDB.rpc('admin_users'),
        safe(TMDB.select('verifications', 'select=*&order=created_at.desc&limit=1000'), []),
        safe(TMDB.rpc('admin_reports'), []),
        safe(TMDB.select('support_tickets', 'select=*&order=created_at.desc&limit=500'), []),
        safe(TMDB.select('support_messages', 'select=*&order=created_at&limit=3000'), []),
        safe(TMDB.select('projects', 'select=id,title,owner_id,online,sectors,seeking,hook,created_at,updated_at&order=created_at.desc'), []),
        safe(TMDB.select('team_members', 'select=project_id,user_id,role,joined_at,left_at'), []),
        safe(TMDB.select('ateliers', 'select=project_id,data'), []),
        safe(TMDB.select('pactes', 'select=project_id,status'), []),
        safe(TMDB.select('payments', 'select=*&order=created_at.desc&limit=1000'), []),
        safe(TMDB.select('admin_log', 'select=at,actor_email,action,detail&order=at.desc&limit=30'), []),
        safe(TMDB.select('invitations', 'select=status,created_at&created_at=gte.' + new Date(Date.now() - 30 * DAY).toISOString()), []),
      ]);
      D.threads = {};
      D.users = (users || []).map(toUser); U_IDX = null;
      const staffBy = id => !id ? '' : id === TMDB.uid() ? A.me.name : ((userBy(id) || {}).legal || 'Équipe');
      D.verifs = verifs.map(v => toVerif(v, staffBy));
      D.reports = reports.map(toReport);
      D.tickets = tickets.map(t => toTicket(t, smsgs, staffBy));
      D.payments = pays.map(toPay);
      D.audit = logs.map(l => ({at:ms(l.at), by:(l.actor_email || 'système').split('@')[0], role:'', act:l.action, target:'', d:l.detail || ''}));
      /* Projets, équipes et départs */
      const pName = new Map(projects.map(p => [p.id, p.title || 'Projet sans titre']));
      const atl = new Map(ateliers.map(a => [a.project_id, a.data || {}])), pac = new Map(pactes.map(p => [p.project_id, p.status]));
      const handle = id => (userBy(id) || {}).handle || '?';
      D.liveProjects = projects.map(p => ({id:p.id, title:p.title || 'Projet sans titre', ownerId:p.owner_id, ownerHandle:handle(p.owner_id), online:!!p.online,
        sectors:p.sectors || [], seeking:p.seeking || [], hook:p.hook || '', created:ms(p.created_at)}));
      D.teams = projects.map(p => {
        const mem = team.filter(m => m.project_id === p.id && !m.left_at), tal = mem.filter(m => m.user_id !== p.owner_id);
        if(!tal.length) return null;
        const data = atl.get(p.id) || {}, mss = data.milestones || [];
        return {id:p.id, project:p.title || 'Projet sans titre', owner:handle(p.owner_id), talents:tal.map(m => handle(m.user_id)),
          jalons:mss.filter(m => m.done).length, jalonsMax:mss.length || 6, since:Math.min(...mem.map(m => ms(m.joined_at)).filter(Boolean), Date.now()),
          pacte:pac.has(p.id), pacteStatus:pac.get(p.id) || '', state:'active', dispute:null, notes:[]};
      }).filter(Boolean);
      D.departures = team.filter(m => m.left_at).sort((a, b) => ms(b.left_at) - ms(a.left_at))
        .map(m => ({at:ms(m.left_at), project:pName.get(m.project_id) || '—', who:handle(m.user_id), type:'Départ', motif:'—'}));
      D.inv30 = {n:invs.length, answered:invs.filter(i => i.status && i.status !== 'pending' && i.status !== 'sent').length};
      LIVE.on = true; LIVE.at = Date.now();
    }catch(e){
      toast('Les données de la plateforme n\'ont pas pu être chargées : ' + (e.message || e), 'bad');
    }finally{ LIVE.loading = false; }
    if(A.me && !A.modal){ const keep = A.drawer; render(); if(keep){ A.drawer = keep; paintOverlay(); } }
  };
  async function after(msg, kind){ A.modal = null; await LIVE.load(true); if(msg) toast(msg, kind); }
  async function run(p, msg, kind){ try{ await p; await after(msg, kind); return true; }catch(e){ toast(e.message || 'L\'action n\'a pas abouti.', 'bad'); return false; } }

  /* ---------- Remplacements : persistance, journal, bus de démo ---------- */
  const _save = save;
  save = function(){ if(!LIVE.on) _save(); };   /* jamais de données réelles dans le navigateur */
  log = function(act, target, d){
    D.audit.unshift({at:Date.now(), by:staffName(), role:A.me ? A.me.role : '', act, target, d:d || ''});
    if(LIVE.on) TMDB.rpc('admin_note', {p_action:act, p_detail:[target, d].filter(Boolean).join(' · ')}).catch(() => {});
    else _save();
  };
  const _bus = bus; bus = function(type, data){ if(!LIVE.on) _bus(type, data); };
  const _onPlatform = onPlatform; onPlatform = function(m){ if(!LIVE.on) _onPlatform(m); };

  const _statusChip = statusChip;
  statusChip = function(u){ return _statusChip(u) + (u && u.demo ? ' <span class="chip" title="Compte de démonstration">Démo</span>' : '') + (u && u.staff ? ' <span class="chip c-tal">Équipe</span>' : ''); };

  /* ---------- Actions branchées sur la base ---------- */
  decideVerif = function(v, status, motif){
    const u = userBy(v.uid) || {handle:'?'};
    if(status === 'more' && !motif) return toast('Écris le message à envoyer.', 'bad');
    A.drawer = null;
    run(TMDB.rpc('admin_verif_decide', {p_id:v.uuid, p_status:status === 'more' ? 'more_info' : status, p_note:motif || ''}),
      status === 'approved' ? '@' + u.handle + ' est vérifié. Le badge s\'affiche sur la plateforme.' : status === 'rejected' ? 'Dossier refusé. L\'utilisateur est prévenu.' : 'Complément demandé à @' + u.handle + '.');
  };
  userAction = function(kind, u, motif, extra){
    if(!u) return toast('Choisis un compte.', 'bad');
    if(kind === 'credits' && !extra) return toast('Indique un nombre de crédits.', 'bad');
    const L = {warn:'Avertissement envoyé à @' + u.handle + '.', offline:u.online ? 'Fiches mises hors ligne.' : 'Fiche remise en ligne.', suspend:'@' + u.handle + ' est suspendu ' + extra + ' jours.',
      ban:'@' + u.handle + ' est banni.', restore:'Compte réactivé.', unverify:'Badge retiré.', credits:'Crédits mis à jour.'};
    run(TMDB.rpc('admin_user_action', {p_user:u.id, p_kind:kind, p_motif:motif || '', p_days:kind === 'suspend' ? extra : 0, p_credits:kind === 'credits' ? extra : 0}),
      L[kind], kind === 'ban' ? 'bad' : '');
  };
  decideReport = function(r, d){
    const note = (($('#repNote') || {}).value || '').trim();
    if(!note){ const n = $('#repNote'); if(n){ n.style.borderColor = 'var(--bad)'; n.focus(); } return toast('Ajoute une note interne pour justifier la décision.', 'bad'); }
    A.drawer = null;
    run(TMDB.rpc('admin_report_decide', {p_id:r.uuid, p_decision:d, p_note:note}), 'Signalement ' + r.id + ' traité.');
  };

  /* ---------- Fiches : vrais projets et vraies fiches talent ---------- */
  VIEWS.content = () => {
    const t = curTab('content', 'projects');
    const ST = on => on ? '<span class="chip c-ok">En ligne</span>' : '<span class="chip">Hors ligne</span>';
    const projs = D.liveProjects || [], tals = D.users.filter(u => u.roles.includes('tal') && u.onboarded);
    const rows = t === 'projects'
      ? projs.map(p => { const u = userBy(p.ownerId), n = D.reports.filter(r => r.target === p.ownerHandle).length;
          return '<tr class="click" data-act="open-fiche" data-id="' + p.id + '"><td><b>' + esc(p.title) + '</b><br><small class="hint">' + p.sectors.map(s => sector(s).g + ' ' + sector(s).l).join(' · ') + '</small></td><td>' + whoCell(u) + '</td>'
            + '<td>' + p.seeking.map(skillL).join(', ') + '</td><td>' + fmt(p.created, false) + '</td><td>' + (n ? '<span class="chip c-bad">' + n + '</span>' : '0') + '</td><td>' + ST(p.online) + '</td></tr>'; })
      : tals.map(u => { const n = D.reports.filter(r => r.target === u.handle).length;
          return '<tr class="click" data-act="open-fiche" data-id="' + u.id + '"><td>' + whoCell(u) + '</td><td>' + esc(u.city.split(',')[0]) + '</td><td>' + u.skills.map(skillL).join(', ') + '</td>'
            + '<td>' + vBadge('tal', u.verifiedId) + '</td><td>' + (n ? '<span class="chip c-bad">' + n + '</span>' : '0') + '</td><td>' + ST(u.online) + '</td></tr>'; });
    return pageH('Projets et fiches', 'Modération du contenu publié sur la plateforme.')
      + tabs('content', [['projects', 'Fiches projet', projs.length], ['talents', 'Fiches talent', tals.length]])
      + table(t === 'projects' ? ['Projet', 'Porteur', 'Recherche', 'Créé le', 'Signalements', 'Statut'] : ['Talent', 'Ville', 'Compétences', 'Vérification', 'Signalements', 'Statut'], rows, 'Aucune fiche');
  };
  ficheDrawer = function(id){
    const p = (D.liveProjects || []).find(x => x.id === id), u = p ? userBy(p.ownerId) : userBy(id);
    if(!p && !u) return drawer('Fiche', '', '<p class="hint">Fiche introuvable.</p>', '');
    const on = p ? p.online : u.online;
    return drawer(esc(p ? p.title : u.legal), '<span class="chip">' + (p ? 'Fiche projet' : 'Fiche talent') + '</span>',
      '<dl class="kv"><dt>' + (p ? 'Porteur' : 'Talent') + '</dt><dd>' + whoCell(u) + '</dd>'
      + (p ? '<dt>Secteurs</dt><dd>' + p.sectors.map(s => sector(s).g + ' ' + sector(s).l).join(', ') + '</dd><dt>Recherche</dt><dd>' + p.seeking.map(skillL).join(', ') + '</dd><dt>Accroche</dt><dd style="color:var(--ink-2)">' + esc(p.hook) + '</dd>'
           : '<dt>Compétences</dt><dd>' + u.skills.map(skillL).join(', ') + '</dd><dt>Présentation</dt><dd style="color:var(--ink-2)">' + esc(u.bio) + '</dd>')
      + '<dt>Statut</dt><dd>' + (on ? 'En ligne' : 'Hors ligne') + '</dd></dl>',
      (canDo('users') ? '<button class="btn ' + (on ? 'btn-bad-ghost' : 'btn-ok') + '" data-act="fiche-mod" data-v="' + (on ? 'hidden' : 'online') + '" data-id="' + id + '">' + (on ? ic('eye-off') + 'Mettre hors ligne' : 'Remettre en ligne') + '</button>' : '')
      + (u ? '<button class="btn btn-quiet" data-act="open-user" data-id="' + u.id + '">Voir le compte</button>' : ''));
  };

  /* ---------- Interceptions des clics qui touchaient la démo ---------- */
  async function openVerif(v){
    if(!v) return;
    const u = userBy(v.uid);
    if(!v.loaded){
      toast('Ouverture du dossier…');
      const load = async (path, label) => { try{ return await priv('identity', path); }catch(e){ return u && u.demo ? '' : missingImg(label); } };
      [v.doc, v.selfie] = await Promise.all([load(v.docPath, 'Pièce d\'identité'), load(v.selfiePath, 'Selfie')]);
      v.loaded = true;
    }
    A.modal = null; openDrawer(() => verifDrawer(v));
  }
  document.addEventListener('click', e => {
    if(!LIVE.on) return;
    const t = e.target.closest('[data-act]'); if(!t) return;
    const a = t.dataset.act, id = t.dataset.id;
    const stop = () => { e.stopPropagation(); e.preventDefault(); };
    switch(a){
      case 'open-verif': stop(); if(!canSee('verifs')) return toast('Le module Vérifications n\'est pas ouvert à ton rôle.', 'bad'); openVerif(D.verifs.find(x => x.id === id)); break;
      case 'add-note': { stop(); const v = ($('#noteIn') || {}).value.trim(); if(!v) break;
        TMDB.rpc('admin_user_action', {p_user:id, p_kind:'note', p_motif:v}).then(async () => { await LIVE.load(true); const u = userBy(id); if(u) openDrawer(() => userDrawer(userBy(id))); toast('Note ajoutée.'); }).catch(err => toast(err.message, 'bad')); break; }
      case 'r-take': { stop(); const r = D.reports.find(x => x.id === id);
        TMDB.rpc('admin_report_decide', {p_id:r.uuid, p_decision:'take', p_note:''}).then(async () => { await LIVE.load(true); const r2 = D.reports.find(x => x.id === id); if(r2) openDrawer(() => reportDrawer(r2)); }).catch(err => toast(err.message, 'bad')); break; }
      case 'unlock-go': { stop(); const m = ($('#mT').value || '').trim(); if(m.length < 8) return toast('Décris le motif (8 caractères au moins).', 'bad');
        const th = D.threads[id]; if(!th) break;
        TMDB.rpc('admin_report_thread', {p_report:th.report, p_reason:($('#mR') || {}).value + ' · ' + m}).then(rows => {
          th.msgs = (rows || []).map(x => ({from:x.from || '?', t:x.t, at:ms(x.at), flag:!!x.flag})); A.unlocked.add(id); closeModal();
        }).catch(err => toast(err.message, 'bad')); break; }
      case 'fiche-mod': { stop(); const p = (D.liveProjects || []).find(x => x.id === id), on = t.dataset.v === 'online';
        if(p) run(TMDB.update('projects', 'id=eq.' + id, {online:on}).then(() => TMDB.rpc('admin_note', {p_action:on ? 'Fiche projet remise en ligne' : 'Fiche projet mise hors ligne', p_detail:p.title})), on ? 'Fiche remise en ligne.' : 'Fiche mise hors ligne.').then(() => { A.drawer = null; render(); });
        else { const u = userBy(id); if(u){ A.drawer = null; userAction('offline', u, on ? 'Remise en ligne par l\'équipe' : 'Mise hors ligne par l\'équipe'); } }
        break; }
      case 't-reply': { stop(); const x = D.tickets.find(k => k.id === id), v = ($('#tReply').value || '').trim(); if(!v) return toast('Écris ta réponse.', 'bad');
        const u = userBy(x.uid); A.ticket = id;
        run(TMDB.rpc('admin_support_reply', {p_ticket:x.uuid, p_body:v, p_close:!!t.dataset.close}), 'Réponse envoyée' + (u ? ' à ' + u.legal.split(' ')[0] : '') + '.'); break; }
      case 'ticket': { stop(); A.ticket = id; render(); break; }
      case 'refund': stop(); toast('Les remboursements se font depuis le tableau de bord FedaPay tant que les paiements ne sont pas branchés ici.'); break;
      case 't-resolve': stop(); toast('Les litiges d\'équipe ne sont pas encore ouverts sur la plateforme.'); break;
      case 'reset-demo': case 'reset-go': stop(); toast('L\'espace équipe affiche les vraies données : il n\'y a plus de démo à réinitialiser.'); closeModal(); break;
      case 'refresh-live': stop(); LIVE.load().then(() => toast('Données à jour.')); break;
    }
  }, true);
  document.addEventListener('change', e => {
    if(!LIVE.on) return;
    const t = e.target; if(t.dataset.act !== 't-status') return;
    e.stopPropagation();
    const x = D.tickets.find(k => k.id === t.dataset.id), map = {open:'open', waiting:'answered', closed:'closed'};
    run(TMDB.rpc('admin_support_status', {p_ticket:x.uuid, p_status:map[t.value]}), 'Statut mis à jour.');
  }, true);

  /* ---------- Démarrage : après la connexion, puis toutes les 2 minutes ---------- */
  const _enter = enter;
  enter = async function(){ await _enter(); if(A.me) await LIVE.load(); };
  const _logout = logout;
  logout = function(){ LIVE.on = false; blobs.forEach(u => URL.revokeObjectURL(u)); blobs.clear(); try{ D = load(); }catch(e){} _logout(); };
  /* Session déjà ouverte : enter() a pu partir avant ce fichier. */
  (function wait(n){ if(A.me){ if(!LIVE.on && !LIVE.loading) LIVE.load(); } else if(n > 0) setTimeout(() => wait(n - 1), 300); })(60);
  setInterval(() => { if(A.me && LIVE.on && !A.modal && !document.hidden && Date.now() - LIVE.at > 110e3) LIVE.load(true); }, 30e3);
})();
