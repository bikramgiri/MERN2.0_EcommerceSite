import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productSlice from "./productSlice";
import userFavoriteSlice from "./userFavouriteSlice";
import cartSlice from "./cartSlice";
import checkoutSlice from "./checkoutSlice";

const store = configureStore({
      reducer: {
            auth: authSlice,
            product: productSlice,
            favorite: userFavoriteSlice,
            cart: cartSlice,
            checkout: checkoutSlice,
      },
});

export default store;

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
