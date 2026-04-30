"use client";

import { AnimatePresence } from "framer-motion";
import { HubProvider, usePortal } from "./hub/HubProvider";
import { HubScene } from "./hub/HubScene";
import { PropertyModule } from "./modules/PropertyModule";

function HubShell() {
  const { activePortal } = usePortal();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        {activePortal === null && <HubScene key="hub" />}
        {activePortal === "property" && <PropertyModule key="property" />}
      </AnimatePresence>
    </main>
  );
}

export default function Page() {
  return (
    <HubProvider>
      <HubShell />
    </HubProvider>
  );
}
