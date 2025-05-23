"use client";

import CartItemCard from "@/components/CartItemCard";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { useCartStore, useUserStore } from "@/lib/store";
import { OrderStatus } from "@/types/OrderStatus";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
const CheckoutPage = () => {
  const cartItems = useCartStore((state) => state.cart.items);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const handleDeleteMenuItem = (menuItemId: string) => {
    removeFromCart(menuItemId);
  };

  const toggleShowConfirmDialog = () => {
    setShowConfirmDialog(!showConfirmDialog);
  };

  const totalCartPrice = cartItems.reduce(
    (acc, item) => acc + item.itemTotalPrice,
    0
  );

  const createOrder = async () => {
    if (!user) {
      toast.error("Please login to create an order");
      return;
    }
    const res = await axiosInstance
      .post("/orders", {
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

  const handleConfirmOrder = async () => {
    const order = await createOrder();
    console.log(order);
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
        >
          Confirm Order
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
