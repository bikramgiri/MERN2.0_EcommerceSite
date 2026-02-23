import express, {Router} from 'express';
import catchAsyncError from '../../services/catchAsyncError';
import authMiddleware, { Role } from '../../middleware/authMiddleware';
import ProfileController from '../../controllers/admin/profile/profileController';
const router:Router = express.Router();

router.route('/profile')
.get(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), catchAsyncError(ProfileController.fetchMyProfile))
.patch(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), ProfileController.updateMyProfile)

router.route('/change-password')
.patch(authMiddleware.isAuthenticated, authMiddleware.authorizeRole(Role.Admin), ProfileController.updateMyPassword);

export default router;