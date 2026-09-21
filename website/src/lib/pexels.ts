// Pexels API helpers for hero video samples (server-side use only)

const API = "https://api.pexels.com";

interface PexelsVideoFile {
  link: string;
  quality: string;
  width?: number;
  height?: number;
  file_type?: string;
}

interface PexelsVideo {
  id: number;
  url: string;
  image: string;
  duration: number;
  user: { name: string };
  video_files: PexelsVideoFile[];
}

export interface SampleVideo {
  id: string;
  url: string;
  preview: string;
  credit: string;
  duration: number;
}

export function pexelsKey(): string | undefined {
  return process.env.PEXELS_API;
}

export async function searchPexelsVideos(query: string, perPage = 10): Promise<SampleVideo[]> {
  const key = pexelsKey();
  if (!key) throw new Error("PEXELS_API is not configured");

  const res = await fetch(
    `${API}/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
    { headers: { Authorization: key }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Pexels search failed: ${res.status}`);

  const data = (await res.json()) as { videos?: PexelsVideo[] };
  const videos = data.videos ?? [];

  return videos
    .map((v) => {
      // Prefer an mp4 near 1600px wide — good quality, sane bitrate for a hero loop
      const mp4s = v.video_files.filter((f) => (f.file_type ?? "video/mp4").includes("mp4"));
      const pool = mp4s.length ? mp4s : v.video_files;
      const best = [...pool].sort(
        (a, b) => Math.abs((a.width ?? 0) - 1600) - Math.abs((b.width ?? 0) - 1600),
      )[0];
      return {
        id: String(v.id),
        url: best?.link ?? "",
        preview: v.image,
        credit: `Video by ${v.user.name} on Pexels`,
        duration: v.duration,
      };
    })
    .filter((v) => v.url);
}

export async function searchPexelsPhotos(query: string, perPage = 12) {
  const key = pexelsKey();
  if (!key) throw new Error("PEXELS_API is not configured");

  const res = await fetch(
    `${API}/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
    { headers: { Authorization: key }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Pexels photo search failed: ${res.status}`);

  const data = (await res.json()) as {
    photos?: {
      id: number;
      src: { large2x: string; large: string };
      photographer: string;
      url: string;
    }[];
  };

  return (data.photos ?? []).map((p) => ({
    id: String(p.id),
    url: p.src.large2x || p.src.large,
    credit: `Photo by ${p.photographer} on Pexels`,
  }));
}
