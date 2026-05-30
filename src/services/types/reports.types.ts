export interface ReportRequest {
  execution_id: string;
  options?: {
    include_kpis?: boolean;
    include_routes?: boolean;
    include_comparison?: boolean;
    include_charts?: boolean;
  };
}

export interface ReportResponse {
  success: boolean;
  report_id: string;
  download_url: string;
}
