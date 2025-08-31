import express from 'express';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { createBill, getAllBills } from '../controllers/billingController.js';

const router = express.Router();

//Google Auth Routes
router.post("/",verifyJWT, createBill);
router.get("/",verifyJWT,getAllBills)


export default router;