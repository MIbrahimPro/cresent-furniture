import { notFound } from "next/navigation";
import { getCollection } from "@/lib/mongo";
import type { CustomPage } from "@/lib/types";
import { PageEditor } from "@/components/admin/PageEditor";

export const dynamic = "force-dynamic";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const col = await getCollection<CustomPage>("custom_pages");
  const { ObjectId } = await import("mongodb");
  const page = await col.findOne({ _id: new ObjectId(id) });
  if (!page) notFound();

  return (
    <div>
      <h1 className="display-c text-[26px]">Edit — {page.title}</h1>
      <PageEditor page={page} />
    </div>
  );
}
