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

      ${program.custom ? `
        <div class="prog-actions">
          <a class="btn btn-ghost btn-sm" href="#/programmes/edition/${program.id}">Modifier</a>
          <button class="btn btn-ghost btn-sm" id="export-btn">Exporter JSON</button>
          <button class="btn btn-ghost btn-sm" id="delete-btn" style="color:var(--danger)">Supprimer</button>
        </div>` : ""}

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

    const expBtn = el.querySelector("#export-btn");
    if (expBtn) expBtn.onclick = () => exportProgram(program);
    const delBtn = el.querySelector("#delete-btn");
    if (delBtn) delBtn.onclick = () => {
      Store.deleteProgram(program.id);
      UI.toast("Programme supprimé");
      location.hash = "#/programmes";
    };
  }

  /* ---------- Éditeur de programme ---------- */

  const newExercise = () => ({ name: "", sets: "3 × 10", muscles: [], secondary: [] });
  const newSession = (n) => ({ id: "", name: `Séance ${n}`, exercises: [newExercise()] });

  const exLibOptions = () =>
    Object.keys(EXERCISE_INDEX).map((n) => `<option value="${UI.esc(n)}">`).join("");

  function muscleChips(ex, kind) {
    // kind: "muscles" | "secondary" — chips toggle, pré-remplies
    return Object.keys(MUSCLE_LABELS)
      .map((m) => `<span class="mchip ${ex[kind].includes(m) ? "on" : ""}" data-m="${m}" data-kind="${kind}">${UI.esc(MUSCLE_LABELS[m])}</span>`)
      .join("");
  }

  function exRowHTML(ex, si, ei) {
    const known = EXERCISE_INDEX[ex.name];
    return `
      <div class="ed-ex" data-ei="${ei}">
        <div class="ed-ex-line">
          <input class="ed-exname" list="ed-lib" placeholder="Exercice" value="${UI.esc(ex.name)}"/>
          <input class="ed-exsets" placeholder="3 × 10" value="${UI.esc(ex.sets)}"/>
          <button class="ed-x" data-del-ex="${ei}" title="Retirer">✕</button>
        </div>
        <details class="ed-muscles">
          <summary>${known ? "Muscles (auto)" : "Muscles travaillés"}</summary>
          <div class="ed-mgroup"><span>Primaires</span><div class="ed-chips">${muscleChips(ex, "muscles")}</div></div>
          <div class="ed-mgroup"><span>Secondaires</span><div class="ed-chips">${muscleChips(ex, "secondary")}</div></div>
        </details>
      </div>`;
  }

  function sessionHTML(s, si) {
    return `
      <div class="card ed-session" data-si="${si}">
        <div class="ed-session-head">
          <input class="ed-sname" placeholder="Nom de la séance" value="${UI.esc(s.name)}"/>
          <button class="ed-x" data-del-session="${si}" title="Supprimer la séance">✕</button>
        </div>
        <div class="ed-exlist">${s.exercises.map((ex, ei) => exRowHTML(ex, si, ei)).join("")}</div>
        <button class="btn btn-ghost btn-sm" data-add-ex="${si}">+ Ajouter un exercice</button>
      </div>`;
  }

  function syncDraft(el, draft) {
    draft.name = el.querySelector("#ed-name").value.trim();
    draft.goal = el.querySelector("#ed-goal").value.trim();
    draft.level = el.querySelector("#ed-level").value;
    draft.daysPerWeek = Math.max(1, parseInt(el.querySelector("#ed-days").value, 10) || 1);
    draft.duration = el.querySelector("#ed-duration").value.trim();
    draft.desc = el.querySelector("#ed-desc").value.trim();

    draft.sessions = [...el.querySelectorAll(".ed-session")].map((se, si) => ({
      id: (draft.sessions[si] || {}).id || "",
      name: se.querySelector(".ed-sname").value.trim(),
      exercises: [...se.querySelectorAll(".ed-ex")].map((xe) => {
        const name = xe.querySelector(".ed-exname").value.trim();
        const known = EXERCISE_INDEX[name];
        const picks = (kind) =>
          [...xe.querySelectorAll(`.mchip[data-kind="${kind}"].on`)].map((c) => c.dataset.m);
        return {
          name,
          sets: xe.querySelector(".ed-exsets").value.trim() || "3 × 10",
          muscles: known ? [...known.muscles] : picks("muscles"),
          secondary: known ? [...known.secondary] : picks("secondary"),
        };
      }),
    }));
  }

  function renderEditor(el, prog) {
    const editing = !!prog;
    const draft = prog
      ? JSON.parse(JSON.stringify(prog))
      : { id: "", name: "", level: "Débutant", daysPerWeek: 3, duration: "8 semaines", goal: "", desc: "", sessions: [newSession(1)] };

    el.innerHTML = `
      <a href="#/programmes" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-muted);font-size:13.5px;font-weight:600">
        ${UI.icon("chevL")} Annuler
      </a>
      <div class="view-header">
        <div class="view-eyebrow">${editing ? "Modifier" : "Nouveau programme"}</div>
        <h1 class="view-title">${editing ? UI.esc(prog.name) : "Crée ton programme"}</h1>
        <p class="view-subtitle">Séances, exercices, muscles — enregistré en local et visible par le coach IA. Exportable en JSON.</p>
      </div>

      <div class="card ed-meta">
        <div class="field"><label>Nom du programme</label><input id="ed-name" placeholder="Ex. Push Pull Legs maison" value="${UI.esc(draft.name)}"/></div>
        <div class="ed-grid">
          <div class="field"><label>Objectif</label><input id="ed-goal" placeholder="Prise de masse" value="${UI.esc(draft.goal)}"/></div>
          <div class="field"><label>Niveau</label>
            <select id="ed-level">
              ${["Débutant", "Intermédiaire", "Avancé"].map((l) => `<option ${draft.level === l ? "selected" : ""}>${l}</option>`).join("")}
            </select>
          </div>
          <div class="field"><label>Jours / semaine</label><input id="ed-days" type="number" min="1" max="7" value="${draft.daysPerWeek}"/></div>
          <div class="field"><label>Durée</label><input id="ed-duration" placeholder="8 semaines" value="${UI.esc(draft.duration)}"/></div>
        </div>
        <div class="field"><label>Description</label><input id="ed-desc" placeholder="Pour qui, pour quoi ?" value="${UI.esc(draft.desc)}"/></div>
      </div>

      <div id="ed-sessions"></div>
      <button class="btn btn-ghost btn-block" id="ed-add-session">+ Ajouter une séance</button>

      <div class="ed-foot">
        ${editing ? `<button class="btn btn-ghost" id="ed-delete" style="color:var(--danger)">Supprimer</button>` : ""}
        <button class="btn btn-primary" id="ed-save">${editing ? "Enregistrer" : "Créer le programme"}</button>
      </div>

      <datalist id="ed-lib">${exLibOptions()}</datalist>
    `;

    // Ne pas appeler syncDraft() ici : au premier rendu le DOM est vide
    // et écraserait le brouillon. draw() = rendre + re-brancher.
    const draw = () => {
      el.querySelector("#ed-sessions").innerHTML = draft.sessions.map((s, si) => sessionHTML(s, si)).join("");
      bindSessionEvents();
    };

    function bindSessionEvents() {
      el.querySelectorAll("[data-add-ex]").forEach((b) => {
        b.onclick = () => { syncDraft(el, draft); draft.sessions[+b.dataset.addEx].exercises.push(newExercise()); draw(); };
      });
      el.querySelectorAll("[data-del-ex]").forEach((b) => {
        b.onclick = () => {
          const se = b.closest(".ed-session");
          syncDraft(el, draft);
          const s = draft.sessions[+se.dataset.si];
          s.exercises.splice(+b.dataset.delEx, 1);
          if (!s.exercises.length) s.exercises.push(newExercise());
          draw();
        };
      });
      el.querySelectorAll("[data-del-session]").forEach((b) => {
        b.onclick = () => { syncDraft(el, draft); draft.sessions.splice(+b.dataset.delSession, 1); draw(); };
      });
      el.querySelectorAll(".mchip").forEach((c) => {
        c.onclick = () => c.classList.toggle("on");
      });
    }

    el.querySelector("#ed-add-session").onclick = () => {
      syncDraft(el, draft);
      draft.sessions.push(newSession(draft.sessions.length + 1));
      draw();
    };

    el.querySelector("#ed-save").onclick = () => {
      syncDraft(el, draft);
      if (!draft.name) return UI.toast("Donne un nom au programme");
      const sessions = draft.sessions.filter((s) => s.exercises.some((e) => e.name.trim()));
      if (!sessions.length) return UI.toast("Ajoute au moins une séance avec un exercice");
      const bad = sessions.find((s) => s.exercises.some((e) => !e.name.trim()));
      if (bad) return UI.toast("Un exercice est vide — complète-le ou retire-le");

      if (!draft.id) draft.id = `custom-${Date.now().toString(36)}`;
      draft.sessions = sessions.map((s, i) => ({ ...s, id: s.id || `${draft.id}-s${i + 1}` }));
      draft.custom = true;
      Store.saveProgram(draft);
      UI.toast(`« ${draft.name} » enregistré`);
      location.hash = `#/programmes/${draft.id}`;
    };

    const delBtn = el.querySelector("#ed-delete");
    if (delBtn) delBtn.onclick = () => {
      Store.deleteProgram(draft.id);
      UI.toast("Programme supprimé");
      location.hash = "#/programmes";
    };

    draw();
  }

  /* ---------- Export / import JSON ---------- */

  function exportProgram(p) {
    const json = JSON.stringify(p, null, 2);
    UI.modal({
      title: `Exporter « ${p.name} »`,
      bodyHTML: `
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:10px">
          Le fichier JSON peut être partagé ou donné au coach IA pour analyse.
        </p>
        <textarea readonly class="ed-json" id="export-json">${UI.esc(json)}</textarea>`,
      actions: [
        { label: "Copier", class: "btn-ghost", keepOpen: true, onClick: () => {
            const t = document.getElementById("export-json");
            (navigator.clipboard ? navigator.clipboard.writeText(json) : Promise.reject())
              .then(() => UI.toast("JSON copié"))
              .catch(() => { t.select(); document.execCommand("copy"); UI.toast("JSON copié"); });
          } },
        { label: "Télécharger", class: "btn-primary", keepOpen: true, onClick: () => {
            const name = `${p.id}.json`;
            // Android : le WebView ne télécharge pas les blob: — le shell
            // expose AndroidBridge.saveJson qui écrit dans Téléchargements.
            if (window.AndroidBridge && window.AndroidBridge.saveJson) {
              window.AndroidBridge.saveJson(name, btoa(unescape(encodeURIComponent(json))));
              return;
            }
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
            a.download = name;
            a.click();
          } },
      ],
    });
  }

  function importProgram(el) {
    UI.modal({
      title: "Importer un programme (JSON)",
      bodyHTML: `
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:10px">
          Choisis un fichier .json exporté depuis Pulse, ou colle-le — par exemple un
          programme généré par le coach IA.
        </p>
        <input type="file" id="imp-file" accept=".json,application/json" style="margin-bottom:10px"/>
        <textarea id="imp-text" class="ed-json" placeholder='{"name":"…","sessions":[…]}'></textarea>`,
      actions: [
        { label: "Annuler", class: "btn-ghost" },
        { label: "Importer", class: "btn-primary", keepOpen: true, onClick: (backdrop) => {
            const file = backdrop.querySelector("#imp-file").files[0];
            const finish = (text) => {
              try {
                const p = JSON.parse(text);
                if (!p.name || !Array.isArray(p.sessions)) throw new Error("forme invalide");
                if (!p.id || Store.allPrograms().some((x) => x.id === p.id))
                  p.id = `custom-${Date.now().toString(36)}`;
                p.sessions = p.sessions.map((s, i) => ({
                  id: s.id || `${p.id}-s${i + 1}`,
                  name: s.name || `Séance ${i + 1}`,
                  exercises: (s.exercises || []).map((e) => ({
                    name: e.name || "Exercice", sets: e.sets || "3 × 10",
                    muscles: e.muscles || [], secondary: e.secondary || [],
                  })),
                }));
                Store.saveProgram(p);
                backdrop.remove();
                UI.toast(`« ${p.name} » importé`);
                location.hash = `#/programmes/${p.id}`;
              } catch (e) {
                UI.toast("JSON invalide : " + e.message);
              }
            };
            if (file) file.text().then(finish);
            else finish(backdrop.querySelector("#imp-text").value);
          } },
      ],
    });
  }

  /* ---------- Liste ---------- */

  function renderList(el) {
    const activeId = Store.getActiveProgramId();
    const all = Store.allPrograms();
    el.innerHTML = `
      <div class="view-header">
        <div class="view-eyebrow">Entraînement</div>
        <h1 class="view-title">Programmes</h1>
        <p class="view-subtitle">Choisis un plan, suis tes séances, touche un exercice pour voir les muscles travaillés — ou crée le tien.</p>
      </div>
      <div class="prog-tools">
        <a class="btn btn-primary" href="#/programmes/nouveau">${UI.icon("plus")} Créer un programme</a>
        <button class="btn btn-ghost" id="import-btn">Importer JSON</button>
      </div>
      <div class="grid">
        ${all.map((p) => `
          <div class="card program-card">
            <div class="program-head">
              <div class="program-name">${UI.esc(p.name)}</div>
              ${p.id === activeId ? `<span class="badge">Actif</span>` : ""}
              ${p.custom ? `<span class="badge neutral">Perso</span>` : ""}
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
    el.querySelector("#import-btn").onclick = () => importProgram(el);
  }

  function render(el, params) {
    const p = params && params[0];
    if (p === "nouveau") return renderEditor(el, null);
    if (p === "edition" && params[1]) {
      const custom = Store.getCustomPrograms().find((x) => x.id === params[1]);
      if (custom) return renderEditor(el, custom);
    }
    const program = p && Store.allPrograms().find((x) => x.id === p);
    if (p && program) renderDetail(el, program);
    else renderList(el);
  }

  return { render };
})();
