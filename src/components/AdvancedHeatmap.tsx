import { useState, useEffect } from "react";
import { MapBase } from "@/components/MapBase";
import { GeoJSON, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Thermometer, Wind } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { indiaStatesGeoJSON } from "@/components/IndiaGeoJSON";
import L from "leaflet";

interface StateData {
  name: string;
  lat: number;
  lng: number;
  code: string;
  temperature?: number;
  humidity?: number;
  weather?: string;
  feelsLike?: number;
  aqi?: number;
  category?: string;
  color?: string;
  pm25?: number;
  pm10?: number;
  stationName?: string;
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

  const getStateColor = (stateName: string): string => {
    const stateData = heatmapData.find(
      d => d.name === stateName || d.code === stateName
    );
    
    if (!stateData) return "#cccccc";
    return getMarkerColor(stateData);
  };

  const onEachFeature = (feature: any, layer: any) => {
    const stateName = feature.properties.name;
    const stateData = heatmapData.find(d => d.name === stateName);
    
    if (stateData) {
      layer.bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${stateData.name}</h3>
          ${mapType === "temperature" ? `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-size: 24px; font-weight: 700; color: ${getMarkerColor(stateData)};">
                ${stateData.temperature}°C
              </span>
            </div>
            <p style="margin: 4px 0; font-size: 13px; color: #666;">
              Feels like: ${stateData.feelsLike}°C
            </p>
            <p style="margin: 4px 0; font-size: 13px; color: #666;">
              Humidity: ${stateData.humidity}%
            </p>
            <p style="margin: 4px 0; font-size: 13px; color: #666; text-transform: capitalize;">
              ${stateData.weather}
            </p>
          ` : `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-size: 24px; font-weight: 700;">AQI: ${stateData.aqi}</span>
            </div>
            <p style="margin: 4px 0; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; color: white; background-color: ${stateData.color}; display: inline-block;">
              ${stateData.category}
            </p>
            <p style="margin: 4px 0; font-size: 13px; color: #666;">
              PM2.5: ${stateData.pm25} µg/m³
            </p>
            <p style="margin: 4px 0; font-size: 13px; color: #666;">
              PM10: ${stateData.pm10} µg/m³
            </p>
            <p style="margin: 4px 0; font-size: 11px; color: #999;">
              Station: ${stateData.stationName}
            </p>
          `}
        </div>
      `);
    }
    
    layer.on({
      mouseover: () => {
        layer.setStyle({ weight: 3, fillOpacity: 0.9 });
      },
      mouseout: () => {
        layer.setStyle({ weight: 1.5, fillOpacity: 0.7 });
      }
    });
  };

  return (
    <div className="relative h-full">
      <MapBase center={indiaCenter} zoom={5}>
        {heatmapData.length > 0 && (
          <GeoJSON
            // @ts-ignore
            data={indiaStatesGeoJSON}
            // @ts-ignore
            style={(feature) => ({
              fillColor: getStateColor(feature?.properties?.name || ""),
              weight: 1.5,
              opacity: 1,
              color: '#ffffff',
              fillOpacity: 0.7
            })}
            // @ts-ignore
            onEachFeature={onEachFeature}
          />
        )}
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
