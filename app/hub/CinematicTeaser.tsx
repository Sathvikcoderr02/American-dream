"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePortal } from "./HubProvider";

export function CinematicTeaser() {
  const { openPortal } = usePortal();
  const [outdoorTempF, setOutdoorTempF] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/weather")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (typeof d.outdoorTempF === "number") setOutdoorTempF(d.outdoorTempF);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.0 }}
      className="relative z-10 mx-auto mt-6 max-w-[1400px] px-6 md:px-12"
    >
      <button
        onClick={() => openPortal("attractions")}
        data-cursor="cta"
        data-cursor-label="Step in"
        className="group relative flex w-full overflow-hidden rounded-3xl border border-aqua/30 bg-ink-2 text-left transition-colors hover:border-aqua/60"
      >
        {/* Video preview — short loop of big-snow */}
        <div className="absolute inset-0 -z-10">
          <video
            ref={videoRef}
            src="/videos/big-snow.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/20" />
          <div className="bg-grain absolute inset-0 opacity-40" />
        </div>

        <div className="grid w-full grid-cols-1 items-center gap-4 p-6 md:grid-cols-[1.5fr_auto] md:p-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-bone-dim">
              <span className="relative block h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-aqua" />
                <span className="absolute inset-0 animate-ping rounded-full bg-aqua/60" />
              </span>
              <span className="text-aqua">The cinematic moment</span>
              <span>·</span>
              <span>30 seconds · worth opening</span>
            </div>
            <div className="mt-3 font-display text-2xl leading-tight text-bone md:text-4xl">
              It is{" "}
              <span className="text-aqua">
                {outdoorTempF !== null ? `${outdoorTempF}°F` : "—°F"}
              </span>{" "}
              outside.{" "}
              <span className="italic text-bone-dim">
                Inside, it&apos;s 16°F and snowing.
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-bone-dim md:text-[14px]">
              The deck&apos;s strongest beat is one click away. Live weather, real footage,
              full-screen cinema. The only place in North America where this is possible.
            </p>
          </div>

          <div className="flex items-center gap-3 md:flex-col md:items-end">
            <span className="rounded-full border border-aqua/40 bg-aqua/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-aqua">
              Attractions → Big SNOW
            </span>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-aqua/60 bg-ink/40 text-aqua transition-all duration-500 group-hover:translate-x-1 group-hover:bg-aqua/20">
              →
            </span>
          </div>
        </div>
      </button>
    </motion.section>
  );
}
