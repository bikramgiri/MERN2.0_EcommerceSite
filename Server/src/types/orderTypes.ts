
export interface OrderDetails {
  phoneNumber: string,
  shippingAddress: string,
  totalAmount: number,
  paymentDetails: {
    paymentMethod: PaymentMethod,
    paymentStatus?: PaymentStatus,
    pidx?: string
  },
  items : OrderItems[]
// *Or
//   items: {
//     productId: string,
//     quantity: number
//   }[]
}

export interface OrderItems {
  productId: string,
  quantity: number
}

export enum PaymentMethod {
  COD = "COD",
  Khalti = "Khalti",
  eSewa = "eSewa"
}

export enum PaymentStatus {
  Pending = "Pending",
  Paid = "Paid"
}

export interface KhaltiResponse {
      pidx : string,
      payment_url : string,
      expires_at : Date | string,
      expires_in : number,
      user_fee : number
}

export interface TransactionVerificationResponse {
      pidx : string,
      total_amount : number,
      status : TransactionStatus,
      transaction_id : string,
      fee : number,
      refunded : boolean
}

export enum TransactionStatus {
  Completed = "Completed",
  Pending = "Pending",
  Initiated = "Initiated",
  Refunded = "Refunded",
  Expired = "Expired",
  UserCancelled = "User Cancelled"
}