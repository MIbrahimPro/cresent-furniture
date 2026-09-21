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
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.image}
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
                <span className="w-fit rounded-full border border-terra/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-terra">
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

      {/* Testimonials */}
      <section className="bg-ink section-flow">
        <div className="container-c">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="overline-c">Kind Words</p>
              <h2 className="display-c mt-4 text-[32px] sm:text-[42px]">
                From our <span className="accent-i">clients&rsquo; homes.</span>
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 columns-1 gap-5 md:columns-2 [&>*]:mb-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={(i % 2) * 80} className="break-inside-avoid">
                <figure className="panel-c p-8">
                  <span className="font-display text-[44px] leading-none text-terra/60" aria-hidden>“</span>
                  <blockquote className="-mt-4 text-[16px] leading-[1.75] text-sand">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-line pt-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cream">
                      {t.name} · {t.city}
                    </p>
                    <p className="mt-1.5 text-[13.5px] italic text-mute">{t.piece}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
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
