"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { HubNav } from "@/components/HubNav";
import { DEMOGRAPHICS, PROPERTY_FACTS, HERO_STATS } from "@/lib/data";
import { ACCENT_TOKEN } from "@/lib/portals";

export function PropertyModule() {
  const accent = ACCENT_TOKEN.gold;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll on mount
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, []);

  return (
    <motion.div
      key="property"
      layoutId="portal-property"
      className="fixed inset-0 z-30 overflow-hidden bg-ink"
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
    >
      <HubNav label="The Property" accent={accent} />

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="h-full w-full overflow-y-auto overflow-x-hidden"
      >
        {/* Hero — full-screen video reveal */}
        <section className="relative flex min-h-screen w-full items-end overflow-hidden">
          <video
            src="/videos/why.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: `radial-gradient(60% 80% at 20% 100%, ${accent}33 0%, transparent 70%)`,
            }}
          />
          <div className="bg-grain absolute inset-0 opacity-40" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full px-6 pb-20 pt-32 md:px-12 md:pb-28 md:pt-40"
          >
            <div className="text-[10px] uppercase tracking-[0.28em] text-bone-dim">
              Portal 01 · Location & Scale
            </div>
            <h1 className="mt-5 max-w-5xl font-display text-[44px] leading-[0.95] text-bone md:text-[88px]">
              A commercial platform,
              <br />
              <span className="italic" style={{ color: accent }}>
                built on an intersection.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-bone-dim md:text-[16px]">
              Ten minutes from Manhattan. At the convergence of three interstates and 22 million people.
              The largest entertainment-first destination in the Americas — and a single integrated media surface.
            </p>

            {/* Stat strip */}
            <div className="mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/5 md:grid-cols-4">
              {HERO_STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.7 + i * 0.08 }}
                  className="bg-ink-2/80 p-5 backdrop-blur"
                >
                  <div className="font-display text-3xl text-bone md:text-4xl">
                    {s.value}
                    <span className="ml-1 text-base text-bone-dim">{s.unit}</span>
                  </div>
                  <div className="mt-1.5 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Scroll cue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="mt-14 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-bone-dim"
            >
              <span className="block h-px w-10 bg-bone/30" />
              Scroll to explore the trade area
            </motion.div>
          </motion.div>
        </section>

        {/* Facts section */}
        <section className="relative w-full bg-ink px-6 py-32 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <div className="text-[10px] uppercase tracking-[0.28em] text-bone-dim">
              Three Reasons This Property
            </div>

            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
              {PROPERTY_FACTS.map((fact, i) => (
                <motion.div
                  key={fact.heading}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-15% 0px", root: scrollRef }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                  className="relative border-l border-bone/15 pl-6"
                  style={{ borderLeftColor: i === 0 ? accent : undefined }}
                >
                  <div className="mb-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
                    Fact {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-display text-2xl leading-tight text-bone md:text-3xl">
                    {fact.heading}
                  </h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-bone-dim">
                    {fact.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demographics — bottom slab */}
        <section className="relative w-full px-6 pb-32 md:px-12 md:pb-40">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px", root: scrollRef }}
              transition={{ duration: 0.7 }}
              className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim"
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
                  viewport={{ once: true, margin: "-10% 0px", root: scrollRef }}
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

            <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-bone/10 pt-10 md:flex-row md:items-center">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-bone-dim">
                  End of module
                </div>
                <div className="mt-2 font-display text-2xl text-bone md:text-3xl">
                  Continue exploring →
                </div>
              </div>
              <div className="text-[12px] text-bone-dim">
                Open another portal from the hub.
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
