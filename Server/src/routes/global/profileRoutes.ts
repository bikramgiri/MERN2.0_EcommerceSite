import express, {Router} from 'express';
import catchAsyncError from '../../services/catchAsyncError';
import authMiddleware, { Role } from '../../middleware/authMiddleware';
import ProfileController from '../../controllers/global/profileController';
const router:Router = express.Router();

router.route('/profile')
.get(authMiddleware.isAuthenticated, catchAsyncError(ProfileController.fetchMyProfile))
.patch(authMiddleware.isAuthenticated, ProfileController.updateMyProfile)

router.route('/change-password')
.patch(authMiddleware.isAuthenticated, ProfileController.updateMyPassword);

export default router;