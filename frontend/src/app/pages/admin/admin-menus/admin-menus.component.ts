import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MenuService } from '../../../services/menu.service';
import { CategoryService } from '../../../services/category.service';
import { Menu } from '../../../models/menu.model';
import { Category } from '../../../models/category.model';

const emptyForm = (): Partial<Menu> => ({
  name: '',
  description: '',
  price: 0,
  pictureOfFood: '',
  categoryId: undefined
});

@Component({
  selector: 'app-admin-menus',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-menus.component.html',
  styleUrl: './admin-menus.component.scss'
})
export class AdminMenusComponent implements OnInit {
  menus = signal<Menu[]>([]);
  categories = signal<Category[]>([]);
  form = signal<Partial<Menu>>(emptyForm());
  editingId = signal<number | null>(null);
  error = signal('');

  constructor(
    private menuService: MenuService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((cats) => this.categories.set(cats));
    this.load();
  }

  load(): void {
    this.menuService.getAll().subscribe((menus) => this.menus.set(menus));
  }

  startCreate(): void {
    this.editingId.set(null);
    this.form.set(emptyForm());
  }

  startEdit(menu: Menu): void {
    this.editingId.set(menu.menuId);
    this.form.set({ ...menu });
  }

  save(): void {
    const value = this.form();
    if (!value.name || !value.categoryId || value.price == null) {
      this.error.set('Name, price and category are required.');
      return;
    }
    this.error.set('');

    const id = this.editingId();
    const request: Observable<unknown> = id
      ? this.menuService.update(id, { ...value, menuId: id })
      : this.menuService.create(value);

    request.subscribe({
      next: () => {
        this.startCreate();
        this.load();
      },
      error: (err: any) => this.error.set(err?.error?.Message ?? 'Could not save dish.')
    });
  }

  remove(menu: Menu): void {
    if (!confirm(`Delete "${menu.name}"?`)) return;
    this.menuService.delete(menu.menuId).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(err?.error?.Message ?? 'Could not delete dish.')
    });
  }

  updateForm(field: keyof Menu, value: any): void {
    this.form.set({ ...this.form(), [field]: value });
  }
}
