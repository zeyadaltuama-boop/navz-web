// app/api/navz-ai/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type RideExtract = {
  pickup: string | null;
  dropoff: string | null;
  stops: string[];
  datetime: string | null; // ISO string
  budget: number | null;
};

function extractJsonObject(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new Error("Model did not return a JSON object");
}

function normalizeDateTime(input: any): string | null {
  if (typeof input !== "string") return null;

  const lower = input.toLowerCase();
  const now = new Date();

  // tomorrow
  if (lower.includes("tomorrow")) {
    const date = new Date(now);
    date.setDate(now.getDate() + 1);

    const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1], 10);
      const minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      const meridiem = timeMatch[3];

      if (meridiem === "pm" && hour < 12) hour += 12;
      if (meridiem === "am" && hour === 12) hour = 0;

      date.setHours(hour, minute, 0, 0);
    } else {
      date.setHours(9, 0, 0, 0); // default 9am
    }

    return date.toISOString();
  }

  // direct ISO or parseable date
  const parsed = new Date(input);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return null;
}

function normalizeRideExtract(parsed: any): RideExtract {
  return {
    pickup: typeof parsed?.pickup === "string" ? parsed.pickup : null,
    dropoff: typeof parsed?.dropoff === "string" ? parsed.dropoff : null,
    stops: Array.isArray(parsed?.stops)
      ? parsed.stops.filter((s: any) => typeof s === "string")
      : [],
    datetime: normalizeDateTime(parsed?.datetime),
    budget: typeof parsed?.budget === "number" ? parsed.budget : null,
  };
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
      systemInstruction:
        "You are a ride data extractor. Return ONLY a single raw JSON object.",
    });

    const result = await model.generateContent(`
Extract ride data from:
"${prompt}"

Return EXACTLY this JSON shape:
{
  "pickup": string | null,
  "dropoff": string | null,
  "stops": string[],
  "datetime": string | null,
  "budget": number | null
}
`);

    const text = result.response.text();
    if (!text) {
      return NextResponse.json({ error: "AI returned no text" }, { status: 500 });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = JSON.parse(extractJsonObject(text));
    }

    const normalized = normalizeRideExtract(parsed);
    return NextResponse.json(normalized);
  } catch (err: any) {
    console.error("NAVZ AI error:", err);
    return NextResponse.json(
      { error: err?.message || "AI failure" },
      { status: 500 }
    );
  }
}
