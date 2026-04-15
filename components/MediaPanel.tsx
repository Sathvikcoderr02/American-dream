"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  /** Decorative SVG / Canvas / DOM content. Rendered under the label. */
  children?: ReactNode;
  label: string;
  kicker?: string;
  /** Utility class for the outer gradient tint. */
  gradient?: string;
  aspect?: "video" | "portrait" | "square" | "wide";
};

const ASPECTS: Record<NonNullable<Props["aspect"]>, string> = {
  video: "aspect-[16/9]",
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[21/9]",
};

/**
 * A self-contained "video panel" that renders as a styled, animated surface.
 * Swap the inner <div className="absolute inset-0 bg-…"> for a real <video> element
 * when production assets are available — the container contract stays the same.
 */
export function MediaPanel({
  children,
  label,
  kicker,
  gradient = "from-ember/20 via-gold/10 to-aqua/20",
  aspect = "video",
}: Props) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: [0.2, 0.9, 0.1, 1] }}
      className={`bg-grain group relative overflow-hidden rounded-[28px] border border-bone/10 bg-ink-2 ${ASPECTS[aspect]}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,rgba(255,255,255,0.12),transparent)]" />
      {children}
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5 md:p-7">
        <div>
          {kicker && (
            <div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
              {kicker}
            </div>
          )}
          <div className="font-display text-2xl leading-none text-bone md:text-3xl">
            {label}
          </div>
        </div>
        <div className="flex h-10 items-center gap-2 rounded-full border border-bone/25 bg-ink/60 px-3 backdrop-blur-md">
          <span className="relative block h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-ember" />
            <span className="absolute inset-0 animate-ping rounded-full bg-ember/60" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-bone">Live</span>
        </div>
      </figcaption>
    </motion.figure>
  );
}
