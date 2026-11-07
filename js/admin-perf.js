/* ============================================================
   TakaMatch · Espace équipe · Vitesse réelle des visiteurs
   ------------------------------------------------------------
   Chargé après js/admin-live.js. Ajoute en bas de la Vue
   d'ensemble un tableau des temps vécus par les visiteurs sur
   7 jours (75e percentile, la mesure utilisée par Google),
   page par page. Données : admin_perf (migration 34),
   envoyées par js/perf.js.
   ============================================================ */
(function(){
  'use strict';
  const P = {rows:null, at:0, busy:false};
  const NAMES = {vitrine:'Site vitrine', inscription:'Inscription', app:'Outil (app)', profil:'Fiche publique'};
  /* Seuils Google : bon / à surveiller / lent */
  const TH = {lcp:[2500, 4000], fcp:[1800, 3000], ttfb:[800, 1800], inp:[200, 500], cls:[.1, .25]};
  const cell = (k, v) => {
    if(v == null) return '<td class="hint">—</td>';
    const t = TH[k], c = v <= t[0] ? 'c-ok' : v <= t[1] ? 'c-warn' : 'c-bad';
    const txt = k === 'cls' ? String(v) : v >= 1000 ? (v / 1000).toFixed(1).replace('.', ',') + ' s' : v + ' ms';
    return '<td><span class="chip ' + c + '">' + txt + '</span></td>';
  };
  async function load(){
    if(P.busy || Date.now() - P.at < 5 * 60e3) return;
    P.busy = true;
    try{ P.rows = await TMDB.rpc('admin_perf', {p_days:7}) || []; P.at = Date.now(); }
    catch(e){ P.rows = P.rows || []; }
    finally{ P.busy = false; if(A.view === 'overview' && !A.modal) render(); }
  }
  const _ov = VIEWS.overview;
  VIEWS.overview = function(){
    const h = _ov.apply(this, arguments);
    if(!A.me || !window.TMDB) return h;
    if(!P.rows) load();
    const rows = P.rows || [];
    return h + '<div class="card card-pad" style="margin-top:18px"><div class="row" style="justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap">'
      + '<h3 style="margin:0">Vitesse réelle des visiteurs <span class="hint" style="font-weight:400">· 7 derniers jours</span></h3>'
      + '<span class="hint">75 % des visites sont au moins aussi rapides. Vert = bon, orange = à surveiller, rouge = lent.</span></div>'
      + (rows.length
        ? '<div class="tbl-w" style="margin-top:12px"><table><thead><tr><th>Page</th><th>Visites</th><th title="Affichage du contenu principal">Contenu affiché</th><th title="Premier affichage">1er affichage</th><th title="Réponse du serveur">Serveur</th><th title="Réactivité aux clics">Réactivité</th><th title="Stabilité de la page">Stabilité</th><th>Sur mobile</th><th>Réseau lent (2G/3G)</th></tr></thead><tbody>'
          + rows.map(r => '<tr><td><b>' + esc(NAMES[r.page] || r.page) + '</b></td><td class="mono">' + r.n + '</td>'
            + cell('lcp', r.lcp) + cell('fcp', r.fcp) + cell('ttfb', r.ttfb) + cell('inp', r.inp) + cell('cls', r.cls == null ? null : +r.cls)
            + '<td class="mono">' + (r.mobile_pct || 0) + ' %</td><td class="mono">' + (r.lent_pct || 0) + ' %</td></tr>').join('')
          + '</tbody></table></div>'
        : '<p class="hint" style="margin:10px 0 0">' + (P.busy || !P.rows ? 'Chargement…' : 'Pas encore de mesure : elles arrivent dès que des visiteurs passent sur le site.') + '</p>')
      + '</div>';
  };
})();
