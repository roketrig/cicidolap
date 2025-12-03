// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <!-- Header -->
    <header class="header">
      <div class="container">
        <nav class="navbar">
          <div class="navbar-brand">
            <a routerLink="/" class="logo">
              <span class="logo-icon">🎁</span>
              <span class="logo-text">CiciDolap</span>
            </a>
          </div>
          
          <div class="navbar-menu">
            <a routerLink="/" routerLinkActive="active" class="nav-link">Ana Sayfa</a>
            <a routerLink="/products" routerLinkActive="active" class="nav-link">Ürünler</a>
            <a routerLink="/add-product" routerLinkActive="active" class="nav-link">Ürün Ekle</a>
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
            <a routerLink="/admin" class="nav-link">Admin</a>
          </div>
          
          <div class="navbar-actions">
            <a routerLink="/login" class="btn btn-outline btn-sm">Giriş Yap</a>
            <a routerLink="/register" class="btn btn-primary btn-sm">Kayıt Ol</a>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main">
      <router-outlet></router-outlet>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>CiciDolap</h3>
            <p>Kullanmadığınız çocuk ürünlerini bağışlayın, ihtiyaç sahiplerine ulaştıralım.</p>
          </div>
          
          <div class="footer-section">
            <h4>Hızlı Bağlantılar</h4>
            <a routerLink="/products">Ürünleri Gör</a>
            <a routerLink="/add-product">Ürün Bağışla</a>
            <a routerLink="/dashboard">Dashboard</a>
          </div>
          
          <div class="footer-section">
            <h4>İletişim</h4>
            <p>destek@cocukurunleri.com</p>
            <p>+90 555 123 45 67</p>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>© 2024 Çocuk Ürünleri Platformu - Tüm hakları saklıdır</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .header {
      background: white;
      box-shadow: var(--shadow-md);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--text-color);
    }
    
    .logo-icon {
      font-size: 1.5rem;
    }
    
    .navbar-menu {
      display: flex;
      gap: 2rem;
    }
    
    .nav-link {
      color: var(--text-light);
      font-weight: 500;
      padding: 0.5rem 0;
      position: relative;
      
      &:hover, &.active {
        color: var(--primary-color);
      }
      
      &.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary-color);
        border-radius: var(--radius-full);
      }
    }
    
    .navbar-actions {
      display: flex;
      gap: 1rem;
    }
    
    .main {
      min-height: calc(100vh - 140px);
    }
    
    .footer {
      background: var(--bg-dark);
      color: white;
      padding: 3rem 0 1.5rem;
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .footer-section h3, .footer-section h4 {
      color: white;
      margin-bottom: 1rem;
    }
    
    .footer-section a {
      display: block;
      color: #d1d5db;
      margin-bottom: 0.5rem;
      
      &:hover {
        color: white;
      }
    }
    
    .footer-bottom {
      border-top: 1px solid #374151;
      padding-top: 1.5rem;
      text-align: center;
      color: #9ca3af;
    }
  `]
})
export class App {
  title = 'Çocuk Ürünleri Platformu';
}