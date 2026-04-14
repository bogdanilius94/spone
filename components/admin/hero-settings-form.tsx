"use client";

import { useState } from "react";

import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { uploadPublicFile } from "@/components/admin/storage";
import type { BrowserSupabase } from "@/components/admin/types";
import { artistFontOptions, type GlobalSettings } from "@/types/content";

type HeroSettingsFormProps = {
  settings: GlobalSettings;
  supabase: BrowserSupabase;
  onSaved: (settings: GlobalSettings) => void;
};

export function HeroSettingsForm({
  settings,
  supabase,
  onSaved,
}: HeroSettingsFormProps) {
  const [form, setForm] = useState<GlobalSettings>(settings);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [portraitFile, setPortraitFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const updateField = <K extends keyof GlobalSettings>(
    key: K,
    value: GlobalSettings[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    try {
      setIsSaving(true);
      setStatus(null);

      const payload: Partial<GlobalSettings> = {
        ...form,
        id: 1,
      };

      if (backgroundFile) {
        payload.hero_background_url = await uploadPublicFile(
          supabase,
          "hero-assets",
          backgroundFile,
          "hero-bg",
        );
      }

      if (portraitFile) {
        payload.bio_portrait_url = await uploadPublicFile(
          supabase,
          "hero-assets",
          portraitFile,
          "portraits",
        );
      }

      if (audioFile) {
        payload.featured_song_audio_url = await uploadPublicFile(
          supabase,
          "audio-snippets",
          audioFile,
          "snippets",
        );
      }

      const { data, error } = await supabase
        .from("global_settings")
        .upsert(payload)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setForm(data);
        onSaved(data);
      }

      setBackgroundFile(null);
      setPortraitFile(null);
      setAudioFile(null);
      setStatus("Hero and bio settings updated.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminSectionCard
      title="Hero + Bio"
      description="Control artist identity, visuals, featured track, and biography text."
    >
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Artist Name</span>
          <input
            value={form.artist_name}
            onChange={(event) => updateField("artist_name", event.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Display Font</span>
          <select
            value={form.artist_font_family}
            onChange={(event) => updateField("artist_font_family", event.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
          >
            {artistFontOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Accent Color</span>
          <input
            value={form.accent_color}
            onChange={(event) => updateField("accent_color", event.target.value)}
            className="h-10 w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
            type="color"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Featured Song Title</span>
          <input
            value={form.featured_song_title}
            onChange={(event) => updateField("featured_song_title", event.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Featured Song Stream URL</span>
          <input
            value={form.featured_song_stream_url ?? ""}
            onChange={(event) => updateField("featured_song_stream_url", event.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
            placeholder="https://open.spotify.com/..."
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Hero Background URL</span>
          <input
            value={form.hero_background_url ?? ""}
            onChange={(event) => updateField("hero_background_url", event.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </label>

        <label className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/40 px-3 py-2 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.hero_background_blur}
            onChange={(event) => updateField("hero_background_blur", event.target.checked)}
          />
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-300">
            Blur Hero Background Image
          </span>
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Hero Video Loop URL (optional)</span>
          <input
            value={form.hero_video_url ?? ""}
            onChange={(event) => updateField("hero_video_url", event.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </label>

        <fieldset className="rounded-xl border border-zinc-700/70 p-3 sm:col-span-2">
          <legend className="px-1 text-xs uppercase tracking-[0.16em] text-zinc-300">
            Section Visibility
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={form.show_quick_links}
                onChange={(event) => updateField("show_quick_links", event.target.checked)}
              />
              Show Quick Links
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={form.show_biography}
                onChange={(event) => updateField("show_biography", event.target.checked)}
              />
              Show Biography
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={form.show_discography}
                onChange={(event) => updateField("show_discography", event.target.checked)}
              />
              Show Discography
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={form.show_gallery}
                onChange={(event) => updateField("show_gallery", event.target.checked)}
              />
              Show Gallery
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={form.show_videos}
                onChange={(event) => updateField("show_videos", event.target.checked)}
              />
              Show Videos
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={form.show_qr_widget}
                onChange={(event) => updateField("show_qr_widget", event.target.checked)}
              />
              Show QR Widget
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-300 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.show_audio_player}
                onChange={(event) => updateField("show_audio_player", event.target.checked)}
              />
              Show Audio Snippet Player
            </label>
          </div>
        </fieldset>

        <label className="space-y-1">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Upload Hero Background</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setBackgroundFile(event.target.files?.[0] ?? null)}
            className="w-full text-sm text-zinc-300"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Upload Audio Snippet</span>
          <input
            type="file"
            accept="audio/*"
            onChange={(event) => setAudioFile(event.target.files?.[0] ?? null)}
            className="w-full text-sm text-zinc-300"
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Bio Text</span>
          <textarea
            value={form.bio_text}
            onChange={(event) => updateField("bio_text", event.target.value)}
            className="min-h-28 w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Bio Portrait URL</span>
          <input
            value={form.bio_portrait_url ?? ""}
            onChange={(event) => updateField("bio_portrait_url", event.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Upload Bio Portrait</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setPortraitFile(event.target.files?.[0] ?? null)}
            className="w-full text-sm text-zinc-300"
          />
        </label>

        <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary rounded-xl px-4 py-2 text-sm transition"
          >
            {isSaving ? "Saving..." : "Save Hero + Bio"}
          </button>
          {status ? <p className="text-xs text-zinc-300">{status}</p> : null}
        </div>
      </form>
    </AdminSectionCard>
  );
}

