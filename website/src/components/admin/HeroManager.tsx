"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { HeroMediaItem } from "@/lib/types";
import { api } from "@/lib/api";

interface PexelsSample {
  id: string;
  url: string;
  preview: string;
  credit: string;
  duration: number;
}

export function HeroManager({
  initialMedia,
  pexelsConfigured,
}: {
  initialMedia: HeroMediaItem[];
  pexelsConfigured: boolean;
}) {
  const router = useRouter();
  const [media, setMedia] = useState<HeroMediaItem[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [samples, setSamples] = useState<PexelsSample[] | null>(null);
  const [query, setQuery] = useState("furniture workshop wood");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function save(next: HeroMediaItem[]) {
    setMedia(next);
    const res = await fetch(api("/api/") + "admin/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ media: next }),
    });
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    }
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...media];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    save(next);
  }

  async function upload(file: File) {
    setUploading(true);
    setUploadError("");
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch(api("/api/") + "admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, filename: file.name }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Upload failed");
      await save([
        ...media,
        { id: j.media.id, type: j.media.type, url: j.media.url, credit: undefined, addedAt: new Date() },
      ]);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function search() {
    setSearching(true);
    setSearchError("");
    try {
      const res = await fetch(api("/api/") + `admin/hero?q=${encodeURIComponent(query)}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      setSamples(j.videos);
    } catch (e) {
      setSearchError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setSearching(false);
    }
  }

  function addSample(s: PexelsSample) {
    if (media.some((m) => m.url === s.url)) return;
    save([
      ...media,
      { id: `px-${s.id}`, type: "video", url: s.url, credit: s.credit, addedAt: new Date() },
    ]);
  }

  return (
    <div className="mt-8 grid max-w-5xl gap-8 xl:grid-cols-[1fr_360px]">
      {/* Playlist */}
      <section className="panel-c p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-sand text-cream">
            Playlist ({media.length})
          </h2>
          {saved ? <p className="text-[14px] font-medium text-terra">Saved ✓</p> : null}
        </div>

        {media.length === 0 ? (
          <p className="mt-4 text-[15px] text-sand">
            Empty — the home page falls back to a maroon hero. Add a video below.
          </p>
        ) : (
          <ol className="mt-4 space-y-3">
            {media.map((m, i) => (
              <li key={m.id} className="flex items-center gap-3 rounded-card border border-line p-3">
                <span className="w-6 text-center font-display text-[13px] font-bold text-sand">
                  {i + 1}
                </span>
                <div className="h-14 w-24 shrink-0 overflow-hidden rounded-btn bg-walnut-2">
                  {m.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <video src={m.url} muted className="h-full w-full object-cover" preload="metadata" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14.5px] font-medium text-sand">{m.type === "video" ? "Video" : "Image"} · {m.url.split("/").pop()}</p>
                  {m.credit ? <p className="truncate text-[12.5px] text-sand">{m.credit}</p> : null}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <IconBtn label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>↑</IconBtn>
                  <IconBtn label="Move down" onClick={() => move(i, 1)} disabled={i === media.length - 1}>↓</IconBtn>
                  <IconBtn
                    label="Remove"
                    onClick={() => {
                      if (!confirm("Remove this clip from the hero playlist?")) return;
                      save(media.filter((_, x) => x !== i));
                    }}
                  >
                    ×
                  </IconBtn>
                </div>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-6 border-t border-line pt-5">
          <label className="btn btn-secondary cursor-pointer">
            {uploading ? "Uploading…" : "Upload video or image"}
            <input
              ref={fileRef}
              type="file"
              accept="video/*,image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
          </label>
          {uploadError ? (
            <p className="mt-2 rounded-btn bg-terra-veil px-3 py-2 text-[14px] text-terra">
              {uploadError}
            </p>
          ) : null}
          <p className="mt-2 text-[13px] text-sand">Up to 60 MB. MP4 recommended for videos.</p>
        </div>
      </section>

      {/* Pexels samples */}
      <section className="panel-c h-fit p-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-sand text-cream">
          Pexels samples
        </h2>
        {!pexelsConfigured ? (
          <p className="mt-3 text-[14.5px] text-sand">
            PEXELS_API is not set in the environment — add it to <code>.env</code> to search samples.
          </p>
        ) : (
          <>
            <div className="mt-4 flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-c flex-1"
                placeholder="carpentry, workshop…"
                onKeyDown={(e) => e.key === "Enter" && search()}
              />
              <button type="button" onClick={search} disabled={searching} className="btn btn-primary btn-sm shrink-0">
                {searching ? "…" : "Search"}
              </button>
            </div>
            {searchError ? <p className="mt-2 text-[14px] text-terra">{searchError}</p> : null}

            {samples ? (
              <ul className="mt-4 max-h-[480px] space-y-3 overflow-y-auto pr-1">
                {samples.map((s) => {
                  const added = media.some((m) => m.url === s.url);
                  return (
                    <li key={s.id} className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.preview} alt="" className="h-14 w-24 shrink-0 rounded-btn object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] text-sand">{s.credit}</p>
                        <p className="text-[12.5px] text-sand">{s.duration}s</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addSample(s)}
                        disabled={added}
                        className="btn btn-ghost btn-sm shrink-0"
                      >
                        {added ? "Added" : "Add"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 text-[14.5px] text-sand">
                Search Pexels and add sample clips — useful while the workshop&rsquo;s own footage is
                being filmed.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-8 w-8 place-items-center rounded-btn border border-line text-[15px] text-cream transition-colors hover:border-terra hover:text-terra disabled:opacity-30"
    >
      {children}
    </button>
  );
}
