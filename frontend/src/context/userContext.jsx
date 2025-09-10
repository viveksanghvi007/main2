import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user should be logged in on app load
    useEffect(() => {
        const checkAuthStatus = () => {
            const accessToken = localStorage.getItem("token");
            
            // If no token, user is not logged in
            if (!accessToken) {
                console.log('🔐 No token found, user not logged in');
                setLoading(false);
                return;
            }
            
            // Check if token is valid format (basic validation)
            if (accessToken === 'undefined' || accessToken === 'null' || accessToken.length < 10) {
                console.log('🔐 Invalid token format, clearing user data');
                clearUser();
                setLoading(false);
                return;
            }
            
            // Token looks valid, try to fetch user profile
            console.log('🔐 Valid token found, checking user session...');
            fetchUserProfile();
        };
        
        checkAuthStatus();
    }, []); // Only run once on app load

    // Separate function to fetch user profile
    const fetchUserProfile = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
            console.log('🔐 Profile fetch response:', response.data);
            
            if (response.data.success && response.data.user) {
                setUser(response.data.user);
                console.log('✅ User profile loaded successfully');
            } else {
                console.error('❌ Profile response missing user data:', response.data);
                clearUser();
            }
        } catch (error) {
            console.error("User not authenticated", error);
            if (error.response?.status === 401) {
                console.log('🔐 Token expired or invalid, clearing user data');
            }
            clearUser();
        } finally {
            setLoading(false);
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
        if (userData.token) {
            localStorage.setItem("token", userData.token); // save token
        }
        setLoading(false);
    };
    
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
    };
    
    const refreshUser = () => {
        if (localStorage.getItem("token")) {
            fetchUserProfile();
        }
    };
    
    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;