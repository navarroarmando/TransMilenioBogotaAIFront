import type { SystemStatus } from '../../services/types/dashboard.types';
import { Cpu, HardDrive, Activity } from 'lucide-react';

interface SystemStatusProps {
  status: SystemStatus;
}

const SystemStatusPresenter = ({ status }: SystemStatusProps) => {
  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Estado del Sistema
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-[#2a2a4a] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-5 h-5 text-[#3EA32A]" />
            <span className="text-sm font-semibold text-[#191c1e] dark:text-white">CPU</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-[#3EA32A] h-2 rounded-full transition-all duration-300"
                style={{ width: `${status.cpu_usage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#191c1e] dark:text-white">{status.cpu_usage.toFixed(0)}%</span>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-[#2a2a4a] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-[#3EA32A]" />
            <span className="text-sm font-semibold text-[#191c1e] dark:text-white">Memoria</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-[#3EA32A] h-2 rounded-full transition-all duration-300"
                style={{ width: `${status.memory_usage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#191c1e] dark:text-white">{status.memory_usage.toFixed(0)}%</span>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-[#2a2a4a] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <HardDrive className="w-5 h-5 text-[#3EA32A]" />
            <span className="text-sm font-semibold text-[#191c1e] dark:text-white">Disco</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-[#3EA32A] h-2 rounded-full transition-all duration-300"
                style={{ width: `${status.disk_usage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#191c1e] dark:text-white">{status.disk_usage.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusPresenter;
