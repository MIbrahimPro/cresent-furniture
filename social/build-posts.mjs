/**
 * Crescent social post generator — 15 unique 1080×1350 (4:5) posts.
 * Brand: paper #F4EFE6 · espresso #231B14 · terracotta #B4552D · cream #F8F5EE
 * Type:  Fraunces (display) · Marcellus (logo) · Archivo (ui) · Merriweather (body)
 *
 * Usage: node build-posts.mjs   → social/posts/*.svg + social/png/*.png + contact sheet
 * Photos are cropped to exact slots with ffmpeg, then embedded as base64 JPEG.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, unlinkSync } from "node:fs";
import { createHash } from "node:crypto";

/* ---------------- brand ---------------- */
const C = {
  paper: "#F4EFE6",
  bone: "#EDE6D8",
  espresso: "#231B14",
  espressoDeep: "#191008",
  terra: "#B4552D",
  terraDeep: "#93401F",
  cream: "#F8F5EE",
  mutd: "rgba(248,245,238,0.72)",
  ink: "#231B14",
  inkSoft: "rgba(35,27,20,0.66)",
  mute: "rgba(35,27,20,0.45)",
  line: "rgba(35,27,20,0.14)",
  line2: "rgba(35,27,20,0.28)",
  creamLine: "rgba(248,245,238,0.25)",
};
const F = {
  display: "Fraunces, 'DejaVu Serif', serif",
  logo: "Marcellus, 'DejaVu Serif', serif",
  ui: "Archivo, 'DejaVu Sans', sans-serif",
  body: "Merriweather, 'DejaVu Serif', serif",
};
const W = 1080, H = 1350;
const HANDLE = "crescentfurniture.pk";
const ADDRESS = "Furniture Market, Murree Road, Rawalpindi";

/* ---------------- photo → base64 (ffmpeg crop+resize, cached) ---------------- */
const b64Cache = new Map();
function photoB64(key, w, h, warm = 0) {
  const ck = `${key}-${w}x${h}-w${warm}`;
  if (b64Cache.has(ck)) return b64Cache.get(ck);
  const src = `social/photos/${key}.jpg`;
  if (!existsSync(src)) throw new Error(`missing photo: ${src}`);
  const tmp = `social/cache/${ck}.jpg`;
  mkdirSync("social/cache", { recursive: true });
  if (!existsSync(tmp)) {
    let vf = `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}`;
    if (warm) vf += `,colortemperature=${warm}`;
    vf += ",eq=saturation=0.96";
    execSync(`ffmpeg -y -loglevel error -i "${src}" -vf "${vf}" -q:v 4 "${tmp}"`);
  }
  const b64 = readFileSync(tmp).toString("base64");
  b64Cache.set(ck, b64);
  return b64;
}

/* ---------------- svg atoms ---------------- */
const img = (key, x, y, w, h, warm) =>
  `<image x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" xlink:href="data:image/jpeg;base64,${photoB64(key, w, h, warm)}"/>`;

const scrimBottom = (h, color, op, y) =>
  `<rect x="0" y="${y ?? H - h}" width="${W}" height="${h}" fill="url(#gBottom${color.slice(1)})"/>`;

const defs = (scrimColor = C.espressoDeep) => `
  <defs>
    <linearGradient id="gBottom${scrimColor.slice(1)}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${scrimColor}" stop-opacity="0"/>
      <stop offset="0.55" stop-color="${scrimColor}" stop-opacity="0.72"/>
      <stop offset="1" stop-color="${scrimColor}" stop-opacity="0.96"/>
    </linearGradient>
    <linearGradient id="gTop${scrimColor.slice(1)}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${scrimColor}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${scrimColor}" stop-opacity="0"/>
    </linearGradient>
  </defs>`;

const overline = (x, y, text, color = C.terra, anchor = "start", ls = 6) =>
  `<text x="${x}" y="${y}" font-family="${F.ui}" font-weight="600" font-size="17" letter-spacing="${ls}" fill="${color}" text-anchor="${anchor}">${text}</text>`;

const rule = (x1, y, x2, color = C.line2, sw = 1.4) =>
  `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="${sw}"/>`;

