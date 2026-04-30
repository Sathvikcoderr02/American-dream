import { NextResponse } from "next/server";

// Meadowlands, NJ coordinates (American Dream)
const LAT = 40.81;
const LON = -74.07;

export const revalidate = 600; // 10 minute cache

export async function GET() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;
    const res = await fetch(url, { next: { revalidate: 600 } });

    if (!res.ok) {
      return NextResponse.json({ error: "weather_unavailable" }, { status: 502 });
    }

    const data = (await res.json()) as {
      current?: { temperature_2m?: number; weather_code?: number };
    };

    const tempF = data.current?.temperature_2m;
    const code = data.current?.weather_code;

    if (typeof tempF !== "number") {
      return NextResponse.json({ error: "no_temperature" }, { status: 502 });
    }

    return NextResponse.json({
      outdoorTempF: Math.round(tempF),
      weatherCode: code ?? null,
      condition: describeWeatherCode(code),
      coords: { lat: LAT, lon: LON },
      fetchedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
  }
}

function describeWeatherCode(code?: number): string {
  if (code === undefined) return "outside";
  if (code === 0) return "clear";
  if (code <= 3) return "partly cloudy";
  if (code <= 48) return "foggy";
  if (code <= 67) return "rainy";
  if (code <= 77) return "snowing";
  if (code <= 82) return "showering";
  if (code <= 86) return "snowy";
  if (code <= 99) return "stormy";
  return "outside";
}
