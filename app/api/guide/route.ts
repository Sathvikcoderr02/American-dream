import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GuidePayload = {
  type: "guide";
  answers: { question: string; answer: string }[];
};

type RoiPayload = {
  type: "roi_narrative";
  spend: number;
  tier: string;
  impressions: string;
  onProperty: string;
  earned: string;
};

type TenantPitchPayload = {
  type: "tenant_pitch";
  brand: string;
  category: "flagship" | "luxury" | "contemporary" | "popup";
};

type GreetingPayload = {
  type: "greeting";
  outdoorTempF: number | null;
  hour: number;
  visitorCount: number;
};

type Payload = GuidePayload | RoiPayload | TenantPitchPayload | GreetingPayload;

const GUIDE_SYSTEM = `You are the commercial concierge for American Dream — the largest entertainment-first destination in the Americas.

PROPERTY FACTS YOU CAN CITE:
- 3 million sq ft, 10 minutes from Manhattan
- 40 million annual visitors (projected)
- 22 million people within 30 miles
- 7 attractions including the only indoor real-snow ski mountain in North America
- 450+ retail brands across flagship, luxury (The Avenue), contemporary, and pop-up tiers
- 4 event venues: 12,000-capacity arena, 2,400-seat Broadway-grade theater, 80,000 sq ft expo hall, open-air rooftop
- Sponsorship from $75K activation up to $2.5M+ destination partnerships

THE FIVE PORTALS YOU CAN ROUTE TO (use these EXACT capitalized labels in your prose):
- "property" → label "The Property" (location, scale, demographics)
- "attractions" → label "Attractions" (the 7 worlds, consumer-facing)
- "sponsor" → label "Sponsor" (brand partnerships, $75K to $2.5M+)
- "tenant" → label "Tenant" (retail leasing, all 4 tiers)
- "events" → label "Events" (venue booking, 4 venues)

A prospect has answered up to 3 qualification questions. Write a 2-sentence personalized recommendation that:
1. Acknowledges what they told you in plain language
2. Names ONE specific data point from the property that's relevant
3. Ends with the directional sentence: "I'd start in [Label]." — using the exact capitalized label above (e.g. "I'd start in Sponsor.")

Constraints: Under 55 words. No bullet points. No emojis. Sound like a sharp commercial agent talking to a serious prospect — confident, specific, no fluff.

After the recommendation, on a new line, output ONLY a JSON object with the portal id, formatted exactly:
ROUTE: {"portal":"<id>"}

Where <id> is one of: property, attractions, sponsor, tenant, events.`;

const GREETING_SYSTEM = `You are the doorman of American Dream — the largest entertainment-first destination in the Americas (Meadowlands NJ, 10 min from Manhattan, 3M sq ft, 7 attractions, 450+ brands, 4 event venues).

A prospect just opened the property's interactive deck. You have three real-world data points: the outdoor temperature, the local hour of day, and an estimated current visitor count inside the building.

Write a SINGLE arresting opening line (under 22 words) that uses at least two of those data points to make this moment feel specific and alive — not a tagline, not a slogan, not "Welcome to". Sound like a confident concierge who can see the building right now. Do not use bullet points, exclamation marks, or emojis. End with a period.

Examples of the tone (do not copy, just absorb the voice):
- "It is 41°F outside. Inside, 28,400 people are mid-afternoon, and the snow is groomed."
- "10pm on a Friday. The Court is loading in for tomorrow, 12,800 people are still in the building, and the rooftop is just warming up."`;

