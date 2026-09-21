import Link from "next/link";
import { getCollection } from "@/lib/mongo";
import type { CustomPage } from "@/lib/types";
import { PagesList } from "@/components/admin/PagesList";

export const dynamic = "force-dynamic";

export default async function AdminPages() {
  const col = await getCollection<CustomPage>("custom_pages");
  const pages = await col.find().sort({ updatedAt: -1 }).toArray();

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display-c text-[26px]">Pages</h1>
          <p className="mt-1.5 max-w-xl text-[16px] text-muted">
            Campaign and content pages — offer deals, lookbooks, announcements. Sections are
            composed from ready-made components; pages can be added to the storefront navigation.
          </p>
        </div>
        <Link href="/admin/pages/new" className="btn btn-primary">
          New page
        </Link>
      </header>
      <PagesList pages={pages} />
    </div>
  );
}
