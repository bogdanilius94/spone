import type { Tables } from "@/types/supabase";

export type GlobalSettings = Tables<"global_settings">;
export type SocialLink = Tables<"social_links">;
export type ReleaseItem = Tables<"releases">;
export type GalleryItem = Tables<"gallery_items">;
export type MusicVideo = Tables<"music_videos">;

export type PublicContent = {
  settings: GlobalSettings;
  links: SocialLink[];
  releases: ReleaseItem[];
  gallery: GalleryItem[];
  videos: MusicVideo[];
};

export const defaultSettings: GlobalSettings = {
  id: 1,
  artist_name: "NIGHT RIOT",
  artist_font_family: "bebas",
  accent_color: "#3BFFB3",
  show_quick_links: true,
  show_biography: true,
  show_discography: true,
  show_gallery: true,
  show_videos: true,
  show_qr_widget: true,
  show_audio_player: true,
  hero_background_url:
    "https://images.unsplash.com/photo-1517230878791-4d28214057c2?auto=format&fit=crop&w=1600&q=80",
  hero_background_blur: false,
  hero_video_url: null,
  featured_song_title: "Midnight Cipher",
  featured_song_stream_url: "https://open.spotify.com/",
  featured_song_audio_url: null,
  bio_text:
    "NIGHT RIOT bends trap drums, old-school cadence, and cinematic textures into live-wire storytelling built for dark stages and late-night drives.",
  bio_portrait_url:
    "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=900&q=80",
  updated_at: new Date().toISOString(),
};

export const fallbackContent: PublicContent = {
  settings: defaultSettings,
  links: [
    {
      id: "demo-link-spotify",
      platform: "spotify",
      label: "Spotify",
      url: "https://open.spotify.com/",
      order_index: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-link-apple",
      platform: "apple_music",
      label: "Apple Music",
      url: "https://music.apple.com/",
      order_index: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-link-youtube",
      platform: "youtube",
      label: "YouTube",
      url: "https://www.youtube.com/",
      order_index: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-link-instagram",
      platform: "instagram",
      label: "Instagram",
      url: "https://instagram.com/",
      order_index: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-link-tiktok",
      platform: "tiktok",
      label: "TikTok",
      url: "https://www.tiktok.com/",
      order_index: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  releases: [
    {
      id: "demo-release-1",
      title: "Midnight Cipher",
      cover_url:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=700&q=80",
      listen_url: "https://open.spotify.com/",
      release_date: "2026-02-20",
      order_index: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-release-2",
      title: "Chrome Dreams",
      cover_url:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=700&q=80",
      listen_url: "https://music.apple.com/",
      release_date: "2025-11-01",
      order_index: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  gallery: [
    {
      id: "demo-gallery-1",
      image_url:
        "https://images.unsplash.com/photo-1461784180009-21121b2f204c?auto=format&fit=crop&w=900&q=80",
      caption: "Backstage",
      order_index: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-gallery-2",
      image_url:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
      caption: "Live in Budapest",
      order_index: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-gallery-3",
      image_url:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80",
      caption: "Tour moments",
      order_index: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  videos: [
    {
      id: "demo-video-1",
      title: "Midnight Cipher - Official Video",
      platform: "youtube",
      video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      order_index: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

export const artistFontOptions = [
  { value: "bebas", label: "Bebas Neue" },
  { value: "teko", label: "Teko" },
  { value: "orbitron", label: "Orbitron" },
  { value: "anton", label: "Anton" },
  { value: "blackops", label: "Black Ops One" },
  { value: "russo", label: "Russo One" },
  { value: "space", label: "Space Grotesk" },
] as const;

