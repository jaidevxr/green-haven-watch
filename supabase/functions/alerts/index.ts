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
    console.log("Fetching disaster alerts from GDACS...");

    // Fetch from GDACS API
    const response = await fetch("https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH");
    const data = await response.json();

    // Filter and format alerts for India region
    const alerts = (data.features || [])
      .filter((feature: any) => {
        const coords = feature.geometry?.coordinates;
        if (!coords) return false;
        const [lng, lat] = coords;
        // India bounding box: lat 6.7-35.5, lng 68.1-97.4
        return lat >= 6.7 && lat <= 35.5 && lng >= 68.1 && lng <= 97.4;
      })
      .map((feature: any, idx: number) => ({
        id: feature.properties?.eventid || `alert-${idx}`,
        title: feature.properties?.name || "Disaster Alert",
        type: feature.properties?.eventtype || "Unknown",
        severity: feature.properties?.alertlevel || "medium",
        date: feature.properties?.fromdate || new Date().toISOString(),
        location: feature.properties?.country || "India",
        description: feature.properties?.description || "No description available",
        coordinates: feature.geometry?.coordinates,
      }))
      .slice(0, 20); // Limit to 20 most recent

    console.log(`Found ${alerts.length} alerts`);

    return new Response(JSON.stringify({ alerts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching alerts:", error);
    return new Response(JSON.stringify({ error: error.message, alerts: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
