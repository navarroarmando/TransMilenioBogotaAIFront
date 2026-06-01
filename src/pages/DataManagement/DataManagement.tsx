import { useDataManagement } from '../../hooks/useDataManagement';
import GTFSUpload from './GTFSUpload';
import DemandUpload from './DemandUpload';
import DataPreview from './DataPreview';
import ValidationReport from './ValidationReport';

const DataManagementContainer = () => {
  const { files, isUploading, uploadFile, deleteFile } = useDataManagement();

  const handleGTFSUpload = (file: File) => {
    uploadFile(file, 'gtfs');
  };

  const handleDemandUpload = (file: File) => {
    uploadFile(file, 'demand');
  };

  const hasValidFiles = files.some(f => f.status === 'valid');
  const hasInvalidFiles = files.some(f => f.status === 'invalid');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] dark:from-[#1a3a5c] dark:to-[#015EB0] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">Gestión de Datos</h1>
        <p className="text-gray-200 dark:text-gray-300">Carga y valida archivos GTFS y matrices de demanda</p>
      </div>
      
      <GTFSUpload onUpload={handleGTFSUpload} isUploading={isUploading} />
      <DataPreview files={files} onDelete={deleteFile} />
      <ValidationReport 
        isValid={hasValidFiles && !hasInvalidFiles}
        errors={hasInvalidFiles ? ['Algunos archivos tienen errores de validación'] : []}
        warnings={files.length === 0 ? ['No hay archivos cargados'] : []}
      />
    </div>
  );
};

export default DataManagementContainer;
