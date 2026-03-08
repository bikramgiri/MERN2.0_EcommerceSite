import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/statuses";
import type {
  CheckoutState,
  OrderData,
  FetchOrder,
  SingleOrder,
  OrderStatus,
  PaymentStatus,
} from "../globals/types/checkoutTypes";
import { APIAuthenticated } from "../http";
import type { AppDispatch } from "./store";
import { emptyCart } from "./cartSlice";

const initialState: CheckoutState = {
  items: [],
  status: Status.IDLE,
  khaltiUrl: null,
  myOrder: [],
  singleOrder: [],
};

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
    setKhaltiUrl(
      state: CheckoutState,
      action: PayloadAction<CheckoutState["khaltiUrl"]>,
    ) {
      state.khaltiUrl = action.payload;
    },
    deleteOrder(state: CheckoutState, action: PayloadAction<string>) {
      state.myOrder = state.myOrder.filter(
        (order) => order.id !== action.payload,
      );
    },
    updateMyOrderStatus(
      state: CheckoutState,
      action: PayloadAction<{ orderId: string; status: OrderStatus }>,
    ) {
      const { orderId, status } = action.payload;
      state.myOrder = state.myOrder.map((order) =>
        order.id === orderId ? { ...order, orderStatus: status } : order,
      );

      // Optional: also update in the single product (if you want consistency)
      state.singleOrder = state.singleOrder.map((single) =>
        single.Order?.id === orderId
          ? {
              ...single,
              Order: { ...single.Order, orderStatus: status },
            }
          : single,
      );

    },
    updateSingleOrderStatus: (
      state: CheckoutState,
      action: PayloadAction<{ orderId: string; status: OrderStatus }>,
    ) => {
      const { orderId, status } = action.payload;

      // Update the nested Order.orderStatus inside singleOrder array
      state.singleOrder = state.singleOrder.map((single) => {
        if (single.Order?.id === orderId) {
          return {
            ...single,
            Order: {
              ...single.Order,
              orderStatus: status,
            },
          };
        }
        return single;
      });
    },
    updatePaymentStatus(
      state: CheckoutState,
      action: PayloadAction<{ orderId: string; status: PaymentStatus }>,
    ) {
      const { orderId, status } = action.payload;
      state.myOrder = state.myOrder.map((order) =>
        order.id === orderId ? { 
          ...order,
          Payment: {
              ...order.Payment,
              paymentStatus: status,
            }, 
        }
        : order
      );
    },
    updateSingleOrderPaymentStatus: (
      state: CheckoutState,
      action: PayloadAction<{ orderId: string; status: PaymentStatus }>,
    ) => {
      const { orderId, status } = action.payload;
      state.singleOrder = state.singleOrder.map((single) => {
        if (single.Order?.id === orderId) {
          return {
            ...single,
            Order: {
              ...single.Order,
              Payment: {
              ...single.Order.Payment,
              paymentStatus: status,
            },
            },
          };
        }
        return single;
      });
    },
  },
});

export const {
  setItems,
  setMyOrders,
  setSingleOrder,
  setStatus,
  setKhaltiUrl,
  deleteOrder,
  updateMyOrderStatus,
  updateSingleOrderStatus,
  updatePaymentStatus,
  updateSingleOrderPaymentStatus,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;

export function createOrder(data: OrderData) {
  return async function createOrderThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.post("/user/order", data);
      if (response.status === 201) {
        dispatch(setItems(response.data.data));
        if (response.data.url) {
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
      if (response.status === 200) {
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
      if (response.status === 200) {
        dispatch(setSingleOrder(response.data.data));
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
  return async function editMyOrdersThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.patch(`/user/order/${id}`, data);
      if (response.status === 200) {
        dispatch(setSingleOrder(response.data.data));
        dispatch(setStatus(Status.SUCCESS));
        dispatch(fetchMyOrder());
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      throw error;
    }
  };
}

export function deleteMyOrders(id: string) {
  return async function deleteMyOrdersThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.delete(`/user/order/${id}`);
      if (response.status === 200) {
        dispatch(deleteOrder(id));
        dispatch(setStatus(Status.SUCCESS));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      throw error;
    }
  };
}

// // Updated orderStatus via socket.io
// export function updatedOrderStatus(data: {
//   orderId: string;
//   status: OrderStatus;
// }) {
//   return function updatedOrderStatusThunk(dispatch: AppDispatch) {
//     dispatch(updateMyOrderStatus(data));
//   };
// }
