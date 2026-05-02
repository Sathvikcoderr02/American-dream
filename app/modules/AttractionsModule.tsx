"use client";

import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ATTRACTIONS } from "@/lib/data";
import { CinematicSnow } from "./CinematicSnow";

const ACCENT_HEX: Record<string, string> = {
  ember: "#ff4a2b",
  aqua: "#4ad9e4",
  gold: "#d4b278",
  plum: "#a97ad4",
  bone: "#f6f2ea",
};

const BIG_SNOW_INDEX = 2;
const WHEEL_INDEX = 6;

type WeatherState =
  | { status: "loading" }
  | { status: "ready"; tempF: number; condition: string }
  | { status: "error" };

export function AttractionsModule() {
  const [index, setIndex] = useState(0);
  const [weather, setWeather] = useState<WeatherState>({ status: "loading" });
  const [cinemaOpen, setCinemaOpen] = useState(false);
  const current = ATTRACTIONS[index];
  const accentHex = ACCENT_HEX[current.accent] ?? "#f6f2ea";
  const scrollRef = useRef<HTMLDivElement>(null);
  const outdoorTempF =
    weather.status === "ready" ? weather.tempF : null;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/weather")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (typeof d.outdoorTempF === "number") {
          setWeather({ status: "ready", tempF: d.outdoorTempF, condition: d.condition ?? "outside" });
        } else {
          setWeather({ status: "error" });
        }
      })
      .catch(() => {
        if (!cancelled) setWeather({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div
      key="attractions"
      layoutId="portal-attractions"
      className="fixed inset-0 z-30 overflow-hidden bg-ink"
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
    >
      <div ref={scrollRef} className="h-full w-full overflow-y-auto overflow-x-hidden">
        {/* Stage — full viewport */}
        <section className="relative h-screen w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {current.video ? (
                <video
                  key={current.video}
                  src={current.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : "image" in current && current.image ? (
                index === WHEEL_INDEX ? (
                  <ParallaxImage src={current.image} alt={current.name} />
                ) : (
                  <Image
                    src={current.image}
                    alt={current.name}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                  />
                )
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background: `radial-gradient(50% 70% at 30% 100%, ${accentHex}33 0%, transparent 70%)`,
                }}
              />
              <div className="bg-grain absolute inset-0 opacity-50" />
            </motion.div>
          </AnimatePresence>

          {/* Top-right counter */}
          <div className="pointer-events-none absolute right-6 top-24 z-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-bone-dim md:right-12">
            <span className="font-display text-3xl text-bone">
              0{index + 1}
            </span>
            <span className="text-bone/30">/</span>
            <span>0{ATTRACTIONS.length}</span>
          </div>

          {/* Content overlay */}
          <div className="absolute inset-0 z-10 flex items-end">
            <div className="w-full px-6 pb-12 md:px-12 md:pb-20">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-[10px] uppercase tracking-[0.28em] text-bone-dim">
                      {current.subtitle}
                    </div>
                    <h2 className="mt-4 font-display text-[40px] leading-[0.95] text-bone md:text-[80px]">
                      {current.name}
                    </h2>
                    <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-bone-dim md:text-[16px]">
                      {current.body}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-bone/15 bg-ink-2/40 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-bone-dim backdrop-blur">
                      <span className="block h-1 w-1 rounded-full bg-aqua" />
                      Operating now · all 7 worlds open daily
                    </div>
                    <div className="mt-7 flex items-baseline gap-3">
                      <span
                        className="font-display text-5xl leading-none md:text-6xl"
                        style={{ color: accentHex }}
                      >
                        {current.stat}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.22em] text-bone-dim">
                        {current.statLabel}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Right column: Big SNOW live panel OR a quiet flavor card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`right-${current.name}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.5 }}
                  >
                    {index === BIG_SNOW_INDEX ? (
                      <BigSnowLivePanel
                        weather={weather}
                        accent={accentHex}
                        onStepInside={() => setCinemaOpen(true)}
                      />
                    ) : (
                      <FlavorPanel index={index} accent={accentHex} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Picker rail */}
        <section className="relative w-full bg-ink px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-bone-dim">
              <span className="text-bone">Switch worlds</span>
              <span className="h-px flex-1 bg-bone/10" />
              <span>Hover or tap any card</span>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
              {ATTRACTIONS.map((a, i) => {
                const active = i === index;
                const accent = ACCENT_HEX[a.accent] ?? "#f6f2ea";
                return (
                  <button
                    key={a.name}
                    data-cursor="cta"
                    data-cursor-label="View"
                    onMouseEnter={() => setIndex(i)}
                    onFocus={() => setIndex(i)}
                    onClick={() => {
                      setIndex(i);
                      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`group relative flex aspect-[3/4] flex-col items-start justify-between overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                      active ? "border-bone/50 bg-ink-2" : "border-bone/10 hover:border-bone/30"
                    }`}
                  >
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 ${
                        active ? "opacity-100" : "group-hover:opacity-60"
                      }`}
                      style={{
                        background: `radial-gradient(80% 60% at 50% 100%, ${accent}33, transparent 70%)`,
                      }}
                    />
                    <div className="text-[9px] uppercase tracking-[0.22em] text-bone-dim">
                      0{i + 1}
                    </div>
                    <div>
                      <div
                        className="font-display text-2xl leading-tight md:text-2xl"
                        style={{ color: active ? accent : "#f6f2ea" }}
                      >
                        {a.name.split(" ").slice(0, 3).join(" ")}
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-bone-dim">
                        {a.statLabel}
                      </div>
                    </div>
                    {active && (
                      <motion.span
                        layoutId="attr-rail-underline"
                        className="absolute inset-x-3 bottom-0 h-px"
                        style={{ background: accent }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Cinematic Big SNOW takeover — the elevated "I need to be here" moment */}
      <CinematicSnow
        open={cinemaOpen}
        outdoorTempF={outdoorTempF}
        onClose={() => setCinemaOpen(false)}
      />
    </motion.div>
  );
}

// --- The "I need to be here" moment ---

function BigSnowLivePanel({
  weather,
  accent,
  onStepInside,
}: {
  weather: WeatherState;
  accent: string;
  onStepInside: () => void;
}) {
  const isSummer = weather.status === "ready" && weather.tempF >= 70;
  const isCold = weather.status === "ready" && weather.tempF <= 35;

  let pitch = "Inside: 16°F and real snow, 365 days a year.";
  if (isSummer) pitch = "Inside, it's 16°F and real snow. Year-round.";
  if (isCold) pitch = "Inside, it's 16°F — drier, groomed, and lit for night skiing.";

  return (
    <div className="rounded-[28px] border border-bone/15 bg-ink-2/70 p-6 backdrop-blur-xl md:p-8">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-bone-dim">
        <span className="relative block h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full" style={{ background: accent }} />
          <span
            className="absolute inset-0 animate-ping rounded-full"
            style={{ background: accent, opacity: 0.5 }}
          />
        </span>
        <span style={{ color: accent }}>Live</span>
        <span className="text-bone-dim">·</span>
        <span>Meadowlands NJ</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/5">
        <Reading
          label="Outside now"
          value={
            weather.status === "ready"
              ? `${weather.tempF}°F`
              : weather.status === "loading"
                ? "—"
                : "n/a"
          }
          loading={weather.status === "loading"}
          accent={false}
        />
        <Reading label="Indoor temp" value="16°F" accent />
        <Reading label="Lift status" value="3 of 4 open" />
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={weather.status === "ready" ? `temp-${weather.tempF}` : weather.status}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-2xl leading-snug text-bone md:text-3xl"
          >
            {weather.status === "ready" ? (
              <>
                It is{" "}
                <span style={{ color: accent }}>
                  {weather.tempF}°F
                </span>{" "}
                outside.
                <br />
                {pitch}
              </>
            ) : weather.status === "loading" ? (
              <span className="animate-pulse text-bone-dim">Reading live conditions…</span>
            ) : (
              <>
                Outside changes daily.
                <br />
                Inside is 16°F and real snow, 365 days a year.
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 border-t border-bone/10 pt-4 text-[11px] leading-relaxed text-bone-dim">
        North America's only indoor real-snow ski + snowboard resort. A 16-story drop,
        180 vertical meters of slope, and a terrain park — operating regardless of
        what the sky is doing in New Jersey.
      </div>

      {/* Cinematic CTA — the "I need to be here" moment */}
      <button
        onClick={onStepInside}
        data-cursor="cta"
        data-cursor-label="Step in"
        className="group mt-5 flex w-full items-center justify-between gap-3 rounded-2xl border bg-gradient-to-br from-aqua/10 via-ink-2 to-ink-2 px-5 py-4 text-left transition-all hover:from-aqua/20 hover:to-ink"
        style={{ borderColor: `${accent}55` }}
      >
        <div>
          <div className="text-[9px] uppercase tracking-[0.28em]" style={{ color: accent }}>
            Cinematic moment · 16°F
          </div>
          <div className="mt-1 font-display text-xl text-bone leading-tight">
            Step inside the only place this exists.
          </div>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all group-hover:translate-x-1"
          style={{ borderColor: `${accent}80`, color: accent }}
        >
          →
        </span>
      </button>
    </div>
  );
}

function Reading({
  label,
  value,
  loading,
  accent,
}: {
  label: string;
  value: string;
  loading?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="bg-ink-2 p-4">
      <div className="text-[9px] uppercase tracking-[0.22em] text-bone-dim">{label}</div>
      <div
        className={`mt-1.5 font-display text-3xl leading-none ${
          accent ? "text-aqua" : "text-bone"
        } ${loading ? "animate-pulse text-bone-dim" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

// --- Right-column flavor for non-snow attractions ---

function FlavorPanel({ index, accent }: { index: number; accent: string }) {
  const lines = [
    // Nickelodeon
    {
      kicker: "Velocity",
      headline: "World's steepest roller coaster.",
      body: "TMNT Shellraiser drops at a 121.5° angle — physically impossible to replicate outdoors at this scale.",
    },
    // DreamWorks
    {
      kicker: "Climate",
      headline: "95°F. Year round.",
      body: "1.5 acres of indoor tropics. The Western Hemisphere's largest indoor wave pool, sized like a ten-lane highway.",
    },
    // Big SNOW (handled separately)
    null,
    // Sea Life
    {
      kicker: "Inhabitants",
      headline: "3,000 marine animals.",
      body: "A full walk-through ocean — eye-level with the luxury wing. The aquarium that turns retail traffic into return visits.",
    },
    // Mini golf
    {
      kicker: "Licensing",
      headline: "Built on Angry Birds.",
      body: "An IP-licensed entertainment canvas. The model for any brand looking to build a permanent experience inside the property.",
    },
    // LEGOLAND
    {
      kicker: "Anchor",
      headline: "Birthday-economy lock.",
      body: "10+ attractions across two floors. Drives weekday traffic and recurring family return — the foundation underneath the rest.",
    },
    // Wheel
    {
      kicker: "Sightlines",
      headline: "300 ft above the Meadowlands.",
      body: "A skyline charter, a brand canvas, a first-date icon — visible from the Turnpike from miles out. Move your cursor across the image.",
    },
  ];

  const item = lines[index];
  if (!item) return null;

  return (
    <div className="rounded-[28px] border border-bone/15 bg-ink-2/70 p-6 backdrop-blur-xl md:p-8">
      <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: accent }}>
        {item.kicker}
      </div>
      <div className="mt-3 font-display text-2xl leading-tight text-bone md:text-3xl">
        {item.headline}
      </div>
      <div className="mt-4 text-[13px] leading-relaxed text-bone-dim md:text-[14px]">
        {item.body}
      </div>
    </div>
  );
}

// --- Observation Wheel parallax (mouse-driven rotation) ---

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  const rotate = useTransform(sx, [-1, 1], [-6, 6]);
  const translateY = useTransform(sy, [-1, 1], [-20, 20]);
  const translateX = useTransform(sx, [-1, 1], [-20, 20]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = ((e.clientY - r.top) / r.height) * 2 - 1;
    mx.set(x);
    my.set(y);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="absolute inset-0 overflow-hidden"
      data-cursor="drag"
      data-cursor-label="Tilt"
    >
      <motion.div
        style={{ rotate, x: translateX, y: translateY, scale: 1.15 }}
        className="absolute inset-0"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </motion.div>
    </div>
  );
}
