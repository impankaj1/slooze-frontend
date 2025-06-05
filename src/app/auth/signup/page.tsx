"use client";

import { memo, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-toastify";
import { Eye, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";
import { accessToken, BACKEND_BASE_URL, setAccessToken } from "@/helpers";
import { Role } from "@/enums/Roles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Countries } from "@/enums/Countries";

const SignUpPage = () => {
  const formSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email("Please enter a valid email id").nonempty(),
    password: z.string().nonempty().min(8),
    country: z.nativeEnum(Countries),
    role: z.nativeEnum(Role),
  });
  const router = useRouter();

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user && accessToken) {
      router.push("/");
    }
  }, [user, router]);

  const setUser = useUserStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      country: Countries.IN,
      role: Role.MEMBER,
    },
  });

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const res = await axiosInstance
      .post(`${BACKEND_BASE_URL}/auth/signup`, values)
      .then((res) => res)
      .catch((err) => {
        toast.error(err.response.data.message);
        return;
      });

    if (res?.status === 200) {
      setAccessToken(res.data.token);
      form.reset();
      setUser(res.data.user);
      toast.success("User created successfully");
      router.push(`/`);
    }
    setIsLoading(false);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordTypeChange = () => setShowPassword(!showPassword);

  return (
    <div className="flex h-full  flex-col items-center overflow-y-scroll scroll-auto justify-center ">
      <h1 className="font-bold text-2xl">Create your new account</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onFormSubmit)}
          className="w-5/6 sm:w-3/4 max-h-3/4 overflow-y-auto md:w-1/2 xl:w-1/3 p-4 md:p-10 m-2 outline outline-gray-100 shadow-2xl rounded-2xl bg-gradient-to-br from-secondary/40 via-secondary/90 to-secondary/40  text-white space-y-8"
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

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email</FormLabel>
                <FormControl>
                  <Input
                    className="text-foreground"
                    placeholder="Enter your email here"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="text-foreground w-full ">
                <FormLabel className="text-foreground w-full">Role</FormLabel>
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Password</FormLabel>
                <FormControl>
                  <div className="relative flex items-center ">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="text-foreground relative"
                      placeholder="Password"
                      {...field}
                    />
                    <div
                      role="button"
                      onClick={handlePasswordTypeChange}
                      className="absolute right-0 p-2 z-30 cursor-pointer"
                    >
                      <Eye className="text-foreground" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="text-foreground w-full ">
                <FormLabel className="text-foreground w-full">
                  Country
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
                      {Object.entries(Countries).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ))}
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
      <div className="mt-4">
        <p>
          Already have an account?{" "}
          <span className="">
            <Link className="text-primary underline" href={"/auth/login"}>
              Login
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default memo(SignUpPage);
