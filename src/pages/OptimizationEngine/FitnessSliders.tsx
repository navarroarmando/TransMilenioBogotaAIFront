import type { FitnessWeights } from '../../services/types/optimization.types';
import InfoTooltip from '../../components/ui/InfoTooltip';

interface FitnessSlidersProps {
  weights: FitnessWeights;
  onChange: (weights: FitnessWeights) => void;
  disabled: boolean;
}

const FitnessSlidersPresenter = ({ weights, onChange, disabled }: FitnessSlidersProps) => {
  const handleChange = (field: keyof FitnessWeights, value: number) => {
    onChange({ ...weights, [field]: value });
  };

  const total = Object.values(weights).reduce((sum, val) => sum + val, 0);
  const isValid = Math.abs(total - 1.0) < 0.01;

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#926f6b] dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#e31e24] rounded-full"></span>
        Pesos de Fitness (deben sumar 100%)
      </h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-[#191c1e] dark:text-white tracking-wide flex items-center">Eficiencia<InfoTooltip content="Mide qué tan eficientemente se utiliza la flota de buses para satisfacer la demanda. Valores altos priorizan rutas con alta ocupación." /></label>
            <span className="text-sm font-bold text-[#e31e24] dark:text-[#3EA32A]">{(weights.efficiency * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={weights.efficiency}
            onChange={(e) => handleChange('efficiency', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-3 bg-[#f7f9fb] dark:bg-[#121212] rounded-full appearance-none cursor-pointer disabled:opacity-50 accent-[#e31e24] dark:accent-[#3EA32A]"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-[#191c1e] dark:text-white tracking-wide flex items-center">Cobertura<InfoTooltip content="Porcentaje de demanda total que es atendida por el sistema de transporte. Valores altos priorizan máxima cobertura." /></label>
            <span className="text-sm font-bold text-[#e31e24] dark:text-[#3EA32A]">{(weights.coverage * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={weights.coverage}
            onChange={(e) => handleChange('coverage', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-3 bg-[#f7f9fb] dark:bg-[#121212] rounded-full appearance-none cursor-pointer disabled:opacity-50 accent-[#e31e24] dark:accent-[#3EA32A]"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-[#191c1e] dark:text-white tracking-wide flex items-center">Equidad<InfoTooltip content="Mide qué tan equitativamente se distribuye el servicio entre diferentes estratos socioeconómicos. Valores altos priorizan equidad." /></label>
            <span className="text-sm font-bold text-[#e31e24] dark:text-[#3EA32A]">{(weights.equity * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={weights.equity}
            onChange={(e) => handleChange('equity', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-3 bg-[#f7f9fb] dark:bg-[#121212] rounded-full appearance-none cursor-pointer disabled:opacity-50 accent-[#e31e24] dark:accent-[#3EA32A]"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-[#191c1e] dark:text-white tracking-wide flex items-center">Economía<InfoTooltip content="Mide el costo operativo del sistema de transporte. Valores altos priorizan minimizar costos operativos." /></label>
            <span className="text-sm font-bold text-[#e31e24] dark:text-[#3EA32A]">{(weights.economy * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={weights.economy}
            onChange={(e) => handleChange('economy', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-3 bg-[#f7f9fb] dark:bg-[#121212] rounded-full appearance-none cursor-pointer disabled:opacity-50 accent-[#e31e24] dark:accent-[#3EA32A]"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-[#191c1e] dark:text-white tracking-wide flex items-center">Velocidad<InfoTooltip content="Mide la velocidad promedio de los buses en las rutas. Valores altos priorizan rutas más rápidas." /></label>
            <span className="text-sm font-bold text-[#e31e24] dark:text-[#3EA32A]">{(weights.speed * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={weights.speed}
            onChange={(e) => handleChange('speed', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-3 bg-[#f7f9fb] dark:bg-[#121212] rounded-full appearance-none cursor-pointer disabled:opacity-50 accent-[#e31e24] dark:accent-[#3EA32A]"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-[#191c1e] dark:text-white tracking-wide flex items-center">Transferencias<InfoTooltip content="Mide el número de transferencias necesarias para completar un viaje. Valores altos penalizan rutas con muchas transferencias." /></label>
            <span className="text-sm font-bold text-[#e31e24] dark:text-[#3EA32A]">{(weights.transfers * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={weights.transfers}
            onChange={(e) => handleChange('transfers', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-3 bg-[#f7f9fb] dark:bg-[#121212] rounded-full appearance-none cursor-pointer disabled:opacity-50 accent-[#e31e24] dark:accent-[#3EA32A]"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-[#191c1e] dark:text-white tracking-wide flex items-center">Velocidad máxima<InfoTooltip content="Prioriza rutas que aprovechan vías con alta velocidad máxima. Valores altos fomentan uso de vías rápidas." /></label>
            <span className="text-sm font-bold text-[#e31e24] dark:text-[#3EA32A]">{(weights.speed_max * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={weights.speed_max}
            onChange={(e) => handleChange('speed_max', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-3 bg-[#f7f9fb] dark:bg-[#121212] rounded-full appearance-none cursor-pointer disabled:opacity-50 accent-[#e31e24] dark:accent-[#3EA32A]"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-[#191c1e] dark:text-white tracking-wide flex items-center">Capacidad vial<InfoTooltip content="Mide la capacidad de las vías utilizadas por las rutas. Valores altos priorizan vías con mayor capacidad." /></label>
            <span className="text-sm font-bold text-[#e31e24] dark:text-[#3EA32A]">{(weights.road_capacity * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={weights.road_capacity}
            onChange={(e) => handleChange('road_capacity', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-3 bg-[#f7f9fb] dark:bg-[#121212] rounded-full appearance-none cursor-pointer disabled:opacity-50 accent-[#e31e24] dark:accent-[#3EA32A]"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-[#191c1e] dark:text-white tracking-wide flex items-center">Tiempo viaje real<InfoTooltip content="Mide el tiempo real de viaje considerando congestión y condiciones reales. Valores altos priorizan viajes más cortos." /></label>
            <span className="text-sm font-bold text-[#e31e24] dark:text-[#3EA32A]">{(weights.travel_time_real * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={weights.travel_time_real}
            onChange={(e) => handleChange('travel_time_real', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-3 bg-[#f7f9fb] dark:bg-[#121212] rounded-full appearance-none cursor-pointer disabled:opacity-50 accent-[#e31e24] dark:accent-[#3EA32A]"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-[#191c1e] dark:text-white tracking-wide flex items-center">Costo operativo<InfoTooltip content="Costo total de operación del sistema incluyendo combustible, mantenimiento y personal. Valores altos minimizan costos." /></label>
            <span className="text-sm font-bold text-[#e31e24] dark:text-[#3EA32A]">{(weights.operating_cost * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={weights.operating_cost}
            onChange={(e) => handleChange('operating_cost', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-3 bg-[#f7f9fb] dark:bg-[#121212] rounded-full appearance-none cursor-pointer disabled:opacity-50 accent-[#e31e24] dark:accent-[#3EA32A]"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-[#191c1e] dark:text-white tracking-wide flex items-center">Accesibilidad<InfoTooltip content="Mide qué tan fácil es acceder al sistema de transporte desde diferentes puntos. Valores altos mejoran accesibilidad." /></label>
            <span className="text-sm font-bold text-[#e31e24] dark:text-[#3EA32A]">{(weights.accessibility * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={weights.accessibility}
            onChange={(e) => handleChange('accessibility', parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-3 bg-[#f7f9fb] dark:bg-[#121212] rounded-full appearance-none cursor-pointer disabled:opacity-50 accent-[#e31e24] dark:accent-[#3EA32A]"
          />
        </div>
      </div>
      <div className={`mt-6 p-4 rounded-xl border-2 ${isValid ? 'bg-[#e31e24]/10 dark:bg-[#3EA32A]/20 border-[#e31e24]/30 dark:border-[#3EA32A]/40 text-[#e31e24] dark:text-[#3EA32A]' : 'bg-[#ffdad6] dark:bg-red-900/20 border-[#ba1a1a] dark:border-red-600 text-[#93000a] dark:text-red-200'}`}>
        <p className="text-sm font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-current"></span>
          Total: {(total * 100).toFixed(0)}% {isValid ? '✓' : '✗'}
        </p>
      </div>
    </div>
  );
};

export default FitnessSlidersPresenter;
