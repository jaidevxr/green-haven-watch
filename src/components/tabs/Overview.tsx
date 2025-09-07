import React from 'react';
import { GlassCard } from '../GlassCard';
import { RealInteractiveMap } from '../RealInteractiveMap';
import { CloudSun, AlertTriangle, Brain, TrendingUp } from 'lucide-react';

export const Overview = () => {
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
              <p className="text-2xl font-bold text-foreground mb-1">Partly Cloudy</p>
              <p className="text-sm text-muted-foreground">72°F • San Francisco</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-blue/10 flex items-center justify-center">
              ☀️
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
              <p className="text-2xl font-bold text-foreground mb-1">3 Warnings</p>
              <p className="text-sm text-muted-foreground">2 High • 1 Medium</p>
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
              <p className="text-2xl font-bold text-foreground mb-1">Medium</p>
              <p className="text-sm text-muted-foreground">6.2/10 • Trending down</p>
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
                <div className="w-2 h-2 rounded-full bg-destructive mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Wildfire Alert</p>
                  <p className="text-xs text-muted-foreground">San Francisco Bay Area</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Weather Update</p>
                  <p className="text-xs text-muted-foreground">High winds detected</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">AI Prediction</p>
                  <p className="text-xs text-muted-foreground">Risk assessment updated</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monitored Areas</span>
                <span className="text-sm font-medium text-foreground">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Sensors</span>
                <span className="text-sm font-medium text-foreground">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Response Teams</span>
                <span className="text-sm font-medium text-foreground">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Uptime</span>
                <span className="text-sm font-medium text-primary">99.9%</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};