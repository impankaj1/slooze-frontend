"use client";

import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "@/helpers";
import { Restaurant } from "@/types/Restaurant";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  MenuItemDialog,
  MenuItemFormValues,
} from "@/components/MenuItemDialogue";
import { MenuItem } from "@/types/MenuItems";
import MenuItemCard from "@/components/MenuItemCard";
import { LoginDialog } from "@/components/LoginDialog";
import { useCartStore, useMenuStore, useUserStore } from "@/lib/store";
import axiosInstance from "@/lib/axiosInstance";

const RestaurantDetails = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isAddMenuItemDialogOpen, setIsAddMenuItemDialogOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { restaurantId } = useParams();
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const menuItems = useMenuStore((state) => state.menuItems);
  const setMenuItems = useMenuStore((state) => state.setMenuItems);

  const getRestaurantById = async (
    id: string
  ): Promise<{
    restaurant: Restaurant | null;
    menuItems: MenuItem[];
  }> => {
    const response = await axios.get(`${BACKEND_BASE_URL}/restaurants/${id}`);
    return response.data;
  };

  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const handleDeleteMenuItem = async (menuItemId: string) => {
    const response = await axiosInstance.delete(
      `${BACKEND_BASE_URL}/menu-items/${menuItemId}`
    );
    setMenuItems(menuItems.filter((item) => item._id !== menuItemId));
    removeFromCart(menuItemId);
    toast.success("Menu item deleted successfully");
  };

  const toggleShowConfirmDialog = () => {
    setShowConfirmDialog(!showConfirmDialog);
  };

  const toggleShowLoginDialog = () => {
    setShowLoginDialog(!showLoginDialog);
  };

  const handleAddMenuItem = async (
    values: MenuItemFormValues,
    resetForm: () => void
  ) => {
    const price = parseFloat(values.price);
    const response = await axios.post(
      `${BACKEND_BASE_URL}/menu-items/restaurant/${restaurantId}`,
      { ...values, price }
    );
    setMenuItems([...menuItems, response.data]);
    resetForm();
    toast.success("Menu item added successfully");
    setIsAddMenuItemDialogOpen(false);
    return response.data;
  };

  useEffect(() => {
    getRestaurantById(restaurantId as string)
      .then((data) => {
        setRestaurant(data.restaurant);
        setMenuItems(data.menuItems);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, [restaurantId]);

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Name : {restaurant?.name}</h1>

            <h1 className="text-xl font-semibold text-gray-500">
              Description : {restaurant?.description}
            </h1>
            <h1 className="text-xl font-semibold text-gray-500">
              Address : {restaurant?.location}
            </h1>
          </div>
          <div className="flex flex-col gap-4">
            {user && (
              <Button onClick={() => setIsAddMenuItemDialogOpen(true)}>
                Add Menu Item
              </Button>
            )}

            {!user && (
              <LoginDialog
                title="Login to add menu item"
                description="Please login to add menu item."
                onConfirm={() => {
                  router.push("/auth/login");
                }}
                onCancel={() => {
                  toggleShowLoginDialog();
                }}
                open={showLoginDialog}
                trigger={<Button> Add Menu Item</Button>}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((menuItem) => (
            <MenuItemCard
              key={menuItem._id}
              menuItem={menuItem}
              handleDeleteMenuItem={handleDeleteMenuItem}
              toggleShowConfirmDialog={toggleShowConfirmDialog}
              showConfirmDialog={showConfirmDialog}
            />
          ))}
        </div>
      </div>

      <MenuItemDialog
        isAddMenuItemDialogOpen={isAddMenuItemDialogOpen}
        setIsAddMenuItemDialogOpen={setIsAddMenuItemDialogOpen}
        handleAddMenuItem={handleAddMenuItem}
      />
    </div>
  );
};

export default RestaurantDetails;
