import type { Metadata } from "next";
import { EventsModule } from "./EventsModule";

export const metadata: Metadata = {
  title: "Events Module — American Dream",
  description:
    "Tour venues, check availability, and submit a hold request. A real booking surface for the commercial team.",
};

export default function EventsPage() {
  return <EventsModule />;
}
