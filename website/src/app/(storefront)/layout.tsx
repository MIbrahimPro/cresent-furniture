import { getSettings } from "@/lib/settings";
import { getActiveCategories } from "@/lib/catalog";
import { getPublishedPages } from "@/lib/pages";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CartProvider } from "@/components/CartProvider";
import { Tracker } from "@/components/Tracker";
import { toPlainDoc } from "@/lib/serialize";
import type { CustomPage } from "@/lib/types";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  let categories: { slug: string; name: string }[] = [];
  let pages: CustomPage[] = [];
  try {
    categories = (await getActiveCategories()).map((c) => ({ slug: c.slug, name: c.name }));
    pages = await getPublishedPages();
  } catch {
    // DB not reachable (e.g. build) — render chrome with empty nav
  }

  const navCategories = categories.map((c) => ({ label: c.name, href: `/shop?category=${c.slug}` }));
  const navPages = pages
    .filter((p) => p.showInNav)
    .sort((a, b) => a.navOrder - b.navOrder)
    .map((p) => ({ label: p.title, href: `/p/${p.slug}` }));

  return (
    <CartProvider>
      <Tracker />
      <div className="grain" aria-hidden />
      <Header
        categories={navCategories}
        pages={navPages}
        announcement={
          settings.offerBanner?.active ? settings.offerBanner.text : settings.announcement || undefined
        }
      />
      <main>{children}</main>
      <Footer settings={toPlainDoc(settings)} categories={categories} />
      <WhatsAppFab number={settings.business.whatsapp} />
    </CartProvider>
  );
}
