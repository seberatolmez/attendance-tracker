# Dorm Attendance Tracker

A lightweight, frontend-only Next.js application for tracking daily dorm attendance with morning and evening sessions. Built with modern React patterns, TypeScript, and Tailwind CSS.

## 🎯 Features

### Core Functionality
- **Student Management**: Add students manually or upload from Excel/JSON files
- **Daily Attendance Tracking**: Record morning and evening attendance with checkboxes
- **Statistics Dashboard**: View attendance percentages and detailed statistics
- **Report Generation**: Export attendance reports to Excel files
- **Data Persistence**: All data is stored locally in browser localStorage

### User Interface
- **Clean Dashboard**: Modern, responsive design with Tailwind CSS
- **Navigation**: Easy navigation between Dashboard, Attendance, and Reports
- **Real-time Updates**: Statistics update automatically as you mark attendance
- **Sample Data**: Load sample data to test the application

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dorm-attendance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### Adding Students
1. Go to the Dashboard
2. Upload an Excel/JSON file with student data, or
3. Click "Add Student" to add students manually
4. Or click "Load Sample Data" to test with sample data

### Marking Attendance
1. Navigate to "Add Attendance" 
2. Select the date
3. Check/uncheck morning and evening attendance for each student
4. Click "Save Attendance"

### Generating Reports
1. Go to "Reports"
2. Select a date range
3. Click "Generate Excel Report" to download the report

## 📊 Data Format

### Student Data (Excel/JSON)
- **Excel**: Columns should be "Name" and "Student ID" (optional)
- **JSON**: Array of objects with `name` and `studentId` properties

### Example JSON:
```json
[
  {
    "name": "Ahmed Hassan",
    "studentId": "ST001"
  },
  {
    "name": "Fatima Al-Zahra", 
    "studentId": "ST002"
  }
]
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Validation**: Zod (where needed)
- **Excel Export**: xlsx library
- **File Handling**: Native File API

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── attendance/        # Attendance tracking page
│   ├── reports/          # Reports page
│   ├── layout.tsx        # Root layout with navigation
│   └── page.tsx          # Dashboard page
├── components/           # React components
│   ├── AttendanceTable.tsx
│   ├── AttendanceStats.tsx
│   ├── FileUploader.tsx
│   ├── Navigation.tsx
│   ├── ReportGenerator.tsx
│   └── StudentList.tsx
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   ├── dataUtils.ts     # Data manipulation utilities
│   ├── excelUtils.ts    # Excel import/export utilities
│   └── sampleData.ts    # Sample data for testing
└── lib/                 # Additional libraries
    └── AttendanceContext.tsx
```

## 🎨 UI Components

- **FileUploader**: Drag & drop file upload with support for Excel and JSON
- **StudentList**: Display and manage student roster
- **AttendanceTable**: Interactive table for marking daily attendance
- **AttendanceStats**: Statistics dashboard with summary cards
- **ReportGenerator**: Date range selection and Excel export
- **Navigation**: Top navigation bar with active state indicators

## 💾 Data Storage

All data is stored locally in the browser's localStorage:
- **Key**: `dorm-attendance-data`
- **Structure**: JSON object with `students` and `records` arrays
- **Persistence**: Data persists between browser sessions
- **Backup**: Users can export data via Excel reports
