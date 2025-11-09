import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisasterAlert } from "@/types/disaster";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function Alerts() {
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const { toast } = useToast();

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("alerts");

      if (error) throw error;
      setAlerts(data.alerts || []);
      
      toast({
        title: "Alerts Updated",
        description: `Loaded ${data.alerts?.length || 0} active disaster alerts`,
      });
    } catch (error: any) {
      console.error("Error fetching alerts:", error);
      toast({
        title: "Error",
        description: "Failed to load disaster alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    const matchType = filterType === "all" || alert.type === filterType;
    const matchSeverity = filterSeverity === "all" || alert.severity === filterSeverity;
    return matchType && matchSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
      case "red":
        return "destructive";
      case "medium":
      case "orange":
        return "default";
      case "low":
      case "green":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">⚠️ Disaster Alerts</h1>
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
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Button onClick={fetchAlerts} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Alerts
              </>
            )}
          </Button>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Types</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Flood">Flood</option>
            <option value="Cyclone">Cyclone</option>
            <option value="Drought">Drought</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlerts.length === 0 ? (
            <Card className="col-span-full p-8 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {loading ? "Loading alerts..." : "No active alerts found"}
              </p>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Card key={alert.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{alert.type}</span>
                </div>
                
                <h3 className="font-bold text-lg mb-2">{alert.title}</h3>
                
                <p className="text-sm text-muted-foreground mb-2">
                  📍 {alert.location}
                </p>
                
                <p className="text-sm mb-3">{alert.description}</p>
                
                <p className="text-xs text-muted-foreground">
                  {new Date(alert.date).toLocaleString()}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
