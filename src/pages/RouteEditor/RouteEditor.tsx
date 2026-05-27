import { useRouteEditor } from '../../hooks/useRouteEditor';
import RouteSelector from './RouteSelector';
import StopManager from './StopManager';
import FeedbackPanel from './FeedbackPanel';
import { Save } from 'lucide-react';

const RouteEditorContainer = () => {
  const {
    routes,
    selectedRoute,
    stops,
    feedback,
    selectRoute,
    addStopToRoute,
    removeStopFromRoute,
    saveRoute
  } = useRouteEditor();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#002E5E] to-[#015EB0] dark:from-[#1a3a5c] dark:to-[#015EB0] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">Editor de Rutas</h1>
        <p className="text-gray-200 dark:text-gray-300">Gestiona y modifica las rutas del sistema de transporte</p>
      </div>
      
      <RouteSelector 
        routes={routes} 
        selectedRoute={selectedRoute}
        onSelect={selectRoute}
      />
      
      {selectedRoute && (
        <>
          <StopManager
            stops={stops}
            routeStops={selectedRoute.stops}
            onAddStop={addStopToRoute}
            onRemoveStop={removeStopFromRoute}
          />
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={saveRoute}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3EA32A] to-[#2d8a22] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold shadow-md"
            >
              <Save className="w-5 h-5" />
              Guardar Cambios
            </button>
          </div>
        </>
      )}
      
      <FeedbackPanel feedback={feedback} />
    </div>
  );
};

export default RouteEditorContainer;
