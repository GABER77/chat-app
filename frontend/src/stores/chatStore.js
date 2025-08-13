import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";
import { authStore } from "./authStore";

export const chatStore = create((set, get) => ({
  chats: [],
  messages: [],
  searchResults: [],
  selectedChat: null,
  isChatsLoading: false,
  isMessagesLoading: false,
  isSearching: false,

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
    const { messages, chats, getChats } = get();
    try {
      const formData = new FormData();
      formData.append("receiver", receiverId);
      if (text?.trim()) formData.append("text", text);
      if (image) formData.append("image", image);

      const res = await axiosInstance.post(`/messages`, formData);
      set({ messages: [...messages, res.data.data.message] });

      // Refresh chats so the sidebar updates with the new chat
      const chatExists = chats.some((chat) =>
        chat.participants.some((p) => p._id === receiverId)
      );

      if (!chatExists) {
        await getChats();
      }
    } catch (error) {
      toast.error(`Failed to send message: ${error.message}`);
    }
  },

  searchUsers: async (searchText) => {
    if (!searchText.trim()) {
      set({ searchResults: [] });
      return;
    }

    set({ isSearching: true });
    try {
      const res = await axiosInstance.get(`/users/search`, {
        params: { searchText },
      });
      set({ searchResults: res.data.data.users || [] });
    } catch {
      toast.error("Failed to search users");
    } finally {
      set({ isSearching: false });
    }
  },

  setSelectedChat: (selectedChat) => set({ selectedChat }),

  // >>>>>>>>>> Realtime Chat Updates >>>>>>>>>>

  subscribeToMessages: () => {
    // No chat selected, no need to listen for messages
    const { selectedChat } = get();
    if (!selectedChat) return;

    const socket = authStore.getState().socket;
    if (!socket) return; // Socket connection not created yet

    socket.off("newMessage"); // Remove previous listeners to avoid duplicates

    // Listen for incoming 'newMessage' events
    socket.on("newMessage", (newMessage) => {
      // Check if the message belongs to the currently selected chat
      if (newMessage.chatId !== selectedChat._id) return;

      // Update the messages array by adding the new message
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = authStore.getState().socket;
    if (!socket) return; // If no socket, nothing to unsubscribe from
    // Remove the 'newMessage' event listener to stop receiving new messages
    socket.off("newMessage");
  },
}));
