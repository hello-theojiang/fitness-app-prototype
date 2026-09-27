/* ============================================================
   Pulse — mannequin musculaire (muscle-map)
   Silhouette neutre avant / dos en SVG inline. Chaque groupe
   musculaire est un chemin qui s'illumine quand il est sollicité.
   Muscles primaires : accent plein. Secondaires : accent estompé.
   ============================================================ */

const MuscleMap = (() => {
  const FW = 200; // largeur logique d'une figure
  const FH = 470;
  const CX = 100; // axe central de la figure

  // Silhouette : moitié droite (x >= 100), le rendu miroir complète le corps.
  const SIL_R = `M100 58
    C104 58 108 60 110 64 C116 66 128 68 138 76
    C148 82 152 92 153 104 C154 118 153 132 154 146
    C156 160 155 176 153 190 C155 202 154 218 150 230
    C154 238 156 248 152 252 C148 255 144 250 143 242
    C141 230 141 216 142 204 C143 192 144 178 142 166
    C140 176 138 190 137 204 C136 218 138 234 140 248
    C142 264 142 284 138 304 C136 324 133 344 133 364
    C133 388 135 412 133 432 C132 442 136 448 144 450
    C150 452 154 456 152 460 C148 462 138 462 132 460
    C124 456 120 446 119 432 C117 412 116 388 114 364
    C112 344 110 324 108 308 C106 296 103 288 100 286 Z`;

  // Muscles — moitié droite uniquement (miroir automatique).
  const FRONT = {
    trapezes:   `M100 62 C112 62 126 68 136 78 L126 88 C118 80 108 73 100 71 Z`,
    deltoides:  `M136 78 C146 82 152 92 153 104 C153 112 148 118 140 117 C132 115 128 106 128 96 C128 86 130 80 136 78 Z`,
    pectoraux:  `M100 84 L114 84 C124 84 132 89 134 96 C133 104 127 111 118 112 C110 113 103 110 100 104 Z`,
    abdominaux: `M102 118 L117 119 C122 121 124 128 123 136 L121 190 C120 196 115 199 109 198 L102 194 Z`,
    obliques:   `M125 122 C130 124 132 130 131 138 L129 184 C128 192 125 197 121 197 L122 140 C122 132 123 126 125 122 Z`,
    biceps:     `M136 122 C131 128 129 140 131 152 C133 162 140 166 145 161 C149 155 150 142 148 132 C146 124 141 119 136 122 Z`,
    avantbras:  `M140 168 C135 174 133 188 136 202 C139 212 145 215 149 209 C152 201 153 186 151 176 C149 168 144 164 140 168 Z`,
    quadriceps: `M112 252 C106 268 104 292 107 314 C110 330 118 338 126 332 C131 326 133 308 131 288 C129 270 126 256 122 248 Z`,
    adducteurs: `M100 288 C103 296 107 306 108 318 C109 326 105 330 102 324 C99 314 98 300 100 288 Z`,
  };

  const BACK = {
    trapezes:   `M100 60 C114 62 128 70 138 80 C136 88 130 94 122 96 C114 96 106 90 100 84 Z`,
    deltoides:  `M136 78 C146 82 152 92 153 104 C153 112 148 118 140 117 C132 115 128 106 128 96 C128 86 130 80 136 78 Z`,
    dorsaux:    `M120 100 C132 104 140 116 142 130 C143 146 139 166 132 182 C128 191 122 196 116 197 C113 184 111 162 112 142 C113 124 116 110 120 100 Z`,
    triceps:    `M136 122 C131 128 129 140 131 152 C133 162 140 166 145 161 C149 155 150 142 148 132 C146 124 141 119 136 122 Z`,
    avantbras:  `M140 168 C135 174 133 188 136 202 C139 212 145 215 149 209 C152 201 153 186 151 176 C149 168 144 164 140 168 Z`,
    lombaires:  `M104 198 L122 198 C127 199 129 204 127 210 C124 215 118 216 112 214 L104 210 Z`,
    fessiers:   `M104 216 C98 228 97 246 103 260 C108 270 118 272 124 264 C129 254 129 238 124 226 C118 216 110 212 104 216 Z`,
    ischios:    `M106 274 C100 288 99 308 103 326 C107 338 116 342 122 336 C127 328 128 310 125 294 C122 280 114 270 106 274 Z`,
    mollets:    `M107 348 C102 362 102 384 106 402 C109 414 117 417 121 410 C125 400 126 380 123 366 C120 354 113 346 107 348 Z`,
  };

  const MIRROR = `matrix(-1 0 0 1 ${FW} 0)`;
  const SVGNS = "http://www.w3.org/2000/svg";

  let uid = 0;

  const el = (tag, attrs = {}) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    return n;
  };

  function figure(prefix, muscles, label) {
    const g = el("g");

    // Tête + cou (neutres)
    g.appendChild(el("ellipse", { cx: CX, cy: 34, rx: 17, ry: 21, class: "mm-sil" }));
    g.appendChild(el("path", { d: `M92 54 L108 54 L110 72 L90 72 Z`, class: "mm-sil" }));

    // Corps
    const silId = `sil-${prefix}-${uid}`;
    g.appendChild(el("path", { id: silId, d: SIL_R, class: "mm-sil" }));
    g.appendChild(el("use", { href: `#${silId}`, transform: MIRROR, class: "mm-sil" }));

    // Muscles
    for (const [key, d] of Object.entries(muscles)) {
      const id = `mm-${prefix}-${key}-${uid}`;
      g.appendChild(el("path", { id, d, class: "mm-muscle", "data-muscle": key }));
      g.appendChild(
        el("use", { href: `#${id}`, transform: MIRROR, class: "mm-muscle", "data-muscle": key })
      );
    }

    const t = el("text", {
      x: CX, y: FH + 4, "text-anchor": "middle", class: "mm-label",
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
      viewBox: `-8 -6 ${FW * 2 + 56} ${FH + 24}`,
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

    const front = figure("f", FRONT, "Face avant");
    front.setAttribute("transform", "translate(0,0)");
    const back = figure("b", BACK, "Dos");
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
