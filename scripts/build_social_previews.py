from __future__ import annotations

import re
from pathlib import Path
from typing import Dict, Tuple

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "social"
SITE_URL = "https://space.lavalabs.co.kr"
WIDTH, HEIGHT = 1200, 630

PageInfo = Tuple[str, str, str]

PAGES: Dict[str, PageInfo] = {
    "index": ("LAVALABS", "공간을 보여주고,\n운영을 단순하게.", "웹 · 360° 공간 · 매장 솔루션 · 자동화"),
    "services": ("ALL SERVICES", "필요한 만큼 시작하고,\n사업에 맞춰 확장합니다.", "웹 제작부터 촬영 · 매장 운영 · 자동화까지"),
    "insights": ("LAVALABS INSIGHTS", "제작 전에 읽어보는\n실무 가이드", "소상공인 웹 · 360° 촬영 · 디지털 운영"),
    "guide-360-product-photography": ("PRODUCT · 360 GUIDE", "360도 제품 촬영,\n몇 컷이 적당할까?", "회전판 · 스마트폰 · 조명 · 웹 뷰어"),
    "guide-360-virtual-tour": ("SPACE · 360 GUIDE", "360 가상투어 제작 전\n준비사항", "매장 · 파티룸 · 쇼룸 · 사무실"),
    "guide-small-business-website": ("WEB · START GUIDE", "소상공인 홈페이지\n제작 체크리스트", "목표 · 페이지 · 사진 · 문의 · 유지관리"),
    "web": ("WEB DESIGN", "소상공인 홈페이지 ·\n랜딩페이지 제작", "모바일 우선 · 문의 전환 · 맞춤형 웹"),
    "commerce": ("COMMERCE", "소규모 쇼핑몰 ·\n상품 페이지 제작", "브랜드와 매장을 위한 구매 흐름 설계"),
    "space": ("SPACE CONTENT", "360 가상투어 ·\n매장 공간 촬영", "방문하기 전에 공간을 경험하게"),
    "product-spin": ("PRODUCT · 360", "360도 제품 촬영 ·\n상품 스핀 뷰어", "제품을 직접 돌려보는 인터랙티브 콘텐츠"),
    "lavaspin": ("LAVASPIN BETA", "사진이나 영상을 올리면\n360° 상품 뷰로", "자동 정렬 · 최적화 · 공유 링크 · 삽입 코드"),
    "space-rental": ("SPACE · RENTAL", "공유오피스 · 파티룸\n360 가상투어", "공간의 규모와 시설을 방문 전에 확인"),
    "space-fashion-popup": ("SPACE · FASHION", "의류 브랜드 · 팝업스토어\n360 가상투어", "진열과 브랜드 경험을 온라인으로"),
    "photography": ("PHOTOGRAPHY", "매장 · 공간\n사진 촬영", "홈페이지 · 플레이스 · SNS용 공간 콘텐츠"),
    "pov-video": ("POV VIDEO", "길 안내 · 매장 방문 동선\n영상 제작", "역과 주차장부터 매장 입구까지"),
    "equipment": ("EQUIPMENT", "360 · 공간 촬영\n장비 안내", "라바랩스가 실제 사용하는 촬영 장비"),
    "store": ("STORE SOLUTION", "QR 메뉴판 ·\n모바일 매장 안내", "스캔 한 번으로 메뉴 · 주문 · 문의"),
    "map": ("INTERACTIVE MAP", "매장 안내도 ·\nQR 지도 웹 제작", "층별 · 구역별 정보를 모바일에서"),
    "operations": ("STORE OPERATIONS", "바코드 상품검색 ·\n재고 관리 시스템", "바쁜 현장에서 빠르게 찾고 확인하도록"),
    "education-guide": ("TEAM GUIDE", "직원 교육용\n디지털 매뉴얼", "운영 절차 · 상품 설명 · 응대 기준"),
    "automation": ("AUTOMATION", "엑셀 · 파이썬\n업무 자동화", "반복 입력 · 정리 · 검색 · 보고서를 줄이기"),
    "custom-development": ("CUSTOM DEVELOPMENT", "맞춤형 웹앱 ·\n업무 시스템 개발", "현장의 문제에 맞춰 필요한 기능만"),
    "packages": ("DIGITAL PACKAGE", "소상공인 매장\n디지털 전환 패키지", "웹 · 촬영 · QR · 자동화를 하나의 흐름으로"),
    "maintenance": ("MAINTENANCE", "홈페이지 유지관리 ·\n수정 서비스", "문구 · 이미지 · 기능 · 운영 점검"),
    "start": ("PROJECT START", "프로젝트 준비\n체크리스트", "목표 · 자료 · 일정 · 예산을 먼저 정리"),
    "portfolio": ("SELECTED WORK", "웹 · 360 가상투어 ·\n자동화 제작 사례", "실제 문제에서 시작한 프로젝트"),
    "pricing": ("PRICING", "홈페이지 · 360 촬영 ·\n자동화 제작 가격", "서비스별 기본 시작 가격과 견적 기준"),
    "partnership": ("PARTNERSHIP", "웹 · 사진 · 영상 · 공간\n콘텐츠 협업", "소개 · 공동 패키지 · 화이트라벨"),
    "about": ("ABOUT LAVALABS", "작은 매장을 위한\n디지털 스튜디오", "공간을 보여주고 운영을 단순하게"),
    "contact": ("CONTACT", "프로젝트 범위와\n견적을 문의하세요", "웹 · 촬영 · 매장 솔루션 · 자동화"),
    "faq": ("FAQ", "제작 전에 궁금한 점을\n먼저 확인하세요", "기간 · 수정 · 도메인 · 결제 · 유지관리"),
    "sitemap": ("SITE MAP", "라바랩스의 모든 페이지를\n한눈에", "서비스 · 사례 · 가격 · 가이드 · 회사 정보"),
    "privacy": ("PRIVACY", "개인정보 처리방침", "라바랩스 웹사이트와 문의 정보 처리 안내"),
    "terms": ("SERVICE TERMS", "서비스 이용 안내", "상담 · 견적 · 계약 · 수정 · 납품 기준"),
}


