import Link from "next/link";
import type { SettingsDoc } from "@/lib/types";
import { buildEnquiryUrl } from "@/lib/format";
import { LogoLockup } from "./Logo";
import { FooterNews } from "./NewsletterForm";

/**
 * The exact h.html footer: centered full logo + italic tagline, four-column
 * grid (blurb / shop / house / visit + inline newsletter), hairline bottom bar.
 * Content wired to live settings + categories.
 */
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
    <footer>
      <div className="wrap">
        <div className="fwm reveal in">
          <LogoLockup tone="dark" />
          <div className="tag">Aaram ka hai naam.</div>
        </div>

        <div className="fcols">
          <div>
            <h5>The House</h5>
            <p className="blurb">
              Solid-wood furniture at honest prices — sofas, dining sets,
              beds and more, from our market floor to your home.
            </p>
          </div>
          <div>
            <h5>Shop</h5>
            <Link href="/shop">All pieces</Link>
            {categories.slice(0, 4).map((c) => (
              <Link key={c.slug} href={`/shop?category=${c.slug}`}>
                {c.name}
              </Link>
            ))}
          </div>
          <div>
            <h5>House</h5>
            <Link href="/about">Our story</Link>
            <Link href="/visit">Book a visit</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <h5>Visit</h5>
            <p>
              {business.address}
              <br />
              {business.hours ? <>{business.hours}</> : null}
            </p>
            <div className="fnews">
              <FooterNews />
            </div>
            <p style={{ marginTop: 14 }}>
              <a
                href={buildEnquiryUrl(business.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                data-track="footer-whatsapp"
              >
                WhatsApp the shop →
              </a>
            </p>
          </div>
        </div>

        <div className="fbottom">
          <span>© {year} Crescent Bespoke Furniture House</span>
          <span>Design system · Paper &amp; Espresso</span>
        </div>
      </div>
    </footer>
  );
}
