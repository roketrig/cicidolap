// src/app/app.routes.ts (veya routes.ts)
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ProductListComponent } from './pages/product-list/product-list';
import { ProductAdd } from './pages/product-add/product-add';
import { Dashboard } from './pages/dashboard/dashboard';
import { Admin } from './pages/admin/admin';
import { Login } from './pages/auth/login';
import { Register } from './pages/auth/register';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Profile } from './pages/user-profile/user-profile';
import { AuthGuard } from './guards/auth-guard';
import { AdminGuard } from './guards/admin-guard';
export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'products',
    component: ProductListComponent
  },
  {
    path: 'add-product',
    component: ProductAdd
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'product/:id',
    component: ProductDetail
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [AuthGuard] 
  },
  {
    path: '**',
    redirectTo: ''
  }
];