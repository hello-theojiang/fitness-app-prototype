/* ============================================================
   Pulse — Coach IA (harness)
   ------------------------------------------------------------
   Le « harnais » assemble tout le contexte local (profil, objectifs,
   journal nutrition 7 j, programme actif, progression) en un system
   prompt, puis appelle le modèle configuré dans l'onglet Coach
   (endpoint compatible OpenAI : OpenAI, Mistral, Groq, LM Studio…).
   Sans clé API configurée, `localReply` (règles) prend le relais.
   La clé est stockée en localStorage sur l'appareil — voir
   docs/COACH-IA.md pour les précautions.
   ============================================================ */

const COACH_DEFAULTS = {
  endpoint: "https://api.openai.com/v1/chat/completions",
  model: "gpt-4o-mini",
};

const CoachEngine = (() => {

  /* ---------- Assemblage du contexte ---------- */

  function buildContext() {
    const goals = Store.getGoals();
    const profile = Store.getProfile();
    const today = Store.todayKey();
    const totalsToday = Store.dayTotals(today);

    const week = Store.recentDays(7).map((d) => ({
      day: d,
      ...Store.dayTotals(d),
      entries: Store.getLog(d).length,
    }));

    const program = Store.getActiveProgram();
    const progInfo = program
      ? {
          id: program.id,
          name: program.name,
          level: program.level,
          daysPerWeek: program.daysPerWeek,
          sessionsDone: program.sessions.filter((s) => Store.isSessionDone(s.id)).length,
          sessionsTotal: program.sessions.length,
        }
      : null;

    return { profile, goals, today, totalsToday, week, program: progInfo };
  }

  function systemPrompt() {
    const c = buildContext();
    return [
      "Tu es Pulse Coach, un coach sportif et nutritionnel bienveillant, précis et motivant.",
      "Tu réponds en français, de façon concise, actionnable et sécuritaire.",
      "Tu t'appuies UNIQUEMENT sur les données ci-dessous pour personnaliser tes conseils.",
      "",
      "## Profil utilisateur",
      JSON.stringify(c.profile),
      "## Objectifs quotidiens",
      JSON.stringify(c.goals),
      "## Totaux nutrition aujourd'hui",
      JSON.stringify(c.totalsToday),
      "## 7 derniers jours (kcal, p=protéines, c=glucides, f=lipides, nb entrées)",
      JSON.stringify(c.week),
      "## Programme actif",
      JSON.stringify(c.program),
      "## Programmes disponibles",
      JSON.stringify(PROGRAMS.map((p) => ({ id: p.id, name: p.name, level: p.level, days: p.daysPerWeek, goal: p.goal }))),
    ].join("\n");
  }

  /* ---------- Réponses locales (placeholder du modèle) ---------- */

  const pct = (a, b) => Math.round((a / Math.max(b, 1)) * 100);

  function localReply(input) {
    const c = buildContext();
    const t = c.totalsToday;
    const g = c.goals;
    const q = input.toLowerCase();

    const weekAvg = c.week.length
      ? Math.round(c.week.reduce((s, d) => s + d.kcal, 0) / c.week.length)
      : 0;

    if (/(analys|bilan|résum|resume|comment je vais|ma nutrition)/.test(q)) {
      const lines = [
        `**Bilan du jour** — ${t.kcal} kcal / ${g.kcal} kcal (${pct(t.kcal, g.kcal)} %).`,
        `Protéines : ${Math.round(t.p)} / ${g.protein} g · Glucides : ${Math.round(t.c)} / ${g.carbs} g · Lipides : ${Math.round(t.f)} / ${g.fat} g.`,
      ];
      if (t.p < g.protein * 0.6)
        lines.push(`Tes **protéines** sont en retard : pense à ajouter du poulet, du skyr ou des œufs au prochain repas.`);
      if (weekAvg)
        lines.push(`Moyenne sur 7 jours : ${weekAvg} kcal/j.`);
      if (c.program)
        lines.push(`Programme actif : **${c.program.name}** (${c.program.sessionsDone}/${c.program.sessionsTotal} séances faites).`);
      else
        lines.push(`Aucun programme actif — dis-moi ton objectif et je t'en propose un dans l'onglet Programmes.`);
      return lines.join("\n\n");
    }

    if (/(protéine|proteine|protein)/.test(q)) {
      const rest = Math.max(0, Math.round(g.protein - t.p));
      return `Il te reste **${rest} g de protéines** aujourd'hui pour atteindre ${g.protein} g.\n\nIdées : 150 g de poulet (~35 g), un skyr (~17 g), ou une dose de whey (~24 g).`;
    }

    if (/(calorie|kcal|déficit|deficit|surplus|manger)/.test(q)) {
      const rest = g.kcal - t.kcal;
      return `Objectif : **${g.kcal} kcal** — consommé : **${t.kcal} kcal**. ${rest >= 0
        ? `Il te reste environ **${Math.round(rest)} kcal** pour la journée.`
        : `Tu as dépassé ton objectif de **${Math.round(-rest)} kcal** — privilégie une séance cardio demain ou un dîner léger.`}`;
    }

    if (/(programme|séance|seance|entra|workout|exercice|sport)/.test(q)) {
      if (c.program) {
        const p = PROGRAMS.find((x) => x.id === c.program.id);
        const next = p.sessions.find((s) => !Store.isSessionDone(s.id));
        return `Ton programme actuel est **${p.name}** (${p.daysPerWeek} j/sem).\n\n${next
          ? `Prochaine séance : **${next.name}** — ${next.exercises.length} exercices.`
          : `Toutes les séances sont bouclées — bravo ! Tu peux relancer un cycle.`}`;
      }
      return `Aucun programme actif pour l'instant.\n\nDans l'onglet **Programmes**, tu as le choix : Full Body Débutant, Perte de poids, Prise de masse (PPL) ou Mobilité. Dis-moi ton niveau et ton objectif et je te conseille le plus adapté.`;
    }

    if (/(perte|maigrir|sèche|seche|gras)/.test(q)) {
      return `Pour une **perte de gras** durable : déficit modéré (~300-400 kcal sous ta maintenance), protéines élevées (~1,8 g/kg), et le programme « Perte de poids » 4 j/sem te convient bien.\n\nAjuste ton objectif kcal dans Nutrition → ⚙︎ objectifs si besoin.`;
    }

    if (/(masse|muscle|volume|bulk|hypertrophie)/.test(q)) {
      return `Pour la **prise de masse** : léger surplus (+200-300 kcal), 1,6-2,2 g/kg de protéines, et un split orienté volume comme **Push Pull Legs**.\n\nActive-le dans l'onglet Programmes et surveille ta prise dans Nutrition.`;
    }

    if (/(bonjour|salut|hello|hey|coucou)/.test(q)) {
      return `Salut ! Je suis ton coach Pulse.\n\nJe connais ton journal nutrition, tes objectifs et ton programme actif. Demande-moi un **bilan du jour**, des conseils **protéines**, ou un **programme** adapté à ton objectif.`;
    }

    return `J'ai bien noté. Pour l'instant je fonctionne avec des règles locales — mon « vrai » cerveau IA sera branché ici plus tard, avec tout ton contexte (nutrition, programme, objectifs).\n\nEssaie : « Analyse ma nutrition », « Combien de protéines ? », « Propose-moi une séance ».`;
  }

  /* ---------- Appel au modèle (endpoint compatible OpenAI) ---------- */

  async function remoteReply(cfg) {
    const messages = Store.getChat()
      .slice(-14)
      .map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));

    const res = await fetch(cfg.endpoint || COACH_DEFAULTS.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model || COACH_DEFAULTS.model,
        messages: [{ role: "system", content: systemPrompt() }, ...messages],
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = data?.error?.message || `HTTP ${res.status}`;
      throw new Error(detail);
    }
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("réponse vide du modèle");
    return text.trim();
  }

  async function respond(input) {
    const cfg = Store.getCoachConfig();
    if (cfg.apiKey) {
      try {
        return await remoteReply(cfg);
      } catch (e) {
        return `**Appel au modèle impossible** (${e.message}). Vérifie la clé, l'endpoint et le modèle dans ⚙︎ IA — je réponds en mode local en attendant.\n\n${localReply(input)}`;
      }
    }
    await new Promise((r) => setTimeout(r, 450 + Math.random() * 450));
    return localReply(input);
  }

  function statusLabel() {
    const cfg = Store.getCoachConfig();
    return cfg.apiKey ? `IA : ${cfg.model || COACH_DEFAULTS.model}` : "IA : locale";
  }

  /* Résumé compact pour les puces de contexte affichées dans le chat. */
  function contextChips() {
    const c = buildContext();
    const chips = [
      `${c.totalsToday.kcal} kcal aujourd'hui`,
      `${Math.round(c.totalsToday.p)} g protéines`,
    ];
    if (c.program) chips.push(`Programme : ${c.program.name}`);
    else chips.push("Aucun programme actif");
    return chips;
  }

  return { buildContext, systemPrompt, respond, contextChips, statusLabel, DEFAULTS: COACH_DEFAULTS };
})();
