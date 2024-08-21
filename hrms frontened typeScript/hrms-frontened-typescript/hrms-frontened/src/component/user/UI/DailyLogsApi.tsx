import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
// import useAxios from '../../../hooks/useAxios';
import appClient from '../../../network/AppClient';
import DailyLogs from './DailyLogs';
import { DailyLogsPropsType,DailyLogProps } from '../../../types/user/UserInterface';


const DailyLogsApi : React.FC<DailyLogProps>= ({status}) => {
    const [log,setLog]= useState<DailyLogsPropsType[]>([])
   
    // const axiosInstance = useAxios(); 

    useEffect(()=>{       
      appClient.get("/employeeDailyLogs/").then((res) => {        
        setLog(res.data)
        })
    },[status])       

    const dailyLogs = (
        log.map((item,index)=>(
      <div key={index}>
        <DailyLogs
        key = {item.index}
        checkIn = {item.checkIn}
        checkOut = {item.checkOut}
        breaks={item.breaks}
        />
          </div>
        )));
    

  return (
    <>
      {dailyLogs}
    </> 
  )
}

export default DailyLogsApi