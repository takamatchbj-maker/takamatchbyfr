/* ============================================================
   TakaMatch — aide au remplissage (inscription et outil)
   ------------------------------------------------------------
   Une petite icône « i » à côté du titre de chaque case.
   Au survol (ou au toucher sur mobile), une bulle explique ce
   qu'il faut écrire, avec un ou deux exemples.
   Les icônes sont ajoutées automatiquement aux titres reconnus
   (.fsec-l et .field > label) : rien à changer dans les pages.
   Pour modifier un texte : la liste HELP ci-dessous.
   ============================================================ */
(function(){
  'use strict';

  /* t : l'explication · ex : un ou deux exemples */
  var HELP = {
    email:{t:'Ton adresse e-mail sert à te connecter : on t\'y envoie un code à 6 chiffres. Elle n\'est jamais affichée sur ta fiche.', ex:['prenom.nom@gmail.com']},
    code:{t:'Le code à 6 chiffres reçu par e-mail. Il expire au bout de quelques minutes. Rien reçu ? Regarde dans tes spams ou demande un nouveau code.', ex:['482 913']},
    first:{t:'Tes prénoms, écrits comme sur ta pièce d\'identité : ils servent à vérifier ton profil. Ils restent cachés jusqu\'au match.', ex:['Kossi Emmanuel', 'Aïcha']},
    last:{t:'Ton nom de famille, comme sur ta pièce d\'identité. Caché jusqu\'au match.', ex:['Adjovi', 'Ndiaye']},
    sex:{t:'Sert seulement à accorder les textes (« invité » ou « invitée »). Visible uniquement après un match. Tu peux choisir de ne pas préciser.', ex:[]},
    handle:{t:'Ton identifiant public, affiché à la place de ton nom avant le match. De 3 à 20 caractères : lettres minuscules, chiffres et tiret bas. Évite ton vrai nom.', ex:['savane_builder', 'data_lagune24']},
    country:{t:'Le pays où tu vis. Il décide de la liste des villes, de l\'indicatif téléphonique et de la monnaie des prix.', ex:['Bénin', 'Côte d\'Ivoire']},
    city:{t:'La ville où tu vis ou travailles. Elle compte dans le score de proximité avec les autres membres.', ex:['Cotonou, Bénin', 'Abidjan, Côte d\'Ivoire']},
    phone:{t:'Ton numéro mobile, sans l\'indicatif (il se choisit à gauche). Il n\'est jamais affiché sur ta fiche.', ex:['01 97 12 34 56 (Bénin)', '07 08 12 34 56 (Côte d\'Ivoire)']},
    skills:{t:'Ce que tu sais vraiment faire aujourd\'hui, pas ce que tu aimerais apprendre. 2 à 4 au maximum : c\'est ce qui te fait apparaître chez les porteurs de projet.', ex:['Un développeur mobile : « Dev mobile » + « Dev back-end »', 'Une commerciale : « Vente & Partenariats » + « Growth & Acquisition »']},
    level:{t:'Débutant : moins de 2 ans de pratique. Intermédiaire : 2 à 5 ans, avec des projets livrés. Expert : plus de 5 ans, tu sais guider les autres.', ex:['3 ans de développement en agence → Intermédiaire']},
    diploma:{t:'Ton plus haut diplôme déjà obtenu (pas celui en cours). Il compte peu dans le score.', ex:['Licence en informatique → Licence', 'Aucune formation diplômante → Autodidacte']},
    status:{t:'Ta situation professionnelle aujourd\'hui.', ex:['Salarié dans une banque → En entreprise', 'Tu enchaînes les missions → Freelance']},
    sectors:{t:'Les domaines dans lesquels tu as envie de t\'engager. 1 à 3 secteurs.', ex:['FinTech + Impact social', 'AgriTech seulement']},
    pace:{t:'Le temps que tu peux réellement donner chaque semaine, en plus de tes autres obligations. Sois honnête : c\'est la première cause d\'échec entre cofondateurs.', ex:['Salarié à temps plein → Projet à côté', 'Disponible et prêt à te lancer → Temps plein']},
    bio:{t:'Deux ou trois phrases : ce que tu as déjà fait (avec un chiffre), ce que tu sais faire, et le type de projet que tu cherches.', ex:['« J\'ai construit 3 apps Flutter pour des PME de Cotonou, dont une utilisée par 5 000 personnes. Je cherche un projet santé où le mobile est central. »']},
    portfolio:{t:'Un lien qui montre ton travail : GitHub, Behance, LinkedIn, site personnel… Visible seulement après un match. Pas encore de portfolio ? Coche la case.', ex:['Titre « GitHub », adresse « github.com/tonpseudo »', 'Titre « LinkedIn », adresse « linkedin.com/in/tonnom »']},
    ptitle:{t:'Le nom de ton projet : court, facile à retenir et à prononcer.', ex:['Tchèko Pay', 'Kèkè Santé']},
    psectors:{t:'Les 1 à 3 domaines dans lesquels se situe ton projet.', ex:['Une app de paiement pour commerçants → FinTech + E-commerce']},
    cover:{t:'Une photo qui montre ton projet en situation, plutôt en format paysage. Sans image, l\'icône de ton secteur s\'affiche.', ex:['La photo de ton prototype', 'Ton équipe sur le terrain']},
    seeking:{t:'Les profils qui te manquent vraiment pour avancer, pas tous ceux qui seraient utiles. Ils pèsent 54 points sur 100 dans le score.', ex:['Tu es commercial sans technique → « Dev back-end » + « Dev mobile »']},
    ppace:{t:'Le temps minimum que ton futur cofondateur doit pouvoir donner chaque semaine.', ex:['Lancement prévu dans 3 mois → Engagement sérieux', 'Levée de fonds en cours → Temps plein']},
    offer:{t:'Ce que gagne le talent qui te rejoint. C\'est affiché sur ta fiche et les talents peuvent filtrer dessus.', ex:['Pas encore de revenus → Parts uniquement', 'Une subvention obtenue → Parts + petite rémunération']},
    hook:{t:'Le problème que ton projet résout, en une ou deux phrases, avec un chiffre. C\'est ce qui doit accrocher en trois secondes.', ex:['« 70 % des commerces de Dantokpa refusent le mobile money car l\'USSD prend 45 secondes. Tchèko Pay encaisse en 6 secondes avec un QR. »']},
    vision:{t:'Ce que devient ton projet dans cinq ans si tout se passe bien. C\'est ce qui donne envie de s\'engager avec toi.', ex:['« Devenir la caisse par défaut du commerce informel ouest-africain. »']},
    traction:{t:'Les preuves que ton projet avance : utilisateurs, ventes, partenariats, tests. Facultatif, mais c\'est la section qui convainc le plus.', ex:['« 210 marchands actifs, 18 M FCFA traités en novembre. »', '« Prototype testé par 40 élèves à Parakou. »']},
    assets:{t:'Ce que tu as déjà sécurisé : financement, agrément, matériel, local, partenaires. Ça rassure le talent sur ce qu\'il n\'aura pas à construire.', ex:['« 6 M FCFA de subvention, un local prêté par la mairie d\'Abomey. »']},
    challenges:{t:'Ce qui te bloque aujourd\'hui, et pourquoi tu cherches un cofondateur. Le talent y voit où il peut t\'aider.', ex:['« Je suis médecin, pas développeur : le prototype atteint ses limites. »']},
    link:{t:'Une page où l\'on peut voir ton projet : site, page Facebook, vidéo de démonstration… Pas encore de page ? Coche la case.', ex:['tchekopay.com', 'facebook.com/kanvo.abomey']},
    /* Fiche perso du porteur : elle présente la personne derrière le projet, pas un candidat. */
    perso_skills:{t:'Ce que toi, porteur, apportes à ton projet. Les talents y voient ce que tu fais déjà, et donc ce qu\'ils viendraient compléter. 2 à 4 au maximum.', ex:['Un porteur commercial : « Vente & Partenariats » + « Finance & Levée »', 'Une porteuse agronome : « Opérations terrain »']},
    perso_level:{t:'Ton niveau dans les compétences que tu apportes au projet. Débutant : moins de 2 ans. Intermédiaire : 2 à 5 ans. Expert : plus de 5 ans.', ex:['10 ans de vente en entreprise → Expert']},
    perso_bio:{t:'Qui tu es derrière le projet : ton parcours, pourquoi ce problème te tient à cœur, ce que tu as déjà fait. Un talent rejoint une personne autant qu\'une idée.', ex:['« Infirmière pendant 10 ans à Parakou, j\'ai vu des dossiers de patients se perdre chaque semaine. J\'ai lancé Kèkè Santé pour que ça n\'arrive plus. »']},
    perso_portfolio:{t:'Un lien qui montre ton parcours : LinkedIn, article de presse, site de ton activité… Visible seulement après un match. Pas de lien ? Coche la case.', ex:['Titre « LinkedIn », adresse « linkedin.com/in/tonnom »']},
    invite:{t:'Dis en deux phrases pourquoi cette personne, et ce que tu apportes. Un message précis obtient trois fois plus de réponses qu\'un message type.', ex:['« Ta section Défis me parle : j\'ai déjà monté une API de paiement pour 200 marchands. »']},
    support:{t:'Décris ce qui se passe, ce que tu as essayé, et sur quel appareil. Pour un paiement, ajoute la référence.', ex:['« Mes crédits n\'apparaissent pas. Paiement Moov, référence MP26107788. »']}
  };

  /* Titre affiché → clé de l'aide. L'identifiant du champ (for) passe en premier. */
  var BY_FOR = {ident:'email', otp0:'code', first:'first', last:'last', e1:'first', e2:'last', handle:'handle', cityCc:'country',
    city:'city', e3:'city', phone:'phone', tel:'phone', e4:'phone', invMsg:'invite', supportMsg:'support'};
  var RULES = [
    [/adresse e-?mail/, 'email'], [/^code recu/, 'code'], [/^prenom/, 'first'], [/^nom( de famille)?$/, 'last'],
    [/^sexe/, 'sex'], [/pseudo/, 'handle'], [/^pays$/, 'country'], [/^ville/, 'city'], [/telephone/, 'phone'],
    [/competences cles|^tes competences/, 'skills'], [/niveau d.experience/, 'level'], [/diplome/, 'diploma'],
    [/statut professionnel/, 'status'], [/secteurs qui t.attirent/, 'sectors'], [/combien de temps/, 'pace'],
    [/signature/, 'bio'], [/portfolio/, 'portfolio'], [/titre du projet/, 'ptitle'], [/secteurs du projet/, 'psectors'],
    [/couverture/, 'cover'], [/competences que tu recherches/, 'seeking'], [/quel rythme/, 'ppace'],
    [/ce que tu proposes/, 'offer'], [/\bhook\b/, 'hook'], [/\bvision\b/, 'vision'], [/traction/, 'traction'],
    [/ressources/, 'assets'], [/\bdefis\b/, 'challenges'], [/lien externe/, 'link']
  ];
  function norm(s){
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\*/g, '')
      .replace(/\s+/g, ' ').trim().toLowerCase();
  }
  function keyFor(el){
    var f = el.getAttribute && el.getAttribute('for');
    if(f && BY_FOR[f]) return BY_FOR[f];
    var txt = norm(el.childNodes.length ? Array.prototype.map.call(el.childNodes, function(n){ return n.nodeType === 3 ? n.textContent : ''; }).join(' ') : el.textContent);
    if(!txt) txt = norm(el.textContent);
    for(var i = 0; i < RULES.length; i++) if(RULES[i][0].test(txt)){
      var k = RULES[i][1];
      /* Dans la fiche perso, l'aide parle du porteur, pas d'un candidat. */
      if(el.closest && el.closest('.perso-form, [data-help-ctx="perso"]') && HELP['perso_' + k]) return 'perso_' + k;
      return k;
    }
    return null;
  }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  var ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.3"/>'
    + '<path d="M8 7.2v4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="5" r=".85" fill="currentColor"/></svg>';

  /* ---------- Ajout des icônes ---------- */
  function decorate(root){
    var els = (root || document).querySelectorAll('.fsec-l, .field > label');
    for(var i = 0; i < els.length; i++){
      var el = els[i];
      if(el.querySelector('.tm-info') || el.hasAttribute('data-no-help')) continue;
      var k = keyFor(el); if(!k || !HELP[k]) continue;
      var b = document.createElement('span');
      b.className = 'tm-info'; b.tabIndex = 0; b.setAttribute('role', 'button');
      b.setAttribute('data-help', k); b.setAttribute('aria-label', 'Aide : ' + HELP[k].t);
      b.innerHTML = ICON;
      el.appendChild(b);
    }
  }
  var queued = false;
  function soon(){ if(queued) return; queued = true; requestAnimationFrame(function(){ queued = false; decorate(); }); }

  /* ---------- La bulle ---------- */
  var tip = null, cur = null, hideT = null;
  function bubble(){
    if(tip) return tip;
    tip = document.createElement('div'); tip.className = 'tm-tip'; tip.setAttribute('role', 'tooltip'); tip.hidden = true;
    document.body.appendChild(tip);
    tip.addEventListener('mouseenter', function(){ clearTimeout(hideT); });
    tip.addEventListener('mouseleave', function(){ hide(); });
    return tip;
  }
  function show(icon){
    var h = HELP[icon.getAttribute('data-help')]; if(!h) return;
    clearTimeout(hideT); cur = icon;
    var t = bubble();
    t.innerHTML = '<p>' + esc(h.t) + '</p>' + (h.ex && h.ex.length ? '<div class="tm-tip-ex"><b>' + (h.ex.length > 1 ? 'Exemples' : 'Exemple') + '</b>'
      + h.ex.map(function(e){ return '<span>' + esc(e) + '</span>'; }).join('') + '</div>' : '');
    t.hidden = false; t.style.left = '0px'; t.style.top = '0px';
    var r = icon.getBoundingClientRect(), w = t.offsetWidth, hh = t.offsetHeight, vw = document.documentElement.clientWidth;
    var left = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), vw - w - 12);
    var top = r.top - hh - 10, below = top < 8;
    if(below) top = r.bottom + 10;
    t.classList.toggle('below', below);
    t.style.left = left + 'px'; t.style.top = top + 'px';
    t.style.setProperty('--ax', (r.left + r.width / 2 - left) + 'px');
  }
  function hide(now){
    clearTimeout(hideT);
    hideT = setTimeout(function(){ if(tip) tip.hidden = true; cur = null; }, now ? 0 : 120);
  }
  var finePointer = window.matchMedia && matchMedia('(hover: hover)').matches;
  document.addEventListener('mouseover', function(e){ var i = e.target.closest && e.target.closest('.tm-info'); if(i && finePointer) show(i); });
  document.addEventListener('mouseout', function(e){ var i = e.target.closest && e.target.closest('.tm-info'); if(i && finePointer && !(e.relatedTarget && tip && tip.contains(e.relatedTarget))) hide(); });
  document.addEventListener('focusin', function(e){ if(e.target.classList && e.target.classList.contains('tm-info')) show(e.target); });
  document.addEventListener('focusout', function(e){ if(e.target.classList && e.target.classList.contains('tm-info')) hide(); });
  /* Au toucher : ouvre / ferme, sans donner le focus au champ du libellé. */
  document.addEventListener('click', function(e){
    var i = e.target.closest && e.target.closest('.tm-info');
    if(i){ e.preventDefault(); e.stopPropagation(); if(cur === i && tip && !tip.hidden) hide(true); else show(i); return; }
    if(tip && !tip.hidden && !tip.contains(e.target)) hide(true);
  }, true);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && tip && !tip.hidden) hide(true);
    var i = e.target.classList && e.target.classList.contains('tm-info') ? e.target : null;
    if(i && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); show(i); }
  });
  window.addEventListener('scroll', function(){ if(tip && !tip.hidden) hide(true); }, true);
  window.addEventListener('resize', function(){ if(tip && !tip.hidden) hide(true); });

  /* ---------- Styles ---------- */
  var css = ''
    + '.tm-info{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;margin-left:6px;vertical-align:-3px;'
    + 'border-radius:50%;color:var(--ink-3,#8a857c);cursor:help;opacity:.75;transition:opacity .15s,color .15s;flex:0 0 auto}'
    + '.tm-info svg{width:15px;height:15px;display:block}'
    + '.tm-info:hover,.tm-info:focus-visible{opacity:1;color:var(--ink,#1f1d1a);outline:none}'
    + '.tm-info:focus-visible{box-shadow:0 0 0 2px var(--a-600,#0A65AE)}'
    + '.tm-tip{position:fixed;z-index:400;max-width:min(320px,calc(100vw - 24px));background:#1c1b19;color:#f4f2ee;border-radius:10px;'
    + 'padding:11px 13px;font-size:13px;line-height:1.5;box-shadow:0 10px 30px -8px rgba(0,0,0,.45);pointer-events:auto;font-weight:400;text-align:left}'
    + '.tm-tip[hidden]{display:none}'
    + '.tm-tip p{margin:0}'
    + '.tm-tip-ex{margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.14);display:flex;flex-direction:column;gap:3px}'
    + '.tm-tip-ex b{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:#bdb8ae;font-weight:600}'
    + '.tm-tip-ex span{font-style:italic;color:#e9e5dd}'
    + '.tm-tip::after{content:"";position:absolute;left:var(--ax,50%);bottom:-5px;width:10px;height:10px;background:#1c1b19;transform:translateX(-50%) rotate(45deg)}'
    + '.tm-tip.below::after{bottom:auto;top:-5px}'
    + ':root[data-theme="dark"] .tm-tip,:root[data-theme="dark"] .tm-tip::after{background:#f4f2ee;color:#1c1b19}'
    + ':root[data-theme="dark"] .tm-tip-ex{border-top-color:rgba(0,0,0,.12)}:root[data-theme="dark"] .tm-tip-ex b{color:#6b665e}:root[data-theme="dark"] .tm-tip-ex span{color:#2a2825}';
  function boot(){
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    decorate();
    new MutationObserver(soon).observe(document.body, {childList:true, subtree:true});
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  window.TMHelp = {HELP:HELP, decorate:decorate};
})();
