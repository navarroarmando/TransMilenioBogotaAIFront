import { API_CONFIG, API_ENDPOINTS } from '../../config/api';
import type { ReportRequest, ReportResponse } from '../types/reports.types';

export class ReportsApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  async generatePdfReport(request: ReportRequest): Promise<ReportResponse> {
    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.REPORTS_PDF}`,
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
      throw new Error('Error generating PDF report');
    }

    return response.json();
  }

  async generateExcelReport(request: ReportRequest): Promise<ReportResponse> {
    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.REPORTS_EXCEL}`,
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
      throw new Error('Error generating Excel report');
    }

    return response.json();
  }

  async generateHtmlReport(request: ReportRequest): Promise<ReportResponse> {
    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.REPORTS_HTML}`,
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
      throw new Error('Error generating HTML report');
    }

    return response.json();
  }

  async downloadReport(reportId: string): Promise<{ s3_key: string; message: string }> {
    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.REPORTS_DOWNLOAD(reportId)}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error downloading report');
    }

    return response.json();
  }
}

export const reportsApi = new ReportsApi();
