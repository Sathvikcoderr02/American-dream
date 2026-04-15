import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { Navigator } from "@/components/Navigator";

const displayFont = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "American Dream — The Destination Platform",
  description:
    "An interactive commercial experience for the world's most ambitious retail, entertainment, and events destination. Lease, sponsor, and book the future of mixed-use.",
  openGraph: {
    title: "American Dream — The Destination Platform",
    description:
      "Retail. Entertainment. Events. 3 million square feet of commercial opportunity.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable} has-custom-cursor`}
    >
      <body className="relative min-h-screen bg-ink text-bone">
        <SmoothScroll>
          <Cursor />
          <Navigator />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
