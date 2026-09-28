"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export interface MessageItem {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  subject?: string;
  body: string;
  handled: boolean;
  createdAt: string;
}

export function MessagesList({ messages }: { messages: MessageItem[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggle(m: MessageItem) {
    setBusyId(m.id);
    try {
      await fetch(api("/api/") + `messages/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handled: !m.handled }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (!messages.length) {
    return (
      <p className="panel-c mt-8 p-8 text-center text-[15px] text-sand">
        The inbox is empty — website enquiries will land here.
      </p>
    );
  }

  return (
    <ul className="mt-8 space-y-4">
      {messages.map((m) => (
        <li key={m.id} className={`panel-c p-5 ${m.handled ? "opacity-60" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[15px] font-semibold text-cream">
                {m.name}
                {m.subject ? <span className="ml-2 font-normal text-sand">— {m.subject}</span> : null}
              </p>
              <p className="mt-0.5 text-[12.5px] text-sand/70">
                {new Date(m.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                {m.phone ? ` · ${m.phone}` : ""}
                {m.email ? ` · ${m.email}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggle(m)}
              disabled={busyId === m.id}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                m.handled
                  ? "bg-walnut-2 text-sand hover:text-cream"
                  : "bg-terra-veil text-terra hover:bg-terra hover:text-ink"
              }`}
            >
              {m.handled ? "Handled" : "Mark handled"}
            </button>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-sand/90">{m.body}</p>
        </li>
      ))}
    </ul>
  );
}
