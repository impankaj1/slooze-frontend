import { ShoppingCartIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { useCartStore } from "@/lib/store";
import CartItemCard from "./CartItemCard";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_BASE_URL } from "@/helpers";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
interface CartProps {
  isOpen: boolean;
  cartToggle: () => void;
}

const Cart = (props: CartProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { isOpen, cartToggle } = props;
  const cartItems = useCartStore((state) => state.cart.items);
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
  console.log("cartItems", cartItems);
  const totalCartPrice = useCartStore((state) => state.cart.totalPrice);

  const handleCheckout = () => {
    cartToggle();
    router.push("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={cartToggle}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>
            Your Cart items will be shown here
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="relative h-[calc(100vh-15rem)]">
          <div className="flex flex-col gap-4  ">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
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
        </ScrollArea>
        <div className="absolute bottom-0 left-0 right-0 p-4 font-semibold  text-xl flex justify-between items-center">
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
