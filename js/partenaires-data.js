/* ============================================================
   TakaMatch — Partenaires : centres de coworking et organismes
   d'appui à l'entrepreneuriat, pays par pays
   ------------------------------------------------------------
   · Chargé par l'outil (app.html). Sert de catalogue de départ :
     dès que la table Supabase « partenaires » est remplie, c'est
     elle qui fait foi (modifiable dans l'admin, module Partenaires).
   · Chaque membre voit les structures de SON pays (code ISO de
     js/geo.js), celles de sa ville en premier.
   · Champs d'une fiche :
       id    identifiant stable (pays-nom)
       k     catégorie : 'cw' = coworking · 'ap' = appui à l'entrepreneuriat
       t     type précis (voir TYPES plus bas)
       n     nom
       cc    pays (code ISO) · v ville (telle qu'écrite dans js/geo.js)
       q     quartier ou adresse courte (facultatif)
       nat   true = agit dans tout le pays (agence, fonds, guichet…)
       s     accroche (fiche rapide, une ligne)
       d     présentation (fiche détaillée)
       sv    ce que la structure propose (liste)
       pr    stades accompagnés : idee · lancement · croissance
       acc   comment y accéder
       web   site officiel (laisser vide si on n'en est pas sûr :
             la fiche propose alors une recherche web et la carte)
       off   true = partenaire officiel TakaMatch (badge doré)
   · Informations indicatives : à confirmer auprès de chaque
     structure avant le lancement public. Les membres peuvent
     signaler une erreur depuis la fiche détaillée.
   ============================================================ */
