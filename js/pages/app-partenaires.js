/* ============================================================
   TakaMatch — L'Atelier · onglet « Partenaires »
   ------------------------------------------------------------
   · Deux onglets en tête de l'Atelier : « Notre équipe » (l'Atelier
     tel qu'il était) et « Partenaires ».
   · Partenaires : centres de coworking et organismes d'appui à
     l'entrepreneuriat du PAYS du membre, ceux de SA VILLE en premier.
     Le pays et la ville viennent du compte (Paramètres › Compte).
   · Fiche rapide (carte) → fiche détaillée (fenêtre).
   · Données : table Supabase « partenaires » si elle est installée
     et remplie (supabase/18_partenaires.sql), sinon le catalogue
     de départ js/partenaires-data.js.
   · Ouvert à tous, même sans équipe : un porteur peut chercher un
     lieu ou un incubateur avant son premier match.
   Chargé après app.js et app-pacte.js.
   ============================================================ */
(function(){
  'use strict';
  if(typeof vAtelier !== 'function' || !window.TM_PARTNERS) return;

  const CAT = window.TM_PARTNERS;
  const STAGES = [{id:'idee', l:'Idée'}, {id:'lancement', l:'Lancement'}, {id:'croissance', l:'Croissance'}];
  const CONTACT = 'contact@takamatch.com';
  const PT = {rows:null, loading:false, tried:false};

  Object.assign(P, {
    desk:'<path d="M3 10h18"/><path d="M5 10v10M19 10v10"/><path d="M8 10V6.5A1.5 1.5 0 0 1 9.5 5h5A1.5 1.5 0 0 1 16 6.5V10"/><path d="M9 14h6"/>',
    sprout:'<path d="M12 21v-9"/><path d="M12 12C12 8 9.5 5.5 5 5.5c0 4.5 2.5 6.5 7 6.5z"/><path d="M12 14c0-3.5 2.4-6 6.5-6 0 4-2.4 6-6.5 6z"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    map:'<path d="M9 4.5 3.5 6.5v13L9 17.5l6 2 5.5-2v-13L15 6.5z"/><path d="M9 4.5v13M15 6.5v13"/>',
  });

  /* ---------- Où est le membre ---------- */
  function where(){
    const sp = TMGeo.split(S.me.city || ''), cc = sp.cc || S.me.country || 'BJ';
    return {cc, city:sp.city || '', name:TMGeo.country(cc).n};
  }
  /* « au Bénin », « en Côte d'Ivoire », « aux Comores », « à Maurice »… */
  const EN = ['CI','GN','GQ','CF','DZ','TN','MR','BE','CH','FR','CD'], AUX = ['KM','SC'], A = ['MG','DJ','MU'];
  function inCountry(cc){
    const n = TMGeo.country(cc).n;
    return (EN.includes(cc) ? 'en ' : AUX.includes(cc) ? 'aux ' : A.includes(cc) ? 'à ' : 'au ') + n.replace(/^(Comores|Seychelles)$/, '$1');
  }
  const same = (a, b) => TMGeo.norm(a) === TMGeo.norm(b);

  /* ---------- Données : base si elle répond, sinon catalogue ---------- */
  function fromDb(r){
    return {id:r.id, k:r.kind, t:r.type, n:r.name, cc:r.country, v:r.city || '', q:r.district || '', nat:!!r.national, s:r.tagline || '',
      d:r.about || '', sv:r.services || [], pr:r.stages || [], acc:r.access || '', web:r.website || '', off:!!r.official, sort:r.sort || 0};
  }
  function loadDb(){
    if(PT.tried || PT.loading || !window.TMDB || !TMDB.select) return;
    PT.loading = true;
    TMDB.select('partenaires', 'select=*&active=eq.true&order=sort.asc')
      .then(rows => { if(Array.isArray(rows) && rows.length){ PT.rows = rows.map(fromDb); if(S.view === 'atelier' && S.atView === 'partenaires' && !S.layer) render(); } })
      .catch(() => {})   /* table pas encore installée : on garde le catalogue */
      .finally(() => { PT.loading = false; PT.tried = true; });
  }
  const all = () => PT.rows || CAT.list;
  const byId = id => all().find(p => p.id === id);
  const typeL = p => (CAT.types[p.t] || {}).l || (p.k === 'cw' ? 'Espace de coworking' : 'Appui à l\'entrepreneuriat');

  /* ---------- Onglets de l'Atelier ---------- */
  function atTabs(view){
    const n = all().filter(p => p.cc === where().cc).length;
    const b = (id, l, icon, extra) => '<button class="tab'+(view === id ? ' on' : '')+'" role="tab" aria-selected="'+(view === id)+'" data-act="at-view" data-v="'+id+'">'+ic(icon)+esc(l)+(extra || '')+'</button>';
    return '<div class="tabs at-tabs" role="tablist" aria-label="Sections de l\'Atelier">'
      + b('equipe', 'Notre équipe', 'users')
      + b('partenaires', 'Partenaires', 'hands', n ? '<span class="chip mono" style="height:20px;font-size:11.5px">'+n+'</span>' : '')
      + '</div>';
  }
  const baseAtelier = vAtelier;
  vAtelier = function(){
    const html = baseAtelier();
    /* Pas encore d'équipe : pas d'onglets, les partenaires s'affichent sous l'encart « L'Atelier s'ouvre à ton premier match ». */
    if(!curTeam()){ loadDb(); return html + '<div class="pt-below">' + partnersView() + '</div>'; }
    const view = S.atView === 'partenaires' ? 'partenaires' : 'equipe';
    let cut = html.indexOf('<div class="team-strip">');
    if(cut < 0) cut = html.indexOf('<div class="card">');
    if(cut < 0) cut = html.length;
    const head = html.slice(0, cut);
    if(view === 'equipe') return head + atTabs(view) + html.slice(cut);
    loadDb();
    return head + atTabs(view) + partnersView();
  };

  /* ---------- La page Partenaires ---------- */
  function filtered(list){
    const q = TMGeo.norm(S.ptQ || ''), cat = S.ptCat || 'all', city = S.ptCity || 'all';
    return list.filter(p => (cat === 'all' || p.k === cat)
      && (city === 'all' || same(p.v, city) || (city !== 'all' && p.nat && S.ptNat !== false))
      && (!q || TMGeo.norm([p.n, typeL(p), p.v, p.q, p.s, (p.sv || []).join(' ')].join(' ')).includes(q)));
  }
  function partnersView(){
    const w = where(), mine = all().filter(p => p.cc === w.cc);
    if(!mine.length){
      return '<div class="pt-intro">'+introText(w, 0)+'</div><div class="card">'
        + emptyBox('🧭', 'Aucun partenaire référencé '+inCountry(w.cc)+' pour l\'instant',
            'Nous ajoutons les pays au fur et à mesure. Tu connais un coworking ou un incubateur sérieux près de chez toi ? Dis-le-nous.',
            '<a class="btn btn-ghost btn-sm" style="margin-top:8px" href="'+proposeHref(w)+'">'+ic('plus')+'Proposer une structure</a>')+'</div>';
    }
    const cities = Array.from(new Set(mine.map(p => p.v).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'fr'));
    if(S.ptCity && S.ptCity !== 'all' && !cities.some(c => same(c, S.ptCity))) S.ptCity = 'all';
    const cnt = k => mine.filter(p => k === 'all' || p.k === k).length, cat = S.ptCat || 'all';
    const seg = '<div class="seg-sm" role="group" aria-label="Type de partenaire">'
      + [['all','Tout'],['cw','Coworking'],['ap','Appui']].map(([k, l]) => '<button class="'+(cat === k ? 'on' : '')+'" data-act="pt-cat" data-v="'+k+'" aria-pressed="'+(cat === k)+'">'+l+'<span class="n">'+cnt(k)+'</span></button>').join('')+'</div>';
    const tools = '<div class="pt-tools">'+seg
      + '<label class="pt-search"><span class="sr">Rechercher un partenaire</span>'+ic('search')+'<input class="inp" id="ptQ" type="search" placeholder="Nom, service, ville…" autocomplete="off" value="'+esc(S.ptQ || '')+'"></label>'
      + '<label class="pt-city"><span class="sr">Ville</span>'+ic('pin')+'<select class="inp" id="ptCity">'
      +   '<option value="all">Tout le pays</option>'+cities.map(c => '<option value="'+esc(c)+'"'+(S.ptCity && same(S.ptCity, c) ? ' selected' : '')+'>'+esc(c)+(w.city && same(c, w.city) ? ' · ta ville' : '')+'</option>').join('')+'</select></label></div>';
    return '<div class="pt-intro">'+introText(w, mine.length)+'</div>' + tools + '<div id="ptBody">'+partnersBody()+'</div>'
      + '<div class="pt-foot">'+ic('info')+'<span>Informations indicatives, à confirmer auprès de chaque structure. Une adresse manque ou a changé ? '
      + '<a href="'+proposeHref(w)+'">Propose une structure</a> ou signale-le depuis sa fiche.</span></div>';
  }
  function introText(w, n){
    return '<div class="pt-in-t"><h2>Partenaires <span class="pt-cc">'+TMGeo.flagImg(w.cc)+esc(inCountry(w.cc))+'</span></h2>'
      + '<p>Des lieux pour travailler ensemble et des structures qui accompagnent les équipes qui se lancent. '
      + (w.city ? 'Ceux de <b>'+esc(w.city)+'</b> d\'abord.' : 'Renseigne ta ville dans Paramètres pour voir d\'abord ceux de chez toi.')+'</p></div>'
      + (n ? '<div class="pt-in-n"><span class="mono">'+n+'</span><span>structure'+(n > 1 ? 's' : '')+' référencée'+(n > 1 ? 's' : '')+'</span></div>' : '');
  }
  function partnersBody(){
    const w = where(), mine = all().filter(p => p.cc === w.cc), list = filtered(mine), cat = S.ptCat || 'all';
    if(!list.length){
      return '<div class="card">'+emptyBox('🔎', 'Aucun partenaire ne correspond', 'Élargis la recherche ou choisis « Tout le pays ».',
        '<button class="btn btn-ghost btn-sm" style="margin-top:8px" data-act="pt-reset">'+ic('refresh')+'Tout afficher</button>')+'</div>';
    }
    const sec = (k, icon, title, sub) => {
      const xs = list.filter(p => p.k === k); if(!xs.length) return '';
      return '<section class="pt-sec"><div class="pt-sec-h"><span class="pt-sec-i" aria-hidden="true">'+ic(icon)+'</span>'
        + '<div><h3>'+title+'</h3><p class="hint">'+sub+'</p></div><span class="chip mono">'+xs.length+'</span></div>'
        + groups(xs, w, k) + '</section>';
    };
    return (cat !== 'ap' ? sec('cw', 'desk', 'Centres de coworking', 'Pour travailler ensemble à l\'heure, à la journée ou au mois, recevoir un client ou tenir vos séances d\'équipe.') : '')
      + (cat !== 'cw' ? sec('ap', 'sprout', 'Organismes d\'appui à l\'entrepreneuriat', 'Incubateurs, accélérateurs, agences publiques, guichets de création et financements qui accompagnent les équipes.') : '');
  }
  /* Dans chaque catégorie : ta ville, puis partout dans le pays (organismes nationaux), puis les autres villes. */
  function groups(xs, w, k){
    const sorted = xs.slice().sort((a, b) => (b.off ? 1 : 0) - (a.off ? 1 : 0) || (a.sort || 0) - (b.sort || 0));
    const here = w.city ? sorted.filter(p => same(p.v, w.city) && !(k === 'ap' && p.nat)) : [];
    const nat = k === 'ap' ? sorted.filter(p => p.nat) : [];
    const rest = sorted.filter(p => !here.includes(p) && !nat.includes(p));
    const g = (label, icon, arr) => arr.length ? '<div class="pt-grp"><div class="pt-grp-l">'+ic(icon)+esc(label)+'<span class="mono">'+arr.length+'</span></div><div class="pt-deck">'+arr.map(card).join('')+'</div></div>' : '';
    const pays = inCountry(w.cc);
    const noneHere = w.city && !here.length && (!S.ptCity || S.ptCity === 'all')
      ? '<p class="hint pt-none">'+ic('info')+' Rien à '+esc(w.city)+' dans cette catégorie pour l\'instant : voici le reste du pays.</p>' : '';
    return noneHere + g('À '+w.city, 'pin', here) + g('Partout '+pays, 'globe', nat) + g(here.length || nat.length ? 'Ailleurs '+pays : 'Dans le pays', 'map', rest);
  }

  /* ---------- Fiche rapide ---------- */
  const mono = p => String(p.n).replace(/[^A-Za-zÀ-ÿ0-9 ]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '·';
  const placeL = p => p.nat ? 'Tout le pays · siège à '+p.v : p.v + (p.q ? ' · '+p.q : '');
  function card(p){
    const st = STAGES.filter(s => (p.pr || []).includes(s.id)).map(s => s.l).join(' · ');
    return '<article class="pt-card'+(p.off ? ' off' : '')+'" data-act="pt-open" data-id="'+esc(p.id)+'" tabindex="0" role="button" aria-label="Voir la fiche de '+esc(p.n)+'">'
      + '<div class="pt-c-h"><span class="pt-mono '+p.k+'" aria-hidden="true">'+esc(mono(p))+'</span>'
      +   '<div class="pt-c-id"><h4>'+esc(p.n)+'</h4><span class="pt-type">'+esc(typeL(p))+'</span></div>'
      +   (p.off ? '<span class="chip pt-off" title="Partenaire officiel TakaMatch">'+ic('award')+'Partenaire</span>' : '')+'</div>'
      + '<p class="pt-place">'+ic(p.nat ? 'globe' : 'pin')+'<span>'+esc(placeL(p))+'</span></p>'
      + '<p class="pt-s">'+esc(p.s)+'</p>'
      + '<div class="pt-sv">'+(p.sv || []).slice(0, 2).map(s => '<span class="chip">'+esc(s)+'</span>').join('')+((p.sv || []).length > 2 ? '<span class="chip mono">+'+(p.sv.length - 2)+'</span>' : '')+'</div>'
      + '<div class="pt-c-f"><span class="hint">'+(st ? ic('trend')+esc(st) : '')+'</span><span class="pt-more">Voir la fiche'+ic('chev')+'</span></div>'
      + '</article>';
  }

  /* ---------- Fiche détaillée ---------- */
  function mapsHref(p){ return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent([p.n, p.q, p.v, TMGeo.country(p.cc).n].filter(Boolean).join(' ')); }
  function webSearchHref(p){ return 'https://www.google.com/search?q='+encodeURIComponent(p.n+' '+p.v+' '+TMGeo.country(p.cc).n); }
  function reportHref(p){
    return 'mailto:'+CONTACT+'?subject='+encodeURIComponent('Partenaire à corriger : '+p.n+' ('+p.id+')')
      + '&body='+encodeURIComponent('Bonjour,\n\nSur la fiche « '+p.n+' » ('+p.v+', '+TMGeo.country(p.cc).n+'), voici ce qui est inexact ou a changé :\n\n');
  }
  function proposeHref(w){
    return 'mailto:'+CONTACT+'?subject='+encodeURIComponent('Proposer un partenaire ('+w.name+')')
      + '&body='+encodeURIComponent('Bonjour,\n\nJe vous propose cette structure pour l\'onglet Partenaires de l\'Atelier :\n\nNom :\nVille :\nType (coworking, incubateur, agence…) :\nSite web :\nPourquoi elle est utile aux équipes :\n\n');
  }
  function detail(p){
    const host = p.web ? p.web.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : '';
    const main = '<div class="pt-d-main">'
      + '<section><h3 class="pt-d-t">En bref</h3><p class="pt-d-p">'+esc(p.d || p.s)+'</p></section>'
      + ((p.sv || []).length ? '<section><h3 class="pt-d-t">Ce qu\'ils proposent</h3><ul class="pt-d-sv">'+p.sv.map(s => '<li>'+ic('check')+'<span>'+esc(s)+'</span></li>').join('')+'</ul></section>' : '')
      + '<section><h3 class="pt-d-t">Pour quel stade</h3><div class="pt-stages">'+STAGES.map(s => { const on = (p.pr || []).includes(s.id);
          return '<span class="pt-st'+(on ? ' on' : '')+'">'+(on ? ic('check') : '')+esc(s.l)+'<span class="sr">'+(on ? ' : oui' : ' : non')+'</span></span>'; }).join('')+'</div></section>'
      + (p.acc ? '<section><h3 class="pt-d-t">Comment y accéder</h3>'+note('', 'arrow', esc(p.acc))+'</section>' : '')
      + '</div>';
    const rail = '<aside class="pt-d-rail">'
      + '<div class="card pt-team"><div class="pt-team-h">'+ic('toolbox')+'<b>Pour ton équipe</b></div><p>'+esc((CAT.utile || {})[p.t] || '')+'</p></div>'
      + '<div class="card pt-info"><dl>'
      +   '<div><dt>Type</dt><dd>'+esc(typeL(p))+'</dd></div>'
      +   '<div><dt>'+(p.nat ? 'Couverture' : 'Ville')+'</dt><dd>'+esc(p.nat ? 'Tout le pays' : p.v)+'</dd></div>'
      +   (p.nat ? '<div><dt>Siège</dt><dd>'+esc(p.v)+'</dd></div>' : '')
      +   (p.q ? '<div><dt>Quartier</dt><dd>'+esc(p.q)+'</dd></div>' : '')
      +   '<div><dt>Pays</dt><dd>'+TMGeo.flagImg(p.cc)+esc(TMGeo.country(p.cc).n)+'</dd></div>'
      +   (host ? '<div><dt>Site</dt><dd class="mono">'+esc(host)+'</dd></div>' : '')
      + '</dl><div class="pt-acts">'
      +   (p.web ? '<a class="btn btn-a btn-block" href="'+esc(p.web)+'" target="_blank" rel="noopener">'+ic('ext')+'Site officiel</a>'
                 : '<a class="btn btn-a btn-block" href="'+webSearchHref(p)+'" target="_blank" rel="noopener">'+ic('search')+'Chercher sur le web</a>')
      +   '<a class="btn btn-ghost btn-block" href="'+mapsHref(p)+'" target="_blank" rel="noopener">'+ic('map')+'Voir sur la carte</a>'
      + '</div></div>'
      + '<p class="hint pt-report">'+ic('flag')+'<span>Une information est fausse ? <a href="'+reportHref(p)+'">Signale-la</a> : l\'équipe TakaMatch corrige la fiche.</span></p>'
      + '</aside>';
    return '<div class="fw-h"><span class="lbl">'+(p.k === 'cw' ? 'Centre de coworking' : 'Organisme d\'appui')+'</span><span style="flex:1"></span>'
      + '<button class="iconbtn iconbtn-lg" data-act="close" aria-label="Fermer">'+ic('x')+'</button></div>'
      + '<div class="fw-b"><header class="pt-d-h"><span class="pt-mono lg '+p.k+'" aria-hidden="true">'+esc(mono(p))+'</span>'
      +   '<div><h2 class="pt-d-n" id="ptT">'+esc(p.n)+'</h2>'
      +   '<div class="pt-d-tags"><span class="chip">'+esc(typeL(p))+'</span>'+(p.off ? '<span class="chip pt-off">'+ic('award')+'Partenaire officiel TakaMatch</span>' : '')+'</div>'
      +   '<p class="pt-place">'+ic(p.nat ? 'globe' : 'pin')+'<span>'+esc(placeL(p))+', '+esc(TMGeo.country(p.cc).n)+'</span></p>'
      +   '<p class="pt-d-s">'+esc(p.s)+'</p></div></header>'
      + '<div class="pt-d-grid">'+main+rail+'</div></div>';
  }
  function openPartner(id){
    const p = byId(id); if(!p) return;
    openLayer('<div class="ov" role="dialog" aria-modal="true" aria-labelledby="ptT"><div class="ov-bg" data-act="close"></div>'
      + '<div class="ov-win pt-win" id="ptWin">'+detail(p)+'</div></div>', 'partner');
    const cl = $('#ptWin .fw-h [data-act="close"]'); if(cl) try{ cl.focus({preventScroll:true}); }catch(e){}
  }

  /* ---------- Actions ---------- */
  function repaintBody(){ const b = $('#ptBody'); if(b) TMMorph(b, partnersBody()); }
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if(!el) return;
    switch(el.dataset.act){
      case 'at-view': S.atView = el.dataset.v; if(S.view !== 'atelier') go('atelier'); else render(); break;
      case 'pt-cat': S.ptCat = el.dataset.v; el.parentElement.querySelectorAll('button').forEach(b => { const on = b === el; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); }); repaintBody(); break;
      case 'pt-open': openPartner(el.dataset.id); break;
      case 'pt-reset': S.ptQ = ''; S.ptCat = 'all'; S.ptCity = 'all'; render(); break;
    }
  });
  document.addEventListener('keydown', e => {
    if((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('pt-card')){ e.preventDefault(); openPartner(e.target.dataset.id); }
  });
  document.addEventListener('input', e => { if(e.target.id === 'ptQ'){ S.ptQ = e.target.value; repaintBody(); } });
  document.addEventListener('change', e => { if(e.target.id === 'ptCity'){ S.ptCity = e.target.value; repaintBody(); } });

  /* Pour l'admin et les tests. */
  window.TMPartners = {all, byId, where, open:openPartner};
  if(S.view === 'atelier') render();
})();
