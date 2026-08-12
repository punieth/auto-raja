"use client";

import { Header } from "./Header";
import { Player } from "./Player";
import { TitleOverlay } from "./TitleOverlay";

export function NammaMeterApp() {
  return (
    <div className="app-shell fixed inset-0 overflow-hidden bg-[#0a0a0c] text-white">
      <div className="hero-stage pointer-events-none absolute inset-0">
        <img
          src="/auto-raja-sunny-day.png?v=sunny-v2"
          alt=""
          aria-hidden
          className="hero-blur absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl sm:hidden"
          draggable={false}
        />
        <div className="absolute inset-0 bg-[#0a0a0c]/35 sm:hidden" aria-hidden />

        <img
          src="/auto-raja-sunny-day.png?v=sunny-v2"
          alt="Auto Raja driving on a sunny day in Bangalore"
          className="hero-main absolute inset-0 h-full w-full select-none object-contain object-center sm:object-cover sm:object-center"
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
