import React from "react";

import { useEffect , useState ,useCallback} from "react";
// import useAxios from "../../../hooks/useAxios";
import appClient from "../../../network/AppClient";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "react-bootstrap";
import { Pagination } from "../../../hooks/usePaginationRange";
import { debounce } from "lodash";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { AdminLeaveDataType } from "../../../types/admin/AdminInterface";
const AllLeaves : React.FC= () => {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [leaveData,setLeaveData] = useState<AdminLeaveDataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [requestStatus,setRequestStatus] = useState<string>("")
  const [startDate,setStartDate] = useState<string>("")
  const [endDate,setEndDate]= useState<string>("")
  const [name,setName] = useState<string>("")
  const rowsPerPage =5;
   function dateFormat() {
    const startDateElement = document.getElementById("startDate") as HTMLInputElement | null;
    const endDateElement = document.getElementById("endDate") as HTMLInputElement | null;
    if (startDateElement && endDateElement) {
      const startDate = startDateElement.value;
      const endDate = endDateElement.value;

      if (startDate && endDate) {
        setStartDate(startDate);
        setEndDate(endDate);
        setCurrentPage(1);
      }
    }    
  } 
  
  const handleNameChange=(event : any)=>{
    const newName = event.target.value
 
    debouncedFetchLeave(newName)
}
  const handlePageChange = (page : number)=>{
    setCurrentPage(page)
   }
   const debouncedFetchLeave = useCallback(debounce((name: string)=>    
    fetchLeaveData(1,requestStatus,startDate,endDate,name),900),[])
  
   const handleInputChange=(event : React.ChangeEvent<HTMLSelectElement>)=>{
  
    setRequestStatus(event.target.value)
    setCurrentPage(1)
    
  } 
  // const axiosInstance  =  useAxios();
  function fetchLeaveData(page : number,status : string ,start_date : string ,end_date : string,name : string){
    appClient.get(`all-leaves/`,{     
      params :{
           page,
           status,
           start_date,
           end_date,     
           name     
      }   
    }).then((res)=>{
    
      setLeaveData(res.data["results"]);
      if (res.data.count === 0){
        setTotalPages(1);
      }
      else{
      setTotalPages(Math.ceil(res.data.count / rowsPerPage));
      }
    })  
    setIsFetching(false)
 }
 useEffect(()=>{
  fetchLeaveData(currentPage,requestStatus,startDate,endDate,name)
},[currentPage,requestStatus,startDate,endDate])

if (isFetching) {
  return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
      </Box>
  );
}
else{
  return (
    <>
    <div style={{ marginLeft: "260px" }}>  
    <Button style={{float:`left`}}>
    <input type="text" onChange={handleNameChange} placeholder='Filter With Name'></input>
    </Button>
    <div style={{float:`right`}}>
        <Button>
        <input type="date" id="startDate" onChange={dateFormat}></input>
        </Button>
        <Button>
            <input type="date" id="endDate" onChange={dateFormat}></input>
        </Button>
        
    </div>
    
    
      <select className="form-select form-select mb-3" aria-label=".form-select-lg example"
                 id="statusDropDown"  onChange={handleInputChange}>
                      <option selected value="">Select Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
      </select>      
     
      <table className="table">
        <thead>
          <tr>
          <th scope="col">FirstName</th>
            <th scope="col">LastName</th>
            <th scope="col">Leave Type</th>
            <th scope="col">Date</th>
            <th scope="col">Leave Day Type</th>
            <th scope="col">Status</th>            
          </tr>
        </thead>
        <tbody>
          
        {leaveData.map((leave,index)=>((
        <tr key = {index}>
          <th scope="row">{leave.first_name}</th>   
          <th scope="row">{leave.last_name}</th>    
          <th scope="row">{leave.type}</th>
          
          <td>{leave.date}</td>
          <td>{leave.leave_day_type}</td>
          <td>{leave.status}</td>    
      </tr>)))}          
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
    </>
  );}
};

export default AllLeaves;
