import { getCollection } from "@/lib/mongo";
import type { ContactMessage } from "@/lib/types";
import { MessagesList } from "@/components/admin/MessagesList";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  let messages: (ContactMessage & { _id?: unknown })[] = [];
  try {
    const col = await getCollection<ContactMessage>("messages");
    messages = await col.find({}).sort({ createdAt: -1 }).limit(200).toArray();
  } catch {
    // DB unreachable — empty inbox renders
  }

  // Serialize ObjectIds/Date across the server→client boundary
  const plain = messages.map((m) => ({
    id: String(m._id),
    name: m.name,
    phone: m.phone,
    email: m.email,
    subject: m.subject,
    body: m.body,
    handled: m.handled,
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt),
  }));

  return (
    <div>
      <header>
        <h1 className="font-display text-[26px] font-medium text-cream">Messages</h1>
        <p className="mt-1.5 text-[16px] text-sand">
          Enquiries from the website contact form. {plain.filter((m) => !m.handled).length} awaiting a reply.
        </p>
      </header>
      <MessagesList messages={plain} />
    </div>
  );
}
