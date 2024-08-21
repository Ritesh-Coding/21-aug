import React, { lazy, Suspense } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import RootLayout from '../layouts/RootLayout';
import AdminRootLayout from '../layouts/AdminRootLayout';
import NotFound from '../utils/PageNotFound';
import CircularProgress from "@mui/material/CircularProgress";
import Maps from '../component/user/pages/Maps';

//Auth Route
const LoginUser = lazy(() => import('../component/auth/Login'));
const Logout = lazy(() => import('../component/auth/Logout'));
const Register = lazy(() => import('../component/auth/Register'));
const ForgetPassword = lazy(() => import('../component/auth/ForgetPassword'));
const ChangePassword = lazy(() => import('../component/auth/ChangePassword'));

//UserSpecific Route
const BirthDay = lazy(()=>import('../component/user/UI/BirthDays'))
const Dashboard = lazy(() => import('../component/user/pages/Dashboard'));
const Hotline = lazy(()=> import('../component/user/pages/Hotline'))
const Attendance = lazy(() => import('../component/user/pages/Attendance'));
const Leaves = lazy(() => import('../component/user/pages/Leaves'));
const Claims = lazy(() => import('../component/user/pages/Claims'));
const CompanyPolicy = lazy(() => import('../component/user/pages/CompanyPolicy'));
const Committee = lazy(() => import('../component/user/pages/Committee'));
const Sensation = lazy(() => import('../component/user/pages/Sensation'));
const Profile = lazy(() => import('../component/user/pages/Profile'));
const EditProfile = lazy(() => import('../component/user/pages/EditProfile'));
const UpdateLeave = lazy(() => import('../component/user/pages/UpdateLeave'));
const Calender = lazy(() => import('../component/user/pages/Calender'));


// Admin-specific pages
const Employee = lazy(() => import('../component/admin/pages/Employee'));
const UpdateEmployee = lazy(() => import('../component/admin/pages/UpdateEmployee'));
const AllLeaves = lazy(() => import('../component/admin/pages/AllLeaves'));
const LeaveRequest = lazy(() => import('../component/admin/pages/LeaveRequest'));
const AssignLeave = lazy(() => import('../component/admin/pages/AssignLeave'));
const Holidays = lazy(() => import('../component/admin/pages/Holidays'));
const AdminProfile = lazy(() => import('../component/admin/pages/AdminProfile'));
const AllAttendance = lazy(() => import('../component/admin/pages/AllAttendance'));
const EmployeeAttendance = lazy(() => import('../component/admin/pages/EmployeeAttendance'));
const UpdateAttendance = lazy(() => import('../component/admin/pages/UpdateAttendance'));
const AdminChat = lazy(() => import('../component/admin/pages/AdminChat'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* User Routes */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leaves" element={<Leaves />} />
        <Route path="claims" element={<Claims />} />
        <Route path="companyPolicy" element={<CompanyPolicy />} />
        <Route path="committee" element={<Committee />} />
        <Route path="sensation" element={<Sensation />} />
        <Route path="hotline" element={<Hotline />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="update-leave" element={<UpdateLeave />} />
        <Route path="calender" element={<Calender />} />
        <Route path="maps" element={<Maps />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginUser />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      <Route path="/logout" element={<Logout />} />

      
      {/*Admin Routes*/}
      <Route path="/dashboard" element={<AdminRootLayout />}>
          <Route index element={<Employee />} />
          <Route path="sensation" element={<Sensation />} />
          <Route path="committee" element={<Committee />} />
          <Route path="companyPolicy" element={<CompanyPolicy />} />
          <Route path="holidays" element={<Holidays />} />
          <Route path="leaves" element={<LeaveRequest />} />
          <Route path="attendance" element={<AllAttendance />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="calendar" element={<Calender />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="attendance/:userId" element={<EmployeeAttendance />} />
          <Route path="employee/edit/:userId" element={<UpdateEmployee />} />
          <Route path="assign-leave" element={<AssignLeave />} />
          <Route path="all-leave" element={<AllLeaves />} />
          <Route path="comments" element={<AdminChat />} />
          <Route path="updateAttendance/:userId" element={<UpdateAttendance />} />            
          <Route path="*" element={<NotFound />} />
        </Route>
    
    </>
  )
);

const Routing = () => (
  <Provider store={store}>
    <Suspense fallback={<div className='spinner-container'><CircularProgress /></div>}>
      <RouterProvider router={router} />
    </Suspense>
  </Provider>
);

export default Routing;