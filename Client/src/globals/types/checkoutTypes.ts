
export enum PaymentMethod{
      COD = "COD",
      Khalti = "Khalti"
}

export interface ItemsDetails{
      productId: string;
      quantity: number;
}

export interface OrderResponseItem extends ItemsDetails{
      orderId: string;
}

export interface OrderData{
      phoneNumber: string;
      shippingAddress: string;
      paymentDetails: {
            paymentMethod: PaymentMethod;
      }
      totalAmount: number;
      items: ItemsDetails[];
      username?: string
     email?: string
    city?: string
    state?: string
    postalCode?: number
    country?: string,
    saveData?: false,
}

export interface CheckoutState{
      items: OrderResponseItem[];
      status: string;
      khaltiUrl: string | null;
}