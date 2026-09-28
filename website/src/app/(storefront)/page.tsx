import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { getActiveCategories, getFeaturedProducts, searchProducts } from "@/lib/catalog";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { Reveal } from "@/components/Reveal";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { toPlainList, toPlainDoc } from "@/lib/serialize";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, categories] = await Promise.all([getSettings(), getActiveCategories()]);
  let featured: Product[] = [];
  const categoryImages: Record<string, string> = {};
  try {
    featured = await getFeaturedProducts(4);
    if (featured.length < 4) {
      const seen = new Set(featured.map((p) => String(p._id)));
      const newest = await searchProducts({ sort: "newest" });
      for (const p of newest) {
        if (featured.length >= 4) break;
        if (!seen.has(String(p._id))) featured.push(p);
      }
    }
    // Category index falls back to each category's first product photo
    const all = await searchProducts({});
    for (const p of all) {
      if (p.images?.[0] && !categoryImages[p.categorySlug]) {
        categoryImages[p.categorySlug] = p.images[0];
      }
    }
  } catch {
    // DB unreachable — hero and atelier still render
  }

  const feat = toPlainList(featured);
  const counts: Record<string, number> = {};
  for (const c of categories) counts[c.slug] = counts[c.slug] || 0;

  return (
    <>
      {/* ============ HERO — exact h.html ============ */}
      <div className="hero">
        <div className="wrap hero-grid">
          <Reveal>
            <h1>
              Furniture for <em>real homes.</em>
            </h1>
            <p className="lede">
              Sofas, dining sets, beds and everything between — solid wood, honest prices, all under
              one roof on Murree Road. Walk in, sit down, take it home.{" "}
              <span className="em">Aaram ka hai naam.</span>
            </p>
            <div className="cta-row">
              <Link className="btn btn-ink" href="/shop" data-track="hero-shop">
                Browse the collection
              </Link>
              <Link className="lnk" href="/contact">
                Visit the market <i>→</i>
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <figure className="hero-fig">
              {feat[0] ? (
                <>
                  <Link
                    href={`/product/${feat[0].slug}`}
                    className="ph w-linen block"
                    style={{ aspectRatio: "4 / 4.7" }}
                    aria-label={feat[0].name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={feat[0].images[0]}
                      alt={feat[0].name}
                      fetchPriority="high"
                    />
                  </Link>
                  <figcaption>
                    <div>
                      <div className="fn">{feat[0].name}</div>
                      <div className="fm2">{feat[0].tagline || "Solid wood · in store now"}</div>
                    </div>
                    <div className="fp">PKR {feat[0].price.toLocaleString("en-PK")}</div>
                  </figcaption>
                </>
              ) : (
                <div className="ph w-linen" style={{ aspectRatio: "4 / 4.7" }} />
              )}
            </figure>
          </Reveal>
        </div>
      </div>

      {/* Personalized: pieces this visitor last viewed */}
      <RecentlyViewed />

      {/* ============ COLLECTIONS INDEX — exact h.html .ix ============ */}
      <div className="ix">
        <div className="wrap ix-grid">
          <Reveal>
            {categories.slice(0, 5).map((c) => (
              <Link
                key={c.slug}
                className="ixrow"
                href={`/shop?category=${c.slug}`}
                data-track={`index-${c.slug}`}
              >
                <span className="ixname">{c.name}</span>
                <sup>{counts[c.slug] || ""}</sup>
                <span className="ixarr">→</span>
              </Link>
            ))}
            <Link className="ixrow" href="/shop">
              <span className="ixname">All pieces</span>
              <span className="ixarr">→</span>
            </Link>
          </Reveal>
        </div>
      </div>

      {/* ============ SELECTED WORK — exact h.html .feat (offset editorial grid) ============ */}
      <div className="feat">
        <div className="wrap">
          <Reveal>
            <div className="feat-head">
              <h2>
                On the floor <em>now</em>
              </h2>
              <Link className="lnk" href="/shop">
                Shop everything <i>→</i>
              </Link>
            </div>
          </Reveal>
          <div className="feat-grid reveal in">
            {feat.slice(0, 4).map((p, i) => (
              <Link key={String(p._id)} href={`/product/${p.slug}`} className={`fcell f${i + 1}`}>
                <div className={`ph ${(["w-linen", "w-clay", "w-sand", "w-blush"] as const)[i]}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]} alt={p.name} loading="lazy" />
                </div>
                <div className="pcap">
                  <div>
                    <div className="pn">{p.name}</div>
                    <div className="pm">{p.tagline || "Solid wood · in store now"}</div>
                  </div>
                  <div className="pp">PKR {p.price.toLocaleString("en-PK")}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ============ ROOM GALLERY — the kept carousel (your favourite) ============ */}
      {categories.length > 0 ? (
        <section className="section-flow">
          <div className="container-c">
            <Reveal>
              <div className="feat-head" style={{ marginBottom: 44 }}>
                <h2>
                  Take a walk <em>through the rooms.</em>
                </h2>
                <Link className="lnk" href="/shop">
                  Shop the looks <i>→</i>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <CategoryCarousel
                cards={categories.map((c) => ({
                  href: `/shop?category=${c.slug}`,
                  name: c.name,
                  image: c.image || categoryImages[c.slug],
                  tagline: c.description || `Furniture for ${c.name.toLowerCase()} — see what's in store.`,
                  eyebrow: "Collection",
                }))}
              />
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ============ BAND — showroom photo with quote ============ */}
      <div className="band">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1800"
          alt="Inside the Crescent showroom"
          loading="lazy"
        />
        <div className="band-cap reveal in">
          <blockquote>New stock lands every week — what you saw last month may already be gone.</blockquote>
          <cite>— the showroom floor</cite>
        </div>
      </div>

      {/* ============ WHY CRESCENT — espresso slab, outlet promises ============ */}
      <div className="atelier">
        <div className="wrap">
          <div className="at-grid">
            <Reveal>
              <h2>
                Why buy from <em>Crescent.</em>
              </h2>
              <p className="lede">
                We keep it simple: fair prices on good furniture, people who know their stock, and
                delivery that actually shows up. Come press a cushion, open a drawer, and judge for
                yourself.
              </p>
              <Link className="lnk online" href="/visit">
                Plan a visit <i>→</i>
              </Link>
            </Reveal>
            <ol className="steps reveal in">
              <li>
                <i>I.</i>
                <div>
                  <h3>See it, sit in it</h3>
                  <p>
                    Photos don&rsquo;t tell you how a sofa sits. Everything on the floor is open to
                    try — bring the family.
                  </p>
                </div>
              </li>
              <li>
                <i>II.</i>
                <div>
                  <h3>Honest prices</h3>
                  <p>
                    Ticketed, fixed and fair — the price you see is the price you pay. No theatre.
                  </p>
                </div>
              </li>
              <li>
                <i>III.</i>
                <div>
                  <h3>Take it home fast</h3>
                  <p>Most pieces leave with you the same week, delivered and placed in your room.</p>
                </div>
              </li>
              <li>
                <i>IV.</i>
                <div>
                  <h3>We stand behind it</h3>
                  <p>Anything goes wrong, you come back to us — same faces, same floor, no runaround.</p>
                </div>
              </li>
            </ol>
          </div>
          <div className="at-photos reveal in">
            <figure>
              <div className="ph" style={{ aspectRatio: "4 / 3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="A styled living room at Crescent"
                  loading="lazy"
                />
              </div>
              <figcaption>Room sets on the floor — see the pieces together, not alone.</figcaption>
            </figure>
            <figure>
              <div className="ph" style={{ aspectRatio: "4 / 3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="A dining set at Crescent"
                  loading="lazy"
                />
              </div>
              <figcaption>Sofas, dining, beds — try them before you take them home.</figcaption>
            </figure>
          </div>
        </div>
      </div>

      {/* ============ QUOTE ============ */}
      <div className="quote">
        <Reveal>
          <div className="wrap">
            <blockquote>
              &ldquo;Bought a full lounge set here. Delivered in three days, placed in the room, and
              the price was exactly what the ticket said.&rdquo;
            </blockquote>
            <cite>— The Khan family · Living</cite>
          </div>
        </Reveal>
      </div>

      {/* ============ CTA STRIP ============ */}
      <div className="ctastrip">
        <Reveal>
          <div className="wrap">
            <h2>
              Come see it <em>for yourself.</em>
            </h2>
            <p>
              Furniture Market, Murree Road, Rawalpindi — open every day, 10am to 8pm. Walk the
              floor, try the pieces, and take something home.
            </p>
            <Link className="btn btn-ink" href="/visit" data-track="cta-visit">
              Plan your visit
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Announcement CTA (CRM-managed) — kept subtle at the very end */}
      {toPlainDoc(settings).announcement ? (
        <div className="border-t border-line py-5 text-center">
          <p className="font-detail text-[11px] font-medium uppercase tracking-[0.22em] text-mute">
            {toPlainDoc(settings).announcement}
          </p>
        </div>
      ) : null}
    </>
  );
}
