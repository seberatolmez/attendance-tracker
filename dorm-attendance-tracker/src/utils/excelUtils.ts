import * as XLSX from 'xlsx';
import { Student, AttendanceRecord, AttendanceStats, ReportData } from '@/types';

// Export students data to Excel
export const exportStudentsToExcel = (students: Student[]): void => {
  const worksheet = XLSX.utils.json_to_sheet(
    students.map(student => ({
      'Student ID': student.studentId || '',
      'Name': student.name
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  
  XLSX.writeFile(workbook, 'students.xlsx');
};

// Export attendance report to Excel
export const exportAttendanceReportToExcel = (reportData: ReportData): void => {
  const workbook = XLSX.utils.book_new();
  
  // Summary sheet
  const summaryData = [
    ['Dorm Attendance Report'],
    [`Date Range: ${reportData.dateRange.start} to ${reportData.dateRange.end}`],
    [`Total Students: ${reportData.totalStudents}`],
    [`Average Attendance: ${reportData.averageAttendance.toFixed(2)}%`],
    [''], // Empty row
    ['Student Name', 'Total Sessions', 'Attended Sessions', 'Attendance %']
  ];
  
  reportData.stats.forEach(stat => {
    summaryData.push([
      stat.studentName,
      stat.totalSessions,
      stat.attendedSessions,
      `${stat.attendancePercentage}%`
    ]);
  });
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  // Detailed stats sheet
  const detailedData = reportData.stats.map(stat => ({
    'Student Name': stat.studentName,
    'Total Sessions': stat.totalSessions,
    'Attended Sessions': stat.attendedSessions,
    'Attendance Percentage': stat.attendancePercentage
  }));
  
  const detailedSheet = XLSX.utils.json_to_sheet(detailedData);
  XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Detailed Stats');
  
  // Generate filename with date range
  const startDate = new Date(reportData.dateRange.start).toLocaleDateString('en-US');
  const endDate = new Date(reportData.dateRange.end).toLocaleDateString('en-US');
  const filename = `attendance-report-${startDate}-to-${endDate}.xlsx`.replace(/\//g, '-');
  
  XLSX.writeFile(workbook, filename);
};

// Parse Excel file for student data
export const parseStudentExcelFile = (file: File): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const students: Student[] = jsonData.map((row: any, index: number) => ({
          id: `student-${Date.now()}-${index}`,
          name: row['Name'] || row['name'] || row['Student Name'] || row['student_name'] || '',
          studentId: row['Student ID'] || row['student_id'] || row['ID'] || row['id'] || ''
        })).filter(student => student.name.trim().length > 0);
        
        resolve(students);
      } catch (error) {
        reject(new Error('Failed to parse Excel file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Parse JSON file for student data
export const parseStudentJsonFile = (file: File): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const students: Student[] = Array.isArray(data) 
          ? data.map((student: any, index: number) => ({
              id: student.id || `student-${Date.now()}-${index}`,
              name: student.name || '',
              studentId: student.studentId || student.id || ''
            })).filter(student => student.name.trim().length > 0)
          : [];
        
        resolve(students);
      } catch (error) {
        reject(new Error('Invalid JSON format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};
