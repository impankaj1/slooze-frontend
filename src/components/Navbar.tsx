"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  LogIn,
  UserPlus,
  User,
  Menu,
  ShoppingCart,
  List,
} from "lucide-react";
import { ModeToggle } from "@/components/ThemeToggle";
import { useCartStore, useUserStore } from "@/lib/store";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { accessToken, removeAccessToken } from "@/helpers";
import { BACKEND_BASE_URL } from "@/helpers";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Role } from "@/enums/Roles";
import Cart from "./Cart";

const Navbar = () => {
  const user = useUserStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const setCart = useCartStore((state) => state.setCart);

  const pathname = usePathname();
  const isCheckoutPage = pathname === "/checkout";
  const cart = useCartStore((state) => state.cart);
  const cartItems = Array.isArray(cart)
    ? cart.flatMap((cart) => cart.items)
    : cart?.items ?? [];

  const handleCartToggle = () => {
    setCartOpen(!cartOpen);
  };
  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        `${BACKEND_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      setCart({
        items: [],
        totalPrice: 0,
        userId: "",
        country: "",
      });

      removeAccessToken();
      setIsOpen(false);

      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
      router.push("/");
    }
  };
  console.log("cartItems", cartItems);
  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4">
          {user && accessToken ? (
            <>
              <Link href={`/user/${user._id}`} onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                <Button className="w-full justify-start gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          <div className="w-full px-4 flex items-center gap-2">
            <span className="text-base ">Appearance :</span>
            <ModeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <nav className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="flex justify-between h-16 items-center">
        {/* Logo/Brand */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <Link
            href="/"
            className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            <ShoppingCart className="h-6 w-6 inline-block mr-2" />
            E-comm
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user && accessToken ? (
            <>
              {/* {user.role === Role.ADMIN && (
                <div>
                  <Link href="/dashboard" className="hidden md:block">
                    <Button variant="ghost" className="gap-2">
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="md:hidden">
                    <Button variant="ghost" size="icon">
                      <Home className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )} */}
              {user.role !== Role.MEMBER && (
                <div>
                  <Link href="/orders" className="hidden md:block">
                    <Button variant="ghost" className="gap-2">
                      <List className="h-4 w-4" />
                      Orders
                    </Button>
                  </Link>
                  <Link href="/orders" className="md:hidden">
                    <Button variant="ghost" size="icon">
                      <List className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
              {user && user.role !== Role.MEMBER && !isCheckoutPage && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    className="md:flex items-center gap-2 hidden "
                    onClick={handleCartToggle}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                    {cartItems.length > 0 && (
                      <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                        {cartItems.length}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={handleCartToggle}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {cartItems.length > 0 && (
                      <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                        {cartItems.length}
                      </span>
                    )}
                  </Button>
                </div>
              )}
              <div className="hidden md:flex items-center gap-4">
                <Link href={`/user/${user._id}`}>
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="gap-2 hover:bg-primary/10">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="gap-2 bg-primary hover:bg-primary/90 transition-colors">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <MobileMenu />
        </div>
      </div>
      <Cart
        cartItems={cartItems}
        isOpen={cartOpen}
        cartToggle={handleCartToggle}
      />
    </nav>
  );
};

export default Navbar;
