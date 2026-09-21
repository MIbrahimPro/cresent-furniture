import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="display-c text-[26px]">Settings</h1>
      <p className="mt-1.5 text-[16px] text-muted">
        Business details, the WhatsApp checkout number, and storefront notices.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
