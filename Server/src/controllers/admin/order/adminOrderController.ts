import { Response, Request} from "express";
import { OrderStatus } from '../../../types/orderTypes';
import Order from "../../../models/orderModel";
import Payment from "../../../models/paymentModel";
import OrderDetail from "../../../models/orderDetailsModel";
import User from "../../../models/userModel";
import Product from "../../../models/productModel";

// *Extending Order Model to include paymentId
class ExtendedOrder extends Order {
     declare paymentId: string | null;
}

class AdminOrderController {
      // *Fetch all orders
      async getAllOrders(req: Request, res: Response): Promise<void> {
            try {
                  const orders = await Order.findAll({
                    include: [
                      {
                        model: OrderDetail,
                        attributes: ["id", "quantity"],
                        include: [
                          {
                            model: Product,
                            attributes: [
                              "productName",
                              "productPrice",
                              "productDescription",
                              "productImage",
                              "productTotalStockQty",
                            ],
                          },
                        ],
                      },
                      {
                        model: Payment,
                        attributes: ["paymentMethod", "paymentStatus"],
                      },
                      {
                        model: User,
                        attributes: ["username", "email"],
                      },
                    ],
                  });
                  if (!orders) {
                        res.status(404).json({ message: 'No orders found' });
                        return;
                  }

                  res.status(200).json({ 
                        message: 'Orders fetched successfully', 
                        data: orders 
                  });
            } catch (error) {
                  res.status(500).json({ 
                        message: 'Internal server error' 
                  });
            }
      }

      // *Fetch single order
      async getSingleOrder(req: Request, res: Response): Promise<void> {
            const { id: orderId } = req.params; // ← safe destructuring

      // Type guard
      if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
        res.status(400).json({ message: "Valid Order ID is required" });
        return;
      }

            try {
                  const order = await Order.findByPk(orderId, {
                    include: [
                      {
                        model: OrderDetail,
                        attributes: ["id", "quantity"],
                        include: [
                          {
                            model: Product,
                            attributes: [
                              "productName",
                              "productPrice",
                              "productDescription",
                              "productImage",
                              "productTotalStockQty",
                            ],
                          },
                        ],
                      },
                      {
                        model: Payment,
                        attributes: ["paymentMethod", "paymentStatus"],
                      },
                      {
                        model: User,
                        attributes: ["username", "email"],
                      },
                    ],
                  });
                  if (!order) {
                        res.status(404).json({ message: 'Order not found' });
                        return;
                  }

                  res.status(200).json({ 
                        message: 'Order fetched successfully', 
                        data: order 
                  });
            } catch (error) {
                  res.status(500).json({ 
                        message: 'Internal server error' 
                  });
            }
      }

      // *update order status
      async updateOrderStatus(req: Request, res: Response): Promise<void> {
            const orderId = req.params.id;
            if (!orderId) {
                  res.status(400).json({ message: 'Order ID is required' });
                  return;
            }

            const orderStatus: OrderStatus = req.body.orderStatus;
            if (!orderStatus) {
                  res.status(400).json({ message: 'Order status is required' });
                  return;
            }

            try {
                  // const updateOrderStatus = await Order.findByPk(orderId);
                  // if (!updateOrderStatus) {
                  //       res.status(404).json({ message: 'Order not found' });
                  //       return;
                  // }
                  // order.orderStatus = orderStatus;
                  // await order.save();

                  // *or

                  const updateOrderStatus = await Order.update({orderStatus: orderStatus}, { where: { id: orderId } })

                  res.status(200).json({ 
                        message: 'Order status updated successfully', 
                        data: updateOrderStatus 
                  });
            } catch (error) {
                  res.status(500).json({ 
                        message: 'Internal server error'
                  });
            }
      } 

      // *Update Payment Status
      async updatePaymentStatus(req: Request, res: Response): Promise<void> {
             const { id: orderId } = req.params; // ← safe destructuring

      // Type guard
      if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
        res.status(400).json({ message: "Valid Order ID is required" });
        return;
      }

            const order = await Order.findByPk(orderId);
            if (!order) {
                  res.status(404).json({ 
                        message: 'Order not found' 
                  });
                  return;
            }
            const paymentStatus = req.body.paymentStatus;
            if (!paymentStatus) {
                  res.status(400).json({ 
                        message: 'Payment status is required' 
                  });
                  return;
            }

            const extendedOrder = order as ExtendedOrder;
            if (!extendedOrder.paymentId) {
                  res.status(400).json({
                        message: 'No payment associated with this order'
                  });
                  return;
            }

            try {
                  await Payment.update(
                        // { 'paymentDetails.paymentStatus': paymentStatus }, 
                        // * or
                        { paymentStatus: paymentStatus },
                        { where: { id: extendedOrder.paymentId } }
                  );
                  res.status(200).json({ 
                        message: 'Payment status updated successfully', 
                        data: paymentStatus 
                  });
            } catch (error) {
                  res.status(500).json({ 
                        message: 'Internal server error' 
                  });
            }
      }

      // *Delete order
      async deleteOrder(req: Request, res: Response): Promise<void> {
             const { id: orderId } = req.params; // ← safe destructuring

      // Type guard
      if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
        res.status(400).json({ message: "Valid Order ID is required" });
        return;
      }

            try {
                  const order = await Order.findByPk(orderId);
                  if (!order) {
                        res.status(404).json({ message: 'Order not found' });
                        return;
                  }
                  
                  const extendedOrder = order as ExtendedOrder;

                  await OrderDetail.destroy({ where: { orderId: order.id } });
                  await Payment.destroy({ where: { id: extendedOrder.paymentId } });
                  await Order.destroy({ where: { id: orderId } });

                  res.status(200).json({ 
                        message: 'Order deleted successfully'
                  });
            } catch (error) {
                  res.status(500).json({ 
                        message: 'Internal server error' 
                  });
            }
      }
}

export default new AdminOrderController();

