from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Image, PageBreak, Paragraph, Preformatted, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
FONTS = ASSETS / "fonts"
OUTPUT = ROOT / "documents" / "brand-guidelines.pdf"
MAROON = colors.HexColor("#3D141E")
DEEP = colors.HexColor("#2A0D14")
CORAL = colors.HexColor("#E5624D")
CORAL_DARK = colors.HexColor("#C44A38")
CREAM = colors.HexColor("#FAF5EC")
PARCHMENT = colors.HexColor("#F2E9DB")
INK = colors.HexColor("#2B1B20")
MUTED = colors.HexColor("#7A666C")
LINE = colors.HexColor("#D8C8C0")

pdfmetrics.registerFont(TTFont("Cinzel", str(FONTS / "Cinzel-Regular.ttf")))
pdfmetrics.registerFont(TTFont("CinzelMedium", str(FONTS / "Cinzel-Medium.ttf")))
pdfmetrics.registerFont(TTFont("CinzelSemi", str(FONTS / "Cinzel-SemiBold.ttf")))
pdfmetrics.registerFont(TTFont("Garamond", str(FONTS / "EBGaramond-Regular.ttf")))
pdfmetrics.registerFont(TTFont("GaramondItalic", str(FONTS / "EBGaramond-Italic.ttf")))

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="CoverTitle", fontName="CinzelSemi", fontSize=30, leading=35, textColor=CREAM, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="CoverSub", fontName="Garamond", fontSize=16, leading=21, textColor=CREAM, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="H1Brand", fontName="CinzelSemi", fontSize=18, leading=23, textColor=MAROON, spaceBefore=15, spaceAfter=8, keepWithNext=True))
styles.add(ParagraphStyle(name="H2Brand", fontName="CinzelSemi", fontSize=12.5, leading=16, textColor=CORAL_DARK, spaceBefore=10, spaceAfter=5, keepWithNext=True))
styles.add(ParagraphStyle(name="BodyBrand", fontName="Garamond", fontSize=10.3, leading=14.2, textColor=INK, spaceAfter=6))
styles.add(ParagraphStyle(name="BulletBrand", parent=styles["BodyBrand"], leftIndent=14, firstLineIndent=-8, spaceAfter=3))
styles.add(ParagraphStyle(name="SmallBrand", fontName="GaramondItalic", fontSize=8.8, leading=11.5, textColor=MUTED))
styles.add(ParagraphStyle(name="TableBrand", fontName="Garamond", fontSize=8.3, leading=10.5, textColor=INK))
styles.add(ParagraphStyle(name="TableHead", fontName="CinzelSemi", fontSize=7.7, leading=9.5, textColor=CREAM))
styles.add(ParagraphStyle(name="CodeBrand", fontName="Courier", fontSize=7.2, leading=9.3, textColor=CREAM, backColor=DEEP, borderPadding=7))
styles.add(ParagraphStyle(name="DisplaySpecimen", fontName="CinzelSemi", fontSize=24, leading=28, textColor=MAROON, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="BodySpecimen", fontName="Garamond", fontSize=14, leading=18, textColor=INK, alignment=TA_CENTER))


def markup(value):
    value = escape(value, quote=False)
    while "**" in value:
        value = value.replace("**", "<b>", 1)
        if "**" in value:
            value = value.replace("**", "</b>", 1)
    parts = value.split("`")
    return "".join(part if index % 2 == 0 else f'<font name="Courier">{part}</font>' for index, part in enumerate(parts))


def table_block(rows):
    if not rows:
        return
    count = len(rows[0])
    width = 174 * mm / count
    data = []
    for index, row in enumerate(rows):
        style = styles["TableHead"] if index == 0 else styles["TableBrand"]
        data.append([Paragraph(markup(cell), style) for cell in row])
    table = Table(data, colWidths=[width] * count, repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), MAROON),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    STORY.extend([table, Spacer(1, 5)])


