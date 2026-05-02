"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  outdoorTempF: number | null;
  onClose: () => void;
};

// 7 sequential beats, each appears one after the other
const BEATS = (outdoor: number | null) => [
  {
    delay: 1500,
    text: outdoor !== null ? `It is ${outdoor}°F outside.` : "It is changing outside.",
    size: "lg",
  },
  {
    delay: 4000,
    text: "Inside this building, it is 16°F and snowing.",
    size: "lg",
  },
  {
    delay: 6800,
    text: "365 days a year.",
    size: "xl",
  },
  {
    delay: 9500,
    text: "There is only one place in North America where this is possible.",
    size: "md",
  },
];

export function CinematicSnow({ open, outdoorTempF, onClose }: Props) {
  const [phase, setPhase] = useState(0); // 0=intro, 1+=beats revealed
  const beats = BEATS(outdoorTempF);

  useEffect(() => {
    if (!open) {
      setPhase(0);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    beats.forEach((b, i) => {
      timers.push(setTimeout(() => setPhase(i + 1), b.delay));
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cinematic-snow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-ink"
        >
          {/* Fullscreen video — fades up after a beat of black */}
          <motion.video
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 0.9, scale: 1.02 }}
            transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }}
            src="/videos/big-snow.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Vignette + atmospheric tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/80" />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(80% 60% at 50% 50%, transparent 30%, rgba(7,7,10,0.85) 100%)",
            }}
          />
          <div className="bg-grain pointer-events-none absolute inset-0 opacity-40" />

          {/* Live indicator top-left */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-aqua/40 bg-ink/40 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-aqua backdrop-blur-md md:left-12 md:top-12"
          >
            <span className="relative block h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-aqua" />
              <span className="absolute inset-0 animate-ping rounded-full bg-aqua/60" />
            </span>
            Live · Big SNOW · Meadowlands NJ
          </motion.div>

          {/* Skip + ESC */}
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            onClick={onClose}
            data-cursor="cta"
            data-cursor-label="Exit"
            className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-bone/20 bg-ink/40 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-bone backdrop-blur-md transition-colors hover:border-bone/50 md:right-12 md:top-12"
          >
            Exit cinema · ESC
          </motion.button>

          {/* Beats — typewriter sequence */}
          <div className="relative z-10 flex max-w-5xl flex-col items-center gap-6 px-6 text-center md:gap-10 md:px-12">
            {beats.map((beat, i) => {
              const visible = phase > i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                  animate={
                    visible
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: 30, filter: "blur(12px)" }
                  }
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className={`font-display leading-[1.05] text-bone ${
                    beat.size === "xl"
                      ? "text-5xl md:text-8xl"
                      : beat.size === "lg"
                        ? "text-4xl md:text-7xl"
                        : "text-2xl md:text-4xl"
                  }`}
                >
                  {beat.text.split(" ").map((word, j) => {
                    const isHighlight =
                      word.includes("16°F") ||
                      word.includes("16°F.") ||
                      word.includes("snowing.") ||
                      word.includes("only");
                    return (
                      <span key={j}>
                        <span className={isHighlight ? "italic text-aqua" : ""}>{word}</span>{" "}
                      </span>
                    );
                  })}
                </motion.div>
              );
            })}
          </div>

          {/* Bottom — three live readings appear after all beats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: phase >= beats.length ? 1 : 0, y: phase >= beats.length ? 0 : 30 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="absolute inset-x-0 bottom-10 z-10 px-6 md:bottom-16 md:px-12"
          >
            <div className="mx-auto grid max-w-4xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-bone/15 bg-ink-2/70 backdrop-blur-xl">
              <Reading
                label="Outside now"
                value={outdoorTempF !== null ? `${outdoorTempF}°F` : "—"}
              />
              <Reading label="Indoor temp" value="16°F" accent />
              <Reading label="Lifts open" value="3 of 4" />
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.28em] text-bone-dim">
              <span className="block h-px w-12 bg-bone/20" />
              <button
                onClick={onClose}
                data-cursor="cta"
                data-cursor-label="Continue"
                className="rounded-full border border-bone/30 bg-ink/40 px-5 py-2 text-bone backdrop-blur-md transition-colors hover:border-bone/60"
              >
                Continue exploring →
              </button>
              <span className="block h-px w-12 bg-bone/20" />
            </div>
          </motion.div>

          {/* Progress dots — show beat progress */}
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-6">
            {beats.map((_, i) => (
              <motion.span
                key={i}
                animate={{
                  width: phase > i ? 32 : 8,
                  opacity: phase > i ? 1 : 0.3,
                }}
                transition={{ duration: 0.5 }}
                className="h-px bg-bone"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Reading({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-ink/60 p-5 backdrop-blur md:p-7">
      <div className="text-[9px] uppercase tracking-[0.24em] text-bone-dim">{label}</div>
      <div
        className={`mt-2 font-display text-3xl leading-none md:text-5xl ${
          accent ? "text-aqua" : "text-bone"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
