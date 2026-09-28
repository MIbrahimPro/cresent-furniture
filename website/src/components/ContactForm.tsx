"use client";

import { useState } from "react";
import { track } from "@/lib/track";
import { api } from "@/lib/api";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("loading");
    try {
      const res = await fetch(api("/api/") + "messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone") || undefined,
          email: data.get("email") || undefined,
          subject: data.get("subject") || undefined,
          body: data.get("body"),
        }),
      });
      if (res.ok) {
        track({ type: "enquiry", label: "contact-form" });
        setState("done");
        form.reset();
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="panel-c p-8 text-center">
        <p className="font-display text-[20px] text-ink">Message received.</p>
        <p className="mt-2 font-body text-[15px] text-ink-soft">
          Shukriya — the workshop will reply between sanding coats, usually the same day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="panel-c space-y-4 p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-c" htmlFor="cf-name">Name *</label>
          <input id="cf-name" name="name" required className="input-c" autoComplete="name" />
        </div>
        <div>
          <label className="label-c" htmlFor="cf-phone">Phone</label>
          <input id="cf-phone" name="phone" className="input-c" autoComplete="tel" inputMode="tel" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-c" htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" className="input-c" autoComplete="email" />
        </div>
        <div>
          <label className="label-c" htmlFor="cf-subject">Subject</label>
          <input id="cf-subject" name="subject" className="input-c" placeholder="A dining table for six…" />
        </div>
      </div>
      <div>
        <label className="label-c" htmlFor="cf-body">Message *</label>
        <textarea id="cf-body" name="body" required rows={5} className="input-c" placeholder="Tell us about the piece, the room, and when you need it." />
      </div>
      {state === "error" ? (
        <p className="font-body text-[14px] text-terra">Something went wrong — please try again, or reach us on WhatsApp.</p>
      ) : null}
      <button type="submit" disabled={state === "loading"} className="btn btn-primary w-full">
        {state === "loading" ? "Sending…" : "Send to the workshop"}
      </button>
    </form>
  );
}
