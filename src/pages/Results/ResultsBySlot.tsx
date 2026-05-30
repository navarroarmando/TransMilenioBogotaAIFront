interface ResultsBySlotProps {
  resultsBySlot: Record<string, any>;
}

const ResultsBySlotPresenter = ({ resultsBySlot }: ResultsBySlotProps) => {
  const slotKeys = Object.keys(resultsBySlot);

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Resultados por Slot de Tiempo
      </h3>
      {slotKeys.length === 0 ? (
        <p className="text-sm text-[#5d3f3c] dark:text-gray-400">No hay resultados por slot disponibles</p>
      ) : (
        <div className="space-y-4">
          {slotKeys.map((slotKey) => {
            const slotData = resultsBySlot[slotKey];
            return (
              <div key={slotKey} className="bg-gray-50 dark:bg-[#2a2a4a] rounded-xl p-4">
                <h4 className="text-lg font-bold text-[#191c1e] dark:text-white mb-2">
                  Slot: {slotKey}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p className="text-[#5d3f3c] dark:text-gray-400">
                    <span className="font-semibold">Rutas:</span> {slotData.num_routes || 'N/A'}
                  </p>
                  <p className="text-[#5d3f3c] dark:text-gray-400">
                    <span className="font-semibold">Fitness:</span> {slotData.best_fitness?.toFixed(4) || 'N/A'}
                  </p>
                  <p className="text-[#5d3f3c] dark:text-gray-400">
                    <span className="font-semibold">Demanda:</span> {slotData.demand_served?.toLocaleString() || 'N/A'}
                  </p>
                  <p className="text-[#5d3f3c] dark:text-gray-400">
                    <span className="font-semibold">Tiempo:</span> {slotData.avg_travel_time?.toFixed(2) || 'N/A'} min
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResultsBySlotPresenter;
