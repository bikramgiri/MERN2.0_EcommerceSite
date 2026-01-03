import express, {Router} from 'express';
import catchAsyncError from '../../services/catchAsyncError';
import authMiddleware, { Role } from '../../middleware/authMiddleware';
import cartController from '../../controllers/user/cart/cartController';
const router:Router = express.Router();

router.route('/cart')
.post(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), catchAsyncError(cartController.addToCart))
.get(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), catchAsyncError(cartController.getAllCartItems))

router.route('/cart/:id')
.get(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), catchAsyncError(cartController.getSingleCartItem))
.patch(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), catchAsyncError(cartController.updateCartItem))
.delete(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), catchAsyncError(cartController.deleteCartItem));

export default router;