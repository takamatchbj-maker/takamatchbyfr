/* ============================================================
   TakaMatch — pays, indicatifs et villes (partagé par toutes les pages)
   ------------------------------------------------------------
   · Pays couverts : Afrique francophone, plus la Belgique, la Suisse,
     le Canada, la France (diaspora), le Ghana et le Nigeria.
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
    {id:'CM', n:'Cameroun', c:'+237', len:[9], ph:'6 70 00 00 00', v:['Douala','Yaoundé','Garoua','Bamenda','Maroua','Bafoussam','Ngaoundéré','Bertoua','Kribi','Limbé','Buea','Ebolowa','Kumba','Nkongsamba','Edéa','Dschang','Foumban','Mbalmayo','Sangmélima','Loum','Kousséri','Meiganga','Bafang','Mbouda','Tiko']},
    {id:'GA', n:'Gabon', c:'+241', len:[8, 7], ph:'77 00 00 00', trunk:'0', v:['Libreville','Port-Gentil','Franceville','Oyem','Moanda','Mouila','Lambaréné','Tchibanga','Koulamoutou','Makokou','Bitam','Owendo','Akanda','Ntoum','Gamba','Mounana','Ndendé','Lastoursville']},
    {id:'CG', n:'Congo', c:'+242', len:[9], ph:'06 600 0000', v:['Brazzaville','Pointe-Noire','Dolisie','Nkayi','Ouesso','Madingou','Owando','Impfondo','Sibiti','Mossendjo','Kinkala','Gamboma','Djambala','Ewo','Oyo']},
    {id:'CD', n:'RD Congo', c:'+243', len:[9], ph:'81 000 0000', trunk:'0', v:['Kinshasa','Lubumbashi','Mbuji-Mayi','Kisangani','Kananga','Bukavu','Goma','Kolwezi','Likasi','Tshikapa','Kikwit','Mbandaka','Matadi','Uvira','Butembo','Beni','Bunia','Kindu','Kalemie','Boma','Mwene-Ditu','Gemena','Isiro','Kamina','Bandundu','Moanda','Kenge','Lisala','Gbadolite','Inongo']},
    {id:'CF', n:'Centrafrique', c:'+236', len:[8], ph:'70 00 00 00', v:['Bangui','Bimbo','Berbérati','Carnot','Bambari','Bouar','Bossangoa','Bria','Bangassou','Nola','Kaga-Bandoro','Sibut','Mbaïki','Bozoum','Paoua','Ndélé','Obo','Birao']},
    {id:'TD', n:'Tchad', c:'+235', len:[8], ph:'66 00 00 00', v:['N\'Djamena','Moundou','Abéché','Sarh','Kélo','Koumra','Pala','Am Timan','Bongor','Mongo','Doba','Ati','Laï','Oum Hadjer','Biltine','Faya-Largeau','Massakory','Moussoro','Mao','Fada']},
    {id:'GQ', n:'Guinée équatoriale', c:'+240', len:[9], ph:'222 000 000', v:['Malabo','Bata','Ebebiyín','Mongomo','Aconibe','Evinayong','Luba','Añisok','Mbini','Cogo','Riaba','Nsok','Ciudad de la Paz']},
    {id:'BI', n:'Burundi', c:'+257', len:[8], ph:'79 00 00 00', v:['Bujumbura','Gitega','Ngozi','Muyinga','Ruyigi','Kayanza','Rumonge','Makamba','Bururi','Kirundo','Cibitoke','Muramvya','Mwaro','Rutana','Karuzi','Cankuzo','Bubanza','Kiganda']},
    {id:'RW', n:'Rwanda', c:'+250', len:[9], ph:'788 000 000', trunk:'0', v:['Kigali','Butare (Huye)','Gisenyi (Rubavu)','Ruhengeri (Musanze)','Muhanga','Byumba (Gicumbi)','Cyangugu (Rusizi)','Nyagatare','Rwamagana','Kibuye (Karongi)','Nyanza','Kayonza','Kibungo (Ngoma)','Nyamata (Bugesera)','Kirehe']},
    {id:'DJ', n:'Djibouti', c:'+253', len:[8], ph:'77 00 00 00', v:['Djibouti','Ali Sabieh','Dikhil','Tadjourah','Obock','Arta','Holhol','Dorra','Balho','Galafi']},
    {id:'KM', n:'Comores', c:'+269', len:[7], ph:'321 00 00', v:['Moroni','Mutsamudu','Fomboni','Domoni','Tsimbeo','Mitsamiouli','Mbéni','Ouani','Sima','Foumbouni','Iconi','Mirontsy']},
    {id:'MG', n:'Madagascar', c:'+261', len:[9], ph:'32 00 000 00', trunk:'0', v:['Antananarivo','Toamasina','Antsirabe','Fianarantsoa','Mahajanga','Toliara','Antsiranana','Ambovombe','Antanifotsy','Ambatondrazaka','Morondava','Nosy Be','Sambava','Manakara','Ambositra','Farafangana','Moramanga','Fort-Dauphin (Taolagnaro)','Ambanja','Maroantsetra','Ambalavao','Miarinarivo']},
    {id:'SC', n:'Seychelles', c:'+248', len:[7], ph:'2 510 123', v:['Victoria','Anse Boileau','Beau Vallon','Anse Royale','Takamaka','Cascade','Baie Lazare','Grand Anse Praslin','Baie Sainte Anne','La Digue','Mont Fleuri','Bel Ombre']},
    {id:'MU', n:'Maurice', c:'+230', len:[8, 7], ph:'5 251 2345', v:['Port-Louis','Beau Bassin-Rose Hill','Vacoas-Phoenix','Curepipe','Quatre Bornes','Triolet','Goodlands','Centre de Flacq','Mahébourg','Saint-Pierre','Bel Air Rivière Sèche','Le Hochet','Grand Baie','Rose Belle','Rivière du Rempart','Ébène']},
    {id:'MR', n:'Mauritanie', c:'+222', len:[8], ph:'22 00 00 00', v:['Nouakchott','Nouadhibou','Kiffa','Kaédi','Zouérate','Rosso','Atar','Néma','Sélibaby','Aleg','Boghé','Tidjikja','Akjoujt','Aïoun el-Atrous','Guérou']},
    {id:'MA', n:'Maroc', c:'+212', len:[9], ph:'6 00 00 00 00', trunk:'0', v:['Casablanca','Rabat','Fès','Marrakech','Tanger','Agadir','Meknès','Oujda','Kénitra','Tétouan','Salé','Témara','Safi','Mohammédia','El Jadida','Béni Mellal','Nador','Taza','Settat','Khouribga','Berrechid','Khémisset','Laâyoune','Dakhla','Essaouira','Ouarzazate','Errachidia','Larache','Guelmim','Ifrane']},
    {id:'DZ', n:'Algérie', c:'+213', len:[9], ph:'5 55 00 00 00', trunk:'0', v:['Alger','Oran','Constantine','Annaba','Blida','Batna','Sétif','Djelfa','Sidi Bel Abbès','Biskra','Tébessa','Tlemcen','Béjaïa','Tiaret','Tizi Ouzou','Bordj Bou Arréridj','Chlef','Skikda','Médéa','Mostaganem','Ouargla','Béchar','El Oued','Ghardaïa','Jijel','Tamanrasset','Boumerdès','Mascara','Laghouat','Guelma']},
    {id:'TN', n:'Tunisie', c:'+216', len:[8], ph:'20 000 000', v:['Tunis','Sfax','Sousse','Kairouan','Bizerte','Gabès','Ariana','Gafsa','Monastir','Ben Arous','Kasserine','Médenine','Nabeul','Tataouine','Béja','Le Kef','Mahdia','Sidi Bouzid','Jendouba','Tozeur','Hammamet','Djerba (Houmt Souk)','Zarzis','La Marsa','Manouba','Siliana','Zaghouan','Kébili']},
    {id:'BE', n:'Belgique', c:'+32', len:[9, 8], ph:'470 00 00 00', trunk:'0', v:['Bruxelles','Anvers','Gand','Charleroi','Liège','Bruges','Namur','Louvain','Mons','Malines','Alost','La Louvière','Courtrai','Hasselt','Ostende','Tournai','Seraing','Verviers','Mouscron','Louvain-la-Neuve','Ottignies','Wavre','Arlon','Nivelles','Waterloo','Ixelles','Schaerbeek','Anderlecht','Uccle','Molenbeek-Saint-Jean']},
    {id:'CH', n:'Suisse', c:'+41', len:[9], ph:'78 000 00 00', trunk:'0', v:['Genève','Lausanne','Zurich','Berne','Bâle','Fribourg','Neuchâtel','Sion','Lucerne','Lugano','Saint-Gall','Winterthour','Bienne','Montreux','Vevey','Yverdon-les-Bains','La Chaux-de-Fonds','Nyon','Morges','Delémont','Renens','Martigny','Monthey','Carouge','Thoune']},
    {id:'CA', n:'Canada', c:'+1', len:[10], ph:'514 000 0000', trunk:'1', v:['Montréal','Québec','Toronto','Ottawa','Gatineau','Laval','Longueuil','Sherbrooke','Trois-Rivières','Lévis','Saguenay','Terrebonne','Brossard','Drummondville','Saint-Jérôme','Granby','Rimouski','Moncton','Edmonton','Calgary','Vancouver','Winnipeg','Halifax','Mississauga','Hamilton','Regina','Saskatoon','Victoria','Kingston','Sudbury']},
    {id:'FR', n:'France', c:'+33', len:[9], ph:'6 12 34 56 78', trunk:'0', v:['Paris','Marseille','Lyon','Toulouse','Nice','Nantes','Montpellier','Strasbourg','Bordeaux','Lille','Rennes','Reims','Toulon','Saint-Étienne','Le Havre','Grenoble','Dijon','Angers','Nîmes','Villeurbanne','Clermont-Ferrand','Le Mans','Aix-en-Provence','Brest','Tours','Amiens','Limoges','Metz','Perpignan','Orléans','Rouen','Mulhouse','Caen','Nancy','Saint-Denis','Argenteuil','Montreuil','Créteil','Évry-Courcouronnes','Cergy']},
    {id:'GH', n:'Ghana', c:'+233', len:[9], ph:'24 000 0000', trunk:'0', v:['Accra','Kumasi','Tamale','Takoradi','Sekondi','Cape Coast','Tema','Sunyani','Ho','Koforidua','Obuasi','Techiman','Wa','Bolgatanga','Teshie','Ashaiman','Madina','Kasoa','Nkawkaw','Winneba']},
    {id:'NG', n:'Nigeria', c:'+234', len:[10], ph:'803 000 0000', trunk:'0', v:['Lagos','Abuja','Kano','Ibadan','Port Harcourt','Benin City','Kaduna','Aba','Jos','Ilorin','Onitsha','Enugu','Abeokuta','Warri','Owerri','Calabar','Uyo','Akure','Maiduguri','Sokoto','Zaria','Ogbomosho','Oshogbo','Asaba','Makurdi']}
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
