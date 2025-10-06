import { Student, AttendanceRecord, AttendanceStats, AttendanceData } from '@/types';

// Generate unique ID for students
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Calculate attendance statistics for a student
export const calculateStudentStats = (
  student: Student,
  records: AttendanceRecord[]
): AttendanceStats => {
  const studentRecords = records.filter(record => record.studentId === student.id);
  const totalSessions = studentRecords.length * 2; // morning + evening
  const attendedSessions = studentRecords.reduce((count, record) => {
    return count + (record.morning ? 1 : 0) + (record.evening ? 1 : 0);
  }, 0);
  
  const attendancePercentage = totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0;
  
  return {
    studentId: student.id,
    studentName: student.name,
    totalSessions,
    attendedSessions,
    attendancePercentage: Math.round(attendancePercentage * 100) / 100
  };
};

// Get all unique dates from attendance records
export const getUniqueDates = (records: AttendanceRecord[]): string[] => {
  const dates = records.map(record => record.date);
  return [...new Set(dates)].sort();
};

// Get attendance records for a specific date
export const getRecordsForDate = (records: AttendanceRecord[], date: string): AttendanceRecord[] => {
  return records.filter(record => record.date === date);
};

// Check if a student has attendance record for a specific date
export const getStudentRecordForDate = (
  studentId: string,
  date: string,
  records: AttendanceRecord[]
): AttendanceRecord | null => {
  return records.find(record => record.studentId === studentId && record.date === date) || null;
};

// Save data to localStorage
export const saveToLocalStorage = (key: string, data: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Load data from localStorage
export const loadFromLocalStorage = <T = unknown>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Initialize default data structure
export const initializeAttendanceData = (): AttendanceData => {
  return {
    students: [],
    records: []
  };
};

// Validate student data
export const validateStudent = (student: Partial<Student>): boolean => {
  return !!(student.name && student.name.trim().length > 0);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get current date in YYYY-MM-DD format
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Get date range for reports
export const getDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};
