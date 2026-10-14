"use strict";
/* ============================================================
   TakaMatch — icônes des moyens de paiement
   Logos ronds (style kkiapay) dans assets/icons/paiement/.
   Utilisé par la vitrine, l'outil et l'admin.
   Clés = celles de PAY_METHODS (js/pages/app.js) et du serveur.
   ============================================================ */
(function(){
  const DIR = 'assets/icons/paiement/';
  const ICONS = {
    mtn:     {f:['mtn'],               l:'MTN MoMo'},
    moov:    {f:['moov'],              l:'Moov Money'},
    celtiis: {f:['celtiis'],           l:'Celtiis Cash'},
    wave:    {f:['wave'],              l:'Wave'},
    orange:  {f:['orange'],            l:'Orange Money'},
    free:    {f:['free'],              l:'Free Money'},
    mixx:    {f:['mixx'],              l:'Mixx by Yas'},
    nita:    {f:['nita'],              l:'NITA'},
    airtel:  {f:[],                    l:'Airtel Money'},   /* pas encore de logo : pastille texte */
    card:    {f:['mastercard','visa'], l:'Carte bancaire'},
  };
  /* Libellés utilisés dans l'admin et l'historique → clé */
  const BY_LABEL = {'MTN MoMo':'mtn', 'MTN':'mtn', 'Moov Money':'moov', 'Moov':'moov', 'Celtiis Cash':'celtiis', 'Celtiis':'celtiis',
    'Wave':'wave', 'Orange Money':'orange', 'Orange':'orange', 'Free Money':'free', 'Mixx by Yas':'mixx', 'Mixx':'mixx',
    'Airtel Money':'airtel', 'Carte bancaire':'card', 'Carte':'card', 'NITA':'nita'};
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  /* Icône(s) d'un moyen. size en px. La carte affiche Mastercard + Visa. */
  function icon(key, size){
    const x = ICONS[key] || ICONS[BY_LABEL[key]];
    const s = size || 28;
    if(!x) return '<b class="pay-txt">'+esc(key)+'</b>';
    if(!x.f.length) return '<b class="pay-txt '+esc(key)+'" title="'+esc(x.l)+'">'+esc(x.l)+'</b>';
    const imgs = x.f.map(f => '<img class="pay-ico" src="'+DIR+f+'.svg" width="'+s+'" height="'+s+'" alt="'+(f === 'visa' ? 'Visa' : f === 'mastercard' ? 'Mastercard' : esc(x.l))+'" title="'+(f === 'visa' ? 'Visa' : f === 'mastercard' ? 'Mastercard' : esc(x.l))+'" loading="lazy" decoding="async">').join('');
    return x.f.length > 1 ? '<span class="pay-pair" role="img" aria-label="'+esc(x.l)+'">'+imgs+'</span>' : imgs;
  }
  /* Rangée d'icônes : mobile money d'un côté, carte de l'autre. */
  function row(keys, size){
    const mm = keys.filter(k => k !== 'card'), card = keys.includes('card');
    return '<span class="pay-icons">'
      + (mm.length ? '<span class="pay-grp" aria-label="Mobile money">'+mm.map(k => icon(k, size)).join('')+'</span>' : '')
      + (card ? '<span class="pay-grp" aria-label="Carte bancaire">'+icon('card', size)+'</span>' : '')
      + '</span>';
  }
  function keyOf(label){ return ICONS[label] ? label : BY_LABEL[label] || null; }
  window.TMPayIcons = {icon, row, keyOf, ICONS};
})();
