"use client";

import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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

const formSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  location: z.string().nonempty(),
  menuItemIds: z.array(z.string()),
});

export type RestaurantFormValues = z.infer<typeof formSchema>;

interface RestaurantDialogProps {
  isAddRestaurantDialogOpen: boolean;
  setIsAddRestaurantDialogOpen: (isOpen: boolean) => void;
  handleRestaurantUpdate?: (
    values: RestaurantFormValues,
    resetForm: () => void
  ) => void;
  handleAddRestaurant?: (
    values: RestaurantFormValues,
    resetForm: () => void
  ) => void;
  isEdit?: boolean;
  restaurant?: Restaurant;
}

export function RestaurantDialog(props: RestaurantDialogProps) {
  const {
    handleAddRestaurant,
    isAddRestaurantDialogOpen,
    setIsAddRestaurantDialogOpen,
    handleRestaurantUpdate,
    isEdit,
    restaurant,
  } = props;

  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: restaurant?.name || "",
      description: restaurant?.description || "",
      location: restaurant?.location || "",
      menuItemIds: restaurant?.menuItemIds || [],
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    if (isEdit && !handleRestaurantUpdate) {
      toast.error("No function to update the restaurant");
      setIsLoading(false);
      return;
    }

    if (!isEdit && !handleAddRestaurant) {
      toast.error("No function to add the restaurant");
      setIsLoading(false);
      return;
    }

    if (isEdit) {
      handleRestaurantUpdate?.(values, form.reset);
    } else {
      handleAddRestaurant?.(values, form.reset);
    }

    setIsLoading(false);
  };

  return (
    <Dialog
      open={isAddRestaurantDialogOpen}
      onOpenChange={setIsAddRestaurantDialogOpen}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Add Restaurant</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Add Restaurant</DialogTitle>
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
                      placeholder="Enter the job title"
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Location</FormLabel>
                  <FormControl>
                    <Input
                      className="text-foreground"
                      placeholder="Enter the job location"
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
