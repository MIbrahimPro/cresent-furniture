import { notFound } from "next/navigation";
import { getCollection, ObjectId } from "@/lib/mongo";
import type { Category, Product } from "@/lib/types";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const col = await getCollection<Product>("products");
  const product = await col.findOne({ _id: new ObjectId(id) });
  if (!product) notFound();

  const cats = await getCollection<Category>("categories");
  const categories = await cats.find().sort({ order: 1 }).toArray();

  return (
    <div>
      <h1 className="display-c text-[26px]">Edit — {product.name}</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
