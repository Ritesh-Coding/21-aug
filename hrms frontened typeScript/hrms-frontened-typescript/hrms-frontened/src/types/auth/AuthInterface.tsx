export interface LoginFormValuesType {
    username: string;
    password: string;
    api?: string;
  }

export interface ChangePasswordValuesType{
    current_password : string
    new_password : string
    confirm_password : string
    api ?: string 
}
export interface ApiErrorResponseType {
    old_password?: string;
    new_password?: string;
}
export interface ForgetpasswordType{
    username : string,
    new_password : string
    confirm_password : string
    api ?: string 
}
export interface RegisterFormValuesType    {
    username : string,
    password : string,
    first_name : string,
    last_name : string,
    email : string,
    api ?: string,
    confirmPassword : string,
}

export interface LeaveDataTypes {
    id ?: string
    remaining_paid_leave : string
    remaining_casual_leave : string
    remaining_unpaid_leave : string
    remaining_sick_leave : string
    api? : string
  }
export interface DesignationType {
    designation: string;
    department : string
  }
export interface ProfileType {
    profile: string;
    bio: string;
    first_name ?: string,
    last_name ?: string
  }

export interface HotlineType {
    id: number;
    first_name: string;
    last_name: string;
    status: string;
    status_time: string;
    profileImage: ProfileType[];
    designation: DesignationType[];
  }
export interface OfflineEmployeeType{
    id: number;
    first_name: string;
    last_name: string;
    profile : string;
    bio : string;
    relation : DesignationType[]
  }
export interface LeaveEmployeeType{
    date : string,
    profileImage : ProfileType[],
    designation : DesignationType[]
  }
