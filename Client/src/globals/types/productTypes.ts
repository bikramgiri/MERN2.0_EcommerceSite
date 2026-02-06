
export interface UserData{
      id: string,
      username: string,
      email: string
}

export interface Category{
      id: string,
      categoryName: string,
      categoryDescription: string
}

export interface Product{
      id: string,
      productId: string,
      productName: string,
      productImage: string,
      productDescription: string,
      productPrice: number,
      productTotalStockQty: number,
      brand?: string,
      discount?: number,
      oldPrice?: number,
      createdAt: string,
      updatedAt: string,
      userId: string,
      categoryId: string
      User: UserData,
      category: Category,
      Ratings?: number
}

export interface ProductState{
      product: Product[],
      status: string,
      singleProduct: Product | null
}
