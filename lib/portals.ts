export type PortalId = "property" | "attractions" | "sponsor" | "tenant" | "events";

export type Portal = {
  id: PortalId;
  index: string;
  label: string;
  eyebrow: string;
  stat: string;
  statLabel: string;
  body: string;
  video: string;
  poster?: string;
  accent: "gold" | "aqua" | "ember" | "plum" | "bone";
  size: "wide" | "tall" | "square";
  ready: boolean;
};

export const PORTALS: Portal[] = [
  {
    id: "property",
    index: "01",
    label: "The Property",
    eyebrow: "Location & Scale",
    stat: "3M",
    statLabel: "sq ft of destination",
    body: "Ten minutes from Manhattan. The largest entertainment-first destination in the Americas.",
    video: "/videos/project.mp4",
    accent: "gold",
    size: "wide",
    ready: true,
  },
  {
    id: "attractions",
    index: "02",
    label: "Attractions",
    eyebrow: "7 Worlds",
    stat: "40M",
    statLabel: "annual visitors",
    body: "Real snow indoors. The Western Hemisphere's largest indoor wave pool. A skyline observation wheel.",
    video: "/videos/nickelodeon.mp4",
    accent: "aqua",
    size: "tall",
    ready: true,
  },
  {
    id: "sponsor",
    index: "03",
    label: "Sponsor",
    eyebrow: "Brand Partnerships",
    stat: "$2.5M+",
    statLabel: "destination partnerships",
    body: "Category-exclusive integrations. 1.2B annualized impressions. A live media surface.",
    video: "/videos/dreamworks.mp4",
    accent: "ember",
    size: "square",
    ready: true,
  },
  {
    id: "tenant",
    index: "04",
    label: "Tenant",
    eyebrow: "Retail · Avenue · Dining",
    stat: "450+",
    statLabel: "brands open & signed",
    body: "Flagships. Luxury invitations. Pop-up platforms. Culinary theater. Choose your adjacency.",
    video: "/videos/hero-reel.mp4",
    accent: "bone",
    size: "square",
    ready: false,
  },
  {
    id: "events",
    index: "05",
    label: "Events",
    eyebrow: "4 Venues · 1 Platform",
    stat: "65K",
    statLabel: "single-event capacity",
    body: "Arena. Broadway-grade theater. Column-free expo hall. Open-air rooftop with Manhattan sightlines.",
    video: "/videos/big-snow.mp4",
    accent: "plum",
    size: "wide",
    ready: false,
  },
];

export const ACCENT_TOKEN: Record<Portal["accent"], string> = {
  gold: "var(--color-gold)",
  aqua: "var(--color-aqua)",
  ember: "var(--color-ember)",
  plum: "var(--color-plum)",
  bone: "var(--color-bone)",
};
