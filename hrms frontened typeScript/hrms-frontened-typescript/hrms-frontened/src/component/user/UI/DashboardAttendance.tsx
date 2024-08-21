import React from 'react'
// import useAxios from '../../../hooks/useAxios'
import appClient from '../../../network/AppClient'
import { useState,useEffect } from 'react'
import "../pages/page.css"
import { AttenDanceDataType } from '../../../types/user/UserInterface'
const formatTime = (timeString : string) => {
    if (!timeString || timeString === "-") return "-";
    return timeString.substring(0, 5);
  };
const DashboardAttendance : React.FC = () => {
    const [attendanceData,setAttendanceData] = useState<AttenDanceDataType[]>([])
    // const axiosInstance = useAxios()
  useEffect(()=>{
    appClient.get("dashboardAttendance").then((res)=>{
            setAttendanceData(res.data)
        })
  },[])

  return (
     <div>
    
        <div className="card cardBorder" style={{width:`280px`,marginLeft: `96px`}}>
        <span style={{fontSize:`20px`}}><b>Record Your Attendance</b></span>
            {attendanceData.length>0 ?
            <>
             <div style={{display:`flex`,justifyContent:`space-around`}}>
                <h5>Attendance</h5>
                <h5>Late</h5>
            </div>
            <div style={{display:`flex`,justifyContent:`space-around`}}>
                <h5>{attendanceData[0].total_present_days}</h5>
                <h5>{attendanceData[0].total_late_days}</h5>
            </div>
            <div style={{display:`flex`,justifyContent:`space-around`}}>
                <h5>Half Days</h5>
                <h5>Worked Hours</h5>
            </div>
            <div style={{display:`flex`,justifyContent:`space-around`}}>
                <h5>{attendanceData[0].total_half_days}</h5>
                <h5>{formatTime(attendanceData[0].net_working_hours)}</h5>
            </div>
            <div style={{display:`flex`,justifyContent:`space-around`}}>
                <h5>Total Office Hours</h5>
               
            </div>
            <div style={{display:`flex`,justifyContent:`space-around`}}>
                <h5>{attendanceData[0].total_office_hours}</h5>
                
            </div>
            </>             
            : <h5>Attendance Record Not Found</h5>
            }
        </div>
    </div>
  )
}

export default DashboardAttendance