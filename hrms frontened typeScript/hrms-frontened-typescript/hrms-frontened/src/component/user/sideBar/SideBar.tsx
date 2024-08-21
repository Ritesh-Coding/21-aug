import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { SidebarData } from "./SideBarData";
import logo from "../../../assets/hrms.png";
import { IconContext } from "react-icons/lib";
import SubMenu from "./SubMenu";
import { useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
// import useAxios from "../../../hooks/useAxios";
import notification from "../../../assets/notificationIcon.png";
import { NotificationType } from "../../../types/sideBar/sideBar";
import { RootState } from "../../../types/types";
import "./SideBar.css";
import Swal from 'sweetalert2';
import appClient from "../../../network/AppClient";
interface ForgetCheckOutType{
  "id": number,
  "date":string,
  "checkIn":string,
  "checkOut":null
}
const Nav = styled.div`
  background: #ffffff;
  height: 80px;
  display: flex;
  justify-content: end;
  align-items: center;  
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;



const SidebarNav = styled.nav`
  background: #112f4b;
  width: 250px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  transition: 350ms;
  z-index: 10;
  border-top-right-radius: 25px;
`;
const SidebarWrap = styled.div`
  width: 100%;
`;

const formatDate = (dateString : string): string => {
  if (dateString === "-") return "-";
  const options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleString(undefined, options);
};
const Sidebar : React.FC = () => {
  // const axiosInstance = useAxios();
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showForgetCheckOutModal, setShowForgetCheckOutModal] = useState<boolean>(true);
  const [notificationData, setNotification] = useState<NotificationType[]>([]);
  const [forgetCheckOut, setForgetCheckOutData] = useState<ForgetCheckOutType | null>(null);
  const { userId,firstName,navTitle,profile} = useSelector((state : RootState) => state.auth);
  const [time, setTime] = useState('09:30');

  
  const handleNotification = () => {
    appClient.patch(`notification/`);
    setShowUpdateModal(true);
  };
  useEffect(() => {
    appClient.get(`notification/`).then((res) => {
      setNotification(res.data);   })  
    appClient.get(`forgetCheckOut/`).then((res)=>{
      setForgetCheckOutData(res.data[0])
    })
    

  }, []);
  const UpdateAttendanceTime=async(time: string)=>{
    if (forgetCheckOut){
      const existingDateTime = new Date(forgetCheckOut?.checkIn);     
      
      const [hours, minutes] = time.split(':').map(Number);
      
      existingDateTime.setHours(hours, minutes, 0, 0);
      const utcTime = existingDateTime.toISOString();
      console.log("This is the utc time",utcTime)
      try{        
        const values = {
          checkOut : utcTime,status : "Check Out"}
        await appClient.patch(`forgetCheckOut/${forgetCheckOut.id}/`,values)    
      
        setShowForgetCheckOutModal(false)
        Swal.fire('Success!', 'Attendance Time is Updated Successfully!', 'success');
       
    }
    catch(err){
      console.log("Error in updating the time",err)
    }
    }
  }

  
  console.log("This is my forgetCheckOutTime",forgetCheckOut)
  return (
    <>
      
      <IconContext.Provider value={{ color: "#FFFFFF" }}>
        <header>
          <Nav>
            <div>
              <h1 style={{position:"relative",right:"500px"}}>{navTitle}</h1>
            </div>
            <div className="navbar">
              <img
                src={notification}
                onClick={handleNotification}
                width="35px"
                alt="Notification Icon" 
              ></img>
              <p>
                {notificationData.length > 0 &&
                  notificationData[0]["total_notification"]}
              </p>
              <Link to="#home">News</Link>
              <Link to="/calender">Calender</Link>
              <div className="dropdown">
                <button className="dropbtn">
                  <img className="navBarProfile" src={`http://127.0.0.1:8000/media/${profile}`} width={40} alt="profile"/>
          
                  {firstName}
                  <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                  <Link to="/profile">Profile</Link>
                  <Link to="/change-password">Change Password</Link>
                  <Link to="/logout">Logout</Link>
                </div>
              </div>
            </div>
          </Nav>
          <Modal
            show={showUpdateModal}
            onHide={() => setShowUpdateModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Notifications</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
              {notificationData.length > 0 ? (
                notificationData.map((notification) => (
                  <div key={notification.id}>
                    <pre>
                      {notification.employee_id.first_name}{" "}
                      {notification.message} {formatDate(notification.status)}
                    </pre>
                  </div>
                ))) : 
                <h2>Notification Not Found</h2>
              }
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowUpdateModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>



    {forgetCheckOut && <Modal show={showForgetCheckOutModal} onHide={() => setShowForgetCheckOutModal(false)}>
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
      <Button variant="secondary" onClick={() => setShowForgetCheckOutModal(false)}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>}
        </header>
        <SidebarNav>
          <SidebarWrap>
          <div style={{padding:`10px`}}>
              <img src={logo} alt="Logo" width={60} />
              <a style={{color: "#FFFFFF",fontSize:`30px`,textAlign:`center`}}>eSparkBiz</a>
            </div>           
            {SidebarData.map((item, index) => (
              <SubMenu item={item} key={index} />
            ))}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;
