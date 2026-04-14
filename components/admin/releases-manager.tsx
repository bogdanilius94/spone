"use client";

import { useState } from "react";

import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { uploadPublicFile } from "@/components/admin/storage";
import type { BrowserSupabase } from "@/components/admin/types";
import type { ReleaseItem } from "@/types/content";

type ReleasesManagerProps = {
  releases: ReleaseItem[];
  supabase: BrowserSupabase;
  onChange: (releases: ReleaseItem[]) => void;
};

export function ReleasesManager({
  releases,
  supabase,
  onChange,
}: ReleasesManagerProps) {
  const [items, setItems] = useState<ReleaseItem[]>(releases);
  const [status, setStatus] = useState<string | null>(null);
  const [newCover, setNewCover] = useState<File | null>(null);
  const [rowCovers, setRowCovers] = useState<Record<string, File | null>>({});
  const [draft, setDraft] = useState({
    title: "",
    listen_url: "",
    cover_url: "",
    release_date: "",
    order_index: items.length + 1,
  });

  const sync = (next: ReleaseItem[]) => {
    const sorted = [...next].sort((a, b) => a.order_index - b.order_index);
    setItems(sorted);
    onChange(sorted);
  };

  const createRelease = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    try {
      let coverUrl = draft.cover_url || null;

      if (newCover) {
        coverUrl = await uploadPublicFile(supabase, "release-covers", newCover, "covers");
      }

      const { data, error } = await supabase
        .from("releases")
        .insert({
          title: draft.title,
          listen_url: draft.listen_url,
          cover_url: coverUrl,
          release_date: draft.release_date || null,
          order_index: draft.order_index,
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      sync([...items, data]);
      setDraft({
        title: "",
        listen_url: "",
        cover_url: "",
        release_date: "",
        order_index: items.length + 2,
      });
      setNewCover(null);
      setStatus("Release added.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to add release.");
    }
  };

  const updateRelease = async (release: ReleaseItem) => {
    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    try {
      let coverUrl = release.cover_url;
      const rowFile = rowCovers[release.id];

      if (rowFile) {
        coverUrl = await uploadPublicFile(supabase, "release-covers", rowFile, "covers");
      }

      const { data, error } = await supabase
        .from("releases")
        .update({
          title: release.title,
          listen_url: release.listen_url,
          cover_url: coverUrl,
          release_date: release.release_date,
          order_index: release.order_index,
        })
        .eq("id", release.id)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      sync(items.map((item) => (item.id === release.id ? data : item)));
      setRowCovers((prev) => ({ ...prev, [release.id]: null }));
      setStatus("Release updated.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to update release.");
    }
  };

  const removeRelease = async (id: string) => {
    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    const { error } = await supabase.from("releases").delete().eq("id", id);

    if (error) {
      setStatus(error.message);
      return;
    }

    sync(items.filter((item) => item.id !== id));
    setStatus("Release deleted.");
  };

  return (
    <AdminSectionCard
      title="Discography"
      description="Add songs/albums with cover art and listening links."
    >
      <form onSubmit={createRelease} className="grid gap-3 rounded-xl border border-zinc-700/60 p-4 sm:grid-cols-2">
        <input
          value={draft.title}
          onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Title"
          className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
          required
        />
        <input
          value={draft.listen_url}
          onChange={(event) => setDraft((prev) => ({ ...prev, listen_url: event.target.value }))}
          placeholder="Listen URL"
          className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
          required
        />
        <input
          value={draft.cover_url}
          onChange={(event) => setDraft((prev) => ({ ...prev, cover_url: event.target.value }))}
          placeholder="Cover URL (optional)"
          className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setNewCover(event.target.files?.[0] ?? null)}
          className="text-sm text-zinc-300"
        />
        <input
          type="date"
          value={draft.release_date}
          onChange={(event) => setDraft((prev) => ({ ...prev, release_date: event.target.value }))}
          className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
        />
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={draft.order_index}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, order_index: Number(event.target.value) }))
            }
            className="w-28 rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
          />
          <button className="btn-primary rounded-lg px-4 py-2 text-sm">
            Add Release
          </button>
        </div>
      </form>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="grid gap-2 rounded-xl border border-zinc-700/60 p-3 sm:grid-cols-2">
            <input
              value={item.title}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((release) =>
                    release.id === item.id
                      ? {
                          ...release,
                          title: event.target.value,
                        }
                      : release,
                  ),
                )
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
            />
            <input
              value={item.listen_url}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((release) =>
                    release.id === item.id
                      ? {
                          ...release,
                          listen_url: event.target.value,
                        }
                      : release,
                  ),
                )
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
            />
            <input
              value={item.cover_url ?? ""}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((release) =>
                    release.id === item.id
                      ? {
                          ...release,
                          cover_url: event.target.value,
                        }
                      : release,
                  ),
                )
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
              placeholder="Cover URL"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setRowCovers((prev) => ({
                  ...prev,
                  [item.id]: event.target.files?.[0] ?? null,
                }))
              }
              className="text-sm text-zinc-300"
            />
            <input
              type="date"
              value={item.release_date ?? ""}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((release) =>
                    release.id === item.id
                      ? {
                          ...release,
                          release_date: event.target.value,
                        }
                      : release,
                  ),
                )
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={item.order_index}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((release) =>
                    release.id === item.id
                      ? {
                          ...release,
                          order_index: Number(event.target.value),
                        }
                      : release,
                  ),
                )
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
            />
            <div className="sm:col-span-2 flex gap-2">
              <button
                type="button"
                onClick={() => updateRelease(item)}
                className="rounded-lg border border-zinc-600 px-3 py-2 text-xs uppercase tracking-[0.14em] text-zinc-200"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => removeRelease(item.id)}
                className="rounded-lg border border-red-500/50 px-3 py-2 text-xs uppercase tracking-[0.14em] text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {status ? <p className="mt-3 text-xs text-zinc-300">{status}</p> : null}
    </AdminSectionCard>
  );
}

