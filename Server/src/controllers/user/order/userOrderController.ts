import { Response } from "express";
import { AuthRequest } from "../../../middleware/authMiddleware";
import { OrderDetails, PaymentMethod, KhaltiResponse, TransactionVerificationResponse, TransactionStatus, PaymentStatus, OrderStatus } from '../../../types/orderTypes';
import Order from "../../../models/orderModel";
import Payment from "../../../models/paymentModel";
import OrderDetail from "../../../models/orderDetailsModel";
import axios from "axios";
import Product from "../../../models/productModel";
import Cart from "../../../models/cartModel";
import User from "../../../models/userModel";
import Category from "../../../models/categoryModel";

// *Extending Order Model to include paymentId
class ExtendedOrder extends Order {
  declare paymentId: string | null
}

type OrderWithPayment = Order & {
  Payment?: Payment | null;
};

class UserOrderController {

  private static readonly CLOUDINARY_BASE_URL =
    "https://res.cloudinary.com/ditfnlowl/image/upload/v1769440422/Mern2_Ecommerce_Website/";

  // Helper to get full URL from stored filename
  private static getFullImageUrl(fileName: string | undefined): string {
    if (!fileName) return "/placeholder.jpg";
    return `${this.CLOUDINARY_BASE_URL}${fileName}`;
  }

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
        message: "All fields phoneNumber, shippingAddress, totalAmount, paymentDetails(paymentMethod) and items are required",
        field: "general"
      });
      return;
    }

    const phone = String(phoneNumber).trim();

    // Check if it's exactly 10 characters
    if (phone.length !== 10) {
      res.status(400).json({
        message: "Phone number must be exactly 10 digits long.",
        field: "phoneNumber"
      });
      return;
    }

    // check that it's only digits
    if (!/^\d{10}$/.test(phone)) {
      res.status(400).json({
        message: "Phone number must contain only digits (0-9).",
        field: "phoneNumber"
      });
      return;
    }

    // check whether phoneNumber is already exist or not
    const existingPhoneNumber = await Order.findOne({ where: { phoneNumber: phone } });
    if (existingPhoneNumber) {
      res.status(400).json({
        message: "Phone number already exists.",
        field: "phoneNumber"
      });
      return;
    }

    // Valiadte shipping address length at least 3 characters
    if (shippingAddress.length < 3) {
      res.status(400).json({
        message: "Shipping address must be at least 3 characters long.",
        field: "shippingAddress"
      });
      return;
    }

    // validate total amount should be positive number
    if (totalAmount <= 0) {
      res.status(400).json({
        message: "Total amount must be a positive number.",
        field: "totalAmount"
      });
      return;
    }

    // calculate total amount as product price * quantity for each item and compare with totalAmount sent by client
    let calculatedTotal = 0;
    let shippingFee = 70
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        res.status(400).json({
          message: `Product with ID ${item.productId} not found.`,
          field: "items"
        });
        return;
      }
      calculatedTotal += product.productPrice * item.quantity + shippingFee;
    }

    if (calculatedTotal !== totalAmount) {
      res.status(400).json({
        message: "Total amount does not match the sum of product prices and quantities.",
        field: "totalAmount"
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
        totalAmount: calculatedTotal,
        items: items,
        paymentId: paymentData.id,
        paymentDetails
      });

      // for(var i = 0; i<items.length; i++){ // in for loop: (var i=0; i<items.length; i++), for each: const item of items
      //       await OrderDetail.create({
      //             quantity : items[i].quantity,
      //             productId : items[i].productId,
      //             orderId : newOrder.id
      //       })
      // }
      // *Or
      let responseOrderData;
      for (const item of items) { // It automatically iterates over each item in the items array
        responseOrderData = await OrderDetail.create({
          quantity: item.quantity,
          productId: item.productId,
          orderId: newOrder.id,
        });
      }
     
      // Clear user's cart after order placement
      await Cart.destroy({ 
        where: { 
          userId: userId,
          productId: items.map(item => item.productId) 
        } 
      });

      if (paymentDetails.paymentMethod === PaymentMethod.Khalti) {
        const data = {
          return_url: "http://localhost:4000/khalti-payment-success",
          website_url: "http://localhost:4000",
          amount: calculatedTotal * 100, //in paisa
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
              url: khaltiResponse.payment_url,
              data: responseOrderData
        });
        return;
      }
      res.status(201).json({
        message: "Order created successfully",
        order: newOrder,
        data: responseOrderData
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // *Update order
  // async updateOrder(req: AuthRequest, res: Response): Promise<void> {
  //   const userId = req.user?.id;
  //   if (!userId) {
  //     res.status(401).json({
  //       message: "User not authenticated",
  //     });
  //     return;
  //   }

  //   const orderId = req.params.id;
  //   if (!orderId) {
  //     res.status(400).json({
  //       message: "Order ID is required",
  //     });
  //     return;
  //   }

  //   const { phoneNumber, shippingAddress, totalAmount, paymentDetails, items }: OrderDetails = req.body;
  //   if ( !phoneNumber || !shippingAddress || !totalAmount || !paymentDetails || !paymentDetails.paymentMethod || !items || items.length === 0) {
  //     res.status(400).json({
  //       message:
  //         "All fields phoneNumber, shippingAddress, totalAmount, paymentDetails(paymentMethod) and items are required",
  //     });
  //     return;
  //   }

  //   const phone = String(phoneNumber).trim();

  //   // Check if it's exactly 10 characters
  //   if (phone.length !== 10) {
  //     res.status(400).json({
  //       message: "Phone number must be exactly 10 digits long.",
  //     });
  //     return;
  //   }

  //   // check that it's only digits
  //   if (!/^\d{10}$/.test(phone)) {
  //     res.status(400).json({
  //       message: "Phone number must contain only digits (0-9).",
  //     });
  //     return;
  //   }

  //   // Valiadte shipping address length at least 3 characters
  //   if (shippingAddress.length < 3) {
  //     res.status(400).json({
  //       message: "Shipping address must be at least 3 characters long.",
  //     });
  //     return;
  //   }

  //   // validate total amount should be positive number
  //   if (totalAmount <= 0) {
  //     res.status(400).json({
  //       message: "Total amount must be a positive number.",
  //     });
  //     return;
  //   }

  //   // try {
  //     const order = await Order.findByPk(orderId);
  //     if (!order) {
  //       res.status(404).json({
  //         message: "Order not found",
  //       });
  //       return;
  //     }
     
  //     await order.update({
  //       phoneNumber: phone,
  //       shippingAddress,
  //       totalAmount,
  //       paymentDetails,
  //       items
  //     })

  //     const updatedOrder = await Order.findByPk(orderId, {
  //     include: [
  //       {
  //         model: Payment,
  //         attributes: ['paymentMethod', 'paymentStatus']
  //       },
  //       {
  //         model: OrderDetail,
  //         attributes: ['quantity'],
  //         include: [{
  //           model: Product,
  //           attributes: ['productName'] 
  //         }]
  //       }
  //     ]
  //   });

      

  //     res.status(200).json({
  //       message: "Order updated successfully",
  //       order: updatedOrder,
  //     });
  //   // } catch (err) {
  //   //   res.status(500).json({
  //   //     message: "Internal server error",
  //   //   });
  //   // }
  // }

  async updateOrder(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ 
      message: "User not authenticated"
     });
    return;
  }

   const { id: orderId } = req.params; // ← safe destructuring
      // Type guard
      if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
        res.status(400).json({ message: "Valid Order ID is required" });
        return;
      }

  const { 
    phoneNumber, 
    shippingAddress, 
    totalAmount, 
    paymentDetails, 
    items 
  } = req.body as Partial<OrderDetails>;

  // Required fields validation
  if (!phoneNumber || !shippingAddress || !totalAmount || 
      !paymentDetails?.paymentMethod || !items?.length) {
    res.status(400).json({
      message: "Phone Number, Shipping Address, Total Amount, Payment Method and Items are required.",
      field: "general"
    });
    return;
  }

  const phone = String(phoneNumber).trim();

