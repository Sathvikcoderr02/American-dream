"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Plausible visitor count baseline — same shape as LiveHubSignals so they stay coherent.
function seedVisitorCount(): number {
  const d = new Date();
  const dayOfYear = Math.floor(
    (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const hour = d.getHours();
  const hourCurve = Math.max(0.05, Math.sin(((hour - 6) / 18) * Math.PI));
  const dailyTarget = 110_000 + (dayOfYear % 17) * 1300;
  return Math.floor(dailyTarget * hourCurve * 0.7) + 18_000;
}

export function HubGreeting() {
  const [text, setText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [errored, setErrored] = useState(false);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const run = async () => {
      // Get outdoor temp first
      let outdoorTempF: number | null = null;
      try {
        const w = await fetch("/api/weather").then((r) => r.json());
        if (typeof w.outdoorTempF === "number") outdoorTempF = w.outdoorTempF;
      } catch {
        // continue without weather
      }

      const hour = new Date().getHours();
      const visitorCount = seedVisitorCount();

      // Hold for cinematic pacing — let the intro breathe
      await new Promise((r) => setTimeout(r, 1100));

      setStreaming(true);

      try {
        const res = await fetch("/api/guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "greeting",
            outdoorTempF,
            hour,
            visitorCount,
          }),
        });
        if (!res.ok || !res.body) {
          setErrored(true);
          setStreaming(false);
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          setText(buffer);
        }
        setStreaming(false);
      } catch {
        setErrored(true);
        setStreaming(false);
      }
    };

    run();
  }, []);

  if (errored) return null;

  return (
    <AnimatePresence>
      {(streaming || text) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex items-start gap-3"
        >
          <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-gold animate-pulse" />
          <p className="font-display text-lg leading-snug text-bone md:text-2xl">
            {text || (
              <span className="animate-pulse text-bone-dim">Reading the building…</span>
            )}
            {streaming && text && (
              <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-gold align-middle" />
            )}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
