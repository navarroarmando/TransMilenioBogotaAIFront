import { useState, useCallback } from 'react';
import type { ReportRequest } from '../services/types/reports.types';
import { reportsApi } from '../services/api/reportsApi';

export const useReports = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const generatePDF = useCallback(async (executionId: string, options?: ReportRequest['options']) => {
    setIsGenerating(true);
    try {
      const blob = await reportsApi.generatePdfReport({
        execution_id: executionId,
        options
      });
      downloadBlob(blob, `${executionId}_report.pdf`);
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateExcel = useCallback(async (executionId: string, options?: ReportRequest['options']) => {
    setIsGenerating(true);
    try {
      const blob = await reportsApi.generateExcelReport({
        execution_id: executionId,
        options
      });
      downloadBlob(blob, `${executionId}_report.xlsx`);
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateHTML = useCallback(async (executionId: string, options?: ReportRequest['options']) => {
    setIsGenerating(true);
    try {
      const blob = await reportsApi.generateHtmlReport({
        execution_id: executionId,
        options
      });
      downloadBlob(blob, `${executionId}_report.html`);
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { isGenerating, generatePDF, generateExcel, generateHTML };
};
