/**
 * Upserts the sample "Offer Deals" page as an UNPUBLISHED draft so it can be
 * previewed from the CRM (Pages -> Edit, or Pages -> View) without appearing
 * on the storefront or in its navigation.
 * Safe to run repeatedly.
 *
 * Usage: npm run seed-offer-page
 */
import { MongoClient } from "mongodb";

const SLUG = "offer-deals";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "crescent");

  // Real seeded products, pulled live so prices/images stay accurate
  const products = await db
    .collection("products")
    .find({ slug: { $in: ["shalimar-dining-table", "faizabad-centre-table", "cherat-nightstand", "gulberg-armchair"] } })
    .toArray();

  const bySlug = new Map(products.map((p: any) => [p.slug, p]));
  function offer(slug: string, badge: string, comparePrice: number, description: string) {
    const p = bySlug.get(slug);
    return {
      title: p?.name ?? slug,
      description,
      image: p?.images?.[0],
      price: p?.price,
      comparePrice,
      href: `/product/${slug}`,
      badge,
    };
  }

  const page = {
    slug: SLUG,
    title: "Offer Deals",
    intro:
      "Seasonal offers from the workshop. These prices hold while the timber lasts — each piece is still made to order, just at a kinder number for a short while.",
    published: false,
    showInNav: false,
    navOrder: 10,
    sections: [
      {
        type: "offer-grid",
        heading: "This month at the workshop",
        intro:
          "Four pieces from the main collection, priced for the season. Final pricing is confirmed on commission.",
        offers: [
          offer("shalimar-dining-table", "Save 35,000", 320000, "Eight seats of solid sheesham, drawn from a single seasoned plank."),
          offer("faizabad-centre-table", "Save 12,000", 74000, "The low table for long evenings — walnut or natural teak."),
          offer("cherat-nightstand", "Save 5,000", 39000, "One dovetailed drawer, one shelf, no clutter."),
          offer("gulberg-armchair", "Free delivery", 92000, "Deep-cushioned and sprung with jute webbing the old way."),
        ],
      },
      {
        type: "rich-text",
        heading: "How offers work",
        body:
          "Every offer above is a real piece from the collection, made to order in the usual way — nothing is rushed or downgraded to hit a price.\n\nWhen you commission through WhatsApp, mention the offer you saw and the workshop will confirm the price in writing before any deposit.",
      },
      {
        type: "banner",
        text: "Commission two pieces in one month and the delivery is on us.",
        href: "/bespoke",
        label: "Start a commission",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection("custom_pages").updateOne(
    { slug: SLUG },
    { $set: page },
    { upsert: true },
  );

  console.log(`✓ Draft page "${SLUG}" upserted (published: false, in navigation: false)`);
  console.log("  Preview it from the CRM: Pages -> Offer Deals -> Edit (or View once published).");
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
