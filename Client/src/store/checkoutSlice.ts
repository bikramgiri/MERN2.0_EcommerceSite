import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/statuses";
import type { CheckoutState, OrderData, FetchOrder, SingleOrder } from "../globals/types/checkoutTypes";
import { APIAuthenticated } from "../http";
import type { AppDispatch } from "./store";
import { emptyCart } from "./cartSlice";

const initialState: CheckoutState = {
      items: [],
      status: Status.IDLE,
      khaltiUrl: null,
      myOrder: [],
      singleOrder: []
}

const checkoutSlice = createSlice({
      name: "checkout",
      initialState,
      reducers: {
            setItems(state: CheckoutState, action: PayloadAction<OrderData[]>) {
                  state.items = action.payload;
            },
            setMyOrders(state: CheckoutState, action: PayloadAction<FetchOrder[]>) {
                  state.myOrder = action.payload;
            },
            setSingleOrder(state: CheckoutState, action: PayloadAction<SingleOrder[]>) {
                  state.singleOrder = action.payload;
            },
            setStatus(state: CheckoutState, action: PayloadAction<Status>) {
                  state.status = action.payload;
            },
            setKhaltiUrl(state: CheckoutState, action: PayloadAction<CheckoutState['khaltiUrl']>) {
                  state.khaltiUrl = action.payload;
            },
            deleteOrder(state: CheckoutState, action: PayloadAction<string>) {
                  state.myOrder = state.myOrder.filter(order => order.id !== action.payload);
            }
      },

})

export const { setItems, setMyOrders, setSingleOrder, setStatus, setKhaltiUrl, deleteOrder } = checkoutSlice.actions; 
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
            dispatch(fetchMyOrder());
            dispatch(emptyCart());
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      throw error;
    }
  };
}

export function fetchMyOrder() {
  return async function fetchOrderThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/user/order");
      if(response.status === 200){
            dispatch(setMyOrders(response.data.data.reverse())); // Reverse to show latest orders first
            dispatch(setStatus(Status.SUCCESS));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      throw error;
    }
  };
}

export function fetchMySingleOrder(id: string) {
  return async function fetchOrderThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get(`/user/order/${id}`);
      if(response.status === 200){
            dispatch(setSingleOrder(response.data.data))
            dispatch(setStatus(Status.SUCCESS));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      throw error;
    }
  };
}

// *Or
// *Fetch Single order without API call
// export function fetchMySingleOrder(id: string){
//   return async function fetchMySingleOrderThunk(dispatch: AppDispatch, getState: () => {checkout: CheckoutState}) { 
//       const state = getState();
//       const orders = state.checkout.myOrder;
//       const existOrder = orders.find(
//         (order: FetchOrder) => order.id === id,
//       );
//       if (existOrder) {
//         dispatch(setSingleOrder([existOrder]));
//         dispatch(setStatus(Status.SUCCESS));
//       } else {
//         dispatch(setStatus(Status.LOADING));
//         try {
//           const response = await APIAuthenticated.get(`/user/order/${id}`);
//           if(response.status === 200){
//                 dispatch(setSingleOrder(response.data.data))
//                 dispatch(setStatus(Status.SUCCESS));
//           }
//         } catch (error) {
//           dispatch(setStatus(Status.ERROR));
//           throw error;
//         }
//       }
//   }
// }

export function editMyOrders(id: string, data: OrderData) {
  return async function editMyOrdersThunk(dispatch: AppDispatch){
    dispatch(setStatus(Status.LOADING))
    try{
      const response = await APIAuthenticated.patch(`/user/order/${id}`, data); 
      if(response.status === 200){
            dispatch(setSingleOrder(response.data.data));
            dispatch(setStatus(Status.SUCCESS));
            dispatch(fetchMyOrder());
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      throw error;
    }
  }
}

export function deleteMyOrders(id: string){
  return async function deleteMyOrdersThunk(dispatch: AppDispatch){
    dispatch(setStatus(Status.LOADING))
    try{
      const response = await APIAuthenticated.delete(`/user/order/${id}`);
      if(response.status === 200){
            dispatch(deleteOrder(id));
            dispatch(setStatus(Status.SUCCESS));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      throw error;
    }
  }
}
