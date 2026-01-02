import express, {Router} from 'express';
import catchAsyncError from '../services/catchAsyncError';
import authMiddleware, { Role } from '../middleware/authMiddleware';
import categoryController from '../controllers/categoryController';
const router:Router = express.Router();

router.route('/category')
.post(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), categoryController.addCategory)
.get(catchAsyncError(categoryController.getAllCategories));

router.route('/category/:id')
.get(catchAsyncError(categoryController.getSingleCategory))
.patch(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), catchAsyncError(categoryController.updateCategory))
.delete(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), catchAsyncError(categoryController.deleteCategory));

export default router;