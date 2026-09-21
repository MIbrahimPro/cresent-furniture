/**
 * Seeds MongoDB with categories + products from data/catalog*.json.
 * Image tokens like "pexels:wooden-desk" are resolved to real Pexels photo URLs
 * and cached in data/pexels-cache.json so repeat runs stay fast.
 *
 * Usage: npm run seed
 */
import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "data", "pexels-cache.json");

type Cache = Record<string, { url: string; credit: string }>;

function loadCache(): Cache {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache: Cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

async function pexelsSearch(query: string, key: string): Promise<{ url: string; credit: string }[]> {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape`,
    { headers: { Authorization: key } },
  );
  if (!res.ok) throw new Error(`Pexels search failed for "${query}": ${res.status}`);
  const data = await res.json();
  return (data.photos ?? []).map((p: any) => ({
    url: p.src?.large2x || p.src?.large,
    credit: `Photo by ${p.photographer} on Pexels`,
  }));
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }
  const pexelsKey = process.env.PEXELS_API;
  if (!pexelsKey) {
    console.error("PEXELS_API is not set.");
    process.exit(1);
  }

  // Load catalog parts
  const dir = path.join(process.cwd(), "data");
  const files = fs.readdirSync(dir).filter((f) => f.startsWith("catalog") && f.endsWith(".json"));
  const categories: any[] = [];
  const products: any[] = [];
  for (const f of files) {
    const json = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    categories.push(...(json.categories ?? []));
    products.push(...(json.products ?? []));
  }
  console.log(`Loaded ${categories.length} categories, ${products.length} products from ${files.length} file(s)`);

  // Resolve pexels: image tokens
  const queries: Record<string, string> = JSON.parse(
    fs.readFileSync(path.join(dir, "pexels-queries.json"), "utf8"),
  );
  const cache = loadCache();
  const needed = new Set<string>();
  for (const p of products) {
    for (const img of p.images ?? []) {
      if (img.startsWith("pexels:")) needed.add(img.slice(7));
    }
  }

  console.log(`Resolving ${needed.size} image tokens via Pexels...`);
  const pools: Record<string, { url: string; credit: string }[]> = {};
  let done = 0;
  for (const token of needed) {
    if (cache[token]) {
      pools[token] = [cache[token]];
      continue;
    }
    const query = queries[token];
    if (!query) {
      console.warn(`  ! no query for token "${token}"`);
      continue;
    }
    try {
      const results = await pexelsSearch(query, pexelsKey);
      if (results.length) {
        pools[token] = results;
        cache[token] = results[0];
        console.log(`  ✓ ${token} (${done++ + 1}/${needed.size})`);
      } else {
        console.warn(`  ! no results for "${query}"`);
      }
    } catch (e: any) {
      console.warn(`  ! ${token}: ${e.message}`);
    }
    // Stay well under Pexels rate limits
    await new Promise((r) => setTimeout(r, 250));
  }
  saveCache(cache);

  // Assign distinct images per product where possible
  const poolCursor: Record<string, number> = {};
  function resolve(img: string): string {
    if (!img.startsWith("pexels:")) return img;
    const token = img.slice(7);
    const pool = pools[token];
    if (!pool?.length) return "/crescent-logo-light-2000.png";
    const i = poolCursor[token] ?? 0;
    poolCursor[token] = (i + 1) % pool.length;
    return pool[i].url;
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || undefined);

  // Upsert categories
  for (const c of categories) {
    await db.collection("categories").updateOne(
      { slug: c.slug },
      { $set: { ...c, active: true, createdAt: new Date() } },
      { upsert: true },
    );
  }
  console.log(`✓ ${categories.length} categories upserted`);

  // Upsert products
  for (const p of products) {
    const images = (p.images ?? []).map(resolve);
    await db.collection("products").updateOne(
      { slug: p.slug },
      {
        $set: {
          ...p,
          images,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
  }
  console.log(`✓ ${products.length} products upserted`);

  // Default hero media: 3 Pexels workshop videos
  const heroQueries = ["furniture workshop", "woodworking", "carpentry wood"];
  const hero: any[] = [];
  for (const q of heroQueries) {
    try {
      const res = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=3&orientation=landscape`,
        { headers: { Authorization: pexelsKey } },
      );
      const data = await res.json();
      const v = (data.videos ?? [])[0];
      if (v) {
        const files = (v.video_files ?? []).filter((f: any) => (f.file_type ?? "").includes("mp4"));
        const best = files.sort(
          (a: any, b: any) => Math.abs((a.width ?? 0) - 1600) - Math.abs((b.width ?? 0) - 1600),
        )[0];
        if (best) {
          hero.push({
            id: String(v.id),
            type: "video",
            url: best.link,
            credit: `Video by ${v.user?.name ?? "Pexels"} on Pexels`,
            addedAt: new Date(),
          });
          console.log(`  ✓ hero video: ${q} -> ${v.id}`);
        }
      }
    } catch (e: any) {
      console.warn(`  ! hero video "${q}": ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  if (hero.length) {
    await db.collection<any>("settings").updateOne(
      { _id: "site" },
      { $set: { heroMedia: hero, updatedAt: new Date() } },
    );
    console.log(`✓ ${hero.length} hero videos set in settings`);
  }

  await client.close();
  console.log("Seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
