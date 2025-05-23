"use client";

import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";
import { Restaurant } from "@/types/Restaurant";
import { MenuItem } from "@/types/MenuItems";

const formSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  price: z.string().nonempty(),
});

export type MenuItemFormValues = z.infer<typeof formSchema>;

interface MenuItemDialogProps {
  isAddMenuItemDialogOpen: boolean;
  setIsAddMenuItemDialogOpen: (isOpen: boolean) => void;
  handleMenuItemUpdate?: (
    values: MenuItemFormValues,
    resetForm: () => void
  ) => void;
  handleAddMenuItem?: (
    values: MenuItemFormValues,
    resetForm: () => void
  ) => void;
  isEdit?: boolean;
  menuItem?: MenuItem;
}

export function MenuItemDialog(props: MenuItemDialogProps) {
  const {
    handleAddMenuItem,
    isAddMenuItemDialogOpen,
    setIsAddMenuItemDialogOpen,
    handleMenuItemUpdate,
    isEdit,
    menuItem,
  } = props;

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: menuItem?.name || "",
      description: menuItem?.description || "",
      price: menuItem?.price || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const price = parseFloat(values.price);
    if (isNaN(price)) {
      toast.error("Price must be a number");
      setIsLoading(false);
      return;
    }
    if (price <= 0) {
      toast.error("Price must be greater than 0");
      setIsLoading(false);
      return;
    }
    if (isEdit && !handleMenuItemUpdate) {
      toast.error("No function to update the menu item");
      setIsLoading(false);
      return;
    }

    if (!isEdit && !handleAddMenuItem) {
      toast.error("No function to add the menu item");
      setIsLoading(false);
      return;
    }

    if (isEdit) {
      handleMenuItemUpdate?.(values, form.reset);
    } else {
      handleAddMenuItem?.(values, form.reset);
    }

    setIsLoading(false);
  };

  return (
    <Dialog
      open={isAddMenuItemDialogOpen}
      onOpenChange={setIsAddMenuItemDialogOpen}
    >
      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
          <DialogDescription>
            Add a new menu item to the restaurant
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="overflow-y-auto    text-white space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Name</FormLabel>
                  <FormControl>
                    <Input
                      className="text-foreground"
                      placeholder="Enter the menu item name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="text-foreground"
                      placeholder="Enter the job description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Price</FormLabel>
                  <FormControl>
                    <Input
                      className="text-foreground"
                      placeholder="Enter the menu item price"
                      {...field}
                    />
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
