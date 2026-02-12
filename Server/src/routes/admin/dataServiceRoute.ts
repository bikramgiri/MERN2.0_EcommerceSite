import express, {Router} from 'express';
import catchAsyncError from '../../services/catchAsyncError';
import authMiddleware, { Role } from '../../middleware/authMiddleware';
import dataService from '../../controllers/admin/misc/dataService';

const router:Router = express.Router();

router.route('/datas').get( dataService.getDatas)

export default router;