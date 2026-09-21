# Crescent Bespoke Furniture House

## Brand Guidelines v1.1

This is the production handoff for the Crescent identity extracted from `branding/index.html`. It defines the visual system, its intended behavior, and the files supplied in this package. The current logo artwork does not include a founding year because the year in the reference sign was unreadable.

## Contents

1. Brand foundation
2. Logo and monogram system
3. Color system and contrast
4. Typography system
5. Layout and spacing
6. Interface components
7. Iconography and imagery
8. Social and content templates
9. Accessibility and responsive behavior
10. Asset production and file inventory
11. Implementation tokens

## 1. Brand foundation

### Position

Crescent is a bespoke furniture house: considered, material-led, and made for people who value lasting craft over disposable decoration.

### Personality

- **Crafted:** visible process, honest materials, patient detail.
- **Classical:** Roman-capital typography and centered composition.
- **Warm:** terracotta coral, wood tones, paper neutrals, and human copy.
- **Measured:** restrained motion, generous spacing, and a quiet interface.

### Voice

Write calmly and specifically. Prefer words such as made, joined, seasoned, carved, finished, commissioned, and workshop. Avoid urgency language, exaggerated luxury claims, and generic phrases such as “elevate your space.” Copy should sound like a craftsperson who knows the material.

Example: “Drawn in the workshop, jointed by hand, and finished to live with you.”

## 2. Logo and monogram system

The primary mark is a coral crescent sweep above a Cinzel wordmark. The descriptor is centered between two rules. The geometry is fixed: do not redraw the arc, change the tracking, or substitute another font in master artwork.

### Approved variants

- **Primary maroon tile:** `assets/logo/crescent-logo-maroon.svg`. Use on documents, social graphics, presentations, and dark brand surfaces. The tile is part of this variant.
- **Light transparent:** `assets/logo/crescent-logo-light.svg`. Use on cream, parchment, white, and other pale surfaces. The descriptor and rules are maroon.
- **On maroon transparent:** `assets/logo/crescent-logo-on-maroon.svg`. Use on maroon or deep maroon surfaces. The descriptor and rules are cream.
- **Monogram:** `assets/logo/crescent-monogram.svg`. Use for favicon, avatar, app icon, stamp, embroidery, and compact navigation.

### Clear space

Reserve a minimum clear-space field equal to the height of the capital `C` around every side of the full lockup. Do not allow navigation, photography, borders, or copy to enter this field. The maroon-tile background does not replace clear space when the logo is placed in a larger composition.

### Minimum size

- Full lockup: 180 px wide minimum for digital; 35 mm wide minimum for print.
- Monogram: 16 px minimum for digital; use a simplified production test for embroidery or engraving.
- Descriptor: never use the full lockup at a size where the descriptor becomes illegible. Switch to the monogram instead.

### Misuse checklist

Never stretch, squash, rotate, arc, outline, shadow, crop, recolor, or add a gradient to the mark. Never place the light version on a dark surface or the on-maroon version on a pale surface. Never place the mark over a busy image without a 35-55% maroon scrim. Never add a founding year until it has been confirmed.

## 3. Color system and contrast

| Token | Hex | RGB | Use |
| --- | --- | --- | --- |
| Crescent Maroon | `#3D141E` | 61, 20, 30 | Hero, dark navigation, footer, dark panels |
| Deep Maroon | `#2A0D14` | 42, 13, 20 | Footer depth, code blocks, scrims, deep hover |
| Crescent Coral | `#E5624D` | 229, 98, 77 | Arc, primary CTA, links, highlights |
| Coral Dark | `#C44A38` | 196, 74, 56 | Coral hover, small coral text on cream |
| Coral Tint | `#F8DAD0` | 248, 218, 208 | Soft fills, badges, focus-related surfaces |
| Cream | `#FAF5EC` | 250, 245, 236 | Main canvas and light type on dark |
| Parchment | `#F2E9DB` | 242, 233, 219 | Alternate section background |
| Ink Espresso | `#2B1B20` | 43, 27, 32 | Body text on light surfaces |
| Muted Plum | `#7A666C` | 122, 102, 108 | Captions, placeholders, secondary text |

### Color roles

Use the approximate 55/30/10/5 balance: maroon 55%, cream 30%, coral 10%, deep maroon 5%. Coral is an accent, not a full-page background. Parchment separates sections without introducing another brand hue. Use Ink Espresso for reading text rather than maroon when long-form copy sits on cream.

### Approved contrast pairs

- Cream on Crescent Maroon: approximately 15.5:1, AAA.
- Crescent Maroon on Cream: approximately 15.5:1, AAA.
- Deep Maroon on Crescent Coral: approximately 4.9:1, AA.
- Coral Dark on Cream: approximately 4.7:1, AA for normal text.
- Coral on Cream: approximately 3.2:1, large text or decorative use only.

Do not use Muted Plum for essential text below 16 px without testing the final combination. Do not use coral as small body copy on cream.

## 4. Typography system

### Families

