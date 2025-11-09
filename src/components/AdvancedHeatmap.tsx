import { useState, useEffect } from "react";
import { MapBase } from "@/components/MapBase";
import { CircleMarker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Thermometer, Wind } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StateData {
  name: string;
  lat: number;
  lng: number;
  code: string;
  temperature?: number;
  humidity?: number;
  weather?: string;
  aqi?: number;
  category?: string;
  color?: string;
  pm25?: number;
  pm10?: number;
}

const getTemperatureColor = (temp: number): string => {
  if (temp < 10) return "#0000ff"; // Blue - Very Cold
  if (temp < 20) return "#00bfff"; // Light Blue - Cold
  if (temp < 25) return "#90ee90"; // Light Green - Pleasant
  if (temp < 30) return "#ffff00"; // Yellow - Warm
  if (temp < 35) return "#ffa500"; // Orange - Hot
  if (temp < 40) return "#ff4500"; // Red Orange - Very Hot
  return "#8b0000"; // Dark Red - Extreme Heat
};

export const AdvancedHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapType, setMapType] = useState<"temperature" | "pollution">("temperature");
  const { toast } = useToast();

  const indiaCenter: [number, number] = [20.5937, 78.9629];

  const fetchHeatmapData = async (type: "temperature" | "pollution") => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("india-heatmap", {
        body: { type },
      });

      if (error) throw error;
      setHeatmapData(data.data || []);
      
      toast({
        title: "Heatmap Updated",
        description: `Loaded ${type} data for ${data.data?.length || 0} states`,
      });
    } catch (error: any) {
      console.error("Error fetching heatmap:", error);
      toast({
        title: "Error",
        description: `Failed to load ${type} heatmap`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmapData(mapType);
  }, [mapType]);

  const getMarkerColor = (point: StateData): string => {
    if (mapType === "temperature") {
      return getTemperatureColor(point.temperature || 25);
    } else {
      return point.color || "#ffff00";
    }
  };

  const getMarkerRadius = (point: StateData): number => {
    if (mapType === "temperature") {
      const temp = point.temperature || 25;
      return 15 + (temp / 50) * 20; // Size based on temperature
    } else {
      const aqi = point.aqi || 50;
      return 15 + (aqi / 500) * 25; // Size based on AQI
    }
  };

  return (
    <div className="relative h-full">
      <MapBase center={indiaCenter} zoom={5}>
        {heatmapData.map((point, idx) => (
          <CircleMarker
            key={idx}
            // @ts-ignore
            center={[point.lat, point.lng]}
            // @ts-ignore
            radius={getMarkerRadius(point)}
            pathOptions={{
              fillColor: getMarkerColor(point),
              fillOpacity: 0.7,
              color: "#fff",
              weight: 2,
              stroke: true,
            }}
          >
            <Popup>
              <div className="text-sm space-y-1 p-2">
                <p className="font-bold text-base">{point.name}</p>
                {mapType === "temperature" ? (
                  <>
                    <p className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4" />
                      <span className="font-semibold">
                        {point.temperature?.toFixed(1)}°C
                      </span>
                    </p>
                    <p className="text-muted-foreground">
                      Humidity: {point.humidity}%
                    </p>
                    <p className="text-muted-foreground capitalize">
                      {point.weather}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="flex items-center gap-2">
                      <Wind className="w-4 h-4" />
                      <span className="font-semibold">AQI: {point.aqi}</span>
                    </p>
                    <p 
                      className="font-semibold px-2 py-1 rounded text-white text-xs"
                      style={{ backgroundColor: point.color }}
                    >
                      {point.category}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p>PM2.5: {point.pm25} µg/m³</p>
                      <p>PM10: {point.pm10} µg/m³</p>
                    </div>
                  </>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapBase>

      {/* Controls */}
      <Card className="absolute top-4 right-4 p-4 space-y-3 z-[1000] w-64">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            {mapType === "temperature" ? (
              <Thermometer className="w-4 h-4" />
            ) : (
              <Wind className="w-4 h-4" />
            )}
            {mapType === "temperature" ? "Temperature" : "Air Quality"} Heatmap
          </h3>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setMapType("temperature")}
              disabled={loading}
              variant={mapType === "temperature" ? "default" : "outline"}
              size="sm"
              className="flex-1"
            >
              <Thermometer className="w-3 h-3 mr-1" />
              Temp
            </Button>
            <Button
              onClick={() => setMapType("pollution")}
              disabled={loading}
              variant={mapType === "pollution" ? "default" : "outline"}
              size="sm"
              className="flex-1"
            >
              <Wind className="w-3 h-3 mr-1" />
              AQI
            </Button>
          </div>

          <Button
            onClick={() => fetchHeatmapData(mapType)}
            disabled={loading}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Refresh Data"
            )}
          </Button>
        </div>

        {/* Legend */}
        <div className="pt-3 border-t">
          <p className="text-xs font-semibold mb-2">
            {mapType === "temperature" ? "Temperature Scale" : "AQI Categories"}
          </p>
          <div className="space-y-1">
            {mapType === "temperature" ? (
              <>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#0000ff" }} />
                  {"< 10°C (Cold)"}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#00bfff" }} />
                  {"10-20°C (Cool)"}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#90ee90" }} />
                  {"20-25°C (Pleasant)"}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ffff00" }} />
                  {"25-30°C (Warm)"}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ffa500" }} />
                  {"30-35°C (Hot)"}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ff4500" }} />
                  {"35-40°C (Very Hot)"}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#8b0000" }} />
                  {"> 40°C (Extreme)"}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#00e400" }} />
                  Good (0-50)
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ffff00" }} />
                  Moderate (51-100)
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ff7e00" }} />
                  Unhealthy for Sensitive (101-150)
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ff0000" }} />
                  Unhealthy (151-200)
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#8f3f97" }} />
                  Very Unhealthy (201-300)
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#7e0023" }} />
                  Hazardous (301+)
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
