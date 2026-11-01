"""
Generate Ultra-Minimalist OpenGraph image (1200x630) for GH Intelligence.
Strictly NO gradients. Pure flat matte #101010 canvas with crisp typography.
Optimized for WhatsApp, Telegram, Twitter/X, Discord, and LinkedIn.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

W, H = 1200, 630

# Pure flat matte dark background (#101010) - NO gradients
BG_COLOR = (16, 16, 16, 255)
BORDER_COLOR = (38, 38, 38, 255)      # #262626
SURFACE_COLOR = (22, 22, 22, 255)     # #161616
SURFACE_BORDER = (42, 42, 42, 255)    # #2a2a2a

TEXT_PRIMARY = (255, 255, 255, 255)   # Pure white
TEXT_SECONDARY = (161, 161, 161, 255) # Light neutral
TEXT_MUTED = (115, 115, 115, 255)     # Mid gray
TEXT_FAINT = (82, 82, 82, 255)        # Dark gray

img = Image.new("RGB", (W, H), BG_COLOR[:3])
draw = ImageDraw.Draw(img)

# Outer hairline framing (16px inset)
draw.rectangle([24, 24, W - 25, H - 25], outline=BORDER_COLOR[:3], width=1)

# Fonts
bold_font_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
reg_font_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
mono_font_path = "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"
mono_reg_path = "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"

font_brand = ImageFont.truetype(bold_font_path, 22)
font_brand_sub = ImageFont.truetype(reg_font_path, 14)
font_title = ImageFont.truetype(bold_font_path, 48)
font_sub = ImageFont.truetype(reg_font_path, 20)
font_desc = ImageFont.truetype(mono_reg_path, 14)

font_card_val = ImageFont.truetype(bold_font_path, 28)
font_card_lbl = ImageFont.truetype(reg_font_path, 13)
font_card_sub = ImageFont.truetype(reg_font_path, 11)

font_footer = ImageFont.truetype(reg_font_path, 13)
font_footer_bold = ImageFont.truetype(bold_font_path, 13)
font_tag = ImageFont.truetype(mono_font_path, 11)

# 1. Top Bar: Brand Mark + Academic Attribution
# Brand mark
draw.text((64, 56), "GH Intelligence", fill=TEXT_PRIMARY[:3], font=font_brand)
draw.text((230, 62), "/", fill=BORDER_COLOR[:3], font=font_brand)
draw.text((246, 63), "PBL Big Data 2026", fill=TEXT_MUTED[:3], font=font_brand_sub)

# Right side tag
draw.text((W - 360, 63), "Universitas Riau · Fakultas Teknik", fill=TEXT_MUTED[:3], font=font_footer)

# Thin divider below top bar
draw.line([(64, 102), (W - 64, 102)], fill=BORDER_COLOR[:3], width=1)

# 2. Main Headline (Ultra-minimalist typographic hierarchy)
draw.text((64, 138), "GitHub Bot & Anomaly Detection", fill=TEXT_PRIMARY[:3], font=font_title)
draw.text((64, 200), "Unsupervised Behavioral Mining on 9.88M Events", fill=TEXT_SECONDARY[:3], font=font_sub)
draw.text((64, 236), "MongoDB Atlas M10  ·  Isolation Forest (tau = 0.5514)  ·  K-Means (k = 7)", fill=TEXT_MUTED[:3], font=font_desc)

# 3. Flat Minimalist Metric Cards (4 equal columns)
cards = [
    ("9.88M", "Total Events Ingested", "152 jam observasi bersih"),
    ("44,200", "Modeled Contributor Profiles", "11 dimensi fitur perilaku"),
    ("Top 5.0%", "Flagged Anomalies", "Skor cutoff tau >= 0.5514"),
    ("7 Clusters", "Behavioral Archetypes", "Segmentasi partisi K-Means"),
]

card_w = 248
card_h = 104
gap = 26
start_x = 64
start_y = 310

for idx, (val, title, subtitle) in enumerate(cards):
    cx = start_x + idx * (card_w + gap)
    cy = start_y
    # Solid flat card with hairline border
    draw.rectangle([cx, cy, cx + card_w, cy + card_h], fill=SURFACE_COLOR[:3], outline=SURFACE_BORDER[:3], width=1)
    
    # Primary metric value
    draw.text((cx + 16, cy + 16), val, fill=TEXT_PRIMARY[:3], font=font_card_val)
    # Title
    draw.text((cx + 16, cy + 54), title, fill=TEXT_SECONDARY[:3], font=font_card_lbl)
    # Subtitle
    draw.text((cx + 16, cy + 74), subtitle, fill=TEXT_MUTED[:3], font=font_card_sub)

# 4. Lower Divider Line
draw.line([(64, 465), (W - 64, 465)], fill=BORDER_COLOR[:3], width=1)

# 5. Footer Section: People & Technology
# Supervisor & Researcher
draw.text((64, 500), "Pembimbing:", fill=TEXT_MUTED[:3], font=font_footer)
draw.text((150, 500), "Assoc. Prof. Dr. Rahmad Kurniawan, ST., MIT.", fill=TEXT_PRIMARY[:3], font=font_footer_bold)

draw.text((64, 524), "Peneliti:      ", fill=TEXT_MUTED[:3], font=font_footer)
draw.text((150, 524), "Ryanda Valents Anakri (@ryandaaa)", fill=TEXT_SECONDARY[:3], font=font_footer_bold)

# Flat Tech Stack Pills on bottom right
tech_badges = ["Vercel", "FastAPI", "React 18", "MongoDB Atlas"]
bx = W - 64
for badge in tech_badges:
    bbox = font_tag.getbbox(badge)
    bw = (bbox[2] - bbox[0]) + 18
    bx -= (bw + 10)
    draw.rectangle([bx, 506, bx + bw, 532], fill=SURFACE_COLOR[:3], outline=SURFACE_BORDER[:3], width=1)
    draw.text((bx + 9, 513), badge, fill=TEXT_SECONDARY[:3], font=font_tag)

# Save to public/og-image.png (Optimized RGB PNG, under 80 KB)
out_path = Path("/home/ryanda/project/gh-bot-detection-dashboard/public/og-image.png")
img.save(out_path, format="PNG", optimize=True)
size_kb = out_path.stat().st_size / 1024
print(f"Generated ultra-minimalist OG image: {out_path} ({size_kb:.1f} KB)")
