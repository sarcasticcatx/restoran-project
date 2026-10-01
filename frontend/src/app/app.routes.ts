import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingComponent)
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'menu/:id',
    loadComponent: () =>
      import('./pages/menu-detail/menu-detail.component').then((m) => m.MenuDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then((m) => m.CartComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/my-orders/my-orders.component').then((m) => m.MyOrdersComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'menus', pathMatch: 'full' },
      {
        path: 'menus',
        loadComponent: () =>
          import('./pages/admin/admin-menus/admin-menus.component').then(
            (m) => m.AdminMenusComponent
          )
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/admin/admin-categories/admin-categories.component').then(
            (m) => m.AdminCategoriesComponent
          )
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/admin/admin-orders/admin-orders.component').then(
            (m) => m.AdminOrdersComponent
          )
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
