import { Student, AttendanceRecord, AttendanceData } from '@/types';

export const sampleStudents: Student[] = [
  { id: 'student-1', name: 'Ahmet Yılmaz', studentId: 'ST001' },
  { id: 'student-2', name: 'Ayşe Demir', studentId: 'ST002' },
  { id: 'student-3', name: 'Mehmet Kaya', studentId: 'ST003' },
  { id: 'student-4', name: 'Fatma Özkan', studentId: 'ST004' },
  { id: 'student-5', name: 'Mustafa Çelik', studentId: 'ST005' },
  { id: 'student-6', name: 'Zeynep Arslan', studentId: 'ST006' },
  { id: 'student-7', name: 'Yusuf Şahin', studentId: 'ST007' },
  { id: 'student-8', name: 'Elif Doğan', studentId: 'ST008' },
];

export const sampleAttendanceRecords: AttendanceRecord[] = [
  // Last 7 days of sample data
  { studentId: 'student-1', date: '2025-01-04', morning: true, evening: true },
  { studentId: 'student-2', date: '2025-01-04', morning: true, evening: false },
  { studentId: 'student-3', date: '2025-01-04', morning: true, evening: true },
  { studentId: 'student-4', date: '2025-01-04', morning: false, evening: true },
  { studentId: 'student-5', date: '2025-01-04', morning: true, evening: true },
  { studentId: 'student-6', date: '2025-01-04', morning: true, evening: true },
  { studentId: 'student-7', date: '2025-01-04', morning: false, evening: false },
  { studentId: 'student-8', date: '2025-01-04', morning: true, evening: true },

  { studentId: 'student-1', date: '2025-01-03', morning: true, evening: true },
  { studentId: 'student-2', date: '2025-01-03', morning: true, evening: true },
  { studentId: 'student-3', date: '2025-01-03', morning: true, evening: true },
  { studentId: 'student-4', date: '2025-01-03', morning: true, evening: true },
  { studentId: 'student-5', date: '2025-01-03', morning: false, evening: true },
  { studentId: 'student-6', date: '2025-01-03', morning: true, evening: true },
  { studentId: 'student-7', date: '2025-01-03', morning: true, evening: true },
  { studentId: 'student-8', date: '2025-01-03', morning: true, evening: true },

  { studentId: 'student-1', date: '2025-01-02', morning: true, evening: true },
  { studentId: 'student-2', date: '2025-01-02', morning: true, evening: true },
  { studentId: 'student-3', date: '2025-01-02', morning: false, evening: true },
  { studentId: 'student-4', date: '2025-01-02', morning: true, evening: false },
  { studentId: 'student-5', date: '2025-01-02', morning: true, evening: true },
  { studentId: 'student-6', date: '2025-01-02', morning: true, evening: true },
  { studentId: 'student-7', date: '2025-01-02', morning: true, evening: true },
  { studentId: 'student-8', date: '2025-01-02', morning: true, evening: true },

  { studentId: 'student-1', date: '2025-01-01', morning: true, evening: true },
  { studentId: 'student-2', date: '2025-01-01', morning: true, evening: true },
  { studentId: 'student-3', date: '2025-01-01', morning: true, evening: true },
  { studentId: 'student-4', date: '2025-01-01', morning: true, evening: true },
  { studentId: 'student-5', date: '2025-01-01', morning: true, evening: true },
  { studentId: 'student-6', date: '2025-01-01', morning: true, evening: true },
  { studentId: 'student-7', date: '2025-01-01', morning: false, evening: false },
  { studentId: 'student-8', date: '2025-01-01', morning: true, evening: true },
];

export const sampleAttendanceData: AttendanceData = {
  students: sampleStudents,
  records: sampleAttendanceRecords,
};
