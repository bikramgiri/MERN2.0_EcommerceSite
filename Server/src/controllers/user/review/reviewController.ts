import {Request, Response } from "express";
import Product from "../../../models/productModel";
import User from "../../../models/userModel";
import { AuthRequest } from "../../../middleware/authMiddleware";
import Review from "../../../models/reviewModel";
import getFullImageUrl from "../../../services/imageHandler";
import { cloudinary } from "../../../cloudinary";
import Category from "../../../models/categoryModel";

class ReviewController {
  // *Add Review
  public static async addReview(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          message: "User not authenticated",
          field: "user",
        });
        return;
      }

      // Get Cloudinary result from middleware
      const cloudinaryResult = (req as any).cloudinaryResult || {
        secure_url: "",
      };
      // if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      //   res.status(500).json({
      //     message: "Image upload failed",
      //     field: "reviewImage",
      //   });
      //   return;
      // }

      const reviewImage = cloudinaryResult.secure_url || "";
      const fileName = reviewImage.split("/").pop() || "";

      const productId = req.params.id;
      if (
        !productId ||
        typeof productId !== "string" ||
        productId.trim() === ""
      ) {
        res.status(400).json({
          message: "Valid Product ID is required",
          field: "productId",
        });
        return;
      }

      const { rating, message } = req.body;

      // Validate rating
      if (
        rating === undefined ||
        typeof rating !== "string" ||
        isNaN(Number(rating)) ||
        parseFloat(rating) < 1 || // changed to allow float ratings lke 4.5
        parseFloat(rating) > 5
      ) {
        res.status(400).json({
          message: "Rating must be a number between 1 and 5",
          field: "rating",
        });
        return;
      }

      // Validate message
      if (
        message === undefined ||
        typeof message !== "string" ||
        message.length < 5 ||
        message.length > 100 ||
        message.trim() === ""
      ) {
        res.status(400).json({
          message: "Message must be a string between 5 and 100 characters",
          field: "message",
        });
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({
          message: "User not found",
          field: "user",
        });
        return;
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        res.status(404).json({
          message: "Product not found",
          field: "product",
        });
        return;
      }

      // // check user already reviewed the product or not
      // const existingReview = await Review.findOne({
      //   where: {
      //     userId,
      //     productId,
      //   },
      // });
      // if (existingReview) {
      //   res.status(400).json({
      //     message: "You have already reviewed this product",
      //     field: "review",
      //   });
      //   return;
      // }

      const review = await Review.create({
        userId,
        productId,
        rating: parseFloat(rating),
        message,
        reviewImage: fileName, // Store only the filename in the database
      });

      const responseReview = {
        ...review.toJSON(),
        reviewImage: reviewImage,
      };

      res.status(200).json({
        message: "Review added successfully.",
        data: responseReview,
      });
    } catch (error: any) {
      console.error("AddReview error:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Fetch all reviews
  public static async fetchAllReviews(
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
      reviewsWithFullImage.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

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

  // Fetch all review of a product
  public static async getProductReviews(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const productId = req.params.id;
      if (!productId) {
        res.status(400).json({
          message: "Product ID is required",
          field: "productId",
        });
        return;
      }

      const productExists = await Product.findByPk(productId as string);
      if (!productExists) {
        res.status(404).json({
          message: "Product not found",
          field: "product",
        });
        return;
      }

      const reviews = await Review.findAll({
        where: { productId },
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

      const plainReviews = reviews.map((review) => review.toJSON());
      const reviewsWithFullImage = plainReviews.map((review: any) => ({
        ...review,
        reviewImage: getFullImageUrl(review.reviewImage),
      }));
      reviewsWithFullImage.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      res.status(200).json({
        message: "Product reviews fetched successfully",
        totalReviews: reviewsWithFullImage.length || 0,
        data: reviewsWithFullImage,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Fetch all review of a user
  public static async getUserReviews(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          message: "User not authenticated",
          field: "user",
        });
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({
          message: "User not found",
          field: "user",
        });
        return;
      }

      const reviews = await Review.findAll({
        where: { userId },
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

      const reviewsWithFullImage = reviews.map((review: any) => {
        const plainReview = review.toJSON();
        return {
          ...plainReview,
          reviewImage: getFullImageUrl(plainReview.reviewImage),
        };
      });
      reviewsWithFullImage.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      res.status(200).json({
        message: "Reviews fetched successfully",
        totalReviews: reviewsWithFullImage.length || 0,
        data: reviewsWithFullImage,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // edit review
  public static async editReview(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          message: "User not authenticated",
          field: "user",
        });
        return;
      }

      const reviewId = req.params.id;
      if (!reviewId) {
        res.status(400).json({
          message: "Review ID is required",
          field: "reviewId",
        });
        return;
      }

      const review = await Review.findByPk(reviewId as string);
      if (review) {
        await review.reload({
          include: [
            {
              model: User,
              attributes: ["id", "username", "avatar"],
            },
          ],
        });
      }
      if (!review) {
        res.status(404).json({
          message: "Review not found",
          field: "review",
        });
        return;
      }

      const { rating, message } = req.body;

      // Validate rating
      if (
        rating !== undefined &&
        (typeof rating !== "string" ||
          isNaN(parseFloat(rating)) ||
          parseFloat(rating) < 1 ||
          parseFloat(rating) > 5)
      ) {
        res.status(400).json({
          message: "Rating must be a number between 1 and 5",
          field: "rating",
        });
        return;
      }

      // Validate message
      if (
        message !== undefined &&
        (typeof message !== "string" ||
          message.length < 5 ||
          message.length > 100 ||
          message.trim() === "")
      ) {
        res.status(400).json({
          message: "Message must be a string between 5 and 100 characters",
          field: "message",
        });
        return;
      }

      // Check if the review belongs to the authenticated user
      if (review.userId !== userId) {
        res.status(403).json({
          message: "Forbidden: You can only edit your own reviews",
          field: "user",
        });
        return;
      }

      // *For Cloudinary: update product image only if a new image is uploaded
      let fileName = review.reviewImage; // Keep old filename
      let reviewImage = getFullImageUrl(fileName); // Default full URL

      // Handle new image upload
      const cloudinaryResult = (req as any).cloudinaryResult;
      if (cloudinaryResult && cloudinaryResult.secure_url) {
        // Delete old image from Cloudinary
        // const oldPublicId = product.productImage.split('.').slice(0, -1).join('.'); // remove file extension
        const oldReviewImage = review.reviewImage.split("/").pop() || "";
        cloudinary.uploader.destroy(
          oldReviewImage,
          (error: any, result: any) => {
            if (error) {
              console.error("Error deleting old image from Cloudinary:", error);
            } else {
              console.log(
                "Old image deleted from Cloudinary successfully:",
                result,
              );
            }
          },
        );

        reviewImage = cloudinaryResult.secure_url; // update to new image URL
        fileName = reviewImage.split("/").pop() || ""; // update to new filename
      }

      const updateReview = await review.update({
        rating: rating !== undefined ? parseFloat(rating) : review.rating,
        message: message || review.message,
        reviewImage: fileName,
      });

      const responseReview = {
        ...updateReview.toJSON(),
        reviewImage: reviewImage,
      };

      res.status(200).json({
        message: "Review updated successfully",
        data: responseReview,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Delete review
  public static async deleteReview(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          message: "Unauthorized",
          field: "user",
        });
        return;
      }

      const { id: reviewId } = req.params;
      if (!reviewId || typeof reviewId !== "string" || reviewId.trim() === "") {
        res.status(400).json({ message: "Valid Review ID is required" });
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const review = await Review.findByPk(reviewId as string);
      if (!review) {
        res.status(404).json({ message: "Review not found" });
        return;
      }

      // // Check if the review belongs to the authenticated user
      // if (review.userId !== userId) {
      //   res.status(403).json({ message: "Forbidden: You can only delete your own reviews" });
      //   return;
      // }

      await review.destroy();

      res.status(200).json({
        message: "Review deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

export default ReviewController;
