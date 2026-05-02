"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const TENANTS = [
  "Hermès",
  "Saint Laurent",
  "Dolce & Gabbana",
  "Carolina Herrera",
  "Toys R Us",
  "LEGO",
  "Sephora",
  "Uniqlo",
  "Zara",
  "Aritzia",
  "Mulberry",
  "Tory Burch",
];

const PARTNERS = [
  "DreamWorks",
  "Nickelodeon",
  "Angry Birds",
  "Sea Life",
  "LEGOLAND",
  "Big SNOW",
  "Cinemex",
  "MetLife Stadium",
];

const QUOTES = [
  {
    text: "America's largest entertainment-first destination — a media platform with a building attached.",
    source: "Forbes",
  },
  {
    text: "DreamWorks 30th Anniversary drew 42,000 attendees over a single weekend.",
    source: "Variety · 2024",
  },
  {
    text: "An anchor that doesn't fight retail — it amplifies it.",
    source: "RetailDive",
  },
  {
    text: "Saint Laurent staged its NYFW off-site here. The first time the brand has done so in New Jersey.",
    source: "WWD · 2025",
  },
  {
    text: "The only place in North America where you can ski real snow indoors year-round.",
    source: "Condé Nast Traveler",
  },
];

export function CredibilityStrip() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % QUOTES.length);
    }, 5500);
    return () => clearInterval(t);
  }, []);

  const quote = QUOTES[quoteIndex];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.8 }}
      className="relative z-10 mx-auto mt-2 max-w-[1400px] px-6 md:px-12"
    >
      <div className="overflow-hidden rounded-3xl border border-bone/10 bg-ink-2/60 backdrop-blur-md">
        {/* Quote rotator */}
        <div className="grid grid-cols-1 gap-px bg-bone/5 lg:grid-cols-[1.4fr_1fr]">
          <div className="bg-ink-2/80 px-6 py-5 md:px-8 md:py-6">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
              <span className="text-bone">In the press</span>
              <span className="h-px w-6 bg-bone/20" />
              <span>What's been said about the property</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5 }}
                className="mt-3"
              >
                <blockquote className="font-display text-lg leading-snug text-bone md:text-xl">
                  &ldquo;{quote.text}&rdquo;
                </blockquote>
                <div className="mt-2 text-[10px] uppercase tracking-[0.24em] text-gold">
                  — {quote.source}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Live tally */}
          <div className="bg-ink-2/80 px-6 py-5 md:px-8 md:py-6">
            <div className="text-[10px] uppercase tracking-[0.24em] text-bone-dim">
              Trusted by
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="font-display text-2xl text-bone md:text-3xl">450+</div>
                <div className="text-[9px] uppercase tracking-[0.18em] text-bone-dim">
                  Tenants live
                </div>
              </div>
              <div>
                <div className="font-display text-2xl text-bone md:text-3xl">12</div>
                <div className="text-[9px] uppercase tracking-[0.18em] text-bone-dim">
                  IP partners
                </div>
              </div>
              <div>
                <div className="font-display text-2xl text-gold md:text-3xl">FY26</div>
                <div className="text-[9px] uppercase tracking-[0.18em] text-bone-dim">
                  open inventory
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant marquee */}
        <Marquee items={TENANTS} label="Tenants" />
        {/* Partner marquee */}
        <Marquee items={PARTNERS} label="IP & operating partners" reverse />
      </div>
    </motion.section>
  );
}

function Marquee({
  items,
  label,
  reverse,
}: {
  items: string[];
  label: string;
  reverse?: boolean;
}) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-t border-bone/10 bg-ink-2/40">
      <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2 px-4 text-[9px] uppercase tracking-[0.24em] text-bone-dim md:px-6">
        <span className="rounded-full border border-bone/15 bg-ink/60 px-2.5 py-1 backdrop-blur">
          {label}
        </span>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-ink-2 to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-ink-2 to-transparent" />

      <div
        className={`flex gap-12 whitespace-nowrap py-4 md:gap-16 md:py-5 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
        style={{ animationDuration: "55s" }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display text-2xl text-bone-dim transition-colors hover:text-bone md:text-3xl"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
