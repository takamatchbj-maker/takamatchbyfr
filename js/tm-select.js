/* ============================================================
   TakaMatch · Listes déroulantes « premium »
   ------------------------------------------------------------
   Remplace l'affichage des menus déroulants du navigateur (fond
   bleu, police système) par une liste aux couleurs de TakaMatch,
   partout : outil, inscription, espace équipe.
   · Le <select> d'origine reste en place : sa valeur, ses
     événements « change » et le code existant ne changent pas.
   · Fermé : flèche fine, mêmes bords que les autres champs.
   · Ouvert (souris, clavier) : liste flottante, coche sur le choix
     en cours, groupes, options grisées, recherche par lettre.
   · Sur téléphone et tablette tactile, la roue native du système
     est gardée (plus confortable au doigt), avec le même style fermé.
   ============================================================ */
(function(){
  'use strict';
  if(window.TMSelect) return;

  const CHEV = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238A8578' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E";
  const css = `
select:not([multiple]):not([size]){-webkit-appearance:none;-moz-appearance:none;appearance:none;
  background-image:url("${CHEV}");background-repeat:no-repeat;background-position:right 11px center;background-size:16px 16px;
  padding-right:36px !important;cursor:pointer;text-overflow:ellipsis}
select:not([multiple]):not([size])::-ms-expand{display:none}
select:not([multiple]):not([size]):disabled{cursor:not-allowed;opacity:.6}
select.tm-sel-open{border-color:var(--ink-3,#8A8578) !important;box-shadow:0 0 0 3px var(--a-50,rgba(0,0,0,.06))}
.tm-pop{position:fixed;z-index:2147482000;min-width:180px;max-width:min(440px,calc(100vw - 16px));max-height:320px;overflow:auto;
  background:var(--surface,#fff);color:var(--ink,#1A1815);border:1px solid var(--line,#E4E0D6);border-radius:var(--r-lg,12px);
  box-shadow:var(--shadow-pop,0 18px 40px -12px rgba(26,24,21,.28),0 2px 6px rgba(26,24,21,.08));padding:6px;
  font:inherit;font-size:14px;line-height:1.35;opacity:0;transform:translateY(-4px) scale(.985);transform-origin:top center;
  transition:opacity .14s ease,transform .14s ease;overscroll-behavior:contain}
.tm-pop.up{transform-origin:bottom center;transform:translateY(4px) scale(.985)}
.tm-pop.in{opacity:1;transform:none}
.tm-pop .tm-opt{display:flex;align-items:center;gap:10px;padding:9px 10px 9px 12px;border-radius:var(--r-md,8px);cursor:pointer;
  color:var(--ink-2,#3B3832);user-select:none;-webkit-user-select:none}
.tm-pop .tm-opt span{flex:1;min-width:0}
.tm-pop .tm-opt svg{width:16px;height:16px;flex:0 0 auto;opacity:0;color:var(--ink,#1A1815)}
.tm-pop .tm-opt.act{background:var(--surface-3,#F1EDE4);color:var(--ink,#1A1815)}
.tm-pop .tm-opt[aria-selected="true"]{color:var(--ink,#1A1815);font-weight:600}
.tm-pop .tm-opt[aria-selected="true"] svg{opacity:1}
.tm-pop .tm-opt[aria-disabled="true"]{opacity:.45;cursor:not-allowed}
.tm-pop .tm-grp{padding:10px 12px 4px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-3,#8A8578)}
.tm-pop .tm-grp:first-child{padding-top:4px}
.tm-pop .tm-sep{height:1px;background:var(--line,#E4E0D6);margin:4px 6px}
@media (prefers-reduced-motion:reduce){.tm-pop{transition:none}}`;
  const st = document.createElement('style'); st.id = 'tm-select-css'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const touchOnly = () => matchMedia('(hover: none) and (pointer: coarse)').matches;
  const usable = s => s && s.tagName === 'SELECT' && !s.multiple && !(s.size > 1) && !s.disabled && !s.hasAttribute('data-native');

  let cur = null;   /* {sel, pop, items:[{el, opt}], act} */

  function build(sel){
    const pop = document.createElement('div');
    pop.className = 'tm-pop'; pop.setAttribute('role', 'listbox');
    const lab = sel.getAttribute('aria-label') || (sel.labels && sel.labels[0] && sel.labels[0].textContent.trim()) || '';
    if(lab) pop.setAttribute('aria-label', lab);
    const items = []; let html = '';
    Array.from(sel.children).forEach(ch => {
      if(ch.tagName === 'OPTGROUP'){
        html += '<div class="tm-grp" role="presentation">' + esc(ch.label) + '</div>';
        Array.from(ch.children).forEach(o => { html += optH(o, items.length); items.push(o); });
      } else if(ch.tagName === 'OPTION'){
        if(ch.hidden) return;
        html += optH(ch, items.length); items.push(ch);
      } else if(ch.tagName === 'HR') html += '<div class="tm-sep" role="presentation"></div>';
    });
    pop.innerHTML = html;
    const els = pop.querySelectorAll('.tm-opt');
    return {sel, pop, items:items.map((o, i) => ({opt:o, el:els[i]})), act:-1};
  }
  function optH(o, i){
    const dis = o.disabled || (o.parentNode && o.parentNode.disabled);
    return '<div class="tm-opt" role="option" data-i="' + i + '" aria-selected="' + (o.selected ? 'true' : 'false') + '"' + (dis ? ' aria-disabled="true"' : '') + '>'
      + '<span>' + esc(o.textContent) + '</span>' + CHECK + '</div>';
  }
  function place(){
    if(!cur) return;
    const r = cur.sel.getBoundingClientRect(), pop = cur.pop, vh = innerHeight, vw = innerWidth;
    if(r.bottom < 0 || r.top > vh){ close(); return; }
    pop.style.minWidth = Math.max(180, r.width) + 'px';
    const h = Math.min(pop.scrollHeight, 320), below = vh - r.bottom - 8, above = r.top - 8;
    const up = below < Math.min(h, 220) && above > below;
    pop.classList.toggle('up', up);
    pop.style.top = (up ? Math.max(8, r.top - 6 - Math.min(h, above)) : r.bottom + 6) + 'px';
    pop.style.maxHeight = Math.max(120, Math.min(320, up ? above : below)) + 'px';
    const w = pop.offsetWidth;
    pop.style.left = Math.max(8, Math.min(r.left, vw - w - 8)) + 'px';
  }
  function setAct(i, scroll){
    if(!cur) return;
    const n = cur.items.length; if(!n) return;
    i = Math.max(0, Math.min(n - 1, i));
    if(cur.act >= 0 && cur.items[cur.act]) cur.items[cur.act].el.classList.remove('act');
    cur.act = i; const it = cur.items[i]; it.el.classList.add('act');
    if(scroll){ const p = cur.pop, e = it.el; if(e.offsetTop < p.scrollTop) p.scrollTop = e.offsetTop - 6; else if(e.offsetTop + e.offsetHeight > p.scrollTop + p.clientHeight) p.scrollTop = e.offsetTop + e.offsetHeight - p.clientHeight + 6; }
  }
  const enabled = i => cur && cur.items[i] && cur.items[i].el.getAttribute('aria-disabled') !== 'true';
  function move(from, dir){ let i = from; for(let k = 0; k < cur.items.length; k++){ i += dir; if(i < 0 || i >= cur.items.length) return from; if(enabled(i)) return i; } return from; }

  function open(sel){
    if(cur && cur.sel === sel){ close(); return; }
    close();
    cur = build(sel);
    if(!cur.items.length){ cur = null; return; }
    document.body.appendChild(cur.pop);
    sel.classList.add('tm-sel-open'); sel.setAttribute('aria-expanded', 'true');
    place();
    const s = Math.max(0, sel.selectedIndex >= 0 ? cur.items.findIndex(x => x.opt === sel.options[sel.selectedIndex]) : 0);
    setAct(s, true);
    const show = () => { if(cur) cur.pop.classList.add('in'); }; requestAnimationFrame(show); setTimeout(show, 40);
    cur.pop.addEventListener('mousedown', e => e.preventDefault());   /* le focus reste sur le <select> */
    cur.pop.addEventListener('mousemove', e => { const o = e.target.closest('.tm-opt'); if(o && enabled(+o.dataset.i) && +o.dataset.i !== cur.act) setAct(+o.dataset.i, false); });
    cur.pop.addEventListener('click', e => { const o = e.target.closest('.tm-opt'); if(o && enabled(+o.dataset.i)) choose(+o.dataset.i); });
  }
  function close(){
    if(!cur) return;
    const c = cur; cur = null;
    c.sel.classList.remove('tm-sel-open'); c.sel.setAttribute('aria-expanded', 'false');
    c.pop.classList.remove('in'); setTimeout(() => c.pop.remove(), 140);
  }
  function choose(i){
    if(!cur) return;
    const sel = cur.sel, o = cur.items[i].opt;
    close();
    if(sel.isConnected) try{ sel.focus({preventScroll:true}); }catch(e){}
    if(o.selected) return;
    o.selected = true;
    sel.dispatchEvent(new Event('input', {bubbles:true}));
    sel.dispatchEvent(new Event('change', {bubbles:true}));
  }

  /* Ouverture : souris (pas sur écran tactile) et clavier. */
  document.addEventListener('mousedown', e => {
    if(cur && !cur.pop.contains(e.target) && e.target !== cur.sel){ close(); }
    const sel = e.target.closest && e.target.closest('select');
    if(!usable(sel) || e.button !== 0 || touchOnly()) return;
    e.preventDefault();
    try{ sel.focus({preventScroll:true}); }catch(err){}
    open(sel);
  }, true);
  document.addEventListener('keydown', e => {
    if(cur){
      const k = e.key;
      if(k === 'Escape'){ e.preventDefault(); e.stopPropagation(); close(); return; }
      if(k === 'Tab'){ close(); return; }
      if(k === 'ArrowDown'){ e.preventDefault(); setAct(move(cur.act, 1), true); return; }
      if(k === 'ArrowUp'){ e.preventDefault(); setAct(move(cur.act, -1), true); return; }
      if(k === 'Home' || k === 'PageUp'){ e.preventDefault(); setAct(move(-1, 1), true); return; }
      if(k === 'End' || k === 'PageDown'){ e.preventDefault(); setAct(move(cur.items.length, -1), true); return; }
      if(k === 'Enter' || k === ' '){ e.preventDefault(); e.stopPropagation(); if(enabled(cur.act)) choose(cur.act); return; }
      if(k.length === 1 && /\S/.test(k)){
        e.preventDefault();
        const now = Date.now(); cur.q = (now - (cur.qAt || 0) < 700 ? (cur.q || '') : '') + k.toLowerCase(); cur.qAt = now;
        const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
        const i = cur.items.findIndex((x, j) => enabled(j) && norm(x.opt.textContent).startsWith(norm(cur.q)));
        if(i >= 0) setAct(i, true);
      }
      return;
    }
    const sel = e.target;
    if(!usable(sel) || touchOnly()) return;
    if(e.key === 'Enter' || e.key === ' ' || e.key === 'F4' || (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp'))){
      e.preventDefault(); open(sel);
    }
  }, true);
  addEventListener('scroll', e => { if(cur && !cur.pop.contains(e.target)) place(); }, true);
  addEventListener('resize', () => close());
  addEventListener('blur', () => close());
  /* La page se redessine et le <select> disparaît : on ferme. */
  setInterval(() => { if(cur && !cur.sel.isConnected) close(); }, 400);
  document.addEventListener('focusout', e => { if(cur && e.target === cur.sel) setTimeout(() => { if(cur && document.activeElement !== cur.sel) close(); }, 0); }, true);

  window.TMSelect = {open, close};
})();
