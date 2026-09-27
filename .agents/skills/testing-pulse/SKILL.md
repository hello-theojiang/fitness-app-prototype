---
name: testing-pulse
description: How to run and end-to-end test the Pulse fitness SPA (web/) — serving, state reset, hash routes, mobile breakpoint, and known UI quirks that affect click targets.
---

# Testing the Pulse web app

## Serving
- Static SPA: `cd web && python3 -m http.server <port>` then open `http://localhost:<port>/index.html`.
- Hash-routed, no backend. Works via `file://` too, but http is closer to the Android WebView shell.

## State
- All persistence is `localStorage` key `pulse.v1` (journal, goals, activeProgram, doneSessions, chat).
- Fresh state: `localStorage.clear()` + reload. Verify persistence with F5.

## Routes (hash)
- `#/accueil` `#/nutrition` `#/programmes` `#/programmes/<id>` (e.g. `fullbody-debutant`) `#/coach` `#/pricing` `#/legal/mentions-legales` `#/legal/cgu`.
- Unknown hashes fall back to Accueil; unknown program id → program list; unknown legal page → Mentions légales.

## Expected values (data.js)
- Macros are per 100 g and scale linearly: Blanc de poulet 150 g → 180 kcal / P34.5 / C0 / F3.9.
- Default goals: 2200 kcal, P 140 g, C 240 g, F 73 g.
- FOOD_DB has unit items (`unit: "pièce"|"portion"`, e.g. Œuf, Sushi, Pizza part) whose kcal is per piece — suggestions show « kcal/pièce|portion » and macros scale by count, not grams.

## UI quirks that affect clicking
- `.ico svg` defaults to 1em; context rules size icons. If a future change drops that default rule, icons render 0×0 (invisible) — get the button box via `getBoundingClientRect()` in console, then map viewport→screenshot coords (scale ~1.5625 on this box: real display 1600×1200, tool space 1024×768, browser chrome = outerHeight−innerHeight px above the viewport), or dispatch `.click()` on the element.
- Modal actions close the modal unless `keepOpen: true`; the add-food « Ajouter » uses keepOpen + manual `m.remove()` on success, so validation-failure toasts leave the modal open.
- FOOD_DB unit items (« pièce »/« portion ») switch the qty label to « Quantité (pièce) » and scale per unit; the switch is one-way within a modal session (known residual: picking a per-100 g food after a unit food keeps the pièce label) and `e.unit` may not persist in stored entries.

## Mobile layout
- Breakpoint 860 px: below → bottom tab bar, sidebar hidden; at/above → sidebar, no tab bar. Resize the Chrome window with `wmctrl -r "Pulse" -e 0,100,50,500,900` to test mobile, restore with `-e 0,0,0,1600,1122` + maximize.

## Coach IA
- Local rules engine (no network). Try « bilan de ma journée » → reply echoes real totals/goals/active program; « combien de protéines ? » → remaining = goal − today protein. Context chips above the chat mirror today's kcal/protein and active program.

## Mannequin
- Program detail → click an exercise row → modal with two SVG figures (Face avant / Dos). Primary muscles get `.on` (lime gradient + glow), secondary `.on2` (muted). Muscles exist only on one figure (e.g. pectoraux front, dorsaux back) — an exercise like Squat gobelet lights both figures. `cardio` has no path (badge only — by design).
