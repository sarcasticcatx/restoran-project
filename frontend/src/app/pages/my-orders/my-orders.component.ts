import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../core/auth.service';
import { Order, OrderStatus, OrderStatusLabels } from '../../models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);
  OrderStatus = OrderStatus;
  statusLabels = OrderStatusLabels;

  constructor(
    private orderService: OrderService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (!user) return;

    this.orderService.getForUser(user.id).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  statusClass(status?: OrderStatus): string {
    switch (status) {
      case OrderStatus.Accepted:
        return 'badge-accepted';
      case OrderStatus.InMaking:
        return 'badge-inmaking';
      case OrderStatus.Delivered:
        return 'badge-delivered';
      case OrderStatus.Canceled:
        return 'badge-canceled';
      default:
        return '';
    }
  }
}
