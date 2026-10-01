import { Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../core/auth.service';
import { Menu } from '../../models/menu.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  featured = signal<Menu[]>([]);

  constructor(
    private menuService: MenuService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.menuService.getAll().subscribe({
      next: (menus) => this.featured.set(menus.slice(0, 6)),
      error: () => this.featured.set([])
    });
  }
}
