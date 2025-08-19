import React from 'react';
import { GlassCard } from '../GlassCard';
import { AlertTriangle, Flame, Waves, Zap, Mountain } from 'lucide-react';

export const Disasters = () => {
  const activeAlerts = [
    {
      id: 1,
      type: 'Wildfire',
      location: 'San Francisco Bay Area',
      severity: 'High',
      icon: '🔥',
      time: '2 minutes ago',
      description: 'High wildfire risk due to dry conditions and strong winds. Evacuation advisory in effect.',
      affected: '12,000 residents',
      status: 'Active'
    },
    {
      id: 2,
      type: 'Flood Warning',
      location: 'Houston, TX',
      severity: 'Medium',
      icon: '🌊',
      time: '15 minutes ago',
      description: 'Flash flood warning due to heavy rainfall. Avoid low-lying areas.',
      affected: '8,500 residents',
      status: 'Active'
    },
    {
      id: 3,
      type: 'Severe Weather',
      location: 'Oklahoma City, OK',
      severity: 'Medium',
      icon: '⛈️',
      time: '1 hour ago',
      description: 'Severe thunderstorm warning with possible tornado activity.',
      affected: '25,000 residents',
      status: 'Monitoring'
    },
  ];

  const recentHistory = [
    {
      id: 4,
      type: 'Earthquake',
      location: 'Los Angeles, CA',
      severity: 'Low',
      magnitude: '3.2',
      time: '2 hours ago',
      status: 'Resolved'
    },
    {
      id: 5,
      type: 'Heat Wave',
      location: 'Phoenix, AZ',
      severity: 'Medium',
      temperature: '115°F',
      time: '1 day ago',
      status: 'Resolved'
    },
    {
      id: 6,
      type: 'Winter Storm',
      location: 'Denver, CO',
      severity: 'High',
      snowfall: '18 inches',
      time: '3 days ago',
      status: 'Resolved'
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'primary';
      default:
        return 'muted';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-destructive/10 text-destructive';
      case 'Medium':
        return 'bg-warning/10 text-warning';
      case 'Low':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Disaster Monitoring</h2>
        <p className="text-muted-foreground">
          Active alerts and recent disaster activity across monitored regions
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <GlassCard className="p-4 text-center">
          <div className="text-2xl mb-2">🚨</div>
          <p className="text-2xl font-bold text-destructive">3</p>
          <p className="text-sm text-muted-foreground">Active Alerts</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl mb-2">👥</div>
          <p className="text-2xl font-bold text-foreground">45.5K</p>
          <p className="text-sm text-muted-foreground">People Affected</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl mb-2">🚁</div>
          <p className="text-2xl font-bold text-primary">8</p>
          <p className="text-sm text-muted-foreground">Response Teams</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl mb-2">⏰</div>
          <p className="text-2xl font-bold text-warning">24h</p>
          <p className="text-sm text-muted-foreground">Avg Response</p>
        </GlassCard>
      </div>

      {/* Active alerts */}
      <GlassCard variant="disaster" className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-6 h-6 text-destructive" />
          <h3 className="text-xl font-semibold text-foreground">Active Disaster Alerts</h3>
        </div>
        <div className="space-y-4">
          {activeAlerts.map((alert) => (
            <div key={alert.id} className="p-4 rounded-xl bg-card/50 border border-glass-border hover:bg-card/70 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{alert.icon}</div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-foreground">{alert.type}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBg(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-foreground font-medium mb-1">{alert.location}</p>
                    <p className="text-muted-foreground text-sm mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>👥 {alert.affected}</span>
                      <span>🕒 {alert.time}</span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recent history */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Recent Disaster History</h3>
        <div className="space-y-3">
          {recentHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-card/30 hover:bg-card/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted/20 flex items-center justify-center">
                  {item.type === 'Earthquake' && '🏔️'}
                  {item.type === 'Heat Wave' && '🌡️'}
                  {item.type === 'Winter Storm' && '❄️'}
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.type}</p>
                  <p className="text-sm text-muted-foreground">{item.location}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBg(item.severity)}`}>
                  {item.severity}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};