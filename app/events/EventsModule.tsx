"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VENUES } from "@/lib/data";
import { BookingTimeline } from "./BookingTimeline";
import { VenueStage } from "./VenueStage";

const EVENT_TYPES = [
  "Concert",
  "Product Launch",
  "Fashion Show",
  "Broadcast",
  "Gala",
  "Trade Show",
  "Residency",
];

export function EventsModule() {
  const [venueIndex, setVenueIndex] = useState(0);
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [range, setRange] = useState<{ start: number; end: number }>({
    start: 120,
    end: 135,
  });
  const [submitted, setSubmitted] = useState(false);

  const venue = VENUES[venueIndex];

  const quote = useMemo(() => {
    const nights = Math.max(1, range.end - range.start);
    const baseByVenue: Record<string, number> = {
      court: 180_000,
      pac: 240_000,
      expo: 140_000,
      rooftop: 95_000,
    };
    const base = baseByVenue[venue.id] ?? 150_000;
    return {
      nights,
      production: Math.round(base * 0.4 * nights),
      rental: Math.round(base * nights),
      total: Math.round(base * 1.4 * nights),
    };
  }, [range, venue.id]);

  return (
    <main className="relative min-h-screen bg-ink pb-40">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-bone/10 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 md:px-10">
          <Link
            href="/"
            data-cursor="cta"
            data-cursor-label="Back"
            className="flex items-center gap-3"
          >
            <span className="text-[11px] uppercase tracking-[0.22em] text-bone-dim">
              ← Overview
            </span>
          </Link>
          <div className="hidden items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim md:flex">
            <span className="text-bone">Events Module</span>
            <span className="h-px w-8 bg-bone/20" />
            <span>Interactive booking surface</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-bone/15 bg-ink-2/60 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-bone backdrop-blur">
            <span className="relative block h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-ember" />
              <span className="absolute inset-0 animate-ping rounded-full bg-ember/60" />
            </span>
            FY26 Open
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pt-20 md:px-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-bone-dim">
            <span className="text-bone">Module</span>
            <span className="h-px w-8 bg-bone-dim" />
            <span>Venues · Dates · Inquiry</span>
          </div>
          <h1 className="mt-6 font-display text-[clamp(2.8rem,8vw,7rem)] leading-[0.85] text-balance">
            Book the <span className="italic text-plum">building.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-[16px] leading-relaxed text-bone-dim">
            Four purpose-built venues, one concierge. Select a space, drag the
            timeline to hold your dates, and we'll confirm within 24 hours with
            a production-grade proposal.
          </p>
        </div>

        {/* Venue picker */}
        <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4">
          {VENUES.map((v, i) => {
            const isActive = i === venueIndex;
            return (
              <button
                key={v.id}
                data-cursor="cta"
                data-cursor-label="Select"
                onClick={() => setVenueIndex(i)}
                className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all ${
                  isActive
                    ? "border-bone/60 bg-ink-2"
                    : "border-bone/10 bg-ink/40 hover:border-bone/30"
                }`}
              >
                <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                  Venue 0{i + 1}
                </div>
                <div className="mt-2 font-display text-2xl text-bone">
                  {v.name}
                </div>
                <div className="mt-1 text-[11px] text-bone-dim">{v.kind}</div>
                {isActive && (
                  <motion.span
                    layoutId="venue-underline"
                    className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Stage + details */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <VenueStage venue={venue} />

          <AnimatePresence mode="wait">
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              <div className="rounded-[28px] border border-bone/10 bg-ink-2 p-8">
                <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                  About this venue
                </div>
                <div className="mt-3 font-display text-3xl text-bone">
                  {venue.name}
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-bone-dim">
                  {venue.pitch}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/5">
                <Spec label="Capacity" value={venue.capacity} />
                <Spec label="Footprint" value={venue.footprint} />
                <Spec label="Ceiling" value={venue.ceiling} />
              </div>

              <div>
                <div className="mb-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                  Typical use cases
                </div>
                <div className="flex flex-wrap gap-2">
                  {venue.useCases.map((u) => (
                    <span
                      key={u}
                      className="rounded-full border border-bone/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-bone"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Booking timeline */}
        <div className="mt-24">
          <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
            <span className="text-bone">02 · Hold your dates</span>
            <span className="h-px flex-1 bg-bone/10" />
            <span>Drag the handles</span>
          </div>
          <BookingTimeline range={range} onChange={setRange} />
        </div>

        {/* Event type */}
        <div className="mt-20">
          <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
            <span className="text-bone">03 · What are you staging?</span>
            <span className="h-px flex-1 bg-bone/10" />
          </div>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((t) => (
              <button
                key={t}
                data-cursor="cta"
                data-cursor-label="Pick"
                onClick={() => setEventType(t)}
                className={`rounded-full border px-5 py-2 text-[12px] uppercase tracking-[0.22em] transition-colors ${
                  eventType === t
                    ? "border-bone bg-bone text-ink"
                    : "border-bone/15 text-bone hover:border-bone/40"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Quote summary */}
        <motion.div
          layout
          className="mt-20 grid grid-cols-1 gap-6 rounded-[28px] border border-bone/15 bg-ink-2 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-10"
        >
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
              Preliminary hold · {venue.name}
            </div>
            <div className="mt-2 font-display text-4xl text-bone md:text-5xl">
              {eventType}
            </div>
            <div className="mt-3 text-[14px] text-bone-dim">
              {quote.nights} show day{quote.nights > 1 ? "s" : ""} · Capacity up
              to {venue.capacity}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/5">
              <Spec label="Rental" value={formatUsd(quote.rental)} />
              <Spec label="Production" value={formatUsd(quote.production)} />
              <Spec
                label="Package total"
                value={formatUsd(quote.total)}
                accent
              />
            </div>
            <div className="mt-3 text-[11px] text-bone-dim">
              Indicative only. Final proposal includes hospitality, media, and
              rigging, based on the full technical spec.
            </div>
          </div>
          <div className="flex flex-col justify-end gap-4">
            <button
              data-cursor="cta"
              data-cursor-label="Submit"
              onClick={() => setSubmitted(true)}
              className="group relative overflow-hidden rounded-full bg-bone px-8 py-4 text-[12px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold"
            >
              Request the hold
              <span className="absolute inset-y-0 right-6 my-auto block h-px w-6 bg-ink transition-all group-hover:w-10" />
            </button>
            <a
              href="mailto:events@americandream.com"
              data-cursor="cta"
              data-cursor-label="Email"
              className="rounded-full border border-bone/25 px-8 py-4 text-center text-[12px] uppercase tracking-[0.22em] text-bone transition-colors hover:border-bone/60"
            >
              Or email events@
            </a>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-ink/85 backdrop-blur-xl"
              onClick={() => setSubmitted(false)}
            />
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="relative max-w-md rounded-[28px] border border-bone/20 bg-ink-2 p-10 text-center"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gold/50">
                <motion.svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                >
                  <motion.path
                    d="M 4 14 L 12 22 L 24 6"
                    stroke="#d4b278"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  />
                </motion.svg>
              </div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                Hold received
              </div>
              <div className="mt-3 font-display text-3xl text-bone">
                We'll confirm within 24 hours.
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-bone-dim">
                Your request for <strong className="text-bone">{venue.name}</strong> ·{" "}
                {eventType} · {quote.nights} day{quote.nights > 1 ? "s" : ""}{" "}
                has been submitted to the commercial team. Our producer will be
                in touch.
              </p>
              <button
                data-cursor="cta"
                data-cursor-label="Close"
                onClick={() => setSubmitted(false)}
                className="mt-8 rounded-full border border-bone/25 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-bone hover:border-bone/60"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Spec({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-ink-2 p-5">
      <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
        {label}
      </div>
      <div
        className={`mt-1 font-display text-2xl md:text-3xl ${
          accent ? "text-gold" : "text-bone"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}
