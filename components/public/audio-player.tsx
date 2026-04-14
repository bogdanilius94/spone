"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiPause, FiPlay } from "react-icons/fi";

type AudioPlayerProps = {
  audioUrl?: string | null;
  title: string;
  accentColor?: string;
};

function toClock(value: number) {
  if (!Number.isFinite(value)) {
    return "0:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function AudioPlayer({ audioUrl, title, accentColor }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const progress = useMemo(() => {
    if (!duration) {
      return 0;
    }

    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      void audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  if (!audioUrl) {
    return (
      <div className="panel-surface rounded-2xl border border-dashed border-zinc-500/60 p-4 text-xs text-zinc-300 sm:text-sm">
        Upload an audio snippet in Admin to enable the in-page player.
      </div>
    );
  }

  return (
    <div className="panel-surface rounded-2xl p-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Now Playing</p>
          <p className="text-sm font-semibold text-white sm:text-base">{title}</p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          onClick={() => setIsPlaying((state) => !state)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-black"
          style={{ backgroundColor: accentColor || "var(--color-accent)" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isPlaying ? (
              <motion.span
                key="pause"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
              >
                <FiPause />
              </motion.span>
            ) : (
              <motion.span
                key="play"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
              >
                <FiPlay />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <input
        type="range"
        value={progress}
        min={0}
        max={100}
        onChange={(event) => {
          const audio = audioRef.current;
          if (!audio || !duration) {
            return;
          }

          const nextProgress = Number(event.target.value);
          const nextTime = (nextProgress / 100) * duration;
          audio.currentTime = nextTime;
          setCurrentTime(nextTime);
        }}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-700"
      />

      <div className="mt-2 flex justify-between text-xs text-zinc-400">
        <span>{toClock(currentTime)}</span>
        <span>{toClock(duration)}</span>
      </div>
    </div>
  );
}

