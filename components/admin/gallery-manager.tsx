"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { uploadPublicFile } from "@/components/admin/storage";
import type { BrowserSupabase } from "@/components/admin/types";
import type { GalleryItem } from "@/types/content";

type GalleryManagerProps = {
  items: GalleryItem[];
  supabase: BrowserSupabase;
  onChange: (items: GalleryItem[]) => void;
};

export function GalleryManager({ items, supabase, onChange }: GalleryManagerProps) {
  const [gallery, setGallery] = useState(items);
  const [status, setStatus] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [draft, setDraft] = useState({
    caption: "",
    image_url: "",
    order_index: gallery.length + 1,
  });

  const sync = (next: GalleryItem[]) => {
    const sorted = [...next].sort((a, b) => a.order_index - b.order_index);
    setGallery(sorted);
    onChange(sorted);
  };

  const createItem = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    try {
      let imageUrl = draft.image_url;

      if (newImage) {
        imageUrl = await uploadPublicFile(supabase, "gallery-images", newImage, "gallery");
      }

      if (!imageUrl) {
        setStatus("Provide image URL or upload a file.");
        return;
      }

      const { data, error } = await supabase
        .from("gallery_items")
        .insert({
          image_url: imageUrl,
          caption: draft.caption,
          order_index: draft.order_index,
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      sync([...gallery, data]);
      setDraft({ caption: "", image_url: "", order_index: gallery.length + 2 });
      setNewImage(null);
      setStatus("Gallery image added.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to add image.");
    }
  };

  const updateItem = async (item: GalleryItem) => {
    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    const { data, error } = await supabase
      .from("gallery_items")
      .update({
        caption: item.caption,
        image_url: item.image_url,
        order_index: item.order_index,
      })
      .eq("id", item.id)
      .select("*")
      .single();

    if (error) {
      setStatus(error.message);
      return;
    }

    sync(gallery.map((entry) => (entry.id === item.id ? data : entry)));
    setStatus("Gallery image updated.");
  };

  const deleteItem = async (id: string) => {
    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    const { error } = await supabase.from("gallery_items").delete().eq("id", id);

    if (error) {
      setStatus(error.message);
      return;
    }

    sync(gallery.filter((entry) => entry.id !== id));
    setStatus("Gallery image deleted.");
  };

  return (
    <AdminSectionCard
      title="Gallery"
      description="Upload and curate media in the masonry gallery."
    >
      <form onSubmit={createItem} className="grid gap-3 rounded-xl border border-zinc-700/60 p-4 sm:grid-cols-2">
        <input
          value={draft.caption}
          onChange={(event) => setDraft((prev) => ({ ...prev, caption: event.target.value }))}
          placeholder="Caption"
          className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
        />
        <input
          value={draft.image_url}
          onChange={(event) => setDraft((prev) => ({ ...prev, image_url: event.target.value }))}
          placeholder="Image URL"
          className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setNewImage(event.target.files?.[0] ?? null)}
          className="text-sm text-zinc-300"
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={draft.order_index}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, order_index: Number(event.target.value) }))
            }
            className="w-24 rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
          />
          <button className="btn-primary rounded-lg px-4 py-2 text-sm">
            Add Image
          </button>
        </div>
      </form>

      <div className="mt-4 space-y-3">
        {gallery.map((item) => (
          <div key={item.id} className="grid gap-2 rounded-xl border border-zinc-700/60 p-3 sm:grid-cols-[140px_1fr]">
            <img src={item.image_url} alt={item.caption ?? "Gallery"} className="h-[96px] w-full rounded-lg object-cover" />
            <div className="space-y-2">
              <input
                value={item.caption ?? ""}
                onChange={(event) =>
                  setGallery((prev) =>
                    prev.map((entry) =>
                      entry.id === item.id ? { ...entry, caption: event.target.value } : entry,
                    ),
                  )
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
                placeholder="Caption"
              />
              <input
                value={item.image_url}
                onChange={(event) =>
                  setGallery((prev) =>
                    prev.map((entry) =>
                      entry.id === item.id ? { ...entry, image_url: event.target.value } : entry,
                    ),
                  )
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
                placeholder="Image URL"
              />
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  value={item.order_index}
                  onChange={(event) =>
                    setGallery((prev) =>
                      prev.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, order_index: Number(event.target.value) }
                          : entry,
                      ),
                    )
                  }
                  className="w-24 rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => updateItem(item)}
                  className="rounded-lg border border-zinc-600 px-3 py-2 text-xs uppercase tracking-[0.14em] text-zinc-200"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="rounded-lg border border-red-500/50 px-3 py-2 text-xs uppercase tracking-[0.14em] text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {status ? <p className="mt-3 text-xs text-zinc-300">{status}</p> : null}
    </AdminSectionCard>
  );
}

