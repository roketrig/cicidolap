// src/app/pages/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  type: 'donor' | 'recipient';
  isVerified: boolean;
  joinDate: Date;
}

interface UserStats {
  totalDonations: number;
  totalReceived: number;
  memberSince: number;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  birthDate: string;
  bio: string;
}

interface Address {
  id: string;
  title: string;
  fullName: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  isDefault: boolean;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailAlerts: boolean;
}

interface Session {
  id: string;
  device: string;
  deviceIcon: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface NotificationPreferences {
  newMessages: boolean;
  donationStatus: boolean;
  platformAnnouncements: boolean;
  weeklyReport: boolean;
}

interface PrivacySettings {
  profileVisible: boolean;
  donationHistoryPublic: boolean;
  searchEngineIndex: boolean;
  dataRetention: string;
}

interface CommunicationSettings {
  preferredMethod: 'platform' | 'phone' | 'email';
  allowMarketing: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class Profile implements OnInit {
  // User Data
  user: User = {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@email.com',
    phone: '0555 123 45 67',
    city: 'İstanbul',
    type: 'donor',
    isVerified: true,
    joinDate: new Date('2023-06-15')
  };

  stats: UserStats = {
    totalDonations: 24,
    totalReceived: 3,
    memberSince: 0
  };

  // Form Data
  personalInfo: PersonalInfo = {
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet@email.com',
    phone: '0555 123 45 67',
    city: 'İstanbul',
    birthDate: '1985-03-15',
    bio: '2 yıldır platformda aktif bağışçıyım. Çocukların ihtiyaç duyduğu ürünleri bağışlamaktan mutluluk duyuyorum.'
  };

  addresses: Address[] = [
    {
      id: '1',
      title: 'Ev Adresim',
      fullName: 'Ahmet Yılmaz',
      address: 'Örnek Mah. Demo Cad. No: 123 D: 4',
      city: 'İstanbul',
      district: 'Kadıköy',
      phone: '0555 123 45 67',
      isDefault: true
    },
    {
      id: '2',
      title: 'İş Adresim',
      fullName: 'Ahmet Yılmaz',
      address: 'İş Merkezi Cd. No: 45 Kat: 8',
      city: 'İstanbul',
      district: 'Beşiktaş',
      phone: '0212 345 67 89',
      isDefault: false
    }
  ];

  passwordData: PasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  securitySettings: SecuritySettings = {
    twoFactorEnabled: false,
    emailAlerts: true
  };

  activeSessions: Session[] = [
    {
      id: '1',
      device: 'iPhone 13',
      deviceIcon: '📱',
      browser: 'Safari',
      location: 'İstanbul, TR',
      lastActive: 'Şu anda',
      isCurrent: true
    },
    {
      id: '2',
      device: 'MacBook Pro',
      deviceIcon: '💻',
      browser: 'Chrome',
      location: 'İstanbul, TR',
      lastActive: '2 saat önce',
      isCurrent: false
    },
    {
      id: '3',
      device: 'Windows PC',
      deviceIcon: '🖥️',
      browser: 'Firefox',
      location: 'Ankara, TR',
      lastActive: '3 gün önce',
      isCurrent: false
    }
  ];

  preferences: NotificationPreferences = {
    newMessages: true,
    donationStatus: true,
    platformAnnouncements: false,
    weeklyReport: true
  };

  privacySettings: PrivacySettings = {
    profileVisible: true,
    donationHistoryPublic: true,
    searchEngineIndex: false,
    dataRetention: '90'
  };

  communicationSettings: CommunicationSettings = {
    preferredMethod: 'platform',
    allowMarketing: true
  };

  // UI State
  activeTab: 'personal' | 'address' | 'security' | 'preferences' = 'personal';
  isLoading = false;
  isSaving = false;
  isSavingAddress = false;
  isChangingPassword = false;

  // Address Form
  showAddressForm = false;
  editingAddress: Address | null = null;
  addressFormData: Partial<Address> = {};

  // Password Visibility
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Cities for dropdown
  cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana',
    'Konya', 'Gaziantep', 'Şanlıurfa', 'Mersin', 'Kayseri', 'Eskişehir'
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.calculateStats();
  }

