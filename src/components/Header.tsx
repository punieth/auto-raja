"use client";

import { brand } from "@/lib/brand";

export function Header() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 sm:pt-6">
      <span className="sr-only">{brand.name}</span>
    </header>
  );
}
