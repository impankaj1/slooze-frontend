import { User } from "@/types/User";
import { MenuItem } from "@/types/MenuItems";
import { create } from "zustand";
import { Cart, CartItem } from "@/types/CartItem";
import { Order } from "@/types/OrderItem";
import { OrderStatus } from "@/types/OrderStatus";
import { Payment } from "@/types/Payment";
import { Restaurant } from "@/types/Restaurant";
import { PaymentMethod } from "@/enums/PaymenyMethod";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  removeUser: () => set({ user: null }),
}));

interface CartStore {
  cart: Cart | Cart[];
  addToCart: (cart: Cart) => void;
  removeFromCart: (itemId: string) => void;
  addQuantity: (itemId: string) => void;
  removeQuantity: (itemId: string) => void;
  setCart: (cart: Cart | Cart[]) => void;
}

const initialCartState: Cart = {
  items: [],
  totalPrice: 0,
  userId: "",
  country: "",
};

export const useCartStore = create<CartStore>((set) => ({
  cart: initialCartState,
  setCart: (cart: Cart | Cart[]) => set({ cart }),
  addToCart: (cart: Cart) =>
    set((state) => {
      if (Array.isArray(state.cart)) {
        const cartIndex = state.cart.findIndex((c) => c.userId === cart.userId);
        if (cartIndex !== -1) {
          const updatedCarts = [...state.cart];
          updatedCarts[cartIndex] = cart;
          return { cart: updatedCarts };
        }

        return { cart: [...state.cart, cart] };
      }

      return { cart };
    }),
  removeFromCart: (itemId: string) =>
    set((state) => {
      if (Array.isArray(state.cart)) {
        // Handle array of carts
        const updatedCarts = state.cart.map((cart) => {
          const itemToRemove = cart.items.find(
            (item: CartItem) => item.menuItem._id === itemId
          );
          if (!itemToRemove) return cart;

          const itemTotalPrice = itemToRemove.itemTotalPrice;
          return {
            ...cart,
            items: cart.items.filter(
              (item: CartItem) => item.menuItem._id !== itemId
            ),
            totalPrice: cart.totalPrice - itemTotalPrice,
          };
        });
        return { cart: updatedCarts };
      }

      const itemToRemove = state.cart.items.find(
        (item: CartItem) => item.menuItem._id === itemId
      );
      if (!itemToRemove) return state;

      const itemTotalPrice = itemToRemove.itemTotalPrice;
      return {
        cart: {
          ...state.cart,
          items: state.cart.items.filter(
            (item: CartItem) => item.menuItem._id !== itemId
          ),
          totalPrice: state.cart.totalPrice - itemTotalPrice,
        },
      };
    }),
  addQuantity: (itemId: string) =>
    set((state) => {
      if (Array.isArray(state.cart)) {
        const updatedCarts = state.cart.map((cart) => {
          const item = cart.items.find(
            (item: CartItem) => item.menuItem._id === itemId
          );
          if (!item) return cart;

          return {
            ...cart,
            items: cart.items.map((item: CartItem) =>
              item.menuItem._id === itemId
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                    itemTotalPrice:
                      item.itemTotalPrice + Number(item.menuItem.price),
                  }
                : item
            ),
            totalPrice: cart.totalPrice + Number(item.menuItem.price),
          };
        });
        return { cart: updatedCarts };
      }

      const item = state.cart.items.find(
        (item: CartItem) => item.menuItem._id === itemId
      );
      if (!item) return state;

      return {
        cart: {
          ...state.cart,
          items: state.cart.items.map((item: CartItem) =>
            item.menuItem._id === itemId
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  itemTotalPrice:
                    item.itemTotalPrice + Number(item.menuItem.price),
                }
              : item
          ),
          totalPrice: state.cart.totalPrice + Number(item.menuItem.price),
        },
      };
    }),
  removeQuantity: (itemId: string) =>
    set((state) => {
      if (Array.isArray(state.cart)) {
        const updatedCarts = state.cart.map((cart) => {
          const item = cart.items.find(
            (item: CartItem) => item.menuItem._id === itemId
          );
          if (!item) return cart;

          return {
            ...cart,
            items: cart.items.map((item: CartItem) =>
              item.menuItem._id === itemId
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                    itemTotalPrice:
                      item.itemTotalPrice - Number(item.menuItem.price),
                  }
                : item
            ),
            totalPrice: cart.totalPrice - Number(item.menuItem.price),
          };
        });
        return { cart: updatedCarts };
      }

      // Handle single cart
      const item = state.cart.items.find(
        (item: CartItem) => item.menuItem._id === itemId
      );
      if (!item) return state;

      const updatedCart: Cart = {
        ...state.cart,
        items: state.cart.items.map((item: CartItem) =>
          item.menuItem._id === itemId
            ? {
                ...item,
                quantity: item.quantity - 1,
                itemTotalPrice:
                  item.itemTotalPrice - Number(item.menuItem.price),
              }
            : item
        ),
        totalPrice: state.cart.totalPrice - Number(item.menuItem.price),
      };
      return { cart: updatedCart };
    }),
}));

interface MenuStore {
  menuItems: MenuItem[];
  setMenuItems: (menuItems: MenuItem[]) => void;
  deleteMenuItems: (menuItemId: string) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  menuItems: [],
  setMenuItems: (menuItems: MenuItem[]) => set({ menuItems }),
  deleteMenuItems: (menuItemId: string) =>
    set((state) => ({
      menuItems: state.menuItems.filter((item) => item._id !== menuItemId),
    })),
}));

interface OrderStore {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  setOrders: (orders: Order[]) => set({ orders }),
  updateOrderStatus: (orderId: string, status: OrderStatus) =>
    set((state) => ({
      orders: state.orders?.map((order) =>
        order._id === orderId ? { ...order, status } : order
      ),
    })),
}));

interface PaymentStore {
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
  updatePaymentStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentMethod: (
    paymentId: string,
    paymentMethod: PaymentMethod
  ) => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  payments: [],
  setPayments: (payments: Payment[]) => set({ payments }),
  updatePaymentStatus: (orderId: string, status: OrderStatus) =>
    set((state) => ({
      payments: state.payments?.map((payment) =>
        payment.orderId === orderId ? { ...payment, status } : payment
      ),
    })),
  updatePaymentMethod: (paymentId: string, paymentMethod: PaymentMethod) =>
    set((state) => ({
      payments: state.payments?.map((payment) =>
        payment._id === paymentId ? { ...payment, paymentMethod } : payment
      ),
    })),
}));

interface RestaurantStore {
  restaurants: Restaurant[];
  setRestaurants: (restaurants: Restaurant[]) => void;
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  restaurants: [],
  setRestaurants: (restaurants: Restaurant[]) => set({ restaurants }),
}));
