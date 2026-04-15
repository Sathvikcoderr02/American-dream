"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { DISTRICTS, type DistrictId } from "@/lib/data";
import Lenis from "lenis";

function scrollTo(id: DistrictId) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -80, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navigator() {
  const pathname = usePathname();
  const [active, setActive] = useState<DistrictId>("overview");
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Only render the deck navigator on the home route. Sub-pages bring
  // their own headers and shouldn't double-stack chrome.
  const enabled = pathname === "/";

  useEffect(() => {
    if (!enabled) return;
    const ids = DISTRICTS.map((d) => d.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id as DistrictId);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const activeDistrict = DISTRICTS.find((d) => d.id === active) ?? DISTRICTS[0];

  if (!enabled) return null;

  return (
    <>
      {/* Top hairline progress */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-40 h-px bg-bone/10">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-ember via-gold to-aqua"
          style={{ scaleX: progress }}
        />
      </div>

      {/* Top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#overview"
          data-cursor="cta"
          data-cursor-label="Top"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("overview");
          }}
          className="group flex items-center gap-3"
        >
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-ember" />
            <div className="absolute inset-[3px] rounded-full bg-ink" />
            <div className="absolute inset-0 flex items-center justify-center font-display text-sm text-bone">
              Æ
            </div>
          </div>
          <div className="hidden flex-col leading-none lg:flex">
            <span className="font-display text-[15px] tracking-wide">American Dream</span>
            <span className="text-[9px] uppercase tracking-[0.22em] text-bone-dim">
              Destination Platform
            </span>
          </div>
        </a>

        {/* Active district pill — pointer-events-none so it never steals clicks
            from the logo or the map button it sits between. Hidden until xl. */}
        <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-bone/10 bg-ink-2/50 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-bone-dim backdrop-blur-md xl:flex">
          <span className="text-bone">{activeDistrict.index}</span>
          <span className="h-px w-5 bg-bone/20" />
          <span>{activeDistrict.eyebrow}</span>
        </div>

        <button
          data-cursor="cta"
          data-cursor-label={open ? "Close" : "Map"}
          onClick={() => setOpen((o) => !o)}
          className="group flex items-center gap-3 rounded-full border border-bone/15 bg-ink-2/60 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-bone backdrop-blur-md transition-colors hover:border-bone/40"
        >
          <span className="relative block h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-ember" />
            <span className="absolute inset-0 animate-ping rounded-full bg-ember/60" />
          </span>
          {open ? "Close map" : "Districts"}
        </button>
      </div>

      {/* Radial district picker */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-ink/80 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.88, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.92, rotate: 4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
              className="relative aspect-square w-[min(88vw,640px)]"
            >
              {/* concentric rings */}
              <div className="absolute inset-0 rounded-full border border-bone/10" />
              <div className="absolute inset-[8%] rounded-full border border-bone/10" />
              <div className="absolute inset-[20%] rounded-full border border-bone/10" />
              <div className="absolute inset-[34%] rounded-full border border-bone/15" />

              {/* center */}
              <div className="absolute inset-[38%] flex flex-col items-center justify-center rounded-full border border-bone/25 bg-ink-2/80 text-center backdrop-blur-md">
                <span className="font-display text-2xl text-bone md:text-3xl">
                  American Dream
                </span>
                <span className="mt-2 text-[9px] uppercase tracking-[0.3em] text-bone-dim">
                  Select a district
                </span>
              </div>

              {/* petals */}
              {DISTRICTS.map((d) => {
                const rad = (d.angle - 90) * (Math.PI / 180);
                const r = 42; // % from center
                const x = 50 + r * Math.cos(rad);
                const y = 50 + r * Math.sin(rad);
                const isActive = d.id === active;
                return (
                  <motion.button
                    key={d.id}
                    data-cursor="cta"
                    data-cursor-label="Go"
                    onClick={() => {
                      scrollTo(d.id);
                      setOpen(false);
                    }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.05 + DISTRICTS.indexOf(d) * 0.03,
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                  >
                    <div
                      className={`group flex flex-col items-center gap-1 ${
                        isActive ? "text-bone" : "text-bone-dim hover:text-bone"
                      }`}
                    >
                      <span
                        className="block h-2 w-2 rounded-full"
                        style={{
                          background: isActive ? d.accent : "currentColor",
                        }}
                      />
                      <span className="font-display text-lg leading-none md:text-xl">
                        {d.label}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.22em]">
                        {d.index} · {d.eyebrow}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side rail (desktop) */}
      <nav className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {DISTRICTS.map((d) => (
          <button
            key={d.id}
            data-cursor="cta"
            data-cursor-label="Go"
            onClick={() => scrollTo(d.id)}
            className="group flex items-center gap-3"
          >
            <span
              className={`h-px transition-all duration-500 ${
                d.id === active ? "w-10 bg-bone" : "w-4 bg-bone/25"
              }`}
            />
            <span
              className={`text-[10px] uppercase tracking-[0.22em] transition-opacity ${
                d.id === active ? "text-bone opacity-100" : "text-bone/50 opacity-0 group-hover:opacity-100"
              }`}
            >
              {d.index} {d.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
}
