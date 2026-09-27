# Architecture

## Principe

Une **seule base de code** (`web/`) sert les deux cibles :

- **Navigateur** : `web/index.html` directement, ou via un serveur statique.
- **Android** : `android/` est un shell natif minimal (WebView plein écran) qui charge `file:///android_asset/index.html` — le contenu de `web/` est déclaré comme source d'assets Gradle (`assets.srcDirs "../../web"`), donc **aucune duplication**.

## App web (SPA)

- **Routage par hash** (`app.js`) : fonctionne en `file://` comme en HTTP — nécessaire pour la WebView.
- **Pas de build** : modules ES5/ES6 chargés par `<script>` dans l'ordre défini dans `index.html`.
- **Persistance** : `store.js` sérialise tout dans `localStorage` sous la clé `pulse.v1` (journal nutrition par jour, objectifs, programme actif, séances faites, historique du chat).
- **Design system** : `app.css` — variables CSS, thème sombre, accent lime→émeraude, mobile-first (tab bar) / desktop (sidebar via media query 860 px).

## Mannequin musculaire (`muscle-map.js`)

- Deux silhouettes SVG (avant / dos) générées en DOM.
- Chaque muscle = chemin défini **une seule fois** (moitié droite) puis dupliqué par `<use transform="matrix(-1 0 0 1 200 0)">` — symétrie garantie.
- Activation : classes `.on` (primaire, dégradé accent + halo) / `.on2` (secondaire, vert estompé) sur `data-muscle`.
- Les exercices déclarent `muscles` et `secondary` dans `data.js` (`PROGRAMS[].sessions[].exercises[]`).

## Coach IA (`coach-engine.js`)

- `buildContext()` → objet JSON : profil, objectifs, totaux du jour, 7 derniers jours, programme actif + progression.
- `systemPrompt()` → le contexte sérialisé en prompt système prêt pour un LLM.
- `respond()` → aujourd'hui des règles locales (`localReply`), demain l'appel HTTP au provider (voir `COACH-IA.md`).

## Android

- `MainActivity.java` (Java volontairement — zéro dépendance Kotlin) : WebView, `javaScriptEnabled`, `domStorageEnabled`, `allowFileAccess` (obligatoire targetSdk ≥ 30 pour les sous-ressources `file:///android_asset/`).
- `onBackPressed` → `webView.goBack()` : le bouton retour suit la navigation hash.
- minSdk 26, targetSdk 35, AGP 8.6.1, Gradle 8.10.2.
