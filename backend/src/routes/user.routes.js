import express from 'express';
import userController from '../controllers/user.controller.js';
import { uploadImageToBuffer } from '../middlewares/upload.middleware.js';
import resizeUserPhoto from '../middlewares/imageProcessor.middleware.js';
import protect from '../middlewares/protect.middleware.js';

const router = express.Router();

// Protect all routes that come after this middleware
router.use(protect);

router.get('/me', userController.getMe);

router.patch(
  '/update-me',
  uploadImageToBuffer,
  resizeUserPhoto,
  userController.updateMe
);

export default router;
