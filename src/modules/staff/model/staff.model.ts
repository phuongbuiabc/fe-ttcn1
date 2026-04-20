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
