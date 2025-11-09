import { RiskFactors, RiskPrediction } from "@/types/disaster";

/**
 * ML-inspired risk calculation (TypeScript implementation)
 * Based on the Python logistic regression model logic
 */
export function calculateRisk(
  factors: RiskFactors,
  lat: number,
  lng: number
): RiskPrediction {
  const { rain_1h, wind_ms, elevation_m, river_km, pop_density } = factors;

  // Normalize factors (0-1 range)
  const rain_n = Math.min(rain_1h / 10, 1);
  const wind_n = Math.min(wind_ms / 20, 1);
  const elev_n = Math.min(elevation_m / 500, 1);
  const river_n = Math.max(0, (5 - river_km) / 5);
  const pop_n = Math.min(pop_density / 20000, 1);

  // Weighted risk score (mimics logistic regression output)
  const score =
    0.35 * rain_n +
    0.25 * wind_n +
    0.25 * (1 - elev_n) +
    0.15 * river_n;

  // Determine risk level
  let level: "Low" | "Medium" | "High";
  let probs: [number, number, number];

  if (score > 0.65) {
    level = "High";
    probs = [0.1, 0.2, 0.7];
  } else if (score > 0.4) {
    level = "Medium";
    probs = [0.2, 0.6, 0.2];
  } else {
    level = "Low";
    probs = [0.7, 0.2, 0.1];
  }

  return {
    score: Math.round(score * 1000) / 1000,
    level,
    probs,
    lat,
    lng,
  };
}

export function getRiskColor(level: string): string {
  switch (level) {
    case "High":
      return "#dc2626";
    case "Medium":
      return "#f59e0b";
    case "Low":
      return "#10b981";
    default:
      return "#6b7280";
  }
}
