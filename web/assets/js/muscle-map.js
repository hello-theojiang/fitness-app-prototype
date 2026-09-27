/* ============================================================
   Pulse — mannequin musculaire (muscle-map)
   Silhouette athlétique avant / dos en SVG inline. Chaque groupe
   musculaire est une forme organique qui s'illumine quand elle
   est sollicitée (primaire : dégradé accent + halo ; secondaire :
   estompé). Au repos, les muscles restent visibles en tonalité
   discrète — l'anatomie se lit sans interaction.
   ============================================================ */

const MuscleMap = (() => {
  const FW = 200; // largeur logique d'une figure
  const FH = 404; // hauteur : tête (y~10) → pieds (y~397)
  const CX = 100; // axe central de la figure

  /* Silhouette : moitié droite (x >= 100), le miroir complète le corps.
     Contour : cou → trapèze → épaule → bras ext. → main → bras int. →
     aisselle → torse → taille → hanche → jambe ext. → pied → jambe
     int. → entrejambe → fermeture le long de l'axe central. */
  const SIL_R = `M100 60
    C107 61 115 63 123 66 C133 69 142 74 148 82
    C154 92 157 103 158 116 C159 130 159 143 158 155
    C157 165 155 177 154 189 C153 199 152 209 154 217
    C156 223 157 229 155 233 C153 237 149 237 147 233
    C145 227 144 219 145 211 C146 200 147 187 148 175
    C149 161 149 147 147 135 C146 127 142 119 136 113
    C137 123 137 135 137 147 C137 157 136 167 134 177
    C132 185 131 191 133 197 C137 205 142 211 146 219
    C150 229 152 241 152 253 C152 265 150 277 148 287
    C150 297 150 309 149 321 C148 333 146 345 146 355
    C147 363 150 371 154 377 C158 383 160 389 158 393
    C154 397 146 397 140 395 C134 393 132 389 133 381
    C135 373 136 365 136 357 C137 345 138 331 137 317
    C136 303 134 291 132 281 C130 271 126 261 122 253
    C118 247 112 241 108 237 C104 233 101 231 100 229 Z`;

  const NECK = `M93 50 C93 55 92 60 90 64 L110 64 C108 60 107 55 107 50 Z`;

  /* Muscles — moitié droite uniquement (miroir automatique).
     Plusieurs sous-chemins dans un même `d` = un seul groupe. */
  const ABS_BLOCKS = [0, 1, 2]
    .map(
      (i) => `M103 ${118 + i * 22} h16 a4.5 4.5 0 0 1 4.5 4.5 v9
              a4.5 4.5 0 0 1 -4.5 4.5 h-16 a4.5 4.5 0 0 1 -4.5 -4.5 v-9
              a4.5 4.5 0 0 1 4.5 -4.5 Z`
    )
    .join(" ");

  const FRONT = {
    trapezes:   `M100 60 C109 61 119 63 127 67 C124 72 118 76 110 76 C106 71 102 66 100 60 Z`,
    deltoides:  `M127 67 C137 70 144 76 149 85 C152 93 152 101 148 107 C142 111 134 109 130 102 C126 94 124 79 127 67 Z`,
    pectoraux:  `M100 74 C111 72 123 74 131 80 C137 86 139 94 136 102 C131 110 121 114 111 113 C105 112 100 108 100 102 Z`,
    biceps:     `M147 114 C152 120 155 130 155 142 C154 154 151 163 146 163 C142 158 140 146 141 134 C142 124 144 116 147 114 Z`,
    avantbras:  `M147 166 C151 173 153 185 152 197 C150 207 146 211 142 207 C139 199 139 187 141 176 C142 168 144 164 147 166 Z`,
    abdominaux: ABS_BLOCKS,
    obliques:   `M127 118 C133 132 136 148 137 164 C137 174 134 182 129 182 C125 172 123 154 123 138 C123 128 124 120 127 118 Z`,
    quadriceps: `M136 208 C146 216 151 234 150 256 C149 272 143 284 135 284 C127 280 122 265 123 246 C124 230 129 214 136 208 Z`,
    adducteurs: `M104 232 C111 238 117 248 119 258 C117 265 111 266 107 261 C104 252 103 241 104 232 Z`,
  };

  const BACK = {
    trapezes:   `M100 60 C112 62 122 64 130 68 C127 79 121 91 113 103 C108 111 104 116 100 120 Z`,
    deltoides:  `M127 67 C137 70 144 76 149 85 C152 93 152 101 148 107 C142 111 134 109 130 102 C126 94 124 79 127 67 Z`,
    dorsaux:    `M136 115 C139 127 138 141 134 155 C129 169 120 179 108 183 C104 171 104 153 110 139 C117 127 126 119 136 115 Z`,
    triceps:    `M147 114 C152 120 155 130 155 142 C154 154 151 163 146 163 C142 158 140 146 141 134 C142 124 144 116 147 114 Z`,
    avantbras:  `M147 166 C151 173 153 185 152 197 C150 207 146 211 142 207 C139 199 139 187 141 176 C142 168 144 164 147 166 Z`,
    lombaires:  `M105 180 C110 178 116 178 119 182 C121 188 119 196 115 200 C110 202 105 200 104 194 C103 188 103 183 105 180 Z`,
    fessiers:   `M134 204 C145 210 151 222 149 238 C146 253 135 260 122 257 C110 254 103 245 103 232 C103 219 110 208 119 204 C125 201 130 201 134 204 Z`,
    ischios:    `M130 260 C139 268 143 282 142 298 C140 312 135 320 128 318 C121 312 118 298 119 284 C120 272 124 262 130 260 Z`,
    mollets:    `M130 328 C140 336 145 352 143 368 C141 382 134 389 127 385 C120 378 117 362 119 346 C121 335 125 327 130 328 Z`,
  };

  const MIRROR = `matrix(-1 0 0 1 ${FW} 0)`;
  const SVGNS = "http://www.w3.org/2000/svg";

  let uid = 0;

  const el = (tag, attrs = {}) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    return n;
  };

  function figure(prefix, muscles, label, spine) {
    const g = el("g");

    // Ombre au sol
    g.appendChild(el("ellipse", { cx: CX, cy: 398, rx: 56, ry: 5, class: "mm-shadow" }));

    // Tête + cou (neutres)
    g.appendChild(el("ellipse", { cx: CX, cy: 29, rx: 14, ry: 18, class: "mm-sil" }));
    g.appendChild(el("path", { d: NECK, class: "mm-sil" }));

    // Corps
    const silId = `sil-${prefix}-${uid}`;
    g.appendChild(el("path", { id: silId, d: SIL_R, class: "mm-sil" }));
    g.appendChild(el("use", { href: `#${silId}`, transform: MIRROR, class: "mm-sil" }));

    // Ligne médiane discrète (colonne côté dos, sternum côté face)
    g.appendChild(
      el("path", { d: `M100 ${spine ? 58 : 104} L100 ${spine ? 226 : 182}`, class: "mm-spine" })
    );

    // Muscles
    for (const [key, d] of Object.entries(muscles)) {
      const id = `mm-${prefix}-${key}-${uid}`;
      g.appendChild(el("path", { id, d, class: "mm-muscle", "data-muscle": key }));
      g.appendChild(
        el("use", { href: `#${id}`, transform: MIRROR, class: "mm-muscle", "data-muscle": key })
      );
    }

    const t = el("text", {
      x: CX, y: FH + 8, "text-anchor": "middle", class: "mm-label",
    });
    t.textContent = label;
    g.appendChild(t);
    return g;
  }

  /* Rend le mannequin dans `container` et allume les muscles demandés. */
  function render(container, { primary = [], secondary = [] } = {}) {
    uid++;
    container.innerHTML = "";

    const svg = el("svg", {
      viewBox: `-8 -6 ${FW * 2 + 56} ${FH + 22}`,
      class: "muscle-map",
      role: "img",
      "aria-label": "Mannequin musculaire avant et arrière",
    });

    const defs = el("defs");
    defs.innerHTML = `
      <linearGradient id="mmGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#c6f24e"/>
        <stop offset="1" stop-color="#4ee1a0"/>
      </linearGradient>`;
    svg.appendChild(defs);

    const front = figure("f", FRONT, "Face avant", false);
    const back = figure("b", BACK, "Dos", true);
    back.setAttribute("transform", `translate(${FW + 40},0)`);
    svg.appendChild(front);
    svg.appendChild(back);

    container.appendChild(svg);

    for (const m of secondary) {
      container
        .querySelectorAll(`[data-muscle="${m}"]`)
        .forEach((n) => n.classList.add("on2"));
    }
    for (const m of primary) {
      container
        .querySelectorAll(`[data-muscle="${m}"]`)
        .forEach((n) => {
          n.classList.remove("on2");
          n.classList.add("on");
        });
    }

    return svg;
  };

  return { render };
})();
