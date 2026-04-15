import { Hero } from "./sections/Hero";
import { WhyThisProperty } from "./sections/WhyThisProperty";
import { Retail } from "./sections/Retail";
import { Luxury } from "./sections/Luxury";
import { Dining } from "./sections/Dining";
import { Attractions } from "./sections/Attractions";
import { Events } from "./sections/Events";
import { CTA } from "./sections/CTA";

export default function HomePage() {
  return (
    <main className="relative">
      <Hero />
      <WhyThisProperty />
      <Retail />
      <Luxury />
      <Dining />
      <Attractions />
      <Events />
      <CTA />
    </main>
  );
}
