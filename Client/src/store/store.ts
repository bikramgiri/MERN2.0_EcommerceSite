import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productSlice from "./productSlice";
import userFavoriteSlice from "./userFavouriteSlice";
import cartSlice from "./cartSlice";

const store = configureStore({
      reducer: {
            auth: authSlice,
            product: productSlice,
            favorite: userFavoriteSlice,
            cart: cartSlice,
      },
});

export default store;

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
