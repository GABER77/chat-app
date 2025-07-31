import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

// Public Routes (No Authentication Required)
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

export default router;
