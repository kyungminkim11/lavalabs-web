from __future__ import annotations

from pathlib import Path

from build_social_previews import PAGES, ROOT

VERSION = "20260706b"


def update_page(slug: str) -> None:
    filename = "index.html" if slug == "index" else f"{slug}.html"
    path = ROOT / filename
    if not path.exists():
        return

    html = path.read_text(encoding="utf-8")
    html = html.replace(f"/assets/social/{slug}.jpg?v=20260706", f"/assets/social/{slug}.png?v={VERSION}")
    html = html.replace(f"/assets/social/{slug}.jpg?v={VERSION}", f"/assets/social/{slug}.png?v={VERSION}")
    html = html.replace('property="og:image:type" content="image/jpeg"', 'property="og:image:type" content="image/png"')
    path.write_text(html, encoding="utf-8")


if __name__ == "__main__":
    for page_slug in PAGES:
        update_page(page_slug)
    print(f"Switched {len(PAGES)} pages to PNG social previews")
