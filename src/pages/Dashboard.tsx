import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { MapBase } from "@/components/MapBase";
import { CircleMarker, Popup } from "react-leaflet";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle, TrendingUp, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RiskPrediction } from "@/types/disaster";
import { getRiskColor } from "@/utils/riskCalculation";

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeAlerts: 0,
    highRiskZones: 0,
    avgRiskScore: 0,
  });
  const [highRiskPoints, setHighRiskPoints] = useState<RiskPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch alerts
      const { data: alertsData } = await supabase.functions.invoke("alerts");
      const alerts = alertsData?.alerts || [];

      // Fetch heatmap for high-risk zones
      const { data: heatmapData } = await supabase.functions.invoke("heatmap", {
        body: { bbox: "68.1,6.7,97.4,35.5" },
      });
      const heatmap = heatmapData?.heatmap || [];

      const highRisk = heatmap.filter((p: RiskPrediction) => p.level === "High");
      const avgScore =
        heatmap.reduce((sum: number, p: RiskPrediction) => sum + p.score, 0) /
        (heatmap.length || 1);

      setStats({
        activeAlerts: alerts.length,
        highRiskZones: highRisk.length,
        avgRiskScore: Math.round(avgScore * 100) / 100,
      });

      setHighRiskPoints(highRisk.slice(0, 20)); // Show top 20
      
      toast({
        title: "Dashboard Updated",
        description: "Latest statistics loaded",
      });
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">📊 Dashboard</h1>
          <nav className="flex gap-4">
            <Link to="/"><Button variant="ghost" size="sm">Heatmap</Button></Link>
            <Link to="/nearby"><Button variant="ghost" size="sm">Emergency Services</Button></Link>
            <Link to="/alerts"><Button variant="ghost" size="sm">Alerts</Button></Link>
            <Link to="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
            <Link to="/copilot"><Button variant="ghost" size="sm">AI Copilot</Button></Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.activeAlerts}</p>
                    <p className="text-sm text-muted-foreground">Active Alerts</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.highRiskZones}</p>
                    <p className="text-sm text-muted-foreground">High Risk Zones</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.avgRiskScore}</p>
                    <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Map */}
            <Card className="p-4">
              <h2 className="text-xl font-bold mb-4">High Risk Areas</h2>
              <div className="h-[500px]">
                <MapBase center={[20.5937, 78.9629]} zoom={5}>
                  {highRiskPoints.map((point, idx) => (
                    <CircleMarker
                      key={idx}
                      // @ts-ignore - react-leaflet v5 props  
                      center={[point.lat, point.lng]}
                      pathOptions={{
                        radius: 10,
                        fillColor: getRiskColor(point.level),
                        fillOpacity: 0.7,
                        stroke: true,
                        color: "#fff",
                        weight: 2,
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <p className="font-bold text-destructive">High Risk Area</p>
                          <p>Score: {point.score}</p>
                          <p className="text-xs text-muted-foreground">
                            {point.lat.toFixed(2)}, {point.lng.toFixed(2)}
                          </p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapBase>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
