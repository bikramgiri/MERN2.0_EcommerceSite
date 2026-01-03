import { Response, Request } from "express";
import { AuthRequest } from "../../../middleware/authMiddleware";
import Cart from "../../../models/cartModel";
import Product from "../../../models/productModel";
import User from "../../../models/userModel";

class CartController {
  // *Add to Cart
  async addToCart(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized! User not found",
      });
      return;
    }

    const { quantity, productId } = req.body;
    if (!quantity || !productId) {
      res.status(400).json({
        message: "Please provide quantity and productId",
      });
      return;
    }

    // validate quantity
    if (quantity <= 0) {
      res.status(400).json({
        message: "Quantity must be greater than zero",
      });
      return;
    }

    // check if the product is already in the cart or not
    const existingCartItem = await Cart.findOne({
      where: { productId },
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

    if (existingCartItem) {
      // if exists, increase the quantity by 1
      existingCartItem.quantity += 1;
      await existingCartItem.save();
    } else {
      // if not exists, create a new cart item

      const newCartItem = await Cart.create({
        userId: userId!,
        productId,
        quantity,
      });
    }

    res.status(201).json({
      message: "Product added to cart successfully",
      data: existingCartItem,
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
          model: Product,
          attributes: ["id", "productName", "productPrice", "productTotalStockQty"],
        },
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });
    if (!cartItems || cartItems.length === 0) {
      res.status(404).json({
        message: "No items found in cart",
      });
      return;
    }

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
      });
      return;
    }

    const productId = req.params.id;
    if (!productId) {
      res.status(400).json({
        message: "Please provide productId",
      });
      return;
    }

    const { quantity } = req.body;
    if (!quantity) {
      res.status(400).json({
        message: "Please provide quantity",
      });
      return;
    }

    // validate quantity
    if (quantity <= 0) {
      res.status(400).json({
        message: "Quantity must be greater than zero",
      });
      return;
    }

    const cartItem = await Cart.findOne({ where: { userId } });
    if (!cartItem) {
      res.status(404).json({
        message: "Cart item not found",
      });
      return;
    }

    cartItem.quantity = quantity;
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

    const cartItem = await Cart.findOne({ where: { userId } });
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
