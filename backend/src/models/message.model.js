import mongoose from 'mongoose';
import CustomError from '../utils/customError.js';

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: [true, 'Message must belong to a chat'],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Message must have a sender'],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Message must have a receiver'],
    },
    text: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    cloudinaryPath: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt to the document
);

// Ensure message is not empty
messageSchema.pre('validate', function (next) {
  if (!this.text && !this.image) {
    return next(new CustomError('Message should not be empty', 400));
  }
  next();
});

const Message =
  mongoose.model.Message || mongoose.model('Message', messageSchema);

export default Message;
