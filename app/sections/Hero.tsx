"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HERO_STATS, TICKER_ITEMS } from "@/lib/data";
import { ParticleField } from "@/components/ParticleField";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);
  const auroraY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const chromeOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 0.5, 0]);

  return (
    <section
      id="overview"
      ref={ref}
      className="relative h-[200vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background reel — autoplay, muted, looping. Sits behind every
            atmospheric layer so the aurora + particles read as light on
            top of real footage rather than replacing it. */}
        <motion.video
          aria-hidden
          style={{ y: auroraY }}
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/hero-reel.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        {/* Cinematic dim — keeps headline readable over any frame */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-ink/45 to-ink/85" />

        {/* Aurora field — now layered ON TOP of the video as a light pass */}
        <motion.div
          aria-hidden
          style={{ y: auroraY }}
          className="absolute inset-0 mix-blend-screen opacity-50"
        >
          <div className="aurora animate-aurora absolute inset-0 scale-125" />
          <div className="bg-grain absolute inset-0" />
        </motion.div>

        {/* Particles */}
        <ParticleField
          density={90}
          className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
        />

        {/* Vignette */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,7,10,0.95))]"
        />

        {/* Headline — biased toward the upper half so the absolute-positioned
            stat grid + ticker have clear room to live below it. */}
        <motion.div
          style={{ scale: titleScale, y: titleY, opacity: titleOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-start px-6 pt-28 text-center md:justify-center md:pt-0 md:pb-72"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-bone-dim"
          >
            <span className="h-px w-8 bg-bone-dim" />
            <span>Meadowlands, NJ · Est. 2019 · 3,000,000 sq ft</span>
            <span className="h-px w-8 bg-bone-dim" />
          </motion.div>

          <h1 className="font-display text-[clamp(2.8rem,11vw,11rem)] leading-[0.85] text-bone text-balance">
            <WordReveal delay={0.2}>American</WordReveal>
            <br />
            <WordReveal delay={0.35}>
              <span className="italic text-gold">Dream</span>
            </WordReveal>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-6 max-w-xl text-pretty text-[14px] leading-relaxed text-bone-dim md:mt-8 md:text-[17px]"
          >
            Not a mall. A mixed-use commercial platform combining retail,
            luxury, dining, entertainment, and live events inside a single
            three-million-square-foot destination 10 minutes from Manhattan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-2 md:mt-10 md:gap-3"
          >
            <a
              href="#why"
              data-cursor="cta"
              data-cursor-label="Begin"
              className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-bone/25 bg-bone px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold"
            >
              Begin the tour
              <span className="block h-px w-6 bg-ink transition-all group-hover:w-10" />
            </a>
            <a
              href="#events"
              data-cursor="cta"
              data-cursor-label="Events"
              className="flex items-center gap-3 rounded-full border border-bone/25 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-bone transition-colors hover:border-bone/60"
            >
              Book a venue
            </a>
          </motion.div>

          {/* Inline mobile stat strip — lives in flow, never collides */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.15 }}
            className="mt-8 grid w-full max-w-md grid-cols-2 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/5 sm:hidden"
          >
            {HERO_STATS.map((s) => (
              <div key={s.label} className="glass p-4 text-left">
                <div className="flex items-baseline gap-1">
                  <div className="font-display text-2xl text-bone">{s.value}</div>
                  <div className="text-[9px] uppercase tracking-[0.22em] text-bone-dim">
                    {s.unit}
                  </div>
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-bone-dim">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Stat grid — hidden on mobile (lives in the Why section's demographics
            grid instead); shown as the chrome-rich version on tablet+ */}
        <motion.div
          style={{ opacity: chromeOpacity }}
          className="absolute inset-x-6 bottom-24 z-10 mx-auto hidden max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/5 sm:grid md:grid-cols-4"
        >
          {HERO_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.08 }}
              className="glass relative p-5"
            >
              <div className="flex items-baseline gap-1">
                <div className="font-display text-3xl text-bone md:text-4xl">
                  {s.value}
                </div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                  {s.unit}
                </div>
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-bone-dim">
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Live ticker */}
        <motion.div
          style={{ opacity: chromeOpacity }}
          className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-bone/10 bg-ink/70 backdrop-blur"
        >
          <div className="flex animate-marquee whitespace-nowrap py-3 text-[11px] uppercase tracking-[0.22em] text-bone-dim">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <span key={i} className="mx-6 flex items-center gap-6">
                <span className="text-bone">{t}</span>
                <span className="h-1 w-1 rounded-full bg-gold" />
              </span>
            ))}
          </div>
        </motion.div>

        {/* Scroll cue — desktop-only to avoid colliding with mobile chrome */}
        <motion.div
          style={{ opacity: chromeOpacity }}
          className="absolute bottom-[140px] left-1/2 z-10 hidden -translate-x-1/2 text-[9px] uppercase tracking-[0.32em] text-bone-dim md:block"
        >
          <div className="flex flex-col items-center gap-2">
            <span>Scroll</span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="block h-4 w-px bg-bone-dim"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function WordReveal({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.span
      initial={{ clipPath: "inset(0 0 100% 0)", y: 40 }}
      animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
      transition={{ duration: 1.1, delay, ease: [0.87, 0, 0.13, 1] }}
      className="inline-block"
    >
      {children}
    </motion.span>
  );
}
