// src/app/pages/auth/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface City {
  name: string;
  value: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div class="section">
  <div class="container">
    <div class="row justify-center">
      <div class="col-12 md:col-8 lg:col-6">
        <div class="card">
          <div class="card-header">
            <h2 class="text-center">Kayıt Ol</h2>
            <p class="text-center text-muted">Yeni hesap oluşturun</p>
          </div>
          
          <form class="form" (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <div class="row">
              <div class="col-12 md:col-6">
                <div class="form-group">
                  <label for="firstName" class="form-label">Ad</label>
                  <input
                    type="text"
                    id="firstName"
                    class="form-control"
                    placeholder="Adınız"
                    [(ngModel)]="userData.firstName"
                    name="firstName"
                    required>
                </div>
              </div>
              
              <div class="col-12 md:col-6">
                <div class="form-group">
                  <label for="lastName" class="form-label">Soyad</label>
                  <input
                    type="text"
                    id="lastName"
                    class="form-control"
                    placeholder="Soyadınız"
                    [(ngModel)]="userData.lastName"
                    name="lastName"
                    required>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">E-posta</label>
              <input
                type="email"
                id="email"
                class="form-control"
                placeholder="ornek@email.com"
                [(ngModel)]="userData.email"
                name="email"
                required
                email>
            </div>

            <div class="row">
              <div class="col-12 md:col-6">
                <div class="form-group">
                  <label for="password" class="form-label">Şifre</label>
                  <div class="password-input">
                    <input
                      [type]="showPassword ? 'text' : 'password'"
                      id="password"
                      class="form-control"
                      placeholder="Şifreniz"
                      [(ngModel)]="userData.password"
                      name="password"
                      required
                      minlength="6">
                    <button type="button" class="password-toggle" (click)="togglePassword()">
                      {{ showPassword ? '🙈' : '👁️' }}
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="col-12 md:col-6">
                <div class="form-group">
                  <label for="confirmPassword" class="form-label">Şifre Tekrar</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    class="form-control"
                    placeholder="Şifrenizi tekrar girin"
                    [(ngModel)]="confirmPassword"
                    name="confirmPassword"
                    required>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 md:col-6">
                <div class="form-group">
                  <label for="phone" class="form-label">Telefon</label>
                  <input
                    type="tel"
                    id="phone"
                    class="form-control"
                    placeholder="05XX XXX XX XX"
                    [(ngModel)]="userData.phone"
                    name="phone"
                    pattern="[0-9]{10,11}">
                </div>
              </div>
              
              <div class="col-12 md:col-6">
                <div class="form-group">
                  <label for="city" class="form-label">Şehir</label>
                  <select
                    id="city"
                    class="form-control"
                    [(ngModel)]="userData.city"
                    name="city">
                    <option value="" disabled selected>Şehir seçin</option>
                    <option *ngFor="let city of cities" [value]="city.value">
                      {{ city.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Kullanıcı Tipi</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input
                    type="radio"
                    name="userType"
                    value="donor"
                    [(ngModel)]="userData.userType"
                    checked>
                  <span class="radio-custom"></span>
                  <span class="radio-label">Bağışçı Olmak İstiyorum</span>
                </label>
                
                <label class="radio-option">
                  <input
                    type="radio"
                    name="userType"
                    value="recipient"
                    [(ngModel)]="userData.userType">
                  <span class="radio-custom"></span>
                  <span class="radio-label">Ürün Talep Etmek İstiyorum</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox">
                <input type="checkbox" [(ngModel)]="acceptTerms" name="acceptTerms" required>
                <span>
                  <a routerLink="/terms" class="link">Kullanım Koşulları</a>'nı
                  ve 
                  <a routerLink="/privacy" class="link">Gizlilik Politikası</a>'nı
                  okudum ve kabul ediyorum.
                </span>
              </label>
              <div *ngIf="registerForm.submitted && !acceptTerms" class="error-text">
                Kullanım koşullarını kabul etmelisiniz
              </div>
            </div>

            <button 
              type="submit" 
              class="btn btn-primary btn-lg w-100" 
              [disabled]="loading || !acceptTerms">
              <span *ngIf="!loading">Hesap Oluştur</span>
              <span *ngIf="loading">Kayıt yapılıyor...</span>
            </button>

            <div class="text-center mt-3">
              <p class="text-muted">Zaten hesabınız var mı?</p>
              <a routerLink="/login" class="btn btn-outline w-100">
                Giriş Yap
              </a>
            </div>
          </form>
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
    
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    
    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      padding: 0.75rem;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-md);
      transition: all 0.2s;
    }
    
    .radio-option:hover {
      border-color: var(--primary-light);
    }
    
    .radio-option input {
      display: none;
    }
    
    .radio-option input:checked + .radio-custom {
      border-color: var(--primary-color);
    }
    
    .radio-option input:checked + .radio-custom::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      background: var(--primary-color);
      border-radius: 50%;
    }
    
    .radio-custom {
      width: 18px;
      height: 18px;
      border: 2px solid var(--border-color);
      border-radius: 50%;
      position: relative;
      flex-shrink: 0;
    }
    
    .radio-label {
      font-weight: 500;
    }
    
    .checkbox {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
    }
    
    .checkbox input {
      margin-top: 0.25rem;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    
    .text-muted {
      color: var(--text-light);
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
    
    select.form-control {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236B7280' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 16px;
      padding-right: 2.5rem;
    }
  `]
})
export class Register {
  userData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    userType: 'donor'
  };
  
  confirmPassword = '';
  acceptTerms = false;
  showPassword = false;
  loading = false;

  cities: City[] = [
    { name: 'İstanbul', value: 'istanbul' },
    { name: 'Ankara', value: 'ankara' },
    { name: 'İzmir', value: 'izmir' },
    { name: 'Bursa', value: 'bursa' },
    { name: 'Antalya', value: 'antalya' },
    { name: 'Adana', value: 'adana' },
    { name: 'Konya', value: 'konya' },
    { name: 'Gaziantep', value: 'gaziantep' }
  ];

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.userData.password !== this.confirmPassword) {
      alert('Şifreler eşleşmiyor!');
      return;
    }
    
    this.loading = true;
    console.log('Kayıt yapılıyor:', this.userData);
    
    // Simüle API call
    setTimeout(() => {
      this.loading = false;
      alert('Kayıt başarılı! (simülasyon)');
    }, 1500);
  }
}