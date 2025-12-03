// src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router,
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    console.log('🔒 Admin Guard çalışıyor...');
    
    // Debug için auth state'i göster
    this.auth.debugAuthState();
    
    const isAuthenticated = this.auth.isAuthenticated();
    const isAdmin = this.auth.isAdmin();
    const user = this.auth.getCurrentUser();
    
    console.log('Admin Guard Kontrol:', {
      isAuthenticated,
      isAdmin,
      userEmail: user?.email,
      userRole: user?.role
    });
    
    if (isAuthenticated && isAdmin) {
      console.log('✅ Admin erişimi onaylandı');
      return true;
    }
    
    console.log('❌ Admin erişimi reddedildi');
    
    // Kullanıcıya feedback ver
    if (!isAuthenticated) {
      alert('⛔ Önce giriş yapmalısınız!');
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
    } else {
      alert('⛔ Bu sayfaya erişim yetkiniz yok. Sadece yöneticiler erişebilir.');
      this.router.navigate(['/dashboard']);
    }
    
    return false;
  }
}