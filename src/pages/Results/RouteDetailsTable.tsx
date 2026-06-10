interface RouteDetailsTableProps {
  resultsBySlot: Record<string, any>;
}

const RouteDetailsTable = ({ resultsBySlot }: RouteDetailsTableProps) => {
  console.log('[RouteDetailsTable] resultsBySlot:', resultsBySlot);
  const slotKeys = Object.keys(resultsBySlot);

  // Función para ajustar el nombre de la ruta para que empiece en 1
  const adjustRouteName = (routeName: string): string => {
    // Extraer el número de ruta del nombre (ej: "Ruta 0-0" -> extraer el último número)
    const match = routeName.match(/Ruta (\d+)-(\d+)/);
    if (match) {
      const slotNum = match[1];
      const routeNum = parseInt(match[2], 10);
      return `Ruta ${slotNum}-${routeNum + 1}`;
    }
    return routeName;
  };

  // Aplanar todas las rutas de todos los slots en un solo array
  const allRoutes: any[] = [];
  slotKeys.forEach((slotKey) => {
    const slotData = resultsBySlot[slotKey];
    console.log(`[RouteDetailsTable] slotKey: ${slotKey}, slotData:`, slotData);
    if (Array.isArray(slotData)) {
      slotData.forEach((route: any, index: number) => {
        console.log(`[RouteDetailsTable] route ${index}:`, route);
        allRoutes.push({
          slot: slotKey,
          routeIndex: index,
          route_id: route.route_id,
          route_name: route.route_name ? adjustRouteName(route.route_name) : `Ruta ${index + 1}`,
          fitness_score: route.fitness_score,
          demand_served: route.demand_served,
          total_distance_km: route.total_distance_km,
          total_travel_time_min: route.total_travel_time_min,
          num_stops: route.stops ? route.stops.length : 0
        });
      });
    } else if (slotData && typeof slotData === 'object') {
      // Si slotData es un objeto con resumen, no hay rutas individuales
      // En este caso, creamos una entrada con el resumen
      allRoutes.push({
        slot: slotKey,
        routeIndex: 0,
        fitness: slotData.best_fitness,
        demand_served: slotData.demand_served,
        avg_travel_time: slotData.avg_travel_time,
        distance: slotData.total_distance,
        num_stops: slotData.num_stops
      });
    }
  });

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Detalle de Rutas Generadas
      </h3>
      {allRoutes.length === 0 ? (
        <p className="text-sm text-[#5d3f3c] dark:text-gray-400">No hay rutas disponibles</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[#3EA32A]/20 dark:border-[#015EB0]/20">
                <th className="text-left py-3 px-4 font-bold text-[#191c1e] dark:text-white">Franja</th>
                <th className="text-left py-3 px-4 font-bold text-[#191c1e] dark:text-white">Ruta</th>
                <th className="text-left py-3 px-4 font-bold text-[#191c1e] dark:text-white">Fitness</th>
                <th className="text-left py-3 px-4 font-bold text-[#191c1e] dark:text-white">Demanda</th>
                <th className="text-left py-3 px-4 font-bold text-[#191c1e] dark:text-white">Distancia (km)</th>
                <th className="text-left py-3 px-4 font-bold text-[#191c1e] dark:text-white">Tiempo (min)</th>
                <th className="text-left py-3 px-4 font-bold text-[#191c1e] dark:text-white">Paradas</th>
              </tr>
            </thead>
            <tbody>
              {allRoutes.map((route, index) => (
                <tr key={`${route.slot}-${route.routeIndex}-${index}`} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a4a]">
                  <td className="py-3 px-4 text-[#191c1e] dark:text-white font-semibold">{route.slot}</td>
                  <td className="py-3 px-4 text-[#191c1e] dark:text-white">{route.route_name || `Ruta ${route.routeIndex + 1}`}</td>
                  <td className="py-3 px-4 text-[#191c1e] dark:text-white">
                    {route.fitness_score !== undefined ? route.fitness_score.toFixed(2) : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-[#191c1e] dark:text-white">
                    {route.demand_served !== undefined ? route.demand_served.toLocaleString() : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-[#191c1e] dark:text-white">
                    {route.total_distance_km !== undefined ? route.total_distance_km.toFixed(2) : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-[#191c1e] dark:text-white">
                    {route.total_travel_time_min !== undefined ? Math.round(route.total_travel_time_min) : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-[#191c1e] dark:text-white">
                    {route.num_stops !== undefined ? route.num_stops : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RouteDetailsTable;
