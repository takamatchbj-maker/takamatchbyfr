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
│   └── pages/            Code propre à chaque page
└── assets/
    ├── images/           Logos, couverture, photos de démonstration
    └── icons/            Favicon
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
