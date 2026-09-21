import Link from "next/link";
import type { SettingsDoc } from "@/lib/types";
import { buildEnquiryUrl } from "@/lib/format";

export function Footer({
  settings,
  categories,
}: {
  settings: SettingsDoc;
  categories: { slug: string; name: string }[];
}) {
  const { business } = settings;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 rounded-t-[40px] border-t border-line bg-ink">
      <div className="container-c grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/crescent-logo-light.svg"
            alt="Crescent — Bespoke Furniture House"
            className="h-12 w-auto"
          />
          <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-sand/80">
            A bespoke furniture house in Rawalpindi. Every piece made to order, by hand, from
            seasoned hardwood.
          </p>
        </div>

        <nav aria-label="Shop">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brass">
            Shop
          </h3>
          <ul className="mt-5 space-y-2.5 text-[15px]">
            <li><Link href="/shop" className="text-sand transition-colors hover:text-cream">All Furniture</Link></li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} className="text-sand transition-colors hover:text-cream">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brass">
            Workshop
          </h3>
          <ul className="mt-5 space-y-3.5 text-[15px] leading-relaxed text-sand">
            <li className="flex gap-2.5">
              <PinIcon />
              <span>{business.address}</span>
            </li>
            <li className="flex gap-2.5">
              <PhoneIcon />
              <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-cream">
                {business.phone}
              </a>
            </li>
            {business.hours ? <li className="text-[14px] text-mute">{business.hours}</li> : null}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brass">
            Commission
          </h3>
          <p className="mt-5 text-[15px] leading-relaxed text-sand">
            The fastest way to reach the workshop is WhatsApp.
          </p>
          <a
            href={buildEnquiryUrl(business.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm mt-5"
          >
            Message on WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-c flex flex-col items-center justify-between gap-2 py-6 text-[13px] text-mute sm:flex-row">
          <p>© {year} Crescent Bespoke Furniture House. All rights reserved.</p>
          <p className="font-display italic text-sand/70">Aaram ka naam.</p>
        </div>
      </div>
    </footer>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mt-1 shrink-0 text-terra" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mt-1 shrink-0 text-terra" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
