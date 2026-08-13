# StreetPacker

Application web (PWA) permettant aux backpackers de repérer et partager des spots sur une carte interactive, avec une marketplace d'annonces entre voyageurs.

Ce dépôt contient le frontend. Il consomme une API REST (.NET) pour l'authentification, les spots et les annonces.

## Fonctionnalités

- Carte interactive (MapTiler) pour consulter, ajouter et filtrer des spots par tag
- Fiche détail d'un spot : vote, favoris, copie de coordonnées, suppression (propriétaire/admin)
- Marketplace : création, consultation et gestion d'annonces
- Espace profil : mes spots, mes annonces, mes favoris, paramètres
- Authentification par JWT avec refresh token automatique
- Upload et compression d'images côté client avant envoi
- Installable en PWA (manifest, icônes, prompt d'installation)

## Stack technique

- Vue 3 (Composition API) + TypeScript
- Vite
- Pinia (gestion d'état)
- Vue Router
- Tailwind CSS
- MapTiler SDK
- Axios
- Supabase (client JS)
- vite-plugin-pwa

## Démarrage

```sh
npm install
npm run dev
```

Créer un fichier `.env` à la racine avec :

```
VITE_API_URL=
VITE_MAPTILER_KEY=
```

### Build de production

```sh
npm run build
npm run preview
```

## Structure du projet

```
src/
  api/        client Axios, appels HTTP
  components/ composants réutilisables (carte, formulaires, prompt PWA...)
  router/     configuration des routes et guard d'authentification
  stores/     stores Pinia (auth...)
  types/      types TypeScript partagés
  views/      pages de l'application
```
