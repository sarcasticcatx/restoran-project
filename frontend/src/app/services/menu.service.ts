import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../core/api-config';
import { Menu } from '../models/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${API_URL}/menus`);
  }

  getById(menuId: number): Observable<Menu> {
    return this.http.get<Menu>(`${API_URL}/menus/${menuId}`);
  }

  getByCategory(categoryId: number): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${API_URL}/menus/category/${categoryId}`);
  }

  create(menu: Partial<Menu>): Observable<Menu> {
    return this.http.post<Menu>(`${API_URL}/menus`, menu);
  }

  update(menuId: number, menu: Partial<Menu>): Observable<void> {
    return this.http.put<void>(`${API_URL}/menus/${menuId}`, menu);
  }

  delete(menuId: number): Observable<any> {
    return this.http.delete(`${API_URL}/menus/${menuId}`);
  }
}
