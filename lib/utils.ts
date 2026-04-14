import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function resolveArtistFontClass(fontFamily?: string | null) {
  switch (fontFamily) {
    case "teko":
      return "artist-font-teko";
    case "orbitron":
      return "artist-font-orbitron";
    case "anton":
      return "artist-font-anton";
    case "blackops":
      return "artist-font-blackops";
    case "russo":
      return "artist-font-russo";
    case "space":
      return "artist-font-space";
    default:
      return "artist-font-bebas";
  }
}

export function getEmbedVideoUrl(videoUrl: string, platform: "youtube" | "vimeo") {
  if (platform === "vimeo") {
    const vimeoMatch = videoUrl.match(/(?:vimeo\.com\/)(\d+)/i);
    return vimeoMatch ? `https://player.vimeo.com/video/${vimeoMatch[1]}` : videoUrl;
  }

  const youtubeMatch = videoUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
  );

  return youtubeMatch
    ? `https://www.youtube.com/embed/${youtubeMatch[1]}`
    : videoUrl;
}

export function hexToRgba(hexColor: string, alpha = 1) {
  const sanitized = hexColor.replace("#", "");
  const isShort = sanitized.length === 3;
  const expanded = isShort
    ? sanitized
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : sanitized;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    return `rgba(59, 255, 179, ${alpha})`;
  }

  const int = Number.parseInt(expanded, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    const data = (await response.json()) as T;
    return data;
  } catch {
    return null;
  }
}

