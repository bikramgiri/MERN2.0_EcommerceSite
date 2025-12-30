import { Request, Response } from "express";
import Product from "../database/models/productModel";

class ProductController {
  // *Create Product
  public static async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({
          message: "Please upload a product image",
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
      } = req.body;

      // validate required fields
      if (
        !productName ||
        !productDescription ||
        !productPrice ||
        !productTotalStockQty
      ) {
        res.status(400).json({
          message: "Please provide all required fields",
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
        productImage: productImage,
        productPrice: productPrice,
        productTotalStockQty: productTotalStockQty,
        productDescription: productDescription,
      });
      res.status(201).json({
        message: "Product created successfully",
        data: newProduct,
        //   product: {
        //     ...newProduct.get({ plain: true }),
        //     productImage: productImage,         // ← full URL for client
        //   },
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
