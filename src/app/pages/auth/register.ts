// src/app/pages/auth/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, RegisterData } from '../../services/auth';

interface City {
  name: string;
  value: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  registerData: RegisterData = {
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
  showConfirmPassword = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

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

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  togglePassword(field: 'password' | 'confirm' = 'password') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    // Validation
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.register(this.registerData).subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response.success) {
          this.successMessage = response.message;
          // Otomatik login yapabiliriz veya login sayfasına yönlendirebiliriz
          setTimeout(() => {
            this.router.navigate(['/login'], {
              queryParams: { registered: 'true' }
            });
          }, 2000);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.';
        console.error('Registration error:', error);
      }
    });
  }

  private validateForm(): boolean {
    // Required fields
    if (!this.registerData.firstName || 
        !this.registerData.lastName || 
        !this.registerData.email || 
        !this.registerData.password || 
        !this.registerData.phone || 
        !this.registerData.city) {
      this.errorMessage = 'Tüm zorunlu alanları doldurun.';
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.errorMessage = 'Geçerli bir e-posta adresi girin.';
      return false;
    }

    // Password validation
    if (this.registerData.password.length < 6) {
      this.errorMessage = 'Şifre en az 6 karakter olmalıdır.';
      return false;
    }

    // Password confirmation
    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Şifreler eşleşmiyor!';
      return false;
    }

    // Terms acceptance
    if (!this.acceptTerms) {
      this.errorMessage = 'Kullanım koşullarını kabul etmelisiniz.';
      return false;
    }

    return true;
  }
}