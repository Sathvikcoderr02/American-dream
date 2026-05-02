"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePortal } from "./HubProvider";

const STOPS = [
  {
    chapter: "Chapter 01",
    title: "Begin with the scale.",
    narrative:
      "Three million square feet, ten minutes from Manhattan. Open the floor plan and feel the geography of the largest entertainment-first destination in the Americas.",
    cue: "Click any zone in the floor plan.",
  },
  {
    chapter: "Chapter 02 · The moment",
    title: "Now feel the impossibility.",
    narrative:
      "There is one experience here that cannot exist outdoors. We are taking you to it. Find Big SNOW in the picker — and step inside.",
    cue: "Open Big SNOW · click ‘Step inside the only place this exists →’",
  },
  {
    chapter: "Chapter 03",
    title: "Translate it into commercial value.",
    narrative:
      "American Dream is a media platform with a building attached. Drag the slider — the AI rewrites the partnership story to match your budget.",
    cue: "Drag the spend slider · watch the AI narrative reflow.",
  },
  {
    chapter: "Chapter 04",
    title: "Find your spot in the building.",
    narrative:
      "Three suites available. Fifty luxury houses. Twenty-eight dining operators. Type any brand into the AI Brand Fit and the leasing director writes the flagship in real time.",
    cue: "Try a brand. Watch the pitch write itself.",
  },
  {
    chapter: "Chapter 05 · Act",
    title: "Hold a date.",
    narrative:
      "FY26 is filling fast. Drag the gold handles on the timeline — your earliest available window starts now. The quote updates live.",
    cue: "Drag the timeline. Pick an event type. Submit.",
  },
];

export function GuidedTour() {
  const { tourActive, tourStep, nextTourStep, prevTourStep, endTour } = usePortal();
  const stop = STOPS[tourStep];
  const isLast = tourStep === STOPS.length - 1;

  return (
    <AnimatePresence>
      {tourActive && stop && (
        <motion.div
          key="tour"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[55] flex justify-center px-4 pb-6 md:pb-10"
        >
          <div className="pointer-events-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-gold/30 bg-ink-2/95 shadow-2xl shadow-ink backdrop-blur-xl">
            {/* Progress bar */}
            <div className="relative h-px w-full bg-bone/10">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-gold via-ember to-aqua"
                animate={{ width: `${((tourStep + 1) / STOPS.length) * 100}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <div className="grid grid-cols-1 gap-0 md:grid-cols-[1fr_auto]">
              {/* Narrative */}
              <div className="px-6 py-5 md:px-8 md:py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tourStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-bone-dim">
                      <span className="relative block h-1.5 w-1.5">
                        <span className="absolute inset-0 rounded-full bg-gold" />
                        <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
                      </span>
                      <span className="text-gold">Guided tour</span>
                      <span>·</span>
                      <span>{stop.chapter}</span>
                      <span className="text-bone-dim/60">
                        ({tourStep + 1} of {STOPS.length})
                      </span>
                    </div>
                    <div className="mt-2 font-display text-2xl leading-tight text-bone md:text-3xl">
                      {stop.title}
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-bone-dim md:text-[14px]">
                      {stop.narrative}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-gold">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1" />
                        <circle cx="5" cy="5" r="1.5" fill="currentColor" />
                      </svg>
                      {stop.cue}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="flex items-stretch border-t border-bone/10 md:border-l md:border-t-0">
                <button
                  onClick={prevTourStep}
                  disabled={tourStep === 0}
                  data-cursor="cta"
                  data-cursor-label="Back"
                  className="flex flex-1 items-center justify-center px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim transition-colors hover:text-bone disabled:opacity-30 disabled:hover:text-bone-dim md:flex-initial md:flex-col md:gap-1 md:px-6 md:py-0"
                >
                  ←{" "}
                  <span className="ml-1 md:ml-0 md:mt-0.5">Back</span>
                </button>
                <button
                  onClick={endTour}
                  data-cursor="cta"
                  data-cursor-label="Exit"
                  className="flex flex-1 items-center justify-center border-l border-bone/10 px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim transition-colors hover:text-bone md:flex-initial md:flex-col md:gap-1 md:px-6 md:py-0"
                >
                  Exit{" "}
                  <span className="ml-1 md:ml-0 md:mt-0.5">tour</span>
                </button>
                <button
                  onClick={nextTourStep}
                  data-cursor="cta"
                  data-cursor-label={isLast ? "Finish" : "Next"}
                  className="flex flex-1 items-center justify-center gap-2 border-l border-bone/10 bg-gold px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold-bright md:flex-initial md:gap-3 md:px-8"
                >
                  {isLast ? "Finish" : "Next"}
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function StartTourCTA() {
  const { startTour } = usePortal();
  return (
    <motion.button
      onClick={startTour}
      data-cursor="cta"
      data-cursor-label="Tour"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.4 }}
      className="group relative inline-flex items-center gap-3 rounded-full border border-bone/30 bg-ink-2/60 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-bone backdrop-blur-md transition-all hover:border-gold/60 hover:bg-ink-2"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-ember" />
        <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
      </span>
      Take the 5-stop tour
      <span className="text-bone-dim transition-transform group-hover:translate-x-1">→</span>
    </motion.button>
  );
}
