import Link from "next/link";
import { getCollection } from "@/lib/mongo";
import type { Product } from "@/lib/types";
import { toPlainList } from "@/lib/serialize";
import { ProductRow } from "@/components/admin/ProductRow";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  let products: Product[] = [];
  try {
    const col = await getCollection<Product>("products");
    products = await col.find().sort({ createdAt: -1 }).toArray();
  } catch {
    // DB unreachable
  }

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display-c text-[26px]">Products</h1>
          <p className="mt-1.5 text-[16px] text-sand">
            {products.length} pieces in the catalogue.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add product
        </Link>
      </header>

      {products.length === 0 ? (
        <p className="panel-c mt-8 p-8 text-center text-sand">
          No products yet. Run <code>npm run seed</code> or add your first piece.
        </p>
      ) : (
        <div className="panel-c mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[15px]">
            <thead>
              <tr className="border-b border-line text-[12px] uppercase tracking-[0.14em] text-sand">
                <th className="px-5 py-3 font-display font-semibold">Product</th>
                <th className="px-5 py-3 font-display font-semibold">Category</th>
                <th className="px-5 py-3 font-display font-semibold">Price</th>
                <th className="px-5 py-3 font-display font-semibold">Stock</th>
                <th className="px-5 py-3 font-display font-semibold">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {toPlainList(products).map((p) => (
                <ProductRow key={String(p._id)} product={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
