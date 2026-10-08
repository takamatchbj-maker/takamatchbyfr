/* ============================================================
   TakaMatch — règles de complétion des fiches (partagé)
   ------------------------------------------------------------
   Un seul calcul pour l'inscription ET l'outil :
   · fiche Talent, fiche projet (Visionnaire), fiche perso.
   · Toutes les sections comptent et sont obligatoires : 100 % = tout
     est rempli correctement.
   · Un texte ne compte qu'à partir de son minimum de caractères
     (affiché sous la case). Un lien compte s'il ressemble à une
     adresse web, ou si « Pas encore de lien » est coché.
   Pour changer un minimum ou un poids : uniquement ici.
   ============================================================ */
(function(){
  'use strict';
  var MIN = {bio:60, hook:30, vision:60, traction:40, challenges:40, persoBio:60};

  function len(v){ return String(v || '').trim().length; }
  function linkOk(v){ return /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i.test(String(v || '').trim()); }
  function plural(n, w){ return n + ' ' + w + (n > 1 ? 's' : ''); }
  function textMsg(v, min){ var n = min - len(v); return n > 0 ? 'Encore ' + plural(n, 'caractère') + ' (minimum ' + min + ').' : ''; }
  function linkMsg(v, none, what){
    if(none) return '';
    if(!len(v)) return 'Ajoute ' + what + ', ou coche « Pas encore ».';
    return linkOk(v) ? '' : 'Cette adresse ne ressemble pas à un lien (exemple : monsite.com).';
  }

  /* d : données normalisées de la personne
     {first, last, handle, city, skills, level, diploma, status, sectors, pace, bio, portfolio, noPortfolio,
      project:{title, sectors, seeking, pace, offer, hook, vision, traction, challenges, link, noLink}}
     Chaque ligne : id, label (titre), phrase (« ce qui manque »), w (poids), ok, msg (texte rouge), key (champ). */
  function rows(kind, d){
    d = d || {}; var p = d.project || {}, R = [];
    /* opt : section facultative — elle compte dans le pourcentage mais ne bloque pas la publication. */
    function add(id, label, phrase, w, ok, msg, key, opt, started){ R.push({id:id, label:label, phrase:phrase, w:w, ok:!!ok, msg:ok ? '' : msg, key:key || '', opt:!!opt, started:!!started}); }
    var sk = d.skills || [], se = d.sectors || [];
    if(kind === 'tal'){
      add('name', 'Nom et prénoms', 'ton nom', 6, d.first && d.last, 'Indique ton nom.');
      add('handle', 'Pseudo public', 'ton pseudo', 5, d.handle, 'Choisis ton pseudo.');
      add('city', 'Ville', 'ta ville', 5, d.city, 'Indique ta ville.');
      add('skills', 'Compétences clés', 'au moins 2 compétences clés', 16, sk.length >= 2, sk.length ? 'Choisis-en encore ' + (2 - sk.length) + ' (2 au moins).' : 'Choisis au moins 2 compétences.', 'skills');
      add('level', "Niveau d'expérience", "ton niveau d'expérience", 6, d.level, 'Choisis ton niveau.', 'level');
      add('diploma', 'Diplôme le plus élevé', 'ton diplôme', 6, d.diploma, 'Choisis ton diplôme.', 'diploma');
      add('status', 'Statut professionnel', 'ton statut professionnel', 6, d.status, 'Choisis ton statut.', 'status');
      add('sectors', "Secteurs qui t'attirent", 'au moins un secteur', 10, se.length >= 1, 'Choisis au moins un secteur.', 'sectors');
      add('pace', 'Rythme', 'ton rythme', 10, d.pace, 'Choisis ton rythme.', 'pace');
      add('bio', 'Signature personnelle', 'ta signature (' + MIN.bio + ' caractères min.)', 18, len(d.bio) >= MIN.bio, textMsg(d.bio, MIN.bio), 'bio');
      add('portfolio', 'Lien portfolio', 'ton lien portfolio', 12, d.noPortfolio || linkOk(d.portfolio), linkMsg(d.portfolio, d.noPortfolio, 'ton lien'), 'portfolio');
    } else if(kind === 'perso'){
      add('skills', 'Compétences clés', 'au moins 2 compétences clés', 30, sk.length >= 2, sk.length ? 'Choisis-en encore ' + (2 - sk.length) + ' (2 au moins).' : 'Choisis au moins 2 compétences.', 'x.skills');
      add('level', "Niveau d'expérience", "ton niveau d'expérience", 15, d.level, 'Choisis ton niveau.', 'x.level');
      add('bio', 'Signature personnelle', 'ta signature (' + MIN.persoBio + ' caractères min.)', 35, len(d.bio) >= MIN.persoBio, textMsg(d.bio, MIN.persoBio), 'x.bio');
      add('portfolio', 'Lien portfolio', 'ton lien portfolio', 20, d.noPortfolio || linkOk(d.portfolio), linkMsg(d.portfolio, d.noPortfolio, 'ton lien'), 'x.portfolio');
    } else {
      var ps = p.sectors || [], need = p.seeking || [];
      add('name', 'Nom et prénoms', 'ton nom', 4, d.first && d.last, 'Indique ton nom.');
      add('handle', 'Pseudo public', 'ton pseudo', 4, d.handle, 'Choisis ton pseudo.');
      add('title', 'Titre du projet', 'le titre du projet', 8, len(p.title), 'Donne un nom à ton projet.', 'p.title');
      add('psectors', 'Secteurs du projet', '1 à 3 secteurs', 8, ps.length >= 1 && ps.length <= 3, ps.length > 3 ? '3 secteurs au maximum.' : 'Choisis au moins un secteur.', 'p.sectors');
      add('seeking', 'Compétences recherchées', 'une compétence recherchée', 14, need.length >= 1, 'Choisis au moins une compétence.', 'p.seeking');
      add('ppace', 'Rythme attendu', 'le rythme attendu', 6, p.pace, 'Choisis le rythme attendu.', 'pace');
      add('offer', 'Ce que tu proposes', 'ce que tu proposes aux talents', 6, p.offer, 'Choisis ce que tu proposes.', 'p.offer');
      add('hook', 'Le Hook', 'le Hook (' + MIN.hook + ' caractères min.)', 14, len(p.hook) >= MIN.hook, textMsg(p.hook, MIN.hook), 'p.hook');
      add('vision', 'La Vision', 'la Vision (' + MIN.vision + ' caractères min.)', 10, len(p.vision) >= MIN.vision, textMsg(p.vision, MIN.vision), 'p.vision');
      add('traction', 'La Traction', 'la Traction (facultative)', 10, len(p.traction) >= MIN.traction,
        len(p.traction) ? textMsg(p.traction, MIN.traction) + ' La Traction est facultative, mais elle ne compte pour tes 100 % qu\'à partir de ' + MIN.traction + ' caractères.'
                        : 'Facultative, mais elle compte pour atteindre 100 % de remplissage.', 'p.traction', true, len(p.traction) > 0);
      add('challenges', 'Les Défis', 'les Défis (' + MIN.challenges + ' caractères min.)', 8, len(p.challenges) >= MIN.challenges, textMsg(p.challenges, MIN.challenges), 'p.challenges');
      add('link', 'Lien externe', 'le lien externe', 8, p.noLink || linkOk(p.link), linkMsg(p.link, p.noLink, 'le lien de ton projet'), 'p.link');
    }
    return R;
  }
  function pct(R){
    var done = 0, tot = 0;
    for(var i = 0; i < R.length; i++){ tot += R[i].w; if(R[i].ok) done += R[i].w; }
    return tot ? Math.round(done / tot * 100) : 0;
  }

  window.TMRules = {MIN: MIN, rows: rows, pct: pct, linkOk: linkOk, textMsg: textMsg, linkMsg: linkMsg, len: len};
})();
