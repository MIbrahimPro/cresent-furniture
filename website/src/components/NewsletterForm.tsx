"use client";

import { useState } from "react";
import { track } from "@/lib/track";
import { api } from "@/lib/api";

/**
 * The h.html footer newsletter: inline hairline input + terracotta "Join",
 * exactly .fnews markup. Posts to /api/newsletter and logs a tracked event.
 */
export function FooterNews() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    track({ type: "newsletter", label: email.slice(0, 80) });
    setState("loading");
    try {
      const res = await fetch(api("/api/") + "newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="font-body text-[14px] italic" style={{ color: "var(--color-terra)" }}>
        Shukriya — you are on the list.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="fnews">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email — for the workshop journal"
        aria-label="Email"
      />
      <button type="submit" disabled={state === "loading"}>
        {state === "loading" ? "…" : "Join"}
      </button>
    </form>
  );
}
