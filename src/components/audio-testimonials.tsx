"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Pause, Play, Headphones, ExternalLink, SkipBack, SkipForward } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  audioSrc: string;
  tiktokUrl: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Ton bonheur à toi, il dit tout ce que papa n’arrive pas à exprimer...",
    author: "@ENZO ANGELO",
    audioSrc: "/audio/temoignage1.mp3",
    tiktokUrl: "https://www.tiktok.com/@nzoangelo/video/7603050045096660246",
  },
  {
    quote:
      "Ma fille est vivante, mais on m'a fait vivre son deuil…",
    author: "@guizmo_artst",
    audioSrc: "/audio/temoignage2.mp3",
    tiktokUrl: "https://www.tiktok.com/@guizmo_artst/video/7609522780773616918",
  },
];

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function AudioPlayer({ index, isPlaying, onTogglePlay }: {
  index: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  // Expose audio element to parent via data attribute
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    (el as HTMLAudioElement & { _playerIndex: number })._playerIndex = index;
    window.dispatchEvent(new CustomEvent("audio-player-mount", { detail: { index, el } }));
    return () => {
      window.dispatchEvent(new CustomEvent("audio-player-unmount", { detail: { index } }));
    };
  }, [index]);

  // Sync play/pause state from parent
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && audio.paused) {
      audio.play().catch(() => {});
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  }, []);

  const handleEnded = useCallback(() => {
    setCurrentTime(0);
    onTogglePlay();
  }, [onTogglePlay]);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  }, [duration]);

  const skip = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
    setCurrentTime(audio.currentTime);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col gap-2">
      <audio
        ref={audioRef}
        src={testimonials[index].audioSrc}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Progress bar */}
      <div
        ref={progressRef}
        onClick={seek}
        className="relative h-1.5 bg-muted rounded-full cursor-pointer group"
      >
        <div
          className="absolute inset-y-0 left-0 bg-primary rounded-full transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-primary rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground tabular-nums w-8">
          {formatTime(currentTime)}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => skip(-10)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Reculer de 10 secondes"
          >
            <SkipBack className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className="p-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
            aria-label={isPlaying ? "Pause" : "Lecture"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => skip(10)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Avancer de 10 secondes"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>
        </div>

        <span className="text-[10px] text-muted-foreground tabular-nums w-8 text-right">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

export function AudioTestimonials() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const togglePlay = useCallback((index: number) => {
    setPlayingIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto lg:mx-0">
      {testimonials.map((t, i) => {
        const isActive = playingIndex === i;
        return (
          <div
            key={i}
            className="glass rounded-2xl border border-border/60 p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow min-w-0 overflow-hidden"
          >
            <div className="flex items-center gap-2 text-primary/70">
              <Headphones className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Témoignage audio
              </span>
            </div>

            <p className="text-sm text-foreground/90 leading-relaxed italic">
              &ldquo;{t.quote}&rdquo;
            </p>

            {isActive ? (
              <AudioPlayer
                index={i}
                isPlaying={true}
                onTogglePlay={() => togglePlay(i)}
              />
            ) : (
              <div className="flex items-center justify-between gap-2 mt-auto pt-1">
                <button
                  type="button"
                  onClick={() => togglePlay(i)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer shrink-0"
                >
                  <Play className="h-4 w-4" />
                  Écouter
                </button>

                <a
                  href={t.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors truncate"
                >
                  <span className="truncate">{t.author}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            )}

            {isActive && (
              <div className="flex justify-end">
                <a
                  href={t.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors truncate"
                >
                  <span className="truncate">{t.author}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
