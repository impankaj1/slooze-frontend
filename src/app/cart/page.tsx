import { useCartStore } from "@/lib/store";

const CartPage = () => {
  const cart = useCartStore((state) => state.cart);
  return (
    <div>
      <h1>Cart</h1>
      {cart.map((item) => (
        <div key={item.menuItem._id}>{item.menuItem.name}</div>
      ))}
    </div>
  );
};
export default CartPage;
