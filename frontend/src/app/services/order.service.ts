import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../core/api-config';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_URL}/orders`);
  }

  getById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${API_URL}/orders/${orderId}`);
  }

  getForUser(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_URL}/orders/user/${userId}`);
  }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(`${API_URL}/orders`, order);
  }

  updateStatus(orderId: number, newStatus: OrderStatus): Observable<any> {
    return this.http.put(`${API_URL}/orders/${orderId}/status`, null, {
      params: { newStatus: OrderStatus[newStatus] }
    });
  }

  delete(orderId: number): Observable<any> {
    return this.http.delete(`${API_URL}/orders/${orderId}`);
  }
}
