import express, {Router} from 'express';
import catchAsyncError from '../../services/catchAsyncError';
import UserController from '../../controllers/user/userController';
import authMiddleware, { Role } from '../../middleware/authMiddleware';
const router:Router = express.Router();

router.route('/favorites')
.post(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), UserController.AddToFavorite)
.get(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), catchAsyncError(UserController.getFavoriteProducts));

router.route('/favorites/:id')
.delete(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), UserController.removeFromFavorites);

export default router;