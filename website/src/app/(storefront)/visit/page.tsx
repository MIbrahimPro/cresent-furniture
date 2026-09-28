import type { Metadata } from "next";
import Link from "next/link";
import { MAPS_EMBED, MAPS_URL, SHOWROOM } from "@/lib/visit";

export const metadata: Metadata = {
  title: "Book a visit",
  description:
    "Visit the Crescent showroom on Murree Road, Rawalpindi — open daily, 10am to 8pm.",
};

export default function VisitPage() {
  return (
    <>
      {/* ---------- Head ---------- */}
      <div className="sh-head">
        <div className="wrap">
          <h1>
            Come see it <em>in person.</em>
          </h1>
          <p className="cnt">
            Photos are honest — sitting on it is better. Walk in any day of the week.
          </p>
        </div>
      </div>

      <div className="wrap">
        <div className="visit-grid">
          {/* ---------- Details ---------- */}
          <div className="visit-info">
            <p className="overline-c text-terra">The showroom</p>
            <h2 className="display-c mt-3 text-[30px] leading-tight">{SHOWROOM.name}</h2>
            <address className="mt-5 not-italic">
              {SHOWROOM.addressLines.map((line) => (
                <span key={line} className="block text-[17px] text-ink-soft">
                  {line}
                </span>
              ))}
            </address>
            <p className="mt-4 font-detail text-[12px] uppercase tracking-[0.18em] text-mute">
              {SHOWROOM.hours}
            </p>

            <div className="mt-9 flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center">
              <a className="btn btn-primary" href={MAPS_URL} target="_blank" rel="noopener noreferrer" data-track="visit-directions">
                Get directions <i aria-hidden>→</i>
              </a>
              <Link className="lnk" href="/contact" data-track="visit-contact">
                Or send us a note first
              </Link>
            </div>

            <ul className="mt-10 space-y-4 border-t border-line pt-7">
              {[
                "See the exact piece — fabric, finish and size under real light.",
                "Take smaller items home the same day.",
                "Chai on the house; opinions on request.",
              ].map((line) => (
                <li key={line} className="flex gap-3 text-[16px] text-ink-soft">
                  <span aria-hidden className="text-terra">—</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Map — the owner's exact embed ---------- */}
          <figure className="visit-map">
            <iframe
              title={`Map — ${SHOWROOM.name}, Murree Road, Rawalpindi`}
              src={MAPS_EMBED}
              className="h-full w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </figure>
        </div>
      </div>
    </>
  );
}
