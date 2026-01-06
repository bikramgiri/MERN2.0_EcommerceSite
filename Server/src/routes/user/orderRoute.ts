import express, {Router} from 'express';
import catchAsyncError from '../../services/catchAsyncError';
import authMiddleware, { Role } from '../../middleware/authMiddleware';
import orderController from '../../controllers/user/order/orderController';
const router:Router = express.Router();

router.route('/order')
.post(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), orderController.createOrder)

router.route('/verifypidx')
.post(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), orderController.verifyPidx);

export default router;