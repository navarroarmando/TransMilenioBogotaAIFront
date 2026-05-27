import { useState, useCallback } from 'react';
import type { Route, Stop } from '../services/types/optimization.types';
import { mockRoutes, mockStops } from '../services/mock/optimizationMock';

export const useRouteEditor = () => {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [stops] = useState<Stop[]>(mockStops);
  const [feedback, setFeedback] = useState<string[]>([]);
  
  const selectRoute = useCallback((route: Route) => {
    setSelectedRoute(route);
  }, []);
  
  const addStopToRoute = useCallback((stopId: string) => {
    if (!selectedRoute) return;
    
    const stop = stops.find(s => s.id === stopId);
    if (!stop) return;
    
    const updatedRoute: Route = {
      ...selectedRoute,
      stops: [...selectedRoute.stops, stop]
    };
    
    setRoutes(prev => prev.map(r => r.id === updatedRoute.id ? updatedRoute : r));
    setSelectedRoute(updatedRoute);
    setFeedback(prev => [...prev, `Parada ${stop.name} agregada a ${updatedRoute.name}`]);
  }, [selectedRoute, stops]);
  
  const removeStopFromRoute = useCallback((stopId: string) => {
    if (!selectedRoute) return;
    
    const updatedRoute: Route = {
      ...selectedRoute,
      stops: selectedRoute.stops.filter(s => s.id !== stopId)
    };
    
    setRoutes(prev => prev.map(r => r.id === updatedRoute.id ? updatedRoute : r));
    setSelectedRoute(updatedRoute);
    setFeedback(prev => [...prev, `Parada removida de ${updatedRoute.name}`]);
  }, [selectedRoute]);
  
  const saveRoute = useCallback(() => {
    if (!selectedRoute) return;
    setFeedback(prev => [...prev, `Ruta ${selectedRoute.name} guardada exitosamente`]);
  }, [selectedRoute]);
  
  return {
    routes,
    selectedRoute,
    stops,
    feedback,
    selectRoute,
    addStopToRoute,
    removeStopFromRoute,
    saveRoute
  };
};
