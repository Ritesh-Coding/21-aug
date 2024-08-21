import React, { useState, useEffect } from "react";
import "./Admin.css";
import EmployeeChat from "../../user/UI/EmployeeChat";
// import useAxios from "../../../hooks/useAxios";
import appClient from "../../../network/AppClient";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Pagination } from "../../../hooks/usePaginationRange";
import { EmployeeType } from "../../../types/admin/AdminInterface";
const rowsPerPage = 5;
const AdminChat = () => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [name,setName] = useState("")
  // const axiosInstance = useAxios();
  const handlePageChange = (page : number) => {
    setCurrentPage(page);
  };
  const handleNameChange=(event : React.ChangeEvent<HTMLInputElement> )=>{
    setName(event.target.value)
}
  const fetchEmployeeDetails = (page : number,name : string) => {
    appClient
      .get("/api/employees", {
        params: {
          page,
          name
        },
      })
      .then((res) => {
        setEmployees(res.data.results);
        if (res.data.count === 0) {
          setTotalPages(1);
        } else {
          setTotalPages(Math.ceil(res.data.count / rowsPerPage));
        }
      });
  };
  useEffect(() => {
    fetchEmployeeDetails(currentPage,name);
  }, [currentPage,name]);


  const handleEmployeeSelect = (employee : EmployeeType) => {
    setSelectedEmployee(employee);
  };

  return (
    <div style={{ marginLeft: `260px` }}>
   
    <br></br>
      <div style={{ display: `flex` }}>
        <div className="employee-list">
        <Button style={{float:`left`}}>
    <input type="text" onChange={handleNameChange} placeholder='Filter With Name'></input>
    </Button>
    <br></br>
    <br></br>
          {employees.map((employee) => (
            <Card className="comments">
              <Card.Body>
                <Button
                  key={employee.id}
                  onClick={() => handleEmployeeSelect(employee)}
                >
                  <pre>
                    {employee.first_name} {employee.last_name}
                  </pre>
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>     
    
      <div className="adminChat">
        {selectedEmployee && (
          <>
            <h5>Chat with : {selectedEmployee.first_name}</h5>
            <EmployeeChat recipientId={selectedEmployee.id} />
          </>
        )}
      </div>      
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AdminChat;