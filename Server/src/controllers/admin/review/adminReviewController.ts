import { Response } from "express";
import Product from "../../../models/productModel";
import User from "../../../models/userModel";
import Review from "../../../models/reviewModel";
import getFullImageUrl from "../../../services/imageHandler";
import Category from "../../../models/categoryModel";

class  AdminReviewController {

  // Fetch all reviews
  public static async getAllReviews(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const reviews = await Review.findAll({
        include: [
          {
            model: Product,
            attributes: ["id", "productName"],
            include: [
              {
                model: Category,
                attributes: ["id", "categoryName"],
              },
            ],
          },
          {
            model: User,
            attributes: ["id", "username", "avatar"],
          },
        ],
      });

      // Transform each review to include full Cloudinary URL for reviewImage
      const reviewsWithFullImage = reviews.map((review: any) => {
        const plainReview = review.toJSON();
        return {
          ...plainReview,
          reviewImage: getFullImageUrl(plainReview.reviewImage),
        };
      });
      reviewsWithFullImage.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      res.status(200).json({
        message: "All reviews fetched successfully",
        totalReviews: reviews.length || 0,
        data: reviewsWithFullImage,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

export default AdminReviewController;
