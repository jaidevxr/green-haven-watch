import React, { useState, useEffect } from 'react';
import { GlassCard } from '../GlassCard';
import { RealInteractiveMap } from '../RealInteractiveMap';
import { CloudSun, AlertTriangle, Brain, TrendingUp, MapPin, ThermometerSun } from 'lucide-react';

export const Overview = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    condition: 'Partly Cloudy',
    location: 'India',
    humidity: 65,
    windSpeed: 12
  });
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [riskScore, setRiskScore] = useState(6.2);
  const [monitoredAreas, setMonitoredAreas] = useState(156);
  const [activeSensors, setActiveSensors] = useState(2847);
  const [responseTeams, setResponseTeams] = useState(28);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setWeatherData(prev => ({
        ...prev,
        temperature: 25 + Math.random() * 10,
        humidity: 60 + Math.random() * 20,
        windSpeed: 8 + Math.random() * 15
      }));
      setRiskScore(5 + Math.random() * 3);
      setActiveAlerts(Math.floor(Math.random() * 8) + 1);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Real-time monitoring of environmental conditions and disaster risks
        </p>
      </div>

      {/* Top row - Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GlassCard variant="weather" className="p-6" hover>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CloudSun className="w-5 h-5 text-sky-blue" />
                <span className="text-sm font-medium text-sky-blue">Weather Status</span>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{weatherData.condition}</p>
              <p className="text-sm text-muted-foreground">{Math.round(weatherData.temperature)}°C • {weatherData.location}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-blue/10 flex items-center justify-center">
              <ThermometerSun className="w-6 h-6 text-sky-blue" />
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="disaster" className="p-6" hover>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium text-warning">Active Alerts</span>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{activeAlerts} Active</p>
              <p className="text-sm text-muted-foreground">Live from NDMA</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              ⚠️
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="ai" className="p-6" hover>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-primary-glow" />
                <span className="text-sm font-medium text-primary-glow">AI Risk Score</span>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{riskScore > 7 ? 'High' : riskScore > 4 ? 'Medium' : 'Low'}</p>
              <p className="text-sm text-muted-foreground">{riskScore.toFixed(1)}/10 • Live Analysis</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-glow/10 flex items-center justify-center">
              🧠
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main content row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map - takes up 2 columns */}
        <div className="lg:col-span-2">
          <GlassCard className="p-4 h-[500px]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Disaster Risk Map
              </h3>
              <p className="text-sm text-muted-foreground">
                Interactive map showing current risk areas and monitoring stations
              </p>
            </div>
            <div className="h-[420px]">
              <RealInteractiveMap />
            </div>
          </GlassCard>
        </div>

        {/* Right column - Activity feed */}
        <div className="space-y-4">
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 animate-pulse"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Cyclone Alert</p>
                  <p className="text-xs text-muted-foreground">Bay of Bengal - Tamil Nadu Coast</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Heat Wave Warning</p>
                  <p className="text-xs text-muted-foreground">North India - IMD Alert</p>
                  <p className="text-xs text-muted-foreground">12 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Monsoon Update</p>
                  <p className="text-xs text-muted-foreground">Kerala - Heavy rainfall predicted</p>
                  <p className="text-xs text-muted-foreground">25 minutes ago</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monitored Districts</span>
                <span className="text-sm font-medium text-foreground">{monitoredAreas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Sensors</span>
                <span className="text-sm font-medium text-foreground">{activeSensors.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">NDRF Teams</span>
                <span className="text-sm font-medium text-foreground">{responseTeams}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">System Status</span>
                <span className="text-sm font-medium text-primary">🟢 Online</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};