import type { Route } from '../../services/types/optimization.types';

interface RoutesListProps {
  routes: Route[];
}

const RoutesListPresenter = ({ routes }: RoutesListProps) => {
  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Rutas Optimizadas
      </h3>
      <div className="space-y-4">
        {routes.map((route) => (
          <div key={route.id} className="border-2 border-[#3EA32A]/20 dark:border-[#015EB0]/30 rounded-xl p-5 hover:border-[#3EA32A] dark:hover:border-[#3EA32A] hover:bg-gradient-to-br hover:from-[#3EA32A]/5 hover:to-[#2E7A1F]/5 dark:hover:from-[#015EB0]/10 dark:hover:to-[#3EA32A]/10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-lg text-[#191c1e] dark:text-white">{route.name}</h4>
              <span className="px-3 py-1 bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] text-white rounded-full text-sm font-bold shadow-md">
                Fitness: {route.fitness_score.toFixed(4)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm text-[#5d3f3c] dark:text-gray-400">
              <div className="bg-[#f7f9fb] dark:bg-[#121212] rounded-lg p-3">
                <span className="font-bold text-[#191c1e] dark:text-white">Distancia:</span> {route.total_distance_km.toFixed(1)} km
              </div>
              <div className="bg-[#f7f9fb] dark:bg-[#121212] rounded-lg p-3">
                <span className="font-bold text-[#191c1e] dark:text-white">Tiempo:</span> {route.total_travel_time_min} min
              </div>
              <div className="bg-[#f7f9fb] dark:bg-[#121212] rounded-lg p-3">
                <span className="font-bold text-[#191c1e] dark:text-white">Demanda:</span> {route.demand_served.toLocaleString()}
              </div>
            </div>
            <div className="mt-3 text-sm text-[#5d3f3c] dark:text-gray-400 bg-[#f7f9fb] dark:bg-[#121212] rounded-lg p-3">
              <span className="font-bold text-[#191c1e] dark:text-white">Paradas:</span> {route.stops.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutesListPresenter;