def font_path(bold: bool = False) -> str:
    candidates = [
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc" if bold else "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc" if bold else "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf" if bold else "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return candidate
    raise FileNotFoundError("Korean font not found. Install fonts-noto-cjk.")


REGULAR = font_path(False)
BOLD = font_path(True)


def fit_font(draw: ImageDraw.ImageDraw, text: str, max_width: int, start: int = 74, minimum: int = 44) -> ImageFont.FreeTypeFont:
    for size in range(start, minimum - 1, -2):
        font = ImageFont.truetype(BOLD, size)
        box = draw.multiline_textbbox((0, 0), text, font=font, spacing=10)
        if box[2] - box[0] <= max_width:
            return font
    return ImageFont.truetype(BOLD, minimum)


def generate_image(slug: str, category: str, title: str, description: str) -> None:
    image = Image.new("RGB", (WIDTH, HEIGHT), (13, 17, 23))
    draw = ImageDraw.Draw(image)

    for x in range(0, WIDTH, 60):
        draw.line((x, 0, x, HEIGHT), fill=(24, 30, 38), width=1)
    for y in range(0, HEIGHT, 60):
        draw.line((0, y, WIDTH, y), fill=(24, 30, 38), width=1)

    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    for radius in range(420, 0, -12):
        alpha = int(2 + 28 * (1 - radius / 420))
        glow_draw.ellipse(
            (WIDTH - 260 - radius, -110 - radius, WIDTH - 260 + radius, -110 + radius),
            fill=(201, 255, 72, alpha),
        )
    glow = glow.filter(ImageFilter.GaussianBlur(35))
    image = Image.alpha_composite(image.convert("RGBA"), glow)
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle((900, 120, 1080, 300), radius=38, outline=(201, 255, 72, 230), width=5)
    draw.polygon([(990, 145), (1053, 181), (1053, 253), (990, 289), (927, 253), (927, 181)], outline=(201, 255, 72, 230))
    draw.line((945, 360, 1095, 360), fill=(201, 255, 72, 220), width=5)
    draw.line((995, 325, 995, 395), fill=(201, 255, 72, 220), width=5)

    draw.text((76, 62), "LavaLabs", font=ImageFont.truetype(BOLD, 28), fill=(245, 247, 242))
    draw.text((76, 106), "DIGITAL STUDIO", font=ImageFont.truetype(BOLD, 13), fill=(154, 164, 175))

    category_font = ImageFont.truetype(BOLD, 24)
    category_box = draw.textbbox((0, 0), category, font=category_font)
    pill_width = category_box[2] - category_box[0] + 40
    draw.rounded_rectangle((76, 166, 76 + pill_width, 210), radius=22, fill=(201, 255, 72))
    draw.text((96, 172), category, font=category_font, fill=(17, 22, 29))

    title_font = fit_font(draw, title, 760)
    draw.multiline_text((76, 244), title, font=title_font, fill=(247, 248, 245), spacing=10)
    draw.text((78, 505), description, font=ImageFont.truetype(REGULAR, 27), fill=(183, 192, 201))

    draw.line((76, 574, 1124, 574), fill=(52, 61, 71), width=1)
    draw.text((76, 591), "space.lavalabs.co.kr", font=ImageFont.truetype(BOLD, 16), fill=(201, 255, 72))
    draw.text((970, 591), "LAVALABS", font=ImageFont.truetype(BOLD, 15), fill=(137, 148, 158))

    OUTPUT.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(OUTPUT / f"{slug}.jpg", "JPEG", quality=82, optimize=True, progressive=True, subsampling=2)


def remove_meta(html: str, key: str, value: str) -> str:
    pattern = rf'<meta\s+[^>]*{key}=["\']{re.escape(value)}["\'][^>]*>\s*'
    return re.sub(pattern, "", html, flags=re.IGNORECASE)


def update_html(slug: str, category: str, title: str, description: str) -> None:
    filename = "index.html" if slug == "index" else f"{slug}.html"
    path = ROOT / filename
    if not path.exists():
        print(f"Skip missing page: {filename}")
        return

    html = path.read_text(encoding="utf-8")
    image_url = f"{SITE_URL}/assets/social/{slug}.jpg?v=20260706"
    alt = f"{title.replace(chr(10), ' ')} | LavaLabs"

    for property_name in [
        "og:image",
        "og:image:secure_url",
        "og:image:type",
        "og:image:width",
        "og:image:height",
        "og:image:alt",
    ]:
        html = remove_meta(html, "property", property_name)

    for name in ["twitter:image", "twitter:image:alt"]:
        html = remove_meta(html, "name", name)

    html = re.sub(r'<link\s+[^>]*rel=["\']image_src["\'][^>]*>\s*', "", html, flags=re.IGNORECASE)

    block = (
        f'<meta property="og:image" content="{image_url}">'
        f'<meta property="og:image:secure_url" content="{image_url}">'
        '<meta property="og:image:type" content="image/jpeg">'
        '<meta property="og:image:width" content="1200">'
        '<meta property="og:image:height" content="630">'
        f'<meta property="og:image:alt" content="{alt}">'
        f'<meta name="twitter:image" content="{image_url}">'
        f'<meta name="twitter:image:alt" content="{alt}">'
        f'<link rel="image_src" href="{image_url}">'
    )
    html = re.sub(r"</head>", f"{block}</head>", html, count=1, flags=re.IGNORECASE)
    path.write_text(html, encoding="utf-8")


if __name__ == "__main__":
    for page_slug, page_info in PAGES.items():
        generate_image(page_slug, *page_info)
        update_html(page_slug, *page_info)
    print(f"Generated {len(PAGES)} social previews in {OUTPUT}")
