// src/app/app.routes.ts
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
    component: Home,
    title: 'Ana Sayfa - CiciDolap'
  },
  {
    path: 'products',
    component: ProductListComponent,
    title: 'Ürünler'
  },
  {
    path: 'add-product',
    component: ProductAdd,
    canActivate: [AuthGuard], // AuthGuard ekle
    title: 'Ürün Ekle'
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard], // AuthGuard ekle
    title: 'Dashboard'
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [AuthGuard, AdminGuard],
    title: 'Admin Paneli'
  },
  {
    path: 'login',
    component: Login,
    title: 'Giriş Yap'
  },
  {
    path: 'register',
    component: Register,
    title: 'Kayıt Ol'
  },
  {
    path: 'product/:id',
    component: ProductDetail,
    title: 'Ürün Detayı'
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [AuthGuard],
    title: 'Profilim'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];