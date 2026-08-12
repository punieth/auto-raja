"use client";

import { useEffect, useState } from "react";

function formatTime(date: Date) {
  return date
    .toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    })
    .toLowerCase();
}

export function useLocalTime() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}
