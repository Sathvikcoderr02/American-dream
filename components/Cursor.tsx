"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 550, damping: 40, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 550, damping: 40, mass: 0.35 });

  const [variant, setVariant] = useState<"default" | "cta" | "text" | "drag">(
    "default"
  );
  const [label, setLabel] = useState<string>("");
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest<HTMLElement>("[data-cursor]");
      if (interactive) {
        const v = interactive.dataset.cursor as typeof variant;
        setVariant(v || "cta");
        setLabel(interactive.dataset.cursorLabel || "");
      } else {
        setVariant("default");
        setLabel("");
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  const size =
    variant === "cta" ? 96 : variant === "drag" ? 84 : variant === "text" ? 8 : 14;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
        style={{ x: sx, y: sy }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-bone"
          style={{ width: 6, height: 6 }}
        />
      </motion.div>
      <motion.div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99]"
        style={{ x, y }}
      >
        <motion.div
          animate={{ width: size, height: size }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-bone/70"
        >
          {label && (
            <span className="flex h-full w-full items-center justify-center text-[10px] font-medium uppercase tracking-[0.18em] text-bone">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
