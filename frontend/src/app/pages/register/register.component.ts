import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { RegisterDto } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  dto: RegisterDto = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Customer'
  };

  error = signal('');
  success = signal(false);
  loading = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  submit(): void {
    this.error.set('');
    this.loading.set(true);
    this.auth.register(this.dto).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(this.parseError(err));
      }
    });
  }

  private parseError(err: any): string {
    const errors = err?.error;
    if (Array.isArray(errors)) {
      return errors.map((e: any) => e.description ?? e).join(' ');
    }
    return errors?.message ?? 'Registration failed.';
  }
}
