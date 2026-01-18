// require('dotenv').config();
// or
import * as dotenv from 'dotenv';
dotenv.config();
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

const PORT = process.env.PORT
app.listen(PORT, () => {
  categoryController.seedCategory();
  console.log(`Server is running on port ${PORT}`);
});
