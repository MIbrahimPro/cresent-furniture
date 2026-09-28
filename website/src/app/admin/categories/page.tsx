import { getCollection } from "@/lib/mongo";
import { toPlainList } from "@/lib/serialize";
import type { Category } from "@/lib/types";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  const col = await getCollection<Category>("categories");
  const categories = await col.find().sort({ order: 1 }).toArray();

  return (
    <div>
      <h1 className="display-c text-[26px]">Categories</h1>
      <p className="mt-1.5 text-[16px] text-sand">
        Categories drive the storefront navigation and shop filters.
      </p>
      <CategoriesManager categories={toPlainList(categories)} />
    </div>
  );
}
