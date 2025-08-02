import express from 'express';
import chatController from '../controllers/chat.controller.js';
import protect from '../middlewares/protect.js';

const router = express.Router();

// Protect all routes that come after this middleware
router.use(protect);

router.get('/', chatController.getUserChats);

export default router;
