import { API_CONFIG, API_ENDPOINTS } from '../../config/api';
import type { HistoryListResponse, ExecutionDetail } from '../types/history.types';

export class HistoryApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  async getHistory(params?: {
    status?: string;
    mode?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<HistoryListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.HISTORY}?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error fetching history');
    }

    return response.json();
  }

  async getExecutionDetail(executionId: string): Promise<ExecutionDetail> {
    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.HISTORY_DETAIL(executionId)}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error fetching execution detail');
    }

    return response.json();
  }

  async deleteExecution(executionId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.HISTORY_DELETE(executionId)}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error deleting execution');
    }
  }
}

export const historyApi = new HistoryApi();
