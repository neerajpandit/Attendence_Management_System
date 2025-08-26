import express from 'express';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { getOrganizationList } from '../controllers/superAdminController.js';
const router = express.Router();

//Google Auth Routes
router.get("/organization-list", getOrganizationList);



export default router;