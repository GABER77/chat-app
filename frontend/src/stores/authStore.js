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
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
