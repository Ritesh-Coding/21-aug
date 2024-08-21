import React from 'react'
import Sidebar from '../component/user/sideBar/SideBar'
import { Outlet } from 'react-router-dom'
import ProtectedRoute from '../utils/ProtectedRoute'
const RootLayout = () => {
  return (
    <div>
    <ProtectedRoute allowedRoles={['user']}>
      <Sidebar />
      <main style={{backgroundColor: "#E2E7F0"}}>
        <Outlet />
      </main>
    </ProtectedRoute>
    </div> 
  )
}

export default RootLayout