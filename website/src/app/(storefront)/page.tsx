import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { getActiveCategories, getFeaturedProducts, searchProducts } from "@/lib/catalog";
import { HeroVideo } from "@/components/HeroVideo";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { NewsletterForm } from "@/components/NewsletterForm";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/Crescent+Furniture+Murree+Road+Rawalpindi";

export default async function HomePage() {
  const [settings, categories] = await Promise.all([getSettings(), getActiveCategories()]);
  let featured: Product[] = [];
  let categoryImages: Record<string, string> = {};
  try {
    featured = await getFeaturedProducts(8);
    // Top up with the newest pieces so the grid never sits ragged
    if (featured.length < 8) {
      const seen = new Set(featured.map((p) => String(p._id)));
      const newest = await searchProducts({ sort: "newest" });
      for (const p of newest) {
        if (featured.length >= 8) break;
        if (!seen.has(String(p._id))) featured.push(p);
      }
    }
    // Category tiles fall back to their first product photo
    const all = await searchProducts({});
    for (const p of all) {
      if (p.images?.[0] && !categoryImages[p.categorySlug]) {
        categoryImages[p.categorySlug] = p.images[0];
      }
    }
  } catch {
    // DB unreachable — the hero and story sections still render
  }

  return (
    <>
      {/* Hero: background video with deep gradient scrim + heading (media managed in CRM) */}
      <HeroVideo media={settings.heroMedia} />

      {/* Wood-to-workshop marquee strip */}
      <div className="border-y border-line bg-ink/60 py-5" aria-hidden>
        <div className="container-c flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-mute">
          <span>Seasoned hardwood</span>
          <Dot />
          <span className="text-brass">Hand-cut joinery</span>
          <Dot />
          <span>Made to order</span>
          <Dot />
          <span className="text-brass">Since 1981</span>
          <Dot />
          <span>Delivered across Pakistan</span>
        </div>
      </div>

      {/* Categories — editorial mosaic */}
      <section className="container-c section-flow">
        <Reveal>
          <div className="max-w-2xl">
            <p className="overline-c">The Collection</p>
            <h2 className="display-c mt-4 text-[32px] sm:text-[42px]">
              Made for <span className="accent-i">how you live.</span>
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {categories.slice(0, 3).map((c, i) => (
            <Reveal key={c.slug} delay={i * 70} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="card-c group relative block h-full min-h-[240px] lg:min-h-0"
              >
                {c.image || categoryImages[c.slug] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.image || categoryImages[c.slug]}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-walnut-2" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/20 to-transparent transition-opacity group-hover:opacity-80" />
                <div className={`absolute inset-x-0 bottom-0 p-6 ${i === 0 ? "lg:p-8" : ""}`}>
                  <h3 className={`font-display font-medium text-cream ${i === 0 ? "text-[26px] lg:text-[32px]" : "text-[20px]"}`}>
                    {c.name}
                  </h3>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-terra">
                    Explore →
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={categories.length * 70}>
            <Link href="/bespoke" className="card-c group relative block h-full min-h-[240px] bg-walnut">
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <span className="w-fit rounded-[10px] border border-terra/40 bg-terra-veil px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-terra">
                  Made to order
                </span>
                <div>
                  <h3 className="font-display text-[22px] font-medium leading-snug text-cream">
                    Your vision.
                    <br />
                    <span className="accent-i">Our craft.</span>
                  </h3>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brass transition-colors group-hover:text-terra">
                    Start a commission →
                  </p>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-ink section-flow">
        <div className="container-c">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-xl">
                <p className="overline-c">Featured</p>
                <h2 className="display-c mt-4 text-[32px] sm:text-[42px]">
                  The workshop&rsquo;s <span className="accent-i">best.</span>
                </h2>
              </div>
              <Link href="/shop" className="btn btn-secondary">
                View all furniture
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={String(p._id)} delay={(i % 4) * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Story — the maker's seal */}
      <section className="container-c section-flow">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <div>
              <p className="overline-c">Our Promise</p>
              <h2 className="display-c mt-4 text-[32px] sm:text-[42px]">
                Pakistani craft.
                <br />
                <span className="accent-i">Global standard.</span>
              </h2>
              <p className="mt-7 max-w-lg text-[16.5px] leading-[1.8] text-sand">
                We are proud of where we are from. For over four decades, Crescent has proved that
                the finest handcrafted furniture in the world does not have to come from Europe. It
                can come from Rawalpindi.
              </p>
              <p className="mt-4 max-w-lg text-[16.5px] leading-[1.8] text-sand">
                Every joint is cut by hand. Every board is seasoned before it is shaped. Nothing
                leaves the workshop until it deserves the name on the door.
              </p>
              <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-8">
                <Stat value="100%" label="Hand crafted" />
                <Stat value="45+" label="Years of mastery" />
                <Stat value="∞" label="Bespoke possibilities" />
              </div>
              <Link href="/about" className="btn btn-ghost mt-10">
                Our story
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative mx-auto max-w-[420px]">
              {/* Emblem, displayed at a dignified size — not the full wordmark */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/crescent-emblem.svg"
                alt="The Crescent maker's seal"
                className="w-full"
                width={480}
                height={480}
              />
              {/* Warm halo behind the seal */}
              <div
                className="absolute inset-6 -z-10 rounded-full bg-terra-veil blur-3xl"
                aria-hidden
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Reviews — light slab, honest link-out to Google */}
      <section className="section-light section-flow">
        <div className="container-c">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              {/* Google "G" */}
              <svg width="44" height="44" viewBox="0 0 48 48" aria-hidden className="mx-auto">
                <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.2-3.9 6.6-9.6 6.6-16.2z" />
                <path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.2H4.2v5.7C7.9 41 15.4 46 24 46z" />
                <path fill="#FBBC05" d="M11.6 28.1c-.4-1.3-.7-2.7-.7-4.1s.3-2.8.7-4.1v-5.7H4.2C2.7 17.1 2 20.4 2 24s.7 6.9 2.2 9.8l7.4-5.7z" />
                <path fill="#EA4335" d="M24 10.8c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C35 4.3 30 2 24 2 15.4 2 7.9 7 4.2 14.2l7.4 5.7c1.7-5.3 6.6-9.1 12.4-9.1z" />
              </svg>
              <p className="overline-c mt-6">Reviewed on Google</p>
              <h2 className="display-c mt-4 text-[32px] sm:text-[42px]">
                The word on <span className="accent-i">the street.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-[16px] leading-[1.8] text-espresso">
                Our customers share their experiences on Google — the workshop, the finishing,
                the delivery. Read what they say, and add your own words after your visit.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={GOOGLE_REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-dark"
                >
                  Read reviews on Google
                </a>
                <a
                  href={GOOGLE_REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost border-espresso/40 text-espresso hover:bg-espresso/10"
                >
                  Write a review
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-c section-flow">
        <Reveal>
          <div className="panel-c relative mx-auto max-w-3xl overflow-hidden p-10 text-center sm:p-14">
            {/* soft glow accents */}
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-terra-veil blur-3xl" aria-hidden />
            <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-terra-veil blur-3xl" aria-hidden />
            <div className="relative">
              <p className="overline-c">The Workshop Letter</p>
              <h2 className="display-c mt-4 text-[28px] sm:text-[34px]">
                News from <span className="accent-i">the bench.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15.5px] leading-relaxed text-sand">
                Occasional letters about new pieces, timber arrivals, and what the workshop is
                building.
              </p>
              <div className="mt-8 flex justify-center">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Dot() {
  return <span className="text-terra/60">✦</span>;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-[30px] font-medium text-cream">
        {value}
      </p>
      <p className="mt-1 text-[13px] leading-snug text-mute">{label}</p>
    </div>
  );
}
