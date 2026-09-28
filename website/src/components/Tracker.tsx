"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track, trackPageview, trackScroll, trackClick } from "@/lib/track";

/**
 * Mounts once in the storefront layout. Emits:
 *  - pageview per route change
 *  - deepest scroll % per page (on unload / route change)
 *  - dwell time per page (seconds)
 *  - delegated click tracking for links & buttons with data-track labels
 */
export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    const start = Date.now();
    let deepest = 0;

    trackPageview();

    function measure() {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.round((window.scrollY / max) * 100));
      if (pct > deepest) deepest = pct;
    }

    function onScroll() {
      measure();
    }

    function send() {
      measure();
      if (deepest > 0) trackScroll(deepest);
      const dwell = Math.round((Date.now() - start) / 1000);
      if (dwell >= 5) {
        track({ type: "dwell", value: dwell });
      }
    }

    // Final readings when leaving the page or navigating within
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", send, { once: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", send);
      send();
    };
  }, [pathname]);

  // Delegated clicks: any element with [data-track] reports its label
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement)?.closest?.("[data-track]");
      if (!el) return;
      const label = el.getAttribute("data-track");
      if (label) trackClick(label);
    }
    document.addEventListener("click", onClick, { passive: true });
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
