import { Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../core/cart.service';
import { Menu } from '../../models/menu.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  menus = signal<Menu[]>([]);
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<number | null>(null);
  loading = signal(true);

  constructor(
    private menuService: MenuService,
    private categoryService: CategoryService,
    public cart: CartService
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((cats) => this.categories.set(cats));
    this.loadMenus();
  }

  loadMenus(): void {
    this.loading.set(true);
    const categoryId = this.selectedCategoryId();
    const source = categoryId
      ? this.menuService.getByCategory(categoryId)
      : this.menuService.getAll();

    source.subscribe({
      next: (menus) => {
        this.menus.set(menus);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId.set(categoryId);
    this.loadMenus();
  }

  addToCart(menu: Menu, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.cart.add(menu, 1);
  }
}
