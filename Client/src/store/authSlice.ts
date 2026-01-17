import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { STATUSES } from "../globals/statuses";
import { API } from "../http";
import type { AppDispatch } from "./store";

interface RegisterData{
      username: string,
      email: string,
      password: string
}

interface LoginData{
      email: string,
      password: string
}

interface User{
      username: string,
      email: string,
      password: string,
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
  status: STATUSES.LOADING,
      // token: "",
  token: localStorage.getItem("token") || "", // Load on init
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
      setToken: (state, action) => {
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
      state.status = STATUSES.IDLE;
    },
    resetAuth: (state) => {
      state.user = {} as User;
      state.token = "";
      state.status = STATUSES.IDLE;
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, setStatus, setToken, logOut, resetAuth } = authSlice.actions;
export default authSlice.reducer;

export function registerUser(data: RegisterData) {
  return async function registerUserThunk(dispatch: AppDispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.post("/register", data);
      console.log("Register Response:", response.data); // Debug response
      if(response.status === 201){
            dispatch(setStatus(STATUSES.SUCCESS));
      }
    } catch (error) {
      console.log("Failed to register user:", error);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function loginUser(data: LoginData) {
  return async function loginUserThunk(dispatch: AppDispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.post("/login", data);
      console.log("Login Response:", response.data); // Debug response
      if (response.status === 200) {
         dispatch(setUser(response.data.data));
         dispatch(setToken(response.data.token));
         dispatch(setStatus(STATUSES.SUCCESS));
      }
      // Save token to cookies
      // document.cookie = `token=${response.data.token}; path=/`;
      // Save token to localStorage
      // localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.log("Failed to login user:", error);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

