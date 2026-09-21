import { MongoClient } from "mongodb";
const c = new MongoClient(process.env.MONGODB_URI!);
await c.connect();
const db = c.db(process.env.MONGODB_DB || "crescent");
const cats = await db.collection("categories").find({}).toArray();
console.log(JSON.stringify(cats.map(x => ({ slug: x.slug, image: x.image?.slice(0, 70) ?? null, active: x.active })), null, 1));
await c.close();
