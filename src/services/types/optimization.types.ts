export interface OperationalParams {
  service_hours_start: number;
  service_hours_end: number;
  morning_peak_start: number;
  morning_peak_end: number;
  afternoon_peak_start: number;
  afternoon_peak_end: number;
  bus_capacity: number;
  max_travel_time_min: number;
  min_stops: number;
  max_stops: number;
  min_distance_km: number;
  max_distance_km: number;
  stop_radius_m: number;
  target_coverage_pct: number;
  time_windows: number;
}

export interface GAParams {
  population_size: number;
  generations: number;
  mutation_rate: number;
  crossover_rate: number;
  elitism_count: number;
  tournament_size: number;
  min_route_length: number;
  max_route_length: number;
  distance_bias_km: number;
  enable_dijkstra: boolean;
}

export interface FitnessWeights {
  efficiency: number;
  coverage: number;
  equity: number;
  economy: number;
  speed: number;
  transfers: number;
}

export interface OptimizationParams {
  operational: OperationalParams;
  ga: GAParams;
  fitness_weights: FitnessWeights;
}

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  demand: number;
  stratum: number;
}

export interface Route {
  id: string;
  name: string;
  stops: Stop[];
  total_distance_km: number;
  total_travel_time_min: number;
  demand_served: number;
  fitness_score: number;
}

export interface KPIs {
  total_demand_served: number;
  avg_travel_time_min: number;
  total_distance_km: number;
  coverage_pct: number;
  equity_score: number;
  operating_cost: number;
  fleet_utilization: number;
}

export interface OptimizationResults {
  execution_id: string;
  timestamp: string;
  params: OptimizationParams;
  routes: Route[];
  kpis: KPIs;
  comparison: {
    before: KPIs;
    after: KPIs;
    variation: Record<string, number>;
  };
}

export interface Execution {
  id: string;
  timestamp: string;
  params: OptimizationParams;
  results: OptimizationResults;
  status: 'completed' | 'failed' | 'under_review' | 'applied' | 'discarded';
  duration_seconds: number;
}
