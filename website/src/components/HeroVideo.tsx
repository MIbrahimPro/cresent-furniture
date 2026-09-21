"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroMediaItem } from "@/lib/types";

/**
 * Plays hero media in order, then loops back to the first item.
 * Videos are muted + playsInline so browsers autoplay them.
 */
export function HeroVideo({ media }: { media: HeroMediaItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = media.length ? media[index % media.length] : undefined;

  // Play / pause and restart when the active item changes
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) {
      v.pause();
    } else {
      v.play().catch(() => {
        /* autoplay blocked — overlay and heading still render */
      });
    }
  }, [index, paused, current?.url]);

  function handleEnded() {
    // Advance to the next clip; when there is only one, the video loops natively
    if (media.length > 1) setIndex((i) => (i + 1) % media.length);
  }

  return (
    <section
      className="relative h-[92vh] min-h-[580px] w-full overflow-hidden bg-deep"
      aria-label="Crescent workshop film"
    >
      {/* Background layer */}
      {current ? (
        current.type === "video" ? (
          <video
            key={current.url}
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={current.url}
            autoPlay
            muted
            loop={media.length === 1}
            playsInline
            preload="metadata"
            onEnded={handleEnded}
            aria-hidden
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden
          />
        )
      ) : null}

      {/* Deep gradient scrim for legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-deep/70 via-deep/35 to-deep"
        aria-hidden
      />

      {/* Heading and actions sit above the overlay */}
      <div className="container-c relative z-10 flex h-full flex-col items-center justify-center pb-20 text-center">
        <p className="overline-c text-brass">Rawalpindi · Bespoke Furniture House</p>
        <h1 className="display-c mt-6 max-w-3xl text-[42px] text-cream sm:text-[60px] lg:text-[72px]">
          Furniture that <span className="accent-i">breathes.</span>
        </h1>
        <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-sand sm:text-[19px]">
          Drawn in the workshop, jointed by hand, and finished to live with you. Every Crescent
          piece is made to order from seasoned hardwood.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="/shop" className="btn btn-primary">
            Explore the Collection
          </a>
          <a href="/bespoke" className="btn btn-secondary">
            Commission a Piece
          </a>
        </div>
        {current?.credit ? (
          <p className="absolute bottom-4 right-5 z-10 hidden text-[11px] text-sand/50 sm:block">
            {current.credit}
          </p>
        ) : null}
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex" aria-hidden>
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sand/50">Scroll</span>
        <span className="scroll-cue h-10 w-px bg-gradient-to-b from-terra to-transparent" />
      </div>

      {/* Pause / play control for the background film */}
      {current?.type === "video" ? (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play background video" : "Pause background video"}
          className="absolute bottom-5 left-5 z-20 grid h-11 w-11 place-items-center rounded-full border border-line-strong text-cream transition-colors hover:bg-cream/10"
        >
          {paused ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7L8 5Z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
            </svg>
          )}
        </button>
      ) : null}
    </section>
  );
}
