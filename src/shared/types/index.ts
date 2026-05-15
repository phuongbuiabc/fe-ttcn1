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
  userId?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  idCardNumber?: string;
  currentAddress: string;
  permanentAddress?: string;
  position: string;
  joinDate?: string;
  employmentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface CreateEmployeeRequest {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  idCardNumber?: string;
  idCardIssuedDate?: string;
  idCardIssuedPlace?: string;
  permanentAddress?: string;
  currentAddress: string;
  position: string;
  joinDate: string;
  bankAccountNumber?: string;
  bankName?: string;
  taxCode?: string;
  socialInsuranceNumber?: string;
  healthInsuranceNumber?: string;
}



export interface WorkSchedule {
  id: string;
  employeeId: string;
  employeeName?: string;
  workName: string;
  areaId: string;
  areaName?: string;
  workDate: string;
  shift: string;
  note?: string;
  status: string;
}

export interface CreateScheduleRequest {
  employeeId: string;
  workName: string;
  areaId: string;
  shift: string;
  note?: string;
  status: string;
  workDate: string;
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}


export interface Supply {
  id: string;
  name: string;
  unit: string;
  materialType: string;
  quantity: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplyLoss {
  id: string;
  loss_id: string;
  supply_id: string;
  employee_id: string;
  date: string;
  quantity: number;
  reason: string;
  note: string;
}