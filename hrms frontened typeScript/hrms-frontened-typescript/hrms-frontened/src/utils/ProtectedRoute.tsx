// ProtectedRoute.js
import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../types/types';

interface ProtectedRouteProps{
    children : ReactNode,
    allowedRoles : string[] 
}
const ProtectedRoute : React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { role, isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated || !allowedRoles.includes(role!)) {
        return <Navigate to="/login" />;
    }
    return children;
};
export default ProtectedRoute;