"use client";

import { AnimatePresence } from "framer-motion";
import { HubProvider, usePortal } from "./hub/HubProvider";
import { HubScene } from "./hub/HubScene";
import { GuidedTour } from "./hub/GuidedTour";
import { PropertyModule } from "./modules/PropertyModule";
import { AttractionsModule } from "./modules/AttractionsModule";
import { SponsorModule } from "./modules/SponsorModule";
import { TenantModule } from "./modules/TenantModule";
import { EventsModule } from "./modules/EventsModule";
import { GlobalHeader } from "@/components/GlobalHeader";

function HubShell() {
  const { activePortal } = usePortal();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <GlobalHeader />
      <AnimatePresence mode="popLayout" initial={false}>
        {activePortal === null && <HubScene key="hub" />}
        {activePortal === "property" && <PropertyModule key="property" />}
        {activePortal === "attractions" && <AttractionsModule key="attractions" />}
        {activePortal === "sponsor" && <SponsorModule key="sponsor" />}
        {activePortal === "tenant" && <TenantModule key="tenant" />}
        {activePortal === "events" && <EventsModule key="events" />}
      </AnimatePresence>
      <GuidedTour />
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
