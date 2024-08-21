
export interface EmployeeType{
    first_name : string,
    last_name : string,
    id : number,
    
  }
export  interface EmployeeAttendanceType{
    id: number,
    username : string,
    first_name : string,
    email : string
  }

export  interface AdminLeaveDataType{
    first_name : string
    last_name : string
    type : string
    date : string
    leave_day_type : string
    status : string
  }

export interface LeaveDataType {
    id ?: string
    remaining_paid_leave : string
    remaining_casual_leave : string
    remaining_unpaid_leave : string
    remaining_sick_leave : string
    api? : string
  }

export interface AdminHolidayType {
  id?: number;
  name: string;
  date: string;
  holiday_image: File | string | null;
  error : string | undefined;
}

export interface AdminLeaveDataType{
  user_id : number
  first_name : string
  last_name : string
  status : string
  date : string
  type : string
  leave_day_type : string
  reason : string
  id : number
}
