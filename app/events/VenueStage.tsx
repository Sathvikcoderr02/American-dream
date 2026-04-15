"use client";

import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import type { VENUES } from "@/lib/data";

type Venue = (typeof VENUES)[number];

/**
 * A parallax-tilting venue preview card. The viewer tilts a stylized
 * top-down "floor plan" as they move their cursor — stands in for what
 * would be a real 3D flythrough in production.
 */
export function VenueStage({ venue }: { venue: Venue }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 200, damping: 30 });
  const smy = useSpring(my, { stiffness: 200, damping: 30 });
  const rotX = useTransform(smy, [-1, 1], [8, -8]);
  const rotY = useTransform(smx, [-1, 1], [-12, 12]);

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-bone/10 bg-ink-2"
      style={{ perspective: "1200px" }}
      data-cursor="drag"
      data-cursor-label="Tilt"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={venue.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {"image" in venue && venue.image && (
            <Image
              src={venue.image}
              alt={venue.name}
              fill
              className="absolute inset-0 object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          )}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradientFor(
              venue.id
            )}`}
          />
          <div className="absolute inset-0 bg-ink/35" />
          <div className="bg-grain absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(255,255,255,0.12),transparent)]" />
        </motion.div>
      </AnimatePresence>

      {/* Tilting floor plan */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      >
        <FloorPlan id={venue.id} />
      </motion.div>

      {/* Foreground label */}
      <div className="absolute inset-x-0 bottom-0 p-7">
        <div className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
          Venue preview · tilt with cursor
        </div>
        <div className="mt-2 font-display text-3xl text-bone md:text-4xl">
          {venue.name}
        </div>
      </div>
    </div>
  );
}

function gradientFor(id: string) {
  switch (id) {
    case "court":
      return "from-ember/30 via-gold/10 to-ink";
    case "pac":
      return "from-plum/30 via-gold/10 to-ink";
    case "expo":
      return "from-aqua/25 via-bone/5 to-ink";
    case "rooftop":
      return "from-gold/25 via-aqua/10 to-ink";
    default:
      return "from-bone/10 to-ink";
  }
}

function FloorPlan({ id }: { id: string }) {
  // Stylized top-down plans per venue
  switch (id) {
    case "court":
      return (
        <svg viewBox="0 0 400 300" className="h-[85%] w-[85%]">
          <defs>
            <linearGradient id="court-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,74,43,0.25)" />
              <stop offset="100%" stopColor="rgba(212,178,120,0.25)" />
            </linearGradient>
          </defs>
          <rect
            x="30"
            y="30"
            width="340"
            height="240"
            rx="16"
            fill="url(#court-bg)"
            stroke="rgba(246,242,234,0.5)"
            strokeWidth="1.2"
          />
          <rect
            x="120"
            y="40"
            width="160"
            height="50"
            fill="none"
            stroke="rgba(246,242,234,0.7)"
            strokeWidth="1"
          />
          <text
            x="200"
            y="70"
            textAnchor="middle"
            fontSize="10"
            fill="rgba(246,242,234,0.8)"
            letterSpacing="2"
          >
            STAGE
          </text>
          {Array.from({ length: 24 }).map((_, i) => (
            <circle
              key={i}
              cx={60 + (i % 8) * 40}
              cy={120 + Math.floor(i / 8) * 30}
              r="8"
              fill="none"
              stroke="rgba(246,242,234,0.4)"
              strokeWidth="0.8"
            />
          ))}
          <text
            x="200"
            y="260"
            textAnchor="middle"
            fontSize="8"
            fill="rgba(246,242,234,0.6)"
            letterSpacing="3"
          >
            FOH · SOUND · RIGGING
          </text>
        </svg>
      );
    case "pac":
      return (
        <svg viewBox="0 0 400 300" className="h-[85%] w-[85%]">
          <path
            d="M 30 270 L 30 100 Q 30 40 100 40 L 300 40 Q 370 40 370 100 L 370 270 Z"
            fill="rgba(169,122,212,0.18)"
            stroke="rgba(246,242,234,0.5)"
            strokeWidth="1.2"
          />
          <rect
            x="140"
            y="55"
            width="120"
            height="40"
            fill="none"
            stroke="rgba(246,242,234,0.7)"
          />
          <text
            x="200"
            y="80"
            textAnchor="middle"
            fontSize="10"
            fill="rgba(246,242,234,0.8)"
            letterSpacing="2"
          >
            PROSCENIUM
          </text>
          {Array.from({ length: 9 }).map((_, i) => (
            <path
              key={i}
              d={`M ${80 + i * 5} ${120 + i * 15} Q 200 ${135 + i * 15} ${320 - i * 5} ${120 + i * 15}`}
              fill="none"
              stroke="rgba(246,242,234,0.35)"
              strokeWidth="0.8"
            />
          ))}
        </svg>
      );
    case "expo":
      return (
        <svg viewBox="0 0 400 300" className="h-[85%] w-[85%]">
          <rect
            x="20"
            y="30"
            width="360"
            height="240"
            fill="rgba(74,217,228,0.12)"
            stroke="rgba(246,242,234,0.5)"
            strokeWidth="1.2"
          />
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => (
              <rect
                key={`${row}-${col}`}
                x={35 + col * 34}
                y={50 + row * 42}
                width="28"
                height="30"
                fill="none"
                stroke="rgba(246,242,234,0.4)"
                strokeWidth="0.6"
              />
            ))
          )}
          <text
            x="200"
            y="15"
            textAnchor="middle"
            fontSize="8"
            fill="rgba(246,242,234,0.6)"
            letterSpacing="3"
          >
            COLUMN-FREE EXPOSITION HALL
          </text>
        </svg>
      );
    case "rooftop":
      return (
        <svg viewBox="0 0 400 300" className="h-[85%] w-[85%]">
          <rect
            x="30"
            y="30"
            width="340"
            height="240"
            rx="8"
            fill="rgba(212,178,120,0.15)"
            stroke="rgba(246,242,234,0.5)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <circle
            cx="200"
            cy="150"
            r="80"
            fill="none"
            stroke="rgba(246,242,234,0.55)"
            strokeWidth="1"
          />
          <circle
            cx="200"
            cy="150"
            r="40"
            fill="none"
            stroke="rgba(246,242,234,0.4)"
            strokeWidth="0.8"
          />
          <rect
            x="150"
            y="50"
            width="100"
            height="20"
            fill="none"
            stroke="rgba(246,242,234,0.6)"
          />
          <text
            x="200"
            y="64"
            textAnchor="middle"
            fontSize="8"
            fill="rgba(246,242,234,0.75)"
            letterSpacing="2"
          >
            LED BACKDROP
          </text>
          <text
            x="200"
            y="280"
            textAnchor="middle"
            fontSize="8"
            fill="rgba(246,242,234,0.5)"
            letterSpacing="3"
          >
            MANHATTAN SIGHTLINE
          </text>
        </svg>
      );
  }
  return null;
}