  calculateStats() {
    const joinDate = new Date(this.user.joinDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.stats.memberSince = diffDays;
  }

  getUserInitials(): string {
    const names = this.user.name.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return this.user.name.charAt(0).toUpperCase();
  }

  // Tab Management
  setActiveTab(tab: 'personal' | 'address' | 'security' | 'preferences') {
    this.activeTab = tab;
  }

  // Personal Info Actions
  updatePersonalInfo() {
    this.isSaving = true;

    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;

      // Update user info
      this.user.name = `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
      this.user.email = this.personalInfo.email;
      this.user.phone = this.personalInfo.phone;
      this.user.city = this.personalInfo.city;

      alert('✅ Kişisel bilgileriniz başarıyla güncellendi!');
    }, 1500);
  }

  cancelPersonalInfo() {
    // Reset form to original values
    this.personalInfo = {
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet@email.com',
      phone: '0555 123 45 67',
      city: 'İstanbul',
      birthDate: '1985-03-15',
      bio: '2 yıldır platformda aktif bağışçıyım. Çocukların ihtiyaç duyduğu ürünleri bağışlamaktan mutluluk duyuyorum.'
    };
  }

  // Address Actions
  addNewAddress() {
    this.editingAddress = null;
    this.addressFormData = {
      title: '',
      fullName: this.user.name,
      address: '',
      city: this.user.city || '',
      district: '',
      phone: this.user.phone || '',
      isDefault: this.addresses.length === 0
    };
    this.showAddressForm = true;
  }

  editAddress(address: Address) {
    this.editingAddress = address;
    this.addressFormData = { ...address };
    this.showAddressForm = true;
  }

  saveAddress() {
    this.isSavingAddress = true;

    // Simulate API call
    setTimeout(() => {
      this.isSavingAddress = false;

      if (this.editingAddress) {
        // Update existing address
        const index = this.addresses.findIndex(a => a.id === this.editingAddress!.id);
        if (index !== -1) {
          this.addresses[index] = { ...this.addresses[index], ...this.addressFormData } as Address;
        }
      } else {
        // Add new address
        const newAddress: Address = {
          id: Date.now().toString(),
          title: this.addressFormData.title || '',
          fullName: this.addressFormData.fullName || '',
          address: this.addressFormData.address || '',
          city: this.addressFormData.city || '',
          district: this.addressFormData.district || '',
          phone: this.addressFormData.phone || '',
          isDefault: this.addressFormData.isDefault || false
        };
        this.addresses.push(newAddress);
      }

      // If this address is default, unset others
      if (this.addressFormData.isDefault) {
        this.addresses.forEach(addr => {
          if (addr.id !== this.addressFormData.id) {
            addr.isDefault = false;
          }
        });
      }

      this.closeAddressForm();
      alert('✅ Adres başarıyla kaydedildi!');
    }, 1000);
  }

  deleteAddress(address: Address) {
    if (confirm(`${address.title} adresini silmek istediğinize emin misiniz?`)) {
      this.addresses = this.addresses.filter(a => a.id !== address.id);

      // If we deleted the default address, set another one as default
      if (address.isDefault && this.addresses.length > 0) {
        this.addresses[0].isDefault = true;
      }

      alert('🗑️ Adres silindi.');
    }
  }

  setDefaultAddress(address: Address) {
    this.addresses.forEach(addr => {
      addr.isDefault = addr.id === address.id;
    });
    alert('⭐ Varsayılan adres güncellendi.');
  }

  closeAddressForm() {
    this.showAddressForm = false;
    this.editingAddress = null;
    this.addressFormData = {};
  }

  // Security Actions
  changePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('❌ Yeni şifreler eşleşmiyor!');
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      alert('❌ Şifre en az 6 karakter olmalıdır!');
      return;
    }

    this.isChangingPassword = true;

    // Simulate API call
    setTimeout(() => {
      this.isChangingPassword = false;
      this.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      alert('✅ Şifreniz başarıyla değiştirildi!');
    }, 1500);
  }

  togglePassword(field: 'current' | 'new' | 'confirm') {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  saveSecuritySettings() {
    // In real app, save to backend
    localStorage.setItem('security-settings', JSON.stringify(this.securitySettings));
    alert('🔐 Güvenlik ayarları kaydedildi.');
  }

  endSession(session: Session) {
    if (session.isCurrent) {
      alert('Mevcut oturumunuzu sonlandıramazsınız.');
      return;
    }

    if (confirm('Bu oturumu sonlandırmak istediğinize emin misiniz?')) {
      this.activeSessions = this.activeSessions.filter(s => s.id !== session.id);
      alert('Oturum sonlandırıldı.');
    }
  }

  endAllSessions() {
    if (confirm('Tüm oturumlarınızı sonlandırmak istediğinize emin misiniz?\n\nMevcut oturumunuz da dahil tüm cihazlardan çıkış yapacaksınız.')) {
      // Keep only current session (it will be logged out)
      this.activeSessions = this.activeSessions.filter(s => s.isCurrent);
      alert('Tüm oturumlar sonlandırıldı. Yönlendiriliyorsunuz...');

      // In real app, redirect to login
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }
  }

  // Preferences Actions
  saveAllPreferences() {
    // Save all preferences to localStorage
    localStorage.setItem('notification-preferences', JSON.stringify(this.preferences));
    localStorage.setItem('privacy-settings', JSON.stringify(this.privacySettings));
    localStorage.setItem('communication-settings', JSON.stringify(this.communicationSettings));

    alert('⚙️ Tüm tercihleriniz kaydedildi!');
  }

  resetPreferences() {
    if (confirm('Tüm tercihlerinizi varsayılana döndürmek istediğinize emin misiniz?')) {
      this.preferences = {
        newMessages: true,
        donationStatus: true,
        platformAnnouncements: false,
        weeklyReport: true
      };

      this.privacySettings = {
        profileVisible: true,
        donationHistoryPublic: true,
        searchEngineIndex: false,
        dataRetention: '90'
      };

      this.communicationSettings = {
        preferredMethod: 'platform',
        allowMarketing: true
      };

      alert('Tercihler varsayılana döndürüldü.');
    }
  }

  exportData() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('📥 Verileriniz indirilmeye hazır. (Demo: Gerçek uygulamada ZIP dosyası indirilir)');
    }, 2000);
  }

  deactivateAccount() {
    if (confirm('Hesabınızı askıya almak istediğinize emin misiniz?\n\n• Profiliniz gizlenecek\n• Yeni bağış yapamayacaksınız\n• 30 gün sonra otomatik silinecek\n• İstediğiniz zaman geri açabilirsiniz')) {
      alert('⏸️ Hesabınız askıya alındı. Çıkış yapılıyor...');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    }
  }

  deleteAccount() {
    if (confirm('HESABINIZI SİLMEK ÜZERESİNİZ!\n\nBu işlem GERİ ALINAMAZ.\n\n• Tüm bağış geçmişiniz silinecek\n• Tüm kişisel verileriniz silinecek\n• Tüm adres bilgileriniz silinecek\n\nDevam etmek istiyor musunuz?')) {
      const confirmation = prompt('Lütfen "SİL" yazarak onaylayın:');
      if (confirmation === 'SİL') {
        alert('🗑️ Hesabınız silindi. Yönlendiriliyorsunuz...');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      }
    }
  }

  // Avatar
  changeAvatar() {
    alert('📷 Avatar değiştirme özelliği yakında eklenecek!');
  }
}