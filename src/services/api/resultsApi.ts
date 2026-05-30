import { API_CONFIG, API_ENDPOINTS } from '../../config/api';
import type { OptimizationResults } from '../types/optimization.types';

export class ResultsApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  async getResults(executionId: string): Promise<OptimizationResults> {
    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.RESULTS(executionId)}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error fetching results');
    }

    return response.json();
  }

  async getVisualization(executionId: string, vizType: string): Promise<{ s3_key: string; message: string }> {
    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.RESULTS_VISUALIZATION(executionId, vizType)}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error fetching visualization');
    }

    return response.json();
  }
}

export const resultsApi = new ResultsApi();
