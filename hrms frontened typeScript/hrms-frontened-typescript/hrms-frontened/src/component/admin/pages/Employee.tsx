import React, { useState, useEffect, useCallback } from 'react';
// import useAxios from '../../../hooks/useAxios';
import appClient from '../../../network/AppClient';
import { Button, Modal } from 'react-bootstrap';
import { Pagination } from '../../../hooks/usePaginationRange';
import { Link } from 'react-router-dom';
import { navbarTitle } from '../../../reducers/authReducer';
import { useDispatch } from 'react-redux';
import { EmployeeAttendanceType } from '../../../types/admin/AdminInterface';


const UpdateEmployee: React.FC = () => {
  const [employee, setEmployee] = useState<EmployeeAttendanceType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeAttendanceType | undefined>(undefined);
  const [refresh, setRefresh] = useState<number>(0);
  // const axiosInstance = useAxios();

  const dispatch = useDispatch();
  dispatch(navbarTitle({ navTitle: "Employee" }));

  const [name, setName] = useState<string>("");
  const rowsPerPage : number = 5;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  let timer : ReturnType<typeof setTimeout>;

  const fetchAllEmployees = (page: number, name: string) => {
    appClient.get(`api/employees/`, {
      params: {
        page,
        name
      }
    }).then((res) => {
      setEmployee(res.data["results"]);

      if (res.data.count === 0) {
        setTotalPages(1);
      } else {
        setTotalPages(Math.ceil(res.data.count / rowsPerPage));
      }
    });
  }
  
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(()=>{
      setName(event.target.value);
    },2000)
    // setName(event.target.value); 
    
  }
  useEffect(() => {
    fetchAllEmployees(currentPage, name);
  }, [refresh, currentPage,name]);

  const handleDelete = (employee: EmployeeAttendanceType) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      if (selectedEmployee) {
        await appClient.delete(`api/employees/${selectedEmployee.id}/`);
        setShowDeleteModal(false);
        setRefresh(refresh + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginLeft: '260px' }}>
      <Button style={{ float: `right` }}>
        <input type="text" onChange={handleNameChange} placeholder='Search Employee Name'></input>
      </Button>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Employee Id</th>
            <th scope="col">UserName</th>
            <th scope="col">First Name</th>
            <th scope="col">Email</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {employee.length > 0 && employee.map((employee) => (
            <tr key={employee.id}>
              <th scope="row">{employee.id}</th>
              <td>{employee.username}</td>
              <td>{employee.first_name}</td>
              <td>{employee.email}</td>
              <td>
                <Link to={`/dashboard/employee/edit/${employee.id}`}>
                  <Button>Update Employee Details</Button>
                </Link>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(employee)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this leave?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UpdateEmployee;

