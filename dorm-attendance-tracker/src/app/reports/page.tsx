'use client';

import { useState, useEffect } from 'react';
import { Student, AttendanceData, AttendanceStats } from '@/types';
import { 
  loadFromLocalStorage, 
  calculateStudentStats,
  getUniqueDates,
  getDateRange
} from '@/utils/dataUtils';
import ReportGenerator from '@/components/ReportGenerator';
import Link from 'next/link';

export default function ReportsPage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({ students: [], records: [] });
  const [filteredStats, setFilteredStats] = useState<AttendanceStats[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = loadFromLocalStorage<AttendanceData>('dorm-attendance-data');
    if (savedData) {
      setAttendanceData(savedData);
      // Calculate initial stats for all records
      try {
        const allStats = savedData.students.map((student: Student) => 
          calculateStudentStats(student, savedData.records)
        );
        setFilteredStats(allStats);
      } catch (error) {
        console.error('Error calculating student stats:', error);
        setFilteredStats([]);
      }
    }
    setIsLoading(false);
  }, []);

  const handleGenerateReport = (startDate: string, endDate: string) => {
    setDateRange({ start: startDate, end: endDate });
    
    // Filter records within the date range
    const dateRangeArray = getDateRange(startDate, endDate);
    const filteredRecords = attendanceData.records.filter(record => 
      dateRangeArray.includes(record.date)
    );
    
    // Calculate stats for filtered records
    try {
      const stats = attendanceData.students.map(student => 
        calculateStudentStats(student, filteredRecords)
      );
      setFilteredStats(stats);
    } catch (error) {
      console.error('Error calculating filtered stats:', error);
      setFilteredStats([]);
    }
  };

  const getOverallStats = () => {
    if (filteredStats.length === 0) return null;
    
    const totalSessions = filteredStats.reduce((sum, stat) => sum + stat.totalSessions, 0);
    const attendedSessions = filteredStats.reduce((sum, stat) => sum + stat.attendedSessions, 0);
    const averageAttendance = filteredStats.reduce((sum, stat) => sum + stat.attendancePercentage, 0) / filteredStats.length;
    
    return {
      totalSessions,
      attendedSessions,
      averageAttendance,
      totalStudents: filteredStats.length
    };
  };

  const getUniqueDatesSorted = () => {
    const dates = getUniqueDates(attendanceData.records);
    return dates.sort().reverse(); // Most recent first
  };

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

  if (attendanceData.students.length === 0) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Veri Bulunamadı</h2>
            <p className="text-gray-600 mb-6">
              Rapor oluşturmadan önce öğrenci eklemeniz ve devam kaydı tutmanız gerekiyor.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ana Sayfaya Git
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const overallStats = getOverallStats();

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Devam Raporları</h1>
          <p className="mt-2 text-gray-600">
            Detaylı devam raporları oluşturun ve dışa aktarın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Generator */}
          <div className="lg:col-span-1">
            <ReportGenerator
              stats={filteredStats}
              onGenerateReport={handleGenerateReport}
            />
          </div>

          {/* Statistics */}
          <div className="lg:col-span-2">
            {overallStats && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {dateRange ? 'Filtrelenmiş İstatistikler' : 'Genel İstatistikler'}
                </h2>
                {dateRange && (
                  <p className="text-sm text-gray-600 mb-4">
                    Tarih Aralığı: {new Date(dateRange.start).toLocaleDateString('tr-TR')} - {new Date(dateRange.end).toLocaleDateString('tr-TR')}
                  </p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{overallStats.totalStudents}</div>
                    <div className="text-sm text-gray-500">Toplam Öğrenci</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{overallStats.totalSessions}</div>
                    <div className="text-sm text-gray-500">Toplam Oturum</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{overallStats.attendedSessions}</div>
                    <div className="text-sm text-gray-500">Katılım Oturumları</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{overallStats.averageAttendance.toFixed(1)}%</div>
                    <div className="text-sm text-gray-500">Ortalama Devam</div>
                  </div>
                </div>
              </div>
            )}
            {filteredStats.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Öğrenci Devam İstatistikleri ({filteredStats.length} Öğrenci)
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Öğrenci Adı
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Toplam Oturum
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Katılım Oturumları
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Devam Oranı
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStats.map((stat, index) => (
                        <tr key={stat.studentId || stat.studentName || index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {stat.studentName || 'Bilinmeyen Öğrenci'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {stat.totalSessions || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {stat.attendedSessions || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {(stat.attendancePercentage || 0).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">Devam Verisi Yok</h3>
                <p className="text-gray-500 mb-4">
                  {dateRange 
                    ? 'Seçilen tarih aralığı için devam kaydı bulunamadı.'
                    : 'Henüz hiç devam kaydı tutulmamış.'
                  }
                </p>
                <a
                  href="/attendance"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Devam Kaydet
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Attendance History */}
        {getUniqueDatesSorted().length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Devam Geçmişi</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Tarih</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-500">Var Olan Öğrenciler</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-500">Sabah Oturumları</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-500">Akşam Oturumları</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-500">Toplam Devam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getUniqueDatesSorted().slice(0, 20).map((date) => {
                    const recordsForDate = attendanceData.records.filter(record => record.date === date);
                    const morningPresent = recordsForDate.filter(record => record.morning).length;
                    const eveningPresent = recordsForDate.filter(record => record.evening).length;
                    const totalPresent = morningPresent + eveningPresent;
                    const totalPossible = attendanceData.students.length * 2;
                    const attendancePercentage = totalPossible > 0 ? (totalPresent / totalPossible) * 100 : 0;
                    
                    return (
                      <tr key={date} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-900">
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-2 text-center text-gray-900">
                          {recordsForDate.length}/{attendanceData.students.length}
                        </td>
                        <td className="px-4 py-2 text-center text-gray-900">{morningPresent}</td>
                        <td className="px-4 py-2 text-center text-gray-900">{eveningPresent}</td>
                        <td className="px-4 py-2 text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            attendancePercentage >= 80 ? 'bg-green-100 text-green-800' :
                            attendancePercentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {attendancePercentage.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
