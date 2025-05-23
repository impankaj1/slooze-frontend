import { User } from "@/types/User";
import { MenuItem } from "@/types/MenuItems";
import { create } from "zustand";
import { Cart, CartItem } from "@/types/CartItem";

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
  setCart: (items: Cart) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: { items: [], totalPrice: 0, userId: "" },
  setCart: (items: Cart) => set({ cart: items }),
  addToCart: (item: CartItem) =>
    set((state) => {
      const existingItem = state.cart.items.find(
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
          items: [...state.cart.items, item],
          totalPrice: state.cart.totalPrice + item.itemTotalPrice,
        },
      };
    }),
  removeFromCart: (itemId: string) =>
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items.filter(
          (item) => item.menuItem._id !== itemId
        ),
      },
    })),
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
