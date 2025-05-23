"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormLabel,
  FormMessage,
  FormItem,
  FormControl,
  FormField,
} from "./ui/form";
import { Loader2 } from "lucide-react";
import { PaymentMethod } from "@/enums/PaymenyMethod";
import { Payment } from "@/types/Payment";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "./ui/select";

const formSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod),
});

export type PaymentFormValues = z.infer<typeof formSchema>;

interface PaymentEditDialogProps {
  isAddPaymentDialogOpen: boolean;
  setIsAddPaymentDialogOpen: (isOpen: boolean) => void;
  handlePaymentUpdate?: (
    values: PaymentFormValues,
    resetForm: () => void
  ) => void;
  payment?: Payment;
}

export function PaymentEditDialog(props: PaymentEditDialogProps) {
  const {
    handlePaymentUpdate,
    isAddPaymentDialogOpen,
    setIsAddPaymentDialogOpen,
    payment,
  } = props;

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: payment?.paymentMethod as PaymentMethod,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    if (payment) {
      handlePaymentUpdate?.(values, form.reset);
    }

    setIsLoading(false);
  };

  return (
    <Dialog
      open={isAddPaymentDialogOpen}
      onOpenChange={setIsAddPaymentDialogOpen}
    >
      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
          <DialogDescription>
            Update the payment method for the order
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="overflow-y-auto    text-white space-y-8"
          >
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="text-foreground w-full ">
                  <FormLabel className="text-foreground w-full">
                    Payment Method
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="text-foreground w-full">
                        <SelectValue
                          className="text-foreground"
                          placeholder="Select a role"
                        />
                      </SelectTrigger>
                      <SelectContent className="text-foreground">
                        <SelectItem value={PaymentMethod.CREDIT_CARD}>
                          Credit Card
                        </SelectItem>
                        <SelectItem value={PaymentMethod.DEBIT_CARD}>
                          Debit Card
                        </SelectItem>
                        <SelectItem value={PaymentMethod.PAYPAL}>
                          Paypal
                        </SelectItem>
                        <SelectItem value={PaymentMethod.CASH}>Cash</SelectItem>
                        <SelectItem value={PaymentMethod.UPI}>UPI</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full mt-2" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
