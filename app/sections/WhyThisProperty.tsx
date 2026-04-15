"use client";

import { motion } from "framer-motion";
import { SectionIntro } from "@/components/SectionIntro";
import { MediaPanel } from "@/components/MediaPanel";
import { DEMOGRAPHICS, PROPERTY_FACTS } from "@/lib/data";

export function WhyThisProperty() {
  return (
    <section id="why" className="relative bg-ink px-6 py-40 md:px-12">
      <SectionIntro
        index="01"
        eyebrow="Location · Scale · Reach"
        title={
          <>
            A commercial platform,
            <br />
            <span className="italic text-gold">built on an intersection.</span>
          </>
        }
        lede="American Dream sits at the nexus of three interstates, twenty-two million people, and the media capital of the world. Ten minutes from Manhattan. A direct line to the most valuable consumer market on earth."
      />

      <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* Map panel — SVG abstraction of the metro */}
        <MediaPanel
          kicker="Tri-State Reach"
          label="10 minutes from Manhattan"
          gradient="from-gold/20 via-ember/10 to-ink"
          aspect="square"
        >
          <MetroMap />
        </MediaPanel>

        <div className="flex flex-col justify-center gap-10">
          {PROPERTY_FACTS.map((fact, i) => (
            <motion.div
              key={fact.heading}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="border-l border-bone/15 pl-6"
            >
              <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                Fact {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display text-2xl text-bone md:text-3xl">
                {fact.heading}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-bone-dim">
                {fact.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demographics grid */}
      <div className="mx-auto mt-24 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7 }}
          className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim"
        >
          <span className="text-bone">Trade Area</span>
          <span className="h-px flex-1 bg-bone/10" />
          <span>Source: Esri / Placer.ai / Internal</span>
        </motion.div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-bone/10 bg-bone/5 md:grid-cols-3 lg:grid-cols-6">
          {DEMOGRAPHICS.map((d, i) => (
            <motion.div
              key={d.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="bg-ink-2 p-6"
            >
              <div className="font-display text-4xl text-bone">{d.kpi}</div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-bone-dim">
                {d.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetroMap() {
  // Concentric drive-time map: mall is the center, surrounding destinations
  // sit at angles + radii proportional to drive time. Labels are placed
  // OUTSIDE the marker so nothing collides with the glow.
  const cx = 50;
  const cy = 50;

  const destinations = [
    { name: "NYC", minutes: "10 min", angle: 50, distance: 22, anchor: "start" as const },
    { name: "JFK", minutes: "35 min", angle: 110, distance: 36, anchor: "start" as const },
    { name: "EWR", minutes: "8 min", angle: 195, distance: 18, anchor: "end" as const },
    { name: "Hoboken", minutes: "12 min", angle: 70, distance: 14, anchor: "start" as const },
    { name: "Yankee Stadium", minutes: "18 min", angle: 25, distance: 26, anchor: "start" as const },
    { name: "MetLife Stadium", minutes: "4 min", angle: 280, distance: 9, anchor: "end" as const },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="mall-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f1cf8a" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#f1cf8a" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#f1cf8a" stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path
              d="M 6 0 L 0 0 0 6"
              fill="none"
              stroke="rgba(246,242,234,0.04)"
              strokeWidth="0.25"
            />
          </pattern>
        </defs>

        <rect width="100" height="100" fill="url(#grid)" />

        {/* Drive-time rings */}
        {[15, 25, 35].map((r) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(246,242,234,0.12)"
            strokeWidth="0.25"
            strokeDasharray="0.6 1.2"
          />
        ))}

        {/* Drive-time ring labels */}
        <text x={cx + 15} y={cy - 0.6} fontSize="1.6" fill="rgba(246,242,234,0.35)" fontFamily="sans-serif" letterSpacing="0.1em">10 MIN</text>
        <text x={cx + 25} y={cy - 0.6} fontSize="1.6" fill="rgba(246,242,234,0.35)" fontFamily="sans-serif" letterSpacing="0.1em">20 MIN</text>
        <text x={cx + 35} y={cy - 0.6} fontSize="1.6" fill="rgba(246,242,234,0.35)" fontFamily="sans-serif" letterSpacing="0.1em">30 MIN</text>

        {/* Connector lines from mall to destinations */}
        {destinations.map((d) => {
          const rad = (d.angle * Math.PI) / 180;
          const x = cx + d.distance * Math.cos(rad);
          const y = cy + d.distance * Math.sin(rad);
          return (
            <line
              key={d.name + "-line"}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="rgba(246,242,234,0.16)"
              strokeWidth="0.25"
              strokeDasharray="0.8 1"
            />
          );
        })}

        {/* Mall glow + dot — kept compact and well below label space */}
        <circle cx={cx} cy={cy} r="11" fill="url(#mall-glow)" />
        <circle cx={cx} cy={cy} r="1.6" fill="#f1cf8a">
          <animate attributeName="r" values="1.6;2.4;1.6" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx={cx} cy={cy} r="2.4" fill="none" stroke="#f1cf8a" strokeWidth="0.2" opacity="0.6">
          <animate attributeName="r" values="2.4;9" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur="2.6s" repeatCount="indefinite" />
        </circle>

        {/* Mall label — placed BELOW the dot, never overlapping it */}
        <text
          x={cx}
          y={cy - 4.5}
          textAnchor="middle"
          fontSize="2.2"
          fill="#f1cf8a"
          fontWeight="700"
          fontFamily="sans-serif"
          letterSpacing="0.18em"
        >
          AMERICAN DREAM
        </text>
        <text
          x={cx}
          y={cy + 6.2}
          textAnchor="middle"
          fontSize="1.4"
          fill="rgba(212,178,120,0.6)"
          fontFamily="sans-serif"
          letterSpacing="0.16em"
        >
          MEADOWLANDS · NJ
        </text>

        {/* Destination markers + labels */}
        {destinations.map((d) => {
          const rad = (d.angle * Math.PI) / 180;
          const x = cx + d.distance * Math.cos(rad);
          const y = cy + d.distance * Math.sin(rad);
          const labelDx = d.anchor === "start" ? 1.6 : -1.6;
          return (
            <g key={d.name}>
              <circle cx={x} cy={y} r="0.9" fill="#f6f2ea" opacity="0.75" />
              <text
                x={x + labelDx}
                y={y - 0.4}
                textAnchor={d.anchor}
                fontSize="1.7"
                fill="#f6f2ea"
                fontFamily="sans-serif"
                letterSpacing="0.08em"
                fontWeight="600"
              >
                {d.name}
              </text>
              <text
                x={x + labelDx}
                y={y + 1.6}
                textAnchor={d.anchor}
                fontSize="1.4"
                fill="rgba(188,182,168,0.7)"
                fontFamily="sans-serif"
                letterSpacing="0.1em"
              >
                {d.minutes}
              </text>
            </g>
          );
        })}

        {/* Compass */}
        <g transform="translate(92,8)">
          <circle r="3" fill="none" stroke="rgba(246,242,234,0.3)" strokeWidth="0.2" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="rgba(246,242,234,0.3)" strokeWidth="0.15" />
          <line x1="-3" y1="0" x2="3" y2="0" stroke="rgba(246,242,234,0.3)" strokeWidth="0.15" />
          <text x="0" y="-3.6" textAnchor="middle" fontSize="1.6" fill="rgba(246,242,234,0.55)" fontFamily="sans-serif">N</text>
        </g>
      </svg>

      {/* Bottom gradient anchor — guarantees the figcaption never competes with map content */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
    </div>
  );
}
