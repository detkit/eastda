import express from 'express';
import {
	google,
	login,
	register,
	signOut,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', google);
router.get('/signout', signOut);

export default router;
