import type { OptimizationResults, OptimizationParams, Execution } from '../types/optimization.types';
import {
  mockOptimizationResults,
  mockHistory
} from './optimizationMock';

export class MockOptimizationRepository {
  async getResults(_executionId: string): Promise<OptimizationResults> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockOptimizationResults);
      }, 500);
    });
  }
  
  async saveResults(results: OptimizationResults): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Guardando resultados mock:', results);
        resolve();
      }, 300);
    });
  }
  
  async getHistory(): Promise<Execution[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockHistory);
      }, 500);
    });
  }
  
  async executeOptimization(_params: OptimizationParams): Promise<OptimizationResults> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockOptimizationResults);
      }, 2000);
    });
  }
}
