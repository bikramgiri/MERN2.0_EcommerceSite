// import type { Product } from "./productTypes";

export interface CartProduct {
  id: string;
  productName: string;
  productPrice: number;
  productTotalStockQty: number;
  productImage?: string;
}
export interface CartItem{
      productId: string,
      quantity: number,
      product: CartProduct,
}
export interface CartState{
      items: CartItem[]
      status: string
}


// Define raw backend cart item shape (from Sequelize include)
export interface RawCartItem {
  id: string;
  quantity: number;
  productId: string;
  Product: {
    id: string;
    productName: string;
    productPrice: number;
    productTotalStockQty: number;
    productImage?: string;
  };
}

