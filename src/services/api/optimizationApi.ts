import type { OptimizationResults, OptimizationParams, Execution } from '../types/optimization.types';

export interface OptimizationRepository {
  getResults(executionId: string): Promise<OptimizationResults>;
  saveResults(results: OptimizationResults): Promise<void>;
  getHistory(): Promise<Execution[]>;
  executeOptimization(params: OptimizationParams): Promise<OptimizationResults>;
}
