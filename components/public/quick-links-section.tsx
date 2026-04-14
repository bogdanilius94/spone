"use client";

import { motion } from "framer-motion";
import {
  FaApple,
  FaInstagram,
  FaMusic,
  FaSoundcloud,
  FaSpotify,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/ui/section-title";
import type { SocialLink } from "@/types/content";

const platformMeta: Record<
  SocialLink["platform"],
  { icon: React.ComponentType<{ className?: string }>; gradient: string }
> = {
  spotify: { icon: FaSpotify, gradient: "from-emerald-500/30 to-emerald-900/10" },
  apple_music: { icon: FaApple, gradient: "from-rose-500/30 to-zinc-900/10" },
  youtube: { icon: FaYoutube, gradient: "from-red-500/30 to-zinc-900/10" },
  instagram: { icon: FaInstagram, gradient: "from-fuchsia-500/30 to-amber-400/10" },
  tiktok: { icon: FaTiktok, gradient: "from-cyan-400/30 to-zinc-900/10" },
  soundcloud: { icon: FaSoundcloud, gradient: "from-orange-400/30 to-zinc-900/10" },
  custom: { icon: FaMusic, gradient: "from-zinc-500/30 to-zinc-900/10" },
};

type QuickLinksSectionProps = {
  links: SocialLink[];
  compact?: boolean;
};

export function QuickLinksSection({ links, compact = false }: QuickLinksSectionProps) {
  return (
    <section
      className={`mx-auto w-full max-w-6xl px-4 sm:px-8 ${compact ? "py-6 sm:py-8" : "py-14 sm:py-20"}`}
    >
      <Reveal>
        <SectionTitle
          eyebrow="Connect"
          title="Quick Links"
          subtitle="One tap to every platform where the music lives."
        />
      </Reveal>

      <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${compact ? "mt-5" : "mt-8"}`}>
        {links.map((link, index) => {
          const platform = platformMeta[link.platform] ?? platformMeta.custom;
          const Icon = platform.icon;

          return (
            <Reveal key={link.id} delay={0.04 * index}>
              <motion.a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`group panel-surface neon-ring relative flex items-center justify-between overflow-hidden rounded-2xl px-4 py-4 transition-colors duration-200 ${platform.gradient} bg-gradient-to-br`}
              >
                <span className="inline-flex items-center gap-3 text-sm font-semibold sm:text-base">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300/20 bg-black/40 text-lg">
                    <Icon />
                  </span>
                  {link.label}
                </span>

                <FiExternalLink className="text-zinc-300 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

