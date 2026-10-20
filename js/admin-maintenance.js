/* ============================================================
   TakaMatch — Espace équipe · module « Maintenance »
   ------------------------------------------------------------
   Un interrupteur pour fermer le site au public le temps d'une
   mise à jour, sans jamais le faire par accident :
   · l'interrupteur ouvre d'abord une fenêtre de préparation
     (portée, heure de début, retour prévu, message, aperçu) ;
   · rien ne change tant que la fermeture n'est pas confirmée ;
   · pendant la maintenance : bandeau sur tout l'espace équipe,
     prolongation en un clic (+15 min, +30 min), réouverture
     confirmée en une étape ;
   · chaque bascule est inscrite au journal par la base (trigger).
   Réglage : app_settings › maintenance (supabase/23_maintenance.sql).
   Lu par js/maintenance.js sur les pages publiques et par
   maintenance.html. Modification réservée aux administrateurs.
   Chargé après le script principal de admin.html.
   ============================================================ */
(function(){
  'use strict';
  if(typeof MODULES === 'undefined') return;

  P.wrench = '<path d="M14.7 6.3a4 4 0 0 0 5.3 5.3l-8.3 8.3a2.4 2.4 0 0 1-3.4-3.4z"/><path d="M14.7 6.3 17 4a5 5 0 0 1 3 3l-2.3 2.3"/>';
  P.ext = P.ext || '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>';

  /* Le module prend place dans « Administration », avant Paramètres. */
  const at = MODULES.findIndex(m => m.id === 'settings');
  MODULES.splice(at < 0 ? MODULES.length : at, 0, {id:'maintenance', l:'Maintenance', i:'wrench', grp:'Administration'});
  if(ROLES.super && !ROLES.super.can.includes('maintenance')) ROLES.super.can.push('maintenance');
  if(!LIVE_VIEWS.includes('maintenance')) LIVE_VIEWS.push('maintenance');

  const DEF = {active:false, scope:'all', title:'On améliore TakaMatch',
    message:'La plateforme fait une courte pause pour une mise à jour. Tes données, tes conversations et tes crédits sont en sécurité.',
    starts_at:null, ends_at:null, started_at:null, by:null};
  const PRESETS = [
    {k:'maj', l:'Mise à jour', title:'On améliore TakaMatch', message:'La plateforme fait une courte pause pour une mise à jour. Tes données, tes conversations et tes crédits sont en sécurité.'},
    {k:'nouv', l:'Nouveautés', title:'De nouvelles fonctions arrivent', message:'On installe des nouveautés pour vous aider à bâtir vos équipes. Encore quelques minutes de patience : tout ce que tu as fait est conservé.'},
    {k:'inc', l:'Incident', title:'Un souci technique, on s\'en occupe', message:'Nous avons détecté un problème et nous le corrigeons. Tes données sont en sécurité. Merci pour ta patience, on revient très vite.'},
  ];
  const STARTS = [[0, 'Maintenant'], [5, 'Dans 5 min'], [15, 'Dans 15 min'], [30, 'Dans 30 min']];
  const DURS = [[15, '15 min'], [30, '30 min'], [60, '1 h'], [120, '2 h'], [0, 'Sans estimation'], [-1, 'Autre…']];
  const PASS_KEY = 'tm-maint-pass', PASS_TTL = 12 * 3600e3;

  const M = {v:null, loading:false, err:'', missing:false, busy:false, hist:null, d:null};
  const ms = s => { const t = s ? Date.parse(s) : NaN; return isNaN(t) ? 0 : t; };
  const sup = () => !!(A.me && A.me.role === 'super');

  /* ---------- Temps lisibles ---------- */
  const hhmm = t => { const d = new Date(t); return d.getHours() + ' h ' + String(d.getMinutes()).padStart(2, '0'); };
  const dayPre = t => { const d = new Date(t), n = new Date(), tm = new Date(); tm.setDate(n.getDate() + 1);
    return d.toDateString() === n.toDateString() ? '' : d.toDateString() === tm.toDateString() ? 'demain ' : d.toLocaleDateString('fr-FR', {day:'numeric', month:'short'}) + ' '; };
  const when = t => dayPre(t) + hhmm(t);
  function dur(msx){ const m = Math.max(0, Math.round(msx / 60000)); if(m < 1) return 'moins d\'une minute'; if(m < 60) return m + ' min';
    const h = Math.floor(m / 60), r = m % 60; return h + ' h' + (r ? ' ' + String(r).padStart(2, '0') : ''); }
  function clock(msx){ const s = Math.max(0, Math.round(msx / 1000)), m = Math.floor(s / 60);
    return m >= 60 ? dur(msx) : m + ' min ' + String(s % 60).padStart(2, '0') + ' s'; }
  const localInput = t => { const d = new Date(t - new Date(t).getTimezoneOffset() * 60000); return d.toISOString().slice(0, 16); };

  /* État : off · scheduled · on */
  function state(v){ v = v || M.v; if(!v || !v.active) return 'off'; return ms(v.starts_at) > Date.now() ? 'scheduled' : 'on'; }
  const scopeL = s => s === 'app' ? 'Outil et inscription' : 'Tout le site';

  /* ---------- Laissez-passer de l'équipe sur ce navigateur ---------- */
  function syncPass(){ try{ if(A.me) localStorage.setItem(PASS_KEY, String(Date.now() + PASS_TTL)); else localStorage.removeItem(PASS_KEY); }catch(e){} }

  /* ---------- Base ---------- */
  async function load(quiet){
    if(M.loading) return; M.loading = true;
    try{
      const rows = await TMDB.select('app_settings', 'key=eq.maintenance&select=value,updated_at');
      if(!rows || !rows.length){ M.missing = true; M.v = null; }
      else { M.missing = false; M.v = Object.assign({}, DEF, rows[0].value || {}); M.err = ''; }
    }catch(e){ M.err = e.message || 'Chargement impossible.'; }
    M.loading = false;
    if(!quiet || A.view === 'maintenance') safeRender(); else paintBanner();
  }
  async function loadHist(){
    try{ M.hist = await TMDB.select('admin_log', 'select=at,actor_email,action,detail&action=like.Maintenance*&order=at.desc&limit=12') || []; }
    catch(e){ M.hist = []; }
    if(A.view === 'maintenance') safeRender();
  }
  function safeRender(){ if(!A.me) return; if(A.modal && A.view === 'maintenance'){ paintHero(); paintBanner(); return; } if(!A.modal) render(); else paintBanner(); }

  async function save(v, msg){
    if(!sup()) return toast('Seul un super admin peut changer la maintenance.', 'bad'), false;
    M.busy = true; paintHero();
    try{
      const res = await TMDB.update('app_settings', 'key=eq.maintenance', {value:v, updated_at:new Date().toISOString()});
      if(!res || !res.length) throw new Error('La base a refusé la modification : seul un administrateur peut changer ce réglage.');
      M.v = Object.assign({}, DEF, res[0].value || v); M.hist = null; A.logRows = null;
      M.busy = false; closeModal(); render(); toast(msg); return true;
    }catch(e){ M.busy = false; paintHero(); toast(e.message || 'La modification n\'a pas abouti.', 'bad'); return false; }
  }

  /* ---------- Styles du module ---------- */
  const st = document.createElement('style');
  st.textContent = `
  .mt-ban{display:flex;align-items:center;gap:12px;padding:9px 18px;background:var(--warn-bg);color:var(--warn-ink);border-bottom:1px solid color-mix(in srgb,var(--warn) 30%,transparent);font-size:13px;position:sticky;top:60px;z-index:19}
  .mt-ban .dot{width:8px;height:8px;border-radius:50%;background:var(--warn);flex:none;animation:mtBeat 1.8s ease-in-out infinite}
  .mt-ban b{font-weight:600}
  .mt-ban .grow{min-width:0}
  .mt-ban .btn{height:30px;font-size:12.5px;background:var(--surface);border:1px solid color-mix(in srgb,var(--warn) 40%,transparent);color:var(--warn-ink)}
  .mt-ban.sch{background:var(--tal-50);color:var(--tal-700);border-color:color-mix(in srgb,var(--tal-500) 25%,transparent)}
  .mt-ban.sch .dot{background:var(--tal-500);animation:none}
  .mt-ban.sch .btn{color:var(--tal-700);border-color:color-mix(in srgb,var(--tal-500) 35%,transparent)}
  @keyframes mtBeat{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--warn) 55%,transparent)}60%{box-shadow:0 0 0 6px transparent}}

  .mt-hero{display:flex;align-items:center;gap:20px;padding:22px 22px;flex-wrap:wrap}
  .mt-hero.on{background:color-mix(in srgb,var(--warn-bg) 55%,var(--surface));border-color:color-mix(in srgb,var(--warn) 30%,transparent)}
  .mt-hero.scheduled{background:color-mix(in srgb,var(--tal-50) 70%,var(--surface));border-color:color-mix(in srgb,var(--tal-500) 25%,transparent)}
  .mt-hero h2{font-size:22px;line-height:1.2;margin-bottom:4px}
  .mt-hero .sub{color:var(--ink-2);font-size:13.5px;margin:0}
  .mt-hero .sub b{color:var(--ink);font-weight:600}
  .mt-hero .tools{display:flex;gap:8px;flex-wrap:wrap;margin-left:auto}

  .mt-sw{position:relative;flex:none;width:64px;height:36px;border-radius:999px;background:var(--line-strong);transition:background var(--t) var(--ease);cursor:pointer}
  .mt-sw::after{content:"";position:absolute;top:3px;left:3px;width:30px;height:30px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25),0 4px 10px -4px rgba(0,0,0,.3);transition:transform var(--t) var(--ease)}
  .mt-sw[aria-checked="true"]{background:var(--warn)}
  .mt-sw[aria-checked="true"]::after{transform:translateX(28px)}
  .mt-sw.sch{background:var(--tal-500)}
  .mt-sw.sch::after{transform:translateX(14px)}
  .mt-sw:hover{filter:brightness(1.05)}
  .mt-sw:disabled{cursor:not-allowed;opacity:.55}
  .mt-sw.busy::after{background:conic-gradient(var(--ink-3) 0 25%,#fff 0)}
  .mt-sw .on,.mt-sw .off{position:absolute;top:50%;transform:translateY(-50%);font:700 10px/1 var(--sans);letter-spacing:.04em;color:#fff;pointer-events:none}
  .mt-sw .on{left:9px}.mt-sw .off{right:8px;color:var(--ink-3)}
  .mt-sw[aria-checked="true"] .off,.mt-sw[aria-checked="false"] .on{display:none}
  .mt-swl{display:grid;justify-items:center;gap:4px;font-size:11.5px;font-weight:600;color:var(--ink-3)}

  a.btn{text-decoration:none;color:inherit}
  .mt-frame{display:block;width:100%;height:520px;border:1px solid var(--line);border-radius:var(--r-lg);background:var(--ground)}
  .mt-list{list-style:none;padding:0;margin:0;display:grid;gap:10px}
  .mt-list li{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;color:var(--ink-2);line-height:1.5}
  .mt-list li .ic{color:var(--ink-3);margin-top:1px}
  .mt-list b{color:var(--ink)}
  .mt-code{position:relative;font-family:var(--mono);font-size:12px;background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-md);padding:10px 12px;color:var(--ink-2);word-break:break-all}
  .mt-code + .btn{margin-top:8px}

  .modal.mt-modal,.modal:has(> .mh){width:min(720px,calc(100vw - 24px));padding:0}
  .mt-modal .mh{padding:20px 22px 6px}
  .mt-modal .mb{padding:4px 22px 6px;display:grid;gap:18px}
  .mt-modal .mf{position:sticky;bottom:0;background:var(--surface);border-top:1px solid var(--line);padding:14px 22px;display:grid;gap:12px}
  .mt-step{display:grid;gap:8px}
  .mt-step > .lbl{display:flex;align-items:center;gap:8px}
  .mt-step > .lbl i{font-style:normal;font-family:var(--mono);font-size:11px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--surface-3);color:var(--ink-2)}
  .mt-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .mt-opt{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border:1px solid var(--line);border-radius:var(--r-lg);cursor:pointer;background:var(--surface);text-align:left;transition:border-color var(--t-fast),background var(--t-fast)}
  .mt-opt:hover{border-color:var(--line-strong)}
  .mt-opt[aria-checked="true"]{border-color:var(--tal-500);background:var(--tal-50);box-shadow:0 0 0 1px var(--tal-500) inset}
  .mt-opt .rd{flex:none;width:16px;height:16px;border-radius:50%;border:1.5px solid var(--line-strong);margin-top:2px;display:grid;place-items:center;background:var(--surface)}
  .mt-opt[aria-checked="true"] .rd{border-color:var(--tal-600)}
  .mt-opt[aria-checked="true"] .rd::after{content:"";width:8px;height:8px;border-radius:50%;background:var(--tal-600)}
  .mt-opt b{display:block;font-size:14px}
  .mt-opt span{font-size:12.5px;color:var(--ink-3);line-height:1.45}
  .mt-seg{display:flex;flex-wrap:wrap;gap:6px}
  .mt-seg button{height:34px;padding:0 13px;border-radius:var(--r-pill);border:1px solid var(--line);background:var(--surface);font-weight:600;font-size:13px;color:var(--ink-2)}
  .mt-seg button:hover{border-color:var(--line-strong);color:var(--ink)}
  .mt-seg button[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:var(--ground)}
  .mt-res{font-size:12.5px;color:var(--ink-3)}
  .mt-res b{color:var(--ink-2)}
  .mt-cnt{font-family:var(--mono);font-size:11px;color:var(--ink-4);text-align:right}
  .mt-sum{display:flex;gap:10px;align-items:flex-start;padding:11px 13px;border-radius:var(--r-lg);background:var(--warn-bg);color:var(--warn-ink);font-size:13.5px;line-height:1.5}
  .mt-sum.sch{background:var(--tal-50);color:var(--tal-700)}
  .mt-sum.ok{background:var(--ok-bg);color:var(--ok-ink)}
  .mt-sum .ic{margin-top:1px}
  .mt-ok{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;cursor:pointer;color:var(--ink-2)}
  .mt-ok input{width:18px;height:18px;margin-top:1px;accent-color:var(--bad);flex:none}
  .mt-fa{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}
  @media (max-width:640px){.mt-opts{grid-template-columns:minmax(0,1fr)}.mt-hero{gap:14px}.mt-hero .tools{margin-left:0;width:100%}.mt-ban{padding:9px 12px;flex-wrap:wrap}.mt-frame{height:460px}}
  @media (prefers-reduced-motion:reduce){.mt-ban .dot{animation:none}.mt-sw,.mt-sw::after{transition:none}}
  `;
  document.head.appendChild(st);

  /* ---------- Bandeau global (tous les modules, tous les rôles) ---------- */
  function bannerHTML(){
    const s = state(); if(s === 'off' || !M.v) return '';
    const v = M.v, end = ms(v.ends_at);
    const txt = s === 'scheduled'
      ? '<b>Maintenance programmée à ' + hhmm(ms(v.starts_at)) + '</b> · dans <span data-mt-left>' + clock(ms(v.starts_at) - Date.now()) + '</span> · ' + scopeL(v.scope) + ' · les membres voient un préavis.'
      : '<b>Site en maintenance</b> depuis ' + dur(Date.now() - (ms(v.started_at) || ms(v.starts_at) || Date.now())) + ' · ' + scopeL(v.scope)
        + (end ? ' · retour prévu ' + (end > Date.now() ? 'vers ' + when(end) : 'dépassé (' + hhmm(end) + ')') : '');
    return '<div class="mt-ban' + (s === 'scheduled' ? ' sch' : '') + '" role="status"><span class="dot" aria-hidden="true"></span><span class="grow">' + txt + '</span>'
      + (sup() && A.view !== 'maintenance' ? '<button class="btn" data-act="go" data-v="maintenance">Gérer</button>' : '') + '</div>';
  }
  function paintBanner(){
    const top = $('#root .top'); if(!top) return;
    const old = $('#root .mt-ban'), h = bannerHTML();
    if(!h){ if(old) old.remove(); return; }
    const tmp = document.createElement('div'); tmp.innerHTML = h;
    if(old) old.replaceWith(tmp.firstChild); else top.after(tmp.firstChild);
  }

  /* ---------- La vue ---------- */
  function heroHTML(){
    const v = M.v || DEF, s = state(), can = sup();
    const lab = s === 'off' ? 'Ouvert' : s === 'on' ? 'Fermé' : 'Programmé';
    let title, sub, tools = '';
    if(s === 'off'){
      title = 'Le site est ouvert';
      sub = 'Tout fonctionne normalement. Active l\'interrupteur pour <b>préparer</b> une maintenance : tu choisis la portée, l\'heure et le message, et rien ne se ferme avant ta confirmation.';
    } else if(s === 'scheduled'){
      title = 'Maintenance programmée à ' + when(ms(v.starts_at));
      sub = '<b>' + scopeL(v.scope) + '</b> · fermeture dans <b data-mt-left>' + clock(ms(v.starts_at) - Date.now()) + '</b>. Les membres connectés voient un bandeau de préavis avec le compte à rebours.'
        + (ms(v.ends_at) ? ' Retour prévu vers ' + when(ms(v.ends_at)) + '.' : '');
      tools = can ? '<button class="btn btn-ghost" data-act="mt-edit">' + ic('edit') + 'Modifier</button><button class="btn btn-a" data-act="mt-startnow">' + ic('play') + 'Fermer maintenant</button>' : '';
    } else {
      const since = ms(v.started_at) || ms(v.starts_at) || Date.now(), end = ms(v.ends_at);
      title = 'Le site est en maintenance';
      sub = '<b>' + scopeL(v.scope) + '</b> · depuis ' + hhmm(since) + ' (' + dur(Date.now() - since) + ')'
        + (end ? ' · retour prévu ' + (end > Date.now() ? 'vers <b>' + when(end) + '</b> (dans ' + dur(end - Date.now()) + ')' : '<b style="color:var(--bad-ink)">dépassé depuis ' + dur(Date.now() - end) + '</b>') : ' · sans heure de retour annoncée');
      tools = can ? '<button class="btn btn-ghost btn-sm" data-act="mt-plus" data-n="15">+15 min</button><button class="btn btn-ghost btn-sm" data-act="mt-plus" data-n="30">+30 min</button><button class="btn btn-ghost btn-sm" data-act="mt-edit">' + ic('edit') + 'Modifier</button>' : '';
    }
    return '<section class="card mt-hero ' + s + '" id="mtHero">'
      + '<div class="mt-swl"><button class="mt-sw' + (s === 'scheduled' ? ' sch' : '') + (M.busy ? ' busy' : '') + '" role="switch" aria-checked="' + (s !== 'off') + '" aria-label="Mode maintenance" data-act="mt-switch"' + (can && !M.busy ? '' : ' disabled') + '><span class="on">ON</span><span class="off">OFF</span></button><span>' + lab + '</span></div>'
      + '<div class="grow" style="min-width:240px"><h2>' + esc(title) + '</h2><p class="sub">' + sub + '</p></div>'
      + (tools ? '<div class="tools">' + tools + '</div>' : '')
      + '</section>';
  }
  function paintHero(){ const h = $('#mtHero'); if(!h) return; const t = document.createElement('div'); t.innerHTML = heroHTML(); h.replaceWith(t.firstChild); }

  function previewUrl(d){
    const v = d || M.v || DEF, p = new URLSearchParams({apercu:'1', titre:v.title || '', msg:v.message || '', portee:v.scope || 'all'});
    const end = d ? d.endAt : ms(v.ends_at); if(end) p.set('fin', new Date(end).toISOString());
    const start = d ? d.startAt : (ms(v.started_at) || ms(v.starts_at)); if(start) p.set('debut', new Date(start).toISOString());
    return 'maintenance.html?' + p.toString();
  }

  VIEWS.maintenance = () => {
    const head = pageH('Maintenance', 'Ferme le site au public le temps d\'une mise à jour. Les visiteurs voient une page d\'attente et reviennent tout seuls dès la réouverture.',
      '<a class="btn btn-ghost" href="' + esc(previewUrl()) + '" target="_blank" rel="noopener">' + ic('eye') + 'Voir la page d\'attente</a>');
    if(!M.v && !M.err && !M.missing){ load(); return head + '<div class="card empty"><b>Chargement…</b></div>'; }
    if(M.err && !M.v) return head + '<div class="card empty"><b>Chargement impossible</b>' + esc(M.err) + '</div>';
    if(M.missing) return head + '<div class="card card-pad"><b>Le réglage de maintenance n\'est pas encore installé.</b><p style="margin:6px 0 0;color:var(--ink-2)">Dans Supabase, ouvre <b>SQL Editor</b>, colle le contenu de <span class="mono">supabase/23_maintenance.sql</span> et exécute-le une fois. Ce module fonctionnera ensuite.</p></div>';
    if(M.hist === null) setTimeout(loadHist, 0);
    let passOn = false; try{ passOn = Number(localStorage.getItem(PASS_KEY) || 0) > Date.now(); }catch(e){}
    const sql = 'update app_settings set value = jsonb_set(value, \'{active}\', \'false\') where key = \'maintenance\';';
    return head + heroHTML()
      + (sup() ? '' : '<p class="hint" style="margin:10px 2px 0">Seul un super admin peut activer ou arrêter la maintenance.</p>')
      + '<div class="grid g-split" style="margin-top:14px">'
      + '<section class="card card-pad"><div class="sec-t"><h3>Ce que voient les visiteurs</h3><a class="btn btn-quiet btn-sm" href="' + esc(previewUrl()) + '" target="_blank" rel="noopener">' + ic('ext') + 'Plein écran</a></div>'
      +   '<iframe class="mt-frame" id="mtFrame" title="Aperçu de la page de maintenance" src="' + esc(previewUrl()) + '" loading="lazy"></iframe></section>'
      + '<div class="col" style="gap:14px">'
      + '<section class="card card-pad"><h3 style="font-size:17px;margin-bottom:12px">Pendant la maintenance</h3><ul class="mt-list">'
      +   '<li>' + ic('users') + '<span><b>Visiteurs et membres</b> sont envoyés vers la page d\'attente. Elle revérifie toutes les 30 s et les ramène là où ils étaient.</span></li>'
      +   '<li>' + ic('clock') + '<span><b>Membres déjà connectés</b> : un bandeau de préavis avec compte à rebours si tu programmes la fermeture, puis bascule automatique (au plus 1 min).</span></li>'
      +   '<li>' + ic('key') + '<span><b>Toi et l\'équipe</b> : l\'espace équipe reste ouvert, et ce navigateur peut parcourir le site fermé'
      +     (passOn ? ' <span class="chip c-ok">laissez-passer actif</span>' : '') + '.</span></li>'
      +   '<li>' + ic('list') + '<span><b>Journal</b> : chaque ouverture, fermeture ou modification est inscrite au journal d\'audit.</span></li>'
      + '</ul></section>'
      + '<section class="card card-pad"><h3 style="font-size:17px;margin-bottom:4px">En cas de pépin</h3><p class="hint" style="margin:0 0 10px">Si l\'espace équipe ne répond plus, rouvre le site depuis Supabase → SQL Editor :</p>'
      +   '<div class="mt-code">' + esc(sql) + '</div><button class="btn btn-ghost btn-sm" data-act="copy" data-v="' + esc(sql) + '">' + ic('copy') + 'Copier la commande</button></section>'
      + '<section class="card card-pad"><h3 style="font-size:17px;margin-bottom:10px">Historique</h3>'
      +   (M.hist === null ? '<p class="hint">Chargement…</p>' : !M.hist.length ? '<p class="hint" style="margin:0">Aucune maintenance pour l\'instant.</p>'
          : '<div class="timeline">' + M.hist.map(h => '<div class="it"><i style="background:' + (/activée/.test(h.action) ? 'var(--warn)' : /terminée/.test(h.action) ? 'var(--ok)' : 'var(--line-strong)') + '"></i><div><b>' + esc(h.action) + '</b> <span>· ' + fmt(Date.parse(h.at)) + ' · ' + esc((h.actor_email || 'base').split('@')[0]) + '</span>'
            + (h.detail ? '<br><span>' + esc(h.detail) + '</span>' : '') + '</div></div>').join('') + '</div>')
      + '</section></div></div>';
  };

  /* ---------- Fenêtre de préparation ---------- */
  function draftFrom(v, edit){
    const now = Date.now(), start = edit ? (ms(v.starts_at) || ms(v.started_at) || now) : now;
    const end = edit ? ms(v.ends_at) : 0;
    const durMin = end ? Math.round((end - Math.max(start, now)) / 60000) : (edit ? 0 : 30);
    const known = DURS.find(x => x[0] === durMin);
    const d = {edit:!!edit, scope:v.scope || 'all', title:v.title || DEF.title, message:v.message || DEF.message,
      startIn:0, startAt:start, dur:known ? known[0] : -1, custom:end || (now + 60 * 60000), ok:false, preset:''};
    if(edit && state(v) === 'scheduled'){ const left = Math.round((start - now) / 60000); const k = STARTS.find(x => x[0] === left); d.startIn = k ? k[0] : -1; }
    calc(d); return d;
  }
  function calc(d){
    const now = Date.now();
    if(!d.edit || state() === 'scheduled' || !M.v || !M.v.active){
      if(d.startIn >= 0) d.startAt = now + d.startIn * 60000;
    }
    const base = Math.max(d.startAt, now);
    d.endAt = d.dur > 0 ? base + d.dur * 60000 : d.dur === -1 ? d.custom : 0;
  }
  function stepH(n, l, body){ return '<div class="mt-step"><div class="lbl"><i>' + n + '</i>' + l + '</div>' + body + '</div>'; }
  function seg(name, list, cur){ return '<div class="mt-seg" role="group">' + list.map(x => '<button type="button" data-act="mt-seg" data-k="' + name + '" data-v="' + x[0] + '" aria-pressed="' + (cur === x[0]) + '">' + x[1] + '</button>').join('') + '</div>'; }

  function summary(d){
    const scope = d.scope === 'app' ? 'L\'outil et l\'inscription' : 'Tout le site';
    const later = d.startAt > Date.now() + 30000;
    const endT = d.endAt ? ' Retour annoncé vers <b>' + when(d.endAt) + '</b>.' : ' Pas d\'heure de retour annoncée.';
    if(d.edit && state() === 'on') return {cls:'', html:scope + ' reste fermé.' + endT + ' Les visiteurs voient le nouveau texte au prochain contrôle (30 s).'};
    return later
      ? {cls:'sch', html:'<b>' + scope + '</b> fermera à <b>' + when(d.startAt) + '</b> (dans ' + dur(d.startAt - Date.now()) + '). D\'ici là, les membres connectés voient un préavis.' + endT}
      : {cls:'', html:'<b>' + scope + '</b> ferme <b>tout de suite</b>. Les personnes connectées basculent sur la page d\'attente en moins d\'une minute.' + endT};
  }
  function formHTML(d){
    const editingLive = d.edit && state() === 'on';
    const sm = summary(d);
    const okLabel = d.edit ? 'Enregistrer les changements' : d.startAt > Date.now() + 30000 ? 'Programmer la maintenance' : 'Fermer le site maintenant';
    return '<div class="mh"><h2>' + (d.edit ? 'Modifier la maintenance' : 'Préparer une maintenance') + '</h2><p style="margin:0">' + (d.edit ? 'Les changements s\'appliquent tout de suite sur la page d\'attente.' : 'Rien ne se ferme tant que tu n\'as pas confirmé en bas de cette fenêtre.') + '</p></div>'
      + '<div class="mb">'
      + stepH(1, 'Qu\'est-ce qui ferme ?', '<div class="mt-opts" role="radiogroup">'
        + '<button type="button" class="mt-opt" role="radio" data-act="mt-scope" data-v="all" aria-checked="' + (d.scope === 'all') + '"><span class="rd"></span><span><b>Tout le site</b><span>Vitrine, inscription, outil et fiches partagées. Pour une mise à jour de la base ou un incident.</span></span></button>'
        + '<button type="button" class="mt-opt" role="radio" data-act="mt-scope" data-v="app" aria-checked="' + (d.scope === 'app') + '"><span class="rd"></span><span><b>L\'outil et l\'inscription</b><span>La vitrine et les fiches partagées restent visibles. Pour une mise à jour de l\'outil.</span></span></button></div>')
      + (editingLive ? '' : stepH(2, 'Quand ?', seg('start', STARTS, d.startIn) + '<div class="mt-res" id="mtStartR">' + (d.startIn > 0 ? 'Fermeture à <b>' + hhmm(d.startAt) + '</b> · les membres connectés sont prévenus par un bandeau avec compte à rebours.' : 'Fermeture dès la confirmation. Programme-la quelques minutes plus tard pour laisser aux membres le temps d\'enregistrer.') + '</div>'))
      + stepH(editingLive ? 2 : 3, 'Retour prévu', seg('dur', DURS, d.dur)
        + '<div class="row" id="mtCustomW"' + (d.dur === -1 ? '' : ' hidden') + ' style="gap:8px"><input class="inp" type="datetime-local" id="mtCustom" value="' + localInput(d.custom) + '" style="max-width:240px"></div>'
        + '<div class="mt-res" id="mtEndR">' + (d.endAt ? 'Affiché aux visiteurs : <b>retour vers ' + when(d.endAt) + '</b>, avec un compte à rebours.' : 'Les visiteurs lisent « d\'ici quelques minutes ».') + ' Tu pourras prolonger en un clic.</div>')
      + stepH(editingLive ? 3 : 4, 'Message aux visiteurs', '<div class="mt-seg">' + PRESETS.map(p => '<button type="button" data-act="mt-preset" data-v="' + p.k + '" aria-pressed="' + (d.preset === p.k) + '">' + p.l + '</button>').join('') + '</div>'
        + '<div class="field"><label for="mtTitle">Titre</label><input class="inp" id="mtTitle" maxlength="70" value="' + esc(d.title) + '"><div class="mt-cnt" id="mtTitleN">' + d.title.length + ' / 70</div></div>'
        + '<div class="field"><label for="mtMsg">Texte</label><textarea class="inp" id="mtMsg" maxlength="280" style="min-height:76px">' + esc(d.message) + '</textarea><div class="mt-cnt" id="mtMsgN">' + d.message.length + ' / 280</div></div>'
        + '<div><a class="lnk" href="#" data-act="mt-prev" style="font-size:13px">' + 'Voir l\'aperçu avec ce texte ↗</a></div>')
      + '</div>'
      + '<div class="mf"><div class="mt-sum ' + sm.cls + '" id="mtSum">' + ic(sm.cls === 'sch' ? 'clock' : 'alert') + '<span>' + sm.html + '</span></div>'
      + (d.edit ? '' : '<label class="mt-ok"><input type="checkbox" id="mtOk"' + (d.ok ? ' checked' : '') + '><span>Je confirme : les visiteurs n\'auront plus accès ' + (d.scope === 'app' ? 'à l\'outil ni à l\'inscription' : 'au site') + ' pendant la maintenance.</span></label>')
      + '<div class="mt-fa"><button class="btn btn-ghost" data-act="close-modal">Annuler</button><button class="btn ' + (d.edit ? 'btn-a' : 'btn-bad') + '" data-act="mt-go" id="mtGo"' + (d.edit || d.ok ? '' : ' disabled') + '>' + ic(d.edit ? 'check' : 'wrench') + okLabel + '</button></div></div>';
  }
  function openForm(edit){
    M.d = draftFrom(edit ? M.v : Object.assign({}, DEF, M.v || {}, {active:false}), edit);
    modal(formHTML(M.d));
    const m = $('.modal'); if(m) m.classList.add('mt-modal');
    const f = $('.modal .mt-opt[aria-checked="true"]'); if(f) setTimeout(() => f.focus(), 40);
  }
  function refreshForm(keepFocus){
    const d = M.d; if(!d || !A.modal) return;
    const ae = document.activeElement, id = ae && ae.id, pos = ae && ae.selectionStart;
    calc(d); A.modal = formHTML(d); paintOverlay();
    const m = $('.modal'); if(m) m.classList.add('mt-modal');
    if(keepFocus && id){ const el = document.getElementById(id); if(el){ el.focus(); try{ el.setSelectionRange(pos, pos); }catch(e){} } }
  }
  /* Mise à jour légère (sans redessiner la fenêtre) pendant la saisie. */
  function softUpdate(){
    const d = M.d; if(!d) return; calc(d);
    const sm = summary(d), s = $('#mtSum'); if(s){ s.className = 'mt-sum ' + sm.cls; s.innerHTML = ic(sm.cls === 'sch' ? 'clock' : 'alert') + '<span>' + sm.html + '</span>'; }
    const t = $('#mtTitleN'); if(t) t.textContent = d.title.length + ' / 70';
    const n = $('#mtMsgN'); if(n) n.textContent = d.message.length + ' / 280';
    const r = $('#mtEndR'); if(r) r.innerHTML = (d.endAt ? 'Affiché aux visiteurs : <b>retour vers ' + when(d.endAt) + '</b>, avec un compte à rebours.' : 'Les visiteurs lisent « d\'ici quelques minutes ».') + ' Tu pourras prolonger en un clic.';
  }

  async function submit(){
    const d = M.d; if(!d) return;
    calc(d);
    const title = d.title.trim(), message = d.message.trim();
    if(title.length < 3) return toast('Donne un titre à la page d\'attente.', 'bad');
    if(message.length < 10) return toast('Écris quelques mots pour les visiteurs.', 'bad');
    if(d.dur === -1 && !(d.custom > Math.max(d.startAt, Date.now()) + 60000)) return toast('L\'heure de retour doit être après le début de la maintenance.', 'bad');
    if(!d.edit && !d.ok) return toast('Coche la confirmation pour continuer.', 'bad');
    const later = d.startAt > Date.now() + 30000;
    const cur = M.v || DEF, liveOn = d.edit && state() === 'on';
    const v = Object.assign({}, cur, {active:true, scope:d.scope, title, message,
      starts_at:liveOn ? cur.starts_at : (later ? new Date(d.startAt).toISOString() : null),
      started_at:liveOn ? cur.started_at : new Date(Math.max(d.startAt, Date.now())).toISOString(),
      ends_at:d.endAt ? new Date(d.endAt).toISOString() : null,
      by:liveOn ? cur.by : (A.me && A.me.email) || null});
    const b = $('#mtGo'); if(b){ b.disabled = true; b.innerHTML = 'Un instant…'; }
    const ok = await save(v, d.edit ? 'Maintenance mise à jour.' : later ? 'Maintenance programmée à ' + hhmm(d.startAt) + '. Les membres voient le préavis.' : 'Le site est en maintenance. Les visiteurs voient la page d\'attente.');
    if(!ok && b){ b.disabled = false; refreshForm(); }
    else M.d = null;
  }

  function confirmOff(){
    const s = state(), v = M.v, since = ms(v.started_at) || Date.now();
    modal('<h2>' + (s === 'scheduled' ? 'Annuler la maintenance programmée ?' : 'Rouvrir le site ?') + '</h2>'
      + '<p>' + (s === 'scheduled' ? 'Le préavis disparaît pour les membres et le site reste ouvert.' : 'Maintenance en cours depuis <b>' + dur(Date.now() - since) + '</b>. Les personnes sur la page d\'attente sont ramenées automatiquement dans les 30 secondes.') + '</p>'
      + (s === 'on' ? '<div class="mt-sum ok">' + ic('check') + '<span>Vérifie que ta mise à jour est terminée et que le site s\'affiche bien pour toi (tu as le laissez-passer de l\'équipe sur ce navigateur).</span></div>' : '')
      + '<div class="acts"><button class="btn btn-ghost" data-act="close-modal">' + (s === 'scheduled' ? 'Garder' : 'Pas encore') + '</button><button class="btn btn-ok" data-act="mt-off">' + ic(s === 'scheduled' ? 'x' : 'check') + (s === 'scheduled' ? 'Annuler la maintenance' : 'Rouvrir le site') + '</button></div>');
  }

  /* ---------- Événements ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-act]'); if(!t || !A.me) return;
    const a = t.dataset.act; if(!/^mt-/.test(a)) return;
    e.preventDefault();
    const d = M.d;
    switch(a){
      case 'mt-switch': if(!sup()) return toast('Seul un super admin peut changer la maintenance.', 'bad'); if(state() === 'off') openForm(false); else confirmOff(); break;
      case 'mt-edit': openForm(true); break;
      case 'mt-off': { const v = Object.assign({}, M.v, {active:false, starts_at:null}); const s = state();
        t.disabled = true; save(v, s === 'scheduled' ? 'Maintenance annulée. Le site reste ouvert.' : 'Le site est rouvert. Les visiteurs reviennent automatiquement.'); break; }
      case 'mt-startnow': { const v = Object.assign({}, M.v, {starts_at:null, started_at:new Date().toISOString()});
        modal('<h2>Fermer maintenant ?</h2><p>Sans attendre ' + hhmm(ms(M.v.starts_at)) + ' : les membres connectés basculent sur la page d\'attente en moins d\'une minute.</p><div class="acts"><button class="btn btn-ghost" data-act="close-modal">Attendre l\'heure prévue</button><button class="btn btn-bad" data-act="mt-startnow-go">' + ic('wrench') + 'Fermer maintenant</button></div>');
        M.pending = v; break; }
      case 'mt-startnow-go': if(M.pending){ t.disabled = true; save(M.pending, 'Le site est en maintenance.'); M.pending = null; } break;
      case 'mt-plus': { const n = +t.dataset.n, base = Math.max(ms(M.v.ends_at), Date.now()), end = base + n * 60000;
        save(Object.assign({}, M.v, {ends_at:new Date(end).toISOString()}), 'Retour prévu repoussé à ' + hhmm(end) + '.'); break; }
      case 'mt-scope': if(d){ d.scope = t.dataset.v; refreshForm(); } break;
      case 'mt-seg': if(d){ const v = +t.dataset.v;
        if(t.dataset.k === 'start'){ d.startIn = v; } else { d.dur = v; }
        refreshForm(); if(t.dataset.k === 'dur' && v === -1){ const c = $('#mtCustom'); if(c) c.focus(); } } break;
      case 'mt-preset': if(d){ const p = PRESETS.find(x => x.k === t.dataset.v); if(p){ d.title = p.title; d.message = p.message; d.preset = p.k; refreshForm(); } } break;
      case 'mt-prev': if(d){ calc(d); window.open(previewUrl({title:d.title, message:d.message, scope:d.scope, endAt:d.endAt, startAt:Math.max(d.startAt, Date.now())}), '_blank', 'noopener'); } break;
      case 'mt-go': submit(); break;
    }
  }, true);
  document.addEventListener('input', e => {
    const d = M.d; if(!d) return;
    if(e.target.id === 'mtTitle'){ d.title = e.target.value; d.preset = ''; softUpdate(); }
    else if(e.target.id === 'mtMsg'){ d.message = e.target.value; d.preset = ''; softUpdate(); }
    else if(e.target.id === 'mtCustom'){ const t = Date.parse(e.target.value); if(!isNaN(t)){ d.custom = t; softUpdate(); } }
  });
  document.addEventListener('change', e => {
    if(e.target.id === 'mtOk' && M.d){ M.d.ok = e.target.checked; const b = $('#mtGo'); if(b) b.disabled = !e.target.checked; }
  });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && A.modal){ M.d = null; closeModal(); } });

  /* ---------- Branchements ---------- */
  const _renderView = renderView;
  renderView = function(){ _renderView(); syncPass(); if(A.me){ if(!M.v && !M.loading && !M.missing && !M.err) load(true); paintBanner(); } };
  const _logout = logout;
  logout = function(){ try{ localStorage.removeItem(PASS_KEY); }catch(e){} M.v = null; M.hist = null; _logout(); };

  /* Compte à rebours vivant (bandeau et carte) sans redessiner la page. */
  setInterval(() => {
    if(!A.me || !M.v || state() === 'off') return;
    if(state() === 'scheduled'){ const left = ms(M.v.starts_at) - Date.now(); $$('[data-mt-left]').forEach(el => { el.textContent = clock(left); }); }
  }, 1000);
  setInterval(() => {
    if(!A.me) return;
    const before = state(); load(true).then(() => { if(state() !== before && A.view !== 'maintenance') paintBanner(); });
    if(A.view === 'maintenance' && !A.modal) paintHero();
    paintBanner();
  }, 30000);

  if(A.me) render();
})();