const TENANT_PITCH_SYSTEM = `You are a commercial leasing director at American Dream — the largest entertainment-first destination in the Americas. Write a personalized flagship pitch for the brand named in the user's request.

PROPERTY ANCHORS YOU CAN REFERENCE:
- 3M sq ft, 10 min from Manhattan, 22M people within 30 miles
- 40M annual visitors, 4-hour average dwell time
- The Avenue (luxury wing): Hermès, Saint Laurent, Dolce & Gabbana, Carolina Herrera adjacencies
- Flagship Concept tier: Toys R Us reopened, LEGO, Zara, H&M, Primark
- Contemporary tier: Sephora, Uniqlo, Aritzia, Arc'teryx
- The Collective: pop-up flex platform, 30-day cycles, foot-traffic guaranteed
- 7 attractions adjacent (Nickelodeon Universe, DreamWorks Water Park, Big SNOW, Sea Life, LEGOLAND, Mini Golf, Observation Wheel)
- 28 dining operators, food halls, IT'SUGAR three-floor candy department store

Write 3 sentences describing what THIS brand's American Dream flagship would specifically look like. Reference:
1. Which tier they'd belong to and why
2. One specific architectural / spatial / programming detail (not a generic "premium experience")
3. One specific named adjacency or attraction that would create traffic crossover

Constraints: Exactly 3 sentences. Under 80 words. No bullet points. No emojis. Sound like a leasing director who has placed this brand before — confident, specific, slightly understated.`;

const ROI_SYSTEM = `You are writing a single concise paragraph for a commercial sponsorship deck for American Dream — the largest entertainment-first destination in the Americas.

Given a budget, a tier, and the projected reach numbers, write 3 sentences describing what that partnership looks like in practice. Reference the actual numbers naturally, not as a list. Use the language of a partnerships team writing to a brand: confident, specific, slightly understated.

CONTEXT FOR YOUR LANGUAGE:
- Destination Partner ($2.5M+): category-exclusive, anchor naming rights, custom-built brand experience
- Platform Partner ($750K-$2M): named zone in one attraction, 4 seasonal activations, co-branded media
- Activation Partner ($75K-$500K): pop-up footprint, turnkey production, foot-traffic guarantee

Constraints: Exactly 3 sentences. Under 75 words. No bullet points, no headers, no emojis. Natural prose only.`;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "missing_api_key" }, { status: 500 });
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  let systemInstruction: string;
  let userPrompt: string;

  if (body.type === "guide") {
    if (!Array.isArray(body.answers) || body.answers.length === 0) {
      return NextResponse.json({ error: "no_answers" }, { status: 400 });
    }
    systemInstruction = GUIDE_SYSTEM;
    userPrompt = `The prospect's answers:\n\n${body.answers
      .map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`)
      .join("\n\n")}\n\nWrite the 2-sentence recommendation now, then the ROUTE line on its own line.`;
  } else if (body.type === "roi_narrative") {
    systemInstruction = ROI_SYSTEM;
    userPrompt = `Budget: $${body.spend.toLocaleString()}/year
Recommended tier: ${body.tier}
Projected annual impressions: ${body.impressions}
On-property visits: ${body.onProperty}
Earned media value: ${body.earned}

Write the 3-sentence partnership description.`;
  } else if (body.type === "greeting") {
    systemInstruction = GREETING_SYSTEM;
    const tempStr = body.outdoorTempF !== null ? `${body.outdoorTempF}°F outside` : "weather sensor offline";
    const partOfDay =
      body.hour < 6 ? "early morning" :
      body.hour < 12 ? "morning" :
      body.hour < 17 ? "afternoon" :
      body.hour < 21 ? "evening" : "late night";
    userPrompt = `Live data right now:
- Outside: ${tempStr}
- Local time: ${body.hour}:00 (${partOfDay})
- Estimated visitors currently in the building: ${body.visitorCount.toLocaleString()}

Write the single opening line.`;
  } else if (body.type === "tenant_pitch") {
    if (!body.brand || typeof body.brand !== "string" || body.brand.length > 80) {
      return NextResponse.json({ error: "invalid_brand" }, { status: 400 });
    }
    systemInstruction = TENANT_PITCH_SYSTEM;
    userPrompt = `Brand: ${body.brand.trim()}
Selected tier preference: ${body.category}

Write the 3-sentence flagship pitch.`;
  } else {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction,
    });

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400,
        // @ts-expect-error — thinkingConfig is supported by 2.5 models but not in current SDK types
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: "gemini_failed", message }, { status: 502 });
  }
}
