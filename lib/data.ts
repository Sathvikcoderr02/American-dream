export type DistrictId =
  | "overview"
  | "why"
  | "retail"
  | "luxury"
  | "dining"
  | "attractions"
  | "events"
  | "cta";

export type District = {
  id: DistrictId;
  index: string;
  label: string;
  eyebrow: string;
  angle: number;
  accent: string;
};

export const DISTRICTS: District[] = [
  { id: "overview", index: "00", label: "Overture", eyebrow: "Prologue", angle: 0, accent: "var(--color-bone)" },
  { id: "why", index: "01", label: "The Property", eyebrow: "Location & Scale", angle: 45, accent: "var(--color-gold)" },
  { id: "retail", index: "02", label: "Retail", eyebrow: "450+ Brands", angle: 90, accent: "var(--color-bone)" },
  { id: "luxury", index: "03", label: "The Avenue", eyebrow: "Luxury Flagships", angle: 135, accent: "var(--color-gold)" },
  { id: "dining", index: "04", label: "Dining", eyebrow: "Culinary Theater", angle: 180, accent: "var(--color-ember)" },
  { id: "attractions", index: "05", label: "Attractions", eyebrow: "7 Worlds Under One Roof", angle: 225, accent: "var(--color-aqua)" },
  { id: "events", index: "06", label: "Events", eyebrow: "A Global Platform", accent: "var(--color-plum)", angle: 270 },
  { id: "cta", index: "07", label: "Get In", eyebrow: "Partner With Us", angle: 315, accent: "var(--color-ember)" },
];

export const HERO_STATS = [
  { value: "3M", unit: "sq ft", label: "of destination" },
  { value: "40M", unit: "/ yr", label: "projected visitors" },
  { value: "450+", unit: "brands", label: "open & signed" },
  { value: "$9B", unit: "combined", label: "MSA income within 30 min" },
];

export const TICKER_ITEMS = [
  "Now leasing — The Avenue luxury wing",
  "Nickelodeon Universe · 35+ rides",
  "DreamWorks Water Park · 1.5 acres of waves",
  "Big SNOW · real snow, year round",
  "Sea Life Aquarium · 3,000 animals",
  "The Collective · flagship concept lab",
  "Toys R Us flagship · reopened",
  "Sponsorship inquiries open for FY26",
  "Cinemex Luxury · 16 screens",
  "Live events — 45 activations in 2025",
];

export const PROPERTY_FACTS = [
  {
    heading: "10 minutes from Midtown Manhattan",
    body: "At the convergence of I-95, Route 3, and the NJ Turnpike — a direct dispatch line from 22 million people in the NYC metro.",
  },
  {
    heading: "The largest entertainment-first destination in the Americas",
    body: "Seven attractions including North America's only indoor real-snow ski slope and the Western Hemisphere's largest indoor theme park.",
  },
  {
    heading: "A commercial platform, not a shopping center",
    body: "Retail, luxury, dining, entertainment, and events — all operated as one integrated media and activation surface.",
  },
];

export const DEMOGRAPHICS = [
  { kpi: "22M", label: "people within 30 miles" },
  { kpi: "$113K", label: "avg. HHI in trade area" },
  { kpi: "40M", label: "annual visitors (projected)" },
  { kpi: "72%", label: "visitors stay 4+ hours" },
  { kpi: "38", label: "median visitor age" },
  { kpi: "54%", label: "travel from 50+ miles" },
];

export const RETAIL_CATEGORIES = [
  {
    tier: "Flagship Concept",
    tagline: "Brand theaters, not storefronts.",
    tenants: ["Toys R Us", "LEGO", "Hermès", "Zara", "H&M", "Primark"],
  },
  {
    tier: "Luxury",
    tagline: "The Avenue — curated, invitation-only adjacencies.",
    tenants: ["Hermès", "Saint Laurent", "Dolce & Gabbana", "Carolina Herrera", "Mulberry", "Tory Burch"],
  },
  {
    tier: "Contemporary",
    tagline: "Category-defining mid-tier anchors.",
    tenants: ["Zara", "Uniqlo", "Sephora", "& Other Stories", "Aritzia", "Arc'teryx"],
  },
  {
    tier: "Pop-Up Platform",
    tagline: "The Collective — flex retail for drops, launches, and activations.",
    tenants: ["30-day cycles", "Turnkey buildouts", "Programmatic pricing", "Foot-traffic guarantees"],
  },
];

export const LUXURY_BRANDS = [
  "Hermès",
  "Saint Laurent",
  "Dolce & Gabbana",
  "Carolina Herrera",
  "Mulberry",
  "Tory Burch",
  "Moncler",
  "Kenzo",
];

