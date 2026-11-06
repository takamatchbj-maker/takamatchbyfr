/* ============================================================
   TakaMatch — pays, indicatifs et villes (partagé par toutes les pages)
   ------------------------------------------------------------
   · Pays couverts : l'Afrique de l'Ouest francophone (Bénin, Burkina
     Faso, Côte d'Ivoire, Guinée, Mali, Niger, Sénégal, Togo) et le Cameroun.
   · Pour chaque pays : indicatif, nombre de chiffres du numéro (sans le
     0 de tête quand le pays en utilise un), exemple de numéro, et la
     liste des villes proposées dans le champ « Ville ».
   · Ajouter une ville : l'écrire dans la liste « v » du pays. Ajouter un
     pays : copier une ligne et l'adapter. Rien d'autre à toucher.
   ============================================================ */
(function(){
  'use strict';
  /* id : code ISO · n : nom · c : indicatif · len : chiffres attendus · ph : exemple
     trunk : chiffre de tête que les gens tapent en national et qu'on retire · v : villes */
  var C = [
    {id:'BJ', n:'Bénin', c:'+229', len:[10], ph:'01 97 00 00 00', v:['Cotonou','Porto-Novo','Abomey-Calavi','Parakou','Djougou','Bohicon','Abomey','Natitingou','Lokossa','Ouidah','Kandi','Malanville','Savalou','Dassa-Zoumè','Pobè','Kétou','Sakété','Allada','Comè','Grand-Popo','Aplahoué','Dogbo','Bembèrèkè','Nikki','Tchaourou','Savè','Banikoara','Tanguiéta','Bassila','Covè','Zagnanado','Sèmè-Kpodji','Adjarra','Avrankou','Ifangni','Toffo','Zè','Tori-Bossito','Glazoué','Ouèssè','Kouandé','Péhunco','Kérou','Copargo','Ouaké','Athiémé','Houéyogbé','Bopa','Klouékanmè','Djakotomey']},
    {id:'TG', n:'Togo', c:'+228', len:[8], ph:'90 00 00 00', v:['Lomé','Sokodé','Kara','Kpalimé','Atakpamé','Dapaong','Tsévié','Aného','Bassar','Mango','Notsé','Badou','Sotouboua','Tabligbo','Vogan','Kandé','Bafilo','Niamtougou','Blitta','Amlamé']},
    {id:'CI', n:"Côte d'Ivoire", c:'+225', len:[10], ph:'07 00 00 00 00', v:['Abidjan','Yamoussoukro','Bouaké','Daloa','San-Pédro','Korhogo','Man','Gagnoa','Divo','Abengourou','Soubré','Anyama','Agboville','Grand-Bassam','Bingerville','Dabou','Odienné','Séguéla','Bondoukou','Ferkessédougou','Dimbokro','Sassandra','Issia','Duékoué','Katiola','Toumodi','Adzopé','Bouaflé','Guiglo','Aboisso']},
    {id:'SN', n:'Sénégal', c:'+221', len:[9], ph:'77 000 00 00', v:['Dakar','Pikine','Guédiawaye','Rufisque','Thiès','Touba','Mbour','Saint-Louis','Kaolack','Ziguinchor','Diourbel','Louga','Tambacounda','Kolda','Fatick','Kaffrine','Kédougou','Matam','Sédhiou','Richard-Toll','Tivaouane','Mbacké','Joal-Fadiouth','Saly','Diamniadio']},
    {id:'BF', n:'Burkina Faso', c:'+226', len:[8], ph:'70 00 00 00', v:['Ouagadougou','Bobo-Dioulasso','Koudougou','Banfora','Ouahigouya','Pouytenga','Kaya','Tenkodogo','Fada N\'Gourma','Dédougou','Houndé','Réo','Gaoua','Ziniaré','Dori','Koupéla','Manga','Kombissiri','Yako','Djibo']},
    {id:'ML', n:'Mali', c:'+223', len:[8], ph:'76 00 00 00', v:['Bamako','Sikasso','Ségou','Mopti','Kayes','Koutiala','Kati','Gao','Tombouctou','Kidal','San','Bougouni','Kita','Koulikoro','Nioro du Sahel','Djenné','Fana','Kadiolo','Bandiagara','Markala']},
    {id:'NE', n:'Niger', c:'+227', len:[8], ph:'90 00 00 00', v:['Niamey','Zinder','Maradi','Agadez','Tahoua','Dosso','Tillabéri','Diffa','Arlit','Birni-N\'Konni','Gaya','Dogondoutchi','Tessaoua','Madaoua','Mirriah','Téra','Filingué','Loga']},
    {id:'GN', n:'Guinée', c:'+224', len:[9], ph:'620 00 00 00', v:['Conakry','Nzérékoré','Kankan','Kindia','Labé','Boké','Mamou','Kissidougou','Guéckédou','Siguiri','Faranah','Kamsar','Dubréka','Coyah','Macenta','Fria','Dalaba','Pita','Kouroussa','Télimélé']},
    {id:'CM', n:'Cameroun', c:'+237', len:[9], ph:'6 70 00 00 00', v:['Douala','Yaoundé','Garoua','Bamenda','Maroua','Bafoussam','Ngaoundéré','Bertoua','Kribi','Limbé','Buea','Ebolowa','Kumba','Nkongsamba','Edéa','Dschang','Foumban','Mbalmayo','Sangmélima','Loum','Kousséri','Meiganga','Bafang','Mbouda','Tiko']}
  ];

  /* Recherche sans accents, sans majuscules, sans tirets. */
  function norm(s){
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’'`\-\s().]+/g, ' ').trim();
  }
  function byId(id){ for(var i = 0; i < C.length; i++) if(C[i].id === id) return C[i]; return null; }

  window.TMGeo = {
    COUNTRIES: C,
    norm: norm,
    country: function(id){ return byId(id) || C[0]; },
    has: function(id){ return !!byId(id); },
    /* Pays triés par nom, pour les listes de choix. */
    sorted: function(){ return C.slice().sort(function(a, b){ return a.n.localeCompare(b.n, 'fr'); }); },
    cities: function(id){ var c = byId(id); return c ? c.v : []; },
    /* Villes d'un pays qui correspondent à ce qui est tapé : début de mot d'abord. */
    search: function(id, q, max){
      var list = this.cities(id), n = norm(q), starts = [], inside = [];
      if(!n) return list.slice(0, max || 8);
      for(var i = 0; i < list.length; i++){
        var v = norm(list[i]);
        if(v.indexOf(n) === 0 || v.indexOf(' ' + n) > -1) starts.push(list[i]);
        else if(v.indexOf(n) > -1) inside.push(list[i]);
      }
      return starts.concat(inside).slice(0, max || 8);
    },
    /* Ville exacte de la liste (même écrite sans accents), ou ''. */
    match: function(id, q){
      var list = this.cities(id), n = norm(q);
      for(var i = 0; i < list.length; i++) if(norm(list[i]) === n) return list[i];
      return '';
    },
    /* « Cotonou, Bénin » → {city:'Cotonou', cc:'BJ'} (pays retrouvé par son nom). */
    split: function(s){
      var str = String(s || ''), k = str.lastIndexOf(','), city = k > -1 ? str.slice(0, k).trim() : str.trim();
      var name = k > -1 ? norm(str.slice(k + 1)) : '', cc = '';
      for(var i = 0; i < C.length; i++) if(norm(C[i].n) === name){ cc = C[i].id; break; }
      return {city: city, cc: cc};
    },
    label: function(city, id){ var c = byId(id); return city ? city + (c ? ', ' + c.n : '') : ''; },
    /* Drapeau : dessin intégré quand on l'a, sinon l'image officielle (flagcdn). */
    flagImg: function(id){
      return '<img class="flag" src="https://flagcdn.com/' + String(id).toLowerCase() + '.svg" alt="" width="20" height="14" loading="lazy" aria-hidden="true">';
    }
  };
})();
