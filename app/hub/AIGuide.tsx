"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePortal } from "./HubProvider";
import type { PortalId } from "@/lib/portals";

type Step = {
  id: string;
  question: string;
  options: { label: string; value: string; nextStep?: string }[];
};

// Tree-walk question flow. Q1 routes to a Q2 follow-up by id; Q3 is shared.
const STEPS: Record<string, Step> = {
  goal: {
    id: "goal",
    question: "What brings you here today?",
    options: [
      { label: "Lease retail space", value: "Lease retail space", nextStep: "footprint" },
      { label: "Brand partnership / sponsorship", value: "Brand sponsorship", nextStep: "budget" },
      { label: "Plan an event", value: "Plan an event", nextStep: "eventType" },
      { label: "Just exploring", value: "Just exploring", nextStep: "priority" },
    ],
  },
  footprint: {
    id: "footprint",
    question: "What footprint are you thinking?",
    options: [
      { label: "Pop-up · under 2,000 sq ft", value: "Pop-up under 2,000 sq ft", nextStep: "priority" },
      { label: "Mid-tier · 2,000–10,000 sq ft", value: "Mid-tier 2,000-10,000 sq ft", nextStep: "priority" },
      { label: "Flagship · 10,000+ sq ft", value: "Flagship 10,000+ sq ft", nextStep: "priority" },
    ],
  },
  budget: {
    id: "budget",
    question: "Annual marketing budget for this kind of partnership?",
    options: [
      { label: "Under $100K", value: "Under $100K", nextStep: "priority" },
      { label: "$100K – $750K", value: "$100K to $750K", nextStep: "priority" },
      { label: "$750K – $2M", value: "$750K to $2M", nextStep: "priority" },
      { label: "$2M+", value: "$2M+", nextStep: "priority" },
    ],
  },
  eventType: {
    id: "eventType",
    question: "What kind of event?",
    options: [
      { label: "Concert / residency", value: "Concert or residency", nextStep: "priority" },
      { label: "Corporate / activation", value: "Corporate activation", nextStep: "priority" },
      { label: "Fashion / broadcast", value: "Fashion or broadcast", nextStep: "priority" },
      { label: "Trade show / convention", value: "Trade show", nextStep: "priority" },
    ],
  },
  priority: {
    id: "priority",
    question: "And what matters most?",
    options: [
      { label: "Reach + audience scale", value: "Reach and scale" },
      { label: "Long-term IP association", value: "Long-term IP association" },
      { label: "Operational ease", value: "Operational ease" },
      { label: "Speed-to-market", value: "Speed to market" },
    ],
  },
};

type Answer = { question: string; answer: string };

