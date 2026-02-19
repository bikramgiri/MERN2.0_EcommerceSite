import { Request, Response } from "express";
import Product from "../../../models/productModel";
import User from "../../../models/userModel";
import Order from "../../../models/orderModel";
import Category from "../../../models/categoryModel";


class DataService {
  async getDatas(req: Request, res: Response) {
      const products = (await Product.findAll()).length;
      const users = (await User.findAll({ where: { role: "customer" } })).length;
      const orders = (await Order.findAll()).length;
      const categories = (await Category.findAll()).length

      const allProducts = await Product.findAll();
      const allUsers = await User.findAll({ where: { role: "customer" } });
      const allOrders = await Order.findAll({
            include: [
             {
                  model: User,
                  attributes: ['id', 'username', 'email']
             }
            ]
      })
      const allCategories = await Category.findAll();

      res.status(200).json({
            message: "Data fetched successfully",
            data: {
                  products,
                  users,
                  orders,
                  categories,
                  allProducts,
                  allUsers,
                  allOrders,
                  allCategories
            }
      });
  }
}

export default new DataService();