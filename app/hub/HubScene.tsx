"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { PORTALS } from "@/lib/portals";
import { PortalCard } from "./PortalCard";
import { usePortal } from "./HubProvider";

export function HubScene() {
  const [showCinematic, setShowCinematic] = useState(true);
  const { pendingPlaceholder, dismissPlaceholder } = usePortal();

  useEffect(() => {
    const t = setTimeout(() => setShowCinematic(false), 3600);
    return () => clearTimeout(t);
  }, []);

  const property = PORTALS[0];
  const attractions = PORTALS[1];
  const sponsor = PORTALS[2];
  const tenant = PORTALS[3];
  const events = PORTALS[4];

  return (
    <motion.div
      key="hub"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen w-full overflow-hidden bg-ink text-bone"
    >
      {/* Ambient hero video — soft, subtle */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <video
          src="/videos/hero-reel.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/85 to-ink" />
      </div>

      {/* Aurora */}
      <div className="aurora animate-aurora pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <div className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-50" />

      {/* Opening cinematic — covers everything for the first ~3.6s */}
      <AnimatePresence>
        {showCinematic && (
          <motion.div
            key="cinematic"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-50 flex items-end justify-start bg-ink"
          >
            <video
              src="/videos/project.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative z-10 px-8 pb-16 md:px-16"
            >
              <div className="text-[10px] uppercase tracking-[0.28em] text-bone-dim">
                American Dream · Meadowlands NJ
              </div>
              <div className="mt-3 font-display text-4xl leading-tight text-bone md:text-6xl">
                Welcome to the destination platform.
              </div>
            </motion.div>
            <button
              onClick={() => setShowCinematic(false)}
              data-cursor="cta"
              data-cursor-label="Skip"
              className="absolute right-6 top-6 rounded-full border border-bone/20 bg-ink/40 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-bone backdrop-blur transition-colors hover:border-bone/50"
            >
              Skip intro →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-ember" />
            <div className="absolute inset-[3px] rounded-full bg-ink" />
            <div className="absolute inset-0 flex items-center justify-center font-display text-base text-bone">
              Æ
            </div>
          </div>
          <div className="hidden flex-col leading-none md:flex">
            <span className="font-display text-[16px] tracking-wide">American Dream</span>
            <span className="text-[9px] uppercase tracking-[0.24em] text-bone-dim">
              Destination Platform
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-3 rounded-full border border-bone/10 bg-ink-2/50 px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-bone-dim backdrop-blur md:flex">
          <span className="relative block h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-ember" />
            <span className="absolute inset-0 animate-ping rounded-full bg-ember/60" />
          </span>
          5 Portals · Choose Your Path
        </div>
      </header>

      {/* Hero copy */}
      <section className="relative z-10 px-6 pt-6 md:px-12 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-3xl"
        >
          <div className="text-[10px] uppercase tracking-[0.28em] text-bone-dim">
            Hub · Non-linear Sales Experience
          </div>
          <h1 className="mt-4 font-display text-5xl leading-[0.96] text-bone md:text-7xl">
            Pick the door <br />
            that <span className="italic text-gold">matters to you.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-bone-dim md:text-[15px]">
            Three million square feet, seven attractions, four event venues, and 450 brands —
            distilled into five portals. Open the one that fits your role and skip the rest.
          </p>
        </motion.div>
      </section>

      {/* Portal grid — asymmetric */}
      <section className="relative z-10 mx-auto max-w-[1400px] px-6 py-14 md:px-12 md:py-20">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {/* Row 1: Property (wide, 7 cols) + Attractions (tall, 5 cols) */}
          <div className="md:col-span-7">
            <PortalCard portal={property} className="h-[300px] md:h-[440px]" delay={0.05} />
          </div>
          <div className="md:col-span-5 md:row-span-2">
            <PortalCard portal={attractions} className="h-[300px] md:h-[908px]" delay={0.15} />
          </div>

          {/* Row 2: Sponsor + Tenant (under Property, fills cols 1-7) */}
          <div className="md:col-span-4">
            <PortalCard portal={sponsor} className="h-[260px] md:h-[440px]" delay={0.25} />
          </div>
          <div className="md:col-span-3">
            <PortalCard portal={tenant} className="h-[260px] md:h-[440px]" delay={0.3} />
          </div>

          {/* Row 3: Events (wide, all 12 cols) */}
          <div className="md:col-span-12">
            <PortalCard portal={events} className="h-[260px] md:h-[320px]" delay={0.4} />
          </div>
        </div>
      </section>

      {/* Footer hint — Day 2 will replace with AI guide button */}
      <footer className="relative z-10 px-6 pb-10 md:px-12 md:pb-14">
        <div className="flex flex-col items-start justify-between gap-4 border-t border-bone/10 pt-6 text-[11px] uppercase tracking-[0.22em] text-bone-dim md:flex-row md:items-center">
          <span>Tip — every portal is a self-contained world. Return to the hub anytime.</span>
          <span className="opacity-60">Concierge launching soon ↗</span>
        </div>
      </footer>

      {/* Coming Next placeholder modal */}
      <AnimatePresence>
        {pendingPlaceholder && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-ink/80 backdrop-blur-xl"
              onClick={dismissPlaceholder}
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="relative w-[min(92vw,460px)] rounded-3xl border border-bone/15 bg-ink-2 p-8 text-center"
            >
              <div className="text-[10px] uppercase tracking-[0.28em] text-bone-dim">
                Module in production
              </div>
              <div className="mt-4 font-display text-3xl text-bone">Coming next</div>
              <p className="mt-3 text-[13px] leading-relaxed text-bone-dim">
                This portal is being built. The Property module is fully live today —
                use it to feel the architecture. The remaining four portals follow the
                same pattern and ship over the next 48 hours.
              </p>
              <button
                onClick={dismissPlaceholder}
                data-cursor="cta"
                data-cursor-label="Close"
                className="mt-6 rounded-full border border-bone/30 px-5 py-2 text-[11px] uppercase tracking-[0.24em] text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink"
              >
                Got it — back to hub
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
