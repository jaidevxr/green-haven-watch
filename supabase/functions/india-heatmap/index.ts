import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// All Indian states and territories with capital coordinates
const INDIAN_STATES = [
  { name: "Andhra Pradesh", lat: 15.9129, lng: 79.74, code: "AP", capital: "Amaravati" },
  { name: "Arunachal Pradesh", lat: 28.2180, lng: 94.7278, code: "AR", capital: "Itanagar" },
  { name: "Assam", lat: 26.2006, lng: 92.9376, code: "AS", capital: "Dispur" },
  { name: "Bihar", lat: 25.0961, lng: 85.3131, code: "BR", capital: "Patna" },
  { name: "Chhattisgarh", lat: 21.2787, lng: 81.8661, code: "CT", capital: "Raipur" },
  { name: "Goa", lat: 15.2993, lng: 74.1240, code: "GA", capital: "Panaji" },
  { name: "Gujarat", lat: 22.2587, lng: 71.1924, code: "GJ", capital: "Gandhinagar" },
  { name: "Haryana", lat: 29.0588, lng: 76.0856, code: "HR", capital: "Chandigarh" },
  { name: "Himachal Pradesh", lat: 31.1048, lng: 77.1734, code: "HP", capital: "Shimla" },
  { name: "Jharkhand", lat: 23.6102, lng: 85.2799, code: "JH", capital: "Ranchi" },
  { name: "Karnataka", lat: 15.3173, lng: 75.7139, code: "KA", capital: "Bangalore" },
  { name: "Kerala", lat: 10.8505, lng: 76.2711, code: "KL", capital: "Thiruvananthapuram" },
  { name: "Madhya Pradesh", lat: 22.9734, lng: 78.6569, code: "MP", capital: "Bhopal" },
  { name: "Maharashtra", lat: 19.7515, lng: 75.7139, code: "MH", capital: "Mumbai" },
  { name: "Manipur", lat: 24.6637, lng: 93.9063, code: "MN", capital: "Imphal" },
  { name: "Meghalaya", lat: 25.4670, lng: 91.3662, code: "ML", capital: "Shillong" },
  { name: "Mizoram", lat: 23.1645, lng: 92.9376, code: "MZ", capital: "Aizawl" },
  { name: "Nagaland", lat: 26.1584, lng: 94.5624, code: "NL", capital: "Kohima" },
  { name: "Odisha", lat: 20.9517, lng: 85.0985, code: "OR", capital: "Bhubaneswar" },
  { name: "Punjab", lat: 31.1471, lng: 75.3412, code: "PB", capital: "Chandigarh" },
  { name: "Rajasthan", lat: 27.0238, lng: 74.2179, code: "RJ", capital: "Jaipur" },
  { name: "Sikkim", lat: 27.5330, lng: 88.5122, code: "SK", capital: "Gangtok" },
  { name: "Tamil Nadu", lat: 11.1271, lng: 78.6569, code: "TN", capital: "Chennai" },
  { name: "Telangana", lat: 18.1124, lng: 79.0193, code: "TG", capital: "Hyderabad" },
  { name: "Tripura", lat: 23.9408, lng: 91.9882, code: "TR", capital: "Agartala" },
  { name: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, code: "UP", capital: "Lucknow" },
  { name: "Uttarakhand", lat: 30.0668, lng: 79.0193, code: "UT", capital: "Dehradun" },
  { name: "West Bengal", lat: 22.9868, lng: 87.8550, code: "WB", capital: "Kolkata" },
  { name: "Delhi", lat: 28.7041, lng: 77.1025, code: "DL", capital: "New Delhi" },
  { name: "Jammu and Kashmir", lat: 33.7782, lng: 76.5762, code: "JK", capital: "Srinagar" },
  { name: "Ladakh", lat: 34.1526, lng: 77.5771, code: "LA", capital: "Leh" },
  { name: "Puducherry", lat: 11.9416, lng: 79.8083, code: "PY", capital: "Puducherry" },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794, code: "CH", capital: "Chandigarh" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", lat: 20.1809, lng: 73.0169, code: "DD", capital: "Daman" },
  { name: "Lakshadweep", lat: 10.5667, lng: 72.6417, code: "LD", capital: "Kavaratti" },
  { name: "Andaman and Nicobar Islands", lat: 11.7401, lng: 92.6586, code: "AN", capital: "Port Blair" },
];

async function fetchTemperatureData() {
  const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
  
  if (!OPENWEATHER_API_KEY) {
    console.error("OPENWEATHER_API_KEY not configured!");
    throw new Error("Temperature API key not configured");
  }

  console.log(`Fetching temperature data for ${INDIAN_STATES.length} states...`);

  const promises = INDIAN_STATES.map(async (state) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${state.lat}&lon=${state.lng}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        ...state,
        temperature: Math.round(data.main?.temp * 10) / 10,
        humidity: data.main?.humidity || 0,
        weather: data.weather?.[0]?.description || "Unknown",
        feelsLike: Math.round(data.main?.feels_like * 10) / 10,
      };
    } catch (error) {
      console.error(`Error fetching weather for ${state.name}:`, error);
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
    throw new Error("Air Quality API key not configured");
  }

  console.log(`Fetching pollution data for ${INDIAN_STATES.length} states...`);

  const promises = INDIAN_STATES.map(async (state) => {
    try {
      const url = `https://api.waqi.info/feed/geo:${state.lat};${state.lng}/?token=${AQICN_API_TOKEN}`;
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
        ...state,
        aqi: aqi,
        category,
        color,
        pm25: data.data.iaqi?.pm25?.v || 0,
        pm10: data.data.iaqi?.pm10?.v || 0,
        stationName: data.data.city?.name || state.capital,
      };
    } catch (error) {
      console.error(`Error fetching pollution for ${state.name}:`, error);
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
      console.log(`Fetched temperature data for ${data.length} states`);
    } else if (type === "pollution") {
      data = await fetchPollutionData();
      console.log(`Fetched pollution data for ${data.length} states`);
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
