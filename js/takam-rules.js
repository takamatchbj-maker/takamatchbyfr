/* ============================================================
   Takam — le moteur de veille de l'Atelier
   ------------------------------------------------------------
   Un seul fichier, utilisé à deux endroits :
   · dans l'outil (navigateur) : les alertes s'affichent tout de
     suite, à partir de l'état de l'équipe ouvert à l'écran ;
   · sur le serveur (fonction Supabase « takam ») : chaque matin,
     les mêmes règles tournent pour toutes les équipes, même quand
     personne n'est connecté, et Takam relance les membres.
   Toute règle ajoutée ici vaut donc partout. Après une
   modification, recopier ce fichier dans
   supabase/functions/takam/takam-rules.js puis redéployer.

   Le moteur est « pur » : il ne lit rien d'autre que l'équipe
   qu'on lui donne. Une équipe, c'est :
     { title, members:[{id, first, role:'vis'|'tal', sex}],
       milestones:[{t, done, d}], objectives:[{t, tasks:[{id, t,
       owner, due, status, signaled}]}], props:[{id, t, d, val:{}}],
       roles:{domaine:id}, group:[{from, d}], log:[{t, d}],
       vesting, since, pacte:{status, signatures:{id:…}} | null }
   et « viewer » est l'identifiant du membre qui regarde.
   ============================================================ */
