// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'donor' | 'recipient';
  city?: string;
  phone?: string;
  isVerified: boolean;
  role?: 'admin' | 'user'; 
  createdAt?: Date;
  lastLogin?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  userType: 'donor' | 'recipient';
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Admin email listesi
  private adminEmails: string[] = [
    'admin@cocukurunleri.com',
    'admin@example.com',
    'demo@email.com',      // Demo hesabı admin yap
    'admin@test.com',
    'superadmin@cocukurunleri.com'
  ];

  // Mock kullanıcı veritabanı
  private users: User[] = [
    {
      id: '1',
      email: 'demo@email.com',
      name: 'Demo Admin Kullanıcı',
      type: 'donor',
      city: 'İstanbul',
      phone: '0555 123 45 67',
      isVerified: true,
      role: 'admin',
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date()
    },
    {
      id: '2',
      email: 'admin@cocukurunleri.com',
      name: 'Sistem Admini',
      type: 'donor',
      city: 'Ankara',
      phone: '0555 111 22 33',
      isVerified: true,
      role: 'admin',
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date()
    },
    {
      id: '3',
      email: 'ahmet@ornek.com',
      name: 'Ahmet Yılmaz',
      type: 'donor',
      city: 'İzmir',
      phone: '0555 222 33 44',
      isVerified: true,
      role: 'user',
      createdAt: new Date('2024-01-05'),
      lastLogin: new Date('2024-01-15')
    }
  ];

  constructor(private router: Router) {
    console.log('Auth servisi başlatılıyor...');
    this.loadUserFromStorage();
  }

  // Kullanıcıyı storage'dan yükle
  private loadUserFromStorage(): void {
    console.log('Kullanıcı storage\'dan yükleniyor...');
    
    // Önce localStorage, sonra sessionStorage kontrol et
    const localStorageUser = localStorage.getItem('currentUser');
    const sessionStorageUser = sessionStorage.getItem('currentUser');
    const savedUser = localStorageUser || sessionStorageUser;
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('Storage\'dan kullanıcı bulundu:', user);
        
        // Admin kontrolü yap
        user.role = this.isAdminEmail(user.email) ? 'admin' : 'user';
        console.log('Kullanıcı rolü belirlendi:', user.role);
        
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Kayıtlı kullanıcı parse edilemedi:', error);
        this.clearStorage();
      }
    } else {
      console.log('Storage\'da kayıtlı kullanıcı bulunamadı');
    }
  }

  // Email'e göre admin kontrolü
  private isAdminEmail(email: string): boolean {
    if (!email) return false;
    const isAdmin = this.adminEmails.includes(email.toLowerCase());
    console.log(`Admin kontrolü: ${email} -> ${isAdmin ? 'ADMIN' : 'USER'}`);
    return isAdmin;
  }

  // Login method - Gerçekçi demo
  login(credentials: LoginCredentials): Observable<{ success: boolean; message: string; user?: User }> {
    console.log('Login işlemi başlatılıyor:', credentials.email);
    
    // Email kontrolü
    const email = credentials.email.toLowerCase().trim();
    
    // Var olan kullanıcıyı bul veya yeni oluştur
    let user = this.users.find(u => u.email.toLowerCase() === email);
    
    if (!user) {
      // Yeni kullanıcı oluştur
      user = this.createNewUser(email, credentials);
      this.users.push(user);
    }
    
    // Admin kontrolü yap
    user.role = this.isAdminEmail(user.email) ? 'admin' : 'user';
    user.lastLogin = new Date();
    
    console.log('Giriş yapılan kullanıcı:', {
      ...user,
      password: '***' // Güvenlik için şifreyi gizle
    });

    return of({ 
      success: true, 
      message: 'Giriş başarılı! Hoş geldiniz.',
      user: user
    }).pipe(
      delay(800), // Gerçekçi loading süresi
      tap(response => {
        console.log('Login başarılı, kullanıcı kaydediliyor...');
        this.setUser(response.user!, credentials.rememberMe);
      }),
      map(response => response)
    );
  }

  // Yeni kullanıcı oluştur
  private createNewUser(email: string, credentials: LoginCredentials): User {
    const isDemoUser = email === 'demo@email.com';
    const isAdmin = this.isAdminEmail(email);
    
    const name = isDemoUser ? 'Demo Admin Kullanıcı' : 
                email.split('@')[0].charAt(0).toUpperCase() + 
                email.split('@')[0].slice(1);
    
    return {
      id: (this.users.length + 1).toString(),
      email: email,
      name: name,
      type: Math.random() > 0.5 ? 'donor' : 'recipient',
      city: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'][Math.floor(Math.random() * 5)],
      phone: `0555 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(10 + Math.random() * 90)}`,
      isVerified: !isDemoUser, // Demo hariç doğrulanmamış
      role: isAdmin ? 'admin' : 'user',
      createdAt: new Date(),
      lastLogin: new Date()
    };
  }

  // Register method - Gerçekçi
  register(data: RegisterData): Observable<{ success: boolean; message: string; user?: User }> {
    console.log('Kayıt işlemi başlatılıyor:', data.email);
    
    // Email kontrolü
    const email = data.email.toLowerCase().trim();
    
    // Email zaten var mı?
    const existingUser = this.users.find(u => u.email.toLowerCase() === email);
    if (existingUser) {
      return of({ 
        success: false, 
        message: 'Bu email adresi zaten kullanılıyor.' 
      }).pipe(delay(800));
    }

    // Yeni kullanıcı oluştur
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      email: email,
      name: `${data.firstName} ${data.lastName}`,
      type: data.userType,
      city: data.city,
      phone: data.phone,
      isVerified: false,
      role: this.isAdminEmail(email) ? 'admin' : 'user',
      createdAt: new Date(),
      lastLogin: new Date()
    };

    // Kullanıcıyı listeye ekle
    this.users.push(newUser);
    
    console.log('Yeni kullanıcı oluşturuldu:', {
      ...newUser,
      password: '***'
    });

    return of({ 
      success: true, 
      message: 'Kayıt başarılı! Hesabınız oluşturuldu.',
      user: newUser
    }).pipe(
      delay(1500),
      tap(response => {
        console.log('Kayıt başarılı, otomatik giriş yapılıyor...');
        // Kayıt sonrası otomatik login
        this.setUser(response.user!, true);
      }),
      map(response => response)
    );
  }

  // Kullanıcıyı kaydet (storage)
  private setUser(user: User, rememberMe: boolean = false): void {
    console.log('Kullanıcı kaydediliyor (rememberMe:', rememberMe, '):', user.email);
    
    // Role kontrolü yap (güvenlik için tekrar)
    user.role = this.isAdminEmail(user.email) ? 'admin' : 'user';
    
    // Kullanıcıyı subject'e gönder
    this.currentUserSubject.next(user);
    
    // Storage'a kaydet
    if (rememberMe) {
      console.log('LocalStorage\'a kaydediliyor...');
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', 'mock-jwt-token-' + Date.now());
    } else {
      console.log('SessionStorage\'a kaydediliyor...');
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      sessionStorage.setItem('token', 'mock-jwt-token-' + Date.now());
    }
    
    console.log('Kullanıcı başarıyla kaydedildi. Admin mi?', this.isAdmin());
  }

  // Storage'ı temizle
  private clearStorage(): void {
    console.log('Storage temizleniyor...');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
  }

  // Çıkış yap
  logout(): void {
    const currentUser = this.currentUserSubject.value;
    console.log('Çıkış yapılıyor:', currentUser?.email);
    
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    
    console.log('Çıkış başarılı, login sayfasına yönlendiriliyor...');
  }

  // Kimlik doğrulama kontrolü
  isAuthenticated(): boolean {
    const isAuth = !!this.currentUserSubject.value;
    console.log('Kimlik doğrulama kontrolü:', isAuth);
    return isAuth;
  }

  // Mevcut kullanıcıyı getir
  getCurrentUser(): User | null {
    const user = this.currentUserSubject.value;
    console.log('Mevcut kullanıcı getiriliyor:', user?.email);
    return user;
  }

  // Admin kontrolü - GÜNCELLENDİ
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    const isAdmin = user ? this.isAdminEmail(user.email) : false;
    
    console.log('Admin kontrolü:', {
      userEmail: user?.email,
      isAdmin: isAdmin,
      role: user?.role
    });
    
    return isAdmin;
  }

  // Kullanıcı rolünü getir
  getUserRole(): string {
    const user = this.currentUserSubject.value;
    if (!user) return 'guest';
    
    if (this.isAdmin()) return 'admin';
    return user.type;
  }

  // Tüm kullanıcıları getir (admin için)
  getAllUsers(): User[] {
    console.log('Tüm kullanıcılar getiriliyor. Toplam:', this.users.length);
    return [...this.users];
  }

  // Profil güncelleme
  updateProfile(userData: Partial<User>): Observable<{ success: boolean; message: string }> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      return of({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    const updatedUser = { ...currentUser, ...userData };
    this.setUser(updatedUser, true);
    
    console.log('Profil güncellendi:', updatedUser.email);

    return of({ 
      success: true, 
      message: 'Profil bilgileriniz güncellendi!' 
    }).pipe(delay(800));
  }

  // Şifre değiştirme
  changePassword(oldPassword: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    console.log('Şifre değiştiriliyor...');
    return of({ 
      success: true, 
      message: 'Şifreniz başarıyla güncellendi.' 
    }).pipe(delay(1000));
  }

  // Şifre sıfırlama
  requestPasswordReset(email: string): Observable<{ success: boolean; message: string }> {
    console.log('Şifre sıfırlama isteği:', email);
    return of({ 
      success: true, 
      message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' 
    }).pipe(delay(1000));
  }

  // Admin fonksiyonları
  promoteToAdmin(userId: string): Observable<{ success: boolean; message: string }> {
    console.log('Kullanıcı admin yapılıyor:', userId);
    
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return of({ success: false, message: 'Kullanıcı bulunamadı.' });
    }
    
    // Admin listesine ekle
    if (!this.adminEmails.includes(user.email.toLowerCase())) {
      this.adminEmails.push(user.email.toLowerCase());
    }
    
    user.role = 'admin';
    
    // Eğer güncel kullanıcı bu ise subject'i güncelle
    if (this.currentUserSubject.value?.id === userId) {
      this.setUser(user, true);
    }
    
    console.log('Kullanıcı admin yapıldı:', user.email);

    return of({ 
      success: true, 
      message: 'Kullanıcı admin yapıldı.' 
    }).pipe(delay(800));
  }

  // Debug fonksiyonu
  debugAuthState(): void {
    console.group('🔍 Auth Servis Debug Bilgisi');
    console.log('Mevcut Kullanıcı:', this.currentUserSubject.value);
    console.log('Admin Emails:', this.adminEmails);
    console.log('Tüm Kullanıcılar:', this.users);
    console.log('isAuthenticated:', this.isAuthenticated());
    console.log('isAdmin:', this.isAdmin());
    console.log('LocalStorage User:', localStorage.getItem('currentUser'));
    console.log('SessionStorage User:', sessionStorage.getItem('currentUser'));
    console.groupEnd();
  }
}