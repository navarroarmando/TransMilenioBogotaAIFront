import type { Route } from '../../services/types/optimization.types';

interface ComparisonMapProps {
  routes: Route[];
}

const ComparisonMapPresenter = ({ routes }: ComparisonMapProps) => {
  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Mapa Comparativo
      </h3>
      <div className="bg-gradient-to-br from-[#3EA32A]/5 to-[#2E7A1F]/5 dark:from-[#015EB0]/10 dark:to-[#3EA32A]/10 rounded-xl h-96 flex items-center justify-center border-2 border-dashed border-[#3EA32A]/20 dark:border-[#015EB0]/40">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#3EA32A]/10 dark:bg-[#3EA32A]/10 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-[#3EA32A]/20 dark:bg-[#3EA32A]/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-[#3EA32A]/30 dark:bg-[#3EA32A]/30 rounded-full"></div>
            </div>
          </div>
          <p className="text-lg font-bold text-[#191c1e] dark:text-white mb-2">Mapa Interactivo</p>
          <p className="text-sm text-[#5d3f3c] dark:text-gray-400 mb-2">React Leaflet se integrará aquí</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3EA32A]/10 dark:bg-[#3EA32A]/10 rounded-full">
            <span className="w-2 h-2 bg-[#3EA32A] rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-[#191c1e] dark:text-white">{routes.length} rutas optimizadas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonMapPresenter;
