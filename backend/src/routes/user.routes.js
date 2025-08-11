import express from 'express';
import userController from '../controllers/user.controller.js';
import { uploadImageToBuffer } from '../middlewares/multerUpload.js';
import uploadToCloudinary from '../middlewares/uploadToCloudinary.js';
import protect from '../middlewares/protect.js';

const router = express.Router();

// Protect all routes that come after this middleware
router.use(protect);

router.get('/me', userController.getMe);

router.get('/search', userController.searchUsers);

router.patch(
  '/update-me',
  uploadImageToBuffer('profileImage'),
  uploadToCloudinary({
    imageName: (req) => `profileImage_${req.user.id}`,
    folderPath: (req) => `chatApp/users/${req.user.id}`,
    fieldName: 'profileImage',
  }),
  userController.updateMe
);

export default router;
