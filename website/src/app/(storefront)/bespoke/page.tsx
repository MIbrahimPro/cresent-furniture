import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { buildWhatsAppUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Commission a Piece",
  description: "Bring a sketch, a photo, or an idea — Crescent builds it by hand.",
};

const STEPS = [
  {
    n: "01",
    title: "The conversation",
    body: "Tell us how you live and what the room needs. A photo of the space helps; a rough sketch helps more.",
  },
  {
    n: "02",
    title: "The drawing",
    body: "We measure, choose timber with you, and draw the piece full-size before a single cut is made.",
  },
  {
    n: "03",
    title: "The build",
    body: "Your piece takes shape on the bench. We share photographs as the joints come together.",
  },
  {
    n: "04",
    title: "The delivery",
    body: "Finished by hand, delivered, and placed. Forty years on, it should still be standing.",
  },
];

export default async function BespokePage() {
  const { business } = await getSettings();
  const msg =
    "Assalam-o-Alaikum, Crescent! I would like to commission a bespoke piece. Here is what I have in mind:";

  return (
    <div className="container-c py-12">
      <header className="mx-auto max-w-2xl text-center">
        <p className="overline-c text-coral-dark">Bespoke Commissions</p>
        <h1 className="display-c mt-3 text-[34px]">Your vision. Our craft.</h1>
        <p className="mt-5 text-[18px] leading-relaxed text-ink/90">
          Every Crescent piece begins with a conversation. We listen to how you live, what you
          value, and what your space could become — then we build it, by hand, to last a lifetime.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={buildWhatsAppUrl(business.whatsapp, msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Start a commission
          </a>
          <Link href="/shop" className="btn btn-secondary">
            See the collection
          </Link>
        </div>
      </header>

      <ol className="mt-16 grid gap-6 md:grid-cols-2">
        {STEPS.map((s) => (
          <li key={s.n} className="panel-c p-8">
            <p className="font-display text-[13px] font-semibold tracking-[0.3em] text-coral">{s.n}</p>
            <h2 className="mt-3 font-display text-[18px] font-semibold text-maroon">{s.title}</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink/85">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
