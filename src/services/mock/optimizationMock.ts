import type {
  OperationalParams,
  GAParams,
  FitnessWeights,
  Stop,
  Route,
  KPIs,
  OptimizationResults,
  Execution
} from '../types/optimization.types';

export const mockOperationalParams: OperationalParams = {
  service_hours_start: 4,
  service_hours_end: 20,
  morning_peak_start: 6,
  morning_peak_end: 9,
  afternoon_peak_start: 17,
  afternoon_peak_end: 20,
  bus_capacity: 80,
  max_travel_time_min: 90,
  min_stops: 2,
  max_stops: 50,
  min_distance_km: 2,
  max_distance_km: 50,
  stop_radius_m: 500,
  target_coverage_pct: 95
};

export const mockGAParams: GAParams = {
  population_size: 300,
  generations: 300,
  mutation_rate: 0.1,
  crossover_rate: 0.8,
  elitism_count: 2,
  tournament_size: 5,
  min_route_length: 15,
  max_route_length: 60,
  distance_bias_km: 30,
  enable_dijkstra: true
};

export const mockFitnessWeights: FitnessWeights = {
  efficiency: 0.35,
  coverage: 0.25,
  equity: 0.20,
  economy: 0.10,
  speed: 0.05,
  transfers: 0.05
};

export const mockStops: Stop[] = [
  { id: '1', name: 'Terminal Salida', lat: 10.463, lng: -73.25, demand: 1200, stratum: 2 },
  { id: '2', name: 'Centro', lat: 10.465, lng: -73.255, demand: 2500, stratum: 3 },
  { id: '3', name: 'Barrio Norte', lat: 10.468, lng: -73.26, demand: 800, stratum: 1 },
  { id: '4', name: 'Industrial', lat: 10.46, lng: -73.245, demand: 1500, stratum: 4 },
  { id: '5', name: 'Universidad', lat: 10.47, lng: -73.27, demand: 900, stratum: 2 },
  { id: '6', name: 'Hospital', lat: 10.462, lng: -73.252, demand: 600, stratum: 3 },
  { id: '7', name: 'Mercado', lat: 10.466, lng: -73.258, demand: 1100, stratum: 2 },
  { id: '8', name: 'Estadio', lat: 10.464, lng: -73.265, demand: 700, stratum: 3 }
];

export const mockRoutes: Route[] = [
  {
    id: 'R001',
    name: 'Ruta 1 - Circular Centro',
    stops: [mockStops[0], mockStops[1], mockStops[2], mockStops[5], mockStops[0]],
    total_distance_km: 12.5,
    total_travel_time_min: 45,
    demand_served: 4500,
    fitness_score: 0.85
  },
  {
    id: 'R002',
    name: 'Ruta 2 - Norte-Sur',
    stops: [mockStops[2], mockStops[1], mockStops[3], mockStops[6]],
    total_distance_km: 18.3,
    total_travel_time_min: 55,
    demand_served: 3800,
    fitness_score: 0.78
  },
  {
    id: 'R003',
    name: 'Ruta 3 - Universitaria',
    stops: [mockStops[4], mockStops[1], mockStops[5], mockStops[6]],
    total_distance_km: 15.7,
    total_travel_time_min: 48,
    demand_served: 3200,
    fitness_score: 0.82
  }
];

export const mockKPIsBefore: KPIs = {
  total_demand_served: 85000,
  avg_travel_time_min: 52,
  total_distance_km: 450,
  coverage_pct: 72,
  equity_score: 0.65,
  operating_cost: 18500000,
  fleet_utilization: 0.45
};

export const mockKPIsAfter: KPIs = {
  total_demand_served: 125000,
  avg_travel_time_min: 38,
  total_distance_km: 520,
  coverage_pct: 89,
  equity_score: 0.82,
  operating_cost: 16200000,
  fleet_utilization: 0.72
};

export const mockOptimizationResults: OptimizationResults = {
  execution_id: 'EXEC-2024-001',
  timestamp: '2024-01-15T10:30:00Z',
  params: {
    operational: mockOperationalParams,
    ga: mockGAParams,
    fitness_weights: mockFitnessWeights
  },
  routes: mockRoutes,
  kpis: mockKPIsAfter,
  comparison: {
    before: mockKPIsBefore,
    after: mockKPIsAfter,
    variation: {
      total_demand_served: 47.1,
      avg_travel_time_min: -26.9,
      total_distance_km: 15.6,
      coverage_pct: 23.6,
      equity_score: 26.2,
      operating_cost: -12.4,
      fleet_utilization: 60.0
    }
  }
};

export const mockHistory: Execution[] = [
  {
    id: 'EXEC-2024-001',
    timestamp: '2024-01-15T10:30:00Z',
    params: {
      operational: mockOperationalParams,
      ga: mockGAParams,
      fitness_weights: mockFitnessWeights
    },
    results: mockOptimizationResults,
    status: 'completed',
    duration_seconds: 180
  },
  {
    id: 'EXEC-2024-002',
    timestamp: '2024-01-14T14:20:00Z',
    params: {
      operational: { ...mockOperationalParams, bus_capacity: 100 },
      ga: { ...mockGAParams, population_size: 200 },
      fitness_weights: { ...mockFitnessWeights, efficiency: 0.40 }
    },
    results: mockOptimizationResults,
    status: 'under_review',
    duration_seconds: 145
  },
  {
    id: 'EXEC-2024-003',
    timestamp: '2024-01-13T09:15:00Z',
    params: {
      operational: mockOperationalParams,
      ga: mockGAParams,
      fitness_weights: mockFitnessWeights
    },
    results: mockOptimizationResults,
    status: 'applied',
    duration_seconds: 195
  }
];
