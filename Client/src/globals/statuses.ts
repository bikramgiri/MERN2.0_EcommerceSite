// export const Status = Object.freeze({
//       SUCCESS: "success",
//       ERROR: "error",
//       LOADING: "loading",
//       IDLE: "idle"      
// })

export enum Status {
  SUCCESS = "success",
  ERROR   = "error",
  LOADING = "loading",
  IDLE    = "idle",
}

// export const Status = {
//   SUCCESS: "success",
//   ERROR: "error",
//   LOADING: "loading",
//   IDLE: "idle",
// } as const;

// export type StatusType = keyof typeof Status;     

// export interface Status {
//   SUCCESS: "success",
//   ERROR: "error",
//   LOADING: "loading",
//   IDLE: "idle",
// } 
