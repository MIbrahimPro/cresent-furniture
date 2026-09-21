"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
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
      <p className="mt-6 font-display text-[13px] uppercase tracking-[0.16em] text-terra">
        Shukriya — you are on the list.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 flex max-w-md gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="input-c"
        aria-label="Email address"
      />
      <button type="submit" disabled={state === "loading"} className="btn btn-primary shrink-0">
        {state === "loading" ? "…" : "Join"}
      </button>
    </form>
  );
}
