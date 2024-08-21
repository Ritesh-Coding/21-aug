import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import appClient from '../../../network/AppClient'
import { Modal } from 'react-bootstrap'
import Swal from 'sweetalert2';
import 'react-time-picker/dist/TimePicker.css';
import { EmployeeActivityType } from '../../../types/user/UserInterface'

const formateDate=(myDate : Date): string=>{   
  const dd = String(myDate.getDate()).padStart(2, '0');
  const mm = String(myDate.getMonth() + 1).padStart(2, '0');
  const yyyy = myDate.getFullYear();
  const formattedDate = yyyy+'-'+mm+'-'+dd
  return formattedDate
}
const formatTime = (dateString : string) => {
  const options : Intl.DateTimeFormatOptions  = { hour: '2-digit', minute: '2-digit'}
  return new Date(dateString).toLocaleString(undefined,options)
}
const UpdateAttendance : React.FC =  () => {
  const {userId} = useParams()
  const [attendance,setAttendance]  = useState<EmployeeActivityType[]>([])
  const todaysDate = new Date() 
  const formattedDate = formateDate(todaysDate)
  const [date,setDate] =useState<string>(formattedDate) 
  const [time, setTime] = useState('00:00');
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [selectedAttendance,setSelectedAtendance] = useState<EmployeeActivityType| null>(null)


  const updateTime = (attendance : EmployeeActivityType)=>{
   setSelectedAtendance(attendance)
   setShowUpdateModal(true)
  }
  console.log("This is the id ",userId)
  const fetchAttendanceData =async (date:string)=>{
    const result = await appClient.get(`todayEmployeeActivity/?id=${userId}`,{
      params:{
        date
      }
    })
    setAttendance(result.data)
  }
  const UpdateAttendanceTime=async(time: string)=>{
    
   
    if (selectedAttendance){
      const existingDateTime = new Date(selectedAttendance?.status_time);     
      
      const [hours, minutes] = time.split(':').map(Number);
      
      existingDateTime.setHours(hours, minutes, 0, 0);
      const utcTime = existingDateTime.toISOString();

      try{        
          const values = {
            status_time : utcTime,status : selectedAttendance.status,previous:selectedAttendance?.status_time}
          await appClient.patch(`todayEmployeeActivity/${selectedAttendance.id}/`,values)
          setAttendance((prev) =>
          prev.map((att) => (att.id === selectedAttendance.id ? { ...att, ...values } : att))
        );
          setShowUpdateModal(false)

          Swal.fire('Success!', 'Attendance Time is Updated Successfully!', 'success');
         
      }
      catch(err){
        console.log("Error in updating the time",err)
      }     
    }
    }
  useEffect(()=>{
    fetchAttendanceData(date)
  },[date])


  return (
    <div style={{marginLeft:`260px`}}>
       <Button>
            <input type="date" value={date} onChange={(e)=>setDate(e.currentTarget.value)} />
          </Button>
        {attendance.length>0 ? <table className="table">
        <thead>
          <tr>
           <th scope="col">Id</th>
            <th scope="col">FirstName</th>
            <th scope="col">LastName</th>
            <th scope="col">Status</th>
            <th scope="col">Status Time</th>             
            <th scope="col">update</th>      
          </tr>
        </thead>
        <tbody>
        
        {attendance.map((att,index)=>((
        <tr key = {index}>    
           <th scope="row">{index+1}</th>  
          <th scope="row">{att.first_name}</th>   
          <th scope="row">{att.last_name}</th>     
          <td>{att.status}</td>    
          <td>{formatTime(att.status_time)}</td>         
          <td><Button onClick={()=>{updateTime(att)}}>Update</Button></td>
      </tr>
  )))}        
        </tbody>
      </table> : <h3 style={{textAlign:`center`}}>Oops! Attendance Record Not Found for {date}</h3>}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Update</Modal.Title>
    </Modal.Header>
    <Modal.Body className="modal-body">   
    
   <input onChange={(e)=>{
    setTime(e.currentTarget.value)
   }} value={time} step={1}  className="form-control"  aria-label="Time" type="time" />             
        <div>
        <button onClick={()=>{UpdateAttendanceTime(time)}}>Submit</button>
    </div>   
       
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
    </div>
  )
}

export default UpdateAttendance