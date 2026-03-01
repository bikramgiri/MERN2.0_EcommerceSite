import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL 

// For unlogin user
export const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// For Login user
export const APIAuthenticated = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Authorization: `${localStorage.getItem("token")}`,
  },
});

// Request Interceptor: Set Authorization from localStorage dynamically
APIAuthenticated.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // // Fallback: check cookie if no localStorage token
    // if (!token) {
    //   const tokenCookie = document.cookie
    //     .split('; ')
    //     .find(row => row.startsWith('token='));
    //   if (tokenCookie) {
    //     token = tokenCookie.split('=')[1];
    //     localStorage.setItem("token", token); // sync to localStorage
    //   }
    // }

    // Set Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

