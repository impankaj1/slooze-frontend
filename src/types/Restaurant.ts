export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  menuItemIds: string[];
  location: string;
  createdAt: Date;
  updatedAt: Date;
}
