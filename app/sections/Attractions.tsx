"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionIntro } from "@/components/SectionIntro";
import { ATTRACTIONS } from "@/lib/data";

const ACCENT_CLASS: Record<string, string> = {
  ember: "from-ember/30 via-ember/10 to-ink",
  aqua: "from-aqua/30 via-aqua/10 to-ink",
  gold: "from-gold/30 via-gold/10 to-ink",
  plum: "from-plum/30 via-plum/10 to-ink",
  bone: "from-bone/20 via-bone/5 to-ink",
};

export function Attractions() {
  const [index, setIndex] = useState(0);
  const current = ATTRACTIONS[index];

  return (
    <section id="attractions" className="relative overflow-hidden bg-ink px-6 py-40 md:px-12">
      <SectionIntro
        index="05"
        eyebrow="7 Worlds Under One Roof"
        title={
          <>
            The reason
            <br />
            people <span className="italic text-aqua">come back.</span>
          </>
        }
        lede="American Dream is the most entertainment-dense property in North America. A theme park. A water park. A real-snow ski mountain. An aquarium. A LEGO city. A 300-foot observation wheel. One admission. One roof."
      />

      <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Stage */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-bone/10 bg-ink-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7 }}
              className={`absolute inset-0 bg-gradient-to-br ${ACCENT_CLASS[current.accent]}`}
            >
              {current.video && (
                <video
                  key={current.video}
                  className="absolute inset-0 h-full w-full object-cover"
                  src={current.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              )}
              {!current.video && "image" in current && current.image && (
                <Image
                  key={current.image}
                  src={current.image}
                  alt={current.name}
                  fill
                  className="absolute inset-0 h-full w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/30" />
              <div className="bg-grain absolute inset-0" />
              <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(255,255,255,0.08),transparent)]" />
              {!current.video && !("image" in current && current.image) && (
                <AttractionArt variant={index} accent={current.accent} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-full border border-bone/25 bg-ink/50 px-3 py-1 backdrop-blur">
                <span className="relative block h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-ember" />
                  <span className="absolute inset-0 animate-ping rounded-full bg-ember/60" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-bone">
                  Operating now
                </span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                0{index + 1} / 0{ATTRACTIONS.length}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-[11px] uppercase tracking-[0.22em] text-bone-dim">
                  {current.subtitle}
                </div>
                <div className="mt-2 font-display text-4xl leading-[0.9] text-bone md:text-5xl">
                  {current.name}
                </div>
                <div className="mt-3 max-w-md text-[14px] leading-relaxed text-bone">
                  {current.body}
                </div>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-display text-5xl text-bone md:text-6xl">
                    {current.stat}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-bone-dim">
                    {current.statLabel}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Picker */}
        <div className="flex flex-col gap-2">
          {ATTRACTIONS.map((a, i) => {
            const isActive = i === index;
            return (
              <button
                key={a.name}
                data-cursor="cta"
                data-cursor-label="View"
                onMouseEnter={() => setIndex(i)}
                onFocus={() => setIndex(i)}
                onClick={() => setIndex(i)}
                className={`group relative flex items-center gap-5 rounded-2xl border p-5 text-left transition-all ${
                  isActive
                    ? "border-bone/50 bg-ink-2"
                    : "border-bone/10 hover:border-bone/30"
                }`}
              >
                <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                  0{i + 1}
                </div>
                <div className="flex-1">
                  <div className="font-display text-xl text-bone md:text-2xl">
                    {a.name}
                  </div>
                  <div className="text-[12px] text-bone-dim">{a.subtitle}</div>
                </div>
                <motion.span
                  animate={{ x: isActive ? 4 : 0, opacity: isActive ? 1 : 0.3 }}
                  className="text-xl text-bone"
                >
                  →
                </motion.span>
                {isActive && (
                  <motion.span
                    layoutId="attr-underline"
                    className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-bone/50 to-transparent"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AttractionArt({ variant, accent }: { variant: number; accent: string }) {
  // Different abstract illustration per attraction
  const colors: Record<string, string> = {
    ember: "#ff4a2b",
    aqua: "#4ad9e4",
    gold: "#d4b278",
    plum: "#a97ad4",
    bone: "#f6f2ea",
  };
  const c = colors[accent] || "#f6f2ea";

  switch (variant % 7) {
    case 0: // coaster
      return (
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-60">
          <path
            d={`M 0 200 Q 100 ${80 + variant * 10}, 200 180 T 400 120`}
            stroke={c}
            strokeWidth="2"
            fill="none"
          />
          <path
            d={`M 0 210 Q 100 ${90 + variant * 10}, 200 190 T 400 130`}
            stroke={c}
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1={i * 33}
              y1={200 - Math.sin(i * 0.6) * 40}
              x2={i * 33}
              y2={260}
              stroke={c}
              strokeWidth="0.6"
              opacity="0.4"
            />
          ))}
        </svg>
      );
    case 1: // waves
      return (
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-70">
          {Array.from({ length: 6 }).map((_, i) => (
            <path
              key={i}
              d={`M 0 ${150 + i * 20} Q 100 ${130 + i * 20}, 200 ${150 + i * 20} T 400 ${150 + i * 20}`}
              stroke={c}
              strokeWidth={1 - i * 0.1}
              fill="none"
              opacity={1 - i * 0.15}
            />
          ))}
        </svg>
      );
    case 2: // snow mountain
      return (
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-70">
          <polygon points="0,260 150,80 250,160 400,260" fill="none" stroke={c} strokeWidth="1.5" />
          <polygon points="100,260 200,140 300,260" fill="none" stroke={c} strokeWidth="1" opacity="0.6" />
          {Array.from({ length: 40 }).map((_, i) => (
            <circle
              key={i}
              cx={(i * 37) % 400}
              cy={(i * 53) % 300}
              r="1"
              fill={c}
              opacity={0.2 + ((i * 17) % 60) / 100}
            />
          ))}
        </svg>
      );
    case 3: // aquarium
      return (
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-70">
          {Array.from({ length: 20 }).map((_, i) => (
            <g key={i}>
              <circle
                cx={(i * 47) % 400}
                cy={(i * 31) % 300}
                r={3 + (i % 4)}
                fill="none"
                stroke={c}
                strokeWidth="0.5"
              />
            </g>
          ))}
          <path
            d="M 0 180 Q 200 120, 400 180"
            stroke={c}
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          />
        </svg>
      );
    case 4: // bricks / mini golf
      return (
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-60">
          {Array.from({ length: 50 }).map((_, i) => (
            <rect
              key={i}
              x={(i % 10) * 40 + 4}
              y={Math.floor(i / 10) * 40 + 40}
              width="28"
              height="20"
              fill="none"
              stroke={c}
              strokeWidth="0.6"
              opacity={0.3 + ((i * 23) % 50) / 100}
            />
          ))}
        </svg>
      );
    case 5: // legoland dots
      return (
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-70">
          {Array.from({ length: 80 }).map((_, i) => {
            const row = Math.floor(i / 10);
            const col = i % 10;
            return (
              <circle
                key={i}
                cx={col * 40 + 20}
                cy={row * 40 + 30}
                r={2}
                fill={c}
                opacity={0.3 + ((i * 41) % 50) / 100}
              />
            );
          })}
        </svg>
      );
    case 6: // observation wheel
      return (
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-70">
          <g transform="translate(200 160)">
            <circle r="120" fill="none" stroke={c} strokeWidth="1.5" />
            <circle r="8" fill={c} />
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i / 16) * Math.PI * 2;
              return (
                <g key={i}>
                  <line
                    x1="0"
                    y1="0"
                    x2={Math.cos(a) * 120}
                    y2={Math.sin(a) * 120}
                    stroke={c}
                    strokeWidth="0.5"
                    opacity="0.5"
                  />
                  <circle
                    cx={Math.cos(a) * 120}
                    cy={Math.sin(a) * 120}
                    r="6"
                    fill="none"
                    stroke={c}
                    strokeWidth="1"
                  />
                </g>
              );
            })}
          </g>
        </svg>
      );
  }
  return null;
}
