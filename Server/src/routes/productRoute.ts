import express, {Router} from 'express';
import catchAsyncError from '../services/catchAsyncError';
import ProductController from '../controllers/productController';
import { upload } from '../middleware/multerMiddleware';
import authMiddleware, { Role } from '../middleware/authMiddleware';
const router:Router = express.Router();

router.route('/product')
.post(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), (upload.single('productImage')), ProductController.addProduct);

export default router;