"use client";

/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";

import { AudioPlayer } from "@/components/public/audio-player";
import { HeroQrWidget } from "@/components/public/hero-qr-widget";
import { resolveArtistFontClass } from "@/lib/utils";
import type { GlobalSettings, SocialLink } from "@/types/content";

type HeroSectionProps = {
  settings: GlobalSettings;
  links: SocialLink[];
};

export function HeroSection({ settings, links }: HeroSectionProps) {
  const artistClass = resolveArtistFontClass(settings.artist_font_family);
  const showSideCard = settings.show_qr_widget;

  return (
    <section className="relative min-h-[72svh] overflow-hidden px-4 pb-8 pt-4 sm:px-8 md:px-12">
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {settings.hero_video_url ? (
          <video
            className="h-full w-full object-cover"
            src={settings.hero_video_url}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : settings.hero_background_url ? (
          <img
            className={`h-full w-full object-cover ${settings.hero_background_blur ? "scale-110 blur-md" : ""}`}
            src={settings.hero_background_url}
            alt="Artist hero background"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_10%,#2a2a2a,transparent_40%),#050505]" />
        )}
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/76 to-[--color-bg]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58 }}
        className={`mx-auto grid w-full max-w-6xl gap-5 pt-12 sm:pt-16 ${
          showSideCard ? "lg:grid-cols-[1.3fr_0.7fr]" : ""
        }`}
      >
        <div className="space-y-4 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-300">
            Official Artist Portfolio
          </p>
          <h1
            className={`${artistClass} text-6xl uppercase leading-[0.9] tracking-wide text-white sm:text-7xl md:text-8xl`}
          >
            {settings.artist_name}
          </h1>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-300">Currently Featured Song</p>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <p className="text-2xl font-semibold text-white sm:text-3xl">{settings.featured_song_title}</p>
              {settings.featured_song_stream_url ? (
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href={settings.featured_song_stream_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-300/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-100"
                >
                  Open Track <FiExternalLink />
                </motion.a>
              ) : null}
            </div>
          </div>

          {settings.show_audio_player ? (
            <div className="mx-auto max-w-xl lg:mx-0">
              <AudioPlayer
                title={settings.featured_song_title}
                audioUrl={settings.featured_song_audio_url}
                accentColor={settings.accent_color}
              />
            </div>
          ) : null}
        </div>

        {settings.show_qr_widget ? (
          <div className="hidden w-full max-w-[260px] md:block lg:justify-self-end">
            <HeroQrWidget
              featuredSongUrl={settings.featured_song_stream_url}
              links={links}
            />
          </div>
        ) : null}
      </motion.div>
    </section>
  );
}
