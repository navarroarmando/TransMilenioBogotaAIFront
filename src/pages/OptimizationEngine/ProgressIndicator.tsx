interface ProgressIndicatorProps {
  progress: number;
  isRunning: boolean;
}

const ProgressIndicatorPresenter = ({ progress, isRunning }: ProgressIndicatorProps) => {
  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#926f6b] dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#e31e24] rounded-full"></span>
        Progreso de Ejecución
      </h3>
      <div className="relative pt-1">
        <div className="flex mb-4 items-center justify-between">
          <div>
            <span className="text-xs font-bold inline-block py-2 px-4 uppercase rounded-full text-white bg-gradient-to-r from-[#e31e24] to-[#c00014] dark:from-[#3EA32A] dark:to-[#015EB0] shadow-md">
              {isRunning ? 'En Progreso' : 'Completado'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#191c1e] dark:text-white">
              {progress.toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-[#f7f9fb] dark:bg-[#121212] border-2 border-[#926f6b] dark:border-[#015EB0]/30">
          <div
            style={{ width: `${progress}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#e31e24] to-[#c00014] dark:from-[#3EA32A] dark:to-[#015EB0] transition-all duration-500 rounded-full ${
              isRunning ? 'animate-pulse' : ''
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicatorPresenter;
