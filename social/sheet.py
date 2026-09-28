#!/usr/bin/env python3
"""3x5 contact sheet of social/png/*.png for quick visual QA."""
import glob
from PIL import Image

files = sorted(glob.glob("social/png/*.png"))
assert files, "no pngs found"
TW, TH = 324, 405  # thumbnail size
cols, rows = 3, (len(files) + 2) // 3
sheet = Image.new("RGB", (cols * TW + (cols + 1) * 8, rows * TH + (rows + 1) * 8), "#DDD")
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((TW, TH), Image.LANCZOS)
    x = 8 + (i % cols) * (TW + 8)
    y = 8 + (i // cols) * (TH + 8)
    sheet.paste(im, (x, y))
sheet.save("social/contact-sheet.jpg", quality=88)
print("sheet:", sheet.size, len(files), "posts")
