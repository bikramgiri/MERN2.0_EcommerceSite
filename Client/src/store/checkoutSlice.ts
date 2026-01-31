import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/statuses";
import type { CheckoutState, OrderData, OrderResponseItem } from "../globals/types/checkoutTypes";
import { APIAuthenticated } from "../http";
import type { AppDispatch } from "./store";

const initialState: CheckoutState = {
      items: [],
      status: Status.IDLE,
      khaltiUrl: null,
}

const checkoutSlice = createSlice({
      name: "checkout",
      initialState,
      reducers: {
            setItems(state: CheckoutState, action: PayloadAction<OrderResponseItem[]>) {
                  state.items = action.payload;
            },
            setStatus(state: CheckoutState, action: PayloadAction<Status>) {
                  state.status = action.payload;
            },
            setKhaltiUrl(state: CheckoutState, action: PayloadAction<CheckoutState['khaltiUrl']>) {
                  state.khaltiUrl = action.payload;
            }
      },

})

export const { setItems, setStatus, setKhaltiUrl } = checkoutSlice.actions; 
export default checkoutSlice.reducer;

export function createOrder(data: OrderData) {
  return async function createOrderThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.post("/user/order", data);
      if(response.status === 201){
            dispatch(setItems(response.data.data));
            if(response.data.url){
                  dispatch(setKhaltiUrl(response.data.url));
            }
            dispatch(setStatus(Status.SUCCESS));
            dispatch(fetchOrder());
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      throw error;
    }
  };
}

export function fetchOrder() {
  return async function fetchOrderThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/user/order");
      dispatch(setItems(response.data.data.reverse()));
      dispatch(setStatus(Status.SUCCESS));
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      throw error;
    }
  };
}
