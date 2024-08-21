import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { navbarTitle } from "../../../reducers/authReducer";
import appClient from "../../../network/AppClient";
import styled from "styled-components";
import "../pages/page.css"
import { DesignationType,ProfileType,HotlineType,OfflineEmployeeType,LeaveEmployeeType } from "../../../types/auth/AuthInterface";
const Nav = styled.div`
  background: #ffffff;
  height: 80px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Hotline: React.FC = () => {
  const dispatch = useDispatch();
  dispatch(navbarTitle({ navTitle: "Hotline" }));
  const [employee, setEmployee] = useState<HotlineType[]>([]);
  const [status, setStatus] = useState<string>("Check In");
  const [offlineEmployee,setOfflineEmployee] = useState<OfflineEmployeeType[]>([])
  const [LeaveEmployee,setLeaveEmployee] = useState<LeaveEmployeeType[]>([])
  const [search, setSearch] = useState<string>("");
  const fetchEmployee = (search: string | undefined, status: string | undefined) => {
    const onlineBtn = document.getElementById("onlineBtn");
    const breakBtn = document.getElementById("breakBtn");
    const offlineBtn = document.getElementById("offlineBtn");
    const leaveBtn = document.getElementById("leaveBtn");
    appClient.get("hotline/",{
      params : {
        search,
        status,
      }
    }       
    ).then((res) => {  
      if(status=="offline"){
        if (onlineBtn) onlineBtn.style.opacity = "0.5";
        if (breakBtn) breakBtn.style.opacity = "0.5";
        if (offlineBtn) offlineBtn.style.opacity = "1";
        if (leaveBtn) leaveBtn.style.opacity = "0.5";
        setEmployee([]) 
        setLeaveEmployee([])
        setOfflineEmployee(res.data)
      }  
      else if(status=="leave"){
        if (onlineBtn) onlineBtn.style.opacity = "0.5";
        if (breakBtn) breakBtn.style.opacity = "0.5";
        if (offlineBtn) offlineBtn.style.opacity = "0.5";
        if (leaveBtn) leaveBtn.style.opacity = "1";
        setEmployee([]) 
        setOfflineEmployee([])
        setLeaveEmployee(res.data)
      }
      else{
        if(status=="Check In"){
          if (breakBtn) breakBtn.style.opacity = "0.5";
          if (offlineBtn) offlineBtn.style.opacity = "0.5";
          if (leaveBtn) leaveBtn.style.opacity = "0.5";
          if (onlineBtn) onlineBtn.style.opacity = "1";
        }
        else if(status=="Break In"){
          if (onlineBtn) onlineBtn.style.opacity = "0.5";
          if (breakBtn) breakBtn.style.opacity = "1";
          if (offlineBtn) offlineBtn.style.opacity = "0.5";
          if (leaveBtn) leaveBtn.style.opacity = "0.5";
        }
        setOfflineEmployee([])
        setLeaveEmployee([])
        setEmployee(res.data)    
      }
        
    })       
  };
  
 
  useEffect(() => { 
     
      fetchEmployee(search,status);
   
  }, [status,search]);
  

  return (
    <div style={{ marginLeft: `260px` }}>
       
       <Nav>
       <input
            className="searchInput"
            type="text"
            onChange={e=>setSearch(e.target.value)}
            placeholder="search Name"
            />
        <div className="navbar">
          <button
            className="btn btn-success"
            id="onlineBtn"
            onClick={() => setStatus("Check In")}
          >
            Online
          </button>
          <button
            className="btn btn-success"
            id="breakBtn"
            onClick={() => {setStatus("Break In")}}
          >
            On Break
          </button>
          <button
            className="btn btn-success"
            id="offlineBtn"
            onClick={() => setStatus("offline")}
          >
            Offline
          </button>
          <button
            className="btn btn-success"
            id="leaveBtn"
            onClick={() => setStatus("leave")}
          >
            On Leave </button>
        </div>
      </Nav>
      <div style={{display:`flex`,padding:`10px`}}>
      
      {employee.map((emp, index) => (
        <div key={index} style={{display:`flex`,marginLeft:`15px`}}>
          <div className="card" style={{ width: `16rem`,display:`flex` }}>
           
            <img 
              width={250}
              style={{justifyContent:`center`}}
              src={`http://127.0.0.1:8000/media/${emp["profileImage"][0]["profile"]}`}
              alt="Profile Pic"
            />
            <div className="card-body">            
            <p>{emp && emp["first_name"]} {emp["last_name"]}</p>
            <p>{emp["designation"][0] && emp["designation"][0]["department"]}</p>
            <p>{emp["designation"][0] && emp["designation"][0]["designation"]}</p>
            </div>
          </div>
        </div>
      ))}
      </div>

      <div style={{display:`flex`,padding:`10px`}}>
      
      {offlineEmployee.map((emp, index) => (
        <div key={index} style={{display:`flex`,marginLeft:`15px`}}>
          <div className="card" style={{ width: `16rem`,display:`flex` }}>
           
            <img
              width={250}              
              src={emp["profile"]}
              alt="Profile Pic"
            />
            <div className="card-body">            
            <p>{emp && emp["first_name"]} {emp["last_name"]}</p>
            <p>{emp["relation"][0] && emp["relation"][0]["department"]}</p>
            <p>{emp["relation"][0] && emp["relation"][0]["designation"]}</p>
            </div>
          </div>
        </div>
      ))}

{LeaveEmployee.map((emp, index) => (
        <div key={index} style={{display:`flex`,marginLeft:`15px`}}>
          <div className="card" style={{ width: `16rem`,display:`flex` }}>
           
            <img
              width={250}
              
              src={`http://127.0.0.1:8000/media/${emp["profileImage"][0]["profile"]}`}
              alt="Profile Pic" 
            />
            <div className="card-body">            
            <p>{emp && emp["profileImage"][0]["first_name"]} {emp["profileImage"][0]["last_name"]}</p>
            <p>{emp["designation"][0] && emp["designation"][0]["department"]}</p>
            <p>{emp["designation"][0] && emp["designation"][0]["designation"]}</p>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div> 
  );
};

export default Hotline;
