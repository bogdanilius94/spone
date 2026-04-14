"use client";

/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";

import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/ui/section-title";
import type { GlobalSettings } from "@/types/content";

type BiographySectionProps = {
  settings: GlobalSettings;
};

export function BiographySection({ settings }: BiographySectionProps) {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-8 sm:py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center md:justify-items-stretch">
      <Reveal>
        <SectionTitle
          eyebrow="Story"
          title="Biography"
          subtitle="Built from underground sets, sharp lyricism, and a restless drive to push the sound forward."
        />

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-zinc-300 sm:text-base md:mx-0 md:text-left">
          {settings.bio_text}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <motion.div
          whileHover={{ y: -4 }}
          className="panel-surface relative overflow-hidden rounded-3xl p-3"
        >
          {settings.bio_portrait_url ? (
            <img
              src={settings.bio_portrait_url}
              alt={`${settings.artist_name} portrait`}
              className="h-[420px] w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-[420px] w-full items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400">
              Upload portrait in Admin
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        </motion.div>
      </Reveal>
    </section>
  );
}

