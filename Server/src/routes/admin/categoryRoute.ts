import express, {Router} from 'express';
import catchAsyncError from '../../services/catchAsyncError';
import authMiddleware, { Role } from '../../middleware/authMiddleware';
import CategoryController from '../../controllers/admin/category/categoryController';
const router:Router = express.Router();

router.route('/category')
.post(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), CategoryController.addCategory)
.get(catchAsyncError(CategoryController.getAllCategories));

router.route('/category/:id')
.get(catchAsyncError(CategoryController.getSingleCategory))
.patch(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), catchAsyncError(CategoryController.updateCategory))
.delete(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), catchAsyncError(CategoryController.deleteCategory));

export default router;