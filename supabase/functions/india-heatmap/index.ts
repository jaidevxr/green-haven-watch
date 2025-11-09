import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Major Indian cities with coordinates for pollution monitoring
const INDIAN_CITIES = [
  { name: "Delhi", lat: 28.7041, lng: 77.1025, state: "Delhi", code: "DL" },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, state: "Maharashtra", code: "MH" },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, state: "Karnataka", code: "KA" },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, state: "West Bengal", code: "WB" },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, state: "Tamil Nadu", code: "TN" },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867, state: "Telangana", code: "TG" },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, state: "Gujarat", code: "GJ" },
  { name: "Pune", lat: 18.5204, lng: 73.8567, state: "Maharashtra", code: "MH" },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, state: "Rajasthan", code: "RJ" },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462, state: "Uttar Pradesh", code: "UP" },
  { name: "Kanpur", lat: 26.4499, lng: 80.3319, state: "Uttar Pradesh", code: "UP" },
  { name: "Nagpur", lat: 21.1458, lng: 79.0882, state: "Maharashtra", code: "MH" },
  { name: "Indore", lat: 22.7196, lng: 75.8577, state: "Madhya Pradesh", code: "MP" },
  { name: "Bhopal", lat: 23.2599, lng: 77.4126, state: "Madhya Pradesh", code: "MP" },
  { name: "Patna", lat: 25.5941, lng: 85.1376, state: "Bihar", code: "BR" },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794, state: "Chandigarh", code: "CH" },
  { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, state: "Andhra Pradesh", code: "AP" },
  { name: "Surat", lat: 21.1702, lng: 72.8311, state: "Gujarat", code: "GJ" },
  { name: "Kochi", lat: 9.9312, lng: 76.2673, state: "Kerala", code: "KL" },
  { name: "Guwahati", lat: 26.1445, lng: 91.7362, state: "Assam", code: "AS" },
];

async function fetchTemperatureData() {
  const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
  
  if (!OPENWEATHER_API_KEY) {
    console.error("OPENWEATHER_API_KEY not configured!");
    throw new Error("Temperature API key not configured. Please add OPENWEATHER_API_KEY to secrets.");
  }

  console.log(`Fetching temperature data for ${INDIAN_CITIES.length} cities...`);

  const promises = INDIAN_CITIES.map(async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lng}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        ...city,
        temperature: Math.round(data.main?.temp * 10) / 10 || 0,
        humidity: data.main?.humidity || 0,
        weather: data.weather?.[0]?.description || "Unknown",
        feelsLike: Math.round(data.main?.feels_like * 10) / 10 || 0,
      };
    } catch (error) {
      console.error(`Error fetching weather for ${city.name}:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter(r => r !== null);
}

async function fetchPollutionData() {
  const AQICN_API_TOKEN = Deno.env.get("AQICN_API_TOKEN");
  
  if (!AQICN_API_TOKEN) {
    console.error("AQICN_API_TOKEN not configured!");
    throw new Error("Air Quality API key not configured. Please add AQICN_API_TOKEN to secrets.");
  }

  console.log(`Fetching pollution data for ${INDIAN_CITIES.length} cities...`);

  const promises = INDIAN_CITIES.map(async (city) => {
    try {
      const url = `https://api.waqi.info/feed/geo:${city.lat};${city.lng}/?token=${AQICN_API_TOKEN}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== "ok" || !data.data) {
        throw new Error("Invalid API response");
      }

      const aqi = data.data.aqi || 0;
      let category = "Good";
      let color = "#00e400";
      
      if (aqi > 300) {
        category = "Hazardous";
        color = "#7e0023";
      } else if (aqi > 200) {
        category = "Very Unhealthy";
        color = "#8f3f97";
      } else if (aqi > 150) {
        category = "Unhealthy";
        color = "#ff0000";
      } else if (aqi > 100) {
        category = "Unhealthy for Sensitive";
        color = "#ff7e00";
      } else if (aqi > 50) {
        category = "Moderate";
        color = "#ffff00";
      }

      return {
        ...city,
        aqi: aqi,
        category,
        color,
        pm25: data.data.iaqi?.pm25?.v || 0,
        pm10: data.data.iaqi?.pm10?.v || 0,
        stationName: data.data.city?.name || city.name,
      };
    } catch (error) {
      console.error(`Error fetching pollution for ${city.name}:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter(r => r !== null);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type } = await req.json();
    
    console.log(`Fetching ${type} heatmap data for India...`);
    
    let data;
    
    if (type === "temperature") {
      data = await fetchTemperatureData();
      console.log(`Fetched REAL temperature data for ${data.length} cities`);
    } else if (type === "pollution") {
      data = await fetchPollutionData();
      console.log(`Fetched REAL pollution data for ${data.length} cities`);
    } else {
      throw new Error("Invalid type. Use 'temperature' or 'pollution'");
    }

    if (data.length === 0) {
      throw new Error("No data received from APIs");
    }

    return new Response(
      JSON.stringify({ data, type, count: data.length }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in india-heatmap:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
