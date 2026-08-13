"use client";

import { useEffect } from "react";
import { Header } from "./Header";
import { Player } from "./Player";
import { TitleOverlay } from "./TitleOverlay";

export function NammaMeterApp() {
  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("ar_tracked")) {
      sessionStorage.setItem("ar_tracked", "1");
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referrer: document.referrer }),
      }).catch(() => { });
    }
  }, []);

  return (
    <div className="app-shell fixed inset-0 overflow-hidden bg-[#0a0a0c] text-white">
      <div className="hero-stage pointer-events-none absolute inset-0">
        <img
          src="/auto-raja-sunny-day.png?v=original-restored"
          alt=""
          aria-hidden
          className="hero-blur absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl"
          draggable={false}
        />
        <div className="absolute inset-0 bg-[#0a0a0c]/35" aria-hidden />

        <img
          src="/auto-raja-sunny-day.png?v=original-restored"
          alt="Auto Raja driving on a sunny day in Bangalore"
          className="hero-main absolute inset-0 h-full w-full select-none object-fill object-center"
          draggable={false}
          decoding="async"
          fetchPriority="high"
        />
      </div>

      <Header />
      <TitleOverlay visible />
      <Player />
    </div>
  );
}
