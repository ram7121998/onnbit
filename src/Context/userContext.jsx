import React, { createContext, useContext, useEffect, useState } from 'react'
import { changePassword, changeProfilePic, changeUserName, userDetails, userDetailsByUserId } from '../api/userService'
import { useLocation } from 'react-router-dom';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    // Because user data is needed across app sessions for trading continuity, we initialize from localStorage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [error, setError] = useState(null);
    const [getUserById, setUserById] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        // Because user dashboard needs fresh data for trading metrics, we only fetch on dashboard route
        const shouldFetch = location.pathname === "/user-Dashboard";

        if (token && shouldFetch) {
            handleUserDetail();
        }
    }, [location.pathname]); // Because we only want to refetch on route changes, not on every render

    const handleUserDetail = async () => {
        try {
            const response = await userDetails();
            setUser(response.response);
            // Because user data contains trading preferences and verification status, we persist to localStorage for session continuity
            localStorage.setItem("user", JSON.stringify(response.response));
            return response;
        } catch (error) {
            console.error("userDetails error:", error);
            setError(error);
        }
    };
    const handleUserDetailByUserId = async (user_id) => {
        try {

            const response = await userDetailsByUserId(user_id);
            setUserById(response?.response);
            return response;

        }
        catch (error) {

            setError(error);
        }
    }
    const handleChangeProfilePic = async (file, onProgress) => {
        try {
            const response = await changeProfilePic(file, onProgress);
            // Persist updated image URL so it survives page refresh and next login
            if (response?.profile_image_url) {
                const updatedUrl = `${response.profile_image_url}?timestamp=${Date.now()}`; // cache-bust
                setUser((prev) => {
                    const updatedUser = { ...(prev || {}), profile_image_url: updatedUrl };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    return updatedUser;
                });
            }
            return response;
        }
        catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    }
    const handleChangePassword = async (values) => {
        try {
            const res = changePassword(values);
            return res;
        }
        catch (error) {
            throw error;
        }
    }
    const handleUserNameChange = async (username) => {
        try {
            const res = changeUserName(username);
            return res;
        }
        catch (error) {
            setError(error.response ? error.response.data : error);
            throw error;
        }
    }
    return (
        <UserContext.Provider value={{ user, error, setUser, handleChangeProfilePic, handleChangePassword, handleUserNameChange, getUserById, handleUserDetailByUserId, handleUserDetail }}>
            {children}
        </UserContext.Provider>
    )
}
export const useUser = () => {
    return useContext(UserContext)
}


export default UserProvider