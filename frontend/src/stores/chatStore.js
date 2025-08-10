import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const chatStore = create((set, get) => ({
  chats: [],
  messages: [],
  selectedChat: null,
  isChatsLoading: false,
  isMessagesLoading: false,

  getChats: async () => {
    set({ isChatsLoading: true });
    try {
      const res = await axiosInstance.get("/chats");
      set({ chats: res.data.data.chats });
      // No Catch because the calling component will catch the error
    } finally {
      set({ isChatsLoading: false });
    }
  },

  getMessages: async (chatId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${chatId}`);
      set({ messages: res.data.data.messages });
      // No Catch because the calling component will catch the error
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async ({ receiverId, text, image }) => {
    const { messages } = get();
    try {
      const formData = new FormData();
      formData.append("receiver", receiverId);
      if (text?.trim()) formData.append("text", text);
      if (image) formData.append("image", image);

      const res = await axiosInstance.post(`/messages`, formData);
      set({ messages: [...messages, res.data.data.message] });
    } catch (error) {
      toast.error(`Failed to send message: ${error.message}`);
    }
  },

  setSelectedChat: (selectedChat) => set({ selectedChat }),
}));
