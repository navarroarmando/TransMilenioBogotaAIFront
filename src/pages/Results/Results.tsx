import { useResults } from '../../hooks/useResults';
import ComparisonMap from './ComparisonMap';
import KPITable from './KPITable';
import RoutesList from './RoutesList';

const ResultsContainer = () => {
  const { data, isLoading, error } = useResults();

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
        <p className="text-text-secondary-light dark:text-text-secondary-dark">No hay resultados disponibles. Ejecute una optimización primero.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#002E5E] to-[#015EB0] dark:from-[#1a3a5c] dark:to-[#015EB0] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">Resultados de Optimización</h1>
        <p className="text-gray-200 dark:text-gray-300">Análisis detallado de las mejoras en el sistema de transporte</p>
      </div>
      
      <ComparisonMap routes={data.routes} />
      <KPITable 
        before={data.comparison.before}
        after={data.comparison.after}
        variation={data.comparison.variation}
      />
      <RoutesList routes={data.routes} />
    </div>
  );
};

export default ResultsContainer;
