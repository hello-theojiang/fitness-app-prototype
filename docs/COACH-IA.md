# Brancher un vrai modèle sur le Coach IA

Le « harnais » est déjà en place dans `web/assets/js/coach-engine.js` :

- `CoachEngine.buildContext()` — agrège profil, objectifs, nutrition du jour, historique 7 jours, programme actif + progression.
- `CoachEngine.systemPrompt()` — sérialise ce contexte en system prompt.
- `CoachEngine.respond(input)` — aujourd'hui : `localReply()` (règles). Demain : appel HTTP.

## Étapes

1. **Renseigner `COACH_CONFIG`** dans `coach-engine.js` :
   ```js
   const COACH_CONFIG = {
     provider: "openai",
     endpoint: "https://api.openai.com/v1/chat/completions",
     apiKeySetting: "PULSE_COACH_API_KEY",
     model: "gpt-4o-mini",
   };
   ```

2. **Implémenter l'appel** dans `respond()` :
   ```js
   const res = await fetch(COACH_CONFIG.endpoint, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${key}`,
     },
     body: JSON.stringify({
       model: COACH_CONFIG.model,
       messages: [
         { role: "system", content: systemPrompt() },
         ...Store.getChat().map((m) => ({
           role: m.role === "bot" ? "assistant" : "user",
           content: m.text,
         })),
       ],
     }),
   });
   const data = await res.json();
   return data.choices[0].message.content;
   ```

3. **Clé API** : ne jamais la committer. Prévoir soit un champ dans les réglages (stockage localStorage), soit — mieux — un petit backend proxy qui détient la clé (recommandé pour une app distribuée).

4. **Streaming** (optionnel) : la bulle « typing » est déjà gérée côté `coach.js` ; brancher `ReadableStream` pour afficher la réponse au fil de l'eau.

## Points d'attention

- Le system prompt peut devenir volumineux : envisager de résumer l'historique ou de limiter `Store.getChat()` aux N derniers messages (déjà borné à 60).
- Sur Android, l'appel part de la WebView : la permission `INTERNET` est déjà déclarée dans le manifeste.
- Confidentialité : prévenir l'utilisateur que les données nutrition quittent l'appareil quand le mode cloud est activé (mettre à jour les Mentions légales / CGU en conséquence).
