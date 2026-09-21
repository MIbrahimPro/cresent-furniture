import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { getActiveCategories, getFeaturedProducts } from "@/lib/catalog";
import { HeroVideo } from "@/components/HeroVideo";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { NewsletterForm } from "@/components/NewsletterForm";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

const TESTIMONIALS = [
  {
    quote:
      "The dining table we commissioned is without question the finest piece of furniture in our home.",
    name: "Ahmed K.",
    city: "Islamabad",
    piece: "The Shalimar Dining Table",
  },
  {
    quote: "Crescent built exactly what we imagined. The craftsmanship is extraordinary.",
    name: "Sara M.",
    city: "Rawalpindi",
    piece: "The Kashmir Bed Frame",
  },
  {
    quote: "The wardrobe they made for us is a work of art. Forty years from now it will still be standing.",
    name: "Fatima R.",
    city: "Islamabad",
    piece: "The Margalla Wardrobe",
  },
  {
    quote: "From the first conversation to the final delivery — a flawless experience.",
    name: "Bilal H.",
    city: "Karachi",
    piece: "Bespoke Office Commission",
  },
];

export default async function HomePage() {
  const [settings, categories] = await Promise.all([getSettings(), getActiveCategories()]);
  let featured: Product[] = [];
  try {
    featured = await getFeaturedProducts(8);
  } catch {
    // DB unreachable — the hero and story sections still render
  }

  return (
    <>
      {/* Hero: background video with dark overlay + heading (media managed in CRM) */}
      <HeroVideo media={settings.heroMedia} />

      {/* Categories */}
      <section className="container-c py-20">
        <Reveal>
          <div className="text-center">
            <p className="overline-c text-terra">The Collection</p>
            <h2 className="display-c mt-4 text-[30px] sm:text-[34px]">Made for how you live</h2>
            <hr className="hr-coral mx-auto mt-6" />
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 60}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="card-c group relative block h-56"
              >
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : null}
                <div className="absolute inset-0 bg-ink/45 transition-colors group-hover:bg-ink/30" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-[20px] font-semibold uppercase tracking-[0.08em] text-cream">
                    {c.name}
                  </h3>
                  <p className="mt-1 font-display text-[11px] uppercase tracking-[0.22em] text-terra">
                    Explore →
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={categories.length * 60}>
            <Link href="/bespoke" className="card-c group relative block h-56 bg-ink">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
                <p className="overline-c text-terra">Made to order</p>
                <h3 className="font-display text-[20px] font-semibold uppercase tracking-[0.08em] text-cream">
                  Your vision. Our craft.
                </h3>
                <p className="font-display text-[11px] uppercase tracking-[0.22em] text-terra">
                  Start a commission →
                </p>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-walnut-2 py-20">
        <div className="container-c">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="overline-c text-terra">Featured</p>
                <h2 className="display-c mt-4 text-[30px] sm:text-[34px]">The workshop's best</h2>
              </div>
              <Link href="/shop" className="btn btn-secondary">
                View all furniture
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={String(p._id)} delay={(i % 4) * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container-c py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="overline-c text-terra">Our Promise</p>
              <h2 className="display-c mt-4 text-[30px] sm:text-[34px]">
                Pakistani craft. Global standard.
              </h2>
              <p className="mt-6 text-[18px] leading-relaxed text-sand/90">
                We are proud of where we are from. For over four decades, Crescent has proved that
                the finest handcrafted furniture in the world does not have to come from Europe. It
                can come from Rawalpindi.
              </p>
              <p className="mt-4 text-[18px] leading-relaxed text-sand/90">
                Every joint is cut by hand. Every board is seasoned before it is shaped. Nothing
                leaves the workshop until it deserves the name on the door.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-6">
                <Stat value="100%" label="Hand crafted" />
                <Stat value="45+" label="Years of mastery" />
                <Stat value="∞" label="Bespoke possibilities" />
              </div>
              <Link href="/about" className="btn btn-secondary mt-9">
                Our story
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative">
              <div className="card-c aspect-[4/5] overflow-hidden bg-walnut-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.heroMedia.find((m) => m.type === "image")?.url ?? "/crescent-logo-light-2000.png"}
                  alt="Inside the Crescent workshop"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 hidden h-40 w-40 rounded-card border border-terra bg-transparent lg:block" aria-hidden />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-ink py-20">
        <div className="container-c">
          <Reveal>
            <div className="text-center">
              <p className="overline-c text-terra">Kind Words</p>
              <h2 className="display-c mt-4 text-[30px] text-cream sm:text-[34px]">
                From our clients' homes
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={(i % 2) * 80}>
                <figure className="h-full rounded-card border border-cream/15 p-7">
                  <blockquote className="text-[17px] leading-relaxed text-cream/90">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5">
                    <p className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-terra">
                      {t.name} · {t.city}
                    </p>
                    <p className="mt-1 text-[14px] italic text-cream/60">{t.piece}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-c py-20">
        <Reveal>
          <div className="mx-auto max-w-xl text-center">
            <p className="overline-c text-terra">The Workshop Letter</p>
            <h2 className="display-c mt-4 text-[26px]">News from the bench</h2>
            <p className="mt-4 text-[17px] text-sand">
              Occasional letters about new pieces, timber arrivals, and what the workshop is building.
            </p>
            <div className="flex justify-center">
              <NewsletterForm />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-[28px] font-semibold text-terra">{value}</p>
      <p className="mt-1 text-[14px] leading-snug text-sand">{label}</p>
    </div>
  );
}
