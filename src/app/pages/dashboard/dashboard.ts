// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product, ProductStatus } from '../../models/product';

interface UserStats {
  totalDonations: number;
  deliveredDonations: number;
  pendingDonations: number;
  receivedProducts: number;
}

interface Activity {
  icon: string;
  text: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  // Enums for template
  readonly productStatusEnum = ProductStatus;
  
  // User data
  userStats: UserStats = {
    totalDonations: 0,
    deliveredDonations: 0,
    pendingDonations: 0,
    receivedProducts: 0
  };
  
  // Products
  userProducts: Product[] = [];
  requestedProducts: Product[] = [];
  isLoading = false;
  
  // Recent activities
  recentActivities: Activity[] = [
    {
      icon: '📦',
      text: '"LEGO Classic Kutusu" ürününüz onaylandı ve yayında',
      time: '2 saat önce'
    },
    {
      icon: '🚚',
      text: '"Çocuk Bisikleti" ürününüz kargoya verildi',
      time: '1 gün önce'
    },
    {
      icon: '👤',
      text: 'Mehmet Kaya sizinle iletişime geçmek istiyor',
      time: '2 gün önce'
    },
    {
      icon: '❤️',
      text: 'Yeni bağışçı oldunuz, tebrikler!',
      time: '1 hafta önce'
    }
  ];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Simulate user ID (in real app, get from auth service)
    const userId = 'user1';
    
    // Load user's products
    this.productService.getUserProducts(userId).subscribe({
      next: (products) => {
        this.userProducts = products;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Dashboard verileri yüklenirken hata:', error);
        this.isLoading = false;
      }
    });
    
    // For demo, use some products as requested products
    this.productService.getProducts().subscribe(products => {
      this.requestedProducts = products
        .filter(p => p.status === ProductStatus.RESERVED || p.status === ProductStatus.SHIPPED)
        .slice(0, 3);
    });
  }

  calculateStats() {
    this.userStats.totalDonations = this.userProducts.length;
    this.userStats.deliveredDonations = this.userProducts.filter(
      p => p.status === ProductStatus.DELIVERED
    ).length;
    this.userStats.pendingDonations = this.userProducts.filter(
      p => p.status === ProductStatus.PENDING
    ).length;
    this.userStats.receivedProducts = this.requestedProducts.length;
  }

  getStatusClass(status: ProductStatus): string {
    switch (status) {
      case ProductStatus.PENDING: return 'status-pending';
      case ProductStatus.APPROVED: return 'status-approved';
      case ProductStatus.RESERVED: return 'status-reserved';
      case ProductStatus.SHIPPED: return 'status-shipped';
      case ProductStatus.DELIVERED: return 'status-delivered';
      default: return '';
    }
  }

  getStatusText(status: ProductStatus): string {
    return status;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Product Actions
  viewProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  editProduct(product: Product) {
    if (product.status !== ProductStatus.PENDING) {
      alert('Sadece onay bekleyen ürünler düzenlenebilir.');
      return;
    }
    // In real app, navigate to edit page
    alert(`${product.name} ürünü düzenlenecek (demo)`);
  }

  deleteProduct(product: Product) {
    if (product.status !== ProductStatus.PENDING) {
      alert('Sadece onay bekleyen ürünler silinebilir.');
      return;
    }
    
    if (confirm(`${product.name} ürününü silmek istediğinize emin misiniz?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: (success) => {
          if (success) {
            this.userProducts = this.userProducts.filter(p => p.id !== product.id);
            this.calculateStats();
            alert('Ürün başarıyla silindi.');
          }
        },
        error: (error) => {
          alert('Ürün silinirken bir hata oluştu.');
        }
      });
    }
  }

  contactRecipient(product: Product) {
    alert(`${product.name} ürününün alıcısı ile iletişime geçilecek (demo)`);
  }

  cancelRequest(product: Product) {
    if (product.status !== ProductStatus.RESERVED) {
      alert('Sadece rezerve edilmiş talepler iptal edilebilir.');
      return;
    }
    
    if (confirm('Bu talebi iptal etmek istediğinize emin misiniz?')) {
      // Update product status back to APPROVED
      this.productService.updateProduct(product.id, {
        status: ProductStatus.APPROVED
      }).subscribe({
        next: () => {
          this.requestedProducts = this.requestedProducts.filter(p => p.id !== product.id);
          this.calculateStats();
          alert('Talep başarıyla iptal edildi.');
        },
        error: () => {
          alert('Talep iptal edilirken bir hata oluştu.');
        }
      });
    }
  }

  // Quick Actions
  printShippingLabel() {
    alert('Kargo etiketi yazdırma sayfası açılacak (demo)');
  }

  openFAQ() {
    alert('Sık Sorulan Sorular sayfası açılacak (demo)');
  }

  contactSupport() {
    alert('Destek ekibi ile iletişim sayfası açılacak (demo)');
  }

  // Add a test method to simulate product addition
  addTestProduct() {
    const testProduct: Partial<Product> = {
      name: 'Test Ürünü',
      description: 'Bu bir test ürünüdür.',

      status: ProductStatus.PENDING,
      donorId: 'user1'
    };
    
    // This would be called when user adds a new product
    alert('Yeni test ürünü eklendi (demo)');
  }
}