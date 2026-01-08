import express, {Router} from 'express';
import catchAsyncError from '../../services/catchAsyncError';
import authMiddleware, { Role } from '../../middleware/authMiddleware';
import adminOrderController from '../../controllers/admin/order/adminOrderController';
const router:Router = express.Router();

router.route('/order')
.get(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), catchAsyncError(adminOrderController.getAllOrders))

router.route('/order/:id')
.get(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), catchAsyncError(adminOrderController.getSingleOrder))
.patch(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), adminOrderController.updateOrderStatus)
.delete(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), adminOrderController.deleteOrder)

router.route("/order/paymentstatus/:id")
.patch(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), catchAsyncError(adminOrderController.updatePaymentStatus))

export default router;