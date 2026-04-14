import { cache } from "react";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  defaultSettings,
  fallbackContent,
  type PublicContent,
} from "@/types/content";

const loadContent = cache(async (): Promise<PublicContent> => {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return fallbackContent;
  }

  const [settingsResult, linksResult, releasesResult, galleryResult, videosResult] =
    await Promise.all([
      supabase.from("global_settings").select("*").eq("id", 1).maybeSingle(),
      supabase
        .from("social_links")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase
        .from("releases")
        .select("*")
        .order("order_index", { ascending: true })
        .order("release_date", { ascending: false, nullsFirst: false }),
      supabase
        .from("gallery_items")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase
        .from("music_videos")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false }),
    ]);

  return {
    settings: {
      ...defaultSettings,
      ...(settingsResult.data ?? {}),
    },
    links: linksResult.data ?? fallbackContent.links,
    releases: releasesResult.data ?? fallbackContent.releases,
    gallery: galleryResult.data ?? fallbackContent.gallery,
    videos: videosResult.data ?? fallbackContent.videos,
  };
});

export async function getPublicContent() {
  return loadContent();
}

export async function getAdminContent() {
  return loadContent();
}

