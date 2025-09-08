import React, { useState, useEffect } from 'react';
import { GlassCard } from '../GlassCard';
import { RealInteractiveMap } from '../RealInteractiveMap';
import { DisasterGraphs } from '../charts/DisasterGraphs';
import { WeatherGraphs } from '../charts/WeatherGraphs';
import { EmergencyShelter } from '../EmergencyShelter';
import { TrendingUp } from 'lucide-react';

export const Overview = () => {
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'Cyclone Alert',
      location: 'Bay of Bengal - Tamil Nadu Coast',
      time: '5 minutes ago',
      severity: 'high',
      source: 'https://imd.gov.in'
    },
    {
      id: 2,
      type: 'Heat Wave Warning',
      location: 'North India - IMD Alert',
      time: '12 minutes ago',
      severity: 'medium',
      source: 'https://imd.gov.in'
    },
    {
      id: 3,
      type: 'Monsoon Update',
      location: 'Kerala - Heavy rainfall predicted',
      time: '25 minutes ago',
      severity: 'low',
      source: 'https://imd.gov.in'
    }
  ]);

  useEffect(() => {
    // Fetch real-time activity updates
    const interval = setInterval(() => {
      // In production, this would fetch from NDMA/IMD APIs
      fetchLatestActivity();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const fetchLatestActivity = async () => {
    // Simulate fetching latest disaster activity
    // In production, integrate with government APIs
    console.log('Fetching latest disaster activity...');
  };

  const handleActivityClick = (activity: any) => {
    window.open(activity.source, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Real-Time Disaster Monitoring</h2>
        <p className="text-muted-foreground">
          Live data from IMD, NDMA, and state government sources
        </p>
      </div>

      {/* Disaster Analytics Section */}
      <div className="space-y-6">
        <DisasterGraphs />
      </div>

      {/* Weather Analytics Section */}
      <div className="space-y-6">
        <WeatherGraphs />
      </div>

      {/* Main content row - Map and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map - takes up 2 columns */}
        <div className="lg:col-span-2">
          <GlassCard className="p-4 h-[500px]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Interactive Risk Map
              </h3>
              <p className="text-sm text-muted-foreground">
                Live monitoring stations and risk areas across India
              </p>
            </div>
            <div className="h-[420px]">
              <RealInteractiveMap />
            </div>
          </GlassCard>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 h-[500px]">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Live Alerts</h3>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[400px]">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  onClick={() => handleActivityClick(activity)}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.severity === 'high' ? 'bg-destructive animate-pulse' : 
                    activity.severity === 'medium' ? 'bg-warning' : 'bg-primary'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.type}</p>
                    <p className="text-xs text-muted-foreground">{activity.location}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Emergency Shelters */}
        <div className="lg:col-span-1">
          <div className="h-[500px] overflow-y-auto">
            <EmergencyShelter />
          </div>
        </div>
      </div>
    </div>
  );
};