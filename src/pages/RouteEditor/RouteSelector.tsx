import type { Route } from '../../services/types/optimization.types';

interface RouteSelectorProps {
  routes: Route[];
  selectedRoute: Route | null;
  onSelect: (route: Route) => void;
}

const RouteSelectorPresenter = ({ routes, selectedRoute, onSelect }: RouteSelectorProps) => {
  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#015EB0]/10 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#002E5E] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Seleccionar Ruta
      </h3>
      <div className="space-y-3">
        {routes.map((route) => (
          <button
            key={route.id}
            onClick={() => onSelect(route)}
            className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
              selectedRoute?.id === route.id
                ? 'bg-gradient-to-r from-[#3EA32A] to-[#2d8a22] text-white shadow-md'
                : 'bg-[#F8F8F8] dark:bg-[#121212] text-[#002E5E] dark:text-white border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 hover:border-[#015EB0] dark:hover:border-[#3EA32A] hover:bg-gradient-to-br hover:from-[#002E5E]/5 hover:to-[#015EB0]/5 dark:hover:from-[#015EB0]/10 dark:hover:to-[#3EA32A]/10'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold">{route.name}</span>
              <span className="px-2 py-1 bg-white/20 dark:bg-black/20 rounded-full text-xs font-semibold">{route.stops.length} paradas</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RouteSelectorPresenter;
