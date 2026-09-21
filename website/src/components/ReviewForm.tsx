"use client";

import { useState } from "react";

export function ReviewForm({ productSlug }: { productSlug: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [rating, setRating] = useState(5);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          name: data.get("name"),
          rating,
          title: data.get("title") || undefined,
          body: data.get("body"),
        }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="panel-c mt-4 p-5 text-[15px] text-muted">
        Shukriya — your note is with the workshop and will appear after a quick check.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="panel-c mt-4 space-y-4 p-5">
      <div>
        <label className="label-c" htmlFor="rv-name">Your name</label>
        <input id="rv-name" name="name" required className="input-c" autoComplete="name" />
      </div>
      <div>
        <span className="label-c">Rating</span>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
              className={`text-[22px] leading-none transition-colors ${
                n <= rating ? "text-coral" : "text-line hover:text-coral-tint"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label-c" htmlFor="rv-title">Headline (optional)</label>
        <input id="rv-title" name="title" className="input-c" placeholder="Worth every rupee" />
      </div>
      <div>
        <label className="label-c" htmlFor="rv-body">Your note</label>
        <textarea id="rv-body" name="body" required rows={4} className="input-c" />
      </div>
      {state === "error" ? (
        <p className="text-[14px] text-coral-dark">Something went wrong — please try again.</p>
      ) : null}
      <button type="submit" disabled={state === "loading"} className="btn btn-primary w-full">
        {state === "loading" ? "Sending…" : "Send note"}
      </button>
    </form>
  );
}
