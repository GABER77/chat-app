import Chat from '../models/chat.model.js';
import catchAsync from '../utils/catchAsync.js';

const getUserChats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const chats = await Chat.find({ participants: userId })
    .populate('participants', 'name image')
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: 'name' },
      // To show "You:" or "Ali:", you need to know who sent the last message
    })
    .sort('-updatedAt');

  res.status(200).json({
    status: 'success',
    results: chats.length,
    chats,
  });
});

const chatController = {
  getUserChats,
};

export default chatController;
