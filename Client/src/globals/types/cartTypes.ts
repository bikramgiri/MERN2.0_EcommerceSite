import type { Product } from "./productTypes";


export interface CartItem{
      productId: string,
      quantity: number,
      product: Product,
}

export interface CartState{
      items: CartItem[]
      status: string
}