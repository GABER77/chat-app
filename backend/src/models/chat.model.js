import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message', // Refers to the most recent message in the chat
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt to the document
);

const Chat = mongoose.model.Chat || mongoose.model('Chat', chatSchema);

export default Chat;
