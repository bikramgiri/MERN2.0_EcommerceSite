import {Request, Response} from "express";
import Category from "../../../models/categoryModel";

class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics",
      categoryDescription:
        "Devices and gadgets including smartphones, laptops, and accessories.",
    },
    {
      categoryName: "Food & Beverages",
      categoryDescription:
        "Groceries, snacks, drinks, and other consumables.",
    },
      {
      categoryName: "Home & Kitchen",
      categoryDescription:
        "Appliances, furniture, and decor for your living spaces.",
      },
  ];
  async seedCategory(): Promise<void> {
      const Datas = await Category.findAll()
      if(Datas.length === 0){
            await Category.bulkCreate(this.categoryData);
            console.log("Categories seeded successfully.");
      } else {
            console.log("Categories already seeded.");
      }
  }

  // *Add Category
  async addCategory(req: Request, res: Response): Promise<void> {
    const { categoryName, categoryDescription } = req.body;
    if (!categoryName || !categoryDescription) {
       res.status(400).json({
        message: "Please provide all required fields",
        field: "data incomplete"
      });
      return;
    }

    // Validate category length greater or equal to 2
    if (categoryName.length < 2) {
       res.status(400).json({
        message: "Category name must be at least 2 characters long",
        field: "categoryName"
      });
      return;
    }

    // Validate if category already exists
    const existingCategory = await Category.findOne({ where: { categoryName } });
    if (existingCategory) {
       res.status(409).json({
        message: "Category already exists",
        field: "categoryName"
      });
      return;
    }

    // Validate description length
    if (categoryDescription.length < 5) {
      res.status(400).json({
        message: "Category description must be at least 5 characters long",
        field: "categoryDescription"
      });
      return;
    }

    const newCategory = await Category.create({
      categoryName,
      categoryDescription
    });
    res.status(201).json({
      message: "Category added successfully",
      data: newCategory,
    });
  }

  // *Get All Categories
  async getAllCategories(req: Request, res: Response): Promise<void> {
    // fetch recently added categories first
    const categories = await Category.findAll({
      order: [["createdAt", "DESC"]], 
    });

    res.status(200).json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  }

  // *Get Category by ID
  async getSingleCategory(req: Request, res: Response): Promise<void> {
     const { id: categoryId } = req.params; // ← safe destructuring

      // Type guard
      if (!categoryId || typeof categoryId !== 'string' || categoryId.trim() === '') {
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

    res.status(200).json({
      message: "Category retrieved successfully",
      data: category,
    });
  }

  // *Update Category
  async updateCategory(req: Request, res: Response): Promise<void> {
     const { id: categoryId } = req.params; // ← safe destructuring

      // Type guard
      if (!categoryId || typeof categoryId !== 'string' || categoryId.trim() === '') {
        res.status(400).json({ 
          message: "Valid Category ID is required",
          field: "id"
         });
        return;
      }

    const { categoryName, categoryDescription } = req.body;
    if (!categoryName && !categoryDescription) {
      res.status(400).json({
        message: "Please provide categoryName or categoryDescription to update",
        field: "data incomplete"
      });
      return;
    }

    // Validate category length greater or equal to 2
    if (categoryName.length < 2) {
       res.status(400).json({
        message: "Category name must be at least 2 characters long",
        field: "categoryName"
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
        field: "categoryDescription"
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

    const updatedCategory = await category.update({
      categoryName: categoryName || category.categoryName,
      categoryDescription: categoryDescription || category.categoryDescription,
    });
    
    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  }

  // *Delete Category
  async deleteCategory(req: Request, res: Response): Promise<void> {
     const { id: categoryId } = req.params; // ← safe destructuring

      // Type guard
      if (!categoryId || typeof categoryId !== 'string' || categoryId.trim() === '') {
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

    await category.destroy();
    res.status(200).json({
      message: "Category deleted successfully",
    });
  }
}

export default new CategoryController() 
