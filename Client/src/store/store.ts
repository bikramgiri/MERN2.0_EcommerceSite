import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productSlice from "./productSlice";
import UserFavoriteSlice from "./userFavouriteSlice";

const store = configureStore({
      reducer: {
            auth: authSlice,
            product: productSlice,
            favorite: UserFavoriteSlice,
      },
});

export default store;

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
