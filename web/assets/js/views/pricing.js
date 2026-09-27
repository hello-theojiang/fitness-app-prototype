/* ============================================================
   Pulse — vue Pricing (3 plans). Page en chantier : les boutons
   d'achat sont des placeholders en attendant le paiement.
   ============================================================ */

const PricingView = (() => {
  const PLANS = [
    {
      id: "decouverte",
      name: "Découverte",
      amount: "0 €",
      per: "pour toujours",
      desc: "Pour démarrer le suivi sans engagement.",
      features: [
        "Journal nutrition complet",
        "Objectifs calories & macros",
        "1 programme actif à la fois",
        "Mannequin musculaire par exercice",
      ],
      cta: "Plan actuel",
      featured: false,
    },
    {
      id: "pro",
      name: "Pro",
      amount: "9,99 €",
      per: "/ mois",
      desc: "Le coach IA et tous les programmes.",
      features: [
        "Tout Découverte",
        "Coach IA illimité",
        "Tous les programmes",
        "Programmes personnalisés par l'IA",
        "Statistiques avancées",
      ],
      cta: "Passer Pro",
      featured: true,
      flag: "Le plus populaire",
    },
    {
      id: "elite",
      name: "Elite",
      amount: "19,99 €",
      per: "/ mois",
      desc: "Un accompagnement complet et prioritaire.",
      features: [
        "Tout Pro",
        "Plans repas hebdomadaires IA",
        "Ajustements automatiques des objectifs",
        "Analyse de progression détaillée",
        "Support prioritaire",
      ],
      cta: "Passer Elite",
      featured: false,
    },
  ];

  function render(el) {
    el.innerHTML = `
      <div class="view-header">
        <div class="view-eyebrow">Abonnements</div>
        <h1 class="view-title">Choisis ton plan</h1>
        <p class="view-subtitle">Trois formules pour progresser à ton rythme. Le paiement sera branché prochainement.</p>
      </div>

      <div class="plans">
        ${PLANS.map((p) => `
          <div class="plan ${p.featured ? "featured" : ""}">
            ${p.flag ? `<div class="plan-flag">${p.flag}</div>` : ""}
            <div class="plan-name">${p.name}</div>
            <div class="plan-price">
              <span class="amount">${p.amount}</span>
              <span class="per">${p.per}</span>
            </div>
            <p class="plan-desc">${p.desc}</p>
            <ul>
              ${p.features.map((f) => `<li>${UI.icon("check")}<span>${f}</span></li>`).join("")}
            </ul>
            <button class="btn ${p.featured ? "btn-primary" : "btn-ghost"} btn-block" data-plan="${p.id}">${p.cta}</button>
          </div>`).join("")}
      </div>

      <div class="card" style="font-size:12.5px;color:var(--text-faint)">
        Paiement sécurisé à venir — résiliable à tout moment. En continuant, tu acceptes les
        <a href="#/legal/cgu" style="color:var(--accent);font-weight:600">CGU</a>.
      </div>
    `;

    el.querySelectorAll("[data-plan]").forEach((b) => {
      b.onclick = () =>
        UI.toast("Les paiements arrivent bientôt — cette page est en préparation.");
    });
  }

  return { render };
})();
