import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status  } from "../globals/statuses";
import { API, APIAuthenticated } from "../http";
import type { AppDispatch } from "./store";

interface registerData{
      username: string,
      email: string,
      password: string
}

interface loginData{
      email: string,
      password: string
}

interface User{
      id: string,
      username: string,
      email: string,
      password: string,
      avatar?: string,
      token: string,
      status: string
}

interface VerifyOTPData{
      email: string,
      otp: string
}

interface ChangePasswordData{
      email: string,
      otp: string,
      newPassword: string,
      confirmPassword: string
}

interface AuthState{
      user: User,
      status: string,
      token: string,
      email: string
}

const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

const initialState: AuthState = {
  user : storedUser ? JSON.parse(storedUser) : {} as User,
  status: Status.IDLE,
  token: "",
  // token: localStorage.getItem("token") || "", // Load on init
  email: ""
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
      setUser(state:AuthState, action:PayloadAction<User>){
        state.user = action.payload; 
      },
      setStatus(state:AuthState, action:PayloadAction<Status>){
        state.status = action.payload;
      },
      setToken: (state: AuthState, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (action.payload) {
        
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
    logOut: (state) => {
      state.user = {} as User;
      state.token = "";
      // remove token from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
      // remove token from cookies (if stored there)
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      state.status = Status.IDLE;
    },
    resetAuth: (state) => {
      state.user = {} as User;
      state.token = "";
      state.status = Status.IDLE;
      localStorage.removeItem("token");
      // remove token from cookies (if stored there)
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
    resetAuthStatus: (state: AuthState) => {
      state.status = Status.LOADING;
    },
    setEmail: (state: AuthState, action: PayloadAction<string>) => {
      state.email = action.payload;
  },
  },
});

export const { setUser, setStatus, setToken, logOut, resetAuth, resetAuthStatus, setEmail } = authSlice.actions;
export default authSlice.reducer;

export function registerUser(data: registerData) {
  return async function registerUserThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("/auth/register", data);
      if(response.status === 201){
          dispatch(setStatus(Status.SUCCESS));
          return response.data;
      }
    } catch (error) {
      console.log("Failed to register user:", error);
      dispatch(setStatus(Status.ERROR));
      throw error; 
    }
  };
}

export function loginUser(data: loginData) {
  return async function loginUserThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("/auth/login", data);      
      if (response.status === 200) {
         dispatch(setUser(response.data.data));
         localStorage.setItem("user", JSON.stringify(response.data.data));
         dispatch(setToken(response.data.token));
         dispatch(setStatus(Status.SUCCESS));
      }
      // Save token to cookies
      // document.cookie = `token=${response.data.token}; path=/`;
      // Save token to localStorage
      // localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.log("Failed to login user:", error);
      dispatch(setStatus(Status.ERROR));
      throw error; // Rethrow the error for further handling
    }
  };
}

// fetch profile
export function fetchUserProfile() {
  return async function fetchUserProfileThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/profile");
      console.log("Fetched user profile:", response.data);
      dispatch(setUser(response.data.data));
      dispatch(setStatus(Status.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch user profile:", error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

// // Google login (parse token from URL, save to localStorage)
// export function handleGoogleLogin() {
//   return async function handleGoogleLoginThunk(dispatch: AppDispatch) {
//     const urlParams = new URLSearchParams(window.location.search);
//     const token = urlParams.get('token');
//     const success = urlParams.get('loginSuccess');

//     if (token && success === 'true') {
//       dispatch(fetchUserProfile());
//       dispatch(setToken(token)); 
//       window.history.replaceState({}, document.title, window.location.pathname);
//       console.log("Google login token set successfully");
//     }
//   };
// }

// Google login 
export function handleGoogleLogin() {
  return async function (dispatch: AppDispatch) {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('loginSuccess');

    if (success === 'true') {
      try {
        // Read token & user directly from cookies 
        const tokenCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='));
        const userCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user='));

        let tokenValue = null;
        let userData = null;

        if (tokenCookie) {
          tokenValue = tokenCookie.split('=')[1];
        }

        if (userCookie) {
          const userStr = userCookie.split('=')[1];
          userData = JSON.parse(decodeURIComponent(userStr)); 
        }

        // Save to localStorage + Redux
        if (tokenValue) {
          localStorage.setItem('token', tokenValue);
          dispatch(setToken(tokenValue));
        }

        if (userData) {
          dispatch(setUser(userData));
          localStorage.setItem('user', JSON.stringify(userData));
        }

        // Optional: still verify with /profile (now should work)
        const response = await APIAuthenticated.get('/profile');
        console.log("Profile in google login handler:", response.data);
        if (response.status === 200) {
          const freshUser = response.data.data;
          dispatch(setUser(freshUser));
          localStorage.setItem('user', JSON.stringify(freshUser));
        }

        dispatch(setStatus(Status.SUCCESS));

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error('Google login processing failed:', err);
      }
    }
  };
}

export function forgotPassword(data: { email: string }) {
  return async function forgotPasswordThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("/auth/forgotPassword", data);
      dispatch(setEmail(response.data.data));
      // dispatch(setMessage(response.data.message)); // Set the backend message
      dispatch(setStatus(Status.SUCCESS));
      return response; // Return response for further handling
    } catch (error) {
      console.log("Failed to forgot password:", error);
      dispatch(setStatus(Status.ERROR));
      // dispatch(setError(error.response?.data?.message || "Failed to send OTP")); // Set error message
      throw error; // Rethrow error for further handling
    }
  };
}

export function verifyOTP(data: VerifyOTPData) {
  return async function verifyOTPThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("/auth/verifyOTP", data);
      dispatch(setEmail(data.email));
      dispatch(setStatus(Status.SUCCESS));
      return response; // Return response for further handling
    } catch (error) {
      console.log("Failed to verify OTP:", error);
      dispatch(setStatus(Status.ERROR));
      throw error; // Rethrow error for further handling
    }
  };
}

export function changePassword(data: ChangePasswordData) {
  return async function changePasswordThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("/auth/changePassword", data);
      dispatch(setStatus(Status.SUCCESS));
      return response;
    } catch (error) {
      console.log("Failed to change password:", error);
      dispatch(setStatus(Status.ERROR));
      throw error; 
    }
  };
}