(function(root){
  'use strict';

  var DAY = 864e5;
  /* Les 6 jalons de l'Atelier (mêmes textes que l'outil). */
  var MILESTONES = [
    'Se parler 45 minutes en visio', 'Écrire le problème en une phrase, chacun de son côté', 'Définir qui décide quoi',
    'Fixer la répartition du capital et le vesting', 'Travailler 2 semaines ensemble sur un livrable réel', 'Signer le pacte d\'associés'
  ];
  var DOMAINS = [
    {id:'produit', l:'Produit'}, {id:'tech', l:'Technique'}, {id:'finance', l:'Finances et levée'},
    {id:'terrain', l:'Terrain et ventes'}, {id:'juridique', l:'Juridique et conformité'}
  ];
  /* Seuils, en jours. */
  var T = {stall:7, quietTeam:10, silentMe:5, silentTal:6, noPlan:3, vesting:14, dueSoon:2};

  function ms(v){ if(v == null || v === '') return NaN; if(v instanceof Date) return +v; if(typeof v === 'number') return v; return Date.parse(v); }
  function dAgo(v, now){ var x = ms(v); return isNaN(x) ? 0 : Math.max(0, Math.floor((now - x) / DAY)); }
  function dIn(v, now){ var x = ms(v); return isNaN(x) ? Infinity : Math.ceil((x - now) / DAY); }
  function g(sex, m, f, n){ return sex === 'f' ? f : sex === 'm' ? m : (n == null ? m : n); }
  function pl(n, one, many){ return n > 1 ? many : one; }
  function list(names){ return names.length < 2 ? names.join('') : names.slice(0, -1).join(', ') + ' et ' + names[names.length - 1]; }
  function q(s){ return '« ' + s + ' »'; }

  function helpers(team, now){
    var members = team.members || [];
    var byId = function(id){ return members.filter(function(m){ return m.id === id; })[0] || {first:'—', role:'tal'}; };
    var porteur = members.filter(function(m){ return m.role === 'vis'; })[0] || {first:'le porteur'};
    var talents = members.filter(function(m){ return m.role === 'tal'; });
    var tasks = [];
    (team.objectives || []).forEach(function(o){ (o.tasks || []).forEach(function(k){ tasks.push(k); }); });
    var isLate = function(k){ return k.status !== 'done' && !isNaN(ms(k.due)) && ms(k.due) < now - DAY / 2; };
    var lastMsgOf = function(id){ var x = NaN; (team.group || []).forEach(function(m){ if(m.from === id){ var t = ms(m.d); if(!isNaN(t) && !(t <= x)) x = t; } }); return x; };
    return {byId:byId, porteur:porteur, talents:talents, tasks:tasks, isLate:isLate, lastMsgOf:lastMsgOf};
  }

  /* Dernier signe de vie de l'équipe : message, journal, jalon. */
  function lastActivity(team){
    var x = ms(team.since) || 0;
    (team.group || []).forEach(function(m){ var t = ms(m.d); if(t > x) x = t; });
    (team.log || []).forEach(function(l){ var t = ms(l.d); if(t > x) x = t; });
    (team.milestones || []).forEach(function(m){ var t = ms(m.d); if(t > x) x = t; });
    return x;
  }

  /* ============================================================
     Les alertes : {team:[…], me:[…]}
     Chaque alerte : {key, lvl:'warn'|'info'|'ok', t, act?, id?, tab?}
     · key : identifiant stable (sert au serveur pour ne pas
       relancer deux fois la même chose) ;
     · act : bouton proposé (at-val, at-confirm, at-nudge, at-tab,
       at-pacte, at-plan).
     ============================================================ */
  function compute(team, viewer, now){
    now = now || Date.now();
    var H = helpers(team, now), Tm = [], M = [];
    var me = H.byId(viewer), adm = me.role === 'vis';
    var mss = team.milestones || [];
    var done = mss.filter(function(m){ return m.done; }).length;
    var next = -1; for(var i = 0; i < mss.length; i++){ if(!mss[i].done){ next = i; break; } }
    var age = dAgo(team.since, now);
    var objectives = team.objectives || [];
    var open = H.tasks.filter(function(k){ return k.status !== 'done'; });

    /* ---------- Pour toute l'équipe ---------- */
    if(next >= 0){
      var last = NaN;
      mss.forEach(function(m){ if(m.done){ var t = ms(m.d); if(!isNaN(t) && !(t <= last)) last = t; } });
      var n = dAgo(isNaN(last) ? team.since : last, now);
      if(n >= T.stall) Tm.push({key:'ms-stall-' + next, lvl:'warn', t:'Le jalon ' + String(next + 1).padStart(2, '0') + ' ' + q(mss[next].t) + ' attend depuis ' + n + ' jours. '
        + (adm ? 'Tu as la main : fixe une date à l\'équipe.' : 'Demandez une date à ' + H.porteur.first + '.')});
    }
    if(done >= 4) Tm.push({key:'cheer-4', lvl:'ok', t:'Bravo : ' + done + ' jalons sur ' + mss.length + '. Vous faites partie des équipes qui tiennent la distance.'});
    else if(done >= 2) Tm.push({key:'cheer-2', lvl:'ok', t:done + ' jalons franchis. La prochaine vraie épreuve, c\'est la période d\'essai : ne la sautez pas.'});

    var quiet = dAgo(lastActivity(team), now);
    if(quiet >= T.quietTeam) Tm.push({key:'quiet-team', lvl:'warn', t:'Rien n\'a bougé dans l\'équipe depuis ' + quiet + ' jours. Une équipe qui se tait se défait : '
      + (adm ? 'propose un point de 20 minutes cette semaine.' : 'écris un mot dans le groupe aujourd\'hui.'), act:'at-tab', tab:'groupe'});

    if(!objectives.length && age >= T.noPlan) Tm.push({key:'no-plan', lvl:'info', t:'Pas encore de plan d\'action. '
      + (adm ? 'Fixe un premier objectif pour la semaine : Takam le suivra.' : 'Propose à ' + H.porteur.first + ' un premier objectif pour la semaine.'), act:adm ? 'at-plan' : null});

    var late = H.tasks.filter(H.isLate);
    if(late.length) Tm.push({key:'tasks-late', lvl:'warn', t:late.length + ' ' + pl(late.length, 'tâche', 'tâches') + ' en retard : '
      + late.slice(0, 4).map(function(k){ return q(k.t) + ' (' + H.byId(k.owner).first + ')'; }).join(', ') + (late.length > 4 ? '…' : '') + '.'});

    var unset = DOMAINS.filter(function(d){ return !(team.roles || {})[d.id]; });
    if(unset.length) Tm.push({key:'roles-unset', lvl:'info', t:unset.length + ' ' + pl(unset.length, 'domaine', 'domaines') + ' sans responsable : '
      + unset.map(function(d){ return d.l.toLowerCase(); }).join(', ') + '. Sans nom, personne ne décide.'});

    if((team.vesting || 'Pas encore décidé') === 'Pas encore décidé' && age >= T.vesting && !(mss[3] && mss[3].done))
      Tm.push({key:'vesting', lvl:'info', t:'Le capital et le vesting ne sont toujours pas fixés après ' + age + ' jours. Plus vous attendez, plus la discussion sera difficile.'});

    var pst = team.pacte && team.pacte.status;
    if(mss[3] && mss[3].done && !(mss[5] && mss[5].done) && (!pst || pst === 'brouillon'))
      Tm.push({key:'pacte-prep', lvl:'info', t:'Le capital est fixé : c\'est le moment de préparer le pacte d\'associés. Il protège chacun, surtout le jour où quelqu\'un part.', act:'at-pacte'});

    /* ---------- Pour la personne qui regarde ---------- */
    if(pst === 'signature' && !((team.pacte.signatures || {})[viewer]))
      M.push({key:'pacte-sign', lvl:'warn', t:'Le pacte d\'associés attend ta signature. Relis-le et signe : l\'équipe ne peut pas avancer sans toi.', act:'at-pacte'});

    if(!adm){
      (team.props || []).filter(function(p){ return !(p.val || {})[viewer]; }).forEach(function(p){
        var n = dAgo(p.d, now);
        M.push({key:'val-' + p.id, lvl:'warn', t:'Tu n\'as pas validé ' + q(p.t) + ', proposée ' + (n ? 'il y a ' + n + ' j' : 'aujourd\'hui') + '.', act:'at-val', id:p.id});
      });
      H.tasks.filter(function(k){ return k.owner === viewer && k.status !== 'done' && !k.signaled; }).forEach(function(k){
        var n = dIn(k.due, now);
        if(n < 0) M.push({key:'mytask-late-' + k.id, lvl:'warn', t:'Ta tâche ' + q(k.t) + ' est en retard de ' + (-n) + ' j. Signale-la terminée ou préviens le groupe.'});
        else if(n <= T.dueSoon) M.push({key:'mytask-due-' + k.id, lvl:'info', t:'Ta tâche ' + q(k.t) + ' est due ' + (n === 0 ? 'aujourd\'hui' : n === 1 ? 'demain' : 'dans ' + n + ' j') + '.'});
      });
      if(objectives.length && !open.some(function(k){ return k.owner === viewer; }))
        M.push({key:'me-idle', lvl:'info', t:'Tu n\'as aucune tâche en cours. Demande à ' + H.porteur.first + ' ce qui ferait le plus avancer l\'équipe cette semaine.'});
      if((team.members || []).length >= 3){
        var mine = H.lastMsgOf(viewer), n2 = dAgo(isNaN(mine) ? team.since : mine, now);
        if(n2 >= T.silentMe) M.push({key:'me-silent', lvl:'info', t:'Tu n\'as rien écrit dans le groupe depuis ' + n2 + ' jours. Un mot suffit pour rester dans le rythme.', act:'at-tab', tab:'groupe'});
      }
    } else {
      (team.props || []).forEach(function(p){
        var miss = H.talents.filter(function(m){ return !(p.val || {})[m.id]; });
        if(miss.length) M.push({key:'nudge-' + p.id, lvl:'info', t:list(miss.map(function(m){ return m.first; })) + (miss.length > 1 ? ' n\'ont' : ' n\'a') + ' pas encore validé ' + q(p.t) + '.', act:'at-nudge', id:p.id});
      });
      H.tasks.filter(function(k){ return k.signaled && k.status !== 'done'; }).forEach(function(k){
        M.push({key:'confirm-' + k.id, lvl:'warn', t:H.byId(k.owner).first + ' a signalé ' + q(k.t) + ' terminée. Confirme-la pour que la progression suive.', act:'at-confirm', id:k.id});
      });
      H.talents.forEach(function(m){
        if(objectives.length && !open.some(function(k){ return k.owner === m.id; }))
          M.push({key:'idle-' + m.id, lvl:'info', t:m.first + ' n\'a aucune tâche en cours. Confie-lui quelque chose de concret pour la semaine.', act:'at-plan'});
        if((team.members || []).length >= 3){
          var l = H.lastMsgOf(m.id), n3 = dAgo(isNaN(l) ? team.since : l, now);
          if(n3 >= T.silentTal) M.push({key:'silent-' + m.id, lvl:'info', t:m.first + g(m.sex, ' est silencieux', ' est silencieuse', ' n\'a rien écrit') + ' dans le groupe depuis ' + n3 + ' jours. Un message de ta part ?', act:'at-tab', tab:'groupe'});
        }
      });
    }
    return {team:Tm, me:M};
  }

  /* ============================================================
     Réponses de secours (quand l'IA n'est pas disponible)
     ============================================================ */
  var REPLIES = [
    [/retard|lent|bloqu|avance pas/i, 'Un retard n\'est pas un drame, un retard silencieux l\'est. Dites dans le groupe ce qui bloque et fixez une nouvelle date ensemble, aujourd\'hui.'],
    [/capital|parts?\b|equity|vesting|pourcentage/i, 'Décidez le capital à froid, maintenant. Le porteur propose, chacun valide ou dit pourquoi pas. Une répartition fixée après six mois se négocie toujours mal.'],
    [/pacte|contrat|juriste|ohada|statuts/i, 'Le pacte se prépare dans l\'Atelier, à partir de ce que vous avez déjà décidé : capital, vesting, rôles. Fixez ces trois points d\'abord, le texte suivra.'],
    [/essai|test|livrable/i, 'Deux semaines sur un vrai livrable, avec une date de fin et un critère de réussite écrit. C\'est l\'étape que tout le monde saute et celle qui évite le plus de mauvaises surprises.'],
    [/conflit|désaccord|desaccord|dispute|tension|énerv|enerv/i, 'Un désaccord se règle à l\'oral, pas par messages. Proposez un appel de 20 minutes, chacun dit ce qu\'il attend, puis vous écrivez la décision dans le groupe.'],
    [/quitter|partir|arrêter|arreter|abandon/i, 'Avant de partir, dis-le clairement à l\'équipe et explique pourquoi. Si un pacte est signé, ses clauses de départ s\'appliquent ; sinon, mettez par écrit ce que chacun garde.'],
    [/motiv|fatigu|décourag|decourag|démotiv|demotiv/i, 'Regarde ce que vous avez déjà franchi. Choisis une seule tâche pour cette semaine et termine-la : la motivation revient avec les résultats, pas avant.'],
    [/r[oô]le|qui d[ée]cide|responsab/i, 'Un domaine, un responsable. Ça n\'empêche pas d\'en discuter, ça évite de rester bloqués. Le porteur attribue, l\'équipe valide.'],
    [/client|vente|march[ée]|prospect/i, 'Parlez à dix clients potentiels avant d\'écrire une ligne de plus. Notez leurs mots exacts : c\'est votre meilleur cahier des charges.'],
    [/argent|financ|lev[ée]e|investisseur|subvention/i, 'Avant de chercher de l\'argent, montrez une preuve : des utilisateurs, une précommande, un pilote. Un investisseur finance une équipe qui avance, pas une idée.'],
  ];
  function reply(question){
    var r = REPLIES.filter(function(x){ return x[0].test(question || ''); })[0];
    return r ? r[1] : 'Bien noté. Mon conseil : transforme ça en tâche dans le plan d\'action, avec un responsable et une date. Ce qui n\'a pas de date n\'avance pas.';
  }

  /* ============================================================
     Résumé de l'équipe, en texte, pour l'IA (serveur)
     ============================================================ */
  function summary(team, viewer, now){
    now = now || Date.now();
    var H = helpers(team, now), me = H.byId(viewer);
    var lines = [];
    lines.push('Projet : ' + (team.title || 'sans titre') + (team.hook ? ' — ' + team.hook : ''));
    lines.push('Équipe depuis ' + dAgo(team.since, now) + ' jours. Porteur : ' + H.porteur.first + '. Talents : ' + (H.talents.map(function(m){ return m.first; }).join(', ') || 'aucun') + '.');
    lines.push('La personne qui te parle : ' + me.first + ' (' + (me.role === 'vis' ? 'porteur du projet, administrateur de l\'Atelier' : 'talent associé') + ').');
    lines.push('Jalons : ' + (team.milestones || []).map(function(m, i){ return (i + 1) + '. ' + m.t + (m.done ? ' [fait]' : ''); }).join(' ; '));
    var roles = DOMAINS.map(function(d){ var id = (team.roles || {})[d.id]; return d.l + ' : ' + (id ? H.byId(id).first : 'personne'); });
    lines.push('Responsables : ' + roles.join(' ; '));
    lines.push('Vesting : ' + (team.vesting || 'Pas encore décidé') + '. Pacte : ' + ((team.pacte && team.pacte.status) || 'pas commencé') + '.');
    var obj = (team.objectives || []).slice(0, 6).map(function(o){
      return '« ' + o.t + ' » : ' + ((o.tasks || []).slice(0, 8).map(function(k){
        var st = k.status === 'done' ? 'faite' : H.isLate(k) ? 'en retard' : 'à faire';
        return k.t + ' (' + H.byId(k.owner).first + ', ' + st + ')';
      }).join(', ') || 'aucune tâche');
    });
    lines.push('Plan d\'action : ' + (obj.join(' | ') || 'vide'));
    var pend = (team.props || []).map(function(p){ return p.t; });
    if(pend.length) lines.push('Décisions en attente de validation : ' + pend.join(' ; '));
    var a = compute(team, viewer, now);
    var al = a.team.concat(a.me).filter(function(x){ return x.lvl !== 'ok'; }).map(function(x){ return '- ' + x.t; });
    if(al.length) lines.push('Alertes en cours :\n' + al.join('\n'));
    return lines.join('\n');
  }

  var api = {compute:compute, reply:reply, summary:summary, lastActivity:lastActivity, DOMAINS:DOMAINS, MILESTONES:MILESTONES, THRESHOLDS:T, version:'2026-10-11'};
  if(typeof module !== 'undefined' && module.exports) module.exports = api;
  root.TakamRules = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
