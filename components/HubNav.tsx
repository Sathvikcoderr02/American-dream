"use client";

import { motion } from "framer-motion";
import { usePortal } from "@/app/hub/HubProvider";

type Props = {
  label?: string;
  accent?: string;
};

export function HubNav({ label, accent = "var(--color-bone)" }: Props) {
  const { closePortal } = usePortal();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onClick={closePortal}
        data-cursor="cta"
        data-cursor-label="Hub"
        className="pointer-events-auto group flex items-center gap-3 rounded-full border border-bone/20 bg-ink-2/60 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-bone backdrop-blur-md transition-colors hover:border-bone/50"
      >
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
          <path
            d="M16 5H1M5 1L1 5l4 4"
            stroke="currentColor"
            strokeWidth="1"
            className="transition-transform duration-500 group-hover:-translate-x-1"
          />
        </svg>
        Hub
      </motion.button>

      {label && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pointer-events-none flex items-center gap-2 rounded-full border border-bone/10 bg-ink-2/50 px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-bone-dim backdrop-blur-md"
        >
          <span className="block h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
          <span className="text-bone">{label}</span>
        </motion.div>
      )}

      <div className="pointer-events-auto">
        <div className="relative h-9 w-9">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-ember" />
          <div className="absolute inset-[3px] rounded-full bg-ink" />
          <div className="absolute inset-0 flex items-center justify-center font-display text-base text-bone">
            Æ
          </div>
        </div>
      </div>
    </div>
  );
}
