"use client";

import { useEffect } from "react";
import { brand } from "@/lib/brand";
import { useYouTubeAudio } from "@/hooks/useYouTubeAudio";

export function Player() {
  const audio = useYouTubeAudio();
  const { now, playing, buffering, ready, toggle, next, prev, playlistUrl } = audio;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      }
      if (e.code === "ArrowRight") {
        e.preventDefault();
        next();
      }
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, next, prev]);

  const openUrl = now.videoId
    ? `https://www.youtube.com/watch?v=${now.videoId}&list=PLJjBNE6iPKm0`
    : playlistUrl;

  const totalLabel =
    now.total > 0
      ? `${String(now.index + 1).padStart(2, "0")}/${String(now.total).padStart(2, "0")}`
      : "··/··";

  return (
    <>
      <div ref={audio.hostRef} className="yt-audio-host" aria-hidden />

      <div className="absolute inset-x-0 bottom-12 z-40 flex flex-col items-center px-3 pb-0 sm:bottom-0 sm:px-4 sm:pb-6">
        <div className="player-shell w-full max-w-[640px] animate-player-in">
          <div className="mb-2 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-white/35">
              <span className="font-semibold text-[var(--brand-yellow)]/80">
                {brand.name}
              </span>
              <span className="text-white/20">·</span>
              <span className="normal-case tracking-normal text-white/40">
                Playlist
              </span>
            </div>
          </div>

          <div className="player-pill">
            <div className="flex items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
              {/* Ultra-Clean Minimalist Song Poster */}
              <div className="relative shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black/60 shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_0_1px_rgba(245,197,24,0.25)] h-14 w-14 sm:h-16 sm:w-16">
                {now.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={now.image}
                    alt=""
                    className={`h-full w-full object-cover transition-transform duration-500 ${
                      playing ? "scale-105" : "scale-100"
                    }`}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--brand-yellow)] font-bold text-black/80 text-xs">
                    AR
                  </div>
                )}
                {buffering && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/65 backdrop-blur-[2px]">
                    <TapeSpoolIcon />
                  </span>
                )}
                {playing && !buffering && (
                  <span className="absolute inset-x-0 bottom-0 flex h-1 overflow-hidden bg-black/40">
                    <span className="h-full w-full bg-[var(--brand-yellow)]" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]">
                  <span className="text-white/40">Now playing</span>
                  {buffering && (
                    <span className="inline-flex items-center gap-1.5 font-bold tracking-wide text-[var(--brand-yellow)]">
                      <span className="flex h-2.5 items-end gap-[2px]">
                        <span className="h-full w-[2px] rounded-full bg-[var(--brand-yellow)] animate-eq-bar-1" />
                        <span className="h-full w-[2px] rounded-full bg-[var(--brand-yellow)] animate-eq-bar-2" />
                        <span className="h-full w-[2px] rounded-full bg-[var(--brand-yellow)] animate-eq-bar-3" />
                      </span>
                      <span>Tuning…</span>
                    </span>
                  )}
                </div>
                <p className="truncate text-[15px] font-semibold leading-tight text-white sm:text-base">
                  {now.title}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                <IconButton label="Previous" onClick={prev}>
                  <PrevIcon />
                </IconButton>

                <button
                  type="button"
                  onClick={toggle}
                  className={`mx-0.5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-yellow)] text-black transition hover:scale-105 active:scale-95 sm:h-[3.25rem] sm:w-[3.25rem] ${
                    buffering
                      ? "shadow-[0_0_24px_rgba(245,197,24,0.7)] ring-2 ring-[var(--brand-yellow)]/60 animate-pulse"
                      : "shadow-[0_10px_32px_rgba(245,197,24,0.4)]"
                  }`}
                  aria-label={buffering ? "Tuning audio" : playing ? "Pause" : "Play"}
                >
                  {buffering ? <EqualizerPlayIcon /> : playing ? <PauseIcon /> : <PlayIcon />}
                </button>

                <IconButton label="Next" onClick={next}>
                  <NextIcon />
                </IconButton>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2">
              <span className="text-[10px] text-white/30">
                Meter running · ಹಾಡು unlimited
              </span>
              <a
                href={openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-white/35 transition hover:text-white/70"
              >
                Open playlist ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95"
    >
      {children}
    </button>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.02-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 6h2v12h-2V6zM6 18l8.5-6L6 6v12z" />
    </svg>
  );
}

function EqualizerPlayIcon() {
  return (
    <div className="flex h-5 w-5 items-end justify-center gap-[3px] py-0.5" aria-hidden>
      <span className="w-[3px] rounded-full bg-black animate-eq-bar-1" />
      <span className="w-[3px] rounded-full bg-black animate-eq-bar-2" />
      <span className="w-[3px] rounded-full bg-black animate-eq-bar-3" />
      <span className="w-[3px] rounded-full bg-black animate-eq-bar-4" />
    </div>
  );
}

function TapeSpoolIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-tape-fast-spin text-[var(--brand-yellow)] drop-shadow-[0_0_10px_rgba(245,197,24,0.8)]"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="5 3" />
      <circle cx="12" cy="12" r="4.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
