import type {
  OperationalParams,
  GAParams,
  FitnessWeights,
  VisualizationConfig,
  BusinessConfig,
  ParallelConfig,
  OutputConfig,
  Stop,
  Route,
  KPIs,
  OptimizationResults,
  Execution
} from '../types/optimization.types';

export const mockOperationalParams: OperationalParams = {
  service_hours_start: 6,
  service_hours_end: 12,
  time_slot_interval: 120,
  num_routes_per_slot: 10,
  enable_time_slots: false
};

export const mockGAParams: GAParams = {
  population_size: 10,
  generations: 10,
  mutation_rate: 0.1,
  crossover_rate: 0.8,
  elitism_count: 1,
  tournament_size: 3,
  min_route_length: 5,
  max_route_length: 100,
  distance_bias_km: [
    { min: 15, max: 25, weight: 0.1 },
    { min: 25, max: 35, weight: 1.0 },
    { min: 35, max: 50, weight: 2.0 }
  ],
  enable_dijkstra_decoding: false,
  max_travel_time_min: 120,
  bus_capacity: 80,
  checkpoint_interval: 10,
  log_interval: 5,
  demand_sample_ratio: 0.0,
  demand_filter_threshold: 0,
  enable_numpy_vectorization: true,
  enable_spatial_index: false,
  enable_performance_timer: false,
  enable_connectivity_validation: true,
  connectivity_penalty: 0,
  enable_population_fitness_history: true
};

export const mockFitnessWeights: FitnessWeights = {
  efficiency: 0.15,
  economy: 0.10,
  equity: 0.05,
  coverage: 0.10,
  transfers: 0.05,
  speed: 0.05,
  speed_max: 0.10,
  road_capacity: 0.10,
  road_class: 0.10,
  travel_time_real: 0.10,
  operating_cost: 0.05,
  frequency: 0.05,
  accessibility: 0.05,
  bus_type_compatibility: 0.05,
  population_density: 0.05,
  redundancy: 0.0
};

export const mockBusinessConfig: BusinessConfig = {
  morning_peak_start: 6,
  morning_peak_end: 9,
  afternoon_peak_start: 17,
  afternoon_peak_end: 20,
  peak_hour_speed_factor: 0.6,
  urban_default_speed: 30.0,
  highway_default_speed: 60.0,
  trunk_default_speed: 50.0,
  residential_default_speed: 20.0,
  max_speed: 80.0,
  crs_target: "EPSG:3116",
  crs_source: "EPSG:4326",
  min_stops: 2,
  max_stops: 50,
  min_routes_per_stop: 1,
  max_distance: 50.0,
  min_distance: 2.0,
  demand_default: 0.0,
  demand_min_threshold: 1.0,
  demand_max_threshold: 10000.0,
  demand_peak_hour_factor: 1.5,
  stratification_default: 2.5,
  stratification_buckets: null,
  stratification_weights: null,
  max_transfers: 3,
  transfer_average_time: 10,
  coverage_stop_radius: 500,
  coverage_min: 80.0,
  coverage_target: 95.0
};

export const mockParallelConfig: ParallelConfig = {
  enable_monitoring: true,
  monitoring_interval: 10.0,
  adjustment_cooldown: 10.0,
  log_resource_usage: true,
  max_cpu_percent: 95.0,
  max_memory_percent: 95.0,
  max_memory_mb: undefined,
  throttle_on_limit: true,
  throttle_factor: 0.5,
  num_workers: 16,
  enable_dynamic_workers: false,
  min_workers: 2,
  max_workers: 15,
  ideal_workers: 8,
  consecutive_threshold: 2,
  ideal_cpu_percent: 70.0,
  ideal_memory_percent: 70.0,
  prolonged_usage_threshold: 300.0
};

export const mockOutputConfig: OutputConfig = {
  save_suggested_routes: true,
  save_population: false,
  save_fitness_history: true,
  output_dir: 'models'
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
  execution: {
    id: '1',
    execution_id: 'EXEC-2024-001',
    mode: 'individual',
    status: 'completed',
    progress: 100,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:33:00Z',
    duration_seconds: 180
  },
  parameters: mockGAParams,
  fitness_weights: mockFitnessWeights,
  results_by_slot: {},
  kpis: mockKPIsAfter
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
