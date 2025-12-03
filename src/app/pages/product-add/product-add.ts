// src/app/pages/product-add/product-add.component.ts
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product'; // .service EKLE
import { ProductFormData, ProductCategory, ProductCondition, AgeGroup } from '../../models/product'; // .model EKLE

interface ImageFile {
  file: File;
  preview: string;
}

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-add.html', // .component.html
  styleUrls: ['./product-add.scss'] // .component.scss
})
export class ProductAdd { // ProductAddComponent olarak değiştir
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  productData: ProductFormData = {
    name: '',
    description: '',
    category: ProductCategory.TOYS,
    condition: ProductCondition.GOOD,
    ageGroup: AgeGroup.ALL_AGES,
    images: [],
    isUrgent: false,
    notes: ''
  };

  selectedImages: ImageFile[] = [];
  acceptTerms = false;
  isSubmitting = false;

  // Data from service
  categories: any[] = [];
  conditions: any[] = [];
  ageGroups: any[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    this.categories = this.productService.categories;
    this.conditions = this.productService.conditions;
    this.ageGroups = this.productService.ageGroups;
  }

  // Trigger file input click
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  // Handle file selection
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    
    // Check total images limit (max 5)
    if (this.selectedImages.length + files.length > 5) {
      alert('En fazla 5 fotoğraf yükleyebilirsiniz!');
      return;
    }

    // Process each file
    files.forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} bir resim dosyası değil!`);
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} dosyası çok büyük! Maksimum 5MB.`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.selectedImages.push({
            file: file,
            preview: e.target.result as string
          });
          this.productData.images.push(file);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    input.value = '';
  }

  // Remove selected image
  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.productData.images.splice(index, 1);
  }

  // Form submission
  onSubmit() {
    // Form validation
    if (!this.acceptTerms) {
      alert('Lütfen bağış koşullarını kabul edin!');
      return;
    }

    if (this.productData.name.length < 3) {
      alert('Ürün adı en az 3 karakter olmalıdır!');
      return;
    }

    if (this.productData.description.length < 20) {
      alert('Lütfen daha detaylı bir açıklama yazın (en az 20 karakter)!');
      return;
    }

    this.isSubmitting = true;

    // Simulate API call
    this.productService.addProduct(this.productData).subscribe({
      next: (newProduct) => {
        this.isSubmitting = false;
        
        // Show success message
        alert(`✅ ${newProduct.name} başarıyla bağışlandı!\n\nÜrününüz incelendikten sonra yayınlanacaktır. Onay süreci 1-3 iş günü sürebilir.`);
        
        // Reset form
        this.resetForm();
        
        // Navigate to products list
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Ürün eklenirken hata:', error);
        alert('❌ Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    });
  }

  // Reset form
  resetForm() {
    this.productData = {
      name: '',
      description: '',
      category: ProductCategory.TOYS,
      condition: ProductCondition.GOOD,
      ageGroup: AgeGroup.ALL_AGES,
      images: [],
      isUrgent: false,
      notes: ''
    };
    this.selectedImages = [];
    this.acceptTerms = false;
  }

  // Get character count for textareas
  getCharCount(text: string | undefined): number {
    return text ? text.length : 0;
  }
}