export const DINING_VENUES = [
  {
    name: "Munchies Food Hall",
    descriptor: "Culinary incubator · 20 operators",
    palette: "from-ember/30 to-gold/20",
    image: "/images/food-hall.jpg",
  },
  {
    name: "The Dining Terrace",
    descriptor: "Waterfront-view fine dining",
    palette: "from-aqua/30 to-plum/20",
    image: "/images/dining-terrace.jpg",
  },
  {
    name: "IT'SUGAR Department Store",
    descriptor: "Three floors. All confection. A destination.",
    palette: "from-plum/30 to-ember/20",
    image: "/images/itsugar.jpg",
  },
  {
    name: "Toast",
    descriptor: "All-day European brasserie",
    palette: "from-gold/30 to-bone/10",
    image: "/images/toast-brasserie.jpg",
  },
];

export const ATTRACTIONS = [
  {
    name: "Nickelodeon Universe",
    subtitle: "North America's largest indoor theme park",
    stat: "35+",
    statLabel: "rides & coasters",
    body: "A 4-acre cathedral of velocity. Home to the world's steepest roller coaster.",
    accent: "ember",
    video: "/videos/nickelodeon.mp4",
  },
  {
    name: "DreamWorks Water Park",
    subtitle: "1.5 acres. 95°F. Year-round.",
    stat: "35K",
    statLabel: "sq ft wave pool",
    body: "The largest indoor wave pool in the Western Hemisphere, themed to DreamWorks universes.",
    accent: "aqua",
    video: "/videos/dreamworks.mp4",
  },
  {
    name: "Big SNOW American Dream",
    subtitle: "Real snow. Indoors. 365 days.",
    stat: "16°F",
    statLabel: "year round",
    body: "North America's only indoor real-snow ski and snowboard resort — a physical impossibility, operating.",
    accent: "bone",
    video: "/videos/big-snow.mp4",
  },
  {
    name: "Sea Life Aquarium",
    subtitle: "Under the city, under the sea",
    stat: "3,000",
    statLabel: "animals",
    body: "A walk-through ocean that puts marine wildlife at eye level with the luxury wing.",
    accent: "aqua",
    image: "/images/sea-life.jpg",
  },
  {
    name: "The Game Room Powered by Angry Birds",
    subtitle: "Mini golf, re-engineered",
    stat: "18",
    statLabel: "holes of chaos",
    body: "An IP-licensed entertainment canvas — a model for any brand looking to build an experience inside the property.",
    accent: "ember",
    image: "/images/mini-golf.jpg",
  },
  {
    name: "LEGOLAND Discovery Center",
    subtitle: "An indoor city for the next generation",
    stat: "10+",
    statLabel: "attractions",
    body: "Family-facing retail theater that anchors weekday traffic and birthday economies.",
    accent: "gold",
    image: "/images/legoland.jpg",
  },
  {
    name: "The Observation Wheel",
    subtitle: "300 ft above the meadowlands",
    stat: "300'",
    statLabel: "above ground",
    body: "A skyline view, a brand canvas, and a first-date icon. Available for private charter.",
    accent: "plum",
    image: "/images/observation-wheel.jpg",
  },
];

export const VENUES = [
  {
    id: "court",
    name: "The Court",
    capacity: "12,000",
    footprint: "40,000 sq ft",
    ceiling: "120 ft",
    kind: "Flexible arena",
    image: "/images/court-concert.jpg",
    useCases: ["Concerts", "Product launches", "Press conferences", "Fashion shows"],
    pitch: "A soaring indoor plaza engineered to be an empty stage. Rigging, power, and freight are pre-specified — load in Monday, open doors Wednesday.",
  },
  {
    id: "pac",
    name: "Performing Arts Center",
    capacity: "2,400",
    footprint: "Proscenium theater",
    ceiling: "85 ft fly",
    kind: "Broadway-grade venue",
    image: "/images/luxury-wing.jpg",
    useCases: ["Broadway runs", "Residencies", "Awards shows", "Broadcast tapings"],
    pitch: "Purpose-built for fly systems, orchestra pit, and live-broadcast specs. The only venue of its kind inside a retail destination.",
  },
  {
    id: "expo",
    name: "The Exposition Hall",
    capacity: "8,500",
    footprint: "80,000 sq ft",
    ceiling: "48 ft",
    kind: "Column-free hall",
    image: "/images/food-hall.jpg",
    useCases: ["Conventions", "Trade shows", "Gala dinners", "Activations"],
    pitch: "Column-free, drive-on freight, adjacent to 22,000 parking spaces and the Metropolitan region's largest hotel inventory.",
  },
  {
    id: "rooftop",
    name: "The Rooftop",
    capacity: "3,000",
    footprint: "Open-air",
    ceiling: "Sky",
    kind: "Skyline deck",
    image: "/images/observation-wheel.jpg",
    useCases: ["Brand activations", "Summer series", "Influencer drops", "Private corporate"],
    pitch: "Open-air with Manhattan sightlines. Engineered for brand takeover — modular stages, integrated LED, direct freight elevator.",
  },
];

