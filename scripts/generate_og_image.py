"""
Generate high-resolution OpenGraph image (1200x630) for GH Intelligence dashboard.
"""
from PIL import Image, ImageDraw, ImageFont
import math
from pathlib import Path

W, H = 1200, 630
img = Image.new("RGBA", (W, H), (16, 16, 16, 255)) # #101010
draw = ImageDraw.Draw(img)

# 1. Subtle Radial Gradients & Accents in background
# Draw subtle deep blue/indigo glow in the top-right
glow_center_x, glow_center_y = 1000, 100
for r in range(400, 0, -10):
    alpha = int(22 * (1 - r / 400))
    draw.ellipse([glow_center_x - r, glow_center_y - r, glow_center_x + r, glow_center_y + r], 
                 fill=(37, 99, 235, alpha))

# Draw subtle emerald/cyan glow in bottom-left
glow2_x, glow2_y = 100, 550
for r in range(350, 0, -10):
    alpha = int(14 * (1 - r / 350))
    draw.ellipse([glow2_x - r, glow2_y - r, glow2_x + r, glow2_y + r], 
                 fill=(5, 150, 105, alpha))

# 2. Modern Grid Lines (subtle technical blueprint)
grid_color = (38, 38, 38, 70)
for x in range(60, W, 60):
    draw.line([(x, 0), (x, H)], fill=grid_color, width=1)
for y in range(60, H, 60):
    draw.line([(0, y), (W, y)], fill=grid_color, width=1)

# Outer Card Hairline Border
draw.rounded_rectangle([20, 20, W - 20, H - 20], radius=16, outline=(42, 42, 42, 255), width=1)

# Fonts
bold_font_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
reg_font_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
mono_font_path = "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"

font_logo = ImageFont.truetype(bold_font_path, 22)
font_badge = ImageFont.truetype(mono_font_path, 12)
font_title = ImageFont.truetype(bold_font_path, 44)
font_sub = ImageFont.truetype(reg_font_path, 18)
font_metric_val = ImageFont.truetype(bold_font_path, 28)
font_metric_lbl = ImageFont.truetype(reg_font_path, 13)
font_footer = ImageFont.truetype(reg_font_path, 14)
font_footer_bold = ImageFont.truetype(bold_font_path, 14)

# 3. Header Section (Logo + Pill + Academic Breadcrumb)
# Brand icon circle
draw.rounded_rectangle([60, 52, 96, 88], radius=8, fill=(255, 255, 255, 255))
draw.text((70, 58), "GH", fill=(16, 16, 16, 255), font=font_logo)

draw.text((110, 60), "GH Intelligence", fill=(245, 245, 245, 255), font=font_logo)

# Version Pill
draw.rounded_rectangle([285, 62, 375, 86], radius=4, fill=(22, 22, 22, 255), outline=(50, 50, 50, 255))
draw.ellipse([295, 72, 301, 78], fill=(16, 185, 129, 255)) # Green pulse dot
draw.text((308, 66), "LIVE v1.0", fill=(161, 161, 161, 255), font=font_badge)

# Academic Attribution on top right
acad_text = "PBL Big Data 2026 · Universitas Riau"
draw.text((W - 380, 66), acad_text, fill=(140, 140, 140, 255), font=font_footer)

# 4. Hero Headline
draw.text((60, 130), "Detecting & Clustering Stealth Bot Accounts", fill=(255, 255, 255, 255), font=font_title)
draw.text((60, 185), "on GitHub Activity at Scale", fill=(255, 255, 255, 255), font=font_title)

# Subtitle
sub_text_1 = "End-to-end unsupervised data mining pipeline over 9.88M GH Archive events."
sub_text_2 = "Powered by MongoDB Atlas M10, Isolation Forest (tau=0.5514), and K-Means behavioral clustering."
draw.text((60, 255), sub_text_1, fill=(161, 161, 161, 255), font=font_sub)
draw.text((60, 282), sub_text_2, fill=(161, 161, 161, 255), font=font_sub)

# 5. Visual Highlight Cards (4 Key Metrics Cards in a grid)
cards = [
    ("9.88M", "Total Events Ingested", "152 Jam Observasi Bersih", (255, 255, 255)),
    ("44,200", "Modeled Contributor Profiles", "11 Dimensi Fitur Perilaku", (255, 255, 255)),
    ("2,210", "Flagged Anomalies", "Kuantil Teratas 5% (Cutoff tau >= 0.5514)", (244, 63, 94)), # Rose
    ("7 Clusters", "Behavioral Archetypes", "Segmentasi Partisi K-Means", (129, 140, 248)), # Indigo
]

card_w = 250
card_h = 110
gap = 26
start_x = 60
start_y = 350

for idx, (val, title, subtitle, color) in enumerate(cards):
    cx = start_x + idx * (card_w + gap)
    cy = start_y
    # Card background & hairline border
    draw.rounded_rectangle([cx, cy, cx + card_w, cy + card_h], radius=8, fill=(22, 22, 22, 255), outline=(45, 45, 45, 255), width=1)
    
    # Value
    draw.text((cx + 18, cy + 16), val, fill=color, font=font_metric_val)
    # Title
    draw.text((cx + 18, cy + 54), title, fill=(220, 220, 220, 255), font=font_metric_lbl)
    # Subtitle
    draw.text((cx + 18, cy + 76), subtitle, fill=(115, 115, 115, 255), font=ImageFont.truetype(reg_font_path, 11))

# 6. Bottom Meta Bar (Dividing hairline + Supervisor & Student tags)
draw.line([(60, 500), (W - 60, 500)], fill=(38, 38, 38, 255), width=1)

# Supervisor
draw.text((60, 535), "Pembimbing: ", fill=(115, 115, 115, 255), font=font_footer)
draw.text((155, 535), "Assoc. Prof. Dr. Rahmad Kurniawan, ST., MIT.", fill=(220, 220, 220, 255), font=font_footer_bold)

# Student
draw.text((560, 535), "Peneliti: ", fill=(115, 115, 115, 255), font=font_footer)
draw.text((625, 535), "Ryanda Valents Anakri (@ryandaaa)", fill=(220, 220, 220, 255), font=font_footer_bold)

# Tech Stack Pills on bottom right
tech_badges = ["React 18", "FastAPI", "MongoDB Atlas", "Vercel"]
badge_x = W - 60
for badge in reversed(tech_badges):
    bbox = font_badge.getbbox(badge)
    bw = (bbox[2] - bbox[0]) + 16
    badge_x -= (bw + 8)
    draw.rounded_rectangle([badge_x, 532, badge_x + bw, 556], radius=4, fill=(26, 26, 26, 255), outline=(45, 45, 45, 255))
    draw.text((badge_x + 8, 537), badge, fill=(161, 161, 161, 255), font=font_badge)

# Save to public/og-image.png
out_dir = Path("/home/ryanda/project/gh-bot-detection-dashboard/public")
out_dir.mkdir(parents=True, exist_ok=True)
out_path = out_dir / "og-image.png"
img.save(out_path, format="PNG", optimize=True)
print(f"Successfully generated OpenGraph image: {out_path} ({out_path.stat().st_size} bytes)")
