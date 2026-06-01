export interface OperationalParams {
  service_hours_start: number;
  service_hours_end: number;
  time_slot_interval: number;
  num_routes_per_slot: number;
  enable_time_slots: boolean;
}

export interface BusinessConfig {
  morning_peak_start?: number;
  morning_peak_end?: number;
  afternoon_peak_start?: number;
  afternoon_peak_end?: number;
  peak_hour_speed_factor?: number;
  urban_default_speed?: number;
  highway_default_speed?: number;
  trunk_default_speed?: number;
  residential_default_speed?: number;
  max_speed?: number;
  crs_target?: string;
  crs_source?: string;
  min_stops?: number;
  max_stops?: number;
  min_routes_per_stop?: number;
  max_distance?: number;
  min_distance?: number;
  demand_default?: number;
  demand_min_threshold?: number;
  demand_max_threshold?: number;
  demand_peak_hour_factor?: number;
  stratification_default?: number;
  stratification_buckets?: number | null;
  stratification_weights?: number[] | null;
  max_transfers?: number;
  transfer_average_time?: number;
  coverage_stop_radius?: number;
  coverage_min?: number;
  coverage_target?: number;
}

export interface DistanceBiasRange {
  min: number;
  max: number;
  weight: number;
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
  distance_bias_km: DistanceBiasRange[];
  enable_dijkstra_decoding: boolean;
  max_travel_time_min: number;
  bus_capacity: number;
  checkpoint_interval: number;
  log_interval: number;
  demand_sample_ratio: number;
  demand_filter_threshold: number;
  enable_numpy_vectorization: boolean;
  enable_spatial_index: boolean;
  enable_performance_timer: boolean;
  enable_connectivity_validation: boolean;
  connectivity_penalty: number;
  enable_population_fitness_history?: boolean;
}

export interface FitnessWeights {
  efficiency: number;
  economy: number;
  equity: number;
  coverage: number;
  transfers: number;
  speed: number;
  speed_max: number;
  road_capacity: number;
  road_class: number;
  travel_time_real: number;
  operating_cost: number;
  frequency: number;
  accessibility: number;
  bus_type_compatibility: number;
  population_density: number;
  redundancy: number;
}

export interface ParallelConfig {
  enable_monitoring?: boolean;
  monitoring_interval?: number;
  adjustment_cooldown?: number;
  log_resource_usage?: boolean;
  max_cpu_percent?: number;
  max_memory_percent?: number;
  max_memory_mb?: number;
  throttle_on_limit?: boolean;
  throttle_factor?: number;
  num_workers?: number;
  enable_dynamic_workers?: boolean;
  min_workers?: number;
  max_workers?: number;
  ideal_workers?: number;
  consecutive_threshold?: number;
  ideal_cpu_percent?: number;
  ideal_memory_percent?: number;
  prolonged_usage_threshold?: number;
}

export interface OutputConfig {
  save_suggested_routes?: boolean;
  save_population?: boolean;
  save_fitness_history?: boolean;
  output_dir?: string;
}

export interface VisualizationConfig {
  visualization_graph: string;
  enable_visualization: boolean;
}

export interface OptimizationParams {
  mode: string;
  parameters: GAParams;
  fitness_weights: FitnessWeights;
  operational: OperationalParams;
  business_config?: BusinessConfig;
  parallel_config?: ParallelConfig;
  output_config?: OutputConfig;
  visualization_config?: VisualizationConfig;
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
  // KPIs de negocio
  total_demand_served: number;
  avg_travel_time_min: number;
  total_distance_km: number;
  coverage_pct: number;
  equity_score: number;
  operating_cost: number;
  fleet_utilization: number;
  
  // KPIs del algoritmo genético
  convergence_generation?: number;
  initial_fitness?: number;
  fitness_improvement?: number;
  fitness_improvement_pct?: number;
  avg_fitness_population?: number;
  worst_fitness?: number;
  population_diversity?: number;
  num_routes_generated?: number;
  avg_stops_per_route?: number;
  time_per_generation?: number;
  effective_mutation_rate?: number;
  effective_crossover_rate?: number;
  last_checkpoint?: string;
  completed_time_slots?: number;
  avg_fitness_per_slot?: number;
  
