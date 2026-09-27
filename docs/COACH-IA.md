# Brancher un vrai modèle sur le Coach IA

Le Coach est **déjà branché** : il suffit de renseigner une clé dans l'app.

## Configuration (dans l'app)

Onglet **Coach IA** → bouton **⚙︎ IA** en haut à droite :

| Champ | Défaut | Rôle |
|---|---|---|
| **Clé API** | *(vide)* | Vide → coach local par règles. Renseignée → appel HTTP au modèle. |
| **Endpoint** | `https://api.openai.com/v1/chat/completions` | Tout endpoint compatible OpenAI : Mistral (`api.mistral.ai/v1/chat/completions`), Groq, LM Studio (`http://localhost:1234/v1/chat/completions`)… |
| **Modèle** | `gpt-4o-mini` | Nom du modèle passé dans la requête. |

La clé est stockée en **localStorage** sur l'appareil (`pulse.v1.coachConfig`) — elle n'est jamais envoyée ailleurs que vers l'endpoint configuré. L'app n'a pas de backend : l'appel part directement du navigateur / de la WebView.

Une puce dans le bandeau de contexte indique le moteur actif : « IA : locale » ou « IA : `<modèle>` ».

## Ce qui est envoyé au modèle

`CoachEngine.systemPrompt()` assemble en un system prompt :

- profil + objectifs quotidiens (kcal, protéines, glucides, lipides)
- totaux nutrition du jour + historique des 7 derniers jours
- programme actif + progression (séances faites / total)
- catalogue des programmes disponibles

suivi des 14 derniers messages du chat. En cas d'erreur HTTP, la réponse locale (`localReply`) s'affiche avec le détail de l'erreur.

## Précautions

- **Confidentialité** : avec une clé configurée, le journal nutrition quitte l'appareil vers le provider choisi — mettre à jour Mentions légales / CGU avant distribution publique.
- Une clé dans localStorage est lisible par tout script de la page — acceptable pour un usage personnel/cercle proche, pas pour du grand public (prévoir alors un backend proxy).
- Sur Android, l'appel part de la WebView : la permission `INTERNET` est déjà déclarée.
