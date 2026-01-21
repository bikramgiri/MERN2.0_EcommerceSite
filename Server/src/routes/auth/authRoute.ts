import express, {Router} from 'express';
import AuthController from '../../controllers/auth/authController';
import catchAsyncError from '../../services/catchAsyncError';
const router:Router = express.Router();

router.route('/register').post(catchAsyncError(AuthController.registerUser));
router.route('/login').post(catchAsyncError(AuthController.loginUser));
router.route('/logout').post(catchAsyncError(AuthController.logoutUser));

router.route("/forgotPassword").post(catchAsyncError(AuthController.forgotPassword));
// router.route("/verifyOtp/:id").post(catchError(verifyOtp))
// or
router.route("/verifyOTP").post(catchAsyncError(AuthController.verifyOtp));
// router.route("/changePassword/:id1/:id2").post(sanitizer,checkPasswordChange)
// or
// router.route("/changePassword/:email/:otp").post(catchAsyncError(AuthController.changePassword))
// or
router.route("/changePassword").post(catchAsyncError(AuthController.changePassword));

export default router;