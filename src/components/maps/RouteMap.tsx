import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import type { MapContainerProps } from 'react-leaflet';
import type { TileLayerProps } from 'react-leaflet';
import type { Route } from '../../services/types/optimization.types';
import 'leaflet/dist/leaflet.css';

interface RouteMapProps {
  routes: Route[];
  center?: [number, number];
  zoom?: number;
}

const RouteMapPresenter = ({ routes, center = [10.463, -73.25], zoom = 13 }: RouteMapProps) => {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <MapContainer {...({ center, zoom, style: { height: '100%', width: '100%' } } as MapContainerProps)}>
      <TileLayer
        {...({ attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" } as TileLayerProps)}
      />
      {routes.map((route, index) => {
        const positions = route.stops.map(stop => [stop.lat, stop.lng] as [number, number]);
        const color = colors[index % colors.length];
        
        return (
          <div key={route.id}>
            <Polyline positions={positions} pathOptions={{ color, weight: 4 }} />
            {route.stops.map((stop) => (
              <Marker key={stop.id} position={[stop.lat, stop.lng]}>
                <Popup>
                  <div>
                    <strong>{stop.name}</strong>
                    <br />
                    Demanda: {stop.demand}
                    <br />
                    Estrato: {stop.stratum}
                  </div>
                </Popup>
              </Marker>
            ))}
          </div>
        );
      })}
    </MapContainer>
  );
};

export default RouteMapPresenter;