// Phone validation
  if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
    res.status(400).json({ 
      message: "Phone number must be exactly 10 digits.",
      field: "phoneNumber"
    });
    return;
  }

  if (shippingAddress.length < 3) {
    res.status(400).json({ 
      message: "Shipping address must be at least 3 characters long.",
      field: "shippingAddress"
    });
    return;
  }

  if (totalAmount <= 0) {
    res.status(400).json({ 
      message: "Total amount must be a positive number." ,
      field: "totalAmount"
    });
    return;
  }

  try {
    // 1. Find order + check ownership
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId ,
        orderStatus: OrderStatus.Pending
      }
    });

    if (!order) {
      res.status(404).json({ 
        message: "Order not found or you don't have permission to update it" 
      });
      return;
    }

    // Validate products, quantities, and recalculate total
    let calculatedTotal = 0;
    const shippingFee = 70; // Match your frontend

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        res.status(400).json({
          message: `Product with ID ${item.productId} not found.`,
          field: "items"
        });
        return;
      }

      if (item.quantity < 1) {
        res.status(400).json({
          message: "Quantity must be at least 1.",
          field: "items"
        });
        return;
      }

      if (item.quantity > product.productTotalStockQty) {
        res.status(400).json({
          message: `Only ${product.productTotalStockQty} units available for ${product.productName}.`,
          field: "items"
        });
        return;
      }

      calculatedTotal += product.productPrice * item.quantity;
    }
    calculatedTotal += shippingFee;
  

    // 2. Update main order fields
    await order.update({
      phoneNumber: phone,
      shippingAddress,
      totalAmount: calculatedTotal,
    });
    const extendedOrder = order as ExtendedOrder;

    // 3. Update Payment (find existing or create if somehow missing)
    let payment = await Payment.findOne({
      where: { id: extendedOrder.paymentId }
    });

    if (!payment) {
      // Rare case: payment was deleted somehow → create new
      payment = await Payment.create({
        paymentMethod: paymentDetails.paymentMethod,
        paymentStatus: PaymentStatus.Pending,
      });
      await order.update({ paymentId: payment.id });
    } else {
      // Update existing payment
      await payment.update({
        paymentMethod: paymentDetails.paymentMethod,
        // paymentStatus: paymentDetails.paymentStatus || payment.paymentStatus, // ← only if you allow changing status
      });
    }

    // 4. Handle items (OrderDetails) → delete old → create new (most common & safest approach)
    await OrderDetail.destroy({
      where: { orderId: order.id }
    });

    for (const item of items) {
      await OrderDetail.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity
      });
    }

    // 5. If Khalti payment method → regenerate payment URL (optional)
    let paymentUrl: string | undefined;
    if (paymentDetails.paymentMethod === PaymentMethod.Khalti) {
      const data = {
        return_url: "http://localhost:4000/khalti-payment-success",
        website_url: "http://localhost:4000",
        amount: totalAmount * 100, // in paisa
        purchase_order_id: order.id.toString(),
        purchase_order_name: "orderName_" + order.id,
      };

      const response = await axios.post(
        process.env.KHALTI_TEST as string,
        data,
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`
          }
        }
      );

      const khaltiResponse: KhaltiResponse = response.data;
      if (payment) {
        payment.pidx = khaltiResponse.pidx;
        await payment.save();
      }

      paymentUrl = khaltiResponse.payment_url;
    }

    // 6. Fetch updated order with relations (same as you wanted)
const updatedOrderDetails = await OrderDetail.findAll({
      where: { orderId },
      include: [
        {
          model: Product,
          include: [{ model: Category, attributes: ['categoryName'] }]
        },
        {
          model: Order,
          where: { userId },
          include: [
            { model: Payment, attributes: ['paymentMethod', 'paymentStatus'] },
            { model: User, attributes: ['username', 'email'] }
          ]
        }
      ]
    });

    const orderDetailsWithFullImage = updatedOrderDetails.map((detail) => {
      const plain = detail.toJSON();
      if (plain.Product?.productImage) {
        plain.Product.productImage = UserOrderController.getFullImageUrl(plain.Product.productImage);
      }
      return plain;
    });

    res.status(200).json({
      message: "Order updated successfully",
      data: orderDetailsWithFullImage,
      ...(paymentUrl && { paymentUrl })
    });

  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
  
  // *Payment Verify 
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
        field: "user"
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
        ],
      });
      if(orders.length === 0){
            res.status(404).json({
                  message: "No orders found for this user"
            });
            return;
      }

        const ordersWithFullImage = orders.map((order) => {
        const plainOrder = order.toJSON();
        if (plainOrder.OrderDetails && Array.isArray(plainOrder.OrderDetails)) {
          plainOrder.OrderDetails = plainOrder.OrderDetails.map((detail: any) => {
            if (detail.Product && detail.Product.productImage) {
              detail.Product.productImage = UserOrderController.getFullImageUrl(detail.Product.productImage);
            }
            return detail;
          });
        }
        return plainOrder;
      });

      res.status(200).json({
        message: "Orders fetched successfully",
        data: ordersWithFullImage,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // *Fetch Order Detais
  async fetchSingleOrder(req: AuthRequest, res: Response): Promise<void> {
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
            // attributes : ["productName", "productPrice", "productDescription", "productImage", "productTotalStockQty"],
            include: [{
              model: Category,
              attributes: ['categoryName']
            }]
          },
          {
            model : Order,
            where : { userId }, // ensure the order belongs to the authenticated user
            // attributes : ["shippingAddress", "phoneNumber", "totalAmount", "orderStatus", "paymentDetails"]
            include: [{
              model: Payment,
              attributes: ['paymentMethod', 'paymentStatus']
            },{
              model : User,
              attributes : ['username', 'email']
            }]
          }
        ]
      });

      if (orderDetails.length === 0) {
        res.status(404).json({
          message: "Order details not found",
        });
        return;
      }
      

     // Add full image URL to every Product in the array
      const orderDetailsWithFullImage = orderDetails.map((detail) => {
        const plain = detail.toJSON();
        if (plain.Product && plain.Product.productImage) {
          plain.Product.productImage = UserOrderController.getFullImageUrl(plain.Product.productImage);
        }
        return plain;
      });
      
      res.status(200).json({
        message: "Order details fetched successfully",
        data: orderDetailsWithFullImage,
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
    const { id: orderId } = req.params; // ← safe destructuring

      // Type guard
      if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
        res.status(400).json({ message: "Valid Order ID is required" });
        return;
      }

    try {
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
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // *Update Order Status 
  async updateOrderStatus(req:AuthRequest, res:Response): Promise<void> {
     const { id: orderId } = req.params; // ← safe destructuring

      // Type guard
      if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
        res.status(400).json({ message: "Valid Order ID is required" });
        return;
      }

    const { orderStatus } = req.body;
    if (!orderStatus) {
      res.status(400).json({
        message: "Order status is required",
      });
      return;
    }

    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        res.status(404).json({
          message: "Order not found",
        });
        return;
      }

      order.orderStatus = orderStatus;;
      await order.save();
      res.status(200).json({
        message: "Order status updated successfully",
        data: order,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // *Delete My Order
  async deleteMyOrder(req:AuthRequest, res:Response): Promise<void> {
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
      const order = await Order.findOne({
        where: {
          id: orderId,
          userId  
        },
        include : [
          {
            model : Payment,
            attributes : ['id']
          }
        ]
      }) as OrderWithPayment | null;

      if (!order) {
        res.status(404).json({
          message: "Order not found",
        });
        return;
      }

      // if (order.orderStatus === OrderStatus.InTransit || order.orderStatus === OrderStatus.Preparation || order.orderStatus === OrderStatus.Delivered) {
      //   res.status(400).json({
      //     message: `Order cannot be deleted as it is already ${order.orderStatus}`,
      //   });
      //   return;
      // }

      // *or
      const nonDeletableStatuses = [
      OrderStatus.Preparation,
      OrderStatus.InTransit,
      OrderStatus.Delivered,
    ];

    if (nonDeletableStatuses.includes(order.orderStatus as OrderStatus)) {
      res.status(400).json({
        message: `Order cannot be deleted as it is already ${order.orderStatus}`,
      });
      return;
    }

      if (order.orderStatus === OrderStatus.Pending) {
         await OrderDetail.destroy({ where: { orderId: order.id } });
         if(order.Payment?.id){
            await Payment.destroy({ where: { id: order.Payment.id } });
         }
          await Order.destroy({ where: { id: orderId } });
      }

      res.status(200).json({
        message: "Order deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

export default new UserOrderController();
