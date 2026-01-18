import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    // Because trading operations require authentication, we check for valid auth token
    const token = localStorage.getItem("authToken")
    // Because unverified emails pose security risks in financial transactions, we enforce email verification first
    const emailVerified = sessionStorage.getItem('emailVerified') == null;
    if (!emailVerified) {
        return <Navigate to={'/email-verification'}/>
    }
    // Because unauthorized users cannot access trading features, we redirect to login if no valid token
    return token ? children : <Navigate to={'/login'} />;
}

export default ProtectedRoute