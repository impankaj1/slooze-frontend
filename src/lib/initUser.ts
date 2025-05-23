import { BACKEND_BASE_URL } from "@/helpers";
import axiosInstance from "@/lib/axiosInstance";
import { useCartStore, useUserStore } from "./store";
import { toast } from "react-toastify";

export const initUser = async () => {
  try {
    const response = await axiosInstance.get(`${BACKEND_BASE_URL}/auth/me`);
    if (response.status === 200) {
      useUserStore.getState().setUser(response.data);
      useCartStore.getState().setCart(response.data.cart);
    }
  } catch (error) {
    toast.error("Failed to fetch user");
  }
};
