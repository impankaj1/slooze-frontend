"use client";

import CartItemCard from "@/components/CartItemCard";
import { Button } from "@/components/ui/button";
import { BACKEND_BASE_URL } from "@/helpers";
import axiosInstance from "@/lib/axiosInstance";
import {
  useCartStore,
  useOrderStore,
  usePaymentStore,
  useUserStore,
} from "@/lib/store";
import { Order } from "@/types/OrderItem";
import { OrderStatus } from "@/types/OrderStatus";
import { Payment } from "@/types/Payment";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
const CheckoutPage = () => {
  const cartItems = useCartStore((state) => state.cart.items);
  const totalCartPrice = useCartStore((state) => state.cart.totalPrice);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const setCart = useCartStore((state) => state.setCart);
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const handleDeleteMenuItem = (menuItemId: string) => {
    removeFromCart(menuItemId);
  };

  const toggleShowConfirmDialog = () => {
    setShowConfirmDialog(!showConfirmDialog);
  };

  const clearCart = async () => {
    const res = await axiosInstance.delete(`${BACKEND_BASE_URL}/cart`);
    if (res.status === 200) {
      setCart({ items: [], totalPrice: 0, userId: user?._id || "" });
    }
  };

  const createOrder = async (): Promise<{
    order: Order | null;
    payments: Payment[];
  }> => {
    if (!user) {
      toast.error("Please login to create an order");
      return { order: null, payments: [] };
    }
    const res: { order: Order; payments: Payment[] } = await axiosInstance
      .post(`${BACKEND_BASE_URL}/orders`, {
        items: cartItems,
        totalPrice: totalCartPrice,
        userId: user._id,
        status: OrderStatus.PENDING,
      })
      .then((res) => res.data)
      .catch((err) => {
        toast.error(err.response.data.message);
      });

    return res;
  };

  const orders = useOrderStore((state) => state.orders);
  const setOrders = useOrderStore((state) => state.setOrders);
  const setPayments = usePaymentStore((state) => state.setPayments);

  const handleConfirmOrder = async () => {
    const responseData = await createOrder();
    if (responseData.order) {
      setOrders([...orders, responseData.order]);
      clearCart();
    }
    if (responseData.payments) {
      setPayments(responseData.payments);
    }
    router.push("/orders");
  };
  return (
    <div className="relative h-[calc(100vh-8rem)] w-full ">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cartItems.map((item) => (
          <div key={item.menuItem._id}>
            <CartItemCard
              cartItem={item}
              handleDeleteMenuItem={handleDeleteMenuItem}
              toggleShowConfirmDialog={toggleShowConfirmDialog}
              showConfirmDialog={showConfirmDialog}
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 right-0 space-y-4   ">
        <div className="flex items-center gap-4">
          <p className="text-2xl font-bold">Total Price :</p>
          <p className="text-2xl font-bold">${totalCartPrice}</p>
        </div>
        <Button
          className="text-2xl font-bold py-4 px-8"
          disabled={cartItems.length === 0}
          onClick={handleConfirmOrder}
        >
          Confirm Order
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
