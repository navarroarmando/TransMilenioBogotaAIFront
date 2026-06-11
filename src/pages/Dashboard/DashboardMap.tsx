import { useState, useEffect } from 'react';
import type { DashboardExecution } from '../../services/types/dashboard.types';
import { API_CONFIG } from '../../config/api';
import { ChevronDown, Map, Loader2 } from 'lucide-react';

interface DashboardMapProps {
  executions: DashboardExecution[];
}

const DashboardMapPresenter = ({ executions }: DashboardMapProps) => {
  const [selectedExecutionId, setSelectedExecutionId] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Seleccionar la última ejecución por defecto
  useEffect(() => {
    if (executions.length > 0 && !selectedExecutionId) {
      setSelectedExecutionId(executions[0].execution_id);
    }
  }, [executions, selectedExecutionId]);

  // Cargar el mapa cuando cambia la ejecución seleccionada
  useEffect(() => {
    const fetchVisualization = async () => {
      if (!selectedExecutionId) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${API_CONFIG.BASE_URL}/results/${selectedExecutionId}/visualization/routes_map_interactive`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Error al cargar el mapa de rutas');
        }

        const html = await response.text();
        setHtmlContent(html);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisualization();
  }, [selectedExecutionId]);

  const selectedExecution = executions.find(e => e.execution_id === selectedExecutionId);

  if (executions.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in">
        <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
          Mapa de Rutas Activas
        </h3>
        <div className="bg-gradient-to-br from-[#3EA32A]/5 to-[#2E7A1F]/5 dark:from-[#015EB0]/10 dark:to-[#3EA32A]/10 rounded-xl h-96 flex items-center justify-center border-2 border-dashed border-[#3EA32A]/20 dark:border-[#015EB0]/40">
          <p className="text-[#5d3f3c] dark:text-gray-400">No hay ejecuciones disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#191c1e] dark:text-white flex items-center gap-2">
          <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
          Mapa de Rutas Activas
        </h3>

        {/* Dropdown de ejecuciones */}
        <div className="relative">
          <label className="block text-sm font-medium text-[#5d3f3c] dark:text-gray-400 mb-2">
            ID de la ejecución:
          </label>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3EA32A]/10 dark:bg-[#015EB0]/20 rounded-lg hover:bg-[#3EA32A]/20 dark:hover:bg-[#015EB0]/30 transition-colors text-[#191c1e] dark:text-white font-medium min-w-[250px] w-full"
          >
            <Map className="w-4 h-4" />
            <span className="text-lg w-full truncate">
              {selectedExecution ? selectedExecution.execution_id : 'Seleccionar'}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1a1a2e] rounded-lg shadow-xl border border-[#3EA32A]/20 dark:border-[#015EB0]/30 animate-scale-in z-10 max-h-96 overflow-y-auto">
              {executions.map((execution) => (
                <button
                  key={execution.execution_id}
                  onClick={() => {
                    setSelectedExecutionId(execution.execution_id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-[#3EA32A]/10 dark:hover:bg-[#015EB0]/20 transition-colors ${
                    selectedExecutionId === execution.execution_id
                      ? 'bg-[#3EA32A]/10 dark:bg-[#015EB0]/20'
                      : ''
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-[#191c1e] dark:text-white text-base">
                      {execution.execution_id}
                    </span>
                    <span className="text-sm text-[#5d3f3c] dark:text-gray-400">
                      {new Date(execution.timestamp).toLocaleString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contenedor del mapa */}
      <div className="bg-gradient-to-br from-[#3EA32A]/5 to-[#2E7A1F]/5 dark:from-[#015EB0]/10 dark:to-[#3EA32A]/10 rounded-xl h-[500px] flex items-center justify-center border-2 border-dashed border-[#3EA32A]/20 dark:border-[#015EB0]/40 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#1a1a2e]/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#3EA32A] dark:text-[#015EB0] animate-spin" />
              <p className="text-[#191c1e] dark:text-white font-medium">Cargando mapa...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!isLoading && !error && htmlContent && (
          <iframe
            srcDoc={htmlContent}
            className="w-full h-full border-0 rounded-lg"
            title="Mapa de Rutas"
            sandbox="allow-scripts allow-same-origin"
          />
        )}

        {!isLoading && !error && !htmlContent && (
          <div className="text-center">
            <Map className="w-16 h-16 mx-auto mb-4 text-[#3EA32A]/30 dark:text-[#015EB0]/30" />
            <p className="text-[#5d3f3c] dark:text-gray-400">No hay mapa disponible para esta ejecución</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMapPresenter;
