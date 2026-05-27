import { useState, useCallback } from 'react';
import type { OptimizationResults } from '../services/types/optimization.types';

export const useReports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generatePDF = useCallback(async (results: OptimizationResults) => {
    setIsGenerating(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Generando PDF con resultados:', results);
        setIsGenerating(false);
        resolve();
      }, 2000);
    });
  }, []);
  
  const generateExcel = useCallback(async (results: OptimizationResults) => {
    setIsGenerating(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Generando Excel con resultados:', results);
        setIsGenerating(false);
        resolve();
      }, 1500);
    });
  }, []);
  
  return { isGenerating, generatePDF, generateExcel };
};
