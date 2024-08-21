import React from 'react'
import AdminSidebar from '../component/admin/adminSideBar/AdminSideBar'
import { Outlet } from 'react-router-dom'
import ProtectedRoute from '../utils/ProtectedRoute'
import Register from '../component/auth/Register'

const AdminRootLayout = () => {
  return (
    <>
     <ProtectedRoute allowedRoles={['admin']}>
      
      <AdminSidebar />
      <main style={{backgroundColor: "#E2E7F0"}}>
        <Outlet />
      </main>
     </ProtectedRoute>
    
    
    </>
    
  )
}

export default AdminRootLayout