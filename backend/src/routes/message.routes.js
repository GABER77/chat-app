import express from 'express';
import messageController from '../controllers/message.controller.js';
import protect from '../middlewares/protect.middleware.js';
import { uploadImageToBuffer } from '../middlewares/upload.middleware.js';
import uploadImageToCloudinary from '../middlewares/imageProcessor.middleware.js';

const router = express.Router();

// Protect all routes that come after this middleware
router.use(protect);

// uploadImageToCloudinary is done inside the sendMessage so we have chatId
router.post('/', uploadImageToBuffer('image'), messageController.sendMessage);

router.get('/:chatId', messageController.getMessages);

export default router;
