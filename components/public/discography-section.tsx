"use client";

/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";

import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/ui/section-title";
import type { ReleaseItem } from "@/types/content";

type DiscographySectionProps = {
  releases: ReleaseItem[];
};

export function DiscographySection({ releases }: DiscographySectionProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
      <Reveal>
        <SectionTitle
          eyebrow="Music"
          title="Discography"
          subtitle="Every drop, single, and era in one place."
        />
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {releases.map((release, index) => (
          <Reveal key={release.id} delay={0.05 * index}>
            <motion.article
              whileHover={{ y: -6 }}
              className="panel-surface overflow-hidden rounded-2xl"
            >
              {release.cover_url ? (
                <img
                  src={release.cover_url}
                  alt={`${release.title} cover art`}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-zinc-900 text-zinc-500">
                  No cover art
                </div>
              )}

              <div className="space-y-3 p-4 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-white">{release.title}</h3>
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                  {release.release_date
                    ? new Date(release.release_date).toLocaleDateString()
                    : "Release date pending"}
                </p>
                <div className="flex justify-center sm:justify-start">
                  <a
                    href={release.listen_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[--color-accent]"
                  >
                    Listen now <FiExternalLink />
                  </a>
                </div>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

