import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status  } from "../globals/statuses";
import { API } from "../http";
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

interface AuthState{
      user: User,
      status: string,
      token: string
}

const initialState: AuthState = {
  user : {} as User,
  status: Status.LOADING,
      token: "",
  // token: localStorage.getItem("token") || "", // Load on init
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
      setUser(state:AuthState, action:PayloadAction<User>){
        state.user = action.payload; 
      },
      setStatus(state:AuthState, action:PayloadAction<string>){
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
      state.status = Status.IDLE;
    },
    resetAuth: (state) => {
      state.user = {} as User;
      state.token = "";
      state.status = Status.IDLE;
      localStorage.removeItem("token");
    },
    resetAuthStatus: (state: AuthState) => {
      state.status = Status.LOADING;
    }
  },
});

export const { setUser, setStatus, setToken, logOut, resetAuth, resetAuthStatus } = authSlice.actions;
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
      throw error; // Rethrow the error for further handling
    }
  };
}

export function loginUser(data: loginData) {
  return async function loginUserThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("/auth/login", data);
      console.log("Login Response:", response.data); // Debug response
      if (response.status === 200) {
         dispatch(setUser(response.data.data));
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

