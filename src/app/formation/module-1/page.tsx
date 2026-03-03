"use client";

import { useRef, useState, useEffect } from "react";
import {
  Headphones,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const EPISODES = [
  {
    id: 1,
    title: "Sortir du mode survie",
    duration: "6 min",
    durationSeconds: 360,
    pointsCles: [
      "Reconnaître les signaux du mode survie (stress, réactivité, fatigue).",
      "Comprendre l’impact sur la relation parent-enfant.",
      "Techniques de « descente » : respiration et ancrage.",
      "Poser des micro-pauses pour éviter la surcharge.",
    ],
    // Remplacer par l’URL réelle de l’épisode quand disponible
    audioSrc: "/audio/module1-ep1.mp3",
  },
  {
    id: 2,
    title: "La Règle d'Or des 24h",
    duration: "5 min",
    durationSeconds: 300,
    pointsCles: [
      "Ne pas prendre de décision importante dans les 24h après un choc.",
      "Différer les réponses aux messages ou conflits pour rester dans le cadre.",
      "Utiliser un « sas » (écriture, marche) avant de répondre.",
      "Protéger la qualité de la présence avec l’enfant.",
    ],
    audioSrc: "/audio/module1-ep2.mp3",
  },
  {
    id: 3,
    title: "Construire son Sanctuaire",
    duration: "7 min",
    durationSeconds: 420,
    pointsCles: [
      "Définir un espace-temps personnel pour reprendre pied.",
      "Rituels courts : respiration, étirement, silence.",
      "Limiter les stimuli (écrans, infos) dans ce créneau.",
      "Ancrer le sanctuaire dans le quotidien pour en faire une ressource.",
    ],
    audioSrc: "/audio/module1-ep3.mp3",
  },
  {
    id: 4,
    title: "Maîtriser son Narratif",
    duration: "8 min",
    durationSeconds: 480,
    pointsCles: [
      "Identifier le récit que l’on se raconte (victime, héros, etc.).",
      "Reformuler les pensées automatiques en récits plus bienveillants.",
      "Se concentrer sur ce qui dépend de soi : actions et réactions.",
      "Garder un récit ouvert et évolutif pour soi et pour l’enfant.",
    ],
    audioSrc: "/audio/module1-ep4.mp3",
  },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Module1Page() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [expandedEpisode, setExpandedEpisode] = useState<number | null>(null);
  const prevVolumeRef = useRef(1);

  const episode = EPISODES[currentIndex];

  // Synchronisation du lecteur avec l’épisode sélectionné
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.src = episode.audioSrc;
    el.load();
    setCurrentTime(0);
    setDuration(episode.durationSeconds);
    if (isPlaying) el.play().catch(() => {});
  }, [currentIndex, episode.audioSrc, episode.durationSeconds]);

  // Lecture / pause
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) el.play().catch(() => setIsPlaying(false));
    else el.pause();
  }, [isPlaying]);

  // Mise à jour du temps et de la durée
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onLoadedMetadata = () => setDuration(el.duration);
    const onEnded = () => {
      if (currentIndex < EPISODES.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("loadedmetadata", onLoadedMetadata);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      el.removeEventListener("ended", onEnded);
    };
  }, [currentIndex]);

  // Volume
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying((p) => !p);
  const seekBack = () => {
    const el = audioRef.current;
    if (el) el.currentTime = Math.max(0, el.currentTime - 15);
  };
  const seekForward = () => {
    const el = audioRef.current;
    if (el) el.currentTime = Math.min(el.duration, el.currentTime + 15);
  };
  const onProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    el.currentTime = x * el.duration;
    setCurrentTime(el.currentTime);
  };
  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolumeRef.current);
      setIsMuted(false);
    } else {
      prevVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-sky-400">
            <Headphones className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
              Module 1 : Stabilisation Émotionnelle
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Écoutez à votre rythme
            </p>
          </div>
        </div>
      </header>

      {/* Playlist */}
      <section className="max-w-4xl mx-auto px-4 py-8" aria-label="Liste de lecture">
        <h2 className="sr-only">Épisodes</h2>
        <ul className="space-y-4">
          {EPISODES.map((ep, index) => (
            <li key={ep.id}>
              <article
                className={`rounded-2xl border transition-all duration-200 ${
                  index === currentIndex
                    ? "border-sky-500/60 bg-slate-800/70 shadow-lg shadow-sky-500/10"
                    : "border-slate-700/80 bg-slate-800/40 hover:bg-slate-800/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setCurrentIndex(index);
                    if (!isPlaying) setIsPlaying(true);
                    if (audioRef.current) {
                      audioRef.current.src = ep.audioSrc;
                      audioRef.current.load();
                      audioRef.current.play().catch(() => {});
                    }
                  }}
                  className="w-full flex items-center gap-4 p-4 sm:p-5 text-left rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      index === currentIndex ? "bg-sky-500 text-white" : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {index === currentIndex && isPlaying ? (
                      <Pause className="h-6 w-6" aria-hidden />
                    ) : (
                      <Play className="h-6 w-6 ml-0.5" aria-hidden />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-100 truncate">
                      Épisode {ep.id} : {ep.title}
                    </h3>
                    <p className="text-sm text-slate-400">{ep.duration}</p>
                  </div>
                  {index === currentIndex && (
                    <span className="text-xs font-medium text-sky-400 bg-sky-500/20 px-2.5 py-1 rounded-full">
                      En cours
                    </span>
                  )}
                </button>

                {/* Points clés déroulants */}
                <div className="border-t border-slate-700/60 px-4 pb-3 pt-0">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedEpisode(expandedEpisode === ep.id ? null : ep.id)
                    }
                    className="flex items-center gap-2 py-3 text-sm text-slate-400 hover:text-sky-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
                  >
                    {expandedEpisode === ep.id ? (
                      <ChevronUp className="h-4 w-4" aria-hidden />
                    ) : (
                      <ChevronDown className="h-4 w-4" aria-hidden />
                    )}
                    Voir les points clés
                  </button>
                  {expandedEpisode === ep.id && (
                    <ul className="space-y-2 pl-1 text-sm text-slate-300 list-disc list-inside">
                      {ep.pointsCles.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* Espace pour ne pas être caché par le lecteur sticky */}
      <div className="h-40" aria-hidden />

      {/* Lecteur audio sticky */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-800 bg-slate-900/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.25)]">
        <audio ref={audioRef} preload="metadata" className="hidden" />
        <div className="max-w-4xl mx-auto px-4 py-4">
          <p className="text-xs text-slate-500 mb-2 truncate">
            Épisode {episode.id} : {episode.title}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Contrôles play */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
                  else seekBack();
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                aria-label="Reculer de 15 secondes ou épisode précédent"
              >
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                className="p-3 rounded-xl bg-sky-500 text-white hover:bg-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition-colors"
                aria-label={isPlaying ? "Pause" : "Lecture"}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentIndex < EPISODES.length - 1) setCurrentIndex(currentIndex + 1);
                  else seekForward();
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                aria-label="Avancer de 15 secondes ou épisode suivant"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            {/* Barre de progression */}
            <div className="flex-1 w-full flex items-center gap-3">
              <span className="text-xs text-slate-500 tabular-nums w-10">
                {formatTime(currentTime)}
              </span>
              <div
                role="slider"
                aria-label="Position dans la piste"
                aria-valuemin={0}
                aria-valuemax={duration || 100}
                aria-valuenow={currentTime}
                tabIndex={0}
                onClick={onProgressClick}
                onKeyDown={(e) => {
                  const el = audioRef.current;
                  if (!el) return;
                  if (e.key === "ArrowLeft") {
                    el.currentTime = Math.max(0, el.currentTime - 5);
                    setCurrentTime(el.currentTime);
                  }
                  if (e.key === "ArrowRight") {
                    el.currentTime = Math.min(el.duration, el.currentTime + 5);
                    setCurrentTime(el.currentTime);
                  }
                }}
                className="h-2 flex-1 rounded-full bg-slate-700 cursor-pointer group"
              >
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-150"
                  style={{
                    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-xs text-slate-500 tabular-nums w-10">
                {formatTime(duration)}
              </span>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 w-32">
              <button
                type="button"
                onClick={toggleMute}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                aria-label={isMuted ? "Activer le son" : "Couper le son"}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolume(v);
                  if (v > 0) setIsMuted(false);
                  prevVolumeRef.current = v;
                }}
                className="flex-1 h-1.5 rounded-full appearance-none bg-slate-700 accent-sky-500 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-400"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
