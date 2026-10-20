# TakaMatch — site

Plateforme de cofondation pour l'Afrique de l'Ouest.

## Arborescence

```
takamatch/
├── index.html            Site vitrine (page d'accueil)
├── manifest.webmanifest  Installation sur téléphone (nom, icônes, couleurs)
├── robots.txt, sitemap.xml  Référencement Google
├── inscription.html      Onboarding : création de compte et connexion
├── app.html              L'outil : accueil, explorer, fiche (profil Talent), connexions, messages, atelier…
├── css/
│   ├── variables.css     Couleurs, polices, rayons, ombres (clair + sombre) — toute la charte se règle ici
│   ├── base.css          Remise à zéro, typographie générale
│   ├── components.css    Composants partagés + écran de chargement
│   └── pages/            Styles propres à chaque page (vitrine, inscription, app)
├── js/
│   ├── main.js           Chargé en premier partout : filet de sécurité (TMGuard) + navigation entre pages
│   ├── pacte.js          Pacte d'associés : modèle générique qui s'adapte à chaque équipe
│   ├── pacte-pdf.js      Pacte d'associés : mise en page du PDF
│   ├── pacte-editor.js   Pacte d'associés : éditeur plein écran (app + admin)
│   ├── partenaires-data.js  Atelier › Partenaires : catalogue de départ (coworkings, organismes d'appui)
│   ├── admin-partenaires.js Admin : module « Partenaires »
│   ├── vendor/           pdfmake (création du PDF dans le navigateur)
│   └── pages/            Code propre à chaque page
└── assets/
    ├── images/           Logos, couverture, photos de démonstration
    │   └── takam/        Tête de Takam (WebP transparent, 320 px) : takam-talent (bonnet bleu),
    │                     takam-visionnaire (bonnet jaune). Originaux HD : ../marque/takam/
    ├── icons/            Favicon
    │   └── paiement/     Logos des moyens de paiement (MTN, Moov, Celtiis, Wave, Orange, Free, Mixx, NITA, Mastercard, Visa) — affichés via js/pay-icons.js
    └── fonts/            Polices du PDF (Source Serif 4, Inter — licence OFL)
```

Chaque page charge dans cet ordre : `variables.css` → `base.css` → `components.css` → `pages/<page>.css`,
puis `main.js` → `pages/<page>.js`.

## Adresse de contact

L'adresse publique de TakaMatch est **contact@takamatch.com**. Elle apparaît :

- dans le pied de page et la FAQ du site vitrine (`js/pages/vitrine.js`, constante `CONTACT_EMAIL`) ;
- dans « Aide et support » de l'outil, l'avis de compte suspendu et l'erreur de paiement (`js/pages/app.js`, `TM_LINKS.email` ; `js/pages/app-pacte.js`) ;
- dans le pied des pages `404.html` et `erreur.html` ;
- dans les réglages de l'espace admin (`admin.html`, Réglages → Liens, champ « Email »).

La boîte elle-même se crée chez o2switch (cPanel → Comptes de messagerie).

## Tester sur ton ordinateur

Double-clique `index.html`, ou mieux, ouvre le dossier dans VS Code et lance l'extension *Live Server*.

## Mettre en ligne (GitHub Pages)

Envoie **le contenu de ce dossier** dans le dépôt GitHub (pas le dossier parent), puis
Settings → Pages → Deploy from a branch → `main` / `(root)`.

## À savoir

- Les comptes, fiches, invitations, messages et l'Atelier vivent dans la base **Supabase** (projet `takamatch`).
  Le navigateur ne garde que de petits réglages (thème, visites guidées déjà vues, pays pour les prix).
- Connexion : **e-mail + code à usage unique** (pas de mot de passe) ou **Google**. Les codes partent par le SMTP **Brevo**.
- L'espace équipe (`admin.html`) est en ligne mais protégé : connexion par code, réservée aux membres de la table `staff`.
- Ne jamais mettre dans ce dépôt le dossier `supabase/`, le dossier `paiements` ni un fichier `.env`.

## Notifications par e-mail

