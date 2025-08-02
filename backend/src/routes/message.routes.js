import express from 'express';
import messageController from '../controllers/message.controller.js';
import protect from '../middlewares/protect.js';
import { uploadImageToBuffer } from '../middlewares/multerUpload.js';

const router = express.Router();

// Protect all routes that come after this middleware
router.use(protect);

// uploadToCloudinary is done inside the sendMessage so we have chatId
router.post('/', uploadImageToBuffer('image'), messageController.sendMessage);

router.get('/:chatId', messageController.getMessages);

export default router;
