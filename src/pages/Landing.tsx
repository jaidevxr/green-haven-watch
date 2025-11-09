import { useState, useEffect } from "react";
import { MapBase } from "@/components/MapBase";
import { CircleMarker, Popup, useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getRiskColor } from "@/utils/riskCalculation";
import { RiskPrediction } from "@/types/disaster";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function Landing() {
  const [heatmapData, setHeatmapData] = useState<RiskPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDistricts, setShowDistricts] = useState(false);
  const [showRivers, setShowRivers] = useState(false);
  const { toast } = useToast();

  const indiaCenter: [number, number] = [20.5937, 78.9629];

  const fetchHeatmap = async () => {
    setLoading(true);
    try {
      // Bounding box for India approximately
      const bbox = "68.1,6.7,97.4,35.5"; // W,S,E,N
      
      const { data, error } = await supabase.functions.invoke("heatmap", {
        body: { bbox },
      });

      if (error) throw error;
      setHeatmapData(data.heatmap || []);
      
      toast({
        title: "Heatmap Updated",
        description: `Loaded ${data.heatmap?.length || 0} risk points`,
      });
    } catch (error: any) {
      console.error("Error fetching heatmap:", error);
      toast({
        title: "Error",
        description: "Failed to load risk heatmap",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmap();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🇮🇳 India Disaster Management</h1>
          <nav className="flex gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">Heatmap</Button>
            </Link>
            <Link to="/nearby">
              <Button variant="ghost" size="sm">Emergency Services</Button>
            </Link>
            <Link to="/alerts">
              <Button variant="ghost" size="sm">Alerts</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link to="/copilot">
              <Button variant="ghost" size="sm">AI Copilot</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative h-[calc(100vh-80px)]">
        {/* Map */}
        <MapBase center={indiaCenter} zoom={5}>
          {heatmapData.map((point, idx) => (
            <CircleMarker
              key={idx}
              // @ts-ignore - react-leaflet v5 props
              center={[point.lat, point.lng]}
              pathOptions={{
                radius: 8,
                fillColor: getRiskColor(point.level),
                fillOpacity: 0.6,
                stroke: false,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{point.level} Risk</p>
                  <p>Score: {point.score}</p>
                  <p className="text-xs text-muted-foreground">
                    {point.lat.toFixed(2)}, {point.lng.toFixed(2)}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapBase>

        {/* Controls */}
        <Card className="absolute top-4 right-4 p-4 space-y-2 z-[1000]">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4" />
            <span className="font-semibold text-sm">Map Layers</span>
          </div>
          
          <Button
            onClick={fetchHeatmap}
            disabled={loading}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Refresh Heatmap"
            )}
          </Button>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showDistricts}
                onChange={(e) => setShowDistricts(e.target.checked)}
                className="rounded"
              />
              District Boundaries
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showRivers}
                onChange={(e) => setShowRivers(e.target.checked)}
                className="rounded"
              />
              Major Rivers
            </label>
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs font-semibold mb-2">Risk Levels</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#10b981" }} />
                Low
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
                Medium
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#dc2626" }} />
                High
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
