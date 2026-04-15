"use client";

import { useRef } from "react";

const MIN = 75_000;
const MAX = 5_000_000;

const TICKS = [
  { value: 75_000, label: "$75K" },
  { value: 500_000, label: "$500K" },
  { value: 1_000_000, label: "$1M" },
  { value: 2_000_000, label: "$2M" },
  { value: 5_000_000, label: "$5M" },
];

/** Logarithmic spend slider — small dollar moves at the bottom feel as
 *  meaningful as big ones at the top, which matches the partnership market. */
export function SpendSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function setFromClientX(clientX: number) {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    const logMin = Math.log(MIN);
    const logMax = Math.log(MAX);
    const v = Math.exp(logMin + pct * (logMax - logMin));
    // Snap to $25K
    onChange(Math.round(v / 25_000) * 25_000);
  }

  function startDrag(e: React.PointerEvent) {
    e.preventDefault();
    setFromClientX(e.clientX);
    const move = (ev: PointerEvent) => setFromClientX(ev.clientX);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  const logMin = Math.log(MIN);
  const logMax = Math.log(MAX);
  const pct = ((Math.log(value) - logMin) / (logMax - logMin)) * 100;

  return (
    <div
      ref={trackRef}
      onPointerDown={startDrag}
      className="relative h-16 touch-none select-none"
      data-cursor="drag"
      data-cursor-label="Drag"
    >
      <div className="absolute inset-x-0 top-7 h-2 overflow-hidden rounded-full border border-bone/10 bg-ink">
        <div
          className="h-full bg-gradient-to-r from-ember via-gold to-aqua"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Ticks */}
      {TICKS.map((t) => {
        const tickPct = ((Math.log(t.value) - logMin) / (logMax - logMin)) * 100;
        return (
          <div
            key={t.value}
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${tickPct}%` }}
          >
            <div className="mx-auto h-3 w-px bg-bone/20" />
            <div className="mt-1 text-[9px] uppercase tracking-[0.18em] text-bone-dim">
              {t.label}
            </div>
          </div>
        );
      })}

      {/* Handle */}
      <div
        className="absolute top-5 -translate-x-1/2 cursor-ew-resize"
        style={{ left: `${pct}%` }}
      >
        <div className="h-6 w-3 rounded-full bg-gold shadow-[0_0_0_4px_rgba(212,178,120,0.18)]" />
      </div>
    </div>
  );
}
