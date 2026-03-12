import { Request, Response } from "express";
import Category from "../../../models/categoryModel";
import getFullImageUrl from "../../../services/imageHandler";
import { cloudinary } from "../../../cloudinary";

class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics",
      categoryDescription:
        "Devices and gadgets including smartphones, laptops, and accessories.",
    },
    {
      categoryName: "Food & Beverages",
      categoryDescription: "Groceries, snacks, drinks, and other consumables.",
    },
    {
      categoryName: "Home & Kitchen",
      categoryDescription:
        "Appliances, furniture, and decor for your living spaces.",
    },
  ];
  async seedCategory(): Promise<void> {
    const Datas = await Category.findAll();
    if (Datas.length === 0) {
      await Category.bulkCreate(this.categoryData);
      console.log("Categories seeded successfully.");
    } else {
      console.log("Categories already seeded.");
    }
  }

  // *Add Category
  async addCategory(req: Request, res: Response): Promise<void> {
    const file = req.file;
    if (!file) {
      res.status(400).json({
        message: "Please upload a product image.",
      });
      return;
    }

    // *Get Cloudinary result from middleware
    const cloudinaryResult = (req as any).cloudinaryResult;
    if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      res.status(500).json({ message: "Image upload failed" });
      return;
    }

    const image = cloudinaryResult.secure_url; // full HTTPS URL
    // const fileName = productImage.substring(productImage.lastIndexOf('/') + 1); // f6g7yfl6zw37eo0327nl.png
    const fileName = image.split("/").pop() || "";

    const { categoryName, categoryDescription } = req.body;
    if (!categoryName || !categoryDescription) {
      res.status(400).json({
        message: "Please provide all required fields",
        field: "data incomplete",
      });
      return;
    }

    // Validate category length greater or equal to 2
    if (categoryName.length < 2) {
      res.status(400).json({
        message: "Category name must be at least 2 characters long",
        field: "categoryName",
      });
      return;
    }

    // Validate if category already exists
    const existingCategory = await Category.findOne({
      where: { categoryName },
    });
    if (existingCategory) {
      res.status(409).json({
        message: "Category already exists",
        field: "categoryName",
      });
      return;
    }

    // Validate description length
    if (categoryDescription.length < 5) {
      res.status(400).json({
        message: "Category description must be at least 5 characters long",
        field: "categoryDescription",
      });
      return;
    }

    const newCategory = await Category.create({
      categoryName,
      categoryDescription,
      image: fileName,
    });

    // Send full URL in response
    const responseCategory = {
      ...newCategory.toJSON(),
      image: image,
    };

    res.status(201).json({
      message: "Category added successfully",
      data: responseCategory,
    });
  }

  // *Get All Categories
  async getAllCategories(req: Request, res: Response): Promise<void> {
    // fetch recently added categories first
    const categories = await Category.findAll({
      order: [["createdAt", "DESC"]],
    });
    // fetch newly added categories first

    const categoriesWithFullImage = categories.map((c) => {
      const plain = c.toJSON();
      return {
        ...plain,
        image: getFullImageUrl(plain.image),
      };
    });
    // arrange categories by recently added first
    categoriesWithFullImage.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    res.status(200).json({
      message: "Categories retrieved successfully",
      data: categoriesWithFullImage,
    });
  }

  // *Get Category by ID
  async getSingleCategory(req: Request, res: Response): Promise<void> {
    const { id: categoryId } = req.params; // ← safe destructuring

    // Type guard
    if (
      !categoryId ||
      typeof categoryId !== "string" ||
      categoryId.trim() === ""
    ) {
      res.status(400).json({ message: "Valid Category ID is required" });
      return;
    }
    const category = await Category.findByPk(categoryId);

    if (!category) {
      res.status(404).json({
        message: "Category not found",
      });
      return;
    }

    const responseCategory = {
      ...category.toJSON(),
      image: getFullImageUrl(category.image),
    };

    res.status(200).json({
      message: "Category retrieved successfully",
      data: responseCategory,
    });
  }

  // *Update Category
  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id: categoryId } = req.params; // ← safe destructuring

    // Type guard
    if (
      !categoryId ||
      typeof categoryId !== "string" ||
      categoryId.trim() === ""
    ) {
      res.status(400).json({
        message: "Valid Category ID is required",
        field: "id",
      });
      return;
    }

    const { categoryName, categoryDescription } = req.body;
    if (!categoryName && !categoryDescription) {
      res.status(400).json({
        message: "Please provide categoryName or categoryDescription to update",
        field: "data incomplete",
      });
      return;
    }

    // Validate category length greater or equal to 2
    if (categoryName.length < 2) {
      res.status(400).json({
        message: "Category name must be at least 2 characters long",
        field: "categoryName",
      });
      return;
    }

    // // Validate if category already exists
    // const existingCategory = await Category.findOne({ where: { categoryName } });
    // if (existingCategory) {
    //    res.status(409).json({
    //     message: "Category already exists",
    //   });
    //   return;
    // }

    // Validate description length
    if (categoryDescription.length < 5) {
      res.status(400).json({
        message: "Category description must be at least 5 characters long",
        field: "categoryDescription",
      });
      return;
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      res.status(404).json({
        message: "Category not found",
      });
      return;
    }

    // *For Cloudinary: update product image only if a new image is uploaded
    let fileName = category.image; // Keep old filename
    let image = getFullImageUrl(fileName); // Default full URL

    // Handle new image upload
    const cloudinaryResult = (req as any).cloudinaryResult;
    if (cloudinaryResult && cloudinaryResult.secure_url) {
      const oldImage = category.image.split("/").pop() || "";
      cloudinary.uploader.destroy(oldImage, (error: any, result: any) => {
        if (error) {
          console.error("Error deleting old image from Cloudinary:", error);
        } else {
          console.log(
            "Old image deleted from Cloudinary successfully:",
            result,
          );
        }
      });

      image = cloudinaryResult.secure_url; // update to new image URL
      fileName = image.split("/").pop() || ""; // update to new filename
    }

    // Remove Existing images
    if (req.body.imageToRemove) {
      let imageToRemove = req.body.imageToRemove;
      if (typeof imageToRemove === "string")
        imageToRemove = JSON.parse(imageToRemove);

      // Delete from Cloudinary
      if (imageToRemove.length > 0) {
        const publicIds = imageToRemove.map((filename: string) => {
          const withoutExt = filename.replace(/\.[^/.]+$/, "");
          return `Mern2_Ecommerce_Website/${withoutExt}`;
        });
        await cloudinary.uploader.destroy(publicIds, {
          resource_type: "image",
          invalidate: true,
        });
      }

      // Remove from DB productImage
      await category.update({ image: null });
    }

    const updatedCategory = await category.update({
      categoryName: categoryName || category.categoryName,
      categoryDescription: categoryDescription || category.categoryDescription,
      image: fileName,
    });

    const responseCategory = {
      ...updatedCategory.toJSON(),
      image: image, // return full URL in response
    };

    res.status(200).json({
      message: "Category updated successfully",
      data: responseCategory,
    });
  }

  // *Delete Category
  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id: categoryId } = req.params; // ← safe destructuring

    // Type guard
    if (
      !categoryId ||
      typeof categoryId !== "string" ||
      categoryId.trim() === ""
    ) {
      res.status(400).json({ message: "Valid Category ID is required" });
      return;
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      res.status(404).json({
        message: "Category not found",
      });
      return;
    }

    const fileName = category.image.split("/").pop() || "";
    cloudinary.uploader.destroy(fileName, (error: any, result: any) => {
      if (error) {
        console.error("Error deleting image from Cloudinary:", error);
      } else {
        console.log("Image deleted from Cloudinary successfully:", result);
      }
    });

    await category.destroy();
    res.status(200).json({
      message: "Category deleted successfully",
    });
  }
}

export default new CategoryController();
