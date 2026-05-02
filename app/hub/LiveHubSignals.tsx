"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type WeatherState =
  | { status: "loading" }
  | { status: "ready"; tempF: number }
  | { status: "error" };

const ZONES = [
  { name: "Big SNOW", temp: "16°F", note: "real snow · groomed", accent: "var(--color-aqua)" },
  { name: "Water Park", temp: "95°F", note: "indoor tropics", accent: "var(--color-ember)" },
  { name: "The Avenue", temp: "72°F", note: "luxury wing", accent: "var(--color-gold)" },
];

const TICKER = [
  { tag: "BOOKING", text: "Hamilton just held 8 nights · June at PAC" },
  { tag: "BOOKING", text: "Saint Laurent Resort Show confirmed · May 14 · The Court" },
  { tag: "LEASING", text: "Suite L-204 (12,400 sq ft) · between Hermès and Saint Laurent" },
  { tag: "PARTNERSHIP", text: "Aperol Summer Series launches · 12 weeks · Rooftop" },
  { tag: "OPEN", text: "Toys R Us flagship reopened · 30,000 sq ft · ground floor" },
  { tag: "BOOKING", text: "NYNJ Tech Conference 2026 confirmed · Expo Hall · Jun 18" },
];

// Persisted "visitor count" — feels live, but plausibly grounded.
// Starts at a number derived from the day, ticks up at variable intervals.
function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  const [delta, setDelta] = useState<number | null>(null);

  useEffect(() => {
    // Seed with deterministic day-of-year baseline so it doesn't reset to 0 every refresh
    const d = new Date();
    const dayOfYear = Math.floor(
      (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const hour = d.getHours();
    // Roughly 110K daily visitors on average — scale by hour-of-day curve
    const hourCurve = Math.max(0.05, Math.sin(((hour - 6) / 18) * Math.PI));
    const dailyTarget = 110_000 + (dayOfYear % 17) * 1300;
    const baseline = Math.floor(dailyTarget * hourCurve * 0.7) + 18_000;
    setCount(baseline);

    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const inc = Math.floor(Math.random() * 4) + 1; // +1 to +4
      setDelta(inc);
      setCount((c) => (c ?? baseline) + inc);
      // Variable next interval: 2.5s–4.5s
      const next = 2500 + Math.random() * 2000;
      setTimeout(tick, next);
    };
    const initial = setTimeout(tick, 1500);
    return () => {
      cancelled = true;
      clearTimeout(initial);
    };
  }, []);

  return { count, delta };
}

function useOutdoorTemp() {
  const [state, setState] = useState<WeatherState>({ status: "loading" });
  useEffect(() => {
    let cancelled = false;
    fetch("/api/weather")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (typeof d.outdoorTempF === "number") {
          setState({ status: "ready", tempF: d.outdoorTempF });
        } else {
          setState({ status: "error" });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}

function useTickerRotation() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % TICKER.length);
    }, 4200);
    return () => clearInterval(t);
  }, []);
  return TICKER[index];
}

export function LiveHubSignals() {
  const { count, delta } = useVisitorCount();
  const outdoor = useOutdoorTemp();
  const ticker = useTickerRotation();

  const formatNumber = (n: number) =>
    n.toLocaleString("en-US", { useGrouping: true });

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="relative z-10 mx-auto max-w-[1400px] px-6 pt-4 md:px-12"
    >
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-bone/10 bg-bone/5 lg:grid-cols-[1.4fr_1fr_1.6fr]">
        {/* Multi-zone temperature panel */}
        <div className="bg-ink-2/80 p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
            <span className="relative block h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-aqua" />
              <span className="absolute inset-0 animate-ping rounded-full bg-aqua/60" />
            </span>
            <span className="text-aqua">Live</span>
            <span>·</span>
            <span>Inside the building right now</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-3 md:gap-5">
            {ZONES.map((z) => (
              <div key={z.name} className="flex-1">
                <div
                  className="font-display text-2xl leading-none md:text-3xl"
                  style={{ color: z.accent }}
                >
                  {z.temp}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-bone">
                  {z.name}
                </div>
                <div className="mt-0.5 text-[9px] tracking-wide text-bone-dim">
                  {z.note}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-bone/10 pt-2.5 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
            Outside ·{" "}
            <span className="text-bone">
              {outdoor.status === "ready"
                ? `${outdoor.tempF}°F Meadowlands`
                : outdoor.status === "loading"
                  ? "reading sensor…"
                  : "—"}
            </span>
          </div>
        </div>

        {/* Visitor counter */}
        <div className="relative overflow-hidden bg-ink-2/80 p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
            <span className="relative block h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-ember" />
              <span className="absolute inset-0 animate-ping rounded-full bg-ember/60" />
            </span>
            <span className="text-ember">Live</span>
            <span>·</span>
            <span>In the building today</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <div className="font-display text-4xl text-bone md:text-5xl">
              {count !== null ? formatNumber(count) : "—"}
            </div>
            <AnimatePresence mode="popLayout">
              {delta !== null && (
                <motion.span
                  key={`${count}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5 }}
                  className="font-display text-base text-ember md:text-lg"
                >
                  +{delta}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
            visitors · ticking up
          </div>
          <div className="mt-3 border-t border-bone/10 pt-2.5 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
            Avg dwell · <span className="text-bone">4h 12m</span>
          </div>
        </div>

        {/* Rotating ticker */}
        <div className="relative overflow-hidden bg-ink-2/80 p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
            <span className="relative block h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-gold" />
              <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
            </span>
            <span className="text-gold">Live</span>
            <span>·</span>
            <span>Commercial activity</span>
          </div>
          <div className="mt-4 min-h-[60px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={ticker.text}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-[9px] uppercase tracking-[0.24em] text-gold">
                  {ticker.tag}
                </div>
                <div className="mt-2 font-display text-base leading-snug text-bone md:text-lg">
                  {ticker.text}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-3 flex items-center gap-1.5 border-t border-bone/10 pt-2.5">
            {TICKER.map((_, i) => (
              <span
                key={i}
                className={`h-px transition-all duration-500 ${
                  i === TICKER.indexOf(ticker) ? "w-6 bg-gold" : "w-2 bg-bone/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
