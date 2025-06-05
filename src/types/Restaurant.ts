export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  menuItemIds: string[];
  country: string;
  createdAt: Date;
  updatedAt: Date;
}
