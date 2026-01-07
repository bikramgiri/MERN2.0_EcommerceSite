import express, {Router} from 'express';
import catchAsyncError from '../../services/catchAsyncError';
import authMiddleware, { Role } from '../../middleware/authMiddleware';
import orderController from '../../controllers/user/order/orderController';
const router:Router = express.Router();

router.route('/order')
.post(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), orderController.createOrder)
.get(authMiddleware.isAuthenticated, catchAsyncError(orderController.fetchMyOrders));

router.route('/order/:id')
.get(authMiddleware.isAuthenticated, orderController.fetchOrderDetails)
.patch(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), orderController.cancelMyOrder)

router.route('/paymentverify')
.post(authMiddleware.isAuthenticated, catchAsyncError(orderController.paymentVerify));

export default router;