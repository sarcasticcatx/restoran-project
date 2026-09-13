import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from './api-config';
import { AppUser, RegisterDto } from '../models/user.model';

//i ovdeka smeniv/dodadov za da gi vmetnam cookies 

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<AppUser | null>(null);

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${API_URL}/user/register`, dto);
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${API_URL}/user/login`, { email, password }, { withCredentials: true })
      .pipe(
        tap(() => {
          this.checkAuthStatus();
        })
      );
  }

  logout(): void {
    this.http.post(`${API_URL}/user/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.currentUser.set(null);
      },
      error: () => {
        this.currentUser.set(null);
      }
    });
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'Admin';
  }

  private checkAuthStatus(): void {
    this.http.get<AppUser>(`${API_URL}/user/me`, { withCredentials: true }).subscribe({
      next: (user) => this.currentUser.set(user),
      error: () => this.currentUser.set(null)
    });
  }
}
