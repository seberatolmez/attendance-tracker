export interface Student {
  id: string;
  name: string;
  studentId?: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string; // YYYY-MM-DD format
  morning: boolean;
  evening: boolean;
}

export interface AttendanceStats {
  studentId: string;
  studentName: string;
  totalSessions: number;
  attendedSessions: number;
  attendancePercentage: number;
}

export interface AttendanceData {
  students: Student[];
  records: AttendanceRecord[];
}

export interface ReportData {
  dateRange: {
    start: string;
    end: string;
  };
  stats: AttendanceStats[];
  totalStudents: number;
  averageAttendance: number;
}

export interface FileUploadResult {
  success: boolean;
  students?: Student[];
  error?: string;
}