- **Ce qui part** : invitation reçue (tout de suite), invitation acceptée (match), message non lu depuis 15 minutes
  (au plus un e-mail toutes les 6 h par conversation). Rien pour les comptes de démonstration ni les comptes suspendus.
- **Préférences** : chaque membre coupe ce qu'il veut dans Paramètres → Notifications (table `notif_prefs`).
- **Fonctionnement** : la base remplit une file (`email_queue`) ; toutes les 5 minutes, pg_cron réveille la fonction
  serveur `notif` (code : `supabase/functions/notif/index.ts`), qui envoie via l'API Brevo.
- **Plafond** : `app_settings.emails` → `{"active": true, "daily_cap": 150}`. Au-delà de 150 e-mails par jour, la suite
  part le lendemain : la place restante du quota Brevo gratuit (300/jour) est gardée pour les codes de connexion.
- **À installer une fois** : exécuter `supabase/21_notifications.sql`, déployer la fonction `notif`, puis ranger la
  **clé API Brevo** (Brevo → SMTP & API → API Keys, pas la clé SMTP) dans Supabase → Project Settings → Vault, nom `brevo_api_key`.
- **Expéditeur** : `contact@takamatch.com`. Le domaine `takamatch.com` doit être authentifié dans Brevo
  (Senders, Domains → ajouter le domaine, puis copier les enregistrements DKIM/SPF/DMARC dans la zone DNS chez o2switch).
- **Vérifier** : `select kind, sent_at, skipped, error from email_queue order by id desc limit 20;`

## Partage, référencement, audience

- **Aperçu de partage** (WhatsApp, Facebook, LinkedIn) : `assets/images/og-takamatch.png` (1200 × 630), déclaré dans chaque page publique.
- **Google** : `robots.txt` et `sitemap.xml` à la racine ; l'outil, l'inscription, l'admin et les pages d'erreur sont exclus.
  À faire une fois : déclarer le site dans Google Search Console et y soumettre `https://takamatch.com/sitemap.xml`.
- **Audience** : GoatCounter (gratuit, sans cookie). Le code est déjà en place sur les pages ; il suffit de créer le compte
  sur goatcounter.com avec le code **takamatch**. Tableau de bord : https://takamatch.goatcounter.com
