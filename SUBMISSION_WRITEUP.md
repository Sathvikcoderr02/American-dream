# Interview Submission Write-Up

## Project
**American Dream — Interactive Sales Deck**  
Built as a browser-native sales tool for leasing, sponsorship, and event partnerships.

## Objective
The brief asked for a tool that replaces fragmented sales workflows (slides + videos + spreadsheets) with one premium, interactive destination experience that works both on live calls and as a standalone link.

This build focuses on:
- immediate emotional impact in the opening sequence
- non-linear navigation so prospects can self-direct
- video-first storytelling supported by clear business modules
- direct conversion paths for leasing, sponsorship, and event bookings

## Product and UX Decisions
### 1) Non-linear storytelling
Instead of a linear slide sequence, navigation is always available. Prospects can jump directly to districts and sub-modules based on their intent (tenant, sponsor, or event organizer).

### 2) Business-first structure
The overview (`/`) establishes scale and differentiation, then routes to deeper modules:
- `/events` for venue capabilities and booking flow
- `/sponsorship` for tiered partnership inventory and audience value

This mirrors how commercial conversations branch in real calls.

### 3) Premium visual language
The UI uses restrained typography, cinematic motion, and layered media (video/image + grain + gradient overlays) to keep the brand feel high-end while preserving readability.

### 4) CTA clarity
Every major section pushes to a next business action:
- leasing inquiry
- sponsorship conversation
- venue hold request

## Technical Architecture
- **Framework:** Next.js 15 App Router + React 19 + TypeScript
- **Styling/Motion:** Tailwind v4 + Framer Motion
- **Navigation/Feel:** Lenis smooth scroll + custom cursor system
- **Data model:** centralized in `lib/data.ts` for fast editorial updates
- **Performance posture:** static rendering, local media assets, and minimal runtime dependencies

The architecture is modular and intentionally expansion-friendly. New district modules can be added with minimal cross-file coupling.

## AI Usage
AI was used as a production accelerator in three ways:
1. **Design/engineering copilot:** architecture iteration, component shaping, interaction refinement.
2. **Creative ideation:** generating visual concepts where official property assets were limited.
3. **Asset integration:** selected AI-assisted visuals were curated and integrated into `public/images` with consistency overlays.

This allowed higher craft velocity without sacrificing implementation quality.

## What was completed against the brief
- Phase 1 interactive overview (all core story beats implemented)
- Phase 2 expandable architecture with working `events` and `sponsorship` modules
- Video-forward and media-rich storytelling
- Responsive desktop/tablet experience
- Production deployment with public URL
- Clear source repository and setup instructions

## What I would improve next
1. Add webhook-backed form handling to connect CTAs to CRM/sales ops.
2. Add presenter mode for guided sales-call operation.
3. Add deeper leasing paths (luxury vs mid-tier vs pop-up specific workflows).
4. Replace illustrative stats with source-cited, client-approved commercial data.
5. Add full accessibility QA pass for keyboard-first navigation flows.

## Final Note
This project was built to demonstrate product thinking, interaction craft, technical execution, and AI fluency under realistic constraints. The result is not a static showcase; it is a usable sales surface designed to move prospects toward commercial action.

