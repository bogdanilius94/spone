"use client";

import { Reveal } from "@/components/ui/reveal";
import { SectionTitle } from "@/components/ui/section-title";
import { getEmbedVideoUrl } from "@/lib/utils";
import type { MusicVideo } from "@/types/content";

type MusicVideosSectionProps = {
  videos: MusicVideo[];
};

export function MusicVideosSection({ videos }: MusicVideosSectionProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
      <Reveal>
        <SectionTitle
          eyebrow="Screens"
          title="Music Videos"
          subtitle="Official releases and cinematic cuts."
        />
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {videos.map((video, index) => (
          <Reveal key={video.id} delay={0.07 * index}>
            <article className="panel-surface overflow-hidden rounded-2xl">
              <div className="relative aspect-video">
                <iframe
                  title={video.title}
                  src={getEmbedVideoUrl(video.video_url, video.platform)}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-100 sm:text-base">
                  {video.title}
                </h3>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

