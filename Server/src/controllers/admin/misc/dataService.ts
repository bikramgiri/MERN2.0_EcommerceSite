import { Request, Response } from "express";
import Product from "../../../models/productModel";
import User from "../../../models/userModel";
import Order from "../../../models/orderModel";


class DataService {
  async getDatas(req: Request, res: Response) {
      const products = (await Product.findAll()).length;
      const users = (await User.findAll({ where: { role: "customer" } })).length;
      const orders = (await Order.findAll()).length;

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

      res.status(200).json({
            message: "Data fetched successfully",
            data: {
                  products,
                  users,
                  orders,
                  allProducts,
                  allUsers,
                  allOrders
            }
      });
  }
}

export default new DataService();