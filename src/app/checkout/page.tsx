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
import { CartItem } from "@/types/CartItem";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const cart = useCartStore((state) => state.cart);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const setCart = useCartStore((state) => state.setCart);
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const totalCartPrice = Array.isArray(cart)
    ? cart.reduce((prev, curr) => prev + curr.totalPrice, 0)
    : cart.totalPrice;

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
      if (Array.isArray(cart)) {
        setCart([]);
      } else {
        setCart([]);
      }
    }
  };

  const createOrder = async (): Promise<
    | {
        order: Order | null;
        payments: Payment[];
      }
    | undefined
  > => {
    if (!user) {
      toast.error("Please login to create an order");
      return { order: null, payments: [] };
    }

    const cartItems = Array.isArray(cart)
      ? cart.flatMap((c) =>
          c.items.map((item) => ({
            ...item,
            country: c.country,
          }))
        )
      : cart.items.map((item) => ({
          ...item,
          country: cart.country,
        }));

    if (!cartItems.length) {
      toast.error("Cannot place order for empty cart");
      return;
    }

    const res: { order: Order; payments: Payment[] } = await axiosInstance
      .post(`${BACKEND_BASE_URL}/orders`, {
        items: cartItems,
        totalPrice: totalCartPrice,
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
    if (responseData && responseData.order) {
      setOrders([...orders, responseData.order]);
      clearCart();
    }
    if (responseData && responseData.payments) {
      setPayments(responseData.payments);
    }
    router.push("/orders");
  };

  const renderCartItems = (items: CartItem[], country: string) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Items for {country}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
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
    </div>
  );

  return (
    <div className="relative h-[calc(100vh-8rem)] w-full">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="space-y-8">
        {Array.isArray(cart)
          ? cart.map((singleCart) => (
              <div key={singleCart.country}>
                {renderCartItems(singleCart.items, singleCart.country)}
              </div>
            ))
          : renderCartItems(cart.items, cart.country)}
      </div>
      <div className="absolute bottom-0 right-0 space-y-4">
        <div className="flex items-center gap-4">
          <p className="text-2xl font-bold">Total Price :</p>
          <p className="text-2xl font-bold">${totalCartPrice}</p>
        </div>
        <Button
          className="text-2xl font-bold py-4 px-8"
          disabled={
            Array.isArray(cart)
              ? cart.every((c) => c.items.length === 0)
              : cart.items.length === 0
          }
          onClick={handleConfirmOrder}
        >
          Confirm Order
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
