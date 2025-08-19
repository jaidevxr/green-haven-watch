import React from 'react';
import { GlassCard } from '../GlassCard';
import { CloudSun, Wind, Droplets, Eye, Thermometer, Gauge } from 'lucide-react';

export const Weather = () => {
  const weatherData = {
    location: 'San Francisco, CA',
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    pressure: 30.15,
    uvIndex: 6,
    feelsLike: 75
  };

  const forecast = [
    { day: 'Today', high: 75, low: 62, icon: '☀️', condition: 'Sunny' },
    { day: 'Tomorrow', high: 73, low: 60, icon: '⛅', condition: 'Partly Cloudy' },
    { day: 'Wednesday', high: 70, low: 58, icon: '🌧️', condition: 'Light Rain' },
    { day: 'Thursday', high: 68, low: 56, icon: '☁️', condition: 'Cloudy' },
    { day: 'Friday', high: 74, low: 61, icon: '☀️', condition: 'Sunny' },
  ];

  const weatherStations = [
    { name: 'Golden Gate Park', temp: 68, status: 'Active', distance: '2.3 mi' },
    { name: 'Mission District', temp: 74, status: 'Active', distance: '4.1 mi' },
    { name: 'Presidio', temp: 66, status: 'Active', distance: '3.8 mi' },
    { name: 'Nob Hill', temp: 70, status: 'Maintenance', distance: '1.9 mi' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Weather Monitoring</h2>
        <p className="text-muted-foreground">
          Current conditions and forecasts for disaster preparedness
        </p>
      </div>

      {/* Current weather - Large card */}
      <GlassCard variant="weather" className="p-8 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CloudSun className="w-6 h-6 text-sky-blue" />
              <span className="text-lg font-medium text-sky-blue">Current Weather</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{weatherData.location}</h3>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl font-bold text-foreground">{weatherData.temperature}°</span>
              <div className="text-4xl">☀️</div>
            </div>
            <p className="text-xl text-foreground mb-2">{weatherData.condition}</p>
            <p className="text-muted-foreground">Feels like {weatherData.feelsLike}°F</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50">
              <Wind className="w-5 h-5 text-sky-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Wind Speed</p>
                <p className="text-lg font-semibold text-foreground">{weatherData.windSpeed} mph</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50">
              <Droplets className="w-5 h-5 text-sky-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-lg font-semibold text-foreground">{weatherData.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50">
              <Eye className="w-5 h-5 text-sky-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Visibility</p>
                <p className="text-lg font-semibold text-foreground">{weatherData.visibility} mi</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50">
              <Gauge className="w-5 h-5 text-sky-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Pressure</p>
                <p className="text-lg font-semibold text-foreground">{weatherData.pressure}"</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5-day forecast */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">5-Day Forecast</h3>
          <div className="space-y-3">
            {forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{day.icon}</span>
                  <div>
                    <p className="font-medium text-foreground">{day.day}</p>
                    <p className="text-sm text-muted-foreground">{day.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{day.high}°</p>
                  <p className="text-sm text-muted-foreground">{day.low}°</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Weather stations */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Nearby Weather Stations</h3>
          <div className="space-y-3">
            {weatherStations.map((station, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-card/30 hover:bg-card/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">{station.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      station.status === 'Active' ? 'bg-primary' : 'bg-warning'
                    }`}></span>
                    <p className="text-sm text-muted-foreground">{station.status} • {station.distance}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">{station.temp}°F</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};