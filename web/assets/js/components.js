/* ============================================================
   Pulse — composants partagés : icônes SVG, toast, modale.
   ============================================================ */

const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>`,
  nutrition: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-4 4-7 7.5-7 11a7 7 0 0 0 14 0c0-3.5-3-7-7-11z"/><path d="M12 21v-8"/></svg>`,
  programs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/></svg>`,
  coach: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/><path d="M5 3l.7 1.8L7.5 5.5l-1.8.7L5 8l-.7-1.8L2.5 5.5l1.8-.7z"/></svg>`,
  pricing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.2L12 14.5 7.2 16.5l.9-5.2L4.3 7.6l5.3-.8z"/></svg>`,
  sunrise: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M5 9l1.5 1.5M19 9l-1.5 1.5M2 18h20M8 18a4 4 0 0 1 8 0"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`,
  apple: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7c0-2 1.5-4 3.5-4C16 5 15 7 12 7z"/><path d="M12 7c-1.5-1.5-4-1.8-5.5-.5C4 8.5 4 13 6.5 17c1.2 2 2.5 3.5 3.5 3.5 1 0 1.5-.5 2-.5s1 .5 2 .5c1 0 2.3-1.5 3.5-3.5C20 13 20 8.5 17.5 6.5 16 5.2 13.5 5.5 12 7z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>`,
  flame: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c3 4 7 6.5 7 11a7 7 0 0 1-14 0c0-2 .8-3.8 2-5.5.5 1.5 1.5 2.5 2.5 2.5C9 7 10 4 12 2z"/></svg>`,
  body: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.4"/><path d="M12 8v5M7 9.5h10M9 21l3-7 3 7"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21S3 14.5 3 8.8A4.8 4.8 0 0 1 12 5a4.8 4.8 0 0 1 9 3.8C21 14.5 12 21 12 21z"/></svg>`,
  chevL: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>`,
  chevR: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>`,
};

const UI = (() => {
  const icon = (name, cls = "") =>
    `<span class="ico ${cls}" style="display:inline-flex">${ICONS[name] || ""}</span>`;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

  function toast(msg, ms = 2200) {
    const root = document.getElementById("toast-root");
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    root.appendChild(t);
    setTimeout(() => {
      t.style.transition = "opacity .3s";
      t.style.opacity = "0";
      setTimeout(() => t.remove(), 320);
    }, ms);
  }

  function modal({ title, bodyHTML, actions = [], onOpen }) {
    const root = document.getElementById("modal-root");
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-title">${esc(title)}</div>
        <div class="modal-body">${bodyHTML}</div>
        <div class="modal-actions"></div>
      </div>`;
    const actionsEl = backdrop.querySelector(".modal-actions");
    for (const a of actions) {
      const b = document.createElement("button");
      b.className = `btn ${a.class || "btn-ghost"}`;
      b.textContent = a.label;
      b.onclick = () => { a.onClick && a.onClick(backdrop); if (!a.keepOpen) close(); };
      actionsEl.appendChild(b);
    }
    const close = () => backdrop.remove();
    backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });
    root.appendChild(backdrop);
    onOpen && onOpen(backdrop);
    return { close, el: backdrop };
  }

  const fmtKcal = (v) => `${Math.round(v)} kcal`;

  const DAY_NAMES = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
  const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  function fmtDay(dayKey) {
    const [y, m, d] = dayKey.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    const today = Store.todayKey();
    const yest = Store.todayKey(new Date(Date.now() - 86400000));
    if (dayKey === today) return { main: "Aujourd'hui", sub: `${d} ${MONTHS[m - 1]}` };
    if (dayKey === yest) return { main: "Hier", sub: `${d} ${MONTHS[m - 1]}` };
    return { main: `${DAY_NAMES[dt.getDay()]} ${d}`, sub: MONTHS[m - 1] };
  }

  return { icon, esc, toast, modal, fmtKcal, fmtDay };
})();
