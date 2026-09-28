import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Crescent Furniture — a family-run furniture outlet on Murree Road, Rawalpindi.",
};

export default async function AboutPage() {
  const { business } = await getSettings();

  return (
    <div className="container-c py-12">
      <header className="mx-auto max-w-2xl text-center">
        <p className="overline-c text-terra">Our Story</p>
        <h1 className="display-c mt-3 text-[34px]">
          A family furniture house on <em>Murree Road.</em>
        </h1>
        <hr className="hr-coral mx-auto mt-6" />
      </header>

      <div className="mx-auto mt-12 max-w-2xl space-y-6 text-[18px] leading-relaxed text-ink-soft/90">
        <p>
          Crescent started as a single shop in the Furniture Market with one idea: buying furniture
          should be the easy part of furnishing a home. Good pieces, clearly priced, from people who
          actually know what they are selling.
        </p>
        <p>
          Today the floor carries sofas, dining sets, beds, wardrobes, and everything between —
          picked from makers we have known for years. We check every piece before it goes on the
          floor, and we say no to the flimsy stuff, even when it is cheap.
        </p>
        <p>
          We do not make furniture; we find the good kind and stand behind it. Walk in, sit on
          things, ask us anything. The chai is on the house either way.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        <Value title="Chosen, not just stocked" body="Every piece on the floor is picked by the family that runs the shop." />
        <Value title="Ticketed, fixed prices" body="The price on the tag is the price you pay — no haggling theatre." />
        <Value title="Delivered, not just sold" body="Delivery across Rawalpindi & Islamabad, placed in your room." />
      </div>

      <div className="panel-c mt-14 p-10 text-center">
        <h2 className="display-c text-[24px]">Visit the showroom</h2>
        <p className="mx-auto mt-3 max-w-md text-[16px] text-ink-soft">{business.address}</p>
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
      <h3 className="font-display text-[18px] font-medium text-ink">
        {title}
      </h3>
      <p className="mt-3 text-[16px] leading-relaxed text-ink-soft/85">{body}</p>
    </div>
  );
}
