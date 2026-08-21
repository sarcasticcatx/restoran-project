import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order, OrderStatus, OrderStatusLabels } from '../../../models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);
  error = signal('');

  statusOptions = [
    OrderStatus.Accepted,
    OrderStatus.InMaking,
    OrderStatus.Delivered,
    OrderStatus.Canceled
  ];
  statusLabels = OrderStatusLabels;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.orderService.getAll().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  changeStatus(order: Order, newStatus: string): void {
    const status = Number(newStatus) as OrderStatus;
    this.error.set('');
    this.orderService.updateStatus(order.orderId!, status).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(err?.error?.Message ?? 'Could not update status.')
    });
  }

  remove(order: Order): void {
    if (!confirm(`Delete order #${order.orderId}?`)) return;
    this.orderService.delete(order.orderId!).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(err?.error?.Message ?? 'Could not delete order.')
    });
  }
}
