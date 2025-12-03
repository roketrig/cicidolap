// src/app/pages/admin/admin.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product, ProductStatus, ProductCategory } from '../../models/product';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'donor' | 'recipient';
  city: string;
  donationCount: number;
  lastLogin: Date;
  isActive: boolean;
}

interface Stats {
  totalProducts: number;
  pendingApproval: number;
  totalUsers: number;
  shippedToday: number;
}

interface Settings {
  autoApprove: boolean;
  maxDailyDonations: number;
  emailNotifications: boolean;
}

interface Donor {
  name: string;
  city: string;
  count: number;
}

interface CityDistribution {
  name: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class Admin implements OnInit {
  // Enums for template
  readonly ProductStatus = ProductStatus;
  readonly ProductCategory = ProductCategory;
  
  // Data
  pendingProducts: Product[] = [];
  users: User[] = [];
  stats: Stats = {
    totalProducts: 0,
    pendingApproval: 0,
    totalUsers: 0,
    shippedToday: 0
  };
  
  // Mock data for reports
  topDonors: Donor[] = [
    { name: 'Ahmet Yılmaz', city: 'İstanbul', count: 24 },
    { name: 'Ayşe Kaya', city: 'Ankara', count: 18 },
    { name: 'Mehmet Demir', city: 'İzmir', count: 15 },
    { name: 'Fatma Şahin', city: 'Bursa', count: 12 },
    { name: 'Mustafa Çelik', city: 'Antalya', count: 9 }
  ];
  
  cityDistribution: CityDistribution[] = [
    { name: 'İstanbul', count: 124, percentage: 45 },
    { name: 'Ankara', count: 67, percentage: 25 },
    { name: 'İzmir', count: 45, percentage: 16 },
    { name: 'Bursa', count: 23, percentage: 8 },
    { name: 'Diğer', count: 18, percentage: 6 }
  ];
  
  // Settings
  settings: Settings = {
    autoApprove: false,
    maxDailyDonations: 3,
    emailNotifications: true
  };
  
  // UI State
  activeTab: 'pending' | 'users' | 'reports' | 'settings' = 'pending';
  isLoading = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAdminData();
    this.loadMockUsers();
  }

  loadAdminData() {
    this.isLoading = true;
    
    // Load all products to calculate stats
    this.productService.getProducts().subscribe({
      next: (products) => {
        // Filter pending products
        this.pendingProducts = products.filter(
          p => p.status === ProductStatus.PENDING
        );
        
        // Calculate stats
        this.stats.totalProducts = products.length;
        this.stats.pendingApproval = this.pendingProducts.length;
        this.stats.shippedToday = products.filter(
          p => p.status === ProductStatus.SHIPPED && 
          this.isToday(p.updatedAt)
        ).length;
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Admin verileri yüklenirken hata:', error);
        this.isLoading = false;
      }
    });
  }

  loadMockUsers() {
    // Mock user data
    this.users = [
      {
        id: '1',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@email.com',
        type: 'donor',
        city: 'İstanbul',
        donationCount: 24,
        lastLogin: new Date('2024-01-20'),
        isActive: true
      },
      {
        id: '2',
        name: 'Ayşe Kaya',
        email: 'ayse@email.com',
        type: 'recipient',
        city: 'Ankara',
        donationCount: 3,
        lastLogin: new Date('2024-01-19'),
        isActive: true
      },
      {
        id: '3',
        name: 'Mehmet Demir',
        email: 'mehmet@email.com',
        type: 'donor',
        city: 'İzmir',
        donationCount: 15,
        lastLogin: new Date('2024-01-18'),
        isActive: false
      },
      {
        id: '4',
        name: 'Fatma Şahin',
        email: 'fatma@email.com',
        type: 'donor',
        city: 'Bursa',
        donationCount: 12,
        lastLogin: new Date('2024-01-17'),
        isActive: true
      },
      {
        id: '5',
        name: 'Mustafa Çelik',
        email: 'mustafa@email.com',
        type: 'recipient',
        city: 'Antalya',
        donationCount: 0,
        lastLogin: new Date('2024-01-16'),
        isActive: true
      }
    ];
    
    this.stats.totalUsers = this.users.length;
  }

