import express, {Router} from 'express';
import catchAsyncError from '../../services/catchAsyncError';
import authMiddleware, { Role } from '../../middleware/authMiddleware';
import AdminReviewController from '../../controllers/admin/review/adminReviewController';

const router:Router = express.Router();

router.route('/review')
.get(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), catchAsyncError(AdminReviewController.getAllReviews));

export default router;