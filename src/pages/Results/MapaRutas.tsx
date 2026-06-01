import { useState, useEffect } from 'react';
import { API_CONFIG } from '../../config/api';

interface MapaRutasProps {
  executionId: string;
}

const MapaRutas = ({ executionId }: MapaRutasProps) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisualization = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/results/${executionId}/visualization/routes_map_interactive`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Error al cargar el mapa de rutas');
        }

        const html = await response.text();
        setHtmlContent(html);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    if (executionId) {
      fetchVisualization();
    }
  }, [executionId]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20">
        <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-4">Mapa de Rutas</h3>
        <div className="flex items-center justify-center h-[576px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3EA32A] dark:border-[#015EB0]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20">
        <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-4">Mapa de Rutas</h3>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-4">Mapa de Rutas</h3>
      <div className="w-full h-[576px]">
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-0 rounded-lg"
          title="Mapa de Rutas"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

export default MapaRutas;
