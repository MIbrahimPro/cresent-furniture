import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/pages";
import { formatPKR } from "@/lib/format";
import type { PageSection } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  return page ? { title: page.title, description: page.intro } : { title: "Not found" };
}

export default async function CustomPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="container-c py-12">
      <nav aria-label="Breadcrumb" className="text-[14px] text-muted">
        <Link href="/" className="hover:text-coral-dark">Home</Link>
        <span className="mx-2">/</span>
        <span>{page.title}</span>
      </nav>

      <header className="mt-4 max-w-2xl">
        <p className="overline-c text-coral-dark">Crescent</p>
        <h1 className="display-c mt-3 text-[32px]">{page.title}</h1>
        {page.intro ? <p className="mt-4 text-[18px] leading-relaxed text-ink/90">{page.intro}</p> : null}
      </header>

      <div className="mt-12 space-y-14">
        {page.sections.map((section, i) => (
          <SectionView key={i} section={section} />
        ))}
      </div>
    </div>
  );
}

function SectionView({ section }: { section: PageSection }) {
  if (section.type === "rich-text") {
    return (
      <section className="max-w-2xl">
        {section.heading ? (
          <h2 className="display-c text-[24px]">{section.heading}</h2>
        ) : null}
        <div className="mt-4 space-y-4 text-[17px] leading-relaxed text-ink/90">
          {section.body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "offer-grid") {
    return (
      <section>
        {section.heading ? <h2 className="display-c text-[24px]">{section.heading}</h2> : null}
        {section.intro ? <p className="mt-3 max-w-2xl text-[17px] text-muted">{section.intro}</p> : null}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {section.offers.map((offer, i) => {
            const onSale = offer.price !== undefined && !!offer.comparePrice && offer.comparePrice > offer.price;
            return (
              <OfferCard key={i}>
                {offer.image ? (
                  <div className="aspect-[4/3] overflow-hidden bg-parchment">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={offer.image} alt={offer.title} className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <div className="p-5">
                  {offer.badge ? (
                    <p className="eyebrow-c">{offer.badge}</p>
                  ) : null}
                  <h3 className="mt-1 font-display text-[16px] font-semibold text-maroon">
                    {offer.title}
                  </h3>
                  {offer.description ? (
                    <p className="mt-1.5 text-[15px] text-muted">{offer.description}</p>
                  ) : null}
                  {offer.price !== undefined ? (
                    <div className="mt-3 flex items-baseline gap-2.5">
                      <span className="font-display text-[15px] font-semibold text-maroon">
                        {formatPKR(offer.price)}
                      </span>
                      {onSale ? (
                        <span className="text-[14px] text-muted line-through">
                          {formatPKR(offer.comparePrice!)}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  {offer.href ? (
                    <Link href={offer.href} className="btn btn-secondary btn-sm mt-4">
                      View
                    </Link>
                  ) : null}
                </div>
              </OfferCard>
            );
          })}
        </div>
      </section>
    );
  }

  if (section.type === "gallery") {
    return (
      <section>
        {section.heading ? <h2 className="display-c text-[24px]">{section.heading}</h2> : null}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {section.images.map((src, i) => (
            <div key={i} className="card-c aspect-[4/3] overflow-hidden bg-parchment">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // banner
  return (
    <section className="rounded-card bg-maroon p-10 text-center">
      <p className="display-c text-[22px] text-cream">{section.text}</p>
      {section.href ? (
        <Link href={section.href} className="btn btn-primary mt-6">
          {section.label ?? "See more"}
        </Link>
      ) : null}
    </section>
  );
}

function OfferCard({ children }: { children: React.ReactNode }) {
  return <div className="card-c">{children}</div>;
}
