import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { API } from "../http";
import  {Status}  from "../globals/statuses";
import type { AppDispatch, RootState } from './store';
import type { Product, ProductState } from "../globals/types/productTypes";

const initialState: ProductState = {
  product: [],
  status: Status.LOADING,
  singleProduct: {} as Product,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state: ProductState, action: PayloadAction<Product[]>) => {
      state.product = action.payload;
    },
    setStatus: (state: ProductState, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
    setSingleProduct: (state: ProductState, action: PayloadAction<Product>) => {
      state.singleProduct = action.payload;
    },
    updateSingleProductStockQty(
      state: ProductState,
      action: PayloadAction<{ productId: string; newStockQty: number }>,
    ) {
      const { productId, newStockQty } = action.payload;
      if (state.singleProduct?.id === productId) {
        state.singleProduct = {
          ...state.singleProduct,
          productTotalStockQty: newStockQty, 
        };
      }

      // Optional: also update in the products list (if you want consistency)
      state.product = state.product.map((product) =>
        product.id === productId
          ? { ...product, productTotalStockQty: newStockQty }
          : product,
      );
    },
  },
});

export const { setProducts, setStatus, setSingleProduct, updateSingleProductStockQty } = productSlice.actions
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
// export function fetchSingleProduct(productId: string){
//       return async function fetchSingleProductThunk(dispatch: AppDispatch) {
//         dispatch(setStatus(Status.LOADING));
//         try {
//             const response = await API.get(`/admin/product/${productId}`);
//             dispatch(setSingleProduct(response.data.data));
//             dispatch(setStatus(Status.SUCCESS));
//         } catch (error) {
//             dispatch(setStatus(Status.ERROR));
//             throw error;
//         }
//     }
// }

// *OR

// *Fetch Single product without API call
export function fetchSingleProduct(productId: string){
  return async function fetchSingleProductThunk(dispatch: AppDispatch, getState: () => RootState) {
      const state = getState();
      const products = state.product.product;
      const existProduct = products.find(
        (product: Product) => product.id === productId,
      );
      if (existProduct) {
        dispatch(setSingleProduct(existProduct));
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.LOADING));
        try {
          const response = await API.get(`/admin/product/${productId}`);
          if(response.status === 200){
                dispatch(setSingleProduct(response.data.data));
                dispatch(setStatus(Status.SUCCESS));
          }
        } catch (error) {
          dispatch(setStatus(Status.ERROR));
          throw error;
        }
      }
  }
}






