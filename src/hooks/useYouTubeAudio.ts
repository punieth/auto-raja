"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playlist, trackStartTimes } from "@/data/playlist";
import { brand } from "@/lib/brand";

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: Record<string, unknown>,
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  playVideoAt: (index: number) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getPlayerState: () => number;
  getPlaylist: () => string[] | null | undefined;
  getPlaylistIndex: () => number;
  getVideoData: () => { title?: string; video_id?: string; author?: string };
  destroy: () => void;
}

export interface NowPlaying {
  videoId: string;
  title: string;
  author: string;
  image: string | null;
  index: number;
  total: number;
}

let apiLoadPromise: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }
    if (window.YT?.Player) resolve();
  });

  return apiLoadPromise;
}

function readNowPlaying(player: YTPlayer): NowPlaying {
  const data = player.getVideoData?.() ?? {};
  const list = player.getPlaylist?.() ?? [];
  const index = player.getPlaylistIndex?.() ?? 0;
  const videoId = data.video_id ?? list[index] ?? "";
  return {
    videoId,
    title: data.title?.trim() || brand.name,
    author: data.author?.trim() || "YouTube",
    image: videoId
      ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      : null,
    index: Math.max(0, index),
    total: list?.length ?? 0,
  };
}

export function useYouTubeAudio() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const seekedTrackRef = useRef<number | null>(null);
  const wantsPlayRef = useRef<boolean>(false);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState<NowPlaying>({
    videoId: "",
    title: brand.name,
    author: "Loading playlist…",
    image: null,
    index: 0,
    total: 0,
  });

  const refreshMeta = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      setNow(readNowPlaying(p));
    } catch {
      /* player not ready */
    }
  }, []);

  useEffect(() => {
    let destroyed = false;
    const host = hostRef.current;
    if (!host) return;

    loadYouTubeAPI().then(() => {
      if (destroyed || !window.YT || !hostRef.current) return;

      hostRef.current.innerHTML = "";
      const mount = document.createElement("div");
      hostRef.current.appendChild(mount);

      playerRef.current = new window.YT.Player(mount, {
        height: "1",
        width: "1",
        playerVars: {
          listType: "playlist",
          list: playlist.id,
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: () => {
            if (destroyed) return;
            setReady(true);
            const p = playerRef.current;
            if (wantsPlayRef.current && p) {
              p.playVideo();
            }
            window.setTimeout(() => {
              if (!destroyed) refreshMeta();
            }, 400);
            window.setTimeout(() => {
              if (!destroyed) refreshMeta();
            }, 1200);
          },
          onStateChange: (e: { data: number }) => {
            if (!window.YT || destroyed) return;
            const S = window.YT.PlayerState;
            const p = playerRef.current;
            if (e.data === S.PLAYING) {
              setPlaying(true);
              setBuffering(false);
              wantsPlayRef.current = true;
              refreshMeta();
              if (p) {
                const currentIndex = p.getPlaylistIndex?.() ?? 0;
                if (seekedTrackRef.current !== currentIndex) {
                  seekedTrackRef.current = currentIndex;
                  const startTime = trackStartTimes[currentIndex];
                  if (startTime !== undefined && startTime > 0) {
                    p.seekTo(startTime, true);
                  }
                }
              }
            }
            if (e.data === S.PAUSED) {
              setPlaying(false);
              setBuffering(false);
              wantsPlayRef.current = false;
            }
            if (e.data === S.BUFFERING) {
              setBuffering(true);
              refreshMeta();
            }
            if (e.data === S.CUED) {
              refreshMeta();
            }
            // Playlist auto-advances on ENDED; just refresh title
            if (e.data === S.ENDED) {
              setPlaying(false);
              setBuffering(false);
              wantsPlayRef.current = false;
              window.setTimeout(() => refreshMeta(), 300);
            }
          },
          onError: () => {
            setBuffering(false);
            // Skip broken videos in playlist
            try {
              playerRef.current?.nextVideo();
            } catch {
              /* ignore */
            }
          },
        },
      });
    });

    return () => {
      destroyed = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      setReady(false);
      setPlaying(false);
      setBuffering(false);
    };
  }, [refreshMeta]);

  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p || !window.YT) {
      wantsPlayRef.current = !wantsPlayRef.current;
      setBuffering(wantsPlayRef.current);
      return;
    }
    const state = p.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      wantsPlayRef.current = false;
      setBuffering(false);
      p.pauseVideo();
    } else {
      wantsPlayRef.current = true;
      setBuffering(true);
      p.playVideo();
    }
  }, []);

  const next = useCallback(() => {
    setBuffering(true);
    playerRef.current?.nextVideo();
    window.setTimeout(refreshMeta, 350);
  }, [refreshMeta]);

  const prev = useCallback(() => {
    setBuffering(true);
    playerRef.current?.previousVideo();
    window.setTimeout(refreshMeta, 350);
  }, [refreshMeta]);

  return {
    hostRef,
    playing,
    buffering,
    ready,
    now,
    playlistUrl: playlist.url,
    toggle,
    next,
    prev,
  };
}
