'use client';

import { useState } from 'react';
import { AttendanceStats, ReportData } from '@/types';
import { exportAttendanceReportToExcel } from '@/utils/excelUtils';

interface ReportGeneratorProps {
  stats: AttendanceStats[];
  onGenerateReport: (startDate: string, endDate: string) => void;
}

export default function ReportGenerator({ stats, onGenerateReport }: ReportGeneratorProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert('Lütfen hem başlangıç hem de bitiş tarihlerini seçin');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('Başlangıç tarihi bitiş tarihinden sonra olamaz');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Call the parent to generate the report data
      onGenerateReport(startDate, endDate);
      
      // Calculate average attendance
      const averageAttendance = stats.length > 0 
        ? stats.reduce((sum, stat) => sum + stat.attendancePercentage, 0) / stats.length 
        : 0;

      // Create report data
      const reportData: ReportData = {
        dateRange: { start: startDate, end: endDate },
        stats,
        totalStudents: stats.length,
        averageAttendance
      };

      // Export to Excel
      exportAttendanceReportToExcel(reportData);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Rapor oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsGenerating(false);
    }
  };

  const setQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Devam Raporu Oluştur</h2>
      
      <div className="space-y-6">
        {/* Quick date range buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hızlı Tarih Aralıkları
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setQuickDateRange(7)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Son 7 Gün
            </button>
            <button
              onClick={() => setQuickDateRange(14)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Son 14 Gün
            </button>
            <button
              onClick={() => setQuickDateRange(30)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Son 30 Gün
            </button>
          </div>
        </div>

        {/* Custom date range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Generate button */}
        <div>
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating || !startDate || !endDate}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? 'Rapor Oluşturuluyor...' : 'Excel Raporu Oluştur'}
          </button>
        </div>

        {/* Preview stats */}
        {stats.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Rapor Önizlemesi</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Toplam Öğrenci:</span>
                <span className="ml-2 font-medium">{stats.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Ortalama Devam:</span>
                <span className="ml-2 font-medium">
                  {(stats.reduce((sum, stat) => sum + stat.attendancePercentage, 0) / stats.length).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
