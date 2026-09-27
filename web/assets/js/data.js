/* ============================================================
   Pulse — données statiques
   Base d'aliments (pour 100 g) + bibliothèque de programmes.
   ============================================================ */

const FOOD_DB = [
  { name: "Blanc de poulet",       kcal: 120, p: 23,  c: 0,   f: 2.6 },
  { name: "Œuf (1 moyen)",         kcal: 74,  p: 6.3, c: 0.4, f: 5,   unit: "pièce" },
  { name: "Riz blanc cuit",        kcal: 130, p: 2.7, c: 28,  f: 0.3 },
  { name: "Riz complet cuit",      kcal: 112, p: 2.6, c: 23,  f: 0.9 },
  { name: "Pâtes cuites",          kcal: 158, p: 5.8, c: 31,  f: 0.9 },
  { name: "Flocons d'avoine",      kcal: 379, p: 13,  c: 67,  f: 6.9 },
  { name: "Pain complet",          kcal: 247, p: 9,   c: 44,  f: 3.4 },
  { name: "Banane",                kcal: 90,  p: 1.1, c: 23,  f: 0.3 },
  { name: "Pomme",                 kcal: 52,  p: 0.3, c: 14,  f: 0.2 },
  { name: "Saumon",                kcal: 208, p: 20,  c: 0,   f: 13 },
  { name: "Thon en boîte",         kcal: 116, p: 26,  c: 0,   f: 1 },
  { name: "Steak haché 5%",        kcal: 137, p: 21,  c: 0,   f: 5 },
  { name: "Fromage blanc 0%",      kcal: 48,  p: 8,   c: 3.5, f: 0.2 },
  { name: "Skyr",                  kcal: 63,  p: 11,  c: 4,   f: 0.2 },
  { name: "Yaourt grec",           kcal: 97,  p: 9,   c: 3.9, f: 5 },
  { name: "Lait demi-écrémé",      kcal: 46,  p: 3.3, c: 4.8, f: 1.6 },
  { name: "Pomme de terre vapeur", kcal: 77,  p: 2,   c: 17,  f: 0.1 },
  { name: "Patate douce",          kcal: 86,  p: 1.6, c: 20,  f: 0.1 },
  { name: "Brocoli",               kcal: 34,  p: 2.8, c: 7,   f: 0.4 },
  { name: "Haricots verts",        kcal: 31,  p: 1.8, c: 7,   f: 0.1 },
  { name: "Épinards",              kcal: 23,  p: 2.9, c: 3.6, f: 0.4 },
  { name: "Avocat",                kcal: 160, p: 2,   c: 9,   f: 15 },
  { name: "Beurre de cacahuète",   kcal: 588, p: 25,  c: 20,  f: 50 },
  { name: "Amandes",               kcal: 579, p: 21,  c: 22,  f: 50 },
  { name: "Huile d'olive",         kcal: 884, p: 0,   c: 0,   f: 100 },
  { name: "Quinoa cuit",           kcal: 120, p: 4.4, c: 21,  f: 1.9 },
  { name: "Lentilles cuites",      kcal: 116, p: 9,   c: 20,  f: 0.4 },
  { name: "Pois chiches cuits",    kcal: 164, p: 9,   c: 27,  f: 2.6 },
  { name: "Tofu ferme",            kcal: 144, p: 15,  c: 2,   f: 9 },
  { name: "Whey protéine",         kcal: 400, p: 80,  c: 8,   f: 6 },
  { name: "Pain blanc",            kcal: 265, p: 9,   c: 49,  f: 3.2 },
  { name: "Miel",                  kcal: 304, p: 0.3, c: 82,  f: 0 },
  { name: "Chocolat noir 70%",     kcal: 560, p: 8,   c: 43,  f: 41 },
  { name: "Mozzarella",            kcal: 280, p: 28,  c: 3,   f: 17 },
  { name: "Pizza (part)",          kcal: 266, p: 11,  c: 33,  f: 10 },
  { name: "Sushi saumon (6 pcs)",  kcal: 172, p: 8,   c: 29,  f: 2.5, unit: "portion" },
];

const MEALS = [
  { id: "matin",  label: "Petit-déjeuner", icon: "sunrise" },
  { id: "midi",   label: "Déjeuner",       icon: "sun" },
  { id: "soir",   label: "Dîner",          icon: "moon" },
  { id: "snack",  label: "Collations",     icon: "apple" },
];

/* Muscles : identifiants utilisés par le mannequin (muscle-map.js) */
const MUSCLE_LABELS = {
  pectoraux:   "Pectoraux",
  deltoides:   "Deltoïdes",
  trapezes:    "Trapèzes",
  biceps:      "Biceps",
  triceps:     "Triceps",
  avantbras:   "Avant-bras",
  abdominaux:  "Abdominaux",
  obliques:    "Obliques",
  dorsaux:     "Grand dorsal",
  lombaires:   "Lombaires",
  quadriceps:  "Quadriceps",
  adducteurs:  "Adducteurs",
  fessiers:    "Fessiers",
  ischios:     "Ischio-jambiers",
  mollets:     "Mollets",
  cardio:      "Cardio / système cardio-respiratoire",
};

