"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type Zone = {
  id: string;
  name: string;
  sub: string;
  stat: string;
  statLabel: string;
  body: string;
  adjacency: string;
  accent: string;
  image: string;
  polygon: string;
  labelX: number;
  labelY: number;
};

const ZONES: Zone[] = [
  {
    id: "avenue",
    name: "The Avenue",
    sub: "Luxury wing",
    stat: "50",
    statLabel: "luxury houses",
    body: "Invitation-only adjacency. Hermès, Saint Laurent, Dolce & Gabbana, Carolina Herrera. Private client suites, valet, and a dedicated arrival driveway separate from retail traffic.",
    adjacency: "Connects to Sea Life Aquarium for unique marine-luxury crossover",
    accent: "#d4b278",
    image: "/images/luxury-wing.jpg",
    polygon: "740,90 1140,90 1140,310 740,310",
    labelX: 940,
    labelY: 200,
  },
  {
    id: "snow",
    name: "Big SNOW",
    sub: "Ski mountain · 16°F · year round",
    stat: "180m",
    statLabel: "vertical slope",
    body: "North America's only indoor real-snow ski and snowboard resort. A 16-story drop, terrain park, and four lifts — operating regardless of outdoor conditions.",
    adjacency: "Glass-walled cafeteria opens onto the luxury wing — heat-and-cold theater",
    accent: "#f6f2ea",
    image: "/images/observation-wheel.jpg",
    polygon: "60,90 320,90 360,310 60,310",
    labelX: 200,
    labelY: 200,
  },
  {
    id: "pac",
    name: "Performing Arts Center",
    sub: "Broadway-grade theater",
    stat: "2,400",
    statLabel: "seats · proscenium",
    body: "Purpose-built fly system, orchestra pit, and live-broadcast specs. The only venue of its kind operating inside a retail destination — Hamilton, awards shows, residencies.",
    adjacency: "Direct freight from loading dock; talent flows discreetly via Black Key entrance",
    accent: "#a97ad4",
    image: "/images/luxury-wing.jpg",
    polygon: "350,90 720,90 720,310 360,310",
    labelX: 535,
    labelY: 200,
  },
  {
    id: "nickelodeon",
    name: "Nickelodeon Universe",
    sub: "Indoor theme park",
    stat: "35+",
    statLabel: "rides & coasters",
    body: "North America's largest indoor theme park. Home to the world's steepest roller coaster (TMNT Shellraiser, 121.5° drop) — a physical impossibility outdoors.",
    adjacency: "Visible from The Avenue's upper concourse — the property's loudest visual signature",
    accent: "#ff4a2b",
    image: "/videos/nickelodeon.mp4",
    polygon: "60,330 720,330 720,540 60,540",
    labelX: 390,
    labelY: 435,
  },
  {
    id: "dreamworks",
    name: "DreamWorks Water Park",
    sub: "1.5 acres · 95°F · year round",
    stat: "35K",
    statLabel: "sq ft wave pool",
    body: "Western Hemisphere's largest indoor wave pool, themed to the DreamWorks animated universes. 95°F indoor tropics regardless of the New Jersey winter outside.",
    adjacency: "Pool bar opens onto The Avenue — wet-and-luxury programming overlap",
    accent: "#4ad9e4",
    image: "/videos/dreamworks.mp4",
    polygon: "740,330 1140,330 1140,540 740,540",
    labelX: 940,
    labelY: 435,
  },
  {
    id: "court",
    name: "The Court",
    sub: "Flexible arena",
    stat: "12,000",
    statLabel: "capacity",
    body: "Soaring indoor plaza engineered to be an empty stage. Rigging, power, and freight pre-specified — load Monday, open doors Wednesday.",
    adjacency: "Connects directly to Rooftop via VIP elevator — show-then-after-party flow",
    accent: "#ff4a2b",
    image: "/images/court-concert.jpg",
    polygon: "60,560 530,560 530,740 60,740",
    labelX: 295,
    labelY: 650,
  },
  {
    id: "expo",
    name: "Expo Hall",
    sub: "Column-free convention space",
    stat: "80,000",
    statLabel: "sq ft",
    body: "Drive-on freight, adjacent to 22,000 parking spaces and the Metropolitan region's largest hotel inventory. Conventions, gala dinners, brand activations.",
    adjacency: "Shares lobby with The Court — overflow capacity for major productions",
    accent: "#f6f2ea",
    image: "/images/food-hall.jpg",
    polygon: "550,560 950,560 950,740 550,740",
    labelX: 750,
    labelY: 650,
  },
  {
    id: "rooftop",
    name: "The Rooftop",
    sub: "Open-air · skyline deck",
    stat: "3,000",
    statLabel: "open-air capacity",
    body: "Manhattan sightlines. Engineered for brand takeover — modular stages, integrated LED, direct freight elevator. Open-air with full power and rigging.",
    adjacency: "Observation Wheel doubles as rooftop visual anchor — visible from the Turnpike",
    accent: "#d4b278",
    image: "/images/observation-wheel.jpg",
    polygon: "970,560 1140,560 1140,740 970,740",
    labelX: 1055,
    labelY: 650,
  },
];

