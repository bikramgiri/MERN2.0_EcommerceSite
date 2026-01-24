import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { CartItem, CartState } from "../globals/types/cartTypes";
import { Status } from "../globals/statuses";
import { APIAuthenticated } from "../http";
import type { AppDispatch } from "./store";

const initialState: CartState = {
  items: [],
  status: Status.IDLE,
};

const cartSlice = createSlice({
      name: "cart",
      initialState,
      reducers: {
          setItems(state: CartState, action: PayloadAction<CartItem[]>) {
                  state.items = action.payload;
                  // state.items.push(...action.payload);
          },
          setStatus(state: CartState, action: PayloadAction<string>) {
                  state.status = action.payload;
          },
          deleteItem(state: CartState, action: PayloadAction<string>) {
               const index = state.items.findIndex(item => item.productId === action.payload);
               if (index !== -1) {
                   state.items.splice(index, 1);
               }
          },
          updateItems(state: CartState, action: PayloadAction<CartItem[]>) {
            const index = state.items.findIndex(item => item.productId === action.payload[0].productId);
            if (index !== -1) {
                state.items[index].quantity = action.payload[0].quantity;
            }
           },
           emptyCart(state: CartState) {
              state.items = [];
           }
      },

})

export const { setItems, setStatus, deleteItem, updateItems, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;

export function addToCart(productId: string){
      return async function addToCartThunk(dispatch: AppDispatch){
            dispatch(setStatus(Status.LOADING));
            try{
                  const response = await APIAuthenticated.post(`user/cart`, {productId});
                  if(response.status === 201 || response.status === 200){
                        dispatch(setItems([response.data.data]));
                        dispatch(setStatus(Status.SUCCESS));
                  }
            }catch(error){
                  dispatch(setStatus(Status.ERROR));
                  throw error;
            }
      }           
}

export function fetchCartItems(){
      return async function fetchCartItemsThunk(dispatch: AppDispatch){
            dispatch(setStatus(Status.LOADING));
            try{
                  const response = await APIAuthenticated.get(`user/cart`);
                  if(response.status === 200){
                        dispatch(setItems(response.data.data));
                        dispatch(setStatus(Status.SUCCESS));
                  }
            }catch(error){
                  dispatch(setStatus(Status.ERROR));
                  throw error;
            }
      }
}

export function updateCartItems(data: CartItem){
      return async function updateCartItemsThunk(dispatch: AppDispatch){
            dispatch(setStatus(Status.LOADING));
            try{
                  const response = await APIAuthenticated.put(`user/cart/${data.productId}`, { quantity: data.quantity });
                  if(response.status === 200){
                        dispatch(updateItems([data]));
                        dispatch(setStatus(Status.SUCCESS));
                        dispatch(fetchCartItems() );
                  }
            }catch(error){
                  dispatch(setStatus(Status.ERROR));
                  throw error;
            }
      }
}

export function removeFromCart(productId: string){
      return async function removeFromCartThunk(dispatch: AppDispatch){
            dispatch(setStatus(Status.LOADING));
            try{
                  const response = await APIAuthenticated.delete(`user/cart/${productId}`);
                  if(response.status === 200){
                        dispatch(deleteItem(productId));
                        dispatch(setStatus(Status.SUCCESS));
                        dispatch(fetchCartItems() );
                  }
            }catch(error){
                  dispatch(setStatus(Status.ERROR));
                  throw error;
            }
      }
}