  // Tab Management
  setActiveTab(tab: 'pending' | 'users' | 'reports' | 'settings') {
    this.activeTab = tab;
  }

  // Product Actions
  approveProduct(product: Product) {
    if (confirm(`${product.name} ürününü onaylamak istediğinize emin misiniz?`)) {
      this.productService.updateProduct(product.id, {
        status: ProductStatus.APPROVED,
        approvedAt: new Date()
      }).subscribe({
        next: () => {
          // Remove from pending list
          this.pendingProducts = this.pendingProducts.filter(p => p.id !== product.id);
          this.stats.pendingApproval = this.pendingProducts.length;
          this.stats.totalProducts++;
          
          alert('Ürün başarıyla onaylandı!');
        },
        error: (error) => {
          alert('Ürün onaylanırken bir hata oluştu.');
        }
      });
    }
  }

  rejectProduct(product: Product) {
    const reason = prompt('Reddetme sebebini giriniz:', 'Ürün açıklaması yetersiz');
    
    if (reason !== null) {
      this.productService.updateProduct(product.id, {
        status: ProductStatus.REJECTED,
        notes: `Reddedildi: ${reason}`
      }).subscribe({
        next: () => {
          this.pendingProducts = this.pendingProducts.filter(p => p.id !== product.id);
          this.stats.pendingApproval = this.pendingProducts.length;
          alert('Ürün reddedildi.');
        },
        error: (error) => {
          alert('Ürün reddedilirken bir hata oluştu.');
        }
      });
    }
  }

  viewProductDetails(product: Product) {
    // In real app, open modal or navigate to detail
    alert(`${product.name} detayları görüntülenecek\n\nAçıklama: ${product.description}\nBağışçı: ${product.donorName}\nŞehir: ${product.donorCity}`);
  }

  // User Actions
  viewUserProfile(user: User) {
    alert(`${user.name} kullanıcı profili görüntülenecek\n\nE-posta: ${user.email}\nTip: ${user.type === 'donor' ? 'Bağışçı' : 'Alıcı'}\nBağış Sayısı: ${user.donationCount}`);
  }

  toggleUserStatus(user: User) {
    const newStatus = !user.isActive;
    const action = newStatus ? 'aktif etmek' : 'devre dışı bırakmak';
    
    if (confirm(`${user.name} kullanıcısını ${action} istediğinize emin misiniz?`)) {
      user.isActive = newStatus;
      alert(`Kullanıcı ${newStatus ? 'aktif edildi' : 'devre dışı bırakıldı'}.`);
    }
  }

  // Report Actions
  generateMonthlyReport() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('📈 Aylık rapor oluşturuldu! Rapor e-posta ile gönderildi.');
    }, 1500);
  }

  exportToExcel() {
    alert('📊 Veriler Excel formatında indiriliyor... (demo)');
  }

  printReport() {
    window.print();
  }

  // Settings Actions
  saveSettings() {
    // In real app, save to backend
    localStorage.setItem('admin-settings', JSON.stringify(this.settings));
    alert('⚙️ Ayarlar başarıyla kaydedildi!');
  }

  // Utility Methods
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  isToday(date: Date): boolean {
    const today = new Date();
    const checkDate = new Date(date);
    return (
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    );
  }

  // UI Actions
  refreshData() {
    this.isLoading = true;
    setTimeout(() => {
      this.loadAdminData();
      this.loadMockUsers();
      alert('✅ Veriler yenilendi!');
    }, 1000);
  }

  exportData() {
    alert('📁 Tüm platform verileri dışa aktarılıyor... (demo)');
  }
}