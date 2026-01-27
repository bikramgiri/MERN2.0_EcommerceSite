import { Response } from "express";
import Product from "../../models/productModel";
import User from "../../models/userModel";
import { AuthRequest } from "../../middleware/authMiddleware";
import Category from "../../models/categoryModel";

class UserController {
  private static readonly CLOUDINARY_BASE_URL =
    "https://res.cloudinary.com/ditfnlowl/image/upload/v1769440422/Mern2_Ecommerce_Website/";

  private static getFullImageUrl(fileName: string | undefined): string {
    if (!fileName) return "/placeholder.jpg";
    return `${this.CLOUDINARY_BASE_URL}${fileName}`;
  }
  // Add to Favorites
  public static async AddToFavorite(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { productId } = req.body;
      if (
        !productId ||
        typeof productId !== "string" ||
        productId.trim() === ""
      ) {
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
      const isFavorited = await user.$has("FavoritedProducts", product);
      if (isFavorited) {
        await user.$remove("FavoritedProducts", product);
        res.status(200).json({
          message: "Removed from favorites",
          isFavorite: false,
        });
      } else {
        await user.$add("FavoritedProducts", product);
        // Transform product to include full image URL
        const plainProduct = product.toJSON();
        const productWithFullImage = {
          ...plainProduct,
          productImage: UserController.getFullImageUrl(plainProduct.productImage),
        };

        res.status(200).json({
          message: "Added to favorites",
          isFavorite: true,
          data: productWithFullImage, // ← return the Product instance
        });

        // *OR

        // res.status(200).json({
        //   message: isFavorited
        //     ? "Removed from favorites"
        //     : "Added to favorites",
        //   isFavorite: !isFavorited,
        //   data: productWithFullImage, // ← return the Product instance
        // });
      }
    } catch (error: any) {
      console.error("AddToFavorite error:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get all favorite products
  public static async getFavoriteProducts(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user = await User.findByPk(userId, {
        include: [
          {
            model: Product,
            as: "FavoritedProducts",
            through: { attributes: [] },
            include: [
              {
                model: Category,
                attributes: ["categoryName"],
              },
            ],
          },
        ],
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

     const favoriteProducts = ((user as any).FavoritedProducts || []).map((p: any) => p.toJSON());

      // Transform each favorite product to include full Cloudinary URL
      const favoritesWithFullImage = favoriteProducts.map((plain: any) => ({
        ...plain,
        productImage: UserController.getFullImageUrl(plain.productImage),
      }));

      res.status(200).json({
        message: "Favorite products fetched successfully",
        // data: (user as any).FavoritedProducts || [], // ← safe access
        // count: user.FavoritedProducts?.length || 0

        // *OR
        data: favoritesWithFullImage,
        // count: favoritesWithFullImage.length || 0,
      });
    } catch (error: any) {
      console.error("getFavoriteProducts error:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Remove specific product from favorites
  public static async removeFromFavorites(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { id: productId } = req.params;
      if (
        !productId ||
        typeof productId !== "string" ||
        productId.trim() === ""
      ) {
        res.status(400).json({ message: "Valid Product ID is required" });
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      await user.$remove("FavoritedProducts", product);

      res.status(200).json({
        message: "Product removed from favorites successfully",
        isFavorite: false,
      });
    } catch (error: any) {
      console.error("removeFromFavorites error:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

export default UserController;
