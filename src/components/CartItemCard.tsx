import { ConfirmDialog } from "./ConfirmDialog";
import { Button } from "./ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem } from "@/types/CartItem";
import { useCartStore, useMenuStore } from "@/lib/store";

interface CartItemCardProps {
  cartItem: CartItem;
  handleDeleteMenuItem: (menuItemId: string) => void;
  toggleShowConfirmDialog: () => void;
  showConfirmDialog: boolean;
}

const CartItemCard = (props: CartItemCardProps) => {
  const {
    cartItem,
    handleDeleteMenuItem,
    toggleShowConfirmDialog,
    showConfirmDialog,
  } = props;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-CA");
  };

  const menuItem = useMenuStore((state) => state.menuItems).find(
    (item) => item._id === cartItem.menuItem._id
  );

  const addQuantity = useCartStore((state) => state.addQuantity);
  const removeQuantity = useCartStore((state) => state.removeQuantity);

  const totalPrice = (cartItem: CartItem) => {
    return Number(cartItem.menuItem.price) * cartItem.quantity;
  };
  return (
    <div className="border-2 border-gray-300 m-2 shadow-md rounded-md p-4">
      <div className="flex justify-between gap-4   items-center">
        <h1 className="text-lg font-bold">{cartItem.menuItem.name}</h1>
        <ConfirmDialog
          title={"Are you sure you want to delete this item from cart?"}
          description="This action cannot be undone."
          onConfirm={() => handleDeleteMenuItem(cartItem.menuItem._id)}
          onCancel={toggleShowConfirmDialog}
          open={showConfirmDialog}
          trigger={
            <Button size="icon" onClick={toggleShowConfirmDialog}>
              <Trash2 />
            </Button>
          }
        />
      </div>
      <p className="text-sm text-gray-500">{cartItem.menuItem.description}</p>
      <p className="text-sm text-gray-500">Price: {cartItem.menuItem.price}</p>
      <p className="text-sm text-gray-500">
        Created At: {formatDate(cartItem.menuItem.createdAt)}
      </p>
      <p className="text-sm text-gray-500">
        Updated At: {formatDate(cartItem.menuItem.updatedAt)}
      </p>
      <div className="flex items-center gap-2">
        {" "}
        Quantity:
        <Button
          variant="outline"
          size="icon"
          onClick={() => removeQuantity(cartItem.menuItem._id)}
          disabled={cartItem.quantity === 1}
        >
          <Minus />
        </Button>
        <span>{cartItem.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => addQuantity(cartItem.menuItem._id)}
        >
          <Plus />
        </Button>
      </div>
      <div className="text-xl font-bold flex justify-end">
        Item Price: {totalPrice(cartItem)}
      </div>
    </div>
  );
};

export default CartItemCard;
