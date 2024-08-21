export interface AttenDanceDataType {
    total_present_days: number;
    total_late_days: number;
    total_half_days: number;
    net_working_hours: string;
    total_office_hours: string;
    total_break_hours: string;
    entry_time: string;
    exit_time: string;
    date: string;
}
export interface LeaveEventType {
    date: string;
    first_name: string;
  }

export interface BirthdayEventType {
    dob: string;
    first_name: string;
  }

export interface EmployeeDataType{
    username : string
    first_name : string
    last_name : string
    email : string
    dob : string
    phone_number : string
    address : string
    bio : string
    gender : string
    api ?: string
    profile?: string
    id? : number
}
export interface DocumentsFormatType{
    pan_card : string
    aadhar_card : string  
    pan_image : string | File | null
    aadhar_image : string| File | null
    id ?: number
    api ?: string
  }

export  interface ApiErrorResponseType {
    username : string
        non_field_errors: string;
     
      }
  
export  interface ApiErrorResponse {
        non_field_errors: string;
      }
export  interface LeaveDayType {
        date: string;
        type: string;
        leave_day_type: string;
        status?: string;
        reason: string;
        id?: string;
        api?: string;
      }
export interface RelationsType{
        designation : string
        department : string
        batch : string
        joining_date : string
        probation_end_date : string
        work_duration : string
        id?: null
        api? : string
      }
export  interface DocumentsType{
        pan_card : string
        aadhar_card : string
        pan_image : string
        aadhar_image : string
      }
export interface ProfileType{
    api ?: string 
    profile : string
  }
export  interface AllEmployeeActivityPropsType{
    refresh : number
    inputValue : string
  }
  interface DesignationType{
    designation : string
  }
  interface ProfileType1{
    profile : string,
    bio: string
  }
export interface EmployeeActivityType {
    id?:number,
    index: number;
    first_name: string;
    last_name: string;
    status: string;
    status_time: string;
  }

export interface BirthDayType{
    id:number
    dob:string
    first_name : string
    last_name : string
    profile : string
}
export interface HolidayType{
    id : number
    holiday_image : string
    date : string
    name : string
}
export interface Message {
    message: string,
    first_name: string
}
export interface DailyLogsPropsType{
    checkIn:string
    breaks:BreakType[]   
    checkOut:string   
    index?:number
}
export interface MessageType{
    senderId : number;
    recipientId : number;
    message : string;
    first_name : string;
}
export interface BreakType {
    breakIn: string;
    breakOut: string;
  }
export  interface DailyLogProps{
    status : string
  }

export interface EmployeeActivitiesPropType {
    firstName: string;
    lastName : string
    status: string;
    statusTime: string; 
  }
export interface EmployeeChatPropType{
    recipientId : number
}