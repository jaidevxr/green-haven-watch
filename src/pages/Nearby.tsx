import { useState, useEffect } from "react";
import { MapBase } from "@/components/MapBase";
import { Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmergencyService } from "@/types/disaster";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Navigation, Hospital, Shield, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function Nearby() {
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["hospital", "police", "fire_station"]);
  const { toast } = useToast();

  const getUserLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        fetchNearbyServices(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location Error",
          description: "Unable to get your location. Using default location.",
          variant: "destructive",
        });
        // Default to Delhi
        const defaultLoc: [number, number] = [28.6139, 77.2090];
        setUserLocation(defaultLoc);
        fetchNearbyServices(defaultLoc[0], defaultLoc[1]);
      }
    );
  };

  const fetchNearbyServices = async (lat: number, lng: number) => {
    try {
      const { data, error } = await supabase.functions.invoke("nearby", {
        body: { lat, lng, types: selectedTypes.join(",") },
      });

      if (error) throw error;
      setServices(data.services || []);
      
      toast({
        title: "Services Found",
        description: `Found ${data.services?.length || 0} nearby emergency services`,
      });
    } catch (error: any) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to load emergency services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "hospital":
        return <Hospital className="w-4 h-4" />;
      case "police":
        return <Shield className="w-4 h-4" />;
      case "fire_station":
        return <Flame className="w-4 h-4" />;
      default:
        return <Navigation className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🚨 Emergency Services</h1>
          <nav className="flex gap-4">
            <Link to="/"><Button variant="ghost" size="sm">Heatmap</Button></Link>
            <Link to="/nearby"><Button variant="ghost" size="sm">Emergency Services</Button></Link>
            <Link to="/alerts"><Button variant="ghost" size="sm">Alerts</Button></Link>
            <Link to="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
            <Link to="/copilot"><Button variant="ghost" size="sm">AI Copilot</Button></Link>
          </nav>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-96 bg-card border-r p-4 overflow-y-auto">
          <div className="mb-4">
            <Button
              onClick={getUserLocation}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Finding...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Find Nearby Services
                </>
              )}
            </Button>
          </div>

          {/* Service Type Filters */}
          <div className="mb-4 space-y-2">
            <p className="font-semibold text-sm">Filter by Type:</p>
            {[
              { id: "hospital", label: "Hospitals", icon: <Hospital className="w-4 h-4" /> },
              { id: "police", label: "Police", icon: <Shield className="w-4 h-4" /> },
              { id: "fire_station", label: "Fire Stations", icon: <Flame className="w-4 h-4" /> },
            ].map(({ id, label, icon }) => (
              <label key={id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTypes([...selectedTypes, id]);
                    } else {
                      setSelectedTypes(selectedTypes.filter((t) => t !== id));
                    }
                  }}
                  className="rounded"
                />
                {icon}
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>

          {/* Services List */}
          <div className="space-y-2">
            <p className="font-semibold text-sm mb-2">
              Nearby Services ({services.length})
            </p>
            {services.map((service) => (
              <Card key={service.id} className="p-3 hover:bg-accent cursor-pointer">
                <div className="flex items-start gap-2">
                  {getServiceIcon(service.type)}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {service.distance.toFixed(2)} km away
                    </p>
                    {service.address && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {service.address}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1">
          <MapBase
            center={userLocation || [20.5937, 78.9629]}
            zoom={userLocation ? 13 : 5}
          >
            {userLocation && (
              <Marker
                // @ts-ignore - react-leaflet v5 props
                position={userLocation}
              >
                <Popup>Your Location</Popup>
              </Marker>
            )}
            {services.map((service) => (
              <Marker
                key={service.id}
                // @ts-ignore - react-leaflet v5 props
                position={[service.lat, service.lng]}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">{service.name}</p>
                    <p className="text-xs">{service.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {service.distance.toFixed(2)} km away
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapBase>
        </div>
      </div>
    </div>
  );
}