export const EVENT_HIGHLIGHTS = [
  { year: "2024", name: "Annual Lunar New Year Gala", attendance: "18,000" },
  { year: "2024", name: "DreamWorks 30th Anniversary", attendance: "42,000" },
  { year: "2025", name: "NYFW Off-Site: Saint Laurent", attendance: "1,800" },
  { year: "2025", name: "Nickelodeon Kids' Choice Week", attendance: "65,000" },
  { year: "2025", name: "Toys R Us Global Re-Launch", attendance: "12,000" },
  { year: "2025", name: "Big SNOW X Red Bull Rail Jam", attendance: "6,000" },
];

export const SPONSOR_AUDIENCE_BARS = [
  { label: "Annual visitors", value: "40M", pct: 100, accent: "gold" },
  { label: "Visitors 18–34", value: "62%", pct: 62, accent: "ember" },
  { label: "HHI > $100K", value: "44%", pct: 44, accent: "aqua" },
  { label: "Travel 50+ mi", value: "54%", pct: 54, accent: "plum" },
  { label: "Stay 4+ hours", value: "72%", pct: 72, accent: "gold" },
  { label: "Net Promoter Score", value: "+71", pct: 71, accent: "bone" },
];

export const SPONSOR_ACTIVATIONS = [
  {
    name: "Brand Takeover",
    kicker: "30 days · 4 zones",
    body: "Wrap one entire wing of the property — wayfinding, digital out-of-home, ambient scent, and a flagship retail moment. Photographed and produced by our in-house creative team.",
    metric: "1.2B",
    metricLabel: "annualized impressions",
  },
  {
    name: "Product Launch",
    kicker: "1 night · 8,000 capacity",
    body: "The Court hosts the press preview. Rooftop hosts the after-party. The Avenue's flagship windows reveal the product to retail traffic the next morning.",
    metric: "$4.2M",
    metricLabel: "earned media value",
  },
  {
    name: "Immersive Zone",
    kicker: "90 days · 12,000 sq ft",
    body: "A standalone branded experience built into the central plaza. Family-tested IP licensing model, includes ticketing integration and merch retail.",
    metric: "240K",
    metricLabel: "ticketed visits",
  },
  {
    name: "Content Studio",
    kicker: "Always-on",
    body: "Permanent shoot-ready set inside the Performing Arts Center wing. Cleared for broadcast, podcast, and creator livestreams. Talent booking and crew handled.",
    metric: "180+",
    metricLabel: "shoot days / yr",
  },
  {
    name: "Member Series",
    kicker: "Monthly · 1,500 invited",
    body: "An invite-only programming arc tied to a brand's calendar — concerts, screenings, athlete meet-and-greets, and previews. Run by our member experience team.",
    metric: "94%",
    metricLabel: "RSVP-to-attend",
  },
  {
    name: "Ambassador Slate",
    kicker: "12-month",
    body: "A roster of resident artists, athletes, and creators on a co-branded calendar. Includes content rights, social cadence, and merchandising splits.",
    metric: "32",
    metricLabel: "creators on slate",
  },
];

export const SPONSOR_TIERS = [
  {
    tier: "Destination Partner",
    price: "$2.5M+ / yr",
    inventory: "Category-exclusive",
    includes: [
      "Anchor naming rights",
      "Custom-built brand experience",
      "Integrated across all 7 attractions",
      "First right on all activations",
    ],
  },
  {
    tier: "Platform Partner",
    price: "$750K – $2M / yr",
    inventory: "5 slots",
    includes: [
      "Named zone within one attraction",
      "4 seasonal activations / yr",
      "Co-branded media & signage",
      "Data share on foot traffic",
    ],
  },
  {
    tier: "Activation Partner",
    price: "$75K – $500K",
    inventory: "Rolling",
    includes: [
      "Pop-up footprint in The Collective",
      "Turnkey production",
      "Foot-traffic guarantee",
      "Performance reporting",
    ],
  },
];
