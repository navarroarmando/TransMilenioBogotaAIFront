export interface DashboardKPIs {
  total_executions: number;
  completed_executions: number;
  failed_executions: number;
  avg_duration_seconds: number;
  best_fitness_all_time: number;
}

export interface DashboardExecution {
  execution_id: string;
  timestamp: string;
  mode: string;
  status: string;
  best_fitness: number;
}

export interface SystemStatus {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
}

export interface DashboardResponse {
  kpis: DashboardKPIs;
  recent_executions: DashboardExecution[];
  system_status: SystemStatus;
}
