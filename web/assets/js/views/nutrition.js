/* ============================================================
   Pulse — vue Nutrition : journal par jour, ajout d'aliments
   (base intégrée + saisie libre), objectifs réglables.
   ============================================================ */

const NutritionView = (() => {
  let dayKey = Store.todayKey();

  const shiftDay = (n) => {
    const [y, m, d] = dayKey.split("-").map(Number);
    const dt = new Date(y, m - 1, d + n);
    dayKey = Store.todayKey(dt);
    render(document.getElementById("view"));
  };

  /* ---------- Modale : ajouter un aliment ---------- */

  function openAddModal(mealId, onDone) {
    let picked = null;

    const body = `
      <div class="field" style="position:relative">
        <label>Aliment</label>
        <input id="add-name" type="text" placeholder="Ex. Blanc de poulet" autocomplete="off" />
        <div id="food-suggest"></div>
      </div>
      <div class="field-row">
        <div class="field"><label id="add-qty-label">Quantité (g)</label><input id="add-grams" type="number" inputmode="decimal" value="100" min="0" step="0.5" /></div>
        <div class="field"><label>Calories (kcal)</label><input id="add-kcal" type="number" inputmode="decimal" min="0" /></div>
      </div>
      <div class="field-row" style="grid-template-columns:1fr 1fr 1fr">
        <div class="field"><label>Prot. (g)</label><input id="add-p" type="number" inputmode="decimal" min="0" /></div>
        <div class="field"><label>Gluc. (g)</label><input id="add-c" type="number" inputmode="decimal" min="0" /></div>
        <div class="field"><label>Lip. (g)</label><input id="add-f" type="number" inputmode="decimal" min="0" /></div>
      </div>
      <div style="font-size:12px;color:var(--text-faint)">Choisis un aliment de la base pour préremplir, ou saisis les valeurs à la main.</div>
    `;

    UI.modal({
      title: "Ajouter un aliment",
      bodyHTML: body,
      actions: [
        { label: "Annuler" },
        {
          label: "Ajouter",
          class: "btn-primary",
          keepOpen: true,
          onClick: (m) => {
            const name = m.querySelector("#add-name").value.trim();
            const kcal = parseFloat(m.querySelector("#add-kcal").value);
            if (!name || !(kcal >= 0)) { UI.toast("Nom et calories requis"); return; }
            Store.addEntry(dayKey, mealId, {
              name,
              grams: parseFloat(m.querySelector("#add-grams").value) || null,
              unit: picked && picked.unit ? picked.unit : null,
              kcal,
              p: parseFloat(m.querySelector("#add-p").value) || 0,
              c: parseFloat(m.querySelector("#add-c").value) || 0,
              f: parseFloat(m.querySelector("#add-f").value) || 0,
            });
            m.remove();
            UI.toast("Aliment ajouté");
            onDone();
          },
        },
      ],
      onOpen: (m) => {
        const nameIn = m.querySelector("#add-name");
        const gramsIn = m.querySelector("#add-grams");
        const box = m.querySelector("#food-suggest");
        const fields = ["kcal", "p", "c", "f"].reduce(
          (o, k) => ({ ...o, [k]: m.querySelector(`#add-${k}`) }), {}
        );

        const applyFood = () => {
          if (!picked) return;
          const qty = parseFloat(gramsIn.value) || 0;
          const k = picked.unit ? qty : qty / 100;
          fields.kcal.value = Math.round(picked.kcal * k);
          fields.p.value = (picked.p * k).toFixed(1);
          fields.c.value = (picked.c * k).toFixed(1);
          fields.f.value = (picked.f * k).toFixed(1);
        };

        gramsIn.addEventListener("input", applyFood);

        nameIn.addEventListener("input", () => {
          const q = nameIn.value.trim().toLowerCase();
          if (q.length < 2) { box.innerHTML = ""; box.className = ""; return; }
          const hits = FOOD_DB.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 6);
          if (!hits.length) { box.innerHTML = ""; box.className = ""; return; }
          box.className = "food-suggest";
          box.innerHTML = hits
            .map((f, i) => `<button type="button" data-i="${i}"><span>${UI.esc(f.name)}</span><span class="fs-kcal">${f.kcal} kcal/${f.unit || "100 g"}</span></button>`)
            .join("");
          box.querySelectorAll("button").forEach((b) => {
            b.onclick = () => {
              picked = hits[+b.dataset.i];
              nameIn.value = picked.name;
              box.innerHTML = ""; box.className = "";
              if (picked.unit) {
                m.querySelector("#add-qty-label").textContent = `Quantité (${picked.unit})`;
                gramsIn.value = 1;
              } else {
                m.querySelector("#add-qty-label").textContent = "Quantité (g)";
                gramsIn.value = 100;
              }
              applyFood();
            };
          });
        });
      },
    });
  }

  /* ---------- Modale : objectifs ---------- */

  function openGoalsModal(onDone) {
    const g = Store.getGoals();
    UI.modal({
      title: "Objectifs quotidiens",
      bodyHTML: `
        <div class="field"><label>Calories (kcal)</label><input id="g-kcal" type="number" value="${g.kcal}" /></div>
        <div class="field-row" style="grid-template-columns:1fr 1fr 1fr">
          <div class="field"><label>Protéines (g)</label><input id="g-p" type="number" value="${g.protein}" /></div>
          <div class="field"><label>Glucides (g)</label><input id="g-c" type="number" value="${g.carbs}" /></div>
          <div class="field"><label>Lipides (g)</label><input id="g-f" type="number" value="${g.fat}" /></div>
        </div>`,
      actions: [
        { label: "Annuler" },
        {
          label: "Enregistrer",
          class: "btn-primary",
          onClick: (m) => {
            Store.setGoals({
              kcal: +m.querySelector("#g-kcal").value || DEFAULT_GOALS.kcal,
              protein: +m.querySelector("#g-p").value || DEFAULT_GOALS.protein,
              carbs: +m.querySelector("#g-c").value || DEFAULT_GOALS.carbs,
              fat: +m.querySelector("#g-f").value || DEFAULT_GOALS.fat,
            });
            UI.toast("Objectifs mis à jour");
            onDone();
          },
        },
      ],
    });
  }

  /* ---------- Rendu ---------- */

  function mealBlock(meal, entries, rerender) {
    const list = entries.filter((e) => e.meal === meal.id);
    const kcal = list.reduce((s, e) => s + e.kcal, 0);
    const items = list.length
      ? list.map((e) => `
          <div class="meal-item">
            <div>
              <div class="mi-name">${UI.esc(e.name)}${e.grams ? ` <span style="color:var(--text-faint);font-weight:500">· ${e.grams} ${e.unit || "g"}</span>` : ""}</div>
              <div class="mi-meta">${e.kcal} kcal · P ${e.p} · G ${e.c} · L ${e.f}</div>
            </div>
            <button class="mi-del" data-del="${e.id}" aria-label="Supprimer">${UI.icon("trash")}</button>
          </div>`).join("")
      : `<div class="meal-empty">Rien d'enregistré pour l'instant.</div>`;

    return `
      <div class="card meal">
        <div class="meal-head">
          <div class="meal-name">${UI.icon(meal.icon)} ${meal.label}</div>
          <div class="meal-kcal">${Math.round(kcal)} kcal</div>
        </div>
        <div class="meal-items">${items}</div>
        <button class="meal-add" data-add="${meal.id}">${UI.icon("plus")} Ajouter</button>
      </div>`;
  }

  function render(el) {
    const goals = Store.getGoals();
    const entries = Store.getLog(dayKey);
    const t = Store.dayTotals(dayKey);
    const day = UI.fmtDay(dayKey);
    const kcalPct = Math.min((t.kcal / goals.kcal) * 100, 100);

    el.innerHTML = `
      <div class="view-header" style="flex-direction:row;justify-content:space-between;align-items:flex-start">
        <div>
          <div class="view-eyebrow">Suivi</div>
          <h1 class="view-title">Nutrition</h1>
        </div>
        <button class="btn btn-ghost btn-sm" id="goals-btn">⚙︎ Objectifs</button>
      </div>

      <div class="day-nav">
        <button id="day-prev" aria-label="Jour précédent">${UI.icon("chevL")}</button>
        <div>
          <div class="day-label">${day.main}</div>
          <div class="day-sub">${day.sub}</div>
        </div>
        <button id="day-next" aria-label="Jour suivant">${UI.icon("chevR")}</button>
      </div>

      <div class="card">
        <div class="card-title">Total du jour</div>
        <div class="macro">
          <div class="macro-head">
            <span class="macro-name">Calories</span>
            <span class="macro-val">${t.kcal} / ${goals.kcal} kcal</span>
          </div>
          <div class="bar"><i style="width:${kcalPct}%"></i></div>
        </div>
        <div class="macro-row" style="margin-top:14px">
          ${["p", "c", "f"].map((k) => {
            const names = { p: "Protéines", c: "Glucides", f: "Lipides" };
            const goalsK = { p: goals.protein, c: goals.carbs, f: goals.fat };
            return `
              <div class="macro">
                <div class="macro-head"><span class="macro-name">${names[k]}</span><span class="macro-val">${Math.round(t[k])} / ${goalsK[k]} g</span></div>
                <div class="bar ${k}"><i style="width:${Math.min((t[k] / goalsK[k]) * 100, 100)}%"></i></div>
              </div>`;
          }).join("")}
        </div>
      </div>

      ${MEALS.map((m) => mealBlock(m, entries)).join("")}
    `;

    el.querySelector("#day-prev").onclick = () => shiftDay(-1);
    el.querySelector("#day-next").onclick = () => shiftDay(1);
    el.querySelector("#goals-btn").onclick = () =>
      openGoalsModal(() => render(el));

    el.querySelectorAll("[data-add]").forEach((b) => {
      b.onclick = () => openAddModal(b.dataset.add, () => render(el));
    });
    el.querySelectorAll("[data-del]").forEach((b) => {
      b.onclick = () => {
        Store.removeEntry(dayKey, b.dataset.del);
        render(el);
      };
    });
  }

  return { render };
})();
