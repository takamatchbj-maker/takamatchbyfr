/* ============================================================
   TakaMatch — prix et devises (partagé : site, outil, admin, serveur de paiement)
   ------------------------------------------------------------
   · Les prix de référence sont en FCFA. Ils se modifient dans l'admin
     (section « Prix et taux ») et sont stockés dans Supabase
     (tables pricing et fx_rates).
   · Pour chaque personne, le prix est converti dans la devise de son pays,
     puis arrondi au « pas » de la devise (1 €, 10 DH, 5 000 FG…).
   · Le paiement est toujours encaissé en FCFA : hors zone FCFA, on débite
     l'équivalent en FCFA du prix affiché (la banque fait la conversion).
   · Les valeurs ci-dessous servent seulement si la base ne répond pas.
   ============================================================ */
(function(root){
  'use strict';

  var DEFAULT_PRICES = {
    second:           {label:'Second profil', fcfa:3000, credits:0},
    slot:             {label:'Emplacement projet supplémentaire', fcfa:5000, credits:0},
    credits_essai:    {label:'Pack Essai · 3 crédits', fcfa:2000, credits:3},
    credits_elan:     {label:'Pack Élan · 10 crédits', fcfa:5000, credits:10},
    credits_campagne: {label:'Pack Campagne · 30 crédits', fcfa:12000, credits:30},
    pacte:            {label:'Statuts / pacte d\'associés OHADA', fcfa:15000, credits:0}
  };
  /* r : nombre de FCFA pour 1 unité de la devise · step : arrondi d'affichage */
  var DEFAULT_FX = {
    XOF:{name:'Franc CFA (Ouest)', symbol:'FCFA', r:1, step:1},
    XAF:{name:'Franc CFA (Centre)', symbol:'FCFA', r:1, step:1},
    EUR:{name:'Euro', symbol:'€', r:655.957, step:1},
    CHF:{name:'Franc suisse', symbol:'CHF', r:655, step:1},
    CAD:{name:'Dollar canadien', symbol:'$ CA', r:440, step:1},
    MAD:{name:'Dirham marocain', symbol:'DH', r:60.7, step:10},
    DZD:{name:'Dinar algérien', symbol:'DA', r:4.4, step:50},
    TND:{name:'Dinar tunisien', symbol:'DT', r:193, step:5},
    MRU:{name:'Ouguiya', symbol:'UM', r:15.3, step:10},
    GNF:{name:'Franc guinéen', symbol:'FG', r:0.0657, step:5000},
    CDF:{name:'Franc congolais', symbol:'FC', r:0.213, step:5000},
    BIF:{name:'Franc burundais', symbol:'FBu', r:0.208, step:5000},
    RWF:{name:'Franc rwandais', symbol:'FRw', r:0.423, step:500},
    DJF:{name:'Franc djiboutien', symbol:'Fdj', r:3.4, step:100},
    KMF:{name:'Franc comorien', symbol:'KMF', r:1.3333, step:250},
    MGA:{name:'Ariary', symbol:'Ar', r:0.131, step:1000},
    MUR:{name:'Roupie mauricienne', symbol:'Rs', r:12.6, step:10},
    SCR:{name:'Roupie seychelloise', symbol:'SR', r:42.3, step:5},
    GHS:{name:'Cedi', symbol:'GH₵', r:41, step:5},
    NGN:{name:'Naira', symbol:'₦', r:0.375, step:500}
  };
  /* Pays → devise. Un pays absent paie en FCFA de l'Ouest. */
  var CUR_OF = {
    BJ:'XOF', TG:'XOF', CI:'XOF', SN:'XOF', BF:'XOF', ML:'XOF', NE:'XOF',
    CM:'XAF', GA:'XAF', CG:'XAF', CF:'XAF', TD:'XAF', GQ:'XAF',
    BE:'EUR', FR:'EUR', CH:'CHF', CA:'CAD', MA:'MAD', DZ:'DZD', TN:'TND', MR:'MRU',
    GN:'GNF', CD:'CDF', BI:'BIF', RW:'RWF', DJ:'DJF', KM:'KMF', MG:'MGA', MU:'MUR', SC:'SCR', GH:'GHS', NG:'NGN'
  };
  var FCFA = {XOF:1, XAF:1};

  function clone(o){ return JSON.parse(JSON.stringify(o)); }
  var state = {prices:clone(DEFAULT_PRICES), fx:clone(DEFAULT_FX), at:0};

  /* 12345.6 → « 12 346 » (espaces fines insécables, à la française) */
  function num(n, dec){
    var s = Number(n).toFixed(dec || 0), parts = s.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join(',');
  }
  function curOf(cc){ return CUR_OF[String(cc || '').toUpperCase()] || 'XOF'; }
  function fx(cur){ return state.fx[cur] || state.fx.XOF; }
  function fmt(amount, cur){ var f = fx(cur || 'XOF'); return num(amount, f.step < 1 ? 2 : 0) + ' ' + f.symbol; }
  function roundStep(v, step){ var r = Math.round(v / step) * step; return Math.max(step, +r.toFixed(2)); }

  /* Le calcul, identique partout (y compris sur le serveur de paiement). */
  function calc(key, cc, data){
    var prices = (data && data.prices) || state.prices, rates = (data && data.fx) || state.fx;
    var p = prices[key]; if(!p) return null;
    var cur = curOf(cc), f = rates[cur] || rates.XOF, base = Number(p.fcfa) || 0;
    var local = FCFA[cur] ? base : (base ? roundStep(base / f.r, f.step) : 0);
    /* Montant réellement encaissé en FCFA (arrondi à 5 FCFA). */
    var charged = FCFA[cur] ? base : Math.round(local * f.r / 5) * 5;
    return {key:key, label:p.label, credits:p.credits || 0, fcfa:base, cur:cur, local:local, charged:charged,
      text:num(local, f.step < 1 ? 2 : 0) + ' ' + f.symbol, inFcfa:!!FCFA[cur],
      chargedText:num(charged) + ' FCFA'};
  }

  var api = {
    DEFAULT_PRICES:DEFAULT_PRICES, DEFAULT_FX:DEFAULT_FX, CUR_OF:CUR_OF,
    calc:calc, curOf:curOf, fmt:fmt, num:num,
    /* Données brutes de la base → format interne (sert aussi au serveur). */
    fromRows:function(priceRows, fxRows){
      var prices = {}, rates = {};
      (priceRows || []).forEach(function(r){ prices[r.key] = {label:r.label, fcfa:Number(r.fcfa), credits:Number(r.credits || 0)}; });
      (fxRows || []).forEach(function(r){ rates[r.currency] = {name:r.name, symbol:r.symbol, r:Number(r.fcfa_per_unit), step:Number(r.step)}; });
      return {prices:Object.keys(prices).length ? prices : clone(DEFAULT_PRICES), fx:Object.keys(rates).length ? rates : clone(DEFAULT_FX)};
    }
  };

  if(typeof module !== 'undefined' && module.exports){ module.exports = api; return; }

  /* ---------------- Navigateur ---------------- */
  var KEY = 'tm-prix-v1', CCKEY = 'tm-pay-cc';
  try{ var c = JSON.parse(localStorage.getItem(KEY)); if(c && c.prices && c.fx) state = c; }catch(e){}
  var TZ = {'Africa/Porto-Novo':'BJ','Africa/Lome':'TG','Africa/Abidjan':'CI','Africa/Dakar':'SN','Africa/Ouagadougou':'BF','Africa/Bamako':'ML',
    'Africa/Niamey':'NE','Africa/Conakry':'GN','Africa/Douala':'CM','Africa/Libreville':'GA','Africa/Brazzaville':'CG','Africa/Kinshasa':'CD',
    'Africa/Lubumbashi':'CD','Africa/Bangui':'CF','Africa/Ndjamena':'TD','Africa/Malabo':'GQ','Africa/Bujumbura':'BI','Africa/Kigali':'RW',
    'Africa/Djibouti':'DJ','Indian/Comoro':'KM','Indian/Antananarivo':'MG','Indian/Mahe':'SC','Indian/Mauritius':'MU','Africa/Nouakchott':'MR',
    'Africa/Casablanca':'MA','Africa/Algiers':'DZ','Africa/Tunis':'TN','Europe/Brussels':'BE','Europe/Zurich':'CH','Europe/Paris':'FR',
    'America/Toronto':'CA','America/Montreal':'CA','America/Vancouver':'CA','America/Edmonton':'CA','America/Winnipeg':'CA','America/Halifax':'CA',
    'Africa/Accra':'GH','Africa/Lagos':'NG'};
  var forced = null;

  api.data = function(){ return state; };
  /* Pays utilisé pour les prix : choix explicite > dernier pays de paiement > fuseau horaire > Bénin. */
  api.cc = function(){
    if(forced) return forced;
    try{ var s = localStorage.getItem(CCKEY); if(s && CUR_OF[s]) return s; }catch(e){}
    try{ var z = Intl.DateTimeFormat().resolvedOptions().timeZone; if(TZ[z]) return TZ[z]; }catch(e){}
    return 'BJ';
  };
  api.setCc = function(cc, remember){
    cc = String(cc || '').toUpperCase(); if(!CUR_OF[cc]) return;
    forced = cc; if(remember){ try{ localStorage.setItem(CCKEY, cc); }catch(e){} }
  };
  api.get = function(key, cc){ return calc(key, cc || api.cc()); };
  /* Prix affiché, prêt à insérer : « 5 € ». */
  api.text = function(key, cc){ var r = api.get(key, cc); return r ? r.text : ''; };
  /* « 0 € », « 0 FCFA » : la devise du pays, pour un montant libre en FCFA déjà local. */
  api.zero = function(cc){ return fmt(0, curOf(cc || api.cc())); };
  api.symbol = function(cc){ return fx(curOf(cc || api.cc())).symbol; };
  /* Mention sous un bouton « Payer », hors zone FCFA. */
  api.chargeNote = function(key, cc){
    var r = api.get(key, cc); if(!r || r.inFcfa) return '';
    return 'Tu seras débité de ' + r.chargedText + ' (environ ' + r.text + ') : ta banque fait la conversion.';
  };
  /* Rafraîchit depuis la base ; prévient les pages si quelque chose a changé. */
  api.refresh = function(){
    var url = (root.TMDB && root.TMDB.url) || 'https://ucxeopgigfzmuqzuzynr.supabase.co';
    var key = (root.TMDB && root.TMDB.key) || 'sb_publishable_j-dzjIrf_94H7f0Ogg_QkQ_sGlLjW-R';
    var h = {apikey:key};
    return Promise.all([
      fetch(url + '/rest/v1/pricing?select=key,label,fcfa,credits&order=sort', {headers:h}).then(function(r){ return r.ok ? r.json() : null; }),
      fetch(url + '/rest/v1/fx_rates?select=currency,name,symbol,fcfa_per_unit,step&order=sort', {headers:h}).then(function(r){ return r.ok ? r.json() : null; })
    ]).then(function(res){
      if(!res[0] || !res[1]) return false;
      var next = api.fromRows(res[0], res[1]); next.at = Date.now();
      var changed = JSON.stringify(next.prices) !== JSON.stringify(state.prices) || JSON.stringify(next.fx) !== JSON.stringify(state.fx);
      state = next;
      try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){}
      if(changed){ try{ root.dispatchEvent(new CustomEvent('tm-prix')); }catch(e){} }
      return changed;
    }).catch(function(){ return false; });
  };
  root.TMPrix = api;
  api.ready = api.refresh();
})(typeof window !== 'undefined' ? window : globalThis);
