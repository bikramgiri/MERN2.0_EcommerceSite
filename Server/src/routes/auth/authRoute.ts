import express, {Router} from 'express';
import AuthController from '../../controllers/auth/authController';
import catchAsyncError from '../../services/catchAsyncError';
const router:Router = express.Router();

router.route('/register').post(catchAsyncError(AuthController.registerUser));
router.route('/login').post(catchAsyncError(AuthController.loginUser));
router.route('/logout').post(catchAsyncError(AuthController.logoutUser));

export default router;