import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../core/api-config';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API_URL}/categories`);
  }

  getById(categoryId: number): Observable<Category> {
    return this.http.get<Category>(`${API_URL}/categories/${categoryId}`);
  }

  create(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${API_URL}/categories`, category);
  }

  update(categoryId: number, category: Partial<Category>): Observable<void> {
    return this.http.put<void>(`${API_URL}/categories/${categoryId}`, category);
  }

  delete(categoryId: number): Observable<any> {
    return this.http.delete(`${API_URL}/categories/${categoryId}`);
  }
}
