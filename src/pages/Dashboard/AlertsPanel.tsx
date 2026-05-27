interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  location: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanelPresenter = ({ alerts }: AlertsPanelProps) => {
  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600 text-red-800 dark:text-red-200';
      case 'info':
        return 'bg-[#015EB0]/10 dark:bg-[#015EB0]/20 border-[#015EB0] dark:border-[#015EB0]/60 text-[#002E5E] dark:text-blue-200';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#015EB0]/10 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#002E5E] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Alertas de Zonas Problemáticas
      </h3>
      {alerts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No hay alertas activas</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-xl border-l-4 ${getAlertColor(alert.type)} transition-all duration-300 hover:shadow-lg transform hover:-translate-x-1`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-bold text-lg">{alert.message}</p>
                  <p className="text-sm mt-2 opacity-80 font-medium">{alert.location}</p>
                </div>
                <span className="text-xs uppercase font-bold px-3 py-1.5 rounded-full bg-white/70 dark:bg-black/30 shadow-sm">{alert.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPanelPresenter;
