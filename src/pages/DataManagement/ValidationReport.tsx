interface ValidationReportProps {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}

const ValidationReportPresenter = ({ isValid, errors = [], warnings = [] }: ValidationReportProps) => {
  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Reporte de Validación
      </h3>
      
      {isValid && errors.length === 0 && warnings.length === 0 ? (
        <div className="bg-[#3EA32A]/10 dark:bg-[#3EA32A]/20 border-2 border-[#3EA32A]/30 dark:border-[#3EA32A]/40 text-[#3EA32A] dark:text-[#3EA32A] px-6 py-4 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-[#3EA32A]/20 dark:bg-[#3EA32A]/30 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-[#3EA32A] rounded-full"></div>
          </div>
          <p className="font-bold text-lg">Todos los archivos son válidos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {errors.length > 0 && (
            <div className="bg-[#ffdad6] dark:bg-red-900/20 border-l-4 border-[#ba1a1a] dark:border-red-600 px-6 py-4 rounded-xl">
              <h4 className="font-bold text-[#93000a] dark:text-red-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
                Errores
              </h4>
              <ul className="space-y-2">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-[#93000a] dark:text-red-300 font-medium pl-4 border-l-2 border-[#ba1a1a] dark:border-red-500">{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {warnings.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-600 px-6 py-4 rounded-xl">
              <h4 className="font-bold text-yellow-600 dark:text-yellow-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Advertencias
              </h4>
              <ul className="space-y-2">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300 font-medium pl-4 border-l-2 border-yellow-300 dark:border-yellow-500">{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidationReportPresenter;
