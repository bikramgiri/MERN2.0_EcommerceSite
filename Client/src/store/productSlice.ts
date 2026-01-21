import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { API } from "../http";
import  {Status}  from "../globals/statuses";
import type { AppDispatch } from './store';
import type { Product, ProductState } from "../globals/types/productTypes";

const initialState: ProductState = {
  product: [],
  status: Status.LOADING,
  singleProduct: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
      setProducts: (state: ProductState, action: PayloadAction<Product[]>) => {
          state.product = action.payload;
      },
      setStatus: (state: ProductState, action: PayloadAction<string>) => {
          state.status = action.payload;
      },
      setSingleProduct: (state: ProductState, action: PayloadAction<Product>) => {
          state.singleProduct = action.payload;
      },
    },
});

export const { setProducts, setStatus, setSingleProduct } = productSlice.actions
export default productSlice.reducer

export function fetchProducts(){
      return async function fetchProductsThunk(dispatch: AppDispatch) {
        dispatch(setStatus(Status.LOADING));
        try {
            const response = await API.get("/admin/product");
            dispatch(setProducts(response.data.data.reverse()));
            dispatch(setStatus(Status.SUCCESS));
        } catch (error) {
            dispatch(setStatus(Status.ERROR));
            throw error;
        }
      }
}


// *Fetch Single product
export function fetchSingleProduct(productId: string){
      return async function fetchSingleProductThunk(dispatch: AppDispatch) {
        dispatch(setStatus(Status.LOADING));
        try {
            const response = await API.get(`/admin/product/${productId}`);
            dispatch(setSingleProduct(response.data.data));
            dispatch(setStatus(Status.SUCCESS));
        } catch (error) {
            dispatch(setStatus(Status.ERROR));
            throw error;
        }
    }
}

// *OR

// *Fetch Single product without API call
// export function fetchSingleProduct(productId: string){
//   return async function fetchSingleProductThunk(dispatch: AppDispatch, getState: () => RootState) {
//     dispatch(setStatus(Status.LOADING));
//       const state = getState();
//       const products = state.product.product;
//       const product = products.find(
//         (product: Product) => product._id === productId,
//       );
//        console.log("Product found in state:", product)
//       if (product) {
//         dispatch(setSingleProduct(product));
//         dispatch(setStatus(Status.SUCCESS));
//       } else {
//         try {
//           const response = await API.get(`/admin/product/${productId}`);
//           dispatch(setSingleProduct(response.data.data));
//           dispatch(setStatus(Status.SUCCESS));
//           console.log("Product fetched from API:", response.data.data)
//         } catch (error) {
//           dispatch(setStatus(Status.ERROR));
//           throw error;
//         }
//       }
//   }
// }






