"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { PortalId } from "@/lib/portals";

type HubContextValue = {
  activePortal: PortalId | null;
  openPortal: (id: PortalId) => void;
  closePortal: () => void;
  pendingPlaceholder: PortalId | null;
  showPlaceholder: (id: PortalId) => void;
  dismissPlaceholder: () => void;
  tourActive: boolean;
  tourStep: number;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
};

const HubContext = createContext<HubContextValue | null>(null);

const TOUR_PORTAL_SEQUENCE: PortalId[] = ["property", "attractions", "sponsor", "tenant", "events"];

export function HubProvider({ children }: { children: ReactNode }) {
  const [activePortal, setActivePortal] = useState<PortalId | null>(null);
  const [pendingPlaceholder, setPendingPlaceholder] = useState<PortalId | null>(null);
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const openPortal = useCallback((id: PortalId) => {
    setPendingPlaceholder(null);
    setActivePortal(id);
  }, []);

  const closePortal = useCallback(() => {
    setActivePortal(null);
  }, []);

  const showPlaceholder = useCallback((id: PortalId) => {
    setPendingPlaceholder(id);
  }, []);

  const dismissPlaceholder = useCallback(() => {
    setPendingPlaceholder(null);
  }, []);

  const startTour = useCallback(() => {
    setTourActive(true);
    setTourStep(0);
    setActivePortal(TOUR_PORTAL_SEQUENCE[0]);
  }, []);

  const nextTourStep = useCallback(() => {
    setTourStep((s) => {
      const next = s + 1;
      if (next >= TOUR_PORTAL_SEQUENCE.length) {
        setTourActive(false);
        setActivePortal(null);
        return 0;
      }
      setActivePortal(TOUR_PORTAL_SEQUENCE[next]);
      return next;
    });
  }, []);

  const prevTourStep = useCallback(() => {
    setTourStep((s) => {
      const prev = Math.max(0, s - 1);
      setActivePortal(TOUR_PORTAL_SEQUENCE[prev]);
      return prev;
    });
  }, []);

  const endTour = useCallback(() => {
    setTourActive(false);
    setTourStep(0);
    setActivePortal(null);
  }, []);

  const value = useMemo<HubContextValue>(
    () => ({
      activePortal,
      openPortal,
      closePortal,
      pendingPlaceholder,
      showPlaceholder,
      dismissPlaceholder,
      tourActive,
      tourStep,
      startTour,
      nextTourStep,
      prevTourStep,
      endTour,
    }),
    [
      activePortal,
      openPortal,
      closePortal,
      pendingPlaceholder,
      showPlaceholder,
      dismissPlaceholder,
      tourActive,
      tourStep,
      startTour,
      nextTourStep,
      prevTourStep,
      endTour,
    ],
  );

  return <HubContext.Provider value={value}>{children}</HubContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(HubContext);
  if (!ctx) throw new Error("usePortal must be used within HubProvider");
  return ctx;
}
