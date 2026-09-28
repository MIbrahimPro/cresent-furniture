import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { buildEnquiryUrl } from "@/lib/format";
import { FooterNews } from "@/components/NewsletterForm";
import { ContactForm } from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact & Visit",
  description: "Visit the Crescent workshop on Murree Road, Rawalpindi — or message us on WhatsApp.",
};

export default async function ContactPage() {
  const { business } = await getSettings();

  return (
    <div className="container-c py-12">
      <header className="max-w-2xl">
        <p className="overline-c">Contact &amp; Visit</p>
        <h1 className="display-c mt-3 text-[34px] sm:text-[42px]">
          Come and see <span className="accent-i">the grain up close</span>
        </h1>
        <p className="mt-5 font-body text-[17px] leading-relaxed text-ink-soft">
          The workshop door is open six days a week. Walk in with a sketch on a napkin or a room
          you don&rsquo;t know what to do with — we will figure it out together.
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div className="panel-c p-7">
            <h2 className="font-detail text-[11px] font-semibold uppercase tracking-[0.24em] text-terra">
              Workshop
            </h2>
            <p className="mt-4 font-body text-[16px] leading-relaxed text-ink-soft">{business.address}</p>
            {business.mapUrl ? (
              <a
                href={business.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 font-detail text-[14px] font-semibold uppercase tracking-[0.1em] text-terra hover:text-terra-deep"
              >
                Open in Maps →
              </a>
            ) : null}
            {business.hours ? (
              <p className="mt-3 font-body text-[14px] text-mute">{business.hours}</p>
            ) : null}
          </div>

          <div className="panel-c p-7">
            <h2 className="font-detail text-[11px] font-semibold uppercase tracking-[0.24em] text-terra">
              Call or message
            </h2>
            <a
              href={`tel:${business.phone.replace(/\s/g, "")}`}
              className="mt-4 block font-display text-[19px] font-medium text-ink hover:text-terra"
            >
              {business.phone}
            </a>
            <a
              href={buildEnquiryUrl(business.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              data-track="contact-whatsapp"
              className="btn btn-primary mt-5 w-full"
            >
              WhatsApp the shop
            </a>
          </div>

          <div className="section-dark rounded-[22px] p-7">
            <h2 className="font-detail text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--color-coral)" }}>
              Looking for something specific?
            </h2>
            <p className="mt-4 font-body text-[15.5px] leading-relaxed text-sand">
              Tell us the piece, the size, and the room — if it exists, we will find it. If we
              don&rsquo;t have it this week, we usually can next week.
            </p>
            <p className="mt-3 font-body text-[14px] text-sand/75">
              We reply the same day, usually within the hour.
            </p>
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>

      <section className="mt-16 border-t border-line pt-12">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="display-c text-[26px]">The Workshop Letter</h2>
          <p className="mt-3 font-body text-[16px] text-ink-soft">
            New pieces, timber arrivals, and what is on the bench — a short letter, rarely.
          </p>
          <div className="flex justify-center">
            <FooterNews />
          </div>
        </div>
      </section>
    </div>
  );
}
