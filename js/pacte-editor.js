/* ============================================================
   TakaMatch — éditeur du pacte d'associés (app + admin)
   ------------------------------------------------------------
   Plein écran, posé au-dessus de la page. La page hôte fournit
   l'équipe (ctx), l'état du pacte et les actions (enregistrer,
   commander, publier, signer…) ; l'éditeur s'occupe du reste.

   TMPacteEditor.open({ctx, state, me:{uid, staff}, actions, price, z, onClose})
     state   : {status, version, spec, snapshot, hash, signatures, parties, events, reviewNote, finalUrl, demo}
     actions : save(spec) · saveParty(uid, data) · order() · publish(doc, hash, note)
               sign(name, hash) · reopen(reason) · reload() · goAtelier() · finalPdf()
   Renvoie {update(state, ctx), close()}.
   ============================================================ */
(function(){
  'use strict';
  const TP = window.TMPacte;
  if(!TP) return;

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const SVG = {
    back:'<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>', dl:'<path d="M12 3v12"/><path d="m7.5 11 4.5 4.5L16.5 11"/><path d="M4 20.5h16"/>',
    edit:'<path d="M12 20h8"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>', trash:'<path d="M4 7h16M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2"/><path d="M6.5 7 7.4 20a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5L17.5 7"/>',
    plus:'<path d="M12 5v14M5 12h14"/>', undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>', x:'<path d="M18 6 6 18M6 6l12 12"/>',
    check:'<path d="m4.5 12.5 5 5 10-11"/>', pen:'<path d="M3 21c3-1 5.5-3.5 7-6"/><path d="m14.5 4.5 5 5L10 19l-6 1 1-6z"/>', card:'<rect x="2.5" y="5" width="19" height="14" rx="2.6"/><path d="M2.5 10h19"/>',
    alert:'<path d="M12 3.5 22 20H2z"/><path d="M12 9.5v4.5M12 17.3h.01"/>', info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8h.01"/>',
    send:'<path d="M21.5 2.5 2.5 10l7.5 3 3 7.5z"/><path d="M21.5 2.5 10 13.5"/>', note:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    lock:'<rect x="4" y="10.5" width="16" height="10.5" rx="2.4"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>', clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 1.9"/>',
    shield:'<path d="M12 22s8-3.5 8-10V5.5L12 2.5 4 5.5V12c0 6.5 8 10 8 10z"/><path d="m9 12 2 2 4-4.5"/>', refresh:'<path d="M20.5 11A8.5 8.5 0 0 0 6 6.5L3.5 9"/><path d="M3.5 4v5h5"/><path d="M3.5 13a8.5 8.5 0 0 0 14.5 4.5L20.5 15"/><path d="M20.5 20v-5h-5"/>',
  };
  const ic = n => '<svg class="pe-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (SVG[n] || '') + '</svg>';
  const STEPS = [['brouillon', 'Brouillon'], ['relecture', 'Relecture juriste'], ['signature', 'Signature'], ['signe', 'Signé']];
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]+/g, ' ').trim();
  const PARTY_FIELDS = [
    ['legal', 'Nom complet', 'Tel qu\'il figure sur ta pièce d\'identité', 'text'],
    ['birthDate', 'Date de naissance', '', 'date'],
    ['birthPlace', 'Lieu de naissance', 'Ex. : Porto-Novo', 'text'],
    ['nationality', 'Nationalité', 'Ex. : béninoise', 'text'],
    ['address', 'Adresse', 'Quartier, rue ou lot, ville', 'text'],
    ['idDoc', 'Pièce d\'identité', 'Ex. : la carte nationale d\'identité n° 1234567890', 'text'],
    ['profession', 'Profession (facultatif)', 'Ex. : ingénieure logiciel', 'text'],
  ];

  let cur = null;

  function open(o){
    if(cur) cur.close(true);
    const E = {o, ctx:o.ctx, st:o.state, me:o.me || {}, tab:'reglages', railOpen:false, edit:null, saving:false, savedAt:null, dirty:false, timer:null, scrollTo:null};
    E.spec = TP.normalize(E.ctx, E.st.spec);
    const root = document.createElement('div');
    root.className = 'pe'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Pacte d\'associés');
    if(o.z) root.style.zIndex = o.z;
    document.body.appendChild(root);
    document.documentElement.classList.add('pe-lock');
    E.root = root;
    root.addEventListener('click', e => onClick(E, e));
    root.addEventListener('input', e => onInput(E, e));
    root.addEventListener('change', e => onInput(E, e, true));
    E.key = e => { if(e.key === 'Escape' && !document.querySelector('#layer .ov, #ovl .modal')){ if(E.dlg) closeDlg(E); else if(E.edit) { E.edit = null; paint(E); } else close(E); } };
    document.addEventListener('keydown', E.key);
    paint(E);
    requestAnimationFrame(() => root.classList.add('on'));
    const api = {update:(st, ctx) => update(E, st, ctx), close:(silent) => close(E, silent), root};
    cur = api;
    return api;
  }

  function update(E, st, ctx){
    if(ctx) E.ctx = ctx;
    if(st){ E.st = st; if(!E.dirty) E.spec = TP.normalize(E.ctx, st.spec); }
    paint(E);
  }

  async function flush(E){
    if(!E.dirty) return;
    clearTimeout(E.timer); E.dirty = false; E.saving = true; paintSave(E);
    try{ await E.o.actions.save(E.spec); E.savedAt = new Date(); E.st.spec = E.spec; }
    catch(err){ E.dirty = true; toastE(E, err.message || 'Enregistrement impossible.', 'bad'); }
    E.saving = false; paintSave(E);
  }
  async function close(E, silent){
    if(E.closed) return;
    if(!silent) await flush(E);
    E.closed = true;
    document.removeEventListener('keydown', E.key);
    document.documentElement.classList.remove('pe-lock');
    E.root.classList.remove('on');
    setTimeout(() => E.root.remove(), 200);
    if(cur && cur.root === E.root) cur = null;
    if(!silent && E.o.onClose) E.o.onClose();
  }

  /* ---------- Droits selon l'étape ---------- */
  function perms(E){
    const st = E.st.status || 'brouillon', staff = !!E.me.staff;
    const porteur = (E.ctx.members || []).find(m => m.role === 'vis') || {};
    const owner = !!E.me.uid && E.me.uid === porteur.uid;
    const signers = st === 'signature' || st === 'signe' ? ((E.st.snapshot || {}).parties || []).map(p => p.uid) : [];
    return {
      st, staff, owner,
      editDoc:(st === 'brouillon' && (owner || staff)) || (st === 'relecture' && staff),
      notes:staff && (st === 'brouillon' || st === 'relecture'),
      party:uid => (st === 'brouillon' || st === 'relecture') && (uid === E.me.uid || staff),
      order:owner && st === 'brouillon',
      publish:staff && (st === 'relecture' || st === 'brouillon'),
      sign:st === 'signature' && signers.includes(E.me.uid) && !(E.st.signatures || {})[E.me.uid],
      reopen:st === 'signature' && (owner || staff),
    };
  }

  function currentDoc(E){
    const st = E.st.status || 'brouillon';
    if((st === 'signature' || st === 'signe') && E.st.snapshot) return Object.assign({}, E.st.snapshot, {status:st});
    const ctx = Object.assign({}, E.ctx, {parties:E.st.parties || {}});
    return TP.build(ctx, E.spec, {status:st, version:E.st.version || 1, reviewed:st !== 'brouillon'});
  }

  /* ============================================================
     Affichage
     ============================================================ */
  function paint(E){
    const P = perms(E), doc = currentDoc(E);
    E.doc = doc;
    const ctx = Object.assign({}, E.ctx, {parties:E.st.parties || {}});
    const issues = (P.st === 'brouillon' || P.st === 'relecture') ? TP.issues(doc, ctx, E.spec) : [];
    E.issues = issues;
    const y = E.root.querySelector('.pe-main') ? E.root.querySelector('.pe-main').scrollTop : 0;
    const ry = E.root.querySelector('.pe-panel') ? E.root.querySelector('.pe-panel').scrollTop : 0;
    E.root.innerHTML = top(E, P, doc) + '<div class="pe-body">' + rail(E, P, doc, issues) + '<main class="pe-main" tabindex="-1">' + banner(E, P, doc, issues) + paper(E, P, doc) + '</main></div><div class="pe-dlg-w"></div><div class="pe-toasts" aria-live="polite"></div>';
    const m = E.root.querySelector('.pe-main'); if(m) m.scrollTop = y;
    const pn = E.root.querySelector('.pe-panel'); if(pn) pn.scrollTop = ry;
    if(E.scrollTo){ const t = E.root.querySelector('#pe-a-' + E.scrollTo); if(t) t.scrollIntoView({block:'start', behavior:'smooth'}); E.scrollTo = null; }
    if(E.edit){ const ta = E.root.querySelector('.pe-ta'); if(ta){ grow(ta); if(!E.edit.focused){ ta.focus(); E.edit.focused = true; } } }
    if(E.dlg) paintDlg(E);
  }
  function paintSave(E){
    const s = E.root.querySelector('.pe-save'); if(!s) return;
    s.innerHTML = E.saving ? '<span class="pe-dot"></span>Enregistrement…' : E.dirty ? 'Modifications non enregistrées' : E.savedAt ? ic('check') + 'Enregistré' : '';
  }

  function top(E, P, doc){
    const i = STEPS.findIndex(s => s[0] === P.st);
    const name = doc.company.name || (E.ctx.project && E.ctx.project.title) || 'Votre société';
    let main = '';
    if(P.order) main = '<button class="btn btn-a pe-cta" data-pe="order">' + ic('card') + 'Commander la relecture' + (E.o.price ? ' · ' + E.o.price : '') + '</button>';
    else if(P.publish && P.st === 'relecture') main = '<button class="btn btn-a pe-cta" data-pe="publish">' + ic('send') + 'Publier pour signature</button>';
    else if(P.sign) main = '<button class="btn btn-a pe-cta" data-pe="sign">' + ic('pen') + 'Signer le pacte</button>';
    else if(P.st === 'signe') main = '<button class="btn btn-a pe-cta" data-pe="pdf">' + ic('dl') + 'PDF signé</button>';
    return '<header class="pe-top">'
      + '<button class="pe-back" data-pe="close" aria-label="Fermer le pacte">' + ic('back') + '<span>' + esc(E.o.backLabel || 'Atelier') + '</span></button>'
      + '<div class="pe-ttl"><span class="pe-kick">Pacte d\'associés</span><b>' + esc(name) + '</b></div>'
      + '<ol class="pe-steps" aria-label="Étapes">' + STEPS.map((s, k) => '<li class="' + (k < i ? 'done' : k === i ? 'on' : '') + '"' + (k === i ? ' aria-current="step"' : '') + '><span>' + (k < i ? ic('check') : (k + 1)) + '</span>' + s[1] + '</li>').join('') + '</ol>'
      + '<span class="pe-save" aria-live="polite"></span>'
      + '<div class="pe-acts">'
      + (P.st !== 'signe' ? '<button class="btn btn-ghost" data-pe="pdf" title="Télécharger le PDF">' + ic('dl') + '<span class="pe-hide-s">PDF</span></button>' : '')
      + (P.reopen ? '<button class="btn btn-quiet" data-pe="reopen">' + ic('undo') + '<span class="pe-hide-s">Demander une modification</span></button>' : '')
      + main + '</div></header>';
  }

  function banner(E, P, doc, issues){
    const sigs = E.st.signatures || {}, parties = doc.parties || [];
    const n = parties.filter(p => sigs[p.uid]).length;
    const fields = issues.filter(x => x.kind === 'field').length;
    let h = '';
    if(E.st.localOnly) h += note('warn', 'alert', '<b>Enregistré dans ce navigateur seulement.</b> La base de données des pactes n\'est pas encore installée : les autres associés ne voient pas ce brouillon. (Équipe TakaMatch : exécuter <span class="pe-mono">supabase/11_pactes.sql</span>.)');
    if(E.st.demo) h += note('info', 'info', '<b>Démonstration.</b> Le pacte est gardé dans ce navigateur ; le paiement, la relecture et les signatures des autres associés sont simulés.');
    if(P.st === 'brouillon'){
      h += P.editDoc
        ? note('', 'info', 'Le pacte se rédige tout seul à partir de l\'Atelier : capital, vesting, rôles, plan d\'action. <b>Clique sur un article pour le réécrire</b>, retire ce qui ne vous concerne pas, ajoute vos propres clauses. Quand c\'est prêt, commande la relecture : un juriste le vérifie et le complète avant la signature.')
        : note('', 'lock', 'Ce brouillon est préparé par ' + esc((doc.parties.find(p => p.role === 'vis') || {}).first || 'le porteur') + '. Tu peux le lire, compléter tes informations de signataire et en parler dans le groupe de l\'équipe.');
      if(fields) h += note('warn', 'alert', fields + ' information' + (fields > 1 ? 's' : '') + ' à compléter. <button class="pe-link" data-pe="tab" data-v="issues">Voir la liste</button>');
    } else if(P.st === 'relecture'){
      h += P.staff
        ? note('', 'shield', '<b>Relecture.</b> Vérifie et complète le texte, ajoute des notes pour l\'équipe si besoin, puis publie la version pour signature. Les associés ne peuvent plus modifier le texte, seulement leurs informations de signataire.')
        : note('', 'clock', '<b>Votre pacte est chez le juriste.</b> Il le relit et le complète, en général sous 72 heures ouvrées. Vous serez prévenus dès qu\'il est prêt à signer. Pense à compléter tes informations de signataire.');
    } else if(P.st === 'signature'){
      h += note('', 'pen', '<b>Version ' + (doc.version || 1) + ' prête à signer.</b> ' + n + ' signature' + (n > 1 ? 's' : '') + ' sur ' + parties.length + '. Le texte est figé : chacun signe exactement le même document (empreinte <span class="pe-mono">' + esc(String(E.st.hash || '').slice(0, 12)) + '…</span>).'
        + (E.st.reviewNote ? '<br><span class="pe-quote">Note du juriste : « ' + esc(E.st.reviewNote) + ' »</span>' : ''));
    } else if(P.st === 'signe'){
      h += note('ok', 'check', '<b>Pacte signé par tous les associés.</b> Le PDF signé, avec son certificat, est archivé et téléchargeable à tout moment.');
    }
    return '<div class="pe-banners">' + h + '</div>';
  }
  function note(kind, icon, html){ return '<div class="pe-note ' + kind + '">' + ic(icon) + '<div>' + html + '</div></div>'; }

  /* ---------- Rail : réglages, signataires, à compléter, historique ---------- */
  function rail(E, P, doc, issues){
    const nIss = issues.length;
    const tabs = [['reglages', 'Réglages'], ['parties', 'Signataires'], ['issues', 'À compléter' + (nIss ? ' <i>' + nIss + '</i>' : '')], ['histo', 'Historique']];
    const body = E.tab === 'parties' ? railParties(E, P, doc) : E.tab === 'issues' ? railIssues(E, issues) : E.tab === 'histo' ? railHisto(E) : railParams(E, P, doc);
    return '<aside class="pe-rail' + (E.railOpen ? ' open' : '') + '"><div class="pe-tabs" role="tablist">' + tabs.map(t => '<button role="tab" data-pe="tab" data-v="' + t[0] + '" aria-selected="' + (E.tab === t[0]) + '">' + t[1] + '</button>').join('') + '</div>'
      + '<div class="pe-panel">' + body + '</div></aside>';
  }
  const fld = (label, ctl, hint) => '<label class="pe-f"><span>' + label + '</span>' + ctl + (hint ? '<small>' + hint + '</small>' : '') + '</label>';
  const inp = (k, v, type, dis, extra) => '<input class="inp" data-k="' + k + '" type="' + (type || 'text') + '" value="' + esc(v == null ? '' : v) + '"' + (dis ? ' disabled' : '') + (extra || '') + '>';
  const sel = (k, v, opts, dis) => '<select class="inp" data-k="' + k + '"' + (dis ? ' disabled' : '') + '>' + opts.map(o => '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(v) ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select>';
  const tog = (k, on, label, desc, dis, extra) => '<div class="pe-tog' + (on ? ' on' : '') + '"><label><input type="checkbox" data-k="' + k + '"' + (on ? ' checked' : '') + (dis ? ' disabled' : '') + '><span class="pe-sw" aria-hidden="true"></span><span><b>' + label + '</b>' + (desc ? '<small>' + desc + '</small>' : '') + '</span></label>' + (on && extra ? '<div class="pe-tog-x">' + extra + '</div>' : '') + '</div>';

  function railParams(E, P, doc){
    const s = E.spec, d = !P.editDoc, co = s.company, o = s.opts;
    const members = E.ctx.members || [];
    const n = members.length;
    const ccs = Object.keys(TP.COUNTRIES).sort((a, b) => (TP.isOhada(b) - TP.isOhada(a)) || TP.COUNTRIES[a].localeCompare(TP.COUNTRIES[b], 'fr'));
    const vest = E.ctx.vesting || 'Pas encore décidé';
    return (d ? '<p class="pe-hint pe-ro">' + ic('lock') + (P.st === 'brouillon' ? 'Seul le porteur règle le pacte.' : 'Le pacte n\'est plus modifiable à cette étape.') + '</p>' : '')
      + '<h4>La société</h4>'
      + fld('Dénomination sociale', inp('company.name', co.name, 'text', d, ' maxlength="80"'))
      + fld('État', sel('company.state', co.state, [['formation', 'À créer (en formation)'], ['immatriculee', 'Déjà immatriculée']], d))
      + (co.state === 'immatriculee' ? fld('Numéro RCCM', inp('company.rccm', co.rccm, 'text', d, ' maxlength="40"')) : fld('Délai pour l\'immatriculer', sel('company.delay', co.delay, [[3, '3 mois'], [6, '6 mois'], [12, '12 mois']], d)))
      + '<div class="pe-2">' + fld('Capital (FCFA)', inp('company.capital', co.capital, 'number', d, ' min="0" step="10000"')) + fld('Valeur d\'une action', inp('company.nominal', co.nominal, 'number', d, ' min="0" step="1000"')) + '</div>'
      + (co.capital && co.nominal ? '<p class="pe-hint">' + TP.nf(Math.floor(co.capital / co.nominal)) + ' actions au total.</p>' : '')
      + '<div class="pe-2">' + fld('Ville du siège', inp('company.city', co.city, 'text', d, ' maxlength="60"')) + fld('Pays', sel('company.country', co.country, ccs.map(c => [c, TP.COUNTRIES[c] + (TP.isOhada(c) ? '' : ' (hors OHADA)')]), d)) + '</div>'
      + fld('Objet social', '<textarea class="inp" data-k="company.object" rows="3" maxlength="400"' + (d ? ' disabled' : '') + ' placeholder="Ex. : le développement et l\'exploitation d\'une plateforme de…">' + esc(co.object) + '</textarea>', 'L\'activité de la société, en une phrase.')
      + '<h4>Gouvernance</h4>'
      + fld('Président', sel('gov.president', s.gov.president, members.map(m => [m.uid, (m.legal || m.first) + (m.role === 'vis' ? ' (porteur)' : '')]), d))
      + fld('Décisions importantes votées', sel('gov.majority', s.gov.majority, [['auto', n <= 2 ? 'Automatique : à l\'unanimité (2 associés)' : 'Automatique : aux deux tiers'], ['unanimite', 'À l\'unanimité'], ['deux-tiers', 'Aux deux tiers'], ['majorite', 'À la majorité simple']], d))
      + '<div class="pe-2">' + fld('Seuil de dépense (FCFA)', inp('gov.threshold', s.gov.threshold, 'number', d, ' min="0" step="50000"')) + fld('Point d\'équipe', sel('gov.meetings', s.gov.meetings, [['semaine', 'Chaque semaine'], ['mois', 'Chaque mois'], ['trimestre', 'Chaque trimestre']], d)) + '</div>'
      + '<h4>Vesting et départ</h4>'
      + '<div class="pe-from">' + ic('refresh') + '<span>Vesting : <b>' + esc(vest) + '</b><small>Se règle dans l\'Atelier, comme le capital et les rôles.</small></span></div>'
      + fld('Le vesting concerne', sel('vest.scope', s.vest.scope, [['tous', 'Tous les associés'], ['talents', 'Les talents seulement']], d))
      + '<div class="pe-2">' + fld('Décote « bad leaver »', sel('vest.discount', s.vest.discount, [[0, 'Aucune'], [25, '25 %'], [50, '50 %'], [75, '75 %']], d)) + fld('Préavis de départ', sel('opts.notice', o.notice, [[1, '1 mois'], [2, '2 mois'], [3, '3 mois'], [6, '6 mois']], d)) + '</div>'
      + '<h4>Clauses</h4>'
      + tog('opts.inalienabilite', o.inalienabilite, 'Inaliénabilité', 'Personne ne vend ses actions pendant le lancement.', d, fld('Durée', sel('opts.inalienMonths', o.inalienMonths, [[12, '12 mois'], [24, '24 mois'], [36, '36 mois']], d)))
      + tog('opts.preemption', o.preemption, 'Droit de préemption', 'Priorité aux associés si l\'un vend.', d)
      + tog('opts.agrement', o.agrement, 'Agrément', 'Tout nouvel associé doit être accepté.', d)
      + tog('opts.sortie-conjointe', o['sortie-conjointe'], 'Sortie conjointe', 'Si le contrôle est vendu, chacun peut vendre aussi.', d)
      + tog('opts.sortie-forcee', o['sortie-forcee'], 'Sortie forcée', n <= 2 ? 'Rarement utile à deux associés.' : 'Une offre acceptée par la majorité s\'impose.', d, fld('Seuil', sel('opts.dragPct', o.dragPct, [[51, '51 %'], [67, '67 %'], [75, '75 %'], [90, '90 %']], d)))
      + tog('opts.non-concurrence', o['non-concurrence'], 'Non-concurrence', 'Pendant et après la participation.', d, '<div class="pe-2">' + fld('Après le départ', sel('opts.ncMonths', o.ncMonths, [[6, '6 mois'], [12, '12 mois'], [24, '24 mois']], d)) + fld('Zone', sel('opts.ncZone', o.ncZone, [['pays', 'Pays du siège'], ['uemoa', 'UEMOA'], ['ohada', 'Zone OHADA']], d)) + '</div>')
      + tog('opts.annexPlan', o.annexPlan, 'Plan d\'action en annexe', 'Les objectifs et tâches de l\'Atelier.', d)
      + '<div class="pe-2">' + fld('Confidentialité après départ', sel('opts.confidYears', o.confidYears, [[1, '1 an'], [2, '2 ans'], [3, '3 ans'], [5, '5 ans']], d)) + fld('Durée du pacte', sel('opts.duration', o.duration, [[5, '5 ans'], [10, '10 ans'], [15, '15 ans']], d)) + '</div>'
      + fld('En cas de litige', sel('opts.dispute', o.dispute, [['tribunal', 'Tribunal du siège'], ['ccja', 'Arbitrage CCJA (OHADA)']], d), o.dispute === 'ccja' ? 'Plus rapide et confidentiel, mais plus coûteux.' : 'Le plus simple et le moins coûteux.')
      + (P.editDoc ? '<button class="btn btn-ghost btn-sm pe-block" data-pe="add" data-after="_end">' + ic('plus') + 'Ajouter une clause</button>' : '');
  }

  function railParties(E, P, doc){
    const sigs = E.st.signatures || {};
    return '<p class="pe-hint">' + ic('lock') + 'Ces informations n\'apparaissent que dans le pacte. Seuls les associés de l\'équipe et le juriste les voient.</p>'
      + (E.ctx.members || []).map(m => {
        const p = (E.st.parties || {})[m.uid] || {};
        const dp = doc.parties.find(x => x.uid === m.uid) || {};
        const can = P.party(m.uid);
        const s = sigs[m.uid];
        const state = P.st === 'signature' || P.st === 'signe' ? (s ? '<span class="pe-chip ok">' + ic('check') + 'Signé</span>' : '<span class="pe-chip">En attente</span>')
          : (dp.complete ? '<span class="pe-chip ok">' + ic('check') + 'Complet</span>' : '<span class="pe-chip warn">À compléter</span>');
        const open = can && (E.partyOpen === m.uid || (E.partyOpen == null && m.uid === E.me.uid && !dp.complete));
        return '<div class="pe-party' + (m.role === 'vis' ? ' vis' : '') + '"><div class="pe-party-h"><span class="pe-sq"></span><b>' + esc(p.legal || m.legal || m.first) + (m.uid === E.me.uid ? ' <small>(toi)</small>' : '') + '</b>' + state + '</div>'
          + '<small class="pe-party-r">' + (m.role === 'vis' ? 'Porteur de projet' : 'Associé Talent') + ' · ' + TP.pct(m.share || 0) + '</small>'
          + (s ? '<small class="pe-party-r">Signé le ' + esc(new Date(s.at).toLocaleString('fr-FR', {dateStyle:'medium', timeStyle:'short'})) + '</small>' : '')
          + (open ? '<form class="pe-party-f" data-uid="' + esc(m.uid) + '">' + PARTY_FIELDS.map(f => fld(f[1], '<input class="inp" name="' + f[0] + '" type="' + f[3] + '" value="' + esc(f[0] === 'legal' ? (p.legal || m.legal || '') : (p[f[0]] || '')) + '" placeholder="' + esc(f[2]) + '"' + (f[0] === 'birthDate' ? ' max="' + new Date().toISOString().slice(0, 10) + '"' : ' maxlength="' + (f[0] === 'address' ? 200 : 120) + '"') + '>')).join('')
              + '<div class="pe-row"><button type="submit" class="btn btn-a btn-sm">' + ic('check') + 'Enregistrer</button>' + (E.partyOpen === m.uid ? '<button type="button" class="btn btn-quiet btn-sm" data-pe="party-close">Fermer</button>' : '') + '</div></form>'
            : can ? '<button class="btn btn-ghost btn-sm" data-pe="party-open" data-uid="' + esc(m.uid) + '">' + ic('edit') + (m.uid === E.me.uid ? 'Compléter mes informations' : 'Compléter') + '</button>' : '')
          + '</div>';
      }).join('');
  }

  function railIssues(E, issues){
    if(!issues.length) return '<div class="pe-empty">' + ic('check') + '<b>Rien à compléter.</b><span>Toutes les informations nécessaires sont là.</span></div>';
    const groups = {field:'Informations manquantes', atelier:'À décider dans l\'Atelier', stale:'À relire', warn:'Points d\'attention'};
    return Object.keys(groups).map(k => {
      const l = issues.filter(x => x.kind === k); if(!l.length) return '';
      return '<h4>' + groups[k] + '</h4><ul class="pe-iss">' + l.map(x => '<li><button data-pe="goto" data-art="' + esc(x.art || '') + '" data-who="' + esc(x.who || '') + '">'
        + '<b>' + esc(x.label) + '</b><small>' + esc(x.who ? 'Signataire : ' + x.who : x.where) + '</small></button></li>').join('') + '</ul>';
    }).join('') + (issues.some(x => x.kind === 'atelier') ? '<button class="btn btn-ghost btn-sm pe-block" data-pe="atelier">' + ic('back') + 'Ouvrir l\'Atelier</button>' : '');
  }

  function railHisto(E){
    const ev = E.st.events || [];
    if(!ev.length) return '<div class="pe-empty">' + ic('clock') + '<b>Pas encore d\'historique.</b><span>Chaque étape du pacte s\'inscrit ici, datée.</span></div>';
    return '<ul class="pe-histo">' + ev.map(x => '<li><b>' + esc(x.action) + '</b>' + (x.detail ? '<span>' + esc(x.detail) + '</span>' : '') + '<small>' + esc(new Date(x.at).toLocaleString('fr-FR', {dateStyle:'medium', timeStyle:'short'})) + (x.who ? ' · ' + esc(x.who) : '') + (x.version ? ' · v' + x.version : '') + '</small></li>').join('') + '</ul>';
  }

  /* ---------- La feuille ---------- */
  function rich(text){
    return TP.inline(text).map(r => r.ph ? '<mark class="pe-ph" title="À compléter">' + esc(r.t) + '</mark>' : r.b ? '<strong>' + esc(r.t) + '</strong>' : esc(r.t)).join('');
  }
  function body(text, a, doc){
    return TP.blocks(text).map(b => {
      if(b.type === 'table') return a && a.table === 'capital' ? capHtml(doc) : a && a.table === 'roles' ? rolesHtml(doc) : '';
      if(b.type === 'list') return '<ul>' + b.items.map(i => '<li>' + rich(i) + '</li>').join('') + '</ul>';
      return '<p>' + rich(b.text) + '</p>';
    }).join('') + (a && a.table && !/\{\{table\}\}/.test(a.text) ? (a.table === 'capital' ? capHtml(doc) : rolesHtml(doc)) : '');
  }
  function bar(rows){
    let ti = 0;
    return '<div class="pe-bar">' + rows.map(r => '<i class="' + (r.role === 'Porteur de projet' || r.role === 'vis' ? 'v' : 't' + (ti++ % 3)) + '" style="flex:' + (Number(r.pct || r.share) || 0) + '"></i>').join('') + '</div>';
  }
  function capHtml(doc){
    let ti = 0;
    return '<div class="pe-tbl-w"><table class="pe-tbl pe-cap"><thead><tr><th>Associé</th><th>Qualité</th><th class="r">Actions</th><th class="r">Part</th></tr></thead><tbody>'
      + doc.capRows.map(r => '<tr><td><span class="pe-sq ' + (r.role === 'Porteur de projet' ? 'v' : 't' + (ti++ % 3)) + '"></span><b>' + rich(r.name) + '</b></td><td>' + esc(r.role) + '</td><td class="r">' + (r.n ? TP.nf(r.n) : '—') + '</td><td class="r pe-pct">' + TP.pct(r.pct) + '</td></tr>').join('')
      + '</tbody></table>' + bar(doc.capRows) + '</div><p class="pe-from-l">' + ic('refresh') + 'Tableau mis à jour depuis l\'Atelier.</p>';
  }
  function rolesHtml(doc){
    return '<div class="pe-tbl-w"><table class="pe-tbl"><thead><tr><th>Domaine</th><th>Responsable</th></tr></thead><tbody>'
      + doc.roles.map(r => '<tr><td>' + esc(r.domain) + '</td><td>' + (r.who ? '<b>' + esc(r.who) + '</b>' : '<mark class="pe-ph">à décider</mark>') + '</td></tr>').join('') + '</tbody></table></div><p class="pe-from-l">' + ic('refresh') + 'Tableau mis à jour depuis l\'Atelier.</p>';
  }

  function paper(E, P, doc){
    const sigs = E.st.signatures || {};
    const name = doc.company.name || (E.ctx.project && E.ctx.project.title) || '';
    let h = '<article class="pe-paper' + (P.st === 'brouillon' || P.st === 'relecture' ? ' draft' : '') + '">';
    /* Couverture */
    let ti = 0;
    h += '<header class="pe-cover"><span class="pe-kick blue">Pacte d\'associés</span><h1>' + (name ? esc(name) : '<mark class="pe-ph">dénomination sociale</mark>') + '</h1>'
      + '<p class="pe-sub">Société par actions simplifiée' + (doc.company.state === 'immatriculee' ? '' : ' en formation') + (doc.company.ohada ? ', de droit OHADA' : '') + (doc.company.city ? ' · ' + esc(doc.company.city) + ', ' + esc(doc.company.country) : '') + '</p>'
      + bar(doc.parties.map(p => ({role:p.role, pct:p.share})))
      + '<ul class="pe-who">' + doc.parties.map(p => '<li><span class="pe-sq ' + (p.role === 'vis' ? 'v' : 't' + (ti++ % 3)) + '"></span><b>' + esc(p.legal || p.first) + '</b><small>' + (p.role === 'vis' ? 'Porteur de projet' : 'Associé Talent') + (doc.president === p.uid ? ' · Président' : '') + '</small><em>' + TP.pct(p.share) + '</em></li>').join('') + '</ul>'
      + '<p class="pe-meta"><span>Réf. ' + esc(doc.ref) + '</span><span>Version ' + (doc.version || 1) + '</span><span>' + esc(TP.dateL(doc.date)) + '</span></p></header>';
    /* Parties + exposé */
    h += '<section class="pe-sec" id="pe-a-parties"><span class="pe-kick blue">Entre les soussignés</span>'
      + doc.parties.map(p => '<p class="pe-pty">' + rich(p.text) + '<br><em>' + esc(p.alias) + ' ;</em></p>').join('')
      + '<p>Ci-après ensemble « les Associés » et individuellement « un Associé ».</p>'
      + '<span class="pe-kick blue">Il a été exposé ce qui suit</span>' + body(doc.preamble) + '<p class="pe-conv">Ceci exposé, il a été convenu ce qui suit.</p></section>';
    /* Articles */
    if(P.editDoc) h += insertBtn('_start');
    doc.articles.forEach(a => {
      const editing = E.edit && E.edit.id === a.id;
      const tags = (a.added ? '<span class="pe-tag gold">Clause ajoutée</span>' : '') + (a.edited ? '<span class="pe-tag">Modifié</span>' : '') + (a.stale ? '<span class="pe-tag warn" title="Les données de l\'équipe ont changé depuis la modification">À relire</span>' : '');
      h += '<section class="pe-art' + (editing ? ' editing' : '') + (P.editDoc && !editing ? ' can' : '') + '" id="pe-a-' + esc(a.id) + '" data-id="' + esc(a.id) + '">'
        + '<div class="pe-art-h"><span class="pe-n">Article ' + a.n + '</span>' + tags
        + (P.editDoc && !editing ? '<span class="pe-tools">'
          + '<button data-pe="edit" data-id="' + esc(a.id) + '" title="Réécrire cet article">' + ic('edit') + '<span>Modifier</span></button>'
          + (a.edited ? '<button data-pe="reset" data-id="' + esc(a.id) + '" title="Revenir au texte d\'origine">' + ic('undo') + '<span>Texte d\'origine</span></button>' : '')
          + (!a.core ? '<button data-pe="remove" data-id="' + esc(a.id) + '" title="Retirer cet article">' + ic('trash') + '<span>Retirer</span></button>' : '')
          + (P.notes ? '<button data-pe="note" data-id="' + esc(a.id) + '" title="Note pour l\'équipe">' + ic('note') + '<span>Note</span></button>' : '')
          + '</span>' : '') + '</div>';
      if(editing){
        const raw = String(a.text).replace(/\{\{table\}\}/g, '[TABLEAU]');
        h += '<div class="pe-edit"><input class="inp pe-ti" value="' + esc(E.edit.title != null ? E.edit.title : a.title) + '" maxlength="90" aria-label="Titre de l\'article">'
          + '<textarea class="inp pe-ta" aria-label="Texte de l\'article" spellcheck="true">' + esc(E.edit.text != null ? E.edit.text : raw) + '</textarea>'
          + '<p class="pe-hint">Une ligne vide sépare deux paragraphes · une ligne qui commence par « - » devient une puce · <b>**gras**</b> · une information à compléter s\'écrit [[comme ceci]]' + (a.table ? ' · [TABLEAU] place le tableau tiré de l\'Atelier' : '') + '.</p>'
          + (a.stale ? note('warn', 'alert', 'Les données de l\'équipe ont changé depuis ta modification. <button class="pe-link" data-pe="show-gen" data-id="' + esc(a.id) + '">Voir le texte d\'origine à jour</button>') : '')
          + (E.edit.showGen ? '<div class="pe-gen"><small>Texte d\'origine à jour</small>' + body(a.gen ? String(a.gen).replace(/\{\{art:[^}]+\}\}/g, 'l\'article correspondant') : '', null, doc) + '</div>' : '')
          + '<div class="pe-row"><button class="btn btn-quiet btn-sm" data-pe="edit-cancel">Annuler</button><button class="btn btn-a btn-sm" data-pe="edit-save">' + ic('check') + 'Enregistrer l\'article</button></div></div>';
      } else {
        h += '<h3 class="pe-art-t"' + (P.editDoc ? ' data-pe="edit" data-id="' + esc(a.id) + '"' : '') + '>' + esc(a.title) + '</h3>'
          + '<div class="pe-art-b"' + (P.editDoc ? ' data-pe="edit" data-id="' + esc(a.id) + '"' : '') + '>' + (String(a.text).trim() ? body(a.text, a, doc) : '<p class="pe-hint">Clause vide : clique pour écrire son texte.</p>') + '</div>';
      }
      if(E.noteFor === a.id) h += '<div class="pe-jnote edit"><small>Note du juriste pour l\'équipe (n\'apparaît pas dans le PDF)</small><textarea class="inp" id="peNote" rows="3" maxlength="600">' + esc(E.spec.notes[a.id] || '') + '</textarea><div class="pe-row"><button class="btn btn-quiet btn-sm" data-pe="note-cancel">Annuler</button><button class="btn btn-a btn-sm" data-pe="note-save" data-id="' + esc(a.id) + '">Enregistrer la note</button></div></div>';
      else if(a.note) h += '<div class="pe-jnote">' + ic('shield') + '<div><small>Note du juriste</small>' + esc(a.note) + '</div></div>';
      h += '</section>';
      if(P.editDoc) h += insertBtn(a.id);
    });
    /* Signatures */
    h += '<section class="pe-sec pe-sigs" id="pe-a-sign"><span class="pe-kick blue">Signatures</span><div class="pe-sig-g">' + doc.parties.map(p => {
      const s = sigs[p.uid];
      return '<div class="pe-sig' + (s ? ' ok' : '') + '"><b>' + esc(p.legal || p.first) + '</b><small>' + (p.role === 'vis' ? 'Porteur de projet' : 'Associé Talent') + '</small>'
        + (s ? '<span>' + ic('check') + 'Signé électroniquement le ' + esc(new Date(s.at).toLocaleString('fr-FR', {dateStyle:'medium', timeStyle:'short'})) + '</span>' : '<span class="pe-sig-box">' + (P.st === 'signature' ? 'En attente de signature' : 'Signature après relecture') + '</span>') + '</div>';
    }).join('') + '</div></section>';
    if(doc.plan && doc.plan.length) h += '<section class="pe-sec"><span class="pe-kick blue">Annexe · Plan d\'action</span>' + doc.plan.map(o => '<p><b>' + esc(o.t) + '</b></p><ul class="pe-plan">' + o.tasks.map(k => '<li class="' + (k.done ? 'done' : '') + '">' + esc(k.t) + '<small>' + esc([k.who, k.due].filter(Boolean).join(' · ')) + '</small></li>').join('') + '</ul>').join('') + '</section>';
    return h + '</article>';
  }
  const insertBtn = after => '<div class="pe-ins"><button data-pe="add" data-after="' + esc(after) + '">' + ic('plus') + 'Ajouter une clause ici</button></div>';

  /* ============================================================
     Dialogues internes
     ============================================================ */
  function dlg(E, kind, data){ E.dlg = {kind, data:data || {}}; paintDlg(E); }
  function closeDlg(E){ E.dlg = null; const w = E.root.querySelector('.pe-dlg-w'); if(w) w.innerHTML = ''; }
  function paintDlg(E){
    const w = E.root.querySelector('.pe-dlg-w'); if(!w || !E.dlg) return;
    const d = E.dlg, doc = E.doc, P = perms(E);
    let t = '', b = '', f = '';
    if(d.kind === 'add'){
      const lib = TP.library(E.ctx, E.spec);
      t = 'Ajouter une clause';
      b = '<p class="pe-hint">Les clauses proposées sont rédigées et s\'adaptent à votre équipe. La clause libre vous laisse écrire la vôtre.</p><div class="pe-lib">'
        + '<button class="pe-lib-i free" data-pe="add-go" data-id="">' + ic('edit') + '<span><b>Clause libre</b><small>Un titre et un texte que vous écrivez vous-mêmes.</small></span></button>'
        + lib.map(x => '<button class="pe-lib-i" data-pe="add-go" data-id="' + esc(x.id) + '">' + ic('plus') + '<span><b>' + esc(x.title) + '</b><small>' + esc(x.desc) + '</small></span></button>').join('') + '</div>';
      f = '<button class="btn btn-quiet" data-pe="dlg-close">Fermer</button>';
    } else if(d.kind === 'order'){
      const miss = E.issues.filter(x => x.kind === 'field' || x.kind === 'atelier');
      t = 'Commander la relecture';
      b = '<p>Un juriste relit votre pacte, vérifie qu\'il tient au regard du droit OHADA, complète ce qui manque et vous le renvoie prêt à signer, en général sous <b>72 heures ouvrées</b>.</p>'
        + '<ul class="pe-ul"><li>Après la commande, le texte ne se modifie plus que par le juriste.</li><li>Chaque associé continue de compléter ses informations de signataire.</li><li>Si vous voulez encore changer quelque chose après relecture, vous pourrez demander une modification.</li></ul>'
        + (miss.length ? note('warn', 'alert', miss.length + ' point' + (miss.length > 1 ? 's restent' : ' reste') + ' ouvert' + (miss.length > 1 ? 's' : '') + ' : le juriste vous posera la question. Tu peux aussi les régler avant de commander.') : '');
      f = '<button class="btn btn-quiet" data-pe="dlg-close">Annuler</button><button class="btn btn-a" data-pe="order-go">' + (E.o.free ? ic('check') + 'Commander gratuitement' : ic('card') + 'Payer ' + (E.o.price || '')) + '</button>';
    } else if(d.kind === 'publish'){
      const miss = E.issues.filter(x => x.kind === 'field');
      t = 'Publier pour signature';
      b = '<p>Le texte actuel devient la <b>version ' + (E.st.snapshot ? (E.st.version || 1) + 1 : (E.st.version || 1)) + '</b>, figée. Chaque associé la signe depuis son Atelier ; toute modification ultérieure demandera une nouvelle version.</p>'
        + (miss.length ? note('warn', 'alert', miss.length + ' information' + (miss.length > 1 ? 's manquent' : ' manque') + ' encore (' + esc(Array.from(new Set(miss.map(x => x.who || x.label))).slice(0, 4).join(', ')) + '). Elles apparaîtront en pointillés à remplir à la main.') : '')
        + fld('Note pour l\'équipe (facultatif)', '<textarea class="inp" id="pePubNote" rows="3" maxlength="600" placeholder="Ex. : j\'ai précisé la clause de non-concurrence et ajouté l\'assurance des véhicules."></textarea>');
      f = '<button class="btn btn-quiet" data-pe="dlg-close">Annuler</button><button class="btn btn-a" data-pe="publish-go">' + ic('send') + 'Publier la version</button>';
    } else if(d.kind === 'sign'){
      const p = doc.parties.find(x => x.uid === E.me.uid) || {};
      t = 'Signer le pacte';
      b = '<p>Tu signes la <b>version ' + (doc.version || 1) + '</b> du pacte d\'associés de <b>' + esc(doc.company.name || '') + '</b>, identique pour tous les associés.</p>'
        + '<div class="pe-hashbox"><small>Empreinte du document</small><span class="pe-mono">' + esc(E.st.hash || '') + '</span></div>'
        + '<label class="pe-chk"><input type="checkbox" id="peSignOk"><span>J\'ai lu l\'intégralité du pacte, je l\'ai téléchargé et j\'accepte d\'être ' + 'lié·e par ses termes.</span></label>'
        + fld('Écris ton nom complet pour signer', '<input class="inp" id="peSignName" autocomplete="name" placeholder="' + esc(p.legal || '') + '">', 'Il doit correspondre au nom inscrit dans le pacte : ' + esc(p.legal || '—') + '.')
        + '<p class="pe-hint">Ta signature est horodatée et rattachée à ton compte TakaMatch. Elle a la même valeur que ta signature à la main.</p>';
      f = '<button class="btn btn-quiet" data-pe="dlg-close">Annuler</button><button class="btn btn-a" data-pe="sign-go">' + ic('pen') + 'Signer</button>';
    } else if(d.kind === 'reopen'){
      t = 'Demander une modification';
      b = '<p>La version en cours est retirée de la signature' + (Object.keys(E.st.signatures || {}).length ? ' et <b>les signatures déjà faites sont annulées</b>' : '') + '. ' + (P.staff ? 'Le pacte repasse en relecture.' : 'Le juriste reprend le texte et publie une nouvelle version.') + '</p>'
        + fld('Ce qu\'il faut modifier', '<textarea class="inp" id="peReason" rows="4" maxlength="600" placeholder="Ex. : Sènami passe à temps plein, sa part monte à 20 %."></textarea>');
      f = '<button class="btn btn-quiet" data-pe="dlg-close">Annuler</button><button class="btn btn-a" data-pe="reopen-go">' + ic('undo') + 'Rouvrir le pacte</button>';
    } else if(d.kind === 'remove'){
      const a = doc.articles.find(x => x.id === d.data.id) || {};
      t = 'Retirer l\'article ' + (a.n || '');
      b = '<p>« ' + esc(a.title || '') + ' » sera retiré du pacte. ' + (a.added ? 'Le texte écrit sera perdu.' : 'Tu pourras le remettre depuis « Ajouter une clause ».') + '</p>';
      f = '<button class="btn btn-quiet" data-pe="dlg-close">Annuler</button><button class="btn btn-danger" data-pe="remove-go" data-id="' + esc(d.data.id) + '">' + ic('trash') + 'Retirer</button>';
    }
    w.innerHTML = '<div class="pe-dlg-bg" data-pe="dlg-close"></div><div class="pe-dlg" role="dialog" aria-modal="true" aria-labelledby="peDlgT"><button class="pe-dlg-x" data-pe="dlg-close" aria-label="Fermer">' + ic('x') + '</button><h2 id="peDlgT">' + esc(t) + '</h2><div class="pe-dlg-b">' + b + '</div><div class="pe-dlg-f">' + f + '</div></div>';
    const fi = w.querySelector('textarea, input'); if(fi) setTimeout(() => fi.focus(), 30);
  }

  function toastE(E, msg, kind){
    const t = E.root.querySelector('.pe-toasts'); if(!t) return;
    const el = document.createElement('div'); el.className = 'pe-toast ' + (kind || ''); el.innerHTML = ic(kind === 'bad' ? 'alert' : 'check') + '<span>' + esc(msg) + '</span>';
    t.appendChild(el); setTimeout(() => el.classList.add('out'), 3800); setTimeout(() => el.remove(), 4300);
  }
  function busy(btn, on){ if(!btn) return; btn.disabled = on; btn.classList.toggle('loading', on); }
  function grow(ta){ ta.style.height = 'auto'; ta.style.height = Math.min(900, ta.scrollHeight + 4) + 'px'; }

  /* ============================================================
     Événements
     ============================================================ */
  function setSpec(E, fn){
    E.spec = fn(E.spec) || E.spec;
    E.dirty = true; paintSave(E);
    clearTimeout(E.timer); E.timer = setTimeout(() => flush(E), 900);
  }
  function setPath(o, path, v){ const k = path.split('.'); let x = o; for(let i = 0; i < k.length - 1; i++) x = x[k[i]] = x[k[i]] || {}; x[k[k.length - 1]] = v; }

  function onInput(E, e, changed){
    const el = e.target;
    if(el.classList && el.classList.contains('pe-ta')){ grow(el); if(E.edit) E.edit.text = el.value; return; }
    if(el.classList && el.classList.contains('pe-ti')){ if(E.edit) E.edit.title = el.value; return; }
    const k = el.dataset && el.dataset.k; if(!k) return;
    if(!perms(E).editDoc) return;
    let v = el.type === 'checkbox' ? el.checked : el.value;
    if(el.type === 'number' || /^(company\.(capital|nominal|delay)|gov\.threshold|vest\.discount|opts\.(notice|inalienMonths|dragPct|ncMonths|confidYears|duration))$/.test(k)) v = Number(v) || 0;
    const repaint = el.tagName === 'SELECT' || el.type === 'checkbox' || changed;
    setSpec(E, s => { setPath(s, k, v); return s; });
    if(repaint) paint(E);
    else { clearTimeout(E.pt); E.pt = setTimeout(() => { const a = document.activeElement, kk = a && a.dataset && a.dataset.k, pos = a && a.selectionStart; paint(E); if(kk){ const n = E.root.querySelector('[data-k="' + kk + '"]'); if(n){ n.focus(); try{ n.setSelectionRange(pos, pos); }catch(err){} } } }, 500); }
  }

  async function onClick(E, e){
    const sub = e.target.closest('form.pe-party-f button[type="submit"]');
    if(sub){ e.preventDefault(); return saveParty(E, sub.closest('form'), sub); }
    const b = e.target.closest('[data-pe]'); if(!b || !E.root.contains(b)) return;
    const a = b.dataset.pe, id = b.dataset.id;
    const P = perms(E);
    switch(a){
      case 'close': return close(E);
      case 'tab':
        if(E.tab === b.dataset.v && window.matchMedia('(max-width: 899px)').matches) E.railOpen = !E.railOpen; else { E.tab = b.dataset.v; E.railOpen = true; }
        return paint(E);
      case 'atelier': await flush(E); close(E, true); if(E.o.actions.goAtelier) E.o.actions.goAtelier(); return;
      case 'goto': {
        const art = b.dataset.art, who = b.dataset.who;
        if(art === 'parties' && who){ const m = (E.ctx.members || []).find(x => x.first === who); E.tab = 'parties'; E.partyOpen = m && P.party(m.uid) ? m.uid : null; paint(E); return; }
        if(art){ E.scrollTo = art === 'parties' ? 'parties' : art; E.railOpen = false; paint(E); }
        return;
      }
      case 'party-open': E.partyOpen = b.dataset.uid; return paint(E);
      case 'party-close': E.partyOpen = '__none__'; return paint(E);
      case 'edit':
        if(!P.editDoc) return;
        if(e.target.closest('a')) return;
        if(E.edit && E.edit.id === id) return;
        E.edit = {id}; E.noteFor = null; return paint(E);
      case 'edit-cancel': E.edit = null; return paint(E);
      case 'show-gen': if(E.edit) E.edit.showGen = !E.edit.showGen; return paint(E);
      case 'edit-save': {
        if(!E.edit) return;
        const ta = E.root.querySelector('.pe-ta'), ti = E.root.querySelector('.pe-ti');
        const text = (ta ? ta.value : '').replace(/\[TABLEAU\]/g, '{{table}}').replace(/\r/g, '').trim();
        const title = (ti ? ti.value : '').trim();
        const art = E.doc.articles.find(x => x.id === E.edit.id);
        if(!title) return toastE(E, 'Donne un titre à l\'article.', 'bad');
        const eid = E.edit.id; E.edit = null;
        setSpec(E, s => TP.ops.edit(E.ctx, s, eid, text, title));
        paint(E); toastE(E, 'Article enregistré.');
        return;
      }
      case 'reset': setSpec(E, s => TP.ops.reset(E.ctx, s, id)); paint(E); toastE(E, 'Texte d\'origine rétabli.'); return;
      case 'remove': return dlg(E, 'remove', {id});
      case 'remove-go': closeDlg(E); setSpec(E, s => TP.ops.remove(E.ctx, s, id)); paint(E); toastE(E, 'Article retiré.'); return;
      case 'add': if(!P.editDoc) return; return dlg(E, 'add', {after:b.dataset.after});
      case 'add-go': {
        const after = (E.dlg && E.dlg.data.after) || '_end';
        closeDlg(E);
        if(id){ setSpec(E, s => TP.ops.add(E.ctx, s, id)); E.scrollTo = id; paint(E); toastE(E, 'Clause ajoutée.'); return; }
        let nid = null;
        setSpec(E, s => { const n = TP.ops.add(E.ctx, s, null, after, E.me.name || ''); nid = n.added[n.added.length - 1].id; return n; });
        E.edit = {id:nid, title:'', text:''}; E.scrollTo = nid; paint(E); return;
      }
      case 'note': E.noteFor = id; E.edit = null; return paint(E);
      case 'note-cancel': E.noteFor = null; return paint(E);
      case 'note-save': { const v = (E.root.querySelector('#peNote') || {}).value || ''; E.noteFor = null; setSpec(E, s => { if(v.trim()) s.notes[id] = v.trim(); else delete s.notes[id]; return s; }); paint(E); return; }
      case 'dlg-close': return closeDlg(E);
      case 'pdf': return pdf(E, b);
      case 'order': await flush(E); return dlg(E, 'order');
      case 'order-go': {
        busy(b, true);
        try{ await flush(E); closeDlg(E); await E.o.actions.order(); }
        catch(err){ if(err && err.message) toastE(E, err.message, 'bad'); }
        busy(b, false); return;
      }
      case 'publish': await flush(E); return dlg(E, 'publish');
      case 'publish-go': {
        busy(b, true);
        try{
          await flush(E);
          const note = (E.root.querySelector('#pePubNote') || {}).value || '';
          const doc = currentDoc(E);
          const snap = Object.assign({}, doc, {version:E.st.snapshot ? (E.st.version || 1) + 1 : (E.st.version || 1), status:'signature', reviewed:true, date:new Date().toISOString()});
          const hash = await TP.fingerprint(snap);
          await E.o.actions.publish(snap, hash, note);
          closeDlg(E); toastE(E, 'Version publiée : l\'équipe est prévenue.');
        }catch(err){ toastE(E, err.message || 'Publication impossible.', 'bad'); }
        busy(b, false); return;
      }
      case 'sign': return dlg(E, 'sign');
      case 'sign-go': {
        const ok = E.root.querySelector('#peSignOk'), nm = E.root.querySelector('#peSignName');
        const p = E.doc.parties.find(x => x.uid === E.me.uid) || {};
        if(!ok || !ok.checked) return toastE(E, 'Coche la case pour confirmer ta lecture.', 'bad');
        const v = (nm && nm.value || '').trim();
        if(v.length < 2) return toastE(E, 'Écris ton nom complet.', 'bad');
        if(p.legal && norm(v) !== norm(p.legal)) return toastE(E, 'Le nom saisi ne correspond pas à celui du pacte (' + p.legal + ').', 'bad');
        busy(b, true);
        try{
          const hash = await TP.fingerprint(E.st.snapshot || E.doc);
          if(E.st.hash && hash !== E.st.hash) throw new Error('Le document affiché ne correspond pas à la version publiée. Recharge la page.');
          await E.o.actions.sign(v, E.st.hash || hash);
          closeDlg(E); toastE(E, 'Signature enregistrée. Merci !');
        }catch(err){ toastE(E, err.message || 'Signature impossible.', 'bad'); }
        busy(b, false); return;
      }
      case 'reopen': return dlg(E, 'reopen');
      case 'reopen-go': {
        const r = ((E.root.querySelector('#peReason') || {}).value || '').trim();
        if(r.length < 3) return toastE(E, 'Explique en quelques mots ce qu\'il faut modifier.', 'bad');
        busy(b, true);
        try{ await E.o.actions.reopen(r); closeDlg(E); toastE(E, 'Pacte rouvert.'); }catch(err){ toastE(E, err.message || 'Action impossible.', 'bad'); }
        busy(b, false); return;
      }
    }
  }

  async function saveParty(E, form, btn){
    const uid = form.dataset.uid, data = {};
    PARTY_FIELDS.forEach(f => { const i = form.querySelector('[name="' + f[0] + '"]'); data[f[0]] = i ? i.value.trim() : ''; });
    if(!data.legal) return toastE(E, 'Le nom complet est obligatoire.', 'bad');
    busy(btn, true);
    try{ await E.o.actions.saveParty(uid, data); E.partyOpen = '__none__'; toastE(E, 'Informations enregistrées.'); }
    catch(err){ toastE(E, err.message || 'Enregistrement impossible.', 'bad'); }
    busy(btn, false);
  }

  async function pdf(E, btn){
    busy(btn, true);
    try{
      await flush(E);
      if(E.st.status === 'signe' && E.o.actions.finalPdf){ const done = await E.o.actions.finalPdf(); if(done){ busy(btn, false); return; } }
      const doc = currentDoc(E);
      await TP.download(doc, {signatures:E.st.signatures || {}, hash:E.st.hash, draft:!(E.st.status === 'signature' || E.st.status === 'signe')});
    }catch(err){ toastE(E, err.message || 'Le PDF n\'a pas pu être créé.', 'bad'); }
    busy(btn, false);
  }

  window.TMPacteEditor = {open, current:() => cur};
})();
