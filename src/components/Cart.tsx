import { ShoppingCartIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { useCartStore, useUserStore } from "@/lib/store";
import CartItemCard from "./CartItemCard";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_BASE_URL } from "@/helpers";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { CartItem } from "@/types/CartItem";
import { Role } from "@/enums/Roles";
import { Separator } from "./ui/separator";

interface CartProps {
  isOpen: boolean;
  cartToggle: () => void;
  cartItems: CartItem[];
}

const Cart = (props: CartProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { isOpen, cartToggle, cartItems } = props;
  const cart = useCartStore((state) => state.cart);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const handleDeleteMenuItem = async (menuItemId: string) => {
    const response = await axiosInstance.delete(
      `${BACKEND_BASE_URL}/cart/items/${menuItemId}`,
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      removeFromCart(menuItemId);
    } else {
      toast.error("Failed to delete menu item from cart");
    }
  };

  const toggleShowConfirmDialog = () => {
    setShowConfirmDialog(!showConfirmDialog);
  };

  const totalCartPrice = Array.isArray(cart)
    ? cart.reduce((prev, curr) => prev + curr.totalPrice, 0)
    : cart?.totalPrice ?? 0;

  const handleCheckout = () => {
    cartToggle();
    router.push("/checkout");
  };

  const renderCartItems = (items: CartItem[], cartTitle?: string) => (
    <div className="flex flex-col gap-4">
      {cartTitle && user?.role === Role.ADMIN && (
        <div className="font-semibold text-lg mb-2">{cartTitle}</div>
      )}
      {items.length > 0 ? (
        items.map((item) => (
          <CartItemCard
            key={item.menuItem._id}
            cartItem={item}
            handleDeleteMenuItem={handleDeleteMenuItem}
            toggleShowConfirmDialog={toggleShowConfirmDialog}
            showConfirmDialog={showConfirmDialog}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center font-semibold text-muted-foreground px-2 gap-4 mt-4">
          <h3>No items in cart</h3>
        </div>
      )}
    </div>
  );

  const renderCartContent = () => {
    if (Array.isArray(cart)) {
      return cart.map((singleCart, index) => (
        <div key={singleCart.userId || index} className="mb-6 ">
          {renderCartItems(
            singleCart.items,
            `Cart for Country: ${singleCart.country}`
          )}
          {index < cart.length - 1 && <Separator className="my-4" />}
        </div>
      ));
    }

    return renderCartItems(cartItems);
  };

  return (
    <Sheet open={isOpen} onOpenChange={cartToggle}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {user?.role === Role.ADMIN ? "All Carts" : "Your Cart"}
          </SheetTitle>
          <SheetDescription>
            {user?.role === Role.ADMIN
              ? "View and manage all user carts"
              : "Your cart items will be shown here"}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="relative h-[calc(100vh-15rem)]">
          {renderCartContent()}
        </ScrollArea>
        <div className="absolute bottom-0 left-0 right-0 p-4 font-semibold text-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p>Total Price :</p>
            <p>{totalCartPrice}</p>
          </div>
          <Button
            size="lg"
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
          >
            Checkout <ShoppingCartIcon className="w-4 h-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
