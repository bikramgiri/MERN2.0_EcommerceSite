import express, {Router} from 'express';
import AuthController from '../../controllers/auth/authController';
import catchAsyncError from '../../services/catchAsyncError';
import googleAuth from '../../services/googleAuth';

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



// Google routes
router.get(
  "/google",
  googleAuth.passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  googleAuth.passport.authenticate("google", { 
    failureRedirect: "http://localhost:5173/login?error=google_login_failed" 
  }),
  googleAuth.googleAuthCallback // ← use the named export
);

export default router;