"use client";

import { brand } from "@/lib/brand";

interface TitleOverlayProps {
  visible: boolean;
}

export function TitleOverlay({ visible }: TitleOverlayProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-[max(2.75rem,7.5dvh)] z-20 flex flex-col items-center px-4 text-center transition-all duration-700 sm:top-[10%] sm:px-5 md:top-[9%] ${
        visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      }`}
    >
      <div className="brand-bug">
        <span className="brand-bug__pulse" aria-hidden />
        <span className="brand-bug__label">ON AIR</span>
        <span className="brand-bug__dot" aria-hidden />
        <span className="brand-bug__loc">{brand.location}</span>
      </div>

      <h1 className="brand-wordmark mt-2 sm:mt-4">
        <span className="brand-wordmark__auto">Auto</span>{" "}
        <span className="brand-wordmark__raja">Raja</span>
      </h1>

      <p className="brand-kannada mt-1.5 font-kannada text-sm font-semibold text-white/90 sm:mt-2 sm:text-lg">
        {brand.nameKannada}
      </p>
    </div>
  );
}
