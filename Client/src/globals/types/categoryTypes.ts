
export interface Category{
      id?: string,
      categoryName: string,
      categoryDescription?: string
       image?: string;
}

export interface CategoryState{
      categories: Category[],
      status: string,
}
