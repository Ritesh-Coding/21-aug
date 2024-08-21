import React from 'react'

import { useState,useEffect } from 'react'
import { HolidayType } from '../../../types/user/UserInterface';
import appClient from '../../../network/AppClient';
import CustomSpecialDaysPagination from '../../../hooks/useCustomSpecialDaysPagination';


const Holidays : React.FC= () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const rowsPerPage : number = 1;
    const [totalPages, setTotalPages] = useState<number>(1);
    // const axiosInstance = useAxios()
    
    const [holidays,setHolidays]=   useState<HolidayType[]>([])
    const handlePageChange = (page: number)=>{
        setCurrentPage(page)
    }
    const showHolidays=async (page: number)=>{
      const result =await  appClient.get('api/holidays/',{
            params:{
            page
            }
        })
        
        if (result.data.count === 0){
            setTotalPages(1);
          }
          else{        
      
          setTotalPages(Math.ceil(result.data.count / rowsPerPage));
          }       
        setHolidays(result.data["results"])       
    }
    useEffect( ()=>{        
        showHolidays(currentPage)      
    },[currentPage])
   
  return (
    <div style={{marginLeft:`60px`}}>
      
        <div className="card cardBorder" style={{width:`260px`}}>
        <div style={{display:`flex`}}>
        <span style={{fontSize:`20px`}}><b>Holidays</b></span>
        <div style={{float:`right`,width:`60px` ,marginLeft:`25px`}} >
        <CustomSpecialDaysPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} /> 
        </div> 
        </div>               
        {
            holidays.length >0 ? (holidays.map((holiday)=>(
                <div key={holiday.id}>
                <img className="card-img-top" src={holiday.holiday_image} alt="holiday Image" width="260px" height="150px" /> 
              
                <div className="card-body">
                    <p className="card-text">{holiday.date}</p>
                    <p className="card-text">{holiday.name}</p>
                </div>
                </div>
            ))) : (
                <h5>No Holiday Available</h5>            )
        }       
        </div>
    </div>
  )
}

export default Holidays