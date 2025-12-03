// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product, ProductFormData, ProductCategory, ProductCondition, AgeGroup, ProductStatus } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: '1',
      name: 'LEGO Classic Kutusu',
      description: 'Yeni, kutusunda açılmamış. Çocuklar için yaratıcı oyun seti.',
      category: ProductCategory.TOYS,
      condition: ProductCondition.NEW,
      ageGroup: AgeGroup.SCHOOL_AGE,
      images: ['https://images.unsplash.com/photo-1594787318287-7871e8b9c0f5?w=400'],
      donorId: 'user1',
      donorName: 'Ahmet Yılmaz',
      donorCity: 'İstanbul',
      status: ProductStatus.APPROVED,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      approvedAt: new Date('2024-01-16'),
      isUrgent: false
    },
    {
      id: '2',
      name: 'Çocuk Bisikleti',
      description: '20 jant, 6-9 yaş için uygun. Sadece lastikleri değiştirilmeli.',
      category: ProductCategory.OTHER,
      condition: ProductCondition.NEEDS_REPAIR,
      ageGroup: AgeGroup.SCHOOL_AGE,
      images: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w-400'],
      donorId: 'user2',
      donorName: 'Ayşe Kaya',
      donorCity: 'Ankara',
      status: ProductStatus.APPROVED,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      approvedAt: new Date('2024-01-12'),
      isUrgent: true
    },
    {
      id: '3',
      name: 'Çocuk Kitapları Seti',
      description: '10 adet resimli hikaye kitabı. Hepsi iyi durumda.',
      category: ProductCategory.BOOKS,
      condition: ProductCondition.GOOD,
      ageGroup: AgeGroup.PRESCHOOL,
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
      donorId: 'user3',
      donorName: 'Mehmet Demir',
      donorCity: 'İzmir',
      status: ProductStatus.PENDING,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      isUrgent: false
    }
  ];

  // Kategoriler
  categories = [
    { value: ProductCategory.TOYS, label: 'Oyuncak', icon: '🧸' },
    { value: ProductCategory.CLOTHING, label: 'Giyim', icon: '👕' },
    { value: ProductCategory.BOOKS, label: 'Kitap', icon: '📚' },
    { value: ProductCategory.SHOES, label: 'Ayakkabı', icon: '👟' },
    { value: ProductCategory.SCHOOL, label: 'Okul Malzemesi', icon: '🎒' },
    { value: ProductCategory.FURNITURE, label: 'Mobilya', icon: '🛏️' },
    { value: ProductCategory.ELECTRONICS, label: 'Elektronik', icon: '🎮' },
    { value: ProductCategory.OTHER, label: 'Diğer', icon: '📦' }
  ];

  // Durumlar
  conditions = [
    { value: ProductCondition.NEW, label: 'Yeni & Etiketli' },
    { value: ProductCondition.LIKE_NEW, label: 'Az Kullanılmış' },
    { value: ProductCondition.GOOD, label: 'İyi Durumda' },
    { value: ProductCondition.FAIR, label: 'Kullanılabilir' },
    { value: ProductCondition.NEEDS_REPAIR, label: 'Tamir Gerekli' }
  ];

  // Yaş Grupları
  ageGroups = [
    { value: AgeGroup.BABY, label: '0-2 Yaş' },
    { value: AgeGroup.TODDLER, label: '2-4 Yaş' },
    { value: AgeGroup.PRESCHOOL, label: '4-6 Yaş' },
    { value: AgeGroup.SCHOOL_AGE, label: '6-12 Yaş' },
    { value: AgeGroup.TEEN, label: '12+ Yaş' },
    { value: AgeGroup.ALL_AGES, label: 'Tüm Yaşlar' }
  ];

  constructor() {}

  // Tüm ürünleri getir
  getProducts(): Observable<Product[]> {
    return of(this.products).pipe(delay(500)); // Simüle network delay
  }

  // ID'ye göre ürün getir
  getProductById(id: string): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product).pipe(delay(300));
  }

  // Yeni ürün ekle
  addProduct(formData: ProductFormData): Observable<Product> {
    const newProduct: Product = {
      id: this.generateId(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      condition: formData.condition,
      ageGroup: formData.ageGroup,
      images: [], // Gerçek projede upload edilecek
      donorId: 'current-user-id', // Auth'dan gelecek
      donorName: 'Mevcut Kullanıcı', // Auth'dan gelecek
      donorCity: 'İstanbul', // User profile'dan gelecek
      status: ProductStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      isUrgent: formData.isUrgent,
      notes: formData.notes
    };

    this.products.unshift(newProduct); // En başa ekle
    return of(newProduct).pipe(delay(800));
  }

  // Ürünü güncelle
  updateProduct(id: string, updates: Partial<Product>): Observable<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      return throwError(() => new Error('Ürün bulunamadı'));
    }

    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date()
    };

    return of(this.products[index]).pipe(delay(500));
  }

  // Ürünü sil
  deleteProduct(id: string): Observable<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return of(this.products.length < initialLength).pipe(delay(300));
  }

  // Kullanıcının ürünlerini getir
  getUserProducts(userId: string): Observable<Product[]> {
    const userProducts = this.products.filter(p => p.donorId === userId);
    return of(userProducts).pipe(delay(500));
  }

  // Kategoriye göre filtrele
  getProductsByCategory(category: ProductCategory): Observable<Product[]> {
    const filtered = this.products.filter(p => p.category === category);
    return of(filtered).pipe(delay(300));
  }

  // Acil ürünleri getir
  getUrgentProducts(): Observable<Product[]> {
    const urgent = this.products.filter(p => p.isUrgent && p.status === ProductStatus.APPROVED);
    return of(urgent).pipe(delay(300));
  }

  // Yeni ürünleri getir
  getNewProducts(): Observable<Product[]> {
    const recent = [...this.products]
      .filter(p => p.status === ProductStatus.APPROVED)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);
    return of(recent).pipe(delay(300));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}