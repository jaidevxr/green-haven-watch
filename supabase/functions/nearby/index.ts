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
    const { lat, lng, types } = await req.json();
    const typesList = types.split(",");

    console.log(`Finding nearby services for: ${lat}, ${lng}, types: ${types}`);

    // Build Overpass QL query
    const amenityFilter = typesList.join("|");
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node(around:5000,${lat},${lng})[amenity~"${amenityFilter}"];
      );
      out center;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: overpassQuery,
      headers: { "Content-Type": "text/plain" },
    });

    const data = await response.json();
    const services = data.elements
      .map((element: any, idx: number) => {
        const elat = element.lat || element.center?.lat;
        const elon = element.lon || element.center?.lon;
        
        // Calculate distance
        const distance = Math.sqrt(
          Math.pow((elat - lat) * 111, 2) + Math.pow((elon - lng) * 111 * Math.cos((lat * Math.PI) / 180), 2)
        );

        return {
          id: idx,
          name: element.tags?.name || `Unnamed ${element.tags?.amenity}`,
          type: element.tags?.amenity || "unknown",
          lat: elat,
          lng: elon,
          distance,
          address: element.tags?.["addr:full"] || element.tags?.["addr:street"],
        };
      })
      .sort((a: any, b: any) => a.distance - b.distance)
      .slice(0, 10); // Top 10 nearest

    console.log(`Found ${services.length} services`);

    return new Response(JSON.stringify({ services }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching nearby services:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
