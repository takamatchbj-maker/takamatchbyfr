/* ============================================================
   TakaMatch — TMMorph : mise à jour de l'écran sans le redessiner
   ------------------------------------------------------------
   Avant : chaque clic remplaçait tout le contenu (innerHTML) →
   l'écran clignotait, les fenêtres rejouaient leur animation,
   le défilement et le focus se perdaient.
   Maintenant : on compare le nouveau HTML à ce qui est affiché et
   on ne touche qu'aux éléments qui ont changé. Le reste ne bouge pas.

   TMMorph(el, html)          met à jour le contenu de el
   TMMorph.node(el, html)     met à jour el lui-même (html = un seul élément)

   · Les éléments sont appariés par id (ou data-key), sinon par
     position et balise.
   · Les champs de formulaire prennent la valeur du HTML, comme
     avant ; celui qui a le focus le garde.
   · Les iframes, canvas, vidéos ne sont jamais rechargés si leur
     adresse ne change pas.
   · data-morph-skip sur un élément : son contenu n'est pas touché.
   ============================================================ */
(function(){
  'use strict';
  var KEEP_INNER = {IFRAME:1, CANVAS:1, VIDEO:1, AUDIO:1};

  function key(n){ return n.nodeType === 1 ? (n.id || n.getAttribute('data-key') || '') : ''; }
  function same(a, b){
    if(a.nodeType !== b.nodeType) return false;
    if(a.nodeType !== 1) return true;
    return a.tagName === b.tagName && key(a) === key(b);
  }
  /* Pour chercher un peu plus loin (élément ajouté ou retiré au milieu). */
  function close(a, b){ return same(a, b) && (a.nodeType !== 1 || a.getAttribute('class') === b.getAttribute('class')); }

  function syncAttrs(a, b){
    var i, at;
    for(i = a.attributes.length - 1; i >= 0; i--){ at = a.attributes[i]; if(!b.hasAttribute(at.name)) a.removeAttribute(at.name); }
    for(i = 0; i < b.attributes.length; i++){
      at = b.attributes[i];
      if(a.getAttribute(at.name) !== at.value){
        if(at.namespaceURI) a.setAttributeNS(at.namespaceURI, at.name, at.value); else a.setAttribute(at.name, at.value);
      }
    }
  }

  function syncInput(a, b){
    var type = (a.getAttribute('type') || '').toLowerCase();
    if(type === 'checkbox' || type === 'radio'){ var c = b.hasAttribute('checked'); if(a.checked !== c) a.checked = c; }
    else if(type !== 'file'){ var v = b.getAttribute('value') || ''; if(a.value !== v) a.value = v; }
  }
  function syncSelect(a, b){
    var opts = b.querySelectorAll('option'), idx = -1, i;
    for(i = 0; i < opts.length; i++){ if(opts[i].hasAttribute('selected')){ if(!a.multiple){ idx = i; break; } } }
    if(a.multiple){ for(i = 0; i < a.options.length && i < opts.length; i++) a.options[i].selected = opts[i].hasAttribute('selected'); return; }
    if(idx < 0) idx = a.options.length ? 0 : -1;
    if(a.selectedIndex !== idx) a.selectedIndex = idx;
  }

  function patch(a, b){
    if(a.nodeType !== 1){ if(a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return; }
    syncAttrs(a, b);
    var tag = a.tagName;
    if(KEEP_INNER[tag] || a.hasAttribute('data-morph-skip')) return;
    if(tag === 'TEXTAREA'){ var v = b.textContent; if(a.value !== v) a.value = v; if(a.defaultValue !== v) a.defaultValue = v; return; }
    patchChildren(a, b);
    if(tag === 'INPUT') syncInput(a, b);
    else if(tag === 'SELECT') syncSelect(a, b);
  }

  function patchChildren(a, b){
    var keyed = null, c, n, next, k, match, s, i, cur;
    for(c = a.firstChild; c; c = c.nextSibling){ k = key(c); if(k){ (keyed = keyed || {})[k] = c; } }
    cur = a.firstChild;
    for(n = b.firstChild; n; n = next){
      next = n.nextSibling;
      k = key(n); match = null;
      if(k){
        match = keyed && keyed[k];
        if(match && !same(match, n)) match = null;
        if(match) delete keyed[k];
      } else if(cur && !key(cur) && same(cur, n)){
        match = cur;
      } else {
        for(s = cur, i = 0; s && i < 6; s = s.nextSibling, i++){ if(!key(s) && close(s, n)){ match = s; break; } }
      }
      if(match){
        if(match === cur) cur = cur.nextSibling; else a.insertBefore(match, cur);
        patch(match, n);
      } else {
        a.insertBefore(document.importNode(n, true), cur);
      }
    }
    while(cur){ c = cur.nextSibling; a.removeChild(cur); cur = c; }
  }

  function frag(html){ var t = document.createElement('template'); t.innerHTML = html == null ? '' : String(html); return t.content; }

  function morph(el, html){
    if(!el) return el;
    if(!el.firstChild){ el.innerHTML = html == null ? '' : String(html); return el; }
    patchChildren(el, frag(html));
    return el;
  }
  morph.node = function(el, html){
    if(!el) return el;
    var f = frag(html), b = f.firstElementChild;
    if(!b){ el.remove(); return null; }
    if(el.tagName !== b.tagName){ var nn = document.importNode(b, true); el.replaceWith(nn); return nn; }
    patch(el, b);
    return el;
  };
  window.TMMorph = morph;
})();
