/* ============================================================
   Pulse — vue Programmes : catalogue, détail d'un programme,
   séances, exercices + mannequin musculaire par exercice.
   ============================================================ */

const ProgrammesView = (() => {

  const levelBadge = (level) => `<span class="badge neutral">${UI.esc(level)}</span>`;

  /* ---------- Modale exercice + mannequin ---------- */

  function openExerciseModal(ex) {
    const primary = ex.muscles || [];
    const secondary = ex.secondary || [];
    const muscleName = (m) => MUSCLE_LABELS[m] || m;
    const cardio = primary.includes("cardio") || secondary.includes("cardio");

    UI.modal({
      title: ex.name,
      bodyHTML: `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span class="badge">${UI.esc(ex.sets)}</span>
          ${cardio ? `<span class="badge" style="color:var(--info);border-color:rgba(108,184,255,.3);background:rgba(108,184,255,.1)">${UI.icon("heart")} cardio</span>` : ""}
        </div>
        <div id="mannequin" style="display:flex;justify-content:center"></div>
        <div style="margin-top:6px">
          <div style="font-size:12.5px;color:var(--text-muted);margin-bottom:4px;font-weight:700">Travaille principalement</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
            ${primary.length ? primary.map((m) => `<span class="badge">${muscleName(m)}</span>`).join("") : `<span class="badge neutral">—</span>`}
          </div>
          ${secondary.length ? `
            <div style="font-size:12.5px;color:var(--text-muted);margin-bottom:4px;font-weight:700">Muscles secondaires</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              ${secondary.map((m) => `<span class="badge neutral">${muscleName(m)}</span>`).join("")}
            </div>` : ""}
        </div>`,
      actions: [{ label: "Fermer", class: "btn-ghost" }],
      onOpen: (m) => {
        MuscleMap.render(m.querySelector("#mannequin"), { primary, secondary });
      },
    });
  }

  /* ---------- Détail d'un programme ---------- */

  function renderDetail(el, program) {
    const active = Store.getActiveProgramId() === program.id;

    el.innerHTML = `
      <a href="#/programmes" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-muted);font-size:13.5px;font-weight:600">
        ${UI.icon("chevL")} Tous les programmes
      </a>
      <div class="view-header">
        <div class="view-eyebrow">${UI.esc(program.level)} · ${program.daysPerWeek} j/sem · ${UI.esc(program.duration)}</div>
        <h1 class="view-title">${UI.esc(program.name)}</h1>
        <p class="view-subtitle">${UI.esc(program.desc)}</p>
      </div>

      <button id="activate" class="btn ${active ? "btn-ghost" : "btn-primary"} btn-block">
        ${active ? "✓ Programme actif — toucher pour désactiver" : "Définir comme programme actif"}
      </button>

      ${program.sessions.map((s) => {
        const done = Store.isSessionDone(s.id);
        return `
          <div class="session">
            <div class="session-head">
              <div class="session-name">${UI.esc(s.name)}</div>
              ${done ? `<span class="session-done">${UI.icon("check")} faite</span>` : ""}
            </div>
            <table class="ex-table">
              ${s.exercises.map((ex, i) => `
                <tr class="ex-row" data-s="${s.id}" data-i="${i}" style="cursor:pointer">
                  <td class="ex-name">${UI.esc(ex.name)}</td>
                  <td class="ex-reps">${UI.esc(ex.sets)}</td>
                </tr>`).join("")}
            </table>
            <div style="display:flex;gap:10px;margin-top:6px;align-items:center">
              <button class="btn btn-ghost btn-sm" data-toggle-done="${s.id}">
                ${done ? "Marquer non faite" : "Marquer faite"}
              </button>
              <span style="font-size:11.5px;color:var(--text-faint)">Touche un exercice pour voir les muscles sur le mannequin</span>
            </div>
          </div>`;
      }).join("")}
    `;

    el.querySelector("#activate").onclick = () => {
      if (active) {
        Store.setActiveProgram(null);
        UI.toast("Programme désactivé");
      } else {
        Store.setActiveProgram(program.id);
        UI.toast(`« ${program.name} » est maintenant ton programme actif`);
      }
      renderDetail(el, program);
    };

    el.querySelectorAll(".ex-row").forEach((row) => {
      row.onclick = () => {
        const s = program.sessions.find((x) => x.id === row.dataset.s);
        openExerciseModal(s.exercises[+row.dataset.i]);
      };
    });

    el.querySelectorAll("[data-toggle-done]").forEach((b) => {
      b.onclick = () => {
        const nowDone = Store.toggleSessionDone(b.dataset.toggleDone);
        UI.toast(nowDone ? "Séance marquée faite — bravo !" : "Séance rouverte");
        renderDetail(el, program);
      };
    });
  }

  /* ---------- Liste ---------- */

  function renderList(el) {
    const activeId = Store.getActiveProgramId();
    el.innerHTML = `
      <div class="view-header">
        <div class="view-eyebrow">Entraînement</div>
        <h1 class="view-title">Programmes</h1>
        <p class="view-subtitle">Choisis un plan, suis tes séances, touche un exercice pour voir les muscles travaillés.</p>
      </div>
      <div class="grid">
        ${PROGRAMS.map((p) => `
          <div class="card program-card">
            <div class="program-head">
              <div class="program-name">${UI.esc(p.name)}</div>
              ${p.id === activeId ? `<span class="badge">Actif</span>` : ""}
            </div>
            <div class="program-meta">
              ${levelBadge(p.level)}
              <span class="badge neutral">${p.daysPerWeek} j / sem</span>
              <span class="badge neutral">${UI.esc(p.duration)}</span>
              <span class="badge neutral">${UI.esc(p.goal)}</span>
            </div>
            <p class="program-desc">${UI.esc(p.desc)}</p>
            <div class="program-foot">
              <a class="btn btn-ghost" href="#/programmes/${p.id}">Voir le détail</a>
            </div>
          </div>`).join("")}
      </div>
    `;
  }

  function render(el, params) {
    const p = params && params[0];
    const program = p && PROGRAMS.find((x) => x.id === p);
    if (p && program) renderDetail(el, program);
    else renderList(el);
  }

  return { render };
})();
