import express, {Router} from 'express';
import catchAsyncError from '../../services/catchAsyncError';
import ProductController from '../../controllers/admin/product/productController';
import { upload } from '../../middleware/multerMiddleware';
import authMiddleware, { Role } from '../../middleware/authMiddleware';
const router:Router = express.Router();

router.route('/product')
.post(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), (upload.single('productImage')), catchAsyncError(ProductController.addProduct))
.get(catchAsyncError(ProductController.getAllProducts));

router.route('/product/:id')
.get(catchAsyncError(ProductController.getSingleProduct))
.patch(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), (upload.single('productImage')), catchAsyncError(ProductController.updateProduct))
.delete(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), catchAsyncError(ProductController.deleteProduct));

router.route('/productorder/:id')
.get(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), ProductController.fetchProductOrders)

router.route('/product/productstockqty/:id')
.patch(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), catchAsyncError(ProductController.updateProductStockQty));

export default router;