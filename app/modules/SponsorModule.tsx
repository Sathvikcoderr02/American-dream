"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { HubNav } from "@/components/HubNav";
import { SpendSlider } from "@/app/sponsorship/SpendSlider";
import {
  SPONSOR_AUDIENCE_BARS,
  SPONSOR_ACTIVATIONS,
  SPONSOR_TIERS,
} from "@/lib/data";
import { ACCENT_TOKEN } from "@/lib/portals";

// Activation cards each get a representative image.
// Index matches SPONSOR_ACTIVATIONS order in lib/data.ts.
const ACTIVATION_VISUALS: Array<
  | { type: "image"; src: string }
  | { type: "video"; src: string }
> = [
  { type: "image", src: "/images/luxury-wing.jpg" },     // 0 — Brand Takeover (wing wrap)
  { type: "image", src: "/images/court-concert.jpg" },   // 1 — Product Launch (The Court)
  { type: "video", src: "/videos/sponsor-immersive.mp4" }, // 2 — Immersive Zone (themed build)
  { type: "image", src: "/images/food-hall.jpg" },       // 3 — Content Studio (always-on set)
  { type: "image", src: "/images/dining-terrace.jpg" },  // 4 — Member Series (intimate)
  { type: "image", src: "/images/observation-wheel.jpg" },// 5 — Ambassador Slate (icon-led)
];

const ACCENT_BAR: Record<string, string> = {
  gold: "from-gold to-gold-bright",
  ember: "from-ember to-gold",
  aqua: "from-aqua to-bone",
  plum: "from-plum to-ember",
  bone: "from-bone to-bone-dim",
};

function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

