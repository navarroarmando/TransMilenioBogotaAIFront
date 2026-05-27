import { useHistory } from '../../hooks/useHistory';
import { useNavigate } from 'react-router-dom';
import type { Execution } from '../../services/types/optimization.types';
import { Eye, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';

const HistoryContainer = () => {
  const { history, isLoading, error } = useHistory();
  const navigate = useNavigate();

  const handleGenerateReport = (executionId: string) => {
    navigate('/reports', { state: { selectedExecutionId: executionId } });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: Execution['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-[#3EA32A]" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'under_review':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'applied':
        return <CheckCircle className="w-5 h-5 text-[#015EB0]" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: Execution['status']) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'failed':
        return 'Fallido';
      case 'under_review':
        return 'En Revisión';
      case 'applied':
        return 'Aplicado';
      case 'discarded':
        return 'Descartado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: Execution['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#3EA32A]/10 dark:bg-[#3EA32A]/20 text-[#3EA32A] dark:text-[#3EA32A] border border-[#3EA32A]/30';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-600';
      case 'under_review':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-600';
      case 'applied':
        return 'bg-[#015EB0]/10 dark:bg-[#015EB0]/20 text-[#015EB0] dark:text-[#015EB0] border border-[#015EB0]/30';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#002E5E] to-[#015EB0] dark:from-[#1a3a5c] dark:to-[#015EB0] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">Historial de Ejecuciones</h1>
        <p className="text-gray-200 dark:text-gray-300">Registro de todas las optimizaciones realizadas</p>
      </div>
      
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#015EB0]/10 dark:border-[#015EB0]/20 animate-slide-in">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#015EB0]/10 dark:bg-[#3EA32A]/10 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-[#015EB0]/20 dark:bg-[#3EA32A]/20 rounded-full"></div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">No hay ejecuciones registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#015EB0]/10 dark:divide-[#015EB0]/20">
              <thead className="bg-[#002E5E]/5 dark:bg-[#015EB0]/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#002E5E] dark:text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#002E5E] dark:text-white uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#002E5E] dark:text-white uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#002E5E] dark:text-white uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#002E5E] dark:text-white uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#1a1a2e] divide-y divide-[#015EB0]/10 dark:divide-[#015EB0]/20">
                {history.map((execution) => (
                  <tr key={execution.id} className="hover:bg-[#015EB0]/5 dark:hover:bg-[#015EB0]/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#002E5E] dark:text-white">
                      {execution.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(execution.timestamp).toLocaleString('es-CO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {execution.duration_seconds}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(execution.status)}`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(execution.status)}
                          {getStatusLabel(execution.status)}
                        </div>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#015EB0] to-[#002E5E] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold">
                          <Eye className="w-4 h-4" />
                          Ver Detalles
                        </button>
                        <button 
                          onClick={() => handleGenerateReport(execution.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3EA32A] to-[#2d8a22] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
                        >
                          <FileText className="w-4 h-4" />
                          Generar Informe
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryContainer;
