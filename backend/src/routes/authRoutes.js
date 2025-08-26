import express from 'express';
import { currentUser, loginUser, logoutUser, registerUser } from '../controllers/authController.js';
import { googleLogin, googleCallback } from '../controllers/gAuthController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { validateLogin } from '../middlewares/inputValidator.js';
const router = express.Router();

//Google Auth Routes
router.get("/google/login", googleLogin);
router.get("/google/callback", googleCallback);


//Auth
router.post('/',registerUser);
router.post('/login',validateLogin, loginUser);
router.post('/logout',verifyJWT, logoutUser);
router.get('/currentuser',verifyJWT,currentUser);


export default router;