"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionIntro } from "@/components/SectionIntro";
import { DINING_VENUES } from "@/lib/data";

export function Dining() {
  return (
    <section id="dining" className="relative bg-ink-2 px-6 py-40 md:px-12">
      <SectionIntro
        index="04"
        eyebrow="Culinary Theater"
        title={
          <>
            Dining as the
            <br />
            <span className="italic text-ember">main event.</span>
          </>
        }
        lede="Twenty-eight operators. Food halls. Fine dining. A three-story confectionary department store. American Dream doesn't treat F&B as a break from shopping — it treats it as the reason to stay four hours."
      />

      <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
        {DINING_VENUES.map((v, i) => (
          <motion.div
            key={v.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.05 }}
            data-cursor="drag"
            data-cursor-label="Reserve"
            className={`group relative aspect-[4/3] overflow-hidden rounded-[28px] border border-bone/10 bg-gradient-to-br ${v.palette}`}
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
            <div className="absolute inset-0 bg-ink/30" />
            <div className="bg-grain absolute inset-0" />
            <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_60%,rgba(255,255,255,0.08),transparent)]" />
            <PlateArt index={i} />
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
    </section>
  );
}

function PlateArt({ index }: { index: number }) {
  const rings = 6;
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-40">
      <g transform={`translate(200 150) rotate(${index * 22})`}>
        {Array.from({ length: rings }).map((_, i) => (
          <circle
            key={i}
            r={40 + i * 18}
            fill="none"
            stroke="rgba(246,242,234,0.35)"
            strokeWidth="0.6"
            strokeDasharray={i % 2 === 0 ? "3,4" : "none"}
          />
        ))}
        <circle r="8" fill="rgba(246,242,234,0.7)" />
      </g>
    </svg>
  );
}
