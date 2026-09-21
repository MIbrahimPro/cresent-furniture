import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { buildEnquiryUrl } from "@/lib/format";
import { NewsletterForm } from "@/components/NewsletterForm";

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
        <p className="overline-c text-terra">Contact & Visit</p>
        <h1 className="display-c mt-3 text-[32px]">Come and see the grain up close</h1>
        <p className="mt-4 text-[18px] leading-relaxed text-sand/90">
          The workshop door is open six days a week. Walk in with a sketch on a napkin or a room
          you don't know what to do with — we will figure it out together.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="panel-c p-7">
          <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.2em] text-terra">
            Workshop
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-sand/90">{business.address}</p>
          {business.mapUrl ? (
            <a
              href={business.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-[15px] font-medium text-terra hover:text-terra"
            >
              Open in Maps →
            </a>
          ) : null}
        </div>

        <div className="panel-c p-7">
          <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.2em] text-terra">
            Call or message
          </h2>
          <a
            href={`tel:${business.phone.replace(/\s/g, "")}`}
            className="mt-4 block text-[19px] font-medium text-cream hover:text-terra"
          >
            {business.phone}
          </a>
          {business.hours ? <p className="mt-2 text-[15px] text-sand">{business.hours}</p> : null}
          <a
            href={buildEnquiryUrl(business.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-5 w-full"
          >
            WhatsApp the workshop
          </a>
        </div>

        <div className="panel-c p-7">
          <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.2em] text-terra">
            Commissions
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-sand/90">
            For bespoke work, send us a note about the piece you have in mind — dimensions, timber,
            and the room it will live in.
          </p>
          <p className="mt-3 text-[15px] text-sand">
            We reply between sanding coats, usually the same day.
          </p>
        </div>
      </div>

      <section className="mt-16 border-t border-line pt-12">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="display-c text-[24px]">The Workshop Letter</h2>
          <p className="mt-3 text-[16px] text-sand">
            New pieces, timber arrivals, and what is on the bench — a short letter, rarely.
          </p>
          <div className="flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
