/* ============================================================
   TakaMatch — pacte d'associés (moteur commun app + admin)
   ------------------------------------------------------------
   · Un modèle GÉNÉRIQUE de pacte (SAS de droit OHADA), dont
     chaque article est rédigé à partir des données de l'équipe :
     nombre d'associés, capital, vesting, rôles, ville, secteur,
     rythme de chacun, plan d'action…
   · Les réglages juridiques (société, gouvernance, clauses
     optionnelles) et les modifications de l'équipe ou du juriste
     sont gardés à part dans un « spec » : le texte se régénère
     quand l'Atelier change, sans perdre ce qui a été réécrit.
   · Le PDF est produit dans le navigateur (pdfmake + polices
     de la charte, chargés seulement au premier téléchargement).

   API : window.TMPacte
     defaults(ctx)              → spec par défaut
     build(ctx, spec, opts)     → document (articles numérotés)
     issues(doc)                → ce qu'il reste à compléter
     library(ctx, spec)         → clauses que l'on peut ajouter
     fingerprint(doc)           → empreinte SHA-256 (signature)
     download(doc, opts)        → télécharge le PDF
     sampleCtx()                → équipe fictive (modèle vierge)
   ============================================================ */
(function(){
  'use strict';

  /* ---------- Où trouver les fichiers (polices, pdfmake) ---------- */
  const SCRIPT = document.currentScript && document.currentScript.src;
  const BASE = SCRIPT ? new URL('../', SCRIPT).href : '';

  /* ---------- Outils ---------- */
  const NB = ' ', NNB = ' ';
  const MOIS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const nf = n => Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, NNB);
  const fcfa = n => nf(n) + NB + 'FCFA';
  const pct = n => (Math.round(Number(n) * 100) / 100).toString().replace('.', ',') + NB + '%';
  const dateL = d => { d = d ? new Date(d) : null; return d && !isNaN(d) ? (d.getDate() === 1 ? '1er' : d.getDate()) + ' ' + MOIS[d.getMonth()] + ' ' + d.getFullYear() : ''; };
  const ph = (label, who) => '[[' + label + (who ? '|' + who : '') + ']]';
  const val = (v, label, who) => (v == null || String(v).trim() === '') ? ph(label, who) : String(v).trim();
  const g = (sex, m, f, n) => sex === 'f' ? f : sex === 'm' ? m : (n == null ? m : n);
  const joinL = a => a.length <= 1 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' et ' + a[a.length - 1];
  const cap1 = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const hashS = s => { let h = 5381; s = String(s || ''); for(let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); };
  const clone = o => JSON.parse(JSON.stringify(o));
  const NUMW = ['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf','vingt'];
  const words = n => NUMW[n] || String(n);
  const months = n => words(n) + ' (' + n + ')' + NB + 'mois';
  const years = n => words(n) + ' (' + n + ')' + NB + (n > 1 ? 'ans' : 'an');

  /* ---------- Pays (siège) — les États membres de l'OHADA d'abord ---------- */
  const OHADA = ['BJ','BF','CM','CF','KM','CG','CI','GA','GN','GW','GQ','ML','NE','CD','SN','TD','TG'];
  const COUNTRIES = {BJ:'Bénin', BF:'Burkina Faso', CM:'Cameroun', CF:'Centrafrique', KM:'Comores', CG:'Congo', CI:'Côte d\'Ivoire',
    GA:'Gabon', GN:'Guinée', GW:'Guinée-Bissau', GQ:'Guinée équatoriale', ML:'Mali', NE:'Niger', CD:'République démocratique du Congo',
    SN:'Sénégal', TD:'Tchad', TG:'Togo', BI:'Burundi', DJ:'Djibouti', MG:'Madagascar', MR:'Mauritanie', RW:'Rwanda', SC:'Seychelles',
    MU:'Maurice', BE:'Belgique', CH:'Suisse', CA:'Canada', FR:'France'};
  const DU = {BJ:'du Bénin', BF:'du Burkina Faso', CM:'du Cameroun', CF:'de Centrafrique', KM:'des Comores', CG:'du Congo', CI:'de Côte d\'Ivoire',
    GA:'du Gabon', GN:'de Guinée', GW:'de Guinée-Bissau', GQ:'de Guinée équatoriale', ML:'du Mali', NE:'du Niger', CD:'de la République démocratique du Congo',
    SN:'du Sénégal', TD:'du Tchad', TG:'du Togo', BI:'du Burundi', DJ:'de Djibouti', MG:'de Madagascar', MR:'de Mauritanie', RW:'du Rwanda',
    SC:'des Seychelles', MU:'de Maurice', BE:'de Belgique', CH:'de Suisse', CA:'du Canada', FR:'de France'};
  const isOhada = cc => OHADA.includes(cc);

  /* ---------- Vesting choisi dans l'Atelier ---------- */
  function parseVesting(v){
    const s = String(v || '');
    const y = /(\d+)\s*an/.exec(s), c = /(\d+)\s*(an|mois)[^,]*cliff/.exec(s);
    if(!y) return null;
    const total = Number(y[1]) * 12;
    let cliff = 0;
    if(c) cliff = c[2] === 'an' ? Number(c[1]) * 12 : Number(c[1]);
    if(/sans cliff/.test(s)) cliff = 0;
    return {months:total, cliff};
  }

  /* ============================================================
     Réglages par défaut d'une équipe
     ============================================================ */
  function defaults(ctx){
    const porteur = (ctx.members || []).find(m => m.role === 'vis') || (ctx.members || [])[0] || {};
    const n = (ctx.members || []).length;
    return {
      v:1,
      company:{name:(ctx.project && ctx.project.title) || '', capital:1000000, nominal:10000,
        city:(ctx.project && ctx.project.city) || '', country:(ctx.project && ctx.project.country) || 'BJ',
        object:'', state:'formation', rccm:'', delay:6},
      gov:{president:porteur.uid || '', majority:'auto', threshold:500000, meetings:'mois'},
      vest:{scope:'tous', discount:50, window:6},
      opts:{inalienabilite:true, inalienMonths:24, preemption:true, agrement:true, 'sortie-conjointe':true,
        'sortie-forcee':n >= 3, dragPct:75, 'non-concurrence':true, ncMonths:12, ncZone:'pays',
        notice:3, confidYears:3, duration:10, dispute:'tribunal', annexPlan:true},
      edits:{}, removed:[], added:[], notes:{}
    };
  }
  /* Complète un spec ancien ou partiel avec les valeurs par défaut. */
  function normalize(ctx, spec){
    const d = defaults(ctx); spec = spec ? clone(spec) : {};
    ['company','gov','vest','opts'].forEach(k => { spec[k] = Object.assign({}, d[k], spec[k] || {}); });
    ['edits','notes'].forEach(k => { if(!spec[k] || typeof spec[k] !== 'object') spec[k] = {}; });
    ['removed','added'].forEach(k => { if(!Array.isArray(spec[k])) spec[k] = []; });
    spec.v = 1;
    return spec;
  }

  /* ============================================================
     Le modèle : chaque article est une fonction de (ctx, spec, h)
     h = outils de rédaction calculés pour l'équipe.
     opt : article optionnel (activé par un réglage ou retirable)
     core : article indispensable, jamais retiré
     ============================================================ */
  function helpers(ctx, spec, include){
    const members = ctx.members || [];
    const porteur = members.find(m => m.role === 'vis') || members[0] || {first:'—', uid:''};
    const talents = members.filter(m => m !== porteur);
    const n = members.length;
    const F = m => '« ' + (m.first || m.legal || 'Associé') + ' »';
    const others = n > 2 ? 'les autres Associés' : 'l\'autre Associé';
    const maj = spec.gov.majority === 'auto' ? (n <= 2 ? 'unanimite' : 'deux-tiers') : spec.gov.majority;
    const majL = {unanimite:'à l\'unanimité', 'deux-tiers':'à la majorité des deux tiers des droits de vote', majorite:'à la majorité simple des droits de vote'}[maj];
    const pres = members.find(m => m.uid === spec.gov.president) || porteur;
    const cc = spec.company.country || 'BJ';
    const city = spec.company.city;
    return {members, porteur, talents, n, F, others, maj, majL, pres, cc, city, has:include,
      cityV:val(city, 'ville du siège'), countryL:COUNTRIES[cc] || cc, ohada:isOhada(cc),
      vest:parseVesting(ctx.vesting), name:val(spec.company.name, 'dénomination sociale'),
      shares:spec.company.capital && spec.company.nominal ? Math.floor(spec.company.capital / spec.company.nominal) : 0};
  }

  /* Répartition du capital en actions (la somme tombe juste). */
  function shareRows(ctx, h){
    const rows = h.members.map(m => ({m, pct:Number(m.share) || 0, n:0}));
    if(h.shares){
      rows.forEach(r => r.n = Math.floor(h.shares * r.pct / 100));
      const rest = h.shares - rows.reduce((a, r) => a + r.n, 0);
      if(rest && rows.length){ rows.slice().sort((a, b) => b.pct - a.pct)[0].n += rest; }
    }
    return rows;
  }

  const TEMPLATE = [
    {id:'objet', title:'Objet du Pacte', core:true, text:(c, s, h) =>
      'Le présent pacte d\'associés (le « Pacte ») a pour objet d\'organiser les relations entre les Associés au sein de la Société, notamment la gouvernance, la répartition des responsabilités, l\'acquisition progressive des actions, les conditions de départ d\'un Associé et les transferts d\'actions.\n\n'
      + 'Le Pacte complète les statuts de la Société. Il engage personnellement chacun des Associés. En cas de contradiction entre le Pacte et les statuts, les Associés s\'engagent à faire prévaloir entre eux les stipulations du Pacte et, si nécessaire, à voter les modifications statutaires utiles.\n\n'
      + 'Le Pacte est confidentiel. Il n\'est pas déposé au greffe et n\'est pas opposable aux tiers.'},

    {id:'societe', title:'La Société', core:true, text:(c, s, h) => {
      const co = s.company;
      const law = h.ohada ? 'régie par l\'Acte uniforme de l\'OHADA relatif au droit des sociétés commerciales et du groupement d\'intérêt économique'
                          : 'régie par le droit ' + (DU[h.cc] || 'du pays du siège');
      const capTxt = co.capital ? fcfa(co.capital) + (h.shares ? ', divisé en ' + nf(h.shares) + ' actions de ' + fcfa(co.nominal) + ' chacune' : '') : ph('montant du capital social');
      const obj = val(co.object, 'objet social');
      if(co.state === 'immatriculee'){
        return 'La société ' + h.name + ' est une société par actions simplifiée (SAS) ' + law + ', immatriculée au Registre du commerce et du crédit mobilier (RCCM) de ' + h.cityV + ' sous le numéro ' + val(co.rccm, 'numéro RCCM') + ' (la « Société »).\n\n'
          + '- siège social : ' + h.cityV + ', ' + h.countryL + ' ;\n- capital social : ' + capTxt + ' ;\n- objet social : ' + obj + ' ;\n- Président : ' + (h.pres.legal || h.pres.first) + '.';
      }
      return 'Les Associés s\'engagent à constituer une société par actions simplifiée (SAS) ' + law + ' (la « Société »), présentant les caractéristiques suivantes :\n\n'
        + '- dénomination sociale : ' + h.name + ' ;\n- siège social : ' + h.cityV + ', ' + h.countryL + ' ;\n- capital social : ' + capTxt + ' ;\n- objet social : ' + obj + ' ;\n- Président : ' + (h.pres.legal || h.pres.first) + '.\n\n'
        + 'Les Associés s\'engagent à accomplir les formalités de constitution et d\'immatriculation de la Société dans un délai de ' + months(co.delay || 6) + ' à compter de la signature du Pacte, et à adopter des statuts conformes au Pacte. Les actes accomplis pour le compte de la Société en formation le sont dans les conditions prévues par la loi.';
    }},

    {id:'capital', title:'Répartition du capital', core:true, table:'capital', text:(c, s, h) =>
      'À la date de signature du Pacte, le capital de la Société ' + (s.company.state === 'immatriculee' ? 'est' : 'sera') + ' réparti entre les Associés comme suit :\n\n'
      + '{{table}}\n\n'
      + 'Cette répartition traduit la valeur que les Associés reconnaissent à l\'apport et à l\'engagement de chacun. Elle a été arrêtée d\'un commun accord au sein de l\'Atelier TakaMatch.'
      + (h.has('vesting') ? ' Les actions détenues par ' + (s.vest.scope === 'talents' ? 'les Associés Talents' : 'chaque Associé') + ' sont soumises aux règles d\'acquisition progressive prévues à l\'' + '{{art:vesting}}' + '.' : '')},

    {id:'apports', title:'Apports et libération des actions', text:(c, s, h) =>
      'Chaque Associé libère les actions qui lui sont attribuées selon les modalités prévues par les statuts, au moyen d\'apports en numéraire et, le cas échéant, d\'apports en nature évalués dans les conditions légales.\n\n'
      + (h.talents.length ? 'Les Associés reconnaissent que la contribution ' + (h.talents.length > 1 ? 'des Associés Talents' : 'de ' + h.F(h.talents[0])) + ' tient d\'abord à ' + (h.talents.length > 1 ? 'leurs compétences et à leur engagement personnel' : 'ses compétences et à son engagement personnel') + ' dans le projet. Lorsque la loi et les statuts le permettent, cette contribution peut prendre la forme d\'un apport en industrie ; à défaut, les Associés retiennent, sur les conseils du juriste, le mécanisme le plus adapté pour attribuer à chacun la part de capital convenue (souscription à la valeur nominale, actions de préférence ou bons de souscription).' : '')},

    {id:'engagements', title:'Engagements des Associés', text:(c, s, h) => {
      const DOM = (c.roles || []);
      const lines = h.members.map(m => {
        const doms = DOM.filter(r => r.uid === m.uid).map(r => r.domain.toLowerCase());
        return '- ' + (m.first || m.legal) + ' : ' + (doms.length ? 'responsable ' + joinL(doms.map(d => 'du domaine « ' + d + ' »')) : 'responsabilités à préciser')
          + (m.pace ? ' ; disponibilité annoncée : ' + m.pace.toLowerCase() : '') + ' ;';
      });
      if(lines.length) lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, '.');
      return 'Chaque Associé s\'engage à participer activement au développement de la Société, dans les responsabilités qui lui sont confiées, avec loyauté et de bonne foi. À la date du Pacte, les engagements de chacun sont les suivants :\n\n'
        + lines.join('\n') + '\n\n'
        + 'Chaque Associé informe sans délai ' + h.others + ' de tout événement susceptible de réduire durablement sa disponibilité.'
        + (h.has('depart') ? ' Une baisse durable et non concertée de l\'engagement d\'un Associé peut être traitée dans les conditions de l\'' + '{{art:depart}}' + '.' : '');
    }},

    {id:'gouvernance', title:'Gouvernance et décisions importantes', core:true, text:(c, s, h) =>
      'La Société est dirigée par un Président, ' + (h.pres.legal || h.pres.first) + ', désigné dans les conditions prévues par les statuts. Le Président représente la Société à l\'égard des tiers et en assure la gestion courante.\n\n'
      + 'Les décisions suivantes (les « Décisions importantes ») ne peuvent être prises qu\'après accord préalable des Associés statuant ' + h.majL + ' :\n\n'
      + '- l\'adoption et la modification du budget annuel et du plan d\'action ;\n'
      + '- toute levée de fonds, émission de titres donnant accès au capital ou entrée d\'un nouvel associé ;\n'
      + '- tout emprunt, toute garantie ou toute dépense non prévue au budget d\'un montant supérieur à ' + fcfa(s.gov.threshold || 500000) + ' ;\n'
      + '- le recrutement, la rémunération ou le licenciement d\'un salarié ou d\'un dirigeant ;\n'
      + '- la cession, la location ou le nantissement d\'un actif essentiel, notamment des droits de propriété intellectuelle ;\n'
      + '- toute convention entre la Société et un Associé ou un dirigeant ;\n'
      + '- toute modification des statuts, transformation, fusion ou dissolution de la Société.\n\n'
      + 'Les Associés se réunissent au moins une fois ' + ({semaine:'par semaine', mois:'par mois', trimestre:'par trimestre'}[s.gov.meetings] || 'par mois') + ' pour faire le point sur l\'avancement du projet. Les décisions peuvent être prises par tout moyen écrit, y compris électronique, notamment dans l\'espace de l\'équipe sur TakaMatch.'},

    {id:'responsabilites', title:'Répartition des responsabilités', table:'roles', text:(c, s, h) =>
      'Afin que chaque domaine ait un responsable identifié, les Associés ont réparti les responsabilités opérationnelles comme suit :\n\n{{table}}\n\n'
      + 'Le responsable d\'un domaine prend les décisions courantes qui en relèvent, dans le respect du budget et des Décisions importantes. Cette répartition peut être modifiée d\'un commun accord ; la modification est consignée par écrit.'},

    {id:'information', title:'Information des Associés', text:(c, s, h) =>
      'Chaque Associé a accès à tout moment aux informations relatives à la Société : comptes bancaires, comptabilité, contrats, indicateurs et outils de travail.\n\n'
      + 'Le Président communique aux Associés, au moins une fois par trimestre, un point écrit sur la situation financière de la Société et l\'avancement du plan d\'action.'},

    {id:'vesting', title:'Acquisition progressive des actions', text:(c, s, h) => {
      const v = h.vest, who = s.vest.scope === 'talents' ? 'de chaque Associé Talent' : 'de chaque Associé';
      const dur = v ? months(v.months) : ph('durée du vesting'), cliffM = v ? v.cliff : null;
      let t = 'Afin d\'aligner la détention du capital sur l\'engagement dans la durée, les actions ' + who + ' sont soumises à une acquisition progressive (« vesting ») sur une durée de ' + dur + ' à compter de la signature du Pacte';
      if(!v) t += ', avec une période initiale (« cliff ») de ' + ph('durée du cliff') + '.\n\nAucune action n\'est définitivement acquise avant la fin du cliff. À son issue, la fraction correspondant à cette période est acquise ; le solde est acquis par fractions mensuelles égales.';
      else if(cliffM) t += ', avec une période initiale (« cliff ») de ' + months(cliffM) + '.\n\nAucune action n\'est définitivement acquise avant la fin du cliff. À son issue, ' + cliffM + '/' + v.months + ' des actions sont acquises ; le solde est acquis par fractions mensuelles égales de 1/' + v.months + ' au cours des ' + months(v.months - cliffM) + ' suivants.';
      else t += ', sans période initiale.\n\nLes actions sont acquises par fractions mensuelles égales de 1/' + v.months + '.';
      t += '\n\nLes actions non encore acquises au jour du départ d\'un Associé (les « Actions non acquises ») font l\'objet de la promesse de cession prévue à l\'' + (h.has('depart') ? '{{art:depart}}' : 'article relatif au départ d\'un Associé') + '.\n\n'
        + 'L\'ensemble des actions est réputé acquis en cas de cession de la totalité du capital de la Société ou de toute opération entraînant un changement de son contrôle.';
      return t;
    }},

    {id:'depart', title:'Départ d\'un Associé', core:true, text:(c, s, h) =>
      'Un Associé qui cesse de participer activement au projet, quelle qu\'en soit la cause (le « Partant »), consent dès à présent à ' + h.others + ' une promesse de vente portant sur ses actions, que ' + (h.n > 2 ? 'ceux-ci peuvent exercer, au prorata de leur participation,' : 'celui-ci peut exercer') + ' pendant ' + months(s.vest.window || 6) + ' à compter du départ :\n\n'
      + '- **Départ de bonne foi** (« good leaver ») — départ d\'un commun accord, décès, invalidité, maladie grave ou révocation sans faute : les Actions non acquises sont cédées à leur valeur nominale ; les actions acquises restent la propriété du Partant.\n'
      + '- **Départ fautif** (« bad leaver ») — démission avant la fin du cliff, faute grave, ou manquement aux engagements de confidentialité' + (h.has('non-concurrence') ? ', de non-concurrence' : '') + (h.has('exclusivite') ? ', d\'exclusivité' : '') + ' : les Actions non acquises sont cédées à leur valeur nominale et les actions acquises à leur valeur de marché diminuée d\'une décote de ' + pct(s.vest.discount || 50) + '.\n\n'
      + 'La valeur de marché est fixée d\'un commun accord ou, à défaut, par un expert désigné d\'un commun accord ou, à défaut, par le président du tribunal compétent.\n\n'
      + 'L\'Associé qui souhaite quitter le projet en informe ' + h.others + ' par écrit en respectant un préavis de ' + months(s.opts.notice || 3) + ', pendant lequel il assure la transmission de ses dossiers et de ses accès.\n\n'
      + 'Le départ ou le retrait d\'un membre de l\'équipe enregistré sur TakaMatch ne vaut pas, à lui seul, cession de ses actions : celle-ci intervient selon le présent article.'},

    {id:'inalienabilite', title:'Inaliénabilité temporaire', opt:'inalienabilite', text:(c, s, h) =>
      'Pendant une durée de ' + months(s.opts.inalienMonths || 24) + ' à compter de la signature du Pacte, aucun Associé ne peut céder tout ou partie de ses actions sans l\'accord préalable et écrit de ' + h.others + '. Cette période correspond au temps nécessaire au lancement du projet, pour lequel la personne de chaque Associé est déterminante.\n\n'
      + 'Les cessions intervenant en application de l\'' + '{{art:depart}}' + (h.has('sortie-forcee') ? ' ou de l\'' + '{{art:sortie-forcee}}' : '') + ' ne sont pas concernées.'},

    {id:'preemption', title:'Droit de préemption', opt:'preemption', text:(c, s, h) =>
      'L\'Associé qui envisage de céder tout ou partie de ses actions notifie son projet à ' + h.others + ' en précisant le nombre d\'actions, le prix et l\'identité de l\'acquéreur pressenti.\n\n'
      + (h.n > 2 ? 'Les autres Associés disposent' : 'L\'autre Associé dispose') + ' d\'un délai de trente (30) jours pour exercer un droit de préemption sur les actions concernées, au prix notifié' + (h.n > 2 ? ', au prorata de leur participation' : '') + '. À défaut d\'exercice pour la totalité des actions, le cédant peut céder ses actions à l\'acquéreur pressenti, au prix et aux conditions notifiés' + (h.has('agrement') ? ', sous réserve de l\'agrément prévu à l\'' + '{{art:agrement}}' : '') + '.'},

    {id:'agrement', title:'Agrément des nouveaux associés', opt:'agrement', text:(c, s, h) =>
      'L\'entrée de tout nouvel associé, à quelque titre que ce soit, est soumise à l\'agrément préalable des Associés statuant ' + h.majL + '. Les statuts reprennent cette clause d\'agrément.\n\n'
      + 'Tout nouvel associé adhère au Pacte préalablement à son entrée au capital.'},

    {id:'sortie-conjointe', title:'Sortie conjointe', opt:'sortie-conjointe', text:(c, s, h) =>
      'Si un ou plusieurs Associés envisagent de céder des actions conférant à l\'acquéreur le contrôle de la Société, ' + h.others + ' ' + (h.n > 2 ? 'peuvent' : 'peut') + ' exiger que l\'acquéreur acquière également ' + (h.n > 2 ? 'leurs' : 'ses') + ' actions, aux mêmes prix et conditions. À défaut, la cession ne peut pas intervenir.'},

    {id:'sortie-forcee', title:'Sortie forcée', opt:'sortie-forcee', text:(c, s, h) =>
      'Si une offre portant sur la totalité du capital de la Société est acceptée par des Associés détenant ensemble au moins ' + pct(s.opts.dragPct || 75) + ' des actions, ' + h.others + ' s\'' + (h.n > 2 ? 'engagent' : 'engage') + ' à céder ' + (h.n > 2 ? 'leurs' : 'ses') + ' actions à l\'acquéreur, aux mêmes prix et conditions, à condition que l\'offre émane d\'un tiers de bonne foi et que le prix soit payé en numéraire.'},

    {id:'pi', title:'Propriété intellectuelle et actifs du projet', core:true, text:(c, s, h) =>
      'Tous les éléments créés ou développés par les Associés pour le projet ' + (c.project && c.project.title ? c.project.title : h.name) + ' — notamment le code source, les logiciels, les bases de données, les marques, les logos, les noms de domaine, les contenus, les designs, les méthodes et le savoir-faire — appartiennent à la Société.\n\n'
      + 'Chaque Associé cède à la Société, au fur et à mesure de leur création et pour toute la durée de protection, les droits de propriété intellectuelle qu\'il détient sur ces éléments, pour le monde entier. Les éléments créés avant l\'immatriculation de la Société lui sont cédés dès son immatriculation ; dans l\'intervalle, ils sont détenus pour son compte.\n\n'
      + 'Les comptes et accès du projet (noms de domaine, réseaux sociaux, hébergement, dépôts de code, comptes bancaires) sont ouverts au nom de la Société dès que possible ; leurs identifiants sont tenus à la disposition de tous les Associés.\n\n'
      + 'Chaque Associé conserve la propriété de ses connaissances générales et des créations antérieures au projet qu\'il a identifiées par écrit.'},

    {id:'confidentialite', title:'Confidentialité', core:true, text:(c, s, h) =>
      'Chaque Associé garde strictement confidentielles les informations relatives à la Société, au projet et au Pacte : informations financières, techniques, commerciales et stratégiques, ainsi que le contenu des échanges entre Associés.\n\n'
      + 'Cette obligation s\'applique pendant toute la durée du Pacte et ' + years(s.opts.confidYears || 3) + ' après la fin de la participation de l\'Associé à la Société. Elle ne s\'applique pas aux informations devenues publiques sans faute de l\'Associé, ni aux communications exigées par la loi.'},

    {id:'non-concurrence', title:'Non-concurrence et non-sollicitation', opt:'non-concurrence', text:(c, s, h) => {
      const sect = (c.project && c.project.sectors || []).filter(Boolean);
      const zone = s.opts.ncZone === 'ohada' ? 'dans les États membres de l\'OHADA' : s.opts.ncZone === 'uemoa' ? 'dans les États membres de l\'UEMOA' : (DU[h.cc] ? 'sur le territoire ' + DU[h.cc] : 'dans le pays du siège');
      return 'Pendant toute la durée de sa participation à la Société et pendant ' + months(s.opts.ncMonths || 12) + ' après son départ, chaque Associé s\'interdit, directement ou indirectement, d\'exercer une activité concurrente de celle de la Société'
        + (sect.length ? ' dans ' + (sect.length > 1 ? 'les secteurs' : 'le secteur') + ' ' + joinL(sect) : '') + ', ' + zone + '. Cet engagement est limité à ce qui est nécessaire à la protection des intérêts légitimes de la Société.\n\n'
        + 'Pendant la même durée, chaque Associé s\'interdit de solliciter ou d\'embaucher, pour son compte ou pour celui d\'un tiers, un salarié, un prestataire clé ou un client de la Société.';
    }},

    {id:'exclusivite', title:'Exclusivité', opt:'exclusivite', lib:true, text:(c, s, h) =>
      'Chaque Associé consacre l\'essentiel de son temps professionnel à la Société et n\'exerce aucune autre activité professionnelle rémunérée sans l\'accord préalable et écrit de ' + h.others + ', à l\'exception des activités d\'enseignement, de publication et des engagements associatifs.'},

    {id:'remuneration', title:'Rémunération des Associés', opt:'remuneration', lib:true, text:(c, s, h) =>
      'Jusqu\'à la première levée de fonds, ou jusqu\'à ce que le chiffre d\'affaires mensuel de la Société atteigne ' + ph('seuil de chiffre d\'affaires mensuel') + ' FCFA, les Associés ne perçoivent aucune rémunération au titre de leurs fonctions.\n\n'
      + 'Toute rémunération ultérieure est fixée d\'un commun accord, de manière équitable entre Associés d\'engagement comparable. Les frais engagés pour le compte de la Société sont remboursés sur justificatifs, dans la limite du budget.'},

    {id:'levee', title:'Levée de fonds et dilution', opt:'levee', lib:true, text:(c, s, h) =>
      'En cas d\'augmentation de capital, chaque Associé bénéficie d\'un droit préférentiel de souscription proportionnel à sa participation.\n\n'
      + 'Les Associés examinent de bonne foi toute proposition de levée de fonds et s\'engagent à ne pas s\'y opposer sans motif sérieux lorsqu\'elle a été approuvée dans les conditions de l\'' + '{{art:gouvernance}}' + '. Un plan d\'intéressement des futurs collaborateurs pourra être mis en place, dans la limite de ' + ph('pourcentage réservé') + ' % du capital.'},

    {id:'comptes-courants', title:'Avances en compte courant', opt:'comptes-courants', lib:true, text:(c, s, h) =>
      'Les Associés peuvent consentir des avances en compte courant à la Société. Le montant, la rémunération éventuelle, la durée et les conditions de remboursement de chaque avance sont fixés par une convention écrite, approuvée dans les conditions prévues pour les Décisions importantes.'},

    {id:'revoyure', title:'Clause de revoyure', opt:'revoyure', lib:true, text:(c, s, h) =>
      'Les Associés se réunissent dans un délai de ' + months(12) + ' à compter de la signature du Pacte pour faire le point sur l\'engagement effectif de chacun et, si nécessaire, ajuster d\'un commun accord la répartition du capital et des responsabilités. Toute modification est constatée par un avenant au Pacte.'},

    {id:'blocage', title:'Situation de blocage', opt:'blocage', text:(c, s, h) =>
      'Si une Décision importante ne peut être prise faute d\'accord pendant plus de soixante (60) jours et que cette situation compromet la poursuite de l\'activité, chaque Associé peut demander l\'organisation d\'une médiation.\n\n'
      + 'Si la médiation n\'aboutit pas dans un délai de trente (30) jours, les Associés examinent de bonne foi les options de sortie : rachat des actions de l\'un par l\'autre à une valeur fixée à dire d\'expert, cession de la Société ou dissolution.'},

    {id:'litiges', title:'Règlement des différends', core:true, text:(c, s, h) =>
      'En cas de différend relatif au Pacte, les Associés recherchent d\'abord une solution amiable, dans un délai de trente (30) jours à compter de la notification écrite du différend. À défaut d\'accord, ils peuvent recourir à une médiation.\n\n'
      + (s.opts.dispute === 'ccja'
        ? 'Si le différend persiste, il est tranché définitivement par voie d\'arbitrage selon le Règlement d\'arbitrage de la Cour commune de justice et d\'arbitrage (CCJA) de l\'OHADA, par un arbitre unique, en langue française. Le siège de l\'arbitrage est fixé à ' + h.cityV + '.'
        : 'Si le différend persiste, il est porté devant le tribunal compétent de ' + h.cityV + '.')
      + '\n\nLes échanges et les décisions consignés dans l\'Atelier TakaMatch peuvent être produits pour éclairer l\'intention commune des Associés.'},

    {id:'duree', title:'Durée et adhésion', core:true, text:(c, s, h) =>
      'Le Pacte entre en vigueur à la date de sa signature par l\'ensemble des Associés, pour une durée de ' + years(s.opts.duration || 10) + '.\n\n'
      + 'Il prend fin à l\'égard d\'un Associé lorsque celui-ci ne détient plus aucune action, sous réserve des engagements de confidentialité' + (h.has('non-concurrence') ? ' et de non-concurrence' : '') + ' qui lui survivent. Il prend fin pour tous en cas de dissolution de la Société ou si un seul Associé détient la totalité des actions.\n\n'
      + 'Toute personne qui devient associée de la Société adhère au préalable au Pacte, par la signature d\'un acte d\'adhésion.'},

    {id:'takamatch', title:'Rôle de TakaMatch', text:(c, s, h) =>
      'Le Pacte a été préparé à l\'aide de la plateforme TakaMatch, à partir des décisions prises par les Associés dans l\'Atelier. TakaMatch n\'est pas partie au Pacte et n\'intervient pas dans la gestion de la Société.\n\n'
      + 'Les Associés reconnaissent avoir disposé du temps nécessaire pour lire le Pacte, poser leurs questions et, s\'ils le souhaitaient, le faire relire par le conseil de leur choix.'},

    {id:'divers', title:'Dispositions générales', core:true, text:(c, s, h) =>
      '**Intégralité.** Le Pacte exprime l\'intégralité de l\'accord des Associés sur son objet et remplace tout accord antérieur sur le même objet.\n\n'
      + '**Modification.** Le Pacte ne peut être modifié que par un avenant écrit signé par tous les Associés.\n\n'
      + '**Divisibilité.** Si une stipulation du Pacte était déclarée nulle, les autres stipulations conserveraient leur plein effet ; les Associés la remplaceraient de bonne foi par une stipulation d\'effet équivalent.\n\n'
      + '**Notifications.** Les notifications prévues au Pacte sont valablement faites par écrit, y compris par courrier électronique aux adresses déclarées par les Associés sur TakaMatch, ou par lettre remise contre décharge.\n\n'
      + '**Signature.** Le Pacte peut être signé par voie électronique. Les Associés reconnaissent à cette signature la même valeur qu\'à une signature manuscrite, dans les conditions prévues par la loi applicable.'},
  ];
  const TPL = {}; TEMPLATE.forEach(a => TPL[a.id] = a);
  const LIB_DESC = {
    exclusivite:'Chacun réserve son temps professionnel à la Société.',
    remuneration:'Pas de salaire avant un seuil ; frais remboursés.',
    levee:'Droit préférentiel de souscription, plan d\'intéressement.',
    'comptes-courants':'Encadre les avances d\'argent d\'un associé.',
    revoyure:'Rendez-vous à 12 mois pour réajuster parts et rôles.',
    blocage:'Médiation puis sortie si une décision reste bloquée.',
    inalienabilite:'Personne ne vend ses actions pendant le lancement.',
    preemption:'Priorité aux associés si l\'un vend ses actions.',
    agrement:'Tout nouvel associé doit être accepté.',
    'sortie-conjointe':'Si le contrôle est vendu, tous peuvent vendre.',
    'sortie-forcee':'Une offre acceptée par la majorité s\'impose à tous.',
    'non-concurrence':'Pas d\'activité concurrente pendant et après.',
    apports:'Comment chacun libère ses actions.',
    engagements:'Disponibilité et rôle de chacun.',
    responsabilites:'Qui décide quoi, domaine par domaine.',
    information:'Accès aux comptes et point trimestriel.',
    vesting:'Les actions s\'acquièrent avec le temps.',
    takamatch:'TakaMatch n\'est pas partie au pacte.',
  };

  /* Quels articles du modèle sont présents ? */
  function included(ctx, spec){
    const n = (ctx.members || []).length;
    const maj = spec.gov.majority === 'auto' ? (n <= 2 ? 'unanimite' : 'deux-tiers') : spec.gov.majority;
    return TEMPLATE.filter(a => {
      if(spec.removed.includes(a.id) && !a.core) return false;
      if(a.opt){
        const on = spec.opts[a.opt];
        if(a.opt === 'blocage') return on === undefined ? maj === 'unanimite' : !!on;
        return !!on;
      }
      return true;
    }).map(a => a.id);
  }

  /* ============================================================
     Construction du document
     ============================================================ */
  function build(ctx, spec, opts){
    opts = opts || {};
    spec = normalize(ctx, spec);
    const inc = included(ctx, spec);
    const all = new Set(inc.concat(spec.added.map(a => a.id)));
    const has = id => all.has(id);
    const h = helpers(ctx, spec, has);

    /* Ordre : le modèle, puis les clauses ajoutées après leur ancre. */
    const seq = [];
    inc.forEach(id => seq.push({id, src:'tpl'}));
    spec.added.forEach(a => {
      let at = seq.findIndex(x => x.id === a.after);
      if(a.after === '_start') at = -1;
      else if(at < 0) at = seq.findIndex(x => x.id === 'litiges') - 1;
      /* Plusieurs ajouts derrière la même ancre : à la suite, dans l'ordre. */
      let k = at + 1; while(k < seq.length && seq[k].src === 'add' && seq[k].after === a.after) k++;
      seq.splice(Math.max(0, k), 0, {id:a.id, src:'add', after:a.after});
    });

    const num = {}; seq.forEach((x, i) => num[x.id] = i + 1);
    const ref = id => num[id] ? 'article ' + num[id] : 'article correspondant';
    const resolve = t => String(t || '').replace(/\{\{art:([a-z0-9_-]+)\}\}/g, (m, id) => ref(id));

    const articles = seq.map(x => {
      if(x.src === 'add'){
        const a = spec.added.find(z => z.id === x.id);
        return {id:a.id, n:num[a.id], title:a.title || 'Clause complémentaire', text:resolve(a.text), raw:a.text, added:true, by:a.by || '', note:spec.notes[a.id] || ''};
      }
      const t = TPL[x.id];
      const gen = t.text(ctx, spec, h);
      const e = spec.edits[x.id];
      const art = {id:x.id, n:num[x.id], title:(e && e.title) || t.title, table:t.table || null, core:!!t.core, opt:!!t.opt,
        text:resolve(e ? e.text : gen), raw:e ? e.text : gen, gen, edited:!!e, stale:!!(e && e.base && e.base !== hashS(gen)), note:spec.notes[x.id] || ''};
      return art;
    });

    /* Tableaux tirés de l'Atelier */
    const capRows = shareRows(ctx, h).map(r => ({uid:r.m.uid, name:r.m.legal || r.m.first, first:r.m.first, role:r.m.role === 'vis' ? 'Porteur de projet' : 'Associé Talent', pct:r.pct, n:r.n}));
    const roles = (ctx.roles || []).map(r => { const m = h.members.find(x => x.uid === r.uid); return {domain:r.domain, who:m ? (m.legal || m.first) : ''}; });

    /* Parties */
    const parties = h.members.map(m => {
      const p = (ctx.parties || {})[m.uid] || {};
      const who = m.first || 'associé';
      const legal = val(p.legal || m.legal, 'nom complet', who);
      const civ = g(m.sex, 'M. ', 'Mme ', '');
      const born = g(m.sex, 'né', 'née', 'né(e)');
      const txt = civ + legal + ', ' + born + ' le ' + val(p.birthDate ? dateL(p.birthDate) : '', 'date de naissance', who) + ' à ' + val(p.birthPlace, 'lieu de naissance', who)
        + ', de nationalité ' + val(p.nationality, 'nationalité', who)
        + (p.profession ? ', exerçant la profession de ' + p.profession : '')
        + ', demeurant ' + val(p.address, 'adresse', who)
        + ', titulaire de ' + val(p.idDoc, 'pièce d\'identité (type et numéro)', who) + ',';
      return {uid:m.uid, first:m.first, legal:p.legal || m.legal || m.first, role:m.role, sex:m.sex, share:Number(m.share) || 0,
        text:txt, alias:'ci-après « ' + (m.first || legal) + ' »' + (m.role === 'vis' ? ', porteur du projet' : ''), complete:!/\[\[/.test(txt)};
    });

    const project = ctx.project || {};
    const sect = (project.sectors || []).filter(Boolean);
    const firsts = h.members.map(m => m.first || m.legal);
    const tals = h.talents.map(m => m.first || m.legal);
    const skills = []; h.talents.forEach(m => (m.skills || []).forEach(s => { if(!skills.includes(s)) skills.push(s); }));
    const preamble = joinL(firsts) + ' se sont rencontrés par l\'intermédiaire de la plateforme TakaMatch' + (ctx.since ? ', leur premier match datant du ' + dateL(ctx.since) : '') + '. Ils ont décidé d\'unir leurs compétences pour développer ensemble le projet ' + (project.title || h.name)
      + (sect.length ? ', dans ' + (sect.length > 1 ? 'les secteurs' : 'le secteur') + ' ' + joinL(sect) : '') + '.'
      + (project.hook ? '\n\nLe projet se présente ainsi : « ' + String(project.hook).trim().replace(/\s+/g, ' ') + ' »' : '')
      + '\n\n' + (h.porteur.first || 'Le porteur de projet') + ', à l\'origine du projet, en assure la direction. '
      + (tals.length ? joinL(tals) + ' y ' + (tals.length > 1 ? 'apportent leurs' : 'apporte ses') + ' compétences' + (skills.length ? ', notamment en ' + joinL(skills.slice(0, 5).map(s => s.toLowerCase())) : '') + '.' : '')
      + '\n\nAu sein de l\'Atelier TakaMatch, les Associés ont arrêté la répartition du capital, les règles d\'acquisition progressive des actions et la répartition des responsabilités. Le Pacte traduit ces décisions en engagements et organise leurs relations au sein de la Société.';

    const plan = spec.opts.annexPlan ? (ctx.objectives || []).filter(o => o && o.t).map(o => ({t:o.t, tasks:(o.tasks || []).map(k => ({t:k.t, who:(h.members.find(m => m.uid === k.owner) || {}).first || '', due:k.due ? dateL(k.due) : '', done:k.status === 'done'}))})) : [];

    const doc = {
      kind:'pacte', engine:1,
      ref:ctx.ref || 'TM-PA', version:opts.version || 1, status:opts.status || 'brouillon',
      date:opts.date || new Date().toISOString(),
      company:{name:spec.company.name || '', state:spec.company.state, city:spec.company.city || '', country:h.countryL, cc:h.cc,
        capital:spec.company.capital || 0, nominal:spec.company.nominal || 0, shares:h.shares, ohada:h.ohada},
      project:{title:project.title || '', glyph:project.glyph || ''},
      president:h.pres.uid, majority:h.maj,
      parties, preamble, articles, capRows, roles, plan,
      reviewed:!!opts.reviewed,
    };
    return doc;
  }

  /* ---------- Ce qu'il reste à compléter / à vérifier ---------- */
  function issues(doc, ctx, spec){
    const out = [];
    const scan = (t, where, art) => String(t || '').replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, label, who) => { out.push({kind:'field', label, who:who || '', where, art}); return m; });
    doc.parties.forEach(p => scan(p.text, 'parties', 'parties'));
    doc.articles.forEach(a => scan(a.text, 'Art. ' + a.n + ' · ' + a.title, a.id));
    if(ctx){
      if(!parseVesting(ctx.vesting)) out.push({kind:'atelier', label:'Le vesting n\'est pas encore décidé dans l\'Atelier', where:'Atelier'});
      const free = (ctx.roles || []).filter(r => !r.uid);
      if(free.length) out.push({kind:'atelier', label:free.length + ' domaine' + (free.length > 1 ? 's' : '') + ' sans responsable (' + free.map(r => r.domain).join(', ') + ')', where:'Atelier'});
      if((ctx.pending || 0) > 0) out.push({kind:'atelier', label:ctx.pending + ' proposition' + (ctx.pending > 1 ? 's' : '') + ' de l\'Atelier en attente de validation', where:'Atelier'});
      if(Math.round(doc.capRows.reduce((a, r) => a + r.pct, 0)) !== 100) out.push({kind:'warn', label:'La répartition du capital ne fait pas 100 %', where:'Atelier'});
    }
    if(!doc.company.ohada) out.push({kind:'warn', label:'Siège hors zone OHADA (' + doc.company.country + ') : le juriste adaptera le pacte au droit local', where:'Société'});
    doc.articles.filter(a => a.stale).forEach(a => out.push({kind:'stale', label:'Art. ' + a.n + ' modifié à la main : les données de l\'équipe ont changé depuis', where:'Art. ' + a.n, art:a.id}));
    return out;
  }

  /* ---------- Clauses que l'on peut ajouter ---------- */
  function library(ctx, spec){
    spec = normalize(ctx, spec);
    const inc = new Set(included(ctx, spec));
    const list = [];
    TEMPLATE.forEach(a => {
      if(inc.has(a.id) || a.core) return;
      list.push({id:a.id, title:a.title, desc:LIB_DESC[a.id] || '', kind:a.opt ? 'opt' : 'tpl'});
    });
    return list;
  }

  /* ---------- Opérations sur le spec (éditeur) ---------- */
  const ops = {
    /* Remplace le texte d'un article ; les « article N » sont reconvertis en renvois dynamiques. */
    edit(ctx, spec, id, text, title){
      spec = normalize(ctx, spec);
      const doc = build(ctx, spec);
      const byNum = {}; doc.articles.forEach(a => byNum[a.n] = a.id);
      const back = String(text || '').replace(/\barticle (\d{1,2})\b/g, (m, n) => byNum[n] ? '{{art:' + byNum[n] + '}}' : m);
      const add = spec.added.find(a => a.id === id);
      if(add){ add.text = back; if(title != null) add.title = title; return spec; }
      const art = doc.articles.find(a => a.id === id); if(!art) return spec;
      if(back.trim() === String(art.gen).trim() && (title == null || title === TPL[id].title)) delete spec.edits[id];
      else spec.edits[id] = {text:back, title:title && title !== TPL[id].title ? title : undefined, base:hashS(art.gen), at:new Date().toISOString()};
      return spec;
    },
    reset(ctx, spec, id){ spec = normalize(ctx, spec); delete spec.edits[id]; return spec; },
    remove(ctx, spec, id){
      spec = normalize(ctx, spec);
      const add = spec.added.findIndex(a => a.id === id);
      if(add >= 0){ spec.added.splice(add, 1); spec.added.forEach(a => { if(a.after === id) a.after = '_end'; }); return spec; }
      const t = TPL[id]; if(!t || t.core) return spec;
      if(t.opt) spec.opts[t.opt] = false;
      else if(!spec.removed.includes(id)) spec.removed.push(id);
      delete spec.edits[id];
      return spec;
    },
    /* Remet une clause du modèle, ou ajoute une clause libre après « after ». */
    add(ctx, spec, id, after, by){
      spec = normalize(ctx, spec);
      if(TPL[id]){
        const t = TPL[id];
        if(t.opt) spec.opts[t.opt] = true;
        spec.removed = spec.removed.filter(x => x !== id);
        return spec;
      }
      spec.added.push({id:'c-' + Math.random().toString(36).slice(2, 8), title:'Clause complémentaire', text:'', after:after || '_end', by:by || '', at:new Date().toISOString()});
      return spec;
    },
  };

  /* ---------- Empreinte : ce que les associés signent ---------- */
  /* Clés triées : la base (jsonb) ne garde pas l'ordre des clés, l'empreinte ne doit pas en dépendre. */
  function stable(v){
    if(Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
    if(v && typeof v === 'object') return '{' + Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}';
    return JSON.stringify(v === undefined ? null : v);
  }
  function canonical(doc){
    return stable({ref:doc.ref, version:doc.version, company:doc.company, president:doc.president,
      parties:doc.parties.map(p => ({uid:p.uid, text:p.text, alias:p.alias, share:p.share})),
      preamble:doc.preamble, articles:doc.articles.map(a => ({n:a.n, title:a.title, text:a.text, table:a.table || null})),
      capRows:doc.capRows, roles:doc.roles, plan:doc.plan});
  }
  async function fingerprint(doc){
    const s = canonical(doc);
    try{
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }catch(e){ return 'h' + hashS(s) + hashS(s.split('').reverse().join('')); }
  }

  /* ---------- Texte → blocs (paragraphes, listes, tableaux) ---------- */
  function blocks(text){
    const out = [];
    String(text || '').replace(/\r/g, '').split(/\n\s*\n/).forEach(chunk => {
      const c = chunk.trim(); if(!c) return;
      if(c === '{{table}}'){ out.push({type:'table'}); return; }
      const lines = c.split('\n');
      if(lines.every(l => /^\s*[-•]\s+/.test(l))) out.push({type:'list', items:lines.map(l => l.replace(/^\s*[-•]\s+/, ''))});
      else out.push({type:'p', text:lines.join(' ')});
    });
    return out;
  }
  /* Ligne → morceaux (gras, champ à compléter). */
  function inline(text){
    const out = [];
    String(text || '').split(/(\*\*[^*]+\*\*|\[\[[^\]]+\]\])/).forEach(part => {
      if(!part) return;
      if(/^\*\*[^*]+\*\*$/.test(part)) out.push({t:part.slice(2, -2), b:true});
      else if(/^\[\[[^\]]+\]\]$/.test(part)){ const x = part.slice(2, -2).split('|'); out.push({t:x[0], ph:true, who:x[1] || ''}); }
      else out.push({t:part});
    });
    return out;
  }

  /* ============================================================
     Modèle vierge (page Légal) : une équipe fictive
     ============================================================ */
  function sampleCtx(){
    return {ref:'TM-PA-MODELE', project:{title:'Votre projet', sectors:[], hook:'', city:'', country:'BJ'},
      members:[{uid:'a', first:'Associé 1', legal:'', sex:'n', role:'vis', share:70, pace:''},
               {uid:'b', first:'Associé 2', legal:'', sex:'n', role:'tal', share:30, pace:''}],
      roles:[{domain:'Produit', uid:'a'}, {domain:'Technique', uid:'b'}, {domain:'Finances et levée', uid:'a'}, {domain:'Terrain et ventes', uid:'a'}, {domain:'Juridique et conformité', uid:'a'}],
      vesting:'4 ans, 1 an de cliff', objectives:[], parties:{}};
  }

  window.TMPacte = {defaults, normalize, build, issues, library, ops, fingerprint, blocks, inline, sampleCtx,
    COUNTRIES, OHADA, isOhada, parseVesting, dateL, fcfa, nf, pct, hashS, BASE, TEMPLATE_IDS:TEMPLATE.map(a => a.id)};
})();
