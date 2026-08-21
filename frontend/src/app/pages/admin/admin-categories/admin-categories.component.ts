import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.scss'
})
export class AdminCategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  newName = '';
  editingId = signal<number | null>(null);
  editingName = '';
  error = signal('');

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.categoryService.getAll().subscribe((cats) => this.categories.set(cats));
  }

  add(): void {
    if (!this.newName.trim()) return;
    this.error.set('');
    this.categoryService.create({ name: this.newName.trim() }).subscribe({
      next: () => {
        this.newName = '';
        this.load();
      },
      error: (err) => this.error.set(err?.error?.Message ?? 'Could not create category.')
    });
  }

  startEdit(cat: Category): void {
    this.editingId.set(cat.categoryId);
    this.editingName = cat.name;
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  saveEdit(cat: Category): void {
    this.error.set('');
    this.categoryService
      .update(cat.categoryId, { categoryId: cat.categoryId, name: this.editingName.trim() })
      .subscribe({
        next: () => {
          this.editingId.set(null);
          this.load();
        },
        error: (err) => this.error.set(err?.error?.Message ?? 'Could not update category.')
      });
  }

  remove(cat: Category): void {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    this.categoryService.delete(cat.categoryId).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(err?.error?.Message ?? 'Could not delete category.')
    });
  }
}
