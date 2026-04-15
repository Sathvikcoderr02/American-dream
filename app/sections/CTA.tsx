"use client";

import { motion } from "framer-motion";

const PATHS: Array<{
  label: string;
  kicker: string;
  body: string;
  contact: string;
  href?: string;
}> = [
  {
    label: "Leasing",
    kicker: "Retail · Luxury · Pop-Up",
    body: "Tour the tier that fits your brand. We'll send floor plans, adjacencies, and terms within 48 hours.",
    contact: "leasing@americandream.com",
  },
  {
    label: "Sponsorship",
    kicker: "Brand Partnerships",
    body: "Category-exclusive partnerships across attractions, retail, and events. Project the reach, pick a tier.",
    contact: "partnerships@americandream.com",
    href: "/sponsorship",
  },
  {
    label: "Events",
    kicker: "Bookings",
    body: "Live events, corporate activations, Broadway residencies, and broadcast productions. Let's hold the date.",
    contact: "events@americandream.com",
    href: "/events",
  },
];

export function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-ink px-6 py-40 md:px-12">
      <div className="aurora animate-aurora pointer-events-none absolute inset-0 opacity-40" />
      <div className="bg-grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-bone-dim">
          <span className="text-bone">07</span>
          <span className="h-px w-8 bg-bone-dim" />
          <span>Partner With Us</span>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9 }}
          className="mt-6 font-display text-[clamp(3rem,10vw,10rem)] leading-[0.85] text-balance"
        >
          Three doors in.
          <br />
          <span className="italic text-gold">Pick yours.</span>
        </motion.h2>

        <div className="mt-16 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {PATHS.map((p, i) => (
            <motion.a
              key={p.label}
              href={p.href ?? `mailto:${p.contact}`}
              data-cursor="cta"
              data-cursor-label={p.href ? "Open" : "Email"}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[28px] border border-bone/15 bg-ink-2 p-8 transition-all hover:border-bone/40 hover:bg-ink-3"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl transition-all group-hover:bg-gold/25"
              />
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                  {p.kicker}
                </div>
                <div className="mt-2 font-display text-5xl text-bone">
                  {p.label}
                </div>
              </div>
              <div className="mt-10">
                <p className="text-[14px] leading-relaxed text-bone-dim">{p.body}</p>
                <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-bone">
                  {p.href ? `${p.href} →` : p.contact}
                  <span className="block h-px w-6 bg-bone transition-all group-hover:w-10" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-24 flex w-full flex-wrap items-center justify-between gap-4 border-t border-bone/10 pt-8 text-[11px] uppercase tracking-[0.22em] text-bone-dim">
          <div>© American Dream, Meadowlands NJ</div>
          <div>Prepared by the commercial team · Confidential</div>
          <div className="flex items-center gap-2">
            <span className="relative block h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-ember" />
              <span className="absolute inset-0 animate-ping rounded-full bg-ember/60" />
            </span>
            Operating now
          </div>
        </div>
      </div>
    </section>
  );
}
