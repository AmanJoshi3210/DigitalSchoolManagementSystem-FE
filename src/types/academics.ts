import type { AttendanceStatus } from './enums'

// Matches AttendanceDto
export interface Attendance {
  id: number
  studentId: number
  date: string
  status: AttendanceStatus
  remarks?: string | null
}

// Matches AttendanceSummaryDto
export interface AttendanceSummary {
  studentId: number
  from?: string | null
  to?: string | null
  totalDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  halfDays: number
  excusedDays: number
  attendancePercentage: number
}

// Matches SubjectDto
export interface Subject {
  id: number
  name: string
  code: string
  grade: string
  description?: string | null
  isActive: boolean
}

// Matches ExamSubjectDto
export interface ExamSubject {
  id: number
  examId: number
  subjectId: number
  subjectName: string
  examDate: string
  maxMarks: number
  passingMarks: number
}

// Matches ExamDto
export interface Exam {
  id: number
  name: string
  grade: string
  academicYear: string
  startDate: string
  endDate: string
  subjects: ExamSubject[]
}

// Matches ExamResultDto
export interface ExamResult {
  id: number
  studentId: number
  examSubjectId: number
  examId: number
  examName: string
  subjectId: number
  subjectName: string
  marksObtained: number
  maxMarks: number
  passingMarks: number
  grade?: string | null
  passed: boolean
  remarks?: string | null
}

// Matches StudentAcademicsSummaryDto
export interface StudentAcademicsSummary {
  studentId: number
  grade: string
  section: string
  subjects: Subject[]
  attendancePercentage: number
  recentResults: ExamResult[]
}
