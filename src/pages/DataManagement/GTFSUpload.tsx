import { Upload } from 'lucide-react';

interface GTFSUploadProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

const GTFSUploadPresenter = ({ onUpload, isUploading }: GTFSUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl p-6 border border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-slide-in">
      <h3 className="text-xl font-bold text-[#191c1e] dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#3EA32A] rounded-full"></span>
        Cargar Archivos
      </h3>
      <div className="border-2 border-dashed border-[#3EA32A]/20 dark:border-[#015EB0]/40 rounded-xl p-10 text-center hover:border-[#3EA32A] dark:hover:border-[#3EA32A] hover:bg-gradient-to-br hover:from-[#3EA32A]/5 hover:to-[#2E7A1F]/5 dark:hover:from-[#015EB0]/10 dark:hover:to-[#3EA32A]/10 transition-all duration-300 group">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#3EA32A]/10 dark:bg-[#3EA32A]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Upload className="w-8 h-8 text-[#3EA32A] dark:text-[#3EA32A]" />
        </div>
        <p className="text-[#191c1e] dark:text-white font-semibold mb-2">Arrastra tu archivo aquí o haz clic para seleccionar</p>
        <p className="text-sm text-[#5d3f3c] dark:text-gray-400 mb-4">Formatos: .zip, .txt, .kmz, ...</p>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
          id="gtfs-upload"
        />
        <label
          htmlFor="gtfs-upload"
          className={`inline-block px-8 py-3 bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] dark:from-[#015EB0] dark:to-[#3EA32A] text-white rounded-xl cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? 'Subiendo...' : 'Seleccionar Archivo'}
        </label>
      </div>
    </div>
  );
};

export default GTFSUploadPresenter;
