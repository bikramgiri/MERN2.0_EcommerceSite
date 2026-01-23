// require('dotenv').config();
// or
import * as dotenv from 'dotenv';
dotenv.config();
// dotenv.config({ path: '.env', override: true }); // override = true forces reload

// console.log("Loaded JWT_SECRET_KEY (first 10 chars):", 
//   process.env.JWT_SECRET_KEY?.substring(0, 10) || "SECRET MISSING!!!");

  // MUST BE THE VERY FIRST LINES — before ANY import
// import * as dotenv from 'dotenv';
// import path from 'path';

// // Try multiple loading strategies
// dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });
// dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

// // Debug what is ACTUALLY loaded
// console.log("──────────────────────────────────────────────");
// console.log("CURRENT WORKING DIRECTORY:", process.cwd());
// console.log("EXPECTED .env PATH:", path.resolve(process.cwd(), '.env'));
// console.log("LOADED JWT_SECRET_KEY (first 10 chars):", 
//   process.env.JWT_SECRET_KEY?.substring(0, 10) || "SECRET IS MISSING OR EMPTY!!!");
// console.log("LOADED JWT_SECRET_KEY length:", process.env.JWT_SECRET_KEY?.length || 0);
// console.log("──────────────────────────────────────────────");

import express, {Application} from 'express';
// import './cloudinary/index' // (Optional)
const app:Application = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser());

// *Database connection
import './database/connection';

// *Admin Seeder
import adminSeeder from './adminSeeder';
adminSeeder();

//*Routes
import authRoute from './routes/auth/authRoute';
import productRoute from './routes/admin/productRoute';
import categoryRoute from './routes/admin/categoryRoute';
import cartRoute from './routes/user/cartRoute';
import userOrderRoute from './routes/user/userOrderRoute';
import adminOrderRoute from './routes/admin/adminOrderRoute';
import userRoute from './routes/user/userRoute';
import categoryController from './controllers/admin/category/categoryController';

// *Give access to storage folder images
app.use("/src/storage", express.static("storage")); // Serve static files from the storage directory
// *Or
// *Give access to images in storage folder
// app.use(express.static('storage'))

app.use('/auth', authRoute);
app.use('/admin', productRoute);
app.use('/admin', categoryRoute);
app.use('/admin', adminOrderRoute);
app.use('/user', cartRoute);
app.use('/user', userOrderRoute);
app.use('/user', userRoute);

const PORT = process.env.PORT
app.listen(PORT, () => {
  categoryController.seedCategory();
  console.log(`Server is running on port ${PORT}`);
});
