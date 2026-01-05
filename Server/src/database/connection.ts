import { Sequelize } from "sequelize-typescript";
import User from "../models/userModel";
import Product from "../models/productModel";
import Category from "../models/categoryModel";
import Cart from "../models/cartModel";
import Order from "../models/orderModel";
import OrderDetail from "../models/orderDetailsModel";
import Payment from "../models/paymentModel";

const sequelize = new Sequelize({
  database: process.env.DB_NAME as string,
  dialect: process.env.DB_DIALECT as any,
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  dialectOptions: {
    connectTimeout: 60000, // Force IPv4 (helps with some Windows loopback bugs)
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000, // time to acquire connection
    idle: 10000,
    evict: 1000, // time after which idle connections are evicted
  },
  models: [__dirname + "/../models"],
  logging: false, // Disable logging; default: console.log
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

sequelize
  .sync({ force: false, alter: false })
  .then(() => {
    console.log("Models synced successfully!");
  })
  .catch((err) => {
    console.error("Sync failed:", err);
  });

// *Relationships between models
// User.hasMany(Product)
// Product.belongsTo(User)
// or
User.hasMany(Product, { foreignKey: "userId" });
Product.belongsTo(User, { foreignKey: "userId" });

Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Product, { foreignKey: "categoryId" });

Cart.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Cart, { foreignKey: "productId" });

Cart.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Cart, { foreignKey: "userId" });

// orderDetails and order  relationship
OrderDetail.belongsTo(Order, { foreignKey: "orderId" });
Order.hasMany(OrderDetail, { foreignKey: "orderId" });

// orderDetails and product relationship
OrderDetail.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(OrderDetail, { foreignKey: "productId" });

// Order and payment relationship (hasOne: one-to-one and hasMany: one-to-many)
Order.belongsTo(Payment, { foreignKey: "paymentId" });
Payment.hasOne(Order, { foreignKey: "paymentId" });

export default sequelize;
