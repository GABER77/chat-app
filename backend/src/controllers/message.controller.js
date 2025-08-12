import uploadToCloudinary from '../middlewares/uploadToCloudinary.js';
import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js';
import catchAsync from '../utils/catchAsync.js';
import CustomError from '../utils/customError.js';
import { getReceiverSocketId, io } from '../utils/socket.js';

const sendMessage = catchAsync(async (req, res, next) => {
  const { receiver, text } = req.body;
  const sender = req.user._id;

  // Validate receiver
  if (!receiver) {
    throw new CustomError('Receiver is required', 400);
  }

  // Prevent sending message to self
  if (receiver.toString() === sender.toString()) {
    throw new CustomError("You can't send messages to yourself", 400);
  }

  // Find or create a chat between the two users
  let chat = await Chat.findOne({
    participants: { $all: [sender, receiver], $size: 2 },
    // $size: 2 >>> This guarantees it's a 1-on-1 chat, not a group chat
  });

  if (!chat) {
    chat = await Chat.create({ participants: [sender, receiver] });
  }

  // Attach chatId to req.body so it can be used in the folder path for cloudinary
  req.body.chatId = chat._id;

  // Upload image to Cloudinary after chatId is available
  await new Promise((resolve, reject) => {
    uploadToCloudinary({
      imageName: (req) => `image_${req.user.id}_${Date.now()}`,
      folderPath: (req) => `chatApp/chats/${req.body.chatId}`,
      fieldName: 'image',
    })(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  // Create the message
  const message = await Message.create({
    chatId: chat._id,
    sender,
    receiver,
    text,
    image: req.body.image,
    cloudinaryPath: req.body.cloudinaryPath,
  });

  // Update chat with last message
  chat.lastMessage = message._id;
  await chat.save();

  // >>>>>>>>>> Realtime Chat Updates >>>>>>>>>>
  // Check if user is online so we send him the message in realtime
  const receiverSocketId = getReceiverSocketId(receiver);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', message);
  }

  res.status(201).json({
    status: 'success',
    message,
  });
});

const getMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find({ chatId: req.params.chatId })
    .sort('createdAt')
    .populate('sender', 'name image')
    .populate('receiver', 'name image');

  res.status(200).json({
    status: 'success',
    results: messages.length,
    messages,
  });
});

const messageController = {
  sendMessage,
  getMessages,
};

export default messageController;