def visual_logo_page():
    paths = [
        (ASSETS / "png/crescent-logo-maroon-2000.png", "Primary maroon tile"),
        (ASSETS / "png/crescent-logo-light-2000.png", "Light transparent"),
        (ASSETS / "png/crescent-logo-on-maroon-2000.png", "On maroon transparent"),
    ]
    cells = []
    for path, label in paths:
        cells.append([Image(str(path), width=55 * mm, height=19.8 * mm), Paragraph(label, styles["SmallBrand"])])
    table = Table([cells], colWidths=[58 * mm] * 3)
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 2), ("RIGHTPADDING", (0, 0), (-1, -1), 2)]))
    STORY.extend([Paragraph("Approved logo artwork", styles["H2Brand"]), table, Spacer(1, 6)])
    mono = Image(str(ASSETS / "favicon/icon-512.png"), width=28 * mm, height=28 * mm)
    STORY.extend([Table([[mono, Paragraph("Monogram for favicons, avatars, app icons, stamps, and compact navigation.", styles["BodyBrand"])]], colWidths=[34 * mm, 140 * mm], style=[("BACKGROUND", (0, 0), (-1, -1), PARCHMENT), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("BOX", (0, 0), (-1, -1), .4, LINE)]), Spacer(1, 8)])


def visual_color_page():
    values = [("#3D141E", "Crescent Maroon"), ("#2A0D14", "Deep Maroon"), ("#E5624D", "Crescent Coral"), ("#C44A38", "Coral Dark"), ("#F8DAD0", "Coral Tint"), ("#FAF5EC", "Cream"), ("#F2E9DB", "Parchment"), ("#2B1B20", "Ink Espresso"), ("#7A666C", "Muted Plum")]
    rows = []
    for start in range(0, len(values), 3):
        row = []
        for hex_value, name in values[start:start + 3]:
            row.append(Table([[""], [Paragraph(f"<b>{name}</b><br/>{hex_value}", styles["TableBrand"])]], colWidths=[54 * mm], rowHeights=[11 * mm, 10 * mm], style=[("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(hex_value)), ("BOX", (0, 0), (-1, -1), .4, LINE)]))
        while len(row) < 3:
            row.append("")
        rows.append(row)
    table = Table(rows, colWidths=[58 * mm] * 3)
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 2), ("RIGHTPADDING", (0, 0), (-1, -1), 2)]))
    STORY.extend([Paragraph("Color chips", styles["H2Brand"]), table, Spacer(1, 5)])


def visual_type_page():
    STORY.extend([
        Image(str(ASSETS / "png/crescent-logo-light-2000.png"), width=118 * mm, height=42.5 * mm),
        Paragraph("Typography specimens", styles["H2Brand"]),
        Paragraph("HANDCRAFTED FOR YOU", styles["DisplaySpecimen"]),
        Spacer(1, 4),
        Paragraph("Every piece is drawn, jointed and finished by hand.", styles["BodySpecimen"]),
        Spacer(1, 7),
    ])


def visual_component_page():
    def button(label, background, foreground, border=None, width=44):
        return Table([[Paragraph(label, ParagraphStyle(name=label, fontName="CinzelSemi", fontSize=7.5, textColor=foreground, alignment=TA_CENTER))]], colWidths=[width * mm], rowHeights=[12 * mm], style=[("BACKGROUND", (0, 0), (-1, -1), background), ("TEXTCOLOR", (0, 0), (-1, -1), foreground), ("BOX", (0, 0), (-1, -1), 1 if border else 0, border or background), ("VALIGN", (0, 0), (-1, -1), "MIDDLE")])
    table = Table([[button("BOOK A VISIT", CORAL, DEEP), button("VIEW COLLECTION", colors.white, MAROON, MAROON, 49), button("ENQUIRE", MAROON, CORAL, CORAL, 38)]], colWidths=[55 * mm, 62 * mm, 55 * mm])
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("ALIGN", (0, 0), (-1, -1), "CENTER")]))
    STORY.extend([Paragraph("Interface component sheet", styles["H2Brand"]), table, Spacer(1, 7), Paragraph("Default button height: 48 px. Compact height: 40 px. Radius: 3 px. Use visible focus, a restrained 1 px lift, and no pill-shaped controls.", styles["BodyBrand"])])


def visual_favicon_page():
    files = [(16, "favicon-16.png"), (32, "favicon-32.png"), (48, "favicon-48.png"), (180, "apple-touch-icon-180.png"), (192, "icon-192.png"), (512, "icon-512.png")]
    cells = []
    for size, filename in files:
        display = max(8, min(25, size / 12)) * mm
        cells.append([Image(str(ASSETS / "favicon" / filename), width=display, height=display), Paragraph(f"{size} px", styles["SmallBrand"])])
    table = Table([cells], colWidths=[29 * mm] * len(cells))
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("ALIGN", (0, 0), (-1, -1), "CENTER")]))
    STORY.extend([Paragraph("Favicon and app icon scale test", styles["H2Brand"]), table, Spacer(1, 6), Paragraph("The compact mark keeps only three strong shapes: maroon tile, coral sweep, and cream C. Do not add detail to the 16 px version.", styles["BodyBrand"])])


