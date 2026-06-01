import React, { useState } from 'react';
import { reportsApi } from '../../services/api/reportsApi';
import type { ReportRequest } from '../../services/types/reports.types';

interface ReportsProps {
  executionId: string;
}

const Reports: React.FC<ReportsProps> = ({ executionId }) => {
  const [format, setFormat] = useState<'pdf' | 'excel' | 'html'>('pdf');
  const [options, setOptions] = useState({
    include_kpis: true,
    include_routes: true,
    include_comparison: true,
    include_charts: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAndDownloadReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const request: ReportRequest = {
        execution_id: executionId,
        options,
      };

      let blob;
      let filename;

      if (format === 'pdf') {
        blob = await reportsApi.generatePdfReport(request);
        filename = `${executionId}_report.pdf`;
      } else if (format === 'excel') {
        blob = await reportsApi.generateExcelReport(request);
        filename = `${executionId}_report.xlsx`;
      } else {
        blob = await reportsApi.generateHtmlReport(request);
        filename = `${executionId}_report.html`;
      }

      // Crear URL para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Error al generar/descargar el reporte. Por favor, intenta nuevamente.');
      console.error('Error generating/downloading report:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Generar Reporte</h3>

      {/* Formato */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Formato
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="pdf"
              checked={format === 'pdf'}
              onChange={(e) => setFormat(e.target.value as 'pdf' | 'excel' | 'html')}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">PDF</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="excel"
              checked={format === 'excel'}
              onChange={(e) => setFormat(e.target.value as 'pdf' | 'excel' | 'html')}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Excel</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="html"
              checked={format === 'html'}
              onChange={(e) => setFormat(e.target.value as 'pdf' | 'excel' | 'html')}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">HTML</span>
          </label>
        </div>
      </div>

      {/* Opciones de exportación */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opciones de exportación
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.include_kpis}
              onChange={(e) => setOptions({ ...options, include_kpis: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Incluir KPIs</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.include_routes}
              onChange={(e) => setOptions({ ...options, include_routes: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Incluir rutas detalladas</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.include_comparison}
              onChange={(e) => setOptions({ ...options, include_comparison: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Incluir comparaciones antes/después</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.include_charts}
              onChange={(e) => setOptions({ ...options, include_charts: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Incluir gráficos</span>
          </label>
        </div>
      </div>

      {/* Botón */}
      <div className="flex space-x-3">
        <button
          onClick={handleGenerateAndDownloadReport}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generando y Descargando...' : 'Generar y Descargar Reporte'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
