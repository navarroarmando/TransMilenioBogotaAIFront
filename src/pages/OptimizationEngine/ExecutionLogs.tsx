interface ExecutionLogsProps {
  logs: string[];
}

const ExecutionLogsPresenter = ({ logs }: ExecutionLogsProps) => {
  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#926f6b] dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#e31e24] rounded-full"></span>
        Logs de Ejecución
      </h3>
      <div className="bg-[#0f172a] dark:bg-[#0a0a1a] rounded-xl p-4 h-64 overflow-y-auto border-2 border-[#926f6b] dark:border-[#015EB0]/30">
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-4 bg-[#e31e24]/20 dark:bg-[#3EA32A]/20 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-[#e31e24]/30 dark:bg-[#3EA32A]/30 rounded-full"></div>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm font-semibold">Esperando ejecución...</p>
          </div>
        ) : (
          <pre className="text-[#e31e24] dark:text-[#3EA32A] text-sm font-mono">
            {logs.map((log, index) => (
              <div key={index} className="mb-1 hover:text-white dark:hover:text-white transition-colors cursor-default">{log}</div>
            ))}
          </pre>
        )}
      </div>
    </div>
  );
};

export default ExecutionLogsPresenter;
