/**
 * Downloads curated Pexels photos for each social post direction.
 * Usage: node fetch-photos.mjs   (needs website/.env PEXELS_API)
 * Writes social/photos/<key>.jpg + social/photos/manifest.json
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import https from "node:https";

const env = Object.fromEntries(
  readFileSync("website/.env", "utf8").split("\n").filter((l) => l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const KEY = env.PEXELS_API;
if (!KEY) { console.error("No PEXELS_API in website/.env"); process.exit(1); }

// One query per post direction — all portrait, matched to the post concept
const QUERIES = {
  "01-sideboard":   "dark wood sideboard cabinet interior",
  "02-bedroom":     "moody bedroom wooden bed morning light",
  "03-workshop":    "carpenter workshop wood shavings hands",
  "04-diningroom":  "elegant dining room wooden table warm",
  "05-desk":        "wooden desk workspace lamp interior",
  "06-sofa":        "cozy living room sofa neutral tones",
  "07-material":    "wood grain texture close up",
  "08-armchair":    "reading corner armchair window light",
  "09-details":     "wood carving furniture detail",
  "10-wardrobe":    "minimal bedroom wardrobe wood",
  "11-friends":     "friends laughing living room home",
  "12-lamp":        "warm lamp glow dark interior",
  "13-craft-texture": "woodworking tools wood surface",
  "14-showroom":    "furniture store showroom interior",
  "15-bed":         "luxury bedroom wooden headboard",
  "16-cushions":    "sofa cushions detail styling",
  "17-dining-detail": "table setting dining plates",
  "18-shelf":       "bookshelf books interior detail",
};

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(get(res.headers.location, headers));
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    }).on("error", reject);
  });
}

async function search(q) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=8&orientation=portrait`;
  const { status, body } = await get(url, { Authorization: KEY });
  if (status !== 200) throw new Error(`search ${status} for ${q}`);
  const data = JSON.parse(body.toString());
  return data.photos ?? [];
}

mkdirSync("social/photos", { recursive: true });
const manifest = {};

for (const [key, q] of Object.entries(QUERIES)) {
  const out = `social/photos/${key}.jpg`;
  if (existsSync(out) && existsSync("social/photos/manifest.json")) {
    try {
      const prev = JSON.parse(readFileSync("social/photos/manifest.json", "utf8"));
      if (prev[key]) { manifest[key] = prev[key]; continue; }
    } catch { /* refetch */ }
  }
  try {
    const photos = await search(q);
    if (!photos.length) { console.log(`× no results: ${key}`); continue; }
    // Prefer tall images with high quality; take the first good one
    const pick = photos.find((p) => p.height >= p.width) ?? photos[0];
    const src = pick.src?.large2x ?? pick.src?.large ?? pick.src?.portrait;
    const img = await get(src);
    if (img.status !== 200) { console.log(`× download ${img.status}: ${key}`); continue; }
    writeFileSync(out, img.body);
    manifest[key] = {
      query: q,
      pexelsId: pick.id,
      photographer: pick.photographer,
      pexelsUrl: pick.url,
      avgColor: pick.avg_color,
      w: pick.width, h: pick.height,
    };
    console.log(`✓ ${key}  #${pick.id}  ${pick.width}×${pick.height}  by ${pick.photographer}`);
  } catch (e) {
    console.log(`× ${key}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 350)); // be polite to the API
}

writeFileSync("social/photos/manifest.json", JSON.stringify(manifest, null, 2));
console.log(`\n${Object.keys(manifest).length}/${Object.keys(QUERIES).length} photos downloaded`);
