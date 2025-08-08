import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const chatStore = create((set) => ({
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
}));
