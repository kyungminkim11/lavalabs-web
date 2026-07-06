from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from build_social_previews import PAGES, ROOT, font_path

OUTPUT = ROOT / "assets" / "social"
ACCENT = (201, 255, 72)
DARK = (13, 17, 23)
PANEL = (17, 22, 29)
GRID = (28, 34, 43)
BOLD = font_path(True)
REGULAR = font_path(False)


def patch(slug: str) -> None:
    path = OUTPUT / f"{slug}.jpg"
    if not path.exists():
        return

    image = Image.open(path).convert("RGB")
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle((870, 88, 1132, 428), radius=52, fill=PANEL, outline=(42, 51, 62), width=2)
    for x in range(900, 1132, 46):
        draw.line((x, 110, x, 406), fill=GRID, width=1)
    for y in range(120, 428, 46):
        draw.line((890, y, 1112, y), fill=GRID, width=1)

    draw.rounded_rectangle((918, 130, 1084, 296), radius=46, fill=DARK, outline=ACCENT, width=7)
    draw.polygon([(1001, 158), (1052, 188), (1052, 238), (1001, 268), (950, 238), (950, 188)], outline=ACCENT, width=5)
    draw.polygon([(1001, 185), (1030, 239), (1014, 239), (1014, 263), (988, 263), (988, 239), (972, 239)], fill=ACCENT)

    draw.text((932, 332), "LAVALABS", font=ImageFont.truetype(BOLD, 20), fill=(238, 241, 235))
    draw.text((923, 364), "DIGITAL STUDIO", font=ImageFont.truetype(REGULAR, 12), fill=(143, 153, 164))

    image.save(path, "JPEG", quality=94, optimize=True, progressive=True, subsampling=0)


if __name__ == "__main__":
    for slug in PAGES:
        patch(slug)
