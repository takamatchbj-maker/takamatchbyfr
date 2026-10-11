/* ============================================================
   TakaMatch — pacte d'associés : mise en page du PDF
   ------------------------------------------------------------
   Charte : Source Serif 4 pour le texte (lecture longue),
   Source Serif Display pour les titres, Inter pour les repères.
   L'or (porteur) et le bleu (talents) ne marquent que les
   repères : barre de capital, numéros d'article, signatures.
   pdfmake et les polices ne sont chargés qu'au premier
   téléchargement (≈ 2,5 Mo, puis gardés en cache).
   ============================================================ */
(function(){
  'use strict';
  if(!window.TMPacte) return;
  const TP = window.TMPacte;

  const C = {ink:'#1F1E1B', ink2:'#5D5A52', ink3:'#706C5E', ink4:'#8C8779', line:'#E4E0D6', lineS:'#D2CCBC', paper:'#FAF9F5', paper2:'#F2EFE7',
    blue:'#007CD8', blueD:'#035587', blueL:'#BCD3E8', gold:'#FFD741', goldD:'#C9941A', goldI:'#8A6008', goldBg:'#F2E6BE', ok:'#3A6640'};
  const TAL = ['#007CD8', '#035587', '#3D9FE4', '#0A5C99', '#8DB7DC'];
  const colorOf = (i, role) => role === 'vis' ? C.gold : TAL[i % TAL.length];
  const W = 595.28, H = 841.89, ML = 64, MR = 64, CW = W - ML - MR;

  const LOGO = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380.13 100.91"><defs><linearGradient id="gb" x1="0" y1="50.46" x2="160.47" y2="50.46" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#035587"/><stop offset=".49" stop-color="#007cd8"/><stop offset="1" stop-color="#035587"/></linearGradient><linearGradient id="gg" x1="160.47" y1="50.46" x2="380.13" y2="50.46" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#dd9f22"/><stop offset=".55" stop-color="#ffd741"/><stop offset="1" stop-color="#dd9f22"/></linearGradient></defs><path fill="url(#gb)" fill-rule="evenodd" d="M160.47,100.91L10.24,86.59c-5.63-.54-10.24-5.61-10.24-11.26V25.59c0-5.66,4.61-10.73,10.24-11.26L160.47,0v100.91Z"/><g><path fill="#fff" d="M10.05,26.78l23.16-1.44c2.16-.13,3.93,2.07,3.93,4.93s-1.77,5.24-3.93,5.32l-7.24.26v34.09c0,3.51-2.11,6.22-4.68,6.05-2.54-.17-4.57-3.08-4.57-6.51v-33.3l-6.66.24c-1.9.07-3.42-2.02-3.42-4.66s1.52-4.88,3.42-5Z"/><path fill="#fff" d="M47.69,54.13l3.77.04c0-4.09-.33-6.83-4.21-6.81-4.61.03-5.28,4.38-8.54,4.37-2.3,0-4.17-1.91-4.17-4.95,0-6.47,7.64-8.47,12.82-8.62,8.8-.26,14.36,3.91,14.36,15.97v18.12c0,3.47-2.16,6.28-4.99,6.1-2.51-.17-4.54-2.56-4.88-5.54-2.4,4.01-5.48,5.21-9.37,4.95-5.34-.36-9.73-4.62-9.73-11.83,0-10.64,8.24-11.84,14.94-11.78ZM45.77,69.68c3.74.18,5.74-3.4,5.74-7.91v-.63l-3.28-.08c-2.52-.07-5.97.4-5.97,4.46,0,2.62,1.56,4.07,3.51,4.16Z"/><path fill="#fff" d="M69.3,27.59c0-3.75,2.51-6.93,5.73-7.14,3.21-.22,5.82,2.7,5.82,6.55v26.02l9.89-13.66c.94-1.34,2.35-2.07,3.91-2.11,2.81-.08,5.16,2.53,5.16,5.75,0,1.57-.56,2.91-1.39,4.02l-5.81,7.31,8.87,16.48c.56,1.05.91,2.33.91,3.67,0,3.79-2.73,6.69-6.04,6.48-2.18-.14-4.08-1.58-5.09-3.58l-7.33-14.33-3.1,3.98v5.96c0,3.85-2.61,6.76-5.88,6.55-3.16-.21-5.67-3.39-5.67-7.13V27.59Z"/><path fill="#fff" d="M127.36,54.87l5.36.05c0-4.88-.48-8.15-5.98-8.12-6.53.05-7.47,5.21-12.07,5.19-3.24-.01-5.85-2.26-5.85-5.87,0-7.66,10.75-10.08,18.08-10.3,12.53-.36,20.51,4.6,20.51,19.05v21.73c0,4.16-3.1,7.5-7.16,7.23-3.59-.24-6.48-3.12-6.96-6.69-3.41,4.75-7.79,6.13-13.3,5.76-7.53-.5-13.69-5.62-13.69-14.14,0-12.59,11.58-13.99,21.06-13.91ZM124.64,73.38c5.3.25,8.16-3.99,8.16-9.37v-.76l-4.66-.12c-3.57-.09-8.46.44-8.46,5.27,0,3.11,2.2,4.85,4.96,4.98Z"/></g><path fill="url(#gg)" fill-rule="evenodd" d="M369.61,86.14l-209.14,14.77V0l209.14,14.34c5.92.42,10.52,5.35,10.52,11.29v49.23c0,5.94-4.59,10.87-10.52,11.29Z"/><g><path fill="#fff" d="M177.06,30.34c0-7.14,5.65-12.71,12.45-12.39,5.29.25,9.71,3.91,11.3,8.86l9.32,28.28c.7,2.23,1.16,4.13,1.39,5.54l.38,2.31h.46s.38-2.33.38-2.33c.31-1.41.69-3.23,1.45-5.55l8.96-27.81c1.41-4.42,5.38-7.48,9.87-7.27,5.57.26,10.07,5.52,10.07,11.67v42.28c0,4.02-2.95,7.48-6.63,7.66-3.65.18-6.7-3.05-6.7-7.16v-34.22h-.44s-.58,3.29-.58,3.29c-.37,2.01-1.02,4.59-1.83,7.18l-8.33,26.3c-.98,3.16-3.86,5.68-7.15,5.84-3.4.17-6.29-2.12-7.31-5.25l-9-26.87c-.89-2.72-1.62-5.53-2.02-7.57-.24-1.19-.49-2.39-.65-3.5h-.49s0,36.55,0,36.55c0,4.18-3.28,7.75-7.33,7.94s-7.57-3.11-7.57-7.38V30.34Z"/><path fill="#fff" d="M269.31,54.44l4.33-.03c0-4.35-.38-7.28-4.84-7.31-5.51-.03-6.33,4.79-10.39,4.8-2.94,0-5.36-2.16-5.36-5.65,0-7.43,9.68-9.26,15.88-9.13,9.92.21,15.83,4.76,15.83,17.07v18.5c0,3.54-2.26,6.67-5.29,6.82-2.74.13-5-2.15-5.38-5.29-2.73,4.55-6.32,6.24-10.99,6.47-6.68.33-12.42-3.98-12.42-12.32,0-12.31,10.58-13.87,18.64-13.92ZM267.05,71.45c4.36-.15,6.65-4.13,6.65-8.94v-.68l-3.75.07c-2.96.06-7.12.75-7.12,5.26,0,2.9,1.89,4.37,4.23,4.29Z"/><path fill="#fff" d="M292.56,38.64l2.01.04.24-5.36c.12-3.18,2.35-5.7,4.96-5.6,2.71.11,4.88,2.9,4.88,6.24v4.91l3.34.07c1.91.04,3.41,2.04,3.41,4.36s-1.5,4.36-3.41,4.35h-3.11s0,15.86,0,15.86c0,4.06,1.79,4.83,3.06,5.24,2.35.77,4.02,1.63,4.02,4.09,0,5.2-4.06,5.54-7.65,5.72-7.56.37-10.21-4.28-10.15-13.64l.06-17.33h-1.66c-2.02-.02-3.64-2.07-3.64-4.49s1.62-4.51,3.64-4.46Z"/><path fill="#fff" d="M330.51,38.44c4.9.11,10.83,2.53,10.83,8.77,0,3.07-1.35,4.8-3.61,4.81-3.54.01-3.44-4.51-7.58-4.54-2.87-.01-5.03,3.13-5.03,10.55s2.27,10.5,5.03,10.41c4.17-.14,4.25-5.27,7.84-5.36,2.36-.06,3.81,1.77,3.81,4.97,0,6.37-6.35,9.18-11.7,9.44-10.11.5-15-7.09-15-19.25,0-11.19,5.43-20.02,15.42-19.81Z"/><path fill="#fff" d="M346.62,29.94c0-3.37,2.05-6.04,4.51-5.91,2.44.12,4.43,2.95,4.43,6.26v14.99c1.18-3.29,3.52-6.09,7.59-6,6.3.13,8.66,5.65,8.66,13.51v16.35c0,3.21-1.87,5.94-4.16,6.05-2.31.11-4.23-2.48-4.23-5.74v-14.77c0-5.37-2.16-6.4-3.65-6.41-1.77,0-4.22,1.22-4.22,7.97v13.5c0,3.31-1.99,6.13-4.43,6.25-2.46.12-4.51-2.55-4.51-5.92V29.94Z"/></g></svg>';

  /* ---------- Chargement de pdfmake et des polices ---------- */
  const FONT_FILES = ['SourceSerif4SmText-Regular.ttf', 'SourceSerif4SmText-Semibold.ttf', 'SourceSerif4SmText-It.ttf', 'SourceSerif4SmText-SemiboldIt.ttf',
    'SourceSerif4Display-Semibold.ttf', 'SourceSerif4Display-It.ttf', 'Inter-Regular.ttf', 'Inter-SemiBold.ttf', 'Inter-Medium.ttf'];
  let ready = null;
  function loadScript(src){
    return new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => ko(new Error('Le module PDF n\'a pas pu être chargé. Vérifie ta connexion puis réessaie.')); document.head.appendChild(s); });
  }
  function b64(buf){ let s = ''; const a = new Uint8Array(buf); for(let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); }
  function ensure(){
    if(ready) return ready;
    ready = (async () => {
      if(!window.pdfMake) await loadScript(TP.BASE + 'js/vendor/pdfmake.min.js');
      const vfs = {};
      await Promise.all(FONT_FILES.map(async f => {
        const r = await fetch(TP.BASE + 'assets/fonts/' + f);
        if(!r.ok) throw new Error('Police introuvable : ' + f);
        vfs[f] = b64(await r.arrayBuffer());
      }));
      window.pdfMake.vfs = vfs;
      window.pdfMake.fonts = {
        Serif:{normal:'SourceSerif4SmText-Regular.ttf', bold:'SourceSerif4SmText-Semibold.ttf', italics:'SourceSerif4SmText-It.ttf', bolditalics:'SourceSerif4SmText-SemiboldIt.ttf'},
        Display:{normal:'SourceSerif4Display-Semibold.ttf', bold:'SourceSerif4Display-Semibold.ttf', italics:'SourceSerif4Display-It.ttf', bolditalics:'SourceSerif4Display-It.ttf'},
        Sans:{normal:'Inter-Regular.ttf', bold:'Inter-SemiBold.ttf', italics:'Inter-Medium.ttf', bolditalics:'Inter-SemiBold.ttf'},
      };
    })().catch(e => { ready = null; throw e; });
    return ready;
  }

  /* ---------- Morceaux de mise en page ---------- */
  const kicker = (t, color, extra) => Object.assign({text:t.toUpperCase(), font:'Sans', bold:true, fontSize:7.5, characterSpacing:1.6, color:color || C.ink3}, extra || {});
  const initialsOf = n => String(n || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

  function runs(text, draft){
    return TP.inline(text).map(r => {
      if(r.ph) return draft ? {text:' ' + r.t + ' ', background:C.goldBg, color:C.goldI, font:'Sans', fontSize:8.2}
                            : {text:'……………………', color:C.ink4};
      return r.b ? {text:r.t, bold:true} : {text:r.t};
    });
  }
  function para(text, draft, extra){ return Object.assign({text:runs(text, draft), style:'body'}, extra || {}); }
  function list(items, draft){
    return {stack:items.map(it => ({columns:[{width:14, text:'—', color:C.goldD, font:'Sans', fontSize:9, margin:[0, 1, 0, 0]}, {width:'*', text:runs(it, draft), style:'body', margin:[0, 0, 0, 0]}], columnGap:2, margin:[8, 0, 0, 4]})), margin:[0, 0, 0, 5]};
  }

  function equityBar(rows, w, h){
    let x = 0; const segs = [];
    const tot = rows.reduce((a, r) => a + r.pct, 0) || 1;
    let ti = 0;
    rows.forEach((r, i) => {
      const ww = Math.max(0, w * r.pct / tot);
      const col = r.role === 'Porteur de projet' ? C.gold : TAL[ti++ % TAL.length];
      segs.push({type:'rect', x, y:0, w:Math.max(0, ww - (i < rows.length - 1 ? 2 : 0)), h, color:col});
      x += ww;
    });
    return {canvas:segs};
  }

  function capTable(doc, draft){
    let ti = 0;
    const body = [[
      {text:'ASSOCIÉ', style:'th'}, {text:'QUALITÉ', style:'th'}, {text:'ACTIONS', style:'th', alignment:'right'}, {text:'PART', style:'th', alignment:'right'}]];
    doc.capRows.forEach(r => {
      const col = r.role === 'Porteur de projet' ? C.gold : TAL[ti++ % TAL.length];
      body.push([
        {columns:[{canvas:[{type:'rect', x:0, y:3, w:7, h:7, color:col}], width:12}, {text:runs(r.name, draft), font:'Sans', bold:true, fontSize:9.5, color:C.ink}], columnGap:2},
        {text:r.role, font:'Sans', fontSize:8.5, color:C.ink2, margin:[0, 1, 0, 0]},
        {text:r.n ? TP.nf(r.n) : '—', font:'Sans', fontSize:9.5, alignment:'right', color:C.ink},
        {text:TP.pct(r.pct), font:'Display', fontSize:12, alignment:'right', color:C.ink, margin:[0, -1, 0, 0]}]);
    });
    if(doc.company.shares) body.push([{text:'Total', font:'Sans', bold:true, fontSize:9, color:C.ink2}, '', {text:TP.nf(doc.company.shares), font:'Sans', bold:true, fontSize:9.5, alignment:'right'}, {text:'100' + ' %', font:'Display', fontSize:12, alignment:'right'}]);
    return {stack:[
      {table:{widths:['*', 120, 70, 60], body, headerRows:1}, layout:tableLayout(doc.company.shares ? body.length - 1 : -1)},
      Object.assign(equityBar(doc.capRows, CW, 6), {margin:[0, 8, 0, 0]})], margin:[0, 4, 0, 12], unbreakable:true};
  }
  function rolesTable(doc, draft){
    const body = [[{text:'DOMAINE', style:'th'}, {text:'RESPONSABLE', style:'th'}]];
    doc.roles.forEach(r => body.push([{text:r.domain, font:'Sans', fontSize:9.5, color:C.ink},
      r.who ? {text:r.who, font:'Sans', bold:true, fontSize:9.5} : {text:draft ? [{text:' à décider ', background:C.goldBg, color:C.goldI}] : '……………………', font:'Sans', fontSize:8.5, color:C.ink4}]));
    return {table:{widths:[190, '*'], body, headerRows:1, dontBreakRows:true}, layout:tableLayout(-1), margin:[0, 4, 0, 12], unbreakable:body.length < 9};
  }
  function tableLayout(totalRow){
    return {
      hLineWidth:(i, node) => i === 0 ? 0 : (i === 1 ? 0.8 : (i === node.table.body.length ? 0.8 : 0.4)),
      vLineWidth:() => 0,
      hLineColor:(i, node) => (i === 1 || i === node.table.body.length) ? C.lineS : C.line,
      paddingLeft:i => i === 0 ? 0 : 8, paddingRight:(i, node) => i === node.table.widths.length - 1 ? 0 : 8,
      paddingTop:() => 6, paddingBottom:() => 6,
      fillColor:i => (totalRow > 0 && i === totalRow) ? C.paper2 : null,
    };
  }

  /* ---------- Le document pdfmake ---------- */
  function definition(doc, o){
    o = o || {};
    const draft = o.draft !== false && doc.status !== 'signature' && doc.status !== 'signe';
    const sigs = o.signatures || {};
    const name = doc.company.name || doc.project.title || 'la Société';
    const dated = TP.dateL(doc.date);
    const content = [];

    /* — Couverture — */
    content.push({svg:LOGO, width:122, margin:[0, 0, 0, 0]});
    content.push({canvas:[{type:'rect', x:0, y:0, w:CW * 0.42, h:2.2, color:C.blue}, {type:'rect', x:CW * 0.42, y:0, w:CW * 0.58, h:2.2, color:C.gold}], margin:[0, 22, 0, 0]});
    content.push(kicker('Pacte d\'associés', C.blueD, {margin:[0, 74, 0, 10]}));
    content.push({text:name, font:'Display', fontSize:name.length > 26 ? 28 : 36, lineHeight:1.02, color:C.ink, margin:[0, 0, 0, 12]});
    content.push({text:'Société par actions simplifiée' + (doc.company.state === 'immatriculee' ? '' : ' en formation') + (doc.company.ohada ? ', de droit OHADA' : '') + (doc.company.city ? '\nSiège à ' + doc.company.city + ', ' + doc.company.country : ''),
      font:'Serif', italics:true, fontSize:12.5, color:C.ink2, lineHeight:1.3});
    content.push(kicker('Les associés', C.ink3, {margin:[0, 64, 0, 10]}));
    content.push(equityBar(doc.capRows, CW, 9));
    let ti = 0;
    content.push({table:{widths:['*', 'auto'], body:doc.parties.map(p => {
      const col = p.role === 'vis' ? C.gold : TAL[ti++ % TAL.length];
      const roles = doc.roles.filter(r => r.who && (r.who === p.legal || r.who === p.first)).map(r => r.domain);
      const q = (p.role === 'vis' ? 'Porteur de projet' : 'Associé Talent') + (doc.president === p.uid ? ' · Président' : '') + (roles.length ? ' · ' + roles.join(', ') : '');
      return [{columns:[{width:14, canvas:[{type:'rect', x:0, y:4, w:8, h:8, color:col}]}, {stack:[{text:p.legal || p.first, font:'Sans', bold:true, fontSize:11, color:C.ink}, {text:q, font:'Sans', fontSize:8.5, color:C.ink3, margin:[0, 2, 0, 0]}]}]},
        {text:TP.pct(p.share), font:'Display', fontSize:20, color:C.ink, alignment:'right', margin:[0, 0, 0, 0]}];
    })}, layout:{hLineWidth:(i, n) => i === 0 || i === n.table.body.length ? 0 : 0.5, vLineWidth:() => 0, hLineColor:() => C.line, paddingLeft:() => 0, paddingRight:() => 0, paddingTop:() => 10, paddingBottom:() => 10}, margin:[0, 8, 0, 0]});
    const status = {brouillon:'Projet de travail', commande:'En relecture', relecture:'En relecture juridique', signature:'Prêt à signer', signe:'Signé'}[doc.status] || 'Projet';
    content.push({absolutePosition:{x:ML, y:H - 178}, stack:[
      {canvas:[{type:'line', x1:0, y1:0, x2:CW, y2:0, lineWidth:0.6, lineColor:C.lineS}]},
      {columns:[['Référence', doc.ref], ['Version', String(doc.version)], ['Établi le', dated], ['Statut', status]].map(x => ({stack:[kicker(x[0], C.ink4, {fontSize:6.5}), {text:x[1], font:'Sans', fontSize:9.5, color:C.ink, margin:[0, 4, 0, 0]}]})), margin:[0, 12, 0, 0]},
      {text:'Document établi avec TakaMatch à partir des décisions prises par l\'équipe dans l\'Atelier' + (doc.reviewed ? ', puis relu par un juriste partenaire.' : '.') + (draft ? ' Version de travail, sans valeur d\'engagement avant relecture et signature ; les passages surlignés attendent encore une information.' : ''),
        font:'Serif', italics:true, fontSize:8.5, color:C.ink3, margin:[0, 16, 0, 0], lineHeight:1.3}]});

    /* — Sommaire — */
    content.push({text:'Sommaire', font:'Display', fontSize:22, color:C.ink, pageBreak:'before', margin:[0, 0, 0, 12]});
    const tocRow = (num, title, id, sub) => [
      {text:num, font:'Sans', bold:true, fontSize:8, color:C.blue, margin:[0, 1.5, 0, 0]},
      {text:title, font:'Serif', italics:!!sub, fontSize:9.5, color:C.ink},
      {text:'', pageReference:id, font:'Sans', fontSize:8.5, color:C.ink3, alignment:'right', margin:[0, 1.5, 0, 0]}];
    const toc = [tocRow('', 'Les parties et l\'exposé préalable', 'tm-parties', true)];
    doc.articles.forEach(a => toc.push(tocRow(String(a.n).padStart(2, '0'), a.title, 'tm-art-' + a.id)));
    toc.push(tocRow('', 'Signatures', 'tm-sign', true));
    if(doc.plan.length) toc.push(tocRow('', 'Annexe — Plan d\'action de l\'équipe', 'tm-annexe', true));
    content.push({table:{widths:[26, '*', 30], body:toc}, layout:{hLineWidth:(i, n) => i === 0 || i === n.table.body.length ? 0 : 0.4, vLineWidth:() => 0, hLineColor:() => C.line, paddingLeft:() => 0, paddingRight:() => 0, paddingTop:() => 2.4, paddingBottom:() => 2.4}});

    /* — Parties — */
    content.push(kicker('Entre les soussignés', C.blueD, {pageBreak:'before', id:'tm-parties', margin:[0, 0, 0, 14]}));
    doc.parties.forEach(p => {
      const r = runs(p.text, draft);
      if(r[0] && !r[0].background){ r[0] = Object.assign({}, r[0], {bold:true}); }
      content.push({stack:[{text:r, style:'body', margin:[0, 0, 0, 2]}, {text:p.alias + ' ;', style:'body', italics:true, color:C.ink2}], margin:[0, 0, 0, 10]});
    });
    content.push(para('Ci-après ensemble « les Associés » et individuellement « un Associé ».', draft, {margin:[0, 2, 0, 0]}));
    content.push(kicker('Il a été exposé ce qui suit', C.blueD, {margin:[0, 22, 0, 12]}));
    TP.blocks(doc.preamble).forEach(b => content.push(b.type === 'list' ? list(b.items, draft) : para(b.text, draft)));
    content.push({text:'Ceci exposé, il a été convenu ce qui suit.', font:'Sans', bold:true, fontSize:9.5, color:C.ink, margin:[0, 8, 0, 6]});

    /* — Articles — */
    doc.articles.forEach(a => {
      const tags = [];
      if(draft && a.added) tags.push({text:' CLAUSE AJOUTÉE ', background:C.goldBg, color:C.goldI});
      else if(draft && a.edited) tags.push({text:' MODIFIÉ ', background:C.paper2, color:C.ink2});
      content.push({stack:[
        {text:[{text:'ARTICLE ' + a.n, color:C.blue}].concat(tags.length ? [{text:'   '}].concat(tags) : []), font:'Sans', bold:true, fontSize:7.5, characterSpacing:1.4, margin:[0, 0, 0, 4]},
        {text:a.title, id:'tm-art-' + a.id, font:'Display', fontSize:14.5, color:C.ink, lineHeight:1.1}],
        headlineLevel:1, margin:[0, 20, 0, 8]});
      TP.blocks(a.text).forEach(b => {
        if(b.type === 'table'){ if(a.table === 'capital') content.push(capTable(doc, draft)); else if(a.table === 'roles') content.push(rolesTable(doc, draft)); }
        else if(b.type === 'list') content.push(list(b.items, draft));
        else content.push(para(b.text, draft));
      });
      /* Un tableau oublié dans un texte réécrit : on le remet à la fin. */
      if(a.table && !/\{\{table\}\}/.test(a.text)) content.push(a.table === 'capital' ? capTable(doc, draft) : rolesTable(doc, draft));
    });

    /* — Signatures — */
    const allSigned = doc.parties.length && doc.parties.every(p => sigs[p.uid]);
    content.push({text:'Signatures', font:'Display', fontSize:20, color:C.ink, pageBreak:'before', id:'tm-sign', margin:[0, 0, 0, 10]});
    content.push(para(allSigned
      ? 'Le Pacte a été signé par voie électronique par l\'ensemble des Associés, aux dates indiquées ci-dessous. Le certificat de signature figure en dernière page.'
      : 'Fait à ' + (doc.company.city || '……………………') + ', le ……………………, en ' + (doc.parties.length) + ' exemplaires originaux, dont un remis à chaque Associé.', draft, {margin:[0, 0, 0, 16]}));
    const cells = doc.parties.map((p, i) => {
      const s = sigs[p.uid];
      const col = p.role === 'vis' ? C.gold : C.blue;
      const box = s
        ? {table:{widths:['*'], body:[[{stack:[{text:'Signé électroniquement', font:'Sans', bold:true, fontSize:8.5, color:C.blueD}, {text:'par ' + (s.name || p.legal), font:'Serif', italics:true, fontSize:11, color:C.ink, margin:[0, 6, 0, 0]},
            {text:new Date(s.at).toLocaleString('fr-FR', {dateStyle:'long', timeStyle:'short'}), font:'Sans', fontSize:7.5, color:C.ink3, margin:[0, 6, 0, 0]}, {text:'Empreinte ' + String(s.hash || '').slice(0, 16) + '…', font:'Sans', fontSize:6.5, color:C.ink4, margin:[0, 2, 0, 0]}], margin:[0, 4, 0, 4]}]]},
           layout:{hLineWidth:() => 0.6, vLineWidth:() => 0.6, hLineColor:() => C.blueL, vLineColor:() => C.blueL, paddingLeft:() => 10, paddingTop:() => 8, paddingBottom:() => 8, fillColor:() => '#F3F7FB'}}
        : {canvas:[{type:'rect', x:0, y:0, w:(CW - 24) / 2, h:78, lineWidth:0.6, lineColor:C.lineS, dash:{length:2, space:2}}]};
      return {stack:[
        {canvas:[{type:'rect', x:0, y:0, w:24, h:2.2, color:col}], margin:[0, 0, 0, 8]},
        {text:p.legal || p.first, font:'Sans', bold:true, fontSize:10.5, color:C.ink},
        {text:(p.role === 'vis' ? 'Porteur de projet' : 'Associé Talent') + ' · ' + TP.pct(p.share) + ' du capital', font:'Sans', fontSize:8.5, color:C.ink3, margin:[0, 2, 0, 8]},
        s ? {text:''} : {text:'Signature précédée de la mention manuscrite « Lu et approuvé, bon pour accord »', font:'Serif', italics:true, fontSize:8.5, color:C.ink3, margin:[0, 0, 0, 6]},
        box], margin:[0, 0, 0, 26], unbreakable:true};
    });
    for(let i = 0; i < cells.length; i += 2) content.push({columns:[cells[i], cells[i + 1] || {text:''}], columnGap:24});

    /* — Annexe : plan d'action — */
    if(doc.plan.length){
      content.push({text:'Annexe', font:'Sans', bold:true, fontSize:7.5, characterSpacing:1.6, color:C.blue, pageBreak:'before', id:'tm-annexe', margin:[0, 0, 0, 4]});
      content.push({text:'Plan d\'action de l\'équipe', font:'Display', fontSize:18, color:C.ink, margin:[0, 0, 0, 6]});
      content.push(para('État des objectifs et des tâches inscrits dans l\'Atelier TakaMatch au ' + dated + '. Cette annexe est donnée à titre d\'information : elle n\'engage pas les Associés au-delà du Pacte.', draft, {italics:true, color:C.ink2, margin:[0, 0, 0, 12]}));
      doc.plan.forEach(o => {
        const done = o.tasks.filter(k => k.done).length;
        content.push({text:[{text:o.t, font:'Sans', bold:true, fontSize:10, color:C.ink}, {text:o.tasks.length ? '   ' + done + '/' + o.tasks.length : '', font:'Sans', fontSize:8.5, color:C.ink3}], margin:[0, 8, 0, 4]});
        o.tasks.forEach(k => content.push({columns:[{width:14, text:k.done ? '■' : '□', font:'Sans', fontSize:9, color:k.done ? C.ok : C.ink4}, {text:[{text:k.t, font:'Serif', fontSize:9.5, color:C.ink, decoration:k.done ? undefined : undefined}, {text:(k.who ? ' · ' + k.who : '') + (k.due ? ' · ' + k.due : ''), font:'Sans', fontSize:8, color:C.ink3}]}], margin:[6, 0, 0, 3]}));
      });
    }

    /* — Certificat de signature — */
    const sigList = doc.parties.filter(p => sigs[p.uid]);
    if(sigList.length){
      content.push({text:'Certificat de signature électronique', font:'Display', fontSize:18, color:C.ink, pageBreak:'before', margin:[0, 0, 0, 8]});
      content.push(para('Chaque Associé a signé, depuis son compte TakaMatch, la version ' + doc.version + ' du Pacte identifiée par l\'empreinte numérique ci-dessous. Toute modification du texte, même d\'un caractère, produit une empreinte différente.', false, {margin:[0, 0, 0, 12]}));
      content.push({table:{widths:['*'], body:[[{stack:[kicker('Empreinte SHA-256 du document', C.ink3, {fontSize:6.5}), {text:o.hash || (sigList[0] && sigs[sigList[0].uid].hash) || '', font:'Sans', fontSize:8.5, color:C.ink, margin:[0, 4, 0, 0], characterSpacing:0.3}]}]]},
        layout:{hLineWidth:() => 0, vLineWidth:() => 0, paddingLeft:() => 12, paddingTop:() => 10, paddingBottom:() => 10, fillColor:() => C.paper}, margin:[0, 0, 0, 14]});
      content.push({table:{widths:['*', 150, 90], headerRows:1, body:[[{text:'ASSOCIÉ', style:'th'}, {text:'SIGNÉ LE', style:'th'}, {text:'EMPREINTE', style:'th'}]].concat(sigList.map(p => {
        const s = sigs[p.uid];
        return [{text:[{text:p.legal || p.first, bold:true}, {text:'\nnom saisi : ' + (s.name || '—'), color:C.ink3, fontSize:8}], font:'Sans', fontSize:9.5},
          {text:new Date(s.at).toLocaleString('fr-FR', {dateStyle:'long', timeStyle:'medium'}), font:'Sans', fontSize:9},
          {text:String(s.hash || '').slice(0, 12) + '…', font:'Sans', fontSize:8.5, color:(s.hash === o.hash ? C.ok : C.bad || '#93372E')}];
      }))}, layout:tableLayout(-1)});
    }

    return {
      pageSize:'A4', pageMargins:[ML, 78, MR, 74],
      info:{title:'Pacte d\'associés — ' + name, author:'TakaMatch', subject:'Pacte d\'associés · ' + doc.ref + ' · v' + doc.version, creator:'TakaMatch'},
      watermark:draft ? {text:'PROJET', color:C.goldD, opacity:0.06, font:'Display', bold:false} : undefined,
      background:(page) => page === 1 ? {canvas:[{type:'rect', x:0, y:0, w:W, h:H, color:C.paper}]} : null,
      header:(page) => page === 1 ? null : {margin:[ML, 34, MR, 0], stack:[
        {columns:[{text:'Pacte d\'associés · ' + name, font:'Sans', fontSize:7.5, color:C.ink3}, {text:'Réf. ' + doc.ref + ' · version ' + doc.version, font:'Sans', fontSize:7.5, color:C.ink3, alignment:'right'}]},
        {canvas:[{type:'line', x1:0, y1:6, x2:CW, y2:6, lineWidth:0.5, lineColor:C.line}]}]},
      footer:(page, count) => page === 1 ? null : {margin:[ML, 22, MR, 0], columns:[
        {width:'auto', stack:[{text:'PARAPHES', font:'Sans', bold:true, fontSize:5.8, characterSpacing:1.2, color:C.ink4, margin:[0, 0, 0, 3]},
          {columns:doc.parties.map(p => ({width:30, stack:[{canvas:[{type:'rect', x:0, y:0, w:26, h:15, lineWidth:0.5, lineColor:C.lineS}]}, {text:initialsOf(p.legal || p.first), font:'Sans', fontSize:5.8, color:C.ink4, margin:[0, 2, 0, 0]}]})), columnGap:0}]},
        {width:'*', text:draft ? 'Version de travail — non signée' : (allSigned ? 'Signé électroniquement' : ''), font:'Serif', italics:true, fontSize:7.5, color:C.ink4, alignment:'center', margin:[0, 10, 0, 0]},
        {width:'auto', text:[{text:String(page), color:C.ink}, {text:' / ' + count, color:C.ink4}], font:'Sans', fontSize:8.5, margin:[0, 10, 0, 0]}]},
      pageBreakBefore:(cur, nextOnPage) => cur.headlineLevel === 1 && (nextOnPage.length === 0 || cur.startPosition.top > H - 74 - 96),
      content,
      defaultStyle:{font:'Serif', fontSize:10, color:C.ink, lineHeight:1.36},
      styles:{
        body:{font:'Serif', fontSize:10, lineHeight:1.38, alignment:'justify', color:C.ink, margin:[0, 0, 0, 7]},
        th:{font:'Sans', bold:true, fontSize:6.8, characterSpacing:1.1, color:C.ink3},
      },
    };
  }

  /* ---------- Sorties ---------- */
  async function blob(doc, o){
    await ensure();
    const dd = definition(doc, o);
    return new Promise((ok, ko) => { try{ window.pdfMake.createPdf(dd).getBlob(ok); }catch(e){ ko(e); } });
  }
  function fileName(doc, o){
    const slug = String(doc.company.name || doc.project.title || 'equipe').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'equipe';
    const draft = (o && o.draft === false) || doc.status === 'signature' || doc.status === 'signe' ? '' : '-projet';
    return 'Pacte-associes-' + slug + '-v' + doc.version + draft + (doc.status === 'signe' ? '-signe' : '') + '.pdf';
  }
  async function download(doc, o){
    const b = await blob(doc, o);
    const url = URL.createObjectURL(b), a = document.createElement('a');
    a.href = url; a.download = fileName(doc, o); document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 4000);
    return b;
  }

  Object.assign(TP, {pdf:{ensure, definition, blob, download, fileName}, download});
})();
