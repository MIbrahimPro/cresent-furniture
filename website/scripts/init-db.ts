/**
 * Creates indexes, the default settings doc, and the first CRM admin user.
 * Safe to run repeatedly.
 *
 * Usage: npm run init-db
 */
import { MongoClient } from "mongodb";
import crypto from "crypto";

function hashPassword(password: string, email: string): string {
  return crypto.scryptSync(password, email.toLowerCase().trim(), 64).toString("hex");
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set. Copy .env.example to .env and fill it in.");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  // Indexes
  await db.collection("products").createIndex({ slug: 1 }, { unique: true });
  await db.collection("products").createIndex({ categorySlug: 1, active: 1 });
  await db.collection("categories").createIndex({ slug: 1 }, { unique: true });
  await db.collection("orders").createIndex({ number: 1 }, { unique: true });
  await db.collection("orders").createIndex({ status: 1, createdAt: -1 });
  await db.collection("crm_users").createIndex({ email: 1 }, { unique: true });
  await db.collection("crm_media").createIndex({ id: 1 }, { unique: true });
  await db.collection("custom_pages").createIndex({ slug: 1 }, { unique: true });
  await db.collection("reviews").createIndex({ productSlug: 1, approved: 1 });

  // Settings doc
  await db.collection("settings").updateOne(
    { _id: "site" },
    {
      $setOnInsert: {
        business: {
          name: "Crescent",
          tagline: "Bespoke Furniture House",
          address: "M36M+3QH, Murree Rd, Gulistan-e-Jinnah Colony Faizabad, Rawalpindi",
          phone: "0311 8550000",
          whatsapp: "923118550000",
          hours: "Mon-Sat, 10am-8pm",
          mapUrl: "https://maps.google.com/?q=Crescent+Furniture+Faizabad+Rawalpindi",
        },
        heroMedia: [],
        offerBanner: null,
        shippingNote:
          "Delivery across Islamabad & Rawalpindi included. Final pricing confirmed on commission.",
        announcement: "",
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  // First CRM admin (from env, or a local default you should change)
  const email = process.env.CRM_ADMIN_EMAIL || "owner@crescent.local";
  const password = process.env.CRM_ADMIN_PASSWORD || "crescent-admin";
  const name = process.env.CRM_ADMIN_NAME || "Owner";

  await db.collection("crm_users").updateOne(
    { email: email.toLowerCase() },
    {
      $setOnInsert: {
        name,
        email: email.toLowerCase(),
        passwordHash: hashPassword(password, email),
        role: "owner",
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );

  console.log(`✓ Indexes created`);
  console.log(`✓ Settings doc ready`);
  console.log(`✓ Admin ready: ${email} / ${password} (change this!)`);
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
