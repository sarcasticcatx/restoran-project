import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Menu } from '../models/menu.model';

const CART_KEY = 'restoran_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<CartItem[]>(this.readFromStorage());

  totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.menu.price * item.quantity, 0)
  );

  totalCount = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));

  add(menu: Menu, quantity = 1): void {
    const items = [...this.items()];
    const existing = items.find((i) => i.menu.menuId === menu.menuId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ menu, quantity });
    }
    this.save(items);
  }

  updateQuantity(menuId: number, quantity: number): void {
    if (quantity <= 0) {
      this.remove(menuId);
      return;
    }
    const items = this.items().map((i) => (i.menu.menuId === menuId ? { ...i, quantity } : i));
    this.save(items);
  }

  remove(menuId: number): void {
    this.save(this.items().filter((i) => i.menu.menuId !== menuId));
  }

  clear(): void {
    this.save([]);
  }

  private save(items: CartItem[]): void {
    this.items.set(items);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  private readFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
