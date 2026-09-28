import { getCollection } from "@/lib/mongo";
import { toPlainList } from "@/lib/serialize";
import type { Category } from "@/lib/types";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const cats = await getCollection<Category>("categories");
  const categories = await cats.find().sort({ order: 1 }).toArray();

  return (
    <div>
      <h1 className="display-c text-[26px]">Add product</h1>
      <ProductForm categories={toPlainList(categories)} />
    </div>
  );
}
