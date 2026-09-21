import { PageEditor } from "@/components/admin/PageEditor";

export const dynamic = "force-dynamic";

export default function NewPagePage() {
  return (
    <div>
      <h1 className="display-c text-[26px]">New page</h1>
      <PageEditor />
    </div>
  );
}
