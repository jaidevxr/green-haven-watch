import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const response = await fetch(`${LLM_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LLM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: LLM_MODEL_NAME,
        messages: [
          {
            role: "system",
            content:
              "You are a disaster response assistant for India. Always use tools before replying. Be accurate. Prioritize safety. Use official data sources. Provide clear, concise, and actionable information.",
          },
          ...messages,
        ],
        tools,
        tool_choice: "auto",
      }),
    });

    const data = await response.json();
    console.log("LLM Response:", JSON.stringify(data));

    const assistantMessage = data.choices[0].message;

    // If LLM wants to use a tool, execute it
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      console.log("Tool calls requested:", assistantMessage.tool_calls);
      
      // For now, return a response indicating tool use (frontend could handle actual calls)
      return new Response(
        JSON.stringify({
          response:
            "I would like to gather more information for you. Please note that tool calling is configured. The system can fetch weather, risk assessments, nearby services, and alerts.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
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
