import { CartItem } from "./CartItem";
import { OrderStatus } from "./OrderStatus";

export interface Order {
  items: CartItem[];
  userId: string;
  totalPrice: number;
  status: OrderStatus;
  country: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
