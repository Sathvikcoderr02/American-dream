"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SPONSOR_AUDIENCE_BARS,
  SPONSOR_ACTIVATIONS,
  SPONSOR_TIERS,
} from "@/lib/data";
import { SpendSlider } from "./SpendSlider";

const ACCENT_BAR: Record<string, string> = {
  gold: "from-gold to-gold-bright",
  ember: "from-ember to-gold",
  aqua: "from-aqua to-bone",
  plum: "from-plum to-ember",
  bone: "from-bone to-bone-dim",
};

export function SponsorshipModule() {
  const [spend, setSpend] = useState(750_000);
  const [tierIndex, setTierIndex] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Spend → tier auto-select
  const recommendedTier = useMemo(() => {
    if (spend >= 2_000_000) return 0;
    if (spend >= 600_000) return 1;
    return 2;
  }, [spend]);

  // Spend → projected impressions / on-property reach / earned media
  const projection = useMemo(() => {
    const baseImpressions = (spend / 1_000_000) * 380; // ~380M per $1M
    const onProperty = (spend / 1_000_000) * 4.2; // ~4.2M visits per $1M
    const earned = (spend / 1_000_000) * 2.1; // 2.1x earned media multiplier
    return {
      impressions:
        baseImpressions >= 1000
          ? `${(baseImpressions / 1000).toFixed(1)}B`
          : `${Math.round(baseImpressions)}M`,
      onProperty: `${onProperty.toFixed(1)}M`,
      earned: `$${earned.toFixed(1)}M`,
    };
  }, [spend]);

  const activeTier = SPONSOR_TIERS[tierIndex];

  return (
    <main className="relative min-h-screen bg-ink pb-40">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-bone/10 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 md:px-10">
          <Link
            href="/"
            data-cursor="cta"
            data-cursor-label="Back"
            className="flex items-center gap-3"
          >
            <span className="text-[11px] uppercase tracking-[0.22em] text-bone-dim">
              ← Overview
            </span>
          </Link>
          <div className="hidden items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim md:flex">
            <span className="text-bone">Sponsorship Module</span>
            <span className="h-px w-8 bg-bone/20" />
            <span>FY26 Inventory</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-bone/15 bg-ink-2/60 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-bone backdrop-blur">
            <span className="relative block h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-gold" />
              <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
            </span>
            5 Slots Open
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-20 md:px-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-bone-dim">
            <span className="text-bone">Module</span>
            <span className="h-px w-8 bg-bone-dim" />
            <span>Audience · Tiers · Activations</span>
          </div>
          <h1 className="mt-6 font-display text-[clamp(2.8rem,8vw,7rem)] leading-[0.85] text-balance">
            Build with the
            <br />
            <span className="italic text-gold">audience.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-[16px] leading-relaxed text-bone-dim">
            American Dream is a media platform with a building attached. 40
            million annual visitors. A captive 4-hour dwell. Six purpose-built
            activation surfaces. Pick a budget, see the projected reach, then
            pick the tier that fits.
          </p>
        </div>

        {/* Audience grid */}
        <div className="mt-20">
          <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
            <span className="text-bone">01 · The Audience</span>
            <span className="h-px flex-1 bg-bone/10" />
            <span>Source: Placer.ai · Esri · Internal</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SPONSOR_AUDIENCE_BARS.map((bar, i) => (
              <motion.div
                key={bar.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.06 }}
                className="rounded-2xl border border-bone/10 bg-ink-2 p-6"
              >
                <div className="flex items-baseline justify-between">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                    {bar.label}
                  </div>
                  <div className="font-display text-3xl text-bone">
                    {bar.value}
                  </div>
                </div>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-bone/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${bar.pct}%` }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 1.2, delay: 0.2 + i * 0.06, ease: [0.2, 0.9, 0.1, 1] }}
                    className={`h-full bg-gradient-to-r ${ACCENT_BAR[bar.accent]}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Spend simulator */}
        <div className="mt-24">
          <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
            <span className="text-bone">02 · Project the partnership</span>
            <span className="h-px flex-1 bg-bone/10" />
            <span>Drag the slider</span>
          </div>

          <div className="grid grid-cols-1 gap-8 rounded-[28px] border border-bone/10 bg-ink-2 p-6 md:p-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                Annual investment
              </div>
              <div className="mt-3 font-display text-5xl text-bone md:text-6xl">
                {formatUsd(spend)}
              </div>
              <p className="mt-3 text-[13px] text-bone-dim">
                Ranges from a single pop-up activation to a full destination
                partnership. The platform scales linearly until $2M, where
                category exclusivity unlocks.
              </p>
              <div className="mt-8">
                <SpendSlider value={spend} onChange={setSpend} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/5 sm:grid-cols-3">
              <Projection label="Annual impressions" value={projection.impressions} />
              <Projection label="On-property visits" value={projection.onProperty} />
              <Projection label="Earned media value" value={projection.earned} accent />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-[12px] text-bone-dim">
            <span className="text-bone">Recommended tier at this budget:</span>
            <button
              data-cursor="cta"
              data-cursor-label="Jump"
              onClick={() => {
                setTierIndex(recommendedTier);
                document.getElementById("tiers")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/20"
            >
              {SPONSOR_TIERS[recommendedTier].tier} →
            </button>
          </div>
        </div>

        {/* Tiers */}
        <div id="tiers" className="mt-24 scroll-mt-24">
          <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
            <span className="text-bone">03 · Pick a tier</span>
            <span className="h-px flex-1 bg-bone/10" />
          </div>
          <div className="flex flex-wrap gap-2">
            {SPONSOR_TIERS.map((tier, i) => (
              <button
                key={tier.tier}
                data-cursor="cta"
                data-cursor-label="Pick"
                onClick={() => setTierIndex(i)}
                className={`rounded-full border px-5 py-2 text-[12px] uppercase tracking-[0.22em] transition-colors ${
                  tierIndex === i
                    ? "border-bone bg-bone text-ink"
                    : "border-bone/15 text-bone hover:border-bone/40"
                }`}
              >
                {tier.tier}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTier.tier}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="mt-6 grid grid-cols-1 gap-6 rounded-[28px] border border-bone/15 bg-ink-2 p-8 md:p-10 lg:grid-cols-[1.2fr_0.8fr]"
            >
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                  Tier 0{tierIndex + 1} · {activeTier.inventory}
                </div>
                <div className="mt-3 font-display text-5xl text-bone md:text-6xl">
                  {activeTier.tier}
                </div>
                <div className="mt-3 font-display text-3xl text-gold">
                  {activeTier.price}
                </div>
                <ul className="mt-8 space-y-4">
                  {activeTier.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-4 text-[15px] text-bone"
                    >
                      <span className="mt-[0.7em] block h-px w-5 shrink-0 bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col justify-end gap-3">
                <button
                  data-cursor="cta"
                  data-cursor-label="Submit"
                  onClick={() => setSubmitted(true)}
                  className="group rounded-full bg-bone px-6 py-3 text-[12px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold"
                >
                  Request {activeTier.tier} brief →
                </button>
                <a
                  href="mailto:partnerships@americandream.com"
                  data-cursor="cta"
                  data-cursor-label="Email"
                  className="rounded-full border border-bone/25 px-6 py-3 text-center text-[12px] uppercase tracking-[0.22em] text-bone hover:border-bone/60"
                >
                  partnerships@
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Activations */}
        <div className="mt-24">
          <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
            <span className="text-bone">04 · How it shows up</span>
            <span className="h-px flex-1 bg-bone/10" />
            <span>Activation library</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SPONSOR_ACTIVATIONS.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.08 }}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-bone/10 bg-ink-2 p-7"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold/10 blur-3xl transition-all group-hover:bg-gold/20"
                />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                    {a.kicker}
                  </div>
                  <div className="mt-2 font-display text-3xl text-bone">
                    {a.name}
                  </div>
                  <p className="mt-4 text-[14px] leading-relaxed text-bone-dim">
                    {a.body}
                  </p>
                </div>
                <div className="mt-6 flex items-baseline gap-2 border-t border-bone/10 pt-5">
                  <div className="font-display text-3xl text-gold">
                    {a.metric}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                    {a.metricLabel}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hold confirmation */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-ink/85 backdrop-blur-xl"
              onClick={() => setSubmitted(false)}
            />
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="relative max-w-md rounded-[28px] border border-bone/20 bg-ink-2 p-10 text-center"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gold/50">
                <motion.svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <motion.path
                    d="M 4 14 L 12 22 L 24 6"
                    stroke="#d4b278"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  />
                </motion.svg>
              </div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                Brief requested
              </div>
              <div className="mt-3 font-display text-3xl text-bone">
                We'll send the deck within 24 hours.
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-bone-dim">
                Your request for a <strong className="text-bone">{activeTier.tier}</strong> brief
                at {formatUsd(spend)} has been received. Our partnerships team
                will follow up with the full inventory and timing options.
              </p>
              <button
                data-cursor="cta"
                data-cursor-label="Close"
                onClick={() => setSubmitted(false)}
                className="mt-8 rounded-full border border-bone/25 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-bone hover:border-bone/60"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Projection({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-ink-2 p-6">
      <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
        {label}
      </div>
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`mt-2 font-display text-4xl md:text-5xl ${
          accent ? "text-gold" : "text-bone"
        }`}
      >
        {value}
      </motion.div>
    </div>
  );
}

function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}
