import Message from '../models/message.model.js';
import catchAsync from '../utils/catchAsync.js';
import CustomError from '../utils/customError.js';

const sendMessage = catchAsync(async (req, res, next) => {
  const { chatId, receiver, text, image } = req.body;

  if (!chatId || !receiver) {
    throw new CustomError('chatId and receiver are required', 400);
  }

  const message = await Message.create({
    chatId,
    sender: req.user.id, // assuming protect middleware attaches user
    receiver,
    text,
    image,
  });

  res.status(201).json({
    status: 'success',
    data: {
      message,
    },
  });
});

const getMessagesByChat = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;

  const messages = await Message.find({ chatId })
    .populate('sender', 'name image')
    .populate('receiver', 'name image');

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      messages,
    },
  });
});

export default {
  sendMessage,
  getMessagesByChat,
};