- **Cinzel:** wordmark, display headings, navigation, eyebrows, labels, buttons, and short UI strings. Use the supplied `Cinzel-Regular.ttf`, `Cinzel-Medium.ttf`, `Cinzel-SemiBold.ttf`, and `Cinzel-Bold.ttf`.
- **EB Garamond:** paragraphs, product descriptions, captions, quotes, and editorial copy. Use the supplied regular, medium, semibold, and italic files.

Fallback stack: Georgia, Times New Roman, serif. The font files are in `assets/fonts/` and are licensed under the SIL Open Font License. Keep the matching license files when redistributing them.

### Type scale

| Style | Font | Size / line | Tracking | Typical use |
| --- | --- | --- | --- | --- |
| Display | Cinzel 600, uppercase | 44-64 / 1.1 | .04em | Hero headline |
| H2 | Cinzel 600, uppercase | 30-32 / 1.2 | .06-.08em | Section heading |
| H3 | Cinzel 600 | 18-22 / 1.3 | .04-.06em | Card and subsection heading |
| Overline | Cinzel 600, uppercase | 12-13 | .30-.32em | Section number or status |
| Body | EB Garamond 400 | 18 / 1.65 | 0 | Reading copy |
| Lead | EB Garamond 400 | 20 / 1.55 | 0 | Introductory copy |
| Caption | EB Garamond italic | 15 / 1.45 | 0 | Material and image notes |
| Button | Cinzel 600, uppercase | 13 / 1 | .18em | Action label |

Use normal letter spacing for Garamond. Never force uppercase body copy. Keep paragraphs between 55 and 68 characters where possible.

## 5. Layout and spacing

Use a centered container with a maximum width of approximately 1160 px and 24 px side padding. Desktop section padding is 78-96 px; mobile section padding is 56 px. Use a 4 px base rhythm for small values, then 8, 12, 16, 20, 24, 34, 36, 44, 56, 78, and 96 px for larger spacing.

### Surfaces

- Cream is the default reading canvas.
- Parchment marks an alternate section.
- Maroon owns hero bands, strong calls to action, and footer surfaces.
- Deep Maroon is for depth, code samples, and darkened photography.

Avoid nested cards. Use panels only for repeated items, framed tools, forms, and dialogs. Keep card corners at 6 px and buttons/inputs at 3 px.

## 6. Interface components

### Buttons

All buttons are 48 px tall, 3 px radius, inline-flex aligned, and use Cinzel 600 at 13 px with `.18em` tracking. Small buttons are 40 px tall.

| Variant | Background | Border | Text | Surface |
| --- | --- | --- | --- | --- |
| Primary | `#E5624D` | none | `#2A0D14` | Light or maroon |
| Secondary | transparent | 1.5 px `#3D141E` | `#3D141E` | Light |
| Ghost | transparent | 1.5 px `#E5624D` | `#E5624D` | Maroon |

Primary hover darkens to `#C44A38`, lifts 1 px, and may use a coral-tinted shadow. Secondary hover fills maroon and changes text to cream. Ghost hover fills coral and changes text to deep maroon. Disabled buttons use 40% opacity, no lift, and `cursor: not-allowed`.

### Navigation

Use the monogram or a compact wordmark at the left, horizontally scrollable links on narrow screens, and one primary enquiry action. Active links use a 2 px coral underline. The sticky bar uses a translucent cream surface with a subtle bottom rule and blur.

### Product cards

Use a 6 px radius, a real product image, a short Cinzel eyebrow such as `NEW` or `BESPOKE`, a concise product name, and one supporting line. Keep the action secondary unless the card is the main conversion point. Do not invent decorative gradients over product photography.

### Forms

Inputs are 46 px high, 3 px radius, cream or white, and use EB Garamond at 16 px. Labels use Cinzel 12 px uppercase with `.14em` tracking. Focus uses a coral border and a 3 px soft coral ring. Error text must be plain language and must not rely on coral alone; pair color with a message and icon.

### Focus and motion

Global focus: `2px solid #E5624D` with `3px` offset. Use 200 ms ease-out transitions, hover lifts of 1-3 px, and fade-up reveals of 18 px. Respect `prefers-reduced-motion: reduce` by removing transforms and reveal delays. Nothing bounces.

### Implementation example

```css
:root {
	--maroon: #3D141E;
	--deep: #2A0D14;
	--coral: #E5624D;
	--coral-dark: #C44A38;
	--cream: #FAF5EC;
	--parchment: #F2E9DB;
	--ink: #2B1B20;
	--muted: #7A666C;
	--font-display: "Cinzel", Georgia, "Times New Roman", serif;
	--font-body: "EB Garamond", Georgia, serif;
	--radius: 3px;
	--radius-card: 6px;
	--ease: cubic-bezier(.2, .7, .3, 1);
}

.button-primary {
	min-height: 48px;
	padding: 0 28px;
	border: 0;
	border-radius: var(--radius);
	background: var(--coral);
	color: var(--deep);
	font: 600 13px var(--font-display);
	letter-spacing: .18em;
	text-transform: uppercase;
}
```

## 7. Iconography and imagery

### Icons

