import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from './api-config';
import { AppUser, RegisterDto } from '../models/user.model';

const TOKEN_KEY = 'restoran_token';

interface TokenPayload {
  nameid: string;
  email: string;
  role: string;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<AppUser | null>(this.readUserFromStorage());

  constructor(private http: HttpClient) {}

  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${API_URL}/user/register`, dto);
  }

  login(email: string, password: string): Observable<{ token: string }> {
    const params = new HttpParams().set('email', email).set('password', password);
    return this.http
      .post<{ token: string }>(`${API_URL}/user/login`, null, { params })
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.token);
          this.currentUser.set(this.decodeToken(res.token));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'Admin';
  }

  private readUserFromStorage(): AppUser | null {
    const token = this.getToken();
    if (!token) return null;
    const user = this.decodeToken(token);
    if (user && this.isExpired(token)) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return user;
  }

  private isExpired(token: string): boolean {
    const payload = this.decodePayload(token);
    if (!payload) return true;
    return payload.exp * 1000 < Date.now();
  }

  private decodeToken(token: string): AppUser | null {
    const payload = this.decodePayload(token);
    if (!payload) return null;
    return {
      id: payload.nameid,
      email: payload.email,
      role: payload.role
    };
  }

  private decodePayload(token: string): TokenPayload | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}
