"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ACCENT_TOKEN, type Portal } from "@/lib/portals";
import { usePortal } from "./HubProvider";

type Props = {
  portal: Portal;
  className?: string;
  delay?: number;
};

export function PortalCard({ portal, className = "", delay = 0 }: Props) {
  const { openPortal, showPlaceholder } = usePortal();
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);

  // Cursor-driven 3D tilt — applied to inner content only, not the layoutId element
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const rotateY = useTransform(sx, [-1, 1], [-6, 6]);
  const rotateX = useTransform(sy, [-1, 1], [4, -4]);
  const shineX = useTransform(sx, [-1, 1], ["20%", "80%"]);
  const shineY = useTransform(sy, [-1, 1], ["20%", "80%"]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered) {
      v.preload = "auto";
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [hovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = ((e.clientY - r.top) / r.height) * 2 - 1;
    mx.set(x);
    my.set(y);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mx.set(0);
    my.set(0);
  };

  const accentVar = ACCENT_TOKEN[portal.accent];

  const handleClick = () => {
    if (portal.ready) openPortal(portal.id);
    else showPlaceholder(portal.id);
  };

  return (
    <motion.button
      ref={cardRef}
      layoutId={`portal-${portal.id}`}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      data-cursor="cta"
      data-cursor-label={portal.ready ? "Enter" : "Soon"}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative isolate flex w-full overflow-hidden rounded-[28px] border border-bone/10 bg-ink-2 text-left transition-colors hover:border-bone/30 ${className}`}
      style={{
        ["--accent" as string]: accentVar,
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Cursor-following light shine */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(40% 50% at ${shineX} ${shineY}, rgba(255,255,255,0.12), transparent 70%)`,
        }}
      />
      {/* Video / poster */}
      <div className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          src={portal.video}
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover opacity-50 transition-opacity duration-700 group-hover:opacity-80"
        />
        {/* Inky scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        {/* Accent wash */}
        <div
          className="absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-60"
          style={{
            background: `radial-gradient(60% 80% at 30% 100%, ${accentVar}55 0%, transparent 70%)`,
          }}
        />
        {/* Grain */}
        <div className="bg-grain absolute inset-0 opacity-40" />
      </div>

      {/* Outer glow on hover */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px -z-20 rounded-[28px] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: `radial-gradient(circle at 50% 50%, ${accentVar}, transparent 70%)` }}
      />

      {/* Content */}
      <div className="relative flex w-full flex-col justify-between gap-8 p-6 md:p-8">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
            <span className="text-bone">{portal.index}</span>
            <span className="h-px w-6 bg-bone/20" />
            <span>{portal.eyebrow}</span>
          </div>
          {!portal.ready && (
            <span className="rounded-full border border-bone/15 bg-ink/40 px-2.5 py-1 text-[9px] uppercase tracking-[0.22em] text-bone-dim backdrop-blur">
              Coming next
            </span>
          )}
          {portal.ready && (
            <span
              className="flex items-center gap-1.5 rounded-full border bg-ink/40 px-2.5 py-1 text-[9px] uppercase tracking-[0.22em] backdrop-blur"
              style={{ borderColor: `${accentVar}55`, color: accentVar }}
            >
              <span
                className="block h-1.5 w-1.5 rounded-full"
                style={{ background: accentVar, boxShadow: `0 0 12px ${accentVar}` }}
              />
              Live
            </span>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-display text-3xl leading-[0.95] text-bone md:text-5xl">
              {portal.label}
            </h3>
            <p className="mt-3 max-w-md text-[13px] leading-relaxed text-bone-dim md:text-[14px]">
              {portal.body}
            </p>
          </div>

          <div className="flex items-end justify-between gap-4 pt-3">
            <div>
              <div
                className="font-display text-3xl leading-none md:text-4xl"
                style={{ color: accentVar }}
              >
                {portal.stat}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                {portal.statLabel}
              </div>
            </div>

            <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-bone transition-transform duration-500 group-hover:translate-x-1">
              {portal.ready ? "Enter" : "Preview"}
              <svg width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden>
                <path d="M0 5h20M16 1l4 4-4 4" stroke="currentColor" strokeWidth="1" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
