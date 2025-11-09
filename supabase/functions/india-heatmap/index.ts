import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Indian states with approximate center coordinates
const INDIAN_STATES = [
  { name: "Andhra Pradesh", lat: 15.9129, lng: 79.74, code: "AP" },
  { name: "Arunachal Pradesh", lat: 28.2180, lng: 94.7278, code: "AR" },
  { name: "Assam", lat: 26.2006, lng: 92.9376, code: "AS" },
  { name: "Bihar", lat: 25.0961, lng: 85.3131, code: "BR" },
  { name: "Chhattisgarh", lat: 21.2787, lng: 81.8661, code: "CT" },
  { name: "Goa", lat: 15.2993, lng: 74.1240, code: "GA" },
  { name: "Gujarat", lat: 22.2587, lng: 71.1924, code: "GJ" },
  { name: "Haryana", lat: 29.0588, lng: 76.0856, code: "HR" },
  { name: "Himachal Pradesh", lat: 31.1048, lng: 77.1734, code: "HP" },
  { name: "Jharkhand", lat: 23.6102, lng: 85.2799, code: "JH" },
  { name: "Karnataka", lat: 15.3173, lng: 75.7139, code: "KA" },
  { name: "Kerala", lat: 10.8505, lng: 76.2711, code: "KL" },
  { name: "Madhya Pradesh", lat: 22.9734, lng: 78.6569, code: "MP" },
  { name: "Maharashtra", lat: 19.7515, lng: 75.7139, code: "MH" },
  { name: "Manipur", lat: 24.6637, lng: 93.9063, code: "MN" },
  { name: "Meghalaya", lat: 25.4670, lng: 91.3662, code: "ML" },
  { name: "Mizoram", lat: 23.1645, lng: 92.9376, code: "MZ" },
  { name: "Nagaland", lat: 26.1584, lng: 94.5624, code: "NL" },
  { name: "Odisha", lat: 20.9517, lng: 85.0985, code: "OR" },
  { name: "Punjab", lat: 31.1471, lng: 75.3412, code: "PB" },
  { name: "Rajasthan", lat: 27.0238, lng: 74.2179, code: "RJ" },
  { name: "Sikkim", lat: 27.5330, lng: 88.5122, code: "SK" },
  { name: "Tamil Nadu", lat: 11.1271, lng: 78.6569, code: "TN" },
  { name: "Telangana", lat: 18.1124, lng: 79.0193, code: "TG" },
  { name: "Tripura", lat: 23.9408, lng: 91.9882, code: "TR" },
  { name: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, code: "UP" },
  { name: "Uttarakhand", lat: 30.0668, lng: 79.0193, code: "UT" },
  { name: "West Bengal", lat: 22.9868, lng: 87.8550, code: "WB" },
  { name: "Delhi", lat: 28.7041, lng: 77.1025, code: "DL" },
  { name: "Jammu and Kashmir", lat: 33.7782, lng: 76.5762, code: "JK" },
  { name: "Ladakh", lat: 34.1526, lng: 77.5771, code: "LA" },
];

async function fetchTemperatureData() {
  const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
  
  if (!OPENWEATHER_API_KEY) {
    console.warn("OPENWEATHER_API_KEY not configured, using mock data");
    return INDIAN_STATES.map(state => ({
      ...state,
      temperature: 20 + Math.random() * 20, // Mock: 20-40°C
      humidity: 40 + Math.random() * 40,
    }));
  }

  const promises = INDIAN_STATES.map(async (state) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${state.lat}&lon=${state.lng}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      
      return {
        ...state,
        temperature: data.main?.temp || 0,
        humidity: data.main?.humidity || 0,
        weather: data.weather?.[0]?.description || "Unknown",
      };
    } catch (error) {
      console.error(`Error fetching weather for ${state.name}:`, error);
      return {
        ...state,
        temperature: 25,
        humidity: 50,
        weather: "Unknown",
      };
    }
  });

  return await Promise.all(promises);
}

async function fetchPollutionData() {
  // Generate realistic pollution data (AQI values)
  // In production, this would call CPCB API or similar
  return INDIAN_STATES.map(state => {
    // Simulate higher pollution in northern states and industrial areas
    let baseAQI = 100;
    
    if (["Delhi", "Uttar Pradesh", "Bihar", "Haryana", "Punjab"].includes(state.name)) {
      baseAQI = 200 + Math.random() * 150; // High pollution
    } else if (["Maharashtra", "Gujarat", "West Bengal"].includes(state.name)) {
      baseAQI = 100 + Math.random() * 100; // Moderate pollution
    } else {
      baseAQI = 50 + Math.random() * 80; // Lower pollution
    }

    let category = "Good";
    let color = "#00e400";
    
    if (baseAQI > 300) {
      category = "Hazardous";
      color = "#7e0023";
    } else if (baseAQI > 200) {
      category = "Very Unhealthy";
      color = "#8f3f97";
    } else if (baseAQI > 150) {
      category = "Unhealthy";
      color = "#ff0000";
    } else if (baseAQI > 100) {
      category = "Unhealthy for Sensitive Groups";
      color = "#ff7e00";
    } else if (baseAQI > 50) {
      category = "Moderate";
      color = "#ffff00";
    }

    return {
      ...state,
      aqi: Math.round(baseAQI),
      category,
      color,
      pm25: Math.round(baseAQI * 0.4),
      pm10: Math.round(baseAQI * 0.6),
    };
  });
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
      console.log(`Fetched temperature data for ${data.length} states`);
    } else if (type === "pollution") {
      data = await fetchPollutionData();
      console.log(`Fetched pollution data for ${data.length} states`);
    } else {
      throw new Error("Invalid type. Use 'temperature' or 'pollution'");
    }

    return new Response(
      JSON.stringify({ data, type }),
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
