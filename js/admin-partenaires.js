/* ============================================================
   TakaMatch — Espace équipe · module « Partenaires »
   ------------------------------------------------------------
   Gère les centres de coworking et organismes d'appui affichés dans
   l'Atelier (onglet « Partenaires ») : ajouter, modifier, masquer,
   supprimer, marquer « partenaire officiel ».
   · Données : table Supabase « partenaires » (supabase/18_partenaires.sql).
   · Tant que la table n'existe pas, le module l'explique et montre le
     catalogue intégré (js/partenaires-data.js), en lecture seule.
   · Droits : super admin et modérateurs (politiques de la table).
     Chaque changement est inscrit au journal d'audit par la base.
   Chargé après le script principal de admin.html.
   ============================================================ */
(function(){
  'use strict';
  if(typeof MODULES === 'undefined' || !window.TM_PARTNERS) return;

  const CAT = window.TM_PARTNERS;
  const STAGES = [['idee','Idée'], ['lancement','Lancement'], ['croissance','Croissance']];
  P.hands = '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>';
  P.ext = '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>';

  /* Le module prend place dans « Plateforme », après Takam. */
  const at = MODULES.findIndex(m => m.id === 'takam');
  MODULES.splice(at < 0 ? MODULES.length : at + 1, 0, {id:'partners', l:'Partenaires', i:'hands', grp:'Plateforme'});
  ['super', 'moder'].forEach(r => { if(ROLES[r] && !ROLES[r].can.includes('partners')) ROLES[r].can.push('partners'); });
  if(!LIVE_VIEWS.includes('partners')) LIVE_VIEWS.push('partners');

  const PT = {rows:null, err:'', missing:false, loading:false, q:'', cc:'', kind:'', busy:false};
  const toRow = p => ({id:p.id, kind:p.k, type:p.t, name:p.n, country:p.cc, city:p.v || '', district:p.q || null, national:!!p.nat,
    tagline:p.s || '', about:p.d || '', services:p.sv || [], stages:p.pr || [], access:p.acc || null, website:p.web || null,
    official:!!p.off, active:true, sort:p.sort || 0});
  const typeL = t => (CAT.types[t] || {}).l || t;
  const cName = cc => (TMGeo.has(cc) ? TMGeo.country(cc).n : cc);

  async function load(){
    if(PT.loading) return; PT.loading = true; PT.err = ''; PT.missing = false;
    try{ PT.rows = await TMDB.select('partenaires', 'select=*&order=country.asc,sort.asc'); }
    catch(e){
      const m = String((e && e.message) || '');
      if(e && (e.status === 404 || /partenaires|relation|schema cache/i.test(m))) PT.missing = true; else PT.err = m || 'Chargement impossible.';
      PT.rows = null;
    }
    PT.loading = false;
    if(A.view === 'partners') render();
  }

  VIEWS.partners = () => {
    const acts = '<button class="btn btn-ghost" data-act="pt-reload">'+ic('refresh')+'Actualiser</button>'
      + (PT.rows && PT.rows.length ? '<button class="btn btn-a" data-act="pt-new">'+ic('plus')+'Ajouter un partenaire</button>' : '');
    const head = pageH('Partenaires', 'Les centres de coworking et organismes d\'appui affichés dans l\'Atelier, onglet « Partenaires ». Chaque membre voit ceux de son pays, ceux de sa ville en premier.', acts);
    if(PT.rows === null && !PT.err && !PT.missing){ load(); return head + '<div class="card empty"><b>Chargement…</b></div>'; }
    if(PT.err) return head + '<div class="card empty"><b>Chargement impossible</b>'+esc(PT.err)+'</div>';
    if(PT.missing){
      return head + '<div class="demo-note" style="margin-bottom:14px">'+ic('info')+'<span><b>La table des partenaires n\'est pas encore installée.</b> '
        + 'Pour gérer les fiches d\'ici : Supabase → SQL Editor → coller le contenu de <span class="mono">supabase/18_partenaires.sql</span> → Run. '
        + 'Le fichier crée la table et y range les '+CAT.list.length+' fiches de départ. En attendant, l\'outil affiche le catalogue intégré ci-dessous.</span></div>'
        + listTable(CAT.list.map(toRow), true);
    }
    if(!PT.rows.length){
      return head + '<div class="card card-pad" style="text-align:center"><h3 style="font-size:18px;margin-bottom:6px">La table est vide</h3>'
        + '<p class="hint" style="margin:0 auto 14px;max-width:60ch">Tant qu\'elle est vide, l\'outil montre le catalogue intégré ('+CAT.list.length+' fiches dans '+new Set(CAT.list.map(p => p.cc)).size+' pays). Importe-le pour pouvoir le modifier d\'ici.</p>'
        + '<div class="row" style="justify-content:center;gap:8px"><button class="btn btn-a" data-act="pt-import"'+(PT.busy ? ' disabled' : '')+'>'+ic('dl')+(PT.busy ? 'Import en cours…' : 'Importer le catalogue de départ')+'</button>'
        + '<button class="btn btn-ghost" data-act="pt-new">'+ic('plus')+'Partir de zéro</button></div></div>';
    }
    const rows = PT.rows, n = rows.length, cw = rows.filter(r => r.kind === 'cw').length, off = rows.filter(r => r.official).length, hidden = rows.filter(r => !r.active).length;
    return head + '<div class="grid g4" style="margin-bottom:14px">'
      + kpi('hands', 'Fiches', String(n), new Set(rows.map(r => r.country)).size+' pays couverts')
      + kpi('home', 'Coworking', String(cw), (n - cw)+' organismes d\'appui')
      + kpi('check', 'Partenaires officiels', String(off), 'badge doré dans l\'outil', off > 0)
      + kpi('eye', 'Masquées', String(hidden), 'invisibles pour les membres')
      + '</div>' + listTable(rows, false);
  };

  function listTable(all, ro){
    const countries = Array.from(new Set(all.map(r => r.country))).sort((a, b) => cName(a).localeCompare(cName(b), 'fr'));
    const q = TMGeo.norm(PT.q);
    const rows = all.filter(r => (!PT.cc || r.country === PT.cc) && (!PT.kind || r.kind === PT.kind)
      && (!q || TMGeo.norm([r.name, r.city, typeL(r.type), r.tagline].join(' ')).includes(q)));
    const bar = '<div class="bar"><input class="inp q" id="ptAq" placeholder="Nom, ville, type" value="'+esc(PT.q)+'">'
      + '<select class="inp" id="ptAcc"><option value="">Tous les pays</option>'+countries.map(c => '<option value="'+c+'"'+(PT.cc === c ? ' selected' : '')+'>'+esc(cName(c))+' ('+all.filter(r => r.country === c).length+')</option>').join('')+'</select>'
      + '<select class="inp" id="ptAk"><option value="">Toutes catégories</option><option value="cw"'+(PT.kind === 'cw' ? ' selected' : '')+'>Coworking</option><option value="ap"'+(PT.kind === 'ap' ? ' selected' : '')+'>Appui à l\'entrepreneuriat</option></select></div>';
    return bar + table(['Structure', 'Pays · ville', 'Catégorie', 'État', 'Mise à jour', ''], rows.map(r =>
      '<tr><td><b>'+esc(r.name)+'</b><br><span class="hint">'+esc(typeL(r.type))+'</span></td>'
      + '<td>'+esc(cName(r.country))+'<br><span class="hint">'+(r.national ? 'Tout le pays · ' : '')+esc(r.city)+(r.district ? ' · '+esc(r.district) : '')+'</span></td>'
      + '<td>'+(r.kind === 'cw' ? 'Coworking' : 'Appui')+'</td>'
      + '<td>'+(r.active ? '<span class="chip c-ok">Visible</span>' : '<span class="chip">Masquée</span>')+(r.official ? ' <span class="chip c-warn">Officiel</span>' : '')+'</td>'
      + '<td>'+(r.updated_at ? ago(Date.parse(r.updated_at)) : '<span class="hint">catalogue</span>')+'</td>'
      + '<td><div class="row" style="gap:2px;flex-wrap:nowrap;justify-content:flex-end">'+(r.website ? '<a class="iconbtn" href="'+esc(r.website)+'" target="_blank" rel="noopener" aria-label="Site de '+esc(r.name)+'">'+ic('ext')+'</a>' : '')
      + (ro ? '' : '<button class="iconbtn" data-act="pt-edit" data-id="'+esc(r.id)+'" aria-label="Modifier '+esc(r.name)+'">'+ic('edit')+'</button>'
        + '<button class="iconbtn" data-act="pt-toggle" data-id="'+esc(r.id)+'" aria-label="'+(r.active ? 'Masquer' : 'Afficher')+' '+esc(r.name)+'">'+ic(r.active ? 'eye' : 'undo')+'</button>'
        + '<button class="iconbtn" data-act="pt-del" data-id="'+esc(r.id)+'" aria-label="Supprimer '+esc(r.name)+'">'+ic('trash')+'</button>')+'</div></td></tr>'), 'Aucune fiche');
  }

  /* ---------- Formulaire ---------- */
  function form(r){
    const isNew = !r; r = r || {kind:'ap', type:'incub', country:'BJ', city:'', national:false, services:[], stages:['idee','lancement'], active:true, official:false, sort:1000};
    const opt = (v, l, cur) => '<option value="'+esc(v)+'"'+(v === cur ? ' selected' : '')+'>'+esc(l)+'</option>';
    const f = (id, l, ctl, h) => '<div class="field" style="margin-bottom:10px"><label for="'+id+'">'+l+'</label>'+ctl+(h ? '<p class="hint" style="margin:4px 0 0">'+h+'</p>' : '')+'</div>';
    const chk = (id, l, on) => '<label class="row" style="gap:8px;cursor:pointer"><input type="checkbox" id="'+id+'"'+(on ? ' checked' : '')+'><span>'+l+'</span></label>';
    modal('<h2>'+(isNew ? 'Ajouter un partenaire' : 'Modifier « '+esc(r.name)+' »')+'</h2>'
      + '<form id="ptForm" data-id="'+esc(r.id || '')+'" style="max-height:62vh;overflow:auto;padding-right:4px">'
      + f('pfN', 'Nom', '<input class="inp" id="pfN" maxlength="90" value="'+esc(r.name || '')+'">')
      + '<div class="grid g2">'
      +   f('pfT', 'Type', '<select class="inp" id="pfT">'+Object.keys(CAT.types).map(k => opt(k, typeL(k)+' ('+(CAT.types[k].k === 'cw' ? 'coworking' : 'appui')+')', r.type)).join('')+'</select>')
      +   f('pfC', 'Pays', '<select class="inp" id="pfC">'+TMGeo.sorted().map(c => opt(c.id, c.n, r.country)).join('')+'</select>')
      +   f('pfV', 'Ville (siège)', '<input class="inp" id="pfV" list="pfVl" value="'+esc(r.city || '')+'"><datalist id="pfVl">'+TMGeo.cities(r.country).map(v => '<option value="'+esc(v)+'">').join('')+'</datalist>', 'Écris-la comme dans la liste : c\'est elle qui place la fiche « dans ta ville ».')
      +   f('pfQ', 'Quartier (facultatif)', '<input class="inp" id="pfQ" maxlength="60" value="'+esc(r.district || '')+'">')
      + '</div>'
      + '<div style="margin-bottom:10px">'+chk('pfNat', 'Agit dans tout le pays (agence, guichet, fonds…)', r.national)+'</div>'
      + f('pfS', 'Accroche (fiche rapide)', '<input class="inp" id="pfS" maxlength="120" value="'+esc(r.tagline || '')+'">', 'Une ligne, 120 caractères au plus.')
      + f('pfD', 'Présentation (fiche détaillée)', '<textarea class="inp" id="pfD" maxlength="900">'+esc(r.about || '')+'</textarea>')
      + f('pfSv', 'Ce qu\'ils proposent', '<textarea class="inp" id="pfSv" placeholder="Un service par ligne">'+esc((r.services || []).join('\n'))+'</textarea>', 'Un service par ligne. Les deux premiers s\'affichent sur la fiche rapide.')
      + '<div class="field" style="margin-bottom:10px"><label>Stades accompagnés</label><div class="row" style="gap:14px;flex-wrap:wrap">'+STAGES.map(([k, l]) => chk('pfSt_'+k, l, (r.stages || []).includes(k))).join('')+'</div></div>'
      + f('pfA', 'Comment y accéder', '<textarea class="inp" id="pfA" maxlength="300" style="min-height:60px">'+esc(r.access || '')+'</textarea>')
      + f('pfW', 'Site officiel', '<input class="inp mono" id="pfW" type="url" placeholder="https://" value="'+esc(r.website || '')+'">', 'Laisse vide si tu n\'es pas sûr : la fiche proposera une recherche web et la carte.')
      + '<div class="grid g2">'+f('pfO', 'Ordre d\'affichage', '<input class="inp mono" id="pfO" type="number" value="'+esc(r.sort || 0)+'">', 'Plus petit = plus haut.')
      +   '<div style="display:grid;gap:8px;align-content:center">'+chk('pfOff', 'Partenaire officiel TakaMatch', r.official)+chk('pfAct', 'Visible dans l\'outil', r.active !== false)+'</div></div>'
      + '<div id="pfErr"></div></form>'
      + '<div class="acts"><button class="btn btn-ghost" data-act="close-modal">Annuler</button><button class="btn btn-a" data-act="pt-save">'+ic('check')+'Enregistrer</button></div>');
    const m = $('.modal'); if(m) m.style.width = 'min(680px, calc(100vw - 24px))';
  }
  const slug = s => TMGeo.norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  async function save(){
    const fm = $('#ptForm'); if(!fm) return;
    const v = id => ($('#'+id) || {}).value || '', on = id => !!($('#'+id) || {}).checked;
    const type = v('pfT'), cc = v('pfC'), name = v('pfN').trim(), web = v('pfW').trim();
    const err = msg => { $('#pfErr').innerHTML = '<div class="err" style="margin-top:6px">'+esc(msg)+'</div>'; };
    if(name.length < 2) return err('Donne un nom à la structure.');
    if(!v('pfV').trim()) return err('Indique la ville (le siège pour un organisme national).');
    if(!v('pfS').trim()) return err('Écris l\'accroche : c\'est la ligne visible sur la fiche rapide.');
    if(web && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(web)) return err('Le site doit commencer par https://');
    const row = {kind:(CAT.types[type] || {}).k || 'ap', type, name, country:cc, city:v('pfV').trim(), district:v('pfQ').trim() || null, national:on('pfNat'),
      tagline:v('pfS').trim(), about:v('pfD').trim(), services:v('pfSv').split('\n').map(s => s.trim()).filter(Boolean),
      stages:STAGES.map(s => s[0]).filter(k => on('pfSt_'+k)), access:v('pfA').trim() || null, website:web || null,
      official:on('pfOff'), active:on('pfAct'), sort:Math.round(Number(v('pfO')) || 0)};
    const id = fm.dataset.id;
    try{
      if(id) await TMDB.update('partenaires', 'id=eq.'+encodeURIComponent(id), row);
      else await TMDB.insert('partenaires', Object.assign({id:cc.toLowerCase()+'-'+slug(name)+'-'+Date.now().toString(36).slice(-3)}, row));
      closeModal(); toast(id ? 'Fiche enregistrée.' : 'Partenaire ajouté.'); PT.rows = null; load();
    }catch(e){ err(e.message || 'Enregistrement impossible.'); }
  }

  /* ---------- Actions ---------- */
  document.addEventListener('click', async e => {
    const t = e.target.closest && e.target.closest('[data-act]'); if(!t) return;
    const a = t.dataset.act, id = t.dataset.id, r = PT.rows && PT.rows.find(x => x.id === id);
    if(a === 'pt-reload'){ PT.rows = null; PT.err = ''; PT.missing = false; render(); }
    else if(a === 'pt-new') form(null);
    else if(a === 'pt-edit' && r) form(r);
    else if(a === 'pt-save') save();
    else if(a === 'pt-toggle' && r){
      try{ await TMDB.update('partenaires', 'id=eq.'+encodeURIComponent(id), {active:!r.active}); r.active = !r.active; toast(r.active ? 'Fiche de nouveau visible.' : 'Fiche masquée pour les membres.'); render(); }
      catch(err){ toast(err.message, 'bad'); }
    }
    else if(a === 'pt-del' && r){
      modal('<h2>Supprimer « '+esc(r.name)+' » ?</h2><p>La fiche disparaît de l\'outil pour tous les membres. Pour la retirer seulement un temps, masque-la plutôt.</p>'
        + '<div class="acts"><button class="btn btn-ghost" data-act="close-modal">Annuler</button><button class="btn btn-bad" data-act="pt-del-go" data-id="'+esc(id)+'">'+ic('trash')+'Supprimer</button></div>');
    }
    else if(a === 'pt-del-go'){
      try{ await TMDB.remove('partenaires', 'id=eq.'+encodeURIComponent(id)); closeModal(); toast('Fiche supprimée.'); PT.rows = PT.rows.filter(x => x.id !== id); render(); }
      catch(err){ toast(err.message, 'bad'); }
    }
    else if(a === 'pt-import'){
      if(PT.busy) return; PT.busy = true; render();
      try{
        const all = CAT.list.map((p, i) => Object.assign(toRow(p), {sort:(i + 1) * 10}));
        for(let i = 0; i < all.length; i += 50) await TMDB.insert('partenaires', all.slice(i, i + 50));
        toast(all.length+' fiches importées.'); PT.rows = null;
      }catch(err){ toast(err.message, 'bad'); }
      PT.busy = false; load();
    }
  });
  document.addEventListener('input', e => {
    if(e.target.id === 'ptAq'){ PT.q = e.target.value; const p = e.target.selectionStart; render(); const q = $('#ptAq'); if(q){ q.focus(); try{ q.setSelectionRange(p, p); }catch(x){} } }
  });
  document.addEventListener('change', e => {
    if(e.target.id === 'ptAcc'){ PT.cc = e.target.value; render(); }
    else if(e.target.id === 'ptAk'){ PT.kind = e.target.value; render(); }
    else if(e.target.id === 'pfC'){ const dl = $('#pfVl'); if(dl) dl.innerHTML = TMGeo.cities(e.target.value).map(v => '<option value="'+esc(v)+'">').join(''); }
  });
  if(A.me) render();
})();
