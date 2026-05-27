import { useState, useCallback } from 'react';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: 'gtfs' | 'demand';
  uploadedAt: string;
  status: 'validating' | 'valid' | 'invalid';
}

export const useDataManagement = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const uploadFile = useCallback(async (file: File, type: 'gtfs' | 'demand') => {
    setIsUploading(true);
    
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type,
      uploadedAt: new Date().toISOString(),
      status: 'validating'
    };
    
    setFiles(prev => [...prev, newFile]);
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'valid' } 
              : f
          )
        );
        setIsUploading(false);
        resolve();
      }, 1500);
    });
  }, []);
  
  const deleteFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);
  
  return { files, isUploading, uploadFile, deleteFile };
};
