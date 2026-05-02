"use client";

import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { HubNav } from "@/components/HubNav";
import {
  RETAIL_CATEGORIES,
  LUXURY_BRANDS,
  DINING_VENUES,
} from "@/lib/data";
import { ACCENT_TOKEN } from "@/lib/portals";

const TIER_TO_CATEGORY = ["flagship", "luxury", "contemporary", "popup"] as const;

const VACANCIES = [
  {
    suite: "Suite L-204",
    sqft: "12,400 sq ft",
    location: "The Avenue · West wing",
    adjacency: "Between Hermès and Saint Laurent",
    rent: "$280 / sq ft",
    available: "Q2 2026",
  },
  {
    suite: "Suite C-118",
    sqft: "4,200 sq ft",
    location: "Central Plaza · Ground floor",
    adjacency: "Opposite Sephora, adjacent to The Court",
    rent: "$185 / sq ft",
    available: "Q3 2026",
  },
  {
    suite: "Suite F-302",
    sqft: "850 sq ft",
    location: "The Collective · Pop-up wing",
    adjacency: "Rotational program, IT'SUGAR foot traffic",
    rent: "30-day cycles",
    available: "Rolling",
  },
];

const DINING_OPERATORS = [
  { name: "Munchies", count: "20", label: "operators" },
  { name: "Reservations", count: "94%", label: "fill weekend" },
  { name: "Avg ticket", count: "$48", label: "lunch · $86 dinner" },
  { name: "Open daily", count: "11–11", label: "M–Th · til 2am F–Sa" },
];

type Tab = "retail" | "avenue" | "dining";

const TABS: { id: Tab; label: string; eyebrow: string; accent: string }[] = [
  { id: "retail", label: "Retail", eyebrow: "450+ Brands · 4 Tiers", accent: ACCENT_TOKEN.bone },
  { id: "avenue", label: "The Avenue", eyebrow: "Luxury Wing", accent: ACCENT_TOKEN.gold },
  { id: "dining", label: "Dining", eyebrow: "Culinary Theater", accent: ACCENT_TOKEN.ember },
];

