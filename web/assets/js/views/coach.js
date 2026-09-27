/* ============================================================
   Pulse — vue Coach IA : chat + puces de contexte.
   Le moteur (coach-engine.js) assemble toutes les données locales
   en un system prompt prêt à brancher sur un vrai modèle.
   ============================================================ */

const CoachView = (() => {
  const SUGGESTIONS = [
    "Analyse ma nutrition",
    "Combien de protéines me reste-t-il ?",
    "Propose-moi une séance",
    "Je veux prendre du muscle",
    "Je veux perdre du gras",
  ];

  let sending = false;

  const bubble = (role, text, ts) => `
    <div class="msg ${role}">
      <div class="bubble">${UI.esc(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>")}</div>
      ${ts ? `<div class="msg-time">${new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>` : ""}
    </div>`;

  function chipsHtml() {
    return CoachEngine.contextChips().map((c) => `<span class="ctx-chip">${UI.esc(c)}</span>`).join("")
      + `<span class="ctx-chip ctx-chip-ia">${UI.esc(CoachEngine.statusLabel())}</span>`;
  }

  function scrollDown(sc) { sc.scrollTop = sc.scrollHeight; }

  /* ---------- Réglages IA : clé API, endpoint, modèle ---------- */

  function openSettingsModal(onSaved) {
    const cfg = Store.getCoachConfig();
    UI.modal({
      title: "Configurer l'IA",
      bodyHTML: `
        <div class="field">
          <label>Clé API</label>
          <input id="cfg-key" type="password" value="${UI.esc(cfg.apiKey || "")}" placeholder="sk-…" autocomplete="off" />
        </div>
        <div class="field">
          <label>Endpoint (format OpenAI)</label>
          <input id="cfg-endpoint" type="text" value="${UI.esc(cfg.endpoint || CoachEngine.DEFAULTS.endpoint)}" />
        </div>
        <div class="field">
          <label>Modèle</label>
          <input id="cfg-model" type="text" value="${UI.esc(cfg.model || CoachEngine.DEFAULTS.model)}" />
        </div>
        <div style="font-size:12px;color:var(--text-faint)">
          La clé reste sur ton appareil (localStorage). Compatible OpenAI, Mistral,
          Groq, LM Studio… — vide-la pour repasser en coach local.
        </div>`,
      actions: [
        { label: "Annuler" },
        {
          label: "Enregistrer",
          class: "btn-primary",
          onClick: (m) => {
            Store.setCoachConfig({
              apiKey: m.querySelector("#cfg-key").value.trim(),
              endpoint: m.querySelector("#cfg-endpoint").value.trim(),
              model: m.querySelector("#cfg-model").value.trim(),
            });
            UI.toast("Réglages IA enregistrés");
            onSaved();
          },
        },
      ],
    });
  }

  async function send(text, el) {
    if (sending || !text.trim()) return;
    sending = true;
    const sc = el.querySelector("#chat-scroll");

    Store.pushChat("user", text);
    sc.insertAdjacentHTML("beforeend", bubble("user", text, Date.now()));
    sc.insertAdjacentHTML(
      "beforeend",
      `<div class="msg bot" id="typing"><div class="bubble typing"><i></i><i></i><i></i></div></div>`
    );
    scrollDown(sc);

    const answer = await CoachEngine.respond(text);
    Store.pushChat("bot", answer);
    el.querySelector("#typing")?.remove();
    sc.insertAdjacentHTML("beforeend", bubble("bot", answer, Date.now()));
    scrollDown(sc);

    const chipsEl = el.querySelector("#ctx-chips");
    if (chipsEl) chipsEl.innerHTML = chipsHtml();
    sending = false;
  }

  function render(el) {
    const history = Store.getChat();

    el.innerHTML = `
      <div class="view-header" style="flex-direction:row;justify-content:space-between;align-items:flex-start">
        <div>
          <div class="view-eyebrow">Assistant personnel</div>
          <h1 class="view-title">Coach Pulse</h1>
          <p class="view-subtitle">Le coach lit ton journal nutrition, tes objectifs et ton programme pour te conseiller.</p>
        </div>
        <button class="btn btn-ghost btn-sm" id="coach-settings">⚙︎ IA</button>
      </div>

      <div class="chat">
        <div class="chat-context" id="ctx-chips">
          ${chipsHtml()}
        </div>

        <div class="chat-scroll" id="chat-scroll">
          ${history.length
            ? history.map((m) => bubble(m.role, m.text, m.ts)).join("")
            : `<div class="empty-state" style="margin:auto">
                ${UI.icon("coach")}
                <div class="es-title">Salut, je suis ton coach</div>
                <div style="font-size:13px;max-width:280px">Pose-moi une question sur ta nutrition, ton programme ou tes objectifs.</div>
              </div>`}
        </div>

        <div class="chips">
          ${SUGGESTIONS.map((s) => `<button class="chip">${s}</button>`).join("")}
        </div>

        <form class="chat-input" id="chat-form">
          <input id="chat-text" type="text" placeholder="Écris à ton coach…" autocomplete="off" />
          <button class="chat-send" type="submit" aria-label="Envoyer">${UI.icon("send")}</button>
        </form>
      </div>
    `;

    const sc = el.querySelector("#chat-scroll");
    scrollDown(sc);

    el.querySelector("#chat-form").onsubmit = (e) => {
      e.preventDefault();
      const inp = el.querySelector("#chat-text");
      send(inp.value, el);
      inp.value = "";
      inp.focus();
    };

    el.querySelectorAll(".chip").forEach((c) => {
      c.onclick = () => send(c.textContent, el);
    });

    el.querySelector("#coach-settings").onclick = () =>
      openSettingsModal(() => render(el));
  }

  return { render };
})();