- **Installation sur téléphone** : `manifest.webmanifest` + icônes `assets/icons/icon-*.png` et `apple-touch-icon.png`
  (« Ajouter à l'écran d'accueil » ouvre directement l'outil).
- **Après une modification d'un fichier JS ou CSS** : changer son `?v=AAAAMMJJx` dans les pages qui le chargent,
  sinon les visiteurs gardent l'ancienne version en mémoire.

## Pacte d'associés

Le bouton « Préparer le pacte d'associés » de l'Atelier ouvre un éditeur plein écran.

- **Modèle générique** (`js/pacte.js`) : SAS de droit OHADA, 25 articles environ. Chaque article est
  rédigé à partir de l'équipe : nombre d'associés (unanimité à deux, deux tiers au-delà), capital et
  vesting de l'Atelier, rôles, disponibilité de chacun, secteur, ville et pays du siège, plan d'action.
- **Modifiable** : le porteur réécrit un article, en retire, ajoute une clause proposée ou une clause libre.
  Ses modifications sont gardées à part : le reste du texte continue de suivre l'Atelier.
- **Étapes** : brouillon (porteur) → relecture (juriste, après paiement) → signature (version figée,
  empreinte SHA-256) → signé (PDF archivé, jalon 6 franchi).
- **Stockage** : tables `pactes`, `pacte_parties`, `pacte_signatures`, `pacte_events` et espace de
  fichiers privé `pactes` dans Supabase. **À installer une fois** : exécuter `supabase/11_pactes.sql`
  dans Supabase → SQL Editor. Tant que ce n'est pas fait, le pacte reste dans le navigateur (avertissement affiché).
- **Admin** : module « Pactes d'associés » (super admin et nouveau rôle « Juriste »).
- **Modèle vierge** : Paramètres → Légal → « Modèle de pacte d'associés (OHADA) · PDF ».

## Takam, l'assistant des équipes

- **Son visage** : en haut du panneau Takam de l'Atelier. Un Talent voit la tête au bonnet et aux lunettes
  bleus (`assets/images/takam/takam-talent.webp`), un Visionnaire celle au bonnet jaune
  (`takam-visionnaire.webp`). Le choix se fait dans `js/pages/app.js` (constante `TAKAM_HEAD`).
  Pour changer une tête : remplacer le fichier WebP en gardant le même nom (image carrée, fond transparent).

- **Les règles** (`js/takam-rules.js`) : un seul fichier, utilisé par l'outil (alertes affichées tout de suite
  dans l'Atelier) et par le serveur (copie dans `supabase/functions/takam/`). Après une modification :
  recopier le fichier dans `supabase/functions/takam/` et redéployer la fonction.
- **La veille quotidienne** : chaque matin à 8 h (Cotonou), la base réveille la fonction serveur `takam`
  (`pg_cron`). Elle relit chaque Atelier, enregistre les alertes (table `takam_alerts`) et prévient les membres
  dans l'app (3 notifications par jour au plus). Les comptes de démonstration ne reçoivent rien.
- **E-mails** : coupés pour l'instant. Le code est prêt ; pour les activer plus tard, ajouter le secret
  `BREVO_API_KEY` (clé API Brevo, pas la clé SMTP) puis cocher « Récapitulatifs par e-mail » dans l'admin.
- **Demander à Takam** : la question part vers la fonction `takam`, qui relit l'équipe dans la base et répond
  avec une **IA gratuite (Groq)**. Quota par personne et par jour (15 par défaut). Sans clé, quota atteint ou
  limite gratuite de Groq dépassée : réponse toute prête.
- **Clé de l'IA** : la clé Groq est rangée dans le coffre de la base (Supabase → Project Settings → Vault,
  nom `groq_api_key`), jamais dans le site. Pour la changer, modifier ce secret dans Vault. Un secret
  `GROQ_API_KEY` dans Edge Functions → Secrets, s'il existe, passe avant. Modèle : `openai/gpt-oss-120b`
  (changeable avec le secret `GROQ_MODEL`).
- **Base** : `supabase/12_takam.sql` (déjà installé sur le projet `takamatch`).
- **Admin** : module « Takam » (équipes à surveiller, derniers passages, réglages, bouton « Lancer maintenant »).

## Pages d'erreur

