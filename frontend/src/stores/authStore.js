import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

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
    } catch (error) {
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
    } catch (error) {
      throw error; // So the component can catch and show error message
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
