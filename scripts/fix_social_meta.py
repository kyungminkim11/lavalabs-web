from __future__ import annotations

import re
from pathlib import Path

from build_social_previews import PAGES, ROOT, SITE_URL

ARTICLE_PAGES = {
    "guide-360-product-photography",
    "guide-360-virtual-tour",
    "guide-small-business-website",
}


def remove_meta(html: str, key: str, value: str) -> str:
    pattern = rf'<meta\s+[^>]*{key}=["\']{re.escape(value)}["\'][^>]*>\s*'
    return re.sub(pattern, "", html, flags=re.IGNORECASE)


def remove_link(html: str, rel: str) -> str:
    pattern = rf'<link\s+[^>]*rel=["\']{re.escape(rel)}["\'][^>]*>\s*'
    return re.sub(pattern, "", html, flags=re.IGNORECASE)


def canonical_for(slug: str) -> str:
    return f"{SITE_URL}/" if slug == "index" else f"{SITE_URL}/{slug}.html"


def update_page(slug: str, category: str, title: str, description: str) -> None:
    filename = "index.html" if slug == "index" else f"{slug}.html"
    path = ROOT / filename
    if not path.exists():
        print(f"Skip missing page: {filename}")
        return

    html = path.read_text(encoding="utf-8")
    url = canonical_for(slug)
    image = f"{SITE_URL}/assets/social/{slug}.jpg?v=20260706c"
    clean_title = " ".join(title.splitlines()).strip()
    share_title = clean_title if clean_title.lower().endswith("lavalabs") else f"{clean_title} | LavaLabs"
    alt = share_title
    content_type = "article" if slug in ARTICLE_PAGES else "website"

    for property_name in [
        "og:type",
        "og:locale",
        "og:site_name",
        "og:title",
        "og:description",
        "og:url",
        "og:image",
        "og:image:secure_url",
        "og:image:type",
        "og:image:width",
        "og:image:height",
        "og:image:alt",
    ]:
        html = remove_meta(html, "property", property_name)

    for name in [
        "twitter:card",
        "twitter:title",
        "twitter:description",
        "twitter:image",
        "twitter:image:alt",
    ]:
        html = remove_meta(html, "name", name)

    html = remove_link(html, "image_src")

    block = (
        f'<meta property="og:type" content="{content_type}">'
        '<meta property="og:locale" content="ko_KR">'
        '<meta property="og:site_name" content="LavaLabs">'
        f'<meta property="og:title" content="{share_title}">'
        f'<meta property="og:description" content="{description}">'
        f'<meta property="og:url" content="{url}">'
        f'<meta property="og:image" content="{image}">'
        f'<meta property="og:image:secure_url" content="{image}">'
        '<meta property="og:image:type" content="image/jpeg">'
        '<meta property="og:image:width" content="1200">'
        '<meta property="og:image:height" content="630">'
        f'<meta property="og:image:alt" content="{alt}">'
        '<meta name="twitter:card" content="summary_large_image">'
        f'<meta name="twitter:title" content="{share_title}">'
        f'<meta name="twitter:description" content="{description}">'
        f'<meta name="twitter:image" content="{image}">'
        f'<meta name="twitter:image:alt" content="{alt}">'
        f'<link rel="image_src" href="{image}">'
    )

    html = re.sub(r"</head>", f"{block}</head>", html, count=1, flags=re.IGNORECASE)
    path.write_text(html, encoding="utf-8")


if __name__ == "__main__":
    for page_slug, page_info in PAGES.items():
        update_page(page_slug, *page_info)
    print(f"Updated static social metadata for {len(PAGES)} pages")