- `erreur.html` : une seule page pour tous les incidents, choisie par l'adresse :
  `?type=google` (connexion Google pas encore activée), `oauth` (retour de Google en échec), `404`,
  `session` (session expirée), `reseau` (hors connexion), `serveur`, `maintenance`, `acces`.
  Options : `mode` et `role` (gardés pour revenir à l'inscription), `retour=/page.html` (bouton Réessayer),
  `detail=…` (texte affiché dans « Détails pour l'équipe »).
- `404.html` : copie de `erreur.html` (type 404 par défaut). GitHub Pages l'affiche pour toute adresse inconnue.
  Après une modification de `erreur.html`, recopier le fichier et remettre `data-default="404"` sur la balise `<html>`.
- Le bouton Google de l'inscription vérifie d'abord dans Supabase que Google est activé ;
  sinon il envoie vers `erreur.html?type=google` au lieu de la page d'erreur brute de Supabase.


## Lancement sans paiement (depuis le 16/10/2026)

- **Ce que voient les membres** : second profil, emplacement projet et pacte d'associés affichés **0 FCFA**,
  débloqués d'un clic sans aucune information de paiement. Achat de crédits : **« Bientôt disponible »**, packs montrés en gris avec leurs prix.
  **5 crédits d'invitation par mois** pour les Visionnaires.
- **Base** : `supabase/20_lancement_gratuit.sql` (réglage `app_settings.launch`, fonction `claim_free()`, recharge à 5 le 1er du mois via pg_cron).
- **Réactiver les paiements** : `update app_settings set value = '{"free": false, "monthly_credits": 5}' where key = 'launch';`
  Le site relit ce réglage au chargement ; les prix de la table `pricing` n'ont pas changé.

## Paiements (FedaPay)

- **Le serveur** : fonction Supabase `paiement` (code dans `supabase/functions/paiement/index.ts`, déjà déployée).
  Elle remplace le serveur Node du dossier `paiements`, qui ne peut pas tourner sur GitHub Pages.
  Adresse : `https://ucxeopgigfzmuqzuzynr.supabase.co/functions/v1/paiement` (réglée dans `TM_PAY.apiBase`, `js/pages/app.js`).
- **Ce qu'elle fait** : recalcule le montant (tables `pricing` et `fx_rates`), crée la transaction FedaPay,
  envoie la demande sur le téléphone (ou renvoie la page FedaPay pour la carte), redemande le statut à FedaPay,
  puis accorde l'achat une seule fois avec `fulfill_payment()`. Clé d'idempotence + index uniques : pas de double paiement.
- **Secrets** (Supabase → Edge Functions → Secrets) : `FEDAPAY_SECRET_KEY` (sk_sandbox_… pour tester, sk_live_… pour encaisser),
  `FEDAPAY_WEBHOOK_SECRET`. Sandbox ou live se déduit de la clé. Facultatif : `APP_URL` (retour après paiement carte).
- **Webhook FedaPay** : `https://ucxeopgigfzmuqzuzynr.supabase.co/functions/v1/paiement/webhooks/fedapay`.
- **Vérifier l'état** : ouvrir l'adresse de la fonction →
  `{"ok":true,"fedapay":"sandbox","webhook":"signé","card":true,"weekly_limit":0}` (`fedapay` : `sandbox`, `live` ou `non configuré`).
- **Réglages** (table `app_settings`, clé `payments`) : `{"card": true|false, "weekly_limit": N}`.
  `card:false` retire la carte bancaire de l'écran **et** la refuse côté serveur ; `weekly_limit` plafonne le nombre
  de transactions FedaPay sur 7 jours glissants (0 = pas de plafond). Au-delà, le membre voit
  « Les paiements en ligne sont complets pour cette semaine ».
- **Achats de test** : coupés depuis le 12/10/2026 (`test_payments = false`). Ne pas les rallumer en production :
  tant qu'ils sont actifs, n'importe quel membre connecté peut s'accorder des crédits sans payer.
- Les « modes » opérateurs (`MODES` dans la fonction) sont à confirmer avec FedaPay. Un mode faux ne bloque rien :
  le client paie sur la page FedaPay.

### Passer en live (encaisser pour de vrai)

Sans société, le compte FedaPay possible est **« Travailleur indépendant »** : pièce d'identité + numéro **IFU**
personnel et son justificatif, déclaration sur l'honneur, CGU et contrat de service FedaPay.
Limites : **mobile money uniquement, 10 transactions par semaine, 100 à 300 000 F par transaction.**

1. FedaPay → passer le compte en live, choisir « Travailleur indépendant », envoyer les documents, attendre la validation.
2. FedaPay (mode **Live**) → Paramètres → API : copier la clé secrète `sk_live_…`.
   Supabase → Edge Functions → Secrets → remplacer `FEDAPAY_SECRET_KEY` par cette clé.
3. FedaPay (mode **Live**) → Webhooks → créer un webhook vers
   `https://ucxeopgigfzmuqzuzynr.supabase.co/functions/v1/paiement/webhooks/fedapay`
   (événements `transaction.*`), copier son secret → Supabase → remplacer `FEDAPAY_WEBHOOK_SECRET`.
4. Supabase → SQL Editor → exécuter `supabase/17_passage_live.sql` (efface les paiements de test,
   coupe la carte, plafond 10/semaine, ferme `test_purchase`).
5. Ouvrir l'adresse de la fonction : `"fedapay":"live","card":false,"weekly_limit":10`.
6. Vrai test : acheter le Pack Essai avec ton propre numéro MTN, valider sur le téléphone,
   vérifier les crédits dans l'app et la transaction dans FedaPay. Rembourser depuis FedaPay si besoin.

Plus tard, avec un compte **Entreprise** (RCCM) : carte bancaire et plus de plafond →
`update app_settings set value = '{"card": true, "weekly_limit": 0}' where key = 'payments';`

## Partenaires de l'Atelier

L'Atelier a deux onglets : **Notre équipe** (l'Atelier habituel) et **Partenaires**.

- **Ce qu'on y trouve** : les centres de coworking et les organismes d'appui à l'entrepreneuriat
  (incubateurs, accélérateurs, agences publiques, guichets de création d'entreprise, financements, réseaux).
- **Qui voit quoi** : chaque membre voit les structures de **son pays** (celui de sa ville dans Paramètres › Compte),
  rangées ainsi : « À {sa ville} », « Partout au {pays} » (organismes nationaux), « Ailleurs au {pays} ».
  Filtres : Tout / Coworking / Appui, recherche, choix d'une ville. Ouvert à tous, même sans équipe.
- **Fiche rapide** (carte) → **fiche détaillée** (fenêtre) : présentation, services, stades accompagnés,
  comment y accéder, ce que la structure apporte à l'équipe, site officiel (ou recherche web), carte,
  « Signaler une erreur » (e-mail prérempli vers contact@takamatch.com).
- **Fichiers** : `js/partenaires-data.js` (catalogue de départ, 147 fiches dans 32 pays),
  `js/pages/app-partenaires.js` (l'onglet), `css/partenaires.css`, `js/admin-partenaires.js` (admin).
- **Base** (à installer une fois) : exécuter `supabase/18_partenaires.sql` dans Supabase → SQL Editor.
  Le fichier crée la table `partenaires` et y range les 147 fiches. Tant que la table n'existe pas ou est vide,
  l'outil affiche le catalogue de `js/partenaires-data.js`.
- **Admin** : module « Partenaires » (super admin et modérateurs) : ajouter, modifier, masquer, supprimer,
  marquer « partenaire officiel » (badge doré dans l'outil). Chaque changement est inscrit au journal d'audit.
- **À vérifier avant le lancement** : les fiches sont indicatives. Les sites web ne sont renseignés que
  quand ils sont sûrs ; sinon la fiche propose une recherche web. Aucune structure n'est encore marquée
  « partenaire officiel » : à cocher une fois l'accord signé.

## Mode maintenance

- **Activer / arrêter** : espace équipe → **Administration › Maintenance** (super admin). L'interrupteur ouvre une fenêtre
  de préparation : portée, heure de début (maintenant ou dans 5 / 15 / 30 min), retour prévu, message. Rien ne se ferme
  avant la case de confirmation. Pendant la maintenance : bandeau sur tout l'espace équipe, boutons « +15 min » / « +30 min »,
  réouverture confirmée en une étape.
- **Portée** : « Tout le site » (vitrine, inscription, outil, fiches partagées) ou « L'outil et l'inscription » (la vitrine reste ouverte).
  Les pages légales (CGU, confidentialité, mentions) restent toujours accessibles.
- **Ce que voient les visiteurs** : `maintenance.html` (titre, message, retour prévu avec compte à rebours). Elle revérifie toutes
  les 30 s et ramène chacun sur la page qu'il quittait. Aperçu : `maintenance.html?apercu=1`.
- **Membres déjà connectés** : `js/maintenance.js` (chargé sur index, inscription, app, profil) revérifie toutes les minutes.
  Maintenance programmée → bandeau de préavis avec compte à rebours, puis bascule à l'heure dite.
- **L'équipe** : l'espace équipe pose un laissez-passer sur le navigateur (12 h) ; on peut y parcourir le site fermé, avec un
  rappel en bas de l'écran. Ce n'est pas une protection : les données restent protégées par les règles de la base.
- **Base** : `supabase/23_maintenance.sql` (réglage `app_settings.maintenance` + inscription automatique au journal d'audit).
- **Secours** (espace équipe inaccessible) : Supabase → SQL Editor →
  `update app_settings set value = jsonb_set(value, '{active}', 'false') where key = 'maintenance';`
