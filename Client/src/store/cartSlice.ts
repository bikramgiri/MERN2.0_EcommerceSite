import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { CartItem, CartState, RawCartItem } from "../globals/types/cartTypes";
import { Status } from "../globals/statuses";
import { APIAuthenticated } from "../http";
import type { AppDispatch } from "./store";

const initialState: CartState = {
  items: [],
  status: Status.IDLE,
}

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/ditfnlowl/image/upload/v1769440422/Mern2_Ecommerce_Website/";

const cartSlice = createSlice({
      name: "cart",
      initialState,
      reducers: {
          setItems(state: CartState, action: PayloadAction<CartItem[]>) {
                  state.items = action.payload;
          },
          setStatus(state: CartState, action: PayloadAction<Status>) {
                  state.status = action.payload;
          },
          deleteItem(state: CartState, action: PayloadAction<string>) {
               state.items = state.items.filter(item => item.productId !== action.payload);
          },
           updateItems(state: CartState, action: PayloadAction<CartItem[]>) {
            const updatedItem = action.payload[0];
            const index = state.items.findIndex(item => item.productId === updatedItem.productId);
            if (index !== -1) {
              state.items[index] = updatedItem;
            }
          },
           emptyCart(state: CartState) {
              state.items = [];
           }
      },

})

export const { setItems, setStatus, deleteItem, updateItems, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;

// Safe transform: filter invalid items (null Product/productId) and use full URLs
const transformCartItems = (data: RawCartItem[]): CartItem[] => {
  return data
    .filter(item => item.Product !== null && item.productId !== null)
    .map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: item.Product.id,
        productName: item.Product.productName,
        productPrice: item.Product.productPrice,
        productTotalStockQty: item.Product.productTotalStockQty,
        productImage: item.Product.productImage ? `${CLOUDINARY_BASE_URL}${item.Product.productImage}` : "/placeholder.jpg",
      },
    }));
};

export function addToCart(productId: string){
      return async function addToCartThunk(dispatch: AppDispatch){
            dispatch(setStatus(Status.LOADING));
            try{
                  const response = await APIAuthenticated.post(`user/cart`, {productId});
                  if(response.status === 201 || response.status === 200){
                        dispatch(fetchCartItems() );
                        // dispatch(setItems([response.data.data]));
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
                        const transformedItems = transformCartItems(response.data.data || []);
                        dispatch(setItems(transformedItems));
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
                  const response = await APIAuthenticated.patch(`user/cart/${data.productId}`, { quantity: data.quantity });
                  if(response.status === 200){
                        dispatch(updateItems([data]));
                        dispatch(fetchCartItems() );
                        dispatch(setStatus(Status.SUCCESS));
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
                        dispatch(fetchCartItems() );
                        dispatch(setStatus(Status.SUCCESS));
                  }
            }catch(error){
                  dispatch(setStatus(Status.ERROR));
                  throw error;
            }
      }
}