export function AIGuide() {
  const { openPortal } = usePortal();
  const [open, setOpen] = useState(false);
  const [stepId, setStepId] = useState<string>("goal");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [routedPortal, setRoutedPortal] = useState<PortalId | null>(null);
  const [errored, setErrored] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset everything when guide opens
  useEffect(() => {
    if (!open) {
      abortRef.current?.abort();
      abortRef.current = null;
    } else {
      setStepId("goal");
      setAnswers([]);
      setResponseText("");
      setRoutedPortal(null);
      setErrored(false);
      setStreaming(false);
    }
  }, [open]);

  const currentStep = STEPS[stepId];
  const isComplete = answers.length >= 3;

  const handlePick = (option: Step["options"][number]) => {
    const newAnswers = [
      ...answers,
      { question: currentStep.question, answer: option.value },
    ];
    setAnswers(newAnswers);

    if (option.nextStep) {
      setStepId(option.nextStep);
    } else {
      runRecommendation(newAnswers);
    }
  };

  const runRecommendation = async (finalAnswers: Answer[]) => {
    setStreaming(true);
    setResponseText("");
    setErrored(false);
    setRoutedPortal(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "guide", answers: finalAnswers }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        setErrored(true);
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Stream chunks; defer ROUTE parsing until after stream completes
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        // Show everything BEFORE the ROUTE line as the prose
        const proseEnd = buffer.indexOf("ROUTE:");
        const visible = proseEnd >= 0 ? buffer.slice(0, proseEnd).trim() : buffer;
        setResponseText(visible);
      }

      // Parse ROUTE line
      const match = buffer.match(/ROUTE:\s*\{[^}]*"portal"\s*:\s*"(property|attractions|sponsor|tenant|events)"/);
      if (match) {
        setRoutedPortal(match[1] as PortalId);
      }
      setStreaming(false);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setErrored(true);
      setStreaming(false);
    }
  };

  const reset = () => {
    setStepId("goal");
    setAnswers([]);
    setResponseText("");
    setRoutedPortal(null);
    setErrored(false);
  };

  const portalLabel: Record<PortalId, string> = {
    property: "The Property",
    attractions: "Attractions",
    sponsor: "Sponsor",
    tenant: "Tenant",
    events: "Events",
  };

  return (
    <>
      {/* Floating trigger pill — bottom right */}
      <motion.button
        onClick={() => setOpen(true)}
        data-cursor="cta"
        data-cursor-label="Ask"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-3 rounded-full border border-bone/20 bg-ink-2/80 px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-bone shadow-2xl shadow-ink backdrop-blur-xl transition-all hover:border-gold/60 hover:bg-ink-2 md:bottom-10 md:right-10"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-ember" />
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
        </span>
        <span className="hidden sm:inline">Not sure where to start?</span>
        <span className="sm:hidden">Ask the concierge</span>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
          <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-end md:pr-10"
          >
            <div className="absolute inset-0 bg-ink/70 backdrop-blur-md" onClick={() => setOpen(false)} />

            <motion.div
              ref={panelRef}
              initial={{ y: 60, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="relative flex h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-bone/15 bg-ink-2 shadow-2xl shadow-ink md:h-[640px] md:rounded-3xl"
            >
              {/* Header */}
              <header className="flex items-start justify-between border-b border-bone/10 px-6 py-5">
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
                    <span className="relative block h-1.5 w-1.5">
                      <span className="absolute inset-0 rounded-full bg-gold" />
                      <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
                    </span>
                    <span className="text-bone">Concierge</span>
                    <span>·</span>
                    <span>AI-routed</span>
                  </div>
                  <div className="mt-2 font-display text-xl text-bone">
                    Find your starting point
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  data-cursor="cta"
                  data-cursor-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/15 text-bone-dim transition-colors hover:border-bone/40 hover:text-bone"
                  aria-label="Close"
                >
                  ×
                </button>
              </header>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* Answers so far (chat bubbles) */}
                <div className="space-y-4">
                  {answers.map((a, i) => (
                    <div key={i} className="space-y-2">
                      <div className="text-[11px] leading-relaxed text-bone-dim">
                        {a.question}
                      </div>
                      <div className="ml-auto inline-block max-w-[85%] rounded-2xl rounded-br-sm border border-gold/30 bg-gold/10 px-4 py-2.5 text-[13px] text-bone">
                        {a.answer}
                      </div>
                    </div>
                  ))}

                  {/* Current question (only show if not yet streaming/complete) */}
                  {!isComplete && !streaming && !responseText && (
                    <motion.div
                      key={currentStep.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-3 pt-2"
                    >
                      <div className="text-[12px] uppercase tracking-[0.22em] text-bone-dim">
                        Question {answers.length + 1} of 3
                      </div>
                      <div className="font-display text-2xl leading-tight text-bone">
                        {currentStep.question}
                      </div>
                      <div className="space-y-2 pt-2">
                        {currentStep.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handlePick(opt)}
                            data-cursor="cta"
                            data-cursor-label="Pick"
                            className="group flex w-full items-center justify-between gap-3 rounded-xl border border-bone/15 bg-ink-2 px-4 py-3 text-left text-[13px] text-bone transition-colors hover:border-gold/50 hover:bg-ink"
                          >
                            <span>{opt.label}</span>
                            <span className="text-bone-dim transition-all group-hover:translate-x-1 group-hover:text-gold">
                              →
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Streaming + final response */}
                  {(streaming || responseText) && (
                    <div className="space-y-3 pt-2">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-bone-dim">
                        {streaming ? "Reading your context…" : "Recommendation"}
                      </div>
                      <div className="rounded-2xl rounded-bl-sm border border-bone/15 bg-ink p-4 text-[14px] leading-relaxed text-bone">
                        {responseText || (
                          <span className="animate-pulse text-bone-dim">…</span>
                        )}
                        {streaming && responseText && (
                          <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-gold align-middle" />
                        )}
                      </div>

                      {/* Action row */}
                      {!streaming && routedPortal && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="space-y-2 pt-2"
                        >
                          <button
                            onClick={() => {
                              setOpen(false);
                              openPortal(routedPortal);
                            }}
                            data-cursor="cta"
                            data-cursor-label="Go"
                            className="group flex w-full items-center justify-between gap-3 rounded-xl border border-gold bg-gold px-4 py-3 text-left text-[13px] uppercase tracking-[0.22em] text-ink transition-all hover:bg-gold-bright"
                          >
                            <span>Take me to {portalLabel[routedPortal]}</span>
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                          </button>
                          <button
                            onClick={reset}
                            data-cursor="cta"
                            data-cursor-label="Restart"
                            className="w-full rounded-xl border border-bone/15 px-4 py-2.5 text-[12px] uppercase tracking-[0.22em] text-bone-dim transition-colors hover:border-bone/40 hover:text-bone"
                          >
                            Ask again
                          </button>
                        </motion.div>
                      )}

                      {!streaming && !routedPortal && responseText && (
                        <button
                          onClick={reset}
                          className="w-full rounded-xl border border-bone/15 px-4 py-2.5 text-[12px] uppercase tracking-[0.22em] text-bone-dim transition-colors hover:border-bone/40 hover:text-bone"
                        >
                          Ask again
                        </button>
                      )}

                      {errored && (
                        <div className="rounded-xl border border-ember/40 bg-ember/10 p-3 text-[12px] text-ember">
                          Concierge unavailable. Please pick a portal directly from the hub.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <footer className="border-t border-bone/10 px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                Powered by Gemini · Routes to one of 5 portals
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
