"use strict";
/* ============================================================
   TakaMatch — le pacte d'associés dans l'Atelier
   ------------------------------------------------------------
   Chargé après app.js (et avant app-db.js, qui remplace le
   stockage local par la base quand le membre est connecté).

   · pacteCtx(t)   : l'équipe telle que le pacte la voit
   · PacteStore    : où vit l'état du pacte. Par défaut : dans
                     l'équipe elle-même (démo, hors connexion),
                     avec un juriste et des signatures simulés.
   · openPacte(t)  : ouvre l'éditeur plein écran
   ============================================================ */

const PACTE_LABEL = {brouillon:'Brouillon', relecture:'Chez le juriste', signature:'À signer', signe:'Signé'};

function paceLabel(id){ const p = PACE.find(x => x.id === id); return p ? p.l + ' (' + p.h + ')' : ''; }
function countryCode(city){
  const n = String(city || '').split(',').pop().trim();
  const C = (window.TMPacte && TMPacte.COUNTRIES) || {};
  return Object.keys(C).find(k => C[k] === n) || 'BJ';
}
function pacteRef(id){ let h = 0; for(const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return 'TM-PA-' + h.toString(36).toUpperCase().padStart(6, '0').slice(-6); }

/* ---------- L'équipe, vue par le pacte ---------- */
function pacteCtx(t){
  const tal = isTalMode();
  const proj = tal ? (itemById(t.id) || {}) : S.me.project;
  const uidOf = m => PacteStore.uid(t, m);
  const talentData = m => m.me ? S.me : (TALENTS.find(x => x.id === m.id) || {});
  const members = t.members.map(m => {
    const d = m.role === 'tal' ? talentData(m) : null;
    const pace = m.role === 'vis' ? (proj.pace || '') : (d && d.pace) || '';
    return {uid:uidOf(m), first:m.me ? (S.me.first || 'Toi') : m.first, legal:m.me ? myName() : m.name,
      sex:m.me ? S.me.sex : m.sex, role:m.role, share:shareOf(t, m.id), pace:paceLabel(pace),
      skills:((d && d.skills) || []).map(skillL)};
  });
  const porteur = porteurOf(t);
  const city = cityOf(tal ? (proj.ownerCity || '') : S.me.city)[0] || '';
  return {
    ref:pacteRef(t.id),
    project:{id:t.id, title:proj.title || t.title, glyph:t.glyph, hook:proj.hook || '', sectors:(proj.sectors || []).map(id => sector(id).l),
      city, country:countryCode(tal ? proj.ownerCity : S.me.city)},
    members,
    roles:DOMAINS.map(d => ({domain:d.l, uid:t.roles[d.id] ? uidOf(memberById(t, t.roles[d.id])) : ''})),
    vesting:t.vesting, since:t.since,
    objectives:(t.objectives || []).map(o => ({t:o.t, tasks:(o.tasks || []).map(k => ({t:k.t, owner:k.owner ? uidOf(memberById(t, k.owner)) : '', due:k.due, status:k.status}))})),
    pending:(t.props || []).filter(p => missingOn(t, p).length).length,
    porteur:uidOf(porteur),
  };
}
const pacteOf = t => t && (t.pacte || null);
const pacteStatus = t => (pacteOf(t) || {}).status || '';

/* ============================================================
   Stockage local (démo, ou base pas encore prête)
   ============================================================ */
const PacteStore = {
  kind:'local',
  uid(t, m){ return m.id; },
  me(t){ return 'me'; },
  async load(t){
    if(!t.pacte) t.pacte = {status:'brouillon', version:1, spec:null, snapshot:null, hash:'', signatures:{}, parties:{}, events:[], reviewNote:''};
    const p = t.pacte;
    /* Mes informations civiles de départ : nom de compte. */
    if(!p.parties.me) p.parties.me = {legal:myName()};
    return Object.assign({demo:true}, p);
  },
  log(t, action, detail){ t.pacte.events.unshift({at:new Date().toISOString(), action, detail:detail || '', who:'', version:t.pacte.version}); },
  async save(t, spec){ t.pacte.spec = spec; },
  async saveParty(t, uid, data){ t.pacte.parties[uid] = Object.assign({}, data); },
  async order(t, payId){
    const p = t.pacte;
    p.status = 'relecture'; p.payment = payId;
    this.log(t, 'Relecture commandée', 'Paiement ' + payId);
    /* Juriste de démonstration : il relit et publie au bout de quelques secondes. */
    setTimeout(() => this.demoPublish(t, 'Relu. J\'ai vérifié la cohérence entre le capital, le vesting et les clauses de départ. Pensez à compléter vos informations civiles avant de signer.'), 9000);
  },
  async demoPublish(t, note){
    const p = t.pacte; if(!p || p.status !== 'relecture') return;
    const ctx = Object.assign(pacteCtx(t), {parties:p.parties});
    const v = p.snapshot ? p.version + 1 : p.version;
    const doc = TMPacte.build(ctx, p.spec || TMPacte.defaults(ctx), {status:'signature', version:v, reviewed:true});
    p.snapshot = doc; p.version = v; p.hash = await TMPacte.fingerprint(doc); p.status = 'signature'; p.reviewNote = note || ''; p.signatures = {};
    this.log(t, 'Version ' + v + ' publiée pour signature', note);
    pushNotif('file', 'Votre pacte est prêt à signer', 'Version ' + v + ' relue par le juriste.');
    pacteRefresh(t);
  },
  async sign(t, name, hash){
    const p = t.pacte, me = this.me(t);
    p.signatures[me] = {name, at:new Date().toISOString(), hash};
    this.log(t, 'Signature', name);
    this.checkDone(t);
    /* Les autres associés de la démo signent à leur tour. */
    const others = (p.snapshot.parties || []).filter(x => !p.signatures[x.uid]);
    others.forEach((x, i) => setTimeout(() => {
      if(p.status !== 'signature' || p.signatures[x.uid]) return;
      p.signatures[x.uid] = {name:x.legal || x.first, at:new Date().toISOString(), hash:p.hash};
      this.log(t, 'Signature', x.legal || x.first);
      pushNotif('file', 'Nouvelle signature', (x.first || x.legal) + ' a signé le pacte.');
      this.checkDone(t); pacteRefresh(t);
    }, 4000 + i * 2500));
  },
  checkDone(t){
    const p = t.pacte;
    if((p.snapshot.parties || []).every(x => p.signatures[x.uid])){
      p.status = 'signe'; p.signedAt = new Date().toISOString();
      this.log(t, 'Pacte signé par tous les associés');
      pacteSigned(t);
    }
  },
  async reopen(t, reason){
    const p = t.pacte;
    p.status = 'relecture'; p.signatures = {};
    this.log(t, 'Modification demandée', reason);
    setTimeout(() => this.demoPublish(t, 'Modification prise en compte : « ' + reason + ' ».'), 9000);
  },
  async finalPdf(t){ return false; },
};

/* Le pacte est signé : jalon 6 franchi, journal, notification. */
function pacteSigned(t){
  const ms = t.milestones && t.milestones[5];
  if(ms && !ms.done){ ms.done = true; ms.d = new Date(); }
  if(!t.log.some(l => /Pacte d'associés signé/.test(l.t))) teamLog(t, 'Pacte d\'associés signé', 'Signé par tous les associés. Le PDF est disponible dans l\'Atelier.');
  pushNotif('check', 'Pacte signé', 'Tous les associés ont signé ' + (t.title ? 'le pacte de ' + t.title : 'le pacte') + '.');
  if(S.view === 'atelier' && !S.layer) render(); else if(typeof syncSide === 'function') syncSide();
}

/* ============================================================
   L'éditeur
   ============================================================ */
let PACTE_ED = null;
async function pacteRefresh(t){
  if(!PACTE_ED || PACTE_ED.tid !== t.id) return;
  try{ const st = await PacteStore.load(t); PACTE_ED.ed.update(st, pacteCtx(t)); }catch(e){}
}

async function openPacte(t){
  if(!t) return;
  if(!window.TMPacte || !window.TMPacteEditor){ toast('Le module du pacte n\'a pas pu se charger. Recharge la page.', 'bad'); return; }
  let st;
  try{ st = await PacteStore.load(t); }
  catch(e){ toast(e.message || 'Le pacte n\'a pas pu être chargé.', 'bad'); return; }
  const ctx = pacteCtx(t);
  const reload = async () => { const s = await PacteStore.load(t); if(PACTE_ED) PACTE_ED.ed.update(s, pacteCtx(t)); return s; };
  const ed = TMPacteEditor.open({
    ctx, state:st, me:{uid:PacteStore.me(t), staff:false, name:S.me.first || ''},
    price:esc(priceT('pacte')), z:110, backLabel:'Atelier',
    actions:{
      save:spec => PacteStore.save(t, spec),
      saveParty:async (uid, data) => { await PacteStore.saveParty(t, uid, data); await reload(); },
      order:() => pacteOrder(t, reload),
      sign:async (name, hash) => { await PacteStore.sign(t, name, hash); await reload(); if(S.view === 'atelier' && !S.layer) render(); },
      reopen:async reason => { await PacteStore.reopen(t, reason); teamLog(t, 'Pacte d\'associés rouvert', reason); await reload(); },
      publish:async () => { throw new Error('Seule l\'équipe TakaMatch publie une version.'); },
      reload,
      finalPdf:() => PacteStore.finalPdf(t),
      goAtelier:() => { S.atelierId = t.id; if(S.view !== 'atelier') go('atelier'); else render(); },
    },
    onClose:() => { PACTE_ED = null; if(S.view === 'atelier' && !S.layer) render(); },
  });
  PACTE_ED = {ed, tid:t.id};
}

/* Commande : paiement (fenêtre de l'app, au-dessus de l'éditeur), puis relecture. */
function pacteOrder(t, reload){
  S.pay = payInit(1); S.pay.key = 'pacte';
  S.pactePay = {t, reload};
  modal('Relecture juridique du pacte',
    '<div class="price-hd"><span class="mono">'+priceH('pacte')+'</span><span>une seule fois pour l\'équipe, relecture et nouvelles versions comprises</span></div>'
    + '<ul class="leave-l">'
    + '<li>'+ic('shield')+'Un juriste vérifie le pacte au regard du droit OHADA et le complète.</li>'
    + '<li>'+ic('clock')+'Retour sous 72 heures ouvrées, avec ses notes article par article.</li>'
    + '<li>'+ic('file')+'Chaque associé signe ensuite en ligne ; le PDF signé reste dans l\'Atelier.</li></ul>'
    + opsField(),
    '<button class="btn btn-ghost" data-act="close">Annuler</button><button class="btn btn-a" data-act="pacte-pay">'+ic('card')+'Payer '+priceH('pacte')+'</button>', {lg:true});
}
function doPactePay(btn){
  const ctx = S.pactePay; if(!ctx) return;
  const t = ctx.t;
  payThen({kind:'pacte', key:'pacte', label:'Pacte d\'associés · '+t.title, amount:priceOf('pacte').charged}, btn, async res => {
    try{
      await PacteStore.order(t, res.id);
      S.payments.unshift({d:today(), l:'Pacte d\'associés · '+t.title, a:priceOf('pacte').charged, op:S.pay.op, ref:S.pay.ref, cc:S.pay.cc});
      teamLog(t, 'Pacte d\'associés commandé', 'Relecture juridique en cours, retour sous 72 h.');
      closeLayer();
      await ctx.reload();
      toast('Commande enregistrée : le juriste est prévenu.', 'ok');
    }catch(e){ closeLayer(); toast('Paiement reçu, mais la commande n\'a pas pu être enregistrée : ' + e.message + ' Contacte le support avec la référence ' + res.id + '.', 'bad'); }
  });
}

/* Modèle vierge (page Légal) */
async function pacteModel(btn){
  if(btn) btn.disabled = true;
  try{
    const ctx = TMPacte.sampleCtx();
    const doc = TMPacte.build(ctx, TMPacte.defaults(ctx), {status:'brouillon', version:1});
    await TMPacte.download(doc, {draft:true});
  }catch(e){ toast(e.message || 'Le modèle n\'a pas pu être créé.', 'bad'); }
  if(btn) btn.disabled = false;
}

document.addEventListener('click', e => {
  const el = e.target.closest && e.target.closest('[data-act]'); if(!el) return;
  if(el.dataset.act === 'pacte-pay'){ e.stopPropagation(); doPactePay(el); }
  else if(el.dataset.act === 'pacte-model'){ e.stopPropagation(); pacteModel(el); }
}, true);

/* ---------- La carte « Pacte d'associés » de l'Atelier ---------- */
function pacteCard(t, adm){
  const p = pacteOf(t), st = (p && p.status) || '';
  const parties = p && p.snapshot ? (p.snapshot.parties || []) : [];
  const sigs = (p && p.signatures) || {};
  const nSig = parties.filter(x => sigs[x.uid]).length;
  const meSigned = p && sigs[PacteStore.me(t)];
  const chip = st === 'signe' ? '<span class="chip chip-ok">'+ic('check')+'Signé</span>'
    : st === 'signature' ? '<span class="chip chip-a">À signer · <span class="mono">'+nSig+'/'+parties.length+'</span></span>'
    : st === 'relecture' ? '<span class="chip chip-warn">Chez le juriste</span>'
    : st === 'brouillon' ? '<span class="chip">Brouillon</span>' : '';
  let btn, hint;
  if(st === 'signe'){ btn = '<button class="btn btn-ghost btn-block" data-act="at-pacte">'+ic('dl')+'Pacte signé · ouvrir et télécharger</button>'; hint = 'Signé par tous les associés. Le PDF et son certificat restent ici.'; }
  else if(st === 'signature'){ btn = '<button class="btn '+(meSigned ? 'btn-ghost' : 'btn-a')+' btn-block" data-act="at-pacte">'+ic(meSigned ? 'eye' : 'edit')+(meSigned ? 'Suivre les signatures' : 'Lire et signer le pacte')+'</button>'; hint = meSigned ? 'Tu as signé. Les autres associés sont prévenus.' : 'Relu par le juriste : chacun signe en ligne.'; }
  else if(st === 'relecture'){ btn = '<button class="btn btn-ghost btn-block" data-act="at-pacte">'+ic('file')+'Ouvrir le pacte</button>'; hint = 'Le juriste relit votre pacte, retour sous 72 h ouvrées.'; }
  else { btn = '<button class="btn '+(adm ? 'btn-a' : 'btn-ghost')+' btn-block" data-act="at-pacte">'+ic('file')+(adm ? (st ? 'Continuer le pacte d\'associés' : 'Préparer le pacte d\'associés') : (st ? 'Lire le brouillon du pacte' : 'Pacte d\'associés'))+'</button>';
    hint = 'Rédigé à partir de vos décisions, modifiable, relu par un juriste · <span class="mono">'+priceH('pacte')+'</span>'; }
  return '<div class="pacte-card">'+(chip ? '<div class="row" style="justify-content:space-between;gap:8px;margin:14px 0 8px"><b style="font-size:13.5px">Pacte d\'associés</b>'+chip+'</div>' : '<div style="height:14px"></div>')
    + btn + '<p class="hint" style="margin-top:8px;text-align:center">'+hint+'</p></div>';
}

/* Pas de rappel « complète ta fiche » par-dessus le pacte. */
{ const _tryR = tryReminder; tryReminder = function(){ if(PACTE_ED){ rmdT = setTimeout(tryReminder, 3000); return; } _tryR(); }; }
