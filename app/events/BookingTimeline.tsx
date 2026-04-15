"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type Range = { start: number; end: number };

const TOTAL_DAYS = 365;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// simulate busy windows
const BOOKED: Array<[number, number]> = [
  [20, 28],
  [62, 68],
  [102, 109],
  [158, 162],
  [210, 218],
  [260, 266],
  [300, 308],
  [345, 352],
];

function dayToLabel(day: number): string {
  const d = new Date(2026, 0, 1);
  d.setDate(d.getDate() + day);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function BookingTimeline({
  range,
  onChange,
}: {
  range: Range;
  onChange: (r: Range) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"start" | "end" | "move" | null>(null);

  const startPct = (range.start / TOTAL_DAYS) * 100;
  const endPct = (range.end / TOTAL_DAYS) * 100;

  const startDay = useMemo(() => dayToLabel(range.start), [range.start]);
  const endDay = useMemo(() => dayToLabel(range.end), [range.end]);

  function pxToDay(clientX: number): number {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const rel = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(rel * TOTAL_DAYS);
  }

  function startDrag(which: "start" | "end" | "move") {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(which);
      const startX = e.clientX;
      const startRange = { ...range };

      const move = (ev: PointerEvent) => {
        const day = pxToDay(ev.clientX);
        if (which === "start") {
          onChange({
            start: Math.min(day, range.end - 1),
            end: range.end,
          });
        } else if (which === "end") {
          onChange({
            start: range.start,
            end: Math.max(day, range.start + 1),
          });
        } else {
          const delta = pxToDay(ev.clientX) - pxToDay(startX);
          const len = startRange.end - startRange.start;
          const s = Math.max(0, Math.min(TOTAL_DAYS - len, startRange.start + delta));
          onChange({ start: s, end: s + len });
        }
      };
      const up = () => {
        setDragging(null);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };
  }

  return (
    <div className="relative rounded-[28px] border border-bone/10 bg-ink-2 p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
            Selected window · 2026
          </div>
          <div className="mt-2 font-display text-3xl text-bone md:text-4xl">
            {startDay} <span className="text-bone-dim">→</span> {endDay}
          </div>
        </div>
        <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.22em] text-bone-dim">
          <span className="flex items-center gap-2">
            <span className="block h-2 w-2 rounded-full bg-gold" /> Your hold
          </span>
          <span className="flex items-center gap-2">
            <span className="block h-2 w-2 rounded-full bg-ember/80" /> Booked
          </span>
          <span className="flex items-center gap-2">
            <span className="block h-2 w-2 rounded-full bg-bone/20" /> Open
          </span>
        </div>
      </div>

      <div
        ref={trackRef}
        className="relative h-28 touch-none select-none"
        data-cursor="drag"
        data-cursor-label="Drag"
      >
        {/* base track */}
        <div className="absolute inset-x-0 top-9 h-10 overflow-hidden rounded-full border border-bone/10 bg-ink">
          {/* month markers — every month gets a tick, but labels show
              only every other on narrow viewports so they never collide. */}
          {MONTHS.map((m, i) => (
            <div
              key={m}
              className="absolute top-0 flex h-full items-center border-l border-bone/10 text-[9px] uppercase tracking-[0.22em] text-bone-dim"
              style={{ left: `${(i / 12) * 100}%` }}
            >
              <span className={`pl-1.5 ${i % 2 === 1 ? "hidden md:inline" : ""}`}>
                {m}
              </span>
            </div>
          ))}
          {/* booked blocks */}
          {BOOKED.map(([a, b], i) => {
            const left = (a / TOTAL_DAYS) * 100;
            const width = ((b - a) / TOTAL_DAYS) * 100;
            return (
              <div
                key={i}
                className="absolute top-0 h-full bg-ember/40"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  backgroundImage:
                    "repeating-linear-gradient(-45deg, rgba(255,74,43,0.5) 0, rgba(255,74,43,0.5) 4px, transparent 4px, transparent 8px)",
                }}
              />
            );
          })}
          {/* selection */}
          <motion.div
            className="absolute top-0 h-full cursor-grab bg-gold/30"
            style={{
              left: `${startPct}%`,
              width: `${endPct - startPct}%`,
              boxShadow: "inset 0 0 0 1px rgba(212,178,120,0.7)",
            }}
            onPointerDown={startDrag("move")}
          />
        </div>

        {/* Handles */}
        <Handle
          pct={startPct}
          label={startDay}
          isDragging={dragging === "start"}
          onPointerDown={startDrag("start")}
        />
        <Handle
          pct={endPct}
          label={endDay}
          isDragging={dragging === "end"}
          onPointerDown={startDrag("end")}
        />
      </div>

      <div className="mt-4 text-[11px] uppercase tracking-[0.22em] text-bone-dim">
        Drag the gold handles or the window to shift. Red stripes are already booked.
      </div>
    </div>
  );
}

function Handle({
  pct,
  label,
  isDragging,
  onPointerDown,
}: {
  pct: number;
  label: string;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  return (
    <div
      onPointerDown={onPointerDown}
      className="absolute top-0 -translate-x-1/2 cursor-ew-resize"
      style={{ left: `${pct}%` }}
      data-cursor="drag"
      data-cursor-label="Drag"
    >
      <div
        className={`mb-2 rounded-full border bg-ink px-3 py-1 text-[10px] uppercase tracking-[0.22em] transition-colors ${
          isDragging ? "border-gold text-gold" : "border-bone/30 text-bone"
        }`}
      >
        {label}
      </div>
      <div className="mx-auto h-14 w-3 rounded-full bg-gold" />
    </div>
  );
}
