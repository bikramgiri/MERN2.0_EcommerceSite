import { Response } from "express";
import Product from "../../models/productModel";
import User from "../../models/userModel";
import { AuthRequest } from "../../middleware/authMiddleware";
import Category from "../../models/categoryModel";

class UserController {
  // Add to Favorites (toggle)
  public static async AddToFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { productId } = req.body;
      if (!productId || typeof productId !== 'string' || productId.trim() === '') {
        res.status(400).json({ message: "Valid Product ID is required" });
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const product = await Product.findByPk(productId as string);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      // Check if already favorited
      const isFavorited = await user.$has('FavoritedProducts', product);
      if (isFavorited) {
        await user.$remove('FavoritedProducts', product);
        res.status(200).json({ 
          message: "Removed from favorites",
          isFavorite: false 
        });
      } else {
        await user.$add('FavoritedProducts', product);
        // res.status(200).json({ 
        //   message: "Added to favorites",
        //   isFavorite: true 
        // });
        res.status(200).json({ 
  message: isFavorited ? "Removed from favorites" : "Added to favorites",
  isFavorite: !isFavorited,
  data: product   // ← return the Product instance
});
      }
    } catch (error: any) {
      console.error("AddToFavorite error:", error);
      res.status(500).json({ 
        message: "Internal server error", 
        error: error.message 
      });
    }
  }

  // Get all favorite products
  public static async getFavoriteProducts(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await User.findByPk(userId, {
        include: [{
          model: Product,
          as: 'FavoritedProducts',
          through: { attributes: [] },
          include: [{
            model: Category,
            attributes: ['categoryName'],
          }],
        }],
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({ 
        message: 'Favorite products fetched successfully',
        data: (user as any).FavoritedProducts || [],   // ← safe access
        // count: user.FavoritedProducts?.length || 0
      });
    } catch (error: any) {
      console.error("getFavoriteProducts error:", error);
      res.status(500).json({ 
        message: 'Internal server error', 
        error: error.message 
      });
    }
  }

  // Remove specific product from favorites
  public static async removeFromFavorites(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { id: productId } = req.params;
      if (!productId || typeof productId !== 'string' || productId.trim() === '') {
        res.status(400).json({ message: "Valid Product ID is required" });
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      await user.$remove('FavoritedProducts', product);

      res.status(200).json({ 
        message: 'Product removed from favorites successfully',
        isFavorite: false 
      });
    } catch (error: any) {
      console.error("removeFromFavorites error:", error);
      res.status(500).json({ 
        message: 'Internal server error', 
        error: error.message 
      });
    }
  }
}

export default UserController;