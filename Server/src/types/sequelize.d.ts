import { Product } from '../models/productModel';

declare module '../models/userModel' {
  interface User {
    FavoritedProducts?: Product[];
  }
}