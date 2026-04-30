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
};

const HubContext = createContext<HubContextValue | null>(null);

export function HubProvider({ children }: { children: ReactNode }) {
  const [activePortal, setActivePortal] = useState<PortalId | null>(null);
  const [pendingPlaceholder, setPendingPlaceholder] = useState<PortalId | null>(null);

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

  const value = useMemo<HubContextValue>(
    () => ({ activePortal, openPortal, closePortal, pendingPlaceholder, showPlaceholder, dismissPlaceholder }),
    [activePortal, openPortal, closePortal, pendingPlaceholder, showPlaceholder, dismissPlaceholder],
  );

  return <HubContext.Provider value={value}>{children}</HubContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(HubContext);
  if (!ctx) throw new Error("usePortal must be used within HubProvider");
  return ctx;
}
