import * as XLSX from 'xlsx';
import { Student, ReportData } from '@/types';

// Export students data to Excel
export const exportStudentsToExcel = (students: Student[]): void => {
  const worksheet = XLSX.utils.json_to_sheet(
    students.map(student => ({
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
    ['Yurt Devam Raporu'],
    [`Tarih Aralığı: ${reportData.dateRange.start} to ${reportData.dateRange.end}`],
    [`Toplam Öğrenci: ${reportData.totalStudents}`],
    [`Ortalama Devam: ${reportData.averageAttendance.toFixed(2)}%`],
    [''], // Empty row
    ['Öğrenci Adı', 'Toplam Oturum', 'Katılım Oturumları', 'Devam %']
  ];
  
  reportData.stats.forEach(stat => {
    summaryData.push([
      stat.studentName,
      stat.totalSessions.toString(),
      stat.attendedSessions.toString(),
      `${stat.attendancePercentage}%`
    ]);
  });
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Özet');
  
  // Detailed stats sheet
  const detailedData = reportData.stats.map(stat => ({
    'Student Name': stat.studentName,
    'Total Sessions': stat.totalSessions,
    'Attended Sessions': stat.attendedSessions,
    'Attendance Percentage': stat.attendancePercentage
  }));
  
  const detailedSheet = XLSX.utils.json_to_sheet(detailedData);
  XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Detaylı İstatistikler');
  
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
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];
        
        const students: Student[] = jsonData.map((row, index: number) => ({
          id: `student-${Date.now()}-${index}`,
          name: (row['Name'] || row['name'] || row['Student Name'] || row['student_name'] || '') as string
        })).filter(student => student.name.trim().length > 0);
        
        resolve(students);
      } catch {
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
        const data = JSON.parse(e.target?.result as string) as Record<string, unknown>[];
        const students: Student[] = Array.isArray(data) 
          ? data.map((student, index: number) => ({
              id: (student.id as string) || `student-${Date.now()}-${index}`,
              name: (student.name as string) || ''
            })).filter(student => student.name.trim().length > 0)
          : [];
        
        resolve(students);
      } catch {
        reject(new Error('Invalid JSON format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};
