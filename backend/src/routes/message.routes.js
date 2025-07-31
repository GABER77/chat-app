import express from 'express';
import messageController from '../controllers/message.controller.js';
import protect from '../middlewares/protect.middleware.js';

const router = express.Router();

// Protect all routes that come after this middleware
router.use(protect);

router.post('/', messageController.sendMessage);

router.get('/:chatId', messageController.getMessagesByChat);

export default router;
