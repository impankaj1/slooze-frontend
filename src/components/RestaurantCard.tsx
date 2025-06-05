import { Restaurant } from "@/types/Restaurant";
import { useRouter } from "next/navigation";
interface RestaurantProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantProps) => {
  const router = useRouter();
  return (
    <div
      role="button"
      onClick={() => {
        router.push(`/restaurants/${restaurant._id}`);
      }}
      className="border rounded-lg space-y-2 p-4 bg-background/90 shadow-md flex flex-col justify-between gap-2 hover:shadow-2xl hover:scale-101 ease-in-out duration-300 transition-shadow"
    >
      <div className="flex flex-col justify-between gap-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-primary">
            {restaurant.name}
          </h2>
        </div>
        <p className="text-gray-400">{restaurant.country}</p>
        <div className="flex flex-col justify-between gap-2">
          <p className="">{restaurant.description}</p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
