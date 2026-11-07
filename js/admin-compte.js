/* ============================================================
   TakaMatch · Espace équipe · Suppression de compte
   ------------------------------------------------------------
   Chargé après js/admin-live.js. Réservé au super admin principal
   (contrôle côté base : is_owner, migration 32).
   Deux possibilités sur la fiche utilisateur :
   · Anonymiser : nom, e-mail, téléphone, photo, bio effacés ;
     conversations, Ateliers et pactes conservés ;
   · Supprimer définitivement : tout le compte est effacé.
   Les fichiers (photo, couverture, pièces d'identité) sont retirés
   du stockage dans les deux cas.
   ============================================================ */
(function(){
  'use strict';
  const OWNER = 'takamatchbj@gmail.com';
  const isOwner = () => !!(A.me && A.me.role === 'super' && String(A.me.email || '').toLowerCase() === OWNER);
  const ST = {mode:'anonymize', busy:false};

  /* Statut « Anonymisé » */
  const _statusChip = statusChip;
  statusChip = function(u){ return u && u.status === 'deleted' ? '<span class="chip">Anonymisé</span>' : _statusChip.apply(this, arguments); };

  /* Bouton sur la fiche */
  const _userDrawer = userDrawer;
  userDrawer = function(u){
    const d = _userDrawer.apply(this, arguments);
    if(!d || !u) return d;
    if(u.status === 'deleted'){
      d.foot = String(d.foot || '').replace(/<button[^>]*data-act="(u-restore|bc-to|u-unverify)"[^>]*>[\s\S]*?<\/button>/g, '');
      d.body ='<div class="note-box" style="margin-bottom:14px">Compte anonymisé : il ne peut plus se connecter. Ses conversations, Ateliers et pactes sont conservés.</div>' + d.body;
    }
    if(isOwner() && !u.staff)
      d.foot = (d.foot || '') + '<span class="grow"></span><button class="btn btn-bad-ghost" data-act="del-open" data-id="' + u.id + '">' + ic('x') + 'Supprimer le compte</button>';
    return d;
  };

  function opt(v, title, text){
    const on = ST.mode === v;
    return '<button type="button" class="card" data-act="del-mode" data-v="' + v + '" aria-pressed="' + on + '" style="display:block;width:100%;text-align:left;padding:14px 16px;cursor:pointer;'
      + 'border:1.5px solid ' + (on ? (v === 'delete' ? 'var(--bad)' : 'var(--ink)') : 'var(--line)') + ';border-radius:12px;background:var(--bg-1, #fff);margin-bottom:10px">'
      + '<b style="display:block;margin-bottom:4px">' + title + '</b><span class="hint">' + text + '</span></button>';
  }
  function open(u){
    modal('<h2>Supprimer @' + esc(u.handle) + ' ?</h2>'
      + '<p>Choisis ce qui doit arriver à ce compte. Action irréversible, inscrite au journal d\'audit.</p>'
      + opt('anonymize', 'Anonymiser', 'Nom, e-mail, téléphone, photo et signature effacés. Le compte ne peut plus se connecter. Les conversations, Ateliers et pactes restent intacts, au nom de « Membre supprimé ».')
      + opt('delete', 'Supprimer définitivement', 'Tout est effacé : profil, projets, messages envoyés, invitations, matchs, places dans les pactes. Les paiements restent dans la comptabilité, sans nom.')
      + '<label class="lbl" for="delC" style="display:block;margin:6px 0">Pour confirmer, recopie le pseudo <b>' + esc(u.handle) + '</b></label>'
      + '<input class="inp" id="delC" autocomplete="off" spellcheck="false" placeholder="' + esc(u.handle) + '">'
      + '<div class="acts"><button class="btn btn-ghost" data-act="close-modal">Annuler</button>'
      + '<button class="btn btn-bad" data-act="del-go" data-id="' + u.id + '"' + (ST.busy ? ' disabled' : '') + '>'
      + (ST.mode === 'delete' ? 'Supprimer définitivement' : 'Anonymiser le compte') + '</button></div>');
    setTimeout(() => { const i = $('#delC'); if(i) i.focus(); }, 30);
  }

  async function go(u){
    const conf = (($('#delC') || {}).value || '').trim();
    if(conf.replace(/^@/, '').toLowerCase() !== u.handle.toLowerCase()) return toast('Recopie exactement le pseudo ' + u.handle + '.', 'bad');
    ST.busy = true;
    const b = $('[data-act="del-go"]'); if(b){ b.disabled = true; b.textContent = 'En cours…'; }
    try{
      const r = await TMDB.rpc('admin_delete_account', {p_user:u.id, p_mode:ST.mode, p_confirm:conf});
      const by = {};
      ((r && r.files) || []).forEach(f => { (by[f.bucket] = by[f.bucket] || []).push(f.name); });
      let left = 0;
      for(const k of Object.keys(by)){ try{ await TMDB.removeFiles(k, by[k]); }catch(e){ left += by[k].length; } }
      A.modal = null; A.drawer = null; paintOverlay();
      if(window.LIVE && LIVE.load) await LIVE.load(true);
      render();
      toast((r.mode === 'delete' ? 'Compte @' + u.handle + ' supprimé définitivement.' : 'Compte anonymisé (@' + r.handle + ').')
        + (left ? ' ' + left + ' fichier(s) à retirer à la main dans le stockage.' : ''), left ? 'bad' : undefined);
    }catch(e){
      toast(e.message || 'Suppression impossible.', 'bad');
      if(b){ b.disabled = false; b.textContent = ST.mode === 'delete' ? 'Supprimer définitivement' : 'Anonymiser le compte'; }
    }finally{ ST.busy = false; }
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-act]'); if(!t) return;
    const a = t.dataset.act; if(!/^del-/.test(a)) return;
    e.preventDefault(); e.stopPropagation();
    if(!isOwner()) return toast('Réservé au super admin principal.', 'bad');
    const u = userBy(t.dataset.id || (($('[data-act="del-go"]') || {}).dataset || {}).id);
    if(!u) return;
    if(a === 'del-open'){ ST.mode = 'anonymize'; open(u); }
    else if(a === 'del-mode'){ const c = ($('#delC') || {}).value || ''; ST.mode = t.dataset.v === 'delete' ? 'delete' : 'anonymize'; open(u); const i = $('#delC'); if(i) i.value = c; }
    else if(a === 'del-go' && !ST.busy) go(u);
  }, true);
})();
