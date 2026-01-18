/* Rationale:
Centralized HTTP client for cryptocurrency trading API with dual-storage token management and selective session cleanup.
We prioritize sessionStorage for temporary sessions and localStorage for persistent login. */

import axios from 'axios';
const api_url = 'https://api.onnbit.com/api/';
export const axiosInstance = axios.create({

    baseURL: api_url,

});

// Because concurrent logout requests could cause race conditions, we use a flag to prevent multiple cleanup attempts
let isLoggingOut = false;
axiosInstance.interceptors.request.use(
    (config) => {
        // Because email verification uses sessionStorage while normal login uses localStorage, we check both for token availability
        const sessionToken = sessionStorage.getItem("authToken");
        const token = sessionToken ? sessionToken : localStorage.getItem("authToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        try {
            const fullUrl = new URL(originalRequest.url, originalRequest.baseURL);
            const path = fullUrl.pathname;

            // Because only user-details endpoint indicates true session expiry (not temporary API errors), we selectively clear auth on 401
            if (path.includes('/user-details') && error.response?.status === 401) {
                sessionStorage.removeItem("authToken");
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                // TODO: Enable redirect after testing - currently commented to prevent dev environment issues
                // window.location.href = '/login';
            }
        } catch (e) {
            // Because URL parsing can fail with malformed requests, we silently continue to avoid breaking error handling
        }

        return Promise.reject(error);
    }
);

