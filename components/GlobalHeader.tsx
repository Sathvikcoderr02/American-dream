"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePortal } from "@/app/hub/HubProvider";
import { PORTALS } from "@/lib/portals";

const PORTAL_LABEL: Record<string, string> = {
  property: "The Property",
  attractions: "Attractions",
  sponsor: "Sponsor",
  tenant: "Tenant",
  events: "Events",
};

const CONTACT_EMAIL = "sathvik1702@gmail.com";
const CONTACT_SUBJECT = "American Dream — Inquiry from deck";

export function GlobalHeader() {
  const { activePortal, closePortal, tourActive, tourStep } = usePortal();
  const [shared, setShared] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close contact dropdown on Escape or click outside
  useEffect(() => {
    if (!contactOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContactOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [contactOpen]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    CONTACT_EMAIL,
  )}&su=${encodeURIComponent(CONTACT_SUBJECT)}`;
  const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(
    CONTACT_EMAIL,
  )}&subject=${encodeURIComponent(CONTACT_SUBJECT)}`;
  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    CONTACT_SUBJECT,
  )}`;

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const data = {
      title: "American Dream — The Destination Platform",
      text: "An interactive sales experience for tenants, sponsors, and event partners.",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(url);
      }
      setShared(true);
      setTimeout(() => setShared(false), 2200);
    } catch {
      // User cancelled or browser unsupported
    }
  };

  const insideModule = activePortal !== null;
  const portalLabel = activePortal ? PORTAL_LABEL[activePortal] : null;
  const portalAccent = activePortal
    ? PORTALS.find((p) => p.id === activePortal)?.accent
    : null;
  const accentVar = portalAccent ? `var(--color-${portalAccent})` : "var(--color-bone)";

  return (
    <>
      {/* Sticky top progress bar — only when in tour */}
      {tourActive && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[45] h-[2px] bg-bone/10">
          <motion.div
            className="h-full origin-left bg-gradient-to-r from-gold via-ember to-aqua"
            animate={{ scaleX: (tourStep + 1) / 5 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ scaleX: 0 }}
          />
        </div>
      )}

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled || insideModule
            ? "border-b border-bone/10 bg-ink/70 backdrop-blur-2xl"
            : "bg-gradient-to-b from-ink/60 to-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-5 py-3 md:px-10 md:py-4">
          {/* LEFT — Brand + (back if in module) */}
          <div className="flex items-center gap-4">
            <button
              onClick={insideModule ? closePortal : undefined}
              data-cursor={insideModule ? "cta" : undefined}
              data-cursor-label={insideModule ? "Hub" : undefined}
              className={`group flex items-center gap-3 ${
                insideModule ? "cursor-pointer" : "cursor-default"
              }`}
              disabled={!insideModule}
            >
              <div className="relative h-9 w-9 shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-ember" />
                <div className="absolute inset-[3px] rounded-full bg-ink" />
                <div className="absolute inset-0 flex items-center justify-center font-display text-base text-bone">
                  Æ
                </div>
              </div>
              <div className="hidden flex-col leading-none md:flex">
                <span className="font-display text-[15px] tracking-wide text-bone">
                  American Dream
                </span>
                <span className="text-[9px] uppercase tracking-[0.24em] text-bone-dim">
                  Destination Platform
                </span>
              </div>
            </button>

            {/* Breadcrumb when in module */}
            <AnimatePresence mode="wait">
              {insideModule && portalLabel && (
                <motion.div
                  key={activePortal}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.4 }}
                  className="hidden items-center gap-3 md:flex"
                >
                  <span className="text-bone-dim">/</span>
                  <button
                    onClick={closePortal}
                    data-cursor="cta"
                    data-cursor-label="Hub"
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-bone-dim transition-colors hover:text-bone"
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
                      <path d="M10 4H1M4 1L1 4l3 3" stroke="currentColor" strokeWidth="1" />
                    </svg>
                    Hub
                  </button>
                  <span className="text-bone-dim">/</span>
                  <span
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.24em]"
                    style={{ color: accentVar }}
                  >
                    <span
                      className="block h-1.5 w-1.5 rounded-full"
                      style={{ background: accentVar, boxShadow: `0 0 12px ${accentVar}` }}
                    />
                    {portalLabel}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CENTER — Status pill (only on desktop) */}
          <div className="hidden items-center gap-3 rounded-full border border-bone/10 bg-ink-2/60 px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-bone-dim backdrop-blur lg:flex">
            <span className="relative block h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-ember" />
              <span className="absolute inset-0 animate-ping rounded-full bg-ember/60" />
            </span>
            {insideModule ? "Live · interactive deck" : "FY26 inventory · open now"}
          </div>

          {/* RIGHT — Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              data-cursor="cta"
              data-cursor-label="Copy"
              className="group hidden items-center gap-2 rounded-full border border-bone/15 bg-ink-2/40 px-3.5 py-2 text-[10px] uppercase tracking-[0.22em] text-bone backdrop-blur transition-colors hover:border-bone/40 sm:flex"
            >
              <AnimatePresence mode="wait">
                {shared ? (
                  <motion.span
                    key="ok"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-gold"
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path
                        d="M2 5.5L4.5 8L9 3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Copied
                  </motion.span>
                ) : (
                  <motion.span
                    key="share"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5"
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path
                        d="M5.5 1.5V7M5.5 1.5L3 4M5.5 1.5L8 4M2 7.5V9.5H9V7.5"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Share
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <div className="relative hidden md:block">
              <button
                onClick={() => setContactOpen((o) => !o)}
                data-cursor="cta"
                data-cursor-label="Contact"
                className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-gold backdrop-blur transition-colors hover:border-gold hover:bg-gold/20"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
                  <rect x="1" y="2" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
                  <path d="M1.5 3l4 3l4-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                </svg>
                Talk to us
              </button>

              <AnimatePresence>
                {contactOpen && (
                  <>
                    {/* Click-outside backdrop */}
                    <button
                      onClick={() => setContactOpen(false)}
                      className="fixed inset-0 z-40 cursor-default"
                      aria-label="Close contact menu"
                      tabIndex={-1}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-[calc(100%+10px)] z-50 w-[320px] overflow-hidden rounded-2xl border border-bone/15 bg-ink-2/95 shadow-2xl shadow-ink backdrop-blur-2xl"
                    >
                      <div className="border-b border-bone/10 px-5 py-4">
                        <div className="text-[9px] uppercase tracking-[0.28em] text-bone-dim">
                          Get in touch
                        </div>
                        <div className="mt-2 font-display text-lg text-bone">
                          Pick how you&apos;d like to reach us.
                        </div>
                      </div>

                      <div className="space-y-px bg-bone/5">
                        {/* Copy email */}
                        <button
                          onClick={copyEmail}
                          data-cursor="cta"
                          data-cursor-label="Copy"
                          className="group flex w-full items-center justify-between gap-3 bg-ink-2 px-5 py-3.5 text-left transition-colors hover:bg-ink"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-bone/15 text-bone-dim group-hover:text-bone">
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                <rect x="1.5" y="3" width="6" height="6.5" rx="1" stroke="currentColor" strokeWidth="1" />
                                <rect x="3.5" y="1.5" width="6" height="6.5" rx="1" stroke="currentColor" strokeWidth="1" />
                              </svg>
                            </span>
                            <div>
                              <div className="text-[12px] uppercase tracking-[0.22em] text-bone">
                                {emailCopied ? "Copied!" : "Copy email"}
                              </div>
                              <div className="text-[11px] text-bone-dim">{CONTACT_EMAIL}</div>
                            </div>
                          </div>
                          {emailCopied ? (
                            <span className="text-gold">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M3 7.5l3 3l5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          ) : null}
                        </button>

                        {/* Gmail */}
                        <a
                          href={gmailUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setContactOpen(false)}
                          data-cursor="cta"
                          data-cursor-label="Gmail"
                          className="group flex w-full items-center justify-between gap-3 bg-ink-2 px-5 py-3.5 text-left transition-colors hover:bg-ink"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-bone/15 text-bone-dim group-hover:text-ember">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path d="M2 6.5l10 7l10-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                              </svg>
                            </span>
                            <div>
                              <div className="text-[12px] uppercase tracking-[0.22em] text-bone">
                                Open in Gmail
                              </div>
                              <div className="text-[11px] text-bone-dim">Compose in browser</div>
                            </div>
                          </div>
                          <span className="text-bone-dim transition-transform group-hover:translate-x-0.5 group-hover:text-bone">↗</span>
                        </a>

                        {/* Outlook */}
                        <a
                          href={outlookUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setContactOpen(false)}
                          data-cursor="cta"
                          data-cursor-label="Outlook"
                          className="group flex w-full items-center justify-between gap-3 bg-ink-2 px-5 py-3.5 text-left transition-colors hover:bg-ink"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-bone/15 text-bone-dim group-hover:text-aqua">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="6" width="11" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M14 9l5-2v10l-5-2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                <circle cx="8.5" cy="12" r="2" stroke="currentColor" strokeWidth="1.2" />
                              </svg>
                            </span>
                            <div>
                              <div className="text-[12px] uppercase tracking-[0.22em] text-bone">
                                Open in Outlook
                              </div>
                              <div className="text-[11px] text-bone-dim">Web compose</div>
                            </div>
                          </div>
                          <span className="text-bone-dim transition-transform group-hover:translate-x-0.5 group-hover:text-bone">↗</span>
                        </a>

                        {/* Default mail */}
                        <a
                          href={mailtoUrl}
                          onClick={() => setContactOpen(false)}
                          data-cursor="cta"
                          data-cursor-label="Mail"
                          className="group flex w-full items-center justify-between gap-3 bg-ink-2 px-5 py-3.5 text-left transition-colors hover:bg-ink"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-bone/15 text-bone-dim group-hover:text-gold">
                              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                <path d="M2 5l5 3.5L12 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                <rect x="1.5" y="3.5" width="11" height="8" rx="1" stroke="currentColor" strokeWidth="1" />
                              </svg>
                            </span>
                            <div>
                              <div className="text-[12px] uppercase tracking-[0.22em] text-bone">
                                Default mail app
                              </div>
                              <div className="text-[11px] text-bone-dim">
                                Apple Mail, Outlook desktop
                              </div>
                            </div>
                          </div>
                          <span className="text-bone-dim transition-transform group-hover:translate-x-0.5 group-hover:text-bone">↗</span>
                        </a>
                      </div>

                      <div className="border-t border-bone/10 px-5 py-3 text-[9px] uppercase tracking-[0.24em] text-bone-dim">
                        Reply usually within 24 hours
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger / share fallback */}
            <button
              onClick={handleShare}
              data-cursor="cta"
              data-cursor-label="Share"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/15 bg-ink-2/40 text-bone backdrop-blur sm:hidden"
              aria-label="Share"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M6.5 1.5V8M6.5 1.5L4 4M6.5 1.5L9 4M2 8v3h9V8"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.header>
    </>
  );
}
