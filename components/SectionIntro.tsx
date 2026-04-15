"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  align?: "start" | "center";
};

export function SectionIntro({
  index,
  eyebrow,
  title,
  lede,
  align = "start",
}: Props) {
  return (
    <div
      className={`mx-auto flex max-w-5xl flex-col gap-5 ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20% 0px" }}
        transition={{ duration: 0.7 }}
        className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-bone-dim"
      >
        <span className="text-bone">{index}</span>
        <span className="h-px w-8 bg-bone-dim" />
        <span>{eyebrow}</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.9, ease: [0.2, 0.9, 0.1, 1] }}
        className="font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.95] text-balance"
      >
        {title}
      </motion.h2>

      {lede && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="max-w-2xl text-pretty text-[16px] leading-relaxed text-bone-dim md:text-[18px]"
        >
          {lede}
        </motion.p>
      )}
    </div>
  );
}
