"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
      });
      if (res.ok) {
        router.push(params.get("next") || "/admin");
        router.refresh();
      } else {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Login failed");
        setLoading(false);
      }
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm">
      <div className="panel-c p-8">
        <h1 className="font-display text-[18px] font-semibold uppercase tracking-[0.14em] text-cream">
          Crescent CRM
        </h1>
        <p className="mt-1.5 text-[15px] text-sand">Sign in to manage the workshop.</p>

        <div className="mt-7 space-y-4">
          <div>
            <label className="label-c" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" className="input-c" />
          </div>
          <div>
            <label className="label-c" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className="input-c" />
          </div>
        </div>

        {error ? (
          <p role="alert" className="mt-4 rounded-btn bg-terra-veil px-3 py-2 text-[14px] text-terra">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={loading} className="btn btn-primary mt-6 w-full">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-walnut-2 px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
