import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { API, APIAuthenticated } from "../http";
import  {Status}  from "../globals/statuses";
import type { AppDispatch } from './store';
import type { Review, ReviewState } from "../globals/types/reviewTypes";

const initialState: ReviewState = {
  review: [],
  status: Status.LOADING,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
      setReviews: (state: ReviewState, action: PayloadAction<Review[]>) => {
          state.review = action.payload;
      },
      setStatus: (state: ReviewState, action: PayloadAction<Status>) => {
          state.status = action.payload;
      },
      addReviews: (state: ReviewState, action: PayloadAction<Review>) => {
            state.review.unshift(action.payload); 
      },
      editReview: (state: ReviewState, action: PayloadAction<Review>) => {
            const index = state.review.findIndex(review => review.id === action.payload.id);
            if (index !== -1) {
                  state.review[index] = action.payload;
            }
      },
      deleteReviewById: (state: ReviewState, action: PayloadAction<string>) => {
            state.review = state.review.filter(r => r.id !== action.payload);
      },
      setUserReviews: (state: ReviewState, action: PayloadAction<Review[]>) => {
            state.review = action.payload;
      },
  },
    },
);

export const { setReviews, setStatus, editReview, deleteReviewById, setUserReviews, addReviews } = reviewSlice.actions
export default reviewSlice.reducer

// fetch single product reviews
export function fetchProductReviews(productId: string){
      return async function fetchProductReviewsThunk(dispatch: AppDispatch) {
        dispatch(setStatus(Status.LOADING));
            try {
                  const response = await API.get(`/user/review/${productId}`);
                  dispatch(setReviews(response.data.data));
                  dispatch(setStatus(Status.SUCCESS));
            } catch (error) {
                  dispatch(setStatus(Status.ERROR));
                  throw error;
            }
      }
}

// add review
// export function addReview(data: Omit<FormData, "createdAt" | "updatedAt">){
export function addReview(payload: { productId: string, data: FormData }){
      return async function addReviewThunk(dispatch: AppDispatch) {
            dispatch(setStatus(Status.LOADING));
            try { 
                  const response = await APIAuthenticated.post(`/user/review/${payload.productId}`, payload.data);
                  if(response.status === 201){
                        dispatch(addReviews(response.data.data));
                        dispatch(setStatus(Status.SUCCESS));
                  }
                  dispatch(fetchProductReviews(payload.productId));
            }
            catch (error) {
                  dispatch(setStatus(Status.ERROR));
                  throw error;
            }     
      }
}

// fetch user reviews
export function fetchUserReviews(userId: string){
      return async function fetchUserReviewsThunk(dispatch: AppDispatch) {
            dispatch(setStatus(Status.LOADING));
            try {
                  const response = await APIAuthenticated.get(`/user/review/user/${userId}`);
                  console.log("Fetched user reviews:", response.data);
                  if(response.status === 200){
                        dispatch(setUserReviews(response.data.data));
                        dispatch(setStatus(Status.SUCCESS));
                  }
            }
            catch (error) {
                  dispatch(setStatus(Status.ERROR));
                  throw error;
            }
      }
}

// update review
export function updateReview(payload: { reviewId: string, data: FormData }) { 
      return async function updateReviewThunk(dispatch: AppDispatch) {
            dispatch(setStatus(Status.LOADING));
            try {
              const response = await APIAuthenticated.patch(
                `/user/review/${payload.reviewId}`,
                payload.data,
              );
              if (response.status === 200) {
                dispatch(editReview(response.data.data));
                dispatch(setStatus(Status.SUCCESS));
              }
            }
            catch (error) {
                  dispatch(setStatus(Status.ERROR));
                  throw error;
            }
      }
}

// delete review
export function deleteReview(reviewId: string){
      return async function deleteReviewThunk(dispatch: AppDispatch) {
            dispatch(setStatus(Status.LOADING));
            try {
                  const response = await APIAuthenticated.delete(`/user/review/${reviewId}`);
                  if(response.status === 200){
                        dispatch(deleteReviewById(reviewId));
                        dispatch(setStatus(Status.SUCCESS));
                  }
            }
            catch (error) {
                  dispatch(setStatus(Status.ERROR));
                  throw error;
            }
      }
}







