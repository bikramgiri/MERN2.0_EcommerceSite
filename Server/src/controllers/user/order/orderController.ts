import { Response } from "express";
import { AuthRequest } from "../../../middleware/authMiddleware";
import { OrderDetails, PaymentMethod, KhaltiResponse, TransactionVerificationResponse, TransactionStatus, PaymentStatus, OrderStatus } from '../../../types/orderTypes';
import Order from "../../../models/orderModel";
import Payment from "../../../models/paymentModel";
import OrderDetail from "../../../models/orderDetailsModel";
import axios from "axios";
import Product from "../../../models/productModel";

class OrderController {
  async createOrder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        message: "User not authenticated",
      });
      return;
    }
    const { phoneNumber, shippingAddress, totalAmount, paymentDetails, items }: OrderDetails = req.body;
    if ( !phoneNumber || !shippingAddress || !totalAmount || !paymentDetails || !paymentDetails.paymentMethod || !items || items.length === 0) {
      res.status(400).json({
        message:
          "All fields phoneNumber, shippingAddress, totalAmount, paymentDetails(paymentMethod) and items are required",
      });
      return;
    }

    const phone = String(phoneNumber).trim();

    // Check if it's exactly 10 characters
    if (phone.length !== 10) {
      res.status(400).json({
        message: "Phone number must be exactly 10 digits long.",
      });
      return;
    }

    // check that it's only digits
    if (!/^\d{10}$/.test(phone)) {
      res.status(400).json({
        message: "Phone number must contain only digits (0-9).",
      });
      return;
    }

    // check whether phoneNumber is already exist or not
    const existingPhoneNumber = await Order.findOne({ where: { phoneNumber: phone } });
    if (existingPhoneNumber) {
      res.status(400).json({
        message: "Phone number already exists.",
      });
      return;
    }

    // Valiadte shipping address length at least 3 characters
    if (shippingAddress.length < 3) {
      res.status(400).json({
        message: "Shipping address must be at least 3 characters long.",
      });
      return;
    }

    // validate total amount should be positive number
    if (totalAmount <= 0) {
      res.status(400).json({
        message: "Total amount must be a positive number.",
      });
      return;
    }

    // create order
    try {
      const paymentData = await Payment.create({
        paymentMethod: paymentDetails.paymentMethod,
      });

      const newOrder = await Order.create({
        userId,
        phoneNumber: phone,
        shippingAddress,
        totalAmount,
        paymentId: paymentData.id,
      });

      // for(var i = 0; i<items.length; i++){ // in for loop: (var i=0; i<items.length; i++), for each: const item of items
      //       await OrderDetail.create({
      //             quantity : items[i].quantity,
      //             productId : items[i].productId,
      //             orderId : newOrder.id
      //       })
      // }
      // *Or
      for (const item of items) { // It automatically iterates over each item in the items array
        await OrderDetail.create({
          quantity: item.quantity,
          productId: item.productId,
          orderId: newOrder.id,
        });
      }
      if (paymentDetails.paymentMethod === PaymentMethod.Khalti) {
        const data = {
          return_url: "http://localhost:4000/khalti-payment-success",
          website_url: "http://localhost:4000",
          amount: totalAmount * 100, //in paisa
          purchase_order_id: newOrder.id.toString(), //unique id for order
          purchase_order_name: "orderName_" + newOrder.id,
        };
        const response = await axios.post(process.env.KHALTI_TEST as string,
          data,
          {
            headers: {
              Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            },
          }
        );
        console.log("Response from Khalti:", response);
        const khaltiResponse: KhaltiResponse = response.data;
        paymentData.pidx = khaltiResponse.pidx;
        await paymentData.save();
        
        res.status(201).json({
              message: "Order placed successfully",
                  order: newOrder,
                  url: khaltiResponse.payment_url
        });
        return;
      }
      res.status(201).json({
        message: "Order created successfully",
        order: newOrder,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async paymentVerify(req: AuthRequest, res: Response): Promise<void> {
    const { pidx } = req.body;
    if (!pidx) {
      res.status(400).json({
        message: "pidx is required",
      });
      return;
    }
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        message: "User not authenticated",
      });
      return;
    }

    try {
      const response = await axios.post(`${process.env.KHALTI_PIDX_TEST}`,{pidx: pidx},{
            headers: {
              Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            }
          }
      );

      const data: TransactionVerificationResponse = response.data;
      if(data.status ===  TransactionStatus.Completed){
            await Payment.update(
                  { paymentStatus: PaymentStatus.Paid },
                  { where: { pidx: pidx } }
            );

            res.status(200).json({
                  message: "Payment verified successfully",
                  data: data
            });
            return;
          } else {
            res.status(400).json({
                  message: "Payment not completed",
                  data: data
            });
        } 
      }catch (err) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // *Fetch orders
  async fetchMyOrders(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        message: "User not authenticated",
      });
      return;
    }

    try {
      const orders = await Order.findAll({
        where: { userId },
        include: [
          {
            model: Payment,
            attributes: ['paymentMethod', 'paymentStatus', 'pidx']
          }
        ]
      });
      if(orders.length === 0){
            res.status(404).json({
                  message: "No orders found for this user"
            });
            return;
      }
      res.status(200).json({
        message: "Orders fetched successfully",
        data: orders,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // *Fetch Order Detais
  async fetchOrderDetails(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        message: "User not authenticated",
      });
      return;
    }

    const orderId = req.params.id;
    if (!orderId) {
      res.status(400).json({
        message: "Order ID is required",
      });
      return;
    }

    try {
      const orderDetails = await OrderDetail.findAll({
        where: { orderId },
        include : [
          {
            model : Product,
            attributes : ["productName", "productPrice", "productDescription"]
          }
        ]
      });

      if (orderDetails.length === 0) {
        res.status(404).json({
          message: "Order details not found",
        });
        return;
      }

      res.status(200).json({
        message: "Order details fetched successfully",
        data: orderDetails,
      });
  }catch (err) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // *Cancel Orders
  async cancelMyOrder(req:AuthRequest, res:Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        message: "User not authenticated",
      });
      return;
    }
    const orderId = req.params.id;
    if (!orderId) {
      res.status(400).json({
        message: "Order ID is required",
      });
      return;
    }

    // try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        res.status(404).json({
          message: "Order not found",
        });
        return;
      }

      if (order.orderStatus === "In Transit" || order.orderStatus === "Preparation" || order.orderStatus === "Delivered") {
        res.status(400).json({
          message: `Order cannot be cancelled as it is already ${order.orderStatus}`,
        });
        return;
      }
      
      // Cancel only if status is Pending
      // if (order.orderStatus === "Pending") {
      //       order.orderStatus = "Cancelled";
      //       await order.save();
      // }
      
      // *Or

      // Cancel the order
      await order.update({ orderStatus: OrderStatus.Cancelled }, { where: { id: orderId } }); 

      res.status(200).json({
        message: "Order cancelled successfully",
      });
    // } catch (err) {
    //   res.status(500).json({
    //     message: "Internal server error",
    //   });
    // }
  }
}

export default new OrderController();
