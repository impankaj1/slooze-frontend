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
  cart: Cart;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  addQuantity: (itemId: string) => void;
  removeQuantity: (itemId: string) => void;
  setCart: (cart: Cart) => void;
}

const initialCartState: Cart = {
  items: [],
  totalPrice: 0,
  userId: "",
};

export const useCartStore = create<CartStore>((set) => ({
  cart: initialCartState,
  setCart: (cart: Cart) => set({ cart }),
  addToCart: (item: CartItem) =>
    set((state) => {
      const existingItem = state.cart?.items.find(
        (cartItem) => cartItem.menuItem._id === item.menuItem._id
      );
      if (existingItem) {
        return {
          cart: {
            ...state.cart,
            items: state.cart.items.map((cartItem) =>
              cartItem.menuItem._id === item.menuItem._id
                ? {
                    ...cartItem,
                    quantity: cartItem.quantity + item.quantity,
                    itemTotalPrice:
                      cartItem.itemTotalPrice + item.itemTotalPrice,
                  }
                : cartItem
            ),
            totalPrice: state.cart.totalPrice + item.itemTotalPrice,
          },
        };
      }
      return {
        cart: {
          ...state.cart,
          items: [...state.cart?.items, item],
          totalPrice: state.cart.totalPrice + item.itemTotalPrice,
        },
      };
    }),
  removeFromCart: (itemId: string) =>
    set((state) => {
      const itemToRemove = state.cart.items.find(
        (item) => item.menuItem._id === itemId
      );
      const itemTotalPrice = itemToRemove?.itemTotalPrice || 0;

      return {
        cart: {
          ...state.cart,
          items: state.cart.items.filter(
            (item) => item.menuItem._id !== itemId
          ),
          totalPrice: state.cart.totalPrice - itemTotalPrice,
        },
      };
    }),
  addQuantity: (itemId: string) =>
    set((state) => {
      const item = state.cart.items.find(
        (item) => item.menuItem._id === itemId
      );
      if (!item) return state;
      return {
        cart: {
          ...state.cart,
          items: state.cart.items.map((item) =>
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
      const item = state.cart.items.find(
        (item) => item.menuItem._id === itemId
      );
      if (!item) return state;
      const updatedCart: Cart = {
        ...state.cart,
        items: state.cart.items.map((item) =>
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
