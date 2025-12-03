// src/app/models/product.model.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  condition: ProductCondition;
  ageGroup: AgeGroup;
  images: string[]; // URL'ler veya base64
  donorId: string;
  donorName: string;
  donorCity: string;
  status: ProductStatus;
  recipientId?: string;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  shippingAddress?: ShippingAddress;
  trackingNumber?: string;
  isUrgent: boolean;
  notes?: string;
}

export enum ProductCategory {
  TOYS = 'Oyuncak',
  CLOTHING = 'Giyim',
  BOOKS = 'Kitap',
  SHOES = 'Ayakkabı',
  SCHOOL = 'Okul Malzemesi',
  FURNITURE = 'Mobilya',
  ELECTRONICS = 'Elektronik',
  OTHER = 'Diğer'
}

export enum ProductCondition {
  NEW = 'Yeni & Etiketli',
  LIKE_NEW = 'Az Kullanılmış',
  GOOD = 'İyi Durumda',
  FAIR = 'Kullanılabilir',
  NEEDS_REPAIR = 'Tamir Gerekli'
}

export enum AgeGroup {
  BABY = '0-2 Yaş',
  TODDLER = '2-4 Yaş',
  PRESCHOOL = '4-6 Yaş',
  SCHOOL_AGE = '6-12 Yaş',
  TEEN = '12+ Yaş',
  ALL_AGES = 'Tüm Yaşlar'
}

export enum ProductStatus {
  PENDING = 'Onay Bekliyor',
  APPROVED = 'Yayında',
  RESERVED = 'Rezerve Edildi',
  SHIPPED = 'Kargoda',
  DELIVERED = 'Teslim Edildi',
  REJECTED = 'Reddedildi'
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  email: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: ProductCategory;
  condition: ProductCondition;
  ageGroup: AgeGroup;
  images: File[];
  isUrgent: boolean;
  notes?: string;
}