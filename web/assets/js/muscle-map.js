/* ============================================================
   Pulse — mannequin musculaire SVG (vue avant + dos).

   Approche : le corps est construit sur un « squelette » de
   chemins (ARM, LEG, THIGH_IN). La silhouette est ces chemins
   rendus en trait épais à extrémités rondes — membres homogènes,
   façon mannequin de vitrine. Chaque muscle est un SEGMENT du
   même chemin osseux (pathLength=100 + stroke-dasharray), donc
   la zone qui s'illumine est anatomiquement calée sur le membre
   correspondant (biceps = avant du bras, triceps = même os, vue
   de dos, quadriceps = cuisse, mollet = bas de jambe, etc.).

   Chaque élément musculaire porte data-m="<clé>" ; MuscleMap.render
   applique .on / .on2 selon primary / secondary.
   ============================================================ */

const MuscleMap = (() => {
  const FW = 200;   // demi-largeur — chaque côté est miroir de x=100
  const FH = 404;
  const CX = 100;

  /* ---------- Os (chemins du membre droit, miroir à x=100) ---------- */

  // Bras : épaule → coude → poignet → main (pend le long du corps)
  const ARM = "M148 76 C156 114 160 150 163 180 C166 208 169 230 168 250";

  // Jambe : hanche → genou → cheville
  const LEG = "M108 196 C112 238 116 272 119 296 C121 330 117 352 115 372";

  // Face interne de la cuisse (adducteurs)
  const THIGH_IN = "M104 210 C105 244 110 274 114 292";

  /* ---------- Tronc + tête (silhouette pleine, bord droit) ---------- */

  const TORSO = `M100 60
    C110 60 121 61 129 65
    C143 69 149 72 151 79
    C146 92 141 104 139 117
    C136 133 132 146 126 158
    C122 171 124 184 132 194
    C134 201 133 206 128 210
    C119 214 108 214 100 209
    Z`;

  const NECK = "M92 44 C92 50 91 56 89 61 L111 61 C109 56 108 50 108 44 Z";

  const FOOT = "M104 368 C114 366 126 370 132 378 C136 384 133 390 126 391 L108 391 C102 390 101 378 104 368 Z";

  /* ---------- Muscles ---------- */

  // Segment d'os : a→b % du chemin `bone`, épaisseur w.
  const seg = (muscle, bone, w, a, b) =>
    `<path class="mm-muscle mm-seg" data-m="${muscle}" d="${bone}" pathLength="100"
      fill="none" stroke-width="${w}" stroke-linecap="round"
      stroke-dasharray="${b - a} ${100 - (b - a)}" stroke-dashoffset="${-a}"/>`;

  const fill = (muscle, d) =>
    `<path class="mm-muscle" data-m="${muscle}" d="${d}"/>`;

  // Abdominaux : 3 blocs à droite du centre, miroir → 6-pack.
  const ABS_BLOCKS = [0, 1, 2]
    .map((i) => {
      const y = 120 + i * 21;
      return `M103 ${y} h15 a4.5 4.5 0 0 1 4.5 4.5 v7.5 a4.5 4.5 0 0 1 -4.5 4.5 h-15 a4.5 4.5 0 0 1 -4.5 -4.5 v-7.5 a4.5 4.5 0 0 1 4.5 -4.5 Z`;
    })
    .join(" ");

  const FRONT = {
    trapezes:   fill("trapezes",   "M100 62 C112 62 124 63 132 68 C126 78 116 84 103 85 C101 85 100 83 100 80 Z"),
    deltoides:  fill("deltoides",  "M138 66 C150 66 157 74 158 86 C159 96 151 103 142 101 C135 97 132 84 134 74 C135 69 136 67 138 66 Z"),
    pectoraux:  fill("pectoraux",  "M100 80 C112 78 125 82 132 93 C129 107 118 116 105 116 C102 116 100 115 100 111 Z"),
    biceps:     seg("biceps", ARM, 21, 14, 52),
    avantbras:  seg("avantbras", ARM, 17, 58, 88),
    abdominaux: fill("abdominaux", ABS_BLOCKS),
    obliques:   fill("obliques",   "M126 126 C130 138 128 152 122 161 C118 152 119 136 121 126 Z"),
    quadriceps: seg("quadriceps", LEG, 30, 5, 44),
    adducteurs: seg("adducteurs", THIGH_IN, 15, 0, 100),
  };

  const BACK = {
    trapezes:   fill("trapezes",   "M100 62 C113 62 128 64 136 71 C131 86 120 95 103 96 C101 96 100 94 100 90 Z"),
    deltoides:  fill("deltoides",  "M138 66 C150 66 157 74 158 86 C159 96 151 103 142 101 C135 97 132 84 134 74 C135 69 136 67 138 66 Z"),
    dorsaux:    fill("dorsaux",    "M100 104 C116 104 130 108 137 116 C135 132 129 148 123 156 C116 144 110 126 107 110 Z"),
    triceps:    seg("triceps", ARM, 20, 16, 56),
    avantbras:  seg("avantbras", ARM, 17, 58, 88),
    lombaires:  fill("lombaires",  "M103 156 h15 a4 4 0 0 1 4 4 v16 a4 4 0 0 1 -4 4 h-15 a4 4 0 0 1 -4 -4 v-16 a4 4 0 0 1 4 -4 Z"),
    fessiers:   fill("fessiers",   "M102 192 C114 190 128 194 133 204 C136 216 130 226 119 228 C109 230 102 224 102 214 Z"),
    ischios:    seg("ischios", LEG, 28, 8, 46),
    mollets:    seg("mollets", LEG, 24, 54, 86),
  };

  /* ---------- Rendu ---------- */

  function figure(side, label) {
    const muscles = side === "front" ? FRONT : BACK;
    const paths = Object.values(muscles).join("\n");

    return `
      <g>
        <defs>
          <g id="mm-limbs-${side}">
            <path d="${ARM}"  pathLength="100" fill="none" stroke-width="30" stroke-linecap="round" class="mm-sil-stroke"/>
            <path d="${LEG}"  pathLength="100" fill="none" stroke-width="38" stroke-linecap="round" class="mm-sil-stroke"/>
            <path d="${FOOT}" class="mm-sil"/>
          </g>
          <g id="mm-muscles-${side}">
            ${paths}
          </g>
        </defs>

        <ellipse class="mm-shadow" cx="${CX}" cy="397" rx="52" ry="6"/>
        <ellipse class="mm-sil" cx="${CX}" cy="29" rx="13.5" ry="17"/>
        <path class="mm-sil" d="${NECK}"/>
        <path class="mm-sil" d="${TORSO}"/>
        <use href="#mm-limbs-${side}"/>
        <use href="#mm-limbs-${side}" transform="matrix(-1 0 0 1 ${FW} 0)"/>

        <use href="#mm-muscles-${side}"/>
        <use href="#mm-muscles-${side}" transform="matrix(-1 0 0 1 ${FW} 0)"/>

        <text class="mm-label" x="${CX}" y="${FH + 8}" text-anchor="middle">${label}</text>
      </g>`;
  }

  function render(container, { primary = [], secondary = [] } = {}) {
    // id fixe : le CSS cible url(#mmGrad) pour les muscles actifs.
    container.innerHTML = `
      <svg class="muscle-map" viewBox="-8 -6 ${FW * 2 + 56} ${FH + 22}"
           xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mannequin musculaire avant et arrière">
        <defs>
          <linearGradient id="mmGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#d7ff6b"/>
            <stop offset="1" stop-color="#4ee1a0"/>
          </linearGradient>
        </defs>
        ${figure("front", "FACE AVANT")}
        <g transform="translate(${FW + 40},0)">${figure("back", "DOS")}</g>
      </svg>`;
    const svg = container.querySelector("svg");
    primary.forEach((m) => {
      svg.querySelectorAll(`[data-m="${m}"]`).forEach((p) => p.classList.add("on"));
    });
    secondary.forEach((m) => {
      svg.querySelectorAll(`[data-m="${m}"]:not(.on)`).forEach((p) => p.classList.add("on2"));
    });
  }

  return { render };
})();
