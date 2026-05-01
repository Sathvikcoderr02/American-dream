"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { HubNav } from "@/components/HubNav";
import { VENUES, EVENT_HIGHLIGHTS } from "@/lib/data";
import { BookingTimeline } from "@/app/events/BookingTimeline";
import { VenueStage } from "@/app/events/VenueStage";
import { ACCENT_TOKEN } from "@/lib/portals";

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
  const [range, setRange] = useState<{ start: number; end: number }>({ start: 120, end: 135 });
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <motion.div
      key="events"
      layoutId="portal-events"
      className="fixed inset-0 z-30 overflow-hidden bg-ink"
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
    >
      <HubNav label="Events" accent={ACCENT_TOKEN.plum} />

      <div ref={scrollRef} className="h-full w-full overflow-y-auto overflow-x-hidden">
        {/* Hero */}
        <section className="relative flex min-h-[80vh] w-full items-end overflow-hidden">
          <video
            src="/videos/big-snow.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-50"
            poster="/images/court-concert.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/30" />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: `radial-gradient(60% 80% at 80% 100%, ${ACCENT_TOKEN.plum}33 0%, transparent 70%)`,
            }}
          />
          <div className="bg-grain pointer-events-none absolute inset-0 opacity-40" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full px-6 pb-20 pt-32 md:px-12 md:pb-28 md:pt-40"
          >
            <div className="text-[10px] uppercase tracking-[0.28em] text-bone-dim">
              Portal 05 · Venues · Dates · Inquiry
            </div>
            <h1 className="mt-5 max-w-5xl font-display text-[44px] leading-[0.92] text-bone md:text-[88px]">
              Book the{" "}
              <span className="italic" style={{ color: ACCENT_TOKEN.plum }}>
                building.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-bone-dim md:text-[16px]">
              Four purpose-built venues, one concierge. Select a space, drag the timeline to hold
              your dates, and we'll confirm within 24 hours with a production-grade proposal.
            </p>

            {/* Venue quick stats */}
            <div className="mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/5 md:grid-cols-4">
              {[
                { v: "12K", l: "Court capacity" },
                { v: "2.4K", l: "PAC seats" },
                { v: "80K", l: "Expo sq ft" },
                { v: "3K", l: "Rooftop open-air" },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.7 + i * 0.08 }}
                  className="bg-ink-2/80 p-5 backdrop-blur"
                >
                  <div className="font-display text-3xl text-bone md:text-4xl">{s.v}</div>
                  <div className="mt-1.5 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                    {s.l}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Venue picker + stage */}
        <section className="relative w-full px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
              <span className="text-bone">01 · Pick a venue</span>
              <span className="h-px flex-1 bg-bone/10" />
              <span>4 spaces, all in one building</span>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
                    <div className="mt-2 font-display text-2xl text-bone">{v.name}</div>
                    <div className="mt-1 text-[11px] text-bone-dim">{v.kind}</div>
                    {isActive && (
                      <motion.span
                        layoutId="venue-underline"
                        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-plum to-transparent"
                      />
                    )}
                  </button>
                );
              })}
            </div>

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
                    <div className="mt-3 font-display text-3xl text-bone">{venue.name}</div>
                    <p className="mt-3 text-[14px] leading-relaxed text-bone-dim">{venue.pitch}</p>
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
          </div>
        </section>

        {/* Booking pace + Booking timeline */}
        <section className="relative w-full px-6 pb-24 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
              <span className="text-bone">02 · Hold your dates</span>
              <span className="h-px flex-1 bg-bone/10" />
              <span>Drag the handles · 2026 calendar</span>
            </div>

            <BookingPace venueId={venue.id} range={range} />

            <div className="mt-6">
              <BookingTimeline range={range} onChange={setRange} />
            </div>
          </div>
        </section>

        {/* Event type */}
        <section className="relative w-full px-6 pb-24 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
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
        </section>

        {/* Quote summary */}
        <section className="relative w-full px-6 pb-24 md:px-12">
          <div className="mx-auto max-w-7xl">
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 rounded-[28px] border border-bone/15 bg-ink-2 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-10"
            >
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                  Preliminary hold · {venue.name}
                </div>
                <div className="mt-2 font-display text-4xl text-bone md:text-5xl">{eventType}</div>
                <div className="mt-3 text-[14px] text-bone-dim">
                  {quote.nights} show day{quote.nights > 1 ? "s" : ""} · Capacity up to {venue.capacity}
                </div>
                <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/5">
                  <Spec label="Rental" value={formatUsd(quote.rental)} />
                  <Spec label="Production" value={formatUsd(quote.production)} />
                  <Spec label="Package total" value={formatUsd(quote.total)} accent />
                </div>
                <div className="mt-3 text-[11px] text-bone-dim">
                  Indicative only. Final proposal includes hospitality, media, and rigging, based on
                  the full technical spec.
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
          </div>
        </section>

        {/* Past events highlight rail */}
        <section className="relative w-full px-6 pb-32 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
              <span className="text-bone">04 · Recent productions</span>
              <span className="h-px flex-1 bg-bone/10" />
              <span>What's already happened here</span>
            </div>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[28px] border border-bone/10 bg-bone/5">
              {EVENT_HIGHLIGHTS.map((e, i) => (
                <motion.div
                  key={e.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-5% 0px", root: scrollRef as React.RefObject<HTMLElement> }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="group flex items-center justify-between gap-6 bg-ink-2 px-6 py-5 transition-colors hover:bg-ink"
                >
                  <div className="flex items-baseline gap-6">
                    <span className="font-display text-2xl text-gold">{e.year}</span>
                    <span className="font-display text-xl text-bone md:text-2xl">{e.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] uppercase tracking-[0.22em] text-bone-dim">
                      {e.attendance} attended
                    </span>
                    <span className="text-bone-dim transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Hold confirmation modal */}
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
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-plum/50">
                <motion.svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <motion.path
                    d="M 4 14 L 12 22 L 24 6"
                    stroke="#a97ad4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  />
                </motion.svg>
              </div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">Hold received</div>
              <div className="mt-3 font-display text-3xl text-bone">
                We'll confirm within 24 hours.
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-bone-dim">
                Your request for <strong className="text-bone">{venue.name}</strong> · {eventType} ·{" "}
                {quote.nights} day{quote.nights > 1 ? "s" : ""} has been submitted to the commercial
                team. Our producer will be in touch.
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
    </motion.div>
  );
}

// --- FY26 Booking Pace panel ---

const UPCOMING_EVENTS = [
  { date: "May 14", venue: "The Court", name: "Saint Laurent Resort Show" },
  { date: "May 22", venue: "PAC", name: "Hamilton Limited Run · 8 nights" },
  { date: "Jun 03", venue: "Rooftop", name: "Aperol Summer Series · launch" },
  { date: "Jun 18", venue: "Expo Hall", name: "NYNJ Tech Conference 2026" },
  { date: "Jul 04", venue: "The Court", name: "Independence Concert" },
];

const PACE_BY_VENUE: Record<string, { booked: number; held: number; open: number }> = {
  court: { booked: 142, held: 38, open: 185 },
  pac: { booked: 218, held: 62, open: 85 },
  expo: { booked: 96, held: 24, open: 245 },
  rooftop: { booked: 64, held: 18, open: 283 },
};

function BookingPace({
  venueId,
  range,
}: {
  venueId: string;
  range: { start: number; end: number };
}) {
  const pace = PACE_BY_VENUE[venueId] ?? PACE_BY_VENUE.court;
  const total = pace.booked + pace.held + pace.open;
  const bookedPct = Math.round((pace.booked / total) * 100);
  const heldPct = Math.round((pace.held / total) * 100);
  const openPct = 100 - bookedPct - heldPct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7 }}
      className="grid grid-cols-1 gap-px overflow-hidden rounded-[28px] border border-bone/10 bg-bone/5 lg:grid-cols-[1fr_1.4fr]"
    >
      {/* Pace stat */}
      <div className="bg-ink-2 p-7 md:p-8">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
          <span className="relative block h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-plum" />
            <span className="absolute inset-0 animate-ping rounded-full bg-plum/60" />
          </span>
          <span className="text-plum">Live</span>
          <span>·</span>
          <span>FY26 booking pace</span>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-5xl text-bone">{bookedPct}%</span>
          <span className="text-[12px] uppercase tracking-[0.22em] text-bone-dim">
            booked
          </span>
        </div>
        <div className="mt-1 text-[12px] text-bone-dim">
          {pace.booked} confirmed · {pace.held} on hold · {pace.open} open
        </div>

        {/* Stacked bar */}
        <div className="mt-6 flex h-2 w-full overflow-hidden rounded-full bg-bone/10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${bookedPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.2, 0.9, 0.1, 1] }}
            className="bg-ember"
          />
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${heldPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.2, 0.9, 0.1, 1] }}
            className="bg-gold"
          />
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${openPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.2, 0.9, 0.1, 1] }}
            className="bg-bone/30"
          />
        </div>
        <div className="mt-3 flex items-center gap-4 text-[9px] uppercase tracking-[0.22em] text-bone-dim">
          <span className="flex items-center gap-1.5">
            <span className="block h-1.5 w-1.5 rounded-full bg-ember" />
            Booked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="block h-1.5 w-1.5 rounded-full bg-gold" />
            On hold
          </span>
          <span className="flex items-center gap-1.5">
            <span className="block h-1.5 w-1.5 rounded-full bg-bone/30" />
            Open
          </span>
        </div>

        <div className="mt-6 border-t border-bone/10 pt-4 text-[12px] leading-relaxed text-bone-dim">
          Your selected window: {range.end - range.start} days. Move quickly — peak season
          (Apr–Jun, Sep–Nov) closes 8 weeks ahead.
        </div>
      </div>

      {/* Upcoming ticker */}
      <div className="bg-ink-2 p-7 md:p-8">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
          <span className="text-bone">Upcoming · confirmed</span>
          <span className="h-px flex-1 bg-bone/10" />
          <span>Next 60 days</span>
        </div>

        <div className="mt-5 space-y-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/5">
          {UPCOMING_EVENTS.map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group flex items-center justify-between gap-4 bg-ink-2 px-5 py-3.5 transition-colors hover:bg-ink"
            >
              <div className="flex items-center gap-5">
                <span className="font-display text-lg text-gold">{e.date}</span>
                <span className="text-[14px] text-bone">{e.name}</span>
              </div>
              <span className="rounded-full border border-bone/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                {e.venue}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Spec({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-ink-2 p-5">
      <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">{label}</div>
      <div className={`mt-1 font-display text-2xl md:text-3xl ${accent ? "text-gold" : "text-bone"}`}>
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
