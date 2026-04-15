"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionIntro } from "@/components/SectionIntro";
import { MediaPanel } from "@/components/MediaPanel";
import { RETAIL_CATEGORIES } from "@/lib/data";

export function Retail() {
  const [active, setActive] = useState(0);
  const current = RETAIL_CATEGORIES[active];

  return (
    <section id="retail" className="relative bg-ink-2 px-6 py-40 md:px-12">
      <SectionIntro
        index="02"
        eyebrow="450+ Brands · 4 Tiers"
        title={
          <>
            Retail as <span className="italic text-gold">theater.</span>
          </>
        }
        lede="Four operating tiers, one unified merchandising surface. We do not lease square footage — we cast a portfolio. Each adjacency is intentional. Each flagship is a brand stage."
      />

      <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Tier picker */}
        <div className="flex flex-col gap-2">
          {RETAIL_CATEGORIES.map((cat, i) => {
            const isActive = i === active;
            return (
              <button
                key={cat.tier}
                data-cursor="cta"
                data-cursor-label="Select"
                onClick={() => setActive(i)}
                className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all ${
                  isActive
                    ? "border-bone/60 bg-ink"
                    : "border-bone/10 bg-ink/40 hover:border-bone/30"
                }`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[11px] uppercase tracking-[0.22em] text-bone-dim">
                      0{i + 1}
                    </span>
                    <span className="font-display text-2xl text-bone md:text-3xl">
                      {cat.tier}
                    </span>
                  </div>
                  <motion.span
                    animate={{ rotate: isActive ? 45 : 0 }}
                    className="text-xl text-bone-dim"
                  >
                    +
                  </motion.span>
                </div>
                <div className="mt-1 text-[13px] text-bone-dim">{cat.tagline}</div>
                {isActive && (
                  <motion.span
                    layoutId="retail-underline"
                    className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Media + tenant grid */}
        <div className="flex flex-col gap-6">
          <MediaPanel
            kicker="Now Open"
            label={current.tier}
            gradient={
              active === 0
                ? "from-ember/30 to-gold/10"
                : active === 1
                ? "from-gold/30 to-plum/10"
                : active === 2
                ? "from-aqua/30 to-bone/10"
                : "from-plum/30 to-ember/10"
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <FlagshipArt variant={active} />
              </motion.div>
            </AnimatePresence>
          </MediaPanel>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/5 md:grid-cols-3"
            >
              {current.tenants.map((t) => (
                <div key={t} className="bg-ink-2 p-5">
                  <div className="font-display text-lg text-bone">{t}</div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function FlagshipArt({ variant }: { variant: number }) {
  // Abstract architectural diagrams that change per tier
  const palettes = [
    ["#ff4a2b", "#d4b278"],
    ["#d4b278", "#a97ad4"],
    ["#4ad9e4", "#f6f2ea"],
    ["#a97ad4", "#ff4a2b"],
  ];
  const [c1, c2] = palettes[variant] || palettes[0];

  return (
    <svg viewBox="0 0 400 225" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`fg-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c2} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {Array.from({ length: 18 }).map((_, i) => (
        <line
          key={i}
          x1={i * 25}
          y1="0"
          x2={i * 25 - 50}
          y2="225"
          stroke={`url(#fg-${variant})`}
          strokeWidth={i % 3 === 0 ? "1.2" : "0.4"}
          opacity={0.6}
        />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <rect
          key={i}
          x={40 + i * 38}
          y={80 + Math.sin(i + variant) * 20}
          width="24"
          height={80 + Math.cos(i) * 30}
          fill="none"
          stroke="rgba(246,242,234,0.35)"
          strokeWidth="0.6"
        />
      ))}
      <text
        x="200"
        y="120"
        textAnchor="middle"
        fontSize="14"
        fill="rgba(246,242,234,0.45)"
        fontFamily="sans-serif"
        letterSpacing="4"
      >
        TIER 0{variant + 1}
      </text>
    </svg>
  );
}
