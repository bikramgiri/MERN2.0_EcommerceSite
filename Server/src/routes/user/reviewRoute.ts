import express, {Router} from 'express';
import catchAsyncError from '../../services/catchAsyncError';
import authMiddleware, { Role } from '../../middleware/authMiddleware';
import ReviewController from '../../controllers/user/review/reviewController';
import { upload } from '../../middleware/multerMiddleware';
import { cloudinaryUpload } from '../../cloudinary';

const router:Router = express.Router();

router.route('/review/:id')
.post(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), upload.single('reviewImage'), cloudinaryUpload, ReviewController.addReview)
.get(catchAsyncError(ReviewController.getProductReviews))
.patch(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), upload.single('reviewImage'), cloudinaryUpload, ReviewController.editReview)
.delete(authMiddleware.isAuthenticated, ReviewController.deleteReview);

router.route('/review')
.get(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Customer), catchAsyncError(ReviewController.getUserReviews));

export default router;