def first_page(canvas, document):
    canvas.saveState()
    canvas.setFillColor(MAROON)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.restoreState()


def later_page(canvas, document):
    canvas.saveState()
    if document.page == 10:
        canvas.setFillColor(MAROON)
        canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
        canvas.restoreState()
        return
    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setStrokeColor(CORAL)
    canvas.setLineWidth(.7)
    canvas.line(18 * mm, 14 * mm, A4[0] - 18 * mm, 14 * mm)
    canvas.setFont("Cinzel", 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 9 * mm, "CRESCENT BESPOKE FURNITURE HOUSE")
    canvas.drawRightString(A4[0] - 18 * mm, 9 * mm, str(document.page))
    canvas.restoreState()


STORY = [
    Spacer(1, 48 * mm),
    Image(str(ASSETS / "png/crescent-logo-on-maroon-2000.png"), width=165 * mm, height=59.4 * mm),
    Spacer(1, 16 * mm),
    Paragraph("BRAND GUIDELINES", ParagraphStyle(name="CoverKicker", fontName="CinzelSemi", fontSize=12, leading=15, textColor=CORAL, alignment=TA_CENTER)),
    Spacer(1, 3 * mm),
    Paragraph("Version 1.1", styles["CoverSub"]),
    Spacer(1, 67 * mm),
    Paragraph("Production handoff: identity, interface, content, accessibility, and export rules.", styles["SmallBrand"]),
    PageBreak(),
]

lines = (ROOT / "documents/brand-guidelines.md").read_text(encoding="utf-8").splitlines()
code = False
code_lines = []
table_rows = []
for raw in lines:
    line = raw.strip()
    if line.startswith("```"):
        if code:
            STORY.extend([Preformatted("\n".join(code_lines), styles["CodeBrand"]), Spacer(1, 5)])
            code_lines = []
            code = False
        else:
            code = True
        continue
    if code:
        code_lines.append(raw)
        continue
    if line.startswith("|"):
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if set("".join(cells).replace("-", "").replace(":", "").replace(" ", "")):
            table_rows.append(cells)
        continue
    if table_rows:
        table_block(table_rows)
        table_rows = []
    if line.startswith("# ") or line == "## Contents":
        continue
    if line.startswith("## "):
        heading = line[3:]
        lower = heading.lower()
        if lower.startswith("4. typography"):
            STORY.append(PageBreak())
        STORY.append(Paragraph(markup(heading), styles["H1Brand"]))
        if lower.startswith("2. logo"):
            visual_logo_page()
        elif lower.startswith("3. color"):
            visual_color_page()
        elif lower.startswith("4. typography"):
            visual_type_page()
        elif lower.startswith("6. interface"):
            visual_component_page()
        elif lower.startswith("10. asset"):
            visual_favicon_page()
    elif line.startswith("### "):
        STORY.append(Paragraph(markup(line[4:]), styles["H2Brand"]))
    elif line.startswith("- "):
        STORY.append(Paragraph(markup(line[2:]), styles["BulletBrand"], bulletText="•"))
    elif line and not line[0].isdigit():
        STORY.append(Paragraph(markup(line), styles["BodyBrand"]))
if table_rows:
    table_block(table_rows)

STORY.extend([
    PageBreak(),
    Spacer(1, 73 * mm),
    Image(str(ASSETS / "png/crescent-logo-on-maroon-2000.png"), width=150 * mm, height=54 * mm),
    Spacer(1, 57 * mm),
    Paragraph("Brand Guidelines v1.1", ParagraphStyle(name="BackMeta", fontName="GaramondItalic", fontSize=10, leading=13, textColor=colors.HexColor("#D9C4BC"), alignment=TA_CENTER)),
])

document = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm, topMargin=17 * mm, bottomMargin=20 * mm, title="Crescent Brand Guidelines v1.1", author="Crescent Bespoke Furniture House")
document.build(STORY, onFirstPage=first_page, onLaterPages=later_page)
print(f"Created {OUTPUT}")