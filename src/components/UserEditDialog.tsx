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
import {
  Select,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "./ui/select";
import { Loader2 } from "lucide-react";
import { User } from "@/types/User";
import { Role } from "@/enums/Roles";

const formSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email("Please enter a valid email id").nonempty(),
  location: z.string().nonempty(),
  role: z.nativeEnum(Role),
});

export type userFormValues = z.infer<typeof formSchema>;

interface UserEditDialogProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  handleEditUser?: (values: userFormValues, resetForm: () => void) => void;
  user: User;
}

export function UserEditDialog(props: UserEditDialogProps) {
  const { handleEditUser, isEditDialogOpen, setIsEditDialogOpen, user } = props;

  const form = useForm<userFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      location: user.location || "",
      role: user.role as Role,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    handleEditUser?.(values, () => form.reset());
    setIsLoading(false);
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="overflow-y-auto  text-white space-y-8"
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
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("role") === Role.ADMIN && (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="text-foreground w-full ">
                    <FormLabel className="text-foreground w-full">
                      Role
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            className="text-foreground"
                            placeholder="Select a role"
                          />
                        </SelectTrigger>
                        <SelectContent className="text-foreground">
                          <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                          <SelectItem value={Role.MANAGER}>Manager</SelectItem>
                          <SelectItem value={Role.MEMBER}>Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Location</FormLabel>
                  <FormControl>
                    <Input
                      className="text-foreground"
                      placeholder="Enter your location here"
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
