from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from build_social_previews import PAGES, ROOT, font_path

OUTPUT = ROOT / "assets" / "social"
WIDTH, HEIGHT = 1200, 630
SCALE = 2
W, H = WIDTH * SCALE, HEIGHT * SCALE
REGULAR = font_path(False)
BOLD = font_path(True)


def f(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(BOLD if bold else REGULAR, size * SCALE)


def fit_font(draw: ImageDraw.ImageDraw, text: str, max_width: int, start: int = 74, minimum: int = 44) -> ImageFont.FreeTypeFont:
    for size in range(start, minimum - 1, -2):
        font = f(size, True)
        box = draw.multiline_textbbox((0, 0), text, font=font, spacing=10 * SCALE)
        if box[2] - box[0] <= max_width * SCALE:
            return font
    return f(minimum, True)


def sc(value: int) -> int:
    return value * SCALE


def generate(slug: str, category: str, title: str, description: str) -> None:
    image = Image.new("RGBA", (W, H), (13, 17, 23, 255))
    draw = ImageDraw.Draw(image)

    # Subtle grid.
    for x in range(0, W, sc(60)):
        draw.line((x, 0, x, H), fill=(28, 34, 43, 255), width=sc(1))
    for y in range(0, H, sc(60)):
        draw.line((0, y, W, y), fill=(28, 34, 43, 255), width=sc(1))

    # Soft background glow only; icon remains fully sharp.
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g = ImageDraw.Draw(glow)
    g.ellipse((sc(720), sc(-260), sc(1370), sc(390)), fill=(132, 177, 43, 75))
    glow = glow.filter(ImageFilter.GaussianBlur(sc(105)))
    image = Image.alpha_composite(image, glow)
    draw = ImageDraw.Draw(image)

    # Brand.
    draw.text((sc(76), sc(62)), "LavaLabs", font=f(28, True), fill=(247, 248, 245, 255))
    draw.text((sc(76), sc(106)), "DIGITAL STUDIO", font=f(13, True), fill=(154, 164, 175, 255))

    # Category pill.
    category_font = f(24, True)
    box = draw.textbbox((0, 0), category, font=category_font)
    pill_width = (box[2] - box[0]) + sc(40)
    draw.rounded_rectangle((sc(76), sc(166), sc(76) + pill_width, sc(210)), radius=sc(22), fill=(201, 255, 72, 255))
    draw.text((sc(96), sc(172)), category, font=category_font, fill=(17, 22, 29, 255))

    # Title and description.
    title_font = fit_font(draw, title, 760)
    draw.multiline_text((sc(76), sc(244)), title, font=title_font, fill=(247, 248, 245, 255), spacing=sc(10))
    draw.text((sc(78), sc(505)), description, font=f(27), fill=(183, 192, 201, 255))

    # Crisp right-side symbol.
    accent = (201, 255, 72, 255)
    muted_accent = (154, 190, 75, 255)
    panel = (sc(895), sc(115), sc(1088), sc(308))
    draw.rounded_rectangle(panel, radius=sc(40), outline=accent, width=sc(7))
    draw.polygon(
        [
            (sc(991), sc(145)),
            (sc(1055), sc(182)),
            (sc(1055), sc(254)),
            (sc(991), sc(291)),
            (sc(927), sc(254)),
            (sc(927), sc(182)),
        ],
        outline=muted_accent,
        width=sc(3),
    )
    draw.line((sc(944), sc(360), sc(1098), sc(360)), fill=accent, width=sc(6))
    draw.line((sc(1021), sc(322), sc(1021), sc(398)), fill=accent, width=sc(6))

    # Footer.
    draw.line((sc(76), sc(574), sc(1124), sc(574)), fill=(52, 61, 71, 255), width=sc(1))
    draw.text((sc(76), sc(591)), "space.lavalabs.co.kr", font=f(16, True), fill=accent)
    draw.text((sc(970), sc(591)), "LAVALABS", font=f(15, True), fill=(137, 148, 158, 255))

    # Downsample once for smooth, clean edges, then save losslessly.
    image = image.convert("RGB").resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    image.save(OUTPUT / f"{slug}.png", "PNG", optimize=True)


if __name__ == "__main__":
    for slug, info in PAGES.items():
        generate(slug, *info)
    print(f"Generated {len(PAGES)} crisp PNG social previews")
