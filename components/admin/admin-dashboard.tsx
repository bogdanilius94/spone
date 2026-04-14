"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FiLogOut } from "react-icons/fi";

import { GalleryManager } from "@/components/admin/gallery-manager";
import { HeroSettingsForm } from "@/components/admin/hero-settings-form";
import { LinksManager } from "@/components/admin/links-manager";
import { ReleasesManager } from "@/components/admin/releases-manager";
import { VideosManager } from "@/components/admin/videos-manager";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { PublicContent } from "@/types/content";

type AdminDashboardProps = {
  initialContent: PublicContent;
};

export function AdminDashboard({ initialContent }: AdminDashboardProps) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<string | null>(null);

  const signOut = async () => {
    if (!supabase) {
      setStatus("Supabase is not configured.");
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      setStatus(error.message);
      return;
    }

    router.push("/login");
    router.refresh();
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      <header className="panel-surface flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[--color-accent]">Protected</p>
          <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Artist Admin Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage public content for hero, links, releases, gallery, and videos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="rounded-lg border border-zinc-600 px-3 py-2 text-xs uppercase tracking-[0.14em] text-zinc-200"
          >
            Open Public Page
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/50 px-3 py-2 text-xs uppercase tracking-[0.14em] text-red-300"
          >
            <FiLogOut /> Sign out
          </button>
        </div>
      </header>

      {!supabase ? (
        <div className="rounded-xl border border-amber-500/60 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Supabase env vars are missing. Forms are visible, but saving is disabled.
        </div>
      ) : null}

      <HeroSettingsForm
        settings={content.settings}
        supabase={supabase}
        onSaved={(settings) => setContent((prev) => ({ ...prev, settings }))}
      />

      <LinksManager
        links={content.links}
        supabase={supabase}
        onChange={(links) => setContent((prev) => ({ ...prev, links }))}
      />

      <ReleasesManager
        releases={content.releases}
        supabase={supabase}
        onChange={(releases) => setContent((prev) => ({ ...prev, releases }))}
      />

      <GalleryManager
        items={content.gallery}
        supabase={supabase}
        onChange={(gallery) => setContent((prev) => ({ ...prev, gallery }))}
      />

      <VideosManager
        videos={content.videos}
        supabase={supabase}
        onChange={(videos) => setContent((prev) => ({ ...prev, videos }))}
      />

      {status ? <p className="text-xs text-zinc-300">{status}</p> : null}
    </main>
  );
}

