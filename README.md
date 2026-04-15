# American Dream — The Destination Platform

An interactive, browser-based sales deck for **American Dream** (Meadowlands, NJ) — built as a replacement for the fragmented PDF-plus-YouTube-plus-spreadsheet pitch process that commercial teams at mega-destinations live with today.

It's a Next.js app designed to be screen-shared on a live sales call **or** sent as a standalone link a prospect can explore alone. Non-linear. Video-first. Cinematic. Aimed at three buyers: **retail leasing**, **brand sponsorship**, and **event bookings**.

## Live

- **Home (main deck):** [`americanexpress123.netlify.app/`](https://americanexpress123.netlify.app/)
- **Events sub-module:** [`americanexpress123.netlify.app/events`](https://americanexpress123.netlify.app/events)
- **Sponsorship sub-module:** [`americanexpress123.netlify.app/sponsorship`](https://americanexpress123.netlify.app/sponsorship)

Deployed on Netlify via `@netlify/plugin-nextjs`. Build settings locked in `netlify.toml`.

## Lighthouse (production, mobile profile)

Audited via `npx lighthouse@12` against the live URL.

| Route | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | **93** | **100** | **96** | **100** |
| `/events` | **99** | **100** | **96** | **100** |

**Core Web Vitals on `/`:** LCP 2.7 s · CLS 0 · TBT 50 ms · FCP 1.4 s.
**Core Web Vitals on `/events`:** LCP 1.8 s · CLS 0 · TBT 10 ms · FCP 1.2 s.

Both routes clear the brief's "90+ Lighthouse performance" requirement. CLS is zero on both — no layout shift. The home LCP element is the hero video reel (`hero-reel.mp4`, 8.8 MB); on a fast connection it lands at ~2.7 s, with a poster-style aurora gradient holding the frame until the first video frame paints.

## Tech stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme` tokens, no config file) |
| Motion | Framer Motion 12 |
| Smooth scroll | Lenis |
| Fonts | Instrument Serif + Inter (via `next/font`) |
| Deploy target | Netlify (`@netlify/plugin-nextjs`) |

**First Load JS:** `175 kB` for home, `168 kB` for `/events` (latest build). Both pages are fully static (prerendered at build time). The deck now combines real media assets (video + image) with SVG, Canvas, CSS gradients, and Framer Motion.

## What's here

### Phase 1 — the overview deck (`/`)

Eight districts, non-linear, all reachable from the persistent navigator:

| # | District | What it does |
|---|----------|--------------|
| 00 | **Overture (Hero)** | Scroll-scrubbed cinematic opening with aurora gradient, Canvas particle field, animated stat grid, and a live marquee ticker. Two CTAs: *Begin the tour* and *Book a venue*. |
| 01 | **The Property** | Tri-state map as an animated SVG — glowing pulse on the mall, dashed highway lines to NYC / EWR / JFK. Demographic grid (22M people, $113K HHI, 72% 4+ hours). |
| 02 | **Retail** | Four leasing tiers (Flagship, Luxury, Contemporary, Pop-Up). Click to swap; tenant grid and flagship art morph per tier. |
| 03 | **The Avenue (Luxury)** | Horizontally scroll-driven luxury brand wall with parallax + a gold/bone velvet gradient. Three private-client program cards. |
| 04 | **Dining** | Four venue cards now mapped to dedicated photo assets (`food-hall`, `dining-terrace`, `itsugar`, `toast-brasserie`) with existing visual overlays preserved. |
| 05 | **Attractions** | Hover-to-switch stage: video for marquee attractions and dedicated image assets for Sea Life, Mini Golf, LEGOLAND, and Observation Wheel, with SVG fallback support still in place. |
| 06 | **Events** | Venue strip now uses distinct per-venue image mapping with readability-safe overlays, plus recent activations and sponsorship inventory. |
| 07 | **Get In** | Three-door CTA: Leasing, Sponsorship, Events — each with a live mailto. |

### Phase 2 — the Sponsorship sub-module (`/sponsorship`)

A working partnership-pitch surface — the second clickable depth from the deck:

1. **Audience grid** — six animated metric cards (40M annual visitors, 62% under 35, 44% HHI > $100K, 54% travel 50+ mi, 72% stay 4+ hrs, NPS +71) with proportional gradient bars that fill on scroll-into-view.
2. **Spend simulator** — a **logarithmic** dollar slider from $75K to $5M with snap-to-$25K. The exponent matches how the partnership market actually sells: small dollar moves at the bottom feel as meaningful as big ones at the top. Live-updates three projection cards (annual impressions, on-property visits, earned media value) and surfaces a recommended tier pill.
3. **Tier picker** — three-pill toggle (Destination / Platform / Activation) with an animated card showing inventory, price band, and included assets per tier. Tied to the spend simulator's "recommended tier" jump button.
4. **Activation library** — six example activation types (Brand Takeover, Product Launch, Immersive Zone, Content Studio, Member Series, Ambassador Slate) as a 3×2 card grid with metric callouts in gold.
5. **Brief request modal** — animated check-mark success state confirming the tier + budget submission.

### Phase 2 — the Events sub-module (`/events`)

A working, interactive booking surface:

1. **Venue picker** — four venues: The Court (12,000 cap arena), Performing Arts Center (2,400 proscenium), Exposition Hall (8,500), Rooftop (3,000).
2. **Venue Stage** — each venue renders its own SVG floor plan (stage + audience grid for The Court, prosceniumed arc seating for PAC, 5x10 booth grid for the Expo Hall, circular deck + LED backdrop for Rooftop). The card tilts in 3D with cursor movement — a parallax preview of what would be a real flythrough in production.
3. **Booking Timeline** — a draggable year-long timeline with month markers, simulated booked windows (striped red), and two gold handles. Drag handles to resize the window or drag the window itself to shift. Pointer events, no mouse-only fallbacks.
4. **Event type** — seven categories as pill chips.
5. **Live quote** — rental, production, and package total update instantly from venue × day-count.
6. **Hold confirmation** — animated check-mark success state with venue + type + duration.

### Cross-cutting systems

- **Custom cursor** (`components/Cursor.tsx`) — dual-layer: a 6px inner dot that uses `mix-blend-mode: difference` and a spring-tracked outer ring. The ring reads `data-cursor="cta|drag|text"` and optional `data-cursor-label` attributes from whatever is hovered, and morphs size + label accordingly. Disabled on touch devices via `@media (hover: hover)`.
- **Navigator** (`components/Navigator.tsx`) — three navigation surfaces in one:
  1. Hairline scroll progress rail (top of viewport, gradient ember→gold→aqua).
  2. Top bar with monogram, current district index + eyebrow, and a map toggle.
  3. **Radial district picker** — a full-screen concentric-ring modal with eight petals laid out at 45° intervals around a center medallion. Click any petal to warp-scroll via Lenis.
  4. Left-side progress rail that lights the current section.
- **Smooth scroll** (`components/SmoothScroll.tsx`) — Lenis with `lerp: 0.1, duration: 1.2`. Exposed on `window.__lenis` for the Navigator's warp-scroll-to-section.
- **ParticleField** (`components/ParticleField.tsx`) — Canvas particle system, DPR-aware, 90 nodes by default, with lightweight proximity-based connection lines under 9000 px². Runs on `requestAnimationFrame`. Respects `prefers-reduced-motion` via the global CSS rule.
- **MediaPanel** (`components/MediaPanel.tsx`) — the "video block" primitive. Renders a 16:9 (or other aspect) gradient-tinted frame with a grain overlay, a "LIVE" badge, and a kicker + display title. Designed so you can drop a real `<video autoplay muted loop>` element inside as the first child and everything else (caption, badge, grain, tint) composes correctly around it. **This is the hook for real production video.**

## Project structure

```
.
├── app/
│   ├── layout.tsx            # fonts, metadata, cursor + navigator mount
│   ├── page.tsx              # Phase 1 main deck (sections composition)
│   ├── globals.css           # Tailwind v4 @theme + utilities + keyframes
│   ├── sections/             # one file per district
│   │   ├── Hero.tsx
│   │   ├── WhyThisProperty.tsx
│   │   ├── Retail.tsx
│   │   ├── Luxury.tsx
│   │   ├── Dining.tsx
│   │   ├── Attractions.tsx
│   │   ├── Events.tsx
│   │   └── CTA.tsx
│   └── events/               # Phase 2 sub-module
│       ├── page.tsx
│       ├── EventsModule.tsx
│       ├── VenueStage.tsx
│       └── BookingTimeline.tsx
├── components/
│   ├── Navigator.tsx         # radial map + side rail + progress bar
│   ├── Cursor.tsx            # custom cursor w/ data-cursor contracts
│   ├── SmoothScroll.tsx      # Lenis wrapper
│   ├── ParticleField.tsx     # canvas hero atmosphere
│   ├── MediaPanel.tsx        # the "video block" primitive
│   └── SectionIntro.tsx      # shared index + eyebrow + title + lede
├── lib/
│   └── data.ts               # ALL copy, stats, tenants, venues, events
└── public/                   # (add real images / videos here)
```

Almost everything an editor would want to change lives in **`lib/data.ts`**: headline, tenant lists, attraction copy, event highlights, sponsorship tiers, venue specs. You can rewire the whole narrative without touching any component.

## Running locally

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # verify the production build
```

Node ≥ 20. Uses `@tailwindcss/postcss` — no `tailwind.config.*` file needed; tokens are declared directly in `app/globals.css` via `@theme`.

## Design decisions

- **Media-first with resilient fallbacks.** The deck now ships with real local videos (`public/videos`) and curated image assets (`public/images`) for dining, attractions, luxury, and events. When media is unavailable, SVG/gradient layers still provide a polished fallback.
- **Non-linear from the first frame.** The persistent top-right `Districts` button opens a full-screen radial picker. No one is forced to scroll through in order.
- **Warp-scroll, not jump-scroll.** The navigator uses Lenis's `scrollTo` with a 1.4s duration so jumping across districts feels cinematic, not abrupt.
- **Per-section color identity.** Each district has an assigned accent (`ember / gold / aqua / plum / bone`) that shows up in its gradient, its cursor labels, and its underline animations. It makes the deck feel *composed* rather than templated.
- **Scroll pin + release for the hero.** The hero is `h-[200vh]` with a sticky inner `h-screen`. This gives us a full scroll-scrubbed opening sequence — scale, y-parallax, chrome fade — without fighting Lenis.
- **Cursor-as-UI.** Rather than label every interactive thing, the custom cursor picks up `data-cursor` and `data-cursor-label` attributes, so hovering a button says "Begin", hovering the timeline says "Drag", hovering a tenant says "Select". Makes the whole surface feel tactile.
- **90+ Lighthouse target.** Fonts via `next/font` (zero layout shift, subset to Latin). Animations stay on `transform`/`opacity`. Media is served from local static assets. No client-side data fetching. Pages are prerendered at build time.
- **Respects `prefers-reduced-motion`** via a global CSS rule that collapses animation durations to 0.01ms.

## Source video credits

All footage in `public/videos/` is drawn from publicly available promotional content for American Dream and its operating tenants — used here under the brief's authorization to "use publicly available assets from your chosen property: official videos, imagery from the mall's website, press materials, and any promotional content you can find online." Source clips were trimmed to ~6 seconds with `ffmpeg`, normalized to 1280×720 @ 30 fps, audio stripped, and re-encoded with `libx264` + `+faststart`.

| File | Source | Channel |
|---|---|---|
| `hero-reel.mp4` | concat of all 5 clips below | — |
| `nickelodeon.mp4` | [`youtu.be/LfwcTcqPL6c`](https://www.youtube.com/watch?v=LfwcTcqPL6c) | American Dream Channel (official) |
| `dreamworks.mp4` | [`youtu.be/-ZSsX1I1fFc`](https://www.youtube.com/watch?v=-ZSsX1I1fFc) | American Dream Channel (official) |
| `big-snow.mp4` | [`youtu.be/Gds1BzTEqxs`](https://www.youtube.com/watch?v=Gds1BzTEqxs) | Big SNOW American Dream (official) |
| `why.mp4` | [`youtu.be/bir0iyPyT_Y`](https://www.youtube.com/watch?v=bir0iyPyT_Y) | American Dream Flythrough |
| `project.mp4` | [`youtu.be/aat_j5ZPduM`](https://www.youtube.com/watch?v=aat_j5ZPduM) | Meadowlands Chamber |

For a production deployment, the commercial team should replace these with master files from American Dream's brand asset library and update the credits accordingly.

## AI tools used

| Tool | What I used it for |
|---|---|
| **Claude (Anthropic)** | Architecture, component breakdown, copy voice, motion choreography, SVG art direction. Effectively the pair-coder for the entire build. |
| **AI image generation workflow** | Used for selected fallback/hero visual concepts where official property assets were limited, then curated/exported into `public/images` and integrated with production-safe overlays. |

**AI-assisted image integration (current repo):**
- `public/images/court-concert.jpg`
- `public/images/luxury-wing.jpg`
- `public/images/food-hall.jpg`
- `public/images/dining-terrace.jpg`
- `public/images/itsugar.jpg`
- `public/images/toast-brasserie.jpg`
- `public/images/sea-life.jpg`
- `public/images/mini-golf.jpg`
- `public/images/legoland.jpg`
- `public/images/observation-wheel.jpg`

**Content sourcing.** Copy, stats, and narrative framing are based on publicly available information about American Dream (attractions, tenant mix, location, positioning). Numbers are realistic but illustrative and should be replaced with authoritative sales-team data for production pitches.

## What I'd build next (with more time)

1. **Real video integration** — a `MediaPanel` v2 that takes a `src` prop and handles autoplay / poster / scroll-gated loading. A few full-bleed background-video hero variants per district.
2. **`/retail` sub-module** — mirror the Events flow: pick a category (luxury / contemporary / flagship / pop-up), pick a footprint range, see adjacent tenants and a heat-mapped floor plan.
3. **Presenter mode** — keyboard arrows to advance between districts, an "S" key to hide chrome, and a hidden speaker-notes panel.
4. **Webhook-backed hold requests** — right now the Events `Submit` is a local success state. A real build would POST to a CRM / Slack channel.
5. **Live telemetry** — hook up Vercel Analytics + a custom heatmap so the commercial team sees which districts a given prospect lingered on before the call.
6. **Accessibility audit** — focus rings on the custom-cursor buttons, keyboard access to the radial navigator, ARIA live regions on the timeline's current window.

## License

Proprietary — built as a candidate deliverable for the Liat interview project.
