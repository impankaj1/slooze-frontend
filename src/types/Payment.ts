export interface Payment {
  _id: string;
  menuItemIds: string[];
  restaurantId: string;
  orderId: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}