export function SponsorModule() {
  const [spend, setSpend] = useState(750_000);
  const [tierIndex, setTierIndex] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Spend → tier auto-select
  const recommendedTier = useMemo(() => {
    if (spend >= 2_000_000) return 0;
    if (spend >= 600_000) return 1;
    return 2;
  }, [spend]);

  const projection = useMemo(() => {
    const baseImpressions = (spend / 1_000_000) * 380;
    const onProperty = (spend / 1_000_000) * 4.2;
    const earned = (spend / 1_000_000) * 2.1;
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
    <motion.div
      key="sponsor"
      layoutId="portal-sponsor"
      className="fixed inset-0 z-30 overflow-hidden bg-ink"
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
    >
      <HubNav label="Sponsor" accent={ACCENT_TOKEN.ember} />

      <div ref={scrollRef} className="h-full w-full overflow-y-auto overflow-x-hidden">
        {/* Hero — video backed */}
        <section className="relative flex min-h-screen w-full items-end overflow-hidden">
          <video
            src="/videos/sponsor-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/20" />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: `radial-gradient(60% 80% at 20% 100%, ${ACCENT_TOKEN.ember}33 0%, transparent 70%)`,
            }}
          />
          <div className="aurora animate-aurora pointer-events-none absolute inset-0 opacity-25" />
          <div className="bg-grain pointer-events-none absolute inset-0 opacity-40" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full px-6 pb-20 pt-32 md:px-12 md:pb-28 md:pt-40"
          >
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-bone-dim">
              <span className="text-bone">Portal 03</span>
              <span className="h-px w-8 bg-bone/20" />
              <span>Audience · Tiers · Activations · Live ROI</span>
            </div>
            <h1 className="mt-6 max-w-5xl font-display text-[44px] leading-[0.92] text-bone md:text-[88px]">
              Build with the
              <br />
              <span className="italic text-gold">audience.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-bone-dim md:text-[16px]">
              American Dream is a media platform with a building attached. 40 million annual visitors.
              A 4-hour captive dwell. Six purpose-built activation surfaces. Drag the slider and see what
              your budget actually looks like — numbers and language adapt in real time.
            </p>

            {/* Quick-stat strip */}
            <div className="mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/5 md:grid-cols-4">
              {[
                { v: "40M", l: "annual visitors" },
                { v: "4hrs", l: "avg. dwell time" },
                { v: "1.2B", l: "annualized impressions" },
                { v: "5", l: "platform partner slots" },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.7 + i * 0.08 }}
                  className="bg-ink-2/80 p-5 backdrop-blur"
                >
                  <div className="font-display text-3xl text-bone md:text-4xl">{s.v}</div>
                  <div className="mt-1.5 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                    {s.l}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Audience bars */}
        <section className="relative w-full px-6 pb-24 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
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
                  viewport={{ once: true, margin: "-15% 0px", root: scrollRef }}
                  transition={{ duration: 0.7, delay: i * 0.06 }}
                  className="rounded-2xl border border-bone/10 bg-ink-2 p-6"
                >
                  <div className="flex items-baseline justify-between">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                      {bar.label}
                    </div>
                    <div className="font-display text-3xl text-bone">{bar.value}</div>
                  </div>
                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-bone/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.pct}%` }}
                      viewport={{ once: true, margin: "-15% 0px", root: scrollRef }}
                      transition={{ duration: 1.2, delay: 0.2 + i * 0.06, ease: [0.2, 0.9, 0.1, 1] }}
                      className={`h-full bg-gradient-to-r ${ACCENT_BAR[bar.accent]}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Spend simulator + AI narrative */}
        <section className="relative w-full px-6 pb-24 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
              <span className="text-bone">02 · Project the partnership</span>
              <span className="h-px flex-1 bg-bone/10" />
              <span>Drag the slider · AI rewrites the story</span>
            </div>

            <div className="grid grid-cols-1 gap-8 rounded-[28px] border border-bone/10 bg-ink-2 p-6 md:p-10 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                  Annual investment
                </div>
                <motion.div
                  key={spend}
                  initial={{ scale: 0.98, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="mt-3 font-display text-5xl text-bone md:text-6xl"
                >
                  {formatUsd(spend)}
                </motion.div>
                <p className="mt-3 text-[13px] text-bone-dim">
                  From single pop-up activations to full destination partnerships. The platform scales
                  linearly until $2M, where category exclusivity unlocks.
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

            {/* AI ROI narrative */}
            <RoiNarrative
              spend={spend}
              tier={SPONSOR_TIERS[recommendedTier].tier}
              impressions={projection.impressions}
              onProperty={projection.onProperty}
              earned={projection.earned}
            />

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
        </section>

        {/* Tiers */}
        <section id="tiers" className="relative w-full scroll-mt-10 px-6 pb-24 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
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
                transition={{ duration: 0.4 }}
                className="mt-6 grid grid-cols-1 gap-6 rounded-[28px] border border-bone/15 bg-ink-2 p-8 md:p-10 lg:grid-cols-[1.2fr_0.8fr]"
              >
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                    Tier 0{tierIndex + 1} · {activeTier.inventory}
                  </div>
                  <div className="mt-3 font-display text-5xl text-bone md:text-6xl">
                    {activeTier.tier}
                  </div>
                  <div className="mt-3 font-display text-3xl text-gold">{activeTier.price}</div>
                  <ul className="mt-8 space-y-4">
                    {activeTier.includes.map((item) => (
                      <li key={item} className="flex items-start gap-4 text-[15px] text-bone">
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
        </section>

        {/* Activations */}
        <section className="relative w-full px-6 pb-32 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
              <span className="text-bone">04 · How it shows up</span>
              <span className="h-px flex-1 bg-bone/10" />
              <span>Activation library</span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SPONSOR_ACTIVATIONS.map((a, i) => {
                const visual = ACTIVATION_VISUALS[i];
                return (
                  <motion.div
                    key={a.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px", root: scrollRef }}
                    transition={{ duration: 0.7, delay: (i % 3) * 0.08 }}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-bone/10 bg-ink-2"
                  >
                    {/* Visual top */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {visual?.type === "video" ? (
                        <video
                          src={visual.src}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 h-full w-full scale-105 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : visual ? (
                        <Image
                          src={visual.src}
                          alt={a.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="scale-105 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/30 to-transparent" />
                      <div
                        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-60"
                        style={{
                          background: `radial-gradient(60% 80% at 50% 100%, ${ACCENT_TOKEN.gold}33, transparent 70%)`,
                        }}
                      />
                      <div className="bg-grain absolute inset-0 opacity-40" />
                      <div className="absolute left-5 top-5">
                        <span className="rounded-full border border-bone/25 bg-ink/50 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-bone backdrop-blur">
                          {a.kicker}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col justify-between p-7">
                      <div>
                        <div className="font-display text-3xl text-bone">{a.name}</div>
                        <p className="mt-3 text-[14px] leading-relaxed text-bone-dim">{a.body}</p>
                      </div>
                      <div className="mt-6 flex items-baseline gap-2 border-t border-bone/10 pt-5">
                        <div className="font-display text-3xl text-gold">{a.metric}</div>
                        <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                          {a.metricLabel}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Submission modal */}
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
                at {formatUsd(spend)} has been received.
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
    </motion.div>
  );
}

function Projection({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-ink-2 p-6">
      <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">{label}</div>
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

// --- AI ROI narrative ---

type RoiProps = {
  spend: number;
  tier: string;
  impressions: string;
  onProperty: string;
  earned: string;
};

function RoiNarrative({ spend, tier, impressions, onProperty, earned }: RoiProps) {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runNarrative();
    }, 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spend, tier, impressions, onProperty, earned]);

  const runNarrative = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(false);
    setText("");

    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "roi_narrative",
          spend,
          tier,
          impressions,
          onProperty,
          earned,
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        setError(true);
        setLoading(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        setText(buffer);
      }
      setLoading(false);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(true);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-6 overflow-hidden rounded-[28px] border border-gold/30 bg-gradient-to-br from-gold/[0.04] via-ink-2 to-ink-2 p-6 md:p-8"
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
        <span className="relative block h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-gold" />
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
        </span>
        <span className="text-gold">AI</span>
        <span>·</span>
        <span>What this partnership looks like at {formatUsd(spend)}</span>
      </div>

      <div className="mt-4 min-h-[100px] text-[15px] leading-relaxed text-bone md:text-[16px]">
        {error ? (
          <span className="text-bone-dim">
            Narrative unavailable — projections above are accurate. Adjust the slider to retry.
          </span>
        ) : text ? (
          <>
            {text}
            {loading && (
              <span className="ml-1 inline-block h-3.5 w-1 animate-pulse bg-gold align-middle" />
            )}
          </>
        ) : (
          <span className="animate-pulse text-bone-dim">
            Generating partnership narrative for this budget…
          </span>
        )}
      </div>
    </motion.div>
  );
}
