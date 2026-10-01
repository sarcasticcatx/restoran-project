import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { AuthService } from '../../core/auth.service';
import { OrderService } from '../../services/order.service';
import { Order, OrderItem, PaymentMethod } from '../../models/order.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  placingOrder = signal(false);
  orderError = signal('');
  orderSuccess = signal(false);

  constructor(
    public cart: CartService,
    public auth: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  updateQuantity(menuId: number, quantity: string): void {
    this.cart.updateQuantity(menuId, Number(quantity));
  }

  checkout(): void {
    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.orderError.set('');
    this.placingOrder.set(true);

    const orderItems: OrderItem[] = this.cart.items().map((item) => ({
      menuId: item.menu.menuId,
      quantity: item.quantity,
      price: item.menu.price
    }));

    const order: Order = {
      userId: user.id,
      paymentMethod: PaymentMethod.Card,
      orderItems
    };

    this.orderService.create(order).subscribe({
      next: () => {
        this.cart.clear();
        this.placingOrder.set(false);
        this.orderSuccess.set(true);
        setTimeout(() => this.router.navigate(['/orders']), 1200);
      },
      error: (err) => {
        this.orderError.set(err?.error?.Message ?? 'Could not place order.');
        this.placingOrder.set(false);
      }
    });
  }
}
