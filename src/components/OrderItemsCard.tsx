import { BACKEND_BASE_URL } from "@/helpers";
import axiosInstance from "@/lib/axiosInstance";
import { useRestaurantStore } from "@/lib/store";
import { CartItem } from "@/types/CartItem";
import { useEffect } from "react";

interface OrderItemsCardProps {
  item: CartItem;
}

const OrderItemsCard = (props: OrderItemsCardProps) => {
  const { item } = props;
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const setRestaurants = useRestaurantStore((state) => state.setRestaurants);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-CA");
  };

  const fetchRestaurants = async () => {
    const response = await axiosInstance
      .get(`${BACKEND_BASE_URL}/restaurants`)
      .then((res) => res.data);
    setRestaurants(response);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const getRestaurant = (restaurantId: string) =>
    restaurants.find((restaurant) => restaurant._id === restaurantId);

  const restaurant = getRestaurant(item.menuItem.restaurantId);

  return (
    <div>
      <div className="border-2 border-gray-300 m-2 shadow-md rounded-md p-4">
        <div className="flex justify-between gap-4   items-center">
          <h1 className="text-lg font-bold">{item.menuItem.name}</h1>
        </div>
        <p className="text-sm text-gray-500">{item.menuItem.description}</p>
        <p className="text-sm text-gray-500">Price: {item.menuItem.price}</p>
        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
        <p className="text-sm text-gray-500">Restaurant: {restaurant?.name}</p>
        <p className="text-sm text-gray-500">
          Created At: {formatDate(item.menuItem.createdAt)}
        </p>
        <p className="text-sm text-gray-500">
          Updated At: {formatDate(item.menuItem.updatedAt)}
        </p>
      </div>
    </div>
  );
};

export default OrderItemsCard;
