# TakaMatch — site

Plateforme de cofondation pour l'Afrique de l'Ouest.

## Arborescence

```
takamatch/
├── index.html            Site vitrine (page d'accueil)
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
│   ├── vendor/           pdfmake (création du PDF dans le navigateur)
│   └── pages/            Code propre à chaque page
└── assets/
    ├── images/           Logos, couverture, photos de démonstration
    ├── icons/            Favicon
    └── fonts/            Polices du PDF (Source Serif 4, Inter — licence OFL)
```

Chaque page charge dans cet ordre : `variables.css` → `base.css` → `components.css` → `pages/<page>.css`,
puis `main.js` → `pages/<page>.js`.

## Tester sur ton ordinateur

Double-clique `index.html`, ou mieux, ouvre le dossier dans VS Code et lance l'extension *Live Server*.

## Mettre en ligne (GitHub Pages)

Envoie **le contenu de ce dossier** dans le dépôt GitHub (pas le dossier parent), puis
Settings → Pages → Deploy from a branch → `main` / `(root)`.

## À savoir

- Prototype : les comptes sont enregistrés dans le navigateur du visiteur (localStorage),
  pas encore dans une base de données. Personne d'autre ne les voit.
- Paiements : en simulation tant que `TM_PAY.apiBase` est vide dans `js/pages/app.js`.
- Ne jamais mettre ici l'espace admin, le dossier `paiements` ni un fichier `.env`.

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