const PROGRAMS = [
  {
    id: "fullbody-debutant",
    name: "Full Body — Débutant",
    level: "Débutant",
    daysPerWeek: 3,
    duration: "8 semaines",
    goal: "Remise en forme globale",
    desc: "Un programme complet qui travaille tout le corps à chaque séance. Idéal pour construire des bases solides et prendre le rythme.",
    sessions: [
      {
        id: "fb-a",
        name: "Séance A — Haut & Jambes",
        exercises: [
          { name: "Squat gobelet", sets: "3 × 10", muscles: ["quadriceps", "fessiers"], secondary: ["adducteurs", "abdominaux"] },
          { name: "Développé haltères", sets: "3 × 10", muscles: ["pectoraux", "deltoides"], secondary: ["triceps"] },
          { name: "Rowing haltère unilatéral", sets: "3 × 10 / côté", muscles: ["dorsaux", "biceps"], secondary: ["trapezes", "avantbras"] },
          { name: "Planche", sets: "3 × 30 s", muscles: ["abdominaux"], secondary: ["obliques", "lombaires"] },
        ],
      },
      {
        id: "fb-b",
        name: "Séance B — Chaine postérieure",
        exercises: [
          { name: "Soulevé de terre roumain", sets: "3 × 10", muscles: ["ischios", "fessiers"], secondary: ["lombaires", "dorsaux"] },
          { name: "Pompes (ou surélevées)", sets: "3 × 8-12", muscles: ["pectoraux", "triceps"], secondary: ["deltoides", "abdominaux"] },
          { name: "Tirage élastique / tirage vertical", sets: "3 × 12", muscles: ["dorsaux", "biceps"], secondary: ["trapezes"] },
          { name: "Gainage latéral", sets: "2 × 25 s / côté", muscles: ["obliques"], secondary: ["abdominaux"] },
        ],
      },
      {
        id: "fb-c",
        name: "Séance C — Volume & cardio",
        exercises: [
          { name: "Fentes marchées", sets: "3 × 12 / jambe", muscles: ["quadriceps", "fessiers"], secondary: ["ischios", "mollets"] },
          { name: "Développé militaire", sets: "3 × 10", muscles: ["deltoides", "triceps"], secondary: ["trapezes"] },
          { name: "Curl haltères", sets: "3 × 12", muscles: ["biceps"], secondary: ["avantbras"] },
          { name: "Corde à sauter", sets: "5 × 1 min", muscles: ["cardio", "mollets"], secondary: ["abdominaux"] },
        ],
      },
    ],
  },
  {
    id: "perte-poids",
    name: "Perte de poids — Brûle & Renforce",
    level: "Intermédiaire",
    daysPerWeek: 4,
    duration: "6 semaines",
    goal: "Dépense calorique",
    desc: "Circuits métaboliques alternant renforcement et cardio pour maximiser la dépense tout en préservant le muscle.",
    sessions: [
      {
        id: "pp-1",
        name: "Circuit métabolique",
        exercises: [
          { name: "Kettlebell swing", sets: "4 × 15", muscles: ["fessiers", "ischios"], secondary: ["lombaires", "cardio"] },
          { name: "Thruster haltères", sets: "4 × 12", muscles: ["quadriceps", "deltoides"], secondary: ["triceps", "abdominaux"] },
          { name: "Burpees", sets: "4 × 10", muscles: ["cardio", "pectoraux"], secondary: ["quadriceps", "abdominaux"] },
          { name: "Mountain climbers", sets: "4 × 30 s", muscles: ["abdominaux", "cardio"], secondary: ["deltoides"] },
        ],
      },
      {
        id: "pp-2",
        name: "Bas du corps + cardio",
        exercises: [
          { name: "Squat saut", sets: "4 × 12", muscles: ["quadriceps", "fessiers"], secondary: ["mollets", "cardio"] },
          { name: "Fentes inversées", sets: "3 × 12 / jambe", muscles: ["quadriceps", "fessiers"], secondary: ["ischios"] },
          { name: "Hip thrust", sets: "3 × 15", muscles: ["fessiers"], secondary: ["ischios"] },
          { name: "Vélo / course intervalles", sets: "20 min HIIT", muscles: ["cardio"], secondary: ["quadriceps", "mollets"] },
        ],
      },
      {
        id: "pp-3",
        name: "Haut du corps tonique",
        exercises: [
          { name: "Pompes tempo lent", sets: "4 × 10", muscles: ["pectoraux", "triceps"], secondary: ["deltoides"] },
          { name: "Rowing élastique", sets: "4 × 15", muscles: ["dorsaux", "biceps"], secondary: ["trapezes"] },
          { name: "Élévations latérales", sets: "3 × 15", muscles: ["deltoides"], secondary: ["trapezes"] },
          { name: "Russian twist", sets: "3 × 20", muscles: ["obliques"], secondary: ["abdominaux"] },
        ],
      },
      {
        id: "pp-4",
        name: "Cardio & mobilité",
        exercises: [
          { name: "Course / marche rapide", sets: "30-40 min", muscles: ["cardio", "mollets"], secondary: ["quadriceps"] },
          { name: "Étirements actifs", sets: "10 min", muscles: ["ischios", "dorsaux"], secondary: ["fessiers"] },
        ],
      },
    ],
  },
  {
    id: "prise-masse",
    name: "Prise de masse — Push Pull Legs",
    level: "Intermédiaire",
    daysPerWeek: 6,
    duration: "10 semaines",
    goal: "Hypertrophie",
    desc: "Split PPL classique orienté volume. À combiner avec un léger surplus calorique suivi dans l'onglet Nutrition.",
    sessions: [
      {
        id: "ppl-push",
        name: "Push — Pectoraux, épaules, triceps",
        exercises: [
          { name: "Développé couché barre", sets: "4 × 6-8", muscles: ["pectoraux"], secondary: ["triceps", "deltoides"] },
          { name: "Développé incliné haltères", sets: "3 × 8-10", muscles: ["pectoraux", "deltoides"], secondary: ["triceps"] },
          { name: "Développé militaire", sets: "3 × 8", muscles: ["deltoides"], secondary: ["triceps", "trapezes"] },
          { name: "Dips", sets: "3 × 10-12", muscles: ["pectoraux", "triceps"], secondary: ["deltoides"] },
          { name: "Élévations latérales", sets: "3 × 15", muscles: ["deltoides"], secondary: [] },
        ],
      },
      {
        id: "ppl-pull",
        name: "Pull — Dos, biceps",
        exercises: [
          { name: "Tractions", sets: "4 × 6-10", muscles: ["dorsaux", "biceps"], secondary: ["avantbras"] },
          { name: "Rowing barre", sets: "4 × 8", muscles: ["dorsaux", "trapezes"], secondary: ["biceps", "lombaires"] },
          { name: "Face pull", sets: "3 × 15", muscles: ["deltoides", "trapezes"], secondary: [] },
          { name: "Curl barre", sets: "3 × 10", muscles: ["biceps"], secondary: ["avantbras"] },
          { name: "Curl marteau", sets: "3 × 12", muscles: ["biceps", "avantbras"], secondary: [] },
        ],
      },
      {
        id: "ppl-legs",
        name: "Legs — Jambes complètes",
        exercises: [
          { name: "Squat barre", sets: "4 × 6-8", muscles: ["quadriceps", "fessiers"], secondary: ["adducteurs", "abdominaux"] },
          { name: "Presse à cuisses", sets: "3 × 10", muscles: ["quadriceps"], secondary: ["fessiers"] },
          { name: "Leg curl", sets: "3 × 12", muscles: ["ischios"], secondary: [] },
          { name: "Mollets debout", sets: "4 × 15", muscles: ["mollets"], secondary: [] },
          { name: "Relevé de jambes suspendu", sets: "3 × 12", muscles: ["abdominaux"], secondary: ["avantbras"] },
        ],
      },
    ],
  },
  {
    id: "mobilite",
    name: "Mobilité & Bien-être",
    level: "Tous niveaux",
    daysPerWeek: 2,
    duration: "En continu",
    goal: "Souplesse & récupération",
    desc: "Séances douces pour améliorer la mobilité articulaire, la posture et accélérer la récupération.",
    sessions: [
      {
        id: "mob-1",
        name: "Mobilité globale",
        exercises: [
          { name: "Cat-cow", sets: "2 × 10", muscles: ["lombaires", "dorsaux"], secondary: [] },
          { name: "World's greatest stretch", sets: "2 × 5 / côté", muscles: ["ischios", "dorsaux"], secondary: ["fessiers", "obliques"] },
          { name: "Ouverture de hanches 90/90", sets: "2 × 8 / côté", muscles: ["fessiers", "adducteurs"], secondary: [] },
          { name: "Étirement pectoral au mur", sets: "2 × 30 s / côté", muscles: ["pectoraux"], secondary: ["deltoides"] },
        ],
      },
      {
        id: "mob-2",
        name: "Yoga flow doux",
        exercises: [
          { name: "Chien tête en bas", sets: "5 × 30 s", muscles: ["ischios", "mollets"], secondary: ["deltoides", "dorsaux"] },
          { name: "Guerrier I", sets: "3 × 30 s / côté", muscles: ["quadriceps", "fessiers"], secondary: ["obliques"] },
          { name: "Posture de l'enfant", sets: "3 × 45 s", muscles: ["lombaires", "dorsaux"], secondary: [] },
        ],
      },
    ],
  },
];

const DEFAULT_GOALS = { kcal: 2200, protein: 140, carbs: 240, fat: 73 };

/* Index des exercices connus : nom → muscles (pour l'éditeur de
   programmes : choisir un exercice connu pré-remplit ses muscles). */
const EXERCISE_INDEX = (() => {
  const idx = {};
  for (const p of PROGRAMS)
    for (const s of p.sessions)
      for (const e of s.exercises)
        if (!idx[e.name]) idx[e.name] = { muscles: e.muscles || [], secondary: e.secondary || [] };
  return idx;
})();
