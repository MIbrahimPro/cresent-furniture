import { getSettings } from "@/lib/settings";
import { OffersManager } from "@/components/admin/OffersManager";

export const dynamic = "force-dynamic";

export default async function AdminOffers() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="display-c text-[26px]">Offers</h1>
      <p className="mt-1.5 text-[16px] text-muted">
        One sitewide offer banner at a time — write it, link it, and switch it on. For richer
        campaign pages (deal grids, galleries), use Pages and add one to the navigation.
      </p>
      <OffersManager banner={settings.offerBanner} />
    </div>
  );
}
