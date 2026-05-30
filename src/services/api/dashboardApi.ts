import { API_CONFIG, API_ENDPOINTS } from '../../config/api';
import type { DashboardResponse } from '../types/dashboard.types';

export class DashboardApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  async getDashboardData(): Promise<DashboardResponse> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.DASHBOARD}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching dashboard data');
    }

    return response.json();
  }
}

export const dashboardApi = new DashboardApi();
