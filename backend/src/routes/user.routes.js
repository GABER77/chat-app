import express from 'express';
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';

const router = express.Router();

// Protect all routes that come after this middleware
router.use(authController.protect);

router.patch('/update-me', userController.updateMe);

export default router;
