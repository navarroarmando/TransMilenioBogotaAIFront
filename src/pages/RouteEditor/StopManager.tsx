import type { Stop } from '../../services/types/optimization.types';

interface StopManagerProps {
  stops: Stop[];
  routeStops: Stop[];
  onAddStop: (stopId: string) => void;
  onRemoveStop: (stopId: string) => void;
}

const StopManagerPresenter = ({ stops, routeStops, onAddStop, onRemoveStop }: StopManagerProps) => {
  const availableStops = stops.filter(s => !routeStops.find(rs => rs.id === s.id));

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#015EB0]/10 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#002E5E] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Gestión de Paradas
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold text-[#002E5E] dark:text-white mb-4 uppercase tracking-wide text-sm">Paradas Disponibles</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {availableStops.map((stop) => (
              <div
                key={stop.id}
                className="flex items-center justify-between p-4 bg-[#F8F8F8] dark:bg-[#121212] rounded-xl border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 hover:border-[#015EB0] dark:hover:border-[#3EA32A] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  <p className="font-bold text-[#002E5E] dark:text-white">{stop.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Estrato: {stop.stratum}</p>
                </div>
                <button
                  onClick={() => onAddStop(stop.id)}
                  className="px-4 py-2 bg-gradient-to-r from-[#015EB0] to-[#002E5E] text-white text-sm rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-[#002E5E] dark:text-white mb-4 uppercase tracking-wide text-sm">Paradas en Ruta</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {routeStops.map((stop, index) => (
              <div
                key={stop.id}
                className="flex items-center justify-between p-4 bg-[#015EB0]/10 dark:bg-[#015EB0]/20 rounded-xl border-2 border-[#015EB0]/30 dark:border-[#015EB0]/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  <p className="font-bold text-[#002E5E] dark:text-white">{index + 1}. {stop.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Demanda: {stop.demand}</p>
                </div>
                <button
                  onClick={() => onRemoveStop(stop.id)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StopManagerPresenter;
