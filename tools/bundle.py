#!/usr/bin/env python3
"""Assemble web/ en un seul fichier HTML autonome : dist/pulse.html.

Inline la CSS, tous les scripts JS (dans l'ordre de index.html) et
l'icône SVG (en data URI). Le fichier résultant fonctionne en file://
ou servi tel quel — utile pour distribuer la version web.
"""

import base64
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web"
OUT = ROOT / "dist" / "pulse.html"


def data_uri(path: Path) -> str:
    mime = "image/svg+xml" if path.suffix == ".svg" else "image/png"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def main() -> int:
    html = (WEB / "index.html").read_text(encoding="utf-8")

    # Icône (favicon + logo de la sidebar) → data URI
    icon_uri = data_uri(WEB / "assets" / "icons" / "icon.svg")
    html = html.replace('href="assets/icons/icon.svg"', f'href="{icon_uri}"')
    html = html.replace('src="assets/icons/icon.svg"', f'src="{icon_uri}"')

    # CSS → <style>
    def inline_css(m: re.Match) -> str:
        return "<style>\n" + (WEB / m.group(1)).read_text(encoding="utf-8") + "\n</style>"

    html = re.sub(r'<link rel="stylesheet" href="(assets/[^"]+)"\s*/?>', inline_css, html)

    # JS → <script> inline (ordre conservé)
    def inline_js(m: re.Match) -> str:
        src = m.group(1)
        code = (WEB / src).read_text(encoding="utf-8")
        if "</script" in code:
            raise SystemExit(f"{src} contient '</script' — inlining impossible")
        return f"<script>\n/* ===== {src} ===== */\n{code}\n</script>"

    html = re.sub(r'<script src="(assets/[^"]+)"></script>', inline_js, html)

    left = re.findall(r'(?:src|href)="(assets/[^"]+)"', html)
    if left:
        raise SystemExit(f"Ressources non inlinées : {left}")

    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(html, encoding="utf-8")
    print(f"→ {OUT} ({OUT.stat().st_size // 1024} Ko)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
