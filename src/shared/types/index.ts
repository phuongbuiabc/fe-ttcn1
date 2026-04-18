// types/auth.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
}

export interface User {
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  role: 'ADMIN' | 'OWNER' | 'STAFF';
  avatarUrl?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

// types/pig.ts
export interface Pig {
  id: string;
  pigCode: string;
  type?: string;
  breed: string;
  weight: number;
  healthStatus: string;
  status: string;
  statusColor?: string;
  pen: string;
  penId?: string;
  penName?: string;
  birthDate: string;
  date?: string;
  entryDate: string;
  growth?: string;
  ageDays?: number;
  lastWeightUpdate?: string;
}

export interface Litter {
  id: string;
  motherId: string;
  birthDate: string;
  count: number;
  status: string;
  pen: string;
}

export interface PigStats {
  total: number;
  healthy: number;
  sick: number;
  treating: number;
  growthRate: number;
}

// types/reproduction.ts
export interface SowRecord {
  id: string;
  breed: string;
  pen: string;
  status: 'OPEN' | 'BRED' | 'PREGNANT' | 'FARROWING' | 'LACTATING' | 'WEANED';
  matingDate?: string;
  expectedFarrowDate?: string;
  progress?: number;
  daysInStatus?: number;
}

export interface ReproductionStats {
  totalSows: number;
  pregnantSows: number;
  farrowingSoon: number;
  monthlyLitters: number;
  conceptionRate: number;
}

// types/employee.ts
export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  gender: string;
  dateOfBirth: string;
  permanentAddress: string;
  currentAddress: string;
  phone: string;
  email: string;
  position: string;
  employmentStatus?: string;
}

export interface CreateEmployeeRequest {
  employeeCode: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  permanentAddress: string;
  currentAddress: string;
  phone: string;
  email: string;
  position: string;
}

export interface WorkSchedule {
  id: string;
  employeeCode: string;
  employeeName?: string;
  task: string;
  sectionId: string;
  sectionName?: string;
  workDate: string;
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT';
  status: string;
}

export interface CreateScheduleRequest {
  employeeCode: string;
  task: string;
  sectionId: string;
  workDate: string;
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT';
  status: string;
}

export interface Supplier {
  id: string;
  supplierCode: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
}
