/* ============================================================
   Pulse — vue Accueil : anneau calories, macros, séance du jour.
   ============================================================ */

const HomeView = (() => {

  function ring(pctVal) {
    const r = 52, circ = 2 * Math.PI * r;
    const off = circ * (1 - Math.min(pctVal, 1));
    return `
      <div class="ring">
        <svg viewBox="0 0 120 120">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#c6f24e"/>
              <stop offset="1" stop-color="#4ee1a0"/>
            </linearGradient>
          </defs>
          <circle class="ring-bg" cx="60" cy="60" r="${r}" fill="none" stroke-width="10"/>
          <circle class="ring-fg" cx="60" cy="60" r="${r}" fill="none" stroke-width="10"
            stroke-dasharray="${circ}" stroke-dashoffset="${off}"/>
        </svg>
        <div class="ring-center">
          <div class="ring-value">${Math.round(pctVal * 100)}%</div>
          <div class="ring-label">objectif</div>
        </div>
      </div>`;
  }

  const macroBar = (label, val, goal, cls) => `
    <div class="macro">
      <div class="macro-head">
        <span class="macro-name">${label}</span>
        <span class="macro-val">${Math.round(val)} / ${goal} g</span>
      </div>
      <div class="bar ${cls}"><i style="width:${Math.min((val / goal) * 100, 100)}%"></i></div>
    </div>`;

  function render(el) {
    const goals = Store.getGoals();
    const today = Store.todayKey();
    const t = Store.dayTotals(today);
    const program = Store.getActiveProgram();
    const next = program && program.sessions.find((s) => !Store.isSessionDone(s.id));

    const days = Store.recentDays(7);
    const weekKcal = days.map((d) => Store.dayTotals(d).kcal);
    const avg = Math.round(weekKcal.reduce((a, b) => a + b, 0) / days.length);
    const entries = Store.getLog(today).length;

    const sessionBlock = program
      ? next
        ? `<div class="card">
            <div class="card-title">Séance du jour · ${UI.esc(program.name)}</div>
            <div style="font-size:17px;font-weight:800;margin-bottom:4px">${UI.esc(next.name)}</div>
            <div style="font-size:13px;color:var(--text-muted);margin-bottom:14px">${next.exercises.length} exercices</div>
            <a class="btn btn-primary btn-block" href="#/programmes/${program.id}">Voir la séance</a>
          </div>`
        : `<div class="card">
            <div class="card-title">Programme actif</div>
            <div style="font-size:15px;font-weight:700">Cycle « ${UI.esc(program.name)} » terminé — bravo !</div>
            <a class="btn btn-ghost btn-block" style="margin-top:12px" href="#/programmes">Choisir un nouveau programme</a>
          </div>`
      : `<div class="card">
          <div class="empty-state">
            ${UI.icon("programs")}
            <div class="es-title">Aucun programme actif</div>
            <div style="font-size:13px">Choisis un programme pour voir ta séance du jour ici.</div>
            <a class="btn btn-primary" href="#/programmes">Parcourir les programmes</a>
          </div>
        </div>`;

    el.innerHTML = `
      <div class="view-header">
        <div class="view-eyebrow">${UI.fmtDay(today).main}</div>
        <h1 class="view-title">Ton tableau de bord</h1>
        <p class="view-subtitle">Nutrition, entraînement et progression en un coup d'œil.</p>
      </div>

      <div class="card">
        <div class="card-title">Énergie du jour</div>
        <div class="ring-wrap">
          ${ring(t.kcal / goals.kcal)}
          <div class="macro-row">
            ${macroBar("Protéines", t.p, goals.protein, "p")}
            ${macroBar("Glucides", t.c, goals.carbs, "c")}
            ${macroBar("Lipides", t.f, goals.fat, "f")}
          </div>
        </div>
        <div style="margin-top:14px;font-size:13.5px;color:var(--text-muted)">
          <strong style="color:var(--text)">${t.kcal} kcal</strong> / ${goals.kcal} kcal
          ${entries === 0 ? "· aucun repas enregistré" : `· ${entries} aliment${entries > 1 ? "s" : ""}`}
        </div>
      </div>

      <div class="stat-row">
        <div class="stat">
          <span class="s-val">${avg || "—"}</span>
          <span class="s-label">kcal moy. / 7 j</span>
        </div>
        <div class="stat">
          <span class="s-val">${entries}</span>
          <span class="s-label">aliments suivis</span>
        </div>
        <div class="stat">
          <span class="s-val">${program ? `${program.sessions.filter((s) => Store.isSessionDone(s.id)).length}/${program.sessions.length}` : "—"}</span>
          <span class="s-label">séances faites</span>
        </div>
      </div>

      ${sessionBlock}

      <a class="card" href="#/coach" style="display:flex;align-items:center;gap:14px">
        <span style="width:44px;height:44px;border-radius:14px;background:var(--accent-soft);display:grid;place-items:center;color:var(--accent)">${UI.icon("coach")}</span>
        <span style="flex:1">
          <strong style="font-size:15px">Coach Pulse</strong><br/>
          <span style="font-size:13px;color:var(--text-muted)">Demande un bilan ou un conseil personnalisé.</span>
        </span>
        ${UI.icon("chevR")}
      </a>
    `;
  }

  return { render };
})();
