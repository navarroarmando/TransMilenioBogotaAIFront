import type {
  OperationalParams,
  GAParams,
  FitnessWeights,
  VisualizationConfig,
  Stop,
  Route,
  KPIs,
  OptimizationResults,
  Execution
} from '../types/optimization.types';

export const mockOperationalParams: OperationalParams = {
  service_hours_start: 4,
  service_hours_end: 20,
  time_slot_interval: 30,
  num_routes_per_slot: 10,
  enable_time_slots: true
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
  enable_dijkstra_decoding: true,
  max_travel_time_min: 90,
  bus_capacity: 80,
  checkpoint_interval: 10,
  log_interval: 5,
  demand_sample_ratio: 1.0,
  demand_filter_threshold: 1.0,
  enable_numpy_vectorization: true,
  enable_spatial_index: true,
  enable_performance_timer: false,
  enable_connectivity_validation: true,
  connectivity_penalty: 1000,
  enable_population_fitness_history: false
};

export const mockFitnessWeights: FitnessWeights = {
  efficiency: 0.35,
  coverage: 0.25,
  equity: 0.20,
  economy: 0.10,
  speed: 0.05,
  transfers: 0.05
};

export const mockVisualizationConfig: VisualizationConfig = {
  visualization_graph: 'integrated_osm',
  enable_visualization: true
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
  mode: 'individual',
  parameters: mockGAParams,
  fitness_weights: mockFitnessWeights,
  results_by_slot: {},
  kpis: mockKPIsAfter,
  duration_seconds: 180
};

export const mockHistory: Execution[] = [
  {
    execution_id: 'EXEC-2024-001',
    timestamp: '2024-01-15T10:30:00Z',
    mode: 'individual',
    status: 'completed',
    duration_seconds: 180,
    parameters: mockGAParams,
    fitness_weights: mockFitnessWeights,
    results_by_slot: {},
    kpis: mockKPIsAfter
  },
  {
    execution_id: 'EXEC-2024-002',
    timestamp: '2024-01-14T14:20:00Z',
    mode: 'individual',
    status: 'under_review',
    duration_seconds: 145,
    parameters: { ...mockGAParams, population_size: 200 },
    fitness_weights: { ...mockFitnessWeights, efficiency: 0.40 },
    results_by_slot: {},
    kpis: mockKPIsAfter
  },
  {
    execution_id: 'EXEC-2024-003',
    timestamp: '2024-01-13T09:15:00Z',
    mode: 'individual',
    status: 'applied',
    duration_seconds: 195,
    parameters: mockGAParams,
    fitness_weights: mockFitnessWeights,
    results_by_slot: {},
    kpis: mockKPIsAfter
  }
];
