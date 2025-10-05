'use client';

import { useState, useCallback } from 'react';
import { Student, FileUploadResult } from '@/types';
import { parseStudentExcelFile, parseStudentJsonFile } from '@/utils/excelUtils';

interface FileUploaderProps {
  onStudentsUploaded: (students: Student[]) => void;
  onError: (error: string) => void;
}

export default function FileUploader({ onStudentsUploaded, onError }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    setIsProcessing(true);
    
    try {
      let students: Student[] = [];
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        students = await parseStudentExcelFile(file);
      } else if (file.name.endsWith('.json')) {
        students = await parseStudentJsonFile(file);
      } else {
        throw new Error('Desteklenmeyen dosya formatı. Lütfen .xlsx, .xls veya .json dosyaları yükleyin.');
      }

      if (students.length === 0) {
        throw new Error('Dosyada geçerli öğrenci verisi bulunamadı.');
      }

      onStudentsUploaded(students);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Dosya işlenirken hata oluştu');
    } finally {
      setIsProcessing(false);
    }
  }, [onStudentsUploaded, onError]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept=".xlsx,.xls,.json"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isProcessing ? 'Dosya işleniyor...' : 'Öğrenci Verisi Yükle'}
            </p>
            <p className="text-sm text-gray-500">
              Sürükle bırak veya tıklayarak dosya seç
            </p>
            <p className="text-xs text-gray-400 mt-2">
              .xlsx, .xls ve .json dosyaları desteklenir
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p className="font-medium mb-1">Beklenen dosya formatları:</p>
        <p>• Excel: "Name" sütunu</p>
        <p>• JSON: "name" özellikli nesneler dizisi</p>
      </div>
    </div>
  );
}
