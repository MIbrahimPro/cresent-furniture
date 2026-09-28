import { getCollection } from "@/lib/mongo";
import { toPlainList } from "@/lib/serialize";
import type { Order } from "@/lib/types";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const col = await getCollection<Order>("orders");
  const orders = await col.find().sort({ createdAt: -1 }).limit(200).toArray();

  return (
    <div>
      <h1 className="display-c text-[26px]">Orders</h1>
      <p className="mt-1.5 text-[16px] text-sand">
        Commissions started from the storefront. Move them through the pipeline as the workshop works.
      </p>
      <OrdersTable orders={toPlainList(orders)} />
    </div>
  );
}
