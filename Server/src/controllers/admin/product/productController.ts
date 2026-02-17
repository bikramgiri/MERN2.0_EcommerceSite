import { Request, Response } from "express";
import Product from "../../../models/productModel";
import { AuthRequest } from "../../../middleware/authMiddleware";
import Category from "../../../models/categoryModel";
import User from "../../../models/userModel";
import Order from "../../../models/orderModel";
import Payment from "../../../models/paymentModel";
import OrderDetail from "../../../models/orderDetailsModel";
import { cloudinary } from "../../../cloudinary";
const fs = require("fs");
  
class ProductController {
private static readonly CLOUDINARY_BASE_URL =
    "https://res.cloudinary.com/ditfnlowl/image/upload/v1769440422/Mern2_Ecommerce_Website/";

  // Helper to get full URL from stored filename
  private static getFullImageUrl(fileName: string | undefined): string {
    if (!fileName) return "/placeholder.jpg";
    return `${this.CLOUDINARY_BASE_URL}${fileName}`;
  }

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

      // *Get Cloudinary result from middleware
    const cloudinaryResult = (req as any).cloudinaryResult;
    if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      res.status(500).json({ message: "Image upload failed" });
      return;
    }

    const productImage = cloudinaryResult.secure_url; // full HTTPS URL
    // const fileName = productImage.substring(productImage.lastIndexOf('/') + 1); // f6g7yfl6zw37eo0327nl.png
    const fileName = productImage.split('/').pop() || '';

       // *For Multer Storage
      // const fileName = file.filename;
      // const productImage = `${process.env.BACKEND_URL}/src/storage/${fileName}`;

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

      // Send full URL in response
    const responseProduct = {
      ...newProduct.toJSON(),
      productImage: productImage,
    };

      res.status(201).json({
        message: "Product created successfully",
        // data: newProduct,
        // product: {
        //   productImage: productImage, // ← full URL for client= https://res.cloudinary.com/ditfnlowl/image/upload/v1769440422/Mern2_Ecommerce_Website/ngufnfy7t56skpaxj6uj.png
        // },
        // *OR
        data: responseProduct,
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

    //   // *Get Cloudinary result from middleware
    // const cloudinaryResult = (req as any).cloudinaryResult;
    // if (!cloudinaryResult || !cloudinaryResult.secure_url) {
    //   res.status(500).json({ message: "Image upload failed" });
    //   return;
    // }

    // const productImage = cloudinaryResult.secure_url; // full HTTPS URL

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
      })
      // arrange recently added products first

    //   // Construct full Cloudinary URLs
    // const baseUrl = "https://res.cloudinary.com/ditfnlowl/image/upload/v1769440422/Mern2_Ecommerce_Website/";
    // const productsWithFullImage = products.map((p) => {
    //   const plain = p.toJSON();
    //   return {
    //     ...plain,
    //     productImage: plain.productImage ? `${baseUrl}${plain.productImage}` : "/placeholder.jpg",
    //   };
    // });

    // *OR

    const productsWithFullImage = products.map((p) => {
        const plain = p.toJSON();
        return {
          ...plain,
          productImage: ProductController.getFullImageUrl(plain.productImage),
        };
      });
      // arrange products by recently added first
      productsWithFullImage.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      res.status(200).json({
        message: "Products fetched successfully",
        data: productsWithFullImage,
        // product: {
        //   productImage: productImage, // ← full URL for client
        // },
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
      // Type guard
      if (
        !productId ||
        typeof productId !== "string" ||
        productId.trim() === ""
      ) {
        res.status(400).json({ message: "Valid Product ID is required" });
        return;
      }

      // // *Get Cloudinary result from middleware
      // const cloudinaryResult = (req as any).cloudinaryResult;
      // if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      //   res.status(500).json({ message: "Image upload failed" });
      //   return;
      // }

      // const productImage = cloudinaryResult.secure_url; // full HTTPS URL

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

    // // Construct full Cloudinary URL
    // const baseUrl = "https://res.cloudinary.com/ditfnlowl/image/upload/v1769440422/Mern2_Ecommerce_Website/";
    // const plainProduct = product.toJSON();
    // const productWithFullImage = {
    //   ...plainProduct,
    //   productImage: plainProduct.productImage ? `${baseUrl}${plainProduct.productImage}` : "/placeholder.jpg",
    // };

    // *OR

    const plainProduct = product.toJSON();
      const productWithFullImage = {
        ...plainProduct,
        productImage: ProductController.getFullImageUrl(plainProduct.productImage),
      };

      res.status(200).json({
        message: "Product fetched successfully",
        data: productWithFullImage,
        // product: {
        //   productImage: productImage, // ← full URL for client
        // },
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
      const { id: productId } = req.params;
      if (!productId || typeof productId !== 'string' || productId.trim() === '') {
        res.status(400).json({ message: "Valid Product ID is required" });
        return;
      }

      const {
        productName,
        productDescription,
        productPrice,
        productTotalStockQty,
        categoryId,
      } = req.body;
      const product = await Product.findByPk(productId);
      if (!product) {
        res.status(404).json({
          message: "Product not found",
          field: "id",
        });
        return;
      }

      // let productImage = product.productImage;

      // validate productName length must be greater than 2
      if (productName.trim().length < 2) {
        res.status(400).json({
          message: "Product name must be at least 2 characters long",
          field: "productName",
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
          field: "productDescription",
        });
        return;
      }

      // validate productPrice must be a number > 0
      const price = Number(productPrice);
      if (isNaN(price) || price <= 0) {
        res.status(400).json({
          message: "Product price must be a number > 0",
          field: "productPrice",
        });
        return;
      }

      // validate productTotalStockQty must be a number >= 0
      const stockQty = Number(productTotalStockQty);
      if (isNaN(stockQty) || stockQty < 0) {
        res.status(400).json({
          message: "Product stock quantity must be a number >= 0",
          field: "productTotalStockQty",
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

      // *For Multer: update product image only if a new image is uploaded
      // if (req.file && req.file.filename) {
      //   const oldProductImage = product.productImage;
      //   // const lengthToCut = `${process.env.BACKEND_URL_STORAGE}`.length;
      //   // const finalImagePathAfterCut = oldProductImage.slice(lengthToCut);
      //   fs.unlink("./src/storage/" + oldProductImage, (err: any) => {
      //     if (err) {
      //       console.error("Error deleting old image:", err);
      //     } else {
      //       console.log("Old image deleted successfully");
      //     }
      //   });
      //   // productImage = `${process.env.BACKEND_URL_STORAGE}` + req.file.filename;
      //   productImage = req.file.filename; // just store filename in DB
      // }

      // *For Cloudinary: update product image only if a new image is uploaded
      let fileName = product.productImage; // Keep old filename
      let productImage = ProductController.getFullImageUrl(fileName); // Default full URL

      // Handle new image upload
      const cloudinaryResult = (req as any).cloudinaryResult;
      if (cloudinaryResult && cloudinaryResult.secure_url) {
        // Delete old image from Cloudinary
        // const oldPublicId = product.productImage.split('.').slice(0, -1).join('.'); // remove file extension
        const oldProductImage = product.productImage.split('/').pop() || '';
        cloudinary.uploader.destroy(oldProductImage, (error: any, result: any) => {
          if (error) {
            console.error("Error deleting old image from Cloudinary:", error);
          } else {
            console.log("Old image deleted from Cloudinary successfully:", result);
          }
        });

        productImage = cloudinaryResult.secure_url; // update to new image URL
        fileName = productImage.split('/').pop() || ''; // update to new filename
      }

      // const finalName = productImage.split('/').pop() || '';

      const updatedProduct = await product.update({
        productName: productName || product.productName,
        productImage: fileName,
        productDescription: productDescription || product.productDescription,
        productPrice: productPrice || product.productPrice,
        productTotalStockQty: productTotalStockQty || product.productTotalStockQty,
        categoryId: categoryId,
      });

      const responseProduct = {
        ...updatedProduct.toJSON(),
        productImage: productImage, // Send full URL
      };

      res.status(200).json({
        message: "Product updated successfully",
        data: responseProduct,
        // data: updatedProduct,
        // product: {
        //   productImage: productImage, // ← full URL for client
        // },
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
      const { id: productId } = req.params; // ← safe destructuring

      // Type guard
      if (!productId || typeof productId !== 'string' || productId.trim() === '') {
        res.status(400).json({ message: "Valid Product ID is required" });
        return;
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        res.status(404).json({
          message: "Product not found",
        });
        return;
      }
      
      // *For Multer Storage: Delete image from Storage folder
      // const oldProductImage = product.productImage; //AI.jpeg
      // // const lengthToCut = "http://localhost:4000/src/storage/".length;
      // // const finalImagePathAfterCut = oldProductImage.slice(lengthToCut);
      // // Delete the image file from Storage folder
      // fs.unlink("./src/storage/" + oldProductImage, (err: any) => {
      //   if (err) {
      //     console.error("Error deleting image:", err);
      //   } else {
      //     console.log("Image deleted successfully");
      //   }
      // });

      // *For Cloudinary: Delete image from Cloudinary
      const fileName = product.productImage.split('/').pop() || '';
      cloudinary.uploader.destroy(fileName, (error: any, result: any) => {
        if (error) {
          console.error("Error deleting image from Cloudinary:", error);
        } else {
          console.log("Image deleted from Cloudinary successfully:", result);
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

  // *Fetch Orders of a Product
  public static async fetchProductOrders( req: Request, res: Response): Promise<void> {
    const productId = req.params.id;
    if (!productId) {
      res.status(400).json({ message: 'Product ID is required' });
      return;
    }

    try {
      const productOrders = await Product.findAll({
        where: { id: productId },
        attributes: ['id', 'productName', 'productPrice', 'productDescription', 'productImage', 'productTotalStockQty'],
        include: [  
          { 
            model: OrderDetail, 
            attributes: ['id', 'quantity'],
            include: [
              { 
                model: Order,
                attributes: ['id', 'orderStatus', 'totalAmount', 'shippingAddress', 'phoneNumber'],
                include: [
                  {
                    model: User,
                    attributes: ['id', 'username', 'email']
                  },
                  {
                    model: Payment,
                    attributes: ['id', 'paymentMethod', 'paymentStatus']
                  }
                ]
              }
            ]
          }
        ]
      });

     
      if (!productOrders) {
        res.status(404).json({ message: 'No orders found for this product' });
        return;
      }

      res.status(200).json({ 
        message: 'Orders fetched successfully', 
        data: productOrders,
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Internal server error' 
      });
    }
  }

  // *Update Stock Quantity of a Product
  public static async updateProductStockQty( req: Request, res: Response): Promise<void> {
    const { id: productId } = req.params; // ← safe destructuring

      // Type guard
      if (!productId || typeof productId !== 'string' || productId.trim() === '') {
        res.status(400).json({ message: "Valid Product ID is required" });
        return;
      }

    try {
    const { productTotalStockQty } = req.body;
    // validate productTotalStockQty must be a number >= 0
    const stockQty = Number(productTotalStockQty);
    if (isNaN(stockQty) || stockQty < 0) {
      res.status(400).json({
        message: "Product stock quantity must be a number >= 0",
      });
      return;
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const updatedProductTotalStockQty = await product.update({ productTotalStockQty: stockQty });
    if (!updatedProductTotalStockQty) {
      res.status(500).json({ message: 'Failed to update product stock quantity' });
      return;
    }

    res.status(200).json({ 
      message: 'Product stock quantity updated successfully', 
      data: updatedProductTotalStockQty 
    });
  } catch (error) {
      res.status(500).json({ 
        message: 'Internal server error' 
      });
    }
  }
}
export default ProductController;
