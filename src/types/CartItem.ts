import { MenuItem } from "./MenuItems";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  itemTotalPrice: number;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  _id?: string;
  userId: string;
  country: string;
  createdAt?: Date;
  updatedAt?: Date;
}
