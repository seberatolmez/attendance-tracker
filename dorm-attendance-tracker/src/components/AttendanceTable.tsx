'use client';

import { useState } from 'react';
import { Student, AttendanceRecord } from '@/types';
import { getCurrentDate, getStudentRecordForDate, formatDate } from '@/utils/dataUtils';

interface AttendanceTableProps {
  students: Student[];
  date: string;
  records: AttendanceRecord[];
  onAttendanceChange: (studentId: string, morning: boolean, evening: boolean) => void;
}

export default function AttendanceTable({
  students,
  date,
  records,
  onAttendanceChange
}: AttendanceTableProps) {
  const [localRecords, setLocalRecords] = useState<Record<string, { morning: boolean; evening: boolean }>>({});

  const handleAttendanceChange = (studentId: string, session: 'morning' | 'evening', checked: boolean) => {
    const currentRecord = localRecords[studentId] || getStudentRecordForDate(studentId, date, records) || { morning: false, evening: false };
    
    const updatedRecord = {
      ...currentRecord,
      [session]: checked
    };
    
    setLocalRecords(prev => ({
      ...prev,
      [studentId]: updatedRecord
    }));
    
    onAttendanceChange(studentId, updatedRecord.morning, updatedRecord.evening);
  };

  const getAttendanceValue = (studentId: string, session: 'morning' | 'evening'): boolean => {
    if (localRecords[studentId]) {
      return localRecords[studentId][session];
    }
    
    const record = getStudentRecordForDate(studentId, date, records);
    return record ? record[session] : false;
  };

  const isToday = date === getCurrentDate();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
          {formatDate(date)} Devam Kaydı
          {isToday && (
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Bugün
            </span>
          )}
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Öğrenci Adı
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sabah
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akşam
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => {
              const morningPresent = getAttendanceValue(student.id, 'morning');
              const eveningPresent = getAttendanceValue(student.id, 'evening');
              const isFullyPresent = morningPresent && eveningPresent;
              const isPartiallyPresent = morningPresent || eveningPresent;
              
              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium text-sm">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={morningPresent}
                        onChange={(e) => handleAttendanceChange(student.id, 'morning', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Var</span>
                    </label>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={eveningPresent}
                        onChange={(e) => handleAttendanceChange(student.id, 'evening', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Var</span>
                    </label>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      isFullyPresent
                        ? 'bg-green-100 text-green-800'
                        : isPartiallyPresent
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isFullyPresent ? 'Tam Gün' : isPartiallyPresent ? 'Kısmi' : 'Yok'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
