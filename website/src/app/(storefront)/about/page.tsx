import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Four decades of handcrafted furniture from Rawalpindi.",
};

export default async function AboutPage() {
  const { business } = await getSettings();

  return (
    <div className="container-c py-12">
      <header className="mx-auto max-w-2xl text-center">
        <p className="overline-c text-terra">Our Story</p>
        <h1 className="display-c mt-3 text-[34px]">
          We do not manufacture furniture. We engineer heirlooms.
        </h1>
        <hr className="hr-coral mx-auto mt-6" />
      </header>

      <div className="mx-auto mt-12 max-w-2xl space-y-6 text-[18px] leading-relaxed text-sand/90">
        <p>
          Crescent began as a two-bench workshop on Murree Road with a simple stubbornness: that a
          piece of furniture should outlive the person who bought it, and that everything needed to
          make that happen — seasoned timber, patient joinery, honest finishes — was available right
          here in Rawalpindi.
        </p>
        <p>
          Forty-five years later the benches are more, the stubbornness is the same. Boards still
          rest in the shed for months before they are cut. Joints are still drawn, chiselled, and
          fitted by hand. Nothing leaves the workshop until the maker is willing to sign the back of
          it.
        </p>
        <p>
          We do not keep stock in a warehouse. When you commission a piece, it is drawn for your
          room, built from timber chosen for that drawing, and finished by the same hands that
          started it. It is a slower way to work. It is also the only way we know.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        <Value title="Seasoned, not rushed" body="Timber rests for months before the first cut, so your furniture never warps." />
        <Value title="Joined, not screwed" body="Mortise, tenon, dovetail, wedge — joints chosen to be tightened, not replaced." />
        <Value title="Finished to live with" body="Hand-rubbed oils and waxes that deepen with use instead of chipping away." />
      </div>

      <div className="panel-c mt-14 p-10 text-center">
        <h2 className="display-c text-[24px]">Visit the workshop</h2>
        <p className="mx-auto mt-3 max-w-md text-[16px] text-sand">{business.address}</p>
        <Link href="/contact" className="btn btn-primary mt-6">
          Plan a visit
        </Link>
      </div>
    </div>
  );
}

function Value({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel-c p-6">
      <h3 className="font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-cream">
        {title}
      </h3>
      <p className="mt-3 text-[16px] leading-relaxed text-sand/85">{body}</p>
    </div>
  );
}
