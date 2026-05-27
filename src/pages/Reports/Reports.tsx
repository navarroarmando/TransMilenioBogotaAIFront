import { useState, useEffect } from 'react';
import { useReports } from '../../hooks/useReports';
import { useHistory } from '../../hooks/useHistory';
import { mockOptimizationResults } from '../../services/mock/optimizationMock';
import { useLocation } from 'react-router-dom';
import { FileText, Download } from 'lucide-react';

const ReportsContainer = () => {
  const { isGenerating, generatePDF, generateExcel } = useReports();
  const { history } = useHistory();
  const location = useLocation();
  const [selectedExecutionId, setSelectedExecutionId] = useState<string>('');
  
  const selectedExecutionFromHistory = location.state?.selectedExecutionId;

  useEffect(() => {
    if (selectedExecutionFromHistory) {
      setSelectedExecutionId(selectedExecutionFromHistory);
    }
  }, [selectedExecutionFromHistory]);

  const handlePDFGeneration = async () => {
    await generatePDF(mockOptimizationResults);
  };

  const handleExcelGeneration = async () => {
    await generateExcel(mockOptimizationResults);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#002E5E] to-[#015EB0] dark:from-[#1a3a5c] dark:to-[#015EB0] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">Informes</h1>
        <p className="text-gray-200 dark:text-gray-300">Genera y descarga reportes de optimización</p>
      </div>
      
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#015EB0]/10 dark:border-[#015EB0]/20 animate-slide-in">
        <h3 className="text-xl font-bold text-[#002E5E] dark:text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
          Seleccionar Ejecución del Historial
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-bold text-[#002E5E] dark:text-white mb-2 uppercase tracking-wide">
            Ejecución
          </label>
          <select
            value={selectedExecutionId}
            onChange={(e) => setSelectedExecutionId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015EB0] focus:border-[#015EB0] bg-[#F8F8F8] dark:bg-[#121212] text-[#002E5E] dark:text-white font-semibold transition-all duration-300"
          >
            <option value="">Seleccionar ejecución...</option>
            {history.map((execution) => (
              <option key={execution.id} value={execution.id}>
                {execution.id} - {new Date(execution.timestamp).toLocaleString('es-CO')}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#015EB0]/10 dark:border-[#015EB0]/20 animate-slide-in hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-red-500/10 dark:bg-red-500/20 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#002E5E] dark:text-white">Informe PDF</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reporte completo de optimización</p>
            </div>
          </div>
          <button
            onClick={handlePDFGeneration}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            {isGenerating ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>
        
        <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#015EB0]/10 dark:border-[#015EB0]/20 animate-slide-in hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#3EA32A]/10 dark:bg-[#3EA32A]/20 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-[#3EA32A]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#002E5E] dark:text-white">Hoja de Cálculo Excel</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Datos detallados en formato Excel</p>
            </div>
          </div>
          <button
            onClick={handleExcelGeneration}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#3EA32A] to-[#2d8a22] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            {isGenerating ? 'Generando...' : 'Descargar Excel'}
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#015EB0]/10 dark:border-[#015EB0]/20 animate-slide-in">
        <h3 className="text-xl font-bold text-[#002E5E] dark:text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
          Opciones de Exportación
        </h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 bg-[#F8F8F8] dark:bg-[#121212] p-4 rounded-xl border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 hover:border-[#015EB0] dark:hover:border-[#3EA32A] transition-all duration-300 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#015EB0] rounded" />
            <span className="text-sm font-bold text-[#002E5E] dark:text-white">Incluir KPIs</span>
          </label>
          <label className="flex items-center gap-3 bg-[#F8F8F8] dark:bg-[#121212] p-4 rounded-xl border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 hover:border-[#015EB0] dark:hover:border-[#3EA32A] transition-all duration-300 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#015EB0] rounded" />
            <span className="text-sm font-bold text-[#002E5E] dark:text-white">Incluir rutas detalladas</span>
          </label>
          <label className="flex items-center gap-3 bg-[#F8F8F8] dark:bg-[#121212] p-4 rounded-xl border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 hover:border-[#015EB0] dark:hover:border-[#3EA32A] transition-all duration-300 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#015EB0] rounded" />
            <span className="text-sm font-bold text-[#002E5E] dark:text-white">Incluir comparación antes/después</span>
          </label>
          <label className="flex items-center gap-3 bg-[#F8F8F8] dark:bg-[#121212] p-4 rounded-xl border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 hover:border-[#015EB0] dark:hover:border-[#3EA32A] transition-all duration-300 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-[#015EB0] rounded" />
            <span className="text-sm font-bold text-[#002E5E] dark:text-white">Incluir gráficos</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ReportsContainer;
