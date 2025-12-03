// src/app/pages/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product, ProductCategory, ProductStatus } from '../../models/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  readonly ProductStatus = ProductStatus;
  readonly ProductCategory = ProductCategory; 

  // Filters
  selectedCategory: ProductCategory | '' = '';
  selectedCondition = '';
  sortBy = 'newest';
  searchTerm = '';

  // Stats
  totalProducts = 0;
  approvedProducts = 0;
  urgentProducts = 0;
  pendingProducts = 0;

  // Data for filters
  categories: any[] = [];
  conditions: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();
    this.categories = this.productService.categories;
    this.conditions = this.productService.conditions;
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.calculateStats();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ürünler yüklenirken hata:', error);
        this.isLoading = false;
      }
    });
  }

  calculateStats() {
    this.totalProducts = this.products.length;
    this.approvedProducts = this.products.filter(p => p.status === ProductStatus.APPROVED).length;
    this.urgentProducts = this.products.filter(p => p.isUrgent).length;
    this.pendingProducts = this.products.filter(p => p.status === ProductStatus.PENDING).length;
  }

  filterByCategory(category: ProductCategory | '') {
    this.selectedCategory = this.selectedCategory === category ? '' : category;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.products];

    // Kategori filtresi
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Durum filtresi
    if (this.selectedCondition) {
      filtered = filtered.filter(p => p.condition === this.selectedCondition);
    }

    // Arama filtresi
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    // Sıralama
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'urgent':
          return (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0) ||
            b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

    this.filteredProducts = filtered;
  }

  clearFilters() {
    this.selectedCategory = '';
    this.selectedCondition = '';
    this.searchTerm = '';
    this.sortBy = 'newest';
    this.filteredProducts = [...this.products];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case ProductStatus.PENDING: return 'status-pending';
      case ProductStatus.APPROVED: return 'status-approved';
      case ProductStatus.RESERVED: return 'status-reserved';
      default: return '';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  requestProduct(product: Product) {
    this.isLoading = true;

    // Simüle API call
    setTimeout(() => {
      this.isLoading = false;
      alert(`✅ ${product.name} ürünü talep edildi!\n\nEn kısa sürede bağışçı ile iletişime geçilecektir.`);

      // Ürün durumunu güncelle
      this.productService.updateProduct(product.id, {
        status: ProductStatus.RESERVED
      }).subscribe({
        next: (updatedProduct) => {
          // Liste güncelle
          const index = this.products.findIndex(p => p.id === product.id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
            this.applyFilters();
          }
        }
      });
    }, 1000);
  }
}