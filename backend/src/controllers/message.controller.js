import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import catchAsync from '../utils/catchAsync.js';

// POST /api/messages - Send a message and create chat if needed
const sendMessage = catchAsync(async (req, res, next) => {
  const { receiver, text, image } = req.body;
  const sender = req.user._id;

  if (receiver.toString() === sender.toString()) {
    return next(new CustomError("You can't send messages to yourself", 400));
  }

  // Find or create a chat between the two users
  let chat = await Chat.findOne({
    participants: { $all: [sender, receiver], $size: 2 },
    // $size: 2 >>> This guarantees it's a 1-on-1 chat, not a group chat
  });

  if (!chat) {
    chat = await Chat.create({ participants: [sender, receiver] });
  }

  // Create the message
  const message = await Message.create({
    chatId: chat._id,
    sender,
    receiver,
    text,
    image,
  });

  // Update chat with last message
  chat.lastMessage = message._id;
  await chat.save();

  res.status(201).json({
    status: 'success',
    message,
  });
});

// GET /api/messages/:chatId - Get all messages in a chat
const getMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find({ chatId: req.params.chatId })
    .sort('createdAt')
    .populate('sender', 'name image')
    .populate('receiver', 'name image');

  res.status(200).json({
    status: 'success',
    messages,
  });
});

const messageController = {
  sendMessage,
  getMessages,
};

export default messageController;
