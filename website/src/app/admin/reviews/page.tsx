import { getCollection } from "@/lib/mongo";
import type { Review } from "@/lib/types";
import { ReviewsModeration } from "@/components/admin/ReviewsModeration";

export const dynamic = "force-dynamic";

export default async function AdminReviews() {
  const col = await getCollection<Review>("reviews");
  const reviews = await col.find().sort({ createdAt: -1 }).limit(200).toArray();

  return (
    <div>
      <h1 className="display-c text-[26px]">Reviews</h1>
      <p className="mt-1.5 text-[16px] text-muted">
        Owner notes submitted from product pages. Approve to publish on the storefront.
      </p>
      <ReviewsModeration reviews={reviews} />
    </div>
  );
}
