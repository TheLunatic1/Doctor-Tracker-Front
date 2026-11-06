export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'staff' | 'patient';
  createdAt: string;
  doctorProfile?: Doctor;
  patientProfile?: Patient;
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
  qualification?: string;
  yearsExperience: number;
  rating: number;
  bio?: string;
  patientCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  condition: string;
  doctor: Doctor | string;
  status: 'Active' | 'Discharged' | 'Critical';
  medicalRecordNumber?: string;
  admittedAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  message?: string;
  error?: {
    message: string;
    statusCode: number;
    details?: unknown;
  };
}

export interface AnalyticsOverview {
  totalDoctors: number;
  activeDoctors: number;
  newDoctorsThisMonth: number;
  doctorGrowth: number;
  totalPatients: number;
  activePatients: number;
  newPatientsThisMonth: number;
  patientGrowth: number;
  avgPatientsPerDoctor: number;
  totalHospitals: number;
}

export interface TopDoctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  avatar?: string;
  rating: number;
  status: string;
  patientCount: number;
}

export interface TimelineDataPoint {
  date: string;
  label: string;
  count: number;
}

export interface ConditionDistribution {
  condition: string;
  count: number;
  percentage: number;
}

export interface SpecializationDistribution {
  specialization: string;
  doctorCount: number;
}
