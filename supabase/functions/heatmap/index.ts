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
    const { bbox } = await req.json();
    const [west, south, east, north] = bbox.split(",").map(Number);

    console.log(`Generating heatmap for bbox: ${bbox}`);

    // Create a 20x20 grid (reduced from 50x50 for performance)
    const gridSize = 20;
    const latStep = (north - south) / gridSize;
    const lngStep = (east - west) / gridSize;

    const heatmap = [];
    const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");

    // Sample fewer points for faster response
    for (let i = 0; i < gridSize; i += 2) {
      for (let j = 0; j < gridSize; j += 2) {
        const lat = south + i * latStep;
        const lng = west + j * lngStep;

        try {
          // Fetch weather for this point
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`,
            { signal: AbortSignal.timeout(5000) } // 5s timeout
          );
          
          if (!weatherResponse.ok) continue;
          
          const weatherData = await weatherResponse.json();

          const rain_1h = weatherData.rain?.["1h"] || 0;
          const wind_ms = weatherData.wind?.speed || 0;

          // Simplified calculation (skip elevation API for speed)
          const elevation_m = 100 + Math.random() * 400; // Mock elevation
          const river_km = 5;

          const rain_n = Math.min(rain_1h / 10, 1);
          const wind_n = Math.min(wind_ms / 20, 1);
          const elev_n = Math.min(elevation_m / 500, 1);
          const river_n = Math.max(0, (5 - river_km) / 5);

          const score = 0.35 * rain_n + 0.25 * wind_n + 0.25 * (1 - elev_n) + 0.15 * river_n;

          let level: string;
          if (score > 0.65) level = "High";
          else if (score > 0.4) level = "Medium";
          else level = "Low";

          heatmap.push({ lat, lng, score: Math.round(score * 1000) / 1000, level });
        } catch (error) {
          console.error(`Error fetching data for ${lat},${lng}:`, error);
        }
      }
    }

    console.log(`Generated heatmap with ${heatmap.length} points`);

    return new Response(JSON.stringify({ heatmap }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error generating heatmap:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
