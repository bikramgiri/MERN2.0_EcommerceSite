// export const STATUSES = Object.freeze({
//       SUCCESS: "success",
//       ERROR: "error",
//       LOADING: "loading",
//       IDLE: "idle"      
// })

// export const enum Status {
//   SUCCESS = "success",
//   ERROR   = "error",
//   LOADING = "loading",
//   IDLE    = "idle",
// }

export const Status = {
  SUCCESS: "success",
  ERROR: "error",
  LOADING: "loading",
  IDLE: "idle",
} as const;

export type StatusType = keyof typeof Status;     
