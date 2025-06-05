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
import { Order } from "@/types/OrderItem";
import { Separator } from "@/components/ui/separator";

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

  const ordersByCountry = orders.reduce((acc, order) => {
    const country = order.country || "Unknown";
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      <div className="space-y-8">
        {Object.entries(ordersByCountry).map(
          ([country, countryOrders], index) => (
            <div key={country}>
              <h2 className="text-xl font-semibold mb-4">
                Orders for {country}
              </h2>
              <div className="space-y-4">
                {countryOrders.map((order) => (
                  <OrdersCard
                    key={order._id}
                    order={order}
                    payments={payments}
                    handleCancelOrder={handleCancelOrder}
                  />
                ))}
              </div>
              {index < Object.keys(ordersByCountry).length - 1 && (
                <Separator className="my-6" />
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
