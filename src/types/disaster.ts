export interface RiskFactors {
  rain_1h: number;
  wind_ms: number;
  elevation_m: number;
  river_km: number;
  pop_density: number;
}

export interface RiskPrediction {
  score: number;
  level: "Low" | "Medium" | "High";
  probs: [number, number, number];
  lat: number;
  lng: number;
}

export interface EmergencyService {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  distance: number;
  address?: string;
}

export interface DisasterAlert {
  id: string;
  title: string;
  type: string;
  severity: string;
  date: string;
  location: string;
  description: string;
  coordinates?: [number, number];
}

export interface WeatherData {
  temperature: number;
  wind_speed: number;
  rainfall: number;
  humidity: number;
  conditions: string;
}
