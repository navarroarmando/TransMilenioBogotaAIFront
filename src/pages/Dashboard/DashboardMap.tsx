import type { Route } from '../../services/types/optimization.types';

interface DashboardMapProps {
  routes: Route[];
}

const DashboardMapPresenter = ({ routes }: DashboardMapProps) => {
  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#015EB0]/10 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#002E5E] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Mapa de Rutas Activas
      </h3>
      <div className="bg-gradient-to-br from-[#002E5E]/5 to-[#015EB0]/5 dark:from-[#015EB0]/10 dark:to-[#3EA32A]/10 rounded-xl h-96 flex items-center justify-center border-2 border-dashed border-[#015EB0]/30 dark:border-[#015EB0]/40">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#015EB0]/10 dark:bg-[#3EA32A]/10 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-[#015EB0]/20 dark:bg-[#3EA32A]/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-[#015EB0]/30 dark:bg-[#3EA32A]/30 rounded-full"></div>
            </div>
          </div>
          <p className="text-lg font-bold text-[#002E5E] dark:text-white mb-2">Mapa Interactivo</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">React Leaflet se integrará aquí</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#015EB0]/10 dark:bg-[#3EA32A]/10 rounded-full">
            <span className="w-2 h-2 bg-[#3EA32A] rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-[#002E5E] dark:text-white">{routes.length} rutas activas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMapPresenter;
