/* ============================================================
   Pulse — routeur par hash + navigation.
   Routes : #/accueil  #/nutrition  #/programmes[/id]
            #/coach  #/pricing  #/legal/mentions-legales|cgu
   ============================================================ */

const App = (() => {
  const TABS = [
    { route: "#/accueil",    label: "Accueil",    icon: "home" },
    { route: "#/nutrition",  label: "Nutrition",  icon: "nutrition" },
    { route: "#/programmes", label: "Programmes", icon: "programs" },
    { route: "#/coach",      label: "Coach IA",   icon: "coach" },
    { route: "#/pricing",    label: "Pricing",    icon: "pricing" },
  ];

  const ROUTES = [
    { re: /^#\/accueil$/,                  view: HomeView },
    { re: /^#\/nutrition$/,                view: NutritionView },
    { re: /^#\/programmes(?:\/([\w-]+))?$/, view: ProgrammesView },
    { re: /^#\/coach$/,                    view: CoachView },
    { re: /^#\/pricing$/,                  view: PricingView },
    { re: /^#\/legal\/([\w-]+)$/,          view: LegalView },
  ];

  function currentRoute() {
    const h = location.hash || "#/accueil";
    for (const r of ROUTES) {
      const m = h.match(r.re);
      if (m) return { view: r.view, params: m.slice(1).filter(Boolean), hash: h };
    }
    return { view: HomeView, params: [], hash: "#/accueil" };
  }

  function renderNav() {
    const html = TABS.map(
      (t) => `<a href="${t.route}" data-route="${t.route}">${UI.icon(t.icon)}<span>${t.label}</span></a>`
    ).join("");
    document.getElementById("tabbar").innerHTML = html;
    document.getElementById("nav").innerHTML = html;
  }

  function highlightNav(hash) {
    const top = TABS.find((t) => hash.startsWith(t.route));
    document
      .querySelectorAll("#tabbar a, #nav a")
      .forEach((a) => a.classList.toggle("active", top && a.dataset.route === top.route));
  }

  function route() {
    const { view, params, hash } = currentRoute();
    const el = document.getElementById("view");
    el.style.animation = "none";
    void el.offsetHeight;
    el.style.animation = "";
    view.render(el, params);
    highlightNav(hash);
    document.getElementById("main").scrollTop = 0;
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", route);
  renderNav();
  route();
})();
