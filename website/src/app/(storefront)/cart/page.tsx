import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { CartView } from "./CartView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Selection",
};

export default async function CartPage() {
  const settings = await getSettings();
  return (
    <div className="container-c py-12">
      <header className="mb-10">
        <p className="overline-c text-coral-dark">Your Selection</p>
        <h1 className="display-c mt-3 text-[32px]">Ready when you are</h1>
      </header>
      <CartView settings={settings} />
    </div>
  );
}
