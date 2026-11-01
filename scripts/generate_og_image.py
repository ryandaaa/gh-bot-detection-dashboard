"""
Generate Pure Typographic Ultra-Minimalist OpenGraph image (1200x630).
STRICTLY:
- NO circular backgrounds / glows
- NO dots
- NO badges / pill boxes / card boxes
Pure flat #101010 canvas with crisp typography and hairline dividers.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

W, H = 1200, 630

# Palette
BG_COLOR = (16, 16, 16)          # Pure flat #101010
LINE_COLOR = (38, 38, 38)        # Hairline #262626
TEXT_WHITE = (255, 255, 255)     # #ffffff
TEXT_LIGHT = (200, 200, 200)     # #c8c8c8
TEXT_MUTED = (140, 140, 140)     # #8c8c8c
TEXT_FAINT = (95, 95, 95)        # #5f5f5f

img = Image.new("RGB", (W, H), BG_COLOR)
draw = ImageDraw.Draw(img)

# Outer hairline framing (32px inset)
draw.rectangle([32, 32, W - 33, H - 33], outline=LINE_COLOR, width=1)

# Fonts
bold_font_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
reg_font_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
mono_reg_path = "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"

font_logo = ImageFont.truetype(bold_font_path, 22)
font_top_sub = ImageFont.truetype(reg_font_path, 14)
font_title = ImageFont.truetype(bold_font_path, 50)
font_sub = ImageFont.truetype(reg_font_path, 22)
font_formula = ImageFont.truetype(mono_reg_path, 15)

font_num = ImageFont.truetype(bold_font_path, 34)
font_num_label = ImageFont.truetype(reg_font_path, 14)
font_num_sub = ImageFont.truetype(reg_font_path, 12)

font_footer = ImageFont.truetype(reg_font_path, 13)
font_footer_bold = ImageFont.truetype(bold_font_path, 13)

# 1. Top Section (Plain text, no badges, no dots, no boxes)
pad_x = 72
draw.text((pad_x, 68), "GH Intelligence", fill=TEXT_WHITE, font=font_logo)
draw.text((pad_x + 190, 72), "—", fill=TEXT_FAINT, font=font_top_sub)
draw.text((pad_x + 215, 72), "PBL Big Data 2026", fill=TEXT_MUTED, font=font_top_sub)

# Right side attribution
draw.text((W - pad_x - 260, 72), "Universitas Riau · Teknik Informatika", fill=TEXT_MUTED, font=font_top_sub)

# Top divider
draw.line([(pad_x, 114), (W - pad_x, 114)], fill=LINE_COLOR, width=1)

# 2. Hero Headline (Confident, large, pure typography)
draw.text((pad_x, 154), "GitHub Bot & Anomaly Detection", fill=TEXT_WHITE, font=font_title)
draw.text((pad_x, 222), "Unsupervised Behavioral Mining on 9.88M Events", fill=TEXT_LIGHT, font=font_sub)
draw.text((pad_x, 264), "MongoDB Atlas M10  ·  Isolation Forest (tau = 0.5514)  ·  K-Means (k = 7)", fill=TEXT_MUTED, font=font_formula)

# Middle divider
draw.line([(pad_x, 320), (W - pad_x, 320)], fill=LINE_COLOR, width=1)

# 3. Four Column Metrics (Pure typographic columns - NO boxes, NO cards, NO badges)
col_width = (W - 2 * pad_x) // 4
metrics = [
    ("9.88M", "Total Events Ingested", "152 jam observasi"),
    ("44,200", "Modeled Profiles", "11 fitur perilaku"),
    ("Top 5.0%", "Flagged Anomalies", "Cutoff tau >= 0.5514"),
    ("7 Clusters", "Behavioral Archetypes", "Partisi K-Means"),
]

for idx, (num, lbl, sub) in enumerate(metrics):
    x = pad_x + idx * col_width
    draw.text((x, 350), num, fill=TEXT_WHITE, font=font_num)
    draw.text((x, 400), lbl, fill=TEXT_LIGHT, font=font_num_label)
    draw.text((x, 424), sub, fill=TEXT_FAINT, font=font_num_sub)

# Lower divider
draw.line([(pad_x, 475), (W - pad_x, 475)], fill=LINE_COLOR, width=1)

# 4. Footer Section (Clean plain text, NO badges, NO boxes)
draw.text((pad_x, 515), "Pembimbing:", fill=TEXT_MUTED, font=font_footer)
draw.text((pad_x + 95, 515), "Assoc. Prof. Dr. Rahmad Kurniawan, ST., MIT.", fill=TEXT_WHITE, font=font_footer_bold)

draw.text((pad_x, 545), "Peneliti:      ", fill=TEXT_MUTED, font=font_footer)
draw.text((pad_x + 95, 545), "Ryanda Valents Anakri (@ryandaaa)", fill=TEXT_LIGHT, font=font_footer_bold)

# Stack plain text on bottom right
draw.text((W - pad_x - 280, 530), "FastAPI · React 18 · MongoDB Atlas", fill=TEXT_MUTED, font=font_formula)

# Save
out_path = Path("/home/ryanda/project/gh-bot-detection-dashboard/public/og-image.png")
img.save(out_path, format="PNG", optimize=True)
size_kb = out_path.stat().st_size / 1024
print(f"Generated clean ultra-minimalist OG image: {out_path} ({size_kb:.1f} KB)")
