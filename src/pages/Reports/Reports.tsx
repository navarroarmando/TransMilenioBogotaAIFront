import { useState, useEffect } from 'react';
import { useReports } from '../../hooks/useReports';
import { useHistory } from '../../hooks/useHistory';
import { useLocation } from 'react-router-dom';
import { FileText, Download } from 'lucide-react';

const ReportsContainer = () => {
  const { isGenerating, generatePDF, generateExcel, generateHTML } = useReports();
  const { history } = useHistory();
  const location = useLocation();
  const [selectedExecutionId, setSelectedExecutionId] = useState<string>('');
  const [includeKPIs, setIncludeKPIs] = useState(true);
  const [includeRoutes, setIncludeRoutes] = useState(true);
  const [includeComparison, setIncludeComparison] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(false);
  
  const selectedExecutionFromHistory = location.state?.selectedExecutionId;

  useEffect(() => {
    if (selectedExecutionFromHistory) {
      setSelectedExecutionId(selectedExecutionFromHistory);
    }
  }, [selectedExecutionFromHistory]);

  const handlePDFGeneration = async () => {
    if (!selectedExecutionId) return;
    try {
      await generatePDF(selectedExecutionId, {
        include_kpis: includeKPIs,
        include_routes: includeRoutes,
        include_comparison: includeComparison,
        include_charts: includeCharts
      });
      console.log('PDF report generated and downloaded');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleExcelGeneration = async () => {
    if (!selectedExecutionId) return;
    try {
      await generateExcel(selectedExecutionId, {
        include_kpis: includeKPIs,
        include_routes: includeRoutes,
        include_comparison: includeComparison,
        include_charts: includeCharts
      });
      console.log('Excel report generated and downloaded');
    } catch (error) {
      console.error('Error generating Excel:', error);
    }
  };

  const handleHTMLGeneration = async () => {
    if (!selectedExecutionId) return;
    try {
      await generateHTML(selectedExecutionId, {
        include_kpis: includeKPIs,
        include_routes: includeRoutes,
        include_comparison: includeComparison,
        include_charts: includeCharts
      });
      console.log('HTML report generated and downloaded');
    } catch (error) {
      console.error('Error generating HTML:', error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] dark:from-[#1a3a5c] dark:to-[#015EB0] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">Informes</h1>
        <p className="text-gray-200 dark:text-gray-300">Genera y descarga reportes de optimización</p>
      </div>
      
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in">
        <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
          Seleccionar Ejecución del Historial
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">
            Ejecución
          </label>
          <select
            value={selectedExecutionId}
            onChange={(e) => setSelectedExecutionId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#3EA32A]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3EA32A] focus:border-[#3EA32A] bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300"
          >
            <option value="">Seleccionar ejecución...</option>
            {history.map((execution) => (
              <option key={execution.execution_id} value={execution.execution_id}>
                {execution.execution_id} - {new Date(execution.timestamp).toLocaleString('es-CO')}
              </option>
            ))}
          </select>
        </div>
        {selectedExecutionId && (
          <div className="bg-[#3EA32A]/10 dark:bg-[#3EA32A]/20 border-2 border-[#3EA32A]/30 rounded-xl p-4">
            <p className="text-sm font-bold text-[#3EA32A] dark:text-[#3EA32A]">
              ✓ Ejecución seleccionada: {selectedExecutionId}
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#3EA32A]/10 dark:bg-[#3EA32A]/20 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-[#3EA32A]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#191c1e] dark:text-white">Informe PDF</h3>
              <p className="text-sm text-[#5d3f3c] dark:text-gray-400">Reporte completo de optimización</p>
            </div>
          </div>
          <button
            onClick={handlePDFGeneration}
            disabled={isGenerating || !selectedExecutionId}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            {isGenerating ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>
        
        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#3EA32A]/10 dark:bg-[#3EA32A]/20 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-[#3EA32A]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#191c1e] dark:text-white">Hoja de Cálculo Excel</h3>
              <p className="text-sm text-[#5d3f3c] dark:text-gray-400">Datos detallados en formato Excel</p>
            </div>
          </div>
          <button
            onClick={handleExcelGeneration}
            disabled={isGenerating || !selectedExecutionId}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            {isGenerating ? 'Generando...' : 'Descargar Excel'}
          </button>
        </div>

        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#3EA32A]/10 dark:bg-[#3EA32A]/20 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-[#3EA32A]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#191c1e] dark:text-white">Informe HTML</h3>
              <p className="text-sm text-[#5d3f3c] dark:text-gray-400">Reporte interactivo en HTML</p>
            </div>
          </div>
          <button
            onClick={handleHTMLGeneration}
            disabled={isGenerating || !selectedExecutionId}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            {isGenerating ? 'Generando...' : 'Descargar HTML'}
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in">
        <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
          Opciones de Exportación
        </h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 bg-[#f7f9fb] dark:bg-[#121212] p-4 rounded-xl border-2 border-[#3EA32A]/20 dark:border-[#015EB0]/30 hover:border-[#3EA32A] dark:hover:border-[#3EA32A] transition-all duration-300 cursor-pointer">
            <input type="checkbox" checked={includeKPIs} onChange={(e) => setIncludeKPIs(e.target.checked)} className="w-5 h-5 accent-[#3EA32A] rounded" />
            <span className="text-sm font-bold text-[#191c1e] dark:text-white">Incluir KPIs</span>
          </label>
          <label className="flex items-center gap-3 bg-[#f7f9fb] dark:bg-[#121212] p-4 rounded-xl border-2 border-[#3EA32A]/20 dark:border-[#015EB0]/30 hover:border-[#3EA32A] dark:hover:border-[#3EA32A] transition-all duration-300 cursor-pointer">
            <input type="checkbox" checked={includeRoutes} onChange={(e) => setIncludeRoutes(e.target.checked)} className="w-5 h-5 accent-[#3EA32A] rounded" />
            <span className="text-sm font-bold text-[#191c1e] dark:text-white">Incluir rutas detalladas</span>
          </label>
          <label className="flex items-center gap-3 bg-[#f7f9fb] dark:bg-[#121212] p-4 rounded-xl border-2 border-[#3EA32A]/20 dark:border-[#015EB0]/30 hover:border-[#3EA32A] dark:hover:border-[#3EA32A] transition-all duration-300 cursor-pointer">
            <input type="checkbox" checked={includeComparison} onChange={(e) => setIncludeComparison(e.target.checked)} className="w-5 h-5 accent-[#3EA32A] rounded" />
            <span className="text-sm font-bold text-[#191c1e] dark:text-white">Incluir comparación antes/después</span>
          </label>
          <label className="flex items-center gap-3 bg-[#f7f9fb] dark:bg-[#121212] p-4 rounded-xl border-2 border-[#926f6b] dark:border-[#015EB0]/30 hover:border-[#e31e24] dark:hover:border-[#3EA32A] transition-all duration-300 cursor-pointer">
            <input type="checkbox" checked={includeCharts} onChange={(e) => setIncludeCharts(e.target.checked)} className="w-5 h-5 accent-[#e31e24] rounded" />
            <span className="text-sm font-bold text-[#191c1e] dark:text-white">Incluir gráficos</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ReportsContainer;