  // Métricas avanzadas del AG
  fitness_history_json?: string;
  hamming_distance_avg?: number;
  genetic_entropy?: number;
  selection_pressure?: number;
  convergence_rate?: number;
  generations_to_threshold?: number;
  hypervolume?: number;
  spacing_metric?: number;
}

export interface ExecutionInfo {
  id: string;
  execution_id: string;
  mode: string;
  status: string;
  progress: number;
  current_generation?: number;
  total_generations?: number;
  current_time_slot?: number;
  total_time_slots?: number;
  best_fitness?: number;
  started_at?: string;
  completed_at?: string;
  estimated_completion?: string;
  duration_seconds?: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
  // KPIs del algoritmo genético (incluidos aquí para facilitar el acceso)
  convergence_generation?: number;
  initial_fitness?: number;
  fitness_improvement?: number;
  fitness_improvement_pct?: number;
  avg_fitness_population?: number;
  worst_fitness?: number;
  population_diversity?: number;
  num_routes_generated?: number;
  avg_stops_per_route?: number;
  time_per_generation?: number;
  effective_mutation_rate?: number;
  effective_crossover_rate?: number;
  last_checkpoint?: string;
  completed_time_slots?: number;
  avg_fitness_per_slot?: number;
  hamming_distance_avg?: number;
  genetic_entropy?: number;
  selection_pressure?: number;
  convergence_rate?: number;
  generations_to_threshold?: number;
  hypervolume?: number;
  spacing_metric?: number;
  population_size?: number;
}

export interface GAConfig {
  population_size: number;
  generations: number;
  mutation_rate: number;
  crossover_rate: number;
  elitism_count: number;
  tournament_size: number;
  min_route_length: number;
  max_route_length: number;
  distance_bias_km: any;
  enable_dijkstra_decoding: boolean;
  max_travel_time_min: number;
  fitness_weight_efficiency: number;
  fitness_weight_economy: number;
  fitness_weight_equity: number;
  fitness_weight_coverage: number;
  fitness_weight_transfers: number;
  fitness_weight_speed: number;
}

export interface OperationalConfig {
  bus_capacity: number;
  service_hours_start: number;
  service_hours_end: number;
  time_slot_interval: number;
  num_routes_per_slot: number;
  enable_time_slots: boolean;
}

export interface TechnicalConfig {
  checkpoint_interval: number;
  log_interval: number;
  demand_sample_ratio: number;
  demand_filter_threshold: number;
  enable_numpy_vectorization: boolean;
  enable_spatial_index: boolean;
  enable_performance_timer: boolean;
  visualization_graph: string;
  enable_visualization: boolean;
  num_workers: number;
  output_dir: string;
}

export interface OptimizationResults {
  execution: ExecutionInfo;
  ga_config?: GAConfig;
  operational_config?: OperationalConfig;
  technical_config?: TechnicalConfig;
  parameters?: Record<string, any>;
  fitness_weights?: Record<string, any>;
  results_by_slot: Record<string, any>;
  kpis: KPIs;
  route_stops?: Array<Record<string, any>>;
}

export interface Execution {
  execution_id: string;
  timestamp: string;
  mode: string;
  status: string;
  progress?: number;
  current_generation?: number;
  total_generations?: number;
  current_time_slot?: number;
  total_time_slots?: number;
  best_fitness?: number;
  started_at?: string;
  estimated_completion?: string;
  error_message?: string;
  parameters?: Record<string, any>;
  fitness_weights?: Record<string, any>;
  results_by_slot?: Record<string, any>;
  kpis?: Record<string, any>;
  duration_seconds?: number;
  population_size?: number;
}

export interface OptimizationStartRequest {
  config: OptimizationParams;
}

export interface OptimizationStartResponse {
  execution_id: string;
  status: string;
  message: string;
  websocket_url: string;
}

export interface OptimizationStatus {
  execution_id: string;
  status: string;
  progress: number;
  current_generation?: number;
  total_generations?: number;
  current_time_slot?: number;
  total_time_slots?: number;
  best_fitness?: number;
  started_at?: string;
  estimated_completion?: string;
}

export interface RetrainRequest {
  checkpoint_path: string;
  additional_generations: number;
  parameters?: Record<string, any>;
}

export interface RetrainResponse {
  execution_id: string;
  status: string;
  message: string;
  websocket_url: string;
}
