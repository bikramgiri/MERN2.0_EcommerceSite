import express, {Router} from 'express';
import catchAsyncError from '../../services/catchAsyncError';
import authMiddleware, { Role } from '../../middleware/authMiddleware';
import userOrderController from '../../controllers/user/order/userOrderController';
const router:Router = express.Router();

router.route('/order')
.post(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), userOrderController.createOrder)
.get(authMiddleware.isAuthenticated, catchAsyncError(userOrderController.fetchMyOrders));

router.route('/order/:id')
.patch(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), userOrderController.updateOrder)
.get(authMiddleware.isAuthenticated, userOrderController.fetchOrderDetails)
.delete(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), userOrderController.deleteMyOrder);

router.route('/order/cancel/:id')
.patch(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), userOrderController.cancelMyOrder)

router.route('/paymentverify')
.post(authMiddleware.isAuthenticated, catchAsyncError(userOrderController.paymentVerify));

export default router;