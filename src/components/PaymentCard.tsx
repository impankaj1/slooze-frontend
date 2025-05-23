import { Payment } from "@/types/Payment";
import { useState } from "react";
import { Button } from "./ui/button";
import { PaymentEditDialog, PaymentFormValues } from "./PaymentEditDialog";
import axiosInstance from "@/lib/axiosInstance";
import { BACKEND_BASE_URL } from "@/helpers";
import { toast } from "react-toastify";
import { usePaymentStore, useUserStore } from "@/lib/store";
import { PaymentMethod } from "@/enums/PaymenyMethod";
import { Role } from "@/enums/Roles";
import { PaymentStatus } from "@/enums/PaymentStatus";
interface PaymentCardProps {
  payment: Payment;
}

const PaymentCard = (props: PaymentCardProps) => {
  const { payment } = props;
  const [isEditPaymentDialogOpen, setIsEditPaymentDialogOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-CA");
  };
  const getPaymentMethod = (status: string) => {
    return status.replace("_", " ");
  };

  const paymentMethodUpdate = async (values: PaymentFormValues) => {
    const res = await axiosInstance.put(
      `${BACKEND_BASE_URL}/payments/${payment._id}`,
      values
    );
    return res;
  };
  const updatePaymentMethod = usePaymentStore(
    (state) => state.updatePaymentMethod
  );
  const handlePaymentUpdate = async (
    values: PaymentFormValues,
    resetForm: () => void
  ) => {
    const response = await paymentMethodUpdate(values);

    if (response.status === 200) {
      toast.success("Payment method updated successfully");
      setIsEditPaymentDialogOpen(false);
      resetForm();
      updatePaymentMethod(
        payment._id,
        response.data.payment.paymentMethod as PaymentMethod
      );
    } else {
      toast.error("Failed to update payment method");
    }
  };

  return (
    <div className="border-2 border-gray-300 m-2 shadow-md rounded-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">Payment</h1>
        {user && user?.role === Role.ADMIN && (
          <Button
            onClick={() => setIsEditPaymentDialogOpen(true)}
            disabled={
              payment.status === PaymentStatus.COMPLETED ||
              payment.status === PaymentStatus.CANCELLED
            }
          >
            Edit
          </Button>
        )}
      </div>

      <p className="text-sm text-gray-500">Amount: {payment.amount}</p>
      <p className="text-sm text-gray-500">
        Date: {formatDate(payment.createdAt)}
      </p>
      <p className="text-sm text-gray-500 capitalize">
        Status: {payment.status}
      </p>
      <p className="text-sm text-gray-500 capitalize">
        Payment Method: {getPaymentMethod(payment.paymentMethod)}
      </p>
      <PaymentEditDialog
        isAddPaymentDialogOpen={isEditPaymentDialogOpen}
        setIsAddPaymentDialogOpen={setIsEditPaymentDialogOpen}
        payment={payment}
        handlePaymentUpdate={handlePaymentUpdate}
      />
    </div>
  );
};

export default PaymentCard;
