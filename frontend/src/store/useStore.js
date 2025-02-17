import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const BASE_URL ="http://localhost:5000/api/v1"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  notifications:[],
  connectionRequests:[],
  recommendations:{},
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/auth/me`);
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post(`${BASE_URL}/auth/signup`, data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post(`${BASE_URL}/auth/login`, data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post(`${BASE_URL}/auth/logout`);
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },


  notificationsfn:async()=>{
    try {
        const res = await axiosInstance.get(`${BASE_URL}/notifications/`);
        set({ notifications: res.data });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  connectionRequestsfn:async()=>{
    try {
        const res = await axiosInstance.get(`${BASE_URL}/connections/requests`);
        set({ connectionRequests: res.data });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  suggestionsfn:async()=>{
    try {
        const res = await axiosInstance.get(`${BASE_URL}/users/suggestions`);

        set({ recommendations: res.data});
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  postfn:async()=>{
    try {
      const res = await axiosInstance.get(`${BASE_URL}/posts/`);
      set({ recommendations: res.data});
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
  }
  
}));

 