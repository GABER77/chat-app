import express from 'express';
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';

const router = express.Router();

// Public Routes (No Authentication Required)
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protect all routes that come after this middleware
router.use(authController.protect);

router.patch('/update-me', userController.updateMe);

export default router;
