import express, {Router} from 'express';
import catchAsyncError from '../../services/catchAsyncError';
import authMiddleware, { Role } from '../../middleware/authMiddleware';
import UserController from '../../controllers/admin/user/userController';

const router:Router = express.Router();

router.route('/users')
.get(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), catchAsyncError(UserController.fetchAllUsers))

router.route('/users/:id')
.delete(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), catchAsyncError(UserController.deleteUser))

export default router;