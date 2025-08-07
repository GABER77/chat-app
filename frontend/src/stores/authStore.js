import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const authStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLogingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/me");
      set({ authUser: res.data.data.user });
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
      // No Catch because the calling component will catch the error
    } finally {
      set({ isLogingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
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
}));
