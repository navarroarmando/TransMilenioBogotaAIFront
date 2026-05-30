import { useState, useCallback } from 'react';
import type { ReportRequest, ReportResponse } from '../services/types/reports.types';
import { reportsApi } from '../services/api/reportsApi';

export const useReports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generatePDF = useCallback(async (executionId: string, options?: ReportRequest['options']) => {
    setIsGenerating(true);
    try {
      const response: ReportResponse = await reportsApi.generatePdfReport({
        execution_id: executionId,
        options
      });
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  const generateExcel = useCallback(async (executionId: string, options?: ReportRequest['options']) => {
    setIsGenerating(true);
    try {
      const response: ReportResponse = await reportsApi.generateExcelReport({
        execution_id: executionId,
        options
      });
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateHTML = useCallback(async (executionId: string, options?: ReportRequest['options']) => {
    setIsGenerating(true);
    try {
      const response: ReportResponse = await reportsApi.generateHtmlReport({
        execution_id: executionId,
        options
      });
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const downloadReport = useCallback(async (reportId: string) => {
    try {
      const response = await reportsApi.downloadReport(reportId);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);
  
  return { isGenerating, generatePDF, generateExcel, generateHTML, downloadReport };
};
