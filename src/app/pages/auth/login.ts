// src/app/pages/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div class="section">
  <div class="container">
    <div class="row justify-center">
      <div class="col-12 md:col-6 lg:col-4">
        <div class="card">
          <div class="card-header">
            <h2 class="text-center">Giriş Yap</h2>
            <p class="text-center text-muted">Platforma erişim için giriş yapın</p>
          </div>
          
          <form class="form" (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="form-group">
              <label for="email" class="form-label">E-posta</label>
              <input
                type="email"
                id="email"
                class="form-control"
                placeholder="ornek@email.com"
                [(ngModel)]="credentials.email"
                name="email"
                required
                email>
              <div *ngIf="loginForm.submitted && loginForm.controls['email']?.errors" class="error-text">
                Lütfen geçerli bir e-posta adresi girin
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Şifre</label>
              <div class="password-input">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  class="form-control"
                  placeholder="Şifreniz"
                  [(ngModel)]="credentials.password"
                  name="password"
                  required
                  minlength="6">
                <button type="button" class="password-toggle" (click)="togglePassword()">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <div *ngIf="loginForm.submitted && loginForm.controls['password']?.errors" class="error-text">
                Şifre en az 6 karakter olmalıdır
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox">
                <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">
                <span>Beni hatırla</span>
              </label>
              <a routerLink="/forgot-password" class="forgot-link">Şifremi unuttum</a>
            </div>

            <button type="submit" class="btn btn-primary btn-lg w-100" [disabled]="loading">
              <span *ngIf="!loading">Giriş Yap</span>
              <span *ngIf="loading">Giriş yapılıyor...</span>
            </button>

            <div class="divider">
              <span>veya</span>
            </div>

            <div class="text-center">
              <p class="text-muted">Hesabınız yok mu?</p>
              <a routerLink="/register" class="btn btn-outline w-100">
                Hemen Kayıt Ol
              </a>
            </div>
          </form>
        </div>

        <div class="text-center mt-3">
          <p class="text-small text-muted">
            Giriş yaparak 
            <a routerLink="/terms" class="link">Kullanım Koşulları</a>'nı 
            kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
    .justify-center {
      justify-content: center;
    }
    
    .w-100 {
      width: 100%;
    }
    
    .password-input {
      position: relative;
    }
    
    .password-toggle {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.25rem;
    }
    
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem 0;
    }
    
    .checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    
    .checkbox input {
      width: 18px;
      height: 18px;
    }
    
    .forgot-link {
      color: var(--primary-color);
      font-size: 0.9rem;
    }
    
    .divider {
      display: flex;
      align-items: center;
      margin: 1.5rem 0;
      color: var(--text-light);
    }
    
    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--border-color);
    }
    
    .divider span {
      padding: 0 1rem;
    }
    
    .text-muted {
      color: var(--text-light);
    }
    
    .text-small {
      font-size: 0.875rem;
    }
    
    .link {
      color: var(--primary-color);
      text-decoration: underline;
    }
    
    .error-text {
      color: var(--danger-color);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class Login {
  credentials = {
    email: '',
    password: ''
  };
  
  rememberMe = false;
  showPassword = false;
  loading = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.loading = true;
    console.log('Giriş yapılıyor:', this.credentials);
    
    // Simüle API call
    setTimeout(() => {
      this.loading = false;
      alert('Giriş başarılı! (simülasyon)');
    }, 1500);
  }
}