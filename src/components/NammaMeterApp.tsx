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
        {/* Mobile Blur */}
        <img
          src="/auto-portrait.png?v=portrait-v1"
          alt=""
          aria-hidden
          className="hero-blur absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl sm:hidden"
          draggable={false}
        />
        {/* Desktop Blur */}
        <img
          src="/auto-raja-sunny-day.png?v=original-restored"
          alt=""
          aria-hidden
          className="hero-blur absolute inset-0 hidden h-full w-full scale-110 object-cover opacity-70 blur-2xl sm:block"
          draggable={false}
        />
        <div className="absolute inset-0 bg-[#0a0a0c]/35" aria-hidden />

        {/* Mobile View Image */}
        <img
          src="/auto-portrait.png?v=portrait-v1"
          alt="Auto Raja driving on a sunny day in Bangalore"
          className="hero-main absolute inset-0 h-full w-full select-none object-cover object-center sm:hidden"
          draggable={false}
          decoding="async"
          fetchPriority="high"
        />

        {/* Desktop View Image */}
        <img
          src="/auto-raja-sunny-day.png?v=original-restored"
          alt="Auto Raja driving on a sunny day in Bangalore"
          className="hero-main absolute inset-0 hidden h-full w-full select-none object-cover object-center sm:block"
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
