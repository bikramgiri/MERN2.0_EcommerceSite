// require('dotenv').config();
// or
import * as dotenv from 'dotenv';
dotenv.config();
import express, {Application} from 'express';
const app:Application = express();
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

// *Database connection
import './database/connection';

// *Admin Seeder
import adminSeeder from './adminSeeder';
adminSeeder();

// Google Login
import session from 'express-session';
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
  }
}));
import googleAuth from './services/googleAuth';
app.use(googleAuth.passport.initialize());
app.use(googleAuth.passport.session());

//*Routes
import authRoute from './routes/auth/authRoute';
import productRoute from './routes/admin/productRoute';
import categoryRoute from './routes/admin/categoryRoute';
import cartRoute from './routes/user/cartRoute';
import userOrderRoute from './routes/user/userOrderRoute';
import adminOrderRoute from './routes/admin/adminOrderRoute';
import userRoute from './routes/user/favoriteRoute';
import categoryController from './controllers/admin/category/categoryController';
import dataServiceRoute from './routes/admin/dataServiceRoute';
import adminUserRoutes from './routes/admin/adminUserRoutes';
import profileRoutes from './routes/global/profileRoutes';
import adminReviewRoutes from './routes/admin/adminReviewRoute';
import reviewRoutes from './routes/user/reviewRoute';

// *Give access to storage folder images
app.use("/src/storage", express.static("storage")); // Serve static files from the storage directory
// *Or
// *Give access to images in storage folder
// app.use(express.static('storage'))

app.use('/auth', authRoute);
app.use('/admin', productRoute);
app.use('/admin', categoryRoute);
app.use('/admin', adminOrderRoute);
app.use('/admin', dataServiceRoute);
app.use('/admin', adminUserRoutes);
app.use('/admin', adminReviewRoutes);
app.use('/', profileRoutes);
app.use('/user', cartRoute);
app.use('/user', userOrderRoute);
app.use('/user', userRoute);
app.use('/user', reviewRoutes);

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  categoryController.seedCategory();
  console.log(`Server is running on port ${PORT}`);
});


// Socket.IO Setup
import { Server } from 'socket.io';
import User from './models/userModel';
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5174', 'http://localhost:5173'],
  },
});

let onlineUsers:any = [];
const addToOnlineUsers = ( socketId:string, userId:string, role:string) => {
  onlineUsers = onlineUsers.filter((user:any) => user.userId !== userId);
  onlineUsers.push({socketId, userId, role});
};

io.on('connection', async(socket) => {
  console.log('A user connected');
  const {token} = socket.handshake.auth;
  
  if (token) {
    // @ts-ignore
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY as string)
    // @ts-ignore
    const userExists = await User.findByPk(decoded.id);
    if (userExists) {
      addToOnlineUsers( socket.id, userExists.id, userExists.role);
    }
  }

  // *Update OrderStatus
  socket.on("orderStatusUpdated", ({orderId, status, userId}) => {
    const findUser = onlineUsers.find((user:any) => user.userId == userId);
    if(findUser){
      io.to(findUser.socketId).emit("orderStatusChanged", {orderId, status});
    }
  });

  // *Update PaymentStatus
  socket.on("paymentStatusUpdated", ({orderId, status, userId}) => {
    const findUser = onlineUsers.find((user:any) => user.userId == userId);
    if(findUser){
      io.to(findUser.socketId).emit("paymentStatusChanged", {orderId, status});
    }
  });

  // *Update Product Stock Qty
  socket.on("productStockUpdated", ({ productId, newStockQty }) => {
  // Broadcast to ALL connected clients
  io.emit("productStockChanged", { productId, newStockQty });
});
    
});
