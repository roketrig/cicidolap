// src/app/pages/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Auth, LoginCredentials } from '../../services/auth'; // Auth servisi

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
          
          <form class="form" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <!-- Email -->
            <div class="form-group">
              <label for="email" class="form-label">E-posta</label>
              <input
                type="email"
                id="email"
                class="form-control"
                [class.is-invalid]="f['email']?.invalid && (f['email']?.touched || submitted)"
                placeholder="ornek@email.com"
                formControlName="email">
              
              <div *ngIf="f['email']?.invalid && (f['email']?.touched || submitted)" class="error-text">
                <span *ngIf="f['email']?.errors?.['required']">E-posta zorunludur</span>
                <span *ngIf="f['email']?.errors?.['email']">Geçerli bir e-posta adresi girin</span>
              </div>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label for="password" class="form-label">Şifre</label>
              <div class="password-input">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  class="form-control"
                  [class.is-invalid]="f['password']?.invalid && (f['password']?.touched || submitted)"
                  placeholder="Şifreniz"
                  formControlName="password">
                <button 
                  type="button" 
                  class="password-toggle" 
                  (click)="togglePassword()"
                  tabindex="-1">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              
              <div *ngIf="f['password']?.invalid && (f['password']?.touched || submitted)" class="error-text">
                <span *ngIf="f['password']?.errors?.['required']">Şifre zorunludur</span>
                <span *ngIf="f['password']?.errors?.['minlength']">En az 6 karakter olmalıdır</span>
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="form-options">
              <label class="checkbox">
                <input type="checkbox" formControlName="rememberMe">
                <span>Beni hatırla</span>
              </label>
              <a routerLink="/forgot-password" class="forgot-link">Şifremi unuttum</a>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="alert alert-error mb-3">
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              class="btn btn-primary btn-lg w-100" 
              [disabled]="loading || loginForm.invalid">
              <span *ngIf="!loading">Giriş Yap</span>
              <span *ngIf="loading">Giriş yapılıyor...</span>
            </button>

            <div class="divider">
              <span>veya</span>
            </div>

            <!-- Register Link -->
            <div class="text-center">
              <p class="text-muted">Hesabınız yok mu?</p>
              <a routerLink="/register" class="btn btn-outline w-100">
                Hemen Kayıt Ol
              </a>
            </div>
          </form>
        </div>

        <!-- Terms -->
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
    
    .mb-3 {
      margin-bottom: 1rem;
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
      color: #666;
      z-index: 2;
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
      font-size: 0.9rem;
    }
    
    .checkbox input {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    
    .forgot-link {
      color: var(--primary-color, #4CAF50);
      font-size: 0.9rem;
      text-decoration: none;
    }
    
    .forgot-link:hover {
      text-decoration: underline;
    }
    
    .divider {
      display: flex;
      align-items: center;
      margin: 1.5rem 0;
      color: var(--text-light, #666);
    }
    
    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--border-color, #ddd);
    }
    
    .divider span {
      padding: 0 1rem;
      background: white;
    }
    
    .text-muted {
      color: var(--text-light, #666);
    }
    
    .text-small {
      font-size: 0.875rem;
    }
    
    .link {
      color: var(--primary-color, #4CAF50);
      text-decoration: underline;
    }
    
    .error-text {
      color: var(--danger-color, #dc3545);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .alert {
      padding: 0.75rem 1rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    
    .alert-error {
      background-color: rgba(220, 53, 69, 0.1);
      border: 1px solid rgba(220, 53, 69, 0.2);
      color: var(--danger-color, #dc3545);
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color, #ddd);
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--primary-color, #4CAF50);
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }
    
    .form-control.is-invalid {
      border-color: var(--danger-color, #dc3545);
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
      display: inline-block;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-primary {
      background-color: var(--primary-color, #4CAF50);
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: var(--primary-dark, #45a049);
    }
    
    .btn-outline {
      background-color: transparent;
      border: 1px solid var(--primary-color, #4CAF50);
      color: var(--primary-color, #4CAF50);
    }
    
    .btn-outline:hover {
      background-color: rgba(76, 175, 80, 0.1);
    }
    
    .btn-lg {
      padding: 0.875rem 1.75rem;
      font-size: 1.125rem;
    }
    
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }
    
    .card-header {
      margin-bottom: 2rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text-color, #333);
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .col-12 {
        padding: 0 15px;
      }
      .card {
        padding: 1.5rem;
      }
    }
  `]
})
export class Login implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  showPassword = false;
  errorMessage = '';
  returnUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Form oluştur
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Return URL'yi al
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  ngOnInit(): void {
    // Eğer zaten giriş yapılmışsa yönlendir
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  // Form kontrollerine kolay erişim
  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    
    // Form geçersizse işlemi durdur
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Auth servisinden login işlemi
    const credentials: LoginCredentials = this.loginForm.value;
    
    this.auth.login(credentials).subscribe({
      next: (response: any) => {
        this.loading = false;
        
        if (response.success) {
          // Başarılı giriş - dashboard'a yönlendir
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.errorMessage = response.message || 'Giriş başarısız!';
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.';
        console.error('Login error:', error);
      }
    });
  }
}