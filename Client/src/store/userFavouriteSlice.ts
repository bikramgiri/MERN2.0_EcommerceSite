import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { APIAuthenticated } from "../http";
import { Status } from "../globals/statuses";
import type { AddToFavoriteData, UserFavoriteState } from "../globals/types/userFavoriteTypes";
import type { AppDispatch } from "./store";
import type { Product } from "../globals/types/productTypes";

const initialState: UserFavoriteState = {
  userFavorite: [], // Changed from UserFavorite[] to Product[]
  status: Status.IDLE
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    setFavorites: (state: UserFavoriteState, action: PayloadAction<Product[]>) => {
      state.userFavorite = action.payload;
    },
    addToFavorites: (state: UserFavoriteState, action: PayloadAction<Product>) => {
      if (!state.userFavorite.some(p => p.id === action.payload.id)) {
        state.userFavorite.push(action.payload);
      }
    },
    removeFromFavorites: (state: UserFavoriteState, action: PayloadAction<string>) => {
      state.userFavorite = state.userFavorite.filter(
        p => p.id !== action.payload)
    },
    setStatus: (state: UserFavoriteState, action: PayloadAction<string>) => {
      state.status = action.payload;
    }
  },
});

export const { 
  setFavorites, 
  addToFavorites, 
  removeFromFavorites, 
  setStatus, 
} = favoriteSlice.actions;

export default favoriteSlice.reducer;


// Add to Favorites
export function AddToFavorite(product: AddToFavoriteData) {
  return async function addToFavoriteThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
      try {
            const response = await APIAuthenticated.post("/user/favorites", { productId: product.id });
            if (response.status === 200) {
              dispatch(addToFavorites(response.data.data));
              dispatch(setStatus(Status.SUCCESS));
            }
      } catch (error) {
            dispatch(setStatus(Status.ERROR));
            throw error;
         }
      };
}

// Get User Favorites
export function fetchUserFavorites() {
  return async function fetchUserFavoritesThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
      try {
            const response = await APIAuthenticated.get("/user/favorites");
            dispatch(setFavorites(response.data.data || []));
            dispatch(setStatus(Status.SUCCESS));
      } catch (error) {
            dispatch(setStatus(Status.ERROR));
            throw error;
         }
   };
}

// Remove from Favorites
export function removeFavorite(productId: string) {
  return async function removeFavoriteThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
      try {
            const response = await APIAuthenticated.delete(`/user/favorites/${productId}`);
            if (response.status === 200) {
              dispatch(setStatus(Status.SUCCESS));
              dispatch(removeFromFavorites(productId));
            }
      } catch (error) {
            dispatch(setStatus(Status.ERROR));
            throw error;
         }
      };
}
