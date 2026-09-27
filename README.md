# Pulse — Fitness, Nutrition & Coach IA

Application de suivi fitness : **journal nutrition**, **programmes d'entraînement** avec mannequin musculaire interactif, **coach IA** (branchable sur un modèle OpenAI-compatible via ⚙︎ IA), page **pricing** et pages légales.

Licence [MIT](LICENSE).

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
│           ├── coach-engine.js # Harnais IA : contexte + appel modèle
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
├── tools/bundle.py             # Assemble web/ en un pulse.html autonome
├── .github/workflows/android.yml  # CI : build APK + pulse.html, release sur tag v*
├── docs/                       # Architecture et guide d'intégration IA
└── LICENSE                     # MIT
```

## Onglets

| Onglet | Contenu |
|---|---|
| **Accueil** | Anneau de calories, macros, séance du jour, raccourci coach |
| **Nutrition** | Journal par jour/repas, base d'aliments, objectifs réglables |
| **Programmes** | 4 programmes + **éditeur intégré** (crée/modifie tes plans, export/import JSON), séances détaillées, **mannequin musculaire** par exercice |
| **Coach IA** | Chat qui connaît ta nutrition, tes objectifs et tes programmes (y compris tes créations) |
| **Pricing** | 3 plans : Découverte (0 €), Pro (9,99 €/mois), Elite (19,99 €/mois) |
| Légal | Mentions légales + CGU (liens en bas de page) |

Toutes les données (journal, objectifs, programme actif, programmes créés, historique du chat) sont stockées **localement** — rien ne quitte l'appareil en version prototype. Les programmes personnalisés sont des documents JSON : export/import dans l'onglet Programmes (sur Android, l'export écrit dans Téléchargements), donc lisibles et générables par l'IA.

## Lancer la version web

```sh
cd web
python3 -m http.server 8080
# → http://localhost:8080
```

Ou simplement ouvrir `web/index.html` dans un navigateur.

### Version web autonome (un seul fichier)

```sh
python3 tools/bundle.py
# → dist/pulse.html : toute l'app inline (CSS + JS + icône), fonctionne en file://
```

## Construire l'APK Android

Prérequis : JDK 17, Android SDK (platform `android-35`, `build-tools;35.0.0`).

```sh
cd android
echo "sdk.dir=/chemin/vers/android-sdk" > local.properties   # ou ANDROID_HOME
./gradlew assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

L'APK embarque `web/` dans ses assets (`assets.srcDirs` dans `android/app/build.gradle.kts`) — aucune copie à maintenir.

La CI (`.github/workflows/android.yml`) construit l'APK et `dist/pulse.html` à chaque push/PR et les publie en **release** quand on pousse un tag `v*` :

```sh
git tag v0.1.0 && git push --tags
# → release GitHub avec app-debug.apk + pulse.html
```

## Configurer le coach IA

Onglet **Coach IA** → **⚙︎ IA** : renseigne la clé API, l'endpoint et le modèle (compatible OpenAI — OpenAI, Mistral, Groq, LM Studio…). Sans clé, le coach répond avec des règles locales. Voir [`docs/COACH-IA.md`](docs/COACH-IA.md).

## Roadmap

- [x] Coach IA branchable sur un vrai modèle (clé API dans ⚙︎ IA)
- [x] Création de programmes dans l'app + export/import JSON
- [ ] Test du appel réel avec une clé valide
- [ ] Activer les paiements pour les plans Pro / Elite
- [ ] Compléter les champs `[À compléter]` des Mentions légales / CGU avant mise en production
- [ ] Signature de release de l'APK (le build debug utilise la clé de debug)
