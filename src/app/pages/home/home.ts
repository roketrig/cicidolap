// src/app/pages/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product, ProductStatus } from '../../models/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  featuredProducts: Product[] = [];
  isLoading = true;
  
  // For template use
  readonly ProductStatus = ProductStatus;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts() {
    this.isLoading = true;
    
    // Get approved products and take first 6
    this.productService.getProducts().subscribe({
      next: (products) => {
        // Filter only approved products and take first 6
        this.featuredProducts = products
          .filter(product => product.status === ProductStatus.APPROVED)
          .slice(0, 6);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Öne çıkan ürünler yüklenirken hata:', error);
        this.isLoading = false;
      }
    });
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }
}