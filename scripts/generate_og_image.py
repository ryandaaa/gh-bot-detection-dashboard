"""
Generate Completely Plain Background OpenGraph Image (1200x630).
STRICTLY:
- Pure solid #101010 background (no lines, no borders, no boxes, no gradients)
- Clean, balanced typography only.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

W, H = 1200, 630

# Completely plain, flat #101010 canvas
BG_COLOR = (16, 16, 16)
TEXT_WHITE = (255, 255, 255)
TEXT_LIGHT = (200, 200, 200)
TEXT_MUTED = (140, 140, 140)
TEXT_FAINT = (100, 100, 100)

img = Image.new("RGB", (W, H), BG_COLOR)
draw = ImageDraw.Draw(img)

# Fonts
bold_font_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
reg_font_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
mono_reg_path = "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"

font_brand = ImageFont.truetype(bold_font_path, 24)
font_top_sub = ImageFont.truetype(reg_font_path, 15)

font_title = ImageFont.truetype(bold_font_path, 52)
font_sub = ImageFont.truetype(reg_font_path, 22)
font_formula = ImageFont.truetype(mono_reg_path, 15)

font_num = ImageFont.truetype(bold_font_path, 36)
font_num_label = ImageFont.truetype(reg_font_path, 14)
font_num_sub = ImageFont.truetype(reg_font_path, 12)

font_footer = ImageFont.truetype(reg_font_path, 14)
font_footer_bold = ImageFont.truetype(bold_font_path, 14)
font_footer_sub = ImageFont.truetype(mono_reg_path, 13)

pad_x = 80

# 1. Top Section
draw.text((pad_x, 60), "GH Intelligence", fill=TEXT_WHITE, font=font_brand)
draw.text((pad_x + 195, 65), "—", fill=TEXT_FAINT, font=font_top_sub)
draw.text((pad_x + 225, 65), "PBL Big Data 2026", fill=TEXT_MUTED, font=font_top_sub)

draw.text((W - pad_x - 260, 65), "Universitas Riau · Teknik Informatika", fill=TEXT_MUTED, font=font_top_sub)

# 2. Main Title Section
draw.text((pad_x, 150), "GitHub Bot & Anomaly Detection", fill=TEXT_WHITE, font=font_title)
draw.text((pad_x, 220), "Unsupervised Behavioral Mining on 9.88M Events", fill=TEXT_LIGHT, font=font_sub)
draw.text((pad_x, 260), "MongoDB Atlas M10  ·  Isolation Forest (tau = 0.5514)  ·  K-Means (k = 7)", fill=TEXT_MUTED, font=font_formula)

# 3. 4-Column Typographic Metrics
col_width = (W - 2 * pad_x) // 4
metrics = [
    ("9.88M", "Total Events Ingested", "152 jam observasi bersih"),
    ("44,200", "Modeled Profiles", "11 dimensi fitur perilaku"),
    ("Top 5.0%", "Flagged Anomalies", "Skor cutoff tau >= 0.5514"),
    ("7 Clusters", "Behavioral Archetypes", "Partisi nir-terbimbing K-Means"),
]

for idx, (num, lbl, sub) in enumerate(metrics):
    x = pad_x + idx * col_width
    draw.text((x, 345), num, fill=TEXT_WHITE, font=font_num)
    draw.text((x, 395), lbl, fill=TEXT_LIGHT, font=font_num_label)
    draw.text((x, 420), sub, fill=TEXT_FAINT, font=font_num_sub)

# 4. Footer Section
draw.text((pad_x, 510), "Pembimbing:", fill=TEXT_MUTED, font=font_footer)
draw.text((pad_x + 100, 510), "Assoc. Prof. Dr. Rahmad Kurniawan, ST., MIT.", fill=TEXT_WHITE, font=font_footer_bold)

draw.text((pad_x, 540), "Peneliti:      ", fill=TEXT_MUTED, font=font_footer)
draw.text((pad_x + 100, 540), "Ryanda Valents Anakri (@ryandaaa)", fill=TEXT_LIGHT, font=font_footer_bold)

draw.text((W - pad_x - 275, 525), "FastAPI · React 18 · MongoDB Atlas", fill=TEXT_MUTED, font=font_footer_sub)

# Save
out_path = Path("/home/ryanda/project/gh-bot-detection-dashboard/public/og-image.png")
img.save(out_path, format="PNG", optimize=True)
size_kb = out_path.stat().st_size / 1024
print(f"Generated completely plain background OG image: {out_path} ({size_kb:.1f} KB)")
