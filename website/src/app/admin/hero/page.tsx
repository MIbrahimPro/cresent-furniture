import { getSettings } from "@/lib/settings";
import { HeroManager } from "@/components/admin/HeroManager";

export const dynamic = "force-dynamic";

export default async function AdminHero() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="display-c text-[26px]">Hero media</h1>
      <p className="mt-1.5 max-w-2xl text-[16px] text-muted">
        The home page background film. Videos play muted, in this order, and loop back to the
        first. Upload your own workshop clips or search Pexels for samples. A dark maroon overlay
        is applied automatically so the heading stays readable.
      </p>
      <HeroManager initialMedia={settings.heroMedia} pexelsConfigured={Boolean(process.env.PEXELS_API)} />
    </div>
  );
}
