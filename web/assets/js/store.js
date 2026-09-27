/* ============================================================
   Pulse — store
   Couche de persistance locale (localStorage). Toute la donnée
   utilisateur reste sur l'appareil : journal nutrition, objectifs,
   programme actif, séances complétées, historique du coach.
   ============================================================ */

const Store = (() => {
  const NS = "pulse.v1";

  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(NS)) || {};
    } catch {
      return {};
    }
  };

  let state = load();

  const persist = () => localStorage.setItem(NS, JSON.stringify(state));

  /* ---------- Objectifs ---------- */

  const getGoals = () => ({ ...DEFAULT_GOALS, ...(state.goals || {}) });
  const setGoals = (goals) => {
    state.goals = { ...getGoals(), ...goals };
    persist();
  };

  /* ---------- Journal nutrition ---------- */

  const todayKey = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const getLog = (dayKey) => (state.logs && state.logs[dayKey]) || [];

  const addEntry = (dayKey, meal, item) => {
    state.logs = state.logs || {};
    state.logs[dayKey] = state.logs[dayKey] || [];
    const entry = {
      id: `e${Date.now()}${Math.floor(Math.random() * 999)}`,
      meal,
      name: item.name,
      grams: item.grams || null,
      unit: item.unit || null,
      kcal: Math.round(item.kcal),
      p: +(item.p || 0).toFixed(1),
      c: +(item.c || 0).toFixed(1),
      f: +(item.f || 0).toFixed(1),
      ts: Date.now(),
    };
    state.logs[dayKey].push(entry);
    persist();
    return entry;
  };

  const removeEntry = (dayKey, entryId) => {
    if (!state.logs || !state.logs[dayKey]) return;
    state.logs[dayKey] = state.logs[dayKey].filter((e) => e.id !== entryId);
    persist();
  };

  const dayTotals = (dayKey) =>
    getLog(dayKey).reduce(
      (acc, e) => ({
        kcal: acc.kcal + e.kcal,
        p: acc.p + e.p,
        c: acc.c + e.c,
        f: acc.f + e.f,
      }),
      { kcal: 0, p: 0, c: 0, f: 0 }
    );

  const recentDays = (n = 7) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push(todayKey(d));
    }
    return out;
  };

  /* ---------- Programme actif & progression ---------- */

  const getActiveProgramId = () => state.activeProgram || null;
  const setActiveProgram = (id) => {
    state.activeProgram = id;
    persist();
  };
  const getActiveProgram = () =>
    PROGRAMS.find((p) => p.id === state.activeProgram) || null;

  const isSessionDone = (sessionId) =>
    (state.doneSessions || []).includes(sessionId);
  const toggleSessionDone = (sessionId) => {
    state.doneSessions = state.doneSessions || [];
    const i = state.doneSessions.indexOf(sessionId);
    if (i >= 0) state.doneSessions.splice(i, 1);
    else state.doneSessions.push(sessionId);
    persist();
    return i < 0;
  };

  /* ---------- Profil (léger) ---------- */

  const getProfile = () => state.profile || { name: "", goal: "Remise en forme" };
  const setProfile = (p) => {
    state.profile = { ...getProfile(), ...p };
    persist();
  };

  /* ---------- Historique du chat coach ---------- */

  const getChat = () => state.chat || [];
  const pushChat = (role, text) => {
    state.chat = (state.chat || []).concat({ role, text, ts: Date.now() }).slice(-60);
    persist();
  };
  const clearChat = () => {
    state.chat = [];
    persist();
  };

  return {
    todayKey,
    getGoals, setGoals,
    getLog, addEntry, removeEntry, dayTotals, recentDays,
    getActiveProgramId, setActiveProgram, getActiveProgram,
    isSessionDone, toggleSessionDone,
    getProfile, setProfile,
    getChat, pushChat, clearChat,
  };
})();
