"use strict";
/* ============================================================
   TakaMatch — l'outil branché sur la base (Supabase)
   ------------------------------------------------------------
   Chargé après app.js. Quand un membre connecté ouvre l'outil
   (compte « fresh » envoyé par main.js), ce fichier :
   · remplit l'annuaire (talents, projets) depuis la base ;
   · reconstruit invitations, matchs, conversations, équipes,
     favoris et notifications du profil actif ;
   · enregistre chaque action (inviter, répondre, écrire,
     quitter, favoris, signaler, fiche, Atelier, achats).
   Les comptes de démonstration de la base répondent d'eux-mêmes
   (fonctions demo_* côté serveur) : ils se comportent comme de
   vrais membres tant qu'ils existent.
   Le compte de démonstration local (app.html?demo=1) n'est pas
   concerné : il garde ses données écrites en dur.
   ============================================================ */
(function(){
  if(!window.TMDB) return;
  const DB = window.TMDB;
  const isUuid = v => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(v || ''));
  const minsSince = d => Math.max(0, (Date.now() - new Date(d).getTime()) / 60000);
  const hashN = s => { let h = 0; for(const ch of String(s || '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
  const CLEARED_KEY = 'tm-notif-cleared';

  /* Cache des données de la base. */
  const D = window.TMData = {on:false, uid:null, me:null, acc:null, prof:new Map(), ident:new Map(), proj:new Map(),
    inv:[], matches:[], team:[], ateliers:new Map(), convs:[], cmem:[], msgs:[], favs:[], notifs:[], pays:[],
    lastProf:'', lastIdent:'', lastPriv:'', lastProj:{}, lastAt:{}, busy:false};

  /* ---------- Lecture ---------- */
  const PROF_COLS = 'id,handle,city,country,photo_url,avatar_hue,primary_role,skills,sectors,level,diploma,status,pace,bio,portfolio_url,portfolio_title,no_portfolio,talent_online,verified_id,is_demo,account_status,updated_at,perso';
  async function loadAll(){
    const sel = (t, q) => DB.select(t, q).catch(e => { console.warn('[TakaMatch]', t, e.message); return []; });
    const r = await Promise.all([
      DB.loadMe(),
      sel('profiles', 'select=' + PROF_COLS + '&onboarded_at=not.is.null'),
      sel('profile_identity', 'select=id,first_name,last_name,sex'),
      sel('projects', 'select=*&order=created_at.asc'),
      sel('invitations', 'select=*&order=created_at.desc'),
      sel('matches', 'select=*'),
      sel('team_members', 'select=*'),
      sel('ateliers', 'select=*'),
      sel('conversations', 'select=*'),
      sel('conversation_members', 'select=*'),
      sel('messages', 'select=*&order=created_at.asc,id.asc&limit=3000'),
      sel('favorites', 'select=*'),
      sel('notifications', 'select=*&order=created_at.desc&limit=60'),
      sel('payments', 'select=*&order=created_at.desc&limit=50'),
      sel('verifications', 'select=status,created_at&order=created_at.desc&limit=1'),
    ]);
    const me = r[0];
    D.uid = DB.uid(); D.me = me; D.acc = (me && me.account) || {};
    D.prof = new Map((r[1] || []).map(p => [p.id, p]));
    if(me && me.profile) D.prof.set(me.profile.id, Object.assign({}, D.prof.get(me.profile.id), me.profile));
    D.ident = new Map((r[2] || []).map(i => [i.id, i]));
    D.proj = new Map((r[3] || []).map(p => [p.id, p]));
    D.inv = r[4] || []; D.matches = r[5] || []; D.team = r[6] || [];
    D.ateliers = new Map((r[7] || []).map(a => [a.project_id, a]));
    D.convs = r[8] || []; D.cmem = r[9] || []; D.msgs = r[10] || [];
    D.favs = r[11] || []; D.notifs = r[12] || []; D.pays = r[13] || [];
    D.verif = (r[14] || [])[0] || null;
  }

  /* ---------- Conversion vers le format de l'outil ---------- */
  const fullName = id => { const i = D.ident.get(id); return i && (i.first_name || i.last_name) ? (i.first_name + ' ' + i.last_name).trim() : ''; };
  const sexOf = id => { const i = D.ident.get(id); return i && (i.sex === 'm' || i.sex === 'f') ? i.sex : 'n'; };
  const daysOld = d => d ? Math.max(1, Math.round(minsSince(d) / 1440)) : 3;
  const active = p => p && (p.account_status || 'active') === 'active';
  function toTalent(p){
    return {id:p.id, handle:p.handle || 'membre', name:fullName(p.id) || String(p.handle || 'membre').replace(/_/g, ' '),
      city:p.city || '', skills:p.skills || [], sectors:p.sectors || [], level:p.level || '', pace:p.pace || 'serieux',
      verified:!!p.verified_id, seen:daysOld(p.updated_at), bio:p.bio || '', portfolio:p.portfolio_url || '',
      portfolioTitle:p.portfolio_title || '', hue:p.avatar_hue || (hashN(p.id) % 360), sex:sexOf(p.id),
      photo:p.photo_url || '', demo:!!p.is_demo, rate:'',
      hidden:!p.talent_online || !active(p)};
  }
  function toProject(pr){
    const o = D.prof.get(pr.owner_id) || {};
    return {id:pr.id, ownerId:pr.owner_id, ownerHandle:o.handle || 'porteur', title:pr.title || 'Projet sans titre',
      owner:fullName(pr.owner_id) || '@' + (o.handle || 'porteur'), ownerCity:o.city || '', ownerVerified:!!o.verified_id,
      ownerSex:sexOf(pr.owner_id), sectors:pr.sectors || [], glyph:pr.glyph || sector((pr.sectors || [])[0]).g,
      hue:hashN(pr.id) % 360, seeking:pr.seeking || [], pace:pr.pace || 'serieux', pay:pr.offer || 'equity',
      likes:hashN(pr.id) % 48, seen:daysOld(pr.updated_at), hook:pr.hook || '', vision:pr.vision || '',
      traction:pr.traction || '', assets:pr.assets || '', challenges:pr.challenges || '', link:pr.link || '',
      noLink:!!pr.no_link, photo:pr.cover_url || '', demo:!!o.is_demo,
      hidden:!pr.online || !active(o)};
  }
  function myProject(pr){
    return {id:pr.id, title:pr.title || '', glyph:pr.glyph || '💡', photo:pr.cover_url || '', likes:hashN(pr.id) % 48,
      sectors:pr.sectors || [], seeking:pr.seeking || [], hook:pr.hook || '', vision:pr.vision || '', traction:pr.traction || '',
      assets:pr.assets || '', challenges:pr.challenges || '', link:pr.link || '', noLink:!!pr.no_link,
      pace:pr.pace || 'serieux', pay:pr.offer || 'equity', online:!!pr.online};
  }

  /* L'annuaire : on remplace le contenu des listes de l'outil. */
  function fillDirectory(){
    const uid = D.uid;
    const tal = [], prj = [];
    D.prof.forEach(p => { if(p.id !== uid && p.handle) tal.push(toTalent(p)); });
    D.proj.forEach(pr => { if(pr.owner_id !== uid) prj.push(toProject(pr)); });
    TALENTS.length = 0; tal.forEach(t => TALENTS.push(t));
    PROJECTS.length = 0; prj.forEach(p => PROJECTS.push(p));
    ITEM_IDX.delete(TALENTS); ITEM_IDX.delete(PROJECTS);
    /* Fiche perso des porteurs, projets portés par des talents. */
    Object.keys(OWNERS).forEach(k => delete OWNERS[k]);
    Object.keys(TALENT_PROJECTS).forEach(k => delete TALENT_PROJECTS[k]);
    PROJECTS.forEach(x => {
      const o = D.prof.get(x.ownerId);
      const ps = o && o.perso && Object.keys(o.perso).length ? o.perso : null;
      const src = ps ? {skills:ps.skills || [], level:ps.level || '', bio:ps.bio || '', portfolio:ps.noPortfolio ? '' : (ps.portfolio || '')}
                     : o ? {skills:o.skills || [], level:o.level, bio:o.bio, portfolio:o.portfolio_url || ''} : null;
      if(src && (src.skills || []).length && src.bio) OWNERS[x.id] = Object.assign(src, {sectors:(o && o.sectors) || [], rate:'', avail:'dispo', sex:sexOf(o.id)});
      if(!x.hidden && !TALENT_PROJECTS[x.ownerId]) TALENT_PROJECTS[x.ownerId] = {title:x.title, sectors:x.sectors, seeking:x.seeking,
        pace:x.pace, pay:x.pay, hue:x.hue, hook:x.hook, vision:x.vision, traction:x.traction, assets:x.assets, challenges:x.challenges, link:x.link};
    });
    FULL.clear();
    Object.keys(PHOTOS).forEach(k => delete PHOTOS[k]);
  }
  /* Photos de profil enregistrées dans la base. */
  window.TM_FACE = id => {
    if(!D.on) return null;
    if(id === 'me') return S.me.photo || null;
    const raw = String(id || '').replace(/^P-/, '');
    if(String(id).startsWith('P-')){ const pr = D.proj.get(raw); const o = pr && D.prof.get(pr.owner_id); return (o && o.photo_url) || null; }
    const p = D.prof.get(raw); return (p && p.photo_url) || null;
  };

  /* ---------- Le compte connecté ---------- */
  function applyMe(){
    const me = D.me || {}, p = me.profile || {}, a = D.acc || {}, m = S.me;
    m.primary = p.primary_role || m.primary || 'tal';
    const id = me.identity || {}, pv = me.priv || {};
    Object.assign(m, {handle:p.handle || m.handle, city:p.city || m.city || '', skills:p.skills || [], sectors:p.sectors || [],
      level:p.level || '', diploma:p.diploma || '', status:p.status || '', pace:p.pace || 'serieux', bio:p.bio || '',
      portfolio:p.portfolio_url || '', portfolioTitle:p.portfolio_title || '', noPortfolio:!!p.no_portfolio,
      first:id.first_name || m.first || '', last:id.last_name || m.last || '', phone:pv.phone || m.phone || '',
      country:p.country || m.country || '', avatarHue:p.avatar_hue || m.avatarHue});
    /* Fiche perso : sa propre colonne ; à défaut (anciens comptes), les champs du profil. */
    const ps = p.perso && Object.keys(p.perso).length ? p.perso : null;
    m.perso = ps ? {skills:ps.skills || [], level:ps.level || '', bio:ps.bio || '', portfolio:ps.portfolio || '', portfolioTitle:ps.portfolioTitle || '', noPortfolio:!!ps.noPortfolio}
                 : {skills:(p.skills || []).slice(), level:p.level || '', bio:p.bio || '', portfolio:p.portfolio_url || '', portfolioTitle:p.portfolio_title || '', noPortfolio:!!p.no_portfolio};
    m.credits = a.credits != null ? a.credits : m.credits;
    m.creditsMax = Math.max(3, m.credits);
    m.slots = a.project_slots || 1;
    m.visUnlocked = !!(a.has_talent && a.has_visionary);
    m.online = !!p.talent_online;
    m.verifiedId = !!p.verified_id; m.verifiedPhone = !!p.verified_phone; m.verifiedEmail = true;
    m.verifyPending = !!(D.verif && D.verif.status === 'pending');
    m.photo = p.photo_url || m.photo || '';
    m.sex = sexOf(D.uid) || m.sex;
    const mine = (me.projects || []).map(myProject);
    const cur = m.projects && m.projects[m.projIdx] ? m.projects[m.projIdx].id : null;
    if(mine.length) m.projects = mine;
    else if(!m.projects || !m.projects.length || m.projects.some(x => isUuid(x.id))) m.projects = [blankProject()];
    const i = m.projects.findIndex(x => x.id === cur);
    m.projIdx = i >= 0 ? i : 0;
    if(m.primary === 'vis' && !m.visUnlocked) m.role = 'vis';
    if(m.primary === 'tal' && !m.visUnlocked) m.role = 'tal';
    S.payments = D.pays.filter(x => x.status === 'approved' || x.status === 'refunded').map(x => {
      const d = new Date(x.created_at);
      return {d:String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear(),
        l:x.label + (x.status === 'refunded' ? ' · remboursé' : ''), a:x.amount, op:x.method === 'card' ? 'Carte bancaire' : (PAY_METHODS[x.method] || {l:x.method}).l, ref:x.id, cc:x.country};
    });
    D.lastProf = profSnap(); D.lastIdent = identSnap(); D.lastPriv = String(m.phone || '');
    D.lastProj = {}; m.projects.forEach(x => { if(isUuid(x.id)) D.lastProj[x.id] = JSON.stringify(projRow(x)); });
  }

  /* ---------- Contexte actif (profil Talent ou projet) ---------- */
  const NOTIF_ICON = {mail:'link', spark:'spark', check:'check', card:'card'};
  function msgsOf(cid){ return D.msgs.filter(x => x.conversation_id === cid); }
  function memOf(cid, uid){ return D.cmem.find(x => x.conversation_id === cid && x.user_id === uid); }
  function lastReadOthers(cid){
    const o = D.cmem.filter(x => x.conversation_id === cid && x.user_id !== D.uid).map(x => +new Date(x.last_read_at || 0));
    return o.length ? Math.max.apply(null, o) : 0;
  }
  /* Identifiants des membres dans l'Atelier : « me » pour soi, « P-projet » pour le porteur vu par un talent. */
  function localId(uid, pid, ownerId){
    if(uid === D.uid) return 'me';
    if(uid === ownerId && isTalMode()) return 'P-' + pid;
    return uid;
  }
  function serialize(t, pid, ownerId){
    const st = {milestones:t.milestones, roles:t.roles, props:t.props, objectives:t.objectives, vesting:t.vesting, log:t.log, takChat:t.takChat, since:t.since};
    let s = JSON.stringify(st).split('"me"').join('"' + D.uid + '"');
    if(isTalMode()) s = s.split('"P-' + pid + '"').join('"' + ownerId + '"');
    return s;
  }
  function deserialize(s, pid, ownerId){
    let x = s.split('"' + D.uid + '"').join('"me"');
    if(isTalMode()) x = x.split('"' + ownerId + '"').join('"P-' + pid + '"');
    return JSON.parse(x, (k, v) => (typeof v === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z$/.test(v)) ? new Date(v) : v);
  }
  function buildTeam(pid){
    const pr = D.proj.get(pid); if(!pr) return null;
    const rows = D.team.filter(x => x.project_id === pid && !x.left_at);
    const tals = rows.filter(x => x.role === 'tal');
    if(!tals.length) return null;
    const tal = isTalMode();
    const item = tal ? itemById(pid) : null;
    const members = [];
    if(tal) members.push(memberOwner(item)); else members.push(memberMe('vis'));
    tals.forEach(r => {
      if(r.user_id === D.uid) members.push(memberMe('tal'));
      else { const p = D.prof.get(r.user_id); if(p) members.push(memberTal(toTalent(p))); }
    });
    const t = newTeam(pid, pr.title || 'Projet', pr.glyph || '💡', members);
    t.equity = {};
    tals.forEach(r => { t.equity[localId(r.user_id, pid, pr.owner_id)] = Number(r.equity) || 0; });
    const joins = tals.map(r => new Date(r.joined_at)).sort((a, b) => a - b);
    t.since = tal ? new Date((tals.find(r => r.user_id === D.uid) || tals[0]).joined_at) : joins[0];
    const at = D.ateliers.get(pid), data = (at && at.data) || {};
    if(data.app){
      try{
        const saved = deserialize(JSON.stringify(data.app), pid, pr.owner_id), ms = saved.milestones || [];
        delete saved.milestones; Object.assign(t, saved);
        t.milestones.forEach((m, i) => { if(ms[i]){ m.done = !!ms[i].done; m.d = ms[i].d || null; } });
      }catch(e){ console.warn('[TakaMatch] atelier', e); }
    } else {
      (data.jalons || []).forEach((j, i) => { if(j.done && t.milestones[i]){ t.milestones[i].done = true; t.milestones[i].d = new Date(+t.since + (i + 1) * 2 * 864e5); } });
      if(data.vesting) t.vesting = data.vesting;
      tals.slice().sort((a, b) => new Date(a.joined_at) - new Date(b.joined_at)).forEach(r => {
        const m = members.find(z => z.id === localId(r.user_id, pid, pr.owner_id));
        if(m) teamLog(t, (m.me ? 'Tu rejoins' : m.first + ' rejoint') + ' l\'équipe', '', new Date(r.joined_at));
      });
      if(data.state === 'dispute') teamLog(t, 'Litige ouvert', (data.dispute && data.dispute.reason) || '', new Date(Date.now() - 3 * 864e5));
    }
    t.dbOwner = pr.owner_id;
    D.lastAt[pid] = serialize(t, pid, pr.owner_id);
    /* Le groupe de l'équipe. */
    const gc = D.convs.find(c => c.project_id === pid && c.kind === 'team');
    if(gc){
      t.convId = gc.id;
      t.group = msgsOf(gc.id).map(x => ({from:localId(x.sender_id, pid, pr.owner_id), txt:x.body, d:new Date(x.created_at)}));
      const mm = memOf(gc.id, D.uid), lr = mm ? +new Date(mm.last_read_at || 0) : 0;
      t.unreadGroup = msgsOf(gc.id).filter(x => x.sender_id !== D.uid && +new Date(x.created_at) > lr).length;
    }
    return t;
  }
  function buildCtx(){
    const tal = isTalMode(), uid = D.uid;
    const keepThread = S.activeThread, keepAt = S.atelierId;
    Object.assign(S, {teams:{}, left:new Set(), removed:{}, pendingJoin:null, takTab:null,
      matches:[], threads:[], invitesRecv:[], invitesSent:[], activeThread:null, atelierId:null});
    const pid = tal ? null : (S.me.project && S.me.project.id);
    const mine = inv => tal ? inv.talent_id === uid : inv.project_id === pid;
    const itemOf = inv => tal ? inv.project_id : inv.talent_id;
    const reveal = id => { const x = itemById(id); return !!x.id; };
    /* Les fiches liées (équipe, conversations) restent consultables même hors ligne. */
    const ensure = id => {
      if(reveal(id)) return true;
      if(tal){ const pr = D.proj.get(id); if(!pr) return false; const x = toProject(pr); x.hidden = true; PROJECTS.push(x); ITEM_IDX.delete(PROJECTS); }
      else { const p = D.prof.get(id); if(!p) return false; const x = toTalent(p); x.hidden = true; TALENTS.push(x); ITEM_IDX.delete(TALENTS); }
      return true;
    };
    D.inv.filter(mine).forEach(inv => {
      const id = itemOf(inv); if(!ensure(id)) return;
      const fromMe = inv.sender_id === uid;
      let st = inv.status;
      if(st === 'pending') st = new Date(inv.expires_at) < new Date() ? 'expired' : (fromMe ? 'sent' : 'new');
      if(st === 'withdrawn') st = 'expired';
      const row = {id, status:st, min:minsSince(inv.created_at), msg:inv.message || '', dbId:inv.id, dir:fromMe ? 'sent' : 'recv'};
      /* Une seule ligne par fiche : la plus récente. */
      const list = fromMe ? S.invitesSent : S.invitesRecv;
      if(!list.some(z => z.id === id)) list.push(row);
    });
    D.matches.filter(m => tal ? m.talent_id === uid : m.project_id === pid).forEach(m => {
      const id = tal ? m.project_id : m.talent_id; if(!ensure(id)) return;
      if(m.ended_at){ S.left.add(id); if(!tal) S.removed[id] = new Date(m.ended_at); }
      else S.matches.push({id, fresh:false, min:minsSince(m.created_at), dbId:m.id});
    });
    S.matches.sort((a, b) => a.min - b.min);
    /* Conversations privées. */
    D.convs.filter(c => c.kind === 'direct').forEach(c => {
      const m = D.matches.find(z => z.id === c.match_id); if(!m) return;
      if(tal ? m.talent_id !== uid : m.project_id !== pid) return;
      const id = tal ? m.project_id : m.talent_id; if(!ensure(id)) return;
      const mm = memOf(c.id, uid), lr = mm ? +new Date(mm.last_read_at || 0) : 0, seenBy = lastReadOthers(c.id);
      const msgs = msgsOf(c.id).map(x => ({me:x.sender_id === uid, txt:x.body, d:new Date(x.created_at), read:+new Date(x.created_at) <= seenBy}));
      S.threads.push({id, convId:c.id, unread:msgs.some(x => !x.me && +x.d > lr), archived:!!(mm && mm.archived) || !!m.ended_at,
        ro:!!m.ended_at || !!(mm && mm.left_at), msgs, last:msgs.length ? +msgs[msgs.length - 1].d : +new Date(c.created_at)});
    });
    S.threads.sort((a, b) => b.last - a.last);
    /* Équipes et Ateliers. */
    if(tal) S.matches.forEach(m => { const t = buildTeam(m.id); if(t) S.teams[m.id] = t; });
    else if(pid){ const t = buildTeam(pid); if(t) S.teams[pid] = t; }
    S.activeThread = S.threads.some(z => z.id === keepThread) || (String(keepThread).startsWith('G:') && S.teams[String(keepThread).slice(2)]) ? keepThread : (S.threads[0] ? S.threads[0].id : null);
    S.atelierId = S.teams[keepAt] ? keepAt : (Object.keys(S.teams)[0] || null);
    /* Profil entier : notifications, favoris. */
    let cleared = 0; try{ cleared = +localStorage.getItem(CLEARED_KEY) || 0; }catch(e){}
    S.notifs = D.notifs.filter(n => +new Date(n.created_at) > cleared)
      .map(n => ({i:NOTIF_ICON[n.icon] || n.icon || 'bell', t:n.title, s:n.body, min:minsSince(n.created_at), read:!!n.read, dbId:n.id}));
    const kind = tal ? 'project' : 'profile';
    S.favs = new Set(D.favs.filter(f => f.target_kind === kind).map(f => f.target_id));
    if(!S.likes) S.likes = new Set();
    if(!S.reported) S.reported = new Set();
  }

  /* L'outil appelle seedDemo() pour chaque contexte jamais ouvert. */
  const _seed = seedDemo;
  seedDemo = function(){ if(!D.on) return _seed(); buildCtx(); };

  /* ---------- Rechargement ---------- */
  function signature(){
    return [D.inv.length, D.inv.map(i => i.status).join(''), D.matches.length, D.matches.filter(m => m.ended_at).length,
      D.msgs.length, D.notifs.length, D.notifs.filter(n => !n.read).length, D.team.length, D.acc && D.acc.credits].join('|');
  }
  async function refresh(force){
    if(D.busy) return; D.busy = true;
    try{
      const before = signature();
      await loadAll();
      if(!force && before === signature()) return;
      if(S.view === 'fiche' && isDirty()) return;   /* jamais pendant une saisie de fiche */
      const view = S.view;
      applyMe(); fillDirectory();
      S.ctxs = {}; S.prof = {};
      loadCtx();
      if(S.saved) saveBaseline(true);
      const typing = document.activeElement && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if(!typing && !S.layer){ S.view = view; render(); if(view === 'messages') scrollChat(); }
      else { renderTop(); syncSide(); }
    }catch(e){ console.warn('[TakaMatch] rechargement', e); }
    finally{ D.busy = false; }
  }
  D.refresh = refresh;
  D.isDemo = id => !!(D.prof.get(id) || {}).is_demo;

  /* ---------- Démarrage ---------- */
  async function boot(){
    const top = $('#topbar'); if(top) top.classList.add('busy');
    try{
      try{ await DB.rpc('demo_welcome'); }catch(e){}
      await loadAll();
      D.on = true;
      applyMe(); fillDirectory();
      S.ctxs = {}; S.prof = {};
      loadCtx(); saveBaseline(true);
      S._painted = null; render();
      setInterval(() => { if(document.visibilityState === 'visible' && navigator.onLine !== false) refresh(false); }, 15000);
      document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'visible') refresh(false); });
    }catch(e){
      if(window.TMGuard) TMGuard.log(e, 'chargement des données');
      toast('Les données n\'ont pas pu être chargées. Recharge la page.', 'bad');
    }finally{ if(top) top.classList.remove('busy'); }
  }
  addEventListener('message', e => {
    const d = e.data; if(!d || !d.tm || d.type !== 'account') return;
    if(d.acc && d.acc.kind === 'fresh' && DB.uid()) setTimeout(boot, 0);
  });

  /* ============================================================
     Écritures
     ============================================================ */
  const fail = e => { toast((e && e.message) || 'L\'action n\'a pas abouti. Réessaie.', 'bad'); refresh(true); };
  const later = (ms, fn) => new Promise(r => setTimeout(() => r(fn && fn()), ms));
  const isDemoItem = x => !!(x && x.demo);

  /* La célébration du match (identique à celle de l'outil). */
  function celebrate(id){
    const x = itemById(id); if(!x.id) return;
    const partner = isTalMode() ? x.owner : x.name;
    confetti();
    modal('', '<div class="ov-ok"><div style="position:relative;margin-bottom:12px">'+revealAv(x)+'</div>'
      + '<h2 class="ov-t" id="ovT" style="margin:0 0 8px">Vous avez matché</h2>'
      + '<p style="max-width:40ch"><b>'+esc(partner)+'</b> a accepté. Vos noms, photos et coordonnées sont maintenant visibles, la messagerie est ouverte et l\'Atelier vous attend.</p></div>'
      + note('a','target','Première étape recommandée : <b>une visio de 45 minutes</b>, avant tout engagement.')
      + (isTalMode() ? note('', 'users', 'Tu es maintenant sur <span class="mono">'+engagedN()+'/3</span> projets.') : ''),
      '<button class="btn btn-ghost" data-act="close">Plus tard</button><button class="btn btn-a" data-act="goto-thread" data-id="'+id+'">'+ic('chat')+'Ouvrir la discussion</button>');
  }

  /* Envoyer une invitation (ou une candidature, côté Talent). */
  const _inviteSend = inviteSend;
  inviteSend = async function(id){
    if(!D.on) return _inviteSend(id);
    const x = itemById(id); if(!x.id) return;
    const err = $('#invErr');
    if(navigator.onLine === false){ if(err) err.innerHTML = note('bad', 'alert', 'Connexion perdue. Ton message est conservé, réessaie dès le retour du réseau.'); return; }
    const tal = isTalMode(), msg = ($('#invMsg') && $('#invMsg').value.trim()) || '';
    const btn = $('#layer [data-act="invite-send"]'); if(btn){ btn.disabled = true; btn.classList.add('loading'); }
    let invId;
    try{ invId = await DB.rpc('send_invitation', {p_project:tal ? id : S.me.project.id, p_talent:tal ? D.uid : id, p_message:msg}); }
    catch(e){
      if(btn){ btn.disabled = false; btn.classList.remove('loading'); }
      if(err) err.innerHTML = note('bad', 'alert', esc(e.message)); else toast(e.message, 'bad');
      return;
    }
    if(!tal) S.me.credits = Math.max(0, S.me.credits - 1);
    S.invitesSent = S.invitesSent.filter(z => z.id !== id);
    S.invitesSent.unshift({id, status:'sent', min:0, msg, dbId:invId, dir:'sent'});
    closeLayer();
    toast((tal ? 'Candidature envoyée à ' : 'Invitation envoyée à ') + handleOf(x) + '.', 'ok');
    render();
    refresh(true);
    /* Les comptes de démonstration répondent au bout de quelques secondes. */
    if(isDemoItem(x)){
      await later(4000 + Math.random() * 4000);
      let res = 'noop';
      try{ res = await DB.rpc('demo_answer_invitation', {p_invitation:invId}); }catch(e){}
      await refresh(true);
      if(res === 'accepted'){
        if(S.layer) closeLayer();
        celebrate(id);
      } else if(res === 'declined') toast('Invitation déclinée par ' + handleOf(x) + '. Ce n\'est pas personnel, continue.', 'bad');
    }
  };

  /* Répondre à une invitation reçue. */
  const _accept = acceptInvite;
  acceptInvite = async function(id){
    if(!D.on) return _accept(id);
    const inv = S.invitesRecv.find(i => i.id === id); if(!inv) return;
    if(isFull()) return fullModal({type:'accept', id});
    try{ await DB.rpc('respond_invitation', {p_invitation:inv.dbId, p_accept:true}); }
    catch(e){ return fail(e); }
    if(S.layer) closeLayer();
    await refresh(true);
    celebrate(id);
  };
  const _decline = declineInvite;
  declineInvite = async function(id){
    if(!D.on) return _decline(id);
    const inv = S.invitesRecv.find(i => i.id === id); if(!inv) return;
    try{ await DB.rpc('respond_invitation', {p_invitation:inv.dbId, p_accept:false}); }
    catch(e){ return fail(e); }
    inv.status = 'declined'; render();
    toast('Invitation déclinée. Répondre, même par un non, protège ta réputation.');
    refresh(true);
  };

  /* Quitter un projet / retirer un talent. */
  const _leave = doLeave;
  doLeave = function(id){
    if(!D.on) return _leave(id);
    const pid = isTalMode() ? id : S.me.project.id;
    _leave(id);
    DB.rpc('leave_team', {p_project:pid, p_user:null}).then(() => refresh(true)).catch(fail);
  };
  const _remove = doRemove;
  doRemove = function(){
    if(!D.on) return _remove();
    const tid = S.rmId, pid = S.me.project.id;
    const sel = $('#layer .opt[data-act="rm-reason"][aria-pressed="true"]');
    _remove();
    if(!sel || !tid) return;
    DB.rpc('leave_team', {p_project:pid, p_user:tid}).then(() => refresh(true)).catch(fail);
  };

  /* Messages : conversation privée et groupe d'équipe. */
  async function afterSend(cid, viewId){
    const hasDemo = D.cmem.some(m => m.conversation_id === cid && m.user_id !== D.uid && !m.left_at && (D.prof.get(m.user_id) || {}).is_demo);
    if(!hasDemo){ refresh(true); return; }
    await later(900);
    S.typing = true; if(S.view === 'messages' && S.activeThread === viewId){ render(); scrollChat(); }
    await later(1800 + Math.random() * 1500);
    try{ await DB.rpc('demo_reply', {p_conv:cid}); }catch(e){}
    S.typing = false;
    await refresh(true);
    if(S.view === 'messages'){ render(); scrollChat(); }
  }
  function post(cid, txt, viewId){
    if(!cid) return toast('Cette conversation n\'est pas encore ouverte.', 'bad');
    DB.insert('messages', {conversation_id:cid, sender_id:D.uid, body:txt})
      .then(() => afterSend(cid, viewId))
      .catch(e => { toast(e.message, 'bad'); refresh(true); });
  }
  const _sendGroup = sendGroup;
  sendGroup = function(t, txt, inputId){
    if(!D.on) return _sendGroup(t, txt, inputId);
    txt = (txt || '').trim(); if(!txt || t.groupClosed) return;
    t.group.push({from:'me', txt, d:new Date()});
    const inp = $('#' + inputId); if(inp) inp.value = '';
    render(); scrollChat();
    post(t.convId, txt, 'G:' + t.id);
    const i2 = $('#' + inputId); if(i2) try{ i2.focus(); }catch(e){}
  };
  const _sendMsg = sendMsg;
  sendMsg = function(txt){
    if(!D.on) return _sendMsg(txt);
    if(String(S.activeThread).startsWith('G:')){
      const t = S.teams[S.activeThread.slice(2)]; if(t) sendGroup(t, txt || ($('#msgIn') ? $('#msgIn').value : ''), 'msgIn'); return;
    }
    const th = S.threads.find(t => t.id === S.activeThread); if(!th || th.ro) return;
    txt = (txt || ($('#msgIn') ? $('#msgIn').value : '')).trim(); if(!txt) return;
    th.msgs.push({me:true, txt, d:new Date(), read:false}); th.archived = false;
    const inp = $('#msgIn'); if(inp) inp.value = '';
    render(); scrollChat();
    post(th.convId, txt, th.id);
    const i2 = $('#msgIn'); if(i2) try{ i2.focus(); }catch(e){}
  };

  /* Lu : quand une conversation est affichée. */
  function markRead(){
    if(!D.on || S.view !== 'messages') return;
    const id = S.activeThread; let cid = null;
    if(String(id).startsWith('G:')){ const t = S.teams[String(id).slice(2)]; cid = t && t.convId; }
    else { const th = S.threads.find(z => z.id === id); cid = th && th.convId; }
    if(!cid) return;
    const mm = memOf(cid, D.uid); if(!mm) return;
    const last = msgsOf(cid).filter(x => x.sender_id !== D.uid).pop();
    if(!last || +new Date(mm.last_read_at || 0) >= +new Date(last.created_at)) return;
    mm.last_read_at = new Date().toISOString();
    DB.update('conversation_members', 'conversation_id=eq.' + cid + '&user_id=eq.' + D.uid, {last_read_at:mm.last_read_at}).catch(() => {});
  }

  /* Notifications lues / effacées. */
  const _drawer = drawer;
  drawer = function(){
    _drawer();
    if(!D.on) return;
    const ids = D.notifs.filter(n => !n.read).map(n => n.id);
    if(!ids.length) return;
    D.notifs.forEach(n => n.read = true);
    DB.update('notifications', 'id=in.(' + ids.join(',') + ')', {read:true}).catch(() => {});
  };
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-act]'); if(!t || !D.on) return;
    const a = t.dataset.act, id = t.dataset.id;
    if(a === 'clear-notifs'){ try{ localStorage.setItem(CLEARED_KEY, String(Date.now())); }catch(err){} }
    if(a === 'fav'){
      const on = S.favs.has(id), kind = isTalMode() ? 'project' : 'profile';
      (on ? DB.insert('favorites', {user_id:D.uid, target_kind:kind, target_id:id})
          : DB.remove('favorites', 'user_id=eq.' + D.uid + '&target_kind=eq.' + kind + '&target_id=eq.' + id))
        .then(() => { if(on) D.favs.push({user_id:D.uid, target_kind:kind, target_id:id}); else D.favs = D.favs.filter(f => !(f.target_id === id && f.target_kind === kind)); })
        .catch(err => toast(err.message, 'bad'));
    }
    if(a === 'report-go'){
      const reason = (($('#layer .opt[data-act="rep-reason"][aria-pressed="true"]') || {}).textContent || 'Autre raison').trim();
      DB.insert('reports', {reporter_id:D.uid, target_kind:isTalMode() ? 'project' : 'profile', target_id:id, reason,
        details:(($('#repTxt') || {}).value || '').trim(), status:'open'}).catch(err => toast(err.message, 'bad'));
    }
    if(a === 'archive' && id){
      const th = S.threads.find(z => z.id === id);
      if(th && th.convId) DB.update('conversation_members', 'conversation_id=eq.' + th.convId + '&user_id=eq.' + D.uid, {archived:!!th.archived}).catch(() => {});
    }
  });
  /* Message au support. */
  document.addEventListener('submit', e => {
    const f = e.target.closest && e.target.closest('[data-form="support"]'); if(!f || !D.on) return;
    const v = (($('#supportMsg') || {}).value || '').trim(); if(!v) return;
    DB.insert('support_tickets', {user_id:D.uid, topic:(($('#supTopic') || {}).value || 'Une question'), body:v, status:'open', staff_reply:''})
      .catch(err => toast(err.message, 'bad'));
  }, true);

  /* Vérification d'identité : pièce + selfie dans l'espace privé « identity ». */
  D.verify = async function(doc, selfie){
    try{
      if(!doc || !selfie) throw new Error('Ajoute la photo de ta pièce et ton selfie.');
      const ts = Date.now(), ext = f => (/png/.test(f.type) ? 'png' : /webp/.test(f.type) ? 'webp' : /pdf/.test(f.type) ? 'pdf' : 'jpg');
      const d = D.uid + '/piece-' + ts + '.' + ext(doc), s = D.uid + '/selfie-' + ts + '.' + ext(selfie);
      await DB.upload('identity', d, doc); await DB.upload('identity', s, selfie);
      await DB.insert('verifications', {user_id:D.uid, doc_path:d, selfie_path:s, status:'pending'});
    }catch(e){ S.me.verifyPending = false; toast('Dossier non envoyé : ' + e.message, 'bad'); render(); }
  };

  /* ---------- Achats : paiements de test tant que FedaPay n'est pas branché ---------- */
  const _create = TMPay.createPayment.bind(TMPay);
  TMPay.createPayment = async function(req, idem){
    if(!D.on || !this.simulated()) return _create(req, idem);
    const id = await DB.rpc('test_purchase', {p_key:req.product, p_country:req.country || null, p_method:req.method || null, p_amount:req.amount || null});
    setTimeout(() => refresh(true), 1500);
    return {id, status:'approved', provider:'test'};
  };

  /* ---------- Fiche, profil et projets ---------- */
  function profSnap(){
    const m = S.me, row = {city:m.city || '', pace:m.pace || 'serieux', skills:m.skills || [], sectors:m.sectors || [], level:m.level || '',
      diploma:m.diploma || '', status:m.status || '', bio:m.bio || '', portfolio_url:m.noPortfolio ? '' : (m.portfolio || ''),
      portfolio_title:m.noPortfolio ? '' : (m.portfolioTitle || ''), no_portfolio:!!m.noPortfolio, handle:m.handle || null,
      perso:m.perso || {}};
    if(D.acc && D.acc.has_talent) row.talent_online = !!m.online;
    if(m.photo && !/^data:/.test(m.photo)) row.photo_url = m.photo;
    return JSON.stringify(row);
  }
  function identSnap(){ const m = S.me; return JSON.stringify({first_name:m.first || '', last_name:m.last || '', sex:m.sex === 'm' || m.sex === 'f' ? m.sex : 'n'}); }
  function projRow(p){
    return {title:p.title || '', glyph:p.glyph || '💡', cover_url:/^data:/.test(p.photo || '') ? '' : (p.photo || ''), sectors:p.sectors || [], seeking:p.seeking || [],
      hook:p.hook || '', vision:p.vision || '', traction:p.traction || '', assets:p.assets || '', challenges:p.challenges || '',
      link:p.noLink ? '' : (p.link || ''), no_link:!!p.noLink, pace:p.pace || 'serieux', offer:p.pay || 'equity', online:!!p.online};
  }
  let saveT = null, saving = null;
  function schedulePersist(){ if(!D.on) return; clearTimeout(saveT); saveT = setTimeout(() => { saving = persist().finally(() => { saving = null; }); }, 700); }
  async function upImg(bucket, dataUrl, name){
    const blob = DB.dataUrlToBlob(dataUrl); if(!blob) return '';
    return DB.upload(bucket, D.uid + '/' + name + '-' + Date.now() + '.jpg', blob);
  }
  async function persist(){
    const m = S.me, uid = D.uid;
    try{
      if(m.photo && /^data:/.test(m.photo)) m.photo = await upImg('avatars', m.photo, 'photo');
      const ps = profSnap();
      if(ps !== D.lastProf){ await DB.update('profiles', 'id=eq.' + uid, JSON.parse(ps)); D.lastProf = ps; }
      const is = identSnap();
      if(is !== D.lastIdent){ await DB.update('profile_identity', 'id=eq.' + uid, JSON.parse(is)); D.lastIdent = is; }
      const ph = String(m.phone || '');
      if(ph !== D.lastPriv){ await DB.update('profile_private', 'id=eq.' + uid, {phone:ph}); D.lastPriv = ph; }
      for(const p of m.projects){
        if(p.photo && /^data:/.test(p.photo)) p.photo = await upImg('covers', p.photo, 'couverture');
        const row = projRow(p), js = JSON.stringify(row);
        if(isUuid(p.id)){
          if(D.lastProj[p.id] !== js){ await DB.update('projects', 'id=eq.' + p.id, row); D.lastProj[p.id] = js; }
        } else if((p.title || p.hook) && D.acc && D.acc.has_visionary){
          const r = await DB.insert('projects', Object.assign({owner_id:uid}, row));
          const nid = r && r[0] && r[0].id; if(!nid) continue;
          const old = p.id; p.id = nid; D.lastProj[nid] = js;
          if(S.ctxs['vis:' + old]){ S.ctxs['vis:' + nid] = S.ctxs['vis:' + old]; delete S.ctxs['vis:' + old]; }
        }
      }
      /* Fiches supprimées dans l'outil. */
      const keep = new Set(m.projects.map(p => p.id));
      for(const id of Object.keys(D.lastProj)){
        if(!keep.has(id)){ await DB.remove('projects', 'id=eq.' + id); delete D.lastProj[id]; }
      }
    }catch(e){
      toast('Enregistrement impossible : ' + e.message, 'bad');
    }
  }
  const _saveBaseline = saveBaseline;
  saveBaseline = function(quiet){ _saveBaseline(); if(quiet !== true) schedulePersist(); };
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-act]'); if(!t || !D.on) return;
    if(['online','photo-rm'].includes(t.dataset.act)) schedulePersist();
  });

  /* ---------- Atelier : l'état de chaque équipe est enregistré ---------- */
  let atT = null;
  function scheduleAtelier(){
    if(!D.on) return;
    clearTimeout(atT);
    atT = setTimeout(async () => {
      for(const pid of Object.keys(S.teams)){
        const t = S.teams[pid], pr = D.proj.get(pid); if(!pr || !t) continue;
        const s = serialize(t, pid, pr.owner_id);
        if(s === D.lastAt[pid]) continue;
        D.lastAt[pid] = s;
        const cur = (D.ateliers.get(pid) || {}).data || {};
        const data = Object.assign({}, cur, {app:JSON.parse(s)});
        try{
          await DB.update('ateliers', 'project_id=eq.' + pid, {data, updated_by:D.uid, updated_at:new Date().toISOString()});
          D.ateliers.set(pid, Object.assign({}, D.ateliers.get(pid), {project_id:pid, data}));
        }catch(e){ console.warn('[TakaMatch] atelier', e); }
        /* Le porteur fixe les parts de chacun. */
        if(isAdmin(t)){
          for(const m of talentsOf(t)){
            const v = Number(t.equity[m.id]) || 0, row = D.team.find(r => r.project_id === pid && r.user_id === m.id && !r.left_at);
            if(row && Number(row.equity) !== v){ row.equity = v; DB.update('team_members', 'project_id=eq.' + pid + '&user_id=eq.' + m.id, {equity:v}).catch(() => {}); }
          }
        }
      }
    }, 1200);
  }

  /* Après chaque affichage : messages lus, Atelier enregistré. */
  const _render = render;
  render = function(){ _render.apply(this, arguments); if(D.on){ markRead(); scheduleAtelier(); } };
})();
