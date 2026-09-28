"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export interface CarouselCard {
  href: string;
  name: string;
  image?: string;
  eyebrow?: string;
  tagline: string;
}

/**
 * The kept carousel (rooms gallery): full-width editorial slideshow with
 * autoplay, arrows, dots, swipe, hover-pause, reduced-motion respect —
 * reskinned to the h.html language: square corners, hairline controls,
 * Fraunces captions, uppercase enquire link.
 */
export function CategoryCarousel({ cards }: { cards: CarouselCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const slideCount = cards.length;

  const scrollTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = ((i % slideCount) + slideCount) % slideCount; // wrap both ways
      track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    },
    [slideCount],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      setActive(Math.max(0, Math.min(i, slideCount - 1)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [slideCount]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || slideCount < 2) return;
    const id = window.setInterval(() => scrollTo(active + 1), 5000);
    return () => window.clearInterval(id);
  }, [active, paused, reducedMotion, scrollTo, slideCount]);

  if (slideCount === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        role="region"
        aria-roledescription="carousel"
        aria-label="Rooms and collections"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          const end = e.changedTouches[0]?.clientX;
          touchStartX.current = null;
          if (start === null || end === undefined) return;
          const dx = end - start;
          if (Math.abs(dx) > 48) scrollTo(active + (dx < 0 ? 1 : -1));
        }}
      >
        {cards.map((c, i) => (
          <Link
            key={c.href + c.name}
            href={c.href}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slideCount}: ${c.name}`}
            className="group relative block h-[400px] w-full shrink-0 snap-center sm:h-[460px] lg:h-[540px]"
          >
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.image}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 h-full w-full object-cover ${
                  i === active && !reducedMotion
                    ? "scale-[1.04] transition-transform duration-[6000ms] ease-out"
                    : "scale-100 transition-transform duration-700"
                }`}
              />
            ) : (
              <div className="absolute inset-0 bg-bone" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#171009]/90 via-[#171009]/30 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-7 sm:p-10">
              <div className="max-w-xl">
                {c.eyebrow ? (
                  <p className="font-detail text-[10.5px] font-medium uppercase tracking-[0.26em] text-cream/75">
                    {c.eyebrow}
                  </p>
                ) : null}
                <h3 className="mt-2 font-display text-[30px] font-[380] leading-[1.1] text-cream sm:text-[42px]">
                  {c.name}
                </h3>
                <p className="mt-3 max-w-md font-body text-[14.5px] font-light leading-relaxed text-mutd sm:text-[16px]">
                  {c.tagline}
                </p>
              </div>
              <span className="lnk online pointer-events-none">
                Enquire <i>→</i>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Controls: hairline arrows + underline dots */}
      <div className="mt-7 flex items-center justify-center gap-7">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => scrollTo(active - 1)}
          className="pg"
        >
          ← Prev
        </button>
        <div className="flex items-center gap-2.5">
          {cards.map((c, i) => (
            <button
              key={c.href + c.name}
              type="button"
              aria-label={`Go to slide ${i + 1}: ${c.name}`}
              aria-current={i === active}
              onClick={() => scrollTo(i)}
              className={`pg ${i === active ? "on" : ""}`}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => scrollTo(active + 1)}
          className="pg"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
