import { Response, Request } from "express";
import { AuthRequest } from "../../../middleware/authMiddleware";
import Cart from "../../../models/cartModel";
import Product from "../../../models/productModel";
import User from "../../../models/userModel";
import Category from "../../../models/categoryModel";

class CartController {
  // *Add to Cart
  async addToCart(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized! User not found",
        field: "user",
      });
      return;
    }

    const { productId } = req.body;
    if (!productId) {
      res.status(400).json({
        message: "Please provide productId",
        field: "productId",
      });
      return;
    }

    // Product existence check
    const product = await Product.findByPk(productId
      // ,{attributes: ["id", "productName", "productPrice", "productTotalStockQty"],}
    );
    if (!product) {
      res.status(404).json({
        message: "Product not found",
        field: "productId",
      });
      return;
    }

    // check if the product is already in the cart or not
    const existingCartItem = await Cart.findOne({  
      where: { productId, userId },
      include: [
        {
          model: Product,
          attributes: ["id", "productName", "productPrice", "productTotalStockQty"],
        },
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });

    if (existingCartItem) {
      // if exists, increase the quantity by 1
      existingCartItem.quantity += 1;
      await existingCartItem.save();

      res.status(200).json({
      message: "Cart item quantity increased",
      data: existingCartItem,
    });
    return;
    } 
    
    const newCartItem = await Cart.create({
        userId: userId, 
        productId: productId,
        quantity: 1,
      });

    res.status(201).json({
      message: "Product added to cart successfully",
      data: { 
        ...newCartItem.toJSON(),
        product: product
      }
    });
    return;
  }

  // *Get Cart items
  async getAllCartItems(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized! User not found",
      });
      return;
    }
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product ,
          attributes: ["id", "productName", "productPrice", "productTotalStockQty", "productImage"],
          include: [
            {
              model: Category,
              attributes: ["id", "categoryName"], 
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });
    // if (!cartItems || cartItems.length === 0) {
    //   res.status(404).json({
    //     message: "No items found in cart",
    //     data: [],
    //   });
    //   return;
    // }

    res.status(200).json({
      message: "Cart items fetched successfully",
      data: cartItems,
    });
  }

  // *Get Single Cart Item
  async getSingleCartItem(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized! User not found",
      });
      return;
    }

    const cartItem = await Cart.findOne({
      where: { userId },
      attributes: ["id", "quantity", "productName", "productPrice", "productTotalStockQty"],
      include: [
        {
          model: Product,
          attributes: ["id", "productName"],
        },
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });
    if (!cartItem) {
      res.status(404).json({
        message: "Cart item not found",
      });
      return;
    }
    res.status(200).json({
      message: "Cart item fetched successfully",
      data: cartItem,
    });
  }

  // *Update Cart Item
  async updateCartItem(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized! User not found",
        field: "user",
      });
      return;
    }

    const productId = req.params.id;
    if (!productId) {
      res.status(400).json({
        message: "Please provide productId",
        field: "productId",
      });
      return;
    }

    // Safe access to body
  if (!req.body || typeof req.body !== "object") {
    res.status(400).json({
      message: "Invalid request body",
    });
    return;
  }

  const quantity = req.body.quantity;
  if (quantity == null) { // null or undefined
    res.status(400).json({
      message: "Please provide quantity",
      field: "quantity",
    });
    return;
  }

   const numQuantity = Number(quantity);
  if (isNaN(numQuantity) || numQuantity <= 0 || !Number.isInteger(numQuantity)) {
    res.status(400).json({
      message: "Quantity must be a positive integer",
    });
    return;
  }

    // check whether the product exists in the cart or not
    const cartItem = await Cart.findOne({ where: { userId, productId } });  
    if (!cartItem) {
      res.status(404).json({
        message: "Cart item not found",
        // data: [],
      });
      return;
    }

    cartItem.quantity = numQuantity;
    await cartItem.save();

    res.status(200).json({
      message: "Cart item updated successfully",
      data: cartItem,
    });
  }

  // *Delete Cart Item
  async deleteCartItem(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized! User not found",
      });
      return;
    }

     const productId = req.params.id; // ← safe destructuring

      // Type guard
      if (!productId || typeof productId !== 'string' || productId.trim() === '') {
        res.status(400).json({ message: "Valid Product ID is required" });
        return;
      }

    // check whether the product exists in the cart or not
    // const existingProduct = await Cart.findByPk(productId);
    // if (!existingProduct) {
    //   res.status(404).json({
    //     message: "Product not found in cart",
    //   });
    //   return;
    // }

    const cartItem = await Cart.findOne({ where: { userId, productId } });
    if (!cartItem) {
      res.status(404).json({
        message: "Cart item not found",
      });
      return;
    }

    await cartItem.destroy();
    res.status(200).json({
      message: "Cart item removed successfully",
    });
  }
}

export default new CartController();
