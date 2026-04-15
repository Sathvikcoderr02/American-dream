"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionIntro } from "@/components/SectionIntro";
import { LUXURY_BRANDS } from "@/lib/data";

export function Luxury() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <section
      id="luxury"
      ref={ref}
      className="relative overflow-hidden bg-ink px-6 py-40 md:px-12"
    >
      {/* Velvet gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_20%,rgba(212,178,120,0.18),transparent_60%),radial-gradient(40%_60%_at_10%_80%,rgba(169,122,212,0.12),transparent_70%)]"
      />

      <SectionIntro
        index="03"
        eyebrow="The Avenue"
        title={
          <>
            A luxury wing
            <br />
            <span className="italic text-gold">inside a megaplex.</span>
          </>
        }
        lede="A curated, invitation-only adjacency of 50 luxury houses — engineered as a single experience with private client suites, valet, and clienteling. The only luxury district in North America operating inside a year-round entertainment destination."
      />

      {/* Horizontally scrolling brand list */}
      <div className="relative mt-20">
        <motion.div
          style={{ x }}
          className="flex flex-nowrap gap-10 whitespace-nowrap font-display text-[clamp(4rem,12vw,12rem)] leading-[0.85] text-bone"
        >
          {[...LUXURY_BRANDS, ...LUXURY_BRANDS].map((b, i) => (
            <span key={i} className="flex items-center gap-10">
              <span
                className={i % 2 === 0 ? "italic text-gold" : "text-bone"}
              >
                {b}
              </span>
              <span className="h-2 w-2 rounded-full bg-gold" />
            </span>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto mt-24 grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-3">
        <LuxuryCard
          kicker="Private Client"
          title="The Salon"
          body="A discreet suite for clienteling appointments — champagne service, private fitting rooms, after-hours access."
        />
        <LuxuryCard
          kicker="Concierge"
          title="Black Key"
          body="Members-only hospitality program with valet, personal styling, and integrated reservations across all dining and attractions."
        />
        <LuxuryCard
          kicker="Hospitality"
          title="The Arrival"
          body="Dedicated driveway and elevator straight into The Avenue — no retail floor to cross, no crowds to navigate."
        />
      </div>

      <div className="mx-auto mt-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[16/7] overflow-hidden rounded-[28px] border border-bone/10 bg-ink-2"
        >
          <Image
            src="/images/luxury-wing.jpg"
            alt="The Avenue luxury wing"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/20" />
          <div className="bg-grain absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 p-7">
            <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
              The Avenue
            </div>
            <div className="mt-2 font-display text-3xl text-bone md:text-4xl">
              Luxury wing arrival experience
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LuxuryCard({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20% 0px" }}
      transition={{ duration: 0.8 }}
      className="group relative overflow-hidden rounded-[28px] border border-bone/10 bg-ink-2 p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold/10 blur-3xl transition-all duration-700 group-hover:bg-gold/20"
      />
      <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
        {kicker}
      </div>
      <div className="mt-3 font-display text-3xl text-bone">{title}</div>
      <div className="mt-3 text-[15px] leading-relaxed text-bone-dim">{body}</div>
      <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-gold">
        Learn more
        <span className="block h-px w-8 bg-gold transition-all group-hover:w-14" />
      </div>
    </motion.div>
  );
}
