import { Response } from "express";
import Product from "../../../models/productModel";
import User from "../../../models/userModel";
import { AuthRequest } from "../../../middleware/authMiddleware";
import Review from "../../../models/reviewModel";
import getFullImageUrl from "../../../services/imageHandler";

class  AdminReviewController {

  // Fetch all reviews
  public static async getAllReviews(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const reviews = await Review.findAll({
        include: [
          {
            model: Product,
            attributes: ["id", "productName"],
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
