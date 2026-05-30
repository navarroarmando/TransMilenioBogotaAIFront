export interface ExecutionSummary {
  execution_id: string;
  timestamp: string;
  mode: string;
  status: string;
  duration_seconds?: number;
  best_fitness?: number;
  parameters?: Record<string, any>;
}

export interface HistoryListResponse {
  executions: ExecutionSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface ExecutionDetail {
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
