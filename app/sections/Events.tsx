"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionIntro } from "@/components/SectionIntro";
import { EVENT_HIGHLIGHTS, SPONSOR_TIERS, VENUES } from "@/lib/data";

export function Events() {
  return (
    <section id="events" className="relative bg-ink-2 px-6 py-40 md:px-12">
      <SectionIntro
        index="06"
        eyebrow="A Global Platform"
        title={
          <>
            Events that move
            <br />
            <span className="italic text-plum">billions of impressions.</span>
          </>
        }
        lede="American Dream isn't a venue — it's an activation system. Four purpose-built spaces. Integrated media, production, and hospitality. A direct line to 40 million annual visitors, press, and the NYC creative economy."
      />

      {/* Venues strip */}
      <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
        {VENUES.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-[28px] border border-bone/10 bg-ink p-8"
          >
            {"image" in v && v.image && (
              <Image
                src={v.image}
                alt={v.name}
                fill
                className="absolute inset-0 object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/60 to-ink/35" />
            <div className="bg-grain absolute inset-0" />
            <div className="relative z-10 flex items-baseline justify-between">
              <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                Venue 0{i + 1} · {v.kind}
              </div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-gold">
                Available
              </div>
            </div>
            <div className="relative z-10 mt-3 font-display text-4xl text-bone">{v.name}</div>
            <div className="relative z-10 mt-6 grid grid-cols-3 gap-4 border-y border-bone/10 py-5">
              <Stat label="Capacity" value={v.capacity} />
              <Stat label="Footprint" value={v.footprint} />
              <Stat label="Ceiling" value={v.ceiling} />
            </div>
            <div className="relative z-10 mt-5 text-[14px] leading-relaxed text-bone-dim">
              {v.pitch}
            </div>
            <div className="relative z-10 mt-6 flex flex-wrap gap-2">
              {v.useCases.map((u) => (
                <span
                  key={u}
                  className="rounded-full border border-bone/15 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-bone-dim"
                >
                  {u}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Highlight reel */}
      <div className="mx-auto mt-24 max-w-6xl">
        <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
          <span className="text-bone">Recent Activations</span>
          <span className="h-px flex-1 bg-bone/10" />
        </div>
        <div className="divide-y divide-bone/10 overflow-hidden rounded-3xl border border-bone/10 bg-ink">
          {EVENT_HIGHLIGHTS.map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              data-cursor="cta"
              data-cursor-label="Open"
              className="group flex items-center gap-6 px-6 py-5 transition-colors hover:bg-ink-2"
            >
              <div className="w-16 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                {e.year}
              </div>
              <div className="flex-1 font-display text-2xl text-bone md:text-3xl">
                {e.name}
              </div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-bone-dim">
                {e.attendance} attendance
              </div>
              <span className="text-xl text-bone-dim transition-transform group-hover:translate-x-1 group-hover:text-bone">
                →
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sponsor tiers */}
      <div className="mx-auto mt-24 max-w-6xl">
        <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
          <span className="text-bone">Sponsorship Inventory · FY26</span>
          <span className="h-px flex-1 bg-bone/10" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SPONSOR_TIERS.map((tier, i) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-[28px] border p-7 ${
                i === 0
                  ? "border-gold/40 bg-gradient-to-br from-gold/15 to-transparent"
                  : "border-bone/15 bg-ink"
              }`}
            >
              {i === 0 && (
                <div className="absolute right-5 top-5 rounded-full border border-gold/50 bg-ink/70 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-gold">
                  Flagship
                </div>
              )}
              <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                Tier 0{i + 1}
              </div>
              <div className="mt-2 font-display text-3xl text-bone">
                {tier.tier}
              </div>
              <div className="mt-1 text-[12px] uppercase tracking-[0.18em] text-bone-dim">
                {tier.inventory}
              </div>
              <div className="mt-6 font-display text-4xl text-bone">
                {tier.price}
              </div>
              <ul className="mt-6 space-y-3">
                {tier.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[14px] text-bone"
                  >
                    <span className="mt-[0.55em] block h-px w-3 bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-6xl flex-wrap items-center justify-between gap-4 rounded-[28px] border border-bone/15 bg-ink p-8">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
            Events Module
          </div>
          <div className="mt-1 font-display text-2xl text-bone md:text-3xl">
            Dive into capacities, photos, and a live booking flow.
          </div>
        </div>
        <Link
          href="/events"
          data-cursor="cta"
          data-cursor-label="Open"
          className="group flex items-center gap-3 rounded-full border border-bone/25 bg-bone px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold"
        >
          Open events module
          <span className="block h-px w-6 bg-ink transition-all group-hover:w-10" />
        </Link>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
        {label}
      </div>
      <div className="mt-1 font-display text-xl text-bone md:text-2xl">
        {value}
      </div>
    </div>
  );
}
