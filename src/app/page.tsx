"use client";

import { Button } from "@/components/ui/button";
import { BACKEND_BASE_URL } from "@/helpers";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  RestaurantDialog,
  RestaurantFormValues,
} from "@/components/RestaurantDialog";
import RestaurantCard from "@/components/RestaurantCard";
import { useRestaurantStore, useUserStore } from "@/lib/store";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
export default function Home() {
  const [addRestaurant, setAddRestaurant] = useState(false);

  const restaurants = useRestaurantStore((state) => state.restaurants);
  const setRestaurants = useRestaurantStore((state) => state.setRestaurants);

  const fetchRestaurants = async () => {
    const response = await axiosInstance
      .get(`${BACKEND_BASE_URL}/restaurants`)
      .then((res) => res.data);
    setRestaurants(response);
  };

  const toggleAddRestaurant = () => {
    setAddRestaurant(!addRestaurant);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleAddRestaurant = async (
    values: RestaurantFormValues,
    resetForm: () => void
  ) => {
    const response = await axiosInstance
      .post(`${BACKEND_BASE_URL}/restaurants`, values)
      .then((res) => res.data);
    setRestaurants([...restaurants, response]);
    resetForm();
    toggleAddRestaurant();
    toast.success("Restaurant added successfully");
  };

  const user = useUserStore((state) => state.user);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Restaurants :</h1>
        {user && user.role === "admin" && (
          <Button onClick={toggleAddRestaurant}>Add Restaurant</Button>
        )}
      </div>

      {addRestaurant && (
        <RestaurantDialog
          isAddRestaurantDialogOpen={addRestaurant}
          setIsAddRestaurantDialogOpen={toggleAddRestaurant}
          handleAddRestaurant={handleAddRestaurant}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
