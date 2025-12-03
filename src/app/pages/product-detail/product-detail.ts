// src/app/pages/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product, ProductStatus, ProductCategory } from '../../models/product';

interface DonorStats {
  totalDonations: number;
  rating: number;
  bio: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetail implements OnInit {
  // Enums for template
  readonly productStatusEnum = ProductStatus;
  readonly productCategoryEnum = ProductCategory;
  
  // Product data
  product: Product | null = null;
  selectedImage: string | null = null;
  
  // Related data
  similarProducts: Product[] = [];
  donorStats: DonorStats = {
    totalDonations: 0,
    rating: 4.8,
    bio: '2 yıldır platformumuzda aktif bağışçı. Özellikle çocuk kitapları ve oyuncak bağışlıyor.'
  };
  
  // UI State
  isLoading = true;
  isRequesting = false;
  showLightbox = false;
  lightboxImage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  loadProduct(productId: string) {
    this.isLoading = true;
    
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          this.loadSimilarProducts(product);
          this.loadDonorStats(product.donorId);
        } else {
          // Product not found
          this.product = null;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ürün yüklenirken hata:', error);
        this.isLoading = false;
        this.product = null;
      }
    });
  }

  loadSimilarProducts(product: Product) {
    this.productService.getProductsByCategory(product.category).subscribe({
      next: (products) => {
        // Filter out current product and take 4 similar ones
        this.similarProducts = products
          .filter(p => p.id !== product.id && p.status === ProductStatus.APPROVED)
          .slice(0, 4);
      }
    });
  }

  loadDonorStats(donorId: string) {
    // In real app, fetch donor stats from API
    // For now, use mock data
    this.productService.getUserProducts(donorId).subscribe(products => {
      this.donorStats.totalDonations = products.length;
    });
  }

  // Image Handling
  selectImage(image: string) {
    this.selectedImage = image;
  }

  openImageLightbox(image: string) {
    this.lightboxImage = image;
    this.showLightbox = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  closeLightbox() {
    this.showLightbox = false;
    document.body.style.overflow = ''; // Restore scrolling
  }

  // Product Actions
  requestProduct() {
    if (!this.product) return;
    
    this.isRequesting = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isRequesting = false;
      
      // Update product status
      if (this.product) {
        this.productService.updateProduct(this.product.id, {
          status: ProductStatus.RESERVED
        }).subscribe({
          next: (updatedProduct) => {
            this.product = updatedProduct;
            alert(`✅ ${this.product?.name} ürünü başarıyla talep edildi!\n\nBağışçı ile platform üzerinden iletişime geçilecektir.`);
          }
        });
      }
    }, 1500);
  }

  addToWishlist() {
    if (this.product) {
      // In real app, save to user's wishlist
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (!wishlist.includes(this.product.id)) {
        wishlist.push(this.product.id);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert('⭐ Ürün favorilere eklendi!');
      } else {
        alert('Bu ürün zaten favorilerinizde.');
      }
    }
  }

  shareProduct() {
    if (this.product && navigator.share) {
      navigator.share({
        title: this.product.name,
        text: this.product.description.substring(0, 100) + '...',
        url: window.location.href
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('🔗 Bağlantı panoya kopyalandı!');
    }
  }

  contactDonor() {
    if (this.product) {
      alert(`💬 ${this.product.donorName} bağışçısı ile iletişim kurulacak\n\nPlatformun mesajlaşma sistemi üzerinden iletişime geçilecektir.`);
    }
  }

  // Utility Methods
  getStatusClass(status: ProductStatus): string {
    switch (status) {
      case ProductStatus.PENDING: return 'status-pending';
      case ProductStatus.APPROVED: return 'status-approved';
      case ProductStatus.RESERVED: return 'status-reserved';
      case ProductStatus.SHIPPED: return 'status-shipped';
      case ProductStatus.DELIVERED: return 'status-delivered';
      case ProductStatus.REJECTED: return 'status-rejected';
      default: return '';
    }
  }

  getStatusText(status: ProductStatus): string {
    const statusMap: Record<ProductStatus, string> = {
      [ProductStatus.PENDING]: 'Onay Bekliyor',
      [ProductStatus.APPROVED]: 'Yayında',
      [ProductStatus.RESERVED]: 'Rezerve Edildi',
      [ProductStatus.SHIPPED]: 'Kargoda',
      [ProductStatus.DELIVERED]: 'Teslim Edildi',
      [ProductStatus.REJECTED]: 'Reddedildi'
    };
    return statusMap[status] || status;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}