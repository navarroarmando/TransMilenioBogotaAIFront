import { useDashboardData } from '../../hooks/useDashboardData';
import DashboardKPIs from './DashboardKPIs';
import DashboardMap from './DashboardMap';
import QuickActions from './QuickActions';
import { Play, Settings, FileText } from 'lucide-react';

const DashboardContainer = () => {
  const { data, isLoading, error } = useDashboardData();

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

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-text-muted dark:text-text-mutedDark">No hay datos disponibles</p>
      </div>
    );
  }

  const quickActions = [
    {
      id: '1',
      label: 'Nueva Optimización',
      icon: <Play className="w-5 h-5 text-[#3EA32A]" />,
      path: '/optimization'
    },
    {
      id: '2',
      label: 'Configurar Parámetros',
      icon: <Settings className="w-5 h-5 text-primary" />,
      path: '/optimization'
    },
    {
      id: '3',
      label: 'Generar Informe',
      icon: <FileText className="w-5 h-5 text-primary" />,
      path: '/reports'
    }
  ];


  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] dark:from-[#1a3a5c] dark:to-[#015EB0] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard General</h1>
        <p className="text-gray-200 dark:text-gray-300">Sistema de Soporte a Decisiones - TransMilenio Bogotá</p>
      </div>
      
      <DashboardKPIs kpis={data.kpis} />
      <DashboardMap executions={data.recent_executions} />
      <QuickActions actions={quickActions} />
    </div>
  );
};

export default DashboardContainer;
