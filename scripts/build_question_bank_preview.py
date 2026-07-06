from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "social" / "question-bank.jpg"
W, H = 1200, 630


def find_font(bold=False):
    candidates = [
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc" if bold else "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc" if bold else "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf" if bold else "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return path
    raise FileNotFoundError("Korean font not found")


BOLD = find_font(True)
REGULAR = find_font(False)


def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else REGULAR, size)


img = Image.new("RGB", (W, H), (13, 17, 23))
d = ImageDraw.Draw(img)

for x in range(0, W, 60):
    d.line((x, 0, x, H), fill=(24, 30, 38), width=1)
for y in range(0, H, 60):
    d.line((0, y, W, y), fill=(24, 30, 38), width=1)

glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
g = ImageDraw.Draw(glow)
g.ellipse((720, -260, 1370, 390), fill=(201, 255, 72, 62))
glow = glow.filter(ImageFilter.GaussianBlur(100))
img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
d = ImageDraw.Draw(img)

# Brand in the corner, deliberately small so it cannot be mistaken for the content.
d.text((72, 54), "LavaLabs", font=font(27, True), fill=(247, 248, 245))
d.text((72, 92), "DIGITAL STUDIO", font=font(12, True), fill=(151, 161, 172))

pill = "QUESTION BANK"
pill_font = font(22, True)
box = d.textbbox((0, 0), pill, font=pill_font)
d.rounded_rectangle((72, 144, 72 + (box[2] - box[0]) + 38, 188), radius=22, fill=(201, 255, 72))
d.text((91, 151), pill, font=pill_font, fill=(17, 22, 29))

d.multiline_text((72, 224), "직원 교육\n문제은행", font=font(76, True), fill=(247, 248, 245), spacing=6)
d.text((74, 455), "역할별 교육 · 무작위 출제 · 오답 복습 · 대량 관리", font=font(25), fill=(183, 192, 201))

cards = [
    ("100~500+", "문제은행 규모"),
    ("5~50", "회차별 출제"),
    ("역할별", "신입·판매·관리자"),
    ("반복 학습", "오답·취약 분야"),
]
positions = [(780, 150), (980, 150), (780, 330), (980, 330)]
for (value, label), (x, y) in zip(cards, positions):
    d.rounded_rectangle((x, y, x + 170, y + 140), radius=24, fill=(23, 29, 37), outline=(61, 72, 84), width=2)
    d.text((x + 18, y + 25), value, font=font(31, True), fill=(201, 255, 72))
    d.text((x + 18, y + 83), label, font=font(15), fill=(189, 198, 206))

d.line((72, 566, 1128, 566), fill=(52, 61, 71), width=1)
d.text((72, 583), "space.lavalabs.co.kr/question-bank.html", font=font(16, True), fill=(201, 255, 72))

OUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUT, "JPEG", quality=94, optimize=True, progressive=True, subsampling=0)
print(OUT)