Use simple line icons with a 1.5 px stroke, maroon on light surfaces and cream or coral on dark surfaces. Keep icons optically balanced, with no filled illustration style. Common icon subjects are enquiry/message, phone, map pin, arrow, menu, close, play, and external link. Use a familiar symbol for icon-only controls and provide an accessible name or tooltip.

Do not use icons as decoration when a text label is required for comprehension. Do not mix rounded filled icon sets with the Crescent line style.

### Photography

Prioritize real workshop images: hands, chisels, joinery, grain, finishing, and the finished piece in a lived-in setting. Use warm wood tones but preserve natural color. Avoid stock-looking staged rooms, extreme blur, heavy filters, and dark crops that make material inspection impossible.

When text sits over photography, add a 35-55% maroon scrim. Keep the mark in a quiet area and preserve its clear space. A 6 px radius and an optional 1 px maroon offset frame are acceptable.

## 8. Social and content templates

Keep a safe area of 8% inside every edge. At most one large coral element should appear in a post.

- **Quote card:** maroon background, Cinzel quote, coral arc above, cream supporting text.
- **Product post:** 4:5 product photo, cream caption block, coral `NEW` or `BESPOKE` eyebrow.
- **Workshop reel cover:** photo with 50% maroon scrim and cream Cinzel title.
- **Profile image:** monogram centered on maroon, export at 1000 x 1000.
- **Open Graph:** centered on-maroon lockup on a 1200 x 630 maroon field.

Suggested caption voice: first person plural or direct craft language. Signature line: “Aaram ka naam.” Confirm that this phrase is appropriate for the intended audience before publishing.

## 9. Accessibility and responsive behavior

Keep text contrast at WCAG AA or better, with the pairings listed above. Preserve visible focus. Every logo image needs meaningful alt text when it conveys brand identity; decorative repeated marks may use empty alt text. Every icon-only button needs an accessible label. Do not encode essential information through color alone.

On mobile, allow navigation to scroll horizontally, stack card actions, preserve the 48 px touch target, and reduce display type by approximately 15% rather than using viewport-scaled text. Never let button labels or card content overflow. Keep the logo descriptor legible or switch to the monogram.

## 10. Asset production and inventory

### Vector masters

- `assets/logo/crescent-logo-maroon.svg` - 1000 x 360 primary tile.
- `assets/logo/crescent-logo-light.svg` - transparent light-background lockup.
- `assets/logo/crescent-logo-on-maroon.svg` - transparent dark-surface lockup.
- `assets/logo/crescent-monogram.svg` - 96 x 96 compact icon.

### Raster exports

- `assets/png/crescent-logo-maroon-2000.png` - 2000 x 720 primary tile.
- `assets/png/crescent-logo-light-2000.png` - 2000 x 720 transparent lockup.
- `assets/png/crescent-logo-on-maroon-2000.png` - 2000 x 720 transparent dark-surface lockup.
- `assets/png/crescent-avatar-1000.png` - 1000 x 1000 monogram avatar.
- `assets/png/crescent-og-1200x630.png` - 1200 x 630 link-preview image.

### Favicons and app icons

- `assets/favicon/icon.svg` - scalable browser icon.
- `assets/favicon/favicon-16.png`, `favicon-32.png`, and `favicon-48.png` - tab sizes.
- `assets/favicon/favicon.ico` - multi-size 16/32/48 ICO.
- `assets/favicon/apple-touch-icon-180.png` - iOS home-screen icon.
- `assets/favicon/icon-192.png` and `icon-512.png` - PWA manifest icons.

Recommended HTML:

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon-180.png">
```

### Fonts and licensing

Font files are in `assets/fonts/`. The families are Cinzel and EB Garamond from Google Fonts. Keep `OFL-Cinzel.txt` and `OFL-EB-Garamond.txt` beside redistributed font files. Use SVG for print, signage, embroidery, and any scalable artwork. Use PNG for social and raster-only workflows. Convert text to outlines before professional print or engraving.

## 11. Implementation tokens

```css
:root {
	--maroon: #3D141E;
	--deep: #2A0D14;
	--maroon-soft: #4A1A26;
	--coral: #E5624D;
	--coral-dark: #C44A38;
	--coral-tint: #F8DAD0;
	--cream: #FAF5EC;
	--parchment: #F2E9DB;
	--ink: #2B1B20;
	--muted: #7A666C;
	--line: rgba(61, 20, 30, .14);
	--font-display: "Cinzel", Georgia, "Times New Roman", serif;
	--font-body: "EB Garamond", Georgia, serif;
	--radius: 3px;
	--radius-card: 6px;
	--shadow-sm: 0 1px 2px rgba(42, 13, 20, .08);
	--shadow-md: 0 8px 24px rgba(42, 13, 20, .12);
	--shadow-lg: 0 16px 40px rgba(42, 13, 20, .16);
	--ease: cubic-bezier(.2, .7, .3, 1);
}
```

## Production notes

Screen colors are approximations. Order a physical proof before a full print run and specify a physical match for the coral. The original sign included a small `SINCE` strip, but the year was unreadable in the source reference. Confirm the founding year before adding it to production artwork.