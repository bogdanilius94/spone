"use client";

/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";

import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/ui/section-title";
import type { GalleryItem } from "@/types/content";

type GallerySectionProps = {
  items: GalleryItem[];
};

export function GallerySection({ items }: GallerySectionProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
      <Reveal>
        <SectionTitle
          eyebrow="Visuals"
          title="Media Gallery"
          subtitle="Tour stills, backstage textures, and moments from the grind."
        />
      </Reveal>

      <div className="mt-8 columns-2 gap-3 space-y-3 sm:columns-3 md:columns-4">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={0.04 * (index % 6)} className="break-inside-avoid">
            <motion.figure
              whileHover={{ scale: 1.02 }}
              className="panel-surface overflow-hidden rounded-2xl"
            >
              <img
                src={item.image_url}
                alt={item.caption || "Gallery item"}
                className="h-auto w-full object-cover"
                loading="lazy"
              />
              {item.caption ? (
                <figcaption className="px-3 py-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
                  {item.caption}
                </figcaption>
              ) : null}
            </motion.figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