export function TenantModule() {
  const [tab, setTab] = useState<Tab>("retail");
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <motion.div
      key="tenant"
      layoutId="portal-tenant"
      className="fixed inset-0 z-30 overflow-hidden bg-ink"
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
    >
      <HubNav label="Tenant" accent={activeTab.accent} />

      <div ref={scrollRef} className="h-full w-full overflow-y-auto overflow-x-hidden">
        {/* Hero — video bg + tab strip */}
        <section className="relative flex min-h-[80vh] w-full items-end overflow-hidden">
          <video
            src="/videos/tenant-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/30" />
          <div
            className="absolute inset-0 opacity-50 transition-colors duration-700"
            style={{
              background: `radial-gradient(60% 80% at 30% 100%, ${activeTab.accent}33 0%, transparent 70%)`,
            }}
          />
          <div className="bg-grain pointer-events-none absolute inset-0 opacity-40" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full px-6 pb-12 pt-32 md:px-12 md:pb-16 md:pt-40"
          >
            <div className="text-[10px] uppercase tracking-[0.28em] text-bone-dim">
              Portal 04 · Retail · Avenue · Dining
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="mt-5 max-w-5xl font-display text-[44px] leading-[0.95] text-bone md:text-[88px]">
                  {tab === "retail" && (
                    <>
                      Retail as <span className="italic" style={{ color: activeTab.accent }}>theater.</span>
                    </>
                  )}
                  {tab === "avenue" && (
                    <>
                      A luxury wing <br />
                      <span className="italic" style={{ color: activeTab.accent }}>inside a megaplex.</span>
                    </>
                  )}
                  {tab === "dining" && (
                    <>
                      Dining as the <br />
                      <span className="italic" style={{ color: activeTab.accent }}>main event.</span>
                    </>
                  )}
                </h1>
                <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-bone-dim md:text-[16px]">
                  {tab === "retail" &&
                    "Four operating tiers, one merchandising surface. We do not lease square footage — we cast a portfolio. Each adjacency is intentional, each flagship a brand stage."}
                  {tab === "avenue" &&
                    "A curated, invitation-only adjacency of 50 luxury houses. Engineered as a single experience with private suites, valet, and clienteling — the only luxury district in North America operating inside a year-round entertainment destination."}
                  {tab === "dining" &&
                    "Twenty-eight operators. Food halls, fine dining, a three-story confectionary department store. American Dream doesn't treat F&B as a break from shopping — it treats it as the reason to stay four hours."}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Tab nav */}
            <div className="mt-12 flex flex-wrap items-center gap-1 rounded-full border border-bone/15 bg-ink-2/50 p-1.5 backdrop-blur-md md:w-fit">
              {TABS.map((t) => {
                const isActive = t.id === tab;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTab(t.id);
                      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    data-cursor="cta"
                    data-cursor-label="Switch"
                    className={`relative rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.24em] transition-colors ${
                      isActive ? "text-ink" : "text-bone hover:text-bone"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="tenant-tab-pill"
                        className="absolute inset-0 rounded-full bg-bone"
                        transition={{ type: "spring", stiffness: 240, damping: 26 }}
                      />
                    )}
                    <span className="relative z-10">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {tab === "retail" && <RetailView scrollRef={scrollRef} />}
            {tab === "avenue" && <AvenueView scrollRef={scrollRef} />}
            {tab === "dining" && <DiningView scrollRef={scrollRef} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// --- Retail tab ---

function RetailView({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const [active, setActive] = useState(0);
  const current = RETAIL_CATEGORIES[active];

  return (
    <section className="relative w-full bg-ink-2 px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
          <span className="text-bone">Pick a tier</span>
          <span className="h-px flex-1 bg-bone/10" />
          <span>4 retail formats · operating today</span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
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
                    <motion.span animate={{ rotate: isActive ? 45 : 0 }} className="text-xl text-bone-dim">
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
            <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] border border-bone/10 bg-ink">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={
                      active === 0
                        ? "/images/luxury-wing.jpg"
                        : active === 1
                          ? "/images/luxury-wing.jpg"
                          : active === 2
                            ? "/images/itsugar.jpg"
                            : "/images/food-hall.jpg"
                    }
                    alt={current.tier}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
                  <div className="bg-grain absolute inset-0 opacity-50" />
                </motion.div>
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                  Now Open
                </div>
                <div className="mt-2 font-display text-3xl text-bone">{current.tier}</div>
              </div>
            </div>

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

        {/* AI Brand Fit */}
        <BrandFit category={TIER_TO_CATEGORY[active]} tierLabel={current.tier} />
      </div>
    </section>
  );
}

// --- AI Brand Fit ---

function BrandFit({
  category,
  tierLabel,
}: {
  category: (typeof TIER_TO_CATEGORY)[number];
  tierLabel: string;
}) {
  const [brand, setBrand] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!brand.trim() || loading) return;

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
        body: JSON.stringify({ type: "tenant_pitch", brand: brand.trim(), category }),
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

  const examples = ["Aesop", "Rhode", "Skims", "Acne Studios", "On Running"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="mt-12 overflow-hidden rounded-[28px] border border-gold/30 bg-gradient-to-br from-gold/[0.04] via-ink-2 to-ink-2 p-6 md:p-10"
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
        <span className="relative block h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-gold" />
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
        </span>
        <span className="text-gold">AI Brand Fit</span>
        <span>·</span>
        <span>Currently tuned to: {tierLabel}</span>
      </div>

      <div className="mt-3 max-w-2xl">
        <h3 className="font-display text-3xl leading-tight text-bone md:text-4xl">
          What does your flagship look like here?
        </h3>
        <p className="mt-3 text-[14px] leading-relaxed text-bone-dim">
          Type any brand. Our leasing director (Gemini, trained on the property's tenant mix) writes
          a 3-sentence pitch describing what their American Dream flagship would specifically be —
          which tier, which spatial detail, which adjacency.
        </p>
      </div>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          maxLength={60}
          placeholder="e.g. Aesop, Skims, Carhartt WIP…"
          data-cursor="text"
          className="flex-1 rounded-full border border-bone/20 bg-ink/60 px-5 py-3 text-[14px] text-bone placeholder:text-bone-dim/60 focus:border-gold/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!brand.trim() || loading}
          data-cursor="cta"
          data-cursor-label="Pitch"
          className="rounded-full bg-gold px-6 py-3 text-[12px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Thinking…" : "Pitch the flagship →"}
        </button>
      </form>

      {/* Example chips */}
      {!text && !loading && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-bone-dim">
          <span className="uppercase tracking-[0.22em]">Try:</span>
          {examples.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => {
                setBrand(b);
              }}
              className="rounded-full border border-bone/15 px-3 py-1 transition-colors hover:border-bone/40 hover:text-bone"
            >
              {b}
            </button>
          ))}
        </div>
      )}

      {/* Response */}
      {(text || loading || error) && (
        <div className="mt-6 rounded-2xl border border-bone/10 bg-ink/40 p-5 text-[15px] leading-relaxed text-bone md:p-6 md:text-[16px]">
          {error ? (
            <span className="text-bone-dim">
              Pitch unavailable. Try again in a moment.
            </span>
          ) : text ? (
            <>
              {text}
              {loading && (
                <span className="ml-1 inline-block h-3.5 w-1 animate-pulse bg-gold align-middle" />
              )}
            </>
          ) : (
            <span className="animate-pulse text-bone-dim">Drafting flagship pitch…</span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// --- Avenue (luxury) tab ---

function AvenueView({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
    container: scrollRef as React.RefObject<HTMLElement>,
  });
  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-50%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-ink px-6 py-24 md:px-12 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_20%,rgba(212,178,120,0.18),transparent_60%),radial-gradient(40%_60%_at_10%_80%,rgba(169,122,212,0.12),transparent_70%)]"
      />

      {/* Brand marquee */}
      <div className="relative">
        <div className="mb-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
          <span className="text-bone">The roster</span>
          <span className="h-px flex-1 bg-bone/10" />
          <span>50 houses · invitation-only</span>
        </div>

        <motion.div
          style={{ x }}
          className="flex flex-nowrap gap-10 whitespace-nowrap font-display text-[clamp(3rem,9vw,9rem)] leading-[0.85] text-bone"
        >
          {[...LUXURY_BRANDS, ...LUXURY_BRANDS].map((b, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className={i % 2 === 0 ? "italic text-gold" : "text-bone"}>{b}</span>
              <span className="h-2 w-2 rounded-full bg-gold" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* Service cards */}
      <div className="relative mx-auto mt-24 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
        {[
          {
            kicker: "Private Client",
            title: "The Salon",
            body: "A discreet suite for clienteling appointments — champagne service, private fitting rooms, after-hours access.",
          },
          {
            kicker: "Concierge",
            title: "Black Key",
            body: "Members-only hospitality program with valet, personal styling, and integrated reservations across dining and attractions.",
          },
          {
            kicker: "Hospitality",
            title: "The Arrival",
            body: "Dedicated driveway and elevator straight into The Avenue — no retail floor to cross, no crowds to navigate.",
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px", root: scrollRef as React.RefObject<HTMLElement> }}
            transition={{ duration: 0.8, delay: i * 0.06 }}
            className="group relative overflow-hidden rounded-[28px] border border-bone/10 bg-ink-2 p-8"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold/10 blur-3xl transition-all duration-700 group-hover:bg-gold/20"
            />
            <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">{card.kicker}</div>
            <div className="mt-3 font-display text-3xl text-bone">{card.title}</div>
            <div className="mt-3 text-[15px] leading-relaxed text-bone-dim">{card.body}</div>
            <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-gold">
              Learn more
              <span className="block h-px w-8 bg-gold transition-all group-hover:w-14" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Currently Leasing rail */}
      <div className="relative mx-auto mt-24 max-w-6xl">
        <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
          <span className="text-bone">Currently leasing</span>
          <span className="h-px flex-1 bg-bone/10" />
          <span className="flex items-center gap-2">
            <span className="relative block h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-gold" />
              <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
            </span>
            Live · 3 suites available
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {VACANCIES.map((v, i) => (
            <motion.div
              key={v.suite}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px", root: scrollRef as React.RefObject<HTMLElement> }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-[28px] border border-bone/10 bg-ink-2 p-7 transition-colors hover:border-gold/40"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold/10 blur-3xl transition-all group-hover:bg-gold/25"
              />
              <div className="flex items-baseline justify-between">
                <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                  {v.suite}
                </div>
                <div className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.22em] text-gold">
                  {v.available}
                </div>
              </div>
              <div className="mt-3 font-display text-3xl text-bone">{v.sqft}</div>
              <div className="mt-1 text-[12px] text-bone-dim">{v.location}</div>
              <div className="mt-5 border-t border-bone/10 pt-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                  Adjacency
                </div>
                <div className="mt-1.5 text-[13px] leading-relaxed text-bone">{v.adjacency}</div>
              </div>
              <div className="mt-5 flex items-baseline justify-between border-t border-bone/10 pt-4">
                <div className="font-display text-2xl text-gold">{v.rent}</div>
                <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-bone-dim transition-all group-hover:text-bone">
                  Inquire
                  <span className="block h-px w-6 bg-bone/30 transition-all group-hover:w-10 group-hover:bg-bone" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Wing photo */}
      <div className="relative mx-auto mt-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px", root: scrollRef as React.RefObject<HTMLElement> }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[16/7] overflow-hidden rounded-[28px] border border-bone/10 bg-ink-2"
        >
          <Image
            src="/images/luxury-wing.jpg"
            alt="The Avenue luxury wing"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
          <div className="bg-grain absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 p-7">
            <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">The Avenue</div>
            <div className="mt-2 font-display text-3xl text-bone md:text-4xl">
              Luxury wing arrival experience
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// --- Dining tab ---

function DiningView({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <section className="relative w-full bg-ink-2 px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Operator stats strip */}
        <div className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/5 md:grid-cols-4">
          {DINING_OPERATORS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px", root: scrollRef as React.RefObject<HTMLElement> }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="bg-ink-2 p-5"
            >
              <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">{s.name}</div>
              <div className="mt-1.5 font-display text-3xl text-bone">{s.count}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-bone-dim">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
          <span className="text-bone">The portfolio</span>
          <span className="h-px flex-1 bg-bone/10" />
          <span>28 operators · 4 anchor venues</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {DINING_VENUES.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px", root: scrollRef as React.RefObject<HTMLElement> }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              data-cursor="drag"
              data-cursor-label="Reserve"
              className={`group relative aspect-[4/3] overflow-hidden rounded-[28px] border border-bone/10 bg-gradient-to-br ${v.palette}`}
            >
              {"image" in v && v.image && (
                <Image
                  src={v.image}
                  alt={v.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-ink/30" />
              <div className="bg-grain absolute inset-0" />
              <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_60%,rgba(255,255,255,0.08),transparent)]" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                  Venue 0{i + 1}
                </div>
                <div className="mt-2 font-display text-3xl text-bone md:text-4xl">
                  {v.name}
                </div>
                <div className="mt-2 text-[13px] text-bone-dim">{v.descriptor}</div>
              </div>
              <div className="absolute right-6 top-6 rounded-full border border-bone/30 bg-ink/50 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-bone backdrop-blur">
                Open daily
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