/** Wordmark: arc above spaced Marcellus caps. */
function wordmark(x, y, size = 34, color = C.ink, anchor = "start") {
  const ls = size * 0.30;
  const arcW = size * 3.4, arcH = size * 0.36;
  const arcX = anchor === "middle" ? x - arcW / 2 : x;
  return `
  <g>
    <path d="M ${arcX + arcW * 0.06} ${y - size * 1.12} Q ${arcX + arcW / 2} ${y - size * 1.5} ${arcX + arcW * 0.94} ${y - size * 1.12}" fill="none" stroke="${C.terra}" stroke-width="${size * 0.075}" stroke-linecap="round"/>
    <text x="${x}" y="${y}" font-family="${F.logo}" font-size="${size}" letter-spacing="${ls}" fill="${color}" text-anchor="${anchor}">${anchor === "middle" ? `CRESCENT` : `CRESCENT`}</text>
  </g>`;
}

/** Tiny chip (pill) with border. */
const chip = (x, y, w, h, text, fg, bg, border) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${bg}" stroke="${border}" stroke-width="1.2"/>
  <text x="${x + w / 2}" y="${y + h / 2 + 5.5}" font-family="${F.ui}" font-weight="600" font-size="16.5" letter-spacing="1.6" fill="${fg}" text-anchor="middle">${text}</text>`;

const wrapped = (lines, x, y, lh, font, size, weight, fill, style = "") =>
  lines.map((t, i) =>
    `<text x="${x}" y="${y + i * lh}" font-family="${font}" font-weight="${weight}" font-size="${size}" fill="${fill}" ${style ? `font-style="${style}"` : ""}>${t}</text>`
  ).join("\n  ");

/* ---------------- shared footer for light posts ---------------- */
function brandFoot(mode = "light", y = H - 46) {
  const ink = mode === "light" ? C.ink : C.cream;
  const mut = mode === "light" ? C.mute : C.mutd;
  return `
  ${rule(72, y - 26, W - 72, mode === "light" ? C.line : C.creamLine)}
  <text x="72" y="${y}" font-family="${F.logo}" font-size="20" letter-spacing="7" fill="${ink}">CRESCENT</text>
  <text x="${W - 72}" y="${y}" font-family="${F.ui}" font-weight="500" font-size="15" letter-spacing="2.4" fill="${mut}" text-anchor="end">${HANDLE}</text>`;
}

/* ================================================================
   THE 15 POSTS — each with its own composition
   ================================================================ */
const posts = [];

/* ---- 01 · Brand hero — photo top, paper band bottom ---- */
posts.push({
  name: "01-hero-under-one-roof",
  caption: "Everything, under one roof.\nLiving · dining · bedroom · office · lighting — Murree Road, Rawalpindi.\n#CrescentFurniture #Rawalpindi #FurniturePK #HomeDecor #InteriorPK",
  svg: () => `
  ${defs()}
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  ${img("01-sideboard", 0, 0, W, 830)}
  <rect x="0" y="830" width="${W}" height="1.5" fill="${C.line2}"/>
  ${overline(72, 912, "CRESCENT · RAWALPINDI")}
  <text x="72" y="995" font-family="${F.display}" font-weight="400" font-size="88" fill="${C.ink}">Everything,</text>
  <text x="72" y="1085" font-family="${F.display}" font-weight="400" font-style="italic" font-size="88" fill="${C.terra}">under one roof.</text>
  <text x="72" y="1156" font-family="${F.body}" font-weight="300" font-size="24.5" fill="${C.inkSoft}">Furniture for real homes — living, dining, bedroom,</text>
  <text x="72" y="1192" font-family="${F.body}" font-weight="300" font-size="24.5" fill="${C.inkSoft}">office and lighting. On the floor, ready to go.</text>
  ${chip(72, 1210, 306, 52, "SHOP IN STORE OR ON WHATSAPP", C.cream, C.espresso, C.espresso)}
  ${brandFoot("light", H - 40)}
  `,
});

/* ---- 02 · Bed — full bleed, espresso bottom scrim ---- */
posts.push({
  name: "02-kashmir-bed",
  caption: "Wake up in a room that works.\nThe Kashmir Bed Frame — solid deodar cedar, hand-carved headboard. PKR 195,000.\n#BedroomGoals #SolidWood #CrescentFurniture #Islamabad #Rawalpindi",
  svg: () => `
  ${defs()}
  ${img("02-bedroom", 0, 0, W, H)}
  ${scrimBottom(620, C.espressoDeep)}
  ${overline(72, 842, "THE BEDROOM EDIT", C.cream, "start")}
  <text x="72" y="940" font-family="${F.display}" font-weight="400" font-size="84" fill="${C.cream}">Wake up in a</text>
  <text x="72" y="1030" font-family="${F.display}" font-weight="400" font-style="italic" font-size="84" fill="${C.cream}">room that works.</text>
  <text x="72" y="1102" font-family="${F.body}" font-weight="300" font-size="25" fill="${C.mutd}">The Kashmir Bed Frame — solid deodar cedar,</text>
  <text x="72" y="1138" font-family="${F.body}" font-weight="300" font-size="25" fill="${C.mutd}">carved headboard, quiet nights.</text>
  <text x="72" y="1216" font-family="${F.display}" font-weight="500" font-size="44" fill="${C.terra}" font-style="italic">PKR 195,000</text>
  ${rule(72, 1252, 340, C.creamLine)}
  <text x="72" y="1296" font-family="${F.ui}" font-weight="500" font-size="16" letter-spacing="2.6" fill="${C.mutd}">WHATSAPP 0311 8550000 · MURREE ROAD</text>
  ${wordmark(W - 72, 1296, 26, C.cream, "end")}
  `,
});

/* ---- 03 · Workshop / craft — espresso slab, framed photo ---- */
posts.push({
  name: "03-cut-joined-finished",
  caption: "Cut. Joined. Finished.\nSolid wood, kiln-dried and joined to last decades — not seasons.\n#Craftsmanship #Woodwork #Furniture #CrescentFurniture #MadeInPakistan",
  svg: () => `
  ${defs()}
  <rect width="${W}" height="${H}" fill="${C.espresso}"/>
  <rect x="150" y="96" width="780" height="700" fill="none" stroke="${C.creamLine}" stroke-width="1.4"/>
  ${img("03-workshop", 166, 112, 748, 668)}
  ${overline(W / 2, 880, "01 — THE MATERIALS", C.terra, "middle", 8)}
  <text x="${W / 2}" y="988" font-family="${F.display}" font-weight="400" font-size="92" fill="${C.cream}" text-anchor="middle">Cut. Joined.</text>
  <text x="${W / 2}" y="1082" font-family="${F.display}" font-weight="400" font-style="italic" font-size="92" fill="${C.terra}" text-anchor="middle">Finished.</text>
  <text x="${W / 2}" y="1150" font-family="${F.body}" font-weight="300" font-size="24" fill="${C.mutd}" text-anchor="middle">Kiln-dried hardwood. Hand-cut dovetails. Hardware</text>
  <text x="${W / 2}" y="1186" font-family="${F.body}" font-weight="300" font-size="24" fill="${C.mutd}" text-anchor="middle">that still works when your kids inherit it.</text>
  ${rule(W / 2 - 60, 1236, W / 2 + 60, C.creamLine)}
  <text x="${W / 2}" y="1284" font-family="${F.ui}" font-weight="500" font-size="15.5" letter-spacing="2.6" fill="${C.mutd}" text-anchor="middle">${HANDLE}</text>
  `,
});

/* ---- 04 · Dining — arch-masked photo, editorial ---- */
posts.push({
  name: "04-dining-season",
  caption: "Dinner party season is officially open.\nThe Shalimar Dining Table — eight seats, one hundred years of dinners. PKR 285,000 (was 320,000).\n#DiningRoom #DinnerParty #CrescentFurniture #HomePK",
  svg: () => `
  ${defs()}
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  ${overline(72, 96, "THE DINING ROOM")}
  <text x="72" y="192" font-family="${F.display}" font-weight="400" font-size="76" fill="${C.ink}">Dinner party season</text>
  <text x="72" y="278" font-family="${F.display}" font-weight="400" font-size="76" fill="${C.ink}">is officially <tspan font-style="italic" fill="${C.terra}">open.</tspan></text>
  <g>
    <path d="M 190 1040 v -340 a 350 350 0 0 1 700 0 v 340 z" fill="${C.bone}"/>
    <clipPath id="archClip"><path d="M 206 1024 v -328 a 334 334 0 0 1 668 0 v 328 z"/></clipPath>
    <image x="206" y="356" width="668" height="668" preserveAspectRatio="xMidYMid slice" clip-path="url(#archClip)" xlink:href="data:image/jpeg;base64,${photoB64("04-diningroom", 668, 668)}"/>
    <path d="M 190 1040 v -340 a 350 350 0 0 1 700 0 v 340 z" fill="none" stroke="${C.line2}" stroke-width="1.6"/>
  </g>
  <text x="72" y="1120" font-family="${F.display}" font-weight="500" font-size="36" fill="${C.ink}">The Shalimar Dining Table</text>
  <text x="72" y="1160" font-family="${F.body}" font-weight="300" font-size="23" fill="${C.inkSoft}">Solid sheesham, brass pins. Eight seats, a hundred years of dinners.</text>
  <text x="72" y="1228" font-family="${F.display}" font-weight="500" font-size="42" font-style="italic" fill="${C.terra}">PKR 285,000  <tspan font-size="26" fill="${C.mute}" text-decoration="line-through">320,000</tspan></text>
  ${brandFoot("light", H - 34)}
  `,
});

/* ---- 05 · Desk — floating paper card over photo ---- */
posts.push({
  name: "05-wfh-desk",
  caption: "The work-from-home upgrade.\nThe Crescent Writing Desk — two drawers that close with one hand. PKR 79,000.\n#WFH #HomeOffice #DeskGoals #CrescentFurniture #Pakistan",
  svg: () => `
  ${defs()}
  ${img("05-desk", 0, 0, W, 1236)}
  <rect x="0" y="1236" width="${W}" height="114" fill="${C.paper}"/>
  <g>
    <rect x="64" y="742" width="952" height="452" fill="${C.paper}"/>
    <rect x="64" y="742" width="952" height="452" fill="none" stroke="${C.line2}" stroke-width="1.4"/>
    ${overline(120, 830, "OFFICE and STUDY")}
    <text x="120" y="918" font-family="${F.display}" font-weight="400" font-size="66" fill="${C.ink}">The work-from-home</text>
    <text x="120" y="992" font-family="${F.display}" font-weight="400" font-size="66" fill="${C.ink}">upgrade. <tspan font-style="italic" fill="${C.terra}">Finally.</tspan></text>
    <text x="120" y="1052" font-family="${F.body}" font-weight="300" font-size="23.5" fill="${C.inkSoft}">The Crescent Writing Desk — two drawers that close</text>
    <text x="120" y="1088" font-family="${F.body}" font-weight="300" font-size="23.5" fill="${C.inkSoft}">with one hand. Cable cutouts included. Excuses, gone.</text>
    <text x="120" y="1172" font-family="${F.display}" font-weight="500" font-size="44" font-style="italic" fill="${C.terra}">PKR 79,000</text>
    ${rule(120, 1196, 360, C.line2)}
  </g>
  <text x="120" y="1300" font-family="${F.ui}" font-weight="500" font-size="15.5" letter-spacing="2.4" fill="${C.inkSoft}">DELIVERED AND ASSEMBLED · RAWALPINDI / ISLAMABAD</text>
  ${wordmark(W - 120, 1300, 24, C.ink, "end")}
  `,
});

/* ---- 06 · Sale — terracotta slab, big numeral, type-led ---- */
posts.push({
  name: "06-sale-week",
  caption: "Flat 10% off. This week only.\nCherat Nightstand, Faizabad Centre Table, Shalimar Dining Table — while they last.\n#Sale #FurnitureSale #CrescentFurniture #Rawalpindi #Islamabad",
  svg: () => `
  <rect width="${W}" height="${H}" fill="${C.terra}"/>
  ${overline(72, 128, "THE WEEKEND CLEAROUT", C.cream, "start", 8)}
  <text x="72" y="330" font-family="${F.display}" font-weight="600" font-size="220" fill="${C.cream}">10%</text>
  <text x="72" y="424" font-family="${F.display}" font-weight="400" font-style="italic" font-size="64" fill="${C.espresso}">off, flat. This week only.</text>
  ${rule(72, 496, W - 72, "rgba(35,27,20,0.35)")}
  ${[
    ["The Cherat Nightstand", "39,000", "34,000"],
    ["The Faizabad Centre Table", "74,000", "62,000"],
    ["The Shalimar Dining Table", "320,000", "285,000"],
  ].map(([n, was, now], i) => `
    <text x="72" y="${596 + i * 118}" font-family="${F.display}" font-weight="500" font-size="40" fill="${C.cream}">${n}</text>
    <text x="72" y="${644 + i * 118}" font-family="${F.ui}" font-weight="600" font-size="26" fill="${C.espresso}">NOW PKR ${now}  <tspan fill="rgba(35,27,20,0.55)" font-weight="500">was ${was}</tspan></text>
    <line x1="72" y1="${668 + i * 118}" x2="${W - 72}" y2="${668 + i * 118}" stroke="rgba(248,245,238,0.28)" stroke-width="1.2"/>
  `).join("")}
  ${chip(72, 1024, 258, 54, "WHATSAPP TO CLAIM", C.terra, C.cream, C.cream)}
  <text x="72" y="1128" font-family="${F.body}" font-weight="300" font-size="21" fill="rgba(35,27,20,0.72)">Prices straight on the tags. No codes, no fine print.</text>
  ${rule(72, 1240, W - 72, "rgba(35,27,20,0.35)")}
  <text x="72" y="1288" font-family="${F.logo}" font-size="20" letter-spacing="7" fill="${C.cream}">CRESCENT</text>
  <text x="${W - 72}" y="1288" font-family="${F.ui}" font-weight="500" font-size="15" letter-spacing="2.4" fill="rgba(35,27,20,0.6)" text-anchor="end">${HANDLE}</text>
  `,
});

/* ---- 07 · Material manifesto — macro wood, top espresso band ---- */
posts.push({
  name: "07-solid-sheesham",
  caption: "Solid sheesham. No shortcuts.\nIf it says solid wood, it is solid wood — not a photograph of it.\n#SolidWood #Sheesham #FurnitureFacts #CrescentFurniture",
  svg: () => `
  ${defs()}
  <rect width="${W}" height="${H}" fill="${C.espresso}"/>
  ${img("07-material", 0, 0, W, H, 4800)}
  <rect x="0" y="0" width="${W}" height="420" fill="url(#gTop${C.espressoDeep.slice(1)})" opacity="0.9"/>
  ${overline(W / 2, 120, "FIELD NOTE Nº 03", C.terra, "middle", 8)}
  <text x="${W / 2}" y="226" font-family="${F.display}" font-weight="400" font-size="78" fill="${C.cream}" text-anchor="middle">Solid sheesham.</text>
  <text x="${W / 2}" y="316" font-family="${F.display}" font-weight="400" font-style="italic" font-size="78" fill="${C.terra}" text-anchor="middle">No shortcuts.</text>
  ${rule(W / 2 - 70, 366, W / 2 + 70, C.creamLine)}
  <rect x="0" y="${H - 250}" width="${W}" height="250" fill="url(#gBottom${C.espressoDeep.slice(1)})"/>
  <text x="72" y="${H - 138}" font-family="${F.body}" font-weight="300" font-size="24" fill="${C.mutd}">Every table, bed and door in the shop is the real</text>
  <text x="72" y="${H - 100}" font-family="${F.body}" font-weight="300" font-size="24" fill="${C.mutd}">thing — come read the grain yourself.</text>
  <text x="${W - 72}" y="${H - 92}" font-family="${F.logo}" font-size="22" letter-spacing="7" fill="${C.cream}" text-anchor="end">CRESCENT</text>
  `,
});

/* ---- 08 · Quote post — armchair personality, paper top band ---- */
posts.push({
  name: "08-gulberg-quote",
  caption: "“A chair you negotiate for at family gatherings.”\nThe Gulberg Armchair — PKR 88,000. May the best sitter win.\n#HomeDecor #LivingRoom #CrescentFurniture #FunnyHome",
  svg: () => `
  ${defs()}
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  ${img("08-armchair", 0, 420, W, 930)}
  <rect x="0" y="0" width="${W}" height="420" fill="${C.paper}"/>
  <text x="72" y="216" font-family="${F.display}" font-weight="400" font-size="150" fill="${C.terra}">“</text>
  <text x="150" y="196" font-family="${F.body}" font-weight="300" font-style="italic" font-size="42" fill="${C.ink}">A chair you negotiate for</text>
  <text x="150" y="252" font-family="${F.body}" font-weight="300" font-style="italic" font-size="42" fill="${C.ink}">at family gatherings.</text>
  <text x="150" y="318" font-family="${F.ui}" font-weight="600" font-size="17" letter-spacing="5" fill="${C.terra}">— EVERY HOUSEHOLD, EVENTUALLY</text>
  ${rule(72, 386, W - 72, C.line2)}
  <rect x="60" y="446" width="392" height="50" fill="${C.paper}"/>
  ${overline(84, 478, "THE GULBERG ARMCHAIR", C.terra, "start")}
  <text x="72" y="1288" font-family="${F.display}" font-weight="500" font-size="46" fill="${C.cream}">PKR 88,000 — may the best sitter win.</text>
  `,
});

/* ---- 09 · Details triptych — three stacked macro crops ---- */
posts.push({
  name: "09-zoom-in-details",
  caption: "Zoom in. We'll wait.\nDovetail drawers, hand-rubbed finishes, brass that ages well. The details are the furniture.\n#Details #Craft #WoodGrain #CrescentFurniture",
  svg: () => `
  ${defs()}
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  ${overline(72, 116, "THE DETAILS ARE THE FURNITURE")}
  <text x="72" y="204" font-family="${F.display}" font-weight="400" font-size="84" fill="${C.ink}">Zoom in. <tspan font-style="italic" fill="${C.terra}">We'll wait.</tspan></text>
  ${[
    ["09-details", "HAND WORKED SURFACES"],
    ["13-craft-texture", "REAL TOOLS, REAL DUST"],
    ["17-dining-detail", "TABLES BUILT TO BE USED"],
  ].map(([key, label], i) => {
    const y = 268 + i * 330;
    return `
    ${img(key, 72, y, 936, 292)}
    <rect x="72" y="${y}" width="936" height="292" fill="none" stroke="${C.line2}" stroke-width="1.4"/>
    <rect x="72" y="${y + 244}" width="352" height="48" fill="${C.paper}"/>
    <text x="96" y="${y + 276}" font-family="${F.ui}" font-weight="600" font-size="16.5" letter-spacing="4" fill="${C.ink}">${label}</text>`;
  }).join("")}
  ${brandFoot("light", H - 26)}
  `,
});

/* ---- 10 · Wardrobe asymmetric split ---- */
posts.push({
  name: "10-nine-drawers",
  caption: "Nine drawers of order.\nThe Heirloom Dresser — rosewood, hand-cut dovetails. Chaos, meet your match. PKR 118,000.\n#StorageGoals #Bedroom #CrescentFurniture #Declutter",
  svg: () => `
  ${defs()}
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  ${img("10-wardrobe", 560, 0, 520, H)}
  <rect x="560" y="0" width="520" height="${H}" fill="none" stroke="${C.line}" stroke-width="1"/>
  ${overline(72, 128, "THE BEDROOM EDIT")}
  <text x="72" y="248" font-family="${F.display}" font-weight="400" font-size="92" fill="${C.ink}">Nine drawers</text>
  <text x="72" y="348" font-family="${F.display}" font-weight="400" font-style="italic" font-size="92" fill="${C.terra}">of order.</text>
  <text x="72" y="430" font-family="${F.body}" font-weight="300" font-size="25" fill="${C.inkSoft}">The Heirloom Dresser. Rosewood, hand-cut</text>
  <text x="72" y="468" font-family="${F.body}" font-weight="300" font-size="25" fill="${C.inkSoft}">dovetails, and a satisfying click on every</text>
  <text x="72" y="506" font-family="${F.body}" font-weight="300" font-size="25" fill="${C.inkSoft}">drawer. Chaos, consider yourself notified.</text>
  ${rule(72, 576, 420, C.line2)}
  <text x="72" y="660" font-family="${F.display}" font-weight="500" font-size="46" font-style="italic" fill="${C.ink}">PKR 118,000</text>
  ${chip(72, 706, 268, 54, "SEE IT IN STORE", C.cream, C.espresso, C.espresso)}
  <g>
    ${rule(72, 1120, 420, C.line)}
    <text x="72" y="1188" font-family="${F.display}" font-weight="400" font-size="30" fill="${C.ink}">Measure twice.</text>
    <text x="72" y="1234" font-family="${F.display}" font-weight="400" font-size="30" fill="${C.ink}">Order once.</text>
  </g>
  ${wordmark(72, 1300, 24, C.ink)}
  `,
});

/* ---- 11 · Bigger sofa — playful, friends photo ---- */
posts.push({
  name: "11-bigger-sofa",
  caption: "The “we need a bigger sofa” conversation ends here.\nThe Attok Three-Seat — PKR 165,000. Tag your co-negotiator.\n#LivingRoom #TagAFriend #CrescentFurniture #HomePK",
  svg: () => `
  ${defs()}
  ${img("11-friends", 0, 0, W, H)}
  ${scrimBottom(700, C.espressoDeep)}
  <rect x="62" y="838" width="440" height="50" fill="${C.espressoDeep}" opacity="0.92"/>
  ${overline(86, 870, "A PUBLIC SERVICE ANNOUNCEMENT", C.terra, "start")}
  <text x="72" y="966" font-family="${F.display}" font-weight="400" font-size="66" fill="${C.cream}">The “we need a bigger</text>
  <text x="72" y="1040" font-family="${F.display}" font-weight="400" font-size="66" fill="${C.cream}">sofa” conversation</text>
  <text x="72" y="1114" font-family="${F.display}" font-weight="400" font-style="italic" font-size="66" fill="${C.terra}">ends here.</text>
  <text x="72" y="1180" font-family="${F.body}" font-weight="300" font-size="24" fill="${C.mutd}">The Attok Three-Seat. Room for three, comfort for all —</text>
  <text x="72" y="1216" font-family="${F.body}" font-weight="300" font-size="24" fill="${C.mutd}">high-resilience foam, kiln-dried frame. PKR 165,000.</text>
  <text x="72" y="1290" font-family="${F.ui}" font-weight="600" font-size="18" letter-spacing="4" fill="${C.cream}">TAG YOUR CO-NEGOTIATOR →</text>
  ${wordmark(W - 72, 1290, 24, C.cream, "end")}
  `,
});

/* ---- 12 · Lighting mood — lamp glow, centered whisper ---- */
posts.push({
  name: "12-lights-low",
  caption: "Lights low. Standards high.\nThe Lighting Room has landed — lamps that finish the room. From PKR 12,500.\n#Lighting #MoodLighting #CrescentFurniture #InteriorPK",
  svg: () => `
  ${defs()}
  ${img("12-lamp", 0, 0, W, H, 4600)}
  <rect width="${W}" height="${H}" fill="rgba(25,16,8,0.40)"/>
  ${scrimBottom(420, C.espressoDeep)}
  ${overline(W / 2, 928, "THE LIGHTING ROOM", C.terra, "middle", 9)}
  <text x="${W / 2}" y="1024" font-family="${F.display}" font-weight="400" font-size="86" fill="${C.cream}" text-anchor="middle">Lights low.</text>
  <text x="${W / 2}" y="1116" font-family="${F.display}" font-weight="400" font-style="italic" font-size="86" fill="${C.terra}" text-anchor="middle">Standards high.</text>
  ${rule(W / 2 - 60, 1162, W / 2 + 60, C.creamLine)}
  <text x="${W / 2}" y="1210" font-family="${F.body}" font-weight="300" font-size="24" fill="${C.mutd}" text-anchor="middle">Lamps that finish the room — from PKR 12,500.</text>
  ${wordmark(W / 2, 1272, 26, C.cream, "middle")}
  `,
});

/* ---- 13 · Numbers / trust — type-led, terracotta numerals ---- */
posts.push({
  name: "13-why-crescent",
  caption: "Why people keep coming back.\nFamily-run since 1998. Solid wood only. Delivered across Rawalpindi and Islamabad.\n#CrescentFurniture #Trust #FurniturePK #FamilyBusiness",
  svg: () => `
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  ${overline(72, 130, "WHY PEOPLE KEEP COMING BACK")}
  ${[
    ["1998", "Family-run since. The same family,\nthe same Murree Road address."],
    ["100%", "Solid wood and real hardware.\nNo particle board pretending."],
    ["2", "Cities delivered — Rawalpindi and\nIslamabad, assembly included."],
  ].map(([num, desc], i) => {
    const y = 320 + i * 300;
    return `
    <text x="72" y="${y + 120}" font-family="${F.display}" font-weight="600" font-size="150" fill="${C.terra}">${num}</text>
    ${rule(420, y + 66, W - 72, C.line2)}
    ${wrapped(desc.split("\n"), 452, y + 108, 38, F.body, 23.5, 300, C.inkSoft)}`;
  }).join("")}
  ${rule(72, 1218, W - 72, C.line2)}
  <text x="72" y="1286" font-family="${F.logo}" font-size="20" letter-spacing="7" fill="${C.ink}">CRESCENT</text>
  <text x="${W - 72}" y="1286" font-family="${F.ui}" font-weight="500" font-size="15" letter-spacing="2.4" fill="${C.mute}" text-anchor="end">${HANDLE}</text>
  `,
});

/* ---- 14 · Visit us — showroom photo + info card ---- */
posts.push({
  name: "14-come-sit-on-it",
  caption: "Come sit on it. Seriously.\nPhotos are honest, cushions are honest-er. Open daily 10–8, Murree Road, Rawalpindi. Chai on the house.\n#VisitUs #Showroom #CrescentFurniture #Rawalpindi",
  svg: () => `
  ${defs()}
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  ${img("14-showroom", 0, 0, W, 700)}
  <rect x="0" y="700" width="${W}" height="1.5" fill="${C.line2}"/>
  ${overline(72, 790, "THE SHOWROOM · MURREE ROAD")}
  <text x="72" y="888" font-family="${F.display}" font-weight="400" font-size="92" fill="${C.ink}">Come sit on it.</text>
  <text x="72" y="960" font-family="${F.display}" font-weight="400" font-style="italic" font-size="56" fill="${C.terra}">Seriously. That's the whole ad.</text>
  <text x="72" y="1030" font-family="${F.body}" font-weight="300" font-size="24" fill="${C.inkSoft}">Open daily, 10am – 8pm. Furniture Market, Murree Road, Rawalpindi.</text>
  ${[
    ["DIRECTIONS ON GOOGLE MAPS", 72, 462],
    ["WHATSAPP 0311 8550000", 562, 372],
  ].map(([t, x, w]) => chip(x, 1080, w, 56, t, C.cream, C.espresso, C.espresso)).join("")}
  <text x="72" y="1196" font-family="${F.body}" font-weight="300" font-size="21" font-style="italic" fill="${C.mute}">Chai on the house. Opinions on request.</text>
  ${brandFoot("light", H - 40)}
  `,
});

/* ---- 15 · Jinnah Super King — dark luxury full bleed ---- */
posts.push({
  name: "15-jinnah-king-bed",
  caption: "The whole room, anchored.\nThe Jinnah Super King Bed — PKR 289,000 (was 315,000). Big beds for big rest.\n#LuxuryBedroom #KingBed #CrescentFurniture #BedroomDesign",
  svg: () => `
  ${defs()}
  ${img("15-bed", 0, 0, W, H)}
  ${scrimBottom(680, C.espressoDeep)}
  ${scrimBottom(300, C.espressoDeep, 1, 0)}
  ${overline(72, 128, "STATEMENT PIECES", C.terra, "start")}
  <text x="72" y="880" font-family="${F.display}" font-weight="400" font-size="90" fill="${C.cream}">The whole room,</text>
  <text x="72" y="976" font-family="${F.display}" font-weight="400" font-style="italic" font-size="90" fill="${C.terra}">anchored.</text>
  <text x="72" y="1052" font-family="${F.body}" font-weight="300" font-size="25" fill="${C.mutd}">The Jinnah Super King Bed. Big beds for big rest —</text>
  <text x="72" y="1090" font-family="${F.body}" font-weight="300" font-size="25" fill="${C.mutd}">solid frame, upholstered headboard, zero creak policy.</text>
  <text x="72" y="1174" font-family="${F.display}" font-weight="500" font-size="46" font-style="italic" fill="${C.cream}">PKR 289,000  <tspan font-size="28" fill="${C.mutd}" text-decoration="line-through">315,000</tspan></text>
  ${rule(72, 1212, 380, C.creamLine)}
  <text x="72" y="1266" font-family="${F.ui}" font-weight="500" font-size="16" letter-spacing="2.6" fill="${C.mutd}">SEE IT ON THE FLOOR · MURREE ROAD, RAWALPINDI</text>
  ${wordmark(W - 72, 1266, 24, C.cream, "end")}
  `,
});

/* ================================ build ================================ */
mkdirSync("social/posts", { recursive: true });
mkdirSync("social/png", { recursive: true });

const report = [];
for (const p of posts) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  ${p.svg().trim()}
</svg>`;
  const svgPath = `social/posts/${p.name}.svg`;
  const pngPath = `social/png/${p.name}.png`;
  writeFileSync(svgPath, svg);
  execSync(`ffmpeg -y -loglevel error -i "${svgPath}" -vf scale=1080:1350 "${pngPath}"`);
  const kb = Math.round(statSync(pngPath).size / 1024);
  report.push({ name: p.name, png: pngPath, kb, caption: p.caption });
  console.log(`✓ ${p.name}.png  ${kb} KB`);
}

/* contact sheet 3×5 */
execSync(`python3 social/sheet.py`, { stdio: "inherit" });
writeFileSync("social/report.json", JSON.stringify(report, null, 2));
console.log(`\n${report.length} posts built → social/png/`);
