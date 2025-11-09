import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const lat = parseFloat(url.searchParams.get("lat") || "0");
    const lng = parseFloat(url.searchParams.get("lng") || "0");

    console.log(`Calculating risk for: ${lat}, ${lng}`);

    // Fetch weather data from OpenWeather
    const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    const rain_1h = weatherData.rain?.["1h"] || 0;
    const wind_ms = weatherData.wind?.speed || 0;

    // Fetch elevation from Open-Elevation
    const OPEN_ELEVATION_URL = Deno.env.get("OPEN_ELEVATION_URL") || "https://api.open-elevation.com/api/v1/lookup";
    const elevationResponse = await fetch(
      `${OPEN_ELEVATION_URL}?locations=${lat},${lng}`
    );
    const elevationData = await elevationResponse.json();
    const elevation_m = elevationData.results?.[0]?.elevation || 0;

    // Simplified river distance calculation (placeholder)
    const river_km = 5; // Would need actual river data
    const pop_density = 1000; // Would need actual population data

    // Calculate risk using ML-inspired formula
    const rain_n = Math.min(rain_1h / 10, 1);
    const wind_n = Math.min(wind_ms / 20, 1);
    const elev_n = Math.min(elevation_m / 500, 1);
    const river_n = Math.max(0, (5 - river_km) / 5);

    const score = 0.35 * rain_n + 0.25 * wind_n + 0.25 * (1 - elev_n) + 0.15 * river_n;

    let level: string;
    if (score > 0.65) {
      level = "High";
    } else if (score > 0.4) {
      level = "Medium";
    } else {
      level = "Low";
    }

    const response = {
      lat,
      lng,
      score: Math.round(score * 1000) / 1000,
      level,
      factors: {
        rain_1h,
        wind_ms,
        elevation_m,
        river_km,
        pop_density,
      },
    };

    console.log("Risk calculated:", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error calculating risk:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
