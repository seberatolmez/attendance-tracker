'use client';

import { useState, useEffect } from 'react';
import { Student, AttendanceData } from '@/types';
import { 
  initializeAttendanceData, 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  calculateStudentStats,
} from '@/utils/dataUtils';
import { sampleAttendanceData } from '@/utils/sampleData';
import StudentList from '@/components/StudentList';
import AttendanceStats from '@/components/AttendanceStats';
import FileUploader from '@/components/FileUploader';

export default function Dashboard() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData>(initializeAttendanceData());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = loadFromLocalStorage<AttendanceData>('dorm-attendance-data');
    if (savedData) {
      setAttendanceData(savedData);
    }
    setIsLoading(false);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveToLocalStorage('dorm-attendance-data', attendanceData);
    }
  }, [attendanceData, isLoading]);

  const handleStudentsUploaded = (students: Student[]) => {
    setAttendanceData(prev => ({
      ...prev,
      students: [...prev.students, ...students]
    }));
    setError(null);
  };

  const handleRemoveStudent = (studentId: string) => {
    setAttendanceData(prev => ({
      ...prev,
      students: prev.students.filter(student => student.id !== studentId),
      records: prev.records.filter(record => record.studentId !== studentId)
    }));
  };

  const handleFileError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const addManualStudent = () => {
    const name = prompt('Öğrenci adını girin:');
    if (name && name.trim()) {
      const newStudent: Student = {
        id: `student-${Date.now()}`,
        name: name.trim()
      };
      
      setAttendanceData(prev => ({
        ...prev,
        students: [...prev.students, newStudent]
      }));
    }
  };

  const loadSampleData = () => {
    if (confirm('Bu işlem mevcut tüm verileri örnek verilerle değiştirecek. Emin misiniz?')) {
      setAttendanceData(sampleAttendanceData);
      setError(null);
    }
  };

  // Calculate attendance statistics
  const attendanceStats = attendanceData.students.map(student => 
    calculateStudentStats(student, attendanceData.records)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yurt Devam Takip Paneli</h1>
          <p className="mt-2 text-gray-600">
            Sabah ve akşam oturumları için günlük yurt devamını takip edin ve yönetin
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Management Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Öğrenci Yönetimi</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={addManualStudent}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Öğrenci Ekle
                  </button>
                  {attendanceData.students.length === 0 && (
                    <button
                      onClick={loadSampleData}
                      className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Örnek Veri Yükle
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <FileUploader
                  onStudentsUploaded={handleStudentsUploaded}
                  onError={handleFileError}
                />
              </div>

              <StudentList
                students={attendanceData.students}
                onRemoveStudent={handleRemoveStudent}
              />
            </div>
          </div>

          {/* Statistics Section */}
          <div className="lg:col-span-2">
            {attendanceData.students.length > 0 ? (
              <AttendanceStats
                stats={attendanceStats}
                totalStudents={attendanceData.students.length}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="mx-auto w-16 h-16 text-gray-300 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Öğrenci Eklenmedi</h3>
                <p className="text-gray-500 mb-4">
                  Devam takibi ve istatistikleri görüntülemek için öğrenci ekleyin
                </p>
                <button
                  onClick={addManualStudent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  İlk Öğrencinizi Ekleyin
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {attendanceData.students.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/attendance"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Bugünkü Devam Kaydı</h3>
                  <p className="text-sm text-gray-500">Sabah ve akşam oturumlarını kaydedin</p>
                </div>
              </a>

              <a
                href="/reports"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Rapor Oluştur</h3>
                  <p className="text-sm text-gray-500">Devam verilerini Excel&apos;e aktar</p>
                </div>
              </a>

              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Mevcut Oturum</h3>
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}