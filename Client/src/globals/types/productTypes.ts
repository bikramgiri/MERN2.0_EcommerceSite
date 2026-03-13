
export interface UserData{
      id: string,
      username: string,
      email: string
      avatar?: string
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


export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance', icon: 'Sparkles' },
  { value: 'price_asc', label: 'Price: Low to High', icon: 'ArrowUp' },
  { value: 'price_desc', label: 'Price: High to Low', icon: 'ArrowDown' },
  { value: 'rating', label: 'Highest Rated', icon: 'Star' },
] as const;