import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import io from "socket.io-client";

export const authStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/me");
      set({ authUser: res.data.data.user });
      get().connectSocket(); // Connect to socket.io
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (userData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", userData);
      set({ authUser: res.data.data.user });
      get().connectSocket(); // Connect to socket.io
      // No Catch because the calling component will catch the error
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (userData) => {
    set({ isLogingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", userData);
      set({ authUser: res.data.data.user });
      get().connectSocket(); // Connect to socket.io
      // No Catch because the calling component will catch the error
    } finally {
      set({ isLogingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      get().disconnectSocket(); // Disconnect socket when logging out
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.data.message);
    }
  },

  updateProfile: async (userData) => {
    set({ isUpdatingProfile: true });
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);

      // Only append profileImage if the user selected one
      if (userData.profileImage) {
        formData.append("profileImage", userData.profileImage);
      }

      const res = await axiosInstance.patch("/users/update-me", formData);
      set({ authUser: res.data.data.updatedUser });

      // No Catch because the calling component will catch the error
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // >>>>>>>>>> SOCKET.IO CONNECTION >>>>>>>>>>
  connectSocket: () => {
    const { socket, authUser } = get();

    // Only connect if the user is authenticated and no socket connection exists
    if (!authUser || socket?.connected) return;

    // Create new socket that will try to connect to the backend
    const newSocket = io("http://localhost:3000", {
      query: { userId: authUser._id },
      withCredentials: true, // Enable cookies
    });

    // Save the socket instance
    set({ socket: newSocket });

    // when backend send an updated list of online users,
    // use it to update `onlineUsers` locally
    newSocket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect(); // Close the WebSocket connection
      set({ socket: null }); // Remove socket reference from store
    }
  },
}));
