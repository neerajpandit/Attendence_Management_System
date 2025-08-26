import express from 'express';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { createPlan,getPlans,getPlanById } from '../controllers/planController.js';


const router = express.Router();

//Google Auth Routes
router.post("/",verifyJWT, createPlan);
router.get("/",verifyJWT,getPlans)


export default router;