import express, {Router} from 'express';
import AuthController from '../controllers/userController';
import catchAsyncError from '../services/CatchAsyncError';
const router:Router = express.Router();

router.route('/register')
.post(catchAsyncError(AuthController.registerUser));

router.route('/login')
.post(catchAsyncError(AuthController.loginUser));

export default router;