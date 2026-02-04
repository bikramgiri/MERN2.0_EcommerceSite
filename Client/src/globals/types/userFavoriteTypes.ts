import type { Product, UserData } from "./productTypes"

export interface AddToFavoriteData{
      id: string
      userId?: string,
      productId?: string
}

export interface UserFavorite{
      id?: string,
      createdAt?: string,
      updatedAt?: string,
      userId: string,
      productId: string
      User?: UserData,
      Product: Product
}

export interface UserFavoriteState{
      // userFavorite: UserFavorite[],
      userFavorite: Product[];
      status: string;
}
