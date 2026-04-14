"use client";

import { useMemo, useState } from "react";
import QRCode from "react-qr-code";

import type { SocialLink } from "@/types/content";

type HeroQrWidgetProps = {
  featuredSongUrl?: string | null;
  links: SocialLink[];
};

type QrOption = {
  label: string;
  url: string;
};

export function HeroQrWidget({ featuredSongUrl, links }: HeroQrWidgetProps) {
  const options = useMemo<QrOption[]>(() => {
    const fromLinks = links
      .filter((item) => Boolean(item.url))
      .map((item) => ({
        label: item.label,
        url: item.url,
      }));

    if (featuredSongUrl) {
      return [{ label: "Featured Song", url: featuredSongUrl }, ...fromLinks];
    }

    return fromLinks;
  }, [featuredSongUrl, links]);

  const [selectedUrl, setSelectedUrl] = useState(options[0]?.url ?? "");

  if (!options.length) {
    return (
      <div className="panel-surface rounded-2xl p-4 text-xs text-zinc-300">
        Add at least one link in Admin to generate a QR code.
      </div>
    );
  }

  return (
    <div className="panel-surface rounded-2xl p-4">
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-300">QR Share</p>
      <div className="rounded-xl bg-white p-2">
        <QRCode
          value={selectedUrl}
          size={168}
          bgColor="#ffffff"
          fgColor="#111111"
          style={{ height: "auto", width: "100%" }}
        />
      </div>

      <label className="mt-3 block space-y-1">
        <span className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">QR Link</span>
        <select
          value={selectedUrl}
          onChange={(event) => setSelectedUrl(event.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900/70 px-2 py-2 text-xs"
        >
          {options.map((option) => (
            <option key={`${option.label}-${option.url}`} value={option.url}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