export function PropertyFloorPlan() {
  const [activeId, setActiveId] = useState<string>(ZONES[3].id); // Nickelodeon as default
  const active = ZONES.find((z) => z.id === activeId)!;

  return (
    <section className="relative w-full bg-ink px-6 pt-20 pb-32 md:px-12 md:pt-28 md:pb-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
          <span className="text-bone">Explore the building</span>
          <span className="h-px flex-1 bg-bone/10" />
          <span>8 zones · click anywhere</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Floor plan SVG */}
          <div className="relative overflow-hidden rounded-[28px] border border-bone/10 bg-ink-2">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 80% at 50% 50%, rgba(212,178,120,0.05), transparent 70%)",
              }}
            />
            <div className="bg-grain pointer-events-none absolute inset-0 opacity-40" />

            <svg
              viewBox="0 0 1200 820"
              className="relative w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {ZONES.map((z) => (
                  <radialGradient key={`grad-${z.id}`} id={`grad-${z.id}`} cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor={z.accent} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={z.accent} stopOpacity="0.05" />
                  </radialGradient>
                ))}
                <pattern id="grid-tile" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="rgba(246,242,234,0.04)"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>

              {/* Building outline + grid backdrop */}
              <rect
                x="40"
                y="70"
                width="1120"
                height="690"
                fill="url(#grid-tile)"
                stroke="rgba(246,242,234,0.1)"
                strokeWidth="1"
                rx="12"
              />

              {/* Zone polygons */}
              {ZONES.map((z) => {
                const isActive = z.id === activeId;
                return (
                  <g
                    key={z.id}
                    onClick={() => setActiveId(z.id)}
                    onMouseEnter={() => setActiveId(z.id)}
                    style={{ cursor: "pointer" }}
                    data-cursor="cta"
                    data-cursor-label="View"
                  >
                    {/* Zone fill */}
                    <motion.polygon
                      points={z.polygon}
                      fill={`url(#grad-${z.id})`}
                      stroke={z.accent}
                      strokeWidth={isActive ? "2" : "0.6"}
                      animate={{
                        opacity: isActive ? 1 : activeId ? 0.35 : 0.7,
                      }}
                      transition={{ duration: 0.4 }}
                    />
                    {/* Diagonal hatching for active zone */}
                    {isActive && (
                      <motion.polygon
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.15 }}
                        points={z.polygon}
                        fill={z.accent}
                      />
                    )}
                    {/* Label */}
                    <text
                      x={z.labelX}
                      y={z.labelY - 8}
                      textAnchor="middle"
                      fontSize="13"
                      fontFamily="sans-serif"
                      letterSpacing="0.18em"
                      fontWeight="600"
                      fill={isActive ? z.accent : "rgba(246,242,234,0.55)"}
                      style={{ textTransform: "uppercase" }}
                    >
                      {z.name}
                    </text>
                    <text
                      x={z.labelX}
                      y={z.labelY + 8}
                      textAnchor="middle"
                      fontSize="10"
                      fontFamily="sans-serif"
                      letterSpacing="0.12em"
                      fill="rgba(188,182,168,0.7)"
                    >
                      {z.sub}
                    </text>
                    {isActive && (
                      <motion.circle
                        initial={{ r: 0, opacity: 1 }}
                        animate={{ r: 16, opacity: 0 }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                        cx={z.labelX}
                        cy={z.labelY + 22}
                        fill="none"
                        stroke={z.accent}
                        strokeWidth="0.8"
                      />
                    )}
                    {isActive && (
                      <circle cx={z.labelX} cy={z.labelY + 22} r="3" fill={z.accent} />
                    )}
                  </g>
                );
              })}

              {/* Compass */}
              <g transform="translate(1100,800)">
                <circle r="14" fill="none" stroke="rgba(246,242,234,0.3)" strokeWidth="0.5" />
                <line x1="0" y1="-14" x2="0" y2="14" stroke="rgba(246,242,234,0.3)" strokeWidth="0.5" />
                <line x1="-14" y1="0" x2="14" y2="0" stroke="rgba(246,242,234,0.3)" strokeWidth="0.5" />
                <text
                  x="0"
                  y="-17"
                  textAnchor="middle"
                  fontSize="9"
                  fill="rgba(246,242,234,0.55)"
                  fontFamily="sans-serif"
                >
                  N
                </text>
              </g>

              {/* Scale indicator */}
              <g transform="translate(60,795)">
                <line x1="0" y1="0" x2="80" y2="0" stroke="rgba(246,242,234,0.4)" strokeWidth="0.8" />
                <line x1="0" y1="-3" x2="0" y2="3" stroke="rgba(246,242,234,0.4)" strokeWidth="0.8" />
                <line x1="80" y1="-3" x2="80" y2="3" stroke="rgba(246,242,234,0.4)" strokeWidth="0.8" />
                <text x="40" y="14" textAnchor="middle" fontSize="9" fill="rgba(246,242,234,0.55)" fontFamily="sans-serif" letterSpacing="0.1em">
                  500 FT
                </text>
              </g>

              {/* "You are here" entry marker */}
              <g transform="translate(600,790)">
                <text
                  textAnchor="middle"
                  fontSize="9"
                  fill="rgba(246,242,234,0.45)"
                  fontFamily="sans-serif"
                  letterSpacing="0.18em"
                >
                  ↑ MAIN ENTRANCE · NJ TURNPIKE EXIT 16
                </text>
              </g>
            </svg>

            {/* Help hint overlay */}
            <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 rounded-full border border-bone/15 bg-ink/40 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-bone-dim backdrop-blur">
              <span className="relative block h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-gold" />
                <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
              </span>
              Hover · click any zone
            </div>
          </div>

          {/* Side detail panel */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-[28px] border border-bone/10 bg-ink-2"
              >
                {/* Visual */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  {active.image.endsWith(".mp4") ? (
                    <video
                      key={active.image}
                      src={active.image}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={active.image}
                      alt={active.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/40 to-transparent" />
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{
                      background: `radial-gradient(60% 80% at 30% 100%, ${active.accent}55 0%, transparent 70%)`,
                    }}
                  />
                  <div className="bg-grain absolute inset-0 opacity-40" />
                  <div className="absolute left-5 top-5">
                    <span
                      className="rounded-full border bg-ink/50 px-3 py-1 text-[10px] uppercase tracking-[0.22em] backdrop-blur"
                      style={{ borderColor: `${active.accent}55`, color: active.accent }}
                    >
                      {active.sub}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-7 md:p-8">
                  <div className="font-display text-3xl text-bone md:text-4xl">{active.name}</div>
                  <p className="mt-3 text-[14px] leading-relaxed text-bone-dim md:text-[15px]">
                    {active.body}
                  </p>

                  <div className="mt-6 flex items-baseline gap-3 border-t border-bone/10 pt-5">
                    <span className="font-display text-4xl" style={{ color: active.accent }}>
                      {active.stat}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                      {active.statLabel}
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl border border-bone/10 bg-ink/50 p-4">
                    <div className="text-[9px] uppercase tracking-[0.24em] text-bone-dim">
                      Adjacency play
                    </div>
                    <div className="mt-1.5 text-[13px] leading-relaxed text-bone">
                      {active.adjacency}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mini zone strip — small clickable pills */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {ZONES.map((z) => {
                const isActive = z.id === activeId;
                return (
                  <button
                    key={z.id}
                    onClick={() => setActiveId(z.id)}
                    data-cursor="cta"
                    data-cursor-label="View"
                    className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                      isActive ? "border-bone bg-bone text-ink" : "border-bone/15 text-bone hover:border-bone/40"
                    }`}
                  >
                    {z.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
