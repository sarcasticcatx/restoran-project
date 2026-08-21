import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { ReviewService } from '../../services/review.service';
import { CartService } from '../../core/cart.service';
import { AuthService } from '../../core/auth.service';
import { Menu } from '../../models/menu.model';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-menu-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './menu-detail.component.html',
  styleUrl: './menu-detail.component.scss'
})
export class MenuDetailComponent implements OnInit {
  menu = signal<Menu | null>(null);
  reviews = signal<Review[]>([]);
  quantity = signal(1);
  loading = signal(true);

  newRating = 5;
  newComment = '';
  submitError = '';
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private reviewService: ReviewService,
    public cart: CartService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const menuId = Number(this.route.snapshot.paramMap.get('id'));
    this.menuService.getById(menuId).subscribe({
      next: (menu) => {
        this.menu.set(menu);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
    this.loadReviews(menuId);
  }

  loadReviews(menuId: number): void {
    this.reviewService.getForMenu(menuId).subscribe((reviews) => this.reviews.set(reviews));
  }

  changeQuantity(delta: number): void {
    this.quantity.set(Math.max(1, this.quantity() + delta));
  }

  addToCart(): void {
    const menu = this.menu();
    if (!menu) return;
    this.cart.add(menu, this.quantity());
  }

  submitReview(): void {
    const menu = this.menu();
    const user = this.auth.currentUser();
    if (!menu || !user) return;

    this.submitError = '';
    this.submitting = true;

    const review: Review = {
      userId: user.id,
      menuId: menu.menuId,
      rating: this.newRating,
      comment: this.newComment
    };

    this.reviewService.create(review).subscribe({
      next: () => {
        this.newComment = '';
        this.newRating = 5;
        this.submitting = false;
        this.loadReviews(menu.menuId);
      },
      error: (err) => {
        this.submitError = err?.error?.Message ?? 'Could not submit review.';
        this.submitting = false;
      }
    });
  }
}
