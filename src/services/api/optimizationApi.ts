import { API_CONFIG, API_ENDPOINTS } from '../../config/api';
import type { 
  OptimizationStartRequest, 
  OptimizationStartResponse,
  OptimizationStatus,
  RetrainRequest,
  RetrainResponse
} from '../types/optimization.types';

export class OptimizationApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  async startOptimization(request: OptimizationStartRequest): Promise<OptimizationStartResponse> {
    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.OPTIMIZATION_START}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error('Error starting optimization');
    }

    return response.json();
  }

  async getOptimizationStatus(executionId: string): Promise<OptimizationStatus> {
    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.OPTIMIZATION_STATUS(executionId)}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error fetching optimization status');
    }

    return response.json();
  }

  async cancelOptimization(executionId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.OPTIMIZATION_CANCEL(executionId)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error canceling optimization');
    }
  }

  async retrainOptimization(request: RetrainRequest): Promise<RetrainResponse> {
    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.OPTIMIZATION_RETRAIN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error('Error retraining optimization');
    }

    return response.json();
  }
}

export const optimizationApi = new OptimizationApi();
