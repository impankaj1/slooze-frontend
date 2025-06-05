import { Order } from "@/types/OrderItem";

import OrderItemsCard from "./OrderItemsCard";
import { Payment } from "@/types/Payment";
import PaymentCard from "./PaymentCard";
import { Button } from "./ui/button";
import { ConfirmDialog } from "./ConfirmDialog";
import { useState } from "react";
import { OrderStatus } from "@/types/OrderStatus";

interface OrdersCardProps {
  order: Order;
  payments: Payment[];
  handleCancelOrder: (orderId: string) => void;
}

const OrdersCard = (props: OrdersCardProps) => {
  const { order, payments, handleCancelOrder } = props;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const toggleShowConfirmDialog = () => {
    setShowConfirmDialog(!showConfirmDialog);
  };

  const orderPayments = payments.filter(
    (payment) => payment.orderId === order._id
  );

  return (
    <div className="rounded-md py-4 px-2 w-full outline">
      <div className="flex justify-between">
        <h1 className="text-lg font-bold px-2">
          Ordered Items : {order.items.length}
        </h1>
        <ConfirmDialog
          title="Are you sure you want to cancel this order?"
          description="This action cannot be undone."
          onConfirm={() => handleCancelOrder(order._id)}
          onCancel={toggleShowConfirmDialog}
          open={showConfirmDialog}
          trigger={
            <Button
              variant="destructive"
              size="lg"
              className="font-bold"
              disabled={order.status === OrderStatus.CANCELLED}
            >
              Cancel Order
            </Button>
          }
        />
      </div>
      <h1 className="text-lg font-bold px-2 capitalize">
        Order Status: {order.status}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {order.items.map((item) => (
          <OrderItemsCard key={item.menuItem._id} item={item} />
        ))}
      </div>
      {orderPayments.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-bold px-2 mb-2">Payments:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {orderPayments.map((payment) => (
              <PaymentCard key={payment._id} payment={payment} />
            ))}
          </div>
        </div>
      )}

      <div className="text-xl font-bold flex justify-end">
        Total Price: {order.totalPrice}
      </div>
    </div>
  );
};

export default OrdersCard;
