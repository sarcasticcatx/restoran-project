import { Menu } from './menu.model';
import { AppUser } from './user.model';

export enum PaymentMethod {
  Cash = 0,
  Card = 1
}

export enum OrderStatus {
  Accepted = 0,
  InMaking = 1,
  Delivered = 2,
  Canceled = 3
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Accepted]: 'Accepted',
  [OrderStatus.InMaking]: 'In the making',
  [OrderStatus.Delivered]: 'Delivered',
  [OrderStatus.Canceled]: 'Canceled'
};

export interface OrderItem {
  orderItemId?: number;
  menuId: number;
  menuItem?: Menu;
  orderId?: number;
  quantity: number;
  price: number;
}

export interface Order {
  orderId?: number;
  userId: string;
  user?: AppUser;
  dateCreated?: string;
  price?: number;
  paymentMethod: PaymentMethod;
  orderStatus?: OrderStatus;
  orderItems: OrderItem[];
}
