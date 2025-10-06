'use client';

import { createContext, useContext, ReactNode } from 'react';
import { AttendanceData } from '@/types';

interface AttendanceContextType {
  data: AttendanceData;
  setData: (data: AttendanceData) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: ReactNode }) {
  // This context can be used for global state management if needed
  // For now, each component manages its own state with localStorage
  return <>{children}</>;
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}
