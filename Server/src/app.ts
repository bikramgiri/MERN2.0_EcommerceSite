// require('dotenv').config();
// or
import * as dotenv from 'dotenv';
dotenv.config();
// import 'reflect-metadata';
import express, {Application, Request, Response} from 'express';
const app:Application = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// *Database connection
import './database/connection';

// *Admin Seeder
import adminSeeder from './adminSeeder';
adminSeeder();

//*Routes
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import categoryController from './controllers/categoryController';

// *Give access to storage folder images
app.use("/src/storage", express.static("storage")); // Serve static files from the storage directory
// or
// give access to images in storage folder
// app.use(express.static('storage'))

app.use('/auth', userRoute);
app.use('/admin', productRoute);

const PORT = process.env.PORT
app.listen(PORT, () => {
  categoryController.seedCategory();
  console.log(`Server is running on port ${PORT}`);
});
