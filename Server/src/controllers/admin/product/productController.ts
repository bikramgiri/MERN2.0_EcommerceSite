import { Request, Response } from "express";
import Product from "../../../models/productModel";
import { AuthRequest } from "../../../middleware/authMiddleware";
import Category from "../../../models/categoryModel";
import User from "../../../models/userModel";
const fs = require("fs");

class ProductController {
  // *Create Product
  public static async addProduct(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const file = req.file;
      if (!file) {
        res.status(400).json({
          message: "Please upload a product image.",
        });
        return;
      }

      const fileName = file.filename;
      const productImage = `${process.env.BACKEND_URL}/src/storage/${fileName}`;

      const {
        productName,
        productDescription,
        productPrice,
        productTotalStockQty,
        categoryId,
      } = req.body;

      // validate required fields
      if (
        !productName ||
        !productDescription ||
        !productPrice ||
        !productTotalStockQty ||
        !categoryId
      ) {
        res.status(400).json({
          message:
            "Please provide productName, productDescription, productPrice, productTotalStockQty, and categoryId.",
        });
        return;
      }

      // validate productName length must be greater than 2
      if (productName.trim().length < 2) {
        res.status(400).json({
          message: "Product name must be at least 2 characters long",
        });
        return;
      }

      //check if product with same name already exists
      const existingProduct = await Product.findOne({ where: { productName } });
      if (existingProduct) {
        res.status(409).json({
          message: "Product with this name already exists",
        });
        return;
      }

      // validate productDescription length must be greater than 5
      if (productDescription.length < 5) {
        res.status(400).json({
          message: "Product description must be at least 5 characters long",
        });
        return;
      }

      // validate productPrice must be a number > 0
      const price = Number(productPrice);
      if (isNaN(price) || price <= 0) {
        res.status(400).json({
          message: "Product price must be a number > 0",
        });
        return;
      }

      // validate productTotalStockQty must be a number >= 0
      const stockQty = Number(productTotalStockQty);
      if (isNaN(stockQty) || stockQty < 0) {
        res.status(400).json({
          message: "Product stock quantity must be a number >= 0",
        });
        return;
      }

      // check productImage is already exists or not
      const existingImage = await Product.findOne({ where: { productImage } });
      if (existingImage) {
        res.status(409).json({
          message: "Product with this image already exists",
        });
        return;
      }

      const newProduct = await Product.create({
        productName: productName,
        productImage: fileName,
        productPrice: productPrice,
        productTotalStockQty: productTotalStockQty,
        productDescription: productDescription,
        userId: userId,
        categoryId: categoryId,
      });
      res.status(201).json({
        message: "Product created successfully",
        data: newProduct,
        product: {
          ...newProduct.get({ plain: true }),
          productImage: productImage, // ← full URL for client
        },
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  // *Get All Products
  public static async getAllProducts(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            attributes: ["id", "categoryName"],
          },
          {
            model: User,
            attributes: ["id", "username"],
          },
        ],
      });
      res.status(200).json({
        message: "Products fetched successfully",
        data: products,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  // Get single product
  public static async getSingleProduct(req: Request,res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const product = await Product.findByPk(productId, {
        include: [
          {
            model: Category,
            attributes: ["id", "categoryName"],
          },
          {
            model: User,
            attributes: ["id", "username", "email"],
          },
        ],
      });
      if (!product) {
        res.status(404).json({
          message: "Product not found",
        });
        return;
      }
      res.status(200).json({
        message: "Product fetched successfully",
        data: product,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  // Update Product
  public static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        productName,
        productDescription,
        productPrice,
        productTotalStockQty,
        categoryId,
      } = req.body;
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({
          message: "Product not found",
        });
        return;
      }

      let productImage = product.productImage;

      // validate productName length must be greater than 2
      if (productName.trim().length < 2) {
        res.status(400).json({
          message: "Product name must be at least 2 characters long",
        });
        return;
      }

      // //check if product with same name already exists
      // const existingProduct = await Product.findOne({ where: { productName } });
      // if (existingProduct) {
      //   res.status(409).json({
      //     message: "Product with this name already exists",
      //   });
      //   return;
      // }

      // validate productDescription length must be greater than 5
      if (productDescription.length < 5) {
        res.status(400).json({
          message: "Product description must be at least 5 characters long",
        });
        return;
      }

      // validate productPrice must be a number > 0
      const price = Number(productPrice);
      if (isNaN(price) || price <= 0) {
        res.status(400).json({
          message: "Product price must be a number > 0",
        });
        return;
      }

      // validate productTotalStockQty must be a number >= 0
      const stockQty = Number(productTotalStockQty);
      if (isNaN(stockQty) || stockQty < 0) {
        res.status(400).json({
          message: "Product stock quantity must be a number >= 0",
        });
        return;
      }

      // // check productImage is already exists or not
      // const existingImage = await Product.findOne({ where: { productImage } });
      // if (existingImage) {
      //   res.status(409).json({
      //     message: "Product with this image already exists",
      //   });
      //   return;
      // }

      // Update product image only if a new image is uploaded
      if (req.file && req.file.filename) {
        const oldProductImage = product.productImage;
        // const lengthToCut = `${process.env.BACKEND_URL_STORAGE}`.length;
        // const finalImagePathAfterCut = oldProductImage.slice(lengthToCut);
        fs.unlink("./src/storage/" + oldProductImage, (err: any) => {
          if (err) {
            console.error("Error deleting old image:", err);
          } else {
            console.log("Old image deleted successfully");
          }
        });
        // productImage = `${process.env.BACKEND_URL_STORAGE}` + req.file.filename;
        productImage = req.file.filename; // just store filename in DB
      }

      const updatedProduct = await product.update({
        productName: productName,
        productImage: productImage,
        productDescription: productDescription,
        productPrice: productPrice,
        productTotalStockQty: productTotalStockQty,
        categoryId: categoryId,
      });
      res.status(200).json({
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  // Delete Product
  public static async deleteProduct(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          message: "Product ID is required",
        });
        return;
      }
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({
          message: "Product not found",
        });
        return;
      }

      const oldProductImage = product.productImage; //AI.jpeg
      // const lengthToCut = "http://localhost:4000/src/storage/".length;
      // const finalImagePathAfterCut = oldProductImage.slice(lengthToCut);
      // Delete the image file from Storage folder
      fs.unlink("./src/storage/" + oldProductImage, (err: any) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });

      await product.destroy();
      res.status(200).json({
        message: "Product deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }
}
export default ProductController;
