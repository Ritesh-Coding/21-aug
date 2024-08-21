import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
// import useAxios from '../../../hooks/useAxios';
import appClient from '../../../network/AppClient';
import EmployeeActivities from './EmployeeActivities';
import { AllEmployeeActivityPropsType ,EmployeeActivityType} from '../../../types/user/UserInterface';

const AllEmployeeActivities : React.FC<AllEmployeeActivityPropsType> = ({refresh,inputValue}) => {
    const [employeeData,setData]= useState<EmployeeActivityType[]>([])   
    const [status,setStatus] = useState<string>("")
    // const axiosInstance = useAxios();
    let search = inputValue.trim();
    useEffect(()=>{       
      appClient.get(`todayEmployeeActivity/`,{
          params : {
            search,
            status,
          }
        }       
        ).then((res) => { 
            
        setData(res.data)        
        })       
        
    },[refresh,search])       

const employeeActivities =  (
  employeeData.map((item,index) => (
    <div key={index}>
 <EmployeeActivities
      key={item.index}
      firstName={item.first_name}
      lastName ={item.last_name}
      status={item.status}
      statusTime={item.status_time}         
    />
    </div>
   
  ) ) 
  ) 
  console.log('data',employeeData)
  return (
    <>
      {employeeActivities}   
    </> 
  )
}

export default AllEmployeeActivities