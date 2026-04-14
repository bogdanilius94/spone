"use client";

import { useState } from "react";

import { AdminSectionCard } from "@/components/admin/admin-section-card";
import type { BrowserSupabase } from "@/components/admin/types";
import type { SocialLink } from "@/types/content";
import type { Database } from "@/types/supabase";

type LinkPlatform = Database["public"]["Enums"]["link_platform"];

type LinksManagerProps = {
  links: SocialLink[];
  supabase: BrowserSupabase;
  onChange: (links: SocialLink[]) => void;
};

const platformOptions: Array<{ value: LinkPlatform; label: string }> = [
  { value: "spotify", label: "Spotify" },
  { value: "apple_music", label: "Apple Music" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "soundcloud", label: "SoundCloud" },
  { value: "custom", label: "Custom" },
];

export function LinksManager({ links, supabase, onChange }: LinksManagerProps) {
  const [items, setItems] = useState<SocialLink[]>(links);
  const [status, setStatus] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({
    label: "",
    url: "",
    platform: "custom" as LinkPlatform,
    order_index: items.length + 1,
  });

  const sync = (next: SocialLink[]) => {
    setItems(next);
    onChange(next);
  };

  const createLink = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    const { data, error } = await supabase
      .from("social_links")
      .insert(newLink)
      .select("*")
      .single();

    if (error) {
      setStatus(error.message);
      return;
    }

    const next = [...items, data].sort((a, b) => a.order_index - b.order_index);
    sync(next);
    setNewLink({
      label: "",
      url: "",
      platform: "custom",
      order_index: next.length + 1,
    });
    setStatus("Link added.");
  };

  const updateLink = async (item: SocialLink) => {
    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    const { data, error } = await supabase
      .from("social_links")
      .update({
        label: item.label,
        url: item.url,
        platform: item.platform,
        order_index: item.order_index,
      })
      .eq("id", item.id)
      .select("*")
      .single();

    if (error) {
      setStatus(error.message);
      return;
    }

    sync(
      items
        .map((current) => (current.id === item.id ? data : current))
        .sort((a, b) => a.order_index - b.order_index),
    );
    setStatus("Link updated.");
  };

  const deleteLink = async (id: string) => {
    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    const { error } = await supabase.from("social_links").delete().eq("id", id);

    if (error) {
      setStatus(error.message);
      return;
    }

    const next = items.filter((item) => item.id !== id);
    sync(next);
    setStatus("Link deleted.");
  };

  return (
    <AdminSectionCard
      title="Quick Links"
      description="Add, reorder, and edit social/streaming links shown on the public page."
    >
      <form onSubmit={createLink} className="grid gap-3 rounded-xl border border-zinc-700/60 p-4 sm:grid-cols-[1fr_1.3fr_0.8fr_auto]">
        <input
          placeholder="Label"
          value={newLink.label}
          onChange={(event) => setNewLink((prev) => ({ ...prev, label: event.target.value }))}
          className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
          required
        />
        <input
          placeholder="https://..."
          value={newLink.url}
          onChange={(event) => setNewLink((prev) => ({ ...prev, url: event.target.value }))}
          className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
          required
        />
        <select
          value={newLink.platform}
          onChange={(event) =>
            setNewLink((prev) => ({
              ...prev,
              platform: event.target.value as LinkPlatform,
            }))
          }
          className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
        >
          {platformOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button className="btn-primary rounded-lg px-4 py-2 text-sm">
          Add
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="grid gap-2 rounded-xl border border-zinc-700/60 p-3 sm:grid-cols-[1fr_1.4fr_0.75fr_0.45fr_auto_auto]">
            <input
              value={item.label}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((link) =>
                    link.id === item.id ? { ...link, label: event.target.value } : link,
                  ),
                )
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-2 py-2 text-sm"
            />
            <input
              value={item.url}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((link) =>
                    link.id === item.id ? { ...link, url: event.target.value } : link,
                  ),
                )
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-2 py-2 text-sm"
            />
            <select
              value={item.platform}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((link) =>
                    link.id === item.id
                      ? { ...link, platform: event.target.value as LinkPlatform }
                      : link,
                  ),
                )
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-2 py-2 text-sm"
            >
              {platformOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={item.order_index}
              onChange={(event) =>
                setItems((prev) =>
                  prev.map((link) =>
                    link.id === item.id
                      ? { ...link, order_index: Number(event.target.value) }
                      : link,
                  ),
                )
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-2 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => updateLink(item)}
              className="rounded-lg border border-zinc-600 px-3 py-2 text-xs uppercase tracking-[0.14em] text-zinc-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => deleteLink(item.id)}
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

