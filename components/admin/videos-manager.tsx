"use client";

import { useState } from "react";

import { AdminSectionCard } from "@/components/admin/admin-section-card";
import type { BrowserSupabase } from "@/components/admin/types";
import type { MusicVideo } from "@/types/content";
import type { Database } from "@/types/supabase";

type VideoPlatform = Database["public"]["Enums"]["video_platform"];

type VideosManagerProps = {
  videos: MusicVideo[];
  supabase: BrowserSupabase;
  onChange: (videos: MusicVideo[]) => void;
};

export function VideosManager({ videos, supabase, onChange }: VideosManagerProps) {
  const [items, setItems] = useState(videos);
  const [status, setStatus] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    title: "",
    video_url: "",
    platform: "youtube" as VideoPlatform,
    order_index: items.length + 1,
  });

  const sync = (next: MusicVideo[]) => {
    const sorted = [...next].sort((a, b) => a.order_index - b.order_index);
    setItems(sorted);
    onChange(sorted);
  };

  const createVideo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    const { data, error } = await supabase
      .from("music_videos")
      .insert(draft)
      .select("*")
      .single();

    if (error) {
      setStatus(error.message);
      return;
    }

    sync([...items, data]);
    setDraft({
      title: "",
      video_url: "",
      platform: "youtube",
      order_index: items.length + 2,
    });
    setStatus("Video added.");
  };

  const updateVideo = async (video: MusicVideo) => {
    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    const { data, error } = await supabase
      .from("music_videos")
      .update({
        title: video.title,
        video_url: video.video_url,
        platform: video.platform,
        order_index: video.order_index,
      })
      .eq("id", video.id)
      .select("*")
      .single();

    if (error) {
      setStatus(error.message);
      return;
    }

    sync(items.map((entry) => (entry.id === video.id ? data : entry)));
    setStatus("Video updated.");
  };

  const deleteVideo = async (id: string) => {
    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    const { error } = await supabase.from("music_videos").delete().eq("id", id);

    if (error) {
      setStatus(error.message);
      return;
    }

    sync(items.filter((entry) => entry.id !== id));
    setStatus("Video deleted.");
  };

  return (
    <AdminSectionCard
      title="Music Videos"
      description="Paste YouTube/Vimeo links or IDs for the public video section."
    >
      <form onSubmit={createVideo} className="grid gap-3 rounded-xl border border-zinc-700/60 p-4 sm:grid-cols-[1.4fr_1.6fr_0.8fr_0.5fr_auto]">
        <input
          value={draft.title}
          onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Title"
          className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
          required
        />
        <input
          value={draft.video_url}
          onChange={(event) => setDraft((prev) => ({ ...prev, video_url: event.target.value }))}
          placeholder="https://youtube.com/watch?v=..."
          className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
          required
        />
        <select
          value={draft.platform}
          onChange={(event) =>
            setDraft((prev) => ({
              ...prev,
              platform: event.target.value as VideoPlatform,
            }))
          }
          className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
        </select>
        <input
          type="number"
          value={draft.order_index}
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, order_index: Number(event.target.value) }))
          }
          className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
        />
        <button className="btn-primary rounded-lg px-4 py-2 text-sm">
          Add
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {items.map((video) => (
          <div key={video.id} className="grid gap-2 rounded-xl border border-zinc-700/60 p-3 sm:grid-cols-[1fr_1.4fr_0.7fr_0.45fr_auto_auto]">
            <input
              value={video.title}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((entry) =>
                    entry.id === video.id ? { ...entry, title: event.target.value } : entry,
                  ),
                )
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-2 py-2 text-sm"
            />
            <input
              value={video.video_url}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((entry) =>
                    entry.id === video.id ? { ...entry, video_url: event.target.value } : entry,
                  ),
                )
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-2 py-2 text-sm"
            />
            <select
              value={video.platform}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((entry) =>
                    entry.id === video.id
                      ? { ...entry, platform: event.target.value as VideoPlatform }
                      : entry,
                  ),
                )
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-2 py-2 text-sm"
            >
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
            </select>
            <input
              type="number"
              value={video.order_index}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((entry) =>
                    entry.id === video.id
                      ? { ...entry, order_index: Number(event.target.value) }
                      : entry,
                  ),
                )
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-2 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => updateVideo(video)}
              className="rounded-lg border border-zinc-600 px-3 py-2 text-xs uppercase tracking-[0.14em] text-zinc-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => deleteVideo(video.id)}
              className="rounded-lg border border-red-500/50 px-3 py-2 text-xs uppercase tracking-[0.14em] text-red-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {status ? <p className="mt-3 text-xs text-zinc-300">{status}</p> : null}
    </AdminSectionCard>
  );
}

