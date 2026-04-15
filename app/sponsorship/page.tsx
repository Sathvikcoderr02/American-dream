import type { Metadata } from "next";
import { SponsorshipModule } from "./SponsorshipModule";

export const metadata: Metadata = {
  title: "Sponsorship — American Dream",
  description:
    "Partnership tiers, audience data, and activation examples. The full commercial sponsorship surface for FY26.",
};

export default function SponsorshipPage() {
  return <SponsorshipModule />;
}
