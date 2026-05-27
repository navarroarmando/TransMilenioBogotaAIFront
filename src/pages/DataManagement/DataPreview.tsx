import type { UploadedFile } from '../../hooks/useDataManagement';

interface DataPreviewProps {
  files: UploadedFile[];
  onDelete: (fileId: string) => void;
}

const DataPreviewPresenter = ({ files, onDelete }: DataPreviewProps) => {
  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'valid':
        return 'bg-[#3EA32A]/10 dark:bg-[#3EA32A]/20 text-[#3EA32A] dark:text-[#3EA32A] border border-[#3EA32A]/30';
      case 'invalid':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-600';
      case 'validating':
        return 'bg-[#015EB0]/10 dark:bg-[#015EB0]/20 text-[#015EB0] dark:text-[#015EB0] border border-[#015EB0]/30';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600';
    }
  };

  const getStatusLabel = (status: UploadedFile['status']) => {
    switch (status) {
      case 'valid':
        return 'Válido';
      case 'invalid':
        return 'Inválido';
      case 'validating':
        return 'Validando...';
      default:
        return status;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#015EB0]/10 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#002E5E] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Archivos Cargados
      </h3>
      {files.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#015EB0]/10 dark:bg-[#3EA32A]/10 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-[#015EB0]/20 dark:bg-[#3EA32A]/20 rounded-full"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No hay archivos cargados</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#015EB0]/10 dark:divide-[#015EB0]/20">
            <thead className="bg-[#002E5E]/5 dark:bg-[#015EB0]/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#002E5E] dark:text-white uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#002E5E] dark:text-white uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#002E5E] dark:text-white uppercase tracking-wider">
                  Tamaño
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#002E5E] dark:text-white uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#002E5E] dark:text-white uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1a1a2e] divide-y divide-[#015EB0]/10 dark:divide-[#015EB0]/20">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-[#015EB0]/5 dark:hover:bg-[#015EB0]/10 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#002E5E] dark:text-white">
                    {file.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {file.type === 'gtfs' ? 'GTFS' : 'Demanda'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(file.status)}`}>
                      {getStatusLabel(file.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => onDelete(file.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold text-xs shadow-md hover:shadow-lg"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataPreviewPresenter;
