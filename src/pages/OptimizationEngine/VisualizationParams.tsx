import type { VisualizationConfig } from '../../services/types/optimization.types';

interface VisualizationParamsProps {
  params: VisualizationConfig;
  onChange: (params: VisualizationConfig) => void;
  disabled: boolean;
}

const VisualizationParamsPresenter = ({ params, onChange, disabled }: VisualizationParamsProps) => {
  const handleChange = (field: keyof VisualizationConfig, value: string | boolean) => {
    onChange({ ...params, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#926f6b] dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#e31e24] rounded-full"></span>
        Parámetros de Visualización
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">Tipo de Gráfico</label>
          <select
            value={params.visualization_graph}
            onChange={(e) => handleChange('visualization_graph', e.target.value)}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e31e24] focus:border-[#e31e24] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50"
          >
            <option value="integrated_osm">Integrated OSM</option>
            <option value="networkx">NetworkX</option>
            <option value="geopandas">GeoPandas</option>
            <option value="folium">Folium</option>
          </select>
        </div>
        <div className="flex items-center bg-[#f7f9fb] dark:bg-[#121212] border-2 border-[#926f6b] dark:border-[#015EB0]/30 rounded-xl px-4 py-3 hover:border-[#e31e24]/40 dark:hover:border-[#015EB0]/50 transition-all duration-300">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={params.enable_visualization}
              onChange={(e) => handleChange('enable_visualization', e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 accent-[#e31e24] rounded focus:ring-2 focus:ring-[#e31e24] disabled:opacity-50"
            />
            <span className="text-sm font-bold text-[#191c1e] dark:text-white uppercase tracking-wide">Habilitar Visualización</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default VisualizationParamsPresenter;
