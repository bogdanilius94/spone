"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties } from "react";

import { BiographySection } from "@/components/public/biography-section";
import { DiscographySection } from "@/components/public/discography-section";
import { GallerySection } from "@/components/public/gallery-section";
import { HeroSection } from "@/components/public/hero-section";
import { MusicVideosSection } from "@/components/public/music-videos-section";
import { QuickLinksSection } from "@/components/public/quick-links-section";
import { hexToRgba } from "@/lib/utils";
import type { PublicContent } from "@/types/content";

type PublicPageProps = {
  content: PublicContent;
};

export function PublicPage({ content }: PublicPageProps) {
  const accentColor = content.settings.accent_color || "#3BFFB3";

  const pageStyle = {
    "--color-accent": accentColor,
    "--color-accent-soft": hexToRgba(accentColor, 0.35),
    background: `
      radial-gradient(circle at 10% 10%, ${hexToRgba(accentColor, 0.15)}, transparent 35%),
      radial-gradient(circle at 85% 0%, rgba(29, 29, 29, 0.95), transparent 45%),
      #070707
    `,
  } as CSSProperties;

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="public-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        style={pageStyle}
        className="min-h-screen"
      >
        <HeroSection settings={content.settings} links={content.links} />
        {content.settings.show_quick_links ? (
          <QuickLinksSection links={content.links} compact />
        ) : null}
        {content.settings.show_biography ? (
          <BiographySection settings={content.settings} />
        ) : null}
        {content.settings.show_discography ? (
          <DiscographySection releases={content.releases} />
        ) : null}
        {content.settings.show_gallery ? <GallerySection items={content.gallery} /> : null}
        {content.settings.show_videos ? (
          <MusicVideosSection videos={content.videos} />
        ) : null}

        <footer className="mx-auto w-full max-w-6xl px-4 pb-10 pt-4 text-center text-xs uppercase tracking-[0.18em] text-zinc-500 sm:px-8">
          {content.settings.artist_name} - All rights reserved
        </footer>
      </motion.main>
    </AnimatePresence>
  );
}