(function(){
  'use strict';

  var TYPES = {
    cowork:   {k:'cw', l:'Espace de coworking'},
    hub:      {k:'cw', l:'Coworking et incubation'},
    fablab:   {k:'cw', l:'Fablab'},
    affaires: {k:'cw', l:"Centre d'affaires"},
    incub:    {k:'ap', l:'Incubateur'},
    accel:    {k:'ap', l:'Accélérateur'},
    agence:   {k:'ap', l:'Agence publique'},
    guichet:  {k:'ap', l:"Création d'entreprise"},
    fonds:    {k:'ap', l:'Financement'},
    reseau:   {k:'ap', l:'Réseau et mentorat'},
    formation:{k:'ap', l:'Formation'}
  };

  /* Textes communs, pour ne pas répéter la même phrase cent fois. */
  var ACC_LIEU = "Passe sur place ou écris-leur pour une visite : formules et tarifs se demandent directement.";
  var ACC_PROG = "Les places se gagnent sur appel à candidatures : surveille leurs annonces et prépare un dossier d'équipe.";
  var ACC_PUB  = "Service public : renseigne-toi au guichet ou sur le site officiel avant de constituer ton dossier.";
  var SV_COWORK = ['Postes de travail à la journée ou au mois', 'Salles de réunion', 'Connexion internet', 'Domiciliation possible'];
  var SV_IWG = ['Coworking à la journée ou au mois', 'Bureaux privés', 'Salles de réunion', 'Domiciliation'];

  var L = [
  /* ---------------- Bénin ---------------- */
  {id:'bj-semecity', k:'ap', t:'agence', n:'Sèmè City', cc:'BJ', v:'Cotonou', nat:true,
   s:"La cité internationale de l'innovation et du savoir du Bénin.",
   d:"Sèmè City est le projet public béninois dédié à l'innovation, à la formation et à l'entrepreneuriat. Son agence de développement porte des programmes d'incubation, des formations et des espaces pour les jeunes entreprises, avec un premier campus à Cotonou.",
   sv:["Programmes d'incubation et d'accélération", 'Formations aux métiers du numérique et de l\'entrepreneuriat', 'Espaces de travail', 'Événements et mises en relation'],
   pr:['idee','lancement','croissance'], acc:ACC_PROG, web:'https://semecity.bj'},
  {id:'bj-etrilabs', k:'ap', t:'incub', n:'Etrilabs', cc:'BJ', v:'Cotonou',
   s:"Pionnier de l'accompagnement des startups au Bénin.",
   d:"Etrilabs est l'une des premières structures d'accompagnement de l'entrepreneuriat innovant au Bénin. Elle anime des programmes d'incubation et d'accélération et a lancé des événements dédiés au financement des jeunes startups.",
   sv:['Incubation et accélération', 'Mentorat', 'Préparation à la levée de fonds', 'Événements de l\'écosystème'],
   pr:['idee','lancement'], acc:ACC_PROG},
  {id:'bj-blolab', k:'cw', t:'fablab', n:'BloLab', cc:'BJ', v:'Cotonou',
   s:'Le premier fablab du Bénin, pour prototyper à petit coût.',
   d:"BloLab est un fablab : un atelier de fabrication numérique ouvert, avec des machines (impression 3D, découpe, électronique) et une communauté de makers. Idéal pour transformer une idée de produit physique en prototype.",
   sv:['Machines de fabrication numérique', 'Ateliers et formations', 'Accompagnement au prototypage', 'Communauté de makers'],
   pr:['idee','lancement'], acc:ACC_LIEU},
  {id:'bj-uac-startup-valley', k:'ap', t:'incub', n:'UAC Startup Valley', cc:'BJ', v:'Abomey-Calavi',
   s:"L'incubateur de l'Université d'Abomey-Calavi.",
   d:"Premier incubateur installé au sein d'une université nationale au Bénin. Il accompagne étudiants et jeunes diplômés qui veulent transformer un projet en entreprise.",
   sv:['Incubation', 'Formations à l\'entrepreneuriat', 'Mentorat', 'Accès au réseau universitaire'],
   pr:['idee','lancement'], acc:ACC_PROG},
  {id:'bj-sens', k:'ap', t:'incub', n:'SENS Bénin', cc:'BJ', v:'Parakou',
   s:"L'accompagnement des entrepreneurs dans le nord du Bénin.",
   d:"Solidarités Entreprises Nord Bénin est la première structure d'appui à l'entrepreneuriat implantée hors de la capitale. Elle accompagne les porteurs de projet du nord du pays.",
   sv:['Accompagnement de porteurs de projet', 'Formations', 'Suivi des jeunes entreprises'],
   pr:['idee','lancement'], acc:ACC_PROG},
  {id:'bj-regus', k:'cw', t:'affaires', n:'Regus Cotonou', cc:'BJ', v:'Cotonou',
   s:"Bureaux équipés et coworking d'un réseau international.",
   d:"Centre d'affaires du réseau international IWG. Pratique pour un rendez-vous client, une salle de réunion ponctuelle ou une adresse professionnelle.",
   sv:SV_IWG, pr:['lancement','croissance'], acc:ACC_LIEU, web:'https://www.regus.com'},
  {id:'bj-adpme', k:'ap', t:'agence', n:'ADPME', cc:'BJ', v:'Cotonou', nat:true,
   s:'Agence de développement des petites et moyennes entreprises.',
   d:"L'agence publique béninoise chargée d'appuyer les PME : information, formation, mise à niveau et accès aux programmes de soutien. Elle publie aussi des guides sur l'écosystème des startups.",
   sv:['Information et orientation', 'Formations et mise à niveau', 'Accès aux programmes d\'appui', 'Guides pratiques'],
   pr:['lancement','croissance'], acc:ACC_PUB, web:'https://adpme.bj'},
  {id:'bj-apiex', k:'ap', t:'guichet', n:'APIEx · monentreprise.bj', cc:'BJ', v:'Cotonou', nat:true,
   s:'Créer ton entreprise en ligne, sans te déplacer.',
   d:"L'Agence de promotion des investissements et des exportations gère la création d'entreprise au Bénin, notamment par la plateforme en ligne monentreprise.bj : immatriculation, formalités et suivi du dossier.",
   sv:["Création d'entreprise en ligne", 'Formalités et immatriculation', 'Information aux investisseurs'],
   pr:['lancement'], acc:"Le dossier se dépose sur monentreprise.bj ; les statuts et le pacte d'associés de ton équipe te seront utiles.", web:'https://monentreprise.bj'},
  {id:'bj-anpe', k:'ap', t:'agence', n:'ANPE Bénin', cc:'BJ', v:'Cotonou', nat:true,
   s:"Agence nationale pour l'emploi : programmes d'auto-emploi et formations.",
   d:"L'Agence nationale pour l'emploi accompagne aussi celles et ceux qui créent leur propre activité, avec des formations et des programmes dédiés.",
   sv:["Programmes d'appui à l'auto-emploi", 'Formations', 'Orientation'],
   pr:['idee','lancement'], acc:ACC_PUB},
  {id:'bj-bban', k:'ap', t:'reseau', n:'Benin Business Angels Network', cc:'BJ', v:'Cotonou', nat:true,
   s:'Réseau de business angels qui investissent dans les jeunes entreprises.',
   d:"Le BBAN réunit des investisseurs privés qui financent et conseillent des startups béninoises à leurs débuts.",
   sv:['Investissement en amorçage', 'Mentorat par des investisseurs', 'Sessions de présentation de projets'],
   pr:['lancement','croissance'], acc:"Prépare une présentation claire de ton équipe et de ta traction avant de les solliciter."},

  /* ---------------- Togo ---------------- */
  {id:'tg-woelab', k:'cw', t:'hub', n:'WoeLab', cc:'TG', v:'Lomé',
   s:'Le tiers-lieu technologique de Lomé, ouvert à tous.',
   d:"WoeLab est un espace de démocratie technologique : fablab, coworking et incubateur à la fois. Il a vu naître plusieurs projets connus et accueille une communauté de jeunes innovateurs.",
   sv:['Espace de travail partagé', 'Fablab', 'Incubation de projets', 'Communauté et événements'],
   pr:['idee','lancement'], acc:ACC_LIEU},
  {id:'tg-regus', k:'cw', t:'affaires', n:'Regus et Spaces Lomé', cc:'TG', v:'Lomé',
   s:"Coworking et bureaux équipés d'un réseau international.",
   d:"Centres d'affaires du réseau international IWG à Lomé. Pratiques pour une salle de réunion, un poste à la journée ou une adresse professionnelle.",
   sv:SV_IWG, pr:['lancement','croissance'], acc:ACC_LIEU, web:'https://www.regus.com'},
  {id:'tg-cfe', k:'ap', t:'guichet', n:'CFE Togo', cc:'TG', v:'Lomé', nat:true,
   s:"Le centre de formalités des entreprises : créer ta société en un lieu.",
   d:"Le Centre de formalités des entreprises réunit en un guichet unique les démarches de création, de modification et de cessation d'entreprise au Togo.",
   sv:["Création d'entreprise", 'Formalités en un seul guichet', 'Information juridique de base'],
   pr:['lancement'], acc:ACC_PUB, web:'https://cfetogo.tg'},
  {id:'tg-faiej', k:'ap', t:'fonds', n:'FAIEJ', cc:'TG', v:'Lomé', nat:true,
   s:"Fonds d'appui aux initiatives économiques des jeunes.",
   d:"Le FAIEJ forme, accompagne et finance les jeunes entrepreneurs togolais, avec un suivi après le financement.",
   sv:['Formation à l\'entrepreneuriat', 'Accompagnement', 'Financement de projets de jeunes'],
   pr:['idee','lancement'], acc:ACC_PUB},
  {id:'tg-anpgf', k:'ap', t:'fonds', n:'ANPGF', cc:'TG', v:'Lomé', nat:true,
   s:'Garantie de prêts pour les PME et PMI.',
   d:"L'Agence nationale de promotion et de garantie de financement des PME/PMI facilite l'accès au crédit bancaire en garantissant une partie des prêts.",
   sv:['Garantie de crédit', 'Accompagnement des PME', 'Mise en relation avec les banques'],
   pr:['croissance'], acc:ACC_PUB},
  {id:'tg-anpe', k:'ap', t:'agence', n:'ANPE Togo', cc:'TG', v:'Lomé', nat:true,
   s:"Agence nationale pour l'emploi : formations et auto-emploi.",
   d:"L'ANPE accompagne les demandeurs d'emploi et les jeunes qui veulent créer leur activité.",
   sv:['Programmes d\'auto-emploi', 'Formations', 'Orientation'], pr:['idee','lancement'], acc:ACC_PUB},

  /* ---------------- Côte d'Ivoire ---------------- */
  {id:'ci-impacthub', k:'cw', t:'hub', n:'Impact Hub Abidjan', cc:'CI', v:'Abidjan',
   s:"Coworking et programmes pour les entrepreneurs à impact.",
   d:"Membre du réseau mondial Impact Hub, l'espace abidjanais réunit coworking, programmes d'incubation et d'accélération et événements, avec un accent sur les projets à impact social.",
   sv:['Coworking', 'Incubation et accélération', 'Événements', 'Accès à un réseau international'],
   pr:['idee','lancement','croissance'], acc:ACC_LIEU, web:'https://abidjan.impacthub.net'},
  {id:'ci-seedspace', k:'cw', t:'hub', n:'Seedspace Abidjan', cc:'CI', v:'Abidjan',
   s:'Coworking et incubation, avec un réseau international.',
   d:"Espace du réseau international Seedspace : postes de travail, programmes pour les startups et mise en relation avec des investisseurs.",
   sv:['Coworking', 'Incubation', 'Mise en relation avec des investisseurs'],
   pr:['lancement','croissance'], acc:ACC_LIEU},
  {id:'ci-jokkolabs', k:'cw', t:'hub', n:'Jokkolabs Abidjan', cc:'CI', v:'Abidjan',
   s:"L'antenne abidjanaise d'un réseau panafricain de coworking.",
   d:"Jokkolabs, né à Dakar, accueille indépendants et jeunes startups dans des espaces partagés et anime une communauté d'entrepreneurs.",
   sv:['Coworking', 'Accompagnement de startups', 'Communauté'], pr:['idee','lancement'], acc:ACC_LIEU, web:'https://jokkolabs.net'},
  {id:'ci-africaworks', k:'cw', t:'cowork', n:'Africaworks Abidjan', cc:'CI', v:'Abidjan',
   s:'Coworking et bureaux privés.', d:"Espace de coworking du réseau Africaworks, avec postes partagés et bureaux privés pour les équipes.",
   sv:SV_COWORK, pr:['lancement','croissance'], acc:ACC_LIEU},
  {id:'ci-regus', k:'cw', t:'affaires', n:'Regus Abidjan', cc:'CI', v:'Abidjan', q:'Plateau',
   s:"Bureaux équipés et coworking d'un réseau international.",
   d:"Plusieurs centres d'affaires du réseau IWG à Abidjan, dont un au Plateau.",
   sv:SV_IWG, pr:['lancement','croissance'], acc:ACC_LIEU, web:'https://www.regus.com'},
  {id:'ci-hubivoiretech', k:'ap', t:'incub', n:'Hub Ivoire Tech', cc:'CI', v:'Abidjan',
   s:"Le campus public des startups ivoiriennes.",
   d:"Incubateur porté par l'État ivoirien, qui réunit appuis publics et partenaires privés pour accompagner les startups de l'idée au premier produit.",
   sv:['Incubation', 'Espaces de travail', 'Partenariats publics et privés', 'Formations'],
   pr:['idee','lancement'], acc:ACC_PROG, web:'https://hubivoire.tech'},
  {id:'ci-odc', k:'ap', t:'formation', n:'Orange Digital Center Côte d\'Ivoire', cc:'CI', v:'Abidjan',
   s:'Formations gratuites au numérique, fablab et accélérateur Orange Fab.',
   d:"Programme du groupe Orange qui regroupe une école du code, un fablab et l'accélérateur Orange Fab pour les startups tech.",
   sv:['Formations gratuites au numérique', 'Fablab', 'Accélération (Orange Fab)'], pr:['idee','lancement','croissance'], acc:ACC_PROG},
  {id:'ci-cipme', k:'ap', t:'agence', n:'Agence Côte d\'Ivoire PME', cc:'CI', v:'Abidjan', nat:true,
   s:"L'agence publique des PME, avec son programme d'incubation.",
   d:"L'Agence Côte d'Ivoire PME appuie la création et la croissance des petites entreprises : formation, accompagnement et programmes d'incubation.",
   sv:['Formations', 'Accompagnement des PME', 'Programmes d\'incubation', 'Orientation vers les financements'],
   pr:['idee','lancement','croissance'], acc:ACC_PUB},
  {id:'ci-cepici', k:'ap', t:'guichet', n:'CEPICI', cc:'CI', v:'Abidjan', nat:true,
   s:"Le guichet unique de création d'entreprise en Côte d'Ivoire.",
   d:"Le Centre de promotion des investissements en Côte d'Ivoire gère le guichet unique de création d'entreprise et informe les investisseurs.",
   sv:["Création d'entreprise", 'Guichet unique des formalités', 'Information aux investisseurs'],
   pr:['lancement'], acc:ACC_PUB, web:'https://cepici.gouv.ci'},
  {id:'ci-aej', k:'ap', t:'agence', n:'Agence Emploi Jeunes', cc:'CI', v:'Abidjan', nat:true,
   s:"Formations et financements pour les jeunes qui se lancent.",
   d:"L'Agence Emploi Jeunes accompagne l'insertion des jeunes, y compris par l'entrepreneuriat : formation, suivi et appui au financement de projets.",
   sv:['Formation à l\'entrepreneuriat', 'Appui au financement', 'Suivi des projets'], pr:['idee','lancement'], acc:ACC_PUB},
  {id:'ci-inphb', k:'ap', t:'incub', n:'Incubateur de l\'INP-HB', cc:'CI', v:'Yamoussoukro',
   s:"L'incubateur de l'Institut national polytechnique Houphouët-Boigny.",
   d:"Accompagne étudiants et diplômés de l'INP-HB qui portent un projet à potentiel commercial.",
   sv:['Incubation', 'Mentorat', 'Accès aux laboratoires et au réseau de l\'école'], pr:['idee','lancement'], acc:ACC_PROG},

  /* ---------------- Sénégal ---------------- */
  {id:'sn-jokkolabs', k:'cw', t:'hub', n:'Jokkolabs Dakar', cc:'SN', v:'Dakar', q:'Sacré-Cœur 3',
   s:'Le pionnier du coworking au Sénégal.',
   d:"Né à Dakar, Jokkolabs est un espace collaboratif qui accueille indépendants et startups, anime des formations et des événements, et a essaimé dans plusieurs pays d'Afrique.",
   sv:['Coworking', 'Formations', 'Événements et réseau', 'Accompagnement'], pr:['idee','lancement'], acc:ACC_LIEU, web:'https://jokkolabs.net'},
  {id:'sn-impacthub', k:'cw', t:'hub', n:'Impact Hub Dakar', cc:'SN', v:'Dakar', q:'Cité Keur Gorgui',
   s:"Coworking, bureaux et programmes d'accompagnement.",
   d:"Membre du réseau mondial Impact Hub : bureaux privés, espace ouvert et programmes pour les entrepreneurs.",
   sv:['Coworking et bureaux privés', 'Programmes d\'accompagnement', 'Événements'], pr:['idee','lancement','croissance'], acc:ACC_LIEU, web:'https://dakar.impacthub.net'},
  {id:'sn-ctic', k:'ap', t:'incub', n:'CTIC Dakar', cc:'SN', v:'Dakar',
   s:"Incubateur et accélérateur des entreprises du numérique.",
   d:"Le CTIC Dakar accompagne les entreprises des technologies de l'information depuis de nombreuses années : incubation, accélération et mise en relation.",
   sv:['Incubation', 'Accélération', 'Mise en relation avec des partenaires'], pr:['lancement','croissance'], acc:ACC_PROG, web:'https://www.ctic-dakar.com'},
  {id:'sn-synergie', k:'cw', t:'cowork', n:'Synergie Cowork', cc:'SN', v:'Dakar', q:'Ngor, Almadies',
   s:'Postes flexibles, bureaux privés et salles de formation.', d:"Espace de coworking moderne pour indépendants et équipes.",
   sv:['Postes flexibles', 'Bureaux privés', 'Salles de formation'], pr:['lancement','croissance'], acc:ACC_LIEU, web:'https://www.synergiecowork.com'},
  {id:'sn-sarita', k:'cw', t:'cowork', n:'Sarita Coworking', cc:'SN', v:'Dakar', q:'Plateau',
   s:'Un coworking tourné vers la communauté, au Plateau.', d:"Espaces partagés et bureaux privés pour équipes et indépendants.",
   sv:SV_COWORK, pr:['lancement','croissance'], acc:ACC_LIEU, web:'https://www.sarita-coworking.com'},
  {id:'sn-africaworks', k:'cw', t:'cowork', n:'Africaworks Dakar', cc:'SN', v:'Dakar', q:'Point E',
   s:'Coworking et coliving.', d:"Bureaux équipés et studios meublés pour des séjours courts ou longs, pratique pour une équipe qui se réunit à Dakar.",
   sv:['Bureaux équipés', 'Coworking', 'Logement sur place'], pr:['lancement','croissance'], acc:ACC_LIEU, web:'https://www.africaworks.co'},
  {id:'sn-palabres', k:'cw', t:'hub', n:'Palabres Créatives', cc:'SN', v:'Saly',
   s:"Coworking et formations sur la Petite Côte.",
   d:"Écosystème tourné vers l'entrepreneuriat, la formation et les projets à impact, avec coworking, bureaux privés et salles équipées.",
   sv:['Coworking', 'Bureaux privés', 'Formations'], pr:['idee','lancement'], acc:ACC_LIEU, web:'https://www.palabres-creatives.com'},
  {id:'sn-odc', k:'ap', t:'formation', n:'Orange Digital Center Sénégal', cc:'SN', v:'Dakar',
   s:'Formations gratuites au numérique, fablab et accélérateur.', d:"Programme du groupe Orange : école du code, fablab et accélérateur Orange Fab.",
   sv:['Formations gratuites', 'Fablab', 'Accélération'], pr:['idee','lancement','croissance'], acc:ACC_PROG},
  {id:'sn-der', k:'ap', t:'fonds', n:'DER/FJ', cc:'SN', v:'Dakar', nat:true,
   s:"Délégation à l'entrepreneuriat rapide des femmes et des jeunes.",
   d:"La DER/FJ finance et accompagne les femmes et les jeunes qui créent une activité, avec des produits adaptés à chaque stade.",
   sv:['Financement de projets', 'Formation et accompagnement', 'Programmes pour les startups'], pr:['idee','lancement','croissance'], acc:ACC_PUB, web:'https://der.sn'},
  {id:'sn-adepme', k:'ap', t:'agence', n:'ADEPME', cc:'SN', v:'Dakar', nat:true,
   s:"Agence de développement et d'encadrement des PME.",
   d:"L'ADEPME appuie les petites et moyennes entreprises sénégalaises : diagnostic, formation, mise à niveau et orientation vers les financements.",
   sv:['Diagnostic d\'entreprise', 'Formations', 'Accompagnement', 'Orientation vers les financements'], pr:['lancement','croissance'], acc:ACC_PUB, web:'https://www.adepme.sn'},
  {id:'sn-apix', k:'ap', t:'guichet', n:'APIX', cc:'SN', v:'Dakar', nat:true,
   s:"La création d'entreprise et la promotion des investissements.",
   d:"L'APIX gère le guichet de création d'entreprise et accompagne les investisseurs au Sénégal.",
   sv:["Création d'entreprise", 'Formalités administratives', 'Accompagnement des investisseurs'], pr:['lancement'], acc:ACC_PUB, web:'https://www.apix.sn'},

  /* ---------------- Burkina Faso ---------------- */
  {id:'bf-lafabrique', k:'cw', t:'hub', n:'La Fabrique', cc:'BF', v:'Ouagadougou',
   s:"Coworking et accompagnement d'entrepreneurs à Ouagadougou.",
   d:"Espace de travail partagé qui accompagne aussi des entrepreneurs, notamment à impact social.",
   sv:['Coworking', 'Accompagnement', 'Événements'], pr:['idee','lancement'], acc:ACC_LIEU},
  {id:'bf-siralabs', k:'cw', t:'cowork', n:'Sira Labs', cc:'BF', v:'Ouagadougou',
   s:'Espace de coworking tourné vers le numérique.', d:"Espace de travail et de formation autour des technologies.",
   sv:SV_COWORK, pr:['idee','lancement'], acc:ACC_LIEU},
  {id:'bf-ouagalab', k:'cw', t:'fablab', n:'Ouagalab', cc:'BF', v:'Ouagadougou',
   s:'Fablab et incubateur de projets technologiques.', d:"Laboratoire de fabrication et d'innovation où des projets techniques prennent forme, avec une communauté de makers.",
   sv:['Fablab', 'Prototypage', 'Ateliers'], pr:['idee','lancement'], acc:ACC_LIEU},
  {id:'bf-bbi', k:'ap', t:'incub', n:'Burkina Business Incubator', cc:'BF', v:'Ouagadougou',
   s:'Incubateur de jeunes entreprises burkinabè.', d:"Accompagne les porteurs de projet de la création aux premières années de l'entreprise.",
   sv:['Incubation', 'Formations', 'Suivi post-création'], pr:['idee','lancement'], acc:ACC_PROG},
  {id:'bf-odc', k:'ap', t:'formation', n:'Orange Digital Center Burkina Faso', cc:'BF', v:'Ouagadougou',
   s:'Formations gratuites au numérique et fablab.', d:"Programme du groupe Orange : école du code, fablab et accompagnement de startups.",
   sv:['Formations gratuites', 'Fablab', 'Accélération'], pr:['idee','lancement'], acc:ACC_PROG},
  {id:'bf-mebf', k:'ap', t:'guichet', n:"Maison de l'Entreprise du Burkina Faso", cc:'BF', v:'Ouagadougou', nat:true,
   s:"Créer ton entreprise et te faire accompagner.",
   d:"La MEBF abrite le centre de formalités des entreprises et propose des services d'appui aux PME.",
   sv:["Création d'entreprise", 'Appui-conseil aux PME', 'Information économique'], pr:['lancement','croissance'], acc:ACC_PUB},
  {id:'bf-faij', k:'ap', t:'fonds', n:"FAIJ", cc:'BF', v:'Ouagadougou', nat:true,
   s:"Fonds d'appui aux initiatives des jeunes.", d:"Fonds public qui finance des projets portés par des jeunes, avec une formation préalable.",
   sv:['Financement de projets de jeunes', 'Formation'], pr:['idee','lancement'], acc:ACC_PUB},

  /* ---------------- Mali ---------------- */
  {id:'ml-donilab', k:'ap', t:'incub', n:'Donilab', cc:'ML', v:'Bamako',
   s:"Incubateur et accélérateur des entrepreneurs maliens.",
   d:"Donilab accompagne les porteurs de projet maliens à chaque étape : incubation, accélération, formations et espace de travail.",
   sv:['Incubation et accélération', 'Coworking', 'Formations'], pr:['idee','lancement','croissance'], acc:ACC_PROG},
  {id:'ml-impacthub', k:'cw', t:'hub', n:'Impact Hub Bamako', cc:'ML', v:'Bamako',
   s:"Coworking et programmes d'un réseau mondial.", d:"Espace du réseau Impact Hub : coworking, programmes d'accompagnement et événements.",
   sv:['Coworking', 'Programmes d\'accompagnement', 'Événements'], pr:['idee','lancement'], acc:ACC_LIEU},
  {id:'ml-kabakoo', k:'ap', t:'formation', n:'Kabakoo Academies', cc:'ML', v:'Bamako',
   s:"Apprendre par projets, au plus près du terrain.", d:"École alternative qui forme aux compétences numériques et entrepreneuriales par des projets concrets.",
   sv:['Formations par projets', 'Compétences numériques', 'Communauté'], pr:['idee'], acc:ACC_PROG},
  {id:'ml-odc', k:'ap', t:'formation', n:'Orange Digital Center Mali', cc:'ML', v:'Bamako',
   s:'Formations gratuites au numérique et fablab.', d:"Programme du groupe Orange : école du code, fablab et accompagnement de startups.",
   sv:['Formations gratuites', 'Fablab', 'Accélération'], pr:['idee','lancement'], acc:ACC_PROG},
  {id:'ml-apej', k:'ap', t:'agence', n:'APEJ', cc:'ML', v:'Bamako', nat:true,
   s:"Agence pour la promotion de l'emploi des jeunes.", d:"Formations, appui à l'auto-emploi et accès au financement pour les jeunes Maliens.",
   sv:['Formation', 'Appui à l\'auto-emploi', 'Accès au financement'], pr:['idee','lancement'], acc:ACC_PUB},
  {id:'ml-api', k:'ap', t:'guichet', n:'API-Mali', cc:'ML', v:'Bamako', nat:true,
   s:"Le guichet unique de création d'entreprise au Mali.", d:"L'Agence pour la promotion des investissements gère le guichet unique des formalités de création d'entreprise.",
   sv:["Création d'entreprise", 'Guichet unique', 'Information aux investisseurs'], pr:['lancement'], acc:ACC_PUB},

  /* ---------------- Niger ---------------- */
  {id:'ne-cipmen', k:'ap', t:'incub', n:'CIPMEN', cc:'NE', v:'Niamey',
   s:"Le centre incubateur des PME au Niger.",
   d:"Premier incubateur du Niger, le CIPMEN accompagne les startups et PME innovantes, notamment dans le numérique et les énergies.",
   sv:['Incubation', 'Espaces de travail', 'Formations', 'Mise en relation'], pr:['idee','lancement','croissance'], acc:ACC_PROG},
  {id:'ne-me', k:'ap', t:'guichet', n:"Maison de l'Entreprise du Niger", cc:'NE', v:'Niamey', nat:true,
   s:"Créer ton entreprise et trouver un appui-conseil.", d:"Guichet de création d'entreprise et services d'appui aux promoteurs.",
   sv:["Création d'entreprise", 'Appui-conseil', 'Information'], pr:['lancement','croissance'], acc:ACC_PUB},

  /* ---------------- Guinée ---------------- */
  {id:'gn-saboutech', k:'cw', t:'hub', n:'Saboutech', cc:'GN', v:'Conakry',
   s:"Incubateur et espace d'innovation à Conakry.", d:"Hub qui accompagne de jeunes porteurs de projet guinéens dans le numérique et l'innovation.",
   sv:['Incubation', 'Espace de travail', 'Formations'], pr:['idee','lancement'], acc:ACC_LIEU},
  {id:'gn-odc', k:'ap', t:'formation', n:'Orange Digital Center Guinée', cc:'GN', v:'Conakry',
   s:'Formations gratuites au numérique et fablab.', d:"Programme du groupe Orange : école du code, fablab et accélérateur Orange Fab.",
   sv:['Formations gratuites', 'Fablab', 'Accélération'], pr:['idee','lancement'], acc:ACC_PROG},
  {id:'gn-apip', k:'ap', t:'guichet', n:'APIP Guinée', cc:'GN', v:'Conakry', nat:true,
   s:"Le guichet unique de création d'entreprise.", d:"L'Agence de promotion des investissements privés gère le guichet unique de création d'entreprise en Guinée.",
   sv:["Création d'entreprise", 'Guichet unique'], pr:['lancement'], acc:ACC_PUB},
  {id:'gn-aguipe', k:'ap', t:'agence', n:'AGUIPE', cc:'GN', v:'Conakry', nat:true,
   s:"Agence guinéenne pour la promotion de l'emploi.", d:"Programmes d'insertion et d'appui à l'auto-emploi des jeunes.",
   sv:['Appui à l\'auto-emploi', 'Formations', 'Orientation'], pr:['idee','lancement'], acc:ACC_PUB},

  /* ---------------- Cameroun ---------------- */
  {id:'cm-activspaces', k:'cw', t:'hub', n:'ActivSpaces', cc:'CM', v:'Buea',
   s:"Le hub tech historique du Cameroun, à Buea et Douala.",
   d:"ActivSpaces soutient l'entrepreneuriat et l'innovation au Cameroun : espaces de travail, incubation et programmes pour les startups tech.",
   sv:['Coworking', 'Incubation', 'Programmes pour startups tech'], pr:['idee','lancement'], acc:ACC_LIEU},
  {id:'cm-odc', k:'ap', t:'formation', n:'Orange Digital Center Cameroun', cc:'CM', v:'Douala',
   s:'Formations gratuites au numérique et fablab.', d:"Programme du groupe Orange : école du code, fablab et accélérateur Orange Fab.",
   sv:['Formations gratuites', 'Fablab', 'Accélération'], pr:['idee','lancement'], acc:ACC_PROG},
  {id:'cm-regus', k:'cw', t:'affaires', n:'Regus et Spaces Douala', cc:'CM', v:'Douala',
   s:"Coworking et bureaux équipés.", d:"Centres d'affaires du réseau international IWG au Cameroun.",
   sv:SV_IWG, pr:['lancement','croissance'], acc:ACC_LIEU, web:'https://www.regus.com'},
  {id:'cm-apme', k:'ap', t:'agence', n:'APME', cc:'CM', v:'Yaoundé', nat:true,
   s:'Agence de promotion des PME.', d:"Agence publique qui appuie la création et le développement des PME camerounaises : information, formation et accompagnement.",
   sv:['Information', 'Formations', 'Accompagnement des PME'], pr:['lancement','croissance'], acc:ACC_PUB},
  {id:'cm-cfce', k:'ap', t:'guichet', n:"CFCE", cc:'CM', v:'Yaoundé', nat:true,
   s:"Centres de formalités de création d'entreprises.", d:"Guichets uniques présents dans les grandes villes pour créer ton entreprise en un seul lieu.",
   sv:["Création d'entreprise", 'Guichet unique'], pr:['lancement'], acc:ACC_PUB}
  ];

  /* Ce qu'une structure apporte à une équipe de l'Atelier, selon son type. */
  var UTILE = {
    cowork:   "Un lieu neutre pour vos séances de travail : le jalon 5, « Travailler 2 semaines ensemble », se passe mieux autour d'une même table.",
    hub:      "Un lieu pour travailler ensemble (jalon 5) et des programmes pour faire grandir l'équipe une fois formée.",
    fablab:   "Pour fabriquer un premier prototype à petit coût, pendant vos deux semaines de travail en commun (jalon 5).",
    affaires: "Une salle de réunion ou une adresse professionnelle quand l'équipe reçoit un client ou un juriste.",
    incub:    "Un regard extérieur sur votre projet. Les incubateurs regardent d'abord l'équipe : venez à deux ou plus.",
    accel:    "Pour accélérer une fois le produit lancé. Une équipe soudée, avec un pacte signé, rassure les sélectionneurs.",
    agence:   "Formations, conseil et mises en relation, souvent gratuits ou à petit prix.",
    guichet:  "L'étape qui suit le pacte d'associés (jalon 6) : immatriculer la société avec la répartition du capital décidée dans l'Atelier.",
    fonds:    "À viser une fois l'équipe formée et le capital réparti : les financeurs regardent d'abord qui porte le projet.",
    reseau:   "Des entrepreneurs et investisseurs expérimentés pour conseiller l'équipe.",
    formation:"Pour monter en compétences ensemble, sans frais ou presque."
  };

  window.TM_PARTNERS = {version:'2026-10-12', types:TYPES, utile:UTILE, list:L};
})();
