import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../core/api-config';
import { Review } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private http: HttpClient) {}

  getForMenu(menuId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${API_URL}/reviews/menu/${menuId}`);
  }

  create(review: Review): Observable<Review> {
    return this.http.post<Review>(`${API_URL}/reviews`, review);
  }

  delete(reviewId: number): Observable<any> {
    return this.http.delete(`${API_URL}/reviews/${reviewId}`);
  }
}
