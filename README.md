# Pulse — Fitness, Nutrition & Coach IA

Application de suivi fitness : **journal nutrition**, **programmes d'entraînement** avec mannequin musculaire interactif, **coach IA** (harnais prêt à brancher un modèle), page **pricing** et pages légales.

Une seule base de code web sert à la fois l'**application HTML** (navigateur) et l'**application Android** (WebView embarquant les mêmes assets).

## Structure du dépôt

```
fitness-app-prototype/
├── web/                        # App HTML/CSS/JS (source de vérité UI)
│   ├── index.html              # Coquille SPA + routage par hash
│   └── assets/
│       ├── css/app.css         # Design system (thème sombre, accent lime)
│       ├── icons/icon.svg      # Logo / favicon
│       └── js/
│           ├── data.js         # Base d'aliments + bibliothèque de programmes
│           ├── store.js        # Persistance locale (localStorage)
│           ├── components.js   # Icônes SVG, toasts, modales
│           ├── coach-engine.js # Harnais IA : contexte + réponses
│           ├── muscle-map.js   # Mannequin musculaire SVG (avant/dos)
│           ├── views/          # Une vue par onglet
│           │   ├── home.js         # Tableau de bord
│           │   ├── nutrition.js    # Journal + objectifs
│           │   ├── programmes.js   # Programmes + mannequin par exercice
│           │   ├── coach.js        # Chat coach IA
│           │   ├── pricing.js      # 3 plans (Découverte / Pro / Elite)
│           │   └── legal.js        # Mentions légales + CGU
│           └── app.js          # Routeur + navigation
├── android/                    # Projet Android natif (shell WebView)
│   ├── app/src/main/           # Manifeste, MainActivity, ressources
│   ├── build.gradle.kts        # assets.srcDirs → ../web (pas de duplication)
│   └── gradlew                 # Wrapper Gradle 8.10.2 (AGP 8.6.1, Java 17)
├── .github/workflows/android.yml  # CI : build APK + release sur tag v*
└── docs/                       # Architecture et guide d'intégration IA
```

## Onglets

| Onglet | Contenu |
|---|---|
| **Accueil** | Anneau de calories, macros, séance du jour, raccourci coach |
| **Nutrition** | Journal par jour/repas, base d'aliments, objectifs réglables |
| **Programmes** | 4 programmes, séances détaillées, **mannequin musculaire** par exercice |
| **Coach IA** | Chat qui connaît ta nutrition, tes objectifs et ton programme actif |
| **Pricing** | 3 plans : Découverte (0 €), Pro (9,99 €/mois), Elite (19,99 €/mois) |
| Légal | Mentions légales + CGU (liens en bas de page) |

Toutes les données (journal, objectifs, programme actif, historique du chat) sont stockées **localement** — rien ne quitte l'appareil en version prototype.

## Lancer la version web

```sh
cd web
python3 -m http.server 8080
# → http://localhost:8080
```

Ou simplement ouvrir `web/index.html` dans un navigateur.

## Construire l'APK Android

Prérequis : JDK 17, Android SDK (platform `android-35`, `build-tools;35.0.0`).

```sh
cd android
echo "sdk.dir=/chemin/vers/android-sdk" > local.properties   # ou ANDROID_HOME
./gradlew assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

L'APK embarque `web/` dans ses assets (`assets.srcDirs` dans `android/app/build.gradle.kts`) — aucune copie à maintenir.

La CI (`.github/workflows/android.yml`) construit l'APK à chaque push/PR et le publie en **release** quand on pousse un tag `v*`.

## Brancher le vrai modèle IA (plus tard)

Voir [`docs/COACH-IA.md`](docs/COACH-IA.md) : le harnais (`coach-engine.js`) assemble déjà tout le contexte (profil, objectifs, journal nutrition 7 j, programme actif) en un *system prompt* — il ne reste qu'à renseigner `COACH_CONFIG` et remplacer `localReply` par l'appel HTTP du fournisseur choisi.

## Roadmap

- [ ] Brancher le coach IA sur un vrai modèle (endpoint + clé)
- [ ] Activer les paiements pour les plans Pro / Elite
- [ ] Compléter les champs `[À compléter]` des Mentions légales / CGU avant mise en production
- [ ] Signature de release de l'APK (le build debug utilise la clé de debug)
