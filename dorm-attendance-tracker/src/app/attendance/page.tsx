'use client';

import { useState, useEffect } from 'react';
import { Student, AttendanceRecord, AttendanceData } from '@/types';
import { 
  loadFromLocalStorage, 
  saveToLocalStorage, 
  getCurrentDate, 
  getUniqueDates,
  getRecordsForDate
} from '@/utils/dataUtils';
import AttendanceTable from '@/components/AttendanceTable';

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({ students: [], records: [] });
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = loadFromLocalStorage('dorm-attendance-data');
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

  const handleAttendanceChange = (studentId: string, morning: boolean, evening: boolean) => {
    setAttendanceData(prev => {
      const existingRecordIndex = prev.records.findIndex(
        record => record.studentId === studentId && record.date === selectedDate
      );

      let newRecords = [...prev.records];

      if (existingRecordIndex >= 0) {
        // Update existing record
        newRecords[existingRecordIndex] = {
          ...newRecords[existingRecordIndex],
          morning,
          evening
        };
      } else {
        // Create new record
        newRecords.push({
          studentId,
          date: selectedDate,
          morning,
          evening
        });
      }

      return {
        ...prev,
        records: newRecords
      };
    });
  };

  const handleSaveAttendance = async () => {
    setSaveStatus('saving');
    
    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setSaveStatus('saved');
      
      // Clear saved status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const getUniqueDatesSorted = () => {
    const dates = getUniqueDates(attendanceData.records);
    return dates.sort().reverse(); // Most recent first
  };

  const getAttendanceSummary = () => {
    const recordsForDate = getRecordsForDate(attendanceData.records, selectedDate);
    const totalStudents = attendanceData.students.length;
    const totalSessions = totalStudents * 2; // morning + evening
    const attendedSessions = recordsForDate.reduce((count, record) => {
      return count + (record.morning ? 1 : 0) + (record.evening ? 1 : 0);
    }, 0);
    
    return {
      totalStudents,
      totalSessions,
      attendedSessions,
      attendancePercentage: totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (attendanceData.students.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 text-gray-300 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Öğrenci Bulunamadı</h2>
            <p className="text-gray-600 mb-6">
              Devam takibi yapabilmek için önce öğrenci eklemeniz gerekiyor.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ana Sayfaya Git
            </a>
          </div>
        </div>
      </div>
    );
  }

  const summary = getAttendanceSummary();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Devam Kaydı</h1>
          <p className="mt-2 text-gray-600">
            Sabah ve akşam oturumları için günlük devam kaydı tutun
          </p>
        </div>

        {/* Date Selection and Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Tarih Seç
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hızlı Tarih Seçimi
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedDate(getCurrentDate())}
                  className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Bugün
                </button>
                <button
                  onClick={() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    setSelectedDate(yesterday.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Dün
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Devam Özeti
              </label>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Oturumlar:</span>
                  <span className="font-medium">{summary.attendedSessions}/{summary.totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yüzde:</span>
                  <span className="font-medium">{summary.attendancePercentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSaveAttendance}
            disabled={saveStatus === 'saving'}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              saveStatus === 'saved'
                ? 'bg-green-600 text-white'
                : saveStatus === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saveStatus === 'saving' && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {saveStatus === 'saving' && 'Kaydediliyor...'}
            {saveStatus === 'saved' && 'Kaydedildi!'}
            {saveStatus === 'error' && 'Hata - Tekrar Dene'}
            {saveStatus === 'idle' && 'Devam Kaydet'}
          </button>
        </div>

        {/* Attendance Table */}
        <AttendanceTable
          students={attendanceData.students}
          date={selectedDate}
          records={attendanceData.records}
          onAttendanceChange={handleAttendanceChange}
        />

        {/* Recent Dates */}
        {getUniqueDatesSorted().length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Devam Tarihleri</h3>
            <div className="flex flex-wrap gap-2">
              {getUniqueDatesSorted().slice(0, 10).map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    date === selectedDate
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {new Date(date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
