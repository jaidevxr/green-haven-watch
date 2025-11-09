import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");

// Tool execution functions
async function executeGetWeather(lat: number, lng: number) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      temperature: data.main?.temp || 0,
      wind_speed: data.wind?.speed || 0,
      rain: data.rain?.["1h"] || 0,
      weather: data.weather?.[0]?.description || "Unknown",
      humidity: data.main?.humidity || 0,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return { error: "Failed to fetch weather data" };
  }
}

async function executeGetRisk(lat: number, lng: number) {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/risk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ lat, lng }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching risk:", error);
    return { error: "Failed to fetch risk data" };
  }
}

async function executeGetNearby(lat: number, lng: number, types: string) {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/nearby`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ lat, lng, types }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching nearby:", error);
    return { error: "Failed to fetch nearby services" };
  }
}

async function executeGetAlerts() {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/alerts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return { error: "Failed to fetch alerts" };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const LLM_API_KEY = Deno.env.get("LLM_API_KEY");
    const LLM_API_BASE = Deno.env.get("LLM_API_BASE") || "https://api.groq.com/openai/v1";
    const LLM_MODEL_NAME = Deno.env.get("LLM_MODEL_NAME") || "llama3-70b-8192";

    if (!LLM_API_KEY) {
      throw new Error("LLM_API_KEY not configured");
    }

    console.log("Sending request to LLM...");

    // Define tools for the LLM
    const tools = [
      {
        type: "function",
        function: {
          name: "getWeather",
          description: "Get current weather conditions for a location",
          parameters: {
            type: "object",
            properties: {
              lat: { type: "number", description: "Latitude" },
              lng: { type: "number", description: "Longitude" },
            },
            required: ["lat", "lng"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "getRisk",
          description: "Get disaster risk assessment for a location",
          parameters: {
            type: "object",
            properties: {
              lat: { type: "number", description: "Latitude" },
              lng: { type: "number", description: "Longitude" },
            },
            required: ["lat", "lng"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "getNearby",
          description: "Find nearby emergency services",
          parameters: {
            type: "object",
            properties: {
              lat: { type: "number", description: "Latitude" },
              lng: { type: "number", description: "Longitude" },
              types: { type: "string", description: "Comma-separated types: hospital,police,fire_station" },
            },
            required: ["lat", "lng"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "getAlerts",
          description: "Get active disaster alerts in India",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
    ];

    // Build conversation with system prompt
    const conversationMessages = [
      {
        role: "system",
        content:
          "You are a disaster response assistant for India. Always use available tools to provide accurate, real-time information. Be clear, concise, and prioritize safety. When users ask about locations, weather, risks, or emergency services, use the appropriate tools.",
      },
      ...messages,
    ];

    // First LLM call
    let response = await fetch(`${LLM_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LLM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: LLM_MODEL_NAME,
        messages: conversationMessages,
        tools,
        tool_choice: "auto",
      }),
    });

    let data = await response.json();
    console.log("LLM Response:", JSON.stringify(data));

    let assistantMessage = data.choices[0].message;

    // If LLM wants to use tools, execute them
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      console.log("Executing tool calls:", assistantMessage.tool_calls);
      
      // Add assistant's message with tool calls to conversation
      conversationMessages.push(assistantMessage);
      
      // Execute each tool call
      for (const toolCall of assistantMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        
        let toolResult;
        
        switch (functionName) {
          case "getWeather":
            toolResult = await executeGetWeather(args.lat, args.lng);
            break;
          case "getRisk":
            toolResult = await executeGetRisk(args.lat, args.lng);
            break;
          case "getNearby":
            toolResult = await executeGetNearby(args.lat, args.lng, args.types || "hospital,police,fire_station");
            break;
          case "getAlerts":
            toolResult = await executeGetAlerts();
            break;
          default:
            toolResult = { error: "Unknown function" };
        }
        
        console.log(`Tool ${functionName} result:`, JSON.stringify(toolResult));
        
        // Add tool result to conversation
        conversationMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        });
      }
      
      // Second LLM call with tool results
      response = await fetch(`${LLM_API_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LLM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: LLM_MODEL_NAME,
          messages: conversationMessages,
        }),
      });
      
      data = await response.json();
      console.log("Final LLM Response:", JSON.stringify(data));
      assistantMessage = data.choices[0].message;
    }

    return new Response(
      JSON.stringify({ response: assistantMessage.content || "No response generated" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in copilot-chat:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
