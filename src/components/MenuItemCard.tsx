import { MenuItem } from "@/types/MenuItems";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { useCartStore, useUserStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { LoginDialog } from "./LoginDialog";
import { useState } from "react";
import { Role } from "@/enums/Roles";
import { BACKEND_BASE_URL } from "@/helpers";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";

interface MenuItemsProps {
  menuItem: MenuItem;
  handleDeleteMenuItem: (menuItemId: string) => void;
  toggleShowConfirmDialog: () => void;
  showConfirmDialog: boolean;
}

const MenuItemCard = (props: MenuItemsProps) => {
  const {
    menuItem,
    handleDeleteMenuItem,
    toggleShowConfirmDialog,
    showConfirmDialog,
  } = props;

  const user = useUserStore((state) => state.user);

  const { restaurantId } = useParams();

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-CA");
  };

  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const toggleShowLoginDialog = () => {
    setShowLoginDialog(!showLoginDialog);
  };

  const router = useRouter();

  const addToCard = useCartStore((state) => state.addToCart);

  const addItemToCart = async (menuItem: MenuItem) => {
    const data = {
      menuItem,
      quantity: 1,
      restaurantId: restaurantId as string,
      itemTotalPrice: Number(menuItem.price),
    };
    const res = await axiosInstance
      .post(`${BACKEND_BASE_URL}/cart/items`, data)
      .then((res) => res)
      .catch((err) => {
        toast.error("Error adding item to cart");
        return err;
      });

    if (res.status === 200) {
      toast.success("Item added to cart");
      addToCard(data);
    }

    return res;
  };

  const handleAddToCart = async (menuItem: MenuItem) => {
    const res = await addItemToCart(menuItem);
  };
  return (
    <div className="border-2 border-gray-300 rounded-md p-4 shadow-md  hover:shadow-2xl hover:scale-101 ease-in-out duration-300 transition-shadow">
      <div className="flex justify-between gap-4     items-center">
        <h1 className="text-lg font-bold">{menuItem.name}</h1>
        {user && user.role === Role.ADMIN && (
          <ConfirmDialog
            title="Are you sure you want to delete this menu item?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteMenuItem(menuItem._id)}
            onCancel={toggleShowConfirmDialog}
            open={showConfirmDialog}
            trigger={
              <Button>
                <Trash2 />
              </Button>
            }
          />
        )}
      </div>
      <p className="text-sm text-gray-500">{menuItem.description}</p>
      <p className="text-sm text-gray-500">Price: {menuItem.price}</p>
      <p className="text-sm text-gray-500">
        Created At: {formatDate(menuItem.createdAt)}
      </p>
      <p className="text-sm text-gray-500">
        Updated At: {formatDate(menuItem.updatedAt)}
      </p>
      {user && (
        <Button
          className="w-full mt-4"
          onClick={() => handleAddToCart(menuItem)}
        >
          Add to Cart
        </Button>
      )}
      {!user && (
        <LoginDialog
          title="Login to add to cart"
          description="Please login to add menu item to your cart."
          onConfirm={() => {
            router.push("/auth/login");
          }}
          onCancel={() => {
            toggleShowLoginDialog();
          }}
          open={showLoginDialog}
          trigger={<Button className="w-full mt-4"> Add to Cart</Button>}
        />
      )}
    </div>
  );
};

export default MenuItemCard;
