"use client";

import {
  useOrderStore,
  usePaymentStore,
  useRestaurantStore,
} from "@/lib/store";
import axiosInstance from "@/lib/axiosInstance";
import { BACKEND_BASE_URL } from "@/helpers";
import { useEffect } from "react";
import { OrderStatus } from "@/types/OrderStatus";
import OrdersCard from "@/components/OrdersCard";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const payments = usePaymentStore((state) => state.payments);
  const orders = useOrderStore((state) => state.orders);

  const setPayments = usePaymentStore((state) => state.setPayments);
  const setOrders = useOrderStore((state) => state.setOrders);

  const fetchOrders = async () => {
    const res = await axiosInstance.get(`${BACKEND_BASE_URL}/orders`);
    if (res.data.orders) {
      setOrders(res.data.orders);
    }
    if (res.data.payments) {
      setPayments(res.data.payments);
    }
  };
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const updatePaymentStatus = usePaymentStore(
    (state) => state.updatePaymentStatus
  );
  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const res = await axiosInstance.put(
      `${BACKEND_BASE_URL}/orders/${orderId}`,
      {
        status,
      }
    );
    if (res.data.order) {
      updateOrderStatus(orderId, status);
      toast.success("Order updated successfully");
    }
    if (res.data.payments) {
      updatePaymentStatus(orderId, status);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    handleStatusChange(orderId, OrderStatus.CANCELLED);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      {orders.map((order) => (
        <OrdersCard
          key={order._id}
          order={order}
          payments={payments}
          handleCancelOrder={handleCancelOrder}
        />
      ))}
    </div>
  );
};

export default OrdersPage;
