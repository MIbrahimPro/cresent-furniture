import type { TrackingEvent, TrackingEventType } from "./types";

/**
 * Visitor identity — cookies are written by middleware (crescent_vid /
 * crescent_sid) so the ids exist even before any JS runs. This module is
 * browser-only helpers: reading ids, attributing source, and sending
 * events to /api/track without ever throwing.
 */

const VID = "crescent_vid";
const SID = "crescent_sid";

declare global {
  interface Window {
    __crescentTracker?: boolean;
  }
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

/** Marketing channel from referrer + UTM, best-effort. */
export function trafficSource(): { referrer?: string; source: string; utm: Record<string, string> } {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const v = params.get(k);
    if (v) utm[k] = v.slice(0, 80);
  }

  const ref = document.referrer || undefined;
  let source = "direct";
  if (utm.utm_source) {
    source = utm.utm_source.toLowerCase().slice(0, 40);
  } else if (ref) {
    try {
      const host = new URL(ref).hostname.replace(/^www\./, "");
      if (host === window.location.host) {
        source = "internal";
      } else if (host.includes("google.")) source = "google";
      else if (host.includes("bing.")) source = "bing";
      else if (host.includes("facebook.") || host.includes("instagram.")) source = "meta";
      else if (host.includes("tiktok.")) source = "tiktok";
      else if (host.includes("wa.me") || host.includes("whatsapp.")) source = "whatsapp";
      else source = host.slice(0, 40);
    } catch {
      source = "direct";
    }
  }
  return { referrer: ref, source, utm };
}

type EventInput = {
  type: TrackingEventType;
  label?: string;
  value?: number;
  meta?: Record<string, unknown>;
};

/** Queue events and flush in one request per batch (fires and forgets). */
type OutboundEvent = Omit<TrackingEvent, "createdAt"> & { path: string };
let queue: OutboundEvent[] = [];
let timer: number | undefined;

function flush() {
  const batch = queue;
  queue = [];
  timer = undefined;
  if (!batch.length) return;
  try {
    const payload = JSON.stringify(batch);
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never surface tracking errors */
  }
}

function enqueue(ev: OutboundEvent) {
  queue.push(ev);
  if (timer === undefined) {
    timer = window.setTimeout(flush, 600);
  }
}

function base() {
  const { referrer, source, utm } = trafficSource();
  return {
    visitorId: readCookie(VID) ?? "anon",
    sessionId: readCookie(SID) ?? "anon",
    referrer,
    source,
    utm: Object.keys(utm).length ? utm : undefined,
  };
}

/** Track any event. Safe to call anywhere client-side. */
export function track(input: EventInput) {
  if (typeof window === "undefined") return;
  try {
    enqueue({ ...base(), path: window.location.pathname, ...input });
  } catch {
    /* noop */
  }
}

export function trackPageview(label?: string) {
  track({ type: "pageview", label });
}

export function trackScroll(depth: number) {
  track({ type: "scroll", value: Math.round(depth) });
}

export function trackClick(label: string, meta?: Record<string, unknown>) {
  track({ type: "click", label, meta });
}

export function trackSearch(q: string) {
  track({ type: "search", label: q.slice(0, 120) });
}

export function trackCartAdd(product: { slug: string; name: string; price: number }) {
  track({ type: "cart_add", label: product.slug, value: product.price, meta: { name: product.name } });
}

export function trackCartRemove(slug: string) {
  track({ type: "cart_remove", label: slug });
}

export function trackCheckout(total: number, count: number) {
  track({ type: "checkout_whatsapp", value: total, meta: { items: count } });
}

/** Browsing history kept on the visitor cookie domain (localStorage list of slugs). */
const HISTORY_KEY = "crescent_history";

export function pushHistory(slug: string, category?: string) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const list: { slug: string; category?: string; at: number }[] = raw ? JSON.parse(raw) : [];
    const next = [{ slug, category, at: Date.now() }, ...list.filter((x) => x.slug !== slug)].slice(0, 24);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    /* private mode etc. */
  }
}

export function readHistory(): { slug: string; category?: string; at: number }[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
