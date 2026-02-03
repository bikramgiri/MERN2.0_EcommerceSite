
export enum PaymentMethod{
      COD = "COD",
      Khalti = "Khalti"
}

export enum PaymentStatus{
      Paid = "Paid",
      Pending = "Pending"
}

export enum OrderStatus{
      Pending = "Pending",
      Cancelled = "Cancelled",
      Delivered = "Delivered",
      Preparation = "Preparation",
      InTransit = "In Transit"
}

export interface ProductDetails {
      productName: string;
      productPrice: number;
      productDescription: string;
      productImage: string;
      productTotalStockQty: number;
    };
    

export interface ItemsDetails{
      productId: string;
      quantity: number;
}
export interface FetchOrder extends ItemsDetails{
  id: string;
  phoneNumber: string;
  shippingAddress: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  paymentId: string;
  userId: string;
  OrderDetails: Array<{
    id: string;
    quantity: number;
    Product: ProductDetails;
  }>;
  Payment: {
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
  };
}

export interface OrderData {
  phoneNumber: string;
  shippingAddress: string;
  totalAmount: number;
  paymentDetails: {
    paymentMethod: PaymentMethod;
  };
  items: ItemsDetails[];
  username?: string;
  email?: string;
  city?: string;
  state?: string;
  postalCode?: number;
  country?: string;
  saveData?: false;
}

export interface CheckoutState{
      items: OrderData[];
      status: string;
      khaltiUrl: string | null;
      myOrder: FetchOrder[]
}