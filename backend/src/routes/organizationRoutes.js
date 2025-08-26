import express from 'express';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { getStaffList } from '../controllers/organizationController.js';

const router = express.Router();

//Google Auth Routes
router.get("/staff-list",verifyJWT, getStaffList);



export default